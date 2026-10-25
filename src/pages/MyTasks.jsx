import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskStatusBadge, PriorityBadge } from '../components/TaskStatusBadge';
import {
  Search,
  Filter,
  Layers,
  Leaf,
  Clock,
  Zap,
  Play,
  XCircle,
  RotateCcw,
  Info,
  ChevronRight,
  ExternalLink,
  SlidersHorizontal,
  X,
} from 'lucide-react';

export default function MyTasks() {
  const { tasks, updateTaskStatus } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTaskDetail, setSelectedTaskDetail] = useState(null);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || task.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesPriority =
      priorityFilter === 'all' || task.priority.toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            My AI Tasks
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor active, deferred, and completed carbon-optimized batch workloads.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by task name, model, ID..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['all', 'scheduled', 'deferred', 'running', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-white text-emerald-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Priority dropdown */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="flexible">Flexible Only</option>
            <option value="urgent">Urgent Only</option>
          </select>
        </div>
      </div>

      {/* Tasks Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No tasks found</h4>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or status filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Task Name & Details</th>
                  <th className="py-3.5 px-4">Model & Zone</th>
                  <th className="py-3.5 px-4">Execution Window</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Carbon Saved</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => setSelectedTaskDetail(task)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    {/* Task Name & ID */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {task.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] text-slate-400">{task.id}</span>
                        <PriorityBadge priority={task.priority} />
                        <span className="text-[11px] text-slate-400">· {task.category}</span>
                      </div>
                    </td>

                    {/* Model & Zone */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{task.model}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{task.region}</div>
                    </td>

                    {/* Execution Window */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{task.scheduledFor}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Deadline: {task.deadline}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <TaskStatusBadge status={task.status} />
                    </td>

                    {/* Carbon Saved */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-bold text-emerald-700 flex items-center justify-end gap-1">
                        <Leaf className="w-3.5 h-3.5" />
                        <span>+{task.carbonSavedG.toLocaleString()} gCO₂</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        +{task.pointsEarned} Green Pts
                      </div>
                    </td>

                    {/* Quick Actions */}
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        {task.status === 'scheduled' || task.status === 'deferred' ? (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'running')}
                            title="Force Run Immediately"
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 transition-colors"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        ) : null}

                        {task.status !== 'completed' && task.status !== 'cancelled' ? (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'cancelled')}
                            title="Cancel Task"
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-400 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        ) : null}

                        <button
                          onClick={() => setSelectedTaskDetail(task)}
                          title="View Details"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Task Detail Modal / Drawer */}
      {selectedTaskDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative animate-scaleUp">
            {/* Close Button */}
            <button
              onClick={() => setSelectedTaskDetail(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="pr-8">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                {selectedTaskDetail.id} · {selectedTaskDetail.category}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                {selectedTaskDetail.name}
              </h3>
            </div>

            {/* Status and Priority Pill */}
            <div className="flex items-center gap-2 mt-3">
              <TaskStatusBadge status={selectedTaskDetail.status} size="md" />
              <PriorityBadge priority={selectedTaskDetail.priority} />
            </div>

            {/* Telemetry Breakdown */}
            <div className="grid grid-cols-2 gap-3 my-5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Model</span>
                <div className="font-bold text-xs text-slate-800 mt-0.5">
                  {selectedTaskDetail.model}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Cloud Region</span>
                <div className="font-bold text-xs text-slate-800 mt-0.5">
                  {selectedTaskDetail.region}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-800 uppercase">Carbon Avoided</span>
                <div className="font-extrabold text-sm text-emerald-800 mt-0.5">
                  +{selectedTaskDetail.carbonSavedG.toLocaleString()} gCO₂e
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Energy Footprint</span>
                <div className="font-bold text-sm text-slate-800 mt-0.5">
                  {selectedTaskDetail.energyKwh} kWh
                </div>
              </div>
            </div>

            {/* Rationale explanation */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-5">
              <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-teal-700" />
                <span>Scheduling Rationale</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {selectedTaskDetail.rationale}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedTaskDetail(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
              {selectedTaskDetail.status === 'scheduled' && (
                <button
                  onClick={() => {
                    updateTaskStatus(selectedTaskDetail.id, 'running');
                    setSelectedTaskDetail(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors"
                >
                  Run Immediately
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
