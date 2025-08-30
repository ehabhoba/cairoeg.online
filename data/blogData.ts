
import { supabase } from '../services/supabaseClient';
import { findUserByPhone, findUserById, User } from './userData';

export const blogCategories = ['الكل', 'الإعلانات الممولة', 'تحسين محركات البحث', 'تصميم جرافيكي', 'تصميم مواقع', 'مقالات العملاء'];

interface PostMetadata {
    excerpt: string;
    imageUrl: string;
    category: string;
    tags: string[];
}

export interface BlogPost {
    slug: string; 
    title: string;
    authorPhone: string;
    authorId?: string;
    date: string;
    category: string;
    tags: string[];
    imageUrl: string;
    excerpt: string;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface NewBlogPost {
    title: string;
    authorPhone: string;
    category: string;
    tags: string[];
    excerpt: string;
    content: string;
    imageFile: File;
}

export interface Comment {
    id: number;
    postSlug: string; 
    authorId: string;
    authorName: string;
    content: string;
    date: string;
    status: 'pending' | 'approved';
}

const encodePostContent = (metadata: Omit<PostMetadata, 'imageUrl'>, markdown: string, imageUrl: string): string => {
    const fullMetadata: PostMetadata = { ...metadata, imageUrl };
    const separator = '\n---METADATA---\n';
    return `${markdown}${separator}${JSON.stringify(fullMetadata)}`;
};

const parsePostFromSupabase = (p: any): BlogPost => {
    const separator = '\n---METADATA---\n';
    const contentParts = p.content.split(separator);
    const markdown = contentParts[0];
    let metadata: PostMetadata = { excerpt: '', imageUrl: '', category: 'General', tags: [] };
    if (contentParts.length > 1) {
        try {
            metadata = JSON.parse(contentParts[1]);
        } catch (e) { console.error('Failed to parse post metadata for post ID:', p.id); }
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
        imageUrl: metadata.imageUrl || 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&h=600&q=80',
        category: metadata.category,
        tags: metadata.tags || [],
    };
};

export const getAllPosts = async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase.from('blog_posts').select('*, users!inner(phone_number)').order('created_at', { ascending: false });
    if (error) { console.error("Error fetching all posts:", error); return []; }
    return data.map(parsePostFromSupabase);
};

export const getApprovedPosts = async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase.from('blog_posts').select('*, users!inner(phone_number)').eq('is_published', true).order('created_at', { ascending: false });
    if (error) { console.error("Error fetching approved posts:", error); return []; }
    return data.map(parsePostFromSupabase);
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    const { data, error } = await supabase.from('blog_posts').select('*, users!inner(phone_number)').eq('id', slug).single();
    if (error) { console.error("Error fetching post by slug:", slug, error); return null; }
    return parsePostFromSupabase(data);
};

export const getPostsByAuthor = async (authorId: string): Promise<BlogPost[]> => {
    const { data, error } = await supabase.from('blog_posts').select('*, users!inner(phone_number)').eq('author_id', authorId).eq('is_published', true).order('created_at', { ascending: false });
    if (error) { console.error("Error fetching posts by author:", error); return []; }
    return data.map(parsePostFromSupabase);
};

const uploadBlogImage = async (userId: string, imageFile: File): Promise<string> => {
    const filePath = `public/blog/${userId}/${Date.now()}_${imageFile.name}`;
    const { error } = await supabase.storage.from('project-files').upload(filePath, imageFile);
    if (error) throw new Error('فشل رفع صورة المقال.');
    const { data: { publicUrl } } = supabase.storage.from('project-files').getPublicUrl(filePath);
    return publicUrl;
};

export const addPost = async (post: NewBlogPost): Promise<void> => {
    const user = await findUserByPhone(post.authorPhone);
    if (!user || !user.id) throw new Error("Author not found");
    const imageUrl = await uploadBlogImage(user.id, post.imageFile);
    const fullContent = encodePostContent({ excerpt: post.excerpt, category: post.category, tags: post.tags }, post.content, imageUrl);
    const { error } = await supabase.from('blog_posts').insert({ title: post.title, content: fullContent, author_id: user.id, is_published: false });
    if (error) { await supabase.storage.from('project-files').remove([imageUrl]); throw new Error(error.message); }
};

export const publishPost = async (post: NewBlogPost): Promise<void> => {
    const user = await findUserByPhone(post.authorPhone);
    if (!user || !user.id) throw new Error("Author not found");
    const imageUrl = await uploadBlogImage(user.id, post.imageFile);
    const fullContent = encodePostContent({ excerpt: post.excerpt, category: post.category, tags: post.tags }, post.content, imageUrl);
    const { error } = await supabase.from('blog_posts').insert({ title: post.title, content: fullContent, author_id: user.id, is_published: true });
    if (error) { await supabase.storage.from('project-files').remove([imageUrl]); throw new Error(error.message); }
}

export const updatePostStatus = async (slug: string, status: 'approved' | 'rejected' | 'pending'): Promise<void> => {
    const { error } = await supabase.from('blog_posts').update({ is_published: status === 'approved' }).eq('id', slug);
    if (error) throw new Error(error.message);
};

export const getApprovedComments = async (postSlug: string): Promise<Comment[]> => {
    const { data, error } = await supabase.from('blog_comments').select('*, users (name)').eq('post_id', postSlug).eq('is_approved', true).order('created_at', { ascending: true });
    if (error) { console.error("Error fetching comments:", error); return []; }
    return data.map(c => ({ id: c.id, postSlug: c.post_id, content: c.content, date: new Date(c.created_at).toISOString(), status: 'approved', authorId: c.author_id, authorName: c.users?.name || 'مستخدم' }));
};

export const addComment = async (postSlug: string, authorId: string, content: string): Promise<void> => {
    const { error } = await supabase.from('blog_comments').insert({ post_id: postSlug, author_id: authorId, content: content, is_approved: false });
    if (error) throw new Error(error.message);
};

export const getAllComments = async (): Promise<Comment[]> => {
    const { data, error } = await supabase.from('blog_comments').select('*, users (name), blog_posts (title)').order('created_at', { ascending: false });
    if (error) { console.error("Error fetching all comments:", error); return []; }
    return data.map(c => ({ id: c.id, postSlug: c.blog_posts?.title || c.post_id, content: c.content, date: new Date(c.created_at).toISOString(), status: c.is_approved ? 'approved' : 'pending', authorId: c.author_id, authorName: c.users?.name || 'مستخدم' }));
};

export const updateCommentStatus = async (id: number, status: 'approved'): Promise<void> => {
    const { error } = await supabase.from('blog_comments').update({ is_approved: status === 'approved' }).eq('id', id);
    if (error) throw new Error(error.message);
};

export const deleteComment = async (id: number): Promise<void> => {
    const { error } = await supabase.from('blog_comments').delete().eq('id', id);
    if (error) throw new Error(error.message);
};
