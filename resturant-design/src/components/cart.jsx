import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { useLanguage } from "../contexts/LanguageContext";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Truck } from "lucide-react";

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
    user,
    isAuthenticated,
    addNotification,
  } = useApp();
  const { t, isArabic } = useLanguage();

  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
  };

  const handleCardCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 3) {
      setCardCvc(value);
    }
  };

  if (!isCartOpen) return null;

  const translateMenuItemName = (item) => {
    if (!item) return "";
    const name = typeof item === "object" ? item.name : item;
    // Support dynamically added items with Arabic name stored in DB
    if (isArabic && typeof item === "object" && item.name_ar) return item.name_ar;
    const trans = t(`menuItems.${name}.name`);
    return trans.startsWith("menuItems.") ? name : trans;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError("Please login to place your order.");
      return;
    }
    if (!phone || !address) {
      setError("Please provide phone and delivery address.");
      return;
    }

    if (paymentMethod === "card") {
      const numericCard = cardNumber.replace(/\s/g, "");
      if (numericCard.length !== 16) {
        setError(t("cart.paymentFailed"));
        return;
      }
      if (!cardExpiry || !cardExpiry.includes("/") || cardExpiry.length !== 5) {
        setError(t("cart.paymentFailed"));
        return;
      }
      if (!cardCvc || cardCvc.length !== 3) {
        setError(t("cart.paymentFailed"));
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      if (paymentMethod === "card") {
        await new Promise((resolve) => setTimeout(resolve, 2500));
      }

      const items = cartItems.map((item) => ({
        menu_item_id: item.id,
        quantity: item.quantity,
      }));

      await api.createOrder(address, phone, notes, paymentMethod, items);
      setSuccess(true);
      clearCart();
      addNotification(
        t("cart.placedSuccess") + " " + t("cart.successDesc"),
        "success"
      );
      setTimeout(() => {
        setIsCartOpen(false);
        setSuccess(false);
        navigate("/profile");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  const deliveryFee = 2.5;
  const grandTotal = cartTotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-[1050] flex justify-end font-['DM_Sans',sans-serif]">
      
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      
      <div 
        className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-10 animate-slide-in overflow-hidden text-start"
        dir={isArabic ? "rtl" : "ltr"}
      >
        
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-[#AD343E] w-6 h-6" />
            <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2C2F34]">
              {t("cart.title")}
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-full hover:bg-gray-200 transition text-[#2C2F34]"
          >
            <X size={20} />
          </button>
        </div>

        
        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white animate-fade-in">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-gray-800 mb-2">
              {t("cart.placedSuccess")}
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              {t("cart.successDesc")}
            </p>
            <span className="text-xs text-gray-400">{t("cart.redirecting")}</span>
          </div>
        ) : (
          <>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">
                  ⚠️ {error}
                </div>
              )}

              {cartItems.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag size={48} className="text-gray-300 stroke-[1.5]" />
                  <p className="text-gray-500 font-medium">{t("cart.empty")}</p>
                  <button
                    onClick={() => { setIsCartOpen(false); navigate("/menu"); }}
                    className="px-5 py-2.5 bg-[#AD343E] hover:bg-[#922730] text-white rounded-full font-bold text-sm transition shadow-sm"
                  >
                    {t("cart.browseMenu")}
                  </button>
                </div>
              ) : (
                <>
                  
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-3 bg-gray-50 rounded-xl hover:shadow-xs transition duration-200"
                      >
                        <img
                          src={
                            parseInt(item.id, 10) >= 1 && parseInt(item.id, 10) <= 27
                              ? `/src/assets/foods/${item.id}.jpg`
                              : item.image_url || (item.image?.startsWith('http') ? item.image : `/src/assets/${item.image}`)
                          }
                          alt={translateMenuItemName(item)}
                          className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.jpg";
                          }}
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between">
                            <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">
                              {translateMenuItemName(item)}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 transition"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                              <button
                                onClick={() =>
                                  updateCartQuantity(item.id, item.quantity - 1)
                                }
                                className="px-2 py-1 hover:bg-gray-100 transition text-[#2C2F34]"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-3 py-1 font-bold text-xs text-[#2C2F34]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateCartQuantity(item.id, item.quantity + 1)
                                }
                                className="px-2 py-1 hover:bg-gray-100 transition text-[#2C2F34]"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="font-bold text-gray-800 text-sm">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>{t("cart.subtotal")}</span>
                      <span className="font-semibold text-gray-800">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("cart.deliveryFee")}</span>
                      <span className="font-semibold text-gray-800">
                        ${deliveryFee.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-800">
                      <span>{t("cart.grandTotal")}</span>
                      <span className="text-[#AD343E]">
                        ${grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  
                  <div className="border-t border-gray-100 pt-6">
                    {!isAuthenticated ? (
                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-xs leading-relaxed space-y-3">
                        <p>
                          {t("cart.loginRequired")}
                        </p>
                        <button
                          onClick={() => {
                            setIsCartOpen(false);
                            navigate("/auth");
                          }}
                          className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition text-center block"
                        >
                          {t("cart.loginBtn")}
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleCheckout} className="space-y-4">
                        <h3 className="font-['Playfair_Display',serif] text-lg font-bold text-gray-800">
                          {t("cart.checkoutDetails")}
                        </h3>

                        
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                            {t("cart.contactPhone")}
                          </label>
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            placeholder={t("cart.phonePlaceholder")}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#AD343E]"
                          />
                        </div>

                        
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                            {t("cart.deliveryAddress")}
                          </label>
                          <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            rows={2}
                            placeholder={t("cart.addressPlaceholder")}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#AD343E]"
                          />
                        </div>

                        
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                            {t("cart.orderNotes")}
                          </label>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={1}
                            placeholder={t("cart.notesPlaceholder")}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#AD343E]"
                          />
                        </div>

                        
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
                            {t("cart.paymentMethod")}
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setPaymentMethod("cod")}
                              className={`flex items-center justify-center gap-2 p-2.5 border rounded-lg text-xs font-bold transition duration-200 ${
                                paymentMethod === "cod"
                                  ? "border-[#AD343E] bg-[#AD343E]/5 text-[#AD343E]"
                                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              <Truck size={14} />
                              {t("cart.cod")}
                            </button>
                            <button
                              type="button"
                              onClick={() => setPaymentMethod("card")}
                              className={`flex items-center justify-center gap-2 p-2.5 border rounded-lg text-xs font-bold transition duration-200 ${
                                paymentMethod === "card"
                                  ? "border-[#AD343E] bg-[#AD343E]/5 text-[#AD343E]"
                                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              <CreditCard size={14} />
                              {t("cart.creditCard")}
                            </button>
                          </div>
                        </div>

                        {paymentMethod === "card" && (
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 animate-fade-in text-start">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Stripe Secure Checkout
                              </span>
                              <CreditCard className="text-[#AD343E] w-4 h-4" />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">
                                {t("cart.cardNumber")}
                              </label>
                              <input
                                type="text"
                                placeholder={t("cart.cardPlaceholder")}
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#AD343E]"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">
                                  {t("cart.cardExpiry")}
                                </label>
                                <input
                                  type="text"
                                  placeholder={t("cart.expiryPlaceholder")}
                                  value={cardExpiry}
                                  onChange={handleCardExpiryChange}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#AD343E]"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">
                                  {t("cart.cardCvc")}
                                </label>
                                <input
                                  type="password"
                                  placeholder={t("cart.cvcPlaceholder")}
                                  value={cardCvc}
                                  onChange={handleCardCvcChange}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#AD343E]"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 bg-[#AD343E] hover:bg-[#922730] text-white rounded-full font-bold text-sm transition shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {loading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              {paymentMethod === "card"
                                ? t("cart.paymentProcessing")
                                : t("cart.processing")}
                            </>
                          ) : (
                            t("cart.placeOrder")
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        .animate-slide-in {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CartDrawer;
