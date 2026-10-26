import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  Leaf,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldCheck,
  RefreshCw,
  Plus,
} from 'lucide-react';

const SUGGESTIONS = [
  'Summarize 120 customer interviews by tomorrow morning',
  'Batch PDF extraction & compliance audit (500 docs)',
  'Schedule RAG embedding indexing during clean wind peak',
  'Domain adaptation LoRA fine-tuning for legal assistant',
];

const INITIAL_CONVERSATION = [
  {
    id: 'msg-welcome',
    sender: 'assistant',
    text: 'Hello Elena. I am your CarbonShield AI Orchestrator. Tell me what AI job or model workload you need to run, and I will find the lowest-carbon regional window while meeting your deadline.',
  },
  {
    id: 'msg-user-1',
    sender: 'user',
    text: 'Summarize a set of 120 customer interviews by tomorrow 9:00 AM.',
  },
  {
    id: 'msg-assistant-1',
    sender: 'assistant',
    text: 'I analyzed the marginal grid intensity across available regions and identified a flexible low-carbon route that delivers well before your 9:00 AM deadline.',
    plan: {
      id: 'CS-4091',
      title: 'Customer Interview Synthesis (120 files)',
      model: 'Llama-3-8B-Instruct (INT4 Quantized)',
      window: 'Tonight, 01:30 AM – 02:45 AM UTC',
      region: 'EU-West (Ireland Offshore Wind)',
      intensity: '118 gCO₂e/kWh',
      avoided: '62% emissions avoided',
      carbonSaved: 1420,
      points: 85,
      energy: '0.84 kWh',
      scheduled: false,
    },
  },
];

export default function ChatCompanion() {
  const location = useLocation();
  const { addTask, addToast, currentRegion } = useApp();

  const [messages, setMessages] = useState(INITIAL_CONVERSATION);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // If redirected with a query from the big block on the dashboard
  useEffect(() => {
    if (location.state && location.state.initialPrompt) {
      handleSend(location.state.initialPrompt);
    }
  }, [location.state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Realistic simulated carbon-aware AI scheduling response
    setTimeout(() => {
      const isUrgent = query.toLowerCase().includes('immediate') || query.toLowerCase().includes('urgent');
      const carbonSavedG = Math.floor(800 + Math.random() * 2400);
      const points = Math.floor(carbonSavedG / 18);

      const aiMsg = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: isUrgent
          ? 'Urgent SLA detected. Workload will execute immediately with quantized batching to preserve zero latency.'
          : `I scheduled an optimal execution window in ${currentRegion.name}. Your workload aligns with peak renewable generation to maximize emissions reduction.`,
        plan: {
          id: `CS-${Math.floor(1000 + Math.random() * 9000)}`,
          title: query.length > 42 ? query.substring(0, 42) + '...' : query,
          model: 'Llama-3-8B-Instruct (INT4)',
          window: isUrgent ? 'Immediate Execution' : `Tonight at 02:00 AM (${currentRegion.nextWindowIn})`,
          region: currentRegion.name,
          intensity: `${Math.round(currentRegion.currentIntensity * 0.72)} gCO₂e/kWh`,
          avoided: isUrgent ? '18% emissions avoided' : '58% emissions avoided',
          carbonSaved: carbonSavedG,
          points: points,
          energy: '1.24 kWh',
          scheduled: false,
        },
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 950);
  };

  const handleSchedulePlan = (planId) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.plan && msg.plan.id === planId) {
          return {
            ...msg,
            plan: { ...msg.plan, scheduled: true },
          };
        }
        return msg;
      })
    );

    const targetPlan = messages.find((m) => m.plan?.id === planId)?.plan;
    if (targetPlan) {
      addTask({
        id: targetPlan.id,
        name: targetPlan.title,
        status: 'scheduled',
        scheduledFor: targetPlan.window,
        carbonSavedG: targetPlan.carbonSaved,
        pointsEarned: targetPlan.points,
        model: targetPlan.model,
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#10B981', '#123C2D', '#34D399', '#059669'],
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: 'New task session started. Describe your next AI inference or batch job.',
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] max-w-5xl mx-auto bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      {/* Top ChatGPT-style Header */}
      <div className="px-6 py-3.5 border-b border-[#E2E8F0] bg-white flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Back to Overview"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#123C2D] flex items-center justify-center text-white">
              <Bot className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0B1220] text-sm font-heading">
                  CarbonShield Orchestrator
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-[#123C2D]">
                  Eco-Route 2.4
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Active Grid: {currentRegion.name} ({currentRegion.currentIntensity} gCO₂e/kWh)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startNewChat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#0B1220] transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#F8FAFC]/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 max-w-3xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-xs ${
                msg.sender === 'user' ? 'bg-[#123C2D]' : 'bg-[#10B981]'
              }`}
            >
              {msg.sender === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-[#0B1220]" />
              )}
            </div>

            {/* Bubble Content */}
            <div className="space-y-3 min-w-0">
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#123C2D] text-white rounded-tr-none'
                    : 'bg-white border border-[#E2E8F0] text-[#0B1220] shadow-xs rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>

              {/* Embedded Carbon Optimization Plan Card */}
              {msg.plan && (
                <div className="bg-white rounded-2xl p-5 border border-emerald-200/90 shadow-xs space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Recommended Clean Route
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {msg.plan.id}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#0B1220] text-sm sm:text-base mt-1">
                        {msg.plan.title}
                      </h4>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-[#123C2D] shrink-0">
                      {msg.plan.avoided}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-100 text-xs">
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Execution Window</span>
                      <strong className="text-[#0B1220] font-semibold mt-0.5 block">
                        {msg.plan.window}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Forecast Intensity</span>
                      <strong className="text-emerald-700 font-semibold mt-0.5 block">
                        {msg.plan.intensity}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Energy Required</span>
                      <strong className="text-[#0B1220] font-semibold mt-0.5 block">
                        {msg.plan.energy}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Model Architecture</span>
                      <strong className="text-[#0B1220] font-semibold mt-0.5 block truncate" title={msg.plan.model}>
                        {msg.plan.model}
                      </strong>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                      <Leaf className="w-4 h-4 text-[#10B981]" />
                      <span>+{msg.plan.points} Green Points Awarded</span>
                    </div>

                    <button
                      onClick={() => handleSchedulePlan(msg.plan.id)}
                      disabled={msg.plan.scheduled}
                      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-xs transition-colors shadow-xs ${
                        msg.plan.scheduled
                          ? 'bg-slate-100 text-slate-500 border border-slate-200'
                          : 'bg-[#123C2D] hover:bg-[#184F3B] text-white'
                      }`}
                    >
                      {msg.plan.scheduled ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Scheduled for Clean Run</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Schedule Clean Run</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-md">
            <div className="w-8 h-8 rounded-xl bg-[#10B981] flex items-center justify-center text-[#0B1220] shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-6 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 shrink-0">Suggestions:</span>
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSend(suggestion)}
            className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 text-slate-600 font-medium whitespace-nowrap transition-colors shrink-0"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Bottom Floating Composer */}
      <div className="p-4 bg-white border-t border-[#E2E8F0]">
        <div className="relative flex items-center rounded-2xl border border-slate-300 focus-within:border-[#123C2D] focus-within:ring-2 focus-within:ring-[#123C2D]/10 bg-white transition-all shadow-xs">
          <textarea
            rows="1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask CarbonShield to plan an AI task, model job, or batch run..."
            className="w-full resize-none py-3.5 pl-4 pr-14 text-sm text-[#0B1220] placeholder:text-slate-400 outline-none max-h-32 bg-transparent"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className={`absolute right-2.5 p-2 rounded-xl transition-colors ${
              input.trim() && !isTyping
                ? 'bg-[#123C2D] text-white hover:bg-[#184F3B]'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            title="Send prompt"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-2 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>CarbonShield schedules AI workloads in optimal regional grid windows. No SLA penalties.</span>
        </p>
      </div>
    </div>
  );
}
