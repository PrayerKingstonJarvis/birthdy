import React from 'react';
import { Sparkles, Heart, ChevronDown, CheckCircle2, Ticket } from 'lucide-react';
import { playSound } from '../audio/soundEffects';

export default function HeroCarnival({
  data,
  quests,
  onOpenVIPPass,
  onScrollToSection
}) {
  const completedCount = Object.values(quests).filter(Boolean).length;

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 pt-10 pb-16 overflow-hidden">
      {/* Background Ambience / Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] bg-gradient-to-tr from-rose-600/20 via-pink-500/15 to-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-12 left-10 w-32 h-32 bg-purple-600/15 rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-10 w-44 h-44 bg-rose-500/15 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Twinkling Star Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute text-amber-200/40 select-none"
            style={{
              top: `${(i * 19) % 95}%`,
              left: `${(i * 29) % 95}%`,
              fontSize: `${(i % 3) * 6 + 10}px`,
              animation: `twinkle ${(i % 4) + 2}s infinite ease-in-out ${(i % 3)}s`
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* Marquee Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-rose-500/40 text-rose-300 text-xs sm:text-sm font-medium shadow-lg shadow-rose-500/10 mb-6 backdrop-blur-md animate-pulse">
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span>Official Celebration Grounds • Gitika’s 25th Milestone</span>
        <Sparkles className="w-4 h-4 text-amber-300" />
      </div>

      {/* Main Title */}
      <h1 className="font-serif-title text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-5xl text-slate-100 leading-tight">
        The Starry Birthday Carnival for{' '}
        <span className="relative inline-block">
          <span className="bg-gradient-to-r from-amber-200 via-rose-400 to-pink-300 bg-clip-text text-transparent underline decoration-rose-500/50 decoration-wavy decoration-2">
            {data.nickname || data.name}
          </span>
          <span className="absolute -top-6 -right-6 text-2xl sm:text-3xl animate-bounce">
            👑
          </span>
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
        Step right up to an enchanted arcade of wonders, secret love notes, custom cakes, and starry wishes crafted just for your <span className="font-semibold text-rose-300">Silver Jubilee</span>.
      </p>

      {/* Interactive Golden VIP Pass Card */}
      <div className="mt-8 w-full max-w-xl mx-auto">
        <div
          onClick={onOpenVIPPass}
          className="group relative cursor-pointer rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-900/90 to-rose-500/20 border-2 border-amber-400/50 p-5 sm:p-6 backdrop-blur-xl shadow-2xl shadow-amber-500/10 hover:border-amber-400 hover:shadow-amber-500/20 transition-all duration-300"
        >
          {/* Top Notch Cutouts (Ticket aesthetic) */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-950 rounded-full border-r-2 border-amber-400/50" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-950 rounded-full border-l-2 border-amber-400/50" />

          {/* Ticket Header */}
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-amber-400" />
              <span className="font-pixel text-[11px] sm:text-xs text-amber-300 tracking-wider uppercase">
                VIP ALL-ACCESS PASS
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/30 text-rose-200 border border-rose-500/40">
              Pass Holder: {data.name}
            </span>
          </div>

          {/* Ticket Body / Stamp Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-left">
            <div className={`p-2.5 rounded-xl border transition-all ${quests.cake ? 'bg-amber-500/20 border-amber-400' : 'bg-slate-950/60 border-slate-800'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">🎂</span>
                {quests.cake && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-xs font-semibold text-slate-200">Cake Atelier</p>
              <p className="text-[10px] text-slate-400">{quests.cake ? 'Blow Out Done! ✦' : 'Blow Candles'}</p>
            </div>

            <div className={`p-2.5 rounded-xl border transition-all ${quests.claw ? 'bg-rose-500/20 border-rose-400' : 'bg-slate-950/60 border-slate-800'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">🕹️</span>
                {quests.claw && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-xs font-semibold text-slate-200">Love Claw</p>
              <p className="text-[10px] text-slate-400">{quests.claw ? 'Prize Claimed! ✦' : 'Catch Coupon'}</p>
            </div>

            <div className={`p-2.5 rounded-xl border transition-all ${quests.constellation ? 'bg-purple-500/20 border-purple-400' : 'bg-slate-950/60 border-slate-800'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">🌌</span>
                {quests.constellation && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-xs font-semibold text-slate-200">Cosmic Pair</p>
              <p className="text-[10px] text-slate-400">{quests.constellation ? 'Constellation Lit ✦' : 'Match Pairs'}</p>
            </div>

            <div className={`p-2.5 rounded-xl border transition-all ${quests.scratch ? 'bg-pink-500/20 border-pink-400' : 'bg-slate-950/60 border-slate-800'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">🪙</span>
                {quests.scratch && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-xs font-semibold text-slate-200">Secret Letter</p>
              <p className="text-[10px] text-slate-400">{quests.scratch ? 'Revealed! ✦' : 'Scratch Foil'}</p>
            </div>
          </div>

          {/* Ticket Footer / Call to action */}
          <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs text-amber-200">
            <span>Stamps Collected: <strong className="text-amber-300 font-bold">{completedCount}/4</strong></span>
            <span className="flex items-center gap-1 text-rose-300 group-hover:translate-x-1 transition-transform">
              View VIP Passport & Certificate →
            </span>
          </div>
        </div>
      </div>

      {/* Primary CTAs */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <button
          onClick={() => {
            playSound('horn');
            onScrollToSection('cake-section');
          }}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-slate-950 font-bold text-sm sm:text-base shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>🎂 Make a Wish & Blow Candles</span>
        </button>

        <button
          onClick={() => {
            playSound('coin');
            onScrollToSection('claw-section');
          }}
          className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-amber-300 hover:border-amber-400/60 font-semibold text-sm sm:text-base hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>🕹️ Play Arcade Claw</span>
        </button>
      </div>

      {/* Down Scroll Indicator */}
      <div
        onClick={() => onScrollToSection('cake-section')}
        className="mt-12 inline-flex flex-col items-center gap-1 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer animate-bounce"
      >
        <span className="text-xs tracking-wider uppercase font-medium">Scroll to explore</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  );
}
