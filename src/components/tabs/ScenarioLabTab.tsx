import React, { useState } from 'react';
import { 
  FlaskConical, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { Verdict, OptionAnalysis, WhatIfResult } from '../../types/decision';

interface ScenarioLabTabProps {
  decisionTitle: string;
  optionsAnalysis: OptionAnalysis[];
  currentVerdict: Verdict;
}

const SAMPLE_SCENARIOS = [
  'What if funding/budget falls through or revenue drops 30%?',
  'What if I have to move to a different city in 12 months?',
  'What if I receive a counter-offer with 20% higher compensation?',
  'What if remote work flexibility is completely cancelled?',
  'What if the workload doubles during peak quarters?'
];

export const ScenarioLabTab: React.FC<ScenarioLabTabProps> = ({
  decisionTitle,
  optionsAnalysis,
  currentVerdict,
}) => {
  const [scenarioInput, setScenarioInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WhatIfResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async (scenarioText: string) => {
    if (!scenarioText.trim()) return;
    setIsLoading(true);
    setError(null);
    setScenarioInput(scenarioText);

    try {
      const res = await fetch('/api/what-if', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decisionTitle,
          options: optionsAnalysis.map(o => o.name),
          currentVerdict,
          scenario: scenarioText.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('Simulation failed. Please try again.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Simulation request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
          <FlaskConical className="h-4 w-4" />
          <span>The "What-If" Stress Test Engine</span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white">
          Simulate Wildcards &amp; Black Swan Events
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Decisions don't happen in a vacuum. Test how changing assumptions, market swings, or surprise offers alter your Tiebreaker recommendation.
        </p>

        {/* Input box */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={scenarioInput}
            onChange={e => setScenarioInput(e.target.value)}
            placeholder="Type any hypothetical event (e.g., What if I end up having to commute 3 days a week?)"
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            onKeyDown={e => {
              if (e.key === 'Enter') handleSimulate(scenarioInput);
            }}
          />
          <button
            type="button"
            onClick={() => handleSimulate(scenarioInput)}
            disabled={isLoading || !scenarioInput.trim()}
            className="inline-flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shrink-0"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Run Simulation</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Scenario Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 mr-1">Quick Scenarios:</span>
          {SAMPLE_SCENARIOS.map((sc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSimulate(sc)}
              className="rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-[11px] text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-950/20 hover:text-white transition-all text-left"
            >
              {sc}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Simulation Result */}
      {result && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl animate-in fade-in duration-300 space-y-6">
          {/* Winner Flip Status Callout */}
          <div
            className={`rounded-xl border p-4 flex items-center justify-between gap-4 ${
              result.doesWinnerFlip
                ? 'border-amber-500/50 bg-amber-950/20 text-amber-200'
                : 'border-emerald-500/50 bg-emerald-950/20 text-emerald-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              {result.doesWinnerFlip ? (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle className="h-5 w-5" />
                </div>
              )}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">
                  {result.doesWinnerFlip ? 'Decision Winner Inverted' : 'Recommendation Holds Resilient'}
                </p>
                <h4 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                  {result.doesWinnerFlip
                    ? `Under this scenario, "${result.newRecommendedOption}" becomes the superior choice.`
                    : `"${currentVerdict.recommendedOption}" remains the optimal choice despite this change.`}
                </h4>
              </div>
            </div>
          </div>

          {/* Scenario Impact Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Macro Dynamics Shift
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {result.scenarioImpact}
            </p>
          </div>

          {/* Impact on each option */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Option-by-Option Stress Response
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.optionImpacts.map((opt, i) => {
                const isPositive = opt.impactLevel.includes('Improved') || opt.impactLevel.includes('Game-Changer');
                const isNegative = opt.impactLevel.includes('Worse');

                return (
                  <div key={i} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-white">
                        {opt.optionName}
                      </span>
                      <span
                        className={`inline-flex items-center space-x-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                          isPositive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isNegative
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {isPositive ? <TrendingUp className="h-3 w-3" /> : isNegative ? <TrendingDown className="h-3 w-3" /> : null}
                        <span>{opt.impactLevel}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {opt.notes}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contingency Advice */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1 flex items-center space-x-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Contingency Playbook</span>
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {result.contingencyAdvice}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
