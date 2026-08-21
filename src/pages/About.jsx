import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { fetchTimeline, assetUrl } from "../api";
import Spinner from "../components/Spinner.jsx";
import BreadcrumbJsonLd from "../components/BreadcrumbJsonLd.jsx";

function About() {
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTimeline()
            .then((t) => { setTimeline(t); setLoading(false); })
            .catch((e) => { setError(e.message); setLoading(false); });
    }, []);

    if (loading) return <Spinner />;
    if (error) return <section className="py-16 max-w-screen-xl mx-auto px-4"><p className="text-red-sun text-lg text-center">Chyba načítání: {error}</p></section>;

    return (
        <>
            <Helmet>
                <title>Suniket | O kapele</title>
                <meta name="description" content="Historie kapely Suniket – česká hardrocková pětice z Týnce nad Sázavou, založená v roce 2024. Příběh, jak vznikla a kam směřuje." />
                <meta property="og:title" content="Suniket | O kapele" />
                <meta property="og:description" content="Historie a příběh české hardrockové kapely Suniket z Týnce nad Sázavou." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://suniket.cz/o-nas" />
                <meta property="og:image" content="https://suniket.cz/img/og-image.jpg" />
                <meta property="og:locale" content="cs_CZ" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Suniket | O kapele" />
                <meta name="twitter:description" content="Historie a příběh české hardrockové kapely Suniket z Týnce nad Sázavou." />
                <meta name="twitter:image" content="https://suniket.cz/img/og-image.jpg" />
                <link rel="canonical" href="https://suniket.cz/o-nas" />
            </Helmet>
            <BreadcrumbJsonLd items={[{ name: "Domů", path: "/" }, { name: "O nás", path: "/o-nas" }]} />
            <section className="relative py-16 max-w-[1152px] mx-auto px-5">
                <h2 className="text-4xl font-bold text-center text-red-sun mb-16 relative z-10">Historie kapely</h2>

                <div className="relative px-4">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 bg-red-dark-sun rounded z-0 h-full"></div>

                    {timeline.length === 0 ? (
                        <p className="text-white/60 text-lg text-center">Žádné události</p>
                    ) : (
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
                                            src={assetUrl(item.img)}
                                            alt={item.alt}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default About;
