import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  ListTodo,
  Award,
  BarChart3,
  Zap,
  Settings,
  Shield,
  Leaf,
  ChevronRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Sidebar({ mobileOpen, setMobileOpen }) {
  const { user, points, tasks, currentRegion } = useApp();

  const navItems = [
    {
      to: '/dashboard',
      label: 'Home Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/submit',
      label: 'Submit AI Task',
      icon: PlusCircle,
      badge: 'New',
    },
    {
      to: '/tasks',
      label: 'My Tasks',
      icon: ListTodo,
      counter: tasks.filter((t) => t.status !== 'completed' && t.status !== 'cancelled').length,
    },
    {
      to: '/points',
      label: 'Green Points',
      icon: Award,
      badge: `${points.toLocaleString()} pts`,
      badgeColor: 'bg-emerald-100 text-emerald-800 font-bold',
    },
    {
      to: '/analytics',
      label: 'Company Analytics',
      icon: BarChart3,
    },
    {
      to: '/grid',
      label: 'Grid Status',
      icon: Zap,
      pulse: currentRegion.status === 'clean',
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const handleNavClick = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Brand */}
        <div>
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <NavLink to="/dashboard" onClick={handleNavClick} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-800 flex items-center justify-center text-white shadow-sm shadow-emerald-900/20 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-emerald-200 fill-emerald-300/20" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-base tracking-tight">CarbonShield</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">COMPANION</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                    S26
                  </span>
                </div>
              </div>
            </NavLink>
          </div>

          {/* User mini status */}
          <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-800 truncate">{user.name}</div>
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>{user.tier}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Platform Menu
            </div>

            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs shadow-emerald-900/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-emerald-300'
                            : 'text-slate-400 group-hover:text-emerald-700'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            isActive
                              ? 'bg-emerald-700 text-emerald-100'
                              : item.badgeColor || 'bg-slate-200/80 text-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {item.counter !== undefined && item.counter > 0 && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            isActive
                              ? 'bg-emerald-700 text-emerald-100'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.counter}
                        </span>
                      )}

                      {item.pulse && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                      )}
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer: Grid Telemetry Widget */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <NavLink
            to="/grid"
            onClick={handleNavClick}
            className="block p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition-colors group"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Live Grid Signal
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {currentRegion.currentIntensity} gCO₂/kWh
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-800 mt-1 truncate">
              {currentRegion.name}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
              <span>Next Window:</span>
              <strong className="text-teal-700 font-bold">{currentRegion.nextWindowIn}</strong>
            </div>
          </NavLink>

          <div className="mt-3 text-center">
            <span className="text-[10px] text-slate-400">
              SUSTAINATHON26 · Carbon-Aware AI
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
