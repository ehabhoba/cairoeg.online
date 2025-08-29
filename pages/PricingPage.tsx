
import React from 'react';
import { pricingPlans } from '../data/siteData';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';

const PricingPage: React.FC = () => {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            باقات أسعار مرنة
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400">
            اختر الباقة التي تناسب حجم أعمالك وأهدافك التسويقية.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border ${plan.isFeatured ? 'border-primary shadow-primary/20 shadow-2xl bg-slate-900' : 'border-slate-700/50 bg-slate-800/50'} p-8 shadow-lg transition-transform duration-300 hover:scale-105`}
            >
              {plan.isFeatured && (
                <p className="absolute -top-3 right-8 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
                  الأكثر شيوعًا
                </p>
              )}
              <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
              <p className="mt-4 text-slate-400 min-h-[40px]">{plan.description}</p>
              <p className="mt-6 text-4xl font-extrabold text-white">{plan.price}</p>
              
              <a
                href="/contact"
                className={`mt-8 block w-full text-center rounded-xl py-3 px-6 text-base font-semibold transition-all ${plan.isFeatured ? 'bg-primary text-white hover:bg-primary/90' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
              >
                {plan.name === 'الباقة الاحترافية' ? 'تواصل معنا' : 'اطلب الباقة'}
              </a>
               {plan.isFeatured && (
                <div className="text-center mt-4">
                    <a href="/contact" className="text-sm text-slate-400 hover:text-white">لديك أسئلة؟ تواصل معنا</a>
                </div>
               )}

              <ul className="mt-8 space-y-4 text-sm text-slate-300">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 ml-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
