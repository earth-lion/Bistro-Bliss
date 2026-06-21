// ==========================================================================
// [1] IMPORTS & ASSETS
// ==========================================================================
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Utensils,
  Coffee,
  Cake,
  Flame,
  Clock,
  Leaf,
  Star,
  Sparkles,
} from "lucide-react";
import heroBackground from "../assets/images/home/image 110.png";
import aboutImgLocal from "../assets/images/home/image 111.png";
import serviceImg1Local from "../assets/images/home/caterings.png";
import serviceImg2Local from "../assets/images/home/birthdays.png";
import serviceImg3Local from "../assets/images/home/wedding.png";
import serviceImg4Local from "../assets/images/home/events.png";
import deliveryImg1Local from "../assets/images/home/cooker.png";
import deliveryImg2Local from "../assets/images/home/seafood.png";
import deliveryImg3Local from "../assets/images/home/meats.png";
import blogImg1Local from "../assets/images/home/burger.png";
import blogImg2Local from "../assets/images/home/fries.png";
import blogImg3Local from "../assets/images/home/strips.png";
import blogImg4Local from "../assets/images/home/cupcake.png";
import blogImg5Local from "../assets/images/home/pizza.png";

const aboutImg = aboutImgLocal;
const serviceImg1 = serviceImg1Local;
const serviceImg2 = serviceImg2Local;
const serviceImg3 = serviceImg3Local;
const serviceImg4 = serviceImg4Local;
const deliveryImg1 = deliveryImg1Local;
const deliveryImg2 = deliveryImg2Local;
const deliveryImg3 = deliveryImg3Local;
const blogImg1 = blogImg1Local;
const blogImg2 = blogImg2Local;
const blogImg3 = blogImg3Local;
const blogImg4 = blogImg4Local;
const blogImg5 = blogImg5Local;
// ==========================================================================
// [2] MOCK DATA & CONFIGURATION
// ==========================================================================
const categoryIcons = [
  <Flame size={28} />,
  <Utensils size={28} />,
  <Coffee size={28} />,
  <Cake size={28} />,
];
const categoryKeys = ["breakfast", "mainDishes", "drinks", "desserts"];
const categoryUrlNames = ["Breakfast", "Main Dishes", "Drinks", "Desserts"];
const serviceImgs = [serviceImg1, serviceImg2, serviceImg3, serviceImg4];
const serviceKeys = ["caterings", "birthdays", "weddings", "events"];

// Dynamic testimonials and blogPosts are declared inside the component below.

// ==========================================================================
// [3] MAIN COMPONENT: HOME
// ==========================================================================
const Home = () => {
  const navigate = useNavigate();
  const { t, isArabic } = useLanguage();

  const categories = categoryKeys.map((key, i) => ({
    name: t(`home.categories.${key}.name`),
    urlName: categoryUrlNames[i],
    icon: categoryIcons[i],
    desc: t(`home.categories.${key}.desc`),
  }));

  const services = serviceKeys.map((key, i) => ({
    title: t(`home.services.${key}.title`),
    desc: t(`home.services.${key}.desc`),
    img: serviceImgs[i],
  }));

  const testimonials = (t("home.testimonialsData") || []).map((item, idx) => ({
    ...item,
    avatar:
      idx === 0
        ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
        : idx === 1
          ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    role: isArabic
      ? idx === 0
        ? "عميل دائم"
        : idx === 1
          ? "محب للطعام المحلي"
          : "منظم فعاليات"
      : idx === 0
        ? "Regular Customer"
        : idx === 1
          ? "Local Foodie"
          : "Event Organizer",
  }));

  const blogPosts = (t("home.blogPostsData") || []).map((item, idx) => ({
    ...item,
    tag: isArabic
      ? idx === 0
        ? "صحة"
        : idx === 1
          ? "طهي"
          : idx === 2
            ? "شراب"
            : idx === 3
              ? "صحي"
              : "طهي"
      : idx === 0
        ? "Health"
        : idx === 1
          ? "Cooking"
          : idx === 2
            ? "Wine"
            : idx === 3
              ? "Healthy"
              : "Cooking",
    date: isArabic
      ? "١٤ يناير ٢٠٢٦"
      : idx === 0
        ? "January 14, 2026"
        : idx === 1
          ? "February 22, 2026"
          : idx === 2
            ? "March 08, 2026"
            : idx === 3
              ? "April 12, 2026"
              : "May 05, 2026",
    img:
      idx === 0
        ? blogImg1
        : idx === 1
          ? blogImg2
          : idx === 2
            ? blogImg3
            : idx === 3
              ? blogImg4
              : blogImg5,
  }));

  return (
    <div
      className="font-['DM_Sans',sans-serif] bg-white text-[#2C2F34] overflow-x-hidden"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* 
        ======================================================================
        [ SECTION 1 ] : HERO
        Description   : Showcases the main brand message, welcoming text, 
                        and call-to-action buttons (Book Table, Explore Menu).
        ======================================================================
      */}
      <section className="relative overflow-hidden py-24 px-6 md:px-16 lg:px-24 min-h-[calc(100vh-130px)] flex items-center">
        {/* Background Image with scale to allow shifting on all screen aspect ratios */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src={heroBackground}
            alt="Hero Background"
            className="w-[calc(100%+60px)] h-full object-cover object-[70%_center] scale-115 translate-x-[110px]"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center justify-center gap-10 text-center w-full">
          <div className="space-y-6 max-w-2xl">
            <span className="inline-block bg-[#EBF3E8] text-[#557C55] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm">
              {t("home.badge")}
            </span>

            <h1 className="font-['Playfair_Display',serif] text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2C2F34] leading-tight [text-shadow:0_2px_10px_rgba(255,255,255,0.8)] hero-text">
              {t("home.heroTitle")}
            </h1>

            <p className="text-[#2C2F34]/90 font-medium text-sm md:text-base leading-relaxed [text-shadow:0_1px_2px_rgba(255,255,255,0.5)] hero-text">
              {t("home.heroDesc")}
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                to="/book"
                className="bg-[#AD343E] hover:bg-[#922730] text-white px-8 py-4 rounded-full font-bold shadow-lg transition duration-300"
              >
                {t("home.bookTable")}
              </Link>
              <Link
                to="/menu"
                className="border-2 border-[#2C2F34] text-[#2C2F34] hover:bg-[#2C2F34] hover:text-white px-8 py-4 rounded-full font-bold transition duration-300 hero-text hero-btn"
              >
                {t("home.exploreMenu")}
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* 
        ======================================================================
        [ SECTION 2 ] : BROWSE OUR MENU
        Description   : Displays restaurant categories (Breakfast, Dishes, etc.)
                        allowing users to quickly navigate to the menu page.
        ======================================================================
      */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 text-center">
        <span className="text-[#AD343E] text-lg font-bold uppercase tracking-wider">
          {t("home.ourMenu")}
        </span>

        <h2
          className="font-['Playfair_Display',serif] text-5xl md:text-6xl font-extrabold text-[#2C2F34] mt-3"
          style={{ marginBottom: "40px" }}
        >
          {t("home.browseMenu")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => navigate(`/menu?cat=${cat.urlName}`)}
              className="p-8 border border-gray-150 rounded-[32px] hover:shadow-2xl hover:-translate-y-2 transition duration-300 text-center flex flex-col items-center cursor-pointer bg-white group"
            >
              <div className="bg-[#F9F9F7] group-hover:bg-[#AD343E]/10 p-5 rounded-full mb-6 text-[#AD343E] transition duration-300">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2C2F34]">
                {cat.name}
              </h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed max-w-xs">
                {cat.desc}
              </p>
              <span className="text-[#AD343E] font-bold text-sm flex items-center gap-1 group-hover:underline">
                {t("home.exploreItems")}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 
        ======================================================================
        [ SECTION 3 ] : ABOUT US
        Description   : Briefly explains the restaurant's story, vision, 
                        key features (Organic, Chefs), and contact details.
        ======================================================================
      */}
      <section className="bg-[#F9F9F7] py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 text-left">
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
            <div className="rounded-[32px] overflow-hidden shadow-2xl relative border-8 border-white bg-white">
              <img
                src={aboutImg}
                alt="Food presentation"
                className="w-full h-[480px] object-cover"
              />
            </div>

            <div className="absolute -bottom-16 right-4 lg:-right-16 bg-[#474747] text-white p-8 rounded-3xl shadow-2xl max-w-xs space-y-6">
              <h4 className="font-['Playfair_Display',serif] text-2xl font-bold">
                {t("home.visitUs")}
              </h4>
              <div className="space-y-4 text-sm">
                <p className="flex items-center gap-3">
                  <span>📞</span> (414) 857 - 0107
                </p>
                <p className="flex items-center gap-3">
                  <span>✉️</span> happytummy@restaurant.com
                </p>
                <p className="flex items-start gap-3 leading-relaxed">
                  <span>📍</span> 837 W. Marshall Lane Marshalltown, IA 50158,
                  Los Angeles
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-8 lg:mt-0 mt-20">
            <h2 className="font-['Playfair_Display',serif] text-5xl md:text-6xl font-extrabold text-[#2C2F34] leading-tight">
              {t("home.aboutTitle")}
            </h2>

            <div className="space-y-4 text-gray-600 text-base leading-relaxed">
              <p>{t("home.aboutDesc1")}</p>
              <p>{t("home.aboutDesc2")}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌱</span>
                <div>
                  <h4 className="font-bold text-[#2C2F34]">
                    {t("home.organic")}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {t("home.organicDesc")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">👨‍🍳</span>
                <div>
                  <h4 className="font-bold text-[#2C2F34]">
                    {t("home.expertChefs")}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {t("home.expertChefsDesc")}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/about"
                className="inline-block px-8 py-4 border-2 border-[#2C2F34] text-[#2C2F34] hover:bg-[#2C2F34] hover:text-white rounded-full font-bold transition duration-300"
              >
                {t("home.moreAbout")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ======================================================================
        [ SECTION 4 ] : OUR SERVICES
        Description   : Highlights special offerings such as caterings, 
                        birthdays, weddings, and corporate events.
        ======================================================================
      */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 text-center">
        <span className="text-[#AD343E] text-lg font-bold uppercase tracking-wider">
          {t("home.ourServices")}
        </span>
        <h2
          className="font-['Playfair_Display',serif] text-5xl md:text-6xl font-extrabold text-[#2C2F34] mt-3"
          style={{ marginBottom: "40px" }}
        >
          {t("home.servicesTitle")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((srv, i) => (
            <div
              key={i}
              className="rounded-[32px] border border-gray-150 overflow-hidden hover:shadow-2xl transition duration-300 text-left bg-white flex flex-col group h-full"
            >
              <div className="overflow-hidden h-56 relative bg-gray-50">
                <img
                  src={srv.img}
                  alt={srv.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#2C2F34] group-hover:text-[#AD343E] transition">
                    {srv.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 
        ======================================================================
        [ SECTION 5 ] : DELIVERY
        Description   : Promotes the fast delivery service, best offers, 
                        and visual highlights of fresh food preparation.
        ======================================================================
      */}
      <section className="bg-[#F9F9F7] py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full grid grid-cols-2 gap-4">
            <div className="col-span-1 rounded-3xl overflow-hidden shadow-lg h-[450px]">
              <img
                src={deliveryImg1}
                alt="Chef cooking"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="col-span-1 flex flex-col gap-4">
              <div className="rounded-3xl overflow-hidden shadow-lg h-[217px]">
                <img
                  src={deliveryImg2}
                  alt="Food"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-3xl overflow-hidden shadow-lg h-[217px]">
                <img
                  src={deliveryImg3}
                  alt="Food"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <h2 className="font-['Playfair_Display',serif] text-5xl md:text-6xl font-extrabold text-[#2C2F34]">
              {t("home.fastDelivery")}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t("home.deliveryDesc")}
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <span className="bg-[#AD343E] text-white p-2 rounded-full">
                  <Clock size={16} />
                </span>
                <p className="font-bold">{t("home.delivery30")}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-[#AD343E] text-white p-2 rounded-full">
                  <Sparkles size={16} />
                </span>
                <p className="font-bold">{t("home.bestOffer")}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-[#AD343E] text-white p-2 rounded-full">
                  <Leaf size={16} />
                </span>
                <p className="font-bold">{t("home.onlineServices")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ======================================================================
        [ SECTION 6 ] : TESTIMONIALS
        Description   : Displays customer reviews, ratings, and feedback 
                        to build trust and social proof.
        ======================================================================
      */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 text-center">
        <span className="text-[#AD343E] text-lg font-bold uppercase tracking-wider">
          {t("home.testimonials")}
        </span>
        <h2
          className="font-['Playfair_Display',serif] text-5xl md:text-6xl font-extrabold text-[#2C2F34] mt-3"
          style={{ marginBottom: "40px" }}
        >
          {t("home.whatCustomersSay")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-10 bg-white rounded-[32px] border border-gray-150 flex flex-col justify-between text-left hover:shadow-2xl transition duration-300 relative"
            >
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-500">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <h4 className="font-bold text-lg text-[#AD343E] leading-snug">
                  "{t.quote}"
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-gray-100 pt-6 mt-8">
                <img
                  src={t.avatar}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#AD343E]/20"
                  alt={t.name}
                />
                <div>
                  <h5 className="font-bold text-base text-[#2C2F34]">
                    {t.name}
                  </h5>
                  <span className="text-[11px] font-semibold uppercase text-gray-400 tracking-wider">
                    {t.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 
        ======================================================================
        [ SECTION 7 ] : FROM OUR BLOG
        Description   : Previews the latest articles and news from the blog,
                        featuring a main article and smaller grid items.
        ======================================================================
      */}
      <section className="bg-[#F9F9F7] py-24 px-6">
        <div className="w-[1296px] h-[860px] mx-auto flex flex-col gap-12">
          <div className="flex items-end justify-between">
            <h2 className="font-['Playfair_Display',serif] text-5xl md:text-6xl font-extrabold text-[#2C2F34]">
              {t("home.ourBlog")}
            </h2>
            <Link
              to="/pages"
              className="inline-block px-8 py-4 bg-[#AD343E] hover:bg-[#922730] text-white rounded-full font-bold transition"
            >
              {t("home.readAll")}
            </Link>
          </div>

          <div className="flex items-start gap-8">
            <div className="bg-white rounded-[32px] overflow-hidden shadow-lg flex flex-col w-[636px] h-[732px] flex-shrink-0">
              <div className="h-[366px] w-full">
                <img
                  src={blogPosts[0].img}
                  alt="Main"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-10 flex flex-col justify-center h-[366px]">
                <p className="text-gray-400 text-sm">{blogPosts[0].date}</p>
                <h3 className="text-3xl font-bold text-[#2C2F34] mt-3 leading-tight">
                  {blogPosts[0].title}
                </h3>
                <p className="text-gray-600 mt-5 text-base leading-relaxed">
                  {blogPosts[0].description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {blogPosts.slice(1, 5).map((b, i) => (
                <div
                  key={i}
                  className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 flex flex-col w-[306px] h-[354px]"
                >
                  <div className="h-[177px] w-full">
                    <img
                      src={b.img}
                      alt={b.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-center h-[177px]">
                    <p className="text-gray-400 text-[11px]">{b.date}</p>
                    <h3 className="text-sm font-bold text-[#2C2F34] mt-1.5 leading-snug">
                      {b.title}
                    </h3>
                    <p className="text-gray-500 text-xs mt-3 leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
