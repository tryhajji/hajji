import React, { createContext, useContext, useState, useEffect } from "react";
import { Models } from 'appwrite';
import { getCurrentUser, getUserRole, createUser } from "../appwrite";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

export type UserRole = 'admin' | 'agency' | 'umrah_group' | 'client';

export interface AppUser extends Models.User<Models.Preferences> {
  firstName: string;
  lastName: string;
  email: string;
  role?: UserRole;
}

interface AppContext {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  user: AppUser | null;
  userRole: UserRole | null;
  handleSignIn: (user: AppUser) => Promise<void>;
  handleSignOut: () => void;
  register: (userData: { 
    email: string;
    password: string;
    role: UserRole;
    [key: string]: any;
  }) => Promise<void>;
}

const AppContext = createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setIsLoggedIn(true);
          setUser(currentUser as AppUser);
          const role = await getUserRole();
          setUserRole(role as UserRole);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };
    checkAuth();
  }, []);

  const handleSignIn = async (user: AppUser) => {
    setIsLoggedIn(true);
    setUser(user);
    const role = await getUserRole();
    setUserRole(role as UserRole);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUser(null);
    setUserRole(null);
  };

  const register = async (userData: { 
    email: string;
    password: string;
    role: UserRole;
    [key: string]: any;
  }) => {
    try {
      const newUser = await createUser(userData);
      await handleSignIn(newUser as AppUser);
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
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

export default AppContext;