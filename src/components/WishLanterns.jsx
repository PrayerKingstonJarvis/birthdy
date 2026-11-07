import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Send, Sparkles, Heart } from 'lucide-react';
import { playSound } from '../audio/soundEffects';

export default function WishLanterns({ defaultLanterns, name }) {
  const [lanterns, setLanterns] = useState(() => {
    try {
      const saved = localStorage.getItem('gitu_wish_lanterns');
      return saved ? JSON.parse(saved) : defaultLanterns;
    } catch {
      return defaultLanterns;
    }
  });

  const [wishText, setWishText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [activeLantern, setActiveLantern] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('gitu_wish_lanterns', JSON.stringify(lanterns));
    } catch (e) {
      console.warn("Storage error:", e);
    }
  }, [lanterns]);

  const handleReleaseLantern = (e) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    playSound('confetti');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#fbbf24', '#f59e0b', '#fde047']
    });

    const newLantern = {
      id: Date.now(),
      text: wishText.trim(),
      author: authorName.trim() || 'With Love',
      x: 20 + Math.random() * 60,
      speed: 12 + Math.random() * 8
    };

    setLanterns(prev => [newLantern, ...prev]);
    setWishText('');
    setAuthorName('');
  };

  return (
    <section className="py-20 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <span>Tangled Starlight Sky</span>
        </div>
        <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-slate-100">
          The Midnight Wish Lanterns
        </h2>
        <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Whisper a wish for Gitika and release a glowing lantern into the starry night sky. Click any lantern to read its blessing.
        </p>
      </div>

      {/* Floating Lantern Sky Area */}
      <div className="relative w-full h-[380px] sm:h-[440px] rounded-3xl bg-gradient-to-b from-slate-950 via-indigo-950/70 to-slate-950 border-2 border-amber-500/30 overflow-hidden shadow-2xl p-4 flex flex-col justify-between">
        {/* Twinkling ambient starlight background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-amber-100/30 text-[10px]"
              style={{
                top: `${(i * 17) % 90}%`,
                left: `${(i * 31) % 95}%`,
                animation: `twinkle ${2 + (i % 3)}s infinite ease-in-out ${i % 2}s`
              }}
            >
              ✦
            </div>
          ))}
        </div>

        {/* Floating Lanterns */}
        <div className="absolute inset-0 pointer-events-auto overflow-hidden">
          {lanterns.map((lantern, idx) => {
            const posX = lantern.x || 15 + ((idx * 23) % 70);
            const posY = 15 + ((idx * 19) % 65);

            return (
              <div
                key={lantern.id}
                onClick={() => {
                  playSound('coin');
                  setActiveLantern(lantern);
                }}
                className="absolute cursor-pointer transition-transform hover:scale-125 z-10 group animate-float"
                style={{
                  left: `${posX}%`,
                  top: `${posY}%`,
                  animationDuration: `${4 + (idx % 3)}s`,
                  animationDelay: `${idx * 0.7}s`
                }}
              >
                {/* Glowing Lantern Graphic */}
                <div className="flex flex-col items-center">
                  {/* Glow Aura */}
                  <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-gradient-to-t from-amber-500 via-yellow-400 to-amber-200 shadow-[0_0_24px_rgba(251,191,36,0.85)] border border-yellow-100/80 flex flex-col items-center justify-between p-1.5 opacity-90 group-hover:opacity-100">
                    <span className="text-[10px] text-amber-900 font-pixel font-bold">✨</span>
                    {/* Candle flicker core inside lantern */}
                    <div className="w-3 h-5 rounded-full bg-white/90 shadow-[0_0_8px_white] animate-pulse" />
                    <div className="w-6 h-1 rounded-full bg-amber-700/60" />
                  </div>
                  {/* Lantern Hanging Tassel */}
                  <div className="w-0.5 h-3 bg-amber-400/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Lantern Message Card (Active) */}
        {activeLantern && (
          <div className="relative z-30 max-w-sm mx-auto bg-slate-900/95 border-2 border-amber-400/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-fade-in text-center">
            <span className="text-2xl mb-1 block">🏮</span>
            <p className="font-serif-title text-base font-bold text-amber-200">
              "{activeLantern.text}"
            </p>
            <p className="text-xs text-rose-300 font-serif-title italic mt-1">
              — {activeLantern.author}
            </p>
            <button
              onClick={() => setActiveLantern(null)}
              className="mt-3 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 cursor-pointer"
            >
              Close Blessing
            </button>
          </div>
        )}

        <div className="relative z-20 text-center text-xs text-amber-200/80 pointer-events-none">
          Click any glowing lantern floating in the sky to reveal its secret blessing ✨
        </div>
      </div>

      {/* Release New Lantern Form */}
      <form onSubmit={handleReleaseLantern} className="mt-6 flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Type your heartfelt birthday wish for Gitu..."
          value={wishText}
          onChange={(e) => setWishText(e.target.value)}
          className="flex-1 w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-amber-400 placeholder:text-slate-500 shadow-inner"
        />

        <input
          type="text"
          placeholder="Your Name (e.g. Forever Yours)"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="w-full sm:w-48 px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-amber-400 placeholder:text-slate-500 shadow-inner"
        />

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <Send className="w-4 h-4" />
          <span>Release Lantern 🏮</span>
        </button>
      </form>
    </section>
  );
}
