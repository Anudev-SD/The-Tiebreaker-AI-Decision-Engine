import React from 'react';
import { 
  X, 
  History, 
  Trash2, 
  ExternalLink, 
  Trophy, 
  CheckCircle2, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { SavedDecision } from '../types/decision';

interface SavedDecisionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: SavedDecision[];
  onLoadDecision: (decision: SavedDecision) => void;
  onDeleteDecision: (id: string) => void;
  onClearAll: () => void;
}

export const SavedDecisionsModal: React.FC<SavedDecisionsModalProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onLoadDecision,
  onDeleteDecision,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <History className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Decision Vault</h3>
              <p className="text-xs text-slate-400">
                {savedDecisions.length} decision{savedDecisions.length === 1 ? '' : 's'} recorded
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {savedDecisions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <History className="h-10 w-10 mx-auto text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-400">Your Decision Vault is empty</p>
              <p className="text-xs text-slate-500 mt-1">
                Analyze a dilemma and click "Save Decision" to keep track of your choices.
              </p>
            </div>
          ) : (
            savedDecisions.map(d => (
              <div
                key={d.id}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                      </span>
                      {d.selectedFinalOption && (
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Committed: {d.selectedFinalOption}</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors">
                      {d.title}
                    </h4>

                    <div className="mt-2 flex items-center space-x-2 text-xs">
                      <span className="text-slate-400">Winner:</span>
                      <span className="font-semibold text-amber-400 flex items-center space-x-1">
                        <Trophy className="h-3 w-3" />
                        <span>{d.analysis.verdict.recommendedOption}</span>
                      </span>
                      <span className="text-slate-600">&bull;</span>
                      <span className="text-slate-400">{d.options.length} options analyzed</span>
                    </div>

                    {d.notes && (
                      <p className="text-[11px] text-slate-400 italic mt-2 border-l-2 border-slate-700 pl-2">
                        "{d.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => {
                        onLoadDecision(d);
                        onClose();
                      }}
                      className="rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition-colors"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => onDeleteDecision(d.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800"
                      title="Delete decision"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedDecisions.length > 0 && (
          <div className="border-t border-slate-800 p-4 flex items-center justify-between text-xs">
            <button
              onClick={onClearAll}
              className="text-slate-500 hover:text-rose-400 transition-colors flex items-center space-x-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear All Saved</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg bg-slate-800 px-4 py-1.5 text-slate-300 hover:text-white font-medium"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
