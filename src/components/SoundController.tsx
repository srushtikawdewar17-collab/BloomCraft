'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';

type TrackCategory = 'piano' | 'romantic' | 'fairytale' | 'garden' | 'lofi';

export default function SoundController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCategory, setActiveCategory] = useState<TrackCategory>('piano');
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Stop synthesis on unmount
  useEffect(() => {
    return () => {
      stopSynthesis();
    };
  }, []);

  const playSynthesizedChord = (ctx: AudioContext, freqs: number[]) => {
    if (!ctx || ctx.state === 'suspended') return;

    const now = ctx.currentTime;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(1, now);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    // Soft attack
    masterGain.gain.linearRampToValueAtTime(0.04, now + 1.5);
    // Slow decay
    masterGain.gain.setValueAtTime(0.04, now + 5);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 9.5);

    // Delay line
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.4;
    const delayGain = ctx.createGain();
    delayGain.gain.value = 0.4;

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);
    
    // Feedback loop
    masterGain.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(filter);

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      // Piano has soft sine/triangle blend, Lofi has square/saw with low filter
      osc.type = activeCategory === 'lofi' ? 'sawtooth' : activeCategory === 'piano' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Slight detune for romantic/fairytale chorus effect
      if (activeCategory === 'romantic' || activeCategory === 'fairytale') {
        osc.detune.setValueAtTime(Math.random() * 12 - 6, now);
      }

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.2, now);

      osc.connect(oscGain);
      oscGain.connect(filter);
      
      osc.start(now);
      osc.stop(now + 10);
    });
  };

  const startSynthesis = () => {
    // Initialize Web Audio
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Chord progressions per category
    const chords: Record<TrackCategory, number[][]> = {
      piano: [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 392.00], // G6
      ],
      romantic: [
        [293.66, 349.23, 440.00, 523.25], // Dm7
        [196.00, 246.94, 293.66, 349.23], // G7
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
      ],
      fairytale: [
        [311.13, 392.00, 466.16, 587.33], // Ebmaj7
        [233.08, 293.66, 349.23, 440.00], // Bbmaj7
        [261.63, 311.13, 392.00, 466.16], // Cm7
        [174.61, 207.65, 261.63, 311.13], // Fm7
      ],
      garden: [
        [261.63, 329.63, 440.00, 493.88], // Cadd9
        [293.66, 392.00, 440.00, 587.33], // Gadd9
        [174.61, 261.63, 329.63, 392.00], // Fmaj7
        [220.00, 293.66, 349.23, 440.00], // Dsus4
      ],
      lofi: [
        [130.81, 261.63, 311.13, 392.00, 466.16], // Cm9
        [146.83, 293.66, 349.23, 440.00, 523.25], // Dm9
        [110.00, 220.00, 261.63, 329.63, 392.00], // Am9
        [116.54, 233.08, 293.66, 349.23, 440.00], // Bbmaj9
      ],
    };

    let chordIndex = 0;
    const playNext = () => {
      const currentChords = chords[activeCategory];
      playSynthesizedChord(ctx, currentChords[chordIndex]);
      chordIndex = (chordIndex + 1) % currentChords.length;
    };

    // Play immediately
    playNext();
    // Play every 8 seconds
    synthIntervalRef.current = setInterval(playNext, 8000);
  };

  const stopSynthesis = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopSynthesis();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      startSynthesis();
    }
  };

  // Restart loop if category changes while playing
  useEffect(() => {
    if (isPlaying) {
      stopSynthesis();
      startSynthesis();
    }
  }, [activeCategory]);

  return (
    <div className="glass-panel px-4 py-2.5 rounded-full flex items-center gap-4 shadow-sm border border-white/40">
      <button
        onClick={togglePlayback}
        className="w-8 h-8 rounded-full flex items-center justify-center bg-bloom-blush-dark/40 hover:bg-bloom-blush-dark/60 text-[#4A2D33] transition-colors focus:outline-none"
        aria-label={isPlaying ? 'Mute Ambient Music' : 'Play Ambient Music'}
      >
        {isPlaying ? (
          <Volume2 className="w-4 h-4 animate-pulse" />
        ) : (
          <VolumeX className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {/* Visual Audio Waves (Animated only when active) */}
      <div className="flex items-end gap-0.5 h-4 w-12 px-1">
        {[0.6, 1.2, 0.4, 0.9, 0.5, 0.7, 0.3, 1.0].map((val, i) => (
          <div
            key={i}
            className={`w-0.5 bg-[#BC8A70] rounded-full transition-all duration-300 ${
              isPlaying ? 'animate-pulse' : 'h-1 opacity-50'
            }`}
            style={{
              height: isPlaying ? `${val * 100}%` : '4px',
              animationDelay: isPlaying ? `${i * 0.15}s` : '0s',
            }}
          />
        ))}
      </div>

      {/* Track Category Selection Selector */}
      <div className="flex items-center gap-1.5 border-l border-black/10 dark:border-white/10 pl-3">
        {(['piano', 'romantic', 'fairytale', 'garden', 'lofi'] as TrackCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-2 py-1 text-xs font-medium rounded-md capitalize transition-all focus:outline-none ${
              activeCategory === cat
                ? 'bg-[#BC8A70] text-white shadow-xs'
                : 'text-[#4A2D33]/60 hover:text-[#4A2D33] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
