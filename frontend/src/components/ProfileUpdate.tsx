import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const updateProfile = async (data: { firstName: string; lastName: string }) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    
    await updateDoc(doc(db, 'users', user.uid), {
      firstName: data.firstName,
      lastName: data.lastName
    });
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
}; 