
import React from 'react';
import { SystemRequirement } from '../types';

interface Props {
  req: SystemRequirement;
  onUpdate: (id: string, description: string) => void;
  onRemove: (id: string) => void;
}

const RequirementCard: React.FC<Props> = ({ req, onUpdate, onRemove }) => {
  const bgColor = {
    functional: 'bg-blue-50 border-blue-200',
    economic: 'bg-emerald-50 border-emerald-200',
    safety: 'bg-amber-50 border-amber-200'
  }[req.type];

  const labelColor = {
    functional: 'text-blue-700',
    economic: 'text-emerald-700',
    safety: 'text-amber-700'
  }[req.type];

  return (
    <div className={`p-4 rounded-xl border-2 mb-3 shadow-sm transition-all ${bgColor}`}>
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs font-bold uppercase tracking-wider ${labelColor}`}>
          {req.type} Requirement
        </span>
        <button 
          onClick={() => onRemove(req.id)}
          className="text-slate-400 hover:text-red-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <textarea
        className="w-full bg-white/50 border-none rounded-lg p-2 text-sm focus:ring-2 focus:ring-slate-300 resize-none h-20"
        value={req.description}
        onChange={(e) => onUpdate(req.id, e.target.value)}
        placeholder={`Define ${req.type} requirement...`}
      />
    </div>
  );
};

export default RequirementCard;
