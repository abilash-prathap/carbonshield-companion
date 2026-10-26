import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles, ArrowRight, Lock, Mail, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const { login, user } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('elena.vance@acme-enterprise.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      login(email, password);
      setLoading(false);
      navigate('/');
    }, 400);
  };

  const handleDemoSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      login('elena.vance@acme-enterprise.ai', 'demopassword');
      setLoading(false);
      navigate('/');
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col justify-center items-center p-4 sm:p-6 font-['Inter',sans-serif]">
      {/* Background soft ambient gradient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#123C2D] to-[#0B1220] text-white shadow-md shadow-emerald-950/15 mb-3.5">
            <Shield className="w-7 h-7 text-emerald-400 fill-emerald-400/20" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight font-heading">
            CarbonShield
          </h1>
          <p className="text-xs font-bold uppercase tracking-wider text-[#123C2D] mt-0.5">
            Company Console
          </p>
          <p className="text-xs text-[#64748B] mt-2 max-w-sm mx-auto">
            Orchestrating enterprise AI workloads with carbon-aware intelligence.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#E2E8F0] shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#0B1220] font-heading">Sign in to console</h2>
            <p className="text-xs text-[#64748B] mt-1">
              Enter your enterprise credentials to access live telemetry.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#0B1220] mb-1.5">
                Work Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#123C2D] focus:ring-2 focus:ring-[#123C2D]/10 text-xs sm:text-sm text-[#0B1220] placeholder:text-slate-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#0B1220]">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] font-medium text-emerald-700 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-[#123C2D] focus:ring-2 focus:ring-[#123C2D]/10 text-xs sm:text-sm text-[#0B1220] placeholder:text-slate-400 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#123C2D] focus:ring-[#123C2D] accent-[#123C2D]"
                />
                <span className="text-xs text-[#64748B]">Remember this device for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#123C2D] hover:bg-[#184F3B] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Quick Demo Access
            </span>
          </div>

          {/* Demo Sign In Card */}
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full p-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt="Elena Vance"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
              <div>
                <div className="text-xs font-bold text-[#0B1220]">
                  Elena Vance
                </div>
                <div className="text-[11px] text-[#123C2D] font-medium flex items-center gap-1">
                  <span>Sustainability Lead</span>
                  <span>·</span>
                  <span>Acme Enterprise</span>
                </div>
              </div>
            </div>

            <div className="p-1.5 rounded-lg bg-emerald-600 text-white group-hover:scale-105 transition-transform">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-[#64748B]">
          <span>Protected by CarbonShield Enterprise IAM. Scope 2 & 3 Compliance.</span>
        </div>
      </div>
    </div>
  );
}
