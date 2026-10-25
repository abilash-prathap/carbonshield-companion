import React from 'react';
import { Menu, Zap, Plus, Globe, ChevronDown, Bell, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link, useLocation } from 'react-router-dom';

export function Topbar({ setMobileOpen }) {
  const { currentRegion, gridRegions, selectedRegionId, setSelectedRegionId, demoMode, setDemoMode, user } = useApp();
  const location = useLocation();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
      case '/dashboard':
        return 'Home Dashboard';
      case '/submit':
        return 'Submit AI Task';
      case '/tasks':
        return 'My AI Tasks';
      case '/points':
        return 'Green Points & Rewards';
      case '/analytics':
        return 'Company Analytics';
      case '/grid':
        return 'Regional Grid Status';
      case '/settings':
        return 'Settings & Backend API';
      default:
        return 'CarbonShield';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Hamburger & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900">
                {getPageTitle(location.pathname)}
              </h1>
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:block">
              {user.organization} · {user.department}
            </div>
          </div>
        </div>

        {/* Right: Region selector & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Region Switcher */}
          <div className="relative flex items-center">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-emerald-300 rounded-xl px-2.5 py-1.5 text-xs transition-colors">
              <Globe className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <select
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer pr-4 text-xs"
              >
                {gridRegions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name} ({region.currentIntensity} gCO₂)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Submit Button */}
          {location.pathname !== '/submit' && (
            <Link
              to="/submit"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Task</span>
            </Link>
          )}

          {/* User profile avatar thumbnail */}
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
