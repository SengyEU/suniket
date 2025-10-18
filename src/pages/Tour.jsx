import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import concertsData from "../data/concerts.json";

function Tour() {
    const { upcoming, past } = concertsData;

    const TableHeader = () => (
        <div className="grid text-sm sm:text-base md:text-lg grid-cols-5 font-bold bg-white/10 border-b-2 border-red-sun p-4 rounded-lg">
            <div>Datum</div>
            <div>Událost</div>
            <div>Místo</div>
            <div>Čas</div>
            <div>Vstup</div>
        </div>
    );

    const renderRow = (concert) => (
        <div
            key={concert.date + concert.event}
            className="grid text-xs sm:text-sm md:text-base grid-cols-5 gap-2 items-center p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 shadow-md"
        >
            <div>{concert.date}</div>
            <div>
                {concert.link ? (
                    <a href={concert.link} target="_blank" rel="noreferrer" className="text-red-sun underline">
                        {concert.event} <FontAwesomeIcon icon={faExternalLink} className="ml-1" />
                    </a>
                ) : (
                    concert.event
                )}
            </div>
            <div>{concert.place}</div>
            <div>{concert.time}</div>
            <div>
                {concert.entry ? (
                    concert.entryHasLink ? (
                        <div>
                            <a
                                href={concert.entryLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-sun underline"
                            >
                                Vstupenky
                                <FontAwesomeIcon icon={faExternalLink} className="ml-1" />
                            </a>
                        </div>
                    ) : (
                        <span>{concert.entryPrice}</span>
                    )
                ) : (
                    <span>Vstup zdarma</span>
                )}
            </div>
        </div>
    );

    const ConcertTable = ({ title, concerts }) => (
        <div className="flex flex-col gap-4 mb-8">
            <h2 className="text-4xl text-center text-red-sun mb-16 relative z-10">{title}</h2>
            <TableHeader />
            {concerts.map(renderRow)}
        </div>
    );

    return (
        <section className="max-w-6xl mx-auto px-5 py-16 text-center">
            <ConcertTable title="Nadcházející koncerty" concerts={upcoming} />
            <hr className="h-0.5 bg-white/20 border-none my-14 mx-auto max-w-2xl rounded" />
            <ConcertTable title="Odehrané koncerty" concerts={past} />
        </section>
    );
}

export default Tour;
