import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";
import { GiNoodles } from "react-icons/gi";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

import img1 from "../assets/images/footer/pexels-ash-376464 1.png";
import img2 from "../assets/images/footer/eiliv-aceron-d5PbKQJ0Lu8-unsplash 1.png";
import img3 from "../assets/images/footer/pexels-steve-3789885 1.png";
import img4 from "../assets/images/footer/pexels-ella-olsson-1640772 1.png";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#2c302e] text-white pt-16 pb-8 px-6 md:px-16 font-['DM_Sans',sans-serif] mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
        
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-3">
            <GiNoodles className="text-[#AD343E] text-4xl" />{" "}
            
            <span className="font-['Playfair_Display',serif] text-2xl font-bold tracking-tight italic">
              Bistro Bliss
            </span>
          </Link>
          <p className="text-[#dbdfd0] text-sm leading-relaxed max-w-xs">
            {t("footer.tagline")}
          </p>
          <div className="flex gap-3">
            {[FaTwitter, FaFacebookF, FaInstagram, FaGithub].map((Icon, i) => (
              <a
                href="#"
                key={i}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-[#AD343E] text-white hover:bg-[#474a49] transition duration-300"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        
        <div className="flex gap-12">
          <div className="flex flex-col gap-5">
            <h4 className="font-['Playfair_Display',serif] text-lg font-semibold">{t("footer.pages")}</h4>
            <ul className="flex flex-col gap-3 text-sm text-[#dbdfd0]">
              {t("footer.links").map((item, i) => {
                const paths = ["/", "/about", "/menu", "/pricing", "/articles", "/contact", "/delivery"];
                return (
                  <li key={i}>
                    <Link to={paths[i] || "#"} className="hover:text-white transition">{item}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex flex-col gap-5">
            <h4 className="font-['Playfair_Display',serif] text-lg font-semibold">{t("footer.utilityPages")}</h4>
            <ul className="flex flex-col gap-3 text-sm text-[#dbdfd0]">
              {t("footer.utility").map((item, i) => (
                <li key={i}><a href="#" className="hover:text-white transition">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        
        <div className="flex flex-col gap-5">
          <h4 className="font-['Playfair_Display',serif] text-lg font-semibold">{t("footer.followInstagram")}</h4>
          <div className="grid grid-cols-2 gap-3">
            {[img1, img2, img3, img4].map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Instagram"
                className="w-[194px] h-[170px] rounded-lg object-cover hover:opacity-80 transition"
              />
            ))}
          </div>
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-8 text-center text-xs text-white/50">
        <p>{t("footer.rights")}</p>
      </div>
    </footer>
  );
};

export default Footer;
