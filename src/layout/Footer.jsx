import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTiktok, faYoutube } from "@fortawesome/free-brands-svg-icons";

function Footer() {
    const year = new Date().getFullYear();

    const socialIcons = [faInstagram, faTiktok, faYoutube, faFacebook];

    const socialUrls = {
        instagram: "https://www.instagram.com/kapela.suniket/",
        tiktok: "https://www.tiktok.com/@kapela.suniket",
        youtube: "https://www.youtube.com/@kapela.suniket",
        facebook: "https://www.facebook.com/kapela.suniket",
    };

    return (
        <footer className="z-10 py-6 text-white-sun text-center flex flex-col items-center bg-[rgba(0,0,0,0.7)] border-t-2 border-solid border-red-sun">
            <div className="flex gap-5 text-xl pb-3">
                {socialIcons.filter((icon) => socialUrls[icon.iconName]).map((icon) => (
                    <a key={icon.iconName} href={socialUrls[icon.iconName]} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon
                            icon={icon}
                            className="text-white-sun no-underline text-xl transition-colors duration-300 hover:text-red-sun"
                        />
                    </a>
                ))}
            </div>
            <div>&copy; 2024-{year} Suniket</div>
        </footer>
    );
}

export default Footer;
