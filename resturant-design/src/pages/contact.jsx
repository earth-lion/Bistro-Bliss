// ==========================================================================
// [1] IMPORTS
// ==========================================================================
import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { useLanguage } from "../contexts/LanguageContext";
import { useApp } from "../contexts/AppContext";
import { api } from "../services/api";
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2, MessageSquare, Reply } from "lucide-react";

// ==========================================================================
// [2] MAIN COMPONENT: CONTACT US
// ==========================================================================
const Contact = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useApp();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // User's previous messages + admin replies
  const [myMessages, setMyMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.email) setEmail(user.email);
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user?.role !== "admin") {
      fetchMyMessages();
    }
  }, [isAuthenticated, user]);

  const fetchMyMessages = async () => {
    setLoadingMessages(true);
    try {
      const data = await api.getMyMessages();
      setMyMessages(Array.isArray(data) ? data : []);
    } catch {
      // silently ignore
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.sendContactMessage(name, email, subject, message);
      setSubmitted(true);
      setSubject("");
      setMessage("");
      // refresh messages list for logged-in users
      if (isAuthenticated && user?.role !== "admin") {
        fetchMyMessages();
      }
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-['DM_Sans',sans-serif] bg-white text-[#41454C] min-h-screen text-left overflow-x-hidden">
      <PageHeader
        title={t("contact.title")}
        description={t("contact.desc")}
      />

      <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* 
          ======================================================================
          [ SECTION 1 ] : CONTACT INFORMATION
          ======================================================================
        */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-[#F9F9F7] rounded-[32px] p-8 md:p-10 border border-gray-150 space-y-6 shadow-sm">
            <h3 className="font-['Playfair_Display',serif] text-3xl font-bold text-[#2C2F34]">{t("contact.getInTouch")}</h3>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-white border border-gray-150 rounded-2xl text-[#AD343E] shrink-0 shadow-xs">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{t("contact.callUs")}</h4>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">(414) 857 - 0107</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-white border border-gray-150 rounded-2xl text-[#AD343E] shrink-0 shadow-xs">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{t("contact.emailUs")}</h4>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">yummy@bistrobliss.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-white border border-gray-150 rounded-2xl text-[#AD343E] shrink-0 shadow-xs">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{t("contact.visitUs")}</h4>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium leading-relaxed">
                    123 Restaurant Row, Foodie Haven, NY 10001
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-64 rounded-[32px] overflow-hidden shadow-lg relative border border-gray-150 bg-[#e5e7eb] flex items-center justify-center text-center group">
            <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
            <div className="relative z-10 p-6 space-y-3">
              <div className="w-12 h-12 bg-[#AD343E] text-white rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce group-hover:scale-110 duration-300">
                <MapPin size={22} />
              </div>
              <h4 className="font-['Playfair_Display',serif] font-bold text-[#2C2F34] text-base">Bistro Bliss Manhattan</h4>
              <p className="text-[10px] text-gray-500 max-w-xs mx-auto leading-relaxed">
                Interactive Map Loading... (Google Maps API sandbox active)
              </p>
            </div>
          </div>

          {/* Previous Messages & Replies — only for logged-in non-admin users */}
          {isAuthenticated && user?.role !== "admin" && (
            <div className="bg-[#F9F9F7] rounded-[32px] p-6 border border-gray-150 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-[#AD343E]" />
                <h3 className="font-bold text-[#2C2F34] text-sm uppercase tracking-wide">
                  {t("contact.myMessages") || "My Messages"}
                </h3>
              </div>

              {loadingMessages ? (
                <div className="flex items-center gap-2 text-xs text-gray-400 py-3">
                  <Loader2 size={14} className="animate-spin" /> Loading messages...
                </div>
              ) : myMessages.length === 0 ? (
                <p className="text-xs text-gray-400 py-2">
                  {t("contact.noMessages") || "No messages yet. Send us your first message!"}
                </p>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {myMessages.map((msg) => (
                    <div key={msg.id} className="border border-gray-200 rounded-2xl overflow-hidden text-xs">
                      {/* Original message */}
                      <div className="p-3 bg-white">
                        <p className="font-bold text-gray-700 truncate">{msg.subject}</p>
                        <p className="text-gray-500 mt-1 line-clamp-2">{msg.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1.5">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {/* Admin reply */}
                      {msg.reply ? (
                        <div className="p-3 bg-green-50 border-t border-green-100 flex gap-2">
                          <Reply size={13} className="text-green-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-green-700 text-[10px] uppercase mb-1">
                              {t("contact.adminReply") || "Admin Reply"}
                            </p>
                            <p className="text-green-800">{msg.reply}</p>
                            <p className="text-[10px] text-green-500 mt-1">
                              {new Date(msg.replied_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="px-3 py-2 bg-amber-50 border-t border-amber-100">
                          <span className="text-[10px] text-amber-600 font-semibold">
                            ⏳ {t("contact.pendingReply") || "Awaiting reply..."}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 
          ======================================================================
          [ SECTION 2 ] : SEND MESSAGE FORM
          ======================================================================
        */}
        <div className="lg:col-span-7 bg-[#F9F9F7] rounded-[32px] p-8 md:p-12 border border-gray-150 shadow-xl space-y-8">
          <h3 className="font-['Playfair_Display',serif] text-3xl font-bold text-[#2C2F34]">{t("contact.sendMessage")}</h3>

          {submitted && (
            <div className="p-5 bg-green-50 text-green-850 rounded-2xl border border-green-150 flex items-center gap-3 text-xs font-semibold animate-fade-in shadow-xs">
              <CheckCircle className="text-green-600 shrink-0" size={18} />
              <span>{t("contact.successMsg")}</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-150 text-xs font-semibold animate-fade-in">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">{t("contact.yourName")}</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder={t("contact.namePlaceholder")} className="w-full px-4 py-3.5 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:border-[#AD343E] focus:ring-2 focus:ring-[#AD343E]/10 transition" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">{t("contact.emailAddress")}</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("contact.emailPlaceholder")} className="w-full px-4 py-3.5 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:border-[#AD343E] focus:ring-2 focus:ring-[#AD343E]/10 transition" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">{t("contact.subject")}</label>
              <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={t("contact.subjectPlaceholder")} className="w-full px-4 py-3.5 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:border-[#AD343E] focus:ring-2 focus:ring-[#AD343E]/10 transition" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">{t("contact.messageContent")}</label>
              <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t("contact.messagePlaceholder")} className="w-full px-4 py-3.5 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:border-[#AD343E] focus:ring-2 focus:ring-[#AD343E]/10 transition" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#AD343E] hover:bg-[#922730] text-white rounded-full font-bold text-sm transition shadow-lg shadow-[#AD343E]/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" />{t("contact.sending")}</>
              ) : (
                <><Send size={14} />{t("contact.sendMessage")}</>
              )}
            </button>
          </form>
        </div>
      </section>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Contact;
