import React, { useState } from 'react';
import { COMPANY_ANALYTICS } from '../services/mockData';
import { StatCard } from '../components/StatCard';
import {
  BarChart3,
  TrendingDown,
  Zap,
  Sun,
  Users,
  Award,
  Layers,
  Cpu,
  Sparkles,
  PieChart,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default function Analytics() {
  const { summary, monthlyTrend, departmentAdoption, modelDistribution, leaderboard } =
    COMPANY_ANALYTICS;

  const [timeframe, setTimeframe] = useState('6m');

  const maxBaseline = Math.max(...monthlyTrend.map((m) => m.baselineKg));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Company Analytics
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              Acme Corp Tech
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Organization-wide carbon footprint abatement, clean energy compliance, and model utilization.
          </p>
        </div>

        {/* Timeframe pill */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          {['1m', '3m', '6m', 'YTD'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === tf
                  ? 'bg-white text-emerald-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Top Organization KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Carbon Avoided"
          value={summary.totalCarbonAvoidedKg.toLocaleString()}
          unit="kg CO₂e"
          subtitle="44.2% org emissions cut"
          icon={TrendingDown}
          accentColor="emerald"
          trend={summary.percentReduction}
          trendLabel="net avoidance"
          tooltip="Calculated against standard immediate cloud execution"
          isSimulated={true}
        />

        <StatCard
          title="Total Energy Saved"
          value={summary.totalEnergySavedKwh.toLocaleString()}
          unit="kWh"
          subtitle="Reduced GPU draw"
          icon={Zap}
          accentColor="teal"
          trend={32.1}
          trendLabel="power efficiency"
          tooltip="Achieved via quantized weights and batch coalescing"
          isSimulated={true}
        />

        <StatCard
          title="Clean Grid Alignment"
          value="88.2%"
          subtitle="Renewable hours matched"
          icon={Sun}
          accentColor="sky"
          trend={28.4}
          trendLabel="clean sync rate"
          tooltip="Shifted workloads to solar & offshore wind peaks"
          isSimulated={true}
        />

        <StatCard
          title="Green Scheduling Rate"
          value={`${summary.greenSchedulingAdoptionPercent}%`}
          subtitle="48 Active Engineers"
          icon={Users}
          accentColor="amber"
          badgeText="84.6% Target Met"
          progress={summary.greenSchedulingAdoptionPercent}
          tooltip="Percentage of batch tasks queued during renewable windows"
          isSimulated={true}
        />
      </div>

      {/* Main Trend: Organization Monthly Baseline vs Optimized Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Monthly Emissions: Baseline vs. Optimized (kg CO₂e)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rapid adoption of CarbonShield Companion has doubled avoided emissions over the last 6 months.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-slate-300 inline-block" />
              <span className="text-slate-600 font-medium">Unmanaged Baseline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block" />
              <span className="text-emerald-800 font-bold">Optimized Footprint</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="h-56 pt-4 flex items-end justify-between gap-3 sm:gap-6 px-2">
          {monthlyTrend.map((item) => {
            const bHeight = Math.max(16, (item.baselineKg / maxBaseline) * 100);
            const oHeight = Math.max(12, (item.optimizedKg / maxBaseline) * 100);

            return (
              <div key={item.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                {/* Bar heights */}
                <div className="w-full max-w-[56px] flex items-end justify-center gap-1.5 h-44">
                  <div
                    style={{ height: `${bHeight}%` }}
                    className="w-1/2 bg-slate-200 rounded-t-md group-hover:bg-slate-300 transition-all relative"
                    title={`Baseline: ${item.baselineKg} kg`}
                  />
                  <div
                    style={{ height: `${oHeight}%` }}
                    className="w-1/2 bg-emerald-600 rounded-t-md group-hover:bg-emerald-500 transition-all shadow-xs relative"
                    title={`Optimized: ${item.optimizedKg} kg (Saved: ${item.savedKg} kg)`}
                  />
                </div>
                {/* Label */}
                <div className="mt-3 text-center">
                  <div className="text-xs font-semibold text-slate-700">{item.month}</div>
                  <div className="text-[10px] text-emerald-700 font-bold">-{item.savedKg}kg</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Model Distribution & Department Adoption */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Model Usage Breakdown</h3>
                <p className="text-xs text-slate-500 mt-0.5">Tasks dispatched across model families</p>
              </div>
              <Cpu className="w-4 h-4 text-emerald-700" />
            </div>

            <div className="space-y-3.5">
              {modelDistribution.map((model) => (
                <div key={model.name}>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-800">{model.name}</span>
                    <span className="font-bold text-slate-600">
                      {model.count} tasks ({model.share}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${model.share}%`,
                        backgroundColor: model.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>40% of workloads</strong> run on lightweight quantized Llama-3-8B, cutting GPU draw in half.
            </span>
          </div>
        </div>

        {/* Department Adoption */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Department Green Adoption</h3>
                <p className="text-xs text-slate-500 mt-0.5">Compliance with green scheduling windows</p>
              </div>
              <Users className="w-4 h-4 text-teal-700" />
            </div>

            <div className="space-y-4">
              {departmentAdoption.map((dept) => (
                <div key={dept.name} className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-bold text-slate-900">{dept.name}</span>
                    <span className="font-extrabold text-emerald-800">{dept.rate}% Compliance</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-1.5">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${dept.rate}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{dept.tasks} tasks scheduled</span>
                    <span className="font-semibold text-emerald-700">+{dept.carbonSavedKg} kg avoided</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-400 text-right">
            Org average compliance: <strong>84.6%</strong>
          </div>
        </div>
      </div>

      {/* Employee Leaderboard */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Carbon-Aware Champions Leaderboard</h3>
            <p className="text-xs text-slate-500 mt-0.5">Top engineers driving sustainable computing</p>
          </div>
          <Award className="w-4 h-4 text-amber-500" />
        </div>

        <div className="divide-y divide-slate-100">
          {leaderboard.map((item) => (
            <div
              key={item.name}
              className="py-3 flex items-center justify-between gap-4 text-xs hover:bg-slate-50/50 rounded-xl px-2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    item.rank === 1
                      ? 'bg-amber-100 text-amber-800'
                      : item.rank === 2
                      ? 'bg-slate-200 text-slate-700'
                      : item.rank === 3
                      ? 'bg-amber-50 text-amber-900'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {item.rank}
                </span>

                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{item.name}</span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-100">
                      {item.badge}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.team}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-emerald-800 text-sm">
                  {item.savedKg} kg CO₂ saved
                </div>
                <div className="text-[11px] text-slate-400">{item.points.toLocaleString()} pts</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
