import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, Sparkles, Smile, MessageCircle } from 'lucide-react';
import { playSound } from '../audio/soundEffects';

export default function DialogueCutscene({ enteredName, onProceed }) {
  const [stage, setStage] = useState(1);

  useEffect(() => {
    // Initial celebration burst when portal is breached
    playSound('fanfare');
    playSound('confetti');

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#fbbf24', '#ec4899', '#a855f7', '#38bdf8']
    });

    // After 3 seconds, advance to stage 2:
    const timer = setTimeout(() => {
      playSound('cardMatch');
      setStage(2);
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="max-w-lg w-full bg-gradient-to-br from-rose-900/90 via-slate-900 to-amber-900/80 border-2 border-rose-400/80 rounded-3xl p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden">
        {/* Decorative Floating Sparkles */}
        <div className="absolute top-2 right-4 text-amber-300 text-xl animate-bounce">✨</div>
        <div className="absolute bottom-4 left-4 text-rose-300 text-xl animate-pulse">💖</div>

        {/* Character Avatar / Host */}
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-pink-500 p-1 mb-4 shadow-xl shadow-rose-500/30">
          <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-4xl">
            {stage === 1 ? '😜' : '🎩'}
          </div>
        </div>

        {/* Stage 1: The Initial Slip-Up */}
        {stage === 1 && (
          <div className="animate-scale-up">
            <span className="px-3 py-1 rounded-full text-xs font-pixel bg-rose-500/30 text-rose-300 border border-rose-500/40 uppercase">
              VOICE RECOGNITION ACTIVE
            </span>

            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white mt-4 leading-tight">
              “Oh, Bawli—oops, sorry, Choti!”
            </h2>

            <p className="text-xs text-rose-200/80 mt-3 animate-pulse">
              Re-calibrating etiquette protocol... [3 seconds]
            </p>
          </div>
        )}

        {/* Stage 2: The Apology & Courteous Welcome */}
        {stage === 2 && (
          <div className="animate-scale-up">
            <span className="px-3 py-1 rounded-full text-xs font-pixel bg-amber-400/30 text-amber-300 border border-amber-400/50 uppercase">
              PROTOCOL CORRECTED
            </span>

            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-amber-200 mt-4 leading-snug">
              “Oh, my apologies—you’re Gitika Ma’am! My mistake, my mistake!”
            </h2>

            <p className="font-sans text-sm sm:text-base text-slate-200 mt-3 font-light leading-relaxed">
              How are you? I hope you didn’t have any trouble getting here.
            </p>

            <div className="my-5 p-3.5 rounded-2xl bg-slate-950/70 border border-amber-400/40 text-amber-300 text-sm font-medium flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>“Ma’am, please head this way...”</span>
            </div>

            <button
              onClick={() => {
                playSound('coin');
                onProceed();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 text-slate-950 font-bold text-sm sm:text-base shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Follow the Guide, Gitika Ma’am! 👑</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
