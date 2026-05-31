import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { fetchVideos } from "../api";

function Videos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVideos().then((data) => { setVideos(data); setLoading(false); });
    }, []);

    if (loading) return null;

    return (
        <>
            <Helmet>
                <title>Suniket | Videogalerie</title>
                <meta name="description" content="Videogalerie kapely Suniket – hudební klipy a živá vystoupení." />
                <meta property="og:title" content="Suniket | Videogalerie" />
                <meta property="og:description" content="Videogalerie kapely Suniket – hudební klipy a živá vystoupení." />
                <meta property="og:url" content="https://suniket.cz/galerie/video" />
                <meta name="twitter:title" content="Suniket | Videogalerie" />
                <meta name="twitter:description" content="Videogalerie kapely Suniket – hudební klipy a živá vystoupení." />
                <link rel="canonical" href="https://suniket.cz/galerie/video" />
            </Helmet>
            <section className="py-16 max-w-screen-xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-red-sun mb-12">Videogalerie</h2>

            {videos.length === 0 ? (
                <p className="text-white/60 text-lg text-center">Žádná videa</p>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {videos.map((video, i) => (
                    <div key={i} className="w-full h-80 aspect-video rounded-lg overflow-hidden shadow-lg">
                        <iframe
                            src={`https://www.youtube.com/embed/${video}`}
                            title={`YouTube video ${i + 1}`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                ))}
            </div>
            )}
            </section>
        </>
    );
}

export default Videos;
