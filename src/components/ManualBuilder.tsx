'use client';

import React, { useState } from 'react';
import { FLOWERS, FlowerData, FlowerColor } from '@/data/flowers';
import { Plus, Minus, Check, HelpCircle } from 'lucide-react';

interface ManualBuilderProps {
  currentStemsCount: number;
  onAddStem: (flower: FlowerData, colorIndex: number) => void;
  onRemoveStemType: (flowerId: string) => void;
  stemsCountByFlower: Record<string, number>;
}

export default function ManualBuilder({
  currentStemsCount,
  onAddStem,
  onRemoveStemType,
  stemsCountByFlower,
}: ManualBuilderProps) {
  const [activeTab, setActiveTab] = useState<'main' | 'filler' | 'greenery'>('main');
  const [selectedColors, setSelectedColors] = useState<Record<string, number>>({});

  const filteredFlowers = FLOWERS.filter(f => f.type === activeTab);

  const handleColorSelect = (flowerId: string, colorIndex: number) => {
    setSelectedColors(prev => ({
      ...prev,
      [flowerId]: colorIndex
    }));
  };

  const handleAdd = (flower: FlowerData) => {
    if (currentStemsCount >= 10) return;
    const colorIndex = selectedColors[flower.id] || 0;
    onAddStem(flower, colorIndex);
  };

  return (
    <div className="w-full">
      {/* Header and counter */}
      <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-black/5">
        <h4 className="font-serif font-bold text-lg text-[#4A2D33]">Select Blooms</h4>
        <div className="text-xs font-semibold text-[#BC8A70] bg-[#BC8A70]/10 px-3 py-1 rounded-full">
          Arrangement Stems: {currentStemsCount} / 10
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['main', 'filler', 'greenery'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all focus:outline-none ${
              activeTab === tab
                ? 'bg-[#BC8A70] text-white shadow-xs'
                : 'bg-white/50 text-[#4A2D33]/60 hover:text-[#4A2D33] border border-white/50 hover:bg-white/80'
            }`}
          >
            {tab === 'main' ? 'Focal Blooms' : tab === 'filler' ? 'Soft Fillers' : 'Foliage & Greens'}
          </button>
        ))}
      </div>

      {/* Catalog Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
        {filteredFlowers.map((flower) => {
          const qty = stemsCountByFlower[flower.id] || 0;
          const activeColorIdx = selectedColors[flower.id] || 0;
          const activeColor = flower.colors[activeColorIdx] || flower.colors[0];

          return (
            <div
              key={flower.id}
              className={`p-4 rounded-2xl glass-card flex flex-col justify-between transition-all duration-300 ${
                qty > 0 ? 'ring-1.5 ring-[#BC8A70] bg-[#FFFDFC]/90' : 'bg-white/60'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex justify-between items-start gap-1">
                  <h5 className="font-serif font-bold text-base text-[#4A2D33]">{flower.name}</h5>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#BC8A70] bg-[#BC8A70]/10 px-2 py-0.5 rounded-md">
                    {flower.meaning}
                  </span>
                </div>
                
                <p className="text-xs text-[#4A2D33]/70 mt-1.5 leading-relaxed font-sans min-h-[48px]">
                  {flower.description}
                </p>
              </div>

              {/* Color swatches & Counter Controls */}
              <div className="mt-4 pt-3 border-t border-black/5 flex items-end justify-between">
                
                {/* Color Swatch Picker */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400">Color Variation</span>
                  <div className="flex items-center gap-1.5">
                    {flower.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleColorSelect(flower.id, idx)}
                        style={{ backgroundColor: color.hex }}
                        className={`w-4 h-4 rounded-full border border-black/10 focus:outline-none transition-transform relative ${
                          activeColorIdx === idx ? 'scale-120 ring-1 ring-[#BC8A70]' : 'hover:scale-110'
                        }`}
                        title={color.name}
                      >
                        {activeColorIdx === idx && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-[#4A2D33] mix-blend-difference" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Counter Control */}
                <div className="flex items-center gap-2">
                  {qty > 0 && (
                    <button
                      onClick={() => onRemoveStemType(flower.id)}
                      className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors focus:outline-none"
                      title="Remove 1 stem"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {qty > 0 && (
                    <span className="font-mono font-bold text-sm w-4 text-center text-[#4A2D33]">
                      {qty}
                    </span>
                  )}
                  <button
                    onClick={() => handleAdd(flower)}
                    disabled={currentStemsCount >= 10}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all focus:outline-none ${
                      currentStemsCount >= 10
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-[#BC8A70]/10 hover:bg-[#BC8A70]/20 text-[#BC8A70]'
                    }`}
                    title="Add 1 stem"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {currentStemsCount >= 10 && (
        <div className="mt-4 p-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs text-center border border-amber-200">
          Your arrangement is full (10 stems max reached). Adjust spacing and layers on the canvas, or wrap your selection!
        </div>
      )}
    </div>
  );
}
