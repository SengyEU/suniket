import Template from "./Template";

export default function Guitar1() {
    const data = {
        name: "Lukáš Janata",
        instrument: "Kytara",
        description:
            "Hlavní sólista kapely, autor výrazných riffů a melodických linek. Na pódiu přináší energii a virtuozitu.",
        photo: "/img/band/guitar1.webp",
        gear: [
            {
                name: "Kytara Harley Benton SC-CUSTOM II Silverburst",
            },
            {
                name: "Zesilovač Hughes & Kettner TubeMeister 36",
                link: "https://kytary.cz/hughes-kettner-tubemeister-36-head/HN145420/",
            },
            {
                name: "Reprobox Harley Benton G212 Vertical Celestion V30",
                link: "https://www.thomann.de/cz/harley_benton_g212_vintage_vertical.htm",
            },
        ],
    };

    return <Template {...data} />;
}
