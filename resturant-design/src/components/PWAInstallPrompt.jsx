// ==========================================================================
// PWA Install Prompt — Shows a beautiful banner prompting the user to install
// the app on their device
// ==========================================================================
import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { isArabic } = useLanguage();

  useEffect(() => {
    // Check if already installed or dismissed
    const wasDismissed = sessionStorage.getItem("pwa_prompt_dismissed");
    if (wasDismissed) return;

    // Check if already running as standalone (installed)
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after 8 seconds
      setTimeout(() => setShowPrompt(true), 8000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    sessionStorage.setItem("pwa_prompt_dismissed", "true");
  };

  if (!showPrompt || dismissed) return null;

  return (
    <div
      className={`fixed bottom-6 z-[2000] animate-slide-up font-['DM_Sans',sans-serif] ${
        isArabic ? "left-6 right-auto" : "right-6 left-auto"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
      style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 max-w-xs w-full flex gap-3 items-start">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-[#AD343E] flex items-center justify-center flex-shrink-0 shadow-md">
          <Smartphone size={22} color="white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#2C2F34]">
            {isArabic ? "نزّل التطبيق!" : "Install the App!"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            {isArabic
              ? "أضف بيسترو بليس لشاشتك الرئيسية للوصول السريع"
              : "Add Bistro Bliss to your home screen for quick access"}
          </p>

          {/* Buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#AD343E] hover:bg-[#922730] text-white text-xs font-bold rounded-full transition shadow-sm"
            >
              <Download size={12} />
              {isArabic ? "تنزيل" : "Install"}
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 text-gray-400 hover:text-gray-600 text-xs font-semibold rounded-full hover:bg-gray-100 transition"
            >
              {isArabic ? "لاحقاً" : "Later"}
            </button>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={handleDismiss}
          className="text-gray-300 hover:text-gray-500 transition flex-shrink-0 -mt-1"
        >
          <X size={16} />
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PWAInstallPrompt;
