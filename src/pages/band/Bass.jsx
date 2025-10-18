import Template from "./Template";

export default function Bass() {
    const data = {
        name: "Dominik Hrazdil",
        instrument: "Baskytara",
        description: "Rytmická opora kapely, propojuje bicí a kytary.",
        photo: "/img/band/bass.webp",
        gear: [
            {
                name: "Basa Cort",
            },
            {
                name: "Zesilovač ???",
            },
        ],
    };

    return <Template {...data} />;
}
