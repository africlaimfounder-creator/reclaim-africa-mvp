import React, { useState, useEffect } from 'react';
import usePushNotifications from '../hooks/usePushNotifications';
import { Bell, BellOff, X } from 'lucide-react';

const PushNotificationPrompt = () => {
  const { isSupported, permission, subscribeToPush } = usePushNotifications();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the prompt
    const isDismissed = localStorage.getItem('pushNotificationPromptDismissed');
    
    if (isSupported && permission === 'default' && !isDismissed) {
      // Show prompt after 5 seconds
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isSupported, permission]);

  const handleEnable = async () => {
    const success = await subscribeToPush();
    if (success) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pushNotificationPromptDismissed', 'true');
  };

  if (!showPrompt || dismissed) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-96 rounded-2xl p-6 border shadow-2xl animate-slide-up"
      style={{
        backgroundColor: '#12100E',
        borderColor: '#D4AF37',
        maxWidth: 'calc(100vw - 48px)'
      }}
      data-testid="push-notification-prompt"
    >
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-[#A3A099] hover:text-white transition-colors duration-300"
        data-testid="dismiss-push-prompt"
      >
        <X size={20} />
      </button>

      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
        >
          <Bell size={24} style={{ color: '#D4AF37' }} />
        </div>
        <div className="flex-1">
          <h3
            className="text-lg font-bold text-white mb-2"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Get Instant Updates
          </h3>
          <p
            className="text-sm text-[#A3A099] mb-4"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            Enable push notifications to get instant updates when your claim status changes.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleEnable}
              className="px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-[0_0_10px_rgba(212,175,55,0.5)] active:scale-95"
              style={{
                backgroundColor: '#D4AF37',
                color: '#0A0908',
                fontFamily: 'Manrope, sans-serif'
              }}
              data-testid="enable-push-btn"
            >
              Enable
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-[#2B2823]"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #2B2823',
                color: '#A3A099',
                fontFamily: 'Manrope, sans-serif'
              }}
              data-testid="not-now-push-btn"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PushNotificationPrompt;
