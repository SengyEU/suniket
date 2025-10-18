import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

import photos from "../data/photos.json";

function Photos() {
    return (
        <section className="py-16 max-w-screen-xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-red-sun mb-12">Fotogalerie</h2>

            <LightGallery
                speed={500}
                plugins={[lgThumbnail, lgZoom]}
                elementClassNames="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
            >
                {photos.map((photo, i) => (
                    <a key={i} href={photo.src}>
                        <img
                            src={photo.src}
                            alt={photo.alt}
                            className="w-full h-64 object-cover rounded-lg shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                        />
                    </a>
                ))}
            </LightGallery>
        </section>
    );
}

export default Photos;
