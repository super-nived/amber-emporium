# Firebase Real-time Chat Setup Guide

This document explains how to set up the real-time chat system with Firebase.

## 🔧 What's Been Implemented

✅ **Firestore Database** - Real-time chat messages and conversations
✅ **Realtime Database** - Online presence tracking
✅ **Push Notifications** - FCM integration (needs VAPID key)
✅ **Security Rules** - Firestore and Realtime Database rules
✅ **React Hooks** - `useChat` and `usePresence` for easy integration
✅ **UI Components** - Chat interface with online status indicators
✅ **Message Read Receipts** - Double checkmarks for read messages

## 📋 Setup Steps

### 1. Deploy Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `food-2ce3f`
3. Navigate to **Firestore Database** → **Rules**
4. Copy contents from `firestore.rules` and paste them
5. Click **Publish**

### 2. Deploy Realtime Database Rules

1. In Firebase Console, go to **Realtime Database** → **Rules**
2. Copy contents from `database.rules.json` and paste them
3. Click **Publish**

### 3. Enable Push Notifications (Optional but Recommended)

1. In Firebase Console, go to **Project Settings** → **Cloud Messaging**
2. Under **Web Push certificates**, click **Generate key pair**
3. Copy the VAPID key
4. In `src/lib/firebase.ts`, replace `'YOUR_VAPID_KEY'` with your actual VAPID key (line 29)

### 4. Create Firestore Indexes (If Needed)

If you see index errors in the console, Firebase will provide a direct link to create them automatically.

Common indexes needed:
- Collection: `chats`, Fields: `participants` (Array), `lastUpdated` (Descending)

## 🎯 How It Works

### Chat Flow

1. **User clicks "Chat with Provider"** on a product page
2. System checks if a chat already exists between user and provider for that product
3. If not, creates a new chat document with both participants
4. Opens real-time chat interface
5. Messages sync instantly via Firestore listeners
6. Read receipts update automatically

### Presence System

1. When a user logs in, their status is set to `online` in Realtime Database
2. Firebase automatically sets them to `offline` when they disconnect
3. Product pages show green "Active" indicator for online providers
4. Chat interface shows when provider was last active

### Push Notifications

1. When a message is sent, a Cloud Function should trigger
2. Function reads receiver's FCM token from `users` collection
3. Sends push notification to their device
4. User can tap notification to open the chat

## 🔐 Security Features

- **RLS on Chats**: Only chat participants can read/write messages
- **Sender Validation**: Messages can only be sent by authenticated users
- **Read Receipt Security**: Only the receiver can mark messages as seen
- **Presence Privacy**: Users can only update their own status

## 📱 User Experience Features

- ✅ Real-time message delivery
- ✅ Online/offline status indicators
- ✅ "Active now" vs "Active 5m ago" timestamps
- ✅ Message read receipts (✓ sent, ✓✓ read)
- ✅ Unread message counter in footer
- ✅ Chat list sorted by most recent activity
- ✅ Smooth animations and transitions

## 🚀 Next Steps (Optional Enhancements)

### Cloud Function for Push Notifications

You'll need to create a Cloud Function that triggers when new messages are added:

\`\`\`javascript
exports.sendChatNotification = functions.firestore
  .document('chats/{chatId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    const message = snap.data();
    const receiverId = message.receiverId;
    
    // Get receiver's FCM token from users collection
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(receiverId)
      .get();
    
    const fcmToken = userDoc.data()?.fcmToken;
    
    if (fcmToken) {
      await admin.messaging().send({
        token: fcmToken,
        notification: {
          title: 'New message',
          body: message.message,
        },
      });
    }
  });
\`\`\`

### Store User FCM Tokens

When users grant notification permission, store their token:

\`\`\`typescript
const token = await requestNotificationPermission();
if (token) {
  await setDoc(doc(db, 'users', user.uid), {
    fcmToken: token
  }, { merge: true });
}
\`\`\`

## 🔍 Testing

1. **Test Chat Creation**: Click "Chat with Provider" on any product
2. **Test Real-time Sync**: Open same chat in two different browsers
3. **Test Presence**: Log in/out and watch status change
4. **Test Read Receipts**: Send messages and mark them as read
5. **Test Notifications**: Enable notifications and send a test message

## 📚 Code Structure

- `src/hooks/useChat.ts` - Chat operations and listeners
- `src/hooks/usePresence.ts` - Online presence tracking
- `src/components/RealtimeChatBox.tsx` - Chat UI component
- `src/pages/Chats.tsx` - Chat list page
- `src/lib/firebase.ts` - Firebase initialization and helpers
- `firestore.rules` - Firestore security rules
- `database.rules.json` - Realtime Database security rules

## 🆘 Troubleshooting

**Messages not syncing?**
- Check Firestore rules are deployed
- Verify user is authenticated
- Check browser console for errors

**Presence not working?**
- Ensure Realtime Database is enabled in Firebase Console
- Check database rules are deployed
- Verify network connection

**Notifications not working?**
- Check VAPID key is set correctly
- Verify notification permission is granted
- Ensure service worker is registered
- Check Cloud Function is deployed

## 📝 Notes

- The current implementation uses the product owner as the "provider" for demo purposes
- In production, you should have a proper user roles system
- Consider implementing message encryption for sensitive data
- Add rate limiting to prevent spam
- Implement typing indicators for better UX
