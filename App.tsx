import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { CandidateDashboard } from './pages/CandidateDashboard';
import { EmployerDashboard } from './pages/EmployerDashboard';
import { MOCK_JOBS } from './constants';
import { Job, ViewState, Application } from './types';

function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  // Lifted state for applications so Employer can see what Candidate did
  const [applications, setApplications] = useState<Application[]>([]);

  const handleLogin = (role: 'candidate' | 'employer') => {
    setView(role);
  };

  const handleLogout = () => {
    setView('landing');
  };

  const addJob = (newJob: Job) => {
    setJobs(prev => [newJob, ...prev]);
  };

  const handleApply = (newApp: Application) => {
    setApplications(prev => [...prev, newApp]);
  };

  const updateApplication = (appId: string, updates: Partial<Application>) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, ...updates } : a));
  };

  return (
    <Layout 
      currentView={view} 
      onLogout={handleLogout}
      onNavigateHome={() => setView('landing')}
    >
      {view === 'landing' && <LandingPage onLoginClick={() => setView('login')} />}
      
      {view === 'login' && <LoginPage onLogin={handleLogin} />}
      
      {view === 'candidate' && (
        <CandidateDashboard 
          jobs={jobs} 
          applications={applications}
          onApply={handleApply}
          onUpdateApplication={updateApplication}
        />
      )}
      
      {view === 'employer' && (
        <EmployerDashboard 
          jobs={jobs} 
          onAddJob={addJob} 
          applications={applications}
        />
      )}
    </Layout>
  );
}

export default App;