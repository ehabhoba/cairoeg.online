
import React, { useState, useEffect, useCallback } from 'react';
import { Project, getProjectDetails, getProjectFiles, ProjectFile, getProjectTasks, Task, getProjectMessages, Message, uploadProjectFile, addTask, sendProjectMessage, updateTaskStatus, TaskStatus } from '../../data/projectData';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../hooks/useAuth';
import { PaperClipIcon } from '../../components/icons/PaperClipIcon';
import { PlusIcon } from '../../components/icons/PlusIcon';

type Tab = 'tasks' | 'files' | 'chat';

const ProjectDetailsPage: React.FC<{ projectId: string }> = ({ projectId }) => {
    const [project, setProject] = useState<Project | null>(null);
    const [files, setFiles] = useState<ProjectFile[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [newTaskName, setNewTaskName] = useState('');
    const [activeTab, setActiveTab] = useState<Tab>('tasks');
    const addNotification = useNotification();
    const { currentUser } = useAuth();

    const fetchData = useCallback(async () => {
        try {
            const [projectData, filesData, tasksData, messagesData] = await Promise.all([
                getProjectDetails(projectId), getProjectFiles(projectId),
                getProjectTasks(projectId), getProjectMessages(projectId)
            ]);
            setProject(projectData); setFiles(filesData);
            setTasks(tasksData); setMessages(messagesData);
        } catch (err) { addNotification('خطأ', 'فشل في تحميل بيانات المشروع.', 'error');
        } finally { setLoading(false); }
    }, [projectId, addNotification]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        try {
            await uploadProjectFile(projectId, file);
            addNotification('نجاح', 'تم رفع الملف بنجاح!', 'success');
            fetchData();
        } catch (error) { addNotification('خطأ', 'فشل رفع الملف.', 'error');
        } finally { setUploading(false); }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            await sendProjectMessage(projectId, newMessage, 'admin');
            setNewMessage('');
            fetchData();
        } catch (error) { addNotification('خطأ', 'فشل إرسال الرسالة.', 'error'); }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskName.trim()) return;
        try {
            await addTask(projectId, { task_name: newTaskName, task_description: '', status: 'to_do', due_date: null });
            setNewTaskName('');
            fetchData();
        } catch (error) { addNotification('خطأ', 'فشل إضافة المهمة.', 'error'); }
    };

    const handleTaskStatusChange = async (taskId: number, newStatus: TaskStatus) => {
        try {
            await updateTaskStatus(taskId, newStatus);
            fetchData(); // Refresh data to show change
        } catch (error) { addNotification('خطأ', 'فشل تحديث حالة المهمة.', 'error'); }
    };

    if (loading) return <div className="flex-1 bg-dark-bg p-6 flex justify-center items-center"><LoadingSpinner /></div>;
    if (!project) return <div className="flex-1 bg-dark-bg p-6 text-white">لم يتم العثور على المشروع.</div>;

    return (
        <main className="flex-1 bg-dark-bg p-4 lg:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white">{project.name}</h1>
                    <p className="text-slate-400">العميل: {project.client.name} | الخدمة: {project.serviceName}</p>
                </div>
                
                <div className="border-b border-slate-700 flex mb-6">
                    <button onClick={() => setActiveTab('tasks')} className={`px-4 py-2 font-semibold ${activeTab === 'tasks' ? 'text-primary border-b-2 border-primary' : 'text-slate-400'}`}>المهام</button>
                    <button onClick={() => setActiveTab('files')} className={`px-4 py-2 font-semibold ${activeTab === 'files' ? 'text-primary border-b-2 border-primary' : 'text-slate-400'}`}>الملفات</button>
                    <button onClick={() => setActiveTab('chat')} className={`px-4 py-2 font-semibold ${activeTab === 'chat' ? 'text-primary border-b-2 border-primary' : 'text-slate-400'}`}>التواصل</button>
                </div>

                <div className="bg-panel-bg p-6 rounded-2xl border border-slate-700/50">
                    {activeTab === 'tasks' && (
                        <div>
                            <div className="space-y-3 mb-4 max-h-[60vh] overflow-y-auto pr-2">
                                {tasks.map(task => (
                                    <div key={task.id} className="bg-light-bg p-3 rounded-lg flex items-center gap-4">
                                        <p className="font-semibold text-white flex-grow">{task.task_name}</p>
                                        <select value={task.status} onChange={(e) => handleTaskStatusChange(task.id, e.target.value as TaskStatus)} className="bg-slate-700 text-white text-xs rounded-md p-1 border-slate-600">
                                            <option value="to_do">للعمل</option>
                                            <option value="in_progress">قيد التنفيذ</option>
                                            <option value="done">مكتمل</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleAddTask} className="flex gap-2">
                                <input type="text" value={newTaskName} onChange={e => setNewTaskName(e.target.value)} placeholder="إضافة مهمة جديدة..." className="flex-grow bg-light-bg border border-slate-700 text-white rounded-lg px-3 py-2" />
                                <button type="submit" className="bg-primary text-white p-2 rounded-lg"><PlusIcon className="w-5 h-5"/></button>
                            </form>
                        </div>
                    )}
                    {activeTab === 'files' && (
                        <div>
                            <div className="space-y-3 mb-4">
                                {files.map(file => ( <a key={file.id} href={file.file_url} target="_blank" rel="noopener noreferrer" className="bg-light-bg p-3 rounded-lg flex items-center gap-3"><PaperClipIcon className="w-5 h-5 text-slate-400"/> <span className="text-white font-medium truncate">{file.file_name}</span></a> ))}
                            </div>
                            <input type="file" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} disabled={uploading} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"/>
                        </div>
                    )}
                    {activeTab === 'chat' && (
                        <div>
                             <div className="space-y-4 mb-4 max-h-96 overflow-y-auto pr-2 bg-light-bg p-4 rounded-lg">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-md p-3 rounded-lg ${msg.sender_role === 'admin' ? 'bg-primary text-white' : 'bg-slate-700 text-slate-200'}`}>{msg.message}</div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="اكتب رسالتك للعميل..." className="flex-grow bg-light-bg border border-slate-700 text-white rounded-lg px-3 py-2" />
                                <button type="submit" className="bg-primary text-white p-2 px-4 rounded-lg">إرسال</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ProjectDetailsPage;
