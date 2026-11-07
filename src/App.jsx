import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SecretPortal from './components/SecretPortal';
import DialogueCutscene from './components/DialogueCutscene';
import BossQuiz from './components/BossQuiz';
import HeroCarnival from './components/HeroCarnival';
import CakeAtelier from './components/CakeAtelier';
import ClawMachine from './components/ClawMachine';
import ConstellationMatch from './components/ConstellationMatch';
import ScratchCard from './components/ScratchCard';
import ReasonsDeck from './components/ReasonsDeck';
import PolaroidWall from './components/PolaroidWall';
import WishLanterns from './components/WishLanterns';
import Soundboard from './components/Soundboard';
import VIPPassModal from './components/VIPPassModal';
import GrandFinaleModal from './components/GrandFinaleModal';
import DirectorModal from './components/DirectorModal';
import BossEnvelopeModal from './components/BossEnvelopeModal';

import { DEFAULT_BIRTHDAY_DATA } from './data/birthdayData';
import { toggleBackgroundMusic, stopBackgroundMusic, playSound } from './audio/soundEffects';
import { Sparkles, Heart, Award, Mail } from 'lucide-react';
import './App.css';

export default function App() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('gitu_birthday_data');
      return saved ? JSON.parse(saved) : DEFAULT_BIRTHDAY_DATA;
    } catch {
      return DEFAULT_BIRTHDAY_DATA;
    }
  });

  // Flow State
  const [isPortalUnlocked, setIsPortalUnlocked] = useState(false);
  const [showCutscene, setShowCutscene] = useState(false);
  const [enteredName, setEnteredName] = useState('');
  const [showBossButton, setShowBossButton] = useState(false);
  const [isBossEnvelopeOpen, setIsBossEnvelopeOpen] = useState(false);

  // Quests & Games
  const [quests, setQuests] = useState(() => {
    try {
      const saved = localStorage.getItem('gitu_birthday_quests');
      return saved ? JSON.parse(saved) : { cake: false, claw: false, constellation: false, scratch: false };
    } catch {
      return { cake: false, claw: false, constellation: false, scratch: false };
    }
  });

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [discoMode, setDiscoMode] = useState(false);

  const [isVIPPassOpen, setIsVIPPassOpen] = useState(false);
  const [isFinaleOpen, setIsFinaleOpen] = useState(false);
  const [isDirectorOpen, setIsDirectorOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('gitu_birthday_data', JSON.stringify(data));
    } catch (e) {
      console.warn(e);
    }
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem('gitu_birthday_quests', JSON.stringify(quests));
    } catch (e) {
      console.warn(e);
    }
  }, [quests]);

  const handlePortalUnlock = (name) => {
    setEnteredName(name);
    setIsPortalUnlocked(true);
    setShowCutscene(true);
  };

  const handleCutsceneProceed = () => {
    setShowCutscene(false);
    // Smooth scroll down to quiz
    setTimeout(() => {
      const el = document.getElementById('quiz-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const handleQuizCompleted = () => {
    // 5 to 7 seconds later, the button appears: "The Boss has sent you something—open it!"
    setTimeout(() => {
      setShowBossButton(true);
      playSound('fanfare');
    }, 6000);
  };

  const handleQuestComplete = (questKey) => {
    setQuests((prev) => {
      const next = { ...prev, [questKey]: true };
      const allDone = Object.values(next).every(Boolean);
      if (allDone) {
        setTimeout(() => {
          setIsFinaleOpen(true);
        }, 1200);
      }
      return next;
    });
  };

  const handleToggleMusic = () => {
    toggleBackgroundMusic((playing) => {
      setIsMusicPlaying(playing);
    });
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleDisco = () => {
    setDiscoMode(!discoMode);
  };

  const handleScrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUpdateData = (newData) => {
    setData((prev) => ({
      ...prev,
      ...newData
    }));
  };

  const handleResetData = () => {
    setData(DEFAULT_BIRTHDAY_DATA);
    setQuests({ cake: false, claw: false, constellation: false, scratch: false });
    localStorage.removeItem('gitu_birthday_data');
    localStorage.removeItem('gitu_birthday_quests');
  };

  const completedQuestsCount = Object.values(quests).filter(Boolean).length;

  return (
    <>
      {/* 1. Dark Mysterious Entrance Portal */}
      {!isPortalUnlocked && (
        <SecretPortal onUnlock={handlePortalUnlock} />
      )}

      {/* 2. Dialogue Sequence: "Oh, Bawli... oops, sorry Choti!" -> "Gitika Ma'am!" */}
      {showCutscene && (
        <DialogueCutscene
          enteredName={enteredName}
          onProceed={handleCutsceneProceed}
        />
      )}

      {/* 3. The Transformed Vibrant Colorful Wonderland */}
      <div className={`min-h-screen bg-gradient-to-b from-purple-950 via-slate-950 to-rose-950 text-slate-100 relative transition-all duration-1000 ${discoMode ? 'disco-active' : ''}`}>
        {/* Secret Disco Ball Overlay */}
        {discoMode && (
          <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center">
            <div className="w-0.5 h-16 bg-slate-400" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-slate-200 via-pink-300 to-amber-200 shadow-[0_0_40px_rgba(255,255,255,0.9)] border-2 border-white animate-spin-slow flex items-center justify-center text-2xl">
              🪩
            </div>
            <div className="mt-2 px-3 py-1 rounded-full bg-pink-500/80 text-white font-pixel text-[9px] shadow-lg animate-pulse">
              DISCO PARTY MODE ACTIVE!
            </div>
          </div>
        )}

        {/* Top Navbar */}
        <Navbar
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          discoMode={discoMode}
          onToggleDisco={handleToggleDisco}
          onOpenDirector={() => setIsDirectorOpen(true)}
          completedQuests={completedQuestsCount}
          totalQuests={4}
          onOpenVIPPass={() => setIsVIPPassOpen(true)}
        />

        {/* Floating "The Boss Has Sent You Something" Notification Bar */}
        {showBossButton && (
          <div className="sticky top-16 z-40 px-4 py-2 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-slate-950 shadow-xl flex items-center justify-center gap-3 animate-bounce">
            <Mail className="w-5 h-5 text-slate-950 animate-pulse" />
            <span className="font-bold text-xs sm:text-sm">
              The Boss has sent you something—open it!
            </span>
            <button
              onClick={() => {
                playSound('coin');
                setIsBossEnvelopeOpen(true);
              }}
              className="px-4 py-1.5 rounded-full bg-slate-950 text-amber-300 font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Open Envelope ✉️
            </button>
          </div>
        )}

        {/* Main Content */}
        <main className="relative">
          {/* A. Grand Hero for Gitika Ma'am */}
          <HeroCarnival
            data={data}
            quests={quests}
            onOpenVIPPass={() => setIsVIPPassOpen(true)}
            onScrollToSection={handleScrollToSection}
          />

          {/* B. The Boss's Quiz & Self-Love Section */}
          <BossQuiz onQuizCompleted={handleQuizCompleted} />

          {/* C. Direct Button for The Boss's Envelope */}
          <div className="py-8 text-center px-4">
            <button
              onClick={() => {
                playSound('coin');
                setIsBossEnvelopeOpen(true);
              }}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 text-slate-950 font-bold text-sm sm:text-base shadow-2xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer border-2 border-amber-300"
            >
              <Mail className="w-5 h-5" />
              <span>The Boss has sent you something—open it! ✉️</span>
            </button>
          </div>

          {/* D. Casual Game 1: Interactive Cake Atelier */}
          <CakeAtelier
            data={data}
            onQuestComplete={handleQuestComplete}
          />

          {/* E. Casual Game 2: Arcade Love Claw Machine */}
          <ClawMachine
            coupons={data.coupons}
            onQuestComplete={handleQuestComplete}
          />

          {/* F. Casual Game 3: Starlight Constellation Match */}
          <ConstellationMatch
            cardsData={data.constellationCards}
            onQuestComplete={handleQuestComplete}
          />

          {/* G. Golden Scratch-Off Letter */}
          <ScratchCard
            secretLetter={data.secretLetter}
            onQuestComplete={handleQuestComplete}
          />

          {/* H. 25 Reasons Why Gitu is Irreplaceable */}
          <ReasonsDeck
            reasons={data.reasons}
            name={data.nickname}
          />

          {/* I. Polaroid Photo Wall */}
          <PolaroidWall
            defaultPolaroids={data.polaroids}
          />

          {/* J. Midnight Wish Lanterns */}
          <WishLanterns
            defaultLanterns={data.defaultLanterns}
            name={data.nickname}
          />

          {/* K. Interactive Party Soundboard */}
          <Soundboard />
        </main>

        {/* Footer */}
        <footer className="mt-20 border-t border-slate-800 bg-slate-950/90 py-12 px-4 text-center">
          <div className="max-w-xl mx-auto flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-pink-500 p-[2px] shadow-lg shadow-rose-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
                👑
              </div>
            </div>

            <h3 className="font-serif-title text-xl font-bold text-slate-100">
              For Gitika (Gitu) • Happy 25th Birthday
            </h3>

            <p className="text-xs text-slate-400 font-light">
              Crafted with infinite love, secret codes, and inside jokes by The Boss.
            </p>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => {
                  playSound('coin');
                  setIsBossEnvelopeOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-semibold hover:border-amber-400 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>The Boss's Envelope ✉️</span>
              </button>

              <button
                onClick={() => {
                  playSound('horn');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:text-white transition-all cursor-pointer"
              >
                Back to Top ↑
              </button>
            </div>
          </div>
        </footer>

        {/* Modals */}
        <BossEnvelopeModal
          isOpen={isBossEnvelopeOpen}
          onClose={() => setIsBossEnvelopeOpen(false)}
        />

        <VIPPassModal
          isOpen={isVIPPassOpen}
          onClose={() => setIsVIPPassOpen(false)}
          data={data}
          quests={quests}
          onScrollToSection={handleScrollToSection}
          onOpenFinale={() => setIsFinaleOpen(true)}
        />

        <GrandFinaleModal
          isOpen={isFinaleOpen}
          onClose={() => setIsFinaleOpen(false)}
          data={data}
        />

        <DirectorModal
          isOpen={isDirectorOpen}
          onClose={() => setIsDirectorOpen(false)}
          data={data}
          onUpdateData={handleUpdateData}
          onResetData={handleResetData}
        />
      </div>
    </>
  );
}
