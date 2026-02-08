"use client";



import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";

import { Point, Area } from "react-easy-crop";


import MediaPicker from "./MediaPicker";

interface ImageUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
    const [urlInput, setUrlInput] = useState("");
    const [isPickerOpen, setIsPickerOpen] = useState(false);



    // Cropper State

    const [cropImage, setCropImage] = useState<string | null>(null);

    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });

    const [zoom, setZoom] = useState(1);

    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const [uploading, setUploading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);



    const addUrl = () => {

        if (urlInput) {

            onChange([...images, urlInput]);

            setUrlInput("");

        }

    };



    const removeImage = (index: number) => {

        onChange(images.filter((_, i) => i !== index));

    };



    const moveImage = (index: number, direction: 'left' | 'right') => {

        const newImages = [...images];

        if (direction === 'left' && index > 0) {

            [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];

        } else if (direction === 'right' && index < newImages.length - 1) {

            [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];

        }

        onChange(newImages);

    };



    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.files && e.target.files.length > 0) {

            const file = e.target.files[0];

            const imageDataUrl = await readFile(file);

            setCropImage(imageDataUrl);

        }

    };



    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {

        setCroppedAreaPixels(croppedAreaPixels);

    }, []);



    const handleUploadCrop = async () => {

        if (!cropImage || !croppedAreaPixels) return;

        setUploading(true);



        try {

            const croppedImageBase64 = await getCroppedImg(cropImage, croppedAreaPixels);



            // Upload to API

            const res = await fetch("/api/admin/upload-image", {

                method: "POST",

                headers: { "Content-Type": "application/json" },

                body: JSON.stringify({ image: croppedImageBase64 }),

            });



            const data = await res.json();

            if (res.ok) {

                onChange([...images, data.url]);

                setCropImage(null); // Close cropper

                setZoom(1);

                setCrop({ x: 0, y: 0 });

            } else {

                alert("Upload failed: " + data.error);

            }

        } catch (e) {

            console.error(e);

            alert("Error uploading image");

        } finally {

            setUploading(false);

        }

    };



    return (

        <div className="bg-zinc-900 border border-white/10 p-6 rounded relative">

            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-6 flex justify-between">

                <span>Product Images</span>

                <span className="text-[10px] text-gray-600">Drag/Upload • 1st = Main • 2nd = Hover</span>

            </h3>



            {/* Existing Images */}

            {images.length === 0 ? (

                <div className="border-2 border-dashed border-white/10 rounded-lg p-12 text-center text-gray-600 mb-6">

                    No images uploaded. Add at least one.

                </div>

            ) : (

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">

                    {images.map((img, idx) => (

                        <div key={idx} className="relative group">

                            {/* Badges */}

                            <div className="absolute top-0 left-0 right-0 z-10 flex justify-between p-2 pointer-events-none">

                                {idx === 0 && (

                                    <span className="bg-[#D4AF37] text-black text-[10px] font-bold px-2 py-0.5 rounded shadow">MAIN</span>

                                )}

                                {idx === 1 && (

                                    <span className="bg-zinc-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow border border-white/20">HOVER</span>

                                )}

                            </div>



                            <div className="aspect-square bg-black/50 rounded overflow-hidden border border-white/10 group-hover:border-[#D4AF37] transition-all relative">

                                <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />



                                {/* Hover Overlay */}

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">

                                    <button

                                        type="button"

                                        onClick={() => removeImage(idx)}

                                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-500 uppercase tracking-wider font-bold"

                                    >

                                        Delete

                                    </button>

                                    <div className="flex gap-2">

                                        {idx > 0 && (

                                            <button onClick={() => moveImage(idx, 'left')} className="p-1 bg-white/10 rounded hover:bg-white/20" title="Move Left">←</button>

                                        )}

                                        {idx < images.length - 1 && (

                                            <button onClick={() => moveImage(idx, 'right')} className="p-1 bg-white/10 rounded hover:bg-white/20" title="Move Right">→</button>

                                        )}

                                    </div>

                                </div>

                            </div>

                            <div className="mt-2 text-center text-[10px] text-gray-500 font-mono">

                                {idx === 0 ? "Default View" : idx === 1 ? "Hover View" : `Image ${idx + 1}`}

                            </div>

                        </div>

                    ))}

                </div>

            )}



            {/* Controls */}

            <div className="flex gap-4 items-center p-4 bg-black/30 rounded border border-white/5">

                <label className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-xs rounded hover:bg-[#F4CF57] cursor-pointer transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"></path><path d="M120,120v64a8,8,0,0,0,16,0V120a8,8,0,0,0-16,0Z"></path><path d="M88,152h80a8,8,0,0,0,0-16H88a8,8,0,0,0,0,16Z"></path></svg>
                    Upload Image
                    <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                </label>

                <button
                    type="button"
                    onClick={() => setIsPickerOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-zinc-800 text-white font-bold uppercase tracking-wider text-xs rounded hover:bg-zinc-700 transition-all border border-white/5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-88a8,8,0,0,1-8,8H136v24a8,8,0,0,1-16,0V136H96a8,8,0,0,1,0-16h24V96a8,8,0,0,1,16,0v24h24A8,8,0,0,1,168,128Z"></path></svg>
                    Library
                </button>

                <div className="h-8 w-px bg-white/10"></div>

                <div className="flex-1 flex gap-2">

                    <input

                        type="text"

                        placeholder="Or paste image URL..."

                        value={urlInput}

                        onChange={(e) => setUrlInput(e.target.value)}

                        className="flex-1 bg-transparent border-none text-white text-sm focus:ring-0 placeholder-gray-600"

                    />

                    <button

                        type="button"

                        onClick={addUrl}

                        disabled={!urlInput}

                        className="text-xs uppercase font-bold text-gray-500 hover:text-white disabled:opacity-50"

                    >

                        Add

                    </button>

                </div>

            </div>



            {/* Cropper Modal Full Screen Overlay - Using Portal to escape parent transforms */}
            {isMounted && cropImage && createPortal(
                <div className="fixed inset-0 z-[99999] bg-black flex flex-col animate-in fade-in duration-300">
                    {/* Header */}
                    <div className="h-20 flex items-center justify-between px-8 border-b border-white/10 bg-black/90 backdrop-blur-xl shrink-0 relative z-10">
                        <div className="flex items-center gap-4">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_15px_#D4AF37]"></span>
                            <div>
                                <h2 className="text-xl font-display uppercase tracking-[0.2em] text-white">Crop & Adjust</h2>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Final image will be square (1:1)</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setCropImage(null)}
                            className="p-3 text-gray-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full border border-white/10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                        </button>
                    </div>

                    {/* Main Workspace - Maximized Space */}
                    <div className="flex-1 bg-zinc-950 relative w-full overflow-hidden">
                        <div className="absolute inset-4 md:inset-10">
                            <Cropper
                                image={cropImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                objectFit="contain"
                                showGrid={true}
                                classes={{
                                    containerClassName: "w-full h-full rounded-lg border border-white/5 overflow-hidden",
                                    mediaClassName: "",
                                }}
                            />
                        </div>

                        {/* Drag Info Overlay */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-2.5 rounded-full text-[10px] text-gray-300 font-mono pointer-events-none border border-white/10 z-20 flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse"></span>
                            DRAG TO MOVE • PINCH TO ZOOM
                        </div>
                    </div>

                    {/* Controls Footer - More Compact */}
                    <div className="bg-zinc-900 border-t border-white/10 px-8 py-8 shrink-0 relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
                        <div className="max-w-3xl mx-auto w-full flex flex-col gap-8">
                            {/* Zoom Section */}
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-3 min-w-[100px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D4AF37" viewBox="0 0 256 256"><path d="M165.66,154.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,11.32-11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>
                                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500">Zoom</span>
                                </div>
                                <div className="flex-1 relative flex items-center">
                                    <input
                                        type="range"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.01}
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#D4AF37] hover:h-1.5 transition-all"
                                    />
                                </div>
                                <span className="text-sm font-mono text-[#D4AF37] w-16 text-right font-bold">{Math.round(zoom * 100)}%</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setCropImage(null)}
                                    disabled={uploading}
                                    className="px-10 py-4 text-white border border-white/10 rounded-sm uppercase hover:bg-white/5 hover:border-white/30 tracking-[0.2em] text-xs font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUploadCrop}
                                    disabled={uploading}
                                    className="flex-1 py-4 bg-[#D4AF37] text-black rounded-sm uppercase hover:bg-[#F4CF57] tracking-[0.2em] text-xs font-[900] transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] flex items-center justify-center gap-3 group"
                                >
                                    {uploading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            SAVE PRODUCT IMAGE
                                            <svg className="group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L204.69,128,138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path></svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <MediaPicker
                isOpen={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                onSelect={(url) => {
                    onChange([...images, url]);
                    setIsPickerOpen(false);
                }}
            />
        </div>

    );

}



// Helpers

function readFile(file: File): Promise<string> {

    return new Promise((resolve) => {

        const reader = new FileReader();

        reader.addEventListener("load", () => resolve(reader.result as string));

        reader.readAsDataURL(file);

    });

}



function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string> {

    return new Promise((resolve, reject) => {

        const image = new Image();

        image.src = imageSrc;

        image.crossOrigin = "anonymous"; // Fix CORs

        image.onload = () => {

            const canvas = document.createElement("canvas");

            const ctx = canvas.getContext("2d");

            if (!ctx) return reject("No 2d context");



            canvas.width = pixelCrop.width;

            canvas.height = pixelCrop.height;



            ctx.drawImage(

                image,

                pixelCrop.x,

                pixelCrop.y,

                pixelCrop.width,

                pixelCrop.height,

                0,

                0,

                pixelCrop.width,

                pixelCrop.height

            );



            resolve(canvas.toDataURL("image/webp", 0.9));

        };

        image.onerror = reject;

    });

}