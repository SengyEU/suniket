import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SOCIAL_URLS, SOCIAL_LABELS, SOCIAL_ICONS } from "../data";

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="z-10 py-6 text-white-sun text-center flex flex-col items-center bg-[rgba(0,0,0,0.7)] border-t-2 border-solid border-red-sun">
            <div className="flex gap-5 text-xl pb-3">
                {SOCIAL_ICONS.filter((icon) => SOCIAL_URLS[icon.iconName]).map((icon) => (
                    <a key={icon.iconName} href={SOCIAL_URLS[icon.iconName]} target="_blank" rel="noopener noreferrer me" aria-label={SOCIAL_LABELS[icon.iconName]}>
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
