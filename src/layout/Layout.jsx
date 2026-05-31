import { Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Nav from "./Nav.jsx";
import Footer from "./Footer.jsx";

function Layout() {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <>
            <Helmet>
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://suniket.cz/img/og-image.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content="https://suniket.cz/img/og-image.jpg" />
            </Helmet>
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
        </>
    );
}

export default Layout;
