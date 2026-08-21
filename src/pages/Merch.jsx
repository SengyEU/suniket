import { Helmet } from "react-helmet-async";
import BreadcrumbJsonLd from "../components/BreadcrumbJsonLd.jsx";

export default function Merch() {
    return (
        <>
            <Helmet>
                <title>Suniket | Merch</title>
                <meta name="description" content="Merchandise kapely Suniket – trička, mikiny a další." />
                <meta property="og:title" content="Suniket | Merch" />
                <meta property="og:description" content="Merchandise kapely Suniket – trička, mikiny a další." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://suniket.cz/merch" />
                <meta property="og:image" content="https://suniket.cz/img/og-image.jpg" />
                <meta property="og:locale" content="cs_CZ" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Suniket | Merch" />
                <meta name="twitter:description" content="Merchandise kapely Suniket – trička, mikiny a další." />
                <meta name="twitter:image" content="https://suniket.cz/img/og-image.jpg" />
                <link rel="canonical" href="https://suniket.cz/merch" />
            </Helmet>
            <BreadcrumbJsonLd items={[{ name: "Domů", path: "/" }, { name: "Merch", path: "/merch" }]} />
            <section className="py-16 max-w-screen-xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-white-sun mb-12">V přípravě...</h2>
        </section>
        </>
    );
}
