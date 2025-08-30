
import { supabase } from '../services/supabaseClient';

export interface User {
    id: string; 
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'client';
    bio: string;
    // Business profile data might be joined or fetched separately
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

// ---- Profile Management ---- //
export const getUserProfile = async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error || !data) {
        console.error("Error fetching user profile:", error);
        return null;
    }

    return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone_number,
        role: data.role,
        bio: data.bio || 'مساهم جديد في منصة إعلانات القاهرة.'
    };
};

export const createPublicUserProfile = async (profileData: {id: string, name: string, email: string, phone_number: string, role: 'client' | 'admin'}) => {
    const { error } = await supabase.from('users').insert(profileData);
    if (error) {
        console.error("Error creating public user profile:", error);
    }
};

export const findUserByPhone = async (phone: string): Promise<User | null> => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone_number', phone)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
        console.error('Error finding user by phone:', error);
        return null;
    }
    
    if (!data) return null;

    return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone_number,
        role: data.role,
        bio: data.bio || ''
    };
};

export const findUserById = async (id: string): Promise<User | null> => {
    return getUserProfile(id);
}

export const findAdmin = async (): Promise<User | null> => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'admin')
        .limit(1)
        .single();
    
    if (error && error.code !== 'PGRST116') {
        console.error('Error finding admin user:', error);
        return null;
    }

    if (!data) return null;
    return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone_number,
        role: data.role,
        bio: data.bio || ''
    };
};

export const getAllClients = async (): Promise<User[]> => {
    const { data, error } = await supabase
        .from('users')
        .select('*, business_profiles(*)')
        .eq('role', 'client');

    if (error) {
        console.error('Error fetching clients:', error);
        return [];
    }
    
    return data.map(d => ({
        id: d.id,
        name: d.name,
        email: d.email,
        phone: d.phone_number,
        role: 'client',
        bio: d.bio || '',
        companyName: d.business_profiles[0]?.company_name,
        websiteUrl: d.business_profiles[0]?.page_link,
        logoUrl: d.business_profiles[0]?.logo_url,
    }));
};

// ---- Business Profile Management ---- //
export const getBusinessProfile = async (userId: string): Promise<BusinessProfile | null> => {
    const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
    
    if (error && error.code !== 'PGRST116') {
        console.error('Error getting business profile:', error);
    }
    return data;
};

export const updateBusinessProfile = async (userId: string, profileData: Partial<BusinessProfile>): Promise<void> => {
    const { error } = await supabase
        .from('business_profiles')
        .upsert({ user_id: userId, ...profileData }, { onConflict: 'user_id' });
    
    if (error) {
        console.error("Error updating business profile:", error);
        throw new Error("فشل في تحديث ملف الأعمال.");
    }
};

export const updateUser = async (userId: string, userData: Partial<Pick<User, 'name' | 'bio'>>): Promise<void> => {
    const { error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', userId);
    
    if (error) {
        console.error('Error updating user profile:', error);
        throw new Error('فشل تحديث بيانات المستخدم.');
    }
}
