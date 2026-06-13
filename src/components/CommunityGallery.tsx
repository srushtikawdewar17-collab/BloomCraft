'use client';

import React, { useState } from 'react';
import { Heart, Compass, Sparkles, RefreshCw } from 'lucide-react';
import { FLOWERS } from '@/data/flowers';
import { THEMES, WRAPS, RIBBONS, ThemeData, WrapOption, RibbonOption } from '@/data/themes';
import { StemInstance } from './BouquetCanvas';

export interface GalleryItem {
  id: string;
  name: string;
  creator: string;
  themeId: string;
  likes: number;
  category: string;
  stems: StemInstance[];
  wrapId: string;
  ribbonId: string;
}

interface CommunityGalleryProps {
  onRemixBouquet: (item: GalleryItem) => void;
}

export default function CommunityGallery({ onRemixBouquet }: CommunityGalleryProps) {
  const [filter, setFilter] = useState('trending');
  const [likesState, setLikesState] = useState<Record<string, number>>({});
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});

  // Pre-configured elegant showcase bouquets for the gallery
  const galleryBouquets: GalleryItem[] = [
    {
      id: 'gal-1',
      name: 'Blush of Forever',
      creator: 'Sophia_Florist',
      themeId: 'romantic',
      likes: 1420,
      category: 'romantic',
      wrapId: 'blush-satin',
      ribbonId: 'velvet-ribbon',
      stems: [
        { id: '1', flower: FLOWERS[0], colorIndex: 0, x: -10, y: -20, angle: -5, heightScale: 1, zIndex: 10 }, // Rose
        { id: '2', flower: FLOWERS[0], colorIndex: 1, x: 20, y: -10, angle: 10, heightScale: 0.95, zIndex: 10 }, // Rose
        { id: '3', flower: FLOWERS[1], colorIndex: 1, x: 0, y: -45, angle: 0, heightScale: 1.05, zIndex: 9 }, // Peony
        { id: '4', flower: FLOWERS[10], colorIndex: 0, x: -35, y: -15, angle: -15, heightScale: 0.85, zIndex: 5 }, // Babys breath
        { id: '5', flower: FLOWERS[13], colorIndex: 0, x: 35, y: -40, angle: 20, heightScale: 1.15, zIndex: 2 }, // Eucalyptus
      ]
    },
    {
      id: 'gal-2',
      name: 'Golden Promise',
      creator: 'Elena_V',
      themeId: 'luxury',
      likes: 982,
      category: 'anniversary',
      wrapId: 'champagne-gold',
      ribbonId: 'double-luxury-bow',
      stems: [
        { id: '1', flower: FLOWERS[8], colorIndex: 0, x: 0, y: -30, angle: 0, heightScale: 1, zIndex: 10 }, // Sunflower
        { id: '2', flower: FLOWERS[2], colorIndex: 2, x: -25, y: -10, angle: -15, heightScale: 0.9, zIndex: 9 }, // Ranunculus
        { id: '3', flower: FLOWERS[2], colorIndex: 0, x: 25, y: -10, angle: 15, heightScale: 0.9, zIndex: 9 }, // Ranunculus
        { id: '4', flower: FLOWERS[13], colorIndex: 0, x: -45, y: -20, angle: -25, heightScale: 1.1, zIndex: 2 }, // Eucalyptus
        { id: '5', flower: FLOWERS[13], colorIndex: 0, x: 45, y: -20, angle: 25, heightScale: 1.1, zIndex: 2 }, // Eucalyptus
      ]
    },
    {
      id: 'gal-3',
      name: 'Lavender Dreams',
      creator: 'Chloe_Blossom',
      themeId: 'dreamy-pastels',
      likes: 1254,
      category: 'trending',
      wrapId: 'lavender-mist',
      ribbonId: 'organza-ribbon',
      stems: [
        { id: '1', flower: FLOWERS[4], colorIndex: 2, x: 0, y: -35, angle: 0, heightScale: 1, zIndex: 10 }, // Hydrangea
        { id: '2', flower: FLOWERS[3], colorIndex: 2, x: -20, y: -15, angle: -10, heightScale: 0.95, zIndex: 9 }, // Garden Rose
        { id: '3', flower: FLOWERS[3], colorIndex: 2, x: 20, y: -15, angle: 10, heightScale: 0.95, zIndex: 9 }, // Garden Rose
        { id: '4', flower: FLOWERS[12], colorIndex: 1, x: -35, y: -45, angle: -20, heightScale: 1.1, zIndex: 5 }, // Statice
        { id: '5', flower: FLOWERS[12], colorIndex: 1, x: 35, y: -45, angle: 20, heightScale: 1.1, zIndex: 5 }, // Statice
      ]
    },
    {
      id: 'gal-4',
      name: 'Olive & Peace',
      creator: 'Julian_M',
      themeId: 'cottagecore',
      likes: 671,
      category: 'apology',
      wrapId: 'sage-green',
      ribbonId: 'lace-ribbon',
      stems: [
        { id: '1', flower: FLOWERS[7], colorIndex: 0, x: 0, y: -25, angle: 0, heightScale: 1, zIndex: 10 }, // Lily
        { id: '2', flower: FLOWERS[7], colorIndex: 0, x: -15, y: -40, angle: -10, heightScale: 1.05, zIndex: 9 }, // Lily
        { id: '3', flower: FLOWERS[16], colorIndex: 0, x: -35, y: -50, angle: -20, heightScale: 1.2, zIndex: 2 }, // Olive
        { id: '4', flower: FLOWERS[16], colorIndex: 0, x: 35, y: -50, angle: 20, heightScale: 1.2, zIndex: 2 }, // Olive
        { id: '5', flower: FLOWERS[10], colorIndex: 0, x: 15, y: -20, angle: 10, heightScale: 0.9, zIndex: 5 }, // Babys breath
      ]
    }
  ];

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked[id]) {
      setHasLiked(prev => ({ ...prev, [id]: false }));
      setLikesState(prev => ({ ...prev, [id]: (prev[id] || 0) - 1 }));
    } else {
      setHasLiked(prev => ({ ...prev, [id]: true }));
      setLikesState(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    }
  };

  const getThemeBadgeColor = (themeId: string) => {
    const theme = THEMES.find(t => t.id === themeId);
    return theme ? theme.accentColor : '#BC8A70';
  };

  const filteredItems = galleryBouquets.filter((item) => {
    if (filter === 'trending') return true;
    return item.category === filter;
  });

  return (
    <div className="w-full select-none">
      
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-3 border-b border-black/5 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#BC8A70]/10 flex items-center justify-center text-[#BC8A70]">
            <Compass className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-lg text-[#4A2D33]">Community Gallery</h4>
            <p className="text-[11px] text-[#4A2D33]/60">Browse bouquets crafted by other floral artists and remix them.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: 'trending', label: '🔥 Trending' },
            { id: 'romantic', label: '💖 Romantic' },
            { id: 'anniversary', label: '💍 Anniversary' },
            { id: 'apology', label: '🙏 Apology' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all focus:outline-none ${
                filter === tab.id
                  ? 'bg-[#BC8A70] text-white font-semibold'
                  : 'bg-white/50 text-[#4A2D33]/60 hover:text-[#4A2D33]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry-Style Pinterest Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredItems.map((item) => {
          const likesCount = (likesState[item.id] !== undefined) ? item.likes + likesState[item.id] : item.likes;
          const liked = !!hasLiked[item.id];
          const activeTheme = THEMES.find(t => t.id === item.themeId) || THEMES[0];
          
          // Count flowers inside
          const flowerEmojis = Array.from(new Set(item.stems.map(s => s.flower.id)))
            .map(id => id === 'rose' ? '🌹' : id === 'peony' ? '🌸' : id === 'sunflower' ? '🌻' : '🌷')
            .slice(0, 3)
            .join(' ');

          return (
            <div
              key={item.id}
              className="glass-card p-4 rounded-3xl border border-white/60 flex flex-col justify-between hover:scale-102 transition-transform duration-300 relative group"
            >
              {/* Card visual showcase wrapper */}
              <div className="w-full aspect-[4/5] bg-radial from-[#F5F4F0] via-white/80 to-[#E2E1DC] rounded-2xl flex items-center justify-center p-2 relative overflow-hidden border border-black/5">
                
                {/* Tiny abstract bouquet preview representation */}
                <div className="w-[85%] h-[85%] opacity-90 scale-90 flex items-center justify-center transform translate-y-3 pointer-events-none">
                  {/* Bouquet floral mock circle */}
                  <div className="relative w-28 h-28 bg-[#BC8A70]/10 rounded-full flex items-center justify-center">
                    <span className="text-4xl absolute -top-1">💐</span>
                    <span className="absolute bottom-2 text-xs font-mono font-bold text-[#BC8A70]/60">
                      {item.stems.length} stems
                    </span>
                  </div>
                </div>

                {/* Theme Tag */}
                <span
                  style={{ backgroundColor: getThemeBadgeColor(item.themeId) + '15', color: getThemeBadgeColor(item.themeId) }}
                  className="absolute top-3 left-3 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md"
                >
                  {activeTheme.name}
                </span>

                {/* Remix Hover Action */}
                <div className="absolute inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onRemixBouquet(item)}
                    className="px-4 py-2 bg-white hover:bg-bloom-blush text-[#4A2D33] font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all scale-90 group-hover:scale-100 focus:outline-none cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Remix Design
                  </button>
                </div>
              </div>

              {/* Title & Info */}
              <div className="mt-3.5">
                <div className="flex justify-between items-start">
                  <h5 className="font-serif font-bold text-sm text-[#4A2D33] truncate w-[70%]">
                    {item.name}
                  </h5>
                  <button
                    onClick={(e) => handleLike(item.id, e)}
                    className={`flex items-center gap-1 text-[11px] focus:outline-none ${
                      liked ? 'text-red-500 font-bold' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-red-500' : ''}`} />
                    <span>{likesCount}</span>
                  </button>
                </div>

                <div className="flex justify-between items-center mt-2 pt-2 border-t border-black/5 text-[10px] text-[#4A2D33]/60">
                  <span className="truncate">by @{item.creator}</span>
                  <span>{flowerEmojis}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
