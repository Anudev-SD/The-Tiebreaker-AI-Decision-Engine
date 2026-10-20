import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  ArrowRight, 
  SlidersHorizontal, 
  ShieldAlert, 
  Lightbulb, 
  HelpCircle,
  BrainCircuit,
  Compass
} from 'lucide-react';
import { PRESET_DILEMMAS, PresetDilemma } from '../data/presets';

interface DecisionFormProps {
  onSubmit: (data: {
    title: string;
    options: string[];
    context: string;
    perspective: string;
  }) => void;
  isLoading: boolean;
  initialData?: {
    title: string;
    options: string[];
    context: string;
    perspective: string;
  };
}

const PERSPECTIVES = [
  { id: 'Strategic & Balanced', label: 'Balanced Strategist', desc: 'Holistic 360° trade-offs, standard weighting' },
  { id: 'Ruthless Pragmatist', label: 'Ruthless Pragmatist', desc: 'Focuses on execution risk, hidden costs & downside protection' },
  { id: 'Long-Term Investor', label: 'Long-Term Compounding', desc: 'Prioritizes 5-10 year asymmetric upside & future optionality' },
  { id: 'Wellbeing & Peace of Mind', label: 'Sustainable Wellbeing', desc: 'Prioritizes stress reduction, sleep, and burnout prevention' },
];

export const DecisionForm: React.FC<DecisionFormProps> = ({
  onSubmit,
  isLoading,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [options, setOptions] = useState<string[]>(
    initialData?.options && initialData.options.length >= 2
      ? initialData.options
      : ['', '']
  );
  const [context, setContext] = useState(initialData?.context || '');
  const [perspective, setPerspective] = useState(
    initialData?.perspective || 'Strategic & Balanced'
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  // Sync if initialData changes (e.g. from preset click)
  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setOptions(initialData.options);
      setContext(initialData.context);
      setPerspective(initialData.perspective);
    }
  }, [initialData]);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSuggestOptions = async () => {
    if (!title.trim()) {
      setSuggestionError('Please enter a decision topic first so AI can brainstorm options.');
      return;
    }
    setSuggestionError(null);
    setIsSuggesting(true);

    try {
      const res = await fetch('/api/suggest-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dilemma: title }),
      });
      if (!res.ok) throw new Error('Failed to brainstorm options');
      const data = await res.json();
      if (data.options && data.options.length >= 2) {
        setOptions(data.options.map((o: { name: string; shortDescription?: string }) => 
          o.shortDescription ? `${o.name} (${o.shortDescription})` : o.name
        ));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSuggestionError(msg || 'Could not brainstorm options. Please enter them manually.');
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = options.map(o => o.trim()).filter(Boolean);
    if (!title.trim()) return;
    if (validOptions.length < 2) return;

    onSubmit({
      title: title.trim(),
      options: validOptions,
      context: context.trim(),
      perspective,
    });
  };

  const isFormValid =
    title.trim().length > 3 &&
    options.filter(o => o.trim().length > 0).length >= 2;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Hero Headline */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 mb-3">
          <BrainCircuit className="h-3.5 w-3.5" />
          <span>Multi-Perspective Decision Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
          Stuck between choices?{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            Let's break the tie.
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Input your dilemma. The Tiebreaker rigorously maps your pros &amp; cons, weighs multi-criteria matrices, maps SWOT quadrants, and delivers a decisive verdict with clear reversal conditions.
        </p>
      </div>

      {/* Main Card */}
      <form 
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* 1. Dilemma Topic */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <span>1. What decision are you wrestling with?</span>
            </label>
            <span className="text-[11px] text-slate-400">Be as specific as possible</span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Should I accept the senior startup role or remain at my corporate job?"
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3.5 text-sm sm:text-base text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
              required
            />
          </div>
        </div>

        {/* 2. Options Builder */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <span>2. What are the competing options?</span>
            </label>
            
            {/* AI Suggest Options Button */}
            <button
              type="button"
              onClick={handleSuggestOptions}
              disabled={isSuggesting || !title.trim()}
              className="inline-flex items-center space-x-1 text-xs font-medium text-amber-400 hover:text-amber-300 disabled:opacity-50 disabled:hover:text-amber-400 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isSuggesting ? 'Brainstorming...' : 'Brainstorm options for me'}</span>
            </button>
          </div>

          {suggestionError && (
            <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5">
              {suggestionError}
            </p>
          )}

          <div className="space-y-2.5">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                  {String.fromCharCode(65 + index)}
                </div>
                <input
                  type="text"
                  value={option}
                  onChange={e => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)} (e.g., ${
                    index === 0 ? 'Accept the Series-A Startup' : 'Stay at Corporate Firm'
                  })`}
                  className="flex-1 rounded-xl border border-slate-700/80 bg-slate-950/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
                    title="Remove option"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {options.length < 5 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 pt-1 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add another option (up to 5)</span>
            </button>
          )}
        </div>

        {/* 3. Context & Perspective (Collapsible or Expandable) */}
        <div className="border-t border-slate-800/80 pt-4 mb-6">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-left py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
          >
            <span className="flex items-center space-x-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-400" />
              <span>3. Personal Context &amp; Advisor Stance ({showAdvanced ? 'Hide' : 'Customize'})</span>
            </span>
            <span className="text-slate-400 text-xs normal-case font-normal">
              {showAdvanced ? 'Collapse' : 'Add constraints & advisor style'}
            </span>
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-5 animate-in fade-in duration-200">
              {/* Context textarea */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Personal constraints, values, or stakes (Optional):
                </label>
                <textarea
                  value={context}
                  onChange={e => setContext(e.target.value)}
                  rows={3}
                  placeholder="e.g., I have 6 months of emergency savings. I have two kids. I value flexible work hours more than raw status. The deadline to decide is next Friday."
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>

              {/* Advisor perspective */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Advisor Mindset:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PERSPECTIVES.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPerspective(p.id)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        perspective === p.id
                          ? 'border-emerald-500/60 bg-emerald-500/10 text-white shadow-sm shadow-emerald-500/10'
                          : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-200">{p.label}</span>
                        {perspective === p.id && (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full flex items-center justify-center space-x-2 rounded-xl py-3.5 px-6 font-semibold text-sm sm:text-base transition-all ${
              !isFormValid || isLoading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-slate-950 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:brightness-105 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                <span className="text-slate-950">Synthesizing Decision Matrix...</span>
              </div>
            ) : (
              <>
                <span>Analyze &amp; Break The Tie</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Quick Inspiration Cards */}
      <div className="mt-12">
        <div className="flex items-center space-x-2 mb-4">
          <Compass className="h-4 w-4 text-emerald-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Or test with a real-world dilemma:
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESET_DILEMMAS.slice(0, 3).map((preset, idx) => (
            <div
              key={idx}
              onClick={() => {
                setTitle(preset.title);
                setOptions(preset.options);
                setContext(preset.context);
                setPerspective(preset.perspective);
                setShowAdvanced(true);
              }}
              className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:border-emerald-500/40 hover:bg-slate-850/80 transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400">
                  {preset.category}
                </span>
                <span className="text-[11px] text-slate-400 group-hover:text-emerald-400 transition-colors">
                  Load &rarr;
                </span>
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-slate-200 group-hover:text-white transition-colors line-clamp-2">
                {preset.title}
              </h3>
              <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                {preset.options.join(' vs. ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
