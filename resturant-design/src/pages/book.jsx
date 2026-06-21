// ==========================================================================
// [1] IMPORTS
// ==========================================================================
import { useState, useRef, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import { useLanguage } from "../contexts/LanguageContext";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import {
  Calendar,
  Users,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// ==========================================================================
// [2] MAIN COMPONENT: BOOK A TABLE
// ==========================================================================
const BookTable = () => {
  const { isAuthenticated, addNotification } = useApp();
  const { t, isArabic } = useLanguage();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardRef = useRef(null);
  const [mapTop, setMapTop] = useState(0);

  useEffect(() => {
    const calculateTop = () => {
      if (sectionRef.current && cardRef.current) {
        const sectionRect = sectionRef.current.getBoundingClientRect();
        const cardRect = cardRef.current.getBoundingClientRect();
        setMapTop(cardRect.top - sectionRect.top);
      }
    };

    calculateTop();
    window.addEventListener("resize", calculateTop);
    return () => window.removeEventListener("resize", calculateTop);
  }, []);

  const [guests, setGuests] = useState("4");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError(t("book.loginError"));
      return;
    }
    if (!date || !time) {
      setError(t("book.selectError"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.createBooking(guests, date, time);
      setSuccess(true);
      setDate("");
      setGuests("4");
      addNotification(
        isArabic
          ? `تم استلام طلب حجز طاولتك بنجاح! سنراجعه ونؤكده قريباً.`
          : `Your table booking request was received! We'll confirm it shortly.`,
        "success"
      );
    } catch (err) {
      setError(
        err.message || (isArabic ? "فشل تقديم الحجز. يرجى المحاولة مرة أخرى." : "Failed to submit reservation. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    "12:00",
    "13:00",
    "14:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
  ];

  return (
    <div
      className="font-['DM_Sans',sans-serif] bg-white text-[#41454C] min-h-screen text-start overflow-x-hidden"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <PageHeader
        title={t("book.title")}
        description={t("book.desc")}
      />

      {/* 
        ======================================================================
        [ SECTION 1 ] : BOOKING FORM & MAP
        Description   : Interactive map background with a booking form 
                        overlay for users to reserve a table.
        ======================================================================
      */}
      <section
        ref={sectionRef}
        className="relative pt-0 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div
          className="absolute inset-x-0 w-full"
          style={{
            top: mapTop ? `${mapTop}px` : 0,
            bottom: 0,
          }}
        >
          <iframe
            title="Restaurant Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0196993739287!2d-122.4199066846815!3d37.774929779759444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c0de5a909%3A0x8b46c50841c6c3d5!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            className="w-full h-full border-0 grayscale-[0.5] contrast-75"
            loading="lazy"
          />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="relative overflow-hidden rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.08)]">
            <div
              ref={cardRef}
              className="relative z-10 px-6 py-12 md:px-10 md:py-14"
            >
              <div className="mx-auto max-w-4xl rounded-[40px] bg-white/95 p-8 shadow-2xl border border-white backdrop-blur-xl">
                <div
                  ref={headerRef}
                  className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center"
                >
                  <div className="space-y-5 text-center lg:text-start">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#F3E8E9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#AD343E]">
                      {t("book.badge")}
                    </span>
                    <h2 className="text-5xl md:text-6xl font-['Playfair_Display',serif] font-extrabold text-[#2C2F34] leading-tight">
                      {t("book.heading")}
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm leading-7 text-[#4F5258] lg:text-start">
                      {t("book.tagline")}
                    </p>
                  </div>

                  <div className="hidden lg:block rounded-[32px] overflow-hidden border border-[#F0E8E4] shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=900&q=80"
                      alt={t("book.tableSettingAlt")}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="mt-10 space-y-6">
                  {success && (
                    <div className="rounded-3xl border border-green-100 bg-green-50 p-5 text-sm text-green-800">
                      <div className="flex items-center gap-2 font-semibold">
                        <CheckCircle size={18} /> {t("book.successTitle")}
                      </div>
                      <p className="mt-2 leading-relaxed text-green-700">
                        {t("book.successDesc")}
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="rounded-3xl border border-red-100 bg-red-50 p-4 text-xs font-semibold text-red-700 flex items-center gap-2">
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </div>
                  )}

                  {!isAuthenticated ? (
                    <div className="rounded-[32px] border border-gray-200 bg-white p-8 text-center shadow-sm">
                      <p className="text-xl font-semibold text-[#2C2F34]">
                        {t("book.loginRequired")}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-[#6B6F75]">
                        {t("book.loginRequiredDesc")}
                      </p>
                      <button
                        onClick={() => navigate("/auth")}
                        className="mt-6 inline-flex rounded-full bg-[#AD343E] px-8 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-[#AD343E]/20 transition hover:bg-[#922730]"
                      >
                        {t("book.loginBtn")}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#7D7F83]">
                            <Calendar size={14} className="text-[#AD343E]" />
                            {t("book.bookingDate")}
                          </label>
                          <input
                            type="date"
                            required
                            min={todayStr}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full rounded-[24px] border border-[#E6E1DC] bg-white px-4 py-3 text-sm text-[#2C2F34] outline-none transition focus:border-[#AD343E] focus:ring-2 focus:ring-[#AD343E]/10"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#7D7F83]">
                            <Clock size={14} className="text-[#AD343E]" />
                            {t("book.selectTime")}
                          </label>
                          <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full rounded-[24px] border border-[#E6E1DC] bg-white px-4 py-3 text-sm text-[#2C2F34] outline-none transition focus:border-[#AD343E] focus:ring-2 focus:ring-[#AD343E]/10"
                          >
                            {timeSlots.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}{" "}
                                {parseInt(slot.split(":")[0], 10) >= 12
                                  ? (isArabic ? "مساءً" : "PM")
                                  : (isArabic ? "صباحاً" : "AM")}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="space-y-3">
                          <label className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#7D7F83]">
                            {t("book.yourName")}
                          </label>
                          <input
                            type="text"
                            placeholder={t("book.namePlaceholder")}
                            className="w-full rounded-[24px] border border-[#E6E1DC] bg-white px-4 py-3 text-sm text-[#2C2F34] outline-none transition focus:border-[#AD343E] focus:ring-2 focus:ring-[#AD343E]/10"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#7D7F83]">
                            {t("book.phone")}
                          </label>
                          <input
                            type="tel"
                            placeholder={t("book.phonePlaceholder")}
                            className="w-full rounded-[24px] border border-[#E6E1DC] bg-white px-4 py-3 text-sm text-[#2C2F34] outline-none transition focus:border-[#AD343E] focus:ring-2 focus:ring-[#AD343E]/10"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#7D7F83]">
                          <Users size={14} className="text-[#AD343E]" />
                          {t("book.totalPersons")}
                        </label>
                        <select
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          className="w-full rounded-[24px] border border-[#E6E1DC] bg-white px-4 py-3 text-sm text-[#2C2F34] outline-none transition focus:border-[#AD343E] focus:ring-2 focus:ring-[#AD343E]/10"
                        >
                          {["2", "4", "6", "8", "10+"].map((num) => (
                            <option key={num} value={num}>
                              {num} {t("book.people")}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full rounded-full bg-[#AD343E] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_24px_40px_rgba(173,52,62,0.25)] transition hover:bg-[#922730] disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            {t("book.sending")}
                          </>
                        ) : (
                          t("book.bookBtn")
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookTable;
