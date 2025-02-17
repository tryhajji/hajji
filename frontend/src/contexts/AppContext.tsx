import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import type { UserData } from '../firebase';

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

export type UserRole = 'user' | 'admin' | 'agency' | 'umrah_group';

interface AppContextType {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  user: UserData | null;
  userRole: UserRole | null;
  handleSignIn: (userData: UserData) => void;
  handleSignOut: () => void;
  register: (userData: { 
    uid: string;
    email: string;
    password: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    [key: string]: any;
  }) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserData;
          setUser(userData);
          setIsLoggedIn(true);
          const role = userData?.role as UserRole;
          setUserRole(role);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = (userData: UserData) => {
    setUser(userData);
    setIsLoggedIn(true);
    const role = userData?.role as UserRole;
    setUserRole(role);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setIsLoggedIn(false);
      setUserRole(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const register = async (userData: { 
    uid: string;
    email: string;
    password: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    [key: string]: any;
  }) => {
    try {
      const userDataFormatted: UserData = {
        uid: userData.uid || '',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role
      };
      await handleSignIn(userDataFormatted);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn,
        user,
        userRole,
        handleSignIn,
        handleSignOut,
        register,
      }}
    >
      {toast && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4">
          <div className={`text-${toast.type === "SUCCESS" ? "green" : "red"}-600`}>
            {toast.message}
          </div>
          <button
            onClick={() => setToast(undefined)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

export default AppContext;
