import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Mail, Key, Sparkles, X, Heart, HelpCircle, Eye, ArrowRight } from 'lucide-react';
import { playSound } from '../audio/soundEffects';

const BOSS_PHOTOS = [
  { src: '/photos/1.jpeg', title: 'Special Moment' },
  { src: '/photos/1 (1).jpg', title: 'Golden Memory' },
  { src: '/photos/1 (2).jpeg', title: 'Adventures Together' },
  { src: '/photos/1 (3).jpeg', title: 'Sweet Smiles' },
  { src: '/photos/1 (4).jpeg', title: 'Unfiltered Joy' },
  { src: '/photos/1 (5).jpg', title: 'Radiant Gitika' },
  { src: '/photos/1 (6).jpeg', title: 'Treasured Times' },
  { src: '/photos/1 (7).jpg', title: 'Pure Happiness' },
  { src: '/photos/1 (8).jpg', title: 'Special Days' },
  { src: '/photos/1 (9).jpeg', title: 'Unforgettable' },
  { src: '/photos/1 (10).jpg', title: 'Silver Jubilee' },
  { src: '/photos/1 (11).jpeg', title: 'Precious Moments' },
  { src: '/photos/1 (12).jpeg', title: 'Cherished Memories' },
  { src: '/photos/1 (13).jpeg', title: 'Laughter & Light' },
  { src: '/photos/1 (14).jpeg', title: 'Our Journey' },
  { src: '/photos/1 (15).jpg', title: 'Best Smiles' },
  { src: '/photos/1 (16).jpg', title: 'Forever Special' },
  { src: '/photos/1 (17).jpeg', title: 'Cozy Memories' },
  { src: '/photos/1 (18).jpeg', title: 'Timeless Beauty' },
  { src: '/photos/1 (19).jpg', title: 'Wonderful Gitika' },
  { src: '/photos/1 (20).jpg', title: 'Heart of Gold' },
  { src: '/photos/1 (21).jpeg', title: 'Always Glowing' },
  { src: '/photos/1 (22).jpg', title: 'Birthday Queen' },
];

export default function BossEnvelopeModal({ isOpen, onClose }) {
  const [password, setPassword] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (!isOpen) return null;

  const handleUnlock = (e) => {
    e.preventDefault();
    const clean = password.trim();

    // Check if user entered the secret key 1608
    if (clean === '1608') {
      playSound('fanfare');
      playSound('confetti');
      setIsUnlocked(true);
      setErrorMsg('');

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#34d399', '#fbbf24', '#f43f5e', '#a855f7']
      });
      return;
    }

    // Troll mechanic on first / 0411 try:
    playSound('horn');
    setAttemptCount(prev => prev + 1);
    setErrorMsg("Oops... maybe I 'forgot' your DOB! 😉 Try entering 1608");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="max-w-3xl w-full bg-slate-900 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative my-8 text-center animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
        >
          <X className="w-6 h-6" />
        </button>

        {!isUnlocked ? (
          /* Password Screen for Envelope */
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-rose-500 p-1 mb-4 shadow-xl shadow-rose-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center text-4xl">
                ✉️
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-pixel bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase">
              CONFIDENTIAL DISPATCH
            </span>

            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-white mt-3">
              The Boss has sent you something—open it!
            </h3>

            <p className="text-xs text-slate-400 mt-1 mb-6">
              Enter the access key to break the seal on your birthday delivery.
            </p>

            <form onSubmit={handleUnlock} className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="Enter Password..."
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-center text-amber-300 font-mono tracking-widest placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>

              {/* Hint option below password */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-amber-400/80 hover:text-amber-300 underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? "Hide Hint" : "Need a Hint?"}</span>
                </button>
                {showHint && (
                  <p className="text-xs text-slate-400 mt-1 font-serif-title italic">
                    (it’s just your DOB, after all!)
                  </p>
                )}
              </div>

              {/* Error / Troll message */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-medium animate-bounce">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 text-slate-950 font-bold text-sm shadow-xl shadow-rose-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Unlock Envelope 🔓</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked Envelope Content & Poem & Photos */
          <div className="animate-scale-up text-left">
            {/* Glowing Green Banner */}
            <div className="mb-6 p-4 rounded-2xl bg-emerald-950/70 border-2 border-emerald-400 text-center shadow-[0_0_25px_rgba(52,211,153,0.3)]">
              <p className="font-serif-title text-xl sm:text-2xl font-bold text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">
                Did you really think I forgot your DOB?
              </p>
            </div>

            {/* The Handwritten Style Poem Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 border-4 border-amber-500/40 text-slate-900 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-rose-300/60 pb-3 mb-4">
                <div className="flex items-center gap-2 text-rose-600 font-serif-title font-bold text-xs uppercase tracking-wider">
                  <Heart className="w-4 h-4 fill-rose-600" />
                  <span>The Boss’s Personal Ode to Gitika</span>
                </div>
                <span className="font-pixel text-[10px] text-slate-500">
                  25TH JUBILEE
                </span>
              </div>

              {/* The Poem */}
              <div className="font-serif-title text-lg sm:text-xl text-slate-800 leading-relaxed space-y-3 italic">
                <p>
                  “I see you when I see a mountain, standing so strong,<br />
                  Your willpower like that, it keeps you going all along.
                </p>
                <p>
                  I see you when I see the rain, falling with ease,<br />
                  You handle every storm, every task, with such peace.
                </p>
                <p>
                  You are the one who doesn't follow the trend,<br />
                  The world follows you, my dear friend.
                </p>
                <p className="font-bold text-rose-600 not-italic pt-2 text-right">
                  — Happy Birthday ❤️”
                </p>
              </div>
            </div>

            {/* The Boss's Sent Photos Gallery */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>The Boss Has Also Sent Some Photos...</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Snapshots of your radiance, smiles, and beautiful memories.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {BOSS_PHOTOS.length} Photos Included
                </span>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 max-h-[380px] overflow-y-auto pr-1">
                {BOSS_PHOTOS.map((photo, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      playSound('cardFlip');
                      setSelectedPhoto(photo.src);
                    }}
                    className="group relative rounded-2xl overflow-hidden aspect-square bg-slate-800 border border-slate-700/80 hover:border-amber-400 cursor-pointer transition-all duration-300 shadow-md hover:scale-105"
                  >
                    <img
                      src={photo.src}
                      alt={`Memory ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span className="text-[10px] text-amber-200 font-medium">
                        {photo.title} #{idx + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox for Selected Photo */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="max-w-2xl w-full bg-slate-900 p-2 sm:p-4 rounded-3xl relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full max-h-[80vh] rounded-2xl overflow-hidden flex items-center justify-center bg-black">
              <img
                src={selectedPhoto}
                alt="Enlarged Memory"
                className="max-h-[80vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
