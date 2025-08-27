
export interface ClientProject {
    id: string;
    name: string;
    status: 'قيد التنفيذ' | 'مكتمل' | 'متوقف';
    startDate: string;
    dueDate: string;
}

export interface ClientInvoice {
    id: string;
    issueDate: string;
    amount: number;
    status: 'مدفوعة' | 'غير مدفوعة';
}


export const clientProjects: ClientProject[] = [
    { id: 'PROJ-001', name: 'حملة إعلانية لرمضان', status: 'مكتمل', startDate: '2024-03-01', dueDate: '2024-04-10' },
    { id: 'PROJ-002', name: 'تصميم هوية بصرية جديدة', status: 'مكتمل', startDate: '2024-04-15', dueDate: '2024-05-05' },
    { id: 'PROJ-003', name: 'تطوير متجر إلكتروني', status: 'قيد التنفيذ', startDate: '2024-05-10', dueDate: '2024-07-20' },
    { id: 'PROJ-004', name: 'تحسين SEO للموقع', status: 'قيد التنفيذ', startDate: '2024-06-01', dueDate: '2024-08-30' },
];

export const clientInvoices: ClientInvoice[] = [
    { id: 'INV-2024-050', issueDate: '2024-03-01', amount: 15000, status: 'مدفوعة' },
    { id: 'INV-2024-051', issueDate: '2024-04-15', amount: 8000, status: 'مدفوعة' },
    { id: 'INV-2024-052', issueDate: '2024-05-10', amount: 25000, status: 'غير مدفوعة' },
    { id: 'INV-2024-053', issueDate: '2024-06-01', amount: 7500, status: 'غير مدفوعة' },
];
