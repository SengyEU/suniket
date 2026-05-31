import { Helmet } from "react-helmet-async";

export default function Merch() {
    return (
        <>
            <Helmet>
                <title>Suniket | Merch</title>
                <meta name="description" content="Merchandise kapely Suniket – trička, mikiny a další." />
                <meta property="og:title" content="Suniket | Merch" />
                <meta property="og:description" content="Merchandise kapely Suniket – trička, mikiny a další." />
                <meta property="og:url" content="https://suniket.cz/merch" />
                <meta name="twitter:title" content="Suniket | Merch" />
                <meta name="twitter:description" content="Merchandise kapely Suniket – trička, mikiny a další." />
                <link rel="canonical" href="https://suniket.cz/merch" />
            </Helmet>
            <section className="py-16 max-w-screen-xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-white-sun mb-12">V přípravě...</h2>
        </section>
        </>
    );
}
