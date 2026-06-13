'use client';

import React, { useState, useRef } from 'react';
import { Mail, MailOpen, Edit, Eye, Type, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CardData {
  category: string;
  title: string;
  message: string;
  font: 'serif' | 'sans' | 'script' | 'mono';
  color: string;
  stickers: string[];
  photoBase64: string | null;
}

interface GreetingCardCreatorProps {
  cardData: CardData;
  setCardData: React.Dispatch<React.SetStateAction<CardData>>;
}

export default function GreetingCardCreator({ cardData, setCardData }: GreetingCardCreatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cardCategories = [
    { id: 'birthday', label: '🎂 Birthday' },
    { id: 'anniversary', label: '💍 Anniversary' },
    { id: 'apology', label: '🙏 Apology' },
    { id: 'friendship', label: '🤝 Friendship' },
    { id: 'love', label: '💌 Love Letter' },
    { id: 'thanks', label: '💖 Thank You' },
    { id: 'custom', label: '✏️ Custom' }
  ];

  const fontOptions = [
    { id: 'serif', label: 'Playfair Serif', className: 'font-serif' },
    { id: 'sans', label: 'Outfit Sans', className: 'font-sans' },
    { id: 'script', label: 'Calligraphy Cursive', className: 'font-cursive italic' },
    { id: 'mono', label: 'Typewriter Mono', className: 'font-mono' }
  ];

  const colorOptions = [
    { name: 'Cream Silk', hex: '#FFFDF9' },
    { name: 'Blush Satin', hex: '#FFF0F2' },
    { name: 'Lavender Mist', hex: '#F4EFFF' },
    { name: 'Sage Leaf', hex: '#F2F8F4' },
    { name: 'Champagne Gold', x: '#FDF9F0', hex: '#FDF9F0' }
  ];

  const decorativeStickers = ['🌸', '🌹', '✨', '🦋', '💖', '🍃', '🕊️', '💐'];

  // Compresses image to fit inside URL parameter limit
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 120; // compact thumbnail to prevent long URLs
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
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6); // medium quality JPEG
          setCardData(prev => ({ ...prev, photoBase64: compressedBase64 }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAddField = (field: keyof CardData, value: any) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSticker = (sticker: string) => {
    setCardData(prev => {
      const hasSticker = prev.stickers.includes(sticker);
      return {
        ...prev,
        stickers: hasSticker 
          ? prev.stickers.filter(s => s !== sticker) 
          : [...prev.stickers, sticker]
      };
    });
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 select-none">
      
      {/* 1. Left Column: Control Panel */}
      <div className="md:col-span-5 space-y-4">
        <div className="pb-3 border-b border-black/5">
          <h4 className="font-serif font-bold text-lg text-[#4A2D33]">Greeting Card</h4>
          <p className="text-[11px] text-[#4A2D33]/60">Customize an unfolding card to attach to your bouquet.</p>
        </div>

        {/* Edit/Preview Mode Buttons */}
        <div className="flex gap-2 p-1 bg-black/5 rounded-xl">
          <button
            onClick={() => setIsEditing(true)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 focus:outline-none ${
              isEditing ? 'bg-white text-[#4A2D33] shadow-xs' : 'text-[#4A2D33]/60'
            }`}
          >
            <Edit className="w-3.5 h-3.5" /> Edit Card
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setIsOpen(true);
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 focus:outline-none ${
              !isEditing ? 'bg-white text-[#4A2D33] shadow-xs' : 'text-[#4A2D33]/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Live Envelope
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-3.5 text-xs text-[#4A2D33]">
            {/* Category selection */}
            <div className="flex flex-col gap-1">
              <span className="font-bold">Card Theme</span>
              <div className="flex flex-wrap gap-1.5">
                {cardCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleAddField('category', cat.id)}
                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] transition-all focus:outline-none ${
                      cardData.category === cat.id
                        ? 'border-[#BC8A70] bg-[#BC8A70]/10 font-semibold'
                        : 'border-transparent bg-white/40 hover:bg-white/70'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1">
              <span className="font-bold">Card Title</span>
              <input
                type="text"
                value={cardData.title}
                onChange={(e) => handleAddField('title', e.target.value)}
                placeholder="e.g. Happy Birthday, Mom!"
                className="w-full p-2 rounded-xl border border-black/5 bg-white/40 focus:bg-white focus:outline-[#BC8A70]"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1">
              <span className="font-bold">Message Text</span>
              <textarea
                value={cardData.message}
                onChange={(e) => handleAddField('message', e.target.value)}
                placeholder="Write your heartfelt note..."
                className="w-full p-2.5 rounded-xl border border-black/5 bg-white/40 focus:bg-white focus:outline-[#BC8A70] min-h-[90px] resize-none font-sans"
              />
            </div>

            {/* Font choice */}
            <div className="flex flex-col gap-1">
              <span className="font-bold">Letter Font</span>
              <div className="grid grid-cols-2 gap-1.5">
                {fontOptions.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => handleAddField('font', font.id)}
                    className={`py-1.5 rounded-lg border text-left px-2 flex items-center gap-1.5 focus:outline-none ${
                      cardData.font === font.id
                        ? 'border-[#BC8A70] bg-[#BC8A70]/10 font-semibold'
                        : 'border-transparent bg-white/40 hover:bg-white/70'
                    }`}
                  >
                    <Type className="w-3.5 h-3.5 opacity-60" />
                    <span className={font.className}>{font.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Color */}
            <div className="flex flex-col gap-1">
              <span className="font-bold">Card Backdrop Color</span>
              <div className="flex gap-2">
                {colorOptions.map((col) => (
                  <button
                    key={col.hex}
                    onClick={() => handleAddField('color', col.hex)}
                    style={{ backgroundColor: col.hex }}
                    className={`w-6 h-6 rounded-full border border-black/10 transition-transform relative ${
                      cardData.color === col.hex ? 'scale-120 ring-1 ring-[#BC8A70]' : 'hover:scale-110'
                    }`}
                    title={col.name}
                  >
                    {cardData.color === col.hex && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-xs text-[#BC8A70]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Polaroid image attach */}
            <div className="flex flex-col gap-1">
              <span className="font-bold">Attach Polaroid Photo</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 bg-[#BC8A70]/10 hover:bg-[#BC8A70]/20 text-[#BC8A70] font-bold rounded-xl flex items-center gap-1.5 transition-colors focus:outline-none cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" />
                  Upload Memory Photo
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                {cardData.photoBase64 && (
                  <button
                    type="button"
                    onClick={() => handleAddField('photoBase64', null)}
                    className="text-red-500 hover:underline text-[10px] font-semibold"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>

            {/* Sticker Tray */}
            <div className="flex flex-col gap-1">
              <span className="font-bold">Decorative Stickers</span>
              <div className="flex gap-2 flex-wrap">
                {decorativeStickers.map((sticker) => {
                  const selected = cardData.stickers.includes(sticker);
                  return (
                    <button
                      key={sticker}
                      type="button"
                      onClick={() => toggleSticker(sticker)}
                      className={`text-xl p-1 rounded-lg transition-transform ${
                        selected ? 'bg-[#BC8A70]/15 scale-125 border border-[#BC8A70]/30' : 'hover:scale-115'
                      }`}
                    >
                      {sticker}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          <div className="text-xs text-[#4A2D33]/70 space-y-3 pt-3">
            <p>
              📬 Click the envelope in the preview area to see the unfolding opening animations.
            </p>
            <p>
              Your attached polaroid, customized script fonts, and flower stickers are fully configured. Return to edit to modify contents.
            </p>
          </div>
        )}
      </div>

      {/* 2. Right Column: Beautiful Envelope/Card Interactive Rendering */}
      <div className="md:col-span-7 flex flex-col items-center justify-center p-6 bg-radial from-white/10 to-transparent rounded-3xl min-h-[400px]">
        
        {/* Animated Envelope Group */}
        <div className="w-full max-w-[320px] aspect-[4/3] relative flex items-center justify-center">
          
          <AnimatePresence mode="wait">
            {!isOpen ? (
              /* Closed Envelope View */
              <button
                onClick={() => setIsOpen(true)}
                className="w-full h-[180px] bg-[#FAF8F5] rounded-xl shadow-lg border border-black/5 relative overflow-hidden flex flex-col items-center justify-center gap-2 hover:scale-103 transition-transform focus:outline-none group cursor-pointer"
              >
                {/* Triangular top fold line representation */}
                <div className="absolute top-0 inset-x-0 h-[80px] bg-[#EFECE6]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
                
                <Mail className="w-8 h-8 text-[#BC8A70] group-hover:animate-bounce mt-8" />
                <span className="font-serif font-bold text-sm text-[#4A2D33]">Open Envelope</span>
                <span className="text-[10px] text-gray-400">Recipient: Someone Special</span>
              </button>
            ) : (
              /* Opened Envelope & Unfolded Card View */
              <div className="w-full flex flex-col items-center relative">
                
                {/* Envelope Backplate behind card */}
                <div className="w-full h-[100px] bg-[#FAF8F5] border border-black/5 shadow-inner absolute top-[40px] rounded-t-xl z-0 overflow-hidden">
                  <div className="w-full h-full bg-[#EFECE6]" style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 0)' }} />
                </div>

                {/* Card Unfolding out of Envelope */}
                <div
                  style={{ backgroundColor: cardData.color }}
                  className={`w-[260px] p-5 rounded-2xl shadow-xl border border-white/80 z-10 min-h-[300px] flex flex-col justify-between relative transform -translate-y-4 transition-all duration-700 animate-glow`}
                >
                  {/* Attached Polaroid Thumbnail */}
                  {cardData.photoBase64 && (
                    <div className="absolute -top-6 -right-6 bg-white p-1 pb-4 rotate-12 shadow-md border border-gray-100 rounded-sm">
                      <img
                        src={cardData.photoBase64}
                        alt="Memory Thumbnail"
                        className="w-[70px] h-[70px] object-cover grayscale-30"
                      />
                      <div className="text-[7px] text-center text-gray-500 font-mono mt-1">❤ Memory</div>
                    </div>
                  )}

                  {/* Stamp Sticker Tray */}
                  <div className="absolute bottom-3 right-3 flex gap-0.5">
                    {cardData.stickers.map((sticker) => (
                      <span key={sticker} className="text-lg animate-pulse">{sticker}</span>
                    ))}
                  </div>

                  {/* Card Content */}
                  <div>
                    {/* Tiny header stamp */}
                    <div className="text-[9px] font-bold text-[#BC8A70] uppercase tracking-widest mb-3 flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-[#E6C587]" />
                      BloomCraft Story Letter
                    </div>

                    <h5 className={`text-base font-bold text-[#4A2D33] ${
                      cardData.font === 'serif' ? 'font-serif' :
                      cardData.font === 'script' ? 'font-cursive italic' :
                      cardData.font === 'mono' ? 'font-mono' : 'font-sans'
                    }`}>
                      {cardData.title || 'Dear You,'}
                    </h5>

                    <p className={`text-xs text-[#4A2D33]/85 leading-relaxed mt-2.5 whitespace-pre-line ${
                      cardData.font === 'serif' ? 'font-serif' :
                      cardData.font === 'script' ? 'font-cursive italic text-sm' :
                      cardData.font === 'mono' ? 'font-mono' : 'font-sans'
                    }`}>
                      {cardData.message || 'Every bloom holds a note. Craft yours here.'}
                    </p>
                  </div>

                  <div className="border-t border-black/5 pt-2 mt-4 text-[9px] text-right text-gray-400 font-serif">
                    With sincere wishes
                  </div>
                </div>

                {/* Close Envelope Trigger */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-6 text-xs text-[#BC8A70] hover:underline flex items-center gap-1 focus:outline-none"
                >
                  <MailOpen className="w-3.5 h-3.5" /> Pack into Envelope
                </button>
              </div>
            )}
          </AnimatePresence>

        </div>
      </div>

    </div>
  );
}
