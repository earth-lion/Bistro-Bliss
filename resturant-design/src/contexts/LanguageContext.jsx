/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("bistro_lang") || "en"
  );
  const isArabic = language === "ar";

  useEffect(() => {
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = language;
    localStorage.setItem("bistro_lang", language);
  }, [language, isArabic]);

  const toggleLanguage = () => setLanguage((prev) => (prev === "en" ? "ar" : "en"));

  const t = (key) => {
    const keys = key.split(".");
    let val = translations[language];
    for (const k of keys) val = val?.[k];
    return val || key;
  };

  return (
    <LanguageContext.Provider value={{ language, isArabic, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
