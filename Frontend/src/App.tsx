import { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AIAssistant } from './components/AIAssistant';

// Public Pages
import { Home } from './pages/public/Home';
import { Search } from './pages/public/Search';
import { PropertyDetail } from './pages/public/PropertyDetail';
import { Community } from './pages/public/Community';
import { About } from './pages/public/About';
import { Blog } from './pages/public/Blog';
import { Contact } from './pages/public/Contact';
import { Featured } from './pages/public/Featured';
import { BuyerLanding } from './pages/public/BuyerLanding';
import { SellerLanding } from './pages/public/SellerLanding';

import { ScheduleViewingPage } from './pages/public/ScheduleViewingPage';
import { PurchaseOfferPage } from './pages/public/PurchaseOfferPage';
import { CityRealEstateLanding } from './pages/public/CityRealEstateLanding';

// Auth Gateway
import { Auth } from './pages/auth/Auth';

// Dashboards
import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { SellerDashboard } from './pages/seller/SellerDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { HomeValuation } from './pages/seller/HomeValuation';
import { ValuationReport } from './pages/seller/ValuationReport';

// Lucide icons for notifications
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

import { RoleSwitchModal } from './components/RoleSwitchModal';

function App() {
  const { currentPage, user, toasts, removeToast } = useApp();

  // Scroll to top automatically on page transition (State-Routing optimal)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Route page rendering selector
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;

      case 'featured':
        return <Featured />;
      case 'buyer':
        return <BuyerLanding />;
      case 'seller':
        return <SellerLanding />;
      case 'home-valuation':
        return <HomeValuation />;
      case 'valuation-report':
        return <ValuationReport />;
      case 'search':
        return <Search />;
      case 'mississauga-real-estate':
        return <CityRealEstateLanding city="Mississauga" minPrice={500000} maxPrice={1300000} />;
      case 'brampton-real-estate':
        return <CityRealEstateLanding city="Brampton" minPrice={500000} maxPrice={1300000} />;
      case 'gta-real-estate':
        return <CityRealEstateLanding city="GTA" minPrice={500000} maxPrice={1300000} />;
      case 'property-detail':
        return <PropertyDetail />;
      case 'schedule-viewing':
        return user && user.role === 'buyer' ? <ScheduleViewingPage /> : <Auth initialRole="buyer" />;
      case 'purchase-offer':
        return user && user.role === 'buyer' ? <PurchaseOfferPage /> : <Auth initialRole="buyer" />;
      case 'community':
        return <Community />;
      case 'about':
        return <About />;
      case 'blog':
        return <Blog />;
      case 'contact':
        return <Contact />;
      case 'auth':
        return <Auth />;
      case 'auth-seller':
        return <Auth initialRole="seller" />;
      case 'auth-buyer':
        return <Auth initialRole="buyer" />;
      case 'admin':
      case 'admin-login':
        return <Auth initialMode="admin-login" />;
      case 'admin-register':
        return <Auth initialMode="admin-register" />;
      case 'dashboard-buyer':
        return user && user.role === 'buyer' ? <BuyerDashboard /> : <Auth initialRole="buyer" />;
      case 'dashboard-seller':
        return user && user.role === 'seller' ? <SellerDashboard /> : <Auth initialRole="seller" />;
      case 'dashboard-admin':
        return user && user.role === 'admin' ? <AdminDashboard /> : <Auth initialMode="admin-login" />;
      default:
        return <Home />;
    }
  };

  // Determine whether to omit standard footer (e.g. inside intensive operational dashboards or full-screen search)
  const showFooter = !['dashboard-buyer', 'dashboard-seller', 'dashboard-admin', 'auth', 'auth-seller', 'auth-buyer', 'admin-login', 'admin-register', 'search'].includes(currentPage);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' }}>
      
      {/* 1. Permanent ambient glowing blurs & particle blobs canvas */}
      <div className="ambient-glow-container">
        <div className="glow-blob glow-blob-1"></div>
        <div className="glow-blob glow-blob-2"></div>
        <div className="glow-blob glow-blob-3"></div>
      </div>

      {/* 2. Global Translucent Glass Header Nav */}
      <Header />

      {/* 3. Main dynamic workspace routing portal */}
      <main style={{ flex: 1, position: 'relative', zIndex: 10 }}>
        {renderPage()}
      </main>

      {/* 4. Global editorial footer columns */}
      {showFooter && <Footer />}

      {/* 5. Floating interactive chatbot drawer */}
      <AIAssistant />

      {/* 6. Role Switch Warning Guard Modal */}
      <RoleSwitchModal />

      {/* 6. High-End Real-Time Toast Notifications Overlay Stack */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 10000,
          maxWidth: '360px',
          width: 'calc(100% - 48px)'
        }}
      >
        {toasts.map(toast => {
          // Select status styling
          const isSuccess = toast.type === 'success';
          const isWarning = toast.type === 'warning';
          const iconColor = isSuccess ? '#059669' : isWarning ? '#d97706' : '#0f172a';

          return (
            <div
              key={toast.id}
              className="glass-panel"
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: '#ffffff',
                border: `1.5px solid ${isSuccess ? '#059669' : isWarning ? '#f59e0b' : '#cbd5e1'}`,
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                justifyContent: 'space-between',
                animation: 'slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                {isSuccess && <CheckCircle2 size={18} style={{ color: iconColor, flexShrink: 0 }} />}
                {isWarning && <AlertCircle size={18} style={{ color: iconColor, flexShrink: 0 }} />}
                {toast.type === 'info' && <Info size={18} style={{ color: iconColor, flexShrink: 0 }} />}

                <span style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 700, lineHeight: '1.4' }}>
                  {toast.message}
                </span>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#475569',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                  flexShrink: 0
                }}
                className="hover-lift"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
