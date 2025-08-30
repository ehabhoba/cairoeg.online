
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, findUserByPhone, addUser, initializeUsers } from '../data/userData';
import { initializeBlog } from '../data/blogData';
import { initializeClientData, addProject, addInvoice } from '../data/clientData';
import { initializeRequests } from '../data/requestsData';
import { initializeNotifications } from '../data/notificationsData';

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
    // Initialize all mock DBs on first load
    initializeUsers();
    initializeBlog();
    initializeClientData();
    initializeRequests();
    initializeNotifications();
    
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
        password, 
        role, 
        bio: 'مساهم جديد في منصة إعلانات القاهرة.',
        companyName: '',
        websiteUrl: '',
        logoUrl: '',
    };
    await addUser(newUser);

    // Create a welcome project and invoice for the new client
    const welcomeProject = {
        id: `PROJ-${Date.now()}`,
        clientPhone: phone,
        name: 'مشروع ترحيبي: إعداد الحساب',
        status: 'مكتمل' as const,
        startDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week later
    };
    await addProject(welcomeProject);

    const initialInvoice = {
        id: `INV-${Date.now()}`,
        clientPhone: phone,
        issueDate: new Date().toISOString().split('T')[0],
        amount: 500,
        status: 'غير مدفوعة' as const,
        items: [{ description: 'رسوم إعداد الحساب المبدئية', amount: 500 }]
    };
    await addInvoice(initialInvoice);

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
