import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

// Master invite code - can be used unlimited times
export const MASTER_INVITE_CODE = 'AMBER2024MASTER';

// Initialize master invite code in Firestore
export const initializeMasterInviteCode = async () => {
  try {
    const masterDoc = await getDoc(doc(db, 'inviteCodes', MASTER_INVITE_CODE));
    
    if (!masterDoc.exists()) {
      await setDoc(doc(db, 'inviteCodes', MASTER_INVITE_CODE), {
        code: MASTER_INVITE_CODE,
        usedCount: 0,
        maxUses: -1, // -1 means unlimited uses
        createdAt: new Date(),
        isMaster: true
      });
      console.log('Master invite code initialized');
    }
  } catch (error) {
    console.error('Error initializing master invite code:', error);
  }
};

// Generate a new invite code
export const generateInviteCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Create a new invite code in Firestore
export const createInviteCode = async (): Promise<string> => {
  const code = generateInviteCode();
  
  try {
    await setDoc(doc(db, 'inviteCodes', code), {
      code: code,
      usedCount: 0,
      maxUses: 2, // Regular codes can only be used twice
      createdAt: new Date(),
      isMaster: false
    });
    
    return code;
  } catch (error) {
    console.error('Error creating invite code:', error);
    throw error;
  }
};
