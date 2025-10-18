import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faSpotify, faTiktok, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { NavLink } from "react-router-dom";

function Footer() {
    const year = new Date().getFullYear();

    const socialIcons = [faInstagram, faSpotify, faTiktok, faYoutube, faFacebook];

    return (
        <footer className="z-10 py-6 text-white-sun text-center flex flex-col items-center bg-[rgba(0,0,0,0.7)] border-t-2 border-solid border-red-sun">
            <div className="flex gap-5 text-xl pb-3">
                {socialIcons.map((icon) => (
                    <FontAwesomeIcon
                        key={icon.iconName}
                        icon={icon}
                        className="text-white-sun no-underline text-xl transition-colors duration-300 hover:text-red-sun"
                    />
                ))}
            </div>
            <div>&copy; 2024-{year} Suniket</div>
        </footer>
    );
}

export default Footer;
