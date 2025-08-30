import React from 'react';

interface BreadcrumbsProps {
    items: { label: string; href?: string }[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-slate-400">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                        {index > 0 && <span className="text-slate-500">/</span>}
                        {item.href ? (
                            <a href={item.href} className="hover:text-primary transition-colors">{item.label}</a>
                        ) : (
                            <span className="font-semibold text-white">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
