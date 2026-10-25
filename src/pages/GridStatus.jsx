import React from 'react';
import { useApp } from '../context/AppContext';
import { GRID_REGIONS } from '../services/mockData';
import { GridForecastChart } from '../components/GridForecastChart';
import { EnergyMixBar } from '../components/EnergyMixBar';
import {
  Globe,
  Zap,
  Wind,
  Sun,
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Database,
  CheckCircle2,
  RefreshCw,
  Info,
} from 'lucide-react';

export default function GridStatus() {
  const { currentRegion, selectedRegionId, setSelectedRegionId, addToast } = useApp();

  const handleRefresh = () => {
    addToast('Grid Telemetry Synced', `Polled latest marginal emissions rate for ${currentRegion.name}.`, 'info');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Regional Grid Carbon Status
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              Marginal Emission Signals
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time grid carbon intensity data and forecasted clean-energy windows across cloud data center zones.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Sync Live Grid Data</span>
        </button>
      </div>

      {/* Selected Region Hero Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
              <Globe className="w-4 h-4 text-emerald-700" />
              <span>ACTIVE CLUSTER ZONE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {currentRegion.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Primary renewable source:{' '}
              <strong className="text-slate-800">{currentRegion.primarySource}</strong> · Country: {currentRegion.country}
            </p>
          </div>

          {/* Big Intensity Display */}
          <div className="flex items-center gap-6">
            <div className="text-left lg:text-right">
              <div className="text-xs font-bold uppercase text-slate-400">Carbon Intensity</div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl sm:text-4xl font-black text-emerald-800">
                  {currentRegion.currentIntensity}
                </span>
                <span className="text-xs font-bold text-slate-500">gCO₂/kWh</span>
              </div>
              <div className="text-xs font-medium text-emerald-700 mt-0.5 flex items-center lg:justify-end gap-1">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>{Math.abs(currentRegion.trend)}% lower than 4h ago</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center min-w-[130px]">
              <div className="text-[10px] font-bold uppercase text-emerald-800">Renewable Mix</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-900 mt-0.5">
                {currentRegion.renewablePercent}%
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">Clean Energy</span>
            </div>
          </div>
        </div>

        {/* Next Clean Window Alert Banner */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-950">
                Next Cleaner-Energy Window: <span className="font-extrabold text-emerald-800">{currentRegion.nextGreenWindow}</span>
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5">
                Wind & solar surges will push carbon intensity down to ~118 gCO₂/kWh.
              </div>
            </div>
          </div>

          <div className="text-xs font-bold text-teal-800 bg-white px-3 py-1.5 rounded-xl border border-teal-200/60 shadow-2xs self-start sm:self-auto">
            Starts in: {currentRegion.nextWindowIn}
          </div>
        </div>
      </div>

      {/* Grid Forecast 24-Hour Chart */}
      <GridForecastChart region={currentRegion} />

      {/* Real-time Generation Mix Bar */}
      <EnergyMixBar
        mix={currentRegion.mix}
        renewablePercent={currentRegion.renewablePercent}
      />

      {/* Cross-Region Comparison Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">All Monitored Cloud Grid Zones</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any region below to switch telemetry and re-target AI tasks.
            </p>
          </div>
          <span className="text-xs text-slate-400">Synced: 2 mins ago</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Region / Zone</th>
                <th className="py-3 px-4">Current Intensity</th>
                <th className="py-3 px-4">Renewable %</th>
                <th className="py-3 px-4">Next Green Window</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {GRID_REGIONS.map((region) => {
                const isSelected = region.id === selectedRegionId;
                const isClean = region.status === 'clean';
                const isFossil = region.status === 'fossil';

                return (
                  <tr
                    key={region.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-emerald-50/60 font-semibold' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{region.name}</span>
                        {isSelected && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-200/70 text-emerald-900 font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{region.primarySource}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div
                        className={`font-black text-sm flex items-center gap-1.5 ${
                          isClean
                            ? 'text-emerald-700'
                            : isFossil
                            ? 'text-rose-700'
                            : 'text-amber-700'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isClean ? 'bg-emerald-500' : isFossil ? 'bg-rose-500' : 'bg-amber-500'
                          }`}
                        />
                        <span>{region.currentIntensity} gCO₂/kWh</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-700">
                      {region.renewablePercent}%
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{region.nextGreenWindow}</div>
                      <div className="text-[11px] text-teal-700 font-semibold">
                        in {region.nextWindowIn}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedRegionId(region.id)}
                        disabled={isSelected}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-emerald-800 text-white cursor-default'
                            : 'border border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isSelected ? 'Active' : 'Select'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attribution & Methodology */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
        <div className="font-bold text-slate-700 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>Data Attribution & Methodology</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Carbon intensity is evaluated as <strong>Marginal Operating Emissions Rate (MOER)</strong> measured in grams of CO₂ equivalent per kilowatt-hour (gCO₂e/kWh). Data feeds simulate Electricity Maps and WattTime grid APIs.
        </p>
      </div>
    </div>
  );
}
