
import React, { useState, useEffect, useCallback } from 'react';
import { ClientRequest, getAllRequests, updateRequestStatus, RequestStatus } from '../../data/requestsData';
import { useNotification } from '../../hooks/useNotification';
import Badge from '../../components/Badge';

const RequestsManagerPage: React.FC = () => {
    const [requests, setRequests] = useState<ClientRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const addNotification = useNotification();

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const allRequests = await getAllRequests();
            setRequests(allRequests);
        } catch (error) {
            addNotification('خطأ', 'فشل في تحميل الطلبات', 'error');
        } finally {
            setLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleStatusChange = async (id: number, status: RequestStatus, clientPhone: string) => {
        try {
            await updateRequestStatus(id, status, clientPhone);
            addNotification('نجاح!', `تم تحديث حالة الطلب بنجاح.`, 'success');
            fetchRequests();
        } catch (error) {
            addNotification('خطأ', 'فشل في تحديث حالة الطلب.', 'error');
        }
    };
    
    const getBadgeColor = (status: RequestStatus) => {
        switch (status) {
            case 'مكتمل': return 'green';
            case 'قيد التنفيذ': return 'blue';
            case 'قيد المراجعة': return 'yellow';
            case 'ملغي': return 'red';
            default: return 'gray';
        }
    };

    return (
        <main className="flex-1 bg-dark-bg p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">إدارة طلبات العملاء</h1>
                
                <div className="bg-panel-bg rounded-2xl border border-slate-100/10 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right">
                            <thead className="bg-light-bg/50 text-slate-400">
                                <tr>
                                    <th scope="col" className="p-4 font-semibold">عنوان الطلب</th>
                                    <th scope="col" className="p-4 font-semibold">العميل (الهاتف)</th>
                                    <th scope="col" className="p-4 font-semibold">النوع</th>
                                    <th scope="col" className="p-4 font-semibold">الحالة</th>
                                    <th scope="col" className="p-4 font-semibold">تاريخ الطلب</th>
                                    <th scope="col" className="p-4 font-semibold">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/10">
                                {loading ? (
                                    <tr><td colSpan={6} className="p-4 text-center text-slate-400">جاري تحميل الطلبات...</td></tr>
                                ) : requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-light-bg/30">
                                        <td className="p-4 font-medium text-white max-w-xs truncate">{req.details.title}</td>
                                        <td className="p-4 text-slate-400">{req.clientPhone}</td>
                                        <td className="p-4 text-slate-300">{req.type === 'campaign' ? 'حملة إعلانية' : 'تصميم'}</td>
                                        <td className="p-4">
                                            <Badge color={getBadgeColor(req.status)}>{req.status}</Badge>
                                        </td>
                                        <td className="p-4 text-slate-400">{new Date(req.timestamp).toLocaleDateString('ar-EG')}</td>
                                        <td className="p-4 space-x-2 whitespace-nowrap">
                                            <select 
                                                value={req.status} 
                                                onChange={(e) => handleStatusChange(req.id, e.target.value as RequestStatus, req.clientPhone)}
                                                className="bg-slate-700 text-white text-xs rounded-md p-1 border border-slate-600 focus:ring-primary focus:border-primary"
                                            >
                                                <option value="قيد المراجعة">قيد المراجعة</option>
                                                <option value="قيد التنفيذ">قيد التنفيذ</option>
                                                <option value="مكتمل">مكتمل</option>
                                                <option value="ملغي">ملغي</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default RequestsManagerPage;
