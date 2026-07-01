// ==========================================================================
// [1] IMPORTS & ASSETS
// ==========================================================================
import { useState, useEffect, useCallback } from "react";
import { useApp } from "../contexts/AppContext";
import { useLanguage } from "../contexts/LanguageContext";
import { api } from "../services/api";
import PageHeader from "../components/PageHeader";
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  RefreshCw,
  Loader2,
  Calendar,
  PlusCircle,
  Trash2,
  Pencil,
  Check,
  X,
  ClipboardList,
  Package,
  BarChart2,
  Users,
  Mail,
  Reply,
  Send,
} from "lucide-react";

// ==========================================================================
// [2] MAIN COMPONENT: ADMIN PANEL
// ==========================================================================
const Admin = () => {
  const { user, isAdmin, isAuthenticated } = useApp();
  const { t, isArabic } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const [activeTab, setActiveTab] = useState("orders");

  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [replyLoading, setReplyLoading] = useState(null);
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFormError("");
    setFormSuccess("");
    try {
      if (activeTab === "orders") {
        const orderData = await api.adminGetOrders();
        setOrders(orderData);
      } else if (activeTab === "bookings") {
        const bookingData = await api.adminGetBookings();
        setBookings(bookingData);
      } else if (activeTab === "menu") {
        const [menuData, categoryData] = await Promise.all([
          api.getMenu(),
          api.getCategories(),
        ]);
        setMenuItems(menuData);
        setCategories(categoryData);
        if (categoryData.length > 0 && !categoryId) {
          setCategoryId(categoryData[0].id.toString());
        }
      } else if (activeTab === "users") {
        const userData = await api.adminGetUsers();
        setUsers(userData);
      } else if (activeTab === "messages") {
        const contactData = await api.adminGetContacts();
        setContacts(contactData);
      } else if (activeTab === "analytics") {
        const [orderData, bookingData, menuData, categoryData] =
          await Promise.all([
            api.adminGetOrders(),
            api.adminGetBookings(),
            api.getMenu(),
            api.getCategories(),
          ]);
        setOrders(orderData);
        setBookings(bookingData);
        setMenuItems(menuData);
        setCategories(categoryData);
      }
    } catch (err) {
      console.error("Admin fetch failed", err);
      setFormError(t("admin.errorFetch"));
    } finally {
      setLoading(false);
    }
  }, [activeTab, categoryId, t]);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const loadData = async () => {
        await fetchData();
      };
      loadData();
    }
  }, [isAuthenticated, isAdmin, fetchData]);

  // Switch tab from URL ?tab=... param (used by NotificationBell navigation)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get("tab");
    if (
      tab &&
      ["orders", "bookings", "menu", "users", "messages", "analytics"].includes(
        tab,
      )
    ) {
      setActiveTab(tab);
    }
  }, [window.location.search]);

  // Refresh data when NotificationBell quick-actions update order/booking status
  useEffect(() => {
    const handleRefresh = () => fetchData();
    window.addEventListener("bistro_data_refreshed", handleRefresh);
    return () =>
      window.removeEventListener("bistro_data_refreshed", handleRefresh);
  }, [fetchData]);

  // ==========================================================================
  // [3] ADMIN ACTIONS (UPDATE, DELETE, CREATE)
  // ==========================================================================
  const handleUpdateBooking = async (id, status) => {
    setActionLoading(true);
    try {
      await api.adminUpdateBookingStatus(id, status);
      setFormSuccess(
        t("admin.successBookingUpdate")
          .replace("{id}", id)
          .replace("{status}", status),
      );
      fetchData();
    } catch (err) {
      setFormError(err.message || "Failed to update booking status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateOrder = async (id, status) => {
    setActionLoading(true);
    setFormError("");
    try {
      await api.adminUpdateOrderStatus(id, status);
      setFormSuccess(
        t("admin.successOrderUpdate")
          .replace("{id}", id)
          .replace("{status}", status.replace("_", " ")),
      );
      fetchData();
    } catch (err) {
      setFormError(err.message || "Failed to update order status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReplyContact = async (id) => {
    const reply = replyText[id];
    if (!reply?.trim()) return;
    setReplyLoading(id);
    try {
      await api.adminReplyContact(id, reply);
      setReplyText((prev) => ({ ...prev, [id]: "" }));
      setFormSuccess("Reply sent successfully!");
      fetchData();
    } catch (err) {
      setFormError(err.message || "Failed to send reply.");
    } finally {
      setReplyLoading(null);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm(t("admin.confirmDelete"))) return;
    setActionLoading(true);
    try {
      await api.adminDeleteMenuItem(id);
      setFormSuccess(t("admin.successDelete"));
      fetchData();
    } catch (err) {
      setFormError(err.message || "Failed to delete item.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUserClick = (u) => {
    if (u.id === user?.id) {
      alert("You cannot delete your own account.");
      return;
    }
    setUserToDelete(u);
  };

  const handleDeleteUser = async (id) => {
    setActionLoading(true);
    try {
      await api.adminDeleteUser(id);
      setFormSuccess(t("admin.deleteUserSuccess"));
      setUserToDelete(null);
      await fetchData();
    } catch (err) {
      setFormError(err.message || "Failed to delete user.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setName(item.name);
    setNameAr(item.name_ar || "");
    setPrice(item.price);
    setCategoryId(item.category_id.toString());
    setDescription(item.description);
    setDescriptionAr(item.description_ar || "");
    setImageFile(null);

    const formElement = document.getElementById("dish-form-container");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setName("");
    setNameAr("");
    setPrice("");
    if (categories.length > 0) {
      setCategoryId(categories[0].id.toString());
    } else {
      setCategoryId("");
    }
    setDescription("");
    setDescriptionAr("");
    setImageFile(null);
  };

  const handleSubmitItem = async (e) => {
    e.preventDefault();
    if (!editingItem && !imageFile) {
      setFormError(t("admin.imageRequired"));
      return;
    }

    setLoading(true);
    setFormError("");
    setFormSuccess("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (nameAr) formData.append("name_ar", nameAr);
      formData.append("description", description);
      if (descriptionAr) formData.append("description_ar", descriptionAr);
      formData.append("price", price);
      formData.append("category_id", categoryId);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingItem) {
        await api.adminUpdateMenuItem(editingItem.id, formData);
        setFormSuccess(t("admin.successUpdate"));
        setEditingItem(null);
      } else {
        await api.adminCreateMenuItem(formData);
        setFormSuccess(t("admin.successCreate").replace("{name}", name));
      }

      setName("");
      setNameAr("");
      setDescription("");
      setDescriptionAr("");
      setPrice("");
      setImageFile(null);

      fetchData();
    } catch (err) {
      setFormError(
        err.message ||
          (editingItem
            ? "Failed to update food item."
            : "Failed to upload food item."),
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div
        className="h-screen flex items-center justify-center p-6 text-center font-['DM_Sans',sans-serif]"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className="max-w-sm space-y-4">
          <ShieldAlert className="text-red-500 w-12 h-12 mx-auto animate-bounce" />
          <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-gray-800">
            {t("admin.accessDenied")}
          </h2>
          <p className="text-xs text-gray-400">{t("admin.accessDeniedDesc")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="font-['DM_Sans',sans-serif] bg-white text-[#41454C] min-h-screen text-start"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <PageHeader
        title={t("admin.title")}
        description={t("admin.desc").replace("{name}", user?.name || "")}
      />

      <section className="py-16 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#f9f9f7] rounded-3xl p-6 border border-gray-100 flex flex-col space-y-2 dark:bg-[#1c1310] dark:border-[#2a201c]">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-start ${
                activeTab === "orders"
                  ? "bg-[#AD343E] text-white"
                  : "hover:!bg-white hover:!text-black text-[#2C2F34] dark:text-[#f4ede9] dark:hover:!bg-white dark:hover:!text-black shadow-xs border border-transparent hover:border-gray-200 dark:hover:border-white/20"
              }`}
            >
              <ClipboardList size={16} />
              {t("admin.tabOrders")}
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-start ${
                activeTab === "bookings"
                  ? "bg-[#AD343E] text-white"
                  : "hover:!bg-white hover:!text-black text-[#2C2F34] dark:text-[#f4ede9] dark:hover:!bg-white dark:hover:!text-black shadow-xs border border-transparent hover:border-gray-200 dark:hover:border-white/20"
              }`}
            >
              <Calendar size={16} />
              {t("admin.tabBookings")}
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-start ${
                activeTab === "menu"
                  ? "bg-[#AD343E] text-white"
                  : "hover:!bg-white hover:!text-black text-[#2C2F34] dark:text-[#f4ede9] dark:hover:!bg-white dark:hover:!text-black shadow-xs border border-transparent hover:border-gray-200 dark:hover:border-white/20"
              }`}
            >
              <Package size={16} />
              {t("admin.tabMenu")}
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-start ${
                activeTab === "users"
                  ? "bg-[#AD343E] text-white"
                  : "hover:!bg-white hover:!text-black text-[#2C2F34] dark:text-[#f4ede9] dark:hover:!bg-white dark:hover:!text-black shadow-xs border border-transparent hover:border-gray-200 dark:hover:border-white/20"
              }`}
            >
              <Users size={16} />
              {t("admin.tabUsers")}
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-start ${
                activeTab === "messages"
                  ? "bg-[#AD343E] text-white"
                  : "hover:!bg-white hover:!text-black text-[#2C2F34] dark:text-[#f4ede9] dark:hover:!bg-white dark:hover:!text-black shadow-xs border border-transparent hover:border-gray-200 dark:hover:border-white/20"
              }`}
            >
              <Mail size={16} />
              {t("admin.tabMessages") || "Messages"}
              {contacts.filter((c) => !c.reply).length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {contacts.filter((c) => !c.reply).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-start ${
                activeTab === "analytics"
                  ? "bg-[#AD343E] text-white"
                  : "hover:!bg-white hover:!text-black text-[#2C2F34] dark:text-[#f4ede9] dark:hover:!bg-white dark:hover:!text-black shadow-xs border border-transparent hover:border-gray-200 dark:hover:border-white/20"
              }`}
            >
              <BarChart2 size={16} />
              {t("admin.tabAnalytics")}
            </button>
          </div>
        </div>

        <div className="lg:col-span-9 bg-white rounded-3xl border border-gray-100 shadow-xl p-8 min-h-[400px]">
          {formSuccess && (
            <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-xl border border-green-150 text-xs font-semibold">
              ✓ {formSuccess}
            </div>
          )}
          {formError && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-xl border border-red-150 text-xs font-semibold">
              ⚠️ {formError}
            </div>
          )}

          {/* 
            ==================================================================
            [ TAB 1 ] : MANAGE ORDERS
            Description : Displays restaurant orders, status, customer info, 
                          and controls to update order status.
            ================================================================== 
          */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2C2F34]">
                  {t("admin.ordersTitle")}
                </h3>
                <button
                  onClick={fetchData}
                  className="p-2 hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full transition"
                  title="Reload Orders"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-[#AD343E]" />
                  <p className="text-xs text-gray-400">
                    {t("admin.ordersLoading")}
                  </p>
                </div>
              ) : orders.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400">
                  <ClipboardList size={40} className="stroke-[1.5] mb-2" />
                  <p className="font-semibold text-sm">
                    {t("admin.ordersEmpty")}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-2xl overflow-hidden shadow-xs"
                    >
                      <div className="p-4 bg-gray-50 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200">
                        <div className="space-y-1 text-[11px] sm:text-xs">
                          <p className="font-bold text-gray-800">
                            {t("admin.orderId")}: #{order.id} |{" "}
                            {t("admin.customer")}: {order.user?.name || "Guest"}{" "}
                            ({order.user?.email})
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {t("admin.placedOn")}{" "}
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="font-bold text-gray-700">
                            {t("admin.total")}: $
                            {parseFloat(order.total_price).toFixed(2)}
                          </span>
                          <span className="px-2 py-0.5 rounded-full border bg-white font-bold uppercase text-[9px]">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600">
                        <div className="space-y-3">
                          <p className="font-bold text-gray-700">
                            {t("admin.products")} ({order.items?.length}{" "}
                            {t("admin.items")})
                          </p>
                          <ul className="space-y-2">
                            {order.items?.map((item) => (
                              <li
                                key={item.id}
                                className="flex justify-between items-center"
                              >
                                <span>
                                  {item.name}{" "}
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
                          <div className="pt-2 border-t border-gray-100 text-[11px]">
                            <p>
                              <span className="font-semibold text-gray-700">
                                {t("admin.phone")}:
                              </span>{" "}
                              {order.phone}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-700">
                                {t("admin.address")}:
                              </span>{" "}
                              {order.address}
                            </p>
                            {order.notes && (
                              <p>
                                <span className="font-semibold text-gray-700">
                                  {t("admin.notes")}:
                                </span>{" "}
                                {order.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Bug 3 Fix: Sequential kitchen status buttons */}
                        <div className="space-y-4 border-t md:border-t-0 md:border-s border-gray-150/50 pt-4 md:pt-0 md:ps-6 flex flex-col justify-center min-w-[160px]">
                          <p className="font-bold text-gray-700">
                            {t("admin.kitchenStatus")}
                          </p>
                          <div className="space-y-2">
                            <select
                              value={order.status}
                              disabled={actionLoading}
                              onChange={(e) =>
                                handleUpdateOrder(order.id, e.target.value)
                              }
                              className="w-full py-2 px-3 rounded-lg text-xs font-bold border border-gray-200 text-gray-700 bg-white focus:outline-none focus:border-[#AD343E] transition cursor-pointer dark:bg-[#1e2022] dark:border-gray-700 dark:text-gray-200"
                            >
                              <option value="pending">
                                ⏳ {t("admin.status.pending")}
                              </option>
                              <option value="accepted">
                                ✅ {t("admin.status.accepted")}
                              </option>
                              <option value="in_progress">
                                👨‍🍳 {t("admin.status.in_progress")}
                              </option>
                              <option value="delivered">
                                🚚 {t("admin.status.delivered")}
                              </option>
                              <option value="rejected">
                                ❌ {t("admin.status.rejected")}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 
            ==================================================================
            [ TAB 2 ] : MANAGE BOOKINGS
            Description : Displays table reservations, customer details, 
                          and controls to confirm or reject bookings.
            ================================================================== 
          */}
          {activeTab === "bookings" &&
            (() => {
              const bookingList = Array.isArray(bookings) ? bookings : [];
              return (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2C2F34]">
                      {t("admin.bookingsTitle")}
                    </h3>
                    <button
                      onClick={fetchData}
                      className="p-2 hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full transition"
                      title="Reload Bookings"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>

                  {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-[#AD343E]" />
                      <p className="text-xs text-gray-400">
                        {t("admin.bookingsLoading")}
                      </p>
                    </div>
                  ) : bookingList.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400">
                      <Calendar size={40} className="stroke-[1.5] mb-2" />
                      <p className="font-semibold text-sm">
                        {t("admin.bookingsEmpty")}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-gray-600">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-250 text-gray-500 font-bold uppercase tracking-wider text-start">
                            <th className="px-4 py-3 text-start">
                              {t("admin.bookingId")}
                            </th>
                            <th className="px-4 py-3 text-start">
                              {t("admin.customer")}
                            </th>
                            <th className="px-4 py-3 text-start">
                              {t("admin.date")}
                            </th>
                            <th className="px-4 py-3 text-start">
                              {t("admin.guests")}
                            </th>
                            <th className="px-4 py-3 text-start">
                              {t("admin.statusCol")}
                            </th>
                            <th className="px-4 py-3 text-center">
                              {t("admin.actions")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {bookingList.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                              <td className="px-4 py-4 font-bold text-gray-800">
                                #{booking.id}
                              </td>
                              <td className="px-4 py-4">
                                <span className="font-bold text-gray-800 block">
                                  {booking.user?.name || "Guest / Customer"}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {booking.user?.email || booking.phone || "-"}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                {booking.booking_date
                                  ? new Date(
                                      booking.booking_date,
                                    ).toLocaleDateString()
                                  : ""}{" "}
                                @ {booking.booking_time || ""}
                              </td>
                              <td className="px-4 py-4 font-bold text-gray-800">
                                {booking.num_of_people} {t("book.people")}
                              </td>
                              <td className="px-4 py-4 uppercase font-bold text-[10px]">
                                <span
                                  className={`px-2 py-0.5 rounded-full border ${
                                    booking.status === "confirmed"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : booking.status === "rejected"
                                        ? "bg-red-50 text-red-700 border-red-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                  }`}
                                >
                                  {booking.status}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                {booking.status === "pending" && (
                                  <div className="flex gap-2 justify-center">
                                    <button
                                      onClick={() =>
                                        handleUpdateBooking(
                                          booking.id,
                                          "confirmed",
                                        )
                                      }
                                      disabled={actionLoading}
                                      className="p-1.5 bg-green-50 border border-green-200 hover:bg-green-600 hover:text-white rounded-full text-green-600 transition cursor-pointer"
                                      title="Approve / Confirm"
                                    >
                                      <Check size={14} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleUpdateBooking(
                                          booking.id,
                                          "rejected",
                                        )
                                      }
                                      disabled={actionLoading}
                                      className="p-1.5 bg-red-50 border border-red-200 hover:bg-red-600 hover:text-white rounded-full text-red-600 transition cursor-pointer"
                                      title="Reject"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })()}

          {/* 
            ==================================================================
            [ TAB 3 ] : MENU MANAGER
            Description : Form to upload new food items and a list of 
                          current menu items with delete functionality.
            ================================================================== 
          */}
          {activeTab === "menu" && (
            <div className="space-y-8">
              <div
                id="dish-form-container"
                className="bg-[#f9f9f7] rounded-3xl p-6 border border-gray-150 space-y-4"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#2C2F34] uppercase border-b border-gray-200 pb-2">
                  {editingItem ? (
                    <Pencil size={15} className="text-[#AD343E]" />
                  ) : (
                    <PlusCircle size={15} className="text-[#AD343E]" />
                  )}
                  <span>
                    {editingItem
                      ? t("admin.editTitle")
                      : t("admin.uploadTitle")}
                  </span>
                </div>

                <form onSubmit={handleSubmitItem} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-gray-600 uppercase">
                        {t("admin.dishName")}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("admin.dishNamePlaceholder")}
                        className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl focus:outline-none focus:border-[#AD343E] transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-gray-600 uppercase">
                        {t("admin.dishNameAr")}
                      </label>
                      <input
                        type="text"
                        value={nameAr}
                        onChange={(e) => setNameAr(e.target.value)}
                        placeholder={t("admin.dishNameArPlaceholder")}
                        className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl focus:outline-none focus:border-[#AD343E] transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-gray-600 uppercase">
                        {t("admin.price")}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder={t("admin.pricePlaceholder")}
                        className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl focus:outline-none focus:border-[#AD343E] transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-gray-600 uppercase">
                        {t("admin.category")}
                      </label>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl focus:outline-none focus:border-[#AD343E] transition"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {t("categories." + cat.name) || cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-gray-600 uppercase">
                        {t("admin.foodImage")}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        required={!editingItem}
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#AD343E]/5 file:text-[#AD343E] hover:file:bg-[#AD343E]/10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-gray-600 uppercase">
                        {t("admin.dishDesc")}
                      </label>
                      <input
                        type="text"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t("admin.dishDescPlaceholder")}
                        className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl focus:outline-none focus:border-[#AD343E] transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-gray-600 uppercase">
                        {t("admin.dishDescAr")}
                      </label>
                      <input
                        type="text"
                        value={descriptionAr}
                        onChange={(e) => setDescriptionAr(e.target.value)}
                        placeholder={t("admin.dishDescArPlaceholder")}
                        className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl focus:outline-none focus:border-[#AD343E] transition"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-[#AD343E] hover:bg-[#922730] text-white rounded-full font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          {editingItem
                            ? t("admin.btnUpdating")
                            : t("admin.uploadingDish")}
                        </>
                      ) : (
                        <>
                          {editingItem
                            ? t("admin.btnSave")
                            : t("admin.btnAddDish")}
                        </>
                      )}
                    </button>

                    {editingItem && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={loading}
                        className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-bold transition cursor-pointer disabled:opacity-50"
                      >
                        {t("admin.btnCancel")}
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="space-y-4">
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2C2F34] pb-2 border-b border-gray-100 flex items-center justify-between">
                  <span>
                    {t("admin.menuTitle")} ({menuItems.length}{" "}
                    {t("admin.dishes")})
                  </span>
                  <button
                    onClick={fetchData}
                    className="p-1 hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full transition"
                  >
                    <RefreshCw size={13} />
                  </button>
                </h3>

                {loading ? (
                  <div className="h-32 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#AD343E]" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-3 border border-gray-200 rounded-2xl items-center hover:shadow-xs transition"
                      >
                        <img
                          src={
                            parseInt(item.id, 10) >= 1 &&
                            parseInt(item.id, 10) <= 27
                              ? getFoodImageUrl(item.id)
                              : item.image_url || resolveAssetImage(item.image)
                          }
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg bg-gray-50"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getFoodImageUrl(null);
                          }}
                        />
                        <div className="flex-1 min-w-0 text-start">
                          <h4 className="font-bold text-gray-800 text-xs truncate">
                            {isArabic && item.name_ar
                              ? item.name_ar
                              : t(
                                    "menuItems." + item.name + ".name",
                                  ).startsWith("menuItems.")
                                ? item.name
                                : t("menuItems." + item.name + ".name")}
                          </h4>
                          <p className="text-[10px] text-gray-400 truncate">
                            {t("categories." + item.category?.name) ||
                              item.category?.name ||
                              "Dish"}{" "}
                            | ${parseFloat(item.price).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditClick(item)}
                            disabled={actionLoading}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition cursor-pointer"
                            title="Edit Dish"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={actionLoading}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition cursor-pointer"
                            title="Delete Dish"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 
            ==================================================================
            [ TAB : USERS ] : MANAGE USERS
            Description : Displays registered users and their roles.
            ================================================================== 
          */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2C2F34]">
                  {t("admin.usersTitle")}
                </h3>
                <button
                  onClick={fetchData}
                  className="p-2 hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full transition"
                  title="Reload Users"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              {/* STATS SUMMARY CARDS */}
              {users.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-white border border-gray-150 rounded-2xl flex flex-col shadow-xs">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {t("admin.totalUsers")}
                    </span>
                    <span className="text-lg font-extrabold text-gray-800 mt-1">
                      {users.length}
                    </span>
                  </div>
                  <div className="p-4 bg-white border border-gray-150 rounded-2xl flex flex-col shadow-xs border-s-4 border-s-red-500">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {t("admin.roleAdmin")}
                    </span>
                    <span className="text-lg font-extrabold text-red-600 mt-1">
                      {users.filter((u) => u.role === "admin").length}
                    </span>
                  </div>
                  <div className="p-4 bg-white border border-gray-150 rounded-2xl flex flex-col shadow-xs border-s-4 border-s-blue-500">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {t("admin.roleUser")}
                    </span>
                    <span className="text-lg font-extrabold text-blue-600 mt-1">
                      {users.filter((u) => u.role !== "admin").length}
                    </span>
                  </div>
                </div>
              )}

              {/* SEARCH & FILTER CONTROLS */}
              {users.length > 0 && (
                <div className="flex flex-wrap gap-4 items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex-1 min-w-[200px]">
                    <input
                      type="text"
                      value={searchUserQuery}
                      onChange={(e) => setSearchUserQuery(e.target.value)}
                      placeholder={t("admin.searchPlaceholderUsers")}
                      className="w-full text-xs px-3 py-2 border border-gray-200 bg-white rounded-xl focus:outline-none focus:border-[#AD343E] transition"
                    />
                  </div>
                  <div className="w-full sm:w-auto">
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-gray-200 bg-white rounded-xl focus:outline-none focus:border-[#AD343E] transition"
                    >
                      <option value="all">{t("admin.filterAll")}</option>
                      <option value="admin">{t("admin.roleAdmin")}</option>
                      <option value="user">{t("admin.roleUser")}</option>
                    </select>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-[#AD343E]" />
                  <p className="text-xs text-gray-400">
                    {t("admin.usersLoading")}
                  </p>
                </div>
              ) : (
                (() => {
                  // Apply Search and Role filters
                  const filteredUsers = users.filter((u) => {
                    const matchesSearch =
                      u.name
                        ?.toLowerCase()
                        .includes(searchUserQuery.toLowerCase()) ||
                      u.email
                        ?.toLowerCase()
                        .includes(searchUserQuery.toLowerCase());

                    const matchesRole =
                      roleFilter === "all" ||
                      (roleFilter === "admin" && u.role === "admin") ||
                      (roleFilter === "user" && u.role !== "admin");

                    return matchesSearch && matchesRole;
                  });

                  if (filteredUsers.length === 0) {
                    return (
                      <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400">
                        <Users size={40} className="stroke-[1.5] mb-2" />
                        <p className="font-semibold text-sm">
                          {t("admin.usersEmpty")}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-gray-600">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-250 text-gray-500 font-bold uppercase tracking-wider text-start">
                            <th className="px-4 py-3 text-start">
                              {t("admin.userId")}
                            </th>
                            <th className="px-4 py-3 text-start">
                              {t("admin.userName")}
                            </th>
                            <th className="px-4 py-3 text-start">
                              {t("admin.userEmail")}
                            </th>
                            <th className="px-4 py-3 text-start">
                              {t("admin.userPhone")}
                            </th>
                            <th className="px-4 py-3 text-start">
                              {t("admin.userRole")}
                            </th>
                            <th className="px-4 py-3 text-center">
                              {t("admin.actions")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50">
                              <td className="px-4 py-4 font-bold text-gray-800">
                                #{u.id}
                              </td>
                              <td className="px-4 py-4 font-bold text-gray-800">
                                {u.name}
                              </td>
                              <td className="px-4 py-4">{u.email}</td>
                              <td className="px-4 py-4 font-semibold">
                                {u.phone || "-"}
                              </td>
                              <td className="px-4 py-4 uppercase font-bold text-[10px]">
                                <span
                                  className={`px-2 py-0.5 rounded-full border ${
                                    u.role === "admin"
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : "bg-blue-50 text-blue-700 border-blue-200"
                                  }`}
                                >
                                  {u.role === "admin"
                                    ? t("admin.roleAdmin")
                                    : t("admin.roleUser")}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-center">
                                {u.id !== user?.id && (
                                  <button
                                    onClick={() => handleDeleteUserClick(u)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition cursor-pointer"
                                    title={t("admin.deleteUser")}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* 
            ==================================================================
            [ TAB : MESSAGES ] : CONTACT MESSAGES & REPLIES
            ================================================================== 
          */}
          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2C2F34]">
                  {t("admin.tabMessages") || "Contact Messages"}
                </h3>
                <button
                  onClick={fetchData}
                  className="p-2 hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full transition"
                  title="Reload Messages"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-[#AD343E]" />
                  <p className="text-xs text-gray-400">Loading messages...</p>
                </div>
              ) : contacts.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400">
                  <Mail size={40} className="stroke-[1.5] mb-2" />
                  <p className="font-semibold text-sm">
                    No contact messages yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((msg) => (
                    <div
                      key={msg.id}
                      className={`border rounded-2xl overflow-hidden shadow-xs ${
                        msg.reply ? "border-green-200" : "border-amber-200"
                      }`}
                    >
                      {/* Message header */}
                      <div className="p-4 bg-gray-50 flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="font-bold text-gray-800 text-sm">
                            {msg.subject}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            From: <strong>{msg.name}</strong> ({msg.email})
                            {msg.user && (
                              <span className="ml-2 text-blue-500">
                                • Registered User
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {new Date(msg.created_at).toLocaleString()}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            msg.reply
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {msg.reply ? "✓ Replied" : "⏳ Pending"}
                        </span>
                      </div>

                      {/* Message body */}
                      <div className="p-4 bg-white text-xs text-gray-700">
                        <p className="whitespace-pre-wrap">{msg.message}</p>
                      </div>

                      {/* Existing reply */}
                      {msg.reply && (
                        <div className="p-4 bg-green-50 border-t border-green-100 flex gap-3">
                          <Reply
                            size={14}
                            className="text-green-600 shrink-0 mt-0.5"
                          />
                          <div>
                            <p className="text-[10px] font-bold text-green-700 uppercase mb-1">
                              Your Reply
                            </p>
                            <p className="text-xs text-green-800">
                              {msg.reply}
                            </p>
                            <p className="text-[10px] text-green-500 mt-1">
                              {new Date(msg.replied_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Reply form — only shown if not yet replied */}
                      {!msg.reply && (
                        <div className="p-4 border-t border-gray-100 bg-[#f9f9f7] flex gap-3">
                          <textarea
                            rows={2}
                            value={replyText[msg.id] || ""}
                            onChange={(e) =>
                              setReplyText((prev) => ({
                                ...prev,
                                [msg.id]: e.target.value,
                              }))
                            }
                            placeholder="Type your reply here..."
                            className="flex-1 px-3 py-2 text-xs border border-gray-200 bg-white rounded-xl focus:outline-none focus:border-[#AD343E] transition resize-none"
                          />
                          <button
                            onClick={() => handleReplyContact(msg.id)}
                            disabled={
                              replyLoading === msg.id ||
                              !replyText[msg.id]?.trim()
                            }
                            className="px-4 py-2 bg-[#AD343E] hover:bg-[#922730] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 self-end"
                          >
                            {replyLoading === msg.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Send size={12} />
                            )}
                            Reply
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 
            ==================================================================
            [ TAB 4 ] : ANALYTICS & INSIGHTS
            ================================================================== 
          */}
          {activeTab === "analytics" && (
            <div className="space-y-8 animate-fade-in text-start">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2C2F34]">
                  {t("admin.analyticsTitle")}
                </h3>
                <button
                  onClick={fetchData}
                  className="p-2 hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full transition cursor-pointer"
                  title="Reload Analytics"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-[#AD343E]" />
                  <p className="text-xs text-gray-400">
                    {t("admin.loadingAnalytics")}
                  </p>
                </div>
              ) : (
                (() => {
                  const deliveredOrders = orders.filter(
                    (o) => o.status === "delivered",
                  );
                  const totalRev = deliveredOrders.reduce(
                    (sum, o) => sum + parseFloat(o.total_price || 0),
                    0,
                  );
                  const completedCount = deliveredOrders.length;
                  const activeCount = orders.filter(
                    (o) =>
                      !["delivered", "rejected", "cancelled"].includes(
                        o.status,
                      ),
                  ).length;
                  const cancelledCount = orders.filter((o) =>
                    ["rejected", "cancelled"].includes(o.status),
                  ).length;

                  const totalBookingsCount = bookings.length;
                  const acceptedBookingsCount = bookings.filter(
                    (b) => b.status === "accepted",
                  ).length;
                  const bookingRate =
                    totalBookingsCount > 0
                      ? Math.round(
                          (acceptedBookingsCount / totalBookingsCount) * 100,
                        )
                      : 0;

                  const avgOrderVal =
                    completedCount > 0 ? totalRev / completedCount : 0;

                  const sortedSales = [...deliveredOrders]
                    .sort((a, b) => a.id - b.id)
                    .slice(-7);

                  const trendLabels = sortedSales.map((o) => `#${o.id}`);
                  const trendValues = sortedSales.map((o) =>
                    parseFloat(o.total_price || 0),
                  );

                  const catCounts = {};
                  orders.forEach((order) => {
                    order.items?.forEach((item) => {
                      const menuItem = menuItems.find(
                        (m) => m.name === item.name || m.id === item.id,
                      );
                      const catId = menuItem
                        ? menuItem.category_id
                        : item.category_id;
                      const category = categories.find((c) => c.id === catId);
                      const catName = category ? category.name : "Others";
                      const qty = item.pivot?.quantity || 1;
                      catCounts[catName] = (catCounts[catName] || 0) + qty;
                    });
                  });

                  const catData = Object.keys(catCounts)
                    .map((name) => ({
                      name,
                      count: catCounts[name],
                    }))
                    .sort((a, b) => b.count - a.count);

                  const maxCatCount =
                    catData.length > 0
                      ? Math.max(...catData.map((c) => c.count))
                      : 1;

                  const dishCounts = {};
                  orders.forEach((order) => {
                    order.items?.forEach((item) => {
                      const qty = item.pivot?.quantity || 1;
                      dishCounts[item.name] =
                        (dishCounts[item.name] || 0) + qty;
                    });
                  });
                  const topDishes = Object.keys(dishCounts)
                    .map((name) => ({ name, count: dishCounts[name] }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 3);

                  const chartWidth = 500;
                  const chartHeight = 160;
                  const padding = 20;
                  const minVal = 0;
                  const maxVal =
                    trendValues.length > 0
                      ? Math.max(...trendValues) * 1.15
                      : 100;

                  const points = trendValues.map((val, idx) => {
                    const x =
                      padding +
                      (idx / Math.max(1, trendValues.length - 1)) *
                        (chartWidth - padding * 2);
                    const y =
                      chartHeight -
                      padding -
                      ((val - minVal) / (maxVal - minVal)) *
                        (chartHeight - padding * 2);
                    return { x, y, label: trendLabels[idx], val };
                  });

                  let dPath = "";
                  if (points.length > 0) {
                    dPath = `M ${points[0].x} ${points[0].y}`;
                    for (let i = 1; i < points.length; i++) {
                      dPath += ` L ${points[i].x} ${points[i].y}`;
                    }
                  }

                  let dArea = "";
                  if (points.length > 0) {
                    dArea = `${dPath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;
                  }

                  return (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-5 bg-white border border-gray-150 rounded-2xl flex flex-col justify-between shadow-xs">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {t("admin.totalSales")}
                          </span>
                          <span className="text-xl font-extrabold text-[#AD343E] mt-1">
                            ${totalRev.toFixed(2)}
                          </span>
                          <span className="text-[9px] text-green-500 font-bold mt-2">
                            ↑ 12.5% this week
                          </span>
                        </div>

                        <div className="p-5 bg-white border border-gray-150 rounded-2xl flex flex-col justify-between shadow-xs">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {t("admin.completedOrders")}
                          </span>
                          <span className="text-xl font-extrabold text-gray-800 mt-1">
                            {completedCount}
                          </span>
                          <span className="text-[9px] text-gray-400 mt-2">
                            {activeCount} active | {cancelledCount} cancelled
                          </span>
                        </div>

                        <div className="p-5 bg-white border border-gray-150 rounded-2xl flex flex-col justify-between shadow-xs">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {t("admin.totalBookings")}
                          </span>
                          <span className="text-xl font-extrabold text-gray-800 mt-1">
                            {totalBookingsCount}
                          </span>
                          <span className="text-[9px] text-blue-500 font-bold mt-2">
                            {bookingRate}% {t("admin.bookingAcceptRate")}
                          </span>
                        </div>

                        <div className="p-5 bg-white border border-gray-150 rounded-2xl flex flex-col justify-between shadow-xs">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {t("admin.averageOrderValue")}
                          </span>
                          <span className="text-xl font-extrabold text-gray-800 mt-1">
                            ${avgOrderVal.toFixed(2)}
                          </span>
                          <span className="text-[9px] text-green-500 font-bold mt-2">
                            ↑ High order volume
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="p-6 bg-[#f9f9f7] rounded-3xl border border-gray-150 space-y-4">
                          <h4 className="text-xs font-bold text-gray-800 uppercase border-b border-gray-200 pb-2">
                            {t("admin.salesOverTime")}
                          </h4>
                          {trendValues.length < 2 ? (
                            <div className="h-40 flex items-center justify-center text-xs text-gray-400">
                              {t("admin.noData")}
                            </div>
                          ) : (
                            <div className="relative">
                              <svg
                                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                                className="w-full h-auto overflow-visible"
                              >
                                <defs>
                                  <linearGradient
                                    id="chart-grad"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor="#AD343E"
                                      stopOpacity="0.25"
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor="#AD343E"
                                      stopOpacity="0.00"
                                    />
                                  </linearGradient>
                                </defs>
                                <line
                                  x1={padding}
                                  y1={padding}
                                  x2={chartWidth - padding}
                                  y2={padding}
                                  stroke="#E5E7EB"
                                  strokeDasharray="3 3"
                                />
                                <line
                                  x1={padding}
                                  y1={chartHeight - padding}
                                  x2={chartWidth - padding}
                                  y2={chartHeight - padding}
                                  stroke="#E5E7EB"
                                />

                                <path d={dArea} fill="url(#chart-grad)" />
                                <path
                                  d={dPath}
                                  fill="none"
                                  stroke="#AD343E"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                />

                                {points.map((p, i) => (
                                  <g key={i}>
                                    <circle
                                      cx={p.x}
                                      cy={p.y}
                                      r="4"
                                      fill="white"
                                      stroke="#AD343E"
                                      strokeWidth="2.5"
                                    />
                                    <text
                                      x={p.x}
                                      y={p.y - 8}
                                      textAnchor="middle"
                                      fontSize="8"
                                      fontWeight="bold"
                                      fill="#4B5563"
                                    >
                                      ${p.val.toFixed(0)}
                                    </text>
                                    <text
                                      x={p.x}
                                      y={chartHeight - padding + 12}
                                      textAnchor="middle"
                                      fontSize="8"
                                      fill="#9CA3AF"
                                    >
                                      {p.label}
                                    </text>
                                  </g>
                                ))}
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="p-6 bg-[#f9f9f7] rounded-3xl border border-gray-150 space-y-4">
                          <h4 className="text-xs font-bold text-gray-800 uppercase border-b border-gray-200 pb-2">
                            {t("admin.categoryDistribution")}
                          </h4>
                          {catData.length === 0 ? (
                            <div className="h-40 flex items-center justify-center text-xs text-gray-400">
                              {t("admin.noData")}
                            </div>
                          ) : (
                            <div className="space-y-3 pt-2">
                              {catData.map((c, idx) => (
                                <div key={idx} className="space-y-1 text-xs">
                                  <div className="flex justify-between font-bold text-gray-700">
                                    <span>
                                      {t("categories." + c.name) || c.name}
                                    </span>
                                    <span>{c.count} items</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                      className="bg-[#AD343E] h-full rounded-full transition-all duration-1000"
                                      style={{
                                        width: `${(c.count / maxCatCount) * 100}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {topDishes.length > 0 && (
                        <div className="p-6 bg-[#f9f9f7] rounded-3xl border border-gray-150 space-y-3">
                          <h4 className="text-xs font-bold text-gray-800 uppercase border-b border-gray-200 pb-2">
                            🔥 Top Selling Dishes
                          </h4>
                          <div className="space-y-2">
                            {topDishes.map((dish, i) => (
                              <div
                                key={i}
                                className="flex justify-between items-center text-xs py-1 border-b border-gray-100 last:border-0"
                              >
                                <span className="font-semibold text-gray-700">
                                  {i + 1}.{" "}
                                  {isArabic &&
                                  t(
                                    "menuItems." + dish.name + ".name",
                                  ).startsWith("menuItems.")
                                    ? dish.name
                                    : t("menuItems." + dish.name + ".name")}
                                </span>
                                <span className="px-2 py-0.5 bg-red-50 text-[#AD343E] rounded-md font-extrabold">
                                  {dish.count} ordered
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </div>
          )}
        </div>
      </section>

      {/* USER DELETE CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in text-start space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <ShieldAlert className="w-8 h-8 shrink-0" />
              <h4 className="font-['Playfair_Display',serif] text-xl font-bold">
                {t("admin.deleteUserConfirmTitle")}
              </h4>
            </div>
            <p className="text-sm text-gray-600">
              {t("admin.deleteUserConfirmDesc")}{" "}
              <strong className="text-gray-800">{userToDelete.name}</strong> (
              <span className="text-xs text-gray-500">
                {userToDelete.email}
              </span>
              )?
            </p>
            <p className="text-xs text-red-500 font-semibold bg-red-50 p-3 rounded-xl border border-red-100">
              {t("admin.deleteUserConfirmWarn")}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                {t("admin.deleteUserCancel")}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteUser(userToDelete.id)}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer"
              >
                {actionLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                {actionLoading
                  ? t("admin.deleteUserDeleting")
                  : t("admin.deleteUserConfirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
