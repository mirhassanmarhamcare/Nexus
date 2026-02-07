"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";

interface ImageUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
    const [urlInput, setUrlInput] = useState("");

    // Cropper State
    const [cropImage, setCropImage] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [uploading, setUploading] = useState(false);

    const addUrl = () => {
        if (urlInput) {
            onChange([...images, urlInput]);
            setUrlInput("");
        }
    };

    const removeImage = (index: number) => {
        onChange(images.filter((_, i) => i !== index));
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
        <div className="bg-zinc-900 border border-white/10 p-4 rounded">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Product Images</h3>

            {/* Existing Images */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square bg-black/50 rounded overflow-hidden group border border-white/5">
                        <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 bg-red-600 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex gap-2 flex-wrap">
                <input
                    type="text"
                    placeholder="Image URL"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 bg-black border border-white/10 p-2 rounded text-white text-sm font-mono min-w-[200px]"
                />
                <button
                    type="button"
                    onClick={addUrl}
                    className="bg-white text-black px-4 py-2 rounded text-sm font-bold uppercase hover:bg-gray-200"
                >
                    Add URL
                </button>
                <label className="bg-[#D4AF37] text-black px-4 py-2 rounded text-sm font-bold uppercase hover:bg-[#F4CF57] cursor-pointer">
                    Upload & Crop
                    <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                </label>
            </div>

            {/* Cropper Modal */}
            {cropImage && (
                <div className="fixed inset-0 z-50 bg-black/90 flex flex-col p-8">
                    <div className="relative flex-1 bg-zinc-900 border border-white/10 rounded overflow-hidden">
                        <Cropper
                            image={cropImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div className="pt-4 flex justify-between items-center">
                        <div className="w-1/3">
                            <label className="text-xs uppercase text-gray-500">Zoom</label>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setCropImage(null)}
                                disabled={uploading}
                                className="px-6 py-2 text-white border border-white/10 rounded uppercase hover:bg-zinc-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUploadCrop}
                                disabled={uploading}
                                className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded uppercase hover:bg-[#F4CF57]"
                            >
                                {uploading ? "Uploading..." : "Save Image"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject("No 2d context");

            // Set width to desire size or crop size
            // For now use crop size
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

            // As Base64
            // High quality webp
            resolve(canvas.toDataURL("image/webp", 0.9));
        };
        image.onerror = reject;
    });
}
