'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Move, Sliders, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { FlowerData, FlowerColor } from '@/data/flowers';
import { WrapOption, RibbonOption } from '@/data/themes';

export interface StemInstance {
  id: string;
  flower: FlowerData;
  colorIndex: number;
  x: number; // Offset from center (px)
  y: number; // Offset from vertical anchor (px)
  angle: number; // Rotation (degrees)
  heightScale: number; // Height scale (0.6 to 1.4)
  zIndex: number;
}

interface BouquetCanvasProps {
  stems: StemInstance[];
  setStems: React.Dispatch<React.SetStateAction<StemInstance[]>>;
  selectedWrap: WrapOption;
  selectedRibbon: RibbonOption;
  isInteractive?: boolean;
}

export default function BouquetCanvas({
  stems,
  setStems,
  selectedWrap,
  selectedRibbon,
  isInteractive = true,
}: BouquetCanvasProps) {
  const [selectedStemId, setSelectedStemId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const stemStartPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-arrange stems if they are added without coordinates
  useEffect(() => {
    let changed = false;
    const arrangedStems = stems.map((stem, index) => {
      if (stem.x === 0 && stem.y === 0 && stem.angle === 0 && stem.heightScale === 1) {
        changed = true;
        // Arrangement engine based on flower role
        let targetX = 0;
        let targetY = 0;
        let targetAngle = 0;
        let heightScale = 1.0;
        let zIndex = 10;

        const count = stems.length;
        const spread = 70; // spread radius

        if (stem.flower.type === 'greenery') {
          // Greenery frames the back, taller and wider
          const side = index % 2 === 0 ? -1 : 1;
          targetX = side * (30 + Math.random() * 40);
          targetY = -80 - Math.random() * 40;
          targetAngle = side * (15 + Math.random() * 15);
          heightScale = 1.1 + Math.random() * 0.2;
          zIndex = 2; // behind main flowers
        } else if (stem.flower.type === 'filler') {
          // Fillers go in between, medium height
          const angleRad = (Math.PI / 180) * ( -120 + (index / (count || 1)) * 60 );
          targetX = Math.cos(angleRad) * (50 + Math.random() * 30);
          targetY = Math.sin(angleRad) * 60 - 40;
          targetAngle = (index % 2 === 0 ? -1 : 1) * (5 + Math.random() * 10);
          heightScale = 0.9 + Math.random() * 0.15;
          zIndex = 5;
        } else {
          // Main flowers in center, focal, slightly staggered heights
          const offsetAngle = -90 + (index - count / 2) * (50 / Math.max(1, count / 2));
          const angleRad = (Math.PI / 180) * offsetAngle;
          targetX = Math.cos(angleRad) * (20 + Math.random() * 30);
          targetY = Math.sin(angleRad) * 40 - 20;
          targetAngle = offsetAngle + 90 + (Math.random() * 10 - 5);
          heightScale = 0.85 + Math.random() * 0.15;
          zIndex = 10; // foreground
        }

        return {
          ...stem,
          x: Math.round(targetX),
          y: Math.round(targetY),
          angle: Math.round(targetAngle),
          heightScale: parseFloat(heightScale.toFixed(2)),
          zIndex
        };
      }
      return stem;
    });

    if (changed) {
      setStems(arrangedStems);
    }
  }, [stems.length]);

  const handleMouseDown = (e: React.MouseEvent, stemId: string) => {
    if (!isInteractive) return;
    e.stopPropagation();
    setSelectedStemId(stemId);
    setIsDragging(true);
    
    const stem = stems.find(s => s.id === stemId);
    if (stem) {
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      stemStartPos.current = { x: stem.x, y: stem.y };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !selectedStemId || !isInteractive) return;

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;

    setStems(prevStems =>
      prevStems.map(stem =>
        stem.id === selectedStemId
          ? {
              ...stem,
              x: Math.max(-150, Math.min(150, stemStartPos.current.x + dx)),
              // Limit vertical motion so stems stay in container
              y: Math.max(-250, Math.min(50, stemStartPos.current.y + dy)),
            }
          : stem
      )
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, selectedStemId]);

  // Adjust parameters of selected stem
  const adjustSelectedStem = (field: 'angle' | 'heightScale' | 'zIndex', value: number) => {
    if (!selectedStemId) return;
    setStems(prevStems =>
      prevStems.map(stem =>
        stem.id === selectedStemId
          ? { ...stem, [field]: value }
          : stem
      )
    );
  };

  const removeSelectedStem = () => {
    if (!selectedStemId) return;
    setStems(prev => prev.filter(s => s.id !== selectedStemId));
    setSelectedStemId(null);
  };

  const selectedStem = stems.find(s => s.id === selectedStemId);

  // Render vector details for each flower species
  const renderFlowerHead = (flower: FlowerData, activeColor: FlowerColor, size: number) => {
    const pColor = activeColor.petalHex;
    const aColor = activeColor.accentHex;
    
    switch (flower.id) {
      case 'rose':
        return (
          <g className="origin-center animate-sway-slow">
            {/* Outer Petals */}
            <circle cx="0" cy="0" r={size * 0.45} fill={aColor} opacity="0.8" />
            <circle cx="-5" cy="-5" r={size * 0.3} fill={pColor} />
            <circle cx="5" cy="-5" r={size * 0.3} fill={pColor} />
            <circle cx="0" cy="8" r={size * 0.3} fill={pColor} />
            {/* Mid Petals */}
            <path d={`M -8 -2 C -15 -10, -5 -18, 5 -12`} fill="none" stroke={aColor} strokeWidth="2" />
            <path d={`M 8 -2 C 15 -10, 5 -18, -5 -12`} fill="none" stroke={aColor} strokeWidth="2" />
            {/* Center Swirl */}
            <circle cx="0" cy="-2" r={size * 0.15} fill={aColor} />
            <path d="M -2 -2 A 2 2 0 1 1 2 -2" fill="none" stroke="#FFF" strokeWidth="1.5" />
          </g>
        );
      case 'peony':
        return (
          <g className="origin-center animate-sway-slow">
            {/* Fluffy peony layer */}
            {Array.from({ length: 8 }).map((_, i) => (
              <circle
                key={i}
                cx={Math.cos((i * Math.PI) / 4) * (size * 0.22)}
                cy={Math.sin((i * Math.PI) / 4) * (size * 0.22)}
                r={size * 0.3}
                fill={pColor}
                opacity="0.9"
              />
            ))}
            <circle cx="0" cy="0" r={size * 0.35} fill={pColor} />
            {/* Inner detailed folds */}
            {Array.from({ length: 5 }).map((_, i) => (
              <path
                key={i}
                d={`M -5 5 Q 0 -8 5 5`}
                fill={aColor}
                opacity="0.3"
                transform={`rotate(${i * 72})`}
              />
            ))}
            {/* Golden stamens in the center */}
            <circle cx="0" cy="0" r={size * 0.12} fill="#FAD02C" />
            <circle cx="0" cy="0" r="3" fill="#FFF" />
          </g>
        );
      case 'ranunculus':
        return (
          <g className="origin-center animate-sway-slow">
            {/* Many concentric rings */}
            <circle cx="0" cy="0" r={size * 0.44} fill={pColor} stroke={aColor} strokeWidth="1" />
            <circle cx="0" cy="0" r={size * 0.36} fill={pColor} stroke={aColor} strokeWidth="0.8" />
            <circle cx="0" cy="0" r={size * 0.28} fill={pColor} stroke={aColor} strokeWidth="0.8" />
            <circle cx="0" cy="0" r={size * 0.2} fill={pColor} stroke={aColor} strokeWidth="0.8" />
            <circle cx="0" cy="0" r={size * 0.12} fill="#A2D19D" /> {/* Green center bud */}
          </g>
        );
      case 'garden-rose':
        return (
          <g className="origin-center animate-sway-slow">
            <circle cx="0" cy="0" r={size * 0.46} fill={aColor} />
            {/* Ruffled quarter circles */}
            {Array.from({ length: 6 }).map((_, i) => (
              <path
                key={i}
                d={`M -8 -8 A 12 12 0 0 1 8 -8 L 0 0 Z`}
                fill={pColor}
                transform={`rotate(${i * 60})`}
                opacity="0.9"
              />
            ))}
            <circle cx="0" cy="0" r={size * 0.22} fill={pColor} stroke={aColor} strokeWidth="1.5" />
            <path d="M -3 -1 Q 0 -5 3 -1 Q 0 3 -3 -1" fill="#FFF" />
          </g>
        );
      case 'hydrangea':
        return (
          <g className="origin-center">
            {/* Cloud of mini florets */}
            <circle cx="0" cy="0" r={size * 0.52} fill={pColor} opacity="0.25" />
            {Array.from({ length: 14 }).map((_, i) => {
              const r = (i === 0) ? 0 : (size * 0.22) + (Math.random() * 8);
              const angle = (i * 360) / 13;
              const fx = Math.cos((angle * Math.PI) / 180) * r;
              const fy = Math.sin((angle * Math.PI) / 180) * r;
              return (
                <g key={i} transform={`translate(${fx}, ${fy}) scale(0.65)`}>
                  {/* 4 tiny petals */}
                  <rect x="-6" y="-6" width="6" height="6" rx="2" fill={pColor} />
                  <rect x="0" y="-6" width="6" height="6" rx="2" fill={pColor} />
                  <rect x="-6" y="0" width="6" height="6" rx="2" fill={pColor} />
                  <rect x="0" y="0" width="6" height="6" rx="2" fill={pColor} />
                  {/* Dot center */}
                  <circle cx="0" cy="0" r="1.5" fill="#FFF" />
                </g>
              );
            })}
          </g>
        );
      case 'tulip':
        return (
          <g className="origin-center">
            {/* Goblet tulip cup */}
            <path d="M -15 -18 C -18 2, -10 12, 0 12 C 10 12, 18 2, 15 -18 C 8 -10, 5 -12, 0 -3 C -5 -12, -8 -10, -15 -18 Z" fill={pColor} />
            <path d="M -8 -18 C -10 -5, 0 -3, 0 -3 C 0 -3, 10 -5, 8 -18 C 3 -12, 0 -10, 0 -10 C 0 -10, -3 -12, -8 -18 Z" fill={aColor} opacity="0.6" />
          </g>
        );
      case 'orchid':
        return (
          <g className="origin-center" transform="rotate(15)">
            {/* Back sepals */}
            <path d="M 0 -22 C -8 -12, -18 -8, -18 0 C -18 8, -8 10, 0 6" fill={pColor} opacity="0.8" />
            <path d="M 0 -22 C 8 -12, 18 -8, 18 0 C 18 8, 8 10, 0 6" fill={pColor} opacity="0.8" />
            <path d="M 0 0 C -10 18, 0 25, 0 25 C 0 25, 10 18, 0 0" fill={aColor} />
            {/* Wing petals */}
            <ellipse cx="-12" cy="-6" rx="14" ry="10" fill={pColor} transform="rotate(-15 -12 -6)" />
            <ellipse cx="12" cy="-6" rx="14" ry="10" fill={pColor} transform="rotate(15 12 -6)" />
            {/* Lip and Column center */}
            <circle cx="0" cy="-2" r="4.5" fill="#FFEB3B" />
          </g>
        );
      case 'lily':
        return (
          <g className="origin-center" transform="scale(1.1)">
            {/* 6 pointed star petals */}
            {Array.from({ length: 6 }).map((_, i) => (
              <path
                key={i}
                d="M 0 0 C -6 -12, -8 -26, 0 -32 C 8 -26, 6 -12, 0 0"
                fill={pColor}
                stroke={aColor}
                strokeWidth="0.5"
                transform={`rotate(${i * 60})`}
              />
            ))}
            {/* Long thin red/brown stamens */}
            {Array.from({ length: 4 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 90 + 45})`}>
                <line x1="0" y1="0" x2="0" y2="-20" stroke="#795548" strokeWidth="1.5" />
                <rect x="-2" y="-22" width="4" height="2" fill="#3E2723" rx="0.5" />
              </g>
            ))}
          </g>
        );
      case 'sunflower':
        return (
          <g className="origin-center">
            {/* Yellow outer petals */}
            {Array.from({ length: 24 }).map((_, i) => (
              <path
                key={i}
                d="M 0 0 C -3 -12, -5 -25, 0 -30 C 5 -25, 3 -12, 0 0"
                fill="#FFEB3B"
                transform={`rotate(${(i * 360) / 24})`}
              />
            ))}
            {/* Big brown center */}
            <circle cx="0" cy="0" r={size * 0.28} fill="#3E2723" />
            <circle cx="0" cy="0" r={size * 0.24} fill="#271206" stroke="#4E342E" strokeWidth="1" strokeDasharray="3,3" />
          </g>
        );
      case 'cherry-blossom':
        return (
          <g className="origin-center">
            {/* 5 notched petals */}
            {Array.from({ length: 5 }).map((_, i) => (
              <path
                key={i}
                d="M 0 0 C -8 -8, -10 -18, -4 -20 C 0 -21, 0 -18, 0 -18 C 0 -18, 0 -21, 4 -20 C 10 -18, 8 -8, 0 0"
                fill={pColor}
                stroke={aColor}
                strokeWidth="0.5"
                transform={`rotate(${(i * 360) / 5})`}
              />
            ))}
            {/* Center pistils */}
            <circle cx="0" cy="0" r="3.5" fill="#E6C587" />
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1="0"
                x2={Math.cos((i * Math.PI) / 4) * 8}
                y2={Math.sin((i * Math.PI) / 4) * 8}
                stroke="#FF69B4"
                strokeWidth="0.8"
              />
            ))}
          </g>
        );

      // Fillers
      case 'babys-breath':
        return (
          <g className="origin-center animate-sway-fast">
            {/* Clouds of tiny dots */}
            <line x1="0" y1="0" x2="-12" y2="-12" stroke="#ADCBB5" strokeWidth="1" />
            <line x1="0" y1="0" x2="12" y2="-12" stroke="#ADCBB5" strokeWidth="1" />
            <line x1="-12" y1="-12" x2="-20" y2="-20" stroke="#ADCBB5" strokeWidth="0.8" />
            <line x1="12" y1="-12" x2="20" y2="-20" stroke="#ADCBB5" strokeWidth="0.8" />
            
            {/* Little white flower clusters */}
            <circle cx="-12" cy="-12" r="4.5" fill="#FFF" stroke="#DDD" strokeWidth="0.5" />
            <circle cx="-20" cy="-20" r="3.5" fill="#FFF" />
            <circle cx="12" cy="-12" r="4.5" fill="#FFF" stroke="#DDD" strokeWidth="0.5" />
            <circle cx="20" cy="-20" r="3.5" fill="#FFF" />
            <circle cx="0" cy="-8" r="4" fill="#FFF" />
          </g>
        );
      case 'wax-flower':
        return (
          <g className="origin-center animate-sway-medium">
            <line x1="0" y1="0" x2="-8" y2="-15" stroke="#ADCBB5" strokeWidth="1.2" />
            <line x1="0" y1="0" x2="8" y2="-15" stroke="#ADCBB5" strokeWidth="1.2" />
            {/* 5 petal star flowers */}
            {[-8, 8].map((ox, index) => (
              <g key={index} transform={`translate(${ox}, -15) scale(0.65)`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <circle
                    key={i}
                    cx={Math.cos((i * 2 * Math.PI) / 5) * 6}
                    cy={Math.sin((i * 2 * Math.PI) / 5) * 6}
                    r="4"
                    fill={pColor}
                  />
                ))}
                <circle cx="0" cy="0" r="3" fill="#8B0000" /> {/* Dark waxy center */}
              </g>
            ))}
          </g>
        );
      case 'statice':
        return (
          <g className="origin-center animate-sway-medium">
            <path d="M 0 0 Q -5 -15 -10 -25" fill="none" stroke="#8EA7A0" strokeWidth="1.5" />
            {/* Alternating paper wings */}
            {Array.from({ length: 6 }).map((_, i) => (
              <g key={i} transform={`translate(${-i * 1.8}, ${-5 - i * 3})`}>
                <path d="M 0 0 C -5 -1, -8 -5, -4 -8 C 0 -10, 2 -5, 0 0" fill={pColor} />
                <circle cx="-2" cy="-5" r="1.5" fill="#FFF" />
              </g>
            ))}
          </g>
        );

      // Greenery
      case 'eucalyptus':
        return (
          <g className="origin-center">
            {/* Long main stem */}
            <path d="M 0 20 L 0 -45" fill="none" stroke="#778C85" strokeWidth="2.5" />
            {/* Silvery round leaves paired */}
            {Array.from({ length: 5 }).map((_, i) => {
              const y = 10 - i * 12;
              const leafSize = 13 - i * 1.5;
              return (
                <g key={i} transform={`translate(0, ${y})`}>
                  {/* Pair left & right */}
                  <ellipse cx={-leafSize * 0.8} cy="0" rx={leafSize} ry={leafSize * 0.7} fill={pColor} stroke="#6B8079" strokeWidth="0.8" />
                  <ellipse cx={leafSize * 0.8} cy="0" rx={leafSize} ry={leafSize * 0.7} fill={pColor} stroke="#6B8079" strokeWidth="0.8" />
                </g>
              );
            })}
          </g>
        );
      case 'ruscus':
        return (
          <g className="origin-center">
            <path d="M 0 20 L 0 -50" fill="none" stroke="#22421D" strokeWidth="2" />
            {/* Tear shaped alternating leaves */}
            {Array.from({ length: 7 }).map((_, i) => {
              const y = 15 - i * 10;
              const dir = i % 2 === 0 ? -1 : 1;
              return (
                <path
                  key={i}
                  d={`M 0 0 C ${dir * 12} -4, ${dir * 18} -12, 0 -18 Z`}
                  fill={pColor}
                  transform={`translate(0, ${y})`}
                />
              );
            })}
          </g>
        );
      case 'fern':
        return (
          <g className="origin-center">
            <path d="M 0 30 L 0 -60" fill="none" stroke="#176017" strokeWidth="2" />
            {/* Feathery fronds */}
            {Array.from({ length: 9 }).map((_, i) => {
              const y = 20 - i * 8;
              const scale = (10 - i) / 10;
              return (
                <g key={i} transform={`translate(0, ${y}) scale(${scale})`}>
                  {/* Left wing */}
                  <path d="M 0 0 Q -18 -2 -25 -8 Q -10 -5 0 -2" fill={pColor} />
                  {/* Right wing */}
                  <path d="M 0 0 Q 18 -2 25 -8 Q 10 -5 0 -2" fill={pColor} />
                </g>
              );
            })}
          </g>
        );
      case 'olive':
        return (
          <g className="origin-center" transform="rotate(-10)">
            <path d="M 0 30 L 0 -55" fill="none" stroke="#5C7A1E" strokeWidth="2" />
            {/* Alternating leaves with light undersides */}
            {Array.from({ length: 6 }).map((_, i) => {
              const y = 18 - i * 11;
              const dir = i % 2 === 0 ? -1 : 1;
              return (
                <g key={i} transform={`translate(0, ${y}) rotate(${dir * 25})`}>
                  {/* Leaf Top */}
                  <path d={`M 0 0 C ${dir * 6} -12, ${dir * 6} -22, 0 -26 C ${dir * -2} -18, ${dir * -3} -8, 0 0`} fill={pColor} />
                  {/* Silvery Underside Edge */}
                  <path d={`M 0 -26 C ${dir * -1} -18, ${dir * -2} -8, 0 0`} fill="none" stroke="#E2EAD9" strokeWidth="1" />
                </g>
              );
            })}
          </g>
        );
      default:
        return <circle cx="0" cy="0" r="10" fill="#E6C587" />;
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full relative min-h-[500px]">
      
      {/* Living Arrangement Canvas */}
      <div 
        ref={containerRef}
        className="w-full max-w-[500px] h-[550px] relative overflow-hidden bg-radial from-white/10 to-transparent rounded-3xl"
      >
        {/* Living sway layer */}
        <div className="absolute w-full h-full origin-bottom animate-sway-slow flex items-center justify-center">
          
          <svg viewBox="0 0 400 500" className="w-[90%] h-[90%] drop-shadow-lg overflow-visible">
            
            {/* 1. Behind-Wrapper Layer */}
            <path
              d="M 120 450 L 50 250 L 350 250 L 280 450 Z"
              fill={`url(#wrapGrad-back)`}
              opacity="0.9"
            />
            
            {/* 2. Stems Layer */}
            <g transform="translate(200, 380)">
              {/* Natural arrangement render */}
              {stems
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((stem) => {
                  const activeColor = stem.flower.colors[stem.colorIndex] || stem.flower.colors[0];
                  const isSelected = selectedStemId === stem.id;
                  
                  return (
                    <g
                      key={stem.id}
                      transform={`translate(${stem.x}, ${stem.y}) rotate(${stem.angle}) scale(${stem.heightScale})`}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStemId(stem.id);
                      }}
                    >
                      {/* Stem path from binding center down to wrapping base */}
                      <path
                        d={`M 0 0 Q ${-stem.x / 3} ${-stem.y / 2 + 30} ${-stem.x} ${100 - stem.y}`}
                        fill="none"
                        stroke={stem.flower.type === 'greenery' ? '#4E6B15' : '#ADCBB5'}
                        strokeWidth={4 / stem.heightScale}
                        strokeLinecap="round"
                        opacity="0.8"
                      />

                      {/* Interactive Drag Handle (Flower Head Group) */}
                      <g
                        onMouseDown={(e) => handleMouseDown(e, stem.id)}
                        className={`transition-all duration-200 ${
                          isSelected ? 'filter drop-shadow-[0_0_8px_rgba(188,138,112,0.8)]' : ''
                        }`}
                      >
                        {/* Render individual detailed flower SVG */}
                        {renderFlowerHead(stem.flower, activeColor, 42 * stem.flower.defaultScale)}
                        
                        {/* Selected overlay ring */}
                        {isSelected && isInteractive && (
                          <circle
                            cx="0"
                            cy="0"
                            r="26"
                            fill="none"
                            stroke="#BC8A70"
                            strokeWidth="2.5"
                            strokeDasharray="4,4"
                            className="animate-spin"
                            style={{ animationDuration: '8s' }}
                          />
                        )}
                      </g>
                    </g>
                  );
                })}
            </g>

            {/* 3. Front Wrapping Paper Flaps */}
            <g>
              <defs>
                <linearGradient id="wrapGrad-back" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={selectedWrap.hex} />
                  <stop offset="100%" stopColor="#888" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="wrapGrad-front1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={selectedWrap.hex} />
                  <stop offset="100%" stopColor={selectedWrap.hex} stopOpacity="0.8" />
                </linearGradient>
              </defs>
              
              {/* Flared wrapping cone */}
              <path
                d="M 200 440 L 90 280 Q 200 350 310 280 L 200 440 Z"
                fill={selectedWrap.hex}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"
              />
              <path
                d="M 90 280 C 130 330, 180 370, 200 440 C 220 370, 270 330, 310 280 Z"
                fill="none"
                stroke="rgba(0,0,0,0.08)"
                strokeWidth="2.5"
              />
            </g>

            {/* 4. Elegant Tied Ribbon / Bow */}
            <g transform="translate(200, 395)">
              <defs>
                <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={selectedRibbon.hex} />
                  <stop offset="100%" stopColor="#555" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              
              {/* Ribbon Straps wrapping around */}
              <rect x="-18" y="-5" width="36" height="10" rx="3" fill={selectedRibbon.hex} stroke="rgba(255,255,255,0.2)" />

              {/* Bow Left Loop */}
              <path d="M 0 0 C -20 -15, -35 -5, -10 5 Z" fill={selectedRibbon.hex} stroke="rgba(255,255,255,0.2)" />
              {/* Bow Right Loop */}
              <path d="M 0 0 C 20 -15, 35 -5, 10 5 Z" fill={selectedRibbon.hex} stroke="rgba(255,255,255,0.2)" />

              {/* Center Knot */}
              <rect x="-6" y="-6" width="12" height="12" rx="4" fill={selectedRibbon.hex} />
              
              {/* Hanging ribbons */}
              <path d="M -4 5 Q -15 25 -8 45" fill="none" stroke={selectedRibbon.hex} strokeWidth="4" strokeLinecap="round" />
              <path d="M 4 5 Q 15 25 8 45" fill="none" stroke={selectedRibbon.hex} strokeWidth="4" strokeLinecap="round" />
            </g>

          </svg>
        </div>

        {/* Empty State Prompt */}
        {stems.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none bg-white/20 backdrop-blur-xs rounded-3xl m-4 border border-white/40">
            <span className="text-4xl mb-2">💐</span>
            <h4 className="font-serif font-semibold text-lg text-[#4A2D33]">Empty Arrangement</h4>
            <p className="text-xs text-[#4A2D33]/60 max-w-xs mt-1">
              Select flowers below to add them to your bouquet. Max 10 stems.
            </p>
          </div>
        )}
      </div>

      {/* 5. Stems Custom Adjuster Panel */}
      {selectedStem && isInteractive && (
        <div className="w-full max-w-[450px] mt-4 glass-card p-4 rounded-2xl shadow-sm border border-white/60 relative animate-sway-slow">
          <button
            onClick={() => setSelectedStemId(null)}
            className="absolute top-3 right-3 text-[#4A2D33]/50 hover:text-black font-semibold text-xs"
          >
            Clear Selection
          </button>
          
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">🌸</span>
            <div>
              <h5 className="font-serif font-bold text-sm text-[#4A2D33]">{selectedStem.flower.name}</h5>
              <p className="text-[11px] text-[#BC8A70] uppercase font-bold tracking-wider">{selectedStem.flower.meaning}</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-[#4A2D33]">
            {/* Height Slider */}
            <div className="flex items-center gap-3 justify-between">
              <span className="w-20 font-medium">Height Scale</span>
              <input
                type="range"
                min="0.6"
                max="1.4"
                step="0.05"
                value={selectedStem.heightScale}
                onChange={(e) => adjustSelectedStem('heightScale', parseFloat(e.target.value))}
                className="w-full accent-[#BC8A70]"
              />
              <span className="w-8 text-right font-mono text-[10px]">{selectedStem.heightScale}x</span>
            </div>

            {/* Rotation Slider */}
            <div className="flex items-center gap-3 justify-between">
              <span className="w-20 font-medium">Rotation</span>
              <input
                type="range"
                min="-60"
                max="60"
                step="2"
                value={selectedStem.angle}
                onChange={(e) => adjustSelectedStem('angle', parseInt(e.target.value))}
                className="w-full accent-[#BC8A70]"
              />
              <span className="w-8 text-right font-mono text-[10px]">{selectedStem.angle}°</span>
            </div>

            {/* Z-Index (Layer depth) */}
            <div className="flex items-center gap-3 justify-between">
              <span className="w-20 font-medium">Layer depth</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustSelectedStem('zIndex', Math.max(1, selectedStem.zIndex - 1))}
                  className="p-1 rounded bg-[#BC8A70]/10 hover:bg-[#BC8A70]/20 text-[#BC8A70]"
                  title="Move Back"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-xs w-6 text-center">{selectedStem.zIndex}</span>
                <button
                  onClick={() => adjustSelectedStem('zIndex', Math.min(20, selectedStem.zIndex + 1))}
                  className="p-1 rounded bg-[#BC8A70]/10 hover:bg-[#BC8A70]/20 text-[#BC8A70]"
                  title="Move Forward"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={removeSelectedStem}
                className="ml-auto py-1 px-2.5 rounded bg-red-50 hover:bg-red-100 text-red-600 flex items-center gap-1 font-medium text-[11px]"
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
