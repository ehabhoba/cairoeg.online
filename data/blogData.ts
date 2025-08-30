import { supabase } from '../services/supabaseClient';
import { findUserByPhone, findUserById } from './userData';

export const blogCategories = ['الكل', 'الإعلانات الممولة', 'تحسين محركات البحث', 'تصميم جرافيكي', 'تصميم مواقع', 'مقالات العملاء'];

interface PostMetadata {
    excerpt: string;
    imageUrl: string;
    category: string;
    tags: string[];
}

export interface BlogPost {
    slug: string; // The post UUID from Supabase `id` column
    title: string;
    authorPhone: string;
    authorId?: string;
    date: string;
    category: string;
    tags: string[];
    imageUrl: string;
    excerpt: string;
    content: string; // This will hold only the markdown content
    status: 'pending' | 'approved' | 'rejected';
}

export interface Comment {
    id: number;
    postSlug: string; // Corresponds to post's UUID
    authorPhone: string;
    authorName: string;
    content: string;
    date: string;
    status: 'pending' | 'approved';
}

// --- Content Encoding/Decoding ---

const encodePostContent = (post: Omit<BlogPost, 'slug' | 'date' | 'status' | 'title' | 'authorPhone' | 'content'>, markdown: string): string => {
    const metadata: PostMetadata = {
        excerpt: post.excerpt,
        imageUrl: post.imageUrl,
        category: post.category,
        tags: post.tags,
    };
    // Use a separator that's unlikely to be in user content
    const separator = '\n---METADATA---\n';
    return `${markdown}${separator}${JSON.stringify(metadata)}`;
};

const parsePostFromSupabase = (p: any): BlogPost => {
    const separator = '\n---METADATA---\n';
    const contentParts = p.content.split(separator);
    const markdown = contentParts[0];
    let metadata: PostMetadata = { excerpt: '', imageUrl: '', category: 'General', tags: [] };
    if (contentParts.length > 1) {
        try {
            metadata = JSON.parse(contentParts[1]);
        } catch (e) {
            console.error('Failed to parse post metadata for post ID:', p.id);
        }
    }

    return {
        slug: p.id,
        title: p.title,
        content: markdown,
        authorId: p.author_id,
        authorPhone: p.users?.phone_number || 'N/A',
        date: new Date(p.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
        status: p.is_published ? 'approved' : 'pending',
        excerpt: metadata.excerpt || markdown.substring(0, 150) + '...',
        imageUrl: metadata.imageUrl || 'https://via.placeholder.com/800x600',
        category: metadata.category,
        tags: metadata.tags || [],
    };
};

// --- Post Management ---

export const getAllPosts = async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*, users!inner(phone_number)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching all posts:", error);
        return [];
    }
    return data.map(parsePostFromSupabase);
};

export const getApprovedPosts = async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*, users!inner(phone_number)')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
        
    if (error) {
        console.error("Error fetching approved posts:", error);
        return [];
    }
    return data.map(parsePostFromSupabase);
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*, users!inner(phone_number)')
        .eq('id', slug)
        .single();
        
    if (error || !data) {
        console.error("Error fetching post by slug:", slug, error);
        return undefined;
    }
    return parsePostFromSupabase(data);
};

export const getPostsByAuthor = async (authorPhone: string): Promise<BlogPost[]> => {
    const user = await findUserByPhone(authorPhone);
    if (!user || !user.id) return [];

    const { data, error } = await supabase
        .from('blog_posts')
        .select('*, users!inner(phone_number)')
        .eq('author_id', user.id)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching posts by author:", error);
        return [];
    }
    return data.map(parsePostFromSupabase);
};

export const addPost = async (post: Omit<BlogPost, 'slug' | 'date' | 'status'>): Promise<void> => {
    const user = await findUserByPhone(post.authorPhone);
    if (!user || !user.id) throw new Error("Author not found");

    const fullContent = encodePostContent(post, post.content);
    
    const { error } = await supabase.from('blog_posts').insert({
        title: post.title,
        content: fullContent,
        author_id: user.id,
        is_published: false, // All posts go to pending
    });
    if (error) throw new Error(error.message);
};

export const publishPost = async (post: Omit<BlogPost, 'slug' | 'date' | 'status'>): Promise<void> => {
    const user = await findUserByPhone(post.authorPhone);
    if (!user || !user.id) throw new Error("Author not found");

    const fullContent = encodePostContent(post, post.content);

    const { error } = await supabase.from('blog_posts').insert({
        title: post.title,
        content: fullContent,
        author_id: user.id,
        is_published: true, // Publish directly
    });
    if (error) throw new Error(error.message);
}

export const updatePostStatus = async (slug: string, status: 'approved' | 'rejected' | 'pending'): Promise<void> => {
    const is_published = status === 'approved';
    const { error } = await supabase
        .from('blog_posts')
        .update({ is_published })
        .eq('id', slug);
    if (error) throw new Error(error.message);
};

// --- Comment Management ---
// NOTE: This assumes a `blog_comments` table exists with columns:
// id, post_id (FK to blog_posts.id), author_id (FK to users.id), content, created_at, is_approved

export const getApprovedComments = async (postSlug: string): Promise<Comment[]> => {
    const post = await getPostBySlug(postSlug);
    if (!post) return [];

    const { data, error } = await supabase
        .from('blog_comments')
        .select('*, users (phone_number, name)')
        .eq('post_id', post.slug)
        .eq('is_approved', true)
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Error fetching comments:", error);
        return [];
    }
    
    return data.map(c => ({
        id: c.id,
        postSlug: c.post_id,
        content: c.content,
        date: new Date(c.created_at).toISOString(),
        status: 'approved',
        authorPhone: c.users.phone_number,
        authorName: c.users.name || 'مستخدم',
    }));
};

export const addComment = async (postSlug: string, authorPhone: string, content: string): Promise<void> => {
    const user = await findUserByPhone(authorPhone);
    if (!user || !user.id) throw new Error("User not found");

    const { error } = await supabase.from('blog_comments').insert({
        post_id: postSlug,
        author_id: user.id,
        content: content,
        is_approved: false, // Comments are pending by default
    });
    if (error) throw new Error(error.message);
};

// Admin functions for comments
export const getAllComments = async (): Promise<Comment[]> => {
    const { data, error } = await supabase
        .from('blog_comments')
        .select('*, users (name, phone_number), blog_posts (id, title)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching all comments:", error);
        return [];
    }

    return data.map(c => ({
        id: c.id,
        postSlug: c.blog_posts?.title || c.post_id,
        content: c.content,
        date: new Date(c.created_at).toISOString(),
        status: c.is_approved ? 'approved' : 'pending',
        authorPhone: c.users?.phone_number || 'N/A',
        authorName: c.users?.name || 'مستخدم',
    }));
};

export const updateCommentStatus = async (id: number, status: 'approved'): Promise<void> => {
    const { error } = await supabase
        .from('blog_comments')
        .update({ is_approved: status === 'approved' })
        .eq('id', id);
    if (error) throw new Error(error.message);
};

export const deleteComment = async (id: number): Promise<void> => {
    const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', id);
    if (error) throw new Error(error.message);
};
