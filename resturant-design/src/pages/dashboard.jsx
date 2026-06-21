// ==========================================================================
// [1] IMPORTS
// ==========================================================================
import { useState, useEffect, useCallback } from "react";
import { useApp } from "../contexts/AppContext";
import { useLanguage } from "../contexts/LanguageContext";
import { api } from "../services/api";
import PageHeader from "../components/PageHeader";
import { useNavigate } from "react-router-dom";
import {
  User,
  ShoppingBag,
  Calendar,
  Lock,
  Loader2,
  CheckCircle,
  RefreshCw,
  Mail,
  Reply,
  Send,
} from "lucide-react";

// ==========================================================================
// [2] MAIN COMPONENT: USER DASHBOARD
// ==========================================================================
const Dashboard = () => {
  const { user, refreshUser, isAdmin } = useApp();
  const { t, isArabic } = useLanguage();
  const navigate = useNavigate();

  // Bug 2 Fix: redirect admin to /admin panel instead of user dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [isAdmin, navigate]);

  const [activeTab, setActiveTab] = useState("orders");

  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Support Message states
  const [msgSubject, setMsgSubject] = useState("");
  const [msgMessage, setMsgMessage] = useState("");
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState("");
  const [msgError, setMsgError] = useState("");

  // Follow-up reply states
  const [replyText, setReplyText] = useState({});
  const [replyLoading, setReplyLoading] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoadingList(true);
    try {
      if (activeTab === "orders") {
        const orderData = await api.getMyOrders();
        setOrders(orderData);
      } else if (activeTab === "bookings") {
        const bookingData = await api.getMyBookings();
        setBookings(bookingData);
      } else if (activeTab === "messages") {
        const messageData = await api.getMyMessages();
        setMessages(messageData);
      }
    } catch (err) {
      console.error("Could not fetch user history data", err);
    } finally {
      setLoadingList(false);
    }
  }, [activeTab]);

  const handleCreateMessage = async (e) => {
    e.preventDefault();
    setMsgLoading(true);
    setMsgSuccess("");
    setMsgError("");
    try {
      if (!msgSubject.trim() || !msgMessage.trim()) {
        throw new Error("Subject and Message are required.");
      }
      await api.sendContactMessage(user.name, user.email, msgSubject.trim(), msgMessage.trim());
      setMsgSuccess(t("dashboard.msgSuccess"));
      setMsgSubject("");
      setMsgMessage("");
      const messageData = await api.getMyMessages();
      setMessages(messageData);
    } catch (err) {
      setMsgError(err.message || "Failed to send message.");
    } finally {
      setMsgLoading(false);
    }
  };

  const handleReplyMessage = async (id, parentSubject) => {
    const replyTextVal = replyText[id];
    if (!replyTextVal || !replyTextVal.trim()) return;

    setReplyLoading(id);
    try {
      await api.sendContactMessage(
        user.name,
        user.email,
        parentSubject.startsWith("Re:") ? parentSubject : `Re: ${parentSubject}`,
        replyTextVal.trim()
      );
      setReplyText((prev) => ({ ...prev, [id]: "" }));
      const messageData = await api.getMyMessages();
      setMessages(messageData);
    } catch (err) {
      console.error("Failed to send follow-up message", err);
    } finally {
      setReplyLoading(null);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get("tab");
    if (tab && ["orders", "bookings", "messages", "profile"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [window.location.search]);

  useEffect(() => {
    const handleRefresh = () => fetchHistory();
    window.addEventListener("bistro_data_refreshed", handleRefresh);
    return () => window.removeEventListener("bistro_data_refreshed", handleRefresh);
  }, [fetchHistory]);

  useEffect(() => {
    const loadHistory = async () => {
      await fetchHistory();
    };
    loadHistory();
  }, [fetchHistory]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess("");
    setProfileError("");

    try {
      if (password && password !== confirmPassword) {
        throw new Error(t("auth.matchError"));
      }
      await api.updateProfile(name, phone, password, confirmPassword);
      setProfileSuccess(t("dashboard.profileSuccess"));
      setPassword("");
      setConfirmPassword("");
      await refreshUser();
    } catch (err) {
      setProfileError(err.message || t("dashboard.profileError"));
    } finally {
      setProfileLoading(false);
    }
  };

  // ==========================================================================
  // [3] UTILITY FUNCTIONS
  // ==========================================================================
  const getOrderStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-250",
      accepted: "bg-blue-50 text-blue-700 border-blue-250",
      in_progress: "bg-purple-50 text-purple-700 border-purple-250",
      delivered: "bg-green-50 text-green-700 border-green-250",
      rejected: "bg-red-50 text-red-700 border-red-250",
    };
    return (
      <span
        className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${styles[status] || styles.pending}`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  const getBookingStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-250",
      confirmed: "bg-green-50 text-green-700 border-green-250",
      rejected: "bg-red-50 text-red-700 border-red-250",
    };
    return (
      <span
        className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${styles[status] || styles.pending}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div
      className="font-['DM_Sans',sans-serif] bg-white text-[#41454C] min-h-screen text-left"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <PageHeader
        title={t("dashboard.title")}
        description={t("dashboard.desc")}
      />

      <section className="py-16 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#f9f9f7] rounded-3xl p-6 border border-gray-100 flex flex-col space-y-2 dark:bg-[#1c1310] dark:border-[#2a201c]">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-start ${
                activeTab === "orders"
                  ? "bg-[#AD343E] text-white"
                  : "hover:!bg-white hover:!text-black text-[#2C2F34] dark:text-[#f4ede9] dark:hover:!bg-white dark:hover:!text-black border border-transparent hover:border-gray-200 dark:hover:border-white/20"
              }`}
            >
              <ShoppingBag size={16} />
              {t("dashboard.tabOrders")}
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-start ${
                activeTab === "bookings"
                  ? "bg-[#AD343E] text-white"
                  : "hover:!bg-white hover:!text-black text-[#2C2F34] dark:text-[#f4ede9] dark:hover:!bg-white dark:hover:!text-black border border-transparent hover:border-gray-200 dark:hover:border-white/20"
              }`}
            >
              <Calendar size={16} />
              {t("dashboard.tabBookings")}
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-start ${
                activeTab === "messages"
                  ? "bg-[#AD343E] text-white"
                  : "hover:!bg-white hover:!text-black text-[#2C2F34] dark:text-[#f4ede9] dark:hover:!bg-white dark:hover:!text-black border border-transparent hover:border-gray-200 dark:hover:border-white/20"
              }`}
            >
              <Mail size={16} />
              {t("dashboard.tabMessages")}
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-start ${
                activeTab === "profile"
                  ? "bg-[#AD343E] text-white"
                  : "hover:!bg-white hover:!text-black text-[#2C2F34] dark:text-[#f4ede9] dark:hover:!bg-white dark:hover:!text-black border border-transparent hover:border-gray-200 dark:hover:border-white/20"
              }`}
            >
              <User size={16} />
              {t("dashboard.tabProfile")}
            </button>
          </div>
        </div>

        
        <div className="lg:col-span-9 bg-white rounded-3xl border border-gray-100 shadow-xl p-8 min-h-[400px]">
          {/* TAB 1: MY ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2C2F34]">
                  {t("dashboard.ordersTitle")}
                </h3>
                <button
                  onClick={fetchHistory}
                  className="p-2 hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full transition"
                  title="Reload Orders"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              {loadingList ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-[#AD343E]" />
                  <p className="text-xs text-gray-400">{t("dashboard.ordersLoading")}</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400 space-y-3">
                  <ShoppingBag size={40} className="stroke-[1.5]" />
                  <p className="font-semibold text-sm">{t("dashboard.ordersEmpty")}</p>
                  <p className="text-xs text-gray-400">{t("dashboard.ordersEmptyDesc")}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition duration-200"
                    >
                      <div className="p-5 bg-gray-50 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-500">
                            {t("dashboard.orderId")}: #{order.id}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {t("dashboard.placedOn")}{" "}
                            {new Date(order.created_at).toLocaleDateString()}{" "}
                            {t("dashboard.at")}{" "}
                            {new Date(order.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {getOrderStatusBadge(order.status)}
                          <span className="font-bold text-gray-800 text-base">
                            ${parseFloat(order.total_price).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-3">
                          <p className="font-semibold text-gray-700 text-xs uppercase tracking-wide">
                            {t("dashboard.productsOrdered")}
                          </p>
                          <ul className="space-y-2.5">
                            {order.items?.map((item) => (
                              <li
                                key={item.id}
                                className="flex justify-between items-center text-xs text-gray-600"
                              >
                                <span>
                                  {item.name || item.menu_item?.name}{" "}
                                  <span className="font-bold text-gray-800">
                                    x{item.pivot?.quantity}
                                  </span>
                                </span>
                                <span className="font-semibold text-gray-800">
                                  $
                                  {(
                                    item.pivot?.price * item.pivot?.quantity
                                  ).toFixed(2)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2 border-t md:border-t-0 md:border-s border-gray-150/50 pt-4 md:pt-0 md:ps-6 text-xs space-y-2.5 text-gray-600">
                          <p className="font-semibold text-gray-700 text-xs uppercase tracking-wide">
                            {t("dashboard.shippingDetails")}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-800">{t("dashboard.phone")}:</span>{" "}
                            {order.phone}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-800">{t("dashboard.address")}:</span>{" "}
                            {order.address}
                          </p>
                          {order.notes && (
                            <p>
                              <span className="font-semibold text-gray-800">{t("dashboard.notes")}:</span>{" "}
                              {order.notes}
                            </p>
                          )}
                          <p>
                            <span className="font-semibold text-gray-800">{t("dashboard.payment")}:</span>{" "}
                            {order.payment_method === "cod"
                              ? t("dashboard.cod")
                              : t("dashboard.card")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2C2F34]">
                  {t("dashboard.bookingsTitle")}
                </h3>
                <button
                  onClick={fetchHistory}
                  className="p-2 hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full transition"
                  title="Reload Bookings"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              {loadingList ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-[#AD343E]" />
                  <p className="text-xs text-gray-400">{t("dashboard.bookingsLoading")}</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400 space-y-3">
                  <Calendar size={40} className="stroke-[1.5]" />
                  <p className="font-semibold text-sm">{t("dashboard.bookingsEmpty")}</p>
                  <p className="text-xs text-gray-400">{t("dashboard.bookingsEmptyDesc")}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-gray-600">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-start">
                        <th className="px-5 py-3.5 text-start">{t("dashboard.bookingId")}</th>
                        <th className="px-5 py-3.5 text-start">{t("dashboard.bookingDate")}</th>
                        <th className="px-5 py-3.5 text-start">{t("dashboard.bookingTime")}</th>
                        <th className="px-5 py-3.5 text-start">{t("dashboard.guests")}</th>
                        <th className="px-5 py-3.5 text-start">{t("dashboard.status")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-5 py-4 font-bold text-gray-800">
                            #{booking.id}
                          </td>
                          <td className="px-5 py-4">
                            {new Date(booking.booking_date).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-4">{booking.booking_time}</td>
                          <td className="px-5 py-4 font-bold text-gray-800">
                            {booking.num_of_people} {t("dashboard.people")}
                          </td>
                          <td className="px-5 py-4">
                            {getBookingStatusBadge(booking.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: SUPPORT MESSAGES */}
          {activeTab === "messages" && (
            <div className="space-y-8 text-start">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2C2F34]">
                  {t("dashboard.messagesTitle")}
                </h3>
                <button
                  onClick={fetchHistory}
                  className="p-2 hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full transition cursor-pointer"
                  title="Reload Messages"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              {/* NEW MESSAGE FORM */}
              <div className="bg-[#f9f9f7] rounded-3xl p-6 border border-gray-150 space-y-4">
                <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                  <Mail size={16} className="text-[#AD343E]" />
                  {t("dashboard.sendNewMessage")}
                </h4>

                {msgSuccess && (
                  <div className="p-3 bg-green-50 text-green-700 border border-green-150 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-600 shrink-0" />
                    <span>{msgSuccess}</span>
                  </div>
                )}

                {msgError && (
                  <div className="p-3 bg-red-50 text-red-700 border border-red-150 rounded-xl text-xs font-semibold">
                    ⚠️ {msgError}
                  </div>
                )}

                <form onSubmit={handleCreateMessage} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-600 uppercase">
                      {t("dashboard.msgSubject")}
                    </label>
                    <input
                      type="text"
                      required
                      value={msgSubject}
                      onChange={(e) => setMsgSubject(e.target.value)}
                      placeholder={t("dashboard.msgSubjectPlaceholder")}
                      className="w-full px-4 py-2 border border-gray-200 bg-white rounded-xl text-xs focus:outline-none focus:border-[#AD343E] transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-600 uppercase">
                      {t("dashboard.msgBody")}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={msgMessage}
                      onChange={(e) => setMsgMessage(e.target.value)}
                      placeholder={t("dashboard.msgBodyPlaceholder")}
                      className="w-full px-4 py-2 border border-gray-200 bg-white rounded-xl text-xs focus:outline-none focus:border-[#AD343E] transition resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={msgLoading}
                    className="px-6 py-2.5 bg-[#AD343E] hover:bg-[#922730] text-white rounded-full font-bold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {msgLoading ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        {t("dashboard.sendingMsg")}
                      </>
                    ) : (
                      <>
                        <Send size={12} />
                        {t("dashboard.btnSendMsg")}
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* LIST OF SENT MESSAGES */}
              {loadingList ? (
                <div className="h-48 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-[#AD343E]" />
                  <p className="text-xs text-gray-400">
                    {t("dashboard.messagesLoading")}
                  </p>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center text-gray-400 border border-dashed border-gray-200 rounded-3xl p-6">
                  <Mail size={32} className="stroke-[1.5] mb-2 text-gray-300" />
                  <p className="font-semibold text-sm mb-1">{t("dashboard.messagesEmpty")}</p>
                  <p className="text-xs max-w-sm text-gray-450">{t("dashboard.messagesEmptyDesc")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`border rounded-2xl overflow-hidden shadow-xs transition duration-200 ${
                        msg.reply ? "border-green-150 bg-white" : "border-amber-150 bg-white"
                      }`}
                    >
                      {/* Card Header */}
                      <div className="p-4 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100">
                        <div>
                          <h4 className="font-bold text-gray-800 text-xs">{msg.subject}</h4>
                          <span className="text-[10px] text-gray-400">
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                          msg.reply
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {msg.reply ? "Replied" : "Pending"}
                        </span>
                      </div>

                      {/* Card Body (User Message) */}
                      <div className="p-4 text-xs text-gray-700 whitespace-pre-wrap">
                        {msg.message}
                      </div>

                      {/* Admin Reply Section */}
                      {msg.reply && (
                        <div className="p-4 bg-green-50/40 border-t border-green-100 flex gap-3 text-start">
                          <Reply size={14} className="text-green-600 shrink-0 mt-0.5 transform scale-x-[-1]" />
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-green-700 uppercase tracking-wider">
                              {t("dashboard.adminReply")}
                            </p>
                            <p className="text-xs text-green-800 leading-relaxed">{msg.reply}</p>
                            <span className="text-[9px] text-green-500 block">
                              {new Date(msg.replied_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Reply Back / Follow-up option */}
                      <div className="p-4 bg-gray-50/20 border-t border-gray-100">
                        <div className="flex gap-3 items-end">
                          <textarea
                            rows={1}
                            value={replyText[msg.id] || ""}
                            onChange={(e) =>
                              setReplyText((prev) => ({ ...prev, [msg.id]: e.target.value }))
                            }
                            placeholder={t("dashboard.replyBackPlaceholder")}
                            className="flex-1 px-3 py-2 text-xs border border-gray-200 bg-white rounded-xl focus:outline-none focus:border-[#AD343E] transition resize-none"
                          />
                          <button
                            onClick={() => handleReplyMessage(msg.id, msg.subject)}
                            disabled={replyLoading === msg.id || !replyText[msg.id]?.trim()}
                            className="px-4 py-2 bg-[#AD343E] hover:bg-[#922730] text-white rounded-xl text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                          >
                            {replyLoading === msg.id ? (
                              <Loader2 size={10} className="animate-spin" />
                            ) : (
                              <Send size={10} />
                            )}
                            {t("dashboard.btnSendReply")}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2C2F34] pb-4 border-b border-gray-100">
                {t("dashboard.profileTitle")}
              </h3>

              {profileSuccess && (
                <div className="p-3 bg-green-50 text-green-700 border border-green-150 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-600 shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-150 rounded-xl text-xs font-semibold">
                  ⚠️ {profileError}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase">
                      {t("dashboard.yourName")}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 bg-[#f9f9f7] rounded-xl text-sm focus:outline-none focus:border-[#AD343E] focus:bg-white transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase">
                      {t("dashboard.phoneNumber")}
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 bg-[#f9f9f7] rounded-xl text-sm focus:outline-none focus:border-[#AD343E] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="p-5 border border-gray-150 rounded-2xl bg-gray-50/50 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase border-b border-gray-200 pb-2">
                    <Lock size={12} className="text-[#AD343E]" />
                    <span>{t("dashboard.changePassword")}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">
                        {t("dashboard.newPassword")}
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:border-[#AD343E] transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">
                        {t("dashboard.confirmPassword")}
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:border-[#AD343E] transition"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-6 py-3 bg-[#AD343E] hover:bg-[#922730] text-white rounded-full font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {profileLoading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      {t("dashboard.saving")}
                    </>
                  ) : (
                    t("dashboard.saveBtn")
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
