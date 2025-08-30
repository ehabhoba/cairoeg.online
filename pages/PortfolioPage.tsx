import React, { useState, useEffect } from 'react';
import { getPublicPortfolioClients } from '../data/portfolioData';
import { User } from '../data/userData';
import SkeletonCard from '../components/SkeletonCard';
import SectionHeader from '../components/SectionHeader';

const PortfolioPage: React.FC = () => {
    const [clients, setClients] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            const portfolioClients = await getPublicPortfolioClients();
            setClients(portfolioClients);
            setLoading(false);
        };
        fetchClients();
    }, []);

    return (
        <div className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader 
                    title="معرض أعمالنا"
                    subtitle="نظرة على بعض المشاريع التي نفخر بها والتي ساهمت في نجاح عملائنا."
                />

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
                    ) : clients.length > 0 ? (
                        clients.map(client => (
                            <a
                                key={client.id}
                                href={`/portfolio/${client.phone}`}
                                className="group relative block bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                                <img 
                                    src={client.logoUrl || `https://source.unsplash.com/400x300/?business,office&random=${client.id}`} 
                                    alt={client.name} 
                                    className="w-full h-60 object-cover transform group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                                    <h3 className="text-lg font-bold text-white">{client.name}</h3>
                                    <p className="text-sm text-primary">عرض دراسة الحالة</p>
                                </div>
                            </a>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16">
                           <p className="text-slate-400 text-lg">لا توجد أعمال لعرضها حاليًا. تفقد مجددًا قريبًا!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PortfolioPage;
