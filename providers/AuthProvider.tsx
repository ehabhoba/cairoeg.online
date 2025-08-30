
import React, { createContext, useState, useEffect, useCallback, ReactNode, Dispatch, SetStateAction } from 'react';
import { supabase } from '../services/supabaseClient';
import { User, getUserProfile, createPublicUserProfile } from '../data/userData';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

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
    
    // v2: Check active session on initial load
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await handleSession(session);
    };

    checkSession();

    // v2: Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await handleSession(session);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [handleSession]);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new Event('popstate'));
  }, []);

  const register = useCallback(async (name: string, email: string, phone: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone_number: phone,
        }
      }
    });
    if (error) {
        if (error.message.includes("User already registered")) {
            throw new Error("هذا البريد الإلكتروني مسجل بالفعل.");
        }
        throw new Error(error.message);
    }
    if (data.user) {
        await createPublicUserProfile({
            id: data.user.id,
            name,
            email,
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
