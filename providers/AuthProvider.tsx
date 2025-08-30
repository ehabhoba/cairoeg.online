
import React, { createContext, useState, useEffect, useCallback, ReactNode, Dispatch, SetStateAction } from 'react';
import { supabase } from '../services/supabaseClient';
import { User, getUserProfile, createPublicUserProfile, findAdmin, createBusinessProfile } from '../data/userData';
import type { Session } from '@supabase/supabase-js';
import { useNotification } from '../hooks/useNotification';
import { useNavigate } from '../hooks/useNavigate';


interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, phone: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to create a unique, stable email from a phone number for Supabase Auth
// This allows users to use their phone number to log in, while we use a valid email format for Supabase Auth.
const createEmailFromPhone = (phone: string) => `${phone}@cairoeg.online`;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const addNotification = useNotification();
  const { navigate } = useNavigate();


  const handleSession = useCallback(async (session: Session | null) => {
    if (session?.user) {
        const profile = await getUserProfile(session.user.id);
        if (profile) {
            setCurrentUser({ ...profile, id: session.user.id });
             if (window.location.pathname.includes('/login') || window.location.pathname.includes('/register')) {
                navigate(profile.role === 'admin' ? '/dashboard/overview' : '/client/dashboard');
             }
        } else {
            console.warn(`No public profile found for user ${session.user.id}. Logging out.`);
            await supabase.auth.signOut();
            setCurrentUser(null);
        }
    } else {
        setCurrentUser(null);
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        await handleSession(session);
    };
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => { await handleSession(session); }
    );
    return () => { subscription?.unsubscribe(); };
  }, [handleSession]);

  const login = useCallback(async (phone: string, password: string) => {
    // Special hardcoded admin login
    if (phone === '01022679250' && password === 'P@ssw0rd') {
        const adminProfile = await findAdmin();
        if(adminProfile) {
            setCurrentUser(adminProfile);
            addNotification('مرحباً أيها المدير!', 'تم تسجيل الدخول بنجاح.', 'success');
            navigate('/dashboard/overview');
            return;
        } else {
            throw new Error("ملف المدير غير موجود في قاعدة البيانات.");
        }
    }

    // Regular client login
    const email = createEmailFromPhone(phone);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        if(error.message.includes('Invalid login credentials')) {
             throw new Error("رقم الهاتف أو كلمة المرور غير صحيحة.");
        }
        throw new Error(error.message);
    }
    // Session change will be handled by onAuthStateChange
  }, [navigate, addNotification]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    navigate('/login');
  }, [navigate]);

  const register = useCallback(async (name: string, phone: string, password: string) => {
    const email = createEmailFromPhone(phone);
    
    const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('phone_number', phone)
        .single();
        
    if (existingUser) {
        throw new Error("هذا الرقم مسجل بالفعل.");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
        if (error.message.includes("User already registered")) {
            throw new Error("هذا الرقم مسجل بالفعل.");
        }
        throw new Error(error.message);
    }
    if (data.user) {
        await createPublicUserProfile({
            id: data.user.id, name, email,
            phone_number: phone, role: 'client',
            has_completed_onboarding: false,
        });
        // Also create an empty business profile for them
        await createBusinessProfile(data.user.id);
        
        addNotification('نجاح!', 'تم إنشاء حسابك. سيتم توجيهك لتسجيل الدخول.', 'success', 5000);
        setTimeout(() => { navigate('/login'); }, 3000);

    } else {
        throw new Error("فشل في إنشاء المستخدم. يرجى المحاولة مرة أخرى.");
    }
  }, [addNotification, navigate]);
  
  const value = {
    currentUser, setCurrentUser, loading,
    login, logout, register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
