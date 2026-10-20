import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  AlertCircle, 
  Sparkles, 
  BrainCircuit, 
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { DecisionForm } from './components/DecisionForm';
import { AnalysisView } from './components/AnalysisView';
import { SavedDecisionsModal } from './components/SavedDecisionsModal';
import { ExportModal } from './components/ExportModal';
import { DecisionAnalysisResult, SavedDecision } from './types/decision';
import { PresetDilemma } from './data/presets';

const STORAGE_KEY = 'tiebreaker_saved_decisions_v1';

export default function App() {
  const [activeDecisionTitle, setActiveDecisionTitle] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<DecisionAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    options: string[];
    context: string;
    perspective: string;
  } | null>(null);

  const [committedOption, setCommittedOption] = useState<string | undefined>(undefined);
  const [committedNotes, setCommittedNotes] = useState<string | undefined>(undefined);

  // Saved Decisions Vault
  const [savedDecisions, setSavedDecisions] = useState<SavedDecision[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [activeDecisionId, setActiveDecisionId] = useState<string | null>(null);

  // Load saved from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedDecisions(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved decisions:', e);
    }
  }, []);

  // Save to localStorage whenever savedDecisions changes
  const persistSavedDecisions = (newList: SavedDecision[]) => {
    setSavedDecisions(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  // Cycling loading steps for psychological delight during AI synthesis
  const loadingMessages = [
    'Deconstructing decision variables and constraints...',
    'Synthesizing pros, cons, and second-order consequences...',
    'Constructing 4-quadrant SWOT matrix for each option...',
    'Evaluating multi-criteria scores and weighted trade-offs...',
    'Synthesizing definitive Tiebreaker verdict & reversal conditions...',
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Submit decision to backend
  const handleSubmitDecision = async (data: {
    title: string;
    options: string[];
    context: string;
    perspective: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setFormData(data);
    setActiveDecisionTitle(data.title);
    setCommittedOption(undefined);
    setCommittedNotes(undefined);

    try {
      const response = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${response.status}`);
      }

      const result: DecisionAnalysisResult = await response.json();
      setAnalysisResult(result);

      // Auto-save this decision into vault
      const newId = `dec-${Date.now()}`;
      setActiveDecisionId(newId);
      const newSavedItem: SavedDecision = {
        id: newId,
        createdAt: new Date().toISOString(),
        title: data.title,
        options: data.options,
        context: data.context,
        perspective: data.perspective,
        analysis: result,
      };

      persistSavedDecisions([newSavedItem, ...savedDecisions]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'An unexpected error occurred while analyzing the decision.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle preset selection
  const handleSelectPreset = (preset: PresetDilemma) => {
    setFormData({
      title: preset.title,
      options: preset.options,
      context: preset.context,
      perspective: preset.perspective,
    });
    // If not already analyzing, user can review and click analyze
    setAnalysisResult(null);
  };

  // Handle committing to a final option
  const handleCommitDecision = (chosenOption: string, pledgeNotes: string) => {
    setCommittedOption(chosenOption);
    setCommittedNotes(pledgeNotes);

    if (activeDecisionId) {
      const updated = savedDecisions.map(d => 
        d.id === activeDecisionId 
          ? { ...d, selectedFinalOption: chosenOption, notes: pledgeNotes }
          : d
      );
      persistSavedDecisions(updated);
    }
  };

  // Manual save to vault button
  const handleSaveToVault = () => {
    if (!analysisResult) return;
    const existing = savedDecisions.find(d => d.id === activeDecisionId);
    if (!existing) {
      const newId = `dec-${Date.now()}`;
      setActiveDecisionId(newId);
      const newSavedItem: SavedDecision = {
        id: newId,
        createdAt: new Date().toISOString(),
        title: activeDecisionTitle,
        options: formData?.options || [],
        context: formData?.context,
        perspective: formData?.perspective,
        analysis: analysisResult,
        selectedFinalOption: committedOption,
        notes: committedNotes,
      };
      persistSavedDecisions([newSavedItem, ...savedDecisions]);
    }
  };

  // Load saved decision
  const handleLoadDecision = (saved: SavedDecision) => {
    setActiveDecisionId(saved.id);
    setActiveDecisionTitle(saved.title);
    setAnalysisResult(saved.analysis);
    setCommittedOption(saved.selectedFinalOption);
    setCommittedNotes(saved.notes);
    setFormData({
      title: saved.title,
      options: saved.options,
      context: saved.context || '',
      perspective: saved.perspective || 'Strategic & Balanced',
    });
  };

  // Delete saved decision
  const handleDeleteDecision = (id: string) => {
    const updated = savedDecisions.filter(d => d.id !== id);
    persistSavedDecisions(updated);
    if (activeDecisionId === id) {
      setActiveDecisionId(null);
    }
  };

  const handleClearAllSaved = () => {
    if (window.confirm('Are you sure you want to clear your decision vault?')) {
      persistSavedDecisions([]);
    }
  };

  // Reset to new decision form
  const handleNewDecision = () => {
    setAnalysisResult(null);
    setActiveDecisionTitle('');
    setFormData(null);
    setCommittedOption(undefined);
    setCommittedNotes(undefined);
    setActiveDecisionId(null);
    setError(null);
  };

  const isCurrentDecisionSaved = !!savedDecisions.find(d => d.id === activeDecisionId);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navbar */}
      <Navbar
        onNewDecision={handleNewDecision}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        savedCount={savedDecisions.length}
        onSelectPreset={handleSelectPreset}
        hasActiveDecision={!!analysisResult}
        onOpenExport={() => setIsExportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
        {/* Loading Overlay / Progress screen */}
        {isLoading && (
          <div className="w-full max-w-xl mx-auto my-16 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl text-center space-y-6 animate-in fade-in duration-300">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <Scale className="h-8 w-8 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Synthesizing Decision Intelligence
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Applying multi-criteria decision analysis &amp; behavioral game theory
              </p>
            </div>

            {/* Stepper indicator */}
            <div className="space-y-2 text-left bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
              {loadingMessages.map((msg, idx) => {
                const isCurrent = idx === loadingStep;
                const isDone = idx < loadingStep;
                return (
                  <div key={idx} className="flex items-center space-x-2.5 text-xs">
                    <span
                      className={`h-2 w-2 rounded-full shrink-0 transition-all ${
                        isDone
                          ? 'bg-emerald-400'
                          : isCurrent
                          ? 'bg-amber-400 animate-ping'
                          : 'bg-slate-700'
                      }`}
                    />
                    <span
                      className={
                        isDone
                          ? 'text-slate-400 font-medium'
                          : isCurrent
                          ? 'text-emerald-300 font-semibold'
                          : 'text-slate-600'
                      }
                    >
                      {msg}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && !isLoading && (
          <div className="max-w-2xl mx-auto mb-8 rounded-2xl border border-rose-500/40 bg-rose-950/20 p-5 shadow-xl text-rose-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">Analysis Encountered an Issue</h4>
                <p className="text-xs text-rose-300/90 mt-1 leading-relaxed">{error}</p>
                <button
                  type="button"
                  onClick={() => formData && handleSubmitDecision(formData)}
                  className="mt-3 inline-flex items-center space-x-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Retry Analysis</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form View vs Analysis View */}
        {!isLoading && !analysisResult && (
          <DecisionForm
            onSubmit={handleSubmitDecision}
            isLoading={isLoading}
            initialData={formData || undefined}
          />
        )}

        {!isLoading && analysisResult && (
          <AnalysisView
            decisionTitle={activeDecisionTitle}
            analysis={analysisResult}
            onBackToEdit={() => setAnalysisResult(null)}
            onCommitDecision={handleCommitDecision}
            committedOption={committedOption}
            onExport={() => setIsExportModalOpen(true)}
            onSaveToVault={handleSaveToVault}
            isSaved={isCurrentDecisionSaved}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Scale className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold text-slate-400">The Tiebreaker</span>
            <span>&bull; Systematic Decision Architecture</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Powered by Gemini multi-criteria evaluation, SWOT mapping &amp; behavioral decision psychology.
          </p>
        </div>
      </footer>

      {/* Saved Decisions Drawer/Modal */}
      <SavedDecisionsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedDecisions={savedDecisions}
        onLoadDecision={handleLoadDecision}
        onDeleteDecision={handleDeleteDecision}
        onClearAll={handleClearAllSaved}
      />

      {/* Export Memo Modal */}
      {analysisResult && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          decisionTitle={activeDecisionTitle}
          analysis={analysisResult}
          committedOption={committedOption}
        />
      )}
    </div>
  );
}
