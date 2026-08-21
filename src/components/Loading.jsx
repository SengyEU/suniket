function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-8">
            <img src="/img/text.webp" alt="Suniket" width="256" height="40" className="animate-[pulseScale_1.5s_ease-in-out_infinite_alternate] w-64" />
            <div className="w-10 h-10 border-[3px] border-white/10 border-t-red-sun rounded-full animate-spin" />
        </div>
    );
}

export default Loading;