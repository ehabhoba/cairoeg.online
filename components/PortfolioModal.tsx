import React, { useEffect } from 'react';
import { PortfolioItem } from '../data/siteData';
import { XIcon } from './icons/XIcon';

interface PortfolioModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: PortfolioItem | null;
}

const categoryToServiceLink: { [key: string]: string } = {
    'إعلانات ممولة': '/services/marketing',
    'تصميم جرافيكي': '/services/graphic-design',
    'تصميم مواقع': '/services/web-design',
    'SEO': '/services/marketing',
};

const PortfolioModal: React.FC<PortfolioModalProps> = ({ isOpen, onClose, item }) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!isOpen || !item) return null;

    const serviceLink = categoryToServiceLink[item.category];

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 text-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-700 m-4 animate-modal-enter"
                onClick={e => e.stopPropagation()}
            >
                <div className="relative">
                     <img src={item.imageUrl.replace('w=400&h=300', 'w=800&h=600')} alt={item.title} className="w-full h-64 md:h-80 object-cover rounded-t-2xl" />
                     <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors">
                        <XIcon className="w-6 h-6" />
                     </button>
                </div>
                <div className="p-8">
                    <p className="text-sm font-semibold text-primary mb-1">{item.category}</p>
                    <h2 className="text-3xl font-bold text-white mb-4">{item.title}</h2>
                    <p className="text-slate-300 leading-relaxed mb-6">{item.description}</p>
                    {serviceLink && (
                        <a 
                            href={serviceLink} 
                            onClick={onClose}
                            className="inline-block px-6 py-2 bg-primary/20 text-primary-light font-semibold rounded-lg border border-primary/30 hover:bg-primary/40 transition-colors"
                        >
                            عرض تفاصيل الخدمة
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PortfolioModal;
