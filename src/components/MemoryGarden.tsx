'use client';

import React, { useState, useRef } from 'react';
import { Calendar, Heart, BookOpen, Image as ImageIcon, Trash2, Plus, Sparkles } from 'lucide-react';

export interface MemoryItem {
  id: string;
  date: string;
  caption: string;
  story: string;
  photoBase64: string | null;
}

interface MemoryGardenProps {
  memories: MemoryItem[];
  setMemories: React.Dispatch<React.SetStateAction<MemoryItem[]>>;
  isInteractive?: boolean;
}

export default function MemoryGarden({
  memories,
  setMemories,
  isInteractive = true,
}: MemoryGardenProps) {
  const [viewMode, setViewMode] = useState<'wall' | 'timeline'>('wall');
  const [newCaption, setNewCaption] = useState('');
  const [newStory, setNewStory] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newPhoto, setNewPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 120;
        const MAX_HEIGHT = 120;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.6);
          setNewPhoto(compressed);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaption || !newDate) return;

    const newItem: MemoryItem = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: newDate,
      caption: newCaption,
      story: newStory,
      photoBase64: newPhoto,
    };

    setMemories(prev => [...prev, newItem]);
    
    // Clear inputs
    setNewCaption('');
    setNewStory('');
    setNewDate('');
    setNewPhoto(null);
  };

  const removeMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="w-full space-y-6 select-none">
      
      {/* Tab Switcher & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-black/5">
        <div>
          <h4 className="font-serif font-bold text-lg text-[#4A2D33]">Memory Garden</h4>
          <p className="text-[11px] text-[#4A2D33]/60">Attach precious dates and snapshots to this gift.</p>
        </div>

        <div className="flex gap-1.5 p-1 bg-black/5 rounded-xl text-xs">
          <button
            onClick={() => setViewMode('wall')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all focus:outline-none ${
              viewMode === 'wall' ? 'bg-white text-[#4A2D33] shadow-xs' : 'text-[#4A2D33]/60'
            }`}
          >
            Polaroid Scrapbook Wall
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all focus:outline-none ${
              viewMode === 'timeline' ? 'bg-white text-[#4A2D33] shadow-xs' : 'text-[#4A2D33]/60'
            }`}
          >
            Floral Timeline Garden
          </button>
        </div>
      </div>

      {/* Adding Memory Form (Only in builder mode) */}
      {isInteractive && (
        <form onSubmit={handleAddMemory} className="glass-card p-4 rounded-2xl border border-white/60 text-xs text-[#4A2D33] grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          
          <div className="flex flex-col gap-1">
            <span className="font-bold">Important Date</span>
            <input
              type="date"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="p-2.5 rounded-xl border border-black/5 bg-white/40 focus:bg-white focus:outline-[#BC8A70] w-full"
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-bold">Caption</span>
            <input
              type="text"
              required
              placeholder="e.g. Our First Date"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              className="p-2.5 rounded-xl border border-black/5 bg-white/40 focus:bg-white focus:outline-[#BC8A70] w-full"
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-bold">Short Story / Description</span>
            <input
              type="text"
              placeholder="e.g. Walking under cherry blossoms..."
              value={newStory}
              onChange={(e) => setNewStory(e.target.value)}
              className="p-2.5 rounded-xl border border-black/5 bg-white/40 focus:bg-white focus:outline-[#BC8A70] w-full"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-[#BC8A70]/10 hover:bg-[#BC8A70]/20 text-[#BC8A70] font-bold rounded-xl flex items-center gap-1.5 transition-colors focus:outline-none cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Upload Photo
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              className="hidden"
            />
            {newPhoto ? (
              <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                ✓ Photo Ready
              </span>
            ) : (
              <span className="text-[10px] text-gray-400 italic">No image attached</span>
            )}
          </div>

          <button
            type="submit"
            className="py-2.5 bg-[#BC8A70] hover:bg-[#A87961] text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Memory
          </button>
        </form>
      )}

      {/* RENDER MODES */}
      
      {/* Mode A: Polaroid Memory Wall (Pinterest Scrapbook style) */}
      {viewMode === 'wall' && (
        <div className="w-full min-h-[200px]">
          {memories.length === 0 ? (
            <div className="text-center py-12 text-[#4A2D33]/50 italic text-xs">
              No memories added yet. Share some romantic timestamps or notes.
            </div>
          ) : (
            <div className="flex flex-wrap gap-6 justify-center items-center py-4">
              {memories.map((mem, index) => {
                // Alternating rotations for scrapbook feel
                const rotation = (index % 3 === 0) ? '-3deg' : (index % 3 === 1) ? '3deg' : '-1deg';
                const scale = 0.95 + (index % 3) * 0.02;

                return (
                  <div
                    key={mem.id}
                    style={{ transform: `rotate(${rotation}) scale(${scale})` }}
                    className="w-[160px] bg-[#FAF8F5] p-2.5 pb-5 rounded-sm shadow-md border border-black/5 hover:scale-105 hover:rotate-0 hover:z-20 hover:shadow-xl transition-all duration-300 relative group"
                  >
                    {/* Tiny floral tape on top */}
                    <div className="absolute top-[-8px] left-[35%] w-[50px] h-[16px] bg-bloom-blush-dark/30 border-x border-dashed border-[#F3C6CF] rotate-2 opacity-80" />

                    {/* Image Area */}
                    <div className="w-full aspect-square bg-gray-100 rounded-xs overflow-hidden flex items-center justify-center border border-black/5">
                      {mem.photoBase64 ? (
                        <img
                          src={mem.photoBase64}
                          alt={mem.caption}
                          className="w-full h-full object-cover filter sepia-10"
                        />
                      ) : (
                        <div className="text-center flex flex-col items-center gap-1 opacity-40">
                          <Heart className="w-6 h-6 text-[#BC8A70]" />
                          <span className="text-[8px] font-bold">L O V E</span>
                        </div>
                      )}
                    </div>

                    {/* Caption / Handwriting font style */}
                    <div className="mt-3.5 text-center">
                      <h5 className="font-serif italic font-bold text-xs text-[#4A2D33] tracking-wide truncate">
                        {mem.caption}
                      </h5>
                      <span className="text-[9px] text-[#BC8A70] font-mono mt-1 block">
                        {mem.date}
                      </span>
                      {mem.story && (
                        <p className="text-[9px] text-[#4A2D33]/70 font-sans mt-1.5 leading-relaxed border-t border-black/5 pt-1.5">
                          {mem.story}
                        </p>
                      )}
                    </div>

                    {/* Delete item button */}
                    {isInteractive && (
                      <button
                        onClick={() => removeMemory(mem.id)}
                        className="absolute bottom-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                        title="Remove memory"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Mode B: Vertical Floral Timeline */}
      {viewMode === 'timeline' && (
        <div className="w-full max-w-[500px] mx-auto py-4">
          {memories.length === 0 ? (
            <div className="text-center py-12 text-[#4A2D33]/50 italic text-xs">
              No memories added yet. Share some romantic timestamps or notes.
            </div>
          ) : (
            <div className="relative border-l-2 border-dashed border-[#ADCBB5] pl-6 ml-4 space-y-6">
              
              {memories.map((mem) => (
                <div key={mem.id} className="relative group">
                  
                  {/* Vine leaf indicator on line */}
                  <div className="absolute left-[-31px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#FFF] border-2 border-[#ADCBB5] flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-[#BC8A70]" />
                  </div>

                  {/* Leaf vine ornament decorations */}
                  <span className="absolute left-[-42px] top-[28px] text-[10px] opacity-75">🍃</span>

                  {/* Timeline Entry */}
                  <div className="glass-card p-4 rounded-2xl border border-white/50 relative hover:border-[#BC8A70]/40 transition-colors">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-1.5 text-[#BC8A70] font-mono text-[10px] font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        {mem.date}
                      </div>
                      
                      {isInteractive && (
                        <button
                          onClick={() => removeMemory(mem.id)}
                          className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <h5 className="font-serif font-bold text-sm text-[#4A2D33] mt-1.5">
                      {mem.caption}
                    </h5>

                    <p className="text-xs text-[#4A2D33]/70 leading-relaxed mt-1.5">
                      {mem.story}
                    </p>

                    {/* Small preview photo inside timeline */}
                    {mem.photoBase64 && (
                      <div className="mt-3 w-[80px] aspect-square rounded-lg overflow-hidden border border-black/5 shadow-xs">
                        <img
                          src={mem.photoBase64}
                          alt={mem.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                </div>
              ))}

            </div>
          )}
        </div>
      )}

    </div>
  );
}
