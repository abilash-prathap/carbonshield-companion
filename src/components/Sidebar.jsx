import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  Users,
  Leaf,
  Calendar,
  Zap,
  Award,
  FileText,
  Bell,
  Settings,
  Shield,
  Bot,
  LogOut,
  ChevronRight,
  TrendingDown,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Sidebar({ mobileOpen, setMobileOpen }) {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleNavClick = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/chat', label: 'Submit AI Task', icon: Bot, badge: 'AI Chat' },
    { to: '/tasks', label: 'Working Hours', icon: Clock, counter: 2 },
    { to: '/analytics', label: 'Employees', icon: Users },
    { to: '/analytics', label: 'AI Sustainability', icon: Leaf },
    { to: '/tasks', label: 'Carbon Scheduler', icon: Calendar },
    { to: '/analytics', label: 'Company Efficiency', icon: Zap },
    { to: '/rewards', label: 'Green Points', icon: Award },
    { to: '/analytics', label: 'Reports', icon: FileText },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

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
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Section */}
        <div className="flex-1 overflow-y-auto">
          {/* Logo & Brand Header */}
          <div className="p-5 border-b border-[#E2E8F0]">
            <NavLink to="/" onClick={handleNavClick} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#123C2D] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
              </div>
              <div>
                <h2 className="font-extrabold text-[#0B1220] text-base tracking-tight font-heading leading-tight">
                  CarbonShield
                </h2>
                <p className="text-[11px] font-semibold text-[#64748B] leading-tight">
                  Company Console
                </p>
              </div>
            </NavLink>
          </div>

          {/* Navigation Section */}
          <div className="p-3">
            <div className="px-3 pt-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
              Carbon Orchestration
            </div>

            <nav className="space-y-1">
              {navItems.map((item, idx) => (
                <NavLink
                  key={`${item.to}-${idx}`}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-[#123C2D] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3 min-w-0">
                        <item.icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive
                              ? 'text-emerald-300'
                              : 'text-slate-400 group-hover:text-[#123C2D]'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              isActive
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-emerald-100 text-[#123C2D]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {item.counter && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {item.counter}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom User Card (Faithful to Screenshot) */}
        <div className="p-3 border-t border-[#E2E8F0] bg-slate-50/60">
          <div className="p-2.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/20 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#0B1220] truncate">
                  {user.name}
                </div>
                <div className="text-[11px] text-[#64748B] truncate">
                  {user.role}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
