// ==========================================================================
// API SERVICE — Using Axios
// ==========================================================================
import axios from "axios";

const API_BASE_URL = "/api";

// Create a shared Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: "application/json" },
});

// Attach the auth token to every request automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — clear token and let components handle redirect
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

export const api = {
  // =========================================================================
  // AUTH
  // =========================================================================
  async login(email, password) {
    const { data } = await axiosInstance.post("/login", { email, password });
    if (data.token) {
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
    }
    return data;
  },

  async register(name, email, phone, password, password_confirmation) {
    const { data } = await axiosInstance.post("/register", {
      name,
      email,
      phone,
      password,
      password_confirmation,
    });
    if (data.token) {
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
    }
    return data;
  },

  async logout() {
    try {
      await axiosInstance.post("/logout");
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
  },

  async getProfile() {
    const { data } = await axiosInstance.get("/profile");
    return data;
  },

  async updateProfile(name, phone, password, password_confirmation) {
    const body = { name, phone };
    if (password) {
      body.password = password;
      body.password_confirmation = password_confirmation;
    }
    const { data } = await axiosInstance.put("/profile/update", body);
    if (data.user) {
      localStorage.setItem("auth_user", JSON.stringify(data.user));
    }
    return data;
  },

  // =========================================================================
  // MENU & CATEGORIES
  // =========================================================================
  async getMenu() {
    const { data } = await axiosInstance.get("/menu?per_page=100");
    return data.data || data;
  },

  async getCategories() {
    const { data } = await axiosInstance.get("/categories");
    return data;
  },

  // =========================================================================
  // BOOKING
  // =========================================================================
  async createBooking(numOfPeople, bookingDate, bookingTime) {
    const { data } = await axiosInstance.post("/bookings", {
      num_of_people: parseInt(numOfPeople, 10),
      booking_date: bookingDate,
      booking_time: bookingTime,
    });
    return data;
  },

  async getMyBookings() {
    const { data } = await axiosInstance.get("/my-bookings");
    return data.data || data;
  },

  // =========================================================================
  // ORDERS
  // =========================================================================
  async createOrder(address, phone, notes, paymentMethod, items) {
    const { data } = await axiosInstance.post("/orders", {
      address,
      phone,
      notes,
      payment_method: paymentMethod,
      items,
    });
    return data;
  },

  async getMyOrders() {
    const { data } = await axiosInstance.get("/my-orders");
    return data.data || data;
  },

  // =========================================================================
  // ADMIN — USERS
  // =========================================================================
  async adminGetUsers() {
    const { data } = await axiosInstance.get("/admin/users");
    return data.data || data;
  },

  async adminDeleteUser(id) {
    const { data } = await axiosInstance.delete(`/admin/users/${id}`);
    return data;
  },

  // =========================================================================
  // ADMIN — BOOKINGS
  // =========================================================================
  async adminGetBookings() {
    const { data } = await axiosInstance.get("/admin/bookings");
    return data.data || data;
  },

  async adminUpdateBookingStatus(id, status) {
    const { data } = await axiosInstance.patch(`/admin/bookings/${id}/status`, {
      status,
    });
    return data;
  },

  // =========================================================================
  // ADMIN — ORDERS
  // =========================================================================
  async adminGetOrders() {
    const { data } = await axiosInstance.get("/admin/orders");
    return data.data || data;
  },

  async adminUpdateOrderStatus(id, status) {
    const { data } = await axiosInstance.patch(`/admin/orders/${id}/status`, {
      status,
    });
    return data;
  },

  // =========================================================================
  // ADMIN — MENU ITEMS
  // =========================================================================
  async adminCreateMenuItem(formData) {
    const { data } = await axiosInstance.post("/admin/menu", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async adminUpdateMenuItem(id, formData) {
    // Laravel requires _method spoofing for PATCH with FormData
    formData.append("_method", "PATCH");
    const { data } = await axiosInstance.post(`/admin/menu/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async adminDeleteMenuItem(id) {
    const { data } = await axiosInstance.delete(`/admin/menu/${id}`);
    return data;
  },

  async adminCreateCategory(name) {
    const { data } = await axiosInstance.post("/admin/categories", { name });
    return data;
  },

  // =========================================================================
  // CONTACT MESSAGES
  // =========================================================================
  async sendContactMessage(name, email, subject, message) {
    const { data } = await axiosInstance.post("/contact", {
      name,
      email,
      subject,
      message,
    });
    return data;
  },

  async getMyMessages() {
    const { data } = await axiosInstance.get("/my-messages");
    return data;
  },

  async adminGetContacts() {
    const { data } = await axiosInstance.get("/admin/contacts");
    return data;
  },

  async adminReplyContact(id, reply) {
    const { data } = await axiosInstance.post(`/admin/contacts/${id}/reply`, {
      reply,
    });
    return data;
  },
};
