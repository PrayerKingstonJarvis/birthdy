import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, CheckCircle2, Wand2 } from 'lucide-react';
import { playSound } from '../audio/soundEffects';

export default function ScratchCard({ secretLetter, onQuestComplete }) {
  const canvasRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);
  const soundCooldownRef = useRef(0);

  // Initialize Canvas Gold Foil
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';

    // Draw rich metallic gold gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#d97706');   // Amber 600
    grad.addColorStop(0.3, '#fde68a'); // Amber 200
    grad.addColorStop(0.5, '#f59e0b'); // Amber 500
    grad.addColorStop(0.8, '#fef08a'); // Yellow 200
    grad.addColorStop(1, '#b45309');   // Amber 700

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative Stars & Sparkles Pattern on foil
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 20px "Press Start 2P", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🪙 SCRATCH WITH LOVE 🪙', width / 2, height / 2 - 25);

    ctx.fillStyle = '#451a03';
    ctx.font = '16px "Outfit", sans-serif';
    ctx.fillText('Rub with mouse or touch to reveal Gitu’s 25th Letter', width / 2, height / 2 + 15);

    // Draw sparkle crosses
    ctx.strokeStyle = '#fffbeb';
    ctx.lineWidth = 2;
    for (let i = 0; i < 16; i++) {
      const sx = (i * 83) % width;
      const sy = (i * 97) % height;
      ctx.beginPath();
      ctx.moveTo(sx - 6, sy);
      ctx.lineTo(sx + 6, sy);
      ctx.moveTo(sx, sy - 6);
      ctx.lineTo(sx, sy + 6);
      ctx.stroke();
    }
  };

  useEffect(() => {
    initCanvas();
  }, []);

  // Scratch Action
  const scratch = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || isFullyRevealed) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 32, 0, Math.PI * 2);
    ctx.fill();

    // Sound effect throttle
    const now = Date.now();
    if (now - soundCooldownRef.current > 90) {
      playSound('scratch');
      soundCooldownRef.current = now;
    }

    checkProgress();
  };

  // Check how much has been scratched
  const checkProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || isFullyRevealed) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Sample pixels
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    let transparentCount = 0;
    const step = 32; // sampling step
    const totalSampled = (width * height) / step;

    for (let i = 3; i < data.length; i += step * 4) {
      if (data[i] === 0) {
        transparentCount++;
      }
    }

    const percent = Math.min(100, Math.round((transparentCount / totalSampled) * 100));
    setScratchPercent(percent);

    if (percent > 45 && !isFullyRevealed) {
      revealFullLetter();
    }
  };

  const revealFullLetter = () => {
    if (isFullyRevealed) return;
    setIsFullyRevealed(true);
    setScratchPercent(100);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    playSound('fanfare');
    playSound('confetti');

    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fbbf24', '#ec4899', '#f97316']
    });

    onQuestComplete('scratch');
  };

  return (
    <section id="scratch-section" className="py-20 px-4 max-w-4xl mx-auto scroll-mt-20">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Quest 04</span>
        </div>
        <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-slate-100">
          The Golden Scratch-Off Letter
        </h2>
        <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Rub away the metallic gold foil to uncover the secret handwritten 25th birthday letter for Gitu!
        </p>
      </div>

      {/* Progress & Quick Reveal Bar */}
      <div className="flex items-center justify-between mb-4 px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-amber-200">
          <span>Scratch Progress:</span>
          <span className="font-mono font-bold text-amber-400">{scratchPercent}%</span>
        </div>
        {!isFullyRevealed && (
          <button
            onClick={revealFullLetter}
            className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-400/40 transition-all cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Instant Magic Scratch</span>
          </button>
        )}
      </div>

      {/* The Scratch Card Container */}
      <div className="relative w-full rounded-3xl overflow-hidden border-4 border-amber-400/60 shadow-2xl bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 text-slate-900 p-6 sm:p-10 select-none">
        {/* Wax Seal Decoration */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 rounded-full bg-rose-600 border-2 border-rose-400 shadow-md flex items-center justify-center text-white font-serif-title font-bold text-lg select-none z-0">
          G
        </div>

        {/* The Underlying Letter Content */}
        <div className="relative z-0 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-rose-600 mb-4">
            <Heart className="w-5 h-5 fill-rose-600" />
            <span className="font-serif-title font-bold tracking-wider uppercase text-xs">
              Private & Confidential • For Gitika’s Eyes Only
            </span>
          </div>

          <div className="font-handwritten text-xl sm:text-2xl text-slate-800 leading-relaxed whitespace-pre-line tracking-wide">
            {secretLetter}
          </div>

          <div className="mt-6 pt-4 border-t border-rose-200/60 flex items-center justify-between">
            <span className="font-serif-title text-sm italic text-slate-600">
              Forever & Always ❤️
            </span>
            <span className="font-pixel text-[10px] text-rose-500">
              NOVEMBER 2026 • 25TH JUBILEE
            </span>
          </div>
        </div>

        {/* HTML5 Scratch Foil Canvas Layer (Overlay) */}
        {!isFullyRevealed && (
          <canvas
            ref={canvasRef}
            width={720}
            height={520}
            onMouseDown={() => setIsScratching(true)}
            onMouseUp={() => setIsScratching(false)}
            onMouseLeave={() => setIsScratching(false)}
            onMouseMove={(e) => {
              if (isScratching) scratch(e.clientX, e.clientY);
            }}
            onTouchStart={() => setIsScratching(true)}
            onTouchEnd={() => setIsScratching(false)}
            onTouchMove={(e) => {
              if (e.touches[0]) {
                scratch(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            className="absolute inset-0 w-full h-full cursor-pointer z-10 touch-none transition-opacity duration-500"
          />
        )}
      </div>

      {/* Completion Toast */}
      {isFullyRevealed && (
        <div className="mt-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-center animate-bounce">
          <p className="text-xs sm:text-sm font-semibold text-emerald-300 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>VIP Quest 04 Complete! All secret words unlocked.</span>
          </p>
        </div>
      )}
    </section>
  );
}
