import React from 'react';
import { Menu, Search, Calendar, Bell, ChevronDown, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLocation, Link } from 'react-router-dom';

export function Topbar({ setMobileOpen }) {
  const { user, currentRegion, gridRegions, selectedRegionId, setSelectedRegionId } = useApp();
  const location = useLocation();

  const getBreadcrumbLabel = (path) => {
    switch (path) {
      case '/':
      case '/dashboard':
        return 'Overview';
      case '/chat':
        return 'Submit AI Task';
      case '/tasks':
        return 'Carbon Scheduler';
      case '/analytics':
        return 'Company Analytics';
      case '/rewards':
        return 'Green Points';
      case '/settings':
        return 'Settings';
      default:
        return 'Overview';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb matching screenshot: Acme Corp > Company Console > Overview • Acme Enterprise */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748B] flex-wrap">
            <span className="text-slate-500 hidden sm:inline">Acme Corp</span>
            <span className="hidden sm:inline">›</span>
            <span className="text-slate-500 hidden md:inline">Company Console</span>
            <span className="hidden md:inline">›</span>
            <span className="font-bold text-[#0B1220]">
              {getBreadcrumbLabel(location.pathname)}
            </span>
            <span className="text-slate-300">·</span>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Acme Enterprise</span>
            </div>
          </div>
        </div>

        {/* Right side: Search, Date Filter, Bell, Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Search bar */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-400 w-64 focus-within:border-[#123C2D] focus-within:bg-white transition-all">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search workloads, teams, logs ⌘K"
              className="bg-transparent text-xs text-[#0B1220] placeholder:text-slate-400 outline-none w-full"
            />
          </div>

          {/* Regional Selector */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0B1220]">
            <Globe className="w-3.5 h-3.5 text-[#10B981]" />
            <select
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
            >
              {gridRegions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker Button (Matching screenshot: Last 30 Days) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs text-xs font-semibold text-[#0B1220]">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Last 30 Days (Oct 1 - Oct 31)</span>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              3
            </span>
          </div>

          {/* User Avatar */}
          <Link to="/settings" className="shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20 hover:ring-emerald-500 transition-all"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
