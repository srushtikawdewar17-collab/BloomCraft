'use client';

import React, { useState } from 'react';
import { Sparkles, Heart, Gift, MessageCircle, HelpCircle } from 'lucide-react';
import { FLOWERS, FlowerData } from '@/data/flowers';
import { THEMES, WRAPS, RIBBONS, ThemeData, WrapOption, RibbonOption } from '@/data/themes';
import { StemInstance } from './BouquetCanvas';

interface AIBuilderProps {
  onGenerateBouquet: (
    generatedStems: StemInstance[],
    theme: ThemeData,
    wrap: WrapOption,
    ribbon: RibbonOption,
    bouquetName: string,
    cardText: { title: string; message: string; category: string }
  ) => void;
}

export default function AIBuilder({ onGenerateBouquet }: AIBuilderProps) {
  const [occasion, setOccasion] = useState('birthday');
  const [relationship, setRelationship] = useState('mother');
  const [mood, setMood] = useState('romantic');
  const [favColor, setFavColor] = useState('pink');
  const [customNote, setCustomNote] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [elaraExplanation, setElaraExplanation] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      // 1. Determine theme
      let selectedThemeId = 'dreamy-pastels';
      if (occasion === 'apology') selectedThemeId = 'cottagecore';
      else if (occasion === 'love') selectedThemeId = 'romantic';
      else if (mood === 'elegant') selectedThemeId = 'luxury';
      else if (mood === 'whimsical') selectedThemeId = 'fairy-garden';
      else if (mood === 'cheerful') selectedThemeId = 'spring-blossom';

      const theme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0];
      const wrap = WRAPS.find(w => w.id === theme.defaultWrapId) || WRAPS[0];
      const ribbon = RIBBONS.find(r => r.id === theme.defaultRibbonId) || RIBBONS[0];

      // 2. Select Stems (10 stems total: 5 focal, 3 fillers, 2 greenery)
      const selectedStems: StemInstance[] = [];
      
      let focals: FlowerData[] = [];
      let fillers: FlowerData[] = [];
      let greens: FlowerData[] = [];

      if (occasion === 'apology') {
        focals = FLOWERS.filter(f => f.id === 'hydrangea' || f.id === 'lily' || f.id === 'tulip');
        fillers = FLOWERS.filter(f => f.id === 'babys-breath' || f.id === 'statice');
        greens = FLOWERS.filter(f => f.id === 'olive' || f.id === 'eucalyptus');
      } else if (occasion === 'love' || mood === 'romantic') {
        focals = FLOWERS.filter(f => f.id === 'rose' || f.id === 'peony' || f.id === 'ranunculus');
        fillers = FLOWERS.filter(f => f.id === 'babys-breath' || f.id === 'wax-flower');
        greens = FLOWERS.filter(f => f.id === 'eucalyptus' || f.id === 'ruscus');
      } else {
        focals = FLOWERS.filter(f => f.id === 'sunflower' || f.id === 'cherry-blossom' || f.id === 'tulip');
        fillers = FLOWERS.filter(f => f.id === 'wax-flower' || f.id === 'babys-breath');
        greens = FLOWERS.filter(f => f.id === 'fern' || f.id === 'ruscus');
      }

      // Fill up to 5 focals, 3 fillers, 2 greenery
      const addStems = (catalog: FlowerData[], count: number, roleZ: number) => {
        for (let i = 0; i < count; i++) {
          const flower = catalog[i % catalog.length];
          // Determine color index based on user selection or defaults
          let colorIndex = 0;
          if (favColor === 'pink') {
            const pinkIdx = flower.colors.findIndex(c => c.name.toLowerCase().includes('pink') || c.name.toLowerCase().includes('peach') || c.name.toLowerCase().includes('rose'));
            if (pinkIdx !== -1) colorIndex = pinkIdx;
          } else if (favColor === 'yellow') {
            const yellowIdx = flower.colors.findIndex(c => c.name.toLowerCase().includes('yellow') || c.name.toLowerCase().includes('gold') || c.name.toLowerCase().includes('cream'));
            if (yellowIdx !== -1) colorIndex = yellowIdx;
          } else if (favColor === 'red') {
            const redIdx = flower.colors.findIndex(c => c.name.toLowerCase().includes('red') || c.name.toLowerCase().includes('crimson') || c.name.toLowerCase().includes('magenta'));
            if (redIdx !== -1) colorIndex = redIdx;
          }

          selectedStems.push({
            id: `${flower.id}-${i}-${Math.random().toString(36).substr(2, 4)}`,
            flower,
            colorIndex,
            x: 0,
            y: 0,
            angle: 0,
            heightScale: 1.0,
            zIndex: roleZ
          });
        }
      };

      addStems(focals.length ? focals : [FLOWERS[0]], 5, 10);
      addStems(fillers.length ? fillers : [FLOWERS[10]], 3, 5);
      addStems(greens.length ? greens : [FLOWERS[13]], 2, 2);

      // 3. Name Bouquet
      const names: Record<string, string[]> = {
        birthday: ["Blooming Gratitude", "Golden Promise", "Eternal Spring"],
        apology: ["Sincere Garden", "Olive & Peace", "Garden of Memories"],
        love: ["Blush of Forever", "Midnight Passion", "Lavender Dreams"],
        miss: ["Whispering Wind", "Remembering Meadows", "Moonlit Blossom"]
      };
      const possibleNames = names[occasion] || ["Spring Serenade", "Floral Waltz"];
      const bouquetName = possibleNames[Math.floor(Math.random() * possibleNames.length)];

      // 4. Generate card copy
      let cardTitle = "A Gift For You";
      let cardMsg = "Thinking of you today and sending these blossoms to brighten your space.";
      if (occasion === 'apology') {
        cardTitle = "I'm Truly Sorry";
        cardMsg = `Please accept this bouquet as a token of my sincere apology. I chose olive branches for peace, hydrangeas for understanding, and white lilies for purity. I value our connection deeply. ${customNote ? `\n\n"${customNote}"` : ''}`;
      } else if (occasion === 'love') {
        cardTitle = "With All My Heart";
        cardMsg = `You mean the world to me. I designed this bouquet with romantic pink roses and peonies to represent our enduring love and happiness together. ${customNote ? `\n\n"${customNote}"` : ''}`;
      } else if (occasion === 'birthday') {
        cardTitle = `Happy Birthday!`;
        cardMsg = `Wishing you the happiest of birthdays! May your year be filled with as much joy, warmth, and brightness as these golden sunflowers. ${customNote ? `\n\n"${customNote}"` : ''}`;
      } else if (customNote) {
        cardTitle = "To Someone Special";
        cardMsg = customNote;
      }

      const cardText = {
        title: cardTitle,
        message: cardMsg,
        category: occasion
      };

      // 5. Elara Explanation Dialog
      let explanation = "";
      if (occasion === 'apology') {
        explanation = `I designed a Cottagecore bouquet named "${bouquetName}". I chose hydrangeas for understanding, lilies for sincerity, and olive branches to extend an offering of peace and reconciliation. I wrapped them in Sage Green satin with a delicate lace bow.`;
      } else if (occasion === 'love') {
        explanation = `I crafted a classic Romantic bouquet named "${bouquetName}". I chose crimson and pink roses to represent passion, paired with lush peonies for romance and baby's breath for everlasting love. It is wrapped in ivory silk with a rich velvet bow.`;
      } else {
        explanation = `I created a Spring Blossom bouquet named "${bouquetName}". I selected tulips for happiness, ranunculus for charm, and fern greenery to represent sincerity. I think the bright ${favColor} color palette matches your mood perfectly!`;
      }

      setElaraExplanation(explanation);
      setIsGenerating(false);

      // Trigger callback
      onGenerateBouquet(selectedStems, theme, wrap, ribbon, bouquetName, cardText);
    }, 1800);
  };

  return (
    <div className="w-full glass-card p-6 rounded-3xl border border-white/60 relative select-none">
      
      {/* Sparkle Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-[#E6C587]/20 flex items-center justify-center text-[#E6C587]">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-serif font-bold text-lg text-[#4A2D33]">AI Florist Designer</h4>
          <p className="text-[11px] text-[#4A2D33]/60">Describe your occasion, and Elara will compose a matching bouquet.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#4A2D33]">
        
        {/* Occasion Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold">What is the occasion?</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'birthday', label: '🎂 Birthday', desc: 'Mother/Friend' },
              { id: 'love', label: '💖 Romance', desc: 'Partner/Anniversary' },
              { id: 'apology', label: '🙏 Apology', desc: 'Sincere & Sorry' },
              { id: 'miss', label: '💭 Just Because', desc: 'Thinking of you' }
            ].map(o => (
              <button
                key={o.id}
                type="button"
                onClick={() => setOccasion(o.id)}
                className={`p-2.5 rounded-xl border text-left transition-all focus:outline-none ${
                  occasion === o.id
                    ? 'border-[#BC8A70] bg-[#BC8A70]/10 font-semibold shadow-xs'
                    : 'border-black/5 bg-white/40 hover:bg-white/70'
                }`}
              >
                <div>{o.label}</div>
                <div className="text-[9px] text-[#4A2D33]/50 font-normal mt-0.5">{o.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Mood Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold">What vibe or mood should it carry?</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'romantic', label: 'Romantic' },
              { id: 'cheerful', label: 'Cheerful' },
              { id: 'elegant', label: 'Elegant' },
              { id: 'whimsical', label: 'Whimsical' }
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMood(m.id)}
                className={`px-3 py-2 rounded-xl border transition-all focus:outline-none ${
                  mood === m.id
                    ? 'border-[#BC8A70] bg-[#BC8A70]/10 font-semibold'
                    : 'border-transparent bg-white/40 hover:bg-white/70'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold">Preferred Color Palette?</label>
          <div className="flex gap-2">
            {[
              { id: 'pink', label: 'Blush Pink', color: '#FFB7C5' },
              { id: 'yellow', label: 'Champagne Yellow', color: '#FFF2D4' },
              { id: 'red', label: 'Crimson Red', color: '#D2143A' }
            ].map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setFavColor(c.id)}
                className={`flex-1 p-2 rounded-xl border flex items-center gap-2 justify-center transition-all focus:outline-none ${
                  favColor === c.id
                    ? 'border-[#BC8A70] bg-[#BC8A70]/10 font-semibold'
                    : 'border-transparent bg-white/40 hover:bg-white/70'
                }`}
              >
                <div style={{ backgroundColor: c.color }} className="w-3.5 h-3.5 rounded-full border border-black/10" />
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Optional Custom Note */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold">Add an optional message or detail...</label>
          <textarea
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="e.g. 'I want to apologize to my sister after an argument' or 'Make it feel warm and sunny'"
            className="w-full p-2.5 rounded-xl border border-black/5 bg-white/40 hover:bg-white/70 focus:bg-white focus:outline-[#BC8A70] placeholder-gray-400 min-h-[60px] resize-none font-sans"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-3 bg-[#BC8A70] hover:bg-[#A87961] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Elara is arranging...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#FFF]" />
              <span>Generate AI Bouquet</span>
            </>
          )}
        </button>

      </form>

      {/* Elara Explanation dialogue popover */}
      {elaraExplanation && (
        <div className="mt-4 p-4 rounded-2xl bg-[#FFF3F5] border border-[#F3C6CF] text-xs text-[#4A2D33] space-y-2 relative animate-sway-medium">
          <button
            onClick={() => setElaraExplanation(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-black font-bold"
          >
            ✕
          </button>
          <div className="font-serif font-bold text-[#BC8A70] uppercase tracking-wider text-[10px] flex items-center gap-1">
            🌸 Elara's Dialogue
          </div>
          <p className="leading-relaxed font-sans">{elaraExplanation}</p>
        </div>
      )}

    </div>
  );
}
