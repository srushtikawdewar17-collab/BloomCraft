'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, BookOpen, Trophy, X } from 'lucide-react';
import { FlowerData } from '@/data/flowers';

interface ElaraGuideProps {
  currentStems: Array<{ flower: FlowerData; colorIndex: number; id: string }>;
  onTriggerAI?: () => void;
  achievementUnlocks?: {
    romanticSoul?: boolean;
    floralArtist?: boolean;
    masterGiftGiver?: boolean;
    bloomCreator?: boolean;
  };
}

export default function ElaraGuide({
  currentStems,
  onTriggerAI,
  achievementUnlocks = {},
}: ElaraGuideProps) {
  const [dialogue, setDialogue] = useState<string>("Welcome to BloomCraft. Let's create something unforgettable today.");
  const [isOpen, setIsOpen] = useState(true);
  const [showStory, setShowStory] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  // Dynamic recommendations based on current selection
  useEffect(() => {
    if (currentStems.length === 0) {
      setDialogue("Welcome to BloomCraft. Let's create something unforgettable today. Pick manual mode or let me design one for you!");
      return;
    }

    const counts = currentStems.reduce((acc, stem) => {
      acc[stem.flower.id] = (acc[stem.flower.id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    if (currentStems.length === 10) {
      setDialogue("Your bouquet is perfectly full! You can now select a wrapping texture, choose a theme, or head to the Greeting Card creator.");
      return;
    }

    // Contextual checks
    if (counts['rose'] && counts['peony']) {
      setDialogue("Oh, peonies and roses! They create a wonderfully romantic, lush arrangement reminiscent of a Parisian garden.");
      return;
    }
    if (counts['sunflower']) {
      setDialogue("Sunflowers always bring warmth, loyalty, and optimism. I love how they stand out as bright focal statements!");
      return;
    }
    if (counts['hydrangea']) {
      setDialogue("Hydrangeas symbolize heartfelt gratitude and deep understanding. They make a perfect cloudy base for smaller blooms.");
      return;
    }
    if (counts['orchid'] || counts['lily']) {
      setDialogue("A choice of orchids or lilies adds high-end luxury and structural grace. These represent purity and refined elegance.");
      return;
    }
    if (counts['cherry-blossom'] || counts['tulip']) {
      setDialogue("Tulips and cherry blossoms feel like a refreshing spring awakening. They symbolize happiness and new beginnings!");
      return;
    }
    if (currentStems.some(s => s.flower.type === 'greenery') && currentStems.some(s => s.flower.type === 'filler')) {
      setDialogue("You've blended greenery and fillers beautifully. In professional floristry, framing with foliage creates natural depth!");
      return;
    }

    // General tip
    const randomTips = [
      "Try mixing different stem heights. Real bouquets always have a natural, organic asymmetry.",
      "Baby's breath works beautifully as a soft, starry filler between larger focal flowers like peonies.",
      "Did you know? In the language of flowers, ranunculus speaks of dazzling charm and physical attraction.",
      "Greenery like eucalyptus adds a cool, healing, sage-colored frame to warm-colored roses.",
    ];
    const randomIndex = Math.floor(Math.random() * randomTips.length);
    setDialogue(randomTips[randomIndex]);
  }, [currentStems]);

  return (
    <div className="relative">
      {/* Floating Elara Widget */}
      <div className={`fixed bottom-6 right-6 z-40 flex items-end gap-4 transition-all duration-500 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-100'}`}>
        
        {/* Dialogue Bubble */}
        {isOpen && (
          <div className="glass-card p-4 rounded-2xl max-w-[280px] text-sm leading-relaxed text-[#4A2D33] shadow-lg relative border border-[#F3C6CF] mb-12 select-none animate-sway-slow">
            <div className="absolute right-4 bottom-[-8px] w-4 h-4 bg-white/70 rotate-45 border-r border-b border-[#F3C6CF]/50 backdrop-blur-sm" />
            <div className="font-serif font-bold text-[#BC8A70] text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#E6C587]" />
              Elara • Advisor
            </div>
            <p>{dialogue}</p>
            
            {/* Quick Actions inside dialogue bubble */}
            <div className="mt-2.5 pt-2 border-t border-black/5 flex items-center gap-2 text-xs">
              <button 
                onClick={() => setShowStory(true)}
                className="text-[#BC8A70] hover:underline flex items-center gap-0.5"
              >
                <BookOpen className="w-3 h-3" /> Story
              </button>
              <span className="text-gray-300">|</span>
              <button 
                onClick={() => setShowAchievements(true)}
                className="text-[#BC8A70] hover:underline flex items-center gap-0.5"
              >
                <Trophy className="w-3 h-3" /> Badges
              </button>
            </div>
          </div>
        )}

        {/* Elara Character Model */}
        <div className="relative group">
          {/* Pulsing circular aura */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-bloom-blush-dark/30 to-bloom-lavender-dark/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/80 bg-[#FFF3F5] shadow-md flex items-center justify-center focus:outline-none transition-transform hover:scale-105"
          >
            {/* Elara Vector SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full transform translate-y-1 scale-110">
              {/* Background gradient */}
              <defs>
                <linearGradient id="elaraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF2F4" />
                  <stop offset="100%" stopColor="#FFE4EC" />
                </linearGradient>
              </defs>
              
              {/* Hair Back */}
              <path d="M 30,50 C 20,40 20,20 40,15 C 60,10 80,20 80,45 C 80,60 70,75 65,85" fill="#F7E7B4" />
              
              {/* Shoulders / Dress */}
              <path d="M 25,90 C 25,75 35,70 50,70 C 65,70 75,75 75,90 Z" fill="#F3C6CF" />
              {/* Apron straps */}
              <path d="M 38,70 L 42,90 M 62,70 L 58,90" stroke="#FFFFFF" strokeWidth="2.5" />

              {/* Neck */}
              <rect x="44" y="60" width="12" height="12" rx="4" fill="#FEDFD2" />

              {/* Head / Face */}
              <circle cx="50" cy="45" r="20" fill="#FEDFD2" />

              {/* Blonde Hair Front */}
              <path d="M 30,45 C 30,25 45,22 50,28 C 55,22 70,25 70,45 C 70,55 68,60 62,60 C 58,50 42,50 38,60 C 32,60 30,55 30,45 Z" fill="#FCEECA" />
              {/* Cute hair strands / braids style */}
              <path d="M 32,35 Q 22,45 28,55" fill="none" stroke="#FCEECA" strokeWidth="2" strokeLinecap="round" />
              <path d="M 68,35 Q 78,45 72,55" fill="none" stroke="#FCEECA" strokeWidth="2" strokeLinecap="round" />

              {/* Eyes - Warm closed smiling arches */}
              <path d="M 38,45 Q 43,48 44,45" fill="none" stroke="#684A3B" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 56,45 Q 57,48 62,45" fill="none" stroke="#684A3B" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Cheeks - blushing pink */}
              <circle cx="36" cy="51" r="3.5" fill="#FFAEC9" opacity="0.6" />
              <circle cx="64" cy="51" r="3.5" fill="#FFAEC9" opacity="0.6" />

              {/* Warm Smile */}
              <path d="M 46,53 Q 50,57 54,53" fill="none" stroke="#B81D43" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Holding Flowers */}
              <g transform="translate(42, 72) scale(0.65)">
                {/* Greens */}
                <path d="M 5,20 L 12,5 M 15,20 L 12,5" stroke="#ADCBB5" strokeWidth="3" />
                {/* Tiny Roses */}
                <circle cx="5" cy="5" r="6" fill="#D2143A" />
                <circle cx="19" cy="8" r="5" fill="#FFB3C6" />
                <circle cx="11" cy="1" r="5.5" fill="#E6C587" />
              </g>
            </svg>
          </button>
        </div>
      </div>

      {/* Story Overlay Modals */}
      {showStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs">
          <div className="glass-card max-w-md p-6 rounded-3xl m-4 border border-white/60 relative animate-sway-slow">
            <button 
              onClick={() => setShowStory(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 text-gray-500 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-serif font-bold text-2xl text-[#4A2D33] mb-3">Elara's Brand Story</h3>
            <div className="text-sm text-[#4A2D33]/80 space-y-3 leading-relaxed">
              <p>
                Elara has spent years wandering through fields and secret glasshouses, collecting the whisperings and the silent language of flowers. 
              </p>
              <p>
                "Every bouquet carries a story," she believes, "and every story deserves its chance to bloom. A single rose can whisper passion, baby's breath speaks of eternal love, while sage branches offer protection."
              </p>
              <p>
                Through BloomCraft, she shares this botanical wisdom with you, helping you weave memories, apologies, and promises into visual arrangements that carry the weight of spoken letters.
              </p>
            </div>
            <button 
              onClick={() => setShowStory(false)}
              className="mt-6 w-full py-2.5 bg-[#BC8A70] hover:bg-[#A87961] text-white font-medium rounded-xl transition-colors shadow-sm"
            >
              Close and Create
            </button>
          </div>
        </div>
      )}

      {/* Achievement Overlay Modal */}
      {showAchievements && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl m-4 border border-white/60 relative">
            <button 
              onClick={() => setShowAchievements(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 text-gray-500 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-serif font-bold text-2xl text-[#4A2D33] mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-[#E6C587]" />
              Your Achievements
            </h3>
            
            <div className="space-y-3">
              {[
                {
                  id: 'romanticSoul',
                  icon: '🌹',
                  name: 'Romantic Soul',
                  desc: 'Incorporate Roses, Peonies, and filler flowers for a romantic vibe.',
                  unlocked: achievementUnlocks.romanticSoul || currentStems.some(s => s.flower.id === 'rose') && currentStems.some(s => s.flower.id === 'peony')
                },
                {
                  id: 'floralArtist',
                  icon: '🌸',
                  name: 'Floral Artist',
                  desc: 'Blend at least 5 different flower types in a single custom design.',
                  unlocked: achievementUnlocks.floralArtist || (new Set(currentStems.map(s => s.flower.id))).size >= 5
                },
                {
                  id: 'masterGiftGiver',
                  icon: '💌',
                  name: 'Master Gift Giver',
                  desc: 'Design a bouquet and write a greeting card to send to a friend.',
                  unlocked: achievementUnlocks.masterGiftGiver || false
                },
                {
                  id: 'bloomCreator',
                  icon: '✨',
                  name: 'Bloom Creator',
                  desc: 'Build your first virtual bouquet structure.',
                  unlocked: achievementUnlocks.bloomCreator || currentStems.length > 0
                }
              ].map((badge) => (
                <div 
                  key={badge.id} 
                  className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                    badge.unlocked 
                      ? 'bg-bloom-blush-dark/30 border-[#F3C6CF]/70' 
                      : 'bg-black/5 border-transparent opacity-60'
                  }`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <h4 className="font-semibold text-[#4A2D33] text-sm flex items-center gap-1.5">
                      {badge.name}
                      {badge.unlocked && (
                        <span className="text-[10px] bg-[#BC8A70] text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Unlocked
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-[#4A2D33]/70 mt-0.5">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setShowAchievements(false)}
              className="mt-6 w-full py-2.5 bg-[#BC8A70] hover:bg-[#A87961] text-white font-medium rounded-xl transition-colors shadow-sm"
            >
              Continue Crafting
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
