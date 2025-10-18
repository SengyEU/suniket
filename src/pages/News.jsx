import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import newsData from "../data/news.json";

export default function News() {
    const { articles } = newsData;

    return (
        <section className="relative py-16 max-w-[800px] mx-auto px-5 text-center">
            <h2 className="text-4xl font-bold text-red-sun mb-16 relative z-10">Novinky</h2>

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
                                src={item.image}
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
        </section>
    );
}
