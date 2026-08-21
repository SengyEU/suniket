function Spinner({ text = "Načítám..." }) {
    return (
        <section className="py-16 max-w-screen-xl mx-auto px-4 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-[3px] border-white/10 border-t-red-sun rounded-full animate-spin" />
            <p className="text-white/50 text-lg">{text}</p>
        </section>
    );
}

export default Spinner;