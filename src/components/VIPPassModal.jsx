import React from 'react';
import { X, CheckCircle2, Ticket, Award, ArrowRight, Sparkles } from 'lucide-react';
import { playSound } from '../audio/soundEffects';

export default function VIPPassModal({
  isOpen,
  onClose,
  data,
  quests,
  onScrollToSection,
  onOpenFinale
}) {
  if (!isOpen) return null;

  const questList = [
    {
      id: 'cake',
      title: 'Craft & Blow The 25th Cake',
      desc: 'Customize the flavor and blow out the candles.',
      done: quests.cake,
      section: 'cake-section',
      icon: '🎂'
    },
    {
      id: 'claw',
      title: 'Win A Romantic Love Coupon',
      desc: 'Catch a mystery capsule in the arcade claw machine.',
      done: quests.claw,
      section: 'claw-section',
      icon: '🕹️'
    },
    {
      id: 'constellation',
      title: 'Align The Cosmic Constellation',
      desc: 'Find all 6 matching memory pairs in the starry sky.',
      done: quests.constellation,
      section: 'constellation-section',
      icon: '🌌'
    },
    {
      id: 'scratch',
      title: 'Scratch The Secret Love Letter',
      desc: 'Rub away the golden foil to uncover the private letter.',
      done: quests.scratch,
      section: 'scratch-section',
      icon: '🪙'
    }
  ];

  const completedCount = Object.values(quests).filter(Boolean).length;
  const isAllComplete = completedCount === 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="max-w-xl w-full bg-slate-900 border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2 text-amber-300">
          <Ticket className="w-5 h-5" />
          <span className="font-pixel text-xs tracking-wider uppercase">
            Official VIP Carnival Passport
          </span>
        </div>

        <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-slate-100">
          Gitika’s 25th Birthday Quests
        </h3>

        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Complete all 4 interactive carnival quests to claim your official Royal Birthday Crowning.
        </p>

        {/* Progress Bar */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-semibold">Passport Progress:</span>
            <span className="font-bold text-amber-300">{completedCount} of 4 Completed</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 transition-all duration-500"
              style={{ width: `${(completedCount / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Quest List */}
        <div className="mt-5 flex flex-col gap-2.5">
          {questList.map((q) => (
            <div
              key={q.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                q.done
                  ? 'bg-amber-500/10 border-amber-400/60 text-slate-200'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{q.icon}</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    <span>{q.title}</span>
                    {q.done && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </h4>
                  <p className="text-[11px] text-slate-400">{q.desc}</p>
                </div>
              </div>

              {!q.done ? (
                <button
                  onClick={() => {
                    onClose();
                    onScrollToSection(q.section);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Play</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="font-pixel text-[10px] text-amber-300 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                  STAMPED
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Finale Action */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          {isAllComplete ? (
            <button
              onClick={() => {
                onClose();
                onOpenFinale();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 text-slate-950 font-bold text-sm sm:text-base shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
            >
              <Award className="w-5 h-5 text-slate-950" />
              <span>Claim Royal Birthday Crown & Certificate! 👑</span>
            </button>
          ) : (
            <div className="text-center text-xs text-slate-500">
              Complete remaining quests to unlock Gitika's Royal Birthday Ceremony!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
