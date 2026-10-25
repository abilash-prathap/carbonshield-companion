import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';
import { ImpactChart } from '../components/ImpactChart';
import { GridForecastChart } from '../components/GridForecastChart';
import { TaskStatusBadge, PriorityBadge } from '../components/TaskStatusBadge';
import {
  Award,
  Leaf,
  DollarSign,
  Zap,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Flame,
  Globe,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, tasks, points, currentRegion, updateTaskStatus } = useApp();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await api.getDashboardMetrics();
        setMetrics(data.stats);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const recentTasks = tasks.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Background decorative leaf illustration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-6">
          <Leaf className="w-64 h-64 text-emerald-400 transform rotate-12" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Carbon-Aware Computing Engine Active</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {user.name} 👋
          </h2>

          <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
            Your deferred AI batch jobs have kept{' '}
            <strong className="text-emerald-300 font-bold">14.2 kg CO₂e</strong> out of the atmosphere this month.
            The next clean renewable energy window in{' '}
            <span className="font-semibold text-white">{currentRegion.name}</span> begins in{' '}
            <span className="text-emerald-300 font-bold">{currentRegion.nextWindowIn}</span>.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs transition-colors shadow-sm"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Submit & Schedule AI Task</span>
            </Link>

            <Link
              to="/grid"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-colors"
            >
              <span>View Grid Forecast ({currentRegion.currentIntensity} gCO₂)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Green Points */}
        <StatCard
          title="Green Points"
          value={points.toLocaleString()}
          unit="pts"
          subtitle={`Tier: ${user.tier}`}
          icon={Award}
          accentColor="emerald"
          badgeText={`Level ${user.tierLevel}`}
          progress={(points / user.tierThreshold) * 100}
          tooltip={`${user.tierThreshold - points} pts to reach ${user.nextTier}`}
          isSimulated={true}
        />

        {/* Card 2: Carbon Saved */}
        <StatCard
          title="Carbon Saved"
          value="14,200"
          unit="gCO₂e"
          subtitle="14.2 kg CO₂ avoided"
          icon={Leaf}
          accentColor="teal"
          trend={24.8}
          trendLabel="vs unoptimized"
          tooltip="Equivalent to 64.5 km driven in an electric vehicle"
          isSimulated={true}
        />

        {/* Card 3: Computing Cost Saved */}
        <StatCard
          title="Compute Cost Saved"
          value="$148.60"
          subtitle="412.5 kWh saved"
          icon={DollarSign}
          accentColor="sky"
          trend={18.2}
          trendLabel="cost efficiency"
          tooltip="Saved through off-peak spot rates & INT4 quant models"
          isSimulated={true}
        />

        {/* Card 4: Grid Carbon Intensity */}
        <StatCard
          title="Grid Carbon Intensity"
          value={String(currentRegion.currentIntensity)}
          unit="gCO₂/kWh"
          subtitle={currentRegion.name}
          icon={Zap}
          accentColor="amber"
          badgeText="Clean Window in 3h"
          trend={currentRegion.trend}
          trendLabel="past 4 hours"
          tooltip="Marginal grid emissions from Electricity Maps"
          isSimulated={true}
        />
      </div>

      {/* Green Rewards Milestone Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white rounded-2xl p-5 border border-emerald-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Reward Milestone Unlocked!
              </span>
              <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                Ready to Claim
              </span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base mt-0.5">
              You've earned enough points for a $25 Cloud Compute Credit or 5 Mangrove Trees!
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Current balance: <strong className="text-emerald-800">{points.toLocaleString()} Green Points</strong>. Redeem vouchers to offset hackathon API compute costs.
            </p>
          </div>
        </div>

        <Link
          to="/points"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors shrink-0 shadow-xs"
        >
          <span>Claim Rewards</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Charts Grid: Impact Chart (Baseline vs Optimized) + Real-Time Grid Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ImpactChart timeframe="7d" />
        <GridForecastChart region={currentRegion} />
      </div>

      {/* Recent AI Tasks Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent AI Tasks</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status of your carbon-aware compute jobs and scheduled executions.
            </p>
          </div>
          <Link
            to="/tasks"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group"
          >
            <span>View All ({tasks.length})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Task items list */}
        <div className="divide-y divide-slate-100">
          {recentTasks.map((task) => (
            <div
              key={task.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2.5 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                  <Layers className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">{task.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{task.id}</span>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                    <span>Model: <strong className="text-slate-700">{task.model}</strong></span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {task.scheduledFor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and Impact */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 justify-end">
                    <Leaf className="w-3 h-3" />
                    +{task.carbonSavedG.toLocaleString()} gCO₂
                  </div>
                  <div className="text-[11px] text-slate-400">+{task.pointsEarned} pts</div>
                </div>

                <TaskStatusBadge status={task.status} />

                {task.status === 'scheduled' && (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'running')}
                    title="Force Run Immediately"
                    className="p-1.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 text-slate-500 text-xs transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
