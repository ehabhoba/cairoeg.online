import { supabase } from '../services/supabaseClient';

export interface User {
    id?: string; // Add ID for internal use
    name: string;
    phone: string;
    password?: string; // Password should not be stored/retrieved directly in production
    role: 'admin' | 'client';
    bio: string;
    companyName?: string;
    websiteUrl?: string;
    logoUrl?: string;
}

// NOTE: A real app should use Supabase Auth (supabase.auth.signUp/signIn) which handles password securely.
// For this exercise, we'll simulate by storing a plain text password, which is NOT secure.
// We'll also assume a `password` column exists in the `users` table.

const fromSupabase = (data: any): User | null => {
    if (!data) return null;
    return {
        id: data.id,
        name: data.name,
        phone: data.phone_number,
        password: data.password, // Assumes password column exists
        role: data.role,
        bio: data.bio || '', // Assume bio might be null
        companyName: data.company_name || '',
        websiteUrl: data.page_link || '',
        logoUrl: data.logo_url || ''
    };
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
    
    return fromSupabase(data);
};

export const findUserById = async (id: string): Promise<User | null> => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
        
    if (error && error.code !== 'PGRST116') {
        console.error('Error finding user by ID:', error);
        return null;
    }
    
    return fromSupabase(data);
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

    return fromSupabase(data);
};


export const addUser = async (newUser: User): Promise<void> => {
    // Map User type to database columns
    const { data, error } = await supabase
        .from('users')
        .insert([{ 
            name: newUser.name,
            phone_number: newUser.phone,
            password: newUser.password,
            role: newUser.role,
            bio: newUser.bio,
        }]);

    if (error) {
        console.error('Error adding user:', error);
        throw new Error('فشل في إنشاء مستخدم جديد.');
    }
};

export const updateUser = async (updatedUser: User): Promise<void> => {
    const { data, error } = await supabase
        .from('users')
        .update({
            name: updatedUser.name,
            bio: updatedUser.bio,
            company_name: updatedUser.companyName,
            page_link: updatedUser.websiteUrl,
            logo_url: updatedUser.logoUrl
        })
        .eq('phone_number', updatedUser.phone);

    if (error) {
        console.error('Error updating user:', error);
        throw new Error('فشل تحديث بيانات المستخدم.');
    }
};

export const getAllClients = async (): Promise<User[]> => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'client');

    if (error) {
        console.error('Error fetching clients:', error);
        return [];
    }

    return data.map(d => fromSupabase(d)).filter((u): u is User => u !== null);
};