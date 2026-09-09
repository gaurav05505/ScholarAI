import React from 'react';

export const PageLoader = ({ message = 'Deconstructing from first principles...' }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center font-body select-none">
      {/* Ambient background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-[#4D74FF]/10 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center gap-6 z-10">
        {/* Animated Geometric Avora Icon with Orbital Ring */}
        <div className="relative flex items-center justify-center w-18 h-18">
          {/* Outer Orbital Rotating Dashed Ring */}
          <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-[#4D74FF]/40 animate-[loaderOrbit_6s_linear_infinite]" />
          
          {/* Pulsing Blue Glow Frame */}
          <div className="absolute inset-1 rounded-xl bg-[#4D74FF]/15 animate-[loaderPulse_2s_ease-in-out_infinite] border border-[#4D74FF]/30" />

          {/* Central Logo Box */}
          <div className="relative w-11 h-11 bg-white rounded-lg flex items-center justify-center text-black font-heading font-black text-sm uppercase shadow-[0_0_20px_rgba(77,116,255,0.4)]">
            <span>A</span>
            {/* Small Blue Corner Accent Dot */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#4D74FF] rounded-xs shadow-[0_0_6px_#4D74FF]" />
          </div>
        </div>

        {/* Loading text with animated pulse */}
        <div className="flex flex-col items-center text-center gap-1.5">
          <p className="text-white text-sm font-semibold tracking-wide">
            Avora Intelligence
          </p>
          <p className="text-zinc-500 text-xs font-normal tracking-wide animate-pulse">
            {message}
          </p>
        </div>

        {/* Triple pulsating micro-dots */}
        <div className="flex items-center gap-1.5 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4D74FF] animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#4D74FF] animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#4D74FF] animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
