import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Check, CheckCheck } from 'lucide-react';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = () => {
    if (!user) return;
    const userNotifs = JSON.parse(localStorage.getItem(`notifications_${user.id}`) || '[]');
    setNotifications(userNotifs);
    setLoading(false);
  };

  const markAsRead = (notificationId) => {
    const updatedNotifs = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifs);
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifs));
  };

  const markAllAsRead = () => {
    const updatedNotifs = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifs);
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifs));
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ backgroundColor: '#0A0908', minHeight: '100vh' }}>
      <Navigation />
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12">
        <div className="mb-8">
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
            data-testid="notifications-page-title"
          >
            Notifications
          </h1>
          <p className="text-lg text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                filter === 'all'
                  ? 'text-[#0A0908]'
                  : 'text-[#A3A099] hover:text-white'
              }`}
              style={{
                backgroundColor: filter === 'all' ? '#D4AF37' : 'transparent',
                border: `1px solid ${filter === 'all' ? '#D4AF37' : '#2B2823'}`,
                fontFamily: 'Manrope, sans-serif'
              }}
              data-testid="filter-all"
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                filter === 'unread'
                  ? 'text-[#0A0908]'
                  : 'text-[#A3A099] hover:text-white'
              }`}
              style={{
                backgroundColor: filter === 'unread' ? '#D4AF37' : 'transparent',
                border: `1px solid ${filter === 'unread' ? '#D4AF37' : '#2B2823'}`,
                fontFamily: 'Manrope, sans-serif'
              }}
              data-testid="filter-unread"
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                filter === 'read'
                  ? 'text-[#0A0908]'
                  : 'text-[#A3A099] hover:text-white'
              }`}
              style={{
                backgroundColor: filter === 'read' ? '#D4AF37' : 'transparent',
                border: `1px solid ${filter === 'read' ? '#D4AF37' : '#2B2823'}`,
                fontFamily: 'Manrope, sans-serif'
              }}
              data-testid="filter-read"
            >
              Read
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#0A0908]"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #D4AF37',
                color: '#D4AF37',
                fontFamily: 'Manrope, sans-serif'
              }}
              data-testid="mark-all-read-page-btn"
            >
              <CheckCheck size={18} />
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#A3A099]">Loading notifications...</div>
        ) : filteredNotifications.length === 0 ? (
          <div
            className="rounded-2xl p-12 border text-center"
            style={{ backgroundColor: '#12100E', borderColor: '#2B2823' }}
            data-testid="no-notifications-message"
          >
            <Bell size={64} className="mx-auto mb-4" style={{ color: '#A3A099' }} />
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {filter === 'unread' ? 'No unread notifications' : filter === 'read' ? 'No read notifications' : 'No notifications yet'}
            </h3>
            <p className="text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {filter === 'all' ? "You'll see notifications here when you submit claims or receive updates." : ''}
            </p>
          </div>
        ) : (
          <div className="space-y-4" data-testid="notifications-list">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-2xl p-6 border transition-all duration-300 hover:border-[#D4AF37] ${
                  !notification.read ? 'bg-[#1A1815]' : ''
                }`}
                style={{
                  backgroundColor: !notification.read ? '#1A1815' : '#12100E',
                  borderColor: '#2B2823'
                }}
                data-testid={`notification-card-${notification.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3
                        className="text-xl font-bold text-white"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                      >
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: '#D4AF37' }}
                        />
                      )}
                    </div>
                    <p
                      className="text-[#A3A099] mb-3"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4">
                      <p
                        className="text-sm"
                        style={{ color: '#A3A099', fontFamily: 'Manrope, sans-serif' }}
                      >
                        {getTimeAgo(notification.created_at)}
                      </p>
                      {notification.type && (
                        <span
                          className="text-xs px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: 'rgba(212, 175, 55, 0.1)',
                            color: '#D4AF37',
                            fontFamily: 'Manrope, sans-serif'
                          }}
                        >
                          {notification.type.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#0A0908] flex items-center gap-2"
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #D4AF37',
                        color: '#D4AF37',
                        fontFamily: 'Manrope, sans-serif'
                      }}
                      data-testid={`mark-read-card-${notification.id}`}
                    >
                      <Check size={16} />
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
