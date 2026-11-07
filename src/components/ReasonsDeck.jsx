import React, { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight, Shuffle, LayoutGrid, Layers } from 'lucide-react';
import { playSound } from '../audio/soundEffects';

export default function ReasonsDeck({ reasons, name }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState({});
  const [isGridView, setIsGridView] = useState(false);

  const handleNext = () => {
    playSound('coin');
    setCurrentIndex((prev) => (prev + 1) % reasons.length);
  };

  const handlePrev = () => {
    playSound('coin');
    setCurrentIndex((prev) => (prev - 1 + reasons.length) % reasons.length);
  };

  const handleShuffle = () => {
    playSound('cardFlip');
    const randomIdx = Math.floor(Math.random() * reasons.length);
    setCurrentIndex(randomIdx);
  };

  const handleLike = (index) => {
    playSound('cardMatch');
    setLikes((prev) => ({
      ...prev,
      [index]: (prev[index] || 0) + 1
    }));
  };

  return (
    <section className="py-20 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <span>Quarter Century Tribute</span>
        </div>
        <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-slate-100">
          25 Reasons Why Gitu is Irreplaceable
        </h2>
        <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          One unique reason for each radiant year of your life, celebrated with all my heart.
        </p>

        {/* View Toggle */}
        <div className="mt-6 inline-flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => {
              playSound('coin');
              setIsGridView(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              !isGridView
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Card Stepper</span>
          </button>

          <button
            onClick={() => {
              playSound('coin');
              setIsGridView(true);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              isGridView
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All 25 Reasons Grid</span>
          </button>
        </div>
      </div>

      {!isGridView ? (
        /* Single Card Carousel View */
        <div className="max-w-xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-rose-950/70 via-slate-900 to-slate-950 border-2 border-rose-500/40 p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center min-h-[280px] flex flex-col justify-between">
            {/* Top Badge */}
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
              <span className="font-pixel text-[11px] text-amber-300">
                REASON #{currentIndex + 1} OF 25
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300">
                Year {currentIndex + 1}
              </span>
            </div>

            {/* Central Reason Content */}
            <div className="py-6 sm:py-8">
              <p className="font-serif-title text-xl sm:text-2xl text-slate-100 leading-relaxed font-normal">
                "{reasons[currentIndex]}"
              </p>
            </div>

            {/* Footer / Like Counter */}
            <div className="flex items-center justify-between border-t border-rose-500/20 pt-4">
              <span className="text-xs text-slate-400">
                Dedicated to Gitika ❤️
              </span>

              <button
                onClick={() => handleLike(currentIndex)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold active:scale-95 transition-all cursor-pointer"
              >
                <Heart className={`w-3.5 h-3.5 fill-rose-400 text-rose-400 ${likes[currentIndex] ? 'animate-ping' : ''}`} />
                <span>{likes[currentIndex] ? `${likes[currentIndex]} Loves` : 'Send Love'}</span>
              </button>
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-400/50 text-slate-200 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleShuffle}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 text-amber-300 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>

            <button
              onClick={handleNext}
              className="p-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs"
            >
              <span>Next Reason</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* All 25 Reasons Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-pixel text-[9px] text-amber-300">
                  #{idx + 1}
                </span>
                <button
                  onClick={() => handleLike(idx)}
                  className="text-rose-400 hover:scale-110 active:scale-95 transition-transform"
                >
                  <Heart className={`w-3.5 h-3.5 ${likes[idx] ? 'fill-rose-400' : ''}`} />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                {reason}
              </p>

              <span className="text-[10px] text-slate-500 mt-3 block">
                Year {idx + 1} Sparkle
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
