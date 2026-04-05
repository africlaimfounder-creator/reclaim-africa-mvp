import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Bell, Check, X } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/notifications/unread-count`, {
        withCredentials: true
      });
      setUnreadCount(data.count);
    } catch (e) {
      console.error('Error fetching unread count:', e);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/notifications`, {
        withCredentials: true
      });
      setNotifications(data);
    } catch (e) {
      console.error('Error fetching notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `${API_URL}/api/notifications/${notificationId}/read`,
        {},
        { withCredentials: true }
      );
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(
        `${API_URL}/api/notifications/mark-all-read`,
        {},
        { withCredentials: true }
      );
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error('Error marking all as read:', e);
    }
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
            {loading ? (
              <div className="p-8 text-center text-[#A3A099]">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={48} className="mx-auto mb-4" style={{ color: '#A3A099' }} />
                <p className="text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
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
