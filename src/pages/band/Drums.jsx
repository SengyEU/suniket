import Template from "./Template";

export default function Drums() {
    const data = {
        name: "Kryštof Doležel",
        instrument: "Bicí",
        description:
            "Dynamický bubeník, který tvoří srdce kapely. Silné a precizní údery, umí pracovat s tempem i výrazy.",
        photo: "/img/band/drums.webp",
        gear: [
            {
                name: "Bicí Tama Starclassic Performer Sky Blue Aurora",
                link: "https://kytary.cz/tama-starclassic-performer-sky-blue-aurora-rock-set-ii/HN287835/",
            },
            {
                name: "Činely Meinl Classics Custom Dark",
                link: "https://kytary.cz/meinl-classics-custom-dark-cymbal-set/HN220021/",
            },
        ],
    };

    return <Template {...data} />;
}
