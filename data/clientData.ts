
export interface ClientProject {
    id: string;
    clientPhone: string;
    name: string;
    status: 'قيد التنفيذ' | 'مكتمل' | 'متوقف';
    startDate: string;
    dueDate: string;
}

export interface ClientInvoice {
    id: string;
    clientPhone: string;
    issueDate: string;
    amount: number;
    status: 'مدفوعة' | 'غير مدفوعة';
    items: { description: string; amount: number }[];
}

const PROJECTS_DB_KEY = 'cairoeg-client-projects';
const INVOICES_DB_KEY = 'cairoeg-client-invoices';

// --- Database Simulation ---
const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Initialization ---
export const initializeClientData = (): void => {
    if (!localStorage.getItem(PROJECTS_DB_KEY)) {
        const initialProjects: ClientProject[] = [
             { id: 'PROJ-001', clientPhone: '01234567890', name: 'حملة إعلانية لرمضان', status: 'مكتمل', startDate: '2024-03-01', dueDate: '2024-04-10' },
             { id: 'PROJ-002', clientPhone: '01234567890', name: 'تصميم هوية بصرية جديدة', status: 'قيد التنفيذ', startDate: '2024-04-15', dueDate: '2024-05-05' },
        ];
        localStorage.setItem(PROJECTS_DB_KEY, JSON.stringify(initialProjects));
    }
     if (!localStorage.getItem(INVOICES_DB_KEY)) {
        const initialInvoices: ClientInvoice[] = [
            { id: 'INV-2024-050', clientPhone: '01234567890', issueDate: '2024-03-01', amount: 15000, status: 'مدفوعة', items: [{description: 'حملة رمضان', amount: 15000}] },
            { id: 'INV-2024-051', clientPhone: '01234567890', issueDate: '2024-04-15', amount: 8000, status: 'غير مدفوعة', items: [{description: 'دفعة أولى هوية بصرية', amount: 8000}] },
        ];
        localStorage.setItem(INVOICES_DB_KEY, JSON.stringify(initialInvoices));
    }
};

// --- Projects Management ---
const getProjects = async (): Promise<ClientProject[]> => {
    await simulateDelay(100);
    const projectsJson = localStorage.getItem(PROJECTS_DB_KEY);
    return projectsJson ? JSON.parse(projectsJson) : [];
};

const saveProjects = async (projects: ClientProject[]): Promise<void> => {
    await simulateDelay(100);
    localStorage.setItem(PROJECTS_DB_KEY, JSON.stringify(projects));
};

export const getProjectsByClient = async (clientPhone: string): Promise<ClientProject[]> => {
    const allProjects = await getProjects();
    return allProjects.filter(p => p.clientPhone === clientPhone);
};

export const addProject = async (project: ClientProject): Promise<void> => {
    const projects = await getProjects();
    projects.push(project);
    await saveProjects(projects);
};

export const updateProject = async (updatedProject: ClientProject): Promise<void> => {
    let projects = await getProjects();
    projects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    await saveProjects(projects);
};


// --- Invoices Management ---
const getInvoices = async (): Promise<ClientInvoice[]> => {
    await simulateDelay(100);
    const invoicesJson = localStorage.getItem(INVOICES_DB_KEY);
    return invoicesJson ? JSON.parse(invoicesJson) : [];
};

const saveInvoices = async (invoices: ClientInvoice[]): Promise<void> => {
    await simulateDelay(100);
    localStorage.setItem(INVOICES_DB_KEY, JSON.stringify(invoices));
};

export const getInvoicesByClient = async (clientPhone: string): Promise<ClientInvoice[]> => {
    const allInvoices = await getInvoices();
    return allInvoices.filter(i => i.clientPhone === clientPhone);
};

export const addInvoice = async (invoice: ClientInvoice): Promise<void> => {
    const invoices = await getInvoices();
    invoices.push(invoice);
    await saveInvoices(invoices);
};

export const updateInvoice = async (updatedInvoice: ClientInvoice): Promise<void> => {
    let invoices = await getInvoices();
    invoices = invoices.map(i => i.id === updatedInvoice.id ? updatedInvoice : i);
    await saveInvoices(invoices);
};
