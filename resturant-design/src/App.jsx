import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Navbar from "./navbar";
import Footer from "./components/footer";
import CartDrawer from "./components/cart";
import Chatbot from "./components/Chatbot";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

// Pages
import Home from "./pages/home";
import About from "./pages/about";
import Menu from "./pages/menu";
import MenuItemDetail from "./pages/menuItemDetail";
import Pages from "./pages/pages";
import PageDetail from "./pages/pageDetail";
import BookTable from "./pages/book";
import Contact from "./pages/contact";
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard";
import Admin from "./pages/admin";

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:id" element={<MenuItemDetail />} />
          <Route path="/articles" element={<Pages />} />
          <Route path="/articles/:id" element={<PageDetail />} />
          <Route path="/book" element={<BookTable />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <Chatbot />
      <PWAInstallPrompt />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <LanguageProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <AppContent />
        </BrowserRouter>
      </LanguageProvider>
    </AppProvider>
  );
}

export default App;
