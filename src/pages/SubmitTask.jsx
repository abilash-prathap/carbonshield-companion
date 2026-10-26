import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { QUICK_FILL_PRESETS, GRID_REGIONS } from '../services/mockData';
import {
  Sparkles,
  Zap,
  Clock,
  Shield,
  Layers,
  Leaf,
  Sun,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Cpu,
  Globe,
  RotateCcw,
  Sliders,
  Send,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SubmitTask() {
  const { currentRegion, addTask, addToast } = useApp();
  const navigate = useNavigate();

  // Form states
  const [taskName, setTaskName] = useState('');
  const [category, setCategory] = useState('LLM Batch Inference');
  const [tokens, setTokens] = useState('5,000,000');
  const [priority, setPriority] = useState('flexible'); // 'flexible' or 'urgent'
  const [quality, setQuality] = useState('standard'); // 'standard' or 'high'
  const [deadlineHours, setDeadlineHours] = useState(8);
  const [selectedRegion, setSelectedRegion] = useState(currentRegion.id);

  // Recommendation engine state
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [scheduledSuccess, setScheduledSuccess] = useState(false);

  // Quick fill handler
  const handleQuickFill = (preset) => {
    setTaskName(preset.name);
    setCategory(preset.category);
    setTokens(preset.tokens);
    setPriority(preset.priority);
    setQuality(preset.quality);
    setDeadlineHours(preset.deadlineHours);
    setSelectedRegion(preset.preferredRegion);
    setRecommendation(null);
    setScheduledSuccess(false);
  };

  // Generate Plan Handler
  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) {
      addToast('Task Name Required', 'Please provide a descriptive name for your AI task.', 'error');
      return;
    }

    setIsGenerating(true);
    setRecommendation(null);
    try {
      const plan = await api.generateRecommendation({
        name: taskName,
        category,
        tokens,
        priority,
        quality,
        deadlineHours,
        region: selectedRegion,
      });
      setRecommendation(plan);
    } catch (err) {
      addToast('Optimization Error', 'Failed to generate carbon plan.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Confirm and Schedule Task
  const handleConfirmSchedule = async (forceImmediate = false) => {
    if (!recommendation) return;

    const taskPayload = {
      name: taskName,
      category,
      priority: forceImmediate ? 'urgent' : priority,
      quality,
      model: recommendation.modelRecommendation,
      region: selectedRegion,
      schedulingDecision: forceImmediate ? 'immediate' : recommendation.schedulingDecision,
      executionTime: forceImmediate ? 'Active Now' : recommendation.executionTime,
      deadlineHours,
      metrics: recommendation.metrics,
      delayHours: forceImmediate ? 0 : 4.5,
      explanation: forceImmediate
        ? 'Manual override executed: task running immediately.'
        : recommendation.explanation,
    };

    try {
      const res = await api.submitTask(taskPayload);
      if (res.task) {
        addTask(res.task);
        setScheduledSuccess(true);
        addToast(
          'Task Scheduled Successfully! ⚡',
          `${taskName} will run at ${taskPayload.executionTime}. Earned +${taskPayload.metrics?.greenPointsAwarded || 50} Green Points.`,
          'success'
        );
      }
    } catch (err) {
      addToast('Submission Failed', 'Could not schedule task.', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Submit & Optimize AI Task
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            Marginal Carbon Optimizer
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure your AI workload SLA. CarbonShield companion evaluates real-time regional grid forecasts
          to minimize carbon intensity without compromising your delivery deadline.
        </p>
      </div>

      {/* Quick-fill Templates */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Quick-Fill Examples
          </span>
          <span className="text-[11px] text-slate-400">Click a scenario to pre-fill</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {QUICK_FILL_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleQuickFill(preset)}
              className="text-left p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-xs group"
            >
              <div className="font-semibold text-slate-800 group-hover:text-emerald-900 truncate">
                {preset.name}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                <span className="capitalize">{preset.priority}</span>
                <span>·</span>
                <span>{preset.quality} quality</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Task Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <form onSubmit={handleGeneratePlan} className="space-y-5">
            {/* Task Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Task Name / Description *
              </label>
              <input
                type="text"
                required
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="e.g. Batch PDF Summarization for Financial Reports"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Task Category & Tokens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Task Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium text-slate-700 bg-white"
                >
                  <option value="LLM Batch Inference">LLM Batch Inference</option>
                  <option value="Embeddings / Vector Search">Embeddings / Vector Search</option>
                  <option value="Model Fine-Tuning">Model Fine-Tuning</option>
                  <option value="Batch Processing">Batch Data Processing</option>
                  <option value="Real-time Inference">Real-time Low Latency</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Est. Tokens / Data Volume
                </label>
                <input
                  type="text"
                  value={tokens}
                  onChange={(e) => setTokens(e.target.value)}
                  placeholder="e.g. 5,000,000 tokens"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium"
                />
              </div>
            </div>

            {/* Priority Selector: Flexible vs Urgent */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Execution Priority *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPriority('flexible')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    priority === 'flexible'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Flexible
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Permits deferral into the next green window. Earns maximum Green Points and avoids up to 75% CO₂.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPriority('urgent')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    priority === 'urgent'
                      ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-rose-600" />
                      Urgent
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                      Immediate
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Executes instantly. Bypasses scheduling delays to satisfy strict real-time SLA requirements.
                  </p>
                </button>
              </div>
            </div>

            {/* Model Quality Preference: Standard vs High */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Model Quality & Quantization Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setQuality('standard')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    quality === 'standard'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                    Standard Eco (INT4/INT8)
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Quantized models (e.g. Llama-3-8B 4-bit). 60% lower memory & energy footprint.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setQuality('high')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    quality === 'high'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-teal-600" />
                    High Fidelity (FP16/Full)
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Full-precision flagship models (Claude 3.5 Sonnet, Llama-3-70B FP16).
                  </p>
                </button>
              </div>
            </div>

            {/* Target Cloud Region & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Target Cloud Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium text-slate-700 bg-white"
                >
                  {GRID_REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.currentIntensity} gCO₂/kWh)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Max Permitted Delay (Deadline)
                </label>
                <select
                  value={deadlineHours}
                  disabled={priority === 'urgent'}
                  onChange={(e) => setDeadlineHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium text-slate-700 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value={2}>Within 2 Hours</option>
                  <option value={6}>Within 6 Hours</option>
                  <option value={8}>Within 8 Hours (Recommended)</option>
                  <option value={12}>Within 12 Hours</option>
                  <option value={24}>Within 24 Hours</option>
                </select>
              </div>
            </div>

            {/* Submit / Generate Plan Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing Marginal Grid Forecast...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span>Generate Recommended Plan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Recommendation Result (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          {recommendation ? (
            <div className="bg-white rounded-2xl p-6 border border-emerald-200/90 shadow-sm flex flex-col justify-between h-full animate-fadeIn">
              <div>
                {/* Result Status Banner */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">CarbonShield Plan</h4>
                      <div className="text-[10px] text-slate-400 font-medium">Marginal Optimization Ready</div>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      recommendation.schedulingDecision === 'deferred'
                        ? 'bg-teal-100 text-teal-800 border border-teal-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {recommendation.schedulingDecision === 'deferred' ? 'Eco-Deferred' : 'Immediate Run'}
                  </span>
                </div>

                {/* Key Execution Metrics Strip */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Proposed Model</div>
                    <div className="font-bold text-xs text-slate-800 mt-0.5 truncate">
                      {recommendation.modelRecommendation}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Execution Window</div>
                    <div className="font-bold text-xs text-emerald-800 mt-0.5 truncate">
                      {recommendation.executionTime}
                    </div>
                  </div>
                </div>

                {/* Impact Metrics Card */}
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/70 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                      Carbon Emissions:
                    </span>
                    <span className="font-bold text-emerald-900">
                      {recommendation.metrics.optimizedEmissionsG} gCO₂e{' '}
                      <span className="text-[11px] font-semibold text-emerald-700">
                        (-{recommendation.metrics.carbonSavingsPercent}%)
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      Estimated Energy:
                    </span>
                    <span className="font-bold text-slate-800">
                      {recommendation.metrics.estimatedEnergyKwh} kWh
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      Clean Energy Sync:
                    </span>
                    <span className="font-bold text-emerald-800">
                      89.4% Renewable
                    </span>
                  </div>

                  <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-900">Green Points to Earn:</span>
                    <span className="font-extrabold text-emerald-800 text-sm">
                      +{recommendation.metrics.greenPointsAwarded} pts
                    </span>
                  </div>
                </div>

                {/* Explanation Rationale Box */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-teal-700" />
                    Why this plan was selected:
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {recommendation.explanation}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2 pt-4 border-t border-slate-100">
                {scheduledSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-center text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Task Scheduled! View in My Tasks.</span>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleConfirmSchedule(false)}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Schedule Task</span>
                    </button>

                    {recommendation.schedulingDecision === 'deferred' && (
                      <button
                        type="button"
                        onClick={() => handleConfirmSchedule(true)}
                        className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors"
                      >
                        Override: Run Immediately (Higher Emissions)
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Empty placeholder state */
            <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-200 text-center flex flex-col items-center justify-center h-full min-h-[360px]">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">Plan Recommendation Generator</h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
                Fill in the task details on the left and click <strong>Generate Recommended Plan</strong> to analyze real-time grid carbon intensity.
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                <Shield className="w-3.5 h-3.5" />
                <span>Zero SLA Breach Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
