import { useState, useEffect } from "react";
import { fetchMembers, assetUrl } from "../../api";
import Template from "./Template";

export default function Drums() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchMembers().then((members) => {
            const m = members.find((x) => x.name === "Kryštof Doležel");
            if (m) setData({ name: m.name, instrument: m.role, description: m.description, photo: assetUrl(m.photo), gear: m.equipment ? JSON.parse(m.equipment) : [] });
        });
    }, []);

    if (!data) return null;
    return <Template {...data} />;
}
