/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { api } from "../services/api";
import { translations } from "../translations";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- AUTH STATE ---
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("auth_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("auth_token"));

  // --- THEME STATE ---
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const loginUser = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const logoutUser = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_token");
      setNotifications([]);
      localStorage.removeItem("bistro_notifications");
    }
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const freshUser = await api.getProfile();
      setUser(freshUser);
      localStorage.setItem("auth_user", JSON.stringify(freshUser));
    } catch (err) {
      console.error("Could not refresh profile", err);
    }
  };

  // =========================================================================
  // NOTIFICATIONS STATE
  // =========================================================================
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("bistro_notifications");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("bistro_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((message, type = "info", metadata = null) => {
    const newNotif = {
      id: Date.now() + Math.random().toString(36).substring(2, 7),
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      metadata,
    };
    setNotifications((prev) => {
      if (metadata && metadata.id) {
        const hasDuplicate = prev.some(
          (n) =>
            n.metadata &&
            n.metadata.type === metadata.type &&
            n.metadata.id === metadata.id &&
            n.metadata.status === metadata.status
        );
        if (hasDuplicate) return prev;
      }
      return [newNotif, ...prev].slice(0, 30);
    });
  }, [setNotifications]);

  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, [setNotifications]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, [setNotifications]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [setNotifications]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // =========================================================================
  // TWO-WAY LOCALIZED NOTIFICATIONS POLLING SYSTEM (PERSISTENT & ROBUST)
  // =========================================================================
  const getTranslation = useCallback((key) => {
    const lang = localStorage.getItem("bistro_lang") || "en";
    const keys = key.split(".");
    let val = translations[lang];
    for (const k of keys) val = val?.[k];
    return val || key;
  }, []);

  const addNotifRef = useRef(addNotification);
  useEffect(() => {
    addNotifRef.current = addNotification;
  }, [addNotification]);

  // [A] USER POLLING — Detect status changes on own orders/bookings & message replies (15s)
  useEffect(() => {
    if (!token || !user || user.role === "admin") return;
    let isFirstFetch = true;

    const pollUser = async () => {
      try {
        const userId = user.id;

        // 1. Poll user orders
        const orders = await api.getMyOrders().then(res => res.data || res);
        const seenOrdersKey = `bistro_seen_orders_${userId}`;
        const seenOrders = JSON.parse(localStorage.getItem(seenOrdersKey) || "{}");
        let ordersChanged = false;

        const orderList = Array.isArray(orders) ? orders : (orders.data || []);

        orderList.forEach((order) => {
          const prevStatus = seenOrders[order.id];
          if (!isFirstFetch && prevStatus !== undefined && prevStatus !== order.status) {
            const label = getTranslation(`admin.status.${order.status}`) || order.status.replace(/_/g, " ").toUpperCase();
            const type = order.status === "rejected" ? "error" : "success";
            const text = getTranslation("notifications.orderStatusChanged")
              .replace("{id}", order.id)
              .replace("{status}", label);
            addNotifRef.current(text, type, { type: "order", id: order.id, status: order.status });
          }
          if (prevStatus !== order.status) {
            seenOrders[order.id] = order.status;
            ordersChanged = true;
          }
        });
        if (ordersChanged) {
          localStorage.setItem(seenOrdersKey, JSON.stringify(seenOrders));
        }

        // 2. Poll user bookings
        const bookings = await api.getMyBookings().then(res => res.data || res);
        const seenBookingsKey = `bistro_seen_bookings_${userId}`;
        const seenBookings = JSON.parse(localStorage.getItem(seenBookingsKey) || "{}");
        let bookingsChanged = false;

        const bookingList = Array.isArray(bookings) ? bookings : (bookings.data || []);

        bookingList.forEach((booking) => {
          const prevStatus = seenBookings[booking.id];
          if (!isFirstFetch && prevStatus !== undefined && prevStatus !== booking.status) {
            const icon = booking.status === "confirmed" ? "✅" : "❌";
            const type = booking.status === "rejected" ? "error" : "success";
            const label = getTranslation(`admin.status.${booking.status}`) || booking.status.toUpperCase();
            const text = getTranslation("notifications.bookingStatusChanged")
              .replace("{id}", booking.id)
              .replace("{status}", label)
              .replace("{icon}", icon);
            addNotifRef.current(text, type, { type: "booking", id: booking.id, status: booking.status });
          }
          if (prevStatus !== booking.status) {
            seenBookings[booking.id] = booking.status;
            bookingsChanged = true;
          }
        });
        if (bookingsChanged) {
          localStorage.setItem(seenBookingsKey, JSON.stringify(seenBookings));
        }

        // 3. Poll user contact message replies
        const messages = await api.getMyMessages();
        const seenRepliesKey = `bistro_seen_contact_replies_${userId}`;
        const seenReplies = JSON.parse(localStorage.getItem(seenRepliesKey) || "{}");
        let repliesChanged = false;

        const messageList = Array.isArray(messages) ? messages : [];

        messageList.forEach((msg) => {
          if (msg.reply) {
            const prevRepliedAt = seenReplies[msg.id];
            if (!isFirstFetch && (prevRepliedAt === undefined || prevRepliedAt !== msg.replied_at)) {
              const text = getTranslation("notifications.messageReplied")
                .replace("{subject}", msg.subject);
              addNotifRef.current(text, "success", { type: "message", id: msg.id, status: "replied" });
            }
            if (prevRepliedAt !== msg.replied_at) {
              seenReplies[msg.id] = msg.replied_at;
              repliesChanged = true;
            }
          }
        });
        if (repliesChanged) {
          localStorage.setItem(seenRepliesKey, JSON.stringify(seenReplies));
        }

        isFirstFetch = false;
      } catch (err) {
        console.error("User polling error", err);
      }
    };

    pollUser();
    const interval = setInterval(pollUser, 15000);
    return () => clearInterval(interval);
  }, [token, user, getTranslation]);

  // [B] ADMIN POLLING — Detect new bookings, new orders, and new messages (15s)
  useEffect(() => {
    if (!token || !user || user.role !== "admin") return;
    let isFirstFetch = true;

    const pollAdmin = async () => {
      try {
        const adminId = user.id;
        const savedNotifs = JSON.parse(localStorage.getItem("bistro_notifications") || "[]");

        // 1. Poll new orders
        const orders = await api.adminGetOrders().then(res => res.data || res);
        const seenOrdersKey = `bistro_admin_seen_orders_${adminId}`;
        const seenOrders = JSON.parse(localStorage.getItem(seenOrdersKey) || "{}");
        let ordersChanged = false;
        let newOrdersCount = 0;

        const orderList = Array.isArray(orders) ? orders : (orders.data || []);

        orderList.forEach((o) => {
          const isNew = !seenOrders[o.id];
          if (isNew) {
            seenOrders[o.id] = true;
            ordersChanged = true;
            if (!isFirstFetch) {
              newOrdersCount++;
            }
          }

          // If pending, make sure notification is in list
          if (o.status === "pending") {
            const hasNotif = savedNotifs.some(
              (n) => n.metadata && n.metadata.type === "order" && n.metadata.id === o.id && n.metadata.status === "pending"
            );
            if (!hasNotif) {
              const text = getTranslation("notifications.orderPending").replace("{id}", o.id);
              addNotifRef.current(text, "info", { type: "order", id: o.id, status: "pending" });
            }
          }
        });
        if (newOrdersCount > 0) {
          const text = getTranslation("notifications.adminNewOrders")
            .replace("{count}", newOrdersCount)
            .replace("{s}", newOrdersCount > 1 ? "s" : "");
          addNotifRef.current(text, "info");
        }
        if (ordersChanged) {
          localStorage.setItem(seenOrdersKey, JSON.stringify(seenOrders));
        }

        // 2. Poll new bookings
        const bookings = await api.adminGetBookings().then(res => res.data || res);
        const seenBookingsKey = `bistro_admin_seen_bookings_${adminId}`;
        const seenBookings = JSON.parse(localStorage.getItem(seenBookingsKey) || "{}");
        let bookingsChanged = false;
        let newBookingsCount = 0;

        const bookingList = Array.isArray(bookings) ? bookings : (bookings.data || []);

        bookingList.forEach((b) => {
          const isNew = !seenBookings[b.id];
          if (isNew) {
            seenBookings[b.id] = true;
            bookingsChanged = true;
            if (!isFirstFetch) {
              newBookingsCount++;
            }
          }

          // If pending, make sure notification is in list
          if (b.status === "pending") {
            const hasNotif = savedNotifs.some(
              (n) => n.metadata && n.metadata.type === "booking" && n.metadata.id === b.id && n.metadata.status === "pending"
            );
            if (!hasNotif) {
              const text = getTranslation("notifications.bookingPending").replace("{id}", b.id);
              addNotifRef.current(text, "info", { type: "booking", id: b.id, status: "pending" });
            }
          }
        });
        if (newBookingsCount > 0) {
          const text = getTranslation("notifications.adminNewBookings")
            .replace("{count}", newBookingsCount)
            .replace("{s}", newBookingsCount > 1 ? "s" : "");
          addNotifRef.current(text, "info");
        }
        if (bookingsChanged) {
          localStorage.setItem(seenBookingsKey, JSON.stringify(seenBookings));
        }

        // 3. Poll new contact messages
        const messages = await api.adminGetContacts();
        const seenContactsKey = `bistro_admin_seen_contacts_${adminId}`;
        const seenContacts = JSON.parse(localStorage.getItem(seenContactsKey) || "{}");
        let contactsChanged = false;
        let newContactsCount = 0;

        const messageList = Array.isArray(messages) ? messages : [];

        messageList.forEach((m) => {
          const isNew = !seenContacts[m.id];
          if (isNew) {
            seenContacts[m.id] = true;
            contactsChanged = true;
            if (!isFirstFetch) {
              newContactsCount++;
            }
          }

          // If unanswered, make sure notification is in list
          if (!m.reply) {
            const hasNotif = savedNotifs.some(
              (n) => n.metadata && n.metadata.type === "message" && n.metadata.id === m.id && n.metadata.status === "pending"
            );
            if (!hasNotif) {
              const text = getTranslation("notifications.messagePending")
                .replace("{name}", m.name)
                .replace("{subject}", m.subject);
              addNotifRef.current(text, "info", { type: "message", id: m.id, status: "pending" });
            }
          }
        });
        if (newContactsCount > 0) {
          const text = getTranslation("notifications.adminNewContacts")
            .replace("{count}", newContactsCount)
            .replace("{s}", newContactsCount > 1 ? "s" : "");
          addNotifRef.current(text, "info");
        }
        if (contactsChanged) {
          localStorage.setItem(seenContactsKey, JSON.stringify(seenContacts));
        }

        isFirstFetch = false;
      } catch (err) {
        console.error("Admin polling error", err);
      }
    };

    pollAdmin();
    const interval = setInterval(pollAdmin, 15000);
    return () => clearInterval(interval);
  }, [token, user, getTranslation]);

  // --- CART STATE ---
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("bistro_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("bistro_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <AppContext.Provider
      value={{
        // Auth
        user,
        token,
        loginUser,
        logoutUser,
        refreshUser,
        isAuthenticated: !!token,
        isAdmin: user?.role === "admin",
        darkMode,
        toggleDarkMode,

        // Notifications
        notifications,
        unreadCount,
        addNotification,
        markNotificationRead,
        removeNotification,
        markAllRead,
        clearNotifications,

        // Cart
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
