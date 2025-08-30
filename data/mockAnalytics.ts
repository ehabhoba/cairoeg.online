
export const kpiData = [
    {
        title: 'إجمالي الإيرادات',
        value: '125,000 ج.م',
        change: '+12.5% عن الشهر الماضي',
        changeType: 'increase' as 'increase' | 'decrease' | 'neutral',
        icon: 'Revenue'
    },
    {
        title: 'العملاء الجدد',
        value: '42',
        change: '+5 عن الشهر الماضي',
        changeType: 'increase' as 'increase' | 'decrease' | 'neutral',
        icon: 'Clients'
    },
    {
        title: 'معدل التحويل',
        value: '4.8%',
        change: '-0.2% عن الشهر الماضي',
        changeType: 'decrease' as 'increase' | 'decrease' | 'neutral',
        icon: 'Conversion'
    }
];

export const monthlyRevenue = [
    { month: 'يناير', revenue: 15000 },
    { month: 'فبراير', revenue: 18000 },
    { month: 'مارس', revenue: 22000 },
    { month: 'أبريل', revenue: 19000 },
    { month: 'مايو', revenue: 25000 },
    { month: 'يونيو', revenue: 28000 },
];

export const recentActivities = [
    {
        id: 1,
        description: 'تم إطلاق حملة إعلانية جديدة على فيسبوك.',
        timestamp: 'منذ 3 ساعات',
        icon: 'Campaign'
    },
    {
        id: 2,
        description: 'تم إكمال مهمة "تصميم هوية بصرية لشركة XYZ".',
        timestamp: 'منذ 8 ساعات',
        icon: 'Task'
    },
    {
        id: 3,
        description: 'سجل العميل "أحمد محمود" دخوله إلى المنصة.',
        timestamp: 'بالأمس',
        icon: 'Clients'
    },
     {
        id: 4,
        description: 'تقرير الأداء الأسبوعي جاهز للعرض.',
        timestamp: 'منذ يومين',
        icon: 'Task'
    }
];


export const campaignPerformance = [
    { id: 1, name: 'حملة الصيف 2024', platform: 'فيسبوك', spend: 12000, conversions: 150, status: 'نشطة' as 'نشطة' | 'متوقفة' },
    { id: 2, name: 'إعلانات البحث عن خدمات SEO', platform: 'جوجل', spend: 8500, conversions: 45, status: 'نشطة' as 'نشطة' | 'متوقفة' },
    { id: 3, name: 'حملة رمضان', platform: 'انستغرام', spend: 15000, conversions: 210, status: 'متوقفة' as 'نشطة' | 'متوقفة' },
    { id: 4, name: 'حملة توعية بالبراند', platform: 'تيك توك', spend: 5000, conversions: 8, status: 'نشطة' as 'نشطة' | 'متوقفة' },
];

export const recentSignups = [
    { id: 1, name: 'علي حسن', joinDate: '2024-07-20' },
    { id: 2, name: 'نور خالد', joinDate: '2024-07-19' },
    { id: 3, name: 'ياسين محمد', joinDate: '2024-07-18' },
    { id: 4, name: 'جنى إبراهيم', joinDate: '2024-07-16' },
];