import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { StorePolicy } from '../types';

interface LegalPageProps {
  policy: StorePolicy;
  onBack: () => void;
  highContrast: boolean;
}

export const LegalPage: React.FC<LegalPageProps> = ({ policy, onBack, highContrast }) => {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 text-left">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a loja
      </button>

      <article className={`rounded-3xl border p-6 md:p-10 shadow-sm ${
        highContrast ? 'bg-black text-yellow-300 border-yellow-400' : 'bg-white text-slate-800 border-slate-200'
      }`}>
        <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-indigo-600">Indigo White</p>
            <h1 className="text-3xl font-black tracking-tight">{policy.title}</h1>
            <p className="text-xs opacity-70 mt-1">Ultima atualizacao: {policy.updatedAt}</p>
          </div>
        </div>

        <div className="mt-8 space-y-7">
          {policy.sections.map((section) => (
            <section key={section.heading} className="space-y-2">
              <h2 className="text-lg font-black">{section.heading}</h2>
              <p className="text-sm leading-relaxed opacity-85">{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
};
