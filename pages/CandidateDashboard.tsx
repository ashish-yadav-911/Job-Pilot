import React, { useState, useCallback } from 'react';
import { Job, UserProfile, Application, AgentLog, ApplicationStatus } from '../types';
import { JobCard } from '../components/JobCard';
import { AgentConsole } from '../components/AgentConsole';
import { evaluateJobMatch } from '../services/geminiService';
import { Sparkles, Edit3, Save, Play, Square, Settings, Search, FileText, Bot, Upload, X, AlertTriangle, Plus } from 'lucide-react';
import { DEFAULT_RESUME } from '../constants';

interface CandidateDashboardProps {
  jobs: Job[];
  applications: Application[];
  onApply: (app: Application) => void;
  onUpdateApplication: (appId: string, updates: Partial<Application>) => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({ jobs, applications, onApply, onUpdateApplication }) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'profile' | 'agent'>('jobs');
  
  // Profile State
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Jane Doe',
    email: 'jane@example.com',
    resumeText: DEFAULT_RESUME,
    resumeFileName: undefined,
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    experienceYears: 4
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  // Agent State
  const [matchThreshold, setMatchThreshold] = useState(65);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const addLog = useCallback((message: string, type: AgentLog['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    }]);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfile(prev => ({ ...prev, resumeFileName: e.target.files![0].name }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput('');
    }
  };

  const removeSkill = (s: string) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(sk => sk !== s) }));
  };

  // --- CORE AGENT LOGIC ---
  const runAgent = async () => {
    if (isAgentRunning) return;
    setIsAgentRunning(true);
    setLogs([]); 
    addLog(`Agent initializing...`, 'info');
    
    // Step 1: Pre-Filtering
    addLog(`Phase 1: Filtering jobs based on Skills tags...`, 'action');
    await new Promise(r => setTimeout(r, 600));

    // Find jobs that haven't been applied to
    const unappliedJobs = jobs.filter(j => !applications.some(a => a.jobId === j.id));
    
    // Filter jobs where at least one tag matches the user's skills (Case insensitive)
    const relevantJobs = unappliedJobs.filter(job => {
      const jobTags = job.tags.map(t => t.toLowerCase());
      const userSkills = profile.skills.map(s => s.toLowerCase());
      const hasOverlap = jobTags.some(tag => userSkills.includes(tag));
      return hasOverlap;
    });

    if (relevantJobs.length === 0) {
      addLog(`No new relevant jobs found matching your skills. Try adding more skills.`, 'warning');
      setIsAgentRunning(false);
      return;
    }

    addLog(`Found ${relevantJobs.length} potential matches based on tags. Starting deep analysis...`, 'success');

    // Step 2: Deep Analysis
    for (const job of relevantJobs) {
      setActiveJobId(job.id);
      addLog(`Analyzing: ${job.title} at ${job.company}`, 'action');

      // Check Custom Questions FIRST
      if (job.customQuestions.length > 0) {
        addLog(`Job requires custom inputs. Saving for manual review.`, 'warning');
        
        const partialApp: Application = {
            id: Math.random().toString(36).substr(2, 9),
            jobId: job.id,
            jobTitle: job.title,
            company: job.company,
            status: ApplicationStatus.NEEDS_INPUT,
            aiMatchScore: 0, // Pending
            aiReasoning: "Paused: Awaiting user input for custom questions.",
            coverLetter: "",
            appliedAt: new Date().toLocaleDateString(),
            missingInfo: job.customQuestions
        };
        onApply(partialApp);
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }

      // If no custom questions, proceed with Gemini
      const result = await evaluateJobMatch(job, profile, matchThreshold);
      
      const statusLogType = result.matchScore >= matchThreshold ? 'success' : 'info';
      addLog(`Score: ${result.matchScore}/100. ${result.reason}`, statusLogType);

      if (result.matchScore >= matchThreshold) {
        addLog(`Match confirmed! Attaching resume: ${profile.resumeFileName || 'Default_Resume.pdf'}`, 'action');
        await new Promise(r => setTimeout(r, 1000));
        addLog(`Generating cover letter...`, 'action');
        await new Promise(r => setTimeout(r, 1000));
        
        const newApp: Application = {
          id: Math.random().toString(36).substr(2, 9),
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          status: ApplicationStatus.APPLIED,
          aiMatchScore: result.matchScore,
          aiReasoning: result.reason,
          coverLetter: result.draftCoverLetter,
          appliedAt: new Date().toLocaleDateString()
        };
        onApply(newApp);
        addLog(`Application submitted successfully.`, 'success');
      } else {
        addLog(`Skipping - below threshold.`, 'info');
      }
      
      await new Promise(r => setTimeout(r, 800));
    }
    setActiveJobId(null);
    addLog('Agent run complete.', 'info');
    setIsAgentRunning(false);
  };

  const actionRequiredApps = applications.filter(a => a.status === ApplicationStatus.NEEDS_INPUT);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'jobs' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Search size={18} /> Find Jobs
        </button>
        <button 
           onClick={() => setActiveTab('profile')}
           className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <FileText size={18} /> My Profile
        </button>
        <button 
           onClick={() => setActiveTab('agent')}
           className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'agent' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Bot size={18} /> AI Agent
        </button>
      </div>

      {/* View: Jobs */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
           {/* Action Required Section */}
           {actionRequiredApps.length > 0 && (
             <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
               <div className="flex items-center gap-2 text-yellow-800 font-bold mb-4">
                 <AlertTriangle size={20} />
                 <h2>Action Required</h2>
               </div>
               <div className="grid gap-4">
                 {actionRequiredApps.map(app => (
                   <div key={app.id} className="bg-white p-4 rounded-lg border border-yellow-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                     <div>
                       <h3 className="font-bold text-slate-900">{app.jobTitle}</h3>
                       <p className="text-sm text-slate-500">{app.company}</p>
                       <div className="mt-2 text-xs text-yellow-700 bg-yellow-100 inline-block px-2 py-1 rounded">
                         Missing: {app.missingInfo?.length} Questions
                       </div>
                     </div>
                     <button className="px-4 py-2 bg-yellow-100 text-yellow-800 font-medium rounded-lg hover:bg-yellow-200 transition-colors text-sm">
                       Complete Application
                     </button>
                   </div>
                 ))}
               </div>
             </div>
           )}

           <div className="flex items-center gap-2 bg-blue-50 p-4 rounded-lg text-blue-700 text-sm">
             <Sparkles size={16} />
             <span>The AI Agent uses your Profile Tags to find relevant jobs. Make sure your Skills are up to date!</span>
           </div>
           
           <div className="grid gap-4">
            {jobs.map(job => {
              const app = applications.find(a => a.jobId === job.id);
              return (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  status={app?.status}
                  isApplying={activeJobId === job.id}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* View: Profile */}
      {activeTab === 'profile' && (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Candidate Profile</h2>
            <button 
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium"
            >
              {isEditingProfile ? <Save size={18} /> : <Edit3 size={18} />}
              {isEditingProfile ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input 
                  disabled={!isEditingProfile}
                  type="text" 
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg disabled:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Years of Experience</label>
                <input 
                  disabled={!isEditingProfile}
                  type="number" 
                  value={profile.experienceYears} 
                  onChange={e => setProfile({...profile, experienceYears: parseInt(e.target.value)})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg disabled:text-slate-500"
                />
              </div>
            </div>

            {/* Skills Tag Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Skills & Tags</label>
              {isEditingProfile && (
                <div className="flex gap-2 mb-3">
                  <input 
                    className="flex-1 p-2 border border-slate-200 rounded-lg text-sm"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="e.g. React, Marketing, Design (Enter to add)"
                  />
                  <button onClick={addSkill} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"><Plus size={20}/></button>
                </div>
              )}
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg min-h-[50px] border border-slate-100">
                {profile.skills.map(skill => (
                  <span key={skill} className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-full text-sm shadow-sm">
                    {skill}
                    {isEditingProfile && <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => removeSkill(skill)} />}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">These tags are used by the AI Agent to filter relevant jobs.</p>
            </div>

            {/* Resume Upload */}
             <div>
               <label className="block text-sm font-semibold text-slate-700 mb-2">Resume / CV</label>
               <div className="flex items-center gap-4">
                 <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors ${!isEditingProfile ? 'opacity-50 pointer-events-none' : ''}`}>
                   <Upload size={18} />
                   <span>{profile.resumeFileName ? 'Change Resume' : 'Upload Resume'}</span>
                   <input type="file" className="hidden" onChange={handleFileUpload} disabled={!isEditingProfile} accept=".pdf,.doc,.docx" />
                 </label>
                 {profile.resumeFileName && (
                   <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                     <FileText size={16} /> {profile.resumeFileName}
                   </span>
                 )}
               </div>
               
               <label className="block text-sm font-semibold text-slate-700 mt-4 mb-2">Bio / Summary Text</label>
               <textarea 
                  disabled={!isEditingProfile}
                  value={profile.resumeText}
                  onChange={e => setProfile({...profile, resumeText: e.target.value})}
                  className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg disabled:text-slate-500 text-sm"
               />
            </div>
          </div>
        </div>
      )}

      {/* View: AI Agent */}
      {activeTab === 'agent' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            
            {/* Controls */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Settings size={20} className="text-slate-400" />
                Configuration
              </h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Match Threshold: <span className="text-brand-600 font-bold">{matchThreshold}%</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={matchThreshold} 
                  onChange={(e) => setMatchThreshold(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Agent will only apply if the AI match score is above this value.
                </p>
              </div>

              <button
                onClick={isAgentRunning ? () => {} : runAgent}
                disabled={isAgentRunning}
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                  isAgentRunning 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-200'
                }`}
              >
                {isAgentRunning ? <Square size={18} /> : <Play size={18} />}
                {isAgentRunning ? 'Agent Running...' : 'Start Auto-Apply'}
              </button>
            </div>

            {/* Stats */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-slate-500 text-sm">Relevant Jobs</span>
                 <span className="font-bold text-slate-900">{jobs.length}</span>
               </div>
               <div className="flex justify-between items-center mb-2">
                 <span className="text-slate-500 text-sm">Applications Sent</span>
                 <span className="font-bold text-green-600">{applications.filter(a => a.status === ApplicationStatus.APPLIED).length}</span>
               </div>
               <div className="flex justify-between items-center mb-2">
                 <span className="text-slate-500 text-sm">Actions Required</span>
                 <span className="font-bold text-yellow-600">{applications.filter(a => a.status === ApplicationStatus.NEEDS_INPUT).length}</span>
               </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <AgentConsole logs={logs} isRunning={isAgentRunning} />
          </div>
        </div>
      )}

    </div>
  );
};