// ==========================================================================
// [1] IMPORTS
// ==========================================================================
import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { useLanguage } from "../contexts/LanguageContext";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import {
  Key,
  Mail,
  User,
  Phone,
  CheckCircle,
  ShieldAlert,
  Loader2,
} from "lucide-react";

// ==========================================================================
// [2] MAIN COMPONENT: AUTHENTICATION
// ==========================================================================
const Auth = () => {
  const { loginUser } = useApp();
  const { t, isArabic } = useLanguage();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // --- تم إصلاح الخطأ بإضافة السطر التالي ---
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        // LOGIN
        const response = await api.login(email, password);
        setSuccess(t("auth.successLogin"));
        loginUser(response.user, response.token);
        setTimeout(() => {
          if (response.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/profile");
          }
        }, 1200);
      } else {
        // REGISTER
        if (password !== confirmPassword) {
          throw new Error(t("auth.matchError"));
        }
        const response = await api.register(
          name,
          email,
          phone,
          password,
          confirmPassword,
        );
        setSuccess(t("auth.successRegister"));
        loginUser(response.user, response.token);
        setTimeout(() => {
          navigate("/profile");
        }, 1200);
      }
    } catch (err) {
      setError(err.message || t("auth.failAuth"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="font-['DM_Sans',sans-serif] bg-[#f9f9f7]/40 min-h-screen text-start"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <PageHeader
        title={isLogin ? t("auth.titleLogin") : t("auth.titleRegister")}
        description={isLogin ? t("auth.descLogin") : t("auth.descRegister")}
      />

      <section className="py-16 px-6 max-w-md mx-auto">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden p-8 space-y-6">
          <div className="flex border-b border-gray-150 pb-4">
            <button
              onClick={() => {
                setIsLogin(true);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 font-bold text-sm text-center border-b-2 transition ${
                isLogin
                  ? "border-[#AD343E] text-[#AD343E]"
                  : "border-transparent text-gray-400 hover:text-[#2C2F34]"
              }`}
            >
              {t("auth.signInTab")}
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 font-bold text-sm text-center border-b-2 transition ${
                !isLogin
                  ? "border-[#AD343E] text-[#AD343E]"
                  : "border-transparent text-gray-400 hover:text-[#2C2F34]"
              }`}
            >
              {t("auth.registerTab")}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 text-xs font-semibold flex items-center gap-2 animate-shake">
              <ShieldAlert size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 text-green-700 rounded-xl border border-green-100 text-xs font-semibold flex items-center gap-2">
              <CheckCircle size={14} className="shrink-0 text-green-600" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                  <User size={12} className="text-[#AD343E]" />
                  {t("auth.fullName")}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("auth.fullNamePlaceholder")}
                  className="w-full px-4 py-2.5 border border-gray-200 bg-[#f9f9f7] rounded-xl text-sm focus:outline-none focus:border-[#AD343E] focus:bg-white transition"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                <Mail size={12} className="text-[#AD343E]" />
                {t("auth.email")}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth.emailPlaceholder")}
                className="w-full px-4 py-2.5 border border-gray-200 bg-[#f9f9f7] rounded-xl text-sm focus:outline-none focus:border-[#AD343E] focus:bg-white transition"
              />
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                  <Phone size={12} className="text-[#AD343E]" />
                  {t("auth.phone")}
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("auth.phonePlaceholder")}
                  className="w-full px-4 py-2.5 border border-gray-200 bg-[#f9f9f7] rounded-xl text-sm focus:outline-none focus:border-[#AD343E] focus:bg-white transition"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                <Key size={12} className="text-[#AD343E]" />
                {t("auth.password")}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-gray-200 bg-[#f9f9f7] rounded-xl text-sm focus:outline-none focus:border-[#AD343E] focus:bg-white transition"
              />
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                  <Key size={12} className="text-[#AD343E]" />
                  {t("auth.confirmPassword")}
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-200 bg-[#f9f9f7] rounded-xl text-sm focus:outline-none focus:border-[#AD343E] focus:bg-white transition"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-[#AD343E] hover:bg-[#922730] text-white rounded-full font-bold text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  {t("auth.authenticating")}
                </>
              ) : isLogin ? (
                t("auth.signInBtn")
              ) : (
                t("auth.registerBtn")
              )}
            </button>
          </form>
        </div>
      </section>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 2;
        }
      `}</style>
    </div>
  );
};

export default Auth;
