import React from 'react';
import { Search, ArrowRight, Zap, Target, Shield } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-full text-sm font-semibold mb-6">
            <Zap size={16} />
            <span>AI-Powered Job Automation</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
            Your Personal AI <br />
            <span className="text-brand-600">Recruitment Agent</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mb-8">
            Stop manually applying. Upload your resume, set your preferences, and let our autonomous AI agent find and apply to the perfect jobs for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <button 
              onClick={onLoginClick}
              className="flex-1 px-8 py-4 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-200 hover:bg-brand-700 hover:translate-y-[-2px] transition-all flex justify-center items-center gap-2"
            >
              Get Started
              <ArrowRight size={20} />
            </button>
            <button className="flex-1 px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              Browse Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Discovery</h3>
            <p className="text-slate-600">Our AI scans thousands of listings to find roles that match your specific skills and experience level.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Auto-Apply</h3>
            <p className="text-slate-600">The agent writes custom cover letters and submits applications on your behalf while you sleep.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Match Verification</h3>
            <p className="text-slate-600">Set your match threshold. The AI only applies if the job is a verified statistical fit.</p>
          </div>
        </div>
      </div>
      
      {/* Categories Mock */}
      <div className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Popular Categories</h2>
          <div className="flex flex-wrap gap-4">
            {['Engineering', 'Product Management', 'Design', 'Marketing', 'Sales', 'Data Science', 'Customer Success'].map(cat => (
              <span key={cat} className="px-6 py-3 bg-white border border-slate-200 rounded-full text-slate-600 font-medium hover:border-brand-300 hover:text-brand-600 cursor-pointer transition-colors">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};