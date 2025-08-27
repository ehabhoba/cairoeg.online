
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