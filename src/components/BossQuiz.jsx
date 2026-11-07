import React, { useState } from 'react';
import { HelpCircle, Sparkles, Check, ArrowRight, Heart } from 'lucide-react';
import { playSound } from '../audio/soundEffects';

const QUESTIONS = [
  {
    id: 1,
    question: "What’s your favorite food?",
    bossAnswer: "momos (and my own head!)",
    keywords: ["momo", "momos", "head", "dumpling", "dim sum"]
  },
  {
    id: 2,
    question: "Who is your favorite person?",
    bossAnswer: "Upcoming Husband😎😁😁",
    keywords: ["husband", "upcoming", "you", "boss", "me", "kingston", "jarvis", "fiance", "fiancé"]
  },
  {
    id: 3,
    question: "Who was your first love?",
    bossAnswer: "Upcoming Husband (or should I check the logs? 😜)",
    keywords: ["you", "husband", "upcoming", "me", "boss", "nobody", "food"]
  },
  {
    id: 4,
    question: "What’s your favorite color?",
    bossAnswer: "Black / Pastel / The color of royalty ✨",
    keywords: ["black", "pink", "purple", "lavender", "blue", "red", "white", "pastel", "rose"]
  },
  {
    id: 5,
    question: "How are you feeling today?",
    bossAnswer: "Like the 25-year-old Queen of the Universe! 👑",
    keywords: ["good", "happy", "excited", "great", "blessed", "queen", "amazing", "tired", "loved", "special"]
  }
];

export default function BossQuiz({ onQuizCompleted }) {
  const [answers, setAnswers] = useState({
    1: '',
    2: '',
    3: '',
    4: '',
    5: ''
  });

  const [selfLove1, setSelfLove1] = useState('');
  const [selfLove2, setSelfLove2] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleInputChange = (id, val) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check answers
    let correctCount = 0;
    QUESTIONS.forEach(q => {
      const userAns = (answers[q.id] || '').toLowerCase().trim();
      if (!userAns) return;

      const isMatch = q.keywords.some(kw => userAns.includes(kw.toLowerCase()));
      if (isMatch) correctCount++;
    });

    setScore(correctCount);
    setIsSubmitted(true);

    if (correctCount >= 4) {
      playSound('fanfare');
      playSound('cardMatch');
    } else {
      playSound('horn');
    }

    // Trigger timer for "The Boss has sent you something—open it!"
    if (onQuizCompleted) {
      onQuizCompleted({
        answers,
        selfLove: [selfLove1, selfLove2],
        score: correctCount
      });
    }
  };

  return (
    <section id="quiz-section" className="py-20 px-4 max-w-4xl mx-auto scroll-mt-20">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Boss’s Compatibility Test</span>
        </div>
        <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-slate-100">
          Gitika Ma’am, Let’s Test Your Answers!
        </h2>
        <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          The Boss already locked in his official answers. Let’s see how many you get right!
        </p>
      </div>

      <div className="bg-slate-900/80 border-2 border-rose-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {QUESTIONS.map((q, idx) => (
            <div
              key={q.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 transition-all hover:border-slate-700"
            >
              <label className="font-serif-title text-base sm:text-lg font-bold text-slate-200 block mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center text-xs font-mono">
                  {idx + 1}
                </span>
                <span>{q.question}</span>
              </label>

              <input
                type="text"
                disabled={isSubmitted}
                required
                placeholder="Type your answer here..."
                value={answers[q.id]}
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-amber-200 placeholder:text-slate-600 focus:outline-none focus:border-rose-400 disabled:opacity-80 transition-all"
              />

              {/* Once submitted, show Boss's written answer below */}
              {isSubmitted && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    What The Boss Wrote: <strong className="text-amber-300 font-semibold">{q.bossAnswer}</strong>
                  </span>
                  <span className="text-rose-400 font-mono text-[11px]">
                    Your answer: “{answers[q.id]}”
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Final Question: Self-Love */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-rose-950/50 via-slate-950 to-pink-950/50 border-2 border-rose-400/40">
            <label className="font-serif-title text-lg sm:text-xl font-bold text-rose-200 block mb-1 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
              <span>Final Question: What are two things you love about yourself?</span>
            </label>
            <p className="text-xs text-slate-400 mb-4 font-light">
              Take a moment to celebrate the queen you are on your 25th birthday.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-rose-300 block mb-1">#1 Thing you love:</span>
                <input
                  type="text"
                  disabled={isSubmitted}
                  required
                  placeholder="e.g., My smile / my patience..."
                  value={selfLove1}
                  onChange={(e) => setSelfLove1(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-amber-200 placeholder:text-slate-600 focus:outline-none focus:border-rose-400 disabled:opacity-80 transition-all"
                />
              </div>

              <div>
                <span className="text-[11px] text-rose-300 block mb-1">#2 Thing you love:</span>
                <input
                  type="text"
                  disabled={isSubmitted}
                  required
                  placeholder="e.g., How strong I am / my kind heart..."
                  value={selfLove2}
                  onChange={(e) => setSelfLove2(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-amber-200 placeholder:text-slate-600 focus:outline-none focus:border-rose-400 disabled:opacity-80 transition-all"
                />
              </div>
            </div>
          </div>

          {!isSubmitted && (
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-slate-950 font-bold text-base shadow-xl shadow-rose-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Submit My Answers to The Boss 🎯</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </form>

        {/* Visual Outcome / Feedback */}
        {isSubmitted && (
          <div className="mt-8 pt-6 border-t border-slate-800 text-center animate-scale-up">
            {score >= 4 ? (
              /* Glowing Soft Green */
              <div className="p-6 rounded-2xl bg-emerald-950/60 border-2 border-emerald-400/80 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                <p className="font-serif-title text-xl sm:text-2xl font-bold text-emerald-300 tracking-wide drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">
                  See how well I know you? 😎😶🌫️🙄😋😃😀🤔
                </p>
                <p className="text-xs text-emerald-400/80 mt-2">
                  Score: {score} out of 5 Matched! You two are completely in sync! ✨
                </p>
              </div>
            ) : (
              /* Glowing Soft Red */
              <div className="p-6 rounded-2xl bg-rose-950/60 border-2 border-rose-500/80 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                <p className="font-serif-title text-lg sm:text-xl font-bold text-rose-300 tracking-wide drop-shadow-[0_0_10px_rgba(244,63,94,0.8)] leading-relaxed">
                  I actually wrote some wrong answers on purpose—if I didn't let you get them all right on your birthday, what kind of birthday would it be? 😎😶🌫️🙄😋😃😀🤔
                </p>
                <p className="text-xs text-rose-400/80 mt-2">
                  Nice try, Gitika Ma’am! The Boss always has a backup joke ready. 😜
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
