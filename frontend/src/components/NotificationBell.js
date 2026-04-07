import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Check } from 'lucide-react';

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = () => {
    if (!user) return;
    const userNotifs = JSON.parse(localStorage.getItem(`notifications_${user.id}`) || '[]');
    setNotifications(userNotifs);
    setUnreadCount(userNotifs.filter(n => !n.read).length);
  };

  const markAsRead = (notificationId) => {
    const updatedNotifs = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifs);
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifs));
    setUnreadCount(updatedNotifs.filter(n => !n.read).length);
  };

  const markAllAsRead = () => {
    const updatedNotifs = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifs);
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifs));
    setUnreadCount(0);
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative flex items-center gap-2 text-[#A3A099] hover:text-white transition-all duration-300"
        data-testid="notification-bell"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: '#D4AF37', color: '#0A0908' }}
            data-testid="notification-count"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-96 rounded-2xl border shadow-2xl z-50"
          style={{
            backgroundColor: '#12100E',
            borderColor: '#2B2823',
            maxHeight: '500px'
          }}
          data-testid="notification-dropdown"
        >
          <div
            className="flex items-center justify-between p-4 border-b"
            style={{ borderColor: '#2B2823' }}
          >
            <h3
              className="text-lg font-bold text-white"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-[#D4AF37] hover:underline"
                style={{ fontFamily: 'Manrope, sans-serif' }}
                data-testid="mark-all-read-btn"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={48} className="mx-auto mb-4" style={{ color: '#A3A099' }} />
                <p className="text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b transition-all duration-300 hover:bg-[#1A1815] ${
                    !notification.read ? 'bg-[#1A1815]' : ''
                  }`}
                  style={{ borderColor: '#2B2823' }}
                  data-testid={`notification-${notification.id}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4
                          className="font-semibold text-white"
                          style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: '#D4AF37' }}
                          />
                        )}
                      </div>
                      <p
                        className="text-sm text-[#A3A099] mb-2"
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                      >
                        {notification.message}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: '#A3A099', fontFamily: 'Manrope, sans-serif' }}
                      >
                        {getTimeAgo(notification.created_at)}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-[#D4AF37] hover:text-white transition-colors duration-300"
                        title="Mark as read"
                        data-testid={`mark-read-${notification.id}`}
                      >
                        <Check size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t" style={{ borderColor: '#2B2823' }}>
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center py-2 rounded-lg font-medium transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#0A0908]"
                style={{
                  color: '#D4AF37',
                  fontFamily: 'Manrope, sans-serif'
                }}
                data-testid="view-all-notifications-link"
              >
                View All Notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
