import React, { useState } from 'react';
import { 
  Scale, 
  Table2, 
  Grid2X2, 
  Trophy, 
  FlaskConical, 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  CheckCircle2,
  Sliders,
  RefreshCw
} from 'lucide-react';
import { DecisionAnalysisResult, OptionAnalysis, DecisionCriterion } from '../types/decision';
import { ProsConsTab } from './tabs/ProsConsTab';
import { ComparisonTableTab } from './tabs/ComparisonTableTab';
import { SwotTab } from './tabs/SwotTab';
import { VerdictTab } from './tabs/VerdictTab';
import { ScenarioLabTab } from './tabs/ScenarioLabTab';

interface AnalysisViewProps {
  decisionTitle: string;
  analysis: DecisionAnalysisResult;
  onBackToEdit: () => void;
  onCommitDecision: (chosenOption: string, pledgeNotes: string) => void;
  committedOption?: string;
  onExport: () => void;
  onSaveToVault: () => void;
  isSaved: boolean;
}

type TabType = 'pros-cons' | 'comparison-table' | 'swot' | 'verdict' | 'what-if';

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  decisionTitle,
  analysis,
  onBackToEdit,
  onCommitDecision,
  committedOption,
  onExport,
  onSaveToVault,
  isSaved,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('verdict');
  const [currentOptions, setCurrentOptions] = useState<OptionAnalysis[]>(
    analysis.optionsAnalysis
  );
  const [currentCriteria, setCurrentCriteria] = useState<DecisionCriterion[]>(
    analysis.criteria
  );

  const tabs = [
    { id: 'verdict', label: 'Tiebreaker Verdict', icon: Trophy, badge: 'Recommended' },
    { id: 'pros-cons', label: 'Pros & Cons List', icon: Scale },
    { id: 'comparison-table', label: 'Comparison Matrix', icon: Table2 },
    { id: 'swot', label: 'SWOT Analysis', icon: Grid2X2 },
    { id: 'what-if', label: 'Scenario Lab', icon: FlaskConical },
  ] as const;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onBackToEdit}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors mr-2"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Edit Dilemma</span>
              </button>
              <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                {analysis.dilemmaType || 'Complex Decision'}
              </span>
              {committedOption && (
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Committed: {committedOption}</span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {decisionTitle}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {analysis.summary}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={onSaveToVault}
              className={`inline-flex items-center space-x-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                isSaved
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>{isSaved ? 'Saved in Vault' : 'Save Decision'}</span>
            </button>

            <button
              type="button"
              onClick={onExport}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-750 hover:text-white transition-all"
            >
              <Share2 className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Export Packet</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="mt-6 flex overflow-x-auto border-t border-slate-800/80 pt-4 -mb-1 scrollbar-none gap-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {'badge' in tab && !isActive && (
                  <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="transition-all duration-200">
        {activeTab === 'verdict' && (
          <VerdictTab
            verdict={analysis.verdict}
            optionsAnalysis={currentOptions}
            onCommitDecision={onCommitDecision}
            committedOption={committedOption}
          />
        )}

        {activeTab === 'pros-cons' && (
          <ProsConsTab
            optionsAnalysis={currentOptions}
            onUpdateOptions={setCurrentOptions}
          />
        )}

        {activeTab === 'comparison-table' && (
          <ComparisonTableTab
            criteria={currentCriteria}
            optionsAnalysis={currentOptions}
            onUpdateCriteria={setCurrentCriteria}
          />
        )}

        {activeTab === 'swot' && (
          <SwotTab optionsAnalysis={currentOptions} />
        )}

        {activeTab === 'what-if' && (
          <ScenarioLabTab
            decisionTitle={decisionTitle}
            optionsAnalysis={currentOptions}
            currentVerdict={analysis.verdict}
          />
        )}
      </div>
    </div>
  );
};
