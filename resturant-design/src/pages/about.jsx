// ==========================================================================
// [1] IMPORTS & ASSETS
// ==========================================================================
import { Star, Play, Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import aboutImage1 from "../assets/images/about/Image1.png";
import aboutBg from "../assets/images/about/BG.png";
import aboutImage2 from "../assets/images/about/Image2.png";
import iconMenu from "../assets/images/about/restaurant-menu 1.png";
import iconOrder from "../assets/images/about/Icon.png";
import iconTimer from "../assets/images/about/timer 1.png";
import avatar1 from "../assets/images/about/Ellipse 19.png";
import avatar2 from "../assets/images/about/Image (1).png";
import avatar3 from "../assets/images/about/Image.png";

// ==========================================================================
// [2] MAIN COMPONENT: ABOUT
// ==========================================================================
const About = () => {
  const { t, isArabic } = useLanguage();
  const avatars = [avatar1, avatar2, avatar3];

  const testimonialsData = t("about.testimonialsData");
  const testimonials = Array.isArray(testimonialsData) ? testimonialsData : [];

  return (
    <div 
      className="font-['DM_Sans',sans-serif] bg-white text-[#41454C] overflow-x-hidden text-start"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <h1
        className="font-['Playfair_Display',serif] font-bold text-5xl text-center text-[#2C2F34] dark:!text-white pt-8"
      >
        {t("about.title")}
      </h1>

      {/* 
        ======================================================================
        [ SECTION 1 ] : INTRODUCTION & HEALTHY FOOD
        Description   : Highlights the restaurant's core vision, location info, 
                        and commitment to providing healthy food.
        ======================================================================
      */}
      <section className="py-24 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-24">

        <div className="relative w-full md:w-1/2">
          <img
            src={aboutImage1}
            alt="Healthy Food"
            className="rounded-[32px] w-[599px] h-[566px] object-cover shadow-xl"
          />


          <div
            className="absolute bg-[#474747] text-white p-10 rounded-3xl shadow-2xl z-10 flex flex-col justify-center"
            style={{
              width: "411px",
              height: "321px",
              [isArabic ? "left" : "right"]: "-50px",
              bottom: "-60px",
            }}
          >
            <h4 className="font-bold text-xl mb-8 gap-4">{t("about.visitUs")}</h4>
            <br></br>
            <br></br>
            <div className="space-y-6">
              {" "}

              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-white" />
                <p className="text-sm opacity-90">(414) 857 - 0107</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-white" />
                <p className="text-sm opacity-90">happytummy@restaurant.com</p>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-white shrink-0" />
                <p className="text-sm opacity-90 leading-relaxed">
                  837 W. Marshall Lane Marshalltown, IA 50158, Los Angeles
                </p>
              </div>
            </div>
          </div>
        </div>


        <div className="w-full md:w-1/2 space-y-6 mt-16 md:mt-0">
          <h2 className="text-5xl md:text-6xl font-extrabold text-[#2C2F34] font-['Playfair_Display'] leading-tight">
            {t("about.h2")}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed font-bold">
            {t("about.desc1")}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {t("about.desc2")}
          </p>
        </div>
      </section>

      {/* 
        ======================================================================
        [ SECTION 2 ] : VIDEO PREVIEW & FEATURES
        Description   : Displays a video placeholder and highlights key 
                        offerings: Multi Cuisine, Easy to Order, Fast Delivery.
        ======================================================================
      */}
      <section className="py-12 bg-[#F9F9F7] text-center">

        <div className="relative max-w-[1600px] mx-auto h-[690px] shadow-2xl overflow-hidden md:rounded-[32px]">
          <img
            src={aboutBg}
            alt="Video Background"
            className="w-full h-full object-cover"
          />


          <div className="absolute inset-0 bg-black/40"></div>


          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#AD343E] hover:scale-110 transition duration-300 mb-8">
              <Play size={32} fill="currentColor" className="ml-1" />
            </button>
            <h2 className="text-white text-4xl md:text-6xl font-bold font-['Playfair_Display'] px-4">
              {t("about.videoTitle")}
            </h2>
          </div>
        </div>


        <div className="max-w-[1296px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-6">

          <div className="text-start p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center"><img src={iconMenu} alt="Multi Cuisine icon" className="w-8 h-8" /></div>
            <div>
              <h4 className="font-bold text-lg mb-2 text-[#2C2F34]">{t("about.multiCuisine")}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{t("about.multiCuisineDesc")}</p>
            </div>
          </div>
          <div className="text-start p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center"><img src={iconOrder} alt="Easy To Order icon" className="w-8 h-8" /></div>
            <div>
              <h4 className="font-bold text-lg mb-2 text-[#2C2F34]">{t("about.easyOrder")}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{t("about.easyOrderDesc")}</p>
            </div>
          </div>
          <div className="text-start p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center"><img src={iconTimer} alt="Fast Delivery icon" className="w-8 h-8" /></div>
            <div>
              <h4 className="font-bold text-lg mb-2 text-[#2C2F34]">{t("about.fastDelivery")}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{t("about.fastDeliveryDesc")}</p>
            </div>
          </div>
        </div>
      </section>
      {/* 
        ======================================================================
        [ SECTION 3 ] : STATS & INFORMATION
        Description   : Presents key statistics about the restaurant (locations, 
                        staff members, founded year) alongside chef imagery.
        ======================================================================
      */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-5xl md:text-6xl font-bold font-['Playfair_Display'] text-[#2C2F34]">
            {t("about.infoTitle")}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            {t("about.infoDesc")}
          </p>


          <div className="grid grid-cols-2 gap-6">
            {[
              { v: "3", l: t("about.locations") },
              { v: "1995", l: t("about.founded") },
              { v: "65+", l: t("about.staff") },
              { v: "100%", l: t("about.satisfied") },
            ].map((s, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-3xl flex flex-col items-center justify-center bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] transition-all duration-300"
                style={{
                  width: "293px",
                  height: "174px",
                }}
              >
                <h3 className="text-4xl font-bold text-[#2C2F34] mb-2">
                  {s.v}
                </h3>
                <p className="text-sm text-gray-500">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <img
          src={aboutImage2}
          alt="Chef Prep"
          className="rounded-[32px] w-full h-[550px] md:h-[650px] object-cover shadow-2xl"
        />
      </section>

      {/* 
        ======================================================================
        [ SECTION 4 ] : TESTIMONIALS
        Description   : Customer reviews showcasing positive dining experiences.
        ======================================================================
      */}
      <section className="py-24 bg-[#F9F9F7] px-6">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-extrabold font-['Playfair_Display'] text-[#2C2F34]">
            {t("about.whatCustomersSay")}
          </h2>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-sm text-start"
            >
              <div className="text-amber-500 flex gap-1 mb-4">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <h4 className="font-semibold text-[#AD343E] mb-2">"{t.quote}"</h4>
              <p className="text-gray-600 text-sm italic mb-6">"{t.text}"</p>
              <div className="flex items-center gap-4 border-t border-gray-100 pt-6 mt-6">
                <img
                  src={avatars[i]}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#AD343E]/20"
                />
                <div>
                  <h5 className="font-bold">{t.name}</h5>
                  <span className="text-xs text-gray-400">{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
