import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const getPageTitle = (pathname) => {
  if (pathname === '/') return 'Home Interface';
  if (pathname === '/about') return 'About & Pedagogy';
  if (pathname === '/workspace') return 'Cognitive Workspace';
  if (pathname === '/login') return 'Account Authentication';
  if (pathname === '/register') return 'Join Avora';
  return 'Avora Intelligence';
};

export const RouteTransitionOverlay = () => {
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState('in'); // 'in' or 'out'
  const [targetTitle, setTargetTitle] = useState('Avora');
  const prevPathRef = useRef(location.pathname);
  const timer1Ref = useRef(null);
  const timer2Ref = useRef(null);

  useEffect(() => {
    // Only trigger when the pathname changes (not on hash clicks)
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setTargetTitle(getPageTitle(location.pathname));

      if (timer1Ref.current) clearTimeout(timer1Ref.current);
      if (timer2Ref.current) clearTimeout(timer2Ref.current);

      setActive(true);
      setPhase('in');

      // Scroll to top immediately during transition
      if (!location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }

      // Phase 2: Start exiting after shutter completes covering screen
      timer1Ref.current = setTimeout(() => {
        setPhase('out');
      }, 250);

      // Phase 3: Completely unmount overlay
      timer2Ref.current = setTimeout(() => {
        setActive(false);
      }, 520);
    }

    return () => {
      if (timer1Ref.current) clearTimeout(timer1Ref.current);
      if (timer2Ref.current) clearTimeout(timer2Ref.current);
    };
  }, [location.pathname]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden select-none">
      {/* 4 Staggered Vertical Shutter Columns */}
      <div className="absolute inset-0 flex w-full h-full">
        {[0, 1, 2, 3].map((colIndex) => (
          <div
            key={colIndex}
            className="h-full w-1/4 bg-[#07080B] border-r border-[#4D74FF]/20 relative"
            style={{
              animation:
                phase === 'in'
                  ? `shutterIn 240ms cubic-bezier(0.77, 0, 0.175, 1) ${colIndex * 35}ms forwards`
                  : `shutterOut 240ms cubic-bezier(0.77, 0, 0.175, 1) ${colIndex * 35}ms forwards`,
            }}
          >
            {/* Ambient blue vertical gradient highlight on each blade */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#4D74FF]/5 via-transparent to-[#4D74FF]/10 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Horizontal Laser Scanning Beam */}
      <div
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#4D74FF] to-transparent shadow-[0_0_15px_#4D74FF,0_0_30px_#60A5FA]"
        style={{
          animation: 'scanlineSweep 450ms ease-in-out infinite',
        }}
      />

      {/* Central Geometric Hologram Card */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-200 ${
          phase === 'in' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="relative flex flex-col items-center gap-4 p-8 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-lg shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_25px_rgba(77,116,255,0.25)]">
          
          {/* Animated 4-corner anchor selection box around Avora mark */}
          <div className="relative p-4 border border-[#4D74FF]/40 rounded-2xl bg-[#0B0D10]/90">
            {/* 4 Blue corner anchor handles */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#4D74FF] rounded-xs shadow-[0_0_8px_#4D74FF]" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#4D74FF] rounded-xs shadow-[0_0_8px_#4D74FF]" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#4D74FF] rounded-xs shadow-[0_0_8px_#4D74FF]" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#4D74FF] rounded-xs shadow-[0_0_8px_#4D74FF]" />

            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-black font-heading font-black text-base uppercase shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              <span>A</span>
            </div>
          </div>

          {/* Dynamic Destination Callout */}
          <div className="flex flex-col items-center text-center gap-1">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#4D74FF] uppercase">
              [ AXIOMATIC ROUTER ]
            </span>
            <p className="text-white text-sm font-bold font-body tracking-tight">
              {targetTitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteTransitionOverlay;
