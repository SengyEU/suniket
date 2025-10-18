import Template from "./Template";

export default function Guitar2() {
    const data = {
        name: "Marek Dudkovič",
        instrument: "Kytara",
        description:
            "Hlavní textař a songwriter kapely. Specialista na tvrdé akordy a groove, který drží kapelu pohromadě.",
        photo: "/img/band/guitar2.webp",
        gear: [
            {
                name: "Kytara Epiphone Les Paul Custom Alpine White",
                link: "https://kytary.cz/epiphone-les-paul-custom-alpine-white/HN289519/",
            },
            {
                name: "Zesilovač Fender Champion 100 Snow White",
                link: "https://kytary.cz/fender-champion-100-snow-white/HN160480/",
            },
        ],
    };

    return <Template {...data} />;
}
