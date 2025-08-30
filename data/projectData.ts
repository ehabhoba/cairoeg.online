
import { supabase } from '../services/supabaseClient';
import { User, mapUserFromDb } from './userData';

export type TaskStatus = 'to_do' | 'in_progress' | 'done';

export interface Project {
    id: string; 
    name: string;
    status: string;
    client: User;
    serviceName: string;
    startDate: string;
}

export interface ProjectFile { id: number; file_name: string; file_url: string; file_type: string; uploaded_at: string; }
export interface Task { id: number; task_name: string; task_description: string; status: TaskStatus; due_date: string | null; }
export interface ProjectUpdate { id: number; update_text: string; created_at: string; }
export interface Message { id: number; message: string; sender_role: 'admin' | 'client'; created_at: string; }

export const getProjectDetails = async (projectId: string): Promise<Project | null> => {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *, 
            users (*, business_profiles (*)), 
            services (service_name)
        `)
        .eq('id', projectId)
        .single();

    if (error || !data || !data.users) { 
        console.error('Error fetching project details or missing user:', error); 
        return null; 
    }
    
    return {
        id: data.id,
        name: data.notes || `Project #${data.id}`,
        status: data.status,
        client: mapUserFromDb(data.users),
        serviceName: data.services?.service_name || 'خدمة غير محددة', 
        startDate: data.created_at,
    };
};

export const getProjectFiles = async (projectId: string): Promise<ProjectFile[]> => {
    const { data, error } = await supabase.from('project_files').select('*').eq('order_id', projectId).order('uploaded_at', { ascending: false });
    if (error) { console.error('Error fetching project files:', error); return []; }
    return data;
};

export const getProjectTasks = async (projectId: string): Promise<Task[]> => {
    const { data, error } = await supabase.from('tasks').select('*').eq('order_id', projectId).order('created_at', { ascending: true });
    if (error) { console.error('Error fetching project tasks:', error); return []; }
    return data;
};

export const getProjectMessages = async (projectId: string): Promise<Message[]> => {
    const { data, error } = await supabase.from('communications').select('*').eq('order_id', projectId).order('created_at', { ascending: true });
    if (error) { console.error('Error fetching project messages:', error); return []; }
    return data;
};

export const uploadProjectFile = async (projectId: string, file: File): Promise<string> => {
    const filePath = `public/${projectId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('project-files').upload(filePath, file);
    if (uploadError) { console.error('Error uploading file:', uploadError); throw new Error('فشل رفع الملف.'); }
    const { data: { publicUrl } } = supabase.storage.from('project-files').getPublicUrl(filePath);
    const { error: insertError } = await supabase.from('project_files').insert({ order_id: projectId, file_name: file.name, file_type: file.type, file_url: publicUrl });
    if (insertError) {
        console.error('Error inserting file metadata:', insertError);
        await supabase.storage.from('project-files').remove([filePath]);
        throw new Error('فشل حفظ بيانات الملف.');
    }
    return publicUrl;
};

export const addTask = async (projectId: string, task: Omit<Task, 'id'>): Promise<void> => {
    const { error } = await supabase.from('tasks').insert({ order_id: projectId, task_name: task.task_name, task_description: task.task_description, status: task.status, due_date: task.due_date });
    if (error) { console.error('Error adding task:', error); throw new Error('فشل إضافة المهمة.'); }
};

export const updateTaskStatus = async (taskId: number, status: TaskStatus): Promise<void> => {
    const { error } = await supabase.from('tasks').update({ status }).eq('id', taskId);
    if (error) { console.error('Error updating task status:', error); throw new Error('فشل تحديث حالة المهمة.'); }
};

export const sendProjectMessage = async (projectId: string, message: string, senderRole: 'admin' | 'client'): Promise<void> => {
    const { error } = await supabase.from('communications').insert({ order_id: projectId, message, sender_role: senderRole });
    if (error) { console.error('Error sending message:', error); throw new Error('فشل إرسال الرسالة.'); }
};