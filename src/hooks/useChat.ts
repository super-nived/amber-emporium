import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  setDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Timestamp;
  seen: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  productId: string;
  lastMessage: string;
  lastUpdated: Timestamp;
  providerName?: string;
  userName?: string;
}

export const useChat = (chatId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId) {
      setLoading(false);
      return;
    }

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  return { messages, loading };
};

export const sendMessage = async (
  chatId: string,
  senderId: string,
  receiverId: string,
  message: string
) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  
  await addDoc(messagesRef, {
    senderId,
    receiverId,
    message,
    timestamp: serverTimestamp(),
    seen: false,
  });

  // Update chat's last message
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    lastMessage: message,
    lastUpdated: serverTimestamp(),
  });
};

export const markMessagesAsSeen = async (chatId: string, userId: string) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(
    messagesRef,
    where('receiverId', '==', userId),
    where('seen', '==', false)
  );

  const snapshot = await getDocs(q);
  const updatePromises = snapshot.docs.map((messageDoc) =>
    updateDoc(doc(db, 'chats', chatId, 'messages', messageDoc.id), {
      seen: true,
    })
  );

  await Promise.all(updatePromises);
};

export const getOrCreateChat = async (
  userId: string,
  providerId: string,
  productId: string,
  providerName: string,
  userName: string
): Promise<string> => {
  const chatsRef = collection(db, 'chats');
  
  // Check if chat already exists
  const q = query(
    chatsRef,
    where('participants', 'array-contains', userId)
  );
  
  const snapshot = await getDocs(q);
  const existingChat = snapshot.docs.find((doc) => {
    const data = doc.data();
    return (
      data.participants.includes(providerId) &&
      data.productId === productId
    );
  });

  if (existingChat) {
    return existingChat.id;
  }

  // Create new chat
  const newChatRef = doc(chatsRef);
  await setDoc(newChatRef, {
    participants: [userId, providerId],
    productId,
    lastMessage: '',
    lastUpdated: serverTimestamp(),
    providerName,
    userName,
  });

  return newChatRef.id;
};

export const getUserChats = (userId: string, callback: (chats: Chat[]) => void) => {
  const chatsRef = collection(db, 'chats');
  const q = query(
    chatsRef,
    where('participants', 'array-contains', userId),
    orderBy('lastUpdated', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const chats: Chat[] = [];
    snapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() } as Chat);
    });
    callback(chats);
  });
};

export const getUnreadCount = async (chatId: string, userId: string): Promise<number> => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(
    messagesRef,
    where('receiverId', '==', userId),
    where('seen', '==', false)
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
};
