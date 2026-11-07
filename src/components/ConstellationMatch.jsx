import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, CheckCircle2, Star } from 'lucide-react';
import { playSound } from '../audio/soundEffects';

export default function ConstellationMatch({ cardsData, onQuestComplete }) {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Initialize and shuffle cards
  const initializeGame = () => {
    playSound('coin');
    const deck = [];
    cardsData.forEach((item) => {
      // Create pair for each item
      deck.push({ ...item, uniqueKey: `${item.id}-1` });
      deck.push({ ...item, uniqueKey: `${item.id}-2` });
    });

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setMatchedIds([]);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, [cardsData]);

  // Card click handler
  const handleCardClick = (index) => {
    // Ignore if already 2 cards flipped, or this card is already flipped/matched
    if (flippedIndices.length === 2) return;
    if (flippedIndices.includes(index)) return;
    if (matchedIds.includes(cards[index].id)) return;

    playSound('cardFlip');
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.id === secondCard.id) {
        // Match!
        setTimeout(() => {
          playSound('cardMatch');
          setMatchedIds((prev) => {
            const next = [...prev, firstCard.id];
            if (next.length === cardsData.length) {
              // Game Won!
              setTimeout(() => {
                playSound('fanfare');
                playSound('confetti');
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 },
                  colors: ['#a855f7', '#fbbf24', '#f43f5e', '#38bdf8']
                });
                setGameWon(true);
                onQuestComplete('constellation');
              }, 400);
            }
            return next;
          });
          setFlippedIndices([]);
        }, 500);
      } else {
        // No match: flip back
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1100);
      }
    }
  };

  return (
    <section id="constellation-section" className="py-20 px-4 max-w-5xl mx-auto scroll-mt-20">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Quest 03</span>
        </div>
        <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-slate-100">
          Starlight Memory Constellation
        </h2>
        <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Flip the cosmic celestial cards, find the matching affirmations of love, and illuminate Gitu’s starry sky!
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between max-w-2xl mx-auto mb-6 px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300">
          <span>
            Matched:{' '}
            <strong className="text-purple-400 font-bold">
              {matchedIds.length} / {cardsData.length} Pairs
            </strong>
          </span>
          <span className="text-slate-600">|</span>
          <span>
            Moves: <strong className="text-amber-300 font-bold">{moves}</strong>
          </span>
        </div>

        <button
          onClick={initializeGame}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Stars</span>
        </button>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 max-w-4xl mx-auto">
        {cards.map((card, index) => {
          const isFlipped = flippedIndices.includes(index) || matchedIds.includes(card.id);
          const isMatched = matchedIds.includes(card.id);

          return (
            <div
              key={card.uniqueKey}
              onClick={() => handleCardClick(index)}
              className="perspective-[1000px] aspect-[3/4] cursor-pointer group"
            >
              <div
                className={`relative w-full h-full rounded-2xl transition-transform duration-500 transform-style-preserve-3d shadow-xl ${
                  isFlipped ? 'rotate-y-180' : 'group-hover:scale-105'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Front / Covered Side (Celestial Back) */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-2 border-purple-500/30 flex flex-col items-center justify-center p-3 text-center backface-hidden shadow-lg group-hover:border-purple-400/60"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="w-10 h-10 rounded-full border border-purple-400/40 flex items-center justify-center text-purple-300 text-lg mb-1 shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                    ✦
                  </div>
                  <span className="font-pixel text-[8px] text-purple-300/80 uppercase tracking-widest">
                    STARS
                  </span>
                </div>

                {/* Back / Revealed Side (Card Content) */}
                <div
                  className={`absolute inset-0 w-full h-full rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center backface-hidden border-2 transition-all ${
                    isMatched
                      ? 'bg-gradient-to-b from-purple-900/90 via-slate-900 to-amber-950/60 border-amber-400 shadow-xl shadow-amber-400/20'
                      : 'bg-slate-900 border-purple-500/60 shadow-lg'
                  }`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <span className="text-2xl sm:text-3xl mb-1 filter drop-shadow">
                    {card.icon}
                  </span>
                  <h4 className="font-serif-title font-bold text-[11px] sm:text-xs text-amber-200 line-clamp-2 leading-tight">
                    {card.title}
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-300/90 mt-1 line-clamp-3 font-light leading-tight">
                    {card.quote}
                  </p>
                  {isMatched && (
                    <div className="mt-1 flex items-center gap-0.5 text-[9px] text-emerald-400 font-pixel">
                      <Star className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" />
                      <span>LIT</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Victory Banner */}
      {gameWon && (
        <div className="mt-10 max-w-xl mx-auto p-6 rounded-3xl bg-gradient-to-r from-purple-950/90 via-slate-900 to-amber-950/80 border-2 border-amber-400/60 text-center shadow-2xl animate-fade-in">
          <div className="text-3xl mb-2">🌌 ✨ 👑</div>
          <h3 className="font-serif-title text-2xl font-bold text-amber-300">
            The Constellation of Gitu is Fully Aligned!
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 font-light max-w-md mx-auto">
            All 6 starlight memories have connected across the night sky. Gitika, you shine brighter than any constellation in the universe.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-xs text-amber-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>VIP Quest 03 Completed! Stamp Claimed.</span>
          </div>
        </div>
      )}
    </section>
  );
}
