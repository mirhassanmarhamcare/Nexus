export default function GrainOverlay() {
    return (
        <div className="grain-overlay pointer-events-none fixed inset-0 z-[50] opacity-[0.05] mix-blend-overlay w-full h-full overflow-hidden">
            <div className="grain-texture w-[200%] h-[200%] absolute top-[-50%] left-[-50%]"></div>
        </div>
    );
}
