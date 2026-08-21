import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { fetchDiscography, assetUrl } from "../api";
import Spinner from "../components/Spinner.jsx";
import BreadcrumbJsonLd from "../components/BreadcrumbJsonLd.jsx";

export default function Discography() {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSong, setOpenSong] = useState(null);

    useEffect(() => {
        fetchDiscography()
            .then((data) => { setAlbums(data.albums); setLoading(false); })
            .catch((e) => { setError(e.message); setLoading(false); });
    }, []);

    if (loading) return <Spinner />;
    if (error) return <section className="py-16 max-w-screen-xl mx-auto px-4"><p className="text-red-sun text-lg text-center">Chyba načítání: {error}</p></section>;

    const toggleLyrics = (albumIndex, songIndex) => {
        const key = `${albumIndex}-${songIndex}`;
        setOpenSong(openSong === key ? null : key);
    };

    return (
        <>
            <Helmet>
                <title>Suniket | Diskografie</title>
                <meta name="description" content="Diskografie kapely Suniket – alba, singly, seznam písní s texty. Česká hardrocková kapela, kompletní přehled vydané hudby." />
                <meta property="og:title" content="Suniket | Diskografie" />
                <meta property="og:description" content="Diskografie kapely Suniket – alba, seznam písní a texty všech skladeb." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://suniket.cz/diskografie" />
                <meta property="og:image" content="https://suniket.cz/img/og-image.jpg" />
                <meta property="og:locale" content="cs_CZ" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Suniket | Diskografie" />
                <meta name="twitter:description" content="Diskografie kapely Suniket – alba, seznam písní a texty všech skladeb." />
                <meta name="twitter:image" content="https://suniket.cz/img/og-image.jpg" />
                <link rel="canonical" href="https://suniket.cz/diskografie" />
            </Helmet>
            <BreadcrumbJsonLd items={[{ name: "Domů", path: "/" }, { name: "Diskografie", path: "/diskografie" }]} />
            <section className="relative py-16 max-w-[1152px] mx-auto px-5 text-center">
            <h2 className="text-4xl font-bold text-red-sun mb-16 relative z-10">Diskografie</h2>

            {albums.length === 0 ? (
                <p className="text-white/60 text-lg">Žádná alba</p>
            ) : (
            <div className="flex flex-col gap-20">
                {albums.map((album, albumIndex) => (
                    <div
                        key={album.title}
                        className="grid lg:grid-cols-2 gap-10 items-start bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.4)] text-left"
                    >
                        {/* LEVÁ STRANA — album info */}
                        <div className="flex flex-col items-center lg:items-start gap-6">
                            <div className="w-full max-w-[400px] rounded-2xl">
                                <img
                                    src={assetUrl(album.cover)}
                                    alt={album.title}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 hover:rotate-45"
                                />
                            </div>

                            <div className="w-full">
                                <h3 className="text-3xl font-semibold text-red-sun mb-3">{album.title}</h3>
                                <p className="text-white/80 text-base sm:text-lg leading-relaxed">
                                    {album.description}
                                    {album.link && (
                                        <>
                                            <br />
                                            <span>
                                                K poslechu na{" "}
                                                <a
                                                    href={album.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-red-sun underline hover:text-red-dark-sun break-normal"
                                                >
                                                    {album.link_text || "Odkaz"}<span className="whitespace-nowrap">{'\u00A0'}<FontAwesomeIcon icon={faExternalLink} style={{"--fa-display":"inline"}} /></span>
                                                </a>
                                            </span>
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* PRAVÁ STRANA — seznam písní */}
                        <div className="flex flex-col gap-4">
                            <h4 className="text-2xl font-semibold text-red-sun mb-2">Seznam skladeb</h4>
                            <ul className="flex flex-col gap-3">
                                {album.songs.map((song, songIndex) => {
                                    const key = `${albumIndex}-${songIndex}`;
                                    const isOpen = openSong === key;

                                    return (
                                        <li
                                            key={song.title}
                                            className="bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden"
                                        >
                                            <button
                                                onClick={() => toggleLyrics(albumIndex, songIndex)}
                                                className="w-full flex justify-between items-center cursor-pointer p-4 text-left font-medium text-base sm:text-lg text-white-sun"
                                            >
                                                <span>{song.title}</span>
                                                <span
                                                    className={`text-red-sun text-lg transition-transform duration-300 ${
                                                        isOpen ? "rotate-45" : ""
                                                    }`}
                                                >
                                                    +
                                                </span>
                                            </button>

                                            <div
                                                className={`grid transition-all duration-300 ${
                                                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                                }`}
                                            >
                                                <div className="overflow-hidden px-4 pb-4 text-sm sm:text-base leading-relaxed text-white/90 whitespace-pre-wrap">
                                                    {Array.isArray(song.lyrics) ? song.lyrics.join("\n") : song.lyrics}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </section>
        </>
    );
}
