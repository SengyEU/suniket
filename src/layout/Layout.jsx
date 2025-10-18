import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Nav from "./Nav.jsx";
import Footer from "./Footer.jsx";

function Layout() {
    const location = useLocation();

    useEffect(() => {
        const titles = {
            "/": "Domů",
            "/o-nas": "O nás",
            "/tour": "Tour",
            "/galerie/foto": "Galerie",
            "/galerie/video": "Galerie",
            "/kontakt": "Kontakt",
            "/diskografie": "Diskografie",
            "/novinky": "Novinky",
            "/merch": "Merch",
            "/kapela/victor-hrazdil": "Kapela",
            "/kapela/lukas-janata": "Kapela",
            "/kapela/marek-dudkovic": "Kapela",
            "/kapela/dominik-hrazdil": "Kapela",
            "/kapela/krystof-dolezel": "Kapela",
        };
        const pageTitle = titles[location.pathname] || "";
        document.title = `Suniket | ${pageTitle}`;
    }, [location.pathname]);

    const isHome = location.pathname === "/";

    return (
        <div className="relative min-h-dvh flex flex-col text-white-sun">
            <div
                className={`absolute top-0 left-0 right-0 bottom-0 ${isHome ? "" : "bg-black-sun"}`}
                style={{
                    backgroundImage: isHome ? `url("/img/background.webp")` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {isHome && <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/70" />}
            </div>

            <Nav />
            <main className="flex-1 flex relative z-10">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
