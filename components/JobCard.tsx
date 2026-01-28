import React, { useState } from 'react';
import { Job, ApplicationStatus } from '../types';
import { MapPin, DollarSign, Clock, Building, Cpu, AlertCircle, CheckCircle } from 'lucide-react';
import { JobDetailModal } from './JobDetailModal';

interface JobCardProps {
  job: Job;
  status?: ApplicationStatus;
  isApplying?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, status, isApplying }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
        {isApplying && (
          <div className="absolute inset-0 bg-brand-50/90 backdrop-blur-[1px] flex items-center justify-center z-10 border-2 border-brand-200 rounded-xl">
             <div className="flex flex-col items-center gap-2 animate-pulse">
               <Cpu className="text-brand-600 h-8 w-8 animate-spin" />
               <span className="text-brand-700 font-medium">AI Agent Working...</span>
             </div>
          </div>
        )}
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{job.title}</h3>
            <div className="flex items-center gap-2 text-slate-600 mt-1">
              <Building size={16} />
              <span>{job.company}</span>
            </div>
          </div>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
            {job.type}
          </span>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.tags.slice(0, 4).map((tag, i) => (
             <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded border border-slate-200">
               {tag}
             </span>
          ))}
          {job.tags.length > 4 && <span className="text-xs text-slate-400">+{job.tags.length - 4}</span>}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-6">
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            {job.location}
          </div>
          <div className="flex items-center gap-1">
            <DollarSign size={16} />
            {job.salaryRange}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            {job.postedAt}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {status === ApplicationStatus.APPLIED && (
              <span className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-md border border-green-200">
                <CheckCircle size={12} /> Applied
              </span>
            )}
            {status === ApplicationStatus.NEEDS_INPUT && (
               <span className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-md border border-yellow-200">
                <AlertCircle size={12} /> Needs Input
              </span>
            )}
            {status === ApplicationStatus.PENDING && (
              <span className="text-xs text-slate-400">Waiting for Agent...</span>
            )}
          </div>

          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors text-sm"
          >
            View Details
          </button>
        </div>
      </div>

      {showModal && <JobDetailModal job={job} onClose={() => setShowModal(false)} />}
    </>
  );
};