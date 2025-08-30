import React, { useState, useEffect, useCallback } from 'react';
import { User, findUserByPhone } from '../data/userData';
import { ClientProject, ClientInvoice, getProjectsByClient, getInvoicesByClient, addProject, addInvoice, updateProject, updateInvoice } from '../data/clientData';
import { ClientRequest, getRequestsByClient } from '../data/requestsData';
import Badge from '../components/Badge';
import { PlusIcon } from '../components/icons/PlusIcon';
import ProjectModal from '../components/ProjectModal';
import InvoiceModal from '../components/InvoiceModal';
import { useNotification } from '../hooks/useNotification';

const InfoItem: React.FC<{ label: string, value?: string | React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="font-semibold text-white">{value || '-'}</p>
    </div>
);

const ClientDetailsPage: React.FC<{ clientPhone: string }> = ({ clientPhone }) => {
    const [client, setClient] = useState<User | null>(null);
    const [projects, setProjects] = useState<ClientProject[]>([]);
    const [invoices, setInvoices] = useState<ClientInvoice[]>([]);
    const [requests, setRequests] = useState<ClientRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isProjectModalOpen, setProjectModalOpen] = useState(false);
    const [isInvoiceModalOpen, setInvoiceModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<ClientProject | null>(null);
    const [editingInvoice, setEditingInvoice] = useState<ClientInvoice | null>(null);
    const addNotification = useNotification();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const user = await findUserByPhone(clientPhone);
            if (user) {
                setClient(user);
                const [clientProjects, clientInvoices, clientRequests] = await Promise.all([
                    getProjectsByClient(clientPhone),
                    getInvoicesByClient(clientPhone),
                    getRequestsByClient(clientPhone)
                ]);
                setProjects(clientProjects);
                setInvoices(clientInvoices);
                setRequests(clientRequests);
            }
        } catch (error) {
            addNotification('خطأ', 'فشل في جلب بيانات العميل.', 'error');
        } finally {
            setLoading(false);
        }
    }, [clientPhone, addNotification]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleProjectSave = async (project: ClientProject) => {
        try {
            if (editingProject) {
                await updateProject(project);
                addNotification('نجاح!', 'تم تحديث المشروع بنجاح.', 'success');
            } else {
                await addProject(project);
                addNotification('نجاح!', 'تمت إضافة المشروع بنجاح.', 'success');
            }
            setProjectModalOpen(false);
            setEditingProject(null);
            fetchData();
        } catch (error) {
            addNotification('خطأ', 'فشل حفظ المشروع.', 'error');
        }
    };

    const handleInvoiceSave = async (invoice: ClientInvoice) => {
        try {
            if (editingInvoice) {
                await updateInvoice(invoice);
                addNotification('نجاح!', 'تم تحديث الفاتورة بنجاح.', 'success');
            } else {
                await addInvoice(invoice);
                addNotification('نجاح!', 'تمت إضافة الفاتورة بنجاح.', 'success');
            }
            setInvoiceModalOpen(false);
            setEditingInvoice(null);
            fetchData();
        } catch (error) {
            addNotification('خطأ', 'فشل حفظ الفاتورة.', 'error');
        }
    };
    
    if (loading) return <div className="p-6 text-white">جاري تحميل بيانات العميل...</div>;
    if (!client) return <div className="p-6 text-white">لم يتم العثور على العميل.</div>;

    const getRequestStatusColor = (status: ClientRequest['status']) => {
        if (status === 'مكتمل') return 'green';
        if (status === 'قيد التنفيذ') return 'blue';
        return 'yellow';
    };

    return (
        <main className="flex-1 bg-dark-bg p-4 lg:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-start gap-6 mb-8">
                    {client.logoUrl ? 
                        <img src={client.logoUrl} alt="logo" className="w-20 h-20 rounded-lg object-contain bg-white p-1" /> :
                        <div className="w-20 h-20 flex-shrink-0 bg-primary rounded-lg flex items-center justify-center text-4xl font-bold text-white">{client.name.charAt(0)}</div>
                    }
                    <div>
                        <h1 className="text-3xl font-bold text-white">{client.name}</h1>
                        <p className="text-slate-400">{client.phone}</p>
                    </div>
                </div>

                {/* Client Info */}
                <div className="bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg mb-6">
                    <h2 className="text-xl font-bold text-white mb-4">معلومات العميل</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <InfoItem label="الاسم" value={client.name} />
                        <InfoItem label="الهاتف" value={client.phone} />
                        <InfoItem label="الشركة" value={client.companyName} />
                        <InfoItem label="الموقع" value={client.websiteUrl ? <a href={client.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{client.websiteUrl}</a> : '-'} />
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Projects Section */}
                    <div className="bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">المشاريع</h2>
                            <button onClick={() => { setEditingProject(null); setProjectModalOpen(true); }} className="flex items-center gap-1 text-sm text-primary hover:text-primary-light">
                                <PlusIcon className="w-4 h-4" /> إضافة مشروع
                            </button>
                        </div>
                        <div className="space-y-3">
                            {projects.map(p => (
                                <a key={p.id} href={`/dashboard/project/${p.id}`} className="block bg-light-bg p-3 rounded-lg flex justify-between items-center transition-colors hover:bg-slate-700/50">
                                    <p className="font-medium text-white">{p.name}</p>
                                    <Badge color={p.status === 'مكتمل' ? 'green' : 'blue'}>{p.status}</Badge>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Invoices Section */}
                    <div className="bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">الفواتير</h2>
                            <button onClick={() => { setEditingInvoice(null); setInvoiceModalOpen(true); }} className="flex items-center gap-1 text-sm text-primary hover:text-primary-light">
                                <PlusIcon className="w-4 h-4" /> إضافة فاتورة
                            </button>
                        </div>
                        <div className="space-y-3">
                            {invoices.map(i => (
                                <div key={i.id} className="bg-light-bg p-3 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-white">فاتورة #{i.id}</p>
                                        <p className="text-sm text-slate-400">{i.amount.toLocaleString()} ج.م</p>
                                    </div>
                                    <Badge color={i.status === 'مدفوعة' ? 'green' : 'yellow'}>{i.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                     {/* Requests Section */}
                    <div className="xl:col-span-2 bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-4">الطلبات</h2>
                        <div className="space-y-3">
                             {requests.length > 0 ? requests.map(r => (
                                <div key={r.id} className="bg-light-bg p-3 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-white">{r.type === 'campaign' ? 'طلب حملة إعلانية' : 'طلب تصميم'}</p>
                                        <p className="text-sm text-slate-400">"{r.details.title}" - بتاريخ {new Date(r.timestamp).toLocaleDateString('ar-EG')}</p>
                                    </div>
                                    <Badge color={getRequestStatusColor(r.status)}>{r.status}</Badge>
                                </div>
                            )) : <p className="text-slate-400 text-center py-4">لا توجد طلبات من هذا العميل.</p>}
                        </div>
                    </div>

                </div>
            </div>

            <ProjectModal
                isOpen={isProjectModalOpen}
                onClose={() => setProjectModalOpen(false)}
                onSave={handleProjectSave}
                clientPhone={clientPhone}
                project={editingProject}
            />

            <InvoiceModal
                isOpen={isInvoiceModalOpen}
                onClose={() => setInvoiceModalOpen(false)}
                onSave={handleInvoiceSave}
                clientPhone={clientPhone}
                invoice={editingInvoice}
            />
        </main>
    );
};

export default ClientDetailsPage;
