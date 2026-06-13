'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, Heart, Share2, Clipboard, ArrowLeft, RefreshCw, Eye, BookOpen, Music, Check } from 'lucide-react';
import BackgroundEffects from '@/components/BackgroundEffects';
import ElaraGuide from '@/components/ElaraGuide';
import BouquetCanvas, { StemInstance } from '@/components/BouquetCanvas';
import ManualBuilder from '@/components/ManualBuilder';
import AIBuilder from '@/components/AIBuilder';
import GreetingCardCreator, { CardData } from '@/components/GreetingCardCreator';
import MemoryGarden, { MemoryItem } from '@/components/MemoryGarden';
import PresentationPanel, { ScenerySetting, getSceneryBackdrop } from '@/components/PresentationPanel';
import GiftReveal from '@/components/GiftReveal';
import CommunityGallery, { GalleryItem } from '@/components/CommunityGallery';
import SoundController from '@/components/SoundController';
import { THEMES, WRAPS, RIBBONS, ThemeData, WrapOption, RibbonOption } from '@/data/themes';
import { FLOWERS, FlowerData } from '@/data/flowers';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-bloom-cream text-[#4A2D33]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#BC8A70] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif italic text-sm">Opening BloomCraft Studio...</p>
        </div>
      </div>
    }>
      <BloomCraftApp />
    </Suspense>
  );
}

function BloomCraftApp() {
  // Global States
  const [appMode, setAppMode] = useState<'landing' | 'builder' | 'reveal'>('landing');
  const [builderTab, setBuilderTab] = useState<'manual' | 'ai' | 'wrap' | 'card' | 'garden'>('manual');
  
  // Bouquet States
  const [stems, setStems] = useState<StemInstance[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<ThemeData>(THEMES[0]);
  const [selectedWrap, setSelectedWrap] = useState<WrapOption>(WRAPS[0]);
  const [selectedRibbon, setSelectedRibbon] = useState<RibbonOption>(RIBBONS[0]);
  const [bouquetName, setBouquetName] = useState('Blush of Forever');
  const [scenery, setScenery] = useState<ScenerySetting>('hands');

  // Greeting Card & Memories
  const [cardData, setCardData] = useState<CardData>({
    category: 'love',
    title: 'For Someone Special',
    message: 'A bouquet that tells a story, handmade with love and sincerity.',
    font: 'serif',
    color: '#FFFDF9',
    stickers: ['✨', '🌸'],
    photoBase64: null
  });
  const [memories, setMemories] = useState<MemoryItem[]>([]);

  // Sharing States
  const [shareLink, setShareLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Time of Day override (for background toggle)
  const [timeOverride, setTimeOverride] = useState<'morning' | 'afternoon' | 'evening' | 'night' | null>(null);

  // 1. URL Parameter Parsing (Sharing Engine)
  useEffect(() => {
    const parseUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      const giftParam = params.get('gift') || window.location.hash.replace('#gift=', '');
      
      if (giftParam) {
        try {
          // Decode Base64 string safely supporting UTF-8 emoji characters
          const jsonStr = decodeURIComponent(escape(window.atob(giftParam)));
          const payload = JSON.parse(jsonStr);

          // Map payload to local states
          if (payload.stems) {
            const reconstructedStems = payload.stems.map((s: any) => {
              const flower = FLOWERS.find(f => f.id === s.f);
              return {
                id: s.id,
                flower: flower || FLOWERS[0],
                colorIndex: s.c,
                x: s.x,
                y: s.y,
                angle: s.a,
                heightScale: s.h,
                zIndex: s.z
              };
            });
            setStems(reconstructedStems);
          }
          if (payload.wrap) {
            const wrapObj = WRAPS.find(w => w.id === payload.wrap);
            if (wrapObj) setSelectedWrap(wrapObj);
          }
          if (payload.ribbon) {
            const ribbonObj = RIBBONS.find(r => r.id === payload.ribbon);
            if (ribbonObj) setSelectedRibbon(ribbonObj);
          }
          if (payload.name) setBouquetName(payload.name);
          if (payload.card) {
            setCardData({
              category: payload.card.cat || 'custom',
              title: payload.card.t || '',
              message: payload.card.m || '',
              font: payload.card.f || 'serif',
              color: payload.card.col || '#FFFDF9',
              stickers: payload.card.s || [],
              photoBase64: payload.card.p || null
            });
          }
          if (payload.memories) {
            const reconstructedMemories = payload.memories.map((m: any) => ({
              id: m.id,
              date: m.d,
              caption: m.c,
              story: m.s,
              photoBase64: m.p || null
            }));
            setMemories(reconstructedMemories);
          }

          setAppMode('reveal');
        } catch (err) {
          console.error("Error parsing shared gift parameters: ", err);
        }
      }
    };

    parseUrlParams();
  }, []);

  // 2. Generate Shareable Link
  const generateShareLink = () => {
    // Compress data model slightly for shorter URLs
    const stemsPayload = stems.map(s => ({
      id: s.id,
      f: s.flower.id,
      c: s.colorIndex,
      x: s.x,
      y: s.y,
      a: s.angle,
      h: s.heightScale,
      z: s.zIndex
    }));

    const cardPayload = {
      cat: cardData.category,
      t: cardData.title,
      m: cardData.message,
      f: cardData.font,
      col: cardData.color,
      s: cardData.stickers,
      p: cardData.photoBase64 // thumbnail image
    };

    const memoriesPayload = memories.map(m => ({
      id: m.id,
      d: m.date,
      c: m.caption,
      s: m.story,
      p: m.photoBase64
    }));

    const payload = {
      stems: stemsPayload,
      wrap: selectedWrap.id,
      ribbon: selectedRibbon.id,
      name: bouquetName,
      card: cardPayload,
      memories: memoriesPayload
    };

    try {
      const jsonStr = JSON.stringify(payload);
      // Base64 encode supporting emojis safely
      const base64Str = window.btoa(unescape(encodeURIComponent(jsonStr)));
      
      const link = `${window.location.origin}${window.location.pathname}?gift=${base64Str}`;
      setShareLink(link);
      setShowShareModal(true);
    } catch (err) {
      console.error("Error generating base64 sharing URL: ", err);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 3. Flower Selection Event Handlers
  const handleAddStem = (flower: FlowerData, colorIndex: number) => {
    if (stems.length >= 10) return;
    const newStem: StemInstance = {
      id: `${flower.id}-${Date.now()}`,
      flower,
      colorIndex,
      x: 0, // arrangement coordinates will auto-calculate
      y: 0,
      angle: 0,
      heightScale: 1.0,
      zIndex: flower.type === 'greenery' ? 2 : flower.type === 'filler' ? 5 : 10
    };
    setStems(prev => [...prev, newStem]);
  };

  const handleRemoveStemType = (flowerId: string) => {
    // Remove last added of this specific flower species
    setStems(prev => {
      const idx = prev.map(s => s.flower.id).lastIndexOf(flowerId);
      if (idx !== -1) {
        return prev.filter((_, i) => i !== idx);
      }
      return prev;
    });
  };

  // Remix bouquet configuration from Gallery
  const handleRemixBouquet = (item: GalleryItem) => {
    setSelectedWrap(WRAPS.find(w => w.id === item.wrapId) || WRAPS[0]);
    setSelectedRibbon(RIBBONS.find(r => r.id === item.ribbonId) || RIBBONS[0]);
    setSelectedTheme(THEMES.find(t => t.id === item.themeId) || THEMES[0]);
    setBouquetName(item.name);
    setStems(item.stems);
    
    // Set builder view
    setAppMode('builder');
    setBuilderTab('manual');
    
    // Smooth scroll to top of workspace
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle AI Generated bouquet injection
  const handleAIBouquet = (
    generatedStems: StemInstance[],
    theme: ThemeData,
    wrap: WrapOption,
    ribbon: RibbonOption,
    bName: string,
    cardText: { title: string; message: string; category: string }
  ) => {
    setStems(generatedStems);
    setSelectedTheme(theme);
    setSelectedWrap(wrap);
    setSelectedRibbon(ribbon);
    setBouquetName(bName);
    setCardData(prev => ({
      ...prev,
      category: cardText.category,
      title: cardText.title,
      message: cardText.message,
      photoBase64: null
    }));
  };

  // Count quantities of selected flowers
  const stemsCountByFlower = stems.reduce((acc, stem) => {
    acc[stem.flower.id] = (acc[stem.flower.id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Recipient view check
  if (appMode === 'reveal') {
    return (
      <GiftReveal
        stems={stems}
        wrap={selectedWrap}
        ribbon={selectedRibbon}
        bouquetName={bouquetName}
        cardText={cardData}
        memories={memories}
      />
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden font-sans">
      
      {/* 4. Atmospheric Background */}
      <BackgroundEffects 
        effect={selectedTheme.effect} 
        timeOfDayOverride={timeOverride} 
      />

      {/* Main Navbar */}
      <nav className="max-w-7xl mx-auto w-full px-6 py-5 flex justify-between items-center z-30 select-none">
        <div className="font-serif italic font-bold text-2xl tracking-wider text-[#4A2D33] flex items-center gap-1.5">
          <Sparkles className="w-5 h-5 text-[#E6C587]" />
          BloomCraft
        </div>

        <div className="flex items-center gap-4">
          {/* Custom Time of Day manual widgets */}
          <div className="hidden md:flex items-center gap-1.5 p-1 bg-black/5 rounded-xl text-[10px] font-bold uppercase">
            {[
              { id: 'morning', label: '🌅' },
              { id: 'afternoon', label: '☀️' },
              { id: 'evening', label: '🌇' },
              { id: 'night', label: '🌙' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTimeOverride(t.id as any)}
                className={`w-6 h-6 rounded-md flex items-center justify-center transition-all focus:outline-none ${
                  timeOverride === t.id ? 'bg-[#BC8A70] text-white shadow-xs' : 'opacity-60 hover:opacity-100'
                }`}
                title={`Switch to ${t.id} vibe`}
              >
                {t.label}
              </button>
            ))}
            {timeOverride && (
              <button 
                onClick={() => setTimeOverride(null)} 
                className="px-1.5 text-gray-500 hover:text-black font-semibold text-[8px]"
              >
                Reset
              </button>
            )}
          </div>

          <SoundController />
        </div>
      </nav>

      {/* 5. APP SCREENS */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-6 z-20">
        <AnimatePresence mode="wait">
          
          {/* SCREEN A: LANDING PAGE */}
          {appMode === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-20 py-8 select-none"
            >
              {/* Hero Banner Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Panel: Hero Callouts */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Florist Dialogue Bubble */}
                  <div className="glass-card p-4 rounded-2xl max-w-sm border border-[#F3C6CF]/80 shadow-md flex items-start gap-3 relative animate-sway-slow">
                    {/* Tiny florist icon */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#FFF3F5] border border-[#F3C6CF] flex-shrink-0 flex items-center justify-center">
                      <span className="text-xl">👩‍🌾</span>
                    </div>
                    <div>
                      <div className="font-serif font-bold text-xs text-[#BC8A70] tracking-wide">ELARA • FLORIST GUIDE</div>
                      <p className="text-xs text-[#4A2D33]/80 leading-relaxed mt-0.5">
                        "Welcome to BloomCraft. Let's create something unforgettable today."
                      </p>
                    </div>
                  </div>

                  {/* Header Title */}
                  <div className="space-y-3">
                    <h1 className="font-serif font-bold text-4xl sm:text-6xl text-[#4A2D33] leading-tight">
                      Create Your <br />
                      <span className="text-[#BC8A70] italic">Dream Bouquet</span>
                    </h1>
                    <p className="text-sm sm:text-base text-[#4A2D33]/70 max-w-md leading-relaxed">
                      Design a boutique-grade virtual arrangement that tells a deep story through the language of flowers. Attach memories, write a letter, and share a magical opening experience.
                    </p>
                  </div>

                  {/* Action triggers */}
                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => setAppMode('builder')}
                      className="px-8 py-3.5 bg-[#BC8A70] hover:bg-[#A87961] text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 focus:outline-none cursor-pointer"
                    >
                      Start Creating 💐
                    </button>
                    <button
                      onClick={() => {
                        const target = document.getElementById('gallery-section');
                        target?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-8 py-3.5 bg-white/50 hover:bg-white text-[#4A2D33] font-bold rounded-xl transition-all border border-black/5 focus:outline-none"
                    >
                      Explore Gallery
                    </button>
                  </div>
                </div>

                {/* Right Panel: Stunning Showcase floating bouquet preview */}
                <div className="lg:col-span-6 flex justify-center items-center min-h-[380px] relative">
                  <div className="absolute -inset-10 rounded-full bg-radial from-[#F4C2C2]/20 to-transparent blur-3xl opacity-75" />
                  
                  {/* Stylized Floating Showcase Bouquet */}
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                    className="w-full max-w-[360px] aspect-square rounded-3xl overflow-hidden shadow-2xl relative flex items-center justify-center p-6 bg-gradient-to-t from-bloom-blush/60 via-white/80 to-transparent ring-1 ring-white/50"
                  >
                    <BouquetCanvas
                      stems={[
                        { id: '1', flower: FLOWERS[0], colorIndex: 0, x: -10, y: -20, angle: -5, heightScale: 1.0, zIndex: 10 },
                        { id: '2', flower: FLOWERS[1], colorIndex: 1, x: 25, y: -15, angle: 10, heightScale: 1.05, zIndex: 9 },
                        { id: '3', flower: FLOWERS[10], colorIndex: 0, x: -35, y: -45, angle: -15, heightScale: 0.9, zIndex: 5 },
                        { id: '4', flower: FLOWERS[13], colorIndex: 0, x: 30, y: -40, angle: 20, heightScale: 1.15, zIndex: 2 }
                      ]}
                      setStems={() => {}}
                      selectedWrap={WRAPS[1]}
                      selectedRibbon={RIBBONS[0]}
                      isInteractive={false}
                    />
                  </motion.div>
                </div>

              </div>

              {/* Showcase Community Gallery Section */}
              <div id="gallery-section" className="pt-12 border-t border-black/5">
                <CommunityGallery onRemixBouquet={handleRemixBouquet} />
              </div>
            </motion.div>
          )}

          {/* SCREEN B: BUILDER WORKSHOP */}
          {appMode === 'builder' && (
            <motion.div
              key="builder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 py-2"
            >
              {/* Back to landing */}
              <div className="flex justify-between items-center select-none">
                <button
                  onClick={() => setAppMode('landing')}
                  className="px-3.5 py-1.5 rounded-lg hover:bg-black/5 text-xs font-bold text-[#4A2D33] flex items-center gap-1 focus:outline-none"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Boutique
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setStems([]);
                      setMemories([]);
                    }}
                    className="px-3.5 py-1.5 rounded-lg border border-black/5 hover:bg-black/5 text-xs font-semibold text-[#4A2D33] flex items-center gap-1 focus:outline-none"
                    title="Clear workshop board"
                  >
                    Reset Design
                  </button>

                  <button
                    onClick={generateShareLink}
                    disabled={stems.length === 0}
                    className={`px-5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all focus:outline-none ${
                      stems.length === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[#BC8A70] hover:bg-[#A87961] text-white cursor-pointer'
                    }`}
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share & Gift
                  </button>
                </div>
              </div>

              {/* Workspace Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Workspace Left: Live Canvas Rendering */}
                <div className="lg:col-span-5 flex flex-col items-center select-none">
                  
                  {/* Render Bouquet canvas inside chosen environment */}
                  <div className={`w-full max-w-[460px] aspect-[4/5] rounded-3xl overflow-hidden p-6 relative flex items-center justify-center border border-white/60 shadow-lg transition-all duration-700 ${getSceneryBackdrop(scenery)}`}>
                    
                    <BouquetCanvas
                      stems={stems}
                      setStems={setStems}
                      selectedWrap={selectedWrap}
                      selectedRibbon={selectedRibbon}
                    />

                    {/* Quick Setting Scenery Label */}
                    <div className="absolute top-4 left-4 bg-white/60 backdrop-blur-xs px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider text-[#4A2D33] border border-white/40">
                      Vibe: {scenery}
                    </div>
                  </div>

                  {/* Environment presentation changer widget */}
                  <div className="w-full max-w-[460px] mt-4">
                    <PresentationPanel activeSetting={scenery} onSettingChange={setScenery} />
                  </div>
                </div>

                {/* Workspace Right: Tabs & Customizer Controllers */}
                <div className="lg:col-span-7 flex flex-col justify-start">
                  
                  {/* Customize Tab Headers */}
                  <div className="flex gap-1.5 border-b border-black/5 pb-2.5 mb-6 overflow-x-auto select-none">
                    {[
                      { id: 'manual' as const, label: '💐 Manual Mode' },
                      { id: 'ai' as const, label: '✨ AI Designed' },
                      { id: 'wrap' as const, label: '🎀 Wrappers & Themes' },
                      { id: 'card' as const, label: '💌 Greeting Letter' },
                      { id: 'garden' as const, label: '📸 Memory Garden' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setBuilderTab(tab.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all focus:outline-none ${
                          builderTab === tab.id
                            ? 'bg-white text-[#BC8A70] border border-[#BC8A70]/30 shadow-xs'
                            : 'text-[#4A2D33]/60 hover:text-[#4A2D33]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Body Renders */}
                  <div className="min-h-[460px]">
                    {builderTab === 'manual' && (
                      <ManualBuilder
                        currentStemsCount={stems.length}
                        onAddStem={handleAddStem}
                        onRemoveStemType={handleRemoveStemType}
                        stemsCountByFlower={stemsCountByFlower}
                      />
                    )}

                    {builderTab === 'ai' && (
                      <AIBuilder onGenerateBouquet={handleAIBouquet} />
                    )}

                    {builderTab === 'wrap' && (
                      <div className="space-y-6 text-xs text-[#4A2D33] select-none">
                        
                        {/* Theme chooser */}
                        <div className="space-y-2">
                          <label className="font-bold uppercase tracking-wider text-[10px] text-gray-400">Select Arrangement Vibe Theme</label>
                          <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                            {THEMES.map((theme) => (
                              <button
                                key={theme.id}
                                onClick={() => {
                                  setSelectedTheme(theme);
                                  setSelectedWrap(WRAPS.find(w => w.id === theme.defaultWrapId) || WRAPS[0]);
                                  setSelectedRibbon(RIBBONS.find(r => r.id === theme.defaultRibbonId) || RIBBONS[0]);
                                }}
                                className={`p-3 rounded-2xl glass-card text-left border flex flex-col justify-between focus:outline-none transition-all ${
                                  selectedTheme.id === theme.id
                                    ? 'border-[#BC8A70] bg-[#BC8A70]/10 font-semibold'
                                    : 'border-transparent bg-white/40'
                                }`}
                              >
                                <span className="font-serif font-bold text-sm">{theme.name}</span>
                                <span className="text-[9px] text-gray-400 mt-1 font-normal leading-relaxed">{theme.tagline}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Custom wrapper overrides */}
                        <div className="space-y-2">
                          <label className="font-bold uppercase tracking-wider text-[10px] text-gray-400">Wrapping Texture Override</label>
                          <div className="flex flex-wrap gap-2">
                            {WRAPS.map((wrap) => (
                              <button
                                key={wrap.id}
                                onClick={() => setSelectedWrap(wrap)}
                                className={`px-3 py-2 rounded-xl border flex items-center gap-2 focus:outline-none transition-all ${
                                  selectedWrap.id === wrap.id
                                    ? 'border-[#BC8A70] bg-[#BC8A70]/10 font-semibold'
                                    : 'border-transparent bg-white/40'
                                }`}
                              >
                                <div style={{ backgroundColor: wrap.hex }} className="w-3.5 h-3.5 rounded-full border border-black/10" />
                                <span>{wrap.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Ribbon options */}
                        <div className="space-y-2">
                          <label className="font-bold uppercase tracking-wider text-[10px] text-gray-400">Ribbon Bow Override</label>
                          <div className="flex flex-wrap gap-2">
                            {RIBBONS.map((rib) => (
                              <button
                                key={rib.id}
                                onClick={() => setSelectedRibbon(rib)}
                                className={`px-3 py-2 rounded-xl border flex items-center gap-2 focus:outline-none transition-all ${
                                  selectedRibbon.id === rib.id
                                    ? 'border-[#BC8A70] bg-[#BC8A70]/10 font-semibold'
                                    : 'border-transparent bg-white/40'
                                }`}
                              >
                                <div style={{ backgroundColor: rib.hex }} className="w-3.5 h-3.5 rounded-full border border-black/10" />
                                <span>{rib.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Bouquet Name Generator */}
                        <div className="space-y-2 pt-2 border-t border-black/5">
                          <label className="font-bold uppercase tracking-wider text-[10px] text-gray-400">Bouquet Moniker</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={bouquetName}
                              onChange={(e) => setBouquetName(e.target.value)}
                              placeholder="Name your bouquet..."
                              className="p-2.5 rounded-xl border border-black/5 bg-white/40 focus:bg-white focus:outline-[#BC8A70] flex-1 text-xs"
                            />
                            <button
                              onClick={() => {
                                const names = ["Blooming Gratitude", "Lavender Dreams", "Golden Promise", "Moonlit Blossom", "Eternal Spring", "Garden of Memories", "Blush of Forever"];
                                setBouquetName(names[Math.floor(Math.random() * names.length)]);
                              }}
                              className="px-3 rounded-xl bg-black/5 hover:bg-black/10 text-[#4A2D33] focus:outline-none flex items-center gap-1 font-bold text-xs"
                            >
                              <RefreshCw className="w-3 h-3" /> Auto-Name
                            </button>
                          </div>
                        </div>

                      </div>
                    )}

                    {builderTab === 'card' && (
                      <GreetingCardCreator cardData={cardData} setCardData={setCardData} />
                    )}

                    {builderTab === 'garden' && (
                      <MemoryGarden memories={memories} setMemories={setMemories} />
                    )}
                  </div>

                </div>

              </div>

              {/* Elara interactive advisor guide */}
              <ElaraGuide currentStems={stems} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 6. SHARING LINK REVEAL MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs select-none">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl m-4 border border-white/60 relative">
            <h3 className="font-serif font-bold text-xl text-[#4A2D33] mb-2">Your Gift is Ready!</h3>
            <p className="text-xs text-[#4A2D33]/70 mb-4 leading-relaxed">
              We have compiled your stems, wrapping options, letter formatting, and memory scrapbook into a single, fully-encoded URL. Send this URL to your recipient to play the animation.
            </p>

            {/* Input display */}
            <div className="flex items-center gap-2 p-2 bg-black/5 rounded-xl border border-black/5 text-xs text-[#4A2D33] mb-4">
              <input
                type="text"
                readOnly
                value={shareLink}
                className="bg-transparent border-none focus:outline-none w-full font-mono text-[10px] select-all truncate"
              />
              <button
                onClick={handleCopyToClipboard}
                className="p-2 bg-[#BC8A70] hover:bg-[#A87961] text-white rounded-lg flex items-center gap-1 font-bold flex-shrink-0 cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Preview sharing assets mockup sizes */}
            <div className="border-t border-black/5 pt-4">
              <label className="font-bold text-[10px] uppercase text-gray-400 tracking-wider block mb-2">
                Social Sharing Assets preview
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 bg-white/40 border rounded-lg text-center font-bold text-[9px] uppercase tracking-wider text-[#4A2D33]">
                  🌅 Instagram Sq
                </div>
                <div className="p-2 bg-white/40 border rounded-lg text-center font-bold text-[9px] uppercase tracking-wider text-[#4A2D33]">
                  📱 Story Card
                </div>
                <div className="p-2 bg-white/40 border rounded-lg text-center font-bold text-[9px] uppercase tracking-wider text-[#4A2D33]">
                  🎴 Cover Card
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="mt-6 w-full py-2.5 bg-[#BC8A70] hover:bg-[#A87961] text-white font-bold rounded-xl transition-all shadow-sm focus:outline-none"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full text-center py-6 text-[10px] text-[#4A2D33]/40 border-t border-black/5 mt-16 select-none bg-white/10 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-6">
          <p>© {new Date().getFullYear()} BloomCraft Studio • The World's Most Beautiful Virtual Bouquet Experience.</p>
          <p className="mt-1 font-mono text-[9px] opacity-75">Future-Ready: voice integration, real flower orders, AR viewing ready.</p>
        </div>
      </footer>

    </div>
  );
}
