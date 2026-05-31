import { Helmet } from "react-helmet-async";

export default function Home() {
    return (
        <>
            <Helmet>
                <title>Suniket | Domů</title>
                <meta name="description" content="Oficiální web kapely Suniket z Týnce nad Sázavou – česká hardrocková kapela." />
                <meta property="og:title" content="Suniket | Domů" />
                <meta property="og:description" content="Oficiální web kapely Suniket z Týnce nad Sázavou – česká hardrocková kapela." />
                <meta property="og:url" content="https://suniket.cz/" />
                <meta name="twitter:title" content="Suniket | Domů" />
                <meta name="twitter:description" content="Oficiální web kapely Suniket z Týnce nad Sázavou – česká hardrocková kapela." />
                <link rel="canonical" href="https://suniket.cz/" />
            </Helmet>
            <div className="flex items-center w-full justify-center relative text-center">
            <div className="flex flex-col items-center relative gap-5 z-10">
                <img
                    src="/img/logo.webp"
                    alt="logo"
                    className="w-40 sm:w-60 h-auto block z-10 [animation:pulseScale_2.5s_infinite_ease-in-out_alternate]"
                />

                <div className="text-white-sun text-xl sm:text-3xl px-4">
                    <p>Hard rock-heavy / Týnec nad Sázavou</p>
                </div>

                <button className="cursor-pointer text-base rounded-[5rem] transition-all ease-in-out duration-300 border border-transparent border-solid tracking-[2px] font-bold text-center text-white-sun bg-red-sun h-10 w-52 sm:h-12 sm:w-64 hover:scale-[1.05] hover:bg-red-dark-sun">
                    POSLECHNOUT
                </button>
            </div>
        </div>
        </>
    );
}
