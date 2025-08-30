

import { supabase } from '../services/supabaseClient';
import { findUserByPhone } from './userData';

export interface Ad {
    id: string;
    user_id: string;
    title: string;
    description: string;
    image_url: string;
    link_url: string;
    is_paid: boolean;
    status: 'pending' | 'active' | 'rejected';
}

export const getAdById = async (adId: string): Promise<Ad | null> => {
    const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('id', adId)
        .single();
    if (error) {
        console.error(`Error fetching ad by id ${adId}:`, error);
        return null;
    }
    return data;
}

export const getAllAds = async (): Promise<Ad[]> => {
    const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        console.error("Error fetching all ads:", error);
        return [];
    }
    return data;
};

export const getActiveAds = async (): Promise<Ad[]> => {
    const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
    if (error) {
        console.error("Error fetching active ads:", error);
        return [];
    }
    return data;
};

export const getPaidAd = async (): Promise<Ad | null> => {
    // 1. Try to get a random paid, active ad
    try {
        const { data: paidData, error: paidError } = await supabase
            .from('ads')
            .select('*')
            .eq('status', 'active')
            .eq('is_paid', true);

        if (paidError) throw paidError;

        if (paidData && paidData.length > 0) {
            return paidData[Math.floor(Math.random() * paidData.length)];
        }
    } catch (error: any) {
        console.error("Error fetching paid ads:", error);
        // Provide a more helpful message for the likely CORS issue
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            console.warn("This might be a CORS issue. Please ensure your app's URL is in the Supabase CORS settings.");
        }
    }

    // 2. Fallback: If no paid ads were found or if the first query failed
    try {
        const { data: anyData, error: anyError } = await supabase
            .from('ads')
            .select('*')
            .eq('status', 'active');

        if (anyError) throw anyError;

        if (anyData && anyData.length > 0) {
            return anyData[Math.floor(Math.random() * anyData.length)];
        }
    } catch (error: any) {
        console.error("Error fetching any active ad (fallback):", error);
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            console.warn("Fallback fetch failed. This also points to a potential CORS or network issue.");
        }
    }
    
    return null; // No active ads found at all
};

export const getClientAds = async (userId: string): Promise<Ad[]> => {
    const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching client ads:", error);
        return [];
    }
    return data;
};

// FIX: image_url is generated within this function, so it should be omitted from the adData type.
export const createAd = async (adData: Omit<Ad, 'id' | 'is_paid' | 'status' | 'image_url'>, adImage: File): Promise<void> => {
    const filePath = `public/ads/${adData.user_id}/${Date.now()}_${adImage.name}`;
    const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, adImage);

    if (uploadError) throw new Error('فشل رفع صورة الإعلان.');

    const { data: { publicUrl } } = supabase.storage.from('project-files').getPublicUrl(filePath);
        
    const { error: insertError } = await supabase.from('ads').insert({
        user_id: adData.user_id,
        title: adData.title,
        description: adData.description,
        image_url: publicUrl,
        link_url: adData.link_url,
        is_paid: false,
        status: 'pending',
    });

    if (insertError) {
        await supabase.storage.from('project-files').remove([filePath]);
        throw new Error('فشل في إنشاء الإعلان.');
    }
};

// FIX: image_url is generated within this function, so it should be omitted from the adData type.
export const createPaidAd = async (adData: Omit<Ad, 'id' | 'is_paid' | 'status' | 'user_id' | 'image_url'>, adImage: File): Promise<void> => {
    const admin = await findUserByPhone('01022679250');
    if (!admin) throw new Error('Admin user not found.');

    const filePath = `public/ads/admin/${Date.now()}_${adImage.name}`;
    const { error: uploadError } = await supabase.storage.from('project-files').upload(filePath, adImage);
    if (uploadError) throw new Error('فشل رفع صورة الإعلان.');

    const { data: { publicUrl } } = supabase.storage.from('project-files').getPublicUrl(filePath);

    const { error: insertError } = await supabase.from('ads').insert({
        user_id: admin.id,
        title: adData.title,
        description: adData.description,
        image_url: publicUrl,
        link_url: adData.link_url,
        is_paid: true,
        status: 'active',
    });

    if (insertError) {
        await supabase.storage.from('project-files').remove([filePath]);
        throw new Error('فشل في إنشاء الإعلان المدفوع.');
    }
};


export const updateAdStatus = async (adId: string, status: 'active' | 'rejected'): Promise<void> => {
    const { error } = await supabase
        .from('ads')
        .update({ status })
        .eq('id', adId);
    
    if (error) throw new Error('فشل في تحديث حالة الإعلان.');
};