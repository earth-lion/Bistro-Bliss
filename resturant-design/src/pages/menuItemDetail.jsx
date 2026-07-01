// ==========================================================================
// [1] IMPORTS
// ==========================================================================
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { useLanguage } from "../contexts/LanguageContext";
import { api } from "../services/api";
import {
  ShoppingCart,
  ArrowLeft,
  Flame,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import { getFoodImageUrl, resolveAssetImage } from "../utils/imageUtils";

// ==========================================================================
// [2] ADD-ONS DATA — tailored per product category
// ==========================================================================
const addonsByCategory = {
  burgers: {
    en: [
      { id: "b1", name: "Extra Cheese", price: 0.99, icon: "🧀" },
      { id: "b2", name: "Bacon Strips", price: 1.49, icon: "🥓" },
      { id: "b3", name: "Fried Egg", price: 0.79, icon: "🍳" },
      { id: "b4", name: "BBQ Sauce", price: 0.49, icon: "🔥" },
      { id: "b5", name: "Jalapeños", price: 0.49, icon: "🌶️" },
      { id: "b6", name: "Avocado", price: 1.29, icon: "🥑" },
    ],
    ar: [
      { id: "b1", name: "جبن إضافي", price: 0.99, icon: "🧀" },
      { id: "b2", name: "شرائح بيكون", price: 1.49, icon: "🥓" },
      { id: "b3", name: "بيض مقلي", price: 0.79, icon: "🍳" },
      { id: "b4", name: "صوص BBQ", price: 0.49, icon: "🔥" },
      { id: "b5", name: "هالابينيو", price: 0.49, icon: "🌶️" },
      { id: "b6", name: "أفوكادو", price: 1.29, icon: "🥑" },
    ],
  },
  pizza: {
    en: [
      { id: "p1", name: "Extra Mozzarella", price: 1.29, icon: "🧀" },
      { id: "p2", name: "Mushrooms", price: 0.79, icon: "🍄" },
      { id: "p3", name: "Black Olives", price: 0.69, icon: "⚫" },
      { id: "p4", name: "Bell Peppers", price: 0.69, icon: "🥬" },
      { id: "p5", name: "Stuffed Crust", price: 1.99, icon: "🍕" },
      { id: "p6", name: "Garlic Butter", price: 0.59, icon: "🧄" },
    ],
    ar: [
      { id: "p1", name: "موتزاريلا إضافية", price: 1.29, icon: "🧀" },
      { id: "p2", name: "مشروم", price: 0.79, icon: "🍄" },
      { id: "p3", name: "زيتون أسود", price: 0.69, icon: "⚫" },
      { id: "p4", name: "فلفل ملون", price: 0.69, icon: "🥬" },
      { id: "p5", name: "حواف محشوة", price: 1.99, icon: "🍕" },
      { id: "p6", name: "زبدة ثوم", price: 0.59, icon: "🧄" },
    ],
  },
  pasta: {
    en: [
      { id: "pa1", name: "Grilled Shrimp", price: 2.49, icon: "🦐" },
      { id: "pa2", name: "Grilled Chicken", price: 1.99, icon: "🍗" },
      { id: "pa3", name: "Marinara Sauce", price: 0.79, icon: "🍅" },
      { id: "pa4", name: "Alfredo Sauce", price: 0.99, icon: "🥛" },
      { id: "pa5", name: "Extra Parmesan", price: 0.69, icon: "🧀" },
      { id: "pa6", name: "Garlic Bread", price: 1.49, icon: "🍞" },
    ],
    ar: [
      { id: "pa1", name: "روبيان مشوي", price: 2.49, icon: "🦐" },
      { id: "pa2", name: "دجاج مشوي", price: 1.99, icon: "🍗" },
      { id: "pa3", name: "صوص مارينارا", price: 0.79, icon: "🍅" },
      { id: "pa4", name: "صوص ألفريدو", price: 0.99, icon: "🥛" },
      { id: "pa5", name: "بارميزان إضافي", price: 0.69, icon: "🧀" },
      { id: "pa6", name: "خبز بالثوم", price: 1.49, icon: "🍞" },
    ],
  },
  drinks: {
    en: [
      { id: "d1", name: "Small Size", price: -1.0, icon: "🥤" },
      { id: "d2", name: "Large Size", price: 1.0, icon: "🍹" },
      { id: "d3", name: "Extra Ice", price: 0.0, icon: "🧊" },
      { id: "d4", name: "Vanilla Flavor", price: 0.49, icon: "🌿" },
      { id: "d5", name: "Caramel Drizzle", price: 0.59, icon: "🍯" },
      { id: "d6", name: "Oat Milk", price: 0.79, icon: "🥛" },
    ],
    ar: [
      { id: "d1", name: "حجم صغير", price: -1.0, icon: "🥤" },
      { id: "d2", name: "حجم كبير", price: 1.0, icon: "🍹" },
      { id: "d3", name: "ثلج إضافي", price: 0.0, icon: "🧊" },
      { id: "d4", name: "نكهة فانيليا", price: 0.49, icon: "🌿" },
      { id: "d5", name: "كراميل", price: 0.59, icon: "🍯" },
      { id: "d6", name: "حليب الشوفان", price: 0.79, icon: "🥛" },
    ],
  },
  desserts: {
    en: [
      { id: "ds1", name: "Vanilla Ice Cream", price: 1.29, icon: "🍦" },
      { id: "ds2", name: "Caramel Sauce", price: 0.59, icon: "🍯" },
      { id: "ds3", name: "Fresh Strawberries", price: 0.99, icon: "🍓" },
      { id: "ds4", name: "Whipped Cream", price: 0.49, icon: "🍫" },
      { id: "ds5", name: "Chocolate Drizzle", price: 0.59, icon: "🍫" },
      { id: "ds6", name: "Crushed Nuts", price: 0.79, icon: "🥜" },
    ],
    ar: [
      { id: "ds1", name: "آيسكريم فانيليا", price: 1.29, icon: "🍦" },
      { id: "ds2", name: "صوص كراميل", price: 0.59, icon: "🍯" },
      { id: "ds3", name: "فراولة طازجة", price: 0.99, icon: "🍓" },
      { id: "ds4", name: "كريمة مخفوقة", price: 0.49, icon: "🍫" },
      { id: "ds5", name: "شوكولاتة سائلة", price: 0.59, icon: "🍫" },
      { id: "ds6", name: "مكسرات مطحونة", price: 0.79, icon: "🥜" },
    ],
  },
  default: {
    en: [
      { id: "g1", name: "Side Salad", price: 1.49, icon: "🥗" },
      { id: "g2", name: "French Fries", price: 1.99, icon: "🍟" },
      { id: "g3", name: "Ketchup Sauce", price: 0.29, icon: "🍅" },
      { id: "g4", name: "Extra Napkins", price: 0.0, icon: "🧻" },
    ],
    ar: [
      { id: "g1", name: "سلطة جانبية", price: 1.49, icon: "🥗" },
      { id: "g2", name: "بطاطا مقلية", price: 1.99, icon: "🍟" },
      { id: "g3", name: "صوص كيتشب", price: 0.29, icon: "🍅" },
      { id: "g4", name: "مناديل إضافية", price: 0.0, icon: "🧻" },
    ],
  },
};

// Mock ingredients/calories by category
const mockDetailsByCategory = {
  burgers: {
    calories: 650,
    ingredients: {
      en: "Beef patty, brioche bun, lettuce, tomato, onion, pickles, cheddar cheese, special house sauce",
      ar: "قرصة لحم بقري، خبز بريوش، خس، طماطم، بصل، مخللات، جبن شيدر، صوص البيت الخاص",
    },
  },
  pizza: {
    calories: 780,
    ingredients: {
      en: "Sourdough crust, San Marzano tomato sauce, mozzarella, fresh basil, olive oil",
      ar: "عجينة محمضة، صوص طماطم سان مارزانو، موتزاريلا، ريحان طازج، زيت زيتون",
    },
  },
  pasta: {
    calories: 580,
    ingredients: {
      en: "Durum wheat pasta, tomato basil sauce, parmesan cheese, garlic, fresh herbs",
      ar: "معكرونة قمح دريم، صوص طماطم وريحان، جبن بارميزان، ثوم، أعشاب طازجة",
    },
  },
  drinks: {
    calories: 180,
    ingredients: {
      en: "Fresh fruits, ice, natural sweeteners, filtered water or milk base",
      ar: "فواكه طازجة، ثلج، محليات طبيعية، ماء مفلتر أو قاعدة حليب",
    },
  },
  desserts: {
    calories: 420,
    ingredients: {
      en: "Flour, sugar, butter, eggs, vanilla extract, chocolate chips",
      ar: "دقيق، سكر، زبدة، بيض، خلاصة فانيليا، رقائق شوكولاتة",
    },
  },
  default: {
    calories: 350,
    ingredients: {
      en: "Fresh, locally sourced seasonal ingredients prepared daily by our chefs.",
      ar: "مكونات طازجة موسمية يومية من مصادر محلية يُعدها طهاتنا.",
    },
  },
};

// ==========================================================================
// [3] HELPER — get category key from item category name
// ==========================================================================
const getCategoryKey = (categoryName) => {
  if (!categoryName) return "default";
  const name = categoryName.toLowerCase();
  if (name.includes("burger")) return "burgers";
  if (name.includes("pizza")) return "pizza";
  if (name.includes("pasta")) return "pasta";
  if (
    name.includes("drink") ||
    name.includes("beverage") ||
    name.includes("juice") ||
    name.includes("coffee")
  )
    return "drinks";
  if (
    name.includes("dessert") ||
    name.includes("sweet") ||
    name.includes("cake")
  )
    return "desserts";
  return "default";
};

// ==========================================================================
// [4] MAIN COMPONENT: MENU ITEM DETAIL
// ==========================================================================
const MenuItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useApp();
  const { language, isArabic, t } = useLanguage();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true);
      try {
        const data = await api.getMenu();
        const items = Array.isArray(data) ? data : data?.data || [];
        const found = items.find((i) => String(i.id) === String(id));
        setItem(found || null);
      } catch (err) {
        console.error("Failed to load item:", err);
      } finally {
        setLoading(false);
      }
    };
    loadItem();
  }, [id]);

  const categoryKey = getCategoryKey(item?.category?.name);
  const addons =
    addonsByCategory[categoryKey]?.[language] ||
    addonsByCategory.default[language];
  const mockDetails =
    mockDetailsByCategory[categoryKey] || mockDetailsByCategory.default;

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

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon],
    );
  };

  const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const basePrice = parseFloat(item?.price || 0);
  const totalPrice = (basePrice + addonTotal) * quantity;

  const handleAddToCart = () => {
    const resolvedImage =
      parseInt(item.id, 10) >= 1 && parseInt(item.id, 10) <= 27
        ? getFoodImageUrl(item.id)
        : item.image_url || resolveAssetImage(item.image);
    addToCart({
      id: item.id,
      name: item.name,
      price: basePrice + addonTotal,
      image: resolvedImage,
      quantity,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setIsCartOpen(true);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#AD343E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <span className="text-5xl">🍽️</span>
        <h2 className="text-2xl font-bold text-[#2C2F34]">Item not found</h2>
        <button
          onClick={() => navigate("/menu")}
          className="mt-4 px-6 py-3 bg-[#AD343E] text-white rounded-full font-bold"
        >
          {t("detail.backToMenu")}
        </button>
      </div>
    );
  }

  const imageUrl =
    parseInt(item.id, 10) >= 1 && parseInt(item.id, 10) <= 27
      ? getFoodImageUrl(item.id)
      : item.image_url || resolveAssetImage(item.image);

  return (
    <div
      className={`font-['DM_Sans',sans-serif] bg-white text-[#2C2F34] min-h-screen`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <style>{`
        .detail-addon-card {
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          padding: 14px 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 6px;
          background: #fff;
          position: relative;
        }
        .detail-addon-card:hover { border-color: #AD343E; background: rgba(173,52,62,0.03); }
        .detail-addon-card.selected { border-color: #AD343E; background: rgba(173,52,62,0.06); }
        .detail-addon-icon {
          font-size: 2rem;
          line-height: 1;
          display: block;
        }
        .detail-addon-check {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 20px; height: 20px; border-radius: 50%; border: 2px solid #e5e7eb;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.2s;
          background: #fff;
        }
        .detail-addon-card.selected .detail-addon-check { background: #AD343E; border-color: #AD343E; }
        .qty-btn {
          width: 36px; height: 36px; border-radius: 50%; border: 2px solid #e5e7eb;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; background: #fff;
          color: #2C2F34; font-size: 18px; font-weight: bold;
        }
        .qty-btn:hover { border-color: #AD343E; color: #AD343E; }
        @keyframes popIn { 0%{transform:scale(0.9);opacity:0} 100%{transform:scale(1);opacity:1} }
        .pop-in { animation: popIn 0.25s ease forwards; }
      `}</style>

      {/* BACK BUTTON */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#AD343E] font-bold hover:underline text-sm"
        >
          {isArabic ? (
            <ArrowLeft className="rotate-180" size={16} />
          ) : (
            <ArrowLeft size={16} />
          )}
          {t("detail.backToMenu")}
        </button>
      </div>

      {/* MAIN DETAIL SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* LEFT: Image */}
        <div className="relative rounded-[32px] overflow-hidden shadow-2xl bg-[#F9F9F7] h-[420px] lg:h-[520px]">
          <img
            src={imageUrl}
            alt={translateMenuItemName(item)}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getFoodImageUrl(null);
            }}
          />
          {/* Category badge */}
          {item.category?.name && (
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#AD343E] font-bold text-xs px-4 py-2 rounded-full shadow">
              {translateCategory(item.category.name)}
            </span>
          )}
        </div>

        {/* RIGHT: Info */}
        <div className="space-y-6">
          <div>
            <h1 className="font-['Playfair_Display',serif] text-4xl font-extrabold text-[#2C2F34] leading-tight">
              {translateMenuItemName(item)}
            </h1>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-3xl font-extrabold text-[#AD343E]">
                ${basePrice.toFixed(2)}
              </span>
              <span className="flex items-center gap-1 text-orange-500 font-semibold text-sm bg-orange-50 px-3 py-1 rounded-full">
                <Flame size={14} /> {mockDetails.calories} {t("detail.kcal")}
              </span>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div>
              <h3 className="font-bold text-[#2C2F34] text-sm uppercase tracking-wider mb-2">
                {t("detail.description")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {translateMenuItemDesc(item)}
              </p>
            </div>
          )}

          {/* Ingredients */}
          <div className="bg-[#F9F9F7] rounded-2xl p-5">
            <h3 className="font-bold text-[#2C2F34] text-sm uppercase tracking-wider mb-2">
              {t("detail.ingredients")}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {mockDetails.ingredients[language] || mockDetails.ingredients.en}
            </p>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="font-bold text-sm text-gray-500 uppercase tracking-wide">
              {isArabic ? "الكمية" : "Qty"}
            </span>
            <div className="flex items-center gap-3">
              <button
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-extrabold text-lg">
                {quantity}
              </span>
              <button
                className="qty-btn"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-4 rounded-full font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 shadow-lg ${
              added
                ? "bg-green-500 text-white scale-95"
                : "bg-[#AD343E] hover:bg-[#922730] text-white hover:shadow-[#AD343E]/30 hover:-translate-y-0.5"
            }`}
          >
            {added ? (
              <span className="pop-in flex items-center gap-2">
                <Check size={18} /> {t("detail.addedToCart")}
              </span>
            ) : (
              <>
                <ShoppingCart size={18} />
                {t("detail.addToCart")} — ${totalPrice.toFixed(2)}
              </>
            )}
          </button>
        </div>
      </section>

      {/* ADD-ONS SECTION */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="border-t border-gray-100 pt-10">
          <h2 className="font-['Playfair_Display',serif] text-2xl font-extrabold text-[#2C2F34] mb-2">
            {t("detail.addons")}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {isArabic
              ? "اختر الإضافات التي تريدها وستُضاف إلى سعر الطلب"
              : "Customize your order by selecting any add-ons below"}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {addons.map((addon) => {
              const isSelected = selectedAddons.some((a) => a.id === addon.id);
              return (
                <div
                  key={addon.id}
                  className={`detail-addon-card ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleAddon(addon)}
                >
                  <div className="detail-addon-check">
                    {isSelected && <Check size={11} color="#fff" />}
                  </div>
                  <span className="detail-addon-icon">{addon.icon}</span>
                  <p className="font-bold text-xs text-[#2C2F34] leading-tight w-full truncate">
                    {addon.name}
                  </p>
                  <p className="text-[11px] text-[#AD343E] font-semibold">
                    {addon.price === 0
                      ? isArabic
                        ? "مجاناً"
                        : "Free"
                      : addon.price > 0
                        ? `+$${addon.price.toFixed(2)}`
                        : `-$${Math.abs(addon.price).toFixed(2)}`}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Selected addons summary */}
          {selectedAddons.length > 0 && (
            <div className="mt-6 p-4 bg-[#AD343E]/5 border border-[#AD343E]/20 rounded-2xl flex flex-wrap items-center gap-3">
              <span className="text-sm font-bold text-[#AD343E]">
                {isArabic ? "الإضافات المختارة:" : "Selected add-ons:"}
              </span>
              {selectedAddons.map((a) => (
                <span
                  key={a.id}
                  className="bg-white border border-[#AD343E]/30 text-[#AD343E] text-xs font-bold px-3 py-1 rounded-full"
                >
                  {a.icon} {a.name}{" "}
                  {a.price !== 0
                    ? `(${a.price > 0 ? "+" : ""}$${a.price.toFixed(2)})`
                    : ""}
                </span>
              ))}
              <span className="ml-auto font-extrabold text-[#AD343E]">
                +${addonTotal.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MenuItemDetail;
