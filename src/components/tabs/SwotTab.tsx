import React, { useState } from 'react';
import { 
  Shield, 
  AlertCircle, 
  TrendingUp, 
  Flame, 
  Lightbulb, 
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { OptionAnalysis } from '../../types/decision';

interface SwotTabProps {
  optionsAnalysis: OptionAnalysis[];
}

export const SwotTab: React.FC<SwotTabProps> = ({ optionsAnalysis }) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'focused' | 'comparison'>('focused');

  const currentOption = optionsAnalysis[selectedOptionIndex] || optionsAnalysis[0];

  return (
    <div className="space-y-6">
      {/* View Switcher and Option Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        {/* Option Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {optionsAnalysis.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedOptionIndex(idx);
                setViewMode('focused');
              }}
              className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                selectedOptionIndex === idx && viewMode === 'focused'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="flex h-4 w-4 items-center justify-center rounded bg-slate-800 text-[10px] text-slate-300">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="line-clamp-1">{opt.name}</span>
            </button>
          ))}
        </div>

        {/* Comparison toggle */}
        {optionsAnalysis.length >= 2 && (
          <button
            onClick={() => setViewMode(viewMode === 'focused' ? 'comparison' : 'focused')}
            className={`flex items-center space-x-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
              viewMode === 'comparison'
                ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <span>{viewMode === 'comparison' ? 'Show Focused View' : 'Compare Side-by-Side'}</span>
          </button>
        )}
      </div>

      {viewMode === 'focused' ? (
        /* Focused SWOT Matrix for Single Option */
        <div className="space-y-6">
          {/* Active Option Heading */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Comprehensive Strategic Audit
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  {currentOption.name}
                </h3>
                <p className="text-xs text-indigo-300 font-medium mt-1">
                  "{currentOption.tagline}" &bull; <span className="text-slate-400">Best for: {currentOption.bestFor}</span>
                </p>
              </div>
            </div>
          </div>

          {/* 2x2 SWOT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Strengths */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 shadow-lg backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <Shield className="h-4 w-4" />
                  <span>Strengths (Internal Advantages)</span>
                </div>
                <ul className="space-y-2.5">
                  {currentOption.swot.strengths.map((str, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs text-slate-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[11px] text-emerald-400/80 font-medium">
                Leverage: Inherent attributes you directly control to build momentum.
              </div>
            </div>

            {/* Weaknesses */}
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5 shadow-lg backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <AlertCircle className="h-4 w-4" />
                  <span>Weaknesses (Internal Vulnerabilities)</span>
                </div>
                <ul className="space-y-2.5">
                  {currentOption.swot.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs text-slate-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-rose-500/20 text-[11px] text-rose-400/80 font-medium">
                Vulnerability: Internal deficits you must actively manage or compensate for.
              </div>
            </div>

            {/* Opportunities */}
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 shadow-lg backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <TrendingUp className="h-4 w-4" />
                  <span>Opportunities (External Tailwinds)</span>
                </div>
                <ul className="space-y-2.5">
                  {currentOption.swot.opportunities.map((opp, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs text-slate-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-cyan-500/20 text-[11px] text-cyan-400/80 font-medium">
                Upside: Market, technological, or timing factors that can supercharge results.
              </div>
            </div>

            {/* Threats */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 shadow-lg backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <Flame className="h-4 w-4" />
                  <span>Threats (External Risks)</span>
                </div>
                <ul className="space-y-2.5">
                  {currentOption.swot.threats.map((th, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs text-slate-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{th}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-500/20 text-[11px] text-amber-400/80 font-medium">
                Downside: Macro events or competitor actions that require risk buffers.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Side-by-Side Comparison of Options */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {optionsAnalysis.map((opt, idx) => (
            <div 
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4"
            >
              <div className="border-b border-slate-800 pb-3">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-800 text-[10px] font-bold text-slate-300 mb-1">
                  {String.fromCharCode(65 + idx)}
                </span>
                <h4 className="font-bold text-white text-base">{opt.name}</h4>
                <p className="text-xs text-indigo-300">{opt.tagline}</p>
              </div>

              {/* Compact SWOT Mini-Quadrants */}
              <div className="space-y-3">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-3">
                  <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
                    Strengths
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {opt.swot.strengths.slice(0, 3).map((s, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-emerald-400">&bull;</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-3">
                  <p className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-1.5">
                    Weaknesses
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {opt.swot.weaknesses.slice(0, 3).map((w, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-rose-400">&bull;</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/10 p-3">
                  <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1.5">
                    Opportunities
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {opt.swot.opportunities.slice(0, 3).map((o, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-cyan-400">&bull;</span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-3">
                  <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                    Threats
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {opt.swot.threats.slice(0, 3).map((t, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-amber-400">&bull;</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
