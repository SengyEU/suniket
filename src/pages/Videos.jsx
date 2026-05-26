import { useState, useEffect } from "react";
import { fetchVideos } from "../api";

function Videos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVideos().then((data) => { setVideos(data); setLoading(false); });
    }, []);

    if (loading) return null;

    return (
        <section className="py-16 max-w-screen-xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-red-sun mb-12">Videogalerie</h2>

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
        </section>
    );
}

export default Videos;
