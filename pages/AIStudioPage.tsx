
import React from 'react';
import { BrainCircuitIcon } from '../components/icons/BrainCircuitIcon';

const AIStudioPage: React.FC = () => {
  return (
    <main className="flex-1 bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-block bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6">
            <BrainCircuitIcon className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">استوديو الذكاء الاصطناعي</h1>
        <p className="text-lg text-slate-500">
          هذه الميزة قيد التطوير حالياً.
        </p>
      </div>
    </main>
  );
};

export default AIStudioPage;
