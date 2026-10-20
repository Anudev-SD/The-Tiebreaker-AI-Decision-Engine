import React, { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Clock, 
  ShieldAlert, 
  RotateCcw, 
  Coins, 
  CheckCircle2, 
  HelpCircle,
  AlertTriangle,
  HeartHandshake,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Verdict, OptionAnalysis } from '../../types/decision';

interface VerdictTabProps {
  verdict: Verdict;
  optionsAnalysis: OptionAnalysis[];
  onCommitDecision: (chosenOption: string, pledgeNotes: string) => void;
  committedOption?: string;
}

export const VerdictTab: React.FC<VerdictTabProps> = ({
  verdict,
  optionsAnalysis,
  onCommitDecision,
  committedOption,
}) => {
  // Coin flip state
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState<string | null>(null);
  const [showCoinTest, setShowCoinTest] = useState(false);

  // Commitment pledge state
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [selectedCommit, setSelectedCommit] = useState(
    committedOption || verdict.recommendedOption
  );
  const [pledgeNote, setPledgeNote] = useState('');

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleCoinFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setCoinResult(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * optionsAnalysis.length);
      setCoinResult(optionsAnalysis[randomIndex].name);
      setIsFlipping(false);
    }, 1200);
  };

  const handleFinalCommit = () => {
    onCommitDecision(selectedCommit, pledgeNote);
    setShowCommitModal(false);
    triggerConfetti();
  };

  return (
    <div className="space-y-8">
      {/* 1. The Definitive Tiebreaker Banner */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 mb-3">
              <Trophy className="h-3.5 w-3.5" />
              <span>THE TIEBREAKER VERDICT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {verdict.recommendedOption}
            </h2>
            <p className="text-sm font-semibold text-emerald-400 mt-1">
              "{verdict.headline}"
            </p>
          </div>

          {/* Confidence Score Pill */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 min-w-[140px] text-center shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">
              AI Confidence
            </span>
            <div className="text-3xl font-black text-emerald-300">
              {verdict.confidencePercentage}%
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Definitive Margin
            </span>
          </div>
        </div>

        {/* Pivot Factor & In-depth Reason */}
        <div className="relative z-10 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Key Decisive Factor */}
          <div className="lg:col-span-1 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Sparkles className="h-4 w-4" />
                <span>The Decisive Tiebreaker</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {verdict.decisiveFactor}
              </p>
            </div>
            <p className="text-[11px] text-amber-400/80 mt-4 pt-3 border-t border-amber-500/20">
              When all other variables balance out, this pivotal reality tips the scale.
            </p>
          </div>

          {/* Detailed Synthesis */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Strategic Rationale
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {verdict.detailedVerdict}
              </p>
            </div>

            {/* Commit Button */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-3">
              <div className="text-xs text-slate-400">
                {committedOption ? (
                  <span className="text-emerald-400 font-semibold flex items-center space-x-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Locked in: {committedOption}</span>
                  </span>
                ) : (
                  <span>Ready to break free from analysis paralysis?</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowCommitModal(true)}
                className="inline-flex items-center space-x-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <HeartHandshake className="h-4 w-4" />
                <span>{committedOption ? 'Update Commitment' : 'Lock In Final Call'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Reversal Conditions: When to Pick the Other Option */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">
          <RotateCcw className="h-4 w-4" />
          <span>Falsification &amp; Reversal Conditions</span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white mb-2">
          When Should You Overrule This Verdict?
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          A great decision rule tells you when you're wrong. Choose an alternative option ONLY IF the following conditions apply to you:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verdict.reversalConditions.map((rc, idx) => (
            <div 
              key={idx}
              className="rounded-xl border border-indigo-500/20 bg-indigo-950/10 p-4 space-y-1.5"
            >
              <div className="flex items-center space-x-2">
                <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300">
                  Pick "{rc.optionName}" IF:
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {rc.condition}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. The 10/10/10 Rule (Suzy Welch Model) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Clock className="h-4 w-4" />
          <span>The 10/10/10 Perspective Rule</span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white mb-2">
          How Will You Feel About This Decision Over Time?
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Overcomes near-term emotional bias by mapping psychological reaction across 3 distinct time horizons:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              In 10 Minutes
            </span>
            <p className="text-xs text-slate-200 mt-2 leading-relaxed">
              {verdict.tenTenTenRule.tenMinutes}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
              In 10 Months
            </span>
            <p className="text-xs text-slate-200 mt-2 leading-relaxed">
              {verdict.tenTenTenRule.tenMonths}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              In 10 Years
            </span>
            <p className="text-xs text-slate-200 mt-2 leading-relaxed">
              {verdict.tenTenTenRule.tenYears}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Pre-Mortem Safeguard (Gary Klein Model) */}
      <div className="rounded-2xl border border-rose-500/30 bg-rose-950/15 p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
          <ShieldAlert className="h-4 w-4" />
          <span>Pre-Mortem Failure Prevention</span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white mb-2">
          If This Fails in 18 Months: What Caused It &amp; How to Prevent It Now
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="rounded-xl border border-rose-500/20 bg-slate-950/80 p-4">
            <p className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-1.5">
              The Postulated Failure Scenario
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {verdict.preMortem.failureScenario}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-slate-950/80 p-4">
            <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
              Preventive Antidote (Take Action Now)
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {verdict.preMortem.preventiveAction}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Subconscious Coin Flip Experiment */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-amber-400" />
            <div>
              <h4 className="font-bold text-sm text-white">The Subconscious Coin Flip Experiment</h4>
              <p className="text-xs text-slate-400">Can't decide? Test your intuition with decision psychology</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCoinTest(!showCoinTest)}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300"
          >
            {showCoinTest ? 'Hide Test' : 'Try Coin Flip'}
          </button>
        </div>

        {showCoinTest && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 animate-in fade-in">
            <p className="text-xs text-slate-300 leading-relaxed">
              Sigmund Freud &amp; behavioral psychologists observed that when you flip a coin to decide, 
              <strong> your emotional reaction while the coin is in the air (or immediately after it lands)</strong> reveals what you actually desire.
            </p>

            <div className="flex flex-col items-center justify-center py-6 bg-slate-950/80 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={handleCoinFlip}
                disabled={isFlipping}
                className={`flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-400 bg-gradient-to-tr from-amber-600 to-yellow-400 text-slate-950 font-black shadow-xl transition-all ${
                  isFlipping ? 'animate-bounce scale-110' : 'hover:scale-105 active:scale-95'
                }`}
              >
                <Coins className="h-8 w-8" />
              </button>

              <button
                type="button"
                onClick={handleCoinFlip}
                disabled={isFlipping}
                className="mt-4 rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-1.5 text-xs font-semibold text-amber-300 border border-amber-500/20"
              >
                {isFlipping ? 'Flipping through the air...' : 'Flip Tiebreaker Coin'}
              </button>

              {coinResult && (
                <div className="mt-4 text-center animate-in zoom-in-95 duration-200">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider">The Coin Landed On:</span>
                  <div className="text-base sm:text-lg font-extrabold text-amber-400 mt-0.5">
                    {coinResult}
                  </div>
                  <p className="text-xs text-slate-300 max-w-md mx-auto mt-2 italic">
                    Notice your immediate gut feeling: Did you feel relief? Or did you wish it had landed on the other choice? That feeling is your true preference.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Commitment Pledge Modal */}
      {showCommitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <HeartHandshake className="h-5 w-5 text-emerald-400" />
              <span>Lock In Your Decision</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Commitment brings clarity. Select the option you are deciding to execute:
            </p>

            <div className="mt-4 space-y-2">
              {optionsAnalysis.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedCommit(opt.name)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                    selectedCommit === opt.name
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.name}</span>
                    {selectedCommit === opt.name && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Personal Commitment Note / Next Step (Optional):
              </label>
              <textarea
                value={pledgeNote}
                onChange={e => setPledgeNote(e.target.value)}
                rows={2}
                placeholder="e.g., I will send the confirmation email tomorrow morning at 9am."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="mt-6 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowCommitModal(false)}
                className="rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinalCommit}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
              >
                Confirm &amp; Celebrate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
