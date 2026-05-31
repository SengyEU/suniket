import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { fetchNews, assetUrl } from "../api";

export default function News() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNews().then((data) => { setArticles(data.articles); setLoading(false); });
    }, []);

    if (loading) return null;

    return (
        <>
            <Helmet>
                <title>Suniket | Novinky</title>
                <meta name="description" content="Novinky a aktuality z dění kolem české hardrockové kapely Suniket." />
                <meta property="og:title" content="Suniket | Novinky" />
                <meta property="og:description" content="Novinky a aktuality z dění kolem české hardrockové kapely Suniket." />
                <meta property="og:url" content="https://suniket.cz/novinky" />
                <meta name="twitter:title" content="Suniket | Novinky" />
                <meta name="twitter:description" content="Novinky a aktuality z dění kolem české hardrockové kapely Suniket." />
                <link rel="canonical" href="https://suniket.cz/novinky" />
            </Helmet>
            <section className="relative py-16 max-w-[800px] mx-auto px-5 text-center">
            <h2 className="text-4xl font-bold text-red-sun mb-16 relative z-10">Novinky</h2>

            {articles.length === 0 ? (
                <p className="text-white/60 text-lg">Žádné novinky</p>
            ) : (
            <div className="flex flex-col gap-10">
                {articles.map((item) => (
                    <div
                        id={item.id}
                        key={item.title}
                        className="flex flex-col bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-300 text-left"
                    >
                        {/* Obrázek */}
                        <div className="w-full aspect-[4/3] overflow-hidden">
                            <img
                                    src={assetUrl(item.image)}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500"
                            />
                        </div>

                        {/* Text */}
                        <div className="flex flex-col gap-3 p-6">
                            <p className="text-sm text-white/60">{item.date}</p>
                            <h3 className="text-2xl font-semibold text-red-sun">{item.title}</h3>
                            <p className="text-white/80 text-base leading-relaxed mb-3">{item.description}</p>
                            {item.link && (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-red-sun underline font-medium"
                                >
                                    {item.linkText || "Otevřít odkaz"}
                                    <FontAwesomeIcon icon={faExternalLink} className="ml-1" />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            )}
        </section>
        </>
    );
}
