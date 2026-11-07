import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, ArrowRight, Play, Sparkles, Check, Gift, Copy } from 'lucide-react';
import { playSound } from '../audio/soundEffects';

export default function ClawMachine({ coupons, onQuestComplete }) {
  const [clawX, setClawX] = useState(50); // percentage 10% to 90%
  const [clawY, setClawY] = useState(0);  // percentage 0% (top) to 75% (bottom)
  const [isDropping, setIsDropping] = useState(false);
  const [clawOpen, setClawOpen] = useState(true);
  const [grabbedCoupon, setGrabbedCoupon] = useState(null);
  const [activeModalCoupon, setActiveModalCoupon] = useState(null);
  const [claimedCoupons, setClaimedCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isDropping) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveRight();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        dropClaw();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDropping, clawX]);

  const moveLeft = () => {
    if (isDropping) return;
    playSound('scratch');
    setClawX((prev) => Math.max(15, prev - 10));
  };

  const moveRight = () => {
    if (isDropping) return;
    playSound('scratch');
    setClawX((prev) => Math.min(85, prev + 10));
  };

  const dropClaw = () => {
    if (isDropping) return;
    setIsDropping(true);
    playSound('clawDrop');

    // 1. Lower claw down
    setClawY(70);

    setTimeout(() => {
      // 2. Close claws on prize
      setClawOpen(false);
      playSound('clawGrab');

      // Pick a coupon based on position or random
      const pickedIndex = Math.floor(Math.random() * coupons.length);
      const picked = coupons[pickedIndex];
      setGrabbedCoupon(picked);

      setTimeout(() => {
        // 3. Ascend claw back to top with prize
        setClawY(0);

        setTimeout(() => {
          // 4. Return to chute (left edge)
          setClawX(15);

          setTimeout(() => {
            // 5. Release claw into chute
            setClawOpen(true);
            playSound('confetti');
            playSound('fanfare');

            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.7 }
            });

            // Reveal modal
            setActiveModalCoupon(picked);
            if (!claimedCoupons.some(c => c.id === picked.id)) {
              setClaimedCoupons(prev => [...prev, picked]);
            }
            onQuestComplete('claw');

            // Reset state
            setGrabbedCoupon(null);
            setIsDropping(false);
          }, 600);
        }, 800);
      }, 700);
    }, 1000);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    playSound('coin');
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section id="claw-section" className="py-20 px-4 max-w-5xl mx-auto scroll-mt-20">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Quest 02</span>
        </div>
        <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-slate-100">
          The Arcade Love Claw
        </h2>
        <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Maneuver the claw, drop it into the mystery capsule pit, and win real romantic love coupons!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: The Arcade Cabinet Frame */}
        <div className="lg:col-span-8 bg-gradient-to-b from-rose-950/80 via-slate-900 to-slate-950 border-4 border-rose-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-rose-950 relative overflow-hidden">
          {/* Top Arcade Marquee */}
          <div className="flex items-center justify-between border-b-2 border-rose-500/30 pb-3 mb-4 bg-slate-950/60 rounded-xl px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🕹️</span>
              <span className="font-pixel text-xs sm:text-sm text-amber-300 tracking-wider">
                GITU-CLAW 3000
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-pixel text-[10px] text-emerald-400">READY</span>
            </div>
          </div>

          {/* Glass Display Cabinet */}
          <div className="relative w-full h-[340px] sm:h-[400px] bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 border-2 border-slate-700/60 rounded-2xl overflow-hidden shadow-inner">
            {/* Top Mechanical Rail */}
            <div className="absolute top-0 inset-x-0 h-4 bg-slate-800 border-b border-slate-700 flex items-center shadow-md z-10">
              <div className="w-full h-1 bg-amber-400/40" />
            </div>

            {/* The Claw Mechanism */}
            <div
              className="absolute top-2 transition-all duration-300 flex flex-col items-center z-20"
              style={{
                left: `${clawX}%`,
                transform: 'translateX(-50%)',
                top: `${clawY}%`
              }}
            >
              {/* Vertical Cord/Cable */}
              <div
                className="w-1 bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.8)] transition-all duration-300"
                style={{ height: `${Math.max(20, clawY * 4.5)}px` }}
              />

              {/* Claw Motor Box */}
              <div className="w-8 h-6 bg-slate-700 rounded-md border border-slate-500 shadow-md flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>

              {/* Mechanical Prongs */}
              <div className="relative w-12 h-8 flex justify-between px-1">
                {/* Left Prong */}
                <div
                  className={`w-2.5 h-7 bg-amber-400 rounded-b-full border border-amber-200 transition-transform duration-300 origin-top shadow-md ${
                    clawOpen ? '-rotate-35' : 'rotate-15'
                  }`}
                />
                {/* Center Plumb */}
                <div className="w-1 h-4 bg-amber-500" />
                {/* Right Prong */}
                <div
                  className={`w-2.5 h-7 bg-amber-400 rounded-b-full border border-amber-200 transition-transform duration-300 origin-top shadow-md ${
                    clawOpen ? 'rotate-35' : '-rotate-15'
                  }`}
                />
              </div>

              {/* Grabbed Capsule attached to claw if returning */}
              {grabbedCoupon && !clawOpen && (
                <div className="mt-[-4px] text-3xl animate-spin filter drop-shadow-[0_0_12px_rgba(244,63,94,0.9)]">
                  🎁
                </div>
              )}
            </div>

            {/* Prize Chute on Left */}
            <div className="absolute bottom-0 left-2 w-16 h-20 bg-slate-950 border-t-2 border-r-2 border-amber-400/50 rounded-tr-xl flex flex-col items-center justify-center text-center p-1 z-10">
              <span className="text-[10px] font-pixel text-amber-300">WIN CHUTE</span>
              <span className="text-sm animate-bounce">⬇️</span>
            </div>

            {/* Prize Capsules Resting in Pit */}
            <div className="absolute bottom-2 inset-x-14 flex flex-wrap justify-around items-end gap-2 px-2 z-0">
              {coupons.map((c, i) => (
                <div
                  key={c.id}
                  className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 border-2 border-white/60 shadow-lg flex items-center justify-center text-xl cursor-default animate-float select-none"
                  style={{
                    animationDelay: `${i * 0.4}s`,
                    transform: `rotate(${(i % 3) * 12 - 12}deg)`
                  }}
                >
                  {c.icon}
                </div>
              ))}
            </div>

            {/* Glass reflection gloss */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Arcade Controller Panel */}
          <div className="mt-5 bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Directional Joystick Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={moveLeft}
                disabled={isDropping}
                className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-slate-600 text-slate-200 hover:border-amber-400 active:scale-90 disabled:opacity-40 transition-all flex items-center justify-center shadow-lg cursor-pointer"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

              <button
                onClick={moveRight}
                disabled={isDropping}
                className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-slate-600 text-slate-200 hover:border-amber-400 active:scale-90 disabled:opacity-40 transition-all flex items-center justify-center shadow-lg cursor-pointer"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              Use [A] [D] or Arrow keys &bull; [Space] to drop
            </p>

            {/* Big Shiny Drop Button */}
            <button
              onClick={dropClaw}
              disabled={isDropping}
              className={`px-8 py-4 rounded-2xl font-bold font-pixel text-xs sm:text-sm tracking-wider uppercase transition-all shadow-xl cursor-pointer ${
                isDropping
                  ? 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white hover:scale-105 active:scale-95 shadow-rose-500/40 animate-pulse'
              }`}
            >
              {isDropping ? 'DROPPING...' : 'DROP CLAW! 🎯'}
            </button>
          </div>
        </div>

        {/* Right Column: Claimed Coupons & Wallet */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-rose-400" />
              <h3 className="font-serif-title font-bold text-lg text-slate-200">
                Gitu’s Coupon Wallet
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
              {claimedCoupons.length} / {coupons.length} Unlocked
            </span>
          </div>

          {claimedCoupons.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <span className="text-4xl block mb-2">🎟️</span>
              <p className="text-xs">Your coupon wallet is waiting!</p>
              <p className="text-[11px] text-slate-600 mt-1">Play the claw to catch your first voucher.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
              {claimedCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-rose-500/40 transition-all flex items-start gap-3"
                >
                  <div className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800">
                    {coupon.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 truncate">
                      {coupon.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      {coupon.desc}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1"
                      >
                        {copiedCode === coupon.code ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCode === coupon.code ? 'Copied' : 'Redeem'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prize Reveal Modal */}
      {activeModalCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="max-w-md w-full bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-rose-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 p-1 mb-4 shadow-xl shadow-rose-500/30 animate-bounce">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-4xl">
                {activeModalCoupon.icon}
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-[11px] font-pixel bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase">
              YOU WON A LOVE COUPON!
            </span>

            <h3 className="font-serif-title text-2xl font-bold text-slate-100 mt-3">
              {activeModalCoupon.title}
            </h3>

            <p className="text-sm text-slate-300 mt-2 font-light leading-relaxed">
              {activeModalCoupon.desc}
            </p>

            <div className="mt-5 p-3 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between">
              <span className="text-xs text-slate-400">Coupon Voucher:</span>
              <span className="font-mono text-sm font-bold text-amber-300">
                {activeModalCoupon.code}
              </span>
            </div>

            <button
              onClick={() => {
                playSound('coin');
                setActiveModalCoupon(null);
              }}
              className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Add to Wallet & Keep Playing! 💖
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
