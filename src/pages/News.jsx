import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { fetchNews, assetUrl } from "../api";
import Spinner from "../components/Spinner.jsx";
import BreadcrumbJsonLd from "../components/BreadcrumbJsonLd.jsx";

export default function News() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNews()
            .then((data) => { setArticles(data.articles); setLoading(false); })
            .catch((e) => { setError(e.message); setLoading(false); });
    }, []);

    if (loading) return <Spinner />;
    if (error) return <section className="py-16 max-w-screen-xl mx-auto px-4"><p className="text-red-sun text-lg text-center">Chyba načítání: {error}</p></section>;

    return (
        <>
            <Helmet>
                <title>Suniket | Novinky</title>
                <meta name="description" content="Novinky a aktuality z dění kolem české hardrockové kapely Suniket." />
                <meta property="og:title" content="Suniket | Novinky" />
                <meta property="og:description" content="Novinky a aktuality z dění kolem české hardrockové kapely Suniket." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://suniket.cz/novinky" />
                <meta property="og:image" content="https://suniket.cz/img/og-image.jpg" />
                <meta property="og:locale" content="cs_CZ" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Suniket | Novinky" />
                <meta name="twitter:description" content="Novinky a aktuality z dění kolem české hardrockové kapely Suniket." />
                <meta name="twitter:image" content="https://suniket.cz/img/og-image.jpg" />
                <link rel="canonical" href="https://suniket.cz/novinky" />
            </Helmet>
            <BreadcrumbJsonLd items={[{ name: "Domů", path: "/" }, { name: "Novinky", path: "/novinky" }]} />
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
                                loading="lazy"
                                decoding="async"
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
                                    className="text-red-sun underline font-medium break-normal"
                                >
                                    {item.linkText || "Otevřít odkaz"}<span className="whitespace-nowrap">{'\u00A0'}<FontAwesomeIcon icon={faExternalLink} style={{"--fa-display":"inline"}} /></span>
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
