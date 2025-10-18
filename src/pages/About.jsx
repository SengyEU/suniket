import timeline from "../data/about.json";

function About() {
    return (
        <section className="relative py-16 max-w-[1152px] mx-auto px-5">
            <h2 className="text-4xl font-bold text-center text-red-sun mb-16 relative z-10">Historie kapely</h2>

            <div className="relative px-4">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 bg-red-dark-sun rounded z-0 h-full"></div>

                <div className="flex flex-col gap-20">
                    {timeline.map((item, index) => {
                        const isReverse = index % 2 !== 0;

                        return (
                            <div
                                key={item.year}
                                className={`flex flex-col md:flex-row items-center gap-10 ${
                                    isReverse ? "md:flex-row-reverse" : ""
                                } z-10`}
                            >
                                <div className="flex-1 bg-white/5 p-5 rounded-2xl backdrop-blur-sm border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.4)] text-left">
                                    <h3 className="text-2xl font-semibold mb-3 text-red-sun">{item.year}</h3>
                                    <p className="text-lg leading-relaxed">{item.text}</p>
                                </div>

                                <div className="flex-1 bg-white/5 p-5 rounded-2xl backdrop-blur-sm border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.4)] w-full max-w-[800px] aspect-[2/1] flex justify-center items-center overflow-hidden">
                                    <img
                                        src={item.img}
                                        alt={item.alt}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default About;
