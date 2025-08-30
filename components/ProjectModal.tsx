
import React, { useState, useEffect } from 'react';
import { ClientProject } from '../data/clientData';

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (project: ClientProject) => void;
    clientPhone: string;
    project: ClientProject | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave, clientPhone, project }) => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState<'قيد التنفيذ' | 'مكتمل' | 'متوقف'>('قيد التنفيذ');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        if (project) {
            setName(project.name);
            setStatus(project.status);
            setStartDate(project.startDate);
            setDueDate(project.dueDate);
        } else {
            setName('');
            setStatus('قيد التنفيذ');
            setStartDate(today);
            setDueDate('');
        }
    }, [project, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const projectData: ClientProject = {
            id: project ? project.id : `PROJ-${Date.now()}`,
            clientPhone,
            name,
            status,
            startDate,
            dueDate,
        };
        onSave(projectData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="bg-panel-bg rounded-2xl shadow-xl p-6 m-4 max-w-lg w-full transform transition-transform scale-95 animate-modal-enter border border-slate-700" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-white mb-6">{project ? 'تعديل المشروع' : 'إضافة مشروع جديد'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-slate-300">اسم المشروع</label>
                        <input type="text" id="projectName" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label htmlFor="projectStatus" className="block text-sm font-medium text-slate-300">الحالة</label>
                        <select id="projectStatus" value={status} onChange={e => setStatus(e.target.value as any)} className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg shadow-sm focus:ring-primary focus:border-primary">
                            <option value="قيد التنفيذ">قيد التنفيذ</option>
                            <option value="مكتمل">مكتمل</option>
                            <option value="متوقف">متوقف</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-slate-300">تاريخ البدء</label>
                            <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} required className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg shadow-sm focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-slate-300">تاريخ التسليم</label>
                            <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg shadow-sm focus:ring-primary focus:border-primary" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectModal;
