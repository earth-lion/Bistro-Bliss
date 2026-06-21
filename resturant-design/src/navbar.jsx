import { useState } from "react";
import NotificationBell from "./components/NotificationBell";
import { Link, NavLink } from "react-router-dom";
import { useApp } from "./contexts/AppContext";
import { useLanguage } from "./contexts/LanguageContext";
import { IoCallOutline, IoMailOutline } from "react-icons/io5";
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaShieldAlt,
  FaSun,
  FaMoon,
} from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount, setIsCartOpen, isAuthenticated, isAdmin, logoutUser, darkMode, toggleDarkMode } = useApp();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        .bistro-nav-header {
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
          background: #ffffff;
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .bistro-nav-header * { box-sizing: border-box; margin: 0; padding: 0; }

        .bistro-nav-top-bar {
          background-color: #2c302e;
          color: #ffffff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 60px;
          font-size: 14.5px;
          min-height: 46px;
        }
        .bistro-nav-contact-info { display: flex; align-items: center; gap: 28px; }
        .bistro-nav-contact-item {
          display: flex; align-items: center; gap: 10px;
          color: #f4f3ec; text-decoration: none;
          transition: color 0.2s ease; font-weight: 400;
        }
        .bistro-nav-contact-item:hover { color: #dbdfd0; }
        .bistro-nav-contact-icon { font-size: 17px; display: flex; align-items: center; }

        /* Language Toggle Button */
        .bistro-lang-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.1);
          border: 1.5px solid rgba(255,255,255,0.25);
          border-radius: 20px;
          padding: 5px 14px;
          cursor: pointer;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.5px;
          transition: all 0.25s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .bistro-lang-btn:hover {
          background: rgba(255,255,255,0.2);
          border-color: rgba(255,255,255,0.5);
          transform: scale(1.03);
        }
        .bistro-lang-btn .lang-active { color: #AD343E; background: #fff; border-radius: 10px; padding: 1px 7px; }
        .bistro-lang-btn .lang-sep { opacity: 0.5; margin: 0 2px; }
        .bistro-lang-btn .lang-inactive { opacity: 0.7; }

        .bistro-nav-social-links { display: flex; align-items: center; gap: 10px; }
        .bistro-nav-social-icon {
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 50%;
          background-color: rgba(255,255,255,0.08);
          color: #ffffff; text-decoration: none; font-size: 13.5px;
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .bistro-nav-social-icon:hover { background-color: rgba(255,255,255,0.22); transform: translateY(-2px); }

        .bistro-nav-main-nav {
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 60px; background: #ffffff; position: relative;
        }
        .bistro-nav-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; color: #2c302e; }
        .bistro-nav-logo-text {
          font-family: 'Playfair Display', serif; font-size: 32px;
          font-weight: 700; color: #2c302e; letter-spacing: -0.5px; font-style: italic;
        }
        .bistro-nav-links-container { display: flex; align-items: center; gap: 8px; list-style: none; }
        .bistro-nav-link-item { display: block; }
        .bistro-nav-link {
          display: block; color: #2c302e; text-decoration: none; font-weight: 500;
          font-size: 16px; padding: 8px 20px; border-radius: 30px; transition: all 0.25s ease; cursor: pointer;
        }
        .bistro-nav-link:hover { color: #AD343E; background-color: rgba(173,52,62,0.04); }
        .bistro-nav-link.active { background-color: #dbdfd0; color: #2c302e; font-weight: 700; }
        .bistro-nav-right-actions { display: flex; align-items: center; gap: 15px; }
        .bistro-nav-cart-btn {
          position: relative; display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid #e5e7eb;
          background: #ffffff; color: #2c302e; cursor: pointer; transition: all 0.2s ease;
        }
        .bistro-nav-cart-btn:hover { border-color: #AD343E; color: #AD343E; background-color: rgba(173,52,62,0.03); }
        .bistro-nav-cart-badge {
          position: absolute; top: -4px; right: -4px; background-color: #AD343E;
          color: #ffffff; font-size: 11px; font-weight: 750; width: 20px; height: 20px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff;
        }
        .bistro-nav-book-btn {
          font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 16px;
          color: #2c302e; background: transparent; border: 1.5px solid #2c302e;
          border-radius: 30px; padding: 10px 26px; cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25,0.8,0.25,1); outline: none; text-decoration: none;
        }
        .bistro-nav-book-btn:hover { background-color: #2c302e; color: #ffffff; transform: translateY(-1px); box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .bistro-nav-auth-link { display: flex; align-items: center; gap: 6px; color: #2c302e; text-decoration: none; font-weight: 600; font-size: 15px; transition: color 0.2s; }
        .bistro-nav-auth-link:hover { color: #AD343E; }
        .bistro-nav-hamburger {
          display: none; flex-direction: column; justify-content: space-between;
          width: 24px; height: 18px; background: transparent; border: none; cursor: pointer; padding: 0; z-index: 1001;
        }
        .bistro-nav-hamburger span { width: 100%; height: 2px; background-color: #2c302e; transition: all 0.3s ease; }
        .bistro-nav-hamburger.bistro-nav-open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .bistro-nav-hamburger.bistro-nav-open span:nth-child(2) { opacity: 0; }
        .bistro-nav-hamburger.bistro-nav-open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
        .bistro-nav-mobile-menu {
          display: none; position: absolute; top: 100%; left: 0; width: 100%;
          background: #ffffff; padding: 20px 40px; box-shadow: 0 10px 15px rgba(0,0,0,0.05);
          flex-direction: column; gap: 20px; border-top: 1px solid #f4f3ec;
          opacity: 0; transform: translateY(-10px); transition: all 0.3s ease;
          pointer-events: none; z-index: 999;
        }
        .bistro-nav-mobile-menu.bistro-nav-open { display: flex; opacity: 1; transform: translateY(0); pointer-events: auto; }
        .bistro-nav-mobile-links { display: flex; flex-direction: column; gap: 12px; list-style: none; }
        .bistro-nav-mobile-link {
          display: block; color: #2c302e; text-decoration: none; font-weight: 500;
          font-size: 18px; padding: 10px 20px; border-radius: 20px; transition: all 0.2s ease; cursor: pointer;
        }
        .bistro-nav-mobile-link:hover { color: #AD343E; background-color: rgba(173,52,62,0.04); }
        .bistro-nav-mobile-link.active { background-color: #dbdfd0; color: #2c302e; font-weight: 700; }

        @media (max-width: 1100px) {
          .bistro-nav-top-bar { padding: 12px 30px; }
          .bistro-nav-main-nav { padding: 18px 30px; }
        }
        @media (max-width: 900px) {
          .bistro-nav-links-container { display: none; }
          .bistro-nav-hamburger { display: flex; }
          .bistro-nav-mobile-menu { display: flex; }
        }
        @media (max-width: 600px) {
          .bistro-nav-top-bar { flex-direction: column; gap: 12px; text-align: center; padding: 12px 20px; }
          .bistro-nav-contact-info { flex-direction: column; gap: 10px; }
        }

        .bistro-nav-theme-btn {
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid #e5e7eb;
          background: #ffffff; color: #2c302e; cursor: pointer; transition: all 0.2s ease;
        }
        .bistro-nav-theme-btn:hover { border-color: #AD343E; color: #AD343E; background-color: rgba(173,52,62,0.03); }

        /* Dark Mode Overrides for Navbar Elements */
        html.dark .bistro-nav-header {
          background-color: #1a1c1e !important;
          border-bottom: 1.5px solid #2a2d31;
        }
        html.dark .bistro-nav-main-nav {
          background-color: #1a1c1e !important;
        }
        html.dark .bistro-nav-logo-text {
          color: #f8fafc !important;
        }
        html.dark .bistro-nav-logo svg line {
          stroke: #f8fafc !important;
        }
        html.dark .bistro-nav-link {
          color: #cbd5e1 !important;
        }
        html.dark .bistro-nav-link:hover {
          color: #ff4d5a !important;
          background-color: rgba(255,77,90,0.05) !important;
        }
        html.dark .bistro-nav-link.active {
          background-color: #2a2d31 !important;
          color: #f8fafc !important;
        }
        html.dark .bistro-nav-cart-btn,
        html.dark .bistro-nav-theme-btn {
          background: #1e2022 !important;
          border-color: #383d42 !important;
          color: #cbd5e1 !important;
        }
        html.dark .bistro-nav-cart-btn:hover,
        html.dark .bistro-nav-theme-btn:hover {
          color: #ff4d5a !important;
          border-color: #ff4d5a !important;
          background-color: rgba(255,77,90,0.05) !important;
        }
        html.dark .bistro-nav-cart-badge {
          border-color: #1e2022 !important;
        }
        html.dark .bistro-nav-book-btn {
          color: #cbd5e1 !important;
          border-color: #cbd5e1 !important;
        }
        html.dark .bistro-nav-book-btn:hover {
          background-color: #cbd5e1 !important;
          color: #121212 !important;
        }
        html.dark .bistro-nav-auth-link {
          color: #cbd5e1 !important;
        }
        html.dark .bistro-nav-auth-link:hover {
          color: #ff4d5a !important;
        }
        html.dark .bistro-nav-hamburger span {
          background-color: #cbd5e1 !important;
        }
        html.dark .bistro-nav-mobile-menu {
          background-color: #1a1c1e !important;
          border-top-color: #2a2d31 !important;
        }
        html.dark .bistro-nav-mobile-link {
          color: #cbd5e1 !important;
        }
        html.dark .bistro-nav-mobile-link:hover {
          color: #ff4d5a !important;
          background-color: rgba(255,77,90,0.05) !important;
        }
        html.dark .bistro-nav-mobile-link.active {
          background-color: #2a2d31 !important;
          color: #f8fafc !important;
        }
      `}</style>

      <header className="bistro-nav-header">

        {/* TOP BAR */}
        <div className="bistro-nav-top-bar">
          <div className="bistro-nav-contact-info">
            <a href="tel:4148570107" className="bistro-nav-contact-item">
              <span className="bistro-nav-contact-icon"><IoCallOutline /></span>
              <span>(414) 857 - 0107</span>
            </a>
            <a href="mailto:yummy@bistrobliss" className="bistro-nav-contact-item">
              <span className="bistro-nav-contact-icon"><IoMailOutline /></span>
              <span>yummy@bistrobliss</span>
            </a>
          </div>

          {/* Language Toggle Button — center of top bar */}
          <button className="bistro-lang-btn" onClick={toggleLanguage} aria-label="Toggle Language">
            <span className={language === "en" ? "lang-active" : "lang-inactive"}>EN</span>
            <span className="lang-sep">|</span>
            <span className={language === "ar" ? "lang-active" : "lang-inactive"}>AR</span>
          </button>

          <div className="bistro-nav-social-links">
            <a href="#" className="bistro-nav-social-icon"><FaTwitter /></a>
            <a href="#" className="bistro-nav-social-icon"><FaFacebookF /></a>
            <a href="#" className="bistro-nav-social-icon"><FaInstagram /></a>
            <a href="#" className="bistro-nav-social-icon"><FaGithub /></a>
          </div>
        </div>

        {/* MAIN NAV */}
        <div className="bistro-nav-main-nav">
          <Link to="/" className="bistro-nav-logo">
            <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 45 C15 75, 85 75, 85 45 Z" stroke="#AD343E" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M38 73 L32 82 C32 84, 68 84, 68 82 L62 73" stroke="#AD343E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <line x1="80" y1="12" x2="40" y2="60" stroke="#2c302e" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="88" y1="18" x2="48" y2="66" stroke="#2c302e" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M28 35 C28 25, 34 25, 34 15" stroke="#AD343E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M48 35 C48 20, 54 20, 54 10" stroke="#AD343E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M68 35 C68 25, 74 25, 74 15" stroke="#AD343E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </svg>
            <span className="bistro-nav-logo-text">Bistro Bliss</span>
          </Link>

          <ul className="bistro-nav-links-container">
            <li className="bistro-nav-link-item"><NavLink to="/" className="bistro-nav-link" end>{t("nav.home")}</NavLink></li>
            <li className="bistro-nav-link-item"><NavLink to="/about" className="bistro-nav-link">{t("nav.about")}</NavLink></li>
            <li className="bistro-nav-link-item"><NavLink to="/menu" className="bistro-nav-link">{t("nav.menu")}</NavLink></li>
            <li className="bistro-nav-link-item"><NavLink to="/articles" className="bistro-nav-link">{t("nav.pages")}</NavLink></li>
            <li className="bistro-nav-link-item"><NavLink to="/contact" className="bistro-nav-link">{t("nav.contact")}</NavLink></li>
            {isAdmin && (
              <li className="bistro-nav-link-item">
                <NavLink to="/admin" className="bistro-nav-link text-red-600 font-bold" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <FaShieldAlt size={13} /> {t("nav.admin")}
                </NavLink>
              </li>
            )}
          </ul>

          <div className="bistro-nav-right-actions">
            <button
              className="bistro-nav-theme-btn"
              onClick={toggleDarkMode}
              aria-label={darkMode ? t("nav.themeLight") : t("nav.themeDark")}
              title={darkMode ? t("nav.themeLight") : t("nav.themeDark")}
            >
              {darkMode ? <FaSun size={17} /> : <FaMoon size={17} />}
            </button>

            <button className="bistro-nav-cart-btn" onClick={() => setIsCartOpen(true)} aria-label="View Shopping Cart">
              <FaShoppingCart size={17} />
              {cartCount > 0 && <span className="bistro-nav-cart-badge">{cartCount}</span>}
            </button>

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-4">
                <NotificationBell />
                <Link to="/profile" className="bistro-nav-auth-link" title="My Profile">
                  <FaUser size={15} />
                  <span>{t("nav.dashboard")}</span>
                </Link>
                <button onClick={logoutUser} className="p-2.5 rounded-full border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 transition" title={t("nav.logout")}>
                  <FaSignOutAlt size={15} />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="hidden sm:flex bistro-nav-auth-link">
                <FaUser size={14} />
                <span>{t("nav.login")}</span>
              </Link>
            )}

            <Link to="/book" className="hidden md:block bistro-nav-book-btn">{t("nav.bookTable")}</Link>

            <button
              className={`bistro-nav-hamburger ${isOpen ? "bistro-nav-open" : ""}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Navigation Menu"
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div className={`bistro-nav-mobile-menu ${isOpen ? "bistro-nav-open" : ""}`}>
          <ul className="bistro-nav-mobile-links">
            <li><NavLink to="/" className="bistro-nav-mobile-link" onClick={() => setIsOpen(false)} end>{t("nav.home")}</NavLink></li>
            <li><NavLink to="/about" className="bistro-nav-mobile-link" onClick={() => setIsOpen(false)}>{t("nav.about")}</NavLink></li>
            <li><NavLink to="/menu" className="bistro-nav-mobile-link" onClick={() => setIsOpen(false)}>{t("nav.menu")}</NavLink></li>
            <li><NavLink to="/articles" className="bistro-nav-mobile-link" onClick={() => setIsOpen(false)}>{t("nav.pages")}</NavLink></li>
            <li><NavLink to="/contact" className="bistro-nav-mobile-link" onClick={() => setIsOpen(false)}>{t("nav.contact")}</NavLink></li>
            {isAdmin && (
              <li>
                <NavLink to="/admin" className="bistro-nav-mobile-link text-red-600 font-bold" onClick={() => setIsOpen(false)}>
                  {t("nav.adminPanel")}
                </NavLink>
              </li>
            )}
            {isAuthenticated ? (
              <>
                <li><NavLink to="/profile" className="bistro-nav-mobile-link" onClick={() => setIsOpen(false)}>{t("nav.myDashboard")}</NavLink></li>
                <li>
                  <button onClick={() => { logoutUser(); setIsOpen(false); }} className="bistro-nav-mobile-link text-left w-full text-red-500 font-semibold">
                    {t("nav.logout")}
                  </button>
                </li>
              </>
            ) : (
              <li><NavLink to="/auth" className="bistro-nav-mobile-link font-semibold" onClick={() => setIsOpen(false)}>{t("nav.loginRegister")}</NavLink></li>
            )}
          </ul>
          <Link to="/book" className="bistro-nav-book-btn" style={{ display: "block", width: "100%", marginTop: "10px", textAlign: "center" }} onClick={() => setIsOpen(false)}>
            {t("nav.bookTable")}
          </Link>
        </div>
      </header>
    </>
  );
};

export default Navbar;
