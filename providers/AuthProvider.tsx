
import React, { createContext, useState, useEffect, useCallback, ReactNode, Dispatch, SetStateAction } from 'react';
import { supabase } from '../services/supabaseClient';
import { User, getUserProfile, createPublicUserProfile, findAdmin } from '../data/userData';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, phone: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

// Helper to create a unique, stable email from a phone number for Supabase Auth
const createEmailFromPhone = (phone: string) => `${phone}@cairoeg.online`;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSession = useCallback(async (session: Session | null) => {
    if (session?.user) {
        const profile = await getUserProfile(session.user.id);
        if (profile) {
            setCurrentUser({ ...profile, id: session.user.id });
        } else {
            console.warn(`No public profile found for user ${session.user.id}.`);
            setCurrentUser(null);
        }
    } else {
        setCurrentUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await handleSession(session);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await handleSession(session);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [handleSession]);

  const login = useCallback(async (phone: string, password: string) => {
    // Special hardcoded admin login
    if (phone === '01022679250' && password === 'P@ssw0rd') {
        const adminProfile = await findAdmin();
        if(adminProfile) {
            // This is a mock session for the frontend only.
            // A real implementation would involve a secure server-side session.
            setCurrentUser(adminProfile);
            return;
        } else {
            throw new Error("ملف المدير غير موجود في قاعدة البيانات.");
        }
    }

    // Regular client login
    const email = createEmailFromPhone(phone);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error("رقم الهاتف أو كلمة المرور غير صحيحة.");
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    // Force a reload to clear all state, handled by navigation provider
    window.location.href = '/login';
  }, []);

  const register = useCallback(async (name: string, phone: string, password: string) => {
    const email = createEmailFromPhone(phone);
    
    const { data: existingUser, error: fetchError } = await supabase
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
            id: data.user.id,
            name,
            email: email, // Store the generated email
            phone_number: phone,
            role: 'client',
            has_completed_onboarding: false,
        });
    } else {
        throw new Error("فشل في إنشاء المستخدم. يرجى المحاولة مرة أخرى.");
    }
  }, []);
  
  const value = {
    currentUser,
    setCurrentUser,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
