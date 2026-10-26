import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CarbonEmissionsChart } from '../components/CarbonEmissionsChart';
import { EnergyGridChart } from '../components/EnergyGridChart';
import {
  Users,
  Cpu,
  Zap,
  Leaf,
  Shield,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Sparkles,
  Bot,
  Send,
  Radio,
  RotateCcw,
  Sun,
  Activity,
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentRegion, addToast } = useApp();
  const [taskQuery, setTaskQuery] = useState('');

  const handleStartTaskChat = (query) => {
    const promptToSend = query || taskQuery;
    navigate('/chat', { state: { initialPrompt: promptToSend } });
  };

  const handleExportReport = () => {
    addToast('Report Generated', 'Company Carbon Audit PDF for Oct 2026 downloaded.', 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-['Inter',sans-serif]">
      {/* 1. Header Title & Actions Area (Matching Screenshot) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight font-heading">
              Company Overview
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100/90 text-emerald-900 border border-emerald-200">
              Scope 2 & 3 Live
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Monitor AI sustainability, operational efficiency, and carbon-aware computing orchestration.
          </p>
        </div>

        {/* Right side live status & export */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs text-xs font-semibold text-[#0B1220]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span>Live Data Feed</span>
            <span className="text-[11px] font-mono text-slate-400">24ms</span>
          </div>

          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#123C2D] hover:bg-[#184F3B] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 2. SUBMIT AI TASK SEPARATE BIG BLOCK (Directs to ChatGPT-style Chatbox) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-[#123C2D] to-slate-900 text-white p-6 sm:p-7 shadow-sm border border-emerald-900/40">
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Carbon-Aware Computing Engine</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-heading">
            Submit & Orchestrate AI Task
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Plan, optimize, or shift model inference to the cleanest regional grid windows. Describe your task or prompt below to start an interactive chat session.
          </p>

          {/* ChatGPT-style interactive prompt box inside the big block */}
          <div className="mt-5 flex flex-col sm:flex-row items-stretch gap-2.5 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/15 focus-within:border-emerald-400/80 transition-all">
            <div className="flex items-center gap-2.5 px-3 flex-1">
              <Bot className="w-5 h-5 text-emerald-400 shrink-0" />
              <input
                type="text"
                value={taskQuery}
                onChange={(e) => setTaskQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStartTaskChat()}
                placeholder="Ask CarbonShield to schedule an AI batch, LLM inference, or RAG indexing..."
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-300 outline-none"
              />
            </div>

            <button
              onClick={() => handleStartTaskChat()}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0B1220] font-bold text-xs sm:text-sm transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <span>Chat with AI Companion</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* One-click Prompt Chips */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-medium">Quick prompts:</span>
            {[
              'Summarize 120 customer interviews',
              'Batch PDF compliance audit (500 docs)',
              'Schedule RAG embedding indexing in cleanest window',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleStartTaskChat(chip)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-medium transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. EIGHT STAT KPI CARDS (2 Rows of 4, Faithful to Screenshot, No Money Values) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Employees */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Total Employees</span>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight font-heading">
              248
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-700">
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                <ArrowUpRight className="w-3 h-3" />
                +12
              </span>
              <span className="text-[#64748B] font-medium ml-1">this month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Employees */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Active Employees</span>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-500">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight font-heading">
              184 <span className="text-base text-slate-400 font-normal">/ 248</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-[#0B1220]">74.2%</span>
              <span className="text-[#64748B]">within shift policy</span>
            </div>
          </div>
        </div>

        {/* Card 3: AI Tasks Completed */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">AI Tasks Completed</span>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-500">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight font-heading">
              42,890
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-700">
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                <ArrowUpRight className="w-3 h-3" />
                +18.4%
              </span>
              <span className="text-[#64748B] font-medium ml-1">vs last mo</span>
            </div>
          </div>
        </div>

        {/* Card 4: Estimated Energy */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#64748B]">Estimated Energy</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-slate-100 text-slate-500 font-semibold">Est</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-500">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight font-heading">
              14,320 <span className="text-sm font-semibold text-slate-500">kWh</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-700">
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                <ArrowDownRight className="w-3 h-3" />
                -8.2%
              </span>
              <span className="text-[#64748B] font-medium ml-1">grid draw</span>
            </div>
          </div>
        </div>

        {/* Card 5: Estimated Carbon */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#64748B]">Estimated Carbon</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-slate-100 text-slate-500 font-semibold">Est</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-500">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight font-heading">
              5,842 <span className="text-sm font-semibold text-slate-500">kgCO₂e</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-700">
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                <ArrowDownRight className="w-3 h-3" />
                -14.6%
              </span>
              <span className="text-[#64748B] font-medium ml-1">net intensity</span>
            </div>
          </div>
        </div>

        {/* Card 6: EMISSIONS AVOIDED (Featured Deep Green Card #123C2D like screenshot) */}
        <div className="bg-[#123C2D] rounded-2xl p-5 text-white shadow-xs flex flex-col justify-between border border-emerald-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-200">Emissions Avoided</span>
            <div className="p-2 rounded-xl bg-white/10 text-emerald-300">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
              1,210 <span className="text-sm font-semibold text-emerald-300">kgCO₂e</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs font-semibold">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-[#0B1220] font-bold text-[11px]">
                17.1% saved
              </span>
              <span className="text-emerald-200/90 text-[11px]">via carbon-aware shifts</span>
            </div>
          </div>
        </div>

        {/* Card 7: Clean Energy Synchronized (No Money Card - pure sustainability) */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Clean Energy Sync</span>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-500">
              <Sun className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight font-heading">
              84.6%
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-700">
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                <ArrowUpRight className="w-3 h-3" />
                +22.4%
              </span>
              <span className="text-[#64748B] font-medium ml-1">solar & wind match</span>
            </div>
          </div>
        </div>

        {/* Card 8: Green Points Awarded */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Green Points Awarded</span>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-500">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight font-heading">
              68,450 <span className="text-sm font-semibold text-slate-500">pts</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-[#64748B]">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 text-slate-600 text-[10px]">★</span>
              <span className="font-semibold text-[#0B1220]">192</span>
              <span>active contributors</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ANALYTICS SECTION WITH GRAPHS (Matching the Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CarbonEmissionsChart />
        <EnergyGridChart />
      </div>
    </div>
  );
}
