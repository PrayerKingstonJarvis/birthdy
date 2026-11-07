import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, Award, Heart, Printer, RotateCcw } from 'lucide-react';
import { playSound } from '../audio/soundEffects';

export default function GrandFinaleModal({ isOpen, onClose, data }) {
  useEffect(() => {
    if (isOpen) {
      playSound('fanfare');
      playSound('confetti');

      // Continuous celebration fireworks
      const end = Date.now() + 3 * 1000;
      const colors = ['#f43f5e', '#fbbf24', '#a855f7', '#38bdf8', '#ec4899'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFireConfetti = () => {
    playSound('fanfare');
    playSound('confetti');
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg overflow-y-auto">
      <div className="max-w-2xl w-full bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-10 shadow-2xl relative my-8 text-center animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Crown Icon */}
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-1 mb-4 shadow-xl shadow-rose-500/30 animate-bounce">
          <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-5xl">
            👑
          </div>
        </div>

        <span className="px-4 py-1.5 rounded-full text-xs font-pixel bg-amber-400/20 text-amber-300 border border-amber-400/50 uppercase tracking-widest">
          OFFICIAL ROYAL DECREE
        </span>

        <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-slate-100 mt-4 leading-tight">
          Long Live The Birthday Queen!
        </h2>

        {/* The Golden Certificate Box */}
        <div className="mt-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100 border-4 border-double border-amber-600 text-slate-900 shadow-2xl relative text-left">
          {/* Inner Golden Border */}
          <div className="border border-amber-800/40 p-4 sm:p-6 rounded-lg text-center">
            <span className="font-serif-title text-xs tracking-widest text-amber-800 uppercase font-semibold block mb-1">
              Certificate of Infinite Radiance & Love
            </span>

            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              Presented to Gitika ({data.nickname})
            </h3>

            <p className="font-serif-title italic text-sm text-slate-700 mt-2">
              On this auspicious occasion of her <strong className="text-rose-700">25th Birthday Silver Jubilee</strong>.
            </p>

            <div className="w-24 h-0.5 bg-amber-500/60 mx-auto my-4" />

            <p className="font-serif-title text-xs sm:text-sm text-slate-800 leading-relaxed max-w-md mx-auto">
              Be it known throughout all realms that Gitika is hereby crowned the undisputed ruler of hearts, source of boundless smiles, and the greatest gift to the universe.
            </p>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-amber-800/20 text-[11px] text-slate-600">
              <div>
                <p className="font-bold text-slate-800">Conferred by:</p>
                <p className="italic">Your Biggest Admirer Forever</p>
              </div>

              <div className="w-12 h-12 rounded-full bg-rose-600 border-2 border-rose-400 flex items-center justify-center text-white font-bold text-xs shadow-md">
                SEAL
              </div>

              <div className="text-right">
                <p className="font-bold text-slate-800">Date:</p>
                <p className="italic">November 2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleFireConfetti}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>More Fireworks & Confetti! 🎆</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-5 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:text-amber-300 hover:border-amber-400 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
