import Template from "./Template";

export default function Singer() {
    const data = {
        name: "Victor Hrazdil",
        instrument: "Zpěv",
        description:
            "Frontman kapely, občasný autor textů. Na pódiu vždy přináší maximum energie a komunikace s publikem.",
        photo: "/img/band/singer.webp",
        gear: [
            {
                name: "Mikrofon Behringer XM8500",
                link: "https://kytary.cz/behringer-xm8500/HN225257/",
            },
            {
                name: "IEM KZ EDX Lite",
                link: "https://kz-audio.com/kz-edx-lite.html",
            },
        ],
    };

    return <Template {...data} />;
}
