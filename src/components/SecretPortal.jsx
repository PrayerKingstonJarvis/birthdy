import React, { useState } from 'react';
import { Lock, ArrowRight, Eye, ShieldAlert } from 'lucide-react';
import { playSound } from '../audio/soundEffects';

export default function SecretPortal({ onUnlock }) {
  const [inputName, setInputName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = inputName.trim();
    if (!cleanName) {
      setErrorMsg("Identity required. Please enter your name.");
      return;
    }

    setIsChecking(true);
    playSound('coin');

    setTimeout(() => {
      onUnlock(cleanName);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-slate-100 flex flex-col items-center justify-center p-4 font-mono select-none overflow-hidden">
      {/* Background Mysterious Matrix / Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-950/20 rounded-full blur-3xl pointer-events-none" />

      {/* Classified Header */}
      <div className="relative z-10 max-w-md w-full bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center backdrop-blur-xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-amber-500 mb-4 shadow-inner">
          <Lock className="w-6 h-6 animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-[11px] uppercase tracking-widest mb-3">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          <span>CLASSIFIED ARCHIVE // LVL-25</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">
          Identity Verification Required
        </h1>
        <p className="text-xs text-neutral-400 mb-6">
          Access restricted to authorized personnel only. Please declare your identity to proceed.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <div>
            <label className="text-xs text-neutral-400 block mb-1.5 font-sans font-medium">
              What is your name?
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Type your name..."
                value={inputName}
                onChange={(e) => {
                  setInputName(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-sm text-amber-300 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
              />
              <Eye className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
            </div>
            {errorMsg && (
              <p className="text-[11px] text-rose-500 mt-1.5 font-sans">
                {errorMsg}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isChecking}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <span>{isChecking ? 'Verifying Identity...' : 'Enter Access Key'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-neutral-600 mt-6 tracking-wider">
          SECURE PROTOCOL • ENCRYPTED VIA THE BOSS
        </p>
      </div>
    </div>
  );
}
