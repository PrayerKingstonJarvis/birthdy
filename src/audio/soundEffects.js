// Web Audio API Synthesizer - 100% deterministic, zero external asset dependencies
let audioCtx = null;
let musicBoxOscillators = [];
let isMusicPlaying = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playSound = (type) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    switch (type) {
      case 'coin': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }

      case 'cardFlip': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.07);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }

      case 'cardMatch': {
        // Celestial chime
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0.15, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.5);
        });
        break;
      }

      case 'clawDrop': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.4);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }

      case 'clawGrab': {
        [440, 554.37, 659.25, 880].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.2, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.4);
        });
        break;
      }

      case 'candleBlow': {
        // Soft breath wind sound via noise buffer
        const bufferSize = ctx.sampleRate * 0.6;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(150, now + 0.6);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
        noise.stop(now + 0.6);
        break;
      }

      case 'confetti': {
        // Celebration pop + ascending whistle
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }

      case 'scratch': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150 + Math.random() * 100, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }

      case 'fanfare': {
        // Grand victory fanfare chords
        const notes = [
          { f: 523.25, t: 0, d: 0.15 },    // C5
          { f: 523.25, t: 0.15, d: 0.15 }, // C5
          { f: 523.25, t: 0.3, d: 0.15 },  // C5
          { f: 659.25, t: 0.45, d: 0.4 },  // E5
          { f: 587.33, t: 0.85, d: 0.15 }, // D5
          { f: 659.25, t: 1.0, d: 0.15 },  // E5
          { f: 783.99, t: 1.15, d: 0.8 },  // G5
        ];
        notes.forEach(({ f, t, d }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + t);
          gain.gain.setValueAtTime(0.25, now + t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + t);
          osc.stop(now + t + d);
        });
        break;
      }

      case 'horn': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.15);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.warn('Audio play error:', err);
  }
};

// Music Box "Happy Birthday" melody synthesizer
const HAPPY_BIRTHDAY_NOTES = [
  { note: 261.63, dur: 0.3 }, // C4
  { note: 261.63, dur: 0.2 }, // C4
  { note: 293.66, dur: 0.5 }, // D4
  { note: 261.63, dur: 0.5 }, // C4
  { note: 349.23, dur: 0.5 }, // F4
  { note: 329.63, dur: 0.9 }, // E4
  { note: 0, dur: 0.2 },      // Rest

  { note: 261.63, dur: 0.3 }, // C4
  { note: 261.63, dur: 0.2 }, // C4
  { note: 293.66, dur: 0.5 }, // D4
  { note: 261.63, dur: 0.5 }, // C4
  { note: 392.00, dur: 0.5 }, // G4
  { note: 349.23, dur: 0.9 }, // F4
  { note: 0, dur: 0.2 },      // Rest

  { note: 261.63, dur: 0.3 }, // C4
  { note: 261.63, dur: 0.2 }, // C4
  { note: 523.25, dur: 0.5 }, // C5
  { note: 440.00, dur: 0.5 }, // A4
  { note: 349.23, dur: 0.5 }, // F4
  { note: 329.63, dur: 0.5 }, // E4
  { note: 293.66, dur: 0.8 }, // D4
  { note: 0, dur: 0.2 },      // Rest

  { note: 466.16, dur: 0.3 }, // Bb4
  { note: 466.16, dur: 0.2 }, // Bb4
  { note: 440.00, dur: 0.5 }, // A4
  { note: 349.23, dur: 0.5 }, // F4
  { note: 392.00, dur: 0.5 }, // G4
  { note: 349.23, dur: 1.2 }, // F4
  { note: 0, dur: 0.8 },      // Rest
];

let melodyTimeoutId = null;

export const toggleBackgroundMusic = (onStateChange) => {
  const ctx = getAudioContext();
  if (!ctx) return false;

  if (isMusicPlaying) {
    stopBackgroundMusic();
    if (onStateChange) onStateChange(false);
    return false;
  } else {
    isMusicPlaying = true;
    playMelodyLoop(0);
    if (onStateChange) onStateChange(true);
    return true;
  }
};

function playMelodyLoop(noteIndex = 0) {
  if (!isMusicPlaying) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const currentNote = HAPPY_BIRTHDAY_NOTES[noteIndex % HAPPY_BIRTHDAY_NOTES.length];
  const now = ctx.currentTime;

  if (currentNote.note > 0) {
    // Celesta / Music Box style timbre
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(currentNote.note * 2, now); // Higher octave music box chime

    // Soft chime envelope
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + currentNote.dur * 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + currentNote.dur * 1.2);
  }

  const nextDelay = currentNote.dur * 1000 * 0.95;
  melodyTimeoutId = setTimeout(() => {
    playMelodyLoop(noteIndex + 1);
  }, nextDelay);
}

export const stopBackgroundMusic = () => {
  isMusicPlaying = false;
  if (melodyTimeoutId) {
    clearTimeout(melodyTimeoutId);
    melodyTimeoutId = null;
  }
};
