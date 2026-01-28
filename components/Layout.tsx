import React from 'react';
import { Cpu, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onLogout, onNavigateHome }) => {
  const isPublic = currentView === 'landing' || currentView === 'login';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={onNavigateHome}
            >
              <Cpu className="h-8 w-8 text-brand-600" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-900">
                JobPilot AI
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {!isPublic && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors text-sm font-medium"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              )}
              {isPublic && currentView !== 'login' && (
                 <a href="#" className="text-slate-600 hover:text-brand-600 font-medium text-sm">For Employers</a>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full mx-auto">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} JobPilot AI. Automated Recruitment Platform.
        </div>
      </footer>
    </div>
  );
};