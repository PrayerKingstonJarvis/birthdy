import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Mic, MicOff, Wind, Sparkles, RotateCcw, CheckCircle } from 'lucide-react';
import { playSound } from '../audio/soundEffects';

const FLAVORS = [
  { id: 'redvelvet', name: 'Velvet Rose', topColor: '#e11d48', bodyColor: '#be123c', accent: '#ffe4e6' },
  { id: 'truffle', name: 'Dark Truffle', topColor: '#451a03', bodyColor: '#78350f', accent: '#fef3c7' },
  { id: 'lavender', name: 'Lavender Starlight', topColor: '#9333ea', bodyColor: '#7e22ce', accent: '#f3e8ff' },
  { id: 'golden', name: 'Honey Vanilla', topColor: '#d97706', bodyColor: '#b45309', accent: '#fffbeb' },
];

const TOPPINGS = [
  { id: 'hearts', name: 'Heart Sprinkles', emoji: '💖' },
  { id: 'gold', name: 'Edible Gold Dust', emoji: '✨' },
  { id: 'berries', name: 'Fresh Strawberries', emoji: '🍓' },
  { id: 'pearls', name: 'Starlight Pearls', emoji: '🔮' },
];

export default function CakeAtelier({ data, onQuestComplete }) {
  const [flavor, setFlavor] = useState(FLAVORS[0]);
  const [selectedToppings, setSelectedToppings] = useState(['hearts', 'gold']);
  const [isLit, setIsLit] = useState(true);
  const [wishMade, setWishMade] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [micVolume, setMicVolume] = useState(0);

  const micStreamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  // Toggle Topping
  const toggleTopping = (id) => {
    playSound('coin');
    setSelectedToppings(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  // Blow out action
  const handleBlowOut = () => {
    if (!isLit) return;
    setIsLit(false);
    setWishMade(true);
    playSound('candleBlow');

    // Stop mic if active
    stopMicListening();

    setTimeout(() => {
      playSound('fanfare');
      playSound('confetti');
      // Fire confetti bursts
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fbbf24', '#ec4899', '#a855f7', '#38bdf8']
      });
      onQuestComplete('cake');
    }, 400);
  };

  // Relight candles
  const handleRelight = () => {
    playSound('coin');
    setIsLit(true);
    setWishMade(false);
  };

  // Real Microphone Blow Detection
  const startMicListening = async () => {
    try {
      playSound('coin');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListeningMic(true);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume in speech/blowing range
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setMicVolume(avg);

        // Threshold for blowing out (blowing creates broad noisy spectrum > 65)
        if (avg > 70) {
          handleBlowOut();
          return;
        }

        animFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err) {
      console.warn("Microphone access declined or unavailable:", err);
      setIsListeningMic(false);
      alert("Microphone permission not granted. You can use the 'Blow with a Wish' button!");
    }
  };

  const stopMicListening = () => {
    setIsListeningMic(false);
    setMicVolume(0);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopMicListening();
    };
  }, []);

  return (
    <section id="cake-section" className="py-20 px-4 max-w-5xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Quest 01</span>
        </div>
        <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-slate-100">
          The 25th Cake Atelier
        </h2>
        <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Craft Gitu’s silver jubilee birthday cake, make your secret wish, and blow out the candles!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
        {/* Left Column: The 3D Cake & Candle Stage */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[360px] relative">
          {/* Candle Glow Atmosphere */}
          <div
            className={`absolute top-10 w-48 h-48 rounded-full blur-3xl transition-opacity duration-1000 pointer-events-none ${
              isLit ? 'bg-amber-400/25 opacity-100' : 'bg-slate-700/10 opacity-20'
            }`}
          />

          {/* Visual Cake Container */}
          <div className="relative flex flex-col items-center">
            {/* Candles Layer */}
            <div className="flex items-end justify-center gap-6 mb-[-6px] z-20">
              {/* Candle "2" */}
              <div className="flex flex-col items-center">
                {/* Flame or Smoke */}
                <div className="h-10 flex items-center justify-center">
                  {isLit ? (
                    <div className="relative animate-bounce">
                      <div className="w-4 h-7 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 shadow-[0_0_16px_rgba(251,191,36,0.9)] animate-pulse-glow" />
                      <div className="absolute top-1 left-1 w-2 h-4 rounded-full bg-white/70 blur-[1px]" />
                    </div>
                  ) : (
                    <div className="text-slate-400 text-xs animate-float">💨 ~</div>
                  )}
                </div>
                {/* Candle Wick */}
                <div className="w-1 h-3 bg-slate-800" />
                {/* Number Candle "2" */}
                <div className="w-9 h-14 rounded-lg bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 shadow-md border border-amber-100 flex items-center justify-center font-serif-title font-bold text-2xl text-slate-900">
                  2
                </div>
              </div>

              {/* Candle "5" */}
              <div className="flex flex-col items-center">
                {/* Flame or Smoke */}
                <div className="h-10 flex items-center justify-center">
                  {isLit ? (
                    <div className="relative animate-bounce" style={{ animationDelay: '0.2s' }}>
                      <div className="w-4 h-7 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 shadow-[0_0_16px_rgba(251,191,36,0.9)] animate-pulse-glow" />
                      <div className="absolute top-1 left-1 w-2 h-4 rounded-full bg-white/70 blur-[1px]" />
                    </div>
                  ) : (
                    <div className="text-slate-400 text-xs animate-float" style={{ animationDelay: '0.3s' }}>💨 ~</div>
                  )}
                </div>
                {/* Candle Wick */}
                <div className="w-1 h-3 bg-slate-800" />
                {/* Number Candle "5" */}
                <div className="w-9 h-14 rounded-lg bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 shadow-md border border-amber-100 flex items-center justify-center font-serif-title font-bold text-2xl text-slate-900">
                  5
                </div>
              </div>
            </div>

            {/* Cake Tier 2 (Top Tier) */}
            <div
              className="w-48 sm:w-56 h-20 rounded-t-2xl relative shadow-lg transition-all duration-500 flex items-center justify-center border-t-4 border-white/30 z-10"
              style={{
                backgroundColor: flavor.topColor,
                backgroundImage: `radial-gradient(circle at 50% 20%, ${flavor.accent}33, transparent 70%)`
              }}
            >
              {/* Frosting Drips */}
              <div className="absolute bottom-0 inset-x-0 flex justify-around">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-5 h-4 rounded-b-full bg-white/40 shadow-inner"
                    style={{ transform: `scaleY(${1 + (i % 3) * 0.4})` }}
                  />
                ))}
              </div>

              {/* Render Selected Toppings on top tier */}
              <div className="flex items-center gap-2 select-none">
                {selectedToppings.map(tId => {
                  const topObj = TOPPINGS.find(t => t.id === tId);
                  return (
                    <span key={tId} className="text-lg filter drop-shadow">
                      {topObj?.emoji}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Cake Tier 1 (Base Tier) */}
            <div
              className="w-64 sm:w-76 h-24 rounded-2xl relative shadow-2xl transition-all duration-500 flex flex-col items-center justify-center border-t-4 border-white/20"
              style={{
                backgroundColor: flavor.bodyColor,
                backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.25))`
              }}
            >
              {/* Frosted Swirl Accent */}
              <div className="absolute top-1 inset-x-4 h-2 rounded-full bg-white/30 blur-[0.5px]" />

              {/* Inscription on Cake */}
              <div className="px-4 py-1 rounded-full bg-slate-950/40 border border-white/20 backdrop-blur-sm">
                <span className="font-handwritten text-xl sm:text-2xl text-rose-200 tracking-wider font-bold">
                  Happy 25th, Gitu ❤️
                </span>
              </div>
            </div>

            {/* Cake Stand / Silver Platter */}
            <div className="w-72 sm:w-84 h-5 rounded-full bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 shadow-xl border-t border-white mt-1" />
            <div className="w-32 h-6 bg-gradient-to-r from-slate-500 via-slate-300 to-slate-500 rounded-b-xl shadow-md" />
          </div>

          {/* Blow Out Wish Message Banner */}
          {wishMade && (
            <div className="mt-8 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-amber-400/40 text-center animate-bounce">
              <p className="font-serif-title text-base sm:text-lg font-bold text-amber-200">
                ✨ Wish Sent to the Cosmos! ✨
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                May your 25th year bring every dream, smile, and adventure you desire, Gitu!
              </p>
            </div>
          )}

          {/* Microphone Live Meter (when mic active) */}
          {isListeningMic && (
            <div className="mt-4 w-full max-w-xs flex flex-col items-center gap-1.5">
              <div className="flex items-center justify-between w-full text-xs text-slate-300">
                <span>Mic Breath Sensor:</span>
                <span className="font-pixel text-[10px] text-amber-300">
                  {Math.round(micVolume)} / 70
                </span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 transition-all duration-75"
                  style={{ width: `${Math.min(100, (micVolume / 70) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-rose-300 animate-pulse">
                🌬️ Blow directly into your microphone now!
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Customizer & Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Flavor Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              1. Choose Cake Flavor:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FLAVORS.map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    playSound('coin');
                    setFlavor(f);
                  }}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                    flavor.id === f.id
                      ? 'bg-rose-500/20 border-rose-400 text-rose-200 shadow-md shadow-rose-500/10'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span>{f.name}</span>
                  <div
                    className="w-4 h-4 rounded-full border border-white/30"
                    style={{ backgroundColor: f.bodyColor }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Toppings Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              2. Add Toppings & Sparkles:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TOPPINGS.map(t => {
                const isSelected = selectedToppings.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleTopping(t.id)}
                    className={`px-3 py-2 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{t.emoji}</span>
                      <span>{t.name}</span>
                    </span>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Candle Action Buttons */}
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2.5">
            {isLit ? (
              <>
                <button
                  onClick={handleBlowOut}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-rose-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Wind className="w-4 h-4" />
                  <span>Blow with a Wish (1-Click)</span>
                </button>

                <button
                  onClick={isListeningMic ? stopMicListening : startMicListening}
                  className={`w-full py-3 rounded-xl border font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                    isListeningMic
                      ? 'bg-red-500/20 border-red-500 text-red-300 animate-pulse'
                      : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-rose-400 hover:text-rose-200'
                  }`}
                >
                  {isListeningMic ? (
                    <>
                      <MicOff className="w-4 h-4 text-red-400" />
                      <span>Stop Microphone Listening</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-amber-400" />
                      <span>Enable Mic (Blow Real Breath into Mic)</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={handleRelight}
                className="w-full py-3.5 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-200 font-semibold text-sm hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Light the Candles Again!</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
