


import React, { useState, useEffect } from 'react';
import { getProjectsByClient, ClientProject, getInvoicesByClient, ClientInvoice, getFilesByClient, ProjectFile, getCampaignsByClient, Campaign } from '../../data/clientData';
import { ProjectIcon } from '../../components/icons/ProjectIcon';
import { InvoiceIcon } from '../../components/icons/InvoiceIcon';
import { DocumentIcon } from '../../components/icons/DocumentIcon';
import Badge from '../../components/Badge';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import ClientOnboarding from '../../components/ClientOnboarding';
import { useNavigate } from '../../hooks/useNavigate';

const StatCard: React.FC<{ title: string, value: string | number, icon: React.ReactNode, iconBgColor: string }> = ({ title, value, icon, iconBgColor }) => {
    return (
        <div className="relative bg-gradient-to-br from-light-bg to-panel-bg p-6 rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{value}</p>
                </div>
                <div className={`w-12 h-12 flex items-center justify-center rounded-lg border ${iconBgColor}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};


const ClientDashboardPage: React.FC = () => {
    const { currentUser, setCurrentUser } = useAuth();
    const { navigate } = useNavigate();
    const [projects, setProjects] = useState<ClientProject[]>([]);
    const [invoices, setInvoices] = useState<ClientInvoice[]>([]);
    const [files, setFiles] = useState<ProjectFile[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);
    
    useEffect(() => {
        if (currentUser) {
            setShowOnboarding(!currentUser.has_completed_onboarding);
            const fetchData = async () => {
                setLoading(true);
                const [clientProjects, clientInvoices, clientFiles, clientCampaigns] = await Promise.all([
                    getProjectsByClient(currentUser.phone),
                    getInvoicesByClient(currentUser.phone),
                    getFilesByClient(currentUser.phone),
                    getCampaignsByClient(currentUser.phone),
                ]);
                setProjects(clientProjects);
                setInvoices(clientInvoices);
                setFiles(clientFiles);
                setCampaigns(clientCampaigns);
                setLoading(false);
            };
            fetchData();
        }
    }, [currentUser]);

    const handleOnboardingDismiss = () => {
        setShowOnboarding(false);
        // Optimistically update the UI
        if(currentUser) {
            setCurrentUser({ ...currentUser, has_completed_onboarding: true });
        }
    };

    const activeProjects = projects.filter(p => p.status === 'قيد التنفيذ').length;
    const unpaidInvoices = invoices.filter(i => i.status === 'غير مدفوعة').length;

    if (loading) {
        return <div className="flex items-center justify-center h-full bg-dark-bg"><LoadingSpinner /></div>
    }

    return (
        <>
        {showOnboarding && <ClientOnboarding onDismiss={handleOnboardingDismiss} />}
        <main className="flex-1 bg-dark-bg p-4 lg:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">مرحباً بك، {currentUser?.name || 'عميلنا العزيز'}</h1>
                <p className="text-slate-400 mb-6">هذه هي لوحة التحكم الخاصة بك لمتابعة كل ما يتعلق بأعمالك معنا.</p>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <StatCard 
                        title="المشاريع النشطة"
                        value={activeProjects}
                        icon={<ProjectIcon />}
                        iconBgColor="bg-primary/10 text-primary border-primary/20"
                    />
                     <StatCard 
                        title="الفواتير المستحقة"
                        value={unpaidInvoices}
                        icon={<InvoiceIcon />}
                        iconBgColor="bg-gold/10 text-gold border-gold/20"
                    />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Active Campaigns */}
                    <div className="bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg">
                        <h3 className="text-lg font-bold text-white mb-4">الحملات الإعلانية النشطة</h3>
                        {campaigns.length > 0 ? (
                            <div className="space-y-3">
                                {campaigns.map(c => (
                                    <div key={c.id} className="bg-light-bg p-3 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <p className="font-medium text-white">{c.platform} Campaign</p>
                                            <Badge color={c.status === 'active' ? 'green' : 'gray'}>{c.status}</Badge>
                                        </div>
                                        <p className="text-sm text-slate-400 mt-1">الميزانية: {c.budget.toLocaleString()} ج.م</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-slate-400 text-center py-4">لا توجد حملات نشطة حالياً.</p>}
                    </div>
                    
                    {/* Recent Files */}
                     <div className="bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg">
                        <h3 className="text-lg font-bold text-white mb-4">أحدث الملفات والتصميمات</h3>
                        {files.length > 0 ? (
                            <ul className="space-y-3">
                                {files.slice(0, 4).map(f => (
                                    <li key={f.id} className="flex items-center gap-3 bg-light-bg p-3 rounded-lg">
                                        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-accent/20 text-accent rounded-md">
                                            <DocumentIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-200 truncate">{f.file_name}</p>
                                            <p className="text-xs text-slate-500">{new Date(f.uploaded_at).toLocaleDateString('ar-EG')}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="text-slate-400 text-center py-4">لا توجد ملفات مرفوعة.</p>}
                    </div>

                     <div className="lg:col-span-2 bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg">
                        <h3 className="text-lg font-bold text-white mb-4">إجراءات سريعة</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button onClick={() => navigate('/client/requests')} className="block w-full text-center p-4 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition-colors">طلب جديد</button>
                            <button onClick={() => navigate('/client/invoices')} className="block w-full text-center p-4 bg-light-bg/50 text-slate-200 font-semibold rounded-lg hover:bg-light-bg transition-colors">عرض الفواتير</button>
                            <button onClick={() => navigate('/client/projects')} className="block w-full text-center p-4 bg-light-bg/50 text-slate-200 font-semibold rounded-lg hover:bg-light-bg transition-colors">عرض المشاريع</button>
                            <button onClick={() => navigate('/client/support')} className="block w-full text-center p-4 bg-light-bg/50 text-slate-200 font-semibold rounded-lg hover:bg-light-bg transition-colors">طلب دعم فني</button>
                        </div>
                    </div>
                </div>

            </div>
        </main>
        </>
    );
};

export default ClientDashboardPage;