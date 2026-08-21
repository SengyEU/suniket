import { Helmet } from "react-helmet-async";

function NotFound() {
    return (
        <>
            <Helmet>
                <title>Suniket | Stránka nenalezena</title>
                <meta name="description" content="Stránka nebyla nalezena." />
                <meta name="robots" content="noindex, nofollow" />
                <meta property="og:title" content="Suniket | Stránka nenalezena" />
                <meta property="og:description" content="Stránka nebyla nalezena." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://suniket.cz/img/og-image.jpg" />
                <meta property="og:url" content="https://suniket.cz/404" />
            </Helmet>
            <section className="flex flex-col items-center justify-center flex-1 gap-6 text-center px-4">
                <h1 className="text-6xl font-bold text-red-sun">404</h1>
                <p className="text-white/60 text-xl">Tahle stránka neexistuje</p>
            </section>
        </>
    );
}

export default NotFound;