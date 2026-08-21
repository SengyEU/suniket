import { Helmet } from "react-helmet-async";

export default function Home() {
    return (
        <>
            <Helmet>
                <title>Suniket | Domů</title>
                <meta name="description" content="Suniket je česká hardrocková kapela z Týnce nad Sázavou, založená v roce 2024. Pět členů, koncerty po celé ČR, originální tvrdá hudba. Poslechněte si na YouTube." />
                <meta property="og:title" content="Suniket | Domů" />
                <meta property="og:description" content="Oficiální web kapely Suniket z Týnce nad Sázavou – česká hardrocková kapela. Koncerty, diskografie, fotogalerie a videa." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://suniket.cz/" />
                <meta property="og:image" content="https://suniket.cz/img/og-image.jpg" />
                <meta property="og:locale" content="cs_CZ" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Suniket | Domů" />
                <meta name="twitter:description" content="Oficiální web kapely Suniket z Týnce nad Sázavou – česká hardrocková kapela." />
                <meta name="twitter:image" content="https://suniket.cz/img/og-image.jpg" />
                <link rel="canonical" href="https://suniket.cz/" />
            </Helmet>
            <div className="flex items-center w-full justify-center relative text-center flex-1">
            <div className="flex flex-col items-center relative gap-5 z-10">
                <img
                    src="/img/logo.webp"
                    alt="Suniket logo – česká hardrocková kapela"
                    width="240"
                    height="80"
                    fetchpriority="high"
                    className="w-40 sm:w-60 h-auto block z-10 [animation:pulseScale_2.5s_infinite_ease-in-out_alternate]"
                />

                <div className="text-white-sun text-xl sm:text-3xl px-4">
                    <p>Hard rock-heavy / Týnec nad Sázavou</p>
                </div>

                <a href="https://www.youtube.com/@kapela.suniket" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center cursor-pointer text-base rounded-[5rem] transition-all ease-in-out duration-300 border border-transparent border-solid tracking-[2px] font-bold text-center text-white-sun bg-red-sun h-10 w-52 sm:h-12 sm:w-64 hover:scale-[1.05] hover:bg-red-dark-sun">
                    POSLECHNOUT
                </a>
            </div>
        </div>
        </>
    );
}
