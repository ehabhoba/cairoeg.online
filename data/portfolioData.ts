import { supabase } from '../services/supabaseClient';
import { User, findUserByPhone } from './userData';

export interface ClientShowcase {
    client: User;
    designs: { id: number; url: string; name: string }[];
    articles: { slug: string; title: string; imageUrl: string }[];
    socials: { page_link?: string; keywords?: string[]; hashtags?: string[] };
}

// Fetches clients who have something to showcase (a published article or a project file)
export const getPublicPortfolioClients = async (): Promise<User[]> => {
    const { data: usersWithFiles, error: fileError } = await supabase.rpc('get_clients_with_work');

    if (fileError) {
        console.error("Error fetching portfolio clients:", fileError);
        return [];
    }

    return usersWithFiles.map((u: any) => ({
        id: u.id,
        name: u.name,
        phone: u.phone_number,
        role: 'client',
        bio: u.bio || '',
        logoUrl: u.logo_url || ''
    }));
};


export const getClientShowcaseData = async (clientPhone: string): Promise<ClientShowcase | null> => {
    const client = await findUserByPhone(clientPhone);
    if (!client || !client.id) return null;

    // Fetch Designs from project_files
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', client.id);
    
    let designs: ClientShowcase['designs'] = [];
    if (orders && orders.length > 0) {
        const orderIds = orders.map(o => o.id);
        const { data: files, error: filesError } = await supabase
            .from('project_files')
            .select('id, file_url, file_name')
            .in('order_id', orderIds)
            .ilike('file_type', 'image/%'); // only get images
        
        if (files) {
            designs = files.map(f => ({ id: f.id, url: f.file_url, name: f.file_name }));
        }
    }

    // Fetch Articles from blog_posts
    const { data: articles, error: articlesError } = await supabase
        .from('blog_posts')
        .select('id, title, content')
        .eq('author_id', client.id)
        .eq('is_published', true);

    const parsedArticles = articles ? articles.map(a => {
        const separator = '\n---METADATA---\n';
        const contentParts = a.content.split(separator);
        let imageUrl = 'https://via.placeholder.com/800x600';
         if (contentParts.length > 1) {
            try {
                const metadata = JSON.parse(contentParts[1]);
                imageUrl = metadata.imageUrl;
            } catch(e) {}
        }
        return { slug: a.id, title: a.title, imageUrl };
    }) : [];

    // Fetch Socials from business_profiles
    const { data: profile, error: profileError } = await supabase
        .from('business_profiles')
        .select('page_link, keywords, hashtags')
        .eq('user_id', client.id)
        .single();
    
    return {
        client,
        designs,
        articles: parsedArticles,
        socials: profile || {},
    };
};
