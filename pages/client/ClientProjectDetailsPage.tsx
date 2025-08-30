

import React, { useState, useEffect, useCallback } from 'react';
// @FIX: Correct the import name from clientUploadProjectFile to uploadProjectFile. clientUploadProjectFile is not exported.
import { Project, getProjectDetails, getProjectFiles, ProjectFile, getProjectTasks, Task, getProjectMessages, sendProjectMessage, Message, uploadProjectFile } from '../../data/projectData';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../hooks/useAuth';
import { PaperClipIcon } from '../../components/icons/PaperClipIcon';
import { CheckCircleIcon } from '../../components/icons/CheckCircleIcon';

const ClientProjectDetailsPage: React.FC<{ projectId: string }> = ({ projectId }) => {
    const [project, setProject] = useState<Project | null>(null);
    const [files, setFiles] = useState<ProjectFile[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const addNotification = useNotification();
    const { currentUser } = useAuth();

    const fetchData = useCallback(async () => {
        try {
            const [projectData, filesData, tasksData, messagesData] = await Promise.all([
                getProjectDetails(projectId),
                getProjectFiles(projectId),
                getProjectTasks(projectId),
                getProjectMessages(projectId),
            ]);
            
            if (projectData && currentUser && projectData.client.id === currentUser.id) {
                setProject(projectData);
                setFiles(filesData);
                setTasks(tasksData);
                setMessages(messagesData);
            } else {
                setProject(null);
                addNotification('خطأ', 'ليس لديك صلاحية لعرض هذا المشروع.', 'error');
            }
        } catch (err) {
            addNotification('خطأ', 'فشل في تحميل بيانات المشروع.', 'error');
        } finally {
            setLoading(false);
        }
    }, [projectId, addNotification, currentUser]);

    useEffect(() => {
        if (currentUser) {
            fetchData();
        }
    }, [fetchData, currentUser]);

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        try {
            // @FIX: Correct the function call to use the imported uploadProjectFile.
            await uploadProjectFile(projectId, file);
            addNotification('نجاح', 'تم رفع الملف بنجاح!', 'success');
            fetchData(); // Refresh file list
        } catch (error) {
            addNotification('خطأ', 'فشل رفع الملف.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;
        try {
            await sendProjectMessage(projectId, newMessage, 'client');
            setNewMessage('');
            fetchData(); // Refresh messages
        } catch (error) {
            addNotification('خطأ', 'فشل إرسال الرسالة.', 'error');
        }
    };
    
    if (loading) return <div className="flex-1 bg-dark-bg p-6 flex justify-center items-center"><LoadingSpinner /></div>;
    if (!project) return <div className="flex-1 bg-dark-bg p-6 text-white text-center">المشروع غير موجود أو لا يمكن الوصول إليه.</div>;

    return (
        <main className="flex-1 bg-dark-bg p-4 lg:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white">{project.name}</h1>
                    <p className="text-slate-400">الخدمة: {project.serviceName}</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Chat */}
                        <div className="bg-panel-bg p-6 rounded-2xl border border-slate-700/50">
                             <h2 className="text-xl font-bold text-white mb-4">التواصل</h2>
                             <div className="space-y-4 mb-4 max-h-96 overflow-y-auto pr-2 bg-light-bg p-4 rounded-lg">
                                 {messages.length > 0 ? messages.map(msg => (
                                     <div key={msg.id} className={`flex ${msg.sender_role === 'client' ? 'justify-end' : 'justify-start'}`}>
                                         <div className={`max-w-md p-3 rounded-lg ${msg.sender_role === 'client' ? 'bg-primary text-white' : 'bg-slate-700 text-slate-200'}`}>
                                             {msg.message}
                                         </div>
                                     </div>
                                 )) : <p className="text-slate-400 text-center py-4">لا توجد رسائل بعد. ابدأ المحادثة!</p>}
                             </div>
                             <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="اكتب رسالتك..." className="flex-grow bg-light-bg border border-slate-700 text-white rounded-lg px-3 py-2" />
                                <button type="submit" className="bg-primary text-white p-2 px-4 rounded-lg">إرسال</button>
                            </form>
                        </div>
                    </div>
                    <div className="space-y-6">
                         {/* Tasks */}
                        <div className="bg-panel-bg p-6 rounded-2xl border border-slate-700/50">
                            <h2 className="text-xl font-bold text-white mb-4">المهام</h2>
                            {tasks.length > 0 ? (
                                <ul className="space-y-2">
                                    {tasks.map(task => (
                                        <li key={task.id} className="flex items-center gap-3">
                                            <CheckCircleIcon className={`w-5 h-5 ${task.status === 'done' ? 'text-green-400' : 'text-slate-600'}`} />
                                            <span className={`${task.status === 'done' ? 'line-through text-slate-500' : 'text-white'}`}>{task.task_name}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-slate-400 text-center py-2">لا توجد مهام حاليًا.</p>}
                        </div>
                        {/* Files */}
                        <div className="bg-panel-bg p-6 rounded-2xl border border-slate-700/50">
                             <h2 className="text-xl font-bold text-white mb-4">الملفات</h2>
                             <div className="space-y-3 mb-4">
                                {files.length > 0 ? files.map(file => (
                                    <a key={file.id} href={file.file_url} target="_blank" rel="noopener noreferrer" className="bg-light-bg p-3 rounded-lg flex items-center gap-3">
                                        <PaperClipIcon className="w-5 h-5 text-slate-400"/>
                                        <span className="text-white font-medium truncate">{file.file_name}</span>
                                    </a>
                                )) : <p className="text-slate-400 text-center py-2">لا توجد ملفات مرفوعة.</p>}
                            </div>
                            <div>
                                <label htmlFor="client-file-upload" className="block text-sm font-medium text-slate-300 mb-2">رفع ملف جديد</label>
                                <input id="client-file-upload" type="file" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} disabled={uploading} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"/>
                                {uploading && <p className="text-sm text-slate-400 mt-2">جاري الرفع...</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ClientProjectDetailsPage;