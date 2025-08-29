import React from 'react';

interface ServicePageLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

const ServicePageLayout: React.FC<ServicePageLayoutProps> = ({ title, subtitle, children }) => {
    return (
        <div className="bg-dark-bg text-slate-300">
            {/* Hero Section */}
            <div className="relative py-24 sm:py-32 px-4 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-dark-bg opacity-50"></div>
                <div className="absolute inset-0 bg-dark-bg/50"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl animate-fade-in">
                        {title}
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400 animate-fade-in" style={{animationDelay: '200ms'}}>
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </div>
    );
};

export default ServicePageLayout;