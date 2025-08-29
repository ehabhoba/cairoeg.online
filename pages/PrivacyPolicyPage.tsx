

import React from 'react';
import { privacyPolicyContent } from '../data/siteData';
import SectionHeader from '../components/SectionHeader';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={privacyPolicyContent.title} />
        <div className="bg-slate-800/50 p-8 md:p-12 rounded-2xl border border-slate-700/50 space-y-8">
          <p className="text-sm text-slate-400">آخر تحديث: {privacyPolicyContent.lastUpdated}</p>
          {privacyPolicyContent.sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-2xl font-bold text-white mb-3">{section.title}</h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;