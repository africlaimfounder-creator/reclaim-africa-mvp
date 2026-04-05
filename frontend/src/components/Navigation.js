import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, FileText, HelpCircle, LogOut, Shield } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/', { replace: true });
    }
  };

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'rgba(10, 9, 8, 0.7)',
        backdropFilter: 'blur(32px)',
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#D4AF37' }}
            >
              <span className="text-[#0A0908] font-bold text-lg">RA</span>
            </div>
            <span className="text-white font-bold text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Reclaim Africa
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 transition-all duration-300 ${
                isActive('/dashboard') ? 'text-[#D4AF37]' : 'text-[#A3A099] hover:text-white'
              }`}
              data-testid="nav-home"
            >
              <Home size={18} />
              <span className="hidden md:inline">Home</span>
            </Link>
            <Link
              to="/my-claims"
              className={`flex items-center gap-2 transition-all duration-300 ${
                isActive('/my-claims') ? 'text-[#D4AF37]' : 'text-[#A3A099] hover:text-white'
              }`}
              data-testid="nav-claims"
            >
              <FileText size={18} />
              <span className="hidden md:inline">My Claims</span>
            </Link>
            <Link
              to="/help"
              className={`flex items-center gap-2 transition-all duration-300 ${
                isActive('/help') ? 'text-[#D4AF37]' : 'text-[#A3A099] hover:text-white'
              }`}
              data-testid="nav-help"
            >
              <HelpCircle size={18} />
              <span className="hidden md:inline">Help</span>
            </Link>
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 transition-all duration-300 ${
                  isActive('/admin') ? 'text-[#D4AF37]' : 'text-[#A3A099] hover:text-white'
                }`}
                data-testid="nav-admin"
              >
                <Shield size={18} />
                <span className="hidden md:inline">Admin</span>
              </Link>
            )}
            {user.role !== 'admin' && <NotificationBell />}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[#A3A099] hover:text-white transition-all duration-300"
              data-testid="nav-logout"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
