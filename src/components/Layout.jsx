import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastContainer } from './Toast';

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col font-['Inter',sans-serif] text-[#0B1220]">
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
          <footer className="px-6 py-4 border-t border-[#E2E8F0] text-xs text-[#64748B] flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl w-full mx-auto">
            <div>
              <strong className="text-[#0B1220]">CarbonShield Company Console</strong> · Enterprise Carbon-Aware AI Computing
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Scope 2 & 3 Compliance</span>
              <span>v2.4.0</span>
            </div>
          </footer>
        </div>
      </div>

      {/* Floating Toast Alerts */}
      <ToastContainer />
    </div>
  );
}
