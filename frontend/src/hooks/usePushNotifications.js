import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Convert base64 string to Uint8Array for VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
      
      // Register service worker
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          
          // Check for existing subscription
          return registration.pushManager.getSubscription();
        })
        .then((existingSubscription) => {
          if (existingSubscription) {
            setSubscription(existingSubscription);
          }
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  const subscribeToPush = async () => {
    try {
      // Request notification permission
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult !== 'granted') {
        console.log('Push notification permission denied');
        return false;
      }

      // Get VAPID public key from backend
      const { data: vapidData } = await axios.get(`${API_URL}/api/push/vapid-public-key`, {
        withCredentials: true
      });

      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidData.publicKey)
      });

      // Send subscription to backend
      await axios.post(
        `${API_URL}/api/push/subscribe`,
        pushSubscription.toJSON(),
        { withCredentials: true }
      );

      setSubscription(pushSubscription);
      console.log('Push notification subscription successful');
      return true;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return false;
    }
  };

  const unsubscribeFromPush = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        
        // Notify backend
        await axios.post(
          `${API_URL}/api/push/unsubscribe`,
          subscription.toJSON(),
          { withCredentials: true }
        );

        setSubscription(null);
        console.log('Unsubscribed from push notifications');
        return true;
      }
    } catch (error) {
      console.error('Unsubscribe failed:', error);
      return false;
    }
  };

  return {
    isSupported,
    subscription,
    permission,
    subscribeToPush,
    unsubscribeFromPush
  };
};

export default usePushNotifications;
