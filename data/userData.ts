
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

export const getUserProfile = async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase.from('users').select('*, business_profiles(*)').eq('id', userId).single();
    if (error || !data) {
        console.error("Error fetching user profile:", error);
        return null;
    }
    const profile = data.business_profiles && data.business_profiles[0] ? data.business_profiles[0] : {};
    return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone_number,
        role: data.role,
        bio: data.bio || 'مساهم جديد في منصة إعلانات القاهرة.',
        has_completed_onboarding: data.has_completed_onboarding,
        companyName: profile.company_name,
        websiteUrl: profile.page_link,
        logoUrl: profile.logo_url,
        facebookUrl: profile.facebook_url,
        instagramHandle: profile.instagram_handle,
    };
};

export const createPublicUserProfile = async (profileData: {id: string, name: string, email: string, phone_number: string, role: 'client' | 'admin', has_completed_onboarding: boolean}) => {
    const { error } = await supabase.from('users').insert(profileData);
    if (error) console.error("Error creating public user profile:", error);
};

export const findUserByPhone = async (phone: string): Promise<User | null> => {
    const { data, error } = await supabase.from('users').select('*, business_profiles(*)').eq('phone_number', phone).single();
    if (error && error.code !== 'PGRST116') {
        console.error('Error finding user by phone:', error);
        return null;
    }
    if (!data) return null;
    const profile = data.business_profiles && data.business_profiles[0] ? data.business_profiles[0] : {};
    return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone_number,
        role: data.role,
        bio: data.bio || '',
        has_completed_onboarding: data.has_completed_onboarding || false,
        companyName: profile.company_name,
        websiteUrl: profile.page_link,
        logoUrl: profile.logo_url,
        facebookUrl: profile.facebook_url,
        instagramHandle: profile.instagram_handle,
    };
};

export const findUserById = async (id: string): Promise<User | null> => getUserProfile(id);

export const findAdmin = async (): Promise<User | null> => {
    const { data, error } = await supabase.from('users').select('*').eq('role', 'admin').limit(1).single();
    if (error && error.code !== 'PGRST116') { console.error('Error finding admin user:', error); return null; }
    if (!data) return null;
    return {
        id: data.id, name: data.name, email: data.email, phone: data.phone_number,
        role: data.role, bio: data.bio || '', has_completed_onboarding: data.has_completed_onboarding || false,
    };
};

export const getAllClients = async (): Promise<User[]> => {
    const { data, error } = await supabase.from('users').select('*, business_profiles(*)').eq('role', 'client');
    if (error) { console.error('Error fetching clients:', error); return []; }
    return data.map(d => ({
        id: d.id, name: d.name, email: d.email, phone: d.phone_number, role: 'client',
        bio: d.bio || '', has_completed_onboarding: d.has_completed_onboarding,
        companyName: d.business_profiles[0]?.company_name, websiteUrl: d.business_profiles[0]?.page_link,
        logoUrl: d.business_profiles[0]?.logo_url,
    }));
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

// This function needs to be created as a Supabase Edge Function with 'admin' privileges
// to be able to modify other users' authentication data.
export const adminUpdateUserPassword = async (userId: string, newPassword: string): Promise<void> => {
    // IMPORTANT: This is a placeholder for a secure call to a Supabase Edge Function.
    // Direct user updates from the client are a major security risk.
    // You must create a function in Supabase `functions/update-user-password/index.ts`
    // that uses the admin client to perform this action.
    
    console.warn("Invoking a placeholder for a secure Edge Function. Implement the backend function for production.");
    
    // Example of invoking an edge function:
    /*
    const { error } = await supabase.functions.invoke('update-user-password', {
        body: { userId, newPassword },
    });
    if (error) {
        throw new Error('فشل تحديث كلمة المرور. تحقق من صلاحيات المدير.');
    }
    */
   
    // For demonstration purposes only, this will fail without the edge function
     const { data, error } = await supabase.auth.admin.updateUserById(
       userId,
       { password: newPassword }
     )
    if(error) {
        console.error("Password change failed. This is expected without a secure Edge Function.", error);
        throw new Error("فشل تحديث كلمة المرور. هذه الميزة تتطلب إعدادات خلفية آمنة.");
    }

};
