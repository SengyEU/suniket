import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTimeline,
    faUsers,
    faGuitar,
    faMicrophone,
    faDrum,
    faNewspaper,
    faMapLocationDot,
    faCompactDisc,
    faPhone,
    faImage,
    faShirt,
    faPhotoFilm,
    faVideo,
    faBars,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { SOCIAL_URLS, SOCIAL_LABELS, SOCIAL_ICONS } from "../data";

const bandMembers = [
    { name: "Victor Hrazdil", icon: faMicrophone, path: "/kapela/victor-hrazdil" },
    { name: "Lukáš Janata", icon: faGuitar, path: "/kapela/lukas-janata" },
    { name: "Marek Dudkovič", icon: faGuitar, path: "/kapela/marek-dudkovic" },
    { name: "Dominik Hrazdil", icon: faGuitar, path: "/kapela/dominik-hrazdil" },
    { name: "Kryštof Doležel", icon: faDrum, path: "/kapela/krystof-dolezel" },
];

const galleryItems = [
    { name: "Foto", icon: faPhotoFilm, path: "/galerie/foto" },
    { name: "Video", icon: faVideo, path: "/galerie/video" },
];

const navItems = [
    { name: "Novinky", path: "/novinky", icon: faNewspaper },
    { name: "Tour", path: "/tour", icon: faMapLocationDot },
    { name: "O nás", path: "/o-nas", icon: faTimeline },
    { name: "Diskografie", path: "/diskografie", icon: faCompactDisc },
    { name: "Merch", path: "/merch", icon: faShirt },
    { name: "Kontakt", path: "/kontakt", icon: faPhone },
];

const NavLinkItem = ({ name, path, icon }) => (
    <NavLink
        to={path}
        className={({ isActive }) =>
            `text-xl no-underline transition-colors duration-300 ${
                isActive ? "text-red-sun" : "text-white-sun hover:text-red-sun"
            }`
        }
    >
        {name} <FontAwesomeIcon icon={icon} />
    </NavLink>
);

export default function Nav() {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const isBandActive = bandMembers.some((member) => member.path === location.pathname);
    const isGalleryActive = galleryItems.some((item) => item.path === location.pathname);
    const [bandOpen, setBandOpen] = useState(false);
    const [galleryOpen, setGalleryOpen] = useState(false);

    useEffect(() => {
        setBandOpen(false);
        setGalleryOpen(false);
        setMenuOpen(false);
    }, [location.pathname]);

    return (
        <div className="relative z-30">
            <nav className="flex justify-between items-center bg-[rgba(0,0,0,0.7)] px-6 py-6 z-20 border-b-2 border-solid border-red-sun">
                <NavLink to="/">
                    <img src="/img/text.webp" alt="Suniket" width="224" height="40" className="w-56 px-4 h-auto relative block z-10" />
                </NavLink>

                <button
                    aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
                    className="block 2xl:hidden text-white-sun text-2xl"
                    onClick={() => {
                        setBandOpen(false);
                        setGalleryOpen(false);
                        setMenuOpen(!menuOpen);
                    }}
                >
                    <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
                </button>

                <div className="bg-transparent p-0 gap-6 hidden 2xl:flex">
                    {/* první tři položky */}
                    {navItems.slice(0, 3).map((item) => (
                        <NavLinkItem key={item.path} {...item} />
                    ))}

                    {/* Kapela dropdown */}
                    <div className="relative inline-block group">
                        <button type="button" aria-haspopup="true"
                            className={`bg-transparent border-none cursor-pointer text-xl transition-colors duration-300 ${
                                isBandActive ? "text-red-sun" : "text-white-sun hover:text-red-sun"
                            }`}
                        >
                            Kapela <FontAwesomeIcon icon={faUsers} />
                        </button>
                        <div className="block opacity-0 transform [scale-y:0] absolute origin-top transition-all duration-250 ease-[ease] bg-[rgba(0,0,0,0.7)] min-w-[220px] shadow-lg z-10 pointer-events-none group-hover:scale-y-[1] group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:scale-y-[1] group-focus-within:opacity-100 group-focus-within:pointer-events-auto">
                            {bandMembers.map((member) => (
                                <NavLink
                                    key={member.path}
                                    to={member.path}
                                    className={({ isActive }) =>
                                        `px-3 py-4 block transition-colors duration-300 text-lg text-center ${
                                            isActive ? "text-red-sun" : "text-white-sun hover:text-red-sun"
                                        }`
                                    }
                                >
                                    {member.name} <FontAwesomeIcon icon={member.icon} />
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Diskografie + Merch */}
                    {navItems.slice(3, 5).map((item) => (
                        <NavLinkItem key={item.path} {...item} />
                    ))}

                    {/* Galerie dropdown hned za Merchem */}
                    <div className="relative inline-block group">
                        <button type="button" aria-haspopup="true"
                            className={`bg-transparent border-none cursor-pointer text-xl transition-colors duration-300 ${
                                isGalleryActive ? "text-red-sun" : "text-white-sun hover:text-red-sun"
                            }`}
                        >
                            Galerie <FontAwesomeIcon icon={faImage} />
                        </button>
                        <div className="block opacity-0 transform [scale-y:0] absolute origin-top transition-all duration-250 ease-[ease] bg-[rgba(0,0,0,0.7)] min-w-[220px] shadow-lg z-10 pointer-events-none group-hover:scale-y-[1] group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:scale-y-[1] group-focus-within:opacity-100 group-focus-within:pointer-events-auto">
                            {galleryItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `px-3 py-4 block transition-colors duration-300 text-lg text-center ${
                                            isActive ? "text-red-sun" : "text-white-sun hover:text-red-sun"
                                        }`
                                    }
                                >
                                    {item.name} <FontAwesomeIcon icon={item.icon} />
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Kontakt zůstane poslední */}
                    {navItems.slice(5).map((item) => (
                        <NavLinkItem key={item.path} {...item} />
                    ))}
                </div>

                <div className="hidden 2xl:flex gap-5 text-xl px-4">
                    {SOCIAL_ICONS.filter((icon) => SOCIAL_URLS[icon.iconName]).map((icon) => (
                        <a key={icon.iconName} href={SOCIAL_URLS[icon.iconName]} target="_blank" rel="noopener noreferrer me" aria-label={SOCIAL_LABELS[icon.iconName]}>
                            <FontAwesomeIcon
                                icon={icon}
                                className="text-white-sun no-underline text-xl transition-colors duration-300 hover:text-red-sun"
                            />
                        </a>
                    ))}
                </div>
            </nav>
            <nav
                className={`2xl:hidden flex-col bg-[rgba(0,0,0,0.7)] px-6 py-6 border-b-2 border-solid border-red-sun transform origin-top transition-all duration-500 ease-in-out absolute top-full left-0 right-0 z-30 gap-4 ${
                    menuOpen ? "scale-y-100 opacity-100 pointer-events-auto" : "scale-y-0 opacity-0 pointer-events-none"
                }`}
            >
                <div className="bg-transparent p-0 gap-4 flex flex-col 2xl:hidden items-center">
                    {/* první tři položky */}
                    {navItems.slice(0, 3).map((item) => (
                        <NavLinkItem key={item.path} {...item} />
                    ))}

                    {/* Kapela dropdown */}
                    <div className="relative inline-block 2xl:hidden">
                        <button
                            onClick={() => {
                                setGalleryOpen(false);
                                setBandOpen(!bandOpen);
                            }}
                            className={`w-full text-xl transition-colors duration-300 cursor-pointer ${
                                isBandActive ? "text-red-sun" : "text-white-sun hover:text-red-sun"
                            }`}
                        >
                            Kapela <FontAwesomeIcon icon={faUsers} />
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${
                                bandOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                            }`}
                        >
                            {bandMembers.map((member) => (
                                <NavLink
                                    key={member.path}
                                    to={member.path}
                                    className={({ isActive }) =>
                                        `px-3 py-2 block transition-colors duration-300 text-lg text-center ${
                                            isActive ? "text-red-sun" : "text-white-sun hover:text-red-sun"
                                        }`
                                    }
                                >
                                    {member.name} <FontAwesomeIcon icon={member.icon} />
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Diskografie + Merch */}
                    {navItems.slice(3, 5).map((item) => (
                        <NavLinkItem key={item.path} {...item} />
                    ))}

                    {/* Galerie dropdown hned za Merchem */}
                    <div className="relative inline-block 2xl:hidden">
                        <button
                            onClick={() => {
                                setBandOpen(false);
                                setGalleryOpen(!galleryOpen);
                            }}
                            className={`w-full text-xl text-left transition-colors duration-300 cursor-pointer ${
                                isGalleryActive ? "text-red-sun" : "text-white-sun hover:text-red-sun"
                            }`}
                        >
                            Galerie <FontAwesomeIcon icon={faImage} />
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${
                                galleryOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                            }`}
                        >
                            {galleryItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `px-3 py-2 block transition-colors duration-300 text-lg text-center ${
                                            isActive ? "text-red-sun" : "text-white-sun hover:text-red-sun"
                                        }`
                                    }
                                >
                                    {item.name} <FontAwesomeIcon icon={item.icon} />
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Kontakt zůstane poslední */}
                    {navItems.slice(5).map((item) => (
                        <NavLinkItem key={item.path} {...item} />
                    ))}
                </div>

                <div className="flex 2xl:hidden gap-5 pt-4 text-xl px-4 justify-center">
                    {SOCIAL_ICONS.filter((icon) => SOCIAL_URLS[icon.iconName]).map((icon) => (
                        <a key={icon.iconName} href={SOCIAL_URLS[icon.iconName]} target="_blank" rel="noopener noreferrer me" aria-label={SOCIAL_LABELS[icon.iconName]}>
                            <FontAwesomeIcon
                                icon={icon}
                                className="text-white-sun no-underline text-xl transition-colors duration-300 hover:text-red-sun"
                            />
                        </a>
                    ))}
                </div>
            </nav>
        </div>
    );
}
