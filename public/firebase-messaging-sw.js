importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDjW5LMG3deMsfjcen8FGcWulb4-2Lubn8",
  authDomain: "food-2ce3f.firebaseapp.com",
  projectId: "food-2ce3f",
  storageBucket: "food-2ce3f.appspot.com",
  messagingSenderId: "752616868298",
  appId: "1:752616868298:web:cbaee7b5ed6b0881112733"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
