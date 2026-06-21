import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import pagesArticles from "../data/pagesData";
import { useLanguage } from "../contexts/LanguageContext";
import { pagesTranslations } from "../data/pagesTranslations";

const PageDetail = () => {
  const { id } = useParams();
  const { language, t, isArabic } = useLanguage();
  const article = pagesArticles.find((item) => item.id === id);
  const relatedArticles = pagesArticles
    .filter((item) => item.id !== id)
    .slice(0, 4);

  if (!article) {
    return (
      <div 
        className="font-['DM_Sans',sans-serif] bg-white min-h-screen text-[#41454C] px-6 py-20"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className="max-w-3xl mx-auto rounded-3xl border border-[#E5E7EB] bg-white p-10 text-center shadow-lg">
          <h1 className="text-3xl font-bold text-[#2C2F34]">
            {t("articles.notFound")}
          </h1>
          <p className="mt-4 text-sm text-[#6B6F75]">
            {t("articles.notFoundDesc")}
          </p>
          <Link
            to="/articles"
            className="mt-8 inline-flex rounded-full bg-[#AD343E] px-8 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-lg shadow-[#AD343E]/20 transition hover:bg-[#922730]"
          >
            {t("articles.backBtn")}
          </Link>
        </div>
      </div>
    );
  }

  const translation = language === "ar" ? pagesTranslations.ar[article.id] : null;
  const displayTitle = translation?.title || article.title;
  const displayExcerpt = translation?.excerpt || article.excerpt;
  const displayCategory = translation?.category || article.category;
  const displayDate = translation?.date || article.date;

  return (
    <div 
      className="font-['DM_Sans',sans-serif] bg-[#fbfaf7] text-[#41454C] overflow-x-hidden"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <PageHeader title={displayTitle} description={displayExcerpt} />

      <section className="py-10 lg:py-14 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-8 lg:gap-12">
          <div className="mx-auto max-w-[1000px] rounded-[40px] overflow-hidden shadow-[0_40px_90px_rgba(0,0,0,0.08)]">
            <img
              src={article.image}
              alt={displayTitle}
              className="h-[420px] w-full object-cover"
            />
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
            <div className="space-y-10">
              {article.content.map((section, index) => {
                const secTranslation = translation?.content?.[index];
                const displayHeading = secTranslation?.heading || section.heading;
                const displayBody = secTranslation?.body || section.body;

                return (
                  <div key={index} className={`space-y-5 ${isArabic ? "text-right" : "text-left"}`}>
                    <h2 className="text-3xl font-['Playfair_Display',serif] font-bold text-[#2C2F34]">
                      {displayHeading}
                    </h2>
                    <p className="text-base leading-8 text-[#6B6F75]">
                      {displayBody}
                    </p>
                  </div>
                );
              })}
            </div>

            <aside className="space-y-8">
              <div className={`rounded-[32px] border border-[#F0E8E4] bg-white p-8 shadow-sm ${isArabic ? "text-right" : "text-left"}`}>
                <p className="text-sm uppercase tracking-[0.28em] text-[#AD343E]">
                  {displayCategory}
                </p>
                <p className="mt-4 text-sm leading-7 text-[#6B6F75]">
                  {displayExcerpt}
                </p>
                <p className="mt-6 text-xs uppercase tracking-[0.3em] text-[#A19C94]">
                  {t("articles.published")} {displayDate}
                </p>
              </div>

              <div className="rounded-[32px] overflow-hidden shadow-xl">
                <img
                  src={article.secondaryImage}
                  alt={displayTitle}
                  className="h-[360px] w-full object-cover"
                />
              </div>
            </aside>
          </div>

          <div className="rounded-[40px] bg-white p-10 shadow-[0_40px_90px_rgba(0,0,0,0.08)]">
            <div className="text-center mb-10">
              <p className="text-sm uppercase tracking-[0.35em] text-[#AD343E]">
                {t("articles.readMore")}
              </p>
              <h2 className="mt-4 text-4xl font-['Playfair_Display',serif] font-bold text-[#2C2F34]">
                {t("articles.kitchenStories")}
              </h2>
            </div>
            <div className="grid gap-8 xl:grid-cols-4 lg:grid-cols-2">
              {relatedArticles.map((item) => {
                const relTranslation = language === "ar" ? pagesTranslations.ar[item.id] : null;
                const displayRelTitle = relTranslation?.title || item.title;
                const displayRelDate = relTranslation?.date || item.date;

                return (
                  <Link
                    key={item.id}
                    to={`/articles/${item.id}`}
                    className="group block overflow-hidden rounded-[32px] border border-[#F0E8E4] bg-[#FBFBFB] transition hover:-translate-y-1"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={displayRelTitle}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className={`p-5 ${isArabic ? "text-right" : "text-left"}`}>
                      <span className="text-[11px] uppercase tracking-[0.32em] text-[#A19C94]">
                        {displayRelDate}
                      </span>
                      <h3 className="mt-3 text-base font-semibold text-[#2C2F34] leading-tight">
                        {displayRelTitle}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageDetail;

