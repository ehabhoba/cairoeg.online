

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
    try {
        const { data, error } = await supabase
            .from('ads')
            .select('*')
            .eq('status', 'active')
            .order('is_paid', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        if (data && data.length > 0) {
            const paidAd = data.find(ad => ad.is_paid);
            return paidAd || data[Math.floor(Math.random() * data.length)];
        }

        return null;

    } catch (error: any) {
        if (error.message.includes('Failed to fetch')) {
            console.error(
                '--- FETCH ERROR DETECTED --- \n' +
                'This is almost always a CORS (Cross-Origin Resource Sharing) issue in your Supabase project settings.\n' +
                'It is NOT a bug in the application code.\n\n' +
                'TO FIX THIS:\n' +
                '1. Go to your Supabase project dashboard.\n' +
                '2. Go to API settings (the `<>` icon).\n' +
                '3. Find the "CORS settings" section.\n' +
                '4. Add your website\'s URL (e.g., https://your-domain.com) to the list of allowed origins.\n' +
                '   If you are testing locally, add http://localhost:3000 (or your port).\n' +
                '-----------------------------'
            );
        } else {
            console.error("An unexpected error occurred while fetching ads:", error);
        }
        
        return null;
    }
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

// FIX: Add 'image_url' to Omit as it's generated internally, not passed in adData.
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

// FIX: Add 'image_url' to Omit as it's generated internally, not passed in adData.
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