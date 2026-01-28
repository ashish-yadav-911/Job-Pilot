import React from 'react';
import { User, Briefcase } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: 'candidate' | 'employer') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Choose your path</h2>
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
        <button 
          onClick={() => onLogin('candidate')}
          className="group relative bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-brand-500 transition-all text-left hover:shadow-xl"
        >
          <div className="bg-brand-50 w-16 h-16 rounded-full flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
            <User size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">I'm a Candidate</h3>
          <p className="text-slate-500">I want to find jobs, upload my resume, and let AI apply for me.</p>
        </button>

        <button 
          onClick={() => onLogin('employer')}
          className="group relative bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-purple-500 transition-all text-left hover:shadow-xl"
        >
          <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
            <Briefcase size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">I'm an Employer</h3>
          <p className="text-slate-500">I want to post jobs, manage requirements, and see AI-ranked applicants.</p>
        </button>
      </div>
    </div>
  );
};