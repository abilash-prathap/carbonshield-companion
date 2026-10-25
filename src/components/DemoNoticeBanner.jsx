import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Info, Radio, Database, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DemoNoticeBanner() {
  const { demoMode, setDemoMode } = useApp();

  return (
    <div
      className={`w-full px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b transition-colors ${
        demoMode
          ? 'bg-amber-50/90 border-amber-200/80 text-amber-900'
          : 'bg-emerald-50/90 border-emerald-200/80 text-emerald-900'
      }`}
    >
      <div className="flex items-center gap-2">
        {demoMode ? (
          <span className="flex h-2 w-2 relative">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
        ) : (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
        )}

        <span className="font-bold">
          {demoMode ? 'DEMO MODE ACTIVE' : 'LIVE FASTAPI BACKEND'}
        </span>
        <span className="text-slate-600 hidden md:inline">
          {demoMode
            ? '· Presentation simulation with isolated test telemetry. Never pretending simulated carbon savings are real measurements.'
            : '· Live endpoint: Connected to Python FastAPI + Supabase.'}
        </span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Link
          to="/settings"
          className="underline hover:text-slate-900 font-semibold flex items-center gap-1"
        >
          <span>Configure Backend</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
        <span className="text-slate-300">|</span>
        <button
          onClick={() => setDemoMode(!demoMode)}
          className={`px-2 py-0.5 rounded font-semibold text-[11px] border transition-colors ${
            demoMode
              ? 'bg-white border-amber-300 text-amber-800 hover:bg-amber-100'
              : 'bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-100'
          }`}
        >
          Switch to {demoMode ? 'Live Mode' : 'Demo Mode'}
        </button>
      </div>
    </div>
  );
}
