import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Hook to animate number counting up from 0 to target on load
function useCountUp(target, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrame;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Smooth cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return count;
}

export default function Dashboard() {
  const { tasks } = useApp();

  // Animated metric counters
  const greenPoints = useCountUp(320);
  const carbonSaved = useCountUp(482);
  const gridNow = useCountUp(640);

  // Fallback if tasks not yet loaded or fewer than 3
  const fallbackTasks = [
    { id: 'CS-1082', name: 'Legal Doc Corpus Summarization (450 PDFs)', status: 'deferred', carbonSavedG: 1420 },
    { id: 'CS-1081', name: 'Customer Support RAG Embedding Indexing', status: 'running', carbonSavedG: 890 },
    { id: 'CS-1079', name: 'Mistral-7B LoRA Domain Adaptation Run #4', status: 'scheduled', carbonSavedG: 4850 },
  ];

  // Exactly 3 recent tasks
  const recentTasks = tasks && tasks.length >= 3 ? tasks.slice(0, 3) : fallbackTasks;

  return (
    <div className="space-y-4 sm:space-y-5 max-w-6xl mx-auto font-['Inter',sans-serif]">
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-[#123C2D] to-[#0B1220] rounded-2xl px-6 sm:px-8 py-5 min-h-[105px] sm:h-[110px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
            Welcome back, Priya
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Next clean energy window starts in 3h 15m.
          </p>
        </div>

        <Link
          to="/submit"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#0ea371] text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          Submit AI Task
        </Link>
      </div>

      {/* 2. Three Stat Cards in one row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Green Points */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8EEFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <span className="text-xs font-medium text-[#64748B]">Green Points</span>
          <div className="my-2 text-2xl sm:text-3xl font-bold text-[#0B1220] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            {greenPoints} pts
          </div>
          <span className="text-xs text-[#64748B]">₹160 earned</span>
        </div>

        {/* Card 2: Carbon Saved */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8EEFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <span className="text-xs font-medium text-[#64748B]">Carbon Saved</span>
          <div className="my-2 text-2xl sm:text-3xl font-bold text-[#0B1220] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            {carbonSaved} gCO₂e
          </div>
          <span className="text-xs text-[#64748B]">≈ 60 phone charges · 4 km driven</span>
        </div>

        {/* Card 3: Grid Now */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8EEFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <span className="text-xs font-medium text-[#64748B]">Grid Now</span>
          <div className="my-2 text-2xl sm:text-3xl font-bold text-[#0B1220] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            {gridNow} gCO₂/kWh
          </div>
          <span className="text-xs text-[#64748B]">Cleaner in 3h</span>
        </div>
      </div>

      {/* 3. Recent Tasks */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8EEFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E8EEFF]">
          <h3 className="font-bold text-[#0B1220] text-sm sm:text-base font-['Plus_Jakarta_Sans',sans-serif]">
            Recent tasks
          </h3>
          <Link
            to="/tasks"
            className="text-xs font-medium text-[#10B981] hover:text-[#123C2D] transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="divide-y divide-[#F4F7FB]">
          {recentTasks.map((task) => (
            <div
              key={task.id}
              className="py-3 sm:py-3.5 flex items-center justify-between gap-4"
            >
              <span className="text-xs sm:text-sm font-medium text-[#0B1220] truncate">
                {task.name}
              </span>
              <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                <span className="text-xs text-[#64748B] capitalize">
                  {task.status}
                </span>
                <span className="text-xs sm:text-sm font-medium text-[#0B1220] text-right">
                  {task.carbonSavedG ? `${task.carbonSavedG.toLocaleString()} gCO₂e` : '0 gCO₂e'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Simulated Disclaimer */}
      <p className="text-center text-xs text-[#64748B] pt-1">
        Figures are simulated.
      </p>
    </div>
  );
}
