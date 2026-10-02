import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { Toast } from './components/common/Toast';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { WholesalePage } from './pages/WholesalePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AuthPages } from './pages/AuthPages';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AdminPage } from './pages/AdminPage';

const AppContent: React.FC = () => {
  const { currentPage } = useStore();
  
  // Cache busting / Version management - DO NOT wipe user products or deleted prods
  useEffect(() => {
    const CURRENT_VERSION = '1.0.9';
    const savedVersion = localStorage.getItem('aaf_app_version');
    if (savedVersion !== CURRENT_VERSION) {
      localStorage.setItem('aaf_app_version', CURRENT_VERSION);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-success':
        return <OrderSuccessPage />;
      case 'collections':
        return <CollectionsPage />;
      case 'wholesale':
        return <WholesalePage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'auth':
      case 'login':
        return <AuthPages />;
      case 'dashboard':
      case 'customer-dashboard':
        return <CustomerDashboardPage />;
      case 'admin':
      case 'admin-dashboard':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  const isAdminView = currentPage === 'admin' || currentPage === 'admin-dashboard';

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EB] text-neutral-900 selection:bg-amber-200 selection:text-amber-950 pb-16 lg:pb-0">
      {!isAdminView && <Header />}
      <main className="flex-1">
        {renderPage()}
      </main>
      {!isAdminView && <Footer />}
      {!isAdminView && <MobileBottomNav />}
      {!isAdminView && <WhatsAppButton />}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
