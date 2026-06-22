import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import TourDetailsOverlay from './components/TourDetailsOverlay';
import AdminLoginModal from './components/AdminLoginModal';
import { logout as apiLogout, isAuthenticated } from './services/api';

function App() {
  const [view, setView] = useState('public'); // 'public' | 'admin-dashboard'
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const handleOpenAdminLogin = () => {
    setAdminLoginOpen(true);
  };

  const handleCloseAdminLogin = () => {
    setAdminLoginOpen(false);
  };

  const handleLoginSuccess = () => {
    setAdminLoginOpen(false);
    setView('admin-dashboard');
  };

  const handleLogout = () => {
    apiLogout();
    setView('public');
  };

  const handleViewChange = (newView) => {
    if (newView === 'admin-dashboard' && !isAuthenticated()) {
      setAdminLoginOpen(true);
    } else {
      setView(newView);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-gray-300">
      
      {/* 1. Header Navigation Menu (only shown on public view) */}
      {view === 'public' && (
        <Navbar 
          onOpenAdminLogin={handleOpenAdminLogin} 
          onViewChange={handleViewChange}
          currentView={view}
        />
      )}

      {/* 2. Main Page Content */}
      <div className="flex-grow">
        {view === 'public' ? (
          <Home 
            onViewDetails={setSelectedTourId} 
            onOpenAdminLogin={handleOpenAdminLogin}
          />
        ) : (
          <AdminDashboard 
            onViewChange={handleViewChange}
            onLogout={handleLogout}
          />
        )}
      </div>

      {/* 3. Footer & Float actions (only shown on public view) */}
      {view === 'public' && (
        <>
          <WhatsAppButton />
          <Footer />
        </>
      )}

      {/* 4. Fullscreen Tour Details Pop-up sheet */}
      {selectedTourId && (
        <TourDetailsOverlay 
          tourId={selectedTourId} 
          onClose={() => setSelectedTourId(null)}
        />
      )}

      {/* 5. Admin Login Pop-up dialog */}
      {adminLoginOpen && (
        <AdminLoginModal 
          onClose={handleCloseAdminLogin} 
          onSuccess={handleLoginSuccess}
        />
      )}

    </div>
  );
}

export default App;
