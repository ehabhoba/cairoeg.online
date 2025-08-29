import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, findUserByPhone, addUser, initializeUsers } from '../data/userData';
import { initializeBlog } from '../data/blogData';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, phone: string, password: string, role: 'client') => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize the mock DBs on first load
    initializeUsers();
    initializeBlog();
    
    // Check for an active session
    const sessionUser = sessionStorage.getItem('currentUser');
    if (sessionUser) {
      setCurrentUser(JSON.parse(sessionUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (phone: string, password: string) => {
    const user = await findUserByPhone(phone);
    if (!user) {
      throw new Error('رقم الهاتف غير مسجل.');
    }
    if (user.password !== password) {
      throw new Error('كلمة المرور غير صحيحة.');
    }
    setCurrentUser(user);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
    // The App component will handle navigation
  }, []);

  const register = useCallback(async (name: string, phone: string, password: string, role: 'client') => {
    const existingUser = await findUserByPhone(phone);
    if (existingUser) {
      throw new Error('هذا الرقم مسجل بالفعل.');
    }
    const newUser: User = { name, phone, password, role, bio: 'مساهم جديد في منصة إعلانات القاهرة.' };
    await addUser(newUser);
  }, []);
  
  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};