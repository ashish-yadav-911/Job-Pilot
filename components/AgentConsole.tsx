import React, { useEffect, useRef } from 'react';
import { AgentLog } from '../types';
import { Terminal, CheckCircle, AlertCircle, Play } from 'lucide-react';

interface AgentConsoleProps {
  logs: AgentLog[];
  isRunning: boolean;
}

export const AgentConsole: React.FC<AgentConsoleProps> = ({ logs, isRunning }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden flex flex-col h-[400px] shadow-lg border border-slate-800">
      <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-brand-400" />
          <span className="text-slate-200 font-mono text-sm font-semibold">JobPilot Agent Runtime</span>
        </div>
        <div className="flex items-center gap-2">
          {isRunning ? (
            <span className="flex items-center gap-1.5 text-xs text-green-400 px-2 py-1 bg-green-900/30 rounded-full border border-green-900">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Active
            </span>
          ) : (
             <span className="text-xs text-slate-500 px-2 py-1 bg-slate-800 rounded-full border border-slate-700">
              Standby
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-2">
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3">
             <div className="p-3 bg-slate-800 rounded-full">
               <Play size={24} className="ml-1" />
             </div>
             <p>Start the agent to begin auto-applying</p>
          </div>
        )}
        
        {logs.map((log) => (
          <div key={log.id} className="animate-fade-in flex items-start gap-3">
             <span className="text-slate-600 text-xs whitespace-nowrap mt-0.5">{log.timestamp}</span>
             <div className="flex-1">
                {log.type === 'info' && <p className="text-slate-300">{log.message}</p>}
                {log.type === 'action' && <p className="text-brand-400 font-medium">→ {log.message}</p>}
                {log.type === 'success' && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={14} />
                    <span>{log.message}</span>
                  </div>
                )}
                {log.type === 'error' && (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle size={14} />
                    <span>{log.message}</span>
                  </div>
                )}
             </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};