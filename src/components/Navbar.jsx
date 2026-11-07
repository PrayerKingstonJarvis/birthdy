import React from 'react';
import { Volume2, VolumeX, Music, Sparkles, Settings, Award } from 'lucide-react';
import { playSound } from '../audio/soundEffects';

export default function Navbar({
  isMusicPlaying,
  onToggleMusic,
  isMuted,
  onToggleMute,
  discoMode,
  onToggleDisco,
  onOpenDirector,
  completedQuests,
  totalQuests,
  onOpenVIPPass
}) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-rose-500/20 px-4 lg:px-8 py-3 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-400 to-pink-500 p-[2px] shadow-lg shadow-rose-500/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-xl">
              🎪
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif-title text-base sm:text-lg font-bold tracking-wide bg-gradient-to-r from-amber-200 via-rose-300 to-pink-200 bg-clip-text text-transparent">
                Gitu’s Starry Carnival
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-pixel bg-rose-500/20 text-rose-300 border border-rose-500/30">
                25th
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Silver Jubilee Edition ✨</p>
          </div>
        </div>

        {/* Quest Progress Pill */}
        <button
          onClick={onOpenVIPPass}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition-all text-xs text-amber-200"
        >
          <Award className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>VIP Quest Pass:</span>
          <span className="font-bold text-amber-300 px-1.5 py-0.5 rounded bg-amber-500/20">
            {completedQuests} / {totalQuests}
          </span>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Background Music Button */}
          <button
            onClick={() => {
              onToggleMusic();
              playSound('coin');
            }}
            title={isMusicPlaying ? "Pause Birthday Melody" : "Play Birthday Music Box"}
            className={`p-2 rounded-lg border transition-all flex items-center gap-1 text-xs font-medium ${
              isMusicPlaying
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md shadow-rose-500/20'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-rose-200 hover:border-slate-600'
            }`}
          >
            <Music className={`w-4 h-4 ${isMusicPlaying ? 'animate-bounce text-rose-400' : ''}`} />
            <span className="hidden sm:inline">
              {isMusicPlaying ? 'Music ON' : 'Music'}
            </span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              onToggleMute();
              if (isMuted) playSound('coin');
            }}
            title={isMuted ? "Unmute FX" : "Mute Sound Effects"}
            className={`p-2 rounded-lg border transition-all ${
              !isMuted
                ? 'bg-slate-900 border-amber-500/40 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Disco Mode Easter Egg */}
          <button
            onClick={() => {
              onToggleDisco();
              playSound('fanfare');
            }}
            title="Toggle Secret Disco Mode"
            className={`p-2 rounded-lg border transition-all flex items-center gap-1 text-xs font-medium ${
              discoMode
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent animate-pulse shadow-lg shadow-purple-500/40'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-pink-500/50 hover:text-pink-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="hidden sm:inline">Disco</span>
          </button>

          {/* Director / Settings Button */}
          <button
            onClick={onOpenDirector}
            title="Edit Birthday Details & Messages"
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400/60 text-slate-300 hover:text-amber-300 transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
