import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

export default app;
