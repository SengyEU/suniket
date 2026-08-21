import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { fetchMembers, assetUrl } from "../../api";
import Template from "./Template";
import Spinner from "../../components/Spinner.jsx";
import BreadcrumbJsonLd from "../../components/BreadcrumbJsonLd.jsx";

export default function Guitar2() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMembers()
            .then((members) => {
                const m = members.find((x) => x.name === "Marek Dudkovič");
                if (m) setData({ name: m.name, instrument: m.role, description: m.description, photo: assetUrl(m.photo), gear: m.equipment ? JSON.parse(m.equipment) : [] });
                setLoading(false);
            })
            .catch((e) => { setError(e.message); setLoading(false); });
    }, []);

    if (loading) return <Spinner />;
    if (error) return <section className="py-16 max-w-screen-xl mx-auto px-4"><p className="text-red-sun text-lg text-center">Chyba načítání: {error}</p></section>;
    if (!data) return <section className="py-16 max-w-screen-xl mx-auto px-4"><p className="text-white/60 text-lg text-center">Člen nenalezen</p></section>;
    return (
        <>
            <Helmet>
                <title>Suniket | {data.name}</title>
                <meta name="description" content={`${data.name} – ${data.instrument} kapely Suniket. ${data.description || ""}`} />
                <meta property="og:title" content={`Suniket | ${data.name}`} />
                <meta property="og:description" content={`${data.name} – ${data.instrument} kapely Suniket. ${data.description || ""}`} />
                <meta property="og:type" content="profile" />
                <meta property="og:url" content="https://suniket.cz/kapela/marek-dudkovic" />
                <meta property="og:image" content="https://suniket.cz/img/og-image.jpg" />
                <meta property="og:locale" content="cs_CZ" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`Suniket | ${data.name}`} />
                <meta name="twitter:description" content={`${data.name} – ${data.instrument} kapely Suniket.`} />
                <meta name="twitter:image" content="https://suniket.cz/img/og-image.jpg" />
                <link rel="canonical" href="https://suniket.cz/kapela/marek-dudkovic" />
            </Helmet>
            <BreadcrumbJsonLd items={[{ name: "Domů", path: "/" }, { name: data.name, path: "/kapela/marek-dudkovic" }]} />
            <Template {...data} />
        </>
    );
}
