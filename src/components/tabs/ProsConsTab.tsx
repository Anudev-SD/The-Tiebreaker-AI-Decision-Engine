import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Trash2, 
  Check, 
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Tag
} from 'lucide-react';
import { OptionAnalysis, DecisionItem } from '../../types/decision';

interface ProsConsTabProps {
  optionsAnalysis: OptionAnalysis[];
  onUpdateOptions: (updated: OptionAnalysis[]) => void;
}

export const ProsConsTab: React.FC<ProsConsTabProps> = ({
  optionsAnalysis,
  onUpdateOptions,
}) => {
  const [addingTo, setAddingTo] = useState<{
    optionIndex: number;
    type: 'pro' | 'con';
  } | null>(null);

  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemWeight, setNewItemWeight] = useState(3);
  const [newItemCategory, setNewItemCategory] = useState('Personal Priority');

  // Calculate Net Score for each option: sum of active pros weights - sum of active cons weights
  const calculateNetScore = (option: OptionAnalysis) => {
    const prosScore = option.pros
      .filter(p => p.isActive !== false)
      .reduce((sum, p) => sum + p.weight, 0);

    const consScore = option.cons
      .filter(c => c.isActive !== false)
      .reduce((sum, c) => sum + c.weight, 0);

    return { prosScore, consScore, net: prosScore - consScore };
  };

  const handleToggleItem = (
    optIdx: number,
    type: 'pros' | 'cons',
    itemId: string
  ) => {
    const updated = [...optionsAnalysis];
    const targetList = updated[optIdx][type];
    const item = targetList.find(i => i.id === itemId);
    if (item) {
      item.isActive = item.isActive === false ? true : false;
      onUpdateOptions(updated);
    }
  };

  const handleDeleteItem = (
    optIdx: number,
    type: 'pros' | 'cons',
    itemId: string
  ) => {
    const updated = [...optionsAnalysis];
    updated[optIdx][type] = updated[optIdx][type].filter(i => i.id !== itemId);
    onUpdateOptions(updated);
  };

  const handleSaveCustomItem = (optIdx: number, type: 'pro' | 'con') => {
    if (!newItemTitle.trim()) return;

    const updated = [...optionsAnalysis];
    const listKey = type === 'pro' ? 'pros' : 'cons';
    const newItem: DecisionItem = {
      id: `custom-${Date.now()}`,
      title: newItemTitle.trim(),
      description: newItemDesc.trim() || 'Custom factor added by you.',
      weight: newItemWeight,
      category: newItemCategory.trim() || 'Personal',
      isActive: true,
      isUserAdded: true,
    };

    updated[optIdx][listKey].push(newItem);
    onUpdateOptions(updated);

    // Reset
    setAddingTo(null);
    setNewItemTitle('');
    setNewItemDesc('');
    setNewItemWeight(3);
  };

  return (
    <div className="space-y-6">
      {/* Tab Context Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Interactive Scorecard:</strong> Toggle items on/off or add your personal pros &amp; cons to see real-time net impact scores recalculate.
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] shrink-0">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          <span>Weight 1-5 indicates degree of leverage or downside</span>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {optionsAnalysis.map((option, optIdx) => {
          const { prosScore, consScore, net } = calculateNetScore(option);
          const isWinner = net > 0;

          return (
            <div
              key={optIdx}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800 text-xs font-bold text-slate-300">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {option.name}
                      </h3>
                    </div>
                    <p className="text-xs text-indigo-300 font-medium mt-1">
                      {option.tagline}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      <span className="text-slate-500">Best for: </span>
                      {option.bestFor}
                    </p>
                  </div>

                  {/* Net Score Badge */}
                  <div className="text-right shrink-0">
                    <div
                      className={`inline-flex items-center space-x-1 rounded-xl px-3 py-1 text-xs font-bold ${
                        net > 0
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : net < 0
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <span>Net:</span>
                      <span className="text-sm">{net > 0 ? `+${net}` : net}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      +{prosScore} / -{consScore}
                    </div>
                  </div>
                </div>

                {/* Pros Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Pros &amp; Advantages ({option.pros.length})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAddingTo({ optionIndex: optIdx, type: 'pro' })}
                      className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Pro</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {option.pros.map(item => {
                      const isActive = item.isActive !== false;
                      return (
                        <div
                          key={item.id}
                          className={`rounded-xl border p-3 transition-all ${
                            isActive
                              ? 'border-emerald-500/30 bg-emerald-950/20 text-slate-200'
                              : 'border-slate-800/80 bg-slate-950/40 text-slate-500 line-through opacity-60'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start space-x-2.5">
                              <button
                                type="button"
                                onClick={() => handleToggleItem(optIdx, 'pros', item.id)}
                                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                  isActive
                                    ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                                    : 'border-slate-700 bg-slate-900'
                                }`}
                              >
                                {isActive && <Check className="h-3 w-3 stroke-[3]" />}
                              </button>
                              <div>
                                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                  <h4 className="font-semibold text-xs text-white">
                                    {item.title}
                                  </h4>
                                  <span className="rounded bg-slate-800/90 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                                    {item.category}
                                  </span>
                                  {item.isUserAdded && (
                                    <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-300">
                                      Custom
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0">
                              <span
                                className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20"
                                title={`Impact Weight: ${item.weight}/5`}
                              >
                                +{item.weight}
                              </span>
                              {item.isUserAdded && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem(optIdx, 'pros', item.id)}
                                  className="text-slate-500 hover:text-rose-400 transition-colors"
                                  title="Delete custom pro"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cons Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider">
                      <XCircle className="h-4 w-4" />
                      <span>Cons &amp; Drawbacks ({option.cons.length})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAddingTo({ optionIndex: optIdx, type: 'con' })}
                      className="inline-flex items-center space-x-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Con</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {option.cons.map(item => {
                      const isActive = item.isActive !== false;
                      return (
                        <div
                          key={item.id}
                          className={`rounded-xl border p-3 transition-all ${
                            isActive
                              ? 'border-rose-500/30 bg-rose-950/20 text-slate-200'
                              : 'border-slate-800/80 bg-slate-950/40 text-slate-500 line-through opacity-60'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start space-x-2.5">
                              <button
                                type="button"
                                onClick={() => handleToggleItem(optIdx, 'cons', item.id)}
                                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                  isActive
                                    ? 'border-rose-500 bg-rose-500 text-slate-950'
                                    : 'border-slate-700 bg-slate-900'
                                }`}
                              >
                                {isActive && <Check className="h-3 w-3 stroke-[3]" />}
                              </button>
                              <div>
                                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                  <h4 className="font-semibold text-xs text-white">
                                    {item.title}
                                  </h4>
                                  <span className="rounded bg-slate-800/90 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                                    {item.category}
                                  </span>
                                  {item.isUserAdded && (
                                    <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-300">
                                      Custom
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0">
                              <span
                                className="inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/20"
                                title={`Impact Weight: ${item.weight}/5`}
                              >
                                -{item.weight}
                              </span>
                              {item.isUserAdded && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem(optIdx, 'cons', item.id)}
                                  className="text-slate-500 hover:text-rose-400 transition-colors"
                                  title="Delete custom con"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Add Custom Item Modal / Inline Form */}
                {addingTo?.optionIndex === optIdx && (
                  <div className="mt-4 rounded-xl border border-indigo-500/40 bg-slate-950 p-4 shadow-xl">
                    <h5 className="text-xs font-bold text-white mb-2 flex items-center space-x-1.5">
                      <Tag className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Add Custom {addingTo.type === 'pro' ? 'Pro' : 'Con'} to {option.name}</span>
                    </h5>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={newItemTitle}
                        onChange={e => setNewItemTitle(e.target.value)}
                        placeholder="Title (e.g., Shorter commute, Higher signing bonus)"
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        autoFocus
                      />
                      <textarea
                        value={newItemDesc}
                        onChange={e => setNewItemDesc(e.target.value)}
                        placeholder="Why does this matter to you? (optional details)"
                        rows={2}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <label className="text-[11px] text-slate-400">Impact Weight:</label>
                          <select
                            value={newItemWeight}
                            onChange={e => setNewItemWeight(Number(e.target.value))}
                            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white"
                          >
                            <option value={1}>1 (Minor)</option>
                            <option value={2}>2 (Noticeable)</option>
                            <option value={3}>3 (Moderate)</option>
                            <option value={4}>4 (Significant)</option>
                            <option value={5}>5 (Dealbreaker / Massive)</option>
                          </select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setAddingTo(null)}
                            className="rounded px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveCustomItem(optIdx, addingTo.type)}
                            className="rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500"
                          >
                            Save Item
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
