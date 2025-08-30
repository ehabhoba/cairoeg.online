import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, findUserByPhone, addUser } from '../data/userData';

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
    // This is an insecure password check. A real app should use Supabase Auth.
    if (user.password !== password) {
      throw new Error('كلمة المرور غير صحيحة.');
    }
    setCurrentUser(user);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
    // The App component will handle navigation to login
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new Event('popstate'));
  }, []);

  const register = useCallback(async (name: string, phone: string, password: string, role: 'client') => {
    const existingUser = await findUserByPhone(phone);
    if (existingUser) {
      throw new Error('هذا الرقم مسجل بالفعل.');
    }
    const newUser: User = { 
        name, 
        phone, 
        password, // Storing plain text password is insecure
        role, 
        bio: 'مساهم جديد في منصة إعلانات القاهرة.',
    };
    await addUser(newUser);
    // Note: No need to create welcome projects/invoices here,
    // as the admin can now do this from the client details page.
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
