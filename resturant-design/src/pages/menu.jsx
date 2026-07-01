// ==========================================================================
// [1] IMPORTS
// ==========================================================================
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { useLanguage } from "../contexts/LanguageContext";
import { api } from "../services/api";
import PageHeader from "../components/PageHeader";
import { Search, Loader, AlertCircle } from "lucide-react";
import { getFoodImageUrl, resolveAssetImage } from "../utils/imageUtils";

// ==========================================================================
// [2] MAIN COMPONENT: MENU
// ==========================================================================
const Menu = () => {
  const { addToCart, setIsCartOpen } = useApp();
  const { t, isArabic } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeCategoryUrl = searchParams.get("cat") || "All";

  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedItems, setAddedItems] = useState({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const [menuData, categoryData] = await Promise.all([
          api.getMenu(),
          api.getCategories(),
        ]);

        let items = [];
        if (Array.isArray(menuData)) {
          items = menuData;
        } else if (menuData && menuData.data) {
          items = menuData.data;
        }

        setMenuItems(items);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(t("menu.failedFetch"));
      } finally {
        setLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategorySelect = (catName) => {
    setSearchParams(catName === "All" ? {} : { cat: catName });
  };

  const translateCategory = (catName) => {
    const trans = t(`categories.${catName}`);
    return trans.startsWith("categories.") ? catName : trans;
  };

  const translateMenuItemName = (item) => {
    if (!item) return "";
    if (isArabic && item.name_ar) return item.name_ar;
    const name = typeof item === "object" ? item.name : item;
    const trans = t(`menuItems.${name}.name`);
    return trans.startsWith("menuItems.") ? name : trans;
  };

  const translateMenuItemDesc = (item) => {
    if (!item) return "";
    if (isArabic && item.description_ar) return item.description_ar;
    const desc = typeof item === "object" ? item.description : item;
    const name = typeof item === "object" ? item.name : item;
    const trans = t(`menuItems.${name}.description`);
    return trans.startsWith("menuItems.") ? desc : trans;
  };

  // Add to cart — called only from the button (stopPropagation prevents card click)
  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    const resolvedImage =
      parseInt(item.id, 10) >= 1 && parseInt(item.id, 10) <= 27
        ? getFoodImageUrl(item.id)
        : item.image_url || resolveAssetImage(item.image);
    addToCart({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: resolvedImage,
    });
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(
      () => setAddedItems((prev) => ({ ...prev, [item.id]: false })),
      1500,
    );
    setTimeout(() => setIsCartOpen(true), 400);
  };

  // Open detail page — called when clicking the card or image
  const handleCardClick = (item) => {
    navigate(`/menu/${item.id}`);
  };

  const filteredItems = menuItems.filter((item) => {
    const catName = item.category?.name?.toLowerCase() || "";
    const urlCat = activeCategoryUrl.toLowerCase();

    let matchesCategory;
    if (urlCat === "all") {
      matchesCategory = true;
    } else if (urlCat === "breakfast") {
      matchesCategory = catName === "burgers";
    } else if (urlCat === "main dishes") {
      matchesCategory = catName === "pizza" || catName === "pasta";
    } else {
      matchesCategory = catName === urlCat;
    }

    const matchesSearch =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className="font-['DM_Sans',sans-serif] bg-white text-[#41454C] min-h-screen text-start"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <PageHeader title={t("menu.title")} description={t("menu.desc")} />

      {/* CATEGORIES & SEARCH */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        {error && (
          <div className="p-5 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200 flex items-center justify-between">
            <span className="text-sm font-semibold flex items-center gap-2">
              <AlertCircle size={18} /> {error}
            </span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-gray-200 pb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCategorySelect("All")}
              className={`px-6 py-3 rounded-full text-sm font-bold transition ${activeCategoryUrl === "All" ? "bg-[#AD343E] text-white" : "bg-[#F9F9F7] hover:bg-gray-100"}`}
            >
              {t("menu.allDishes")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.name)}
                className={`px-6 py-3 rounded-full text-sm font-bold transition ${activeCategoryUrl === cat.name ? "bg-[#AD343E] text-white" : "bg-[#F9F9F7] hover:bg-gray-100"}`}
              >
                {translateCategory(cat.name)}
              </button>
            ))}
          </div>

          <div className="relative max-w-sm w-full">
            <Search
              className={`absolute ${isArabic ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("menu.searchPlaceholder")}
              className={`w-full ${isArabic ? "pr-11 pl-4 text-right" : "pl-11 pr-4 text-left"} py-3 rounded-full border border-gray-200 bg-[#F9F9F7] text-sm focus:outline-none focus:border-[#AD343E] focus:bg-white transition`}
            />
          </div>
        </div>

        {/* MENU ITEMS GRID */}
        {loading ? (
          <div className="h-72 flex items-center justify-center">
            <Loader className="animate-spin text-[#AD343E]" size={48} />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center text-center gap-3 bg-[#F9F9F7] rounded-[32px] border border-gray-200">
            <h3 className="text-lg font-bold">{t("menu.noItems")}</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="bg-white rounded-[32px] border border-gray-200 p-4 hover:shadow-xl transition cursor-pointer group"
              >
                {/* Image — clicking also triggers card click (already handled by parent div) */}
                <div className="h-48 overflow-hidden rounded-2xl mb-4 relative">
                  <img
                    src={
                      parseInt(item.id, 10) >= 1 && parseInt(item.id, 10) <= 27
                        ? getFoodImageUrl(item.id)
                        : item.image_url || resolveAssetImage(item.image)
                    }
                    alt={translateMenuItemName(item)}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getFoodImageUrl(null);
                    }}
                  />
                  {/* Hover overlay hint */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300 rounded-2xl flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-[#2C2F34] text-xs font-bold px-3 py-1 rounded-full transition duration-300">
                      {isArabic ? "عرض التفاصيل" : "View Details"}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-lg">
                  {translateMenuItemName(item)}
                </h3>
                <p className="text-gray-500 text-xs mb-4 line-clamp-2">
                  {translateMenuItemDesc(item)}
                </p>

                {/* Add to Cart button — stopPropagation prevents navigating to detail */}
                <button
                  onClick={(e) => handleAddToCart(e, item)}
                  className={`w-full py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                    addedItems[item.id]
                      ? "bg-green-500 text-white"
                      : "bg-[#AD343E] hover:bg-[#922730] text-white"
                  }`}
                >
                  {addedItems[item.id]
                    ? t("menu.added")
                    : `${t("menu.addToCart")} — $${parseFloat(item.price || 0).toFixed(2)}`}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ORDERING APPS SECTION */}
      <section className="bg-[#F9F9F7] py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 text-center lg:text-start">
            <h3 className="font-['Playfair_Display',serif] text-5xl font-extrabold text-[#2C2F34]">
              {t("menu.orderApps")}
            </h3>
            <p className="text-gray-500 leading-relaxed max-w-sm mx-auto lg:mx-0">
              {t("menu.orderAppsDesc")}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "Uber Eats", color: "text-green-600" },
              { name: "GRUBHUB", color: "text-orange-500" },
              { name: "Postmates", color: "text-amber-600" },
              { name: "DOORDASH", color: "text-red-500" },
              { name: "foodpanda", color: "text-pink-500" },
              { name: "deliveroo", color: "text-teal-500" },
              { name: "instacart", color: "text-green-500" },
              { name: "JUST EAT", color: "text-red-600" },
              { name: "DiDi Food", color: "text-orange-400" },
            ].map((app, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-lg transition-shadow duration-300"
              >
                <span className={`font-black text-lg ${app.color}`}>
                  {app.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Menu;
