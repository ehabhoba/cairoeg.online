export interface Client {
    id: number;
    name: string;
    email: string;
    status: 'Active' | 'Inactive';
    joinDate: string;
}

export const mockClients: Client[] = [
    { id: 1, name: 'أحمد محمود', email: 'ahmed.mahmoud@example.com', status: 'Active', joinDate: '2023-05-12' },
    { id: 2, name: 'فاطمة علي', email: 'fatima.ali@example.com', status: 'Active', joinDate: '2023-03-20' },
    { id: 3, name: 'محمد حسن', email: 'mohamed.hassan@example.com', status: 'Inactive', joinDate: '2022-11-01' },
    { id: 4, name: 'سارة إبراهيم', email: 'sara.ibrahim@example.com', status: 'Active', joinDate: '2024-01-15' },
    { id: 5, name: 'خالد عبد الله', email: 'khaled.abdullah@example.com', status: 'Active', joinDate: '2023-08-30' },
    { id: 6, name: 'مريم مصطفى', email: 'mariam.mostafa@example.com', status: 'Inactive', joinDate: '2023-02-10' },
    { id: 7, name: 'يوسف جمال', email: 'youssef.gamal@example.com', status: 'Active', joinDate: '2024-02-05' },
];
