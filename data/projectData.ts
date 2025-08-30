import { supabase } from '../services/supabaseClient';
import { findUserByPhone, User } from './userData';

// ---- TYPES ---- //

export type TaskStatus = 'to_do' | 'in_progress' | 'done';

export interface Project {
    id: string; // orders.id
    name: string; // orders.notes
    status: string; // orders.status
    client: User;
    serviceName: string; // services.service_name
    createdAt: string; // orders.created_at
}

export interface ProjectFile {
    id: number;
    file_name: string;
    file_url: string;
    file_type: string;
    uploaded_at: string;
}

export interface Task {
    id: number;
    task_name: string;
    task_description: string;
    status: TaskStatus;
    due_date: string | null;
}

export interface ProjectUpdate {
    id: number;
    update_text: string;
    created_at: string;
}


// ---- FUNCTIONS ---- //

export const getProjectDetails = async (projectId: string): Promise<Project | null> => {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            users (*),
            services (service_name)
        `)
        .eq('id', projectId)
        .single();

    if (error || !data) {
        console.error('Error fetching project details:', error);
        return null;
    }

    return {
        id: data.id,
        name: data.notes || `Project #${data.id}`,
        status: data.status,
        client: {
// @FIX: Add missing properties 'id' and 'email' to satisfy the User type.
            id: data.users.id,
            email: data.users.email,
            name: data.users.name,
            phone: data.users.phone_number,
            role: data.users.role,
            bio: data.users.bio || ''
        },
        serviceName: data.services.service_name || 'خدمة غير محددة',
        createdAt: data.created_at,
    };
};

export const getProjectFiles = async (projectId: string): Promise<ProjectFile[]> => {
    const { data, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('order_id', projectId)
        .order('uploaded_at', { ascending: false });

    if (error) {
        console.error('Error fetching project files:', error);
        return [];
    }
    return data;
};

export const getProjectTasks = async (projectId: string): Promise<Task[]> => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('order_id', projectId)
        .order('created_at', { ascending: false });
        
    if (error) {
        console.error('Error fetching project tasks:', error);
        return [];
    }
    return data;
};

export const getProjectUpdates = async (projectId: string): Promise<ProjectUpdate[]> => {
    const { data, error } = await supabase
        .from('project_updates')
        .select('*')
        .eq('order_id', projectId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching project updates:', error);
        return [];
    }
    return data;
};


export const uploadProjectFile = async (projectId: string, file: File): Promise<string> => {
    const filePath = `public/${projectId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
        .from('project-files') // Bucket name
        .upload(filePath, file);

    if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw new Error('فشل رفع الملف.');
    }

    const { data: publicUrlData } = supabase.storage
        .from('project-files')
        .getPublicUrl(filePath);
        
    const publicURL = publicUrlData.publicUrl;

    const { error: insertError } = await supabase
        .from('project_files')
        .insert({
            order_id: projectId,
            file_name: file.name,
            file_type: file.type,
            file_url: publicURL,
        });

    if (insertError) {
        console.error('Error inserting file metadata:', insertError);
        // Attempt to remove the uploaded file if DB insert fails
        await supabase.storage.from('project-files').remove([filePath]);
        throw new Error('فشل حفظ بيانات الملف.');
    }
    
    return publicURL;
};

export const addTask = async (projectId: string, task: Omit<Task, 'id'>): Promise<void> => {
    const { error } = await supabase
        .from('tasks')
        .insert({
            order_id: projectId,
            task_name: task.task_name,
            task_description: task.task_description,
            status: task.status,
            due_date: task.due_date,
        });
    if (error) {
        console.error('Error adding task:', error);
        throw new Error('فشل إضافة المهمة.');
    }
};

export const addProjectUpdate = async (projectId: string, updateText: string): Promise<void> => {
    const { error } = await supabase
        .from('project_updates')
        .insert({
            order_id: projectId,
            update_text: updateText,
            status: 'update', // Assuming a default status
        });
    if (error) {
        console.error('Error adding project update:', error);
        throw new Error('فشل إضافة التحديث.');
    }
};
