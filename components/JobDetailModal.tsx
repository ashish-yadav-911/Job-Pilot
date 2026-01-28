import React from 'react';
import { Job } from '../types';
import { X, MapPin, DollarSign, Clock, Building, Briefcase, Calendar } from 'lucide-react';

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{job.title}</h2>
            <div className="flex items-center gap-2 text-slate-600 mt-1 font-medium">
              <Building size={18} />
              <span>{job.company}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          
          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-slate-500 text-xs uppercase font-bold mb-1 flex items-center gap-1"><MapPin size={12}/> Location</div>
              <div className="font-semibold text-slate-900 text-sm">{job.location}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-green-600 text-xs uppercase font-bold mb-1 flex items-center gap-1"><DollarSign size={12}/> Salary</div>
              <div className="font-semibold text-green-700 text-sm">{job.salaryRange}</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-blue-600 text-xs uppercase font-bold mb-1 flex items-center gap-1"><Briefcase size={12}/> Exp</div>
              <div className="font-semibold text-blue-700 text-sm">{job.experienceRequired} Years</div>
            </div>
             <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-purple-600 text-xs uppercase font-bold mb-1 flex items-center gap-1"><Calendar size={12}/> Notice</div>
              <div className="font-semibold text-purple-700 text-sm">
                {typeof job.noticePeriod === 'number' ? `${job.noticePeriod} Days` : job.noticePeriod}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-slate-900 mb-3 text-lg">Job Description</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>

          {/* Tags & Requirements */}
          <div>
             <h3 className="font-bold text-slate-900 mb-3 text-lg">Skills & Tags</h3>
             <div className="flex flex-wrap gap-2 mb-4">
               {job.tags.map((tag, i) => (
                 <span key={i} className="px-3 py-1 bg-brand-50 text-brand-700 font-medium rounded-full text-sm border border-brand-100">
                   {tag}
                 </span>
               ))}
             </div>
             
             <h4 className="font-bold text-slate-700 mb-2 text-sm uppercase">Key Requirements</h4>
             <ul className="list-disc list-inside space-y-1 text-slate-600">
               {job.requirements.map((req, i) => (
                 <li key={i}>{req}</li>
               ))}
             </ul>
          </div>

           {/* Custom Questions Preview */}
           {job.customQuestions.length > 0 && (
             <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
               <h3 className="font-bold text-yellow-800 mb-2 text-sm flex items-center gap-2">
                 Additional Questions Required
               </h3>
               <ul className="list-disc list-inside text-sm text-yellow-700">
                 {job.customQuestions.map(q => (
                   <li key={q.id}>{q.question} {q.required && '(Required)'}</li>
                 ))}
               </ul>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};