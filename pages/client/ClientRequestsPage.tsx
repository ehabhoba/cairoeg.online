
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { addRequest, getRequestsByClient, ClientRequest, RequestStatus } from '../../data/requestsData';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';

type Tab = 'new' | 'history';

const NewRequestForm: React.FC<{ onFormSubmit: () => void }> = ({ onFormSubmit }) => {
    const { currentUser } = useAuth();
    const addNotification = useNotification();
    const [requestType, setRequestType] = useState<'campaign' | 'design'>('campaign');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        
        setIsLoading(true);
        try {
            let details = { title, description };
            if (requestType === 'campaign') {
                Object.assign(details, { budget });
            }
            await addRequest({
                clientPhone: currentUser.phone,
                type: requestType,
                details
            });
            addNotification('نجاح!', 'تم إرسال طلبك بنجاح.', 'success');
            setTitle('');
            setDescription('');
            setBudget('');
            onFormSubmit();
        } catch (error) {
            addNotification('خطأ', 'فشل إرسال الطلب.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-slate-300">نوع الطلب</label>
                <select value={requestType} onChange={e => setRequestType(e.target.value as any)} className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg shadow-sm focus:ring-primary focus:border-primary">
                    <option value="campaign">حملة إعلانية</option>
                    <option value="design">تصميم</option>
                </select>
            </div>
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-300">عنوان الطلب</label>
                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg shadow-sm focus:ring-primary focus:border-primary" placeholder="مثال: حملة إعلانية لمنتج جديد" />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300">الوصف الكامل للطلب</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={5} className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg shadow-sm focus:ring-primary focus:border-primary" placeholder="يرجى ذكر جميع التفاصيل الهامة..."></textarea>
            </div>
            {requestType === 'campaign' && (
                <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-slate-300">الميزانية المقترحة (بالجنيه المصري)</label>
                    <input type="number" id="budget" value={budget} onChange={e => setBudget(e.target.value)} className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg shadow-sm focus:ring-primary focus:border-primary" placeholder="مثال: 5000" />
                </div>
            )}
             <div className="pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center items-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-dark disabled:opacity-50"
                >
                    {isLoading ? <LoadingSpinner /> : 'إرسال الطلب'}
                </button>
            </div>
        </form>
    );
};

const RequestHistory: React.FC = () => {
    const { currentUser } = useAuth();
    const [requests, setRequests] = useState<ClientRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const getBadgeColor = (status: RequestStatus) => {
        switch (status) {
            case 'مكتمل': return 'green';
            case 'قيد التنفيذ': return 'blue';
            case 'قيد المراجعة': return 'yellow';
            case 'ملغي': return 'red';
            default: return 'gray';
        }
    };

    useEffect(() => {
        if(currentUser) {
            const fetchHistory = async () => {
                setLoading(true);
                const clientRequests = await getRequestsByClient(currentUser.phone);
                setRequests(clientRequests);
                setLoading(false);
            };
            fetchHistory();
        }
    }, [currentUser]);

    return (
        <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-light-bg/50 text-slate-400">
                  <tr>
                    <th scope="col" className="p-4 font-semibold">عنوان الطلب</th>
                    <th scope="col" className="p-4 font-semibold">النوع</th>
                    <th scope="col" className="p-4 font-semibold">الحالة</th>
                    <th scope="col" className="p-4 font-semibold">تاريخ الطلب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/10">
                    {loading ? (
                        <tr><td colSpan={4} className="text-center p-4 text-slate-400">جاري تحميل السجل...</td></tr>
                    ) : requests.length > 0 ? (
                        requests.map((req) => (
                            <tr key={req.id}>
                                <td className="p-4 font-medium text-white">{req.details.title}</td>
                                <td className="p-4 text-slate-300">{req.type === 'campaign' ? 'حملة إعلانية' : 'تصميم'}</td>
                                <td className="p-4"><Badge color={getBadgeColor(req.status)}>{req.status}</Badge></td>
                                <td className="p-4 text-slate-400">{new Date(req.timestamp).toLocaleDateString('ar-EG')}</td>
                            </tr>
                        ))
                    ) : (
                         <tr><td colSpan={4} className="text-center p-8 text-slate-400">لا يوجد طلبات سابقة.</td></tr>
                    )}
                </tbody>
              </table>
        </div>
    );
};

const ClientRequestsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('new');
    
    // This key is used to force re-render of history tab after new submission
    const [historyKey, setHistoryKey] = useState(Date.now()); 
    const handleFormSubmit = () => {
        setActiveTab('history');
        setHistoryKey(Date.now());
    };

    return (
        <main className="flex-1 bg-dark-bg p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">طلباتي</h1>
                <div className="bg-panel-bg rounded-2xl border border-slate-100/10 shadow-lg">
                    <div className="border-b border-slate-700 flex">
                        <button onClick={() => setActiveTab('new')} className={`px-4 py-2 font-semibold ${activeTab === 'new' ? 'text-primary border-b-2 border-primary' : 'text-slate-400'}`}>طلب جديد</button>
                        <button onClick={() => setActiveTab('history')} className={`px-4 py-2 font-semibold ${activeTab === 'history' ? 'text-primary border-b-2 border-primary' : 'text-slate-400'}`}>سجل الطلبات</button>
                    </div>
                    <div className="p-6">
                        {activeTab === 'new' ? <NewRequestForm onFormSubmit={handleFormSubmit} /> : <RequestHistory key={historyKey} />}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ClientRequestsPage;
