import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { MASTER_INVITE_CODE } from '@/lib/inviteCodes';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, inviteCode: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Convert username to email format for Firebase Auth
      const email = `${username}@amberemporium.local`;
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error('Invalid username or password');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many failed attempts. Please try again later.');
      } else {
        toast.error('Login failed. Please try again.');
      }
      throw error;
    }
  };

  const signup = async (username: string, password: string, inviteCode: string) => {
    try {
      // Validate invite code
      const inviteDoc = await getDoc(doc(db, 'inviteCodes', inviteCode));
      
      if (!inviteDoc.exists()) {
        toast.error('Invalid invite code');
        throw new Error('Invalid invite code');
      }

      const inviteData = inviteDoc.data();
      
      // Check if invite code is expired (used by 2 users, except master code)
      if (!inviteData.isMaster && inviteData.usedCount >= 2) {
        toast.error('This invite code has expired');
        throw new Error('Invite code expired');
      }

      // Check if username already exists
      const userDoc = await getDoc(doc(db, 'users', username));
      if (userDoc.exists()) {
        toast.error('Username already exists');
        throw new Error('Username already exists');
      }

      // Convert username to email format for Firebase Auth
      const email = `${username}@amberemporium.local`;
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, 'users', username), {
        uid: user.uid,
        username: username,
        email: email,
        createdAt: new Date(),
        inviteCode: inviteCode
      });

      // Update invite code usage count (only for non-master codes)
      if (!inviteData.isMaster) {
        await updateDoc(doc(db, 'inviteCodes', inviteCode), {
          usedCount: increment(1),
          lastUsed: new Date()
        });
      }

      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.code === 'auth/weak-password') {
        toast.error('Password should be at least 6 characters');
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('Username already exists');
      } else {
        toast.error('Signup failed. Please try again.');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
