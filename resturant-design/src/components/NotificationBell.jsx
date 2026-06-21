import { useState, useRef, useEffect, useCallback } from "react";
import { Bell, CheckCheck, Trash2, X, Loader2, ShoppingBag, CalendarDays, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { useLanguage } from "../contexts/LanguageContext";
import { api } from "../services/api";

// ==========================================================================
// NOTIFICATION BELL — Interactive notification center with actions & nav
// ==========================================================================
const NotificationBell = () => {
  const {
    user,
    notifications,
    unreadCount,
    markNotificationRead,
    removeNotification,
    markAllRead,
    clearNotifications,
  } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  // Track ids being animated out (fade-out before removal)
  const [exiting, setExiting] = useState(new Set());
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Smooth removal: add id to exiting set → wait 300ms → call removeNotification
  const smoothRemove = useCallback((id) => {
    setExiting((prev) => new Set(prev).add(id));
    setTimeout(() => {
      removeNotification(id);
      setExiting((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  }, [removeNotification]);

  // Color dot per notification type
  const typeColor = {
    success: "#16a34a",
    error:   "#dc2626",
    warning: "#d97706",
    info:    "#2563eb",
  };

  // Icon per metadata category
  const metaIcon = (type) => {
    if (type === "order")   return <ShoppingBag  size={12} style={{ color: "#2563eb", flexShrink: 0 }} />;
    if (type === "booking") return <CalendarDays size={12} style={{ color: "#16a34a", flexShrink: 0 }} />;
    if (type === "message") return <MessageSquare size={12} style={{ color: "#d97706", flexShrink: 0 }} />;
    return null;
  };

  // Click notification → navigate to relevant tab → remove from list
  const handleNotifClick = useCallback((n) => {
    setOpen(false);
    smoothRemove(n.id);

    if (!n.metadata) return;

    const isAdmin = user?.role === "admin";
    const tabMap = { order: "orders", booking: "bookings", message: "messages" };
    const tab = tabMap[n.metadata.type];
    if (!tab) return;

    navigate(`${isAdmin ? "/admin" : "/profile"}?tab=${tab}`);
  }, [user, smoothRemove, navigate]);

  // ── Admin quick action: update ORDER status ─────────────────────────────
  const handleOrderAction = useCallback(async (e, notifId, orderId, status) => {
    e.stopPropagation();
    setActionLoading(notifId);
    try {
      await api.adminUpdateOrderStatus(orderId, status);
      // Clean up the stale pending notification from localStorage
      const saved = JSON.parse(localStorage.getItem("bistro_notifications") || "[]");
      localStorage.setItem(
        "bistro_notifications",
        JSON.stringify(
          saved.filter(
            (n) =>
              !(n.metadata &&
                n.metadata.type === "order" &&
                n.metadata.id === orderId &&
                n.metadata.status === "pending")
          )
        )
      );
      window.dispatchEvent(new Event("bistro_data_refreshed"));
      smoothRemove(notifId);
    } catch (err) {
      console.error("Failed to update order:", err.message);
    } finally {
      setActionLoading(null);
    }
  }, [smoothRemove]);

  // ── Admin quick action: update BOOKING status ───────────────────────────
  const handleBookingAction = useCallback(async (e, notifId, bookingId, status) => {
    e.stopPropagation();
    setActionLoading(notifId);
    try {
      await api.adminUpdateBookingStatus(bookingId, status);
      const saved = JSON.parse(localStorage.getItem("bistro_notifications") || "[]");
      localStorage.setItem(
        "bistro_notifications",
        JSON.stringify(
          saved.filter(
            (n) =>
              !(n.metadata &&
                n.metadata.type === "booking" &&
                n.metadata.id === bookingId &&
                n.metadata.status === "pending")
          )
        )
      );
      window.dispatchEvent(new Event("bistro_data_refreshed"));
      smoothRemove(notifId);
    } catch (err) {
      console.error("Failed to update booking:", err.message);
    } finally {
      setActionLoading(null);
    }
  }, [smoothRemove]);

  const isAdmin = user?.role === "admin";

  return (
    <div ref={ref} style={{ position: "relative" }}>

      {/* ── Bell Button ── */}
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          position: "relative",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "6px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          color: "#41454C",
        }}
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: 0, right: 0,
            background: "#AD343E", color: "#fff",
            borderRadius: "50%", width: 17, height: 17,
            fontSize: 10, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 1px 4px rgba(173,52,62,0.4)",
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown Panel ── */}
      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 10px)",
          width: 360, background: "#fff", borderRadius: 18,
          boxShadow: "0 12px 40px rgba(0,0,0,0.13)",
          border: "1px solid #f0f0f0", zIndex: 9999, overflow: "hidden",
          fontFamily: "'DM Sans', sans-serif",
        }}>

          {/* Header */}
          <div style={{
            padding: "12px 16px", borderBottom: "1px solid #f5f5f5",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#fafafa",
          }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#2C2F34" }}>
              Notifications{" "}
              {unreadCount > 0 && (
                <span style={{
                  background: "#AD343E", color: "#fff",
                  borderRadius: 99, padding: "1px 7px", fontSize: 10, marginLeft: 4,
                }}>
                  {unreadCount}
                </span>
              )}
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {notifications.length > 0 && (
                <>
                  <button onClick={markAllRead} title="Mark all read"
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4, borderRadius: 6, display: "flex" }}>
                    <CheckCheck size={14} />
                  </button>
                  <button onClick={clearNotifications} title="Clear all"
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4, borderRadius: 6, display: "flex" }}>
                    <Trash2 size={14} />
                  </button>
                </>
              )}
              <button onClick={() => setOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4, borderRadius: 6, display: "flex" }}>
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div style={{ maxHeight: 420, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 36, textAlign: "center", color: "#9ca3af" }}>
                <Bell size={30} style={{ margin: "0 auto 10px", opacity: 0.35 }} />
                <p style={{ fontSize: 12, margin: 0 }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => {
                const isActing   = actionLoading === n.id;
                const isExiting  = exiting.has(n.id);
                const showOrderActions =
                  isAdmin && n.metadata?.type === "order" && n.metadata?.status === "pending";
                const showBookingActions =
                  isAdmin && n.metadata?.type === "booking" && n.metadata?.status === "pending";

                return (
                  <div
                    key={n.id}
                    onClick={() => handleNotifClick(n)}
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #f7f7f7",
                      background: n.read ? "#fff" : "#fef9f9",
                      cursor: "pointer",
                      transition: "background 0.15s, opacity 0.3s, max-height 0.3s",
                      opacity: isExiting ? 0 : 1,
                      maxHeight: isExiting ? 0 : 200,
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => { if (!isExiting) e.currentTarget.style.background = n.read ? "#f9f9f9" : "#fef3f3"; }}
                    onMouseLeave={(e) => { if (!isExiting) e.currentTarget.style.background = n.read ? "#fff" : "#fef9f9"; }}
                  >
                    {/* Row: dot + content + unread pip */}
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: typeColor[n.type] || "#6b7280",
                        marginTop: 4, flexShrink: 0,
                      }} />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Icon + message */}
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2, flexWrap: "wrap" }}>
                          {n.metadata?.type && metaIcon(n.metadata.type)}
                          <p style={{
                            margin: 0, fontSize: 12, color: "#374151",
                            lineHeight: 1.5, fontWeight: n.read ? 400 : 600,
                            wordBreak: "break-word",
                          }}>
                            {n.message}
                          </p>
                        </div>

                        {/* Timestamp */}
                        <p style={{ margin: 0, fontSize: 10, color: "#9ca3af" }}>
                          {new Date(n.createdAt).toLocaleString([], {
                            month: "short", day: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>

                        {/* ── Order action buttons ── */}
                        {showOrderActions && (
                          <div
                            style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ActionBtn
                              color="#2563eb"
                              disabled={isActing}
                              loading={isActing}
                              onClick={(e) => handleOrderAction(e, n.id, n.metadata.id, "accepted")}
                            >
                              {t("admin.btnAccept")}
                            </ActionBtn>
                            <ActionBtn
                              color="#dc2626"
                              disabled={isActing}
                              onClick={(e) => handleOrderAction(e, n.id, n.metadata.id, "rejected")}
                            >
                              {t("admin.btnReject")}
                            </ActionBtn>
                            <ViewBtn onClick={() => handleNotifClick(n)} />
                          </div>
                        )}

                        {/* ── Booking action buttons ── */}
                        {showBookingActions && (
                          <div
                            style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ActionBtn
                              color="#16a34a"
                              disabled={isActing}
                              loading={isActing}
                              onClick={(e) => handleBookingAction(e, n.id, n.metadata.id, "confirmed")}
                            >
                              {t("admin.btnConfirmBooking")}
                            </ActionBtn>
                            <ActionBtn
                              color="#dc2626"
                              disabled={isActing}
                              onClick={(e) => handleBookingAction(e, n.id, n.metadata.id, "rejected")}
                            >
                              {t("admin.btnRejectBooking")}
                            </ActionBtn>
                            <ViewBtn onClick={() => handleNotifClick(n)} />
                          </div>
                        )}
                      </div>

                      {/* Unread pip */}
                      {!n.read && (
                        <span style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: "#AD343E", flexShrink: 0, marginTop: 5,
                        }} />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer hint */}
          {notifications.length > 0 && (
            <div style={{
              padding: "8px 16px", textAlign: "center",
              fontSize: 10, color: "#9ca3af",
              borderTop: "1px solid #f5f5f5", background: "#fafafa",
            }}>
              Click any notification to navigate · Actions update status instantly
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ── Small reusable action button ─────────────────────────────────────────────
const ActionBtn = ({ children, color, disabled, loading, onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: color, color: "#fff", border: "none",
      borderRadius: 7, padding: "4px 10px", fontSize: 10, fontWeight: "bold",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      display: "flex", alignItems: "center", gap: 4,
      transition: "opacity 0.15s",
    }}
  >
    {loading && (
      <Loader2
        size={9}
        style={{ animation: "spin 1s linear infinite", flexShrink: 0 }}
      />
    )}
    {children}
  </button>
);

// ── "View →" ghost button ─────────────────────────────────────────────────────
const ViewBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: "transparent", color: "#6b7280",
      border: "1px solid #e5e7eb", borderRadius: 7,
      padding: "4px 8px", fontSize: 10, fontWeight: 600, cursor: "pointer",
    }}
  >
    View →
  </button>
);

export default NotificationBell;
