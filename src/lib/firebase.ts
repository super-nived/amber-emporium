import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDjW5LMG3deMsfjcen8FGcWulb4-2Lubn8",
  authDomain: "food-2ce3f.firebaseapp.com",
  projectId: "food-2ce3f",
  storageBucket: "food-2ce3f.appspot.com",
  messagingSenderId: "752616868298",
  appId: "1:752616868298:web:cbaee7b5ed6b0881112733"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Realtime Database for presence
export const realtimeDb = getDatabase(app);

// Initialize Cloud Messaging
let messaging: ReturnType<typeof getMessaging> | null = null;
try {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    messaging = getMessaging(app);
  }
} catch (error) {
  console.log('Firebase Messaging not available:', error);
}

export { messaging };

// Request notification permission and get FCM token
export const requestNotificationPermission = async (): Promise<string | null> => {
  if (!messaging) return null;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY' // User needs to add this from Firebase Console
      });
      return token;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
  }
  return null;
};

// Listen for foreground messages
export const onForegroundMessage = (callback: (payload: any) => void) => {
  if (!messaging) return () => {};
  return onMessage(messaging, callback);
};

export default app;
