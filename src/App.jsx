import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import About from './pages/About';
import Tours from './pages/Tours';
import TourDetails from './pages/TourDetails';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { logout as apiLogout, isAuthenticated } from './services/api';

// Route guard for the admin dashboard
function AdminProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/admin/login" replace />;
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Scroll to top on route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogout = () => {
    apiLogout();
    navigate('/admin/login');
  };

  const handleViewChange = (view) => {
    if (view === 'public') {
      navigate('/');
    } else if (view === 'admin-dashboard') {
      navigate('/admin');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-gray-300">
      
      {/* 1. Header Navigation Menu (only shown on public view) */}
      {!isAdminRoute && (
        <Navbar 
          onOpenAdminLogin={() => navigate('/admin/login')} 
          onViewChange={handleViewChange}
          currentView="public"
        />
      )}

      {/* 2. Main Page Content */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<TourDetails />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard 
                  onViewChange={handleViewChange}
                  onLogout={handleLogout}
                />
              </AdminProtectedRoute>
            } 
          />
          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* 3. Footer & Float actions (only shown on public view) */}
      {!isAdminRoute && (
        <>
          <WhatsAppButton />
          <Footer />
        </>
      )}

    </div>
  );
}

export default App;

