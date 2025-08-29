
interface Ad {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
}

export const mockAds: Ad[] = [
    {
        title: 'أطلق متجرك الإلكتروني الآن',
        description: 'تصميم احترافي وسريع مع أفضل تجربة للمستخدم.',
        imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=200&h=200&fit=crop&q=80',
        link: '/services/web-design'
    },
    {
        title: 'تصميم هوية بصرية لا تُنسى',
        description: 'شعار إبداعي وتصميمات تعكس قصة علامتك التجارية.',
        imageUrl: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=200&h=200&fit=crop&q=80',
        link: '/services/graphic-design'
    },
    {
        title: 'حملات إعلانية تصل لجمهورك',
        description: 'استهداف دقيق ونتائج مضمونة على فيسبوك وجوجل.',
        imageUrl: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=200&h=200&fit=crop&q=80',
        link: '/services/marketing'
    }
];
