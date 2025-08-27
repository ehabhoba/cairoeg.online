
import React from 'react';
import { teamMembers, whyChooseUsPoints } from '../data/siteData';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { LinkedInIcon } from '../components/icons/LinkedInIcon';

const AboutPage: React.FC = () => {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            عن إعلانات القاهرة
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-slate-400">
            نحن أكثر من مجرد وكالة تسويق، نحن شريك نجاحك الرقمي الذي يمكنك الاعتماد عليه.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-right">
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 animate-slide-in-right">
                <h2 className="text-3xl font-bold text-white mb-4">رؤيتنا</h2>
                <p className="text-slate-300 leading-relaxed">
                    أن نصبح الشريك الرقمي الأول لنجاح الأعمال عبر الإنترنت في القاهرة ومصر كلها، من خلال تقديم حلول تسويقية مبتكرة وفعالة تحقق نتائج حقيقية.
                </p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 animate-slide-in-left">
                <h2 className="text-3xl font-bold text-white mb-4">رسالتنا</h2>
                <p className="text-slate-300 leading-relaxed">
                    تقديم خدمات تسويق إلكتروني وإعلانات رقمية شاملة بتقنيات حديثة، تجعل العميل واثقًا أن استثماره الإعلاني في أيدٍ أمينة وقادر على تحقيق النمو المستدام.
                </p>
            </div>
        </div>

        <div className="mt-20">
            <h2 className="text-3xl font-bold text-white text-center mb-10">فريقنا.. قوتنا الحقيقية</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                    <div key={index} className="group relative flex flex-col items-center bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 text-center transition-all duration-300 hover:-translate-y-2 animate-slide-in-up" style={{animationDelay: `${index * 100}ms`}}>
                        <img src={member.imageUrl} alt={member.name} className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-slate-700 group-hover:border-primary transition-colors" />
                        <h3 className="font-bold text-white text-lg">{member.name}</h3>
                        <p className="text-primary mb-4">{member.role}</p>
                        <p className="text-slate-400 text-sm flex-grow">{member.bio}</p>
                         <div className="mt-4 flex gap-3">
                            {member.social.linkedin && (
                                <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white"><LinkedInIcon className="w-5 h-5" /></a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        <div className="mt-20">
            <h2 className="text-3xl font-bold text-white text-center mb-10">لماذا تختارنا؟</h2>
             <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {whyChooseUsPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-4 p-4">
                        <CheckCircleIcon className="w-7 h-7 text-primary flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-white text-lg">{point.title}</h3>
                            <p className="text-slate-400">{point.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
