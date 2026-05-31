import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { fetchMembers, assetUrl } from "../../api";
import Template from "./Template";

export default function Bass() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchMembers().then((members) => {
            const m = members.find((x) => x.name === "Dominik Hrazdil");
            if (m) setData({ name: m.name, instrument: m.role, description: m.description, photo: assetUrl(m.photo), gear: m.equipment ? JSON.parse(m.equipment) : [] });
        });
    }, []);

    if (!data) return null;
    return (
        <>
            <Helmet>
                <title>Suniket | {data.name}</title>
                <meta name="description" content={`${data.name} – ${data.instrument} kapely Suniket. ${data.description || ""}`} />
                <meta property="og:title" content={`Suniket | ${data.name}`} />
                <meta property="og:description" content={`${data.name} – ${data.instrument} kapely Suniket. ${data.description || ""}`} />
                <meta property="og:url" content="https://suniket.cz/kapela/dominik-hrazdil" />
                <meta name="twitter:title" content={`Suniket | ${data.name}`} />
                <meta name="twitter:description" content={`${data.name} – ${data.instrument} kapely Suniket. ${data.description || ""}`} />
                <link rel="canonical" href="https://suniket.cz/kapela/dominik-hrazdil" />
            </Helmet>
            <Template {...data} />
        </>
    );
}
