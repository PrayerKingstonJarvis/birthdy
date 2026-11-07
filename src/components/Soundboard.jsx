import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { playSound } from '../audio/soundEffects';

const SOUNDS = [
  { id: 'horn', name: 'Party Horn', icon: '🎺', color: 'from-amber-500 to-yellow-600' },
  { id: 'confetti', name: 'Confetti Pop', icon: '🎉', color: 'from-pink-500 to-rose-600' },
  { id: 'fanfare', name: 'Royal Fanfare', icon: '👑', color: 'from-purple-500 to-indigo-600' },
  { id: 'coin', name: 'Lucky Coin', icon: '🪙', color: 'from-yellow-400 to-amber-500' },
  { id: 'cardMatch', name: 'Starry Chime', icon: '✨', color: 'from-cyan-400 to-blue-500' },
  { id: 'candleBlow', name: 'Candle Breeze', icon: '💨', color: 'from-emerald-400 to-teal-500' },
];

export default function Soundboard() {
  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl text-center shadow-xl">
        <div className="flex items-center justify-center gap-2 mb-2 text-rose-300">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="font-pixel text-[10px] sm:text-xs uppercase tracking-wider">
            Interactive Carnival DJ Soundboard
          </span>
          <Sparkles className="w-4 h-4 text-amber-300" />
        </div>
        <h3 className="font-serif-title text-2xl font-bold text-slate-100">
          Tap to Make Some Celebratory Noise!
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Mix your own birthday sound effects directly in real-time.
        </p>

        {/* Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-6">
          {SOUNDS.map((s) => (
            <button
              key={s.id}
              onClick={() => playSound(s.id)}
              className={`p-3.5 rounded-2xl bg-gradient-to-br ${s.color} text-slate-950 font-bold shadow-lg hover:scale-105 active:scale-90 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer`}
            >
              <span className="text-2xl filter drop-shadow">{s.icon}</span>
              <span className="text-[11px] font-sans font-semibold tracking-wide">
                {s.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
