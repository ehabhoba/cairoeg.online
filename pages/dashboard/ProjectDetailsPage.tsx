import React, { useState, useEffect, useCallback } from 'react';
import { Project, getProjectDetails, getProjectFiles, ProjectFile, getProjectTasks, Task, getProjectUpdates, ProjectUpdate, uploadProjectFile, addTask, addProjectUpdate } from '../../data/projectData';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotification } from '../../hooks/useNotification';
import Badge from '../../components/Badge';
import { PaperClipIcon } from '../../components/icons/PaperClipIcon';
import { CheckCircleIcon } from '../../components/icons/CheckCircleIcon';
import { InformationCircleIcon } from '../../components/icons/InformationCircleIcon';
import { ClipboardDocumentCheckIcon } from '../../components/icons/ClipboardDocumentCheckIcon';
import { PlusIcon } from '../../components/icons/PlusIcon';

// ---- Sub-components ---- //

const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
    const statusInfo = {
        to_do: { text: 'للعمل', icon: <InformationCircleIcon className="w-5 h-5 text-yellow-400"/>, color: 'yellow' },
        in_progress: { text: 'قيد التنفيذ', icon: <LoadingSpinner />, color: 'blue' },
        done: { text: 'مكتمل', icon: <ClipboardDocumentCheckIcon className="w-5 h-5 text-green-400"/>, color: 'green' }
    };
    const { text, icon, color } = statusInfo[task.status];
    return (
        <div className="bg-light-bg p-3 rounded-lg flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">{icon}</div>
            <div className="flex-grow">
                <p className="font-semibold text-white">{task.task_name}</p>
                <p className="text-sm text-slate-400">{task.task_description}</p>
            </div>
            <Badge color={color as any}>{text}</Badge>
        </div>
    );
};


const FileUpload: React.FC<{ onUpload: (file: File) => void; isLoading: boolean }> = ({ onUpload, isLoading }) => {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };
    
    return (
         <div 
            onDragEnter={handleDrag} 
            onDragOver={handleDrag} 
            onDragLeave={handleDrag} 
            onDrop={handleDrop}
            className={`relative w-full h-32 border-2 border-dashed rounded-lg flex flex-col justify-center items-center transition-colors ${dragActive ? 'border-primary bg-primary/10' : 'border-slate-700 hover:border-slate-600'}`}
        >
            <input ref={inputRef} type="file" className="hidden" onChange={handleChange} disabled={isLoading} />
            {isLoading ? <LoadingSpinner /> : (
                <>
                    <PaperClipIcon className="w-8 h-8 text-slate-500 mb-2" />
                    <p className="text-slate-400">اسحب وأفلت الملف هنا، أو <button onClick={() => inputRef.current?.click()} className="text-primary font-semibold hover:underline">تصفح</button></p>
                </>
            )}
        </div>
    );
};

// ---- Main Component ---- //

const ProjectDetailsPage: React.FC<{ projectId: string }> = ({ projectId }) => {
    const [project, setProject] = useState<Project | null>(null);
    const [files, setFiles] = useState<ProjectFile[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [newUpdate, setNewUpdate] = useState('');
    const [newTaskName, setNewTaskName] = useState('');
    
    const addNotification = useNotification();

    const fetchData = useCallback(async () => {
        try {
            const [projectData, filesData, tasksData, updatesData] = await Promise.all([
                getProjectDetails(projectId),
                getProjectFiles(projectId),
                getProjectTasks(projectId),
                getProjectUpdates(projectId),
            ]);
            setProject(projectData);
            setFiles(filesData);
            setTasks(tasksData);
            setUpdates(updatesData);
        } catch (err) {
            addNotification('خطأ', 'فشل في تحميل بيانات المشروع.', 'error');
        } finally {
            setLoading(false);
        }
    }, [projectId, addNotification]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const handleFileUpload = async (file: File) => {
        setUploading(true);
        try {
            await uploadProjectFile(projectId, file);
            addNotification('نجاح', 'تم رفع الملف بنجاح!', 'success');
            fetchData();
        } catch (error) {
            addNotification('خطأ', 'فشل رفع الملف.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleAddUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUpdate.trim()) return;
        try {
            await addProjectUpdate(projectId, newUpdate);
            setNewUpdate('');
            fetchData();
        } catch (error) {
            addNotification('خطأ', 'فشل إضافة التحديث.', 'error');
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskName.trim()) return;
        try {
            await addTask(projectId, { task_name: newTaskName, task_description: '', status: 'to_do', due_date: null });
            setNewTaskName('');
            fetchData();
        } catch (error) {
            addNotification('خطأ', 'فشل إضافة المهمة.', 'error');
        }
    };
    
    if (loading) return <div className="flex-1 bg-dark-bg p-6 flex justify-center items-center"><LoadingSpinner /></div>;
    if (!project) return <div className="flex-1 bg-dark-bg p-6 text-white">لم يتم العثور على المشروع.</div>;

    return (
        <main className="flex-1 bg-dark-bg p-4 lg:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white">{project.name}</h1>
                    <p className="text-slate-400">العميل: {project.client.name} | الخدمة: {project.serviceName}</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tasks */}
                        <div className="bg-panel-bg p-6 rounded-2xl border border-slate-700/50">
                            <h2 className="text-xl font-bold text-white mb-4">المهام</h2>
                            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto pr-2">
                                {tasks.map(task => <TaskItem key={task.id} task={task} />)}
                            </div>
                            <form onSubmit={handleAddTask} className="flex gap-2">
                                <input type="text" value={newTaskName} onChange={e => setNewTaskName(e.target.value)} placeholder="إضافة مهمة جديدة..." className="flex-grow bg-light-bg border border-slate-700 text-white rounded-lg px-3 py-2 focus:ring-primary focus:border-primary" />
                                <button type="submit" className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark"><PlusIcon className="w-5 h-5"/></button>
                            </form>
                        </div>
                        {/* Project Files */}
                        <div className="bg-panel-bg p-6 rounded-2xl border border-slate-700/50">
                            <h2 className="text-xl font-bold text-white mb-4">ملفات المشروع</h2>
                             <div className="space-y-3 mb-4">
                                {files.map(file => (
                                    <a key={file.id} href={file.file_url} target="_blank" rel="noopener noreferrer" className="bg-light-bg p-3 rounded-lg flex items-center gap-3 hover:bg-slate-700/50">
                                        <PaperClipIcon className="w-5 h-5 text-slate-400 flex-shrink-0"/>
                                        <span className="text-white font-medium truncate">{file.file_name}</span>
                                        <span className="text-xs text-slate-500 ml-auto">{new Date(file.uploaded_at).toLocaleDateString()}</span>
                                    </a>
                                ))}
                            </div>
                            <FileUpload onUpload={handleFileUpload} isLoading={uploading} />
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-6">
                        {/* Updates */}
                        <div className="bg-panel-bg p-6 rounded-2xl border border-slate-700/50">
                            <h2 className="text-xl font-bold text-white mb-4">آخر التحديثات</h2>
                             <div className="space-y-4 mb-4 max-h-96 overflow-y-auto pr-2">
                                {updates.map(update => (
                                    <div key={update.id} className="relative pl-6">
                                        <div className="absolute top-1 left-1.5 w-0.5 h-full bg-slate-700"></div>
                                        <div className="absolute top-1 left-0 w-3 h-3 bg-primary rounded-full border-2 border-dark-bg"></div>
                                        <p className="text-sm text-slate-300">{update.update_text}</p>
                                        <p className="text-xs text-slate-500 mt-1">{new Date(update.created_at).toLocaleString('ar-EG')}</p>
                                    </div>
                                ))}
                            </div>
                             <form onSubmit={handleAddUpdate} className="flex flex-col gap-2">
                                <textarea value={newUpdate} onChange={e => setNewUpdate(e.target.value)} rows={3} placeholder="أضف تحديثًا جديدًا..." className="w-full bg-light-bg border border-slate-700 text-white rounded-lg px-3 py-2 focus:ring-primary focus:border-primary" />
                                <button type="submit" className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark self-end">نشر التحديث</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProjectDetailsPage;
