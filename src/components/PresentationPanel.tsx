'use client';

import React from 'react';
import { Eye, Shield, Sparkles } from 'lucide-react';

export type ScenerySetting = 'hands' | 'marble' | 'florist' | 'giftbox' | 'romantic';

interface PresentationPanelProps {
  activeSetting: ScenerySetting;
  onSettingChange: (setting: ScenerySetting) => void;
}

export default function PresentationPanel({
  activeSetting,
  onSettingChange,
}: PresentationPanelProps) {
  
  const settings = [
    {
      id: 'hands' as const,
      label: 'Elegant Hands',
      emoji: '🙌',
      desc: 'Bouquet held in delicate linen sleeves.',
      backdropClass: 'bg-gradient-to-t from-bloom-blush/60 via-white/80 to-transparent',
    },
    {
      id: 'marble' as const,
      label: 'Marble Tabletop',
      emoji: '🏺',
      desc: 'Set on polished Carrara marble with soft shadows.',
      backdropClass: 'bg-radial from-[#F5F4F0] via-[#E2E1DC] to-[#C9C8C2]',
    },
    {
      id: 'florist' as const,
      label: 'Florist Display',
      emoji: '🏛️',
      desc: 'Placed in an archival wooden display cupboard.',
      backdropClass: 'bg-[#2E3B33] text-white',
    },
    {
      id: 'giftbox' as const,
      label: 'Gift Box Case',
      emoji: '🎁',
      desc: 'Laid flat inside a premium luxury cardboard box.',
      backdropClass: 'bg-gradient-to-b from-[#FAF8F5] via-[#ECE7DF] to-[#D5CDBD]',
    },
    {
      id: 'romantic' as const,
      label: 'Candlelight Glow',
      emoji: '🕯️',
      desc: 'Bathed in warm, flickering golden candlelight.',
      backdropClass: 'bg-radial from-[#FFFAF0] via-[#E7D6C0] to-[#2E2018]',
    }
  ];

  return (
    <div className="w-full glass-card p-5 rounded-3xl border border-white/60 select-none">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-black/5">
        <div className="w-7 h-7 rounded-full bg-[#BC8A70]/10 flex items-center justify-center text-[#BC8A70]">
          <Eye className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-serif font-bold text-sm text-[#4A2D33]">Presentation Setting</h4>
          <p className="text-[10px] text-[#4A2D33]/60">Change the environment backdrop to display the gift.</p>
        </div>
      </div>

      {/* Grid selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
        {settings.map((set) => (
          <button
            key={set.id}
            onClick={() => onSettingChange(set.id)}
            className={`p-3 rounded-xl border text-left transition-all focus:outline-none flex flex-col justify-between ${
              activeSetting === set.id
                ? 'border-[#BC8A70] bg-[#BC8A70]/10 font-semibold shadow-xs'
                : 'border-black/5 bg-white/40 hover:bg-white/70'
            }`}
          >
            <div className="text-xl mb-1.5">{set.emoji}</div>
            <div>
              <h5 className="text-[11px] font-bold text-[#4A2D33]">{set.label}</h5>
              <p className="text-[9px] text-[#4A2D33]/50 font-normal leading-tight mt-0.5">{set.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
export function getSceneryBackdrop(setting: ScenerySetting): string {
  switch (setting) {
    case 'hands':
      return 'bg-gradient-to-t from-bloom-blush/60 via-white/80 to-transparent';
    case 'marble':
      return 'bg-[#FFFDFC] bg-silk-pattern shadow-inner';
    case 'florist':
      return 'bg-[#273B30] border-y-8 border-[#3A2A1A]';
    case 'giftbox':
      return 'bg-gradient-to-b from-[#FFFDF9] to-[#EDE5D3] ring-16 ring-inset ring-[#C7B594]/30';
    case 'romantic':
      return 'bg-[#1D1616] bg-gradient-to-t from-[#2C1919] via-[#1D1616] to-[#0D0A0A]';
    default:
      return 'bg-transparent';
  }
}
