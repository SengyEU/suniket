import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

import { fetchPhotos, assetUrl } from "../api";

function Photos() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPhotos().then((data) => { setPhotos(data); setLoading(false); });
    }, []);

    if (loading) return <section className="py-16 max-w-screen-xl mx-auto px-4"><p className="text-white/60 text-lg text-center">Načítám fotogalerii...</p></section>;

    return (
        <>
            <Helmet>
                <title>Suniket | Fotogalerie</title>
                <meta name="description" content="Fotogalerie kapely Suniket – koncerty, akce a zákulisí české hardrockové kapely." />
                <meta property="og:title" content="Suniket | Fotogalerie" />
                <meta property="og:description" content="Fotogalerie kapely Suniket – koncerty, akce a zákulisí české hardrockové kapely." />
                <meta property="og:url" content="https://suniket.cz/galerie/foto" />
                <meta name="twitter:title" content="Suniket | Fotogalerie" />
                <meta name="twitter:description" content="Fotogalerie kapely Suniket – koncerty, akce a zákulisí české hardrockové kapely." />
                <link rel="canonical" href="https://suniket.cz/galerie/foto" />
            </Helmet>
            <section className="py-16 max-w-screen-xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-red-sun mb-12">Fotogalerie</h2>

            {photos.length === 0 ? (
                <p className="text-white/60 text-lg text-center">Žádné fotky</p>
            ) : (
            <LightGallery
                speed={500}
                plugins={[lgThumbnail, lgZoom]}
                elementClassNames="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
                preload={2}
                loadPreviousNext={false}
            >
                {photos.map((photo, i) => (
                    <a key={i} data-lg-type="image" href={assetUrl(photo.src)} className="block aspect-[4/3] overflow-hidden rounded-lg shadow-lg bg-white/5">
                        <img
                            src={assetUrl(photo.thumb)}
                            alt={photo.alt}
                            loading="lazy"
                            className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                        />
                    </a>
                ))}
            </LightGallery>
            )}
            </section>
        </>
    );
}

export default Photos;
