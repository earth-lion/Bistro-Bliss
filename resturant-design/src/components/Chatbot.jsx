/* eslint-disable react-hooks/purity */
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Send, RefreshCw, Settings, User,
  Sparkles, AlertCircle, Check, ExternalLink,
  ThumbsUp, ThumbsDown, ShoppingCart, Star
} from "lucide-react";
import chatbotIcon from "../assets/images/chatbot/chatbot.png";
import { useApp } from "../contexts/AppContext";
import { useLanguage } from "../contexts/LanguageContext";
import { api } from "../services/api";
import { translations as globalTranslations } from "../translations";
import pagesArticles from "../data/pagesData";
import { pagesTranslations } from "../data/pagesTranslations";

// ==========================================================================
// [1] LOCAL CHATBOT TRANSLATIONS
// ==========================================================================
const botTranslations = {
  en: {
    title: "Bistro AI Companion",
    online: "Online · AI Ready",
    placeholder: "Ask me anything about our menu, booking...",
    clearConfirm: "Clear conversation?",
    clearConfirmTitle: "Clear Chat History?",
    clearConfirmDesc: "This will permanently delete your entire conversation history.",
    cancelBtn: "Cancel",
    confirmBtn: "Delete",
    settingsTitle: "AI Settings",
    apiLabel: "Google Gemini API Key (Optional)",
    apiHelp: "Enter your Gemini API key to unlock advanced AI conversation, dietary recommendations, and smart menu suggestions.",
    getKeyLink: "Get a free API Key",
    statusLocal: "⚡ Local Smart Engine (Fast & Free)",
    statusGemini: "✨ Google Gemini AI (Advanced Mode)",
    saveBtn: "Save Key",
    clearKeyBtn: "Remove Key",
    welcome: "👋 Hello! I'm your **Bistro AI Companion**. I can help you explore our menu, find dishes by taste or category, book a table, or answer any question about Bistro Bliss!",
    noMatches: "I couldn't find a direct match. Try asking about a dish name, category (pizza, pasta, burger), or tap a quick chip below!",
    menuHeader: "Here are the best matches from our menu:",
    categoriesHeader: "Check out our most popular dishes today:",
    cartSuccess: "Added to cart!",
    luckyTitle: "🎲 Your Lucky Dish Today:",
    dietaryVeg: "Here are our great vegetarian options:",
    dietarySpicy: "🌶️ Like it hot? Here are our spicy picks:",
    cheapTitle: "💰 Our budget-friendly dishes under $13:",
    cartAdded: "✅ Added to your cart!",
    cartView: "View Cart",
    helpful: "Was this helpful?",
    followUpDishes: "Would you like to:",
    welcomeFeatures: [
      { icon: "🍽️", title: "Explore Menu", desc: "Browse all dishes by category" },
      { icon: "🤖", title: "AI Powered", desc: "Smart recommendations just for you" },
      { icon: "📅", title: "Easy Booking", desc: "Reserve your table in seconds" },
      { icon: "🛒", title: "Quick Order", desc: "Add dishes directly from chat" }
    ],
    quickChips: {
      menu: "🍕 Menu",
      book: "📅 Reserve",
      contact: "📞 Contact",
      catering: "💼 Services",
      articles: "📝 Blog"
    }
  },
  ar: {
    title: "مساعد بيسترو الذكي",
    online: "متصل · جاهز",
    placeholder: "اسألني أي شيء عن القائمة والحجز...",
    clearConfirm: "مسح المحادثة؟",
    clearConfirmTitle: "مسح المحادثة؟",
    clearConfirmDesc: "سيؤدي هذا إلى حذف سجل المحادثات بالكامل بشكل نهائي.",
    cancelBtn: "إلغاء",
    confirmBtn: "حذف",
    settingsTitle: "إعدادات الذكاء الاصطناعي",
    apiLabel: "مفتاح Google Gemini API (اختياري)",
    apiHelp: "أدخل مفتاح Gemini API لتفعيل المحادثات الذكية المتقدمة، والتوصيات الغذائية المخصصة.",
    getKeyLink: "احصل على مفتاح مجاني",
    statusLocal: "⚡ المحرك المحلي الذكي (سريع ومجاني)",
    statusGemini: "✨ ذكاء Gemini الاصطناعي (وضع متطور)",
    saveBtn: "حفظ المفتاح",
    clearKeyBtn: "حذف المفتاح",
    welcome: "👋 مرحباً! أنا **مساعد بيسترو الذكي**. يمكنني مساعدتك في استعراض القائمة، إيجاد أطباق بحسب الذوق، حجز طاولة، أو الإجابة عن أي سؤال!",
    noMatches: "لم أجد تطابقاً مباشراً. جرب اسم طبق، أو فئة (بيتزا، مكرونة، برجر)، أو اضغط على أحد الأزرار السريعة!",
    menuHeader: "إليك أفضل الأطباق المطابقة لطلبك:",
    categoriesHeader: "إليك أشهر أطباقنا اليوم:",
    cartSuccess: "تمت الإضافة للسلة!",
    luckyTitle: "🎲 طبق محظوظك اليوم:",
    dietaryVeg: "إليك خياراتنا النباتية الرائعة:",
    dietarySpicy: "🌶️ تحب الحار؟ إليك اختياراتنا الحارة:",
    cheapTitle: "💰 أطباقنا الاقتصادية أقل من 13$:",
    cartAdded: "✅ تمت الإضافة لسلتك!",
    cartView: "عرض السلة",
    helpful: "هل كان هذا مفيداً؟",
    followUpDishes: "هل تريد أيضاً:",
    welcomeFeatures: [
      { icon: "🍽️", title: "استعرض القائمة", desc: "تصفح جميع الأطباق حسب الفئة" },
      { icon: "🤖", title: "ذكاء اصطناعي", desc: "توصيات ذكية مخصصة لك" },
      { icon: "📅", title: "حجز سهل", desc: "احجز طاولتك في ثوانٍ" },
      { icon: "🛒", title: "طلب سريع", desc: "أضف أطباقاً مباشرة من المحادثة" }
    ],
    quickChips: {
      menu: "🍕 القائمة",
      book: "📅 حجز",
      contact: "📞 تواصل",
      catering: "💼 خدمات",
      articles: "📝 مقالات"
    }
  }
};

// Helper function to normalize text (for fuzzy matching)
const normalizeText = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[أإآا]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\w\s\u0600-\u06FF]/g, ""); // keeps English and Arabic words/numbers, removes punctuation
};

// Helper to extract dishes mentioned in AI responses
const extractMentionedDishes = (text, items) => {
  if (!text || !items || items.length === 0) return [];
  const normalizedText = normalizeText(text);
  return items.filter(item => {
    const nameEn = normalizeText(item.name);
    if (nameEn.length <= 4) return false;
    const nameAr = normalizeText(globalTranslations.ar?.menuItems?.[item.name]?.name || "");
    const isEnMatched = nameEn && normalizedText.includes(nameEn);
    const isArMatched = nameAr && normalizedText.includes(nameAr);
    return isEnMatched || isArMatched;
  });
};

// ==========================================================================
// [INFRA-1] LEVENSHTEIN FUZZY MATCHING (typo tolerance)
// ==========================================================================
const levenshtein = (a, b) => {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
};

// Fuzzy match: returns true if query is close enough to target
const fuzzyMatch = (query, target, maxDistance = 2) => {
  if (!query || !target) return false;
  const q = normalizeText(query);
  const t = normalizeText(target);
  if (t.includes(q) || q.includes(t)) return true;
  // Token-level fuzzy match
  const qTokens = q.split(/\s+/).filter(x => x.length > 2);
  const tTokens = t.split(/\s+/).filter(x => x.length > 2);
  return qTokens.some(qt => tTokens.some(tt => levenshtein(qt, tt) <= maxDistance));
};

// ==========================================================================
// [INFRA-2] ANALYTICS MANAGER (localStorage-based)
// ==========================================================================
const ANALYTICS_KEY = "bistro_chat_analytics";
const HISTORY_KEY   = "bistro_chat_history_v2"; // v2 = localStorage
const MAX_HISTORY   = 60; // Keep last 60 messages

const analyticsManager = {
  get: () => {
    try {
      return JSON.parse(localStorage.getItem(ANALYTICS_KEY) || "{}");
    } catch { return {}; }
  },
  track: (event, data = {}) => {
    try {
      const a = analyticsManager.get();
      const key = event;
      if (!a[key]) a[key] = 0;
      a[key]++;
      if (event === "search" && data.query) {
        if (!a.topQueries) a.topQueries = {};
        const q = data.query.slice(0, 40);
        a.topQueries[q] = (a.topQueries[q] || 0) + 1;
      }
      if (event === "cartAdd" && data.name) {
        if (!a.topDishes) a.topDishes = {};
        a.topDishes[data.name] = (a.topDishes[data.name] || 0) + 1;
      }
      if (event === "reaction") {
        if (!a.reactions) a.reactions = { up: 0, down: 0 };
        a.reactions[data.type] = (a.reactions[data.type] || 0) + 1;
      }
      a.lastUpdated = new Date().toISOString();
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(a));
    } catch { /* silent fail */ }
  },
};


// ==========================================================================
// [2] DISH CARD COMPONENT FOR IN-CHAT RENDER
// ==========================================================================
const DishCard = ({ item, isArabic, handleAddToCart }) => {
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  
  const nameEn = item.name;
  const descEn = item.description || "";
  const price = parseFloat(item.price || 0).toFixed(2);
  const image = item.image;
  const categoryName = item.category?.name || "";
  
  const nameAr = globalTranslations.ar?.menuItems?.[nameEn]?.name || nameEn;
  const descAr = globalTranslations.ar?.menuItems?.[nameEn]?.description || descEn;
  
  const displayName = isArabic ? nameAr : nameEn;
  const displayDesc = isArabic ? descAr : descEn;

  const categoryColors = {
    Pizza: "bg-orange-50 text-orange-600 border-orange-100",
    Burgers: "bg-amber-50 text-amber-600 border-amber-100",
    Pasta: "bg-yellow-50 text-yellow-700 border-yellow-100",
    Desserts: "bg-pink-50 text-pink-600 border-pink-100",
    Drinks: "bg-blue-50 text-blue-600 border-blue-100",
  };
  const catColor = categoryColors[categoryName] || "bg-gray-50 text-gray-500 border-gray-100";
  
  const onAdd = (e) => {
    e.stopPropagation();
    handleAddToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };
  
  const imgSrc = !image
    ? `https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&q=80`
    : parseInt(item.id, 10) >= 1 && parseInt(item.id, 10) <= 27
      ? `/src/assets/foods/${item.id}.jpg`
      : item.image_url || (image.startsWith("http") ? image : `/src/assets/${image}`);

  return (
    <div
      className="group bg-white border border-gray-100/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] transition-all duration-300 text-start cursor-pointer w-full"
      onClick={() => navigate(`/menu/${item.id}`)}
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden bg-gray-50">
        <img
          src={imgSrc}
          alt={displayName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.onerror = null; e.target.src = `https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&q=80`; }}
        />
        {/* Category badge */}
        {categoryName && (
          <span className={`absolute top-2.5 ${isArabic ? "left-2.5" : "right-2.5"} text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${catColor}`}>
            {categoryName}
          </span>
        )}
        {/* Price badge */}
        <span className="absolute bottom-2.5 left-2.5 bg-black/60 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
          ${price}
        </span>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h4 className="font-bold text-[14px] text-[#2C2F34] leading-tight">{displayName}</h4>
        <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">{displayDesc}</p>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={onAdd}
            className={`flex-grow py-2 rounded-xl text-[11px] font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              added
                ? "bg-green-500 text-white shadow-[0_2px_8px_rgba(34,197,94,0.3)]"
                : "bg-[#AD343E] hover:bg-[#922730] text-white shadow-[0_2px_8px_rgba(173,52,62,0.2)] hover:shadow-[0_4px_12px_rgba(173,52,62,0.35)]"
            }`}
          >
            {added
              ? (isArabic ? "✓ تمت الإضافة" : "✓ Added!")
              : (isArabic ? "🛒 أضف للسلة" : "🛒 Add to Cart")}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/menu/${item.id}`); }}
            className="px-3.5 py-2 bg-[#F9F9F7] hover:bg-gray-100 text-[#AD343E] rounded-xl text-[11px] font-bold border border-gray-100 transition cursor-pointer"
          >
            {isArabic ? "تفاصيل" : "Details"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// [3] MAIN CHATBOT COMPONENT
// ==========================================================================
const Chatbot = () => {
  const { addToCart, setIsCartOpen } = useApp();
  const { isArabic, language } = useLanguage();
  const navigate = useNavigate();
  
  const tBot = (key) => botTranslations[language]?.[key] || key;
  
  // --- Core UI state ---
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Lazy initializer: read localStorage once at mount, no effect needed
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return [{
      id: "welcome",
      sender: "bot",
      text: botTranslations[localStorage.getItem("lang") || "en"]?.welcome || botTranslations.en.welcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }];
  });

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // ✅ Lazy initializer: read localStorage once at mount, no effect needed
  const [apiKey, setApiKey] = useState(() => {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    return envKey || localStorage.getItem("bistro_gemini_api_key") || "";
  });
  const [isGeminiActive, setIsGeminiActive] = useState(() => {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    return !!(envKey || localStorage.getItem("bistro_gemini_api_key"));
  });

  const [menuItems, setMenuItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [reactions, setReactions] = useState({});
  const [cartNotification, setCartNotification] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // --- [INFRA] Multi-turn conversation context ---
  const [lastIntent, setLastIntent] = useState(null);       // e.g. "dishes", "booking"
  const [lastDishes, setLastDishes] = useState([]);         // last shown dishes list
  const [lastCategory, setLastCategory] = useState(null);   // last matched category

  // --- [INFRA] Autocomplete (computed, no state needed) ---
  const [autocompleteIdx, setAutocompleteIdx] = useState(-1);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  // ✅ useMemo: compute autocomplete list from inputValue without setState-in-effect
  const autocompleteList = useMemo(() => {
    if (!inputValue.trim() || inputValue.trim().length < 2) return [];
    const q = normalizeText(inputValue);
    const suggestions = [];
    menuItems.forEach(item => {
      const nameEn = item.name;
      const nameAr = globalTranslations.ar?.menuItems?.[nameEn]?.name || "";
      if (fuzzyMatch(q, nameEn, 2) || fuzzyMatch(q, nameAr, 2)) {
        suggestions.push({ label: isArabic ? (nameAr || nameEn) : nameEn, icon: "🍽️", type: "dish" });
      }
    });
    const staticEn = ["pizza", "burger", "pasta", "dessert", "drinks", "book a table", "contact", "services", "vegetarian", "spicy food", "budget meals"];
    const staticAr = ["بيتزا", "برجر", "مكرونة", "حلويات", "مشروبات", "حجز طاولة", "تواصل", "خدمات", "نباتي", "طعام حار", "وجبات رخيصة"];
    const statics = isArabic ? staticAr : staticEn;
    statics.forEach(s => {
      if (fuzzyMatch(q, s, 2) && !suggestions.some(x => x.label === s)) {
        suggestions.push({ label: s, icon: "🔍", type: "query" });
      }
    });
    return suggestions.slice(0, 6);
  }, [inputValue, menuItems, isArabic]);

  // --- [INFRA] Streaming ---
  const [streamingMsgId, setStreamingMsgId] = useState(null); // id of message being streamed
  const [retryCount, setRetryCount] = useState(0);

  // --- [INFRA] Analytics panel ---
  const [showAnalytics, setShowAnalytics] = useState(false);

  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);
  const inputRef = useRef(null);


  // ✅ Only fetch async menu data (no synchronous setState here)
  useEffect(() => {
    analyticsManager.track("sessionStart");
    const fetchMenu = async () => {
      try {
        const menuData = await api.getMenu();
        let items = [];
        if (Array.isArray(menuData)) {
          items = menuData;
        } else if (menuData && menuData.data) {
          items = menuData.data;
        }
        setMenuItems(items);
      } catch (err) {
        console.error("Chatbot failed to fetch dynamic menu, using fallback translations", err);
        const menuKeys = Object.keys(globalTranslations.en?.menuItems || {});
        const fallbackItems = menuKeys.map((key, index) => ({
          id: `fallback-${index}`,
          name: key,
          price: 12.99,
          description: globalTranslations.en.menuItems[key]?.description || "",
          category: { name: "Pizza" },
          image: "images/placeholder.jpg"
        }));
        setMenuItems(fallbackItems);
      }
    };
    fetchMenu();
  }, []);

  // [INFRA] Sync message history to localStorage (capped at MAX_HISTORY)
  useEffect(() => {
    if (messages.length > 0) {
      const toSave = messages.slice(-MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(toSave));
    }
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ✅ unread count reset is handled directly in the FAB onClick (no effect needed)

  // Handle outside click to close chatbot
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && chatWindowRef.current && !chatWindowRef.current.contains(e.target) && !e.target.closest(".chatbot-fab")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  // ✅ Autocomplete is now computed via useMemo above — no effect needed here

  // System prompt / Instruction generator for Gemini API
  const getSystemInstruction = () => {
    const menuList = menuItems.map(item => {
      const nameEn = item.name;
      const descEn = item.description || "";
      const price = item.price;
      const category = item.category?.name || "General";
      
      const nameAr = globalTranslations.ar?.menuItems?.[nameEn]?.name || nameEn;
      const descAr = globalTranslations.ar?.menuItems?.[nameEn]?.description || descEn;
      
      return `- Name EN: "${nameEn}" / AR: "${nameAr}" | Category: ${category} | Price: $${price} | Description EN: "${descEn}" / Description AR: "${descAr}"`;
    }).join("\n");

    const articlesList = pagesArticles.map(art => {
      const titleEn = art.title;
      const categoryEn = art.category;
      const excerptEn = art.excerpt;
      
      const trans = pagesTranslations.ar?.[art.id] || {};
      const titleAr = trans.title || titleEn;
      const categoryAr = trans.category || categoryEn;
      const excerptAr = trans.excerpt || excerptEn;
      
      return `- Article #${art.id}: EN Title: "${titleEn}" / AR Title: "${titleAr}" | Category: ${categoryEn} (${categoryAr}) | Summary EN: "${excerptEn}" / Summary AR: "${excerptAr}"`;
    }).join("\n");

    return `
You are the official AI Assistant ("Bistro Bot" / "رفيق بيسترو") for the restaurant "Bistro Bliss" (بيسترو بليس).
Your job is to provide highly friendly, professional, and helpful responses.

BISTRO BLISS RESTAURANT INFO:
- Name: Bistro Bliss (بيسترو بليس)
- Tagline: Best food for your taste (أفضل طعام يناسب ذوقك)
- Address: 123 Foodie Street, Culinary City (123 شارع الأغذية، مدينة الطهي)
- Phone: +1 (555) 012-3456
- Email: info@bistrobliss.com
- Hours: Open Daily 9:00 AM - 11:00 PM (يومياً من 9:00 صباحاً حتى 11:00 مساءً)
- About Us: Our story began with a vision to create a unique dining experience merging fine dining, exceptional service, and a vibrant ambiance. We offer healthy, organic food sourced daily from local farms, crafted by expert chefs.
- Services Offered:
  1. Caterings (الضيافة): Tailored food spreads for large events.
  2. Birthdays (أعياد الميلاد): Custom themes and food packages.
  3. Weddings (حفلات الزفاف): Fine dining menus to make your special day unforgettable.
  4. Events (الفعاليات): Corporate catering and premium table setups.

MENU DATABASE (قائمة الأكلات والأسعار):
${menuList}

ARTICLES / BLOG DATABASE (المقالات والوصفات):
${articlesList}

GUIDELINES:
1. Respond in the language the user speaks. If they write in Arabic, respond in fluent, professional Arabic. If they write in English, respond in English.
2. If the user asks about reserving a table or booking, guide them to go to the Book Table page: "/book".
3. If they want to contact us or see branches/hours, provide the address, phone, email, and daily hours.
4. If they want to order food or view categories, tell them to browse the Menu page: "/menu" and click "Add to Cart" to place an order.
5. Keep answers concise, helpful, and focused on Bistro Bliss. Avoid answering general out-of-context topics (politely guide them back to Bistro Bliss topics).
6. Always maintain a warm, welcoming tone.
`;
  };

  // [INFRA-5] Retry helper with exponential backoff
  const fetchWithRetry = async (url, options, attempt = 1) => {
    const res = await fetch(url, options);
    if (res.status === 429 && attempt <= 3) {
      const delay = Math.pow(2, attempt) * 1000;
      setRetryCount(attempt);
      await new Promise(r => setTimeout(r, delay));
      setRetryCount(0);
      return fetchWithRetry(url, options, attempt + 1);
    }
    return res;
  };

  // [INFRA-4] Gemini API Caller with Streaming
  const callGeminiAPI = async (userText, chatHistory, botMsgId) => {
    try {
      const systemInstruction = getSystemInstruction();
      const formattedContents = chatHistory
        .filter(msg => msg.type !== "dishes" && msg.type !== "actions")
        .map(msg => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        }));
      formattedContents.push({ role: "user", parts: [{ text: userText }] });

      const isLegacyKey = apiKey.startsWith("AIzaSy");
      // Use streamGenerateContent for streaming
      const apiUrl = isLegacyKey
        ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`
        : `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse`;
      const apiHeaders = {
        "Content-Type": "application/json",
        ...(isLegacyKey ? {} : { "X-goog-api-key": apiKey })
      };

      const response = await fetchWithRetry(apiUrl, {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify({
          contents: formattedContents,
          systemInstruction: { parts: [{ text: systemInstruction }] }
        })
      });

      if (!response.ok) throw new Error(`Gemini API status ${response.status}`);

      // Stream reader
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamText = "";
      setStreamingMsgId(botMsgId);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
        for (const line of lines) {
          try {
            const json = JSON.parse(line.slice(6));
            const token = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
            streamText = streamText + token;
            // Live-update the bot message bubble
            setMessages(prev => prev.map(m =>
              m.id === botMsgId ? { ...m, text: m.text + token } : m
            ));
          } catch { /* incomplete chunk */ }
        }
      }
      setStreamingMsgId(null);
      if (!streamText) throw new Error("Empty stream from Gemini");
      return { text: streamText, type: "text" };
    } catch (err) {
      setStreamingMsgId(null);
      console.error("Gemini streaming error, falling back:", err);
      return runLocalAgent(userText);
    }
  };


  // Local NLP Matching Engine
  const runLocalAgent = (rawText) => {
    const query = normalizeText(rawText);
    const isAr = language === "ar";

    // [INFRA-2] Multi-turn context: follow-up on previous dishes
    if (lastIntent === "dishes" && lastDishes.length > 0) {
      // "cheaper / أرخص" → filter lastDishes by lowest price
      if (query.includes("cheap") || query.includes("less") || query.includes("low") ||
          query.includes("أرخص") || query.includes("اقل") || query.includes("اوفر")) {
        const sorted = [...lastDishes].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        return {
          text: isAr ? "إليك الأطباق الأرخص من نتائجك السابقة:" : "Here are the cheaper options from your previous results:",
          type: "dishes",
          dishes: sorted.slice(0, 4)
        };
      }
      // "similar / مشابه" → fetch more from same category
      if (query.includes("similar") || query.includes("like") || query.includes("more") ||
          query.includes("مشابه") || query.includes("اكثر") || query.includes("شبيه") || query.includes("زيه")) {
        const sameCat = menuItems.filter(i =>
          i.category?.name === lastCategory && !lastDishes.some(d => d.id === i.id)
        );
        if (sameCat.length > 0) {
          return {
            text: isAr ? `إليك المزيد من فئة ${lastCategory}:` : `Here are more from the ${lastCategory} category:`,
            type: "dishes",
            dishes: sameCat.slice(0, 4)
          };
        }
      }
      // "add / أضف to cart" → re-show lastDishes for easy add
      if (query.includes("add") || query.includes("cart") || query.includes("order") ||
          query.includes("أضف") || query.includes("سلة") || query.includes("اطلب")) {
        return {
          text: isAr ? "اختر طبقاً لإضافته للسلة:" : "Pick one to add to your cart:",
          type: "dishes",
          dishes: lastDishes.slice(0, 4)
        };
      }
    }

    // [INFRA-3] Fuzzy dish name matching (typo tolerance)
    const fuzzyDishMatches = menuItems.filter(item => {
      const nameEn = item.name;
      const nameAr = globalTranslations.ar?.menuItems?.[nameEn]?.name || "";
      return fuzzyMatch(rawText, nameEn, 2) || fuzzyMatch(rawText, nameAr, 2);
    });
    if (fuzzyDishMatches.length > 0) {
      return {
        text: isAr ? "هل تقصد هذه الأطباق؟" : "Did you mean these dishes?",
        type: "dishes",
        dishes: fuzzyDishMatches.slice(0, 4)
      };
    }

    // Intent 1: Greetings
    if (query.match(/^(hi|hello|hey|welcome|hola|مرحبا|اهلا|السلام|صباح|مساء|تسلم|شكرا|thanks|thank you)$/)) {
      return { text: tBot("welcome"), type: "text" };
    }

    // Intent 2: Book / Reserve
    if (query.includes("book") || query.includes("table") || query.includes("reserve") || query.includes("reservation") ||
        query.includes("حجز") || query.includes("طاول") || query.includes("احجز")) {
      const text = isAr 
        ? "لحجز طاولة في بيسترو بليس، يرجى الانتقال إلى صفحة حجز الطاولات. يمكنك تحديد تاريخ الحجز، والوقت المتاح، وعدد الضيوف وتأكيد الحجز في ثوانٍ."
        : "To book a table at Bistro Bliss, please head to our Booking page. You can easily pick your date, time slot, and party size to confirm your reservation.";
      return { 
        text, 
        type: "actions", 
        actions: [{ label: isAr ? "📅 انتقل لصفحة الحجز" : "📅 Go to Booking Page", path: "/book" }] 
      };
    }


    // Intent 3: Contact / Phone / Address / Hours
    if (query.includes("contact") || query.includes("phone") || query.includes("call") || query.includes("email") || 
        query.includes("address") || query.includes("location") || query.includes("branch") || query.includes("where") || 
        query.includes("open") || query.includes("hours") || query.includes("تواصل") || query.includes("هاتف") || 
        query.includes("اتصال") || query.includes("ايميل") || query.includes("بريد") || query.includes("عنوان") || 
        query.includes("مكان") || query.includes("فرع") || query.includes("ساعات") || query.includes("مواعيد")) {
      const text = isAr
        ? "📞 **رقم الهاتف:** +1 (555) 012-3456\n✉️ **البريد الإلكتروني:** info@bistrobliss.com\n📍 **العنوان الرئيسي:** 123 شارع الأغذية، مدينة الطهي\n🕒 **ساعات العمل:** نفتح أبوابنا يومياً من الساعة 9:00 صباحاً حتى 11:00 مساءً."
        : "📞 **Phone:** +1 (555) 012-3456\n✉️ **Email:** info@bistrobliss.com\n📍 **Address:** 123 Foodie Street, Culinary City\n🕒 **Hours:** Open Daily from 9:00 AM to 11:00 PM.";
      return {
        text,
        type: "actions",
        actions: [{ label: isAr ? "📞 اتصل بنا" : "📞 Contact Page", path: "/contact" }]
      };
    }

    // Intent 4: Services / Catering
    if (query.includes("service") || query.includes("event") || query.includes("catering") || query.includes("wedding") || 
        query.includes("birthday") || query.includes("خدم") || query.includes("مناسب") || query.includes("حفل") || 
        query.includes("عيد ميلاد") || query.includes("ضياف")) {
      const text = isAr
        ? "نقدم باقات خدمات طعام وضيافة راقية مخصصة بالكامل لمناسباتكم:\n\n• **أعياد الميلاد (Birthdays):** ثيمات ملونة ووجبات مخصصة.\n• **حفلات الزفاف (Weddings):** بوفيه فاخر ومشروبات مميزة.\n• **الضيافة العامة (Catering):** مناسب للتجمعات الكبيرة والعائلية.\n• **فعاليات الشركات (Corporate Events):** تنسيق وترتيب طاولات احترافي."
        : "We specialize in custom catering and event planning. Here are our core services:\n\n• **Birthdays:** Vibrant party themes and custom food menus.\n• **Weddings:** Fine dining setups to make your special day memorable.\n• **Catering:** Exquisite food selections tailored to your guest list.\n• **Events:** Corporate boardrooms and large-scale setups.";
      return { text, type: "text" };
    }

    // Intent 5: About / Story / Team
    if (query.includes("about") || query.includes("story") || query.includes("chef") || query.includes("organic") || 
        query.includes("fresh") || query.includes("من نحن") || query.includes("قصة") || query.includes("من انتم") || 
        query.includes("شيف") || query.includes("عضوي") || query.includes("طازج")) {
      const text = isAr
        ? "بدأت قصة بيسترو بليس برؤية فريدة لخلق تجربة طعام صحية ومميزة. نستخدم خضروات ومكونات عضوية 100% طازجة يومياً من مزارعنا المحلية، ويقوم طهاتنا بإعداد كل طبق بحب وعناية فائقة."
        : "At Bistro Bliss, our story began with a vision to provide healthy, organic food for your family. We use strictly organic ingredients sourced from local farms daily, and our expert chefs craft every plate with absolute precision.";
      return {
        text,
        type: "actions",
        actions: [{ label: isAr ? "اعرف المزيد عنا 📖" : "Read More About Us 📖", path: "/about" }]
      };
    }

    // Intent 6: Blog / Articles
    if (query.includes("blog") || query.includes("article") || query.includes("recipe") || query.includes("tip") || 
        query.includes("مقال") || query.includes("مدون") || query.includes("وصف") || query.includes("نصيح")) {
      const text = isAr
        ? "تضم مدونتنا العديد من المقالات والوصفات المفيدة ونصائح المطبخ وخبز المعجنات وتنسيق الأطباق بشكل جذاب."
        : "Explore our latest kitchen stories, professional baking guides, air-fryer tips, and modern plating ideas in our blog.";
      return {
        text,
        type: "actions",
        actions: [{ label: isAr ? "تصفح المقالات 📝" : "Browse Articles 📝", path: "/articles" }]
      };
    }

    // Intent 7: Specific dish or category search in menu items
    const categoryKeywords = {
      Pizza: ["pizza", "بيتزا", "بيتزه", "بيتزة", "مارجريتا", "margherita", "pepperoni", "ببروني", "ببرونى"],
      Burgers: ["burger", "برجر", "بيرغر", "هامبرجر", "همبرجر", "ساندوتش", "ساندويش", "cheeseburger", "تشيز"],
      Pasta: ["pasta", "باستا", "مكرون", "معكرون", "سباغيت", "سباغيتي", "فيتوتشيني", "رافيولي", "بيني", "spaghetti", "fettuccine", "ravioli", "penne", "arrabiata", "اراباتا", "بستو", "pesto"],
      Desserts: ["dessert", "sweet", "cake", "حلويات", "حلو", "حلاو", "كيك", "تارت", "تيراميسو", "شوكولات", "cheesecake", "tiramisu", "lava", "لافا", "بارفيه", "parfait"],
      Drinks: ["drink", "beverage", "juice", "coffee", "tea", "مشروب", "عصير", "قهوه", "قهوة", "شاي", "لاتيه", "ماتشا", "موهيتو", "ليمون", "برتقال", "mojito", "matcha", "lemonade", "espresso", "اسبريسو", "اسبرسو", "بيبسي", "pepsi", "سفن"]
    };

    let matchedCategories = [];
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => query.includes(keyword))) {
        matchedCategories.push(cat);
      }
    }

    let matchedDishes = [];
    if (matchedCategories.length > 0) {
      matchedDishes = menuItems.filter(item => 
        matchedCategories.some(cat => item.category?.name?.toLowerCase() === cat.toLowerCase())
      );
    }

    const queryTokens = query.split(/\s+/).filter(t => t.length > 2);
    const dishScores = menuItems.map(item => {
      let score = 0;
      const nameEn = normalizeText(item.name);
      const descEn = normalizeText(item.description || "");
      const nameAr = normalizeText(globalTranslations.ar?.menuItems?.[item.name]?.name || "");
      const descAr = normalizeText(globalTranslations.ar?.menuItems?.[item.name]?.description || "");

      if (query.includes(nameEn) && nameEn.length > 0) score += 50;
      if (query.includes(nameAr) && nameAr.length > 0) score += 50;

      queryTokens.forEach(token => {
        if (nameEn.includes(token)) score += 10;
        if (nameAr.includes(token)) score += 10;
        if (descEn.includes(token)) score += 3;
        if (descAr.includes(token)) score += 3;
      });

      return { item, score };
    }).filter(ds => ds.score > 0);

    dishScores.sort((a, b) => b.score - a.score);

    if (dishScores.length > 0) {
      const topDishes = dishScores.slice(0, 4).map(ds => ds.item);
      if (matchedCategories.length > 0) {
        const merged = [...topDishes];
        matchedDishes.forEach(item => {
          if (!merged.some(m => m.id === item.id)) {
            merged.push(item);
          }
        });
        matchedDishes = merged;
      } else {
        matchedDishes = topDishes;
      }
    }

    if (matchedDishes.length > 0) {
      const sliceItems = matchedDishes.slice(0, 5);
      return {
        text: isAr ? "لقد وجدت هذه الأصناف اللذيذة في قائمتنا والتي تطابق طلبك:" : "I found these delicious items on our menu matching your query:",
        type: "dishes",
        dishes: sliceItems
      };
    }

    // Custom Intent A: Random / Lucky / Food Roulette
    if (query.includes("lucky") || query.includes("roulette") || query.includes("حظ") || query.includes("عشوائي") || query.includes("اقترحلي")) {
      if (menuItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * menuItems.length);
        const luckyItem = menuItems[randomIndex];
        return {
          text: tBot("luckyTitle"),
          type: "dishes",
          dishes: [luckyItem]
        };
      }
    }

    // Custom Intent B: Vegetarian & Healthy Choices
    if (query.includes("veg") || query.includes("vegan") || query.includes("نباتي") || query.includes("خضار") || query.includes("بدون لحم")) {
      const vegKeywords = ["veg", "spinach", "cheese", "tomato", "vegetable", "نباتي", "جبن", "خضار", "طماطم", "سبانخ", "سلطة", "salad", "margherita", "مارغريتا", "alfredo", "الفريدو", "pesto", "بستو", "onion", "بصل"];
      const vegDishes = menuItems.filter(item => {
        const name = (item.name || "").toLowerCase();
        const desc = (item.description || "").toLowerCase();
        return vegKeywords.some(kw => name.includes(kw) || desc.includes(kw));
      });
      if (vegDishes.length > 0) {
        return {
          text: tBot("dietaryVeg"),
          type: "dishes",
          dishes: vegDishes.slice(0, 4)
        };
      }
    }

    // Custom Intent C: Spicy Specials
    if (query.includes("spicy") || query.includes("hot") || query.includes("حار") || query.includes("سبايسي") || query.includes("فلفل") || query.includes("شطة")) {
      const spicyKeywords = ["spicy", "hot", "chili", "jalapeno", "حار", "سبايسي", "فلفل", "شطة", "ببروني", "pepperoni", "diavola"];
      const spicyDishes = menuItems.filter(item => {
        const name = (item.name || "").toLowerCase();
        const desc = (item.description || "").toLowerCase();
        return spicyKeywords.some(kw => name.includes(kw) || desc.includes(kw));
      });
      if (spicyDishes.length > 0) {
        return {
          text: tBot("dietarySpicy"),
          type: "dishes",
          dishes: spicyDishes.slice(0, 4)
        };
      }
    }

    // Custom Intent D: Budget-friendly (Value Choices)
    if (query.includes("cheap") || query.includes("budget") || query.includes("رخيص") || query.includes("اقتصادي") || query.includes("سعر منخفض") || query.includes("اقل")) {
      const cheapDishes = menuItems.filter(item => parseFloat(item.price || 0) < 13);
      if (cheapDishes.length > 0) {
        return {
          text: tBot("cheapTitle"),
          type: "dishes",
          dishes: cheapDishes.slice(0, 4)
        };
      }
    }

    // Intent 8: General menu inquiries with no direct keyword matches
    if (query.includes("menu") || query.includes("food") || query.includes("eat") || query.includes("price") || 
        query.includes("قائم") || query.includes("اكل") || query.includes("وجب") || query.includes("سعر") || 
        query.includes("بكم") || query.includes("جوعان") || query.includes("طلب")) {
      
      const popularDishes = menuItems.filter(item => 
        item.name === "Pizza Margherita" || 
        item.name === "Classic Cheeseburger" || 
        item.name === "Chocolate Lava Cake" ||
        item.name === "Fettuccine Alfredo"
      );
      
      return {
        text: isAr ? "تصفح قائمتنا أو شاهد بعضاً من أطباقنا الأكثر شعبية وتوصياتنا:" : "Browse our menu categories or check out some of our most popular dishes:",
        type: "dishes",
        dishes: popularDishes.length > 0 ? popularDishes.slice(0, 4) : menuItems.slice(0, 4)
      };
    }

    // Fallback response
    return {
      text: tBot("noMatches"),
      type: "text"
    };
  };

  // Send message controller
  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    setInputValue("");
    setShowAutocomplete(false);
    analyticsManager.track("search", { query: text });

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Pre-create bot message slot for streaming
    const botMsgId = `bot-${Date.now()}`;
    const botMsgSlot = {
      id: botMsgId,
      sender: "bot",
      text: "",
      type: "text",
      dishes: [],
      actions: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, botMsgSlot]);

    let botResponse = null;
    if (isGeminiActive && apiKey) {
      botResponse = await callGeminiAPI(text, updatedMessages, botMsgId);
      const detected = extractMentionedDishes(botResponse.text, menuItems);
      if (detected.length > 0) {
        botResponse.type = "dishes";
        botResponse.dishes = detected.slice(0, 4);
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 700));
      botResponse = runLocalAgent(text);
    }

    // Update the pre-created slot with final response
    setMessages(prev => prev.map(m =>
      m.id === botMsgId
        ? { ...m, text: botResponse.text, type: botResponse.type || "text", dishes: botResponse.dishes || [], actions: botResponse.actions || [] }
        : m
    ));
    setIsLoading(false);

    // [INFRA-2] Update multi-turn context
    if (botResponse.type === "dishes" && botResponse.dishes?.length > 0) {
      setLastIntent("dishes");
      setLastDishes(botResponse.dishes);
      const cat = botResponse.dishes[0]?.category?.name || null;
      setLastCategory(cat);
    } else if (botResponse.actions?.length > 0) {
      setLastIntent("actions");
    } else {
      setLastIntent("text");
    }

    if (!isOpen) {
      setUnreadCount(prev => prev + 1);
    }
  };

  // Add to Cart handler from chat window
  const handleAddToCartFromChat = (item) => {
    const resolvedImage = parseInt(item.id, 10) >= 1 && parseInt(item.id, 10) <= 27
      ? `/src/assets/foods/${item.id}.jpg`
      : item.image_url || item.image;
    addToCart({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: resolvedImage,
    });
    analyticsManager.track("cartAdd", { name: item.name });
    const nameAr = globalTranslations.ar?.menuItems?.[item.name]?.name || item.name;
    const nameToShow = isArabic ? nameAr : item.name;
    setCartNotification(nameToShow);
    setTimeout(() => {
      setCartNotification(null);
    }, 3000);
  };

  // Clear conversation trigger
  const handleClearChat = () => {
    setShowClearConfirm(true);
  };

  // Actual clear execution
  const executeClearChat = () => {
    const initialMessage = {
      id: "welcome",
      sender: "bot",
      text: tBot("welcome"),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialMessage]);
    localStorage.removeItem(HISTORY_KEY);
    setShowClearConfirm(false);
  };

  // Save Gemini API key
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("bistro_gemini_api_key", apiKey.trim());
      setIsGeminiActive(true);
      setShowSettings(false);
    } else {
      localStorage.removeItem("bistro_gemini_api_key");
      setIsGeminiActive(false);
      setShowSettings(false);
    }
  };

  const handleClearApiKey = () => {
    setApiKey("");
    localStorage.removeItem("bistro_gemini_api_key");
    setIsGeminiActive(false);
    setShowSettings(false);
  };

  // Click on quick suggestion chips
  const handleChipClick = (chipText) => {
    handleSendMessage(chipText);
  };

  // Check language alignment classes
  const isRtl = isArabic;

  return (
    <>
      {/* ==========================================================================
          [4] FLOATING ACTION BUTTON (FAB)
          ========================================================================== */}
      <button
        onClick={() => { setIsOpen(prev => { if (!prev) setUnreadCount(0); return !prev; }); }}
        className={`chatbot-fab fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center transition duration-300 cursor-pointer active:scale-95 shadow-[0_8px_30px_rgba(173,52,62,0.3)] hover:shadow-[0_12px_40px_rgba(173,52,62,0.5)] ${
          isOpen 
            ? "bg-[#AD343E] hover:bg-[#922730] text-white hover:scale-110" 
            : "bg-transparent hover:scale-110"
        }`}
        aria-label="Toggle Chatbot"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex items-center justify-center w-full h-full"
            >
              <img src={chatbotIcon} alt="Chatbot" className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-white hover:border-[#AD343E]/20 transition" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-white animate-bounce">
                  {unreadCount}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* ==========================================================================
          [5] CHAT WINDOW WIDGET
          ========================================================================== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatWindowRef}
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            dir={isRtl ? "rtl" : "ltr"}
            className="fixed top-[160px] right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[calc(100vh-164px)] bg-white/85 backdrop-blur-xl border border-white/40 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.2)] rounded-3xl flex flex-col overflow-hidden"
          >
            {/* --- HEADER --- */}
            <div className="bg-gradient-to-r from-[#AD343E] via-[#9e2d36] to-[#922730] text-white p-4.5 flex items-center justify-between shadow-[0_4px_20px_rgba(173,52,62,0.15)]">
              <div className="flex items-center gap-3">
                <img src={chatbotIcon} alt="Chatbot" className="w-10 h-10 rounded-full object-cover border border-white/20" />
                <div>
                  <h3 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                    {tBot("title")}
                    {isGeminiActive && <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {retryCount > 0 ? (
                      <span className="text-[10px] text-yellow-300 font-medium animate-pulse">⚠️ Retrying ({retryCount}/3)...</span>
                    ) : streamingMsgId ? (
                      <span className="text-[10px] text-white/80 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "120ms" }} />
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "240ms" }} />
                      </span>
                    ) : (
                      <>
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                        <span className="text-[10px] text-white/80 font-medium">{tBot("online")}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className={`p-1.5 hover:bg-white/10 rounded-lg transition cursor-pointer ${showAnalytics ? "bg-white/15" : "text-white/90"}`}
                  title={isArabic ? "إحصائيات" : "Analytics"}
                >
                  <Star className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClearChat}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition text-white/90 cursor-pointer"
                  title="Clear Chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-1.5 hover:bg-white/10 rounded-lg transition cursor-pointer ${showSettings ? "bg-white/15 text-white" : "text-white/90"}`}
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition text-white/90 cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* --- BODY --- */}
            <div className="flex-grow flex flex-col relative overflow-hidden bg-[#F9F9F7]/30">
              {/* --- SETTINGS TAB OVERLAY --- */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 z-10 shadow-lg p-5 flex flex-col gap-4 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <h4 className="font-bold text-sm text-[#2C2F34] flex items-center gap-1.5">
                        <Settings className="w-4 h-4 text-[#AD343E]" />
                        {tBot("settingsTitle")}
                      </h4>
                      <button 
                        onClick={() => setShowSettings(false)}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-gray-700 block">{tBot("apiLabel")}</label>
                      <input
                        type="password"
                        placeholder="AIzaSy..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-xl bg-[#F9F9F7] focus:outline-none focus:border-[#AD343E] transition"
                      />
                      <p className="text-[10px] text-gray-400 leading-relaxed">{tBot("apiHelp")}</p>
                      <a
                        href="https://aistudio.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#AD343E] font-bold flex items-center gap-1 hover:underline mt-1"
                      >
                        {tBot("getKeyLink")} <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleSaveApiKey}
                        className="flex-grow py-2 bg-[#AD343E] hover:bg-[#922730] text-white rounded-lg font-bold text-center cursor-pointer transition"
                      >
                        {tBot("saveBtn")}
                      </button>
                      {apiKey && (
                        <button
                          onClick={handleClearApiKey}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg font-bold text-center cursor-pointer transition"
                        >
                          {tBot("clearKeyBtn")}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-medium text-gray-500 bg-[#F9F9F7] p-2 rounded-lg border border-gray-100">
                      <Sparkles className={`w-3.5 h-3.5 ${isGeminiActive ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`} />
                      {isGeminiActive ? tBot("statusGemini") : tBot("statusLocal")}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* --- ANALYTICS PANEL OVERLAY --- */}
              {(() => {
                const stats = analyticsManager.get();
                const topDishes = Object.entries(stats.topDishes || {}).sort((a, b) => b[1] - a[1]).slice(0, 3);
                const topQueries = Object.entries(stats.topQueries || {}).sort((a, b) => b[1] - a[1]).slice(0, 3);
                return (
                  <AnimatePresence>
                    {showAnalytics && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className="absolute top-0 left-0 right-0 bg-[#2C2F34] text-white z-10 shadow-xl p-4 flex flex-col gap-3 text-xs overflow-y-auto max-h-[60%]"
                      >
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <h4 className="font-bold text-sm flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            {isArabic ? "إحصائيات الشات" : "Chat Analytics"}
                          </h4>
                          <button onClick={() => setShowAnalytics(false)} className="text-gray-400 hover:text-white cursor-pointer">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: isArabic ? "جلسات" : "Sessions", val: stats.sessionStart || 0, color: "text-blue-400" },
                            { label: isArabic ? "بحث" : "Searches", val: stats.search || 0, color: "text-green-400" },
                            { label: isArabic ? "سلة" : "Cart Adds", val: stats.cartAdd || 0, color: "text-yellow-400" },
                          ].map(s => (
                            <div key={s.label} className="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
                              <p className={`text-xl font-black ${s.color}`}>{s.val}</p>
                              <p className="text-[9px] text-gray-400 mt-0.5">{s.label}</p>
                            </div>
                          ))}
                        </div>
                        {topDishes.length > 0 && (
                          <div>
                            <p className="text-[10px] text-gray-400 font-semibold mb-1.5">{isArabic ? "🛒 أكثر الأطباق طلباً" : "🛒 Top Ordered Dishes"}</p>
                            <div className="space-y-1.5">
                              {topDishes.map(([name, count]) => (
                                <div key={name} className="flex justify-between items-center bg-white/5 rounded-lg px-2.5 py-1.5">
                                  <span className="truncate max-w-[180px]">{name}</span>
                                  <span className="font-bold text-yellow-400 ml-2">{count}×</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {topQueries.length > 0 && (
                          <div>
                            <p className="text-[10px] text-gray-400 font-semibold mb-1.5">{isArabic ? "🔍 أكثر الأسئلة تكراراً" : "🔍 Top Queries"}</p>
                            <div className="space-y-1.5">
                              {topQueries.map(([q, count]) => (
                                <div key={q} className="flex justify-between items-center bg-white/5 rounded-lg px-2.5 py-1.5">
                                  <span className="truncate max-w-[180px] text-gray-300">{q}</span>
                                  <span className="font-bold text-blue-400 ml-2">{count}×</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {stats.reactions && (
                          <div className="flex gap-2 text-[10px]">
                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" /> {stats.reactions.up || 0}
                            </span>
                            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-lg flex items-center gap-1">
                              <ThumbsDown className="w-3 h-3" /> {stats.reactions.down || 0}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })()}

              {/* --- CUSTOM CLEAR CONFIRM MODAL OVERLAY --- */}
              <AnimatePresence>
                {showClearConfirm && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#2C2F34]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 15 }}
                      transition={{ type: "spring", damping: 25, stiffness: 350 }}
                      className="bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.25)] rounded-3xl p-5 max-w-[280px] w-full text-center flex flex-col items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center shadow-inner">
                        <AlertCircle className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-sm text-[#2C2F34]">{tBot("clearConfirmTitle")}</h4>
                        <p className="text-[10px] text-gray-400 leading-normal">{tBot("clearConfirmDesc")}</p>
                      </div>
                      <div className="flex gap-2 w-full mt-1">
                        <button
                          onClick={() => setShowClearConfirm(false)}
                          className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-[10px] transition cursor-pointer"
                        >
                          {tBot("cancelBtn")}
                        </button>
                        <button
                          onClick={executeClearChat}
                          className="flex-1 py-2 bg-[#AD343E] hover:bg-[#922730] text-white rounded-xl font-bold text-[10px] transition cursor-pointer shadow-[0_4px_12px_rgba(173,52,62,0.25)]"
                        >
                          {tBot("confirmBtn")}
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* --- MESSAGES FEED --- */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4 flex flex-col custom-scrollbar">
                {messages.map((msg) => {
                  const isBot = msg.sender === "bot";
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 max-w-[85%] ${isBot ? "self-start" : "self-end flex-row-reverse"}`}
                    >
                      {/* Avatar */}
                      {isBot ? (
                        <img src={chatbotIcon} alt="Chatbot" className="w-8 h-8 rounded-full object-cover border border-amber-200 flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#AD343E]/10 border border-[#AD343E]/20 text-[#AD343E] flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                      )}

                      {/* Content Bubble */}
                      <div className="space-y-1">
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                          isBot
                            ? `bg-white text-gray-800 border border-gray-200/50 ${isRtl ? "rounded-tr-none" : "rounded-tl-none"}`
                            : `bg-gradient-to-br from-[#AD343E] to-[#922730] text-white shadow-[0_4px_12px_rgba(173,52,62,0.15)] ${isRtl ? "rounded-tl-none" : "rounded-tr-none"}`
                        }`}>
                          {/* Parse markdown-like bold indicators for local response rendering */}
                          {(msg.id === "welcome" ? tBot("welcome") : msg.text).split("\n").map((line, idx) => (
                            <p key={idx} className={idx > 0 ? "mt-1.5" : ""}>
                              {line.split("**").map((chunk, cIdx) => 
                                cIdx % 2 === 1 ? <strong key={cIdx} className="font-bold">{chunk}</strong> : chunk
                              )}
                            </p>
                          ))}

                          {/* If welcome message, render capabilities dashboard */}
                          {msg.id === "welcome" && (
                            <div className="grid grid-cols-2 gap-2 mt-3.5">
                              <button
                                onClick={() => handleChipClick(isArabic ? "اقترح طبق عشوائي" : "Suggest a random lucky dish")}
                                className="p-2.5 bg-[#AD343E]/5 hover:bg-[#AD343E] hover:text-white border border-[#AD343E]/10 rounded-2xl text-start transition duration-200 flex flex-col gap-1 hover:scale-[1.02] active:scale-95 group cursor-pointer"
                              >
                                <span className="text-base group-hover:scale-110 transition-transform duration-200">🎲</span>
                                <span className="font-bold text-[10px] text-[#AD343E] group-hover:text-white">{isArabic ? "طبق الحظ / روليت" : "Food Roulette"}</span>
                                <span className="text-[8.5px] text-gray-500 group-hover:text-white/80 leading-tight">{isArabic ? "اختر طبق عشوائي للمغامرة" : "Pick a random plate"}</span>
                              </button>
                              <button
                                onClick={() => handleChipClick(isArabic ? "اكلات نباتية" : "Vegetarian choices")}
                                className="p-2.5 bg-[#AD343E]/5 hover:bg-[#AD343E] hover:text-white border border-[#AD343E]/10 rounded-2xl text-start transition duration-200 flex flex-col gap-1 hover:scale-[1.02] active:scale-95 group cursor-pointer"
                              >
                                <span className="text-base group-hover:scale-110 transition-transform duration-200">🥗</span>
                                <span className="font-bold text-[10px] text-[#AD343E] group-hover:text-white">{isArabic ? "أطباق نباتية" : "Veg & Healthy"}</span>
                                <span className="text-[8.5px] text-gray-500 group-hover:text-white/80 leading-tight">{isArabic ? "أطباق خالية من اللحوم" : "Meat-free options"}</span>
                              </button>
                              <button
                                onClick={() => handleChipClick(isArabic ? "اكلات حارة" : "Spicy choices")}
                                className="p-2.5 bg-[#AD343E]/5 hover:bg-[#AD343E] hover:text-white border border-[#AD343E]/10 rounded-2xl text-start transition duration-200 flex flex-col gap-1 hover:scale-[1.02] active:scale-95 group cursor-pointer"
                              >
                                <span className="text-base group-hover:scale-110 transition-transform duration-200">🌶️</span>
                                <span className="font-bold text-[10px] text-[#AD343E] group-hover:text-white">{isArabic ? "أطباق حارة" : "Spicy Specials"}</span>
                                <span className="text-[8.5px] text-gray-500 group-hover:text-white/80 leading-tight">{isArabic ? "لمحبي الطعم الحار" : "Feel the heat"}</span>
                              </button>
                              <button
                                onClick={() => handleChipClick(isArabic ? "اكلات اقتصادية" : "Budget friendly options")}
                                className="p-2.5 bg-[#AD343E]/5 hover:bg-[#AD343E] hover:text-white border border-[#AD343E]/10 rounded-2xl text-start transition duration-200 flex flex-col gap-1 hover:scale-[1.02] active:scale-95 group cursor-pointer"
                              >
                                <span className="text-base group-hover:scale-110 transition-transform duration-200">💰</span>
                                <span className="font-bold text-[10px] text-[#AD343E] group-hover:text-white">{isArabic ? "أطباق اقتصادية" : "Value Choices"}</span>
                                <span className="text-[8.5px] text-gray-500 group-hover:text-white/80 leading-tight">{isArabic ? "أطباق ممتازة بأقل من 13$" : "Delicious under $13"}</span>
                              </button>
                            </div>
                          )}

                          {/* Render dish cards if returned */}
                          {msg.type === "dishes" && msg.dishes?.length > 0 && (
                            <div className="grid grid-cols-1 gap-3.5 mt-3 w-full">
                              {msg.dishes.map((dish) => (
                                <DishCard
                                  key={dish.id}
                                  item={dish}
                                  isArabic={isArabic}
                                  handleAddToCart={handleAddToCartFromChat}
                                />
                              ))}
                            </div>
                          )}

                          {/* Render action button link if returned */}
                          {msg.type === "actions" && msg.actions?.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {msg.actions.map((act, actIdx) => (
                                <button
                                  key={actIdx}
                                  onClick={() => {
                                    setIsOpen(false);
                                    navigate(act.path);
                                  }}
                                  className="px-3.5 py-1.5 bg-[#AD343E] hover:bg-[#922730] text-white text-[10px] rounded-full font-bold border border-white/20 transition cursor-pointer flex items-center gap-1 shadow-sm"
                                >
                                  {act.label} <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Was this response helpful? (Only for bot messages, excluding welcome message) */}
                          {isBot && msg.id !== "welcome" && (
                            <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-gray-100/30">
                              <span className="text-[9px] text-gray-400">{tBot("helpful")}</span>
                              <button
                                onClick={() => setReactions(prev => ({ ...prev, [msg.id]: "up" }))}
                                className={`p-1 rounded-lg transition cursor-pointer ${reactions[msg.id] === "up" ? "text-green-600 bg-green-50" : "text-gray-400 hover:text-gray-600"}`}
                              >
                                <ThumbsUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setReactions(prev => ({ ...prev, [msg.id]: "down" }))}
                                className={`p-1 rounded-lg transition cursor-pointer ${reactions[msg.id] === "down" ? "text-red-600 bg-red-50" : "text-gray-400 hover:text-gray-600"}`}
                              >
                                <ThumbsDown className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                        <span className={`text-[9px] text-gray-400 block ${isBot ? "text-start" : "text-end"}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Thinking / Loader indicator */}
                {isLoading && (
                  <div className="flex gap-2.5 max-w-[85%] self-start items-center">
                    <img src={chatbotIcon} alt="Chatbot" className="w-8 h-8 rounded-full object-cover border border-amber-200 flex-shrink-0 animate-bounce" />
                    <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* --- CART TOAST NOTIFICATION --- */}
              <AnimatePresence>
                {cartNotification && (
                  <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="absolute bottom-16 left-4 right-4 z-50 bg-[#2C2F34] text-white p-3 rounded-2xl flex items-center justify-between shadow-[0_12px_30px_rgba(0,0,0,0.25)] border border-white/10"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 leading-none">{tBot("cartAdded")}</p>
                        <p className="text-xs font-bold truncate max-w-[200px] mt-0.5">{cartNotification}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setIsCartOpen(true);
                      }}
                      className="px-3 py-1.5 bg-[#AD343E] hover:bg-[#922730] text-white text-[10px] font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      {tBot("cartView")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* --- SUGGESTION CHIPS --- */}
              <div className="border-t border-gray-100/60 bg-white/80 backdrop-blur-sm">
                {/* Category food shortcuts */}
                <div className="px-3.5 pt-2.5 pb-1.5 overflow-x-auto flex gap-1.5 no-scrollbar">
                  {[
                    { label: isArabic ? "🍕 بيتزا" : "🍕 Pizza",   q: isArabic ? "بيتزا" : "pizza" },
                    { label: isArabic ? "🍔 برجر" : "🍔 Burger",   q: isArabic ? "برجر" : "burger" },
                    { label: isArabic ? "🍝 مكرونة" : "🍝 Pasta",  q: isArabic ? "مكرونة" : "pasta" },
                    { label: isArabic ? "🍰 حلويات" : "🍰 Sweets", q: isArabic ? "حلويات" : "desserts" },
                    { label: isArabic ? "🥤 مشروبات" : "🥤 Drinks",q: isArabic ? "مشروبات" : "drinks" },
                  ].map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleChipClick(chip.q)}
                      className="px-3 py-1 bg-[#FDF5F5] hover:bg-[#AD343E] hover:text-white text-[#AD343E] rounded-full text-[10px] font-bold border border-[#AD343E]/20 flex-shrink-0 transition-all duration-200 hover:scale-[1.05] active:scale-95 shadow-sm cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
                {/* Context chips */}
                <div className="px-3.5 pb-2.5 overflow-x-auto flex gap-1.5 no-scrollbar">
                  {[
                    { label: tBot("quickChips").menu,     q: isArabic ? "وريني قائمة الطعام" : "Show me the menu" },
                    { label: tBot("quickChips").book,     q: isArabic ? "ازاي احجز طاولة؟" : "How can I book a table?" },
                    { label: tBot("quickChips").contact,  q: isArabic ? "رقم تليفونكم وعنوانكم ايه؟" : "What is your contact info?" },
                    { label: tBot("quickChips").catering, q: isArabic ? "ايه خدمات الضيافة المتاحة؟" : "What catering services do you offer?" },
                    { label: tBot("quickChips").articles, q: isArabic ? "اقترح مقالات اقراها" : "Recommend some blog posts" },
                  ].map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleChipClick(chip.q)}
                      className="px-3 py-1 bg-[#F9F9F7] hover:bg-[#AD343E]/5 hover:text-[#AD343E] text-gray-600 rounded-full text-[10px] font-semibold border border-gray-200/60 flex-shrink-0 transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-sm cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* --- BOTTOM INPUT --- */}
              {/* --- INPUT FORM + AUTOCOMPLETE --- */}
              <div className="relative">
                {/* Autocomplete Dropdown */}
                <AnimatePresence>
                  {showAutocomplete && autocompleteList.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full left-3 right-3 mb-1.5 bg-white border border-gray-200/60 rounded-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.1)] overflow-hidden z-50"
                    >
                      {autocompleteList.map((item, idx) => (
                        <button
                          key={idx}
                          onMouseDown={(e) => { e.preventDefault(); handleSendMessage(item.label); }}
                          className={`w-full text-start px-3.5 py-2 text-xs flex items-center gap-2 transition cursor-pointer ${
                            idx === autocompleteIdx ? "bg-[#AD343E]/5 text-[#AD343E]" : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span>{item.icon}</span>
                          <span className="truncate">{item.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-3 bg-white/90 backdrop-blur-sm border-t border-gray-100/60 flex gap-2 items-center"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => { setInputValue(e.target.value); setAutocompleteIdx(-1); }}
                    onKeyDown={(e) => {
                      if (!showAutocomplete) return;
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setAutocompleteIdx(i => Math.min(i + 1, autocompleteList.length - 1));
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setAutocompleteIdx(i => Math.max(i - 1, -1));
                      } else if (e.key === "Tab" || e.key === "Enter") {
                        if (autocompleteIdx >= 0) {
                          e.preventDefault();
                          handleSendMessage(autocompleteList[autocompleteIdx].label);
                        }
                      } else if (e.key === "Escape") {
                        setShowAutocomplete(false);
                      }
                    }}
                    onFocus={() => autocompleteList.length > 0 && setShowAutocomplete(true)}
                    onBlur={() => setTimeout(() => setShowAutocomplete(false), 150)}
                    placeholder={tBot("placeholder")}
                    dir={isRtl ? "rtl" : "ltr"}
                    className="flex-grow p-3 text-xs border border-gray-200/70 rounded-2xl bg-[#F9F9F7] focus:outline-none focus:border-[#AD343E]/50 focus:bg-white focus:ring-2 focus:ring-[#AD343E]/10 transition-all duration-200 placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer flex-shrink-0 ${
                      inputValue.trim() && !isLoading
                        ? "bg-gradient-to-br from-[#AD343E] to-[#922730] text-white shadow-[0_4px_12px_rgba(173,52,62,0.3)] hover:scale-105 hover:shadow-[0_6px_18px_rgba(173,52,62,0.4)]"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Send className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
                  </button>
                </form>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Tailwind specific custom styles injected into body */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          margin: 8px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #AD343E66, #92273066);
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #AD343E, #922730);
        }
        .chatbot-message-enter {
          animation: slideInMsg 0.25s ease-out;
        }
        @keyframes slideInMsg {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
