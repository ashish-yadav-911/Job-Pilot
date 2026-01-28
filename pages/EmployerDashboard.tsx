import React, { useState } from 'react';
import { Job, Application, ApplicationStatus } from '../types';
import { CreateJobForm } from '../components/CreateJobForm';
import { Users, FileText, CheckCircle, PlusCircle, Trash2, AlertCircle } from 'lucide-react';

interface EmployerDashboardProps {
  jobs: Job[];
  applications: Application[]; // Received from App state
  onAddJob: (job: Job) => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ jobs, applications, onAddJob }) => {
  const [isCreating, setIsCreating] = useState(false);

  // Calculate Real Stats
  const totalApplicants = applications.filter(a => a.status === ApplicationStatus.APPLIED).length;
  // Let's assume a "Verified Match" is any AI score > 80 (Simulated logic)
  const verifiedMatches = applications.filter(a => a.status === ApplicationStatus.APPLIED && a.aiMatchScore > 80).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Employer Dashboard</h1>
          <p className="text-slate-500">Manage jobs and review AI-screened applicants</p>
        </div>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors flex items-center gap-2 shadow-lg shadow-brand-200"
          >
            <PlusCircle size={20} />
            Post New Job
          </button>
        )}
      </div>

      {isCreating ? (
        <CreateJobForm 
          onJobCreated={(job) => {
            onAddJob(job);
            setIsCreating(false);
          }}
          onCancel={() => setIsCreating(false)}
        />
      ) : (
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{jobs.length}</p>
                  <p className="text-sm text-slate-500">Active Jobs</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{totalApplicants}</p>
                  <p className="text-sm text-slate-500">Total Applicants</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{verifiedMatches}</p>
                  <p className="text-sm text-slate-500">High Score Matches (>80%)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job List with Applicant Counts */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900">Your Posted Jobs</h3>
            </div>
            <div className="divide-y divide-slate-200">
              {jobs.map((job) => {
                const jobApplicants = applications.filter(a => a.jobId === job.id && a.status === ApplicationStatus.APPLIED);
                
                return (
                  <div key={job.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">{job.title}</h4>
                      <p className="text-slate-500 text-sm">{job.company} • {job.location}</p>
                      <div className="flex gap-2 mt-2">
                         <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">{job.type}</span>
                         <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">{job.salaryRange}</span>
                         {job.customQuestions.length > 0 && (
                           <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded border border-yellow-200 flex items-center gap-1">
                             <AlertCircle size={10} /> Has Custom Qs
                           </span>
                         )}
                      </div>
                      <div className="flex gap-1 mt-2">
                        {job.tags.map(t => (
                          <span key={t} className="text-[10px] text-slate-400 bg-slate-50 px-1 rounded border border-slate-100">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="text-right hidden sm:block">
                          <p className="text-2xl font-bold text-slate-900">{jobApplicants.length}</p>
                          <p className="text-xs text-slate-500">Applicants</p>
                       </div>
                       <button className="text-slate-300 hover:text-red-500 transition-colors p-2">
                         <Trash2 size={20} />
                       </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};