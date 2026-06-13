'use client';

import React, { useEffect, useState } from 'react';

interface BackgroundEffectsProps {
  effect?: 'petals' | 'sakura' | 'fireflies' | 'gold-shimmer' | 'bokeh' | 'none';
  timeOfDayOverride?: 'morning' | 'afternoon' | 'evening' | 'night' | null;
}

export default function BackgroundEffects({
  effect = 'none',
  timeOfDayOverride = null,
}: BackgroundEffectsProps) {
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('afternoon');
  const [elements, setElements] = useState<Array<{ id: number; left: number; top: number; size: number; delay: number; duration: number; type: string; drift: number }>>([]);

  // Detect local time of day
  useEffect(() => {
    if (timeOfDayOverride) {
      setTimeOfDay(timeOfDayOverride);
      return;
    }

    const updateTime = () => {
      const hours = new Date().getHours();
      if (hours >= 5 && hours < 12) {
        setTimeOfDay('morning');
      } else if (hours >= 12 && hours < 17) {
        setTimeOfDay('afternoon');
      } else if (hours >= 17 && hours < 20) {
        setTimeOfDay('evening');
      } else {
        setTimeOfDay('night');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [timeOfDayOverride]);

  // Generate background elements once mounted
  useEffect(() => {
    const newElements = Array.from({ length: 25 }).map((_, i) => {
      const size = Math.random() * 15 + 8; // 8px to 23px
      const duration = Math.random() * 10 + 10; // 10s to 20s
      const delay = Math.random() * -20; // negative delay so elements start scattered
      const left = Math.random() * 100; // 0% to 100%
      const top = Math.random() * 100;
      const drift = Math.random() * 80 - 40; // horizontal movement
      
      let type = 'particle';
      if (effect === 'petals') type = 'petal';
      else if (effect === 'sakura') type = 'sakura';
      else if (effect === 'fireflies') type = 'firefly';
      else if (effect === 'gold-shimmer') type = 'shimmer';
      else if (effect === 'bokeh') type = 'bokeh';
      else {
        // Fallback particles based on time of day
        if (timeOfDay === 'morning') type = 'dew';
        else if (timeOfDay === 'afternoon') type = 'pollen';
        else if (timeOfDay === 'evening') type = 'gold-dust';
        else type = 'firefly';
      }

      return { id: i, left, top, size, delay, duration, type, drift };
    });
    setElements(newElements);
  }, [effect, timeOfDay]);

  // CSS Gradients for local times
  const timeBackgrounds = {
    morning: 'bg-gradient-to-tr from-[#FFF5F5] via-[#FFF9E6] to-[#E6F3FF] text-[#4A3B32]',
    afternoon: 'bg-gradient-to-tr from-[#FFFDF6] via-[#F3FAF0] to-[#E8F5FF] text-[#2C3E2E]',
    evening: 'bg-gradient-to-tr from-[#FFF2E6] via-[#FFF0E6] to-[#FFE4E6] text-[#4F2D2A]',
    night: 'bg-gradient-to-tr from-[#09090E] via-[#12111E] to-[#1C162E] text-[#E0E0FF] dark',
  };

  return (
    <div className={`fixed inset-0 -z-50 overflow-hidden transition-all duration-1000 ${timeBackgrounds[timeOfDay]}`}>
      {/* Sun/Moon Atmospheric Radial Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {timeOfDay === 'morning' && (
          <div className="absolute top-[10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-radial from-[#FFE8B5]/50 to-transparent blur-3xl" />
        )}
        {timeOfDay === 'afternoon' && (
          <div className="absolute top-[-10%] right-[10%] w-[60vw] h-[60vw] rounded-full bg-radial from-[#FFF9C4]/40 to-transparent blur-3xl" />
        )}
        {timeOfDay === 'evening' && (
          <div className="absolute top-[20%] right-[5%] w-[55vw] h-[55vw] rounded-full bg-radial from-[#FF9E79]/30 to-transparent blur-3xl" />
        )}
        {timeOfDay === 'night' && (
          <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-radial from-[#D4C3FA]/20 to-transparent blur-3xl" />
        )}
      </div>

      {/* Floating Butterflies (Afternoon/Day Ambient) */}
      {timeOfDay === 'afternoon' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute animate-butterfly-1 left-[-5%] w-8 h-8 opacity-75">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-[#F3C6CF] drop-shadow-md">
              <path d="M12,12 C10,9 6,6 4,8 C2,10 6,14 12,16 C6,18 2,22 4,24 C6,26 10,23 12,20 C14,23 18,26 20,24 C22,22 18,18 12,16 C18,14 22,10 20,8 C18,6 14,9 12,12 Z" />
            </svg>
          </div>
          <div className="absolute animate-butterfly-2 right-[-5%] w-6 h-6 opacity-60">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-[#D4C3FA] drop-shadow-md">
              <path d="M12,12 C10,9 6,6 4,8 C2,10 6,14 12,16 C6,18 2,22 4,24 C6,26 10,23 12,20 C14,23 18,26 20,24 C22,22 18,18 12,16 C18,14 22,10 20,8 C18,6 14,9 12,12 Z" />
            </svg>
          </div>
        </div>
      )}

      {/* Particle Effects Canvas */}
      <div className="absolute inset-0 pointer-events-none">
        {elements.map((el) => {
          if (el.type === 'petal') {
            return (
              <svg
                key={el.id}
                viewBox="0 0 30 30"
                style={{
                  position: 'absolute',
                  left: `${el.left}%`,
                  top: '-30px',
                  width: `${el.size}px`,
                  height: `${el.size}px`,
                  animationDelay: `${el.delay}s`,
                  animationDuration: `${el.duration}s`,
                }}
                className="animate-float-petal fill-[#E63956] opacity-80"
              >
                {/* Fluttering Petal Shape */}
                <path d="M 15 5 C 22 5, 27 12, 22 22 C 17 28, 13 28, 8 22 C 3 12, 8 5, 15 5 Z" />
              </svg>
            );
          }

          if (el.type === 'sakura') {
            return (
              <svg
                key={el.id}
                viewBox="0 0 30 30"
                style={{
                  position: 'absolute',
                  left: `${el.left}%`,
                  top: '-30px',
                  width: `${el.size}px`,
                  height: `${el.size}px`,
                  animationDelay: `${el.delay}s`,
                  animationDuration: `${el.duration}s`,
                }}
                className="animate-float-petal fill-[#FFAEC9] opacity-80"
              >
                {/* Sakura Petal Shape with center indent */}
                <path d="M 15 3 C 19 3, 23 7, 23 15 C 23 23, 17 26, 15 26 C 13 26, 7 23, 7 15 C 7 7, 11 3, 15 3 Z M 15 3 C 15 4, 14 5, 15 5 C 16 5, 15 4, 15 3 Z" />
              </svg>
            );
          }

          if (el.type === 'firefly') {
            return (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: `${el.left}%`,
                  top: `${el.top}%`,
                  width: `${el.size / 2}px`,
                  height: `${el.size / 2}px`,
                  backgroundColor: '#DFFF80',
                  boxShadow: '0 0 10px 4px rgba(223, 255, 128, 0.8)',
                  borderRadius: '50%',
                  animationDelay: `${el.delay}s`,
                  animationDuration: `${el.duration / 3}s`,
                }}
                className="animate-sparkle"
              />
            );
          }

          if (el.type === 'shimmer') {
            return (
              <svg
                key={el.id}
                viewBox="0 0 24 24"
                style={{
                  position: 'absolute',
                  left: `${el.left}%`,
                  top: `${el.top}%`,
                  width: `${el.size}px`,
                  height: `${el.size}px`,
                  animationDelay: `${el.delay}s`,
                  animationDuration: `${el.duration / 4}s`,
                }}
                className="animate-sparkle fill-[#E6C587]"
              >
                <path d="M12,2 L14.5,9.5 L22,12 L14.5,14.5 L12,22 L9.5,14.5 L2,12 L9.5,9.5 Z" />
              </svg>
            );
          }

          if (el.type === 'bokeh') {
            return (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: `${el.left}%`,
                  top: `${el.top}%`,
                  width: `${el.size * 3}px`,
                  height: `${el.size * 3}px`,
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  borderRadius: '50%',
                  filter: 'blur(4px)',
                  animationDelay: `${el.delay}s`,
                  animationDuration: `${el.duration}s`,
                }}
                className="animate-float-light"
              />
            );
          }

          // Fallback simple glow particles (pollen, dew, gold dust)
          const particleColors: Record<string, string> = {
            dew: 'rgba(230, 243, 255, 0.6)',
            pollen: 'rgba(255, 253, 220, 0.7)',
            'gold-dust': 'rgba(230, 197, 135, 0.5)',
            particle: 'rgba(255, 255, 255, 0.4)',
          };

          return (
            <div
              key={el.id}
              style={{
                position: 'absolute',
                left: `${el.left}%`,
                top: `${el.top}%`,
                width: `${el.size / 3}px`,
                height: `${el.size / 3}px`,
                backgroundColor: particleColors[el.type] || particleColors.particle,
                borderRadius: '50%',
                animationDelay: `${el.delay}s`,
                animationDuration: `${el.duration}s`,
              }}
              className="animate-float-light"
            />
          );
        })}
      </div>
    </div>
  );
}
