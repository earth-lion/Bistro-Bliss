import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import pagesArticles from "../data/pagesData";
import { useLanguage } from "../contexts/LanguageContext";
import { pagesTranslations } from "../data/pagesTranslations";

const Pages = () => {
  const { language, t, isArabic } = useLanguage();

  return (
    <div 
      className="font-['DM_Sans',sans-serif] bg-[#fbfaf7] text-[#41454C] overflow-x-hidden"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <PageHeader
        title={t("articles.title")}
        description={t("articles.desc")}
      />

      <section className="py-16 lg:py-20 px-6 lg:px-8 max-w-[1340px] mx-auto">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {pagesArticles.map((article) => {
            const translation = language === "ar" ? pagesTranslations.ar[article.id] : null;
            const displayTitle = translation?.title || article.title;
            const displayDate = translation?.date || article.date;

            return (
              <Link
                key={article.id}
                to={`/articles/${article.id}`}
                className="group block overflow-hidden rounded-[32px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1"
              >
                <div className="h-56 overflow-hidden rounded-t-[32px] bg-[#f5f3ef]">
                  <img
                    src={article.image}
                    alt={displayTitle}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className={`p-6 ${isArabic ? "text-right" : "text-left"}`}>
                  <span className="text-[11px] uppercase tracking-[0.3em] text-[#A19C94]">
                    {displayDate}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-[#2C2F34] leading-tight">
                    {displayTitle}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Pages;

