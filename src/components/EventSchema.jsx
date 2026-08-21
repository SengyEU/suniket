import { Helmet } from "react-helmet-async";

export default function EventSchema({ concerts }) {
    if (!concerts || concerts.length === 0) return null;

    const events = concerts.map((c) => ({
        "@type": "Event",
        name: c.event,
        startDate: c.date,
        location: {
            "@type": "Place",
            name: c.place,
        },
        performer: {
            "@type": "MusicGroup",
            name: "Suniket",
        },
        organizer: {
            "@type": "MusicGroup",
            name: "Suniket",
        },
        ...(c.entryPrice && { offers: { "@type": "Offer", price: c.entryPrice, priceCurrency: "CZK" } }),
    }));

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": events,
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
}
