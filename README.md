# 🍽️ Bistro Bliss - Restaurant Management System

A full-stack restaurant web application built with **React** (Frontend) and **Laravel** (Backend API).

---

## 🚀 Features

- 🛒 **Online Ordering** — Browse menu, add to cart, and place orders
- 📅 **Table Booking** — Reserve tables with real-time availability
- 👤 **Authentication** — User registration, login, and role-based access
- 🔔 **Real-time Notifications** — Instant alerts for order & booking updates
- 🌙 **Dark Mode** — Full site-wide dark theme support
- 🌍 **Multi-language** — Arabic & English support (i18n)
- 💬 **AI Chatbot** — Intelligent assistant for customer queries
- 📊 **Admin Dashboard** — Manage orders, bookings, menu, and messages
- 📩 **Contact System** — Two-way messaging between users and admin
- 📱 **PWA Support** — Installable as a Progressive Web App

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| React Router | Navigation |
| Axios | HTTP Client |
| CSS / TailwindCSS | Styling |

### Backend
| Technology | Purpose |
|------------|---------|
| Laravel 11 | REST API |
| MySQL | Database |
| Laravel Sanctum | Authentication |
| Eloquent ORM | Database Management |

---

## 📁 Project Structure

```
Bistro-Bliss/
├── Resturant/              # Laravel Backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
│
└── resturant-design/       # React Frontend
    └── src/
        ├── components/
        ├── pages/
        ├── contexts/
        ├── services/
        └── translations/
```

---

## ⚙️ Installation

### Backend (Laravel)

```bash
cd Resturant
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend (React)

```bash
cd resturant-design
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Laravel `.env`
```
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### React `.env`
```
VITE_API_URL=http://localhost:8000/api
```

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Guest** | Browse menu, view pages |
| **User** | Place orders, book tables, contact admin |
| **Admin** | Full dashboard access, manage all data |

---

## 📄 License

This project is for educational purposes.

---

Made with ❤️ by **Adham**
