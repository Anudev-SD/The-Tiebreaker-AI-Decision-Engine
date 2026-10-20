import React from 'react';
import { Scale, History, PlusCircle, Sparkles, Share2, BookmarkCheck } from 'lucide-react';
import { PRESET_DILEMMAS, PresetDilemma } from '../data/presets';

interface NavbarProps {
  onNewDecision: () => void;
  onOpenSaved: () => void;
  savedCount: number;
  onSelectPreset: (preset: PresetDilemma) => void;
  hasActiveDecision: boolean;
  onOpenExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewDecision,
  onOpenSaved,
  savedCount,
  onSelectPreset,
  hasActiveDecision,
  onOpenExport,
}) => {
  const [showPresetsMenu, setShowPresetsMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div 
          onClick={onNewDecision}
          className="flex cursor-pointer items-center space-x-3 transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-indigo-600 shadow-lg shadow-emerald-500/10">
            <Scale className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white">The Tiebreaker</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                AI Decision Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Break decision paralysis with structured reasoning</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Presets Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPresetsMenu(!showPresetsMenu)}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-850 hover:text-white transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Explore Presets</span>
              <span className="sm:hidden">Presets</span>
            </button>

            {showPresetsMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowPresetsMenu(false)} 
                />
                <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl backdrop-blur-xl">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-slate-200">Load a Sample Dilemma</p>
                    <p className="text-[11px] text-slate-400">See how The Tiebreaker analyzes real high-stakes choices</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1">
                    {PRESET_DILEMMAS.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onSelectPreset(preset);
                          setShowPresetsMenu(false);
                        }}
                        className="w-full text-left rounded-lg px-3 py-2 text-xs hover:bg-slate-800 transition-colors group"
                      >
                        <span className="inline-block rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-400 mb-1">
                          {preset.category}
                        </span>
                        <p className="font-medium text-slate-200 group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {preset.title}
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {preset.options.join(' vs ')}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Export / Share Button (if active decision) */}
          {hasActiveDecision && (
            <button
              onClick={onOpenExport}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              title="Export Decision Analysis"
            >
              <Share2 className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden md:inline">Export</span>
            </button>
          )}

          {/* Saved Decisions */}
          <button
            onClick={onOpenSaved}
            className="relative flex items-center space-x-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <History className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Saved Vault</span>
            {savedCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500/20 px-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                {savedCount}
              </span>
            )}
          </button>

          {/* New Decision Button */}
          <button
            onClick={onNewDecision}
            className="flex items-center space-x-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 active:scale-95 transition-all"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Decision</span>
          </button>
        </div>
      </div>
    </header>
  );
};
