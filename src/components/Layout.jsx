import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DemoNoticeBanner } from './DemoNoticeBanner';
import { ToastContainer } from './Toast';

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Disclaimer / Demo Notice */}
      <DemoNoticeBanner />

      <div className="flex-1 flex">
        {/* Navigation Sidebar */}
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all">
          <Topbar setMobileOpen={setMobileOpen} />

          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>

          {/* Simple Clean Footer */}
          <footer className="px-6 py-4 border-t border-slate-200/70 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl w-full mx-auto">
            <div>
              <strong>CarbonShield Companion</strong> · Carbon-Aware AI Platform for SUSTAINATHON26
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <span>Python FastAPI + MongoDB + Supabase Integration Layer</span>
              <span>v1.0.0</span>
            </div>
          </footer>
        </div>
      </div>

      {/* Floating Toast Alerts */}
      <ToastContainer />
    </div>
  );
}
