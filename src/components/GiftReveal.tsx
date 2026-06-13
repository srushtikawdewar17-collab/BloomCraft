'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, Heart, MessageSquare, Star, Smile, MailOpen, Music } from 'lucide-react';
import BouquetCanvas, { StemInstance } from './BouquetCanvas';
import MemoryGarden, { MemoryItem } from './MemoryGarden';
import { WrapOption, RibbonOption } from '@/data/themes';
import SoundController from './SoundController';
import { getSceneryBackdrop } from './PresentationPanel';

interface GiftRevealProps {
  stems: StemInstance[];
  wrap: WrapOption;
  ribbon: RibbonOption;
  bouquetName: string;
  cardText: { title: string; message: string; category: string; font?: string; color?: string; stickers?: string[]; photoBase64?: string | null };
  memories: MemoryItem[];
}

export default function GiftReveal({
  stems,
  wrap,
  ribbon,
  bouquetName,
  cardText,
  memories,
}: GiftRevealProps) {
  const [stage, setStage] = useState<'welcome' | 'box' | 'bloom' | 'card' | 'garden'>('welcome');
  const [reaction, setReaction] = useState<string | null>(null);
  const [reactionsList, setReactionsList] = useState<Array<{ id: number; emoji: string; left: number }>>([]);
  const [isMutedPrompt, setIsMutedPrompt] = useState(true);

  const handleUntie = () => {
    setStage('bloom');
  };

  const handleSelectReaction = (emoji: string) => {
    setReaction(emoji);
    
    // Spawn floating emojis
    const newFloater = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      emoji,
      left: 15 + Math.random() * 70,
    }));
    setReactionsList(prev => [...prev, ...newFloater]);

    // Clean up
    setTimeout(() => {
      setReactionsList(prev => prev.filter(r => !newFloater.some(nf => nf.id === r.id)));
    }, 3000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between py-8 px-4 relative overflow-hidden select-none bg-bloom-cream text-[#4A2D33]">
      
      {/* 1. Header showing ambient controls */}
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center z-30">
        <div className="font-serif italic font-bold text-xl tracking-wider text-[#BC8A70]">
          BloomCraft
        </div>
        <SoundController />
      </div>

      {/* Floating Reactions animation canvas */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {reactionsList.map((react) => (
            <motion.div
              key={react.id}
              initial={{ y: '100vh', opacity: 0.8, scale: 0.8 }}
              animate={{ y: '-10vh', opacity: 0, scale: 1.4, x: Math.random() * 60 - 30 }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
              className="absolute text-4xl"
              style={{ left: `${react.left}%` }}
            >
              {react.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 2. MAIN PRESENTATION CONTAINER */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full py-6 z-20">
        <AnimatePresence mode="wait">
          
          {/* STAGE 1: Welcome Screen */}
          {stage === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card max-w-md w-full p-8 rounded-3xl border border-white/60 text-center space-y-6 shadow-xl"
            >
              <div className="w-16 h-16 rounded-full bg-bloom-blush-dark/30 flex items-center justify-center mx-auto text-3xl">
                💌
              </div>
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#4A2D33]">A Story in Bloom</h2>
                <p className="text-sm text-[#4A2D33]/70 mt-2 leading-relaxed">
                  Someone has crafted a custom virtual bouquet and message to tell you a story. Step inside to unlock the secret language of their flowers.
                </p>
              </div>

              <button
                onClick={() => setStage('box')}
                className="w-full py-3 bg-[#BC8A70] hover:bg-[#A87961] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
              >
                Open Your Gift
              </button>
            </motion.div>
          )}

          {/* STAGE 2: Wrapped Box */}
          {stage === 'box' && (
            <motion.div
              key="box"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center text-center space-y-8"
            >
              {/* Luxury Gift Box SVG/CSS */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Glow ring */}
                <div className="absolute -inset-4 rounded-full bg-radial from-[#E6C587]/30 to-transparent blur-xl animate-pulse" />
                
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl overflow-visible">
                  {/* Cardboard Box Body */}
                  <rect x="30" y="80" width="140" height="100" rx="6" fill="#FDF9F0" stroke="#EDE5D3" strokeWidth="2" />
                  {/* Box Lid */}
                  <rect x="25" y="65" width="150" height="25" rx="4" fill="#FAF8F5" stroke="#EDE5D3" strokeWidth="2" />
                  
                  {/* Wrapped Ribbon Vertical */}
                  <rect x="92" y="65" width="16" height="115" fill={ribbon.hex} />
                  
                  {/* Large Satin bow knot */}
                  <circle cx="100" cy="65" r="10" fill={ribbon.hex} />
                  <path d="M 100 65 C 75 40, 60 50, 90 65 Z" fill={ribbon.hex} />
                  <path d="M 100 65 C 125 40, 140 50, 110 65 Z" fill={ribbon.hex} />
                </svg>
              </div>

              <div>
                <h3 className="font-serif font-bold text-xl text-[#4A2D33]">Unwrap the Ribbon</h3>
                <p className="text-xs text-[#4A2D33]/60 mt-1 max-w-xs mx-auto">
                  Untie the luxury bow to open the display box.
                </p>
              </div>

              <button
                onClick={handleUntie}
                className="px-6 py-2.5 bg-[#BC8A70] hover:bg-[#A87961] text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 focus:outline-none cursor-pointer"
              >
                <Gift className="w-4 h-4" /> Untie & Open Box
              </button>
            </motion.div>
          )}

          {/* STAGE 3: Blooming & Bouquet View */}
          {stage === 'bloom' && (
            <motion.div
              key="bloom"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full flex flex-col items-center space-y-6"
            >
              {/* Show Bouquet in Gift Box scene */}
              <div className={`w-full max-w-[460px] aspect-[4/5] rounded-3xl overflow-hidden p-6 relative flex items-center justify-center shadow-lg ${getSceneryBackdrop('giftbox')}`}>
                
                {/* Floating sparkle overlays */}
                <div className="absolute inset-0 pointer-events-none bg-radial from-white/10 to-transparent animate-pulse" />
                
                <BouquetCanvas
                  stems={stems}
                  setStems={() => {}}
                  selectedWrap={wrap}
                  selectedRibbon={ribbon}
                  isInteractive={false}
                />
              </div>

              {/* Title Reveal */}
              <div className="text-center space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#BC8A70]">Gift Unwrapped</span>
                <h2 className="font-serif font-bold text-2xl text-[#4A2D33] italic">
                  "{bouquetName}"
                </h2>
                <p className="text-xs text-[#4A2D33]/70 max-w-xs mx-auto">
                  A custom arrangement designed using the romantic language of flowers.
                </p>
              </div>

              <button
                onClick={() => setStage('card')}
                className="px-6 py-2.5 bg-[#BC8A70] hover:bg-[#A87961] text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 focus:outline-none cursor-pointer"
              >
                <MailOpen className="w-4 h-4" /> Read Attached Card
              </button>
            </motion.div>
          )}

          {/* STAGE 4: Card Reading */}
          {stage === 'card' && (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full max-w-md flex flex-col items-center space-y-6"
            >
              {/* Custom Unfolded Card */}
              <div
                style={{ backgroundColor: cardText.color || '#FFFDF9' }}
                className="w-full p-8 rounded-3xl shadow-xl border border-white/80 min-h-[340px] flex flex-col justify-between relative transform animate-glow"
              >
                {/* Attached Polaroid Image */}
                {cardText.photoBase64 && (
                  <div className="absolute -top-8 -right-4 bg-white p-1.5 pb-5 rotate-6 shadow-lg border border-gray-100 rounded-sm">
                    <img
                      src={cardText.photoBase64}
                      alt="Memory"
                      className="w-[90px] h-[90px] object-cover grayscale-10"
                    />
                    <div className="text-[8px] text-center text-gray-500 font-mono mt-1">❤ Memory</div>
                  </div>
                )}

                {/* Stickers stamp overlay */}
                <div className="absolute bottom-4 right-4 flex gap-1">
                  {(cardText.stickers || []).map((sticker) => (
                    <span key={sticker} className="text-2xl animate-bounce">{sticker}</span>
                  ))}
                </div>

                <div>
                  <div className="text-[9px] font-bold text-[#BC8A70] uppercase tracking-widest mb-4 flex items-center gap-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#E6C587]" />
                    BloomCraft Story Letter
                  </div>

                  <h4 className={`text-xl font-bold text-[#4A2D33] ${
                    cardText.font === 'serif' ? 'font-serif' :
                    cardText.font === 'script' ? 'font-cursive italic' :
                    cardText.font === 'mono' ? 'font-mono' : 'font-sans'
                  }`}>
                    {cardText.title || 'Dear Recipient'}
                  </h4>

                  <p className={`text-sm text-[#4A2D33]/90 leading-relaxed mt-4 whitespace-pre-line ${
                    cardText.font === 'serif' ? 'font-serif' :
                    cardText.font === 'script' ? 'font-cursive italic text-base' :
                    cardText.font === 'mono' ? 'font-mono' : 'font-sans'
                  }`}>
                    {cardText.message}
                  </p>
                </div>

                <div className="border-t border-black/5 pt-2 mt-6 text-xs text-right text-gray-400 font-serif">
                  With love & sincerity
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setStage('bloom')}
                  className="flex-1 py-2.5 bg-white/60 hover:bg-white text-[#4A2D33] font-bold rounded-xl transition-all border border-black/5 focus:outline-none"
                >
                  View Bouquet again
                </button>
                
                {memories.length > 0 && (
                  <button
                    onClick={() => setStage('garden')}
                    className="flex-1 py-2.5 bg-[#BC8A70] hover:bg-[#A87961] text-white font-bold rounded-xl transition-all shadow-md focus:outline-none"
                  >
                    View Memory Scrapbook
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* STAGE 5: Memory Garden Timeline */}
          {stage === 'garden' && (
            <motion.div
              key="garden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl space-y-6"
            >
              <MemoryGarden
                memories={memories}
                setMemories={() => {}}
                isInteractive={false}
              />
              
              <div className="flex justify-center">
                <button
                  onClick={() => setStage('card')}
                  className="px-6 py-2 bg-white/60 hover:bg-white text-[#4A2D33] font-bold rounded-xl transition-all border border-black/5 focus:outline-none"
                >
                  Go Back to Letter
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* 3. RECIPIENT REACTIONS PANEL (Bottom Bar) */}
      {stage !== 'welcome' && stage !== 'box' && (
        <div className="max-w-xl mx-auto w-full glass-card p-4 rounded-2xl border border-white/60 shadow-lg mt-6 text-center z-30">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
            Send a Reaction back
          </span>
          
          <div className="flex justify-around items-center">
            {[
              { emoji: '❤️', label: 'Loved It' },
              { emoji: '🌸', label: 'Beautiful' },
              { emoji: '🥹', label: 'Emotional' },
              { emoji: '🎁', label: 'Thank You' },
              { emoji: '✨', label: 'Magical' }
            ].map((react) => (
              <button
                key={react.label}
                onClick={() => handleSelectReaction(react.emoji)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all hover:scale-115 focus:outline-none ${
                  reaction === react.emoji ? 'bg-bloom-blush-dark/30 scale-110 font-bold' : ''
                }`}
              >
                <span className="text-2xl">{react.emoji}</span>
                <span className="text-[9px] text-[#4A2D33]/60">{react.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
