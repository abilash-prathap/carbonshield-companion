import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Sparkles,
  Leaf,
  CloudRain,
  Zap,
  Coffee,
  CheckCircle2,
  Gift,
  ArrowRight,
  TrendingUp,
  Clock,
  Shield,
  Copy,
  Check,
} from 'lucide-react';

export default function GreenPoints() {
  const { user, points, pointsHistory, redeemReward, addToast } = useApp();
  const [selectedReward, setSelectedReward] = useState(null);
  const [redemptionSuccess, setRedemptionSuccess] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Tiers definition
  const tiers = [
    { name: 'Seedling', min: 0, max: 999, level: 1, perk: 'Basic carbon telemetry' },
    { name: 'Eco Pioneer', min: 1000, max: 2999, level: 2, perk: 'Automated green-window queuing' },
    { name: 'Carbon Guardian', min: 3000, max: 4999, level: 3, perk: 'Custom marginal carbon thresholds & Slack alerts' },
    { name: 'Climate Champion', min: 5000, max: 10000, level: 4, perk: 'Dedicated green compute GPU quota' },
  ];

  const currentTierObj = tiers.find((t) => points >= t.min && points <= t.max) || tiers[1];
  const nextTierObj = tiers[currentTierObj.level] || tiers[tiers.length - 1];
  const progressToNext = Math.min(
    100,
    Math.max(0, ((points - currentTierObj.min) / (currentTierObj.max - currentTierObj.min)) * 100)
  );

  const rewards = [
    {
      id: 'rew-1',
      name: '$25 Cloud Compute Credit',
      provider: 'AWS / Google Cloud / Lambda Labs',
      category: 'Compute Voucher',
      pointsCost: 500,
      description: 'Offset development server or fine-tuning GPU instances with certified green credits.',
      icon: CloudRain,
      tag: 'Most Popular',
    },
    {
      id: 'rew-2',
      name: 'Plant 5 Mangrove Trees',
      provider: 'Eden Reforestation Projects',
      category: 'Ecological Impact',
      pointsCost: 650,
      description: 'Directly funds mangrove restoration in coastal biomes, sequestering ~150 kg of lifetime carbon.',
      icon: Leaf,
      tag: 'Verified Impact',
    },
    {
      id: 'rew-3',
      name: 'CarbonShield Certified Eco-Engineer',
      provider: 'SUSTAINATHON26 Council',
      category: 'Digital Credential',
      pointsCost: 1000,
      description: 'Digital credential badge for LinkedIn & GitHub certifying sustainable AI engineering leadership.',
      icon: Award,
      tag: 'Certification',
    },
    {
      id: 'rew-4',
      name: 'Specialty Fair-Trade Coffee Pack',
      provider: 'Acme Eco Roasters',
      category: 'Team Perk',
      pointsCost: 400,
      description: 'Zero-emission artisanal whole bean roast delivered to your office or doorstep.',
      icon: Sparkles,
      tag: 'Perk',
    },
    {
      id: 'rew-5',
      name: '$50 API Credit for Eco-Models',
      provider: 'OpenRouter & Mistral AI',
      category: 'Compute Voucher',
      pointsCost: 1200,
      description: 'Credits dedicated for testing and benchmarking quantized open-weights models.',
      icon: Zap,
      tag: 'Developer',
    },
  ];

  const handleClaim = (reward) => {
    if (points < reward.pointsCost) {
      addToast('Insufficient Points', `You need ${reward.pointsCost} points to claim this reward.`, 'error');
      return;
    }
    const success = redeemReward(reward);
    if (success) {
      const code = `CS-ECO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setRedemptionSuccess({ reward, code });
      setSelectedReward(null);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Green Points & Rewards
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Earn points automatically each time you schedule tasks during low-carbon grid windows or opt for quantized models.
        </p>
      </div>

      {/* Balance & Tier Progress Hero Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Balance display (5 cols) */}
          <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-emerald-800/60 pb-6 md:pb-0 md:pr-6">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Your Available Balance
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                {points.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-emerald-300">Green Points</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Earned by shifting AI batch tasks to clean wind & solar grid windows.
            </p>
          </div>

          {/* Tier Progression (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold">
                  Current Status
                </span>
                <div className="text-lg font-extrabold text-white flex items-center gap-2 mt-0.5">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span>{currentTierObj.name} (Tier {currentTierObj.level})</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-300">Next Milestone</span>
                <div className="text-xs font-bold text-emerald-300 mt-0.5">
                  {nextTierObj.name} ({nextTierObj.min.toLocaleString()} pts)
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-emerald-700/40">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5 font-medium">
                <span>{points.toLocaleString()} pts</span>
                <span>{nextTierObj.min - points} pts to {nextTierObj.name}</span>
              </div>
            </div>

            {/* Unlocked perk pill */}
            <div className="p-2.5 rounded-xl bg-emerald-800/40 border border-emerald-700/40 flex items-center gap-2 text-xs text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Active perk: <strong>{currentTierObj.perk}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Catalog */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Redeemable Rewards</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Turn your carbon-conscious computing savings into real rewards and compute vouchers.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {rewards.length} Rewards Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => {
            const Icon = reward.icon;
            const canAfford = points >= reward.pointsCost;

            return (
              <div
                key={reward.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group bg-slate-50/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {reward.tag}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{reward.name}</h4>
                  <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">{reward.provider}</div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {reward.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-slate-900">{reward.pointsCost}</span>
                    <span className="text-[11px] font-semibold text-slate-500 ml-1">pts</span>
                  </div>

                  <button
                    onClick={() => handleClaim(reward)}
                    disabled={!canAfford}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      canAfford
                        ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>{canAfford ? 'Redeem' : 'Need More Pts'}</span>
                    {canAfford && <ArrowRight className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Points Activity History Ledger */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Activity Ledger</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              History of points earned from deferred tasks and model quantization.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {pointsHistory.map((item) => {
            const isEarned = item.points > 0;
            return (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-4 text-xs hover:bg-slate-50/50 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl border ${
                      isEarned
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}
                  >
                    {isEarned ? <Sparkles className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {item.task} · <span className="text-slate-400">{item.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-black text-sm ${
                      isEarned ? 'text-emerald-700' : 'text-slate-700'
                    }`}
                  >
                    {isEarned ? `+${item.points}` : item.points} pts
                  </div>
                  {item.co2Saved !== '-' && (
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Avoided: {item.co2Saved}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reward Redemption Success Modal */}
      {redemptionSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center border border-slate-200 shadow-2xl relative animate-scaleUp">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
              <Gift className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-extrabold text-slate-900">
              Reward Claimed Successfully! 🎉
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              You redeemed <strong>{redemptionSuccess.reward.name}</strong> from{' '}
              {redemptionSuccess.reward.provider}.
            </p>

            {/* Voucher Code Box */}
            <div className="my-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-slate-900 tracking-wider">
                {redemptionSuccess.code}
              </span>
              <button
                onClick={() => handleCopyCode(redemptionSuccess.code)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={() => setRedemptionSuccess(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors"
            >
              Done & Return to Rewards
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
