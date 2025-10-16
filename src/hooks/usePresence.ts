import { useEffect } from 'react';
import { ref, onValue, set, onDisconnect, serverTimestamp } from 'firebase/database';
import { realtimeDb } from '@/lib/firebase';

export const usePresence = (userId: string | null) => {
  useEffect(() => {
    if (!userId) return;

    const userStatusRef = ref(realtimeDb, `/status/${userId}`);
    
    // Set user as online
    const setOnline = async () => {
      await set(userStatusRef, {
        state: 'online',
        last_changed: serverTimestamp(),
      });

      // Set up disconnect hook to mark as offline
      onDisconnect(userStatusRef).set({
        state: 'offline',
        last_changed: serverTimestamp(),
      });
    };

    setOnline();

    // Clean up on unmount
    return () => {
      set(userStatusRef, {
        state: 'offline',
        last_changed: serverTimestamp(),
      });
    };
  }, [userId]);
};

export const listenToPresence = (
  userId: string,
  callback: (status: { state: string; last_changed: number }) => void
) => {
  const userStatusRef = ref(realtimeDb, `/status/${userId}`);
  
  return onValue(userStatusRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  });
};
