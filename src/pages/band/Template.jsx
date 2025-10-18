import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Template({ name, instrument, description, photo, gear }) {
    return (
        <section className="relative py-16 w-[1152px] mx-auto px-5 text-center">
            <h2 className="text-4xl font-bold text-red-sun mb-14 relative z-10">{name}</h2>

            <div className="flex flex-col md:flex-row items-center gap-10 bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                {/* Foto */}
                <div className="flex-1 overflow-hidden rounded-2xl">
                    <img
                        src={photo}
                        alt={name}
                        className="max-h-[450px] w-full h-full object-cover rounded-2xl transition-transform duration-500"
                    />
                </div>

                {/* Info */}
                <div className="flex-[2] text-left space-y-4">
                    <h3 className="text-3xl font-semibold text-red-sun">{name}</h3>
                    <p className="text-lg text-white/70 font-medium">{instrument}</p>
                    <p className="text-white/80 text-base leading-relaxed">{description}</p>

                    <div>
                        <h4 className="text-xl font-semibold text-red-sun mt-4 mb-2">Vybavení:</h4>
                        <ul className="flex flex-col gap-2 list-inside">
                            {gear.map((item) => (
                                <li key={item.name} className="before:content-['-'] before:mr-2">
                                    {item.link ? (
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white/80 hover:text-red-sun underline transition-colors"
                                        >
                                            {item.name}
                                            <FontAwesomeIcon icon={faExternalLink} className="ml-1 text-red-sun" />
                                        </a>
                                    ) : (
                                        <span className="text-white/80">{item.name}</span>
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
