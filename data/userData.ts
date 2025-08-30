
export interface User {
    name: string;
    phone: string;
    password: string;
    role: 'admin' | 'client';
    bio: string;
    companyName?: string;
    websiteUrl?: string;
    logoUrl?: string;
}

const USERS_DB_KEY = 'cairoeg-users';

// --- Database Simulation ---
const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));


// Seed the database with a default admin if it doesn't exist
export const initializeUsers = (): void => {
    if (!localStorage.getItem(USERS_DB_KEY)) {
        const adminUser: User = {
            name: 'المدير العام',
            phone: '01022679250',
            password: 'admin',
            role: 'admin',
            bio: 'مؤسس منصة إعلانات القاهرة وخبير استراتيجي في التسويق الرقمي.',
            companyName: 'إعلانات القاهرة',
            websiteUrl: 'https://cairoeg.online',
            logoUrl: 'https://i.postimg.cc/1RN16091/image.png'
        };
        const initialClient: User = {
            name: 'عميل تجريبي',
            phone: '01234567890',
            password: 'password',
            role: 'client',
            bio: 'عميل تجريبي لاستكشاف المنصة.',
            companyName: 'الشركة التجريبية',
            websiteUrl: 'https://example.com',
            logoUrl: '',
        };
        localStorage.setItem(USERS_DB_KEY, JSON.stringify([adminUser, initialClient]));
    }
};

const getUsers = async (): Promise<User[]> => {
    await simulateDelay(50);
    const usersJson = localStorage.getItem(USERS_DB_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
};

const saveUsers = async (users: User[]): Promise<void> => {
    await simulateDelay(50);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
};

export const findUserByPhone = async (phone: string): Promise<User | undefined> => {
    const users = await getUsers();
    return users.find(user => user.phone === phone);
};

export const addUser = async (newUser: User): Promise<void> => {
    const users = await getUsers();
    users.push(newUser);
    await saveUsers(users);
};

export const updateUser = async (updatedUser: User): Promise<void> => {
    let users = await getUsers();
    users = users.map(user => user.phone === updatedUser.phone ? updatedUser : user);
    await saveUsers(users);
};

export const getAllClients = async (): Promise<User[]> => {
    const users = await getUsers();
    return users.filter(user => user.role === 'client');
};
