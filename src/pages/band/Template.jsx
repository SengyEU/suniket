import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Template({ name, instrument, description, photo, gear }) {
    return (
        <section className="relative py-8 md:py-16 max-w-[1152px] mx-auto px-4 md:px-5 w-full text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-red-sun mb-8 md:mb-14 relative z-10">{name}</h2>

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 bg-white/5 p-4 md:p-8 rounded-2xl backdrop-blur-sm border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                {/* Foto */}
                <div className="w-full md:flex-1 overflow-hidden rounded-2xl">
                    <img
                        src={photo}
                        alt={name}
                        width="800"
                        height="450"
                        loading="lazy"
                        decoding="async"
                        className="max-h-[450px] w-full h-full object-cover rounded-2xl transition-transform duration-500"
                    />
                </div>

                {/* Info */}
                <div className="w-full md:flex-[2] text-left space-y-3 md:space-y-4">
                    <h3 className="text-xl md:text-3xl font-semibold text-red-sun">{name}</h3>
                    <p className="text-base md:text-lg text-white/70 font-medium">{instrument}</p>
                    <p className="text-white/80 text-sm md:text-base leading-relaxed">{description}</p>

                    <div>
                        <h4 className="text-lg md:text-xl font-semibold text-red-sun mt-4 mb-2">Vybavení:</h4>
                        <ul className="flex flex-col gap-2">
                            {gear.map((item) => (
                                <li key={item.name} className="flex gap-2">
                                    <span className="text-white/50 shrink-0">&ndash;</span>
                                    {item.link ? (
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white/80 hover:text-red-sun underline transition-colors break-all"
                                        >
                                            {item.name}<span className="whitespace-nowrap">{'\u00A0'}<FontAwesomeIcon icon={faExternalLink} className="text-red-sun" style={{"--fa-display":"inline"}} /></span>
                                        </a>
                                    ) : (
                                        <span className="text-white/80 break-all">{item.name}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
