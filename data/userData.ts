

import { supabase } from '../services/supabaseClient';

export interface User {
    id: string; 
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'client';
    bio: string;
    has_completed_onboarding: boolean;
    companyName?: string;
    websiteUrl?: string;
    logoUrl?: string;
    facebookUrl?: string;
    instagramHandle?: string;
}

export interface BusinessProfile {
    user_id: string;
    company_name?: string;
    page_link?: string;
    logo_url?: string;
    facebook_url?: string;
    instagram_handle?: string;
}

// FIX: Export mapUserFromDb to be used in other modules.
export const mapUserFromDb = (dbUser: any): User => {
    const profile = dbUser.business_profiles && dbUser.business_profiles[0] ? dbUser.business_profiles[0] : {};
    return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone_number,
        role: dbUser.role,
        bio: dbUser.bio || 'مساهم جديد في منصة إعلانات القاهرة.',
        has_completed_onboarding: dbUser.has_completed_onboarding,
        companyName: profile.company_name,
        websiteUrl: profile.page_link,
        logoUrl: profile.logo_url,
        facebookUrl: profile.facebook_url,
        instagramHandle: profile.instagram_handle,
    };
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase.from('users').select('*, business_profiles(*)').eq('id', userId).single();
    if (error || !data) {
        console.error("Error fetching user profile:", error);
        return null;
    }
    return mapUserFromDb(data);
};

export const createPublicUserProfile = async (profileData: {id: string, name: string, email: string, phone_number: string, role: 'client' | 'admin', has_completed_onboarding: boolean}) => {
    const { error } = await supabase.from('users').insert(profileData);
    if (error) console.error("Error creating public user profile:", error);
};

export const createBusinessProfile = async (userId: string) => {
    const { error } = await supabase.from('business_profiles').insert({ user_id: userId });
    if (error) console.error("Error creating business profile for new user:", error);
};

export const findUserByPhone = async (phone: string): Promise<User | null> => {
    const { data, error } = await supabase.from('users').select('*, business_profiles(*)').eq('phone_number', phone).single();
    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is not an error here
        console.error('Error finding user by phone:', error);
        return null;
    }
    if (!data) return null;
    return mapUserFromDb(data);
};

export const findUserById = async (id: string): Promise<User | null> => getUserProfile(id);

export const findAdmin = async (): Promise<User | null> => {
    const { data, error } = await supabase.from('users').select('*, business_profiles(*)').eq('role', 'admin').limit(1).single();
    if (error && error.code !== 'PGRST116') { console.error('Error finding admin user:', error); return null; }
    if (!data) return null;
    return mapUserFromDb(data);
};

export const getAllClients = async (): Promise<User[]> => {
    const { data, error } = await supabase.from('users').select('*, business_profiles(*)').eq('role', 'client');
    if (error) { console.error('Error fetching clients:', error); return []; }
    return data.map(mapUserFromDb);
};

export const getBusinessProfile = async (userId: string): Promise<BusinessProfile | null> => {
    const { data, error } = await supabase.from('business_profiles').select('*').eq('user_id', userId).single();
    if (error && error.code !== 'PGRST116') console.error('Error getting business profile:', error);
    return data;
};

export const updateBusinessProfile = async (userId: string, profileData: Partial<BusinessProfile>): Promise<void> => {
    const { error } = await supabase.from('business_profiles').upsert({ user_id: userId, ...profileData }, { onConflict: 'user_id' });
    if (error) { console.error("Error updating business profile:", error); throw new Error("فشل في تحديث ملف الأعمال."); }
};

export const updateUser = async (userId: string, userData: Partial<Pick<User, 'name' | 'bio'>>): Promise<void> => {
    const { error } = await supabase.from('users').update(userData).eq('id', userId);
    if (error) { console.error('Error updating user profile:', error); throw new Error('فشل تحديث بيانات المستخدم.'); }
}

export const markOnboardingComplete = async (userId: string): Promise<void> => {
    const { error } = await supabase.from('users').update({ has_completed_onboarding: true }).eq('id', userId);
    if (error) { console.error('Error marking onboarding complete:', error); throw new Error('فشل في تحديث حالة الإعداد.'); }
};

export const adminUpdateUserPassword = async (userId: string, newPassword: string): Promise<void> => {
    // This function MUST be implemented as a secure Supabase Edge Function.
    // Calling `supabase.auth.admin.updateUserById` from the client-side is a major security vulnerability
    // as it would expose the service_role key. The correct approach is to create an Edge Function
    // that takes the userId and newPassword, and uses the Supabase Admin client internally to perform the update.
    
    console.error("SECURITY WARNING: Attempted to call an admin-only function from the client.");
    throw new Error("فشل تحديث كلمة المرور. هذه الميزة تتطلب إعدادًا آمنًا في الخلفية (Edge Function) لا يمكن تنفيذه من المتصفح مباشرةً.");
};