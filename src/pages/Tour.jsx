import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { fetchConcerts } from "../api";

function Tour() {
    const [upcoming, setUpcoming] = useState([]);
    const [past, setPast] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConcerts().then((data) => { setUpcoming(data.upcoming); setPast(data.past); setLoading(false); });
    }, []);

    if (loading) return null;

    const entryContent = (concert) => {
        if (!concert.entry) return <span>Vstup zdarma</span>;
        if (concert.entryHasLink) {
            return (
                <a href={concert.entryLink} target="_blank" rel="noopener noreferrer" className="text-red-sun underline">
                    Vstupenky <FontAwesomeIcon icon={faExternalLink} className="ml-1" />
                </a>
            );
        }
        return <span>{concert.entryPrice}</span>;
    };

    const eventContent = (concert) => {
        if (concert.link) {
            return (
                <a href={concert.link} target="_blank" rel="noreferrer" className="text-red-sun underline">
                    {concert.event} <FontAwesomeIcon icon={faExternalLink} className="ml-1" />
                </a>
            );
        }
        return concert.event;
    };

    const renderDesktopRow = (concert) => (
        <div
            key={concert.date + concert.event}
            className="grid text-xs sm:text-sm md:text-base grid-cols-5 gap-2 items-center p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 shadow-md"
        >
            <div>{concert.date}</div>
            <div className="break-words">{eventContent(concert)}</div>
            <div>{concert.place}</div>
            <div>{concert.time}</div>
            <div>{entryContent(concert)}</div>
        </div>
    );

    const renderMobileCard = (concert) => (
        <div key={concert.date + concert.event} className="flex flex-col bg-white/5 rounded-xl border border-white/10 shadow-md overflow-hidden">
            <div className="bg-white/10 px-4 py-2 text-left border-b-2 border-red-sun">
                <span className="text-sm font-semibold text-white">{concert.date}</span>
            </div>
            <div className="p-4 text-left space-y-1">
                <div className="text-base font-semibold text-white-sun">
                    {eventContent(concert)}
                </div>
                <div className="text-sm text-white">{concert.place}</div>
                {concert.time && <div className="text-sm text-white">{concert.time}</div>}
                <div className="text-sm text-white/60">{entryContent(concert)}</div>
            </div>
        </div>
    );

    const ConcertGroup = ({ title, concerts }) => {
        if (concerts.length === 0) {
            return (
                <div className="mb-8">
                    <h2 className="text-4xl text-center text-red-sun mb-8 relative z-10">{title}</h2>
                    <p className="text-white/60 text-lg text-center">Žádné koncerty</p>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-4 mb-8">
                <h2 className="text-4xl text-center text-red-sun mb-8 relative z-10">{title}</h2>
                <div className="grid text-sm sm:text-base md:text-lg grid-cols-5 font-bold bg-white/10 border-b-2 border-red-sun p-4 rounded-lg max-sm:hidden">
                    <div>Datum</div>
                    <div>Událost</div>
                    <div>Místo</div>
                    <div>Čas</div>
                    <div>Vstup</div>
                </div>
                {/* desktop */}
                <div className="flex-col gap-4 hidden sm:flex">
                    {concerts.map(renderDesktopRow)}
                </div>
                {/* mobile */}
                <div className="flex-col gap-4 flex sm:hidden">
                    {concerts.map(renderMobileCard)}
                </div>
            </div>
        );
    };

    return (
        <>
            <Helmet>
                <title>Suniket | Koncerty</title>
                <meta name="description" content="Nadcházející a proběhlé koncerty kapely Suniket. Přijďte si poslechnout český hard rock naživo!" />
                <meta property="og:title" content="Suniket | Koncerty" />
                <meta property="og:description" content="Nadcházející a proběhlé koncerty kapely Suniket. Přijďte si poslechnout český hard rock naživo!" />
                <meta property="og:url" content="https://suniket.cz/tour" />
                <meta name="twitter:title" content="Suniket | Koncerty" />
                <meta name="twitter:description" content="Nadcházející a proběhlé koncerty kapely Suniket. Přijďte si poslechnout český hard rock naživo!" />
                <link rel="canonical" href="https://suniket.cz/tour" />
            </Helmet>
            <section className="max-w-6xl mx-auto px-5 py-16 text-center">
            <ConcertGroup title="Nadcházející koncerty" concerts={upcoming} />
            <hr className="h-0.5 bg-white/20 border-none my-14 mx-auto max-w-2xl rounded" />
            <ConcertGroup title="Odehrané koncerty" concerts={past} />
        </section>
        </>
    );
}

export default Tour;
