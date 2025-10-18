import { faEnvelope, faExternalLink, faMapPin, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Contact() {
    const downloads = [
        {
            name: "Logo (svg/png)",
            link: "https://drive.google.com/drive/folders/1d-FtEI1k7_nPoNKcHs3ZwBKgY5YOEy6d?usp=sharing",
        },
        {
            name: "Promo foto",
            link: "https://drive.google.com/drive/folders/1AvKllFwO2ejppHXCzgTTBWQTyfxs9Lad?usp=sharing",
        },
        {
            name: "Stage plan (PDF)",
            link: "https://drive.google.com/drive/folders/1b6iX9enWDLqzB9_j_AYsoFyZYKuGRjDY?usp=sharing",
        },
    ];

    return (
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
                            <FontAwesomeIcon icon={faUser} /> <span className="font-semibold">Marek Dudkovič</span>
                        </p>
                        <p>
                            <FontAwesomeIcon icon={faEnvelope} /> <span className="font-semibold">E-mail:</span>{" "}
                            <a href="mailto:kapela@suniket.cz" className="underline text-red-sun">
                                kapela@suniket.cz
                            </a>
                            {" / "}
                            <a href="mailto:marekdud@seznam.cz" className="underline text-red-sun">
                                marekdud@seznam.cz
                            </a>
                        </p>
                        <p>
                            <FontAwesomeIcon icon={faPhone} /> <span className="font-semibold">Telefon:</span>{" "}
                            <a href="tel:+420731737384" className="underline text-red-sun">
                                +420 731 737 384
                            </a>
                        </p>
                        <p>
                            <FontAwesomeIcon icon={faMapPin} /> <span className="font-semibold">Město:</span> Týnec nad
                            Sázavou
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
    );
}
