import React from 'react';
import { services } from '../data/siteData';
import SpotlightCard from '../components/SpotlightCard';
import SectionHeader from '../components/SectionHeader';

// Icons
import { PaintBrushIcon } from '../components/icons/PaintBrushIcon';
import { MegaphoneIcon } from '../components/icons/MegaphoneIcon';
import { CodeBracketIcon } from '../components/icons/CodeBracketIcon';
import { GlobeIcon } from '../components/icons/GlobeIcon';
import { RocketLaunchIcon } from '../components/icons/RocketLaunchIcon';

const iconMap: { [key: string]: React.ReactNode } = {
    'ads': <MegaphoneIcon />,
    'design': <PaintBrushIcon />,
    'dev': <CodeBracketIcon />,
    'seo': <GlobeIcon />,
    'creation': <RocketLaunchIcon />,
};

const serviceLinks: { [id: string]: string } = {
    'ads': '#/services/marketing',
    'creation': '#/services/ad-creation',
    'design': '#/services/graphic-design',
    'dev': '#/services/web-design',
    'seo': '#/services/marketing',
};

const ServicesPage: React.FC = () => {
    return (
        <div className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader 
                    title="خدماتنا الاحترافية"
                    subtitle="من الاستراتيجية إلى التنفيذ، نقدم كل ما تحتاجه للتميز في العالم الرقمي."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map(service => (
                        <SpotlightCard 
                            key={service.id} 
                            title={service.title}
                            description={service.description}
                            link={serviceLinks[service.id]}
                            icon={iconMap[service.id]}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
