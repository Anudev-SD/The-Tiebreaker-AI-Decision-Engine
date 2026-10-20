import React, { useState } from 'react';
import { 
  Trophy, 
  Sliders, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  BarChart3,
  Award
} from 'lucide-react';
import { DecisionCriterion, OptionAnalysis } from '../../types/decision';

interface ComparisonTableTabProps {
  criteria: DecisionCriterion[];
  optionsAnalysis: OptionAnalysis[];
  onUpdateCriteria: (updated: DecisionCriterion[]) => void;
}

export const ComparisonTableTab: React.FC<ComparisonTableTabProps> = ({
  criteria,
  optionsAnalysis,
  onUpdateCriteria,
}) => {
  const [expandedRationale, setExpandedRationale] = useState<string | null>(null);

  // Handle changing user weights
  const handleWeightChange = (criterionId: string, newWeight: number) => {
    const updated = criteria.map(c => 
      c.id === criterionId ? { ...c, userWeight: newWeight } : c
    );
    onUpdateCriteria(updated);
  };

  // Calculate live weighted scores for each option
  // Total possible = sum(weight * 10)
  // Actual score = sum(weight * score)
  const optionNames = optionsAnalysis.map(o => o.name);

  const totalPossiblePoints = criteria.reduce((sum, c) => {
    const w = c.userWeight ?? c.defaultWeight;
    return sum + (w * 10);
  }, 0);

  const optionLeaderboard = optionNames.map(optName => {
    const totalScore = criteria.reduce((sum, c) => {
      const w = c.userWeight ?? c.defaultWeight;
      const match = c.scores.find(s => s.optionName.toLowerCase() === optName.toLowerCase())
        || c.scores.find(s => optName.toLowerCase().includes(s.optionName.toLowerCase()) || s.optionName.toLowerCase().includes(optName.toLowerCase()));
      const scoreVal = match ? match.score : 5;
      return sum + (w * scoreVal);
    }, 0);

    const percentage = totalPossiblePoints > 0 
      ? Math.round((totalScore / totalPossiblePoints) * 100) 
      : 0;

    return {
      name: optName,
      totalScore,
      percentage,
    };
  }).sort((a, b) => b.totalScore - a.totalScore);

  const leader = optionLeaderboard[0];
  const runnerUp = optionLeaderboard[1];
  const margin = leader && runnerUp ? leader.percentage - runnerUp.percentage : 0;

  return (
    <div className="space-y-6">
      {/* Live Weighted Leaderboard */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Weighted Decision Matrix Standings</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust criterion weights below. The podium recalculates live based on your personal priorities.
            </p>
          </div>

          {margin > 0 && (
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 shrink-0">
              <Award className="h-3.5 w-3.5" />
              <span>{leader.name.split('(')[0]} leads by {margin}%</span>
            </div>
          )}
        </div>

        {/* Podium Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {optionLeaderboard.map((item, idx) => {
            const isFirst = idx === 0;
            return (
              <div 
                key={item.name}
                className={`rounded-xl border p-3.5 transition-all ${
                  isFirst 
                    ? 'border-emerald-500/40 bg-emerald-950/20 shadow-md shadow-emerald-500/5' 
                    : 'border-slate-800 bg-slate-950/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                      isFirst ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-white line-clamp-1">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-base font-extrabold text-white">{item.percentage}%</span>
                    <span className="text-[10px] text-slate-500">({item.totalScore} pts)</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFirst 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                        : 'bg-indigo-500/70'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/90 text-slate-300">
                <th className="p-4 font-bold uppercase tracking-wider text-[11px] min-w-[220px]">
                  Evaluation Criterion &amp; Weight
                </th>
                {optionsAnalysis.map((opt, i) => (
                  <th key={i} className="p-4 font-bold min-w-[200px]">
                    <div className="flex items-center space-x-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-800 text-[10px] text-slate-300">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-white text-xs sm:text-sm line-clamp-1">{opt.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {criteria.map(crit => {
                const currentWeight = crit.userWeight ?? crit.defaultWeight;
                const isExpanded = expandedRationale === crit.id;

                return (
                  <React.Fragment key={crit.id}>
                    <tr className="hover:bg-slate-850/50 transition-colors">
                      {/* Criterion and Weight Slider */}
                      <td className="p-4 align-top">
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-slate-100 text-xs sm:text-sm">
                              {crit.name}
                            </span>
                            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-medium text-slate-400">
                              {crit.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            {crit.description}
                          </p>

                          {/* Weight Slider */}
                          <div className="pt-2 flex items-center space-x-2">
                            <Sliders className="h-3 w-3 text-slate-500" />
                            <span className="text-[10px] text-slate-400 font-medium">
                              Importance: {currentWeight}x
                            </span>
                            <input
                              type="range"
                              min={1}
                              max={5}
                              step={1}
                              value={currentWeight}
                              onChange={e => handleWeightChange(crit.id, Number(e.target.value))}
                              className="h-1.5 w-24 accent-emerald-500 cursor-pointer"
                            />
                            <button
                              type="button"
                              onClick={() => setExpandedRationale(isExpanded ? null : crit.id)}
                              className="inline-flex items-center space-x-1 text-[10px] text-indigo-400 hover:text-indigo-300 ml-auto"
                            >
                              <span>{isExpanded ? 'Hide' : 'Why'}</span>
                              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Score per Option */}
                      {optionsAnalysis.map((opt, optIdx) => {
                        const scoreObj = crit.scores.find(s => 
                          s.optionName.toLowerCase() === opt.name.toLowerCase() ||
                          opt.name.toLowerCase().includes(s.optionName.toLowerCase()) ||
                          s.optionName.toLowerCase().includes(opt.name.toLowerCase())
                        ) || crit.scores[optIdx];

                        const scoreVal = scoreObj ? scoreObj.score : 5;
                        const scoreColor = 
                          scoreVal >= 8 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                          scoreVal >= 5 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                          'text-rose-400 bg-rose-500/10 border-rose-500/20';

                        return (
                          <td key={optIdx} className="p-4 align-top">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center justify-center rounded-lg border px-2.5 py-1 text-xs font-extrabold ${scoreColor}`}>
                                  {scoreVal} / 10
                                </span>
                                <div className="text-[10px] text-slate-500">
                                  Weighted: {scoreVal * currentWeight} pts
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                {scoreObj?.rationale || 'Score derived from multi-criteria evaluation.'}
                              </p>
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Expandable deep dive */}
                    {isExpanded && (
                      <tr className="bg-slate-950/70">
                        <td colSpan={optionsAnalysis.length + 1} className="p-4 text-xs text-slate-300">
                          <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/10 p-3 space-y-1">
                            <p className="font-semibold text-indigo-300 flex items-center space-x-1.5">
                              <Info className="h-3.5 w-3.5" />
                              <span>Deep Dive: {crit.name}</span>
                            </p>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              This criterion was graded based on your stated context and realistic market/life baselines. Changing the importance slider directly multiplies the influence this metric has on your overall Tiebreaker recommendation.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
