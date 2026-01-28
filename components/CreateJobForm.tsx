import React, { useState } from 'react';
import { Job, JobType, CustomQuestion } from '../types';
import { suggestJobDetails } from '../services/geminiService';
import { Sparkles, Loader2, Plus, X, Tag } from 'lucide-react';

interface CreateJobFormProps {
  onJobCreated: (job: Job) => void;
  onCancel: () => void;
}

export const CreateJobForm: React.FC<CreateJobFormProps> = ({ onJobCreated, onCancel }) => {
  const [loadingAI, setLoadingAI] = useState(false);
  
  // Tag Management
  const [tagInput, setTagInput] = useState('');
  
  // Custom Questions
  const [newQuestion, setNewQuestion] = useState('');
  const [isQuestionRequired, setIsQuestionRequired] = useState(true);

  const [formData, setFormData] = useState<{
    title: string;
    company: string;
    location: string;
    type: JobType;
    experience: number;
    salary: string;
    description: string;
    requirements: string;
    noticePeriod: string; // Keep as string for input, parse later
    tags: string[];
    customQuestions: CustomQuestion[];
  }>({
    title: '',
    company: '',
    location: '',
    type: JobType.FULL_TIME,
    experience: 3,
    salary: '',
    description: '',
    requirements: '',
    noticePeriod: '30',
    tags: [],
    customQuestions: []
  });

  const handleAIAutoFill = async () => {
    if (!formData.title || !formData.company) {
      alert("Please enter at least a Job Title and Company Name for the AI to work.");
      return;
    }
    setLoadingAI(true);
    const suggestions = await suggestJobDetails(formData.title, formData.company);
    setFormData(prev => ({
      ...prev,
      description: suggestions.description,
      requirements: suggestions.requirements.join('\n'),
      salary: suggestions.salaryRange,
      // Simple parse for mock exp
      experience: parseInt(suggestions.experienceRequired) || 3 
    }));
    setLoadingAI(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      const q: CustomQuestion = {
        id: Math.random().toString(36).substr(2, 5),
        question: newQuestion.trim(),
        required: isQuestionRequired
      };
      setFormData(prev => ({ ...prev, customQuestions: [...prev.customQuestions, q] }));
      setNewQuestion('');
    }
  };

  const removeQuestion = (id: string) => {
    setFormData(prev => ({ ...prev, customQuestions: prev.customQuestions.filter(q => q.id !== id) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse Notice Period
    let np: number | 'Immediate' = 'Immediate';
    if (formData.noticePeriod.toLowerCase() !== 'immediate') {
      np = parseInt(formData.noticePeriod) || 30;
    }

    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      company: formData.company,
      location: formData.location || 'Remote',
      type: formData.type,
      salaryRange: formData.salary,
      description: formData.description,
      requirements: formData.requirements.split('\n').filter(s => s.trim()),
      postedAt: 'Just Now',
      experienceRequired: formData.experience,
      noticePeriod: np,
      tags: formData.tags,
      customQuestions: formData.customQuestions
    };
    onJobCreated(newJob);
  };

  return (
    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-lg animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Post a New Job</h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Job Title</label>
            <input 
              required
              className="w-full p-2 border border-slate-200 rounded-lg"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Senior Product Designer"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Company</label>
            <input 
              required
              className="w-full p-2 border border-slate-200 rounded-lg"
              value={formData.company}
              onChange={e => setFormData({...formData, company: e.target.value})}
              placeholder="e.g. Acme Corp"
            />
          </div>
        </div>

        {/* AI Action */}
        <div className="bg-brand-50 p-4 rounded-lg flex items-center justify-between border border-brand-100">
          <div>
            <p className="font-bold text-brand-800 text-sm">Need help writing the description?</p>
            <p className="text-brand-600 text-xs">AI can generate requirements and salary based on title.</p>
          </div>
          <button 
            type="button"
            onClick={handleAIAutoFill}
            disabled={loadingAI}
            className="flex items-center gap-2 bg-white text-brand-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all border border-brand-100"
          >
            {loadingAI ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            Auto-Complete
          </button>
        </div>

        {/* Tags */}
        <div>
           <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Search Tags (Used by AI Agent)</label>
           <div className="flex items-center gap-2 mb-2">
             <input 
                className="flex-1 p-2 border border-slate-200 rounded-lg"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="e.g. Python, Remote, React (Press Enter)"
             />
             <button type="button" onClick={addTag} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"><Plus size={20}/></button>
           </div>
           <div className="flex flex-wrap gap-2">
             {formData.tags.map(tag => (
               <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                 {tag}
                 <X size={14} className="cursor-pointer hover:text-blue-900" onClick={() => removeTag(tag)} />
               </span>
             ))}
           </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Location</label>
            <input 
              className="w-full p-2 border border-slate-200 rounded-lg"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              placeholder="e.g. New York, NY"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Employment Type</label>
            <select 
              className="w-full p-2 border border-slate-200 rounded-lg"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as JobType})}
            >
              {Object.values(JobType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
           <div>
            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Salary Range</label>
            <input 
              className="w-full p-2 border border-slate-200 rounded-lg"
              value={formData.salary}
              onChange={e => setFormData({...formData, salary: e.target.value})}
              placeholder="e.g. $100k - $120k"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Experience (Years)</label>
            <input 
              type="number"
              className="w-full p-2 border border-slate-200 rounded-lg"
              value={formData.experience}
              onChange={e => setFormData({...formData, experience: parseInt(e.target.value)})}
            />
          </div>
           <div>
            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Notice Period</label>
            <input 
              className="w-full p-2 border border-slate-200 rounded-lg"
              value={formData.noticePeriod}
              onChange={e => setFormData({...formData, noticePeriod: e.target.value})}
              placeholder="Days or 'Immediate'"
            />
          </div>
        </div>

        {/* Custom Questions */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
           <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Custom Questions for Candidate</label>
           <div className="flex gap-2 mb-3">
             <input 
                className="flex-1 p-2 border border-slate-200 rounded-lg text-sm"
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
                placeholder="e.g. Please provide a link to your portfolio"
             />
             <label className="flex items-center gap-1 text-sm text-slate-600 bg-white px-2 rounded border border-slate-200">
               <input type="checkbox" checked={isQuestionRequired} onChange={e => setIsQuestionRequired(e.target.checked)} />
               Required
             </label>
             <button type="button" onClick={addQuestion} className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Add</button>
           </div>
           
           <ul className="space-y-2">
             {formData.customQuestions.map(q => (
               <li key={q.id} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200 text-sm">
                 <span className="flex items-center gap-2">
                   {q.question}
                   {q.required && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded font-bold">REQ</span>}
                 </span>
                 <button type="button" onClick={() => removeQuestion(q.id)} className="text-slate-400 hover:text-red-500"><X size={16} /></button>
               </li>
             ))}
             {formData.customQuestions.length === 0 && <p className="text-slate-400 text-sm italic">No custom questions added.</p>}
           </ul>
        </div>

        <button 
          type="submit" 
          className="w-full py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Create Job Posting
        </button>

      </form>
    </div>
  );
};