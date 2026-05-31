import { faEnvelope, faExternalLink, faMapPin, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { fetchContactSettings } from "../api";

export default function Contact() {
    const [s, setS] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContactSettings().then((data) => { setS(data); setLoading(false); });
    }, []);

    if (loading) return null;

    const downloads = [
        { name: s.download_1_name, link: s.download_1_link },
        { name: s.download_2_name, link: s.download_2_link },
        { name: s.download_3_name, link: s.download_3_link },
    ].filter((d) => d.name && d.link);

    return (
        <>
            <Helmet>
                <title>Suniket | Kontakt</title>
                <meta name="description" content="Kontakt na kapelu Suniket – rezervace koncertů, spolupráce a informace. Mobil: +420 731 737 384, email: kapela@suniket.cz." />
                <meta property="og:title" content="Suniket | Kontakt" />
                <meta property="og:description" content="Kontakt na kapelu Suniket – rezervace koncertů, spolupráce a informace. Mobil: +420 731 737 384, email: kapela@suniket.cz." />
                <meta property="og:url" content="https://suniket.cz/kontakt" />
                <meta name="twitter:title" content="Suniket | Kontakt" />
                <meta name="twitter:description" content="Kontakt na kapelu Suniket – rezervace koncertů, spolupráce a informace. Mobil: +420 731 737 384, email: kapela@suniket.cz." />
                <link rel="canonical" href="https://suniket.cz/kontakt" />
            </Helmet>
            <section className="relative py-16 max-w-[1152px] mx-auto px-5 text-center">
            <h2 className="text-4xl font-bold text-red-sun mb-16 relative z-10">Kontakt</h2>

            <div className="flex flex-col md:flex-row justify-center items-stretch gap-10">
                {/* Kontakt info */}
                <div className="flex-1 bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.4)] text-left flex flex-col justify-center">
                    <h3 className="text-2xl font-semibold mb-6 text-red-sun text-center">Kontakt</h3>
                    <p className="text-lg mb-4">
                        Pokud potřebujete domluvit koncert, spolupráci nebo získat informace, neváhejte se nám ozvat.
                    </p>

                    <div className="flex flex-col gap-3 text-white-sun">
                        <p>
                            <FontAwesomeIcon icon={faUser} /> <span className="font-semibold">{s.contact_name}</span>
                        </p>
                        <p>
                            <FontAwesomeIcon icon={faEnvelope} /> <span className="font-semibold">E-mail:</span>{" "}
                            <a href={`mailto:${s.contact_email}`} className="underline text-red-sun">
                                {s.contact_email}
                            </a>
                            {s.contact_email2 && (
                                <>
                                    {" / "}
                                    <a href={`mailto:${s.contact_email2}`} className="underline text-red-sun">
                                        {s.contact_email2}
                                    </a>
                                </>
                            )}
                        </p>
                        <p>
                            <FontAwesomeIcon icon={faPhone} /> <span className="font-semibold">Telefon:</span>{" "}
                            <a href={`tel:${s.contact_phone}`} className="underline text-red-sun">
                                {s.contact_phone}
                            </a>
                        </p>
                        <p>
                            <FontAwesomeIcon icon={faMapPin} /> <span className="font-semibold">Město:</span>{" "}
                            {s.contact_city || "Týnec nad Sázavou"}
                        </p>
                    </div>
                </div>

                {/* Ke stažení */}
                <div className="flex-1 bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.4)] text-left">
                    <h3 className="text-2xl font-semibold mb-6 text-red-sun text-center">Ke stažení</h3>

                    <ul className="flex flex-col gap-4 text-white-sun">
                        {downloads.map((item) => (
                            <li
                                key={item.name}
                                className="flex justify-center items-center bg-white/5 p-4 rounded-lg border border-white/10 transition-all duration-300"
                            >
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-red-sun font-semibold underline"
                                >
                                    {item.name}
                                    <FontAwesomeIcon icon={faExternalLink} className="ml-1" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
        </>
    );
}
