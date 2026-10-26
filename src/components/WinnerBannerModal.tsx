import React, { useEffect, useRef, useState } from 'react';
import { X, Trophy, Crown, Sparkles, Award } from 'lucide-react';

interface WinnerBannerModalProps {
  onClose?: () => void;
}

export const WinnerBannerModal: React.FC<WinnerBannerModalProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  // Fireworks and Confetti Canvas Animation
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle system
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
      size: number;
      decay: number;
      shape: 'circle' | 'rect';
      rotation: number;
      rotSpeed: number;
    }

    const particles: Particle[] = [];
    const colors = ['#F59E0B', '#3B82F6', '#60A5FA', '#E5E7EB', '#FBBF24', '#F43F5E', '#10B981', '#ffffff'];

    const createFirework = (targetX: number, targetY: number) => {
      const count = 40 + Math.floor(Math.random() * 25);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 5.5;
        particles.push({
          x: targetX,
          y: targetY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          size: Math.random() * 4 + 2,
          decay: 0.012 + Math.random() * 0.015,
          shape: Math.random() > 0.5 ? 'circle' : 'rect',
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 8,
        });
      }
    };

    let timer = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      timer++;
      // Spawn random fireworks in top 60% of screen
      if (timer % 24 === 0) {
        createFirework(
          width * 0.15 + Math.random() * (width * 0.7),
          height * 0.1 + Math.random() * (height * 0.45)
        );
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.vx *= 0.985;
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Initial bursts
    createFirework(width * 0.25, height * 0.25);
    createFirework(width * 0.5, height * 0.18);
    createFirework(width * 0.75, height * 0.25);

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md transition-all duration-300 animate-in fade-in overflow-hidden">
      {/* Fireworks Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Main Modal Card */}
      <div className="relative z-10 w-full max-w-2xl max-h-[96vh] flex flex-col bg-gradient-to-b from-[#0a2548] via-[#084887] to-[#041a35] border border-blue-400/30 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(8,72,135,0.7)] p-3 sm:p-5 text-white overflow-hidden my-auto">
        {/* Subtle decorative radial lights */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close Announcement"
          className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all backdrop-blur-sm border border-white/10 group cursor-pointer z-20"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* Header Text */}
        <div className="text-center space-y-1 mb-2 sm:mb-3 pt-0.5 px-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[10px] sm:text-xs font-semibold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3 h-3 text-blue-300 animate-spin" style={{ animationDuration: '4s' }} />
            IESL UIY 2026
            <Sparkles className="w-3 h-3 text-blue-300 animate-spin" style={{ animationDuration: '4s' }} />
          </div>

          <h1 className="text-base sm:text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-100 via-white to-blue-200 bg-clip-text text-transparent drop-shadow-sm font-display leading-tight">
            Heartiest Congratulations to Our Winners!
          </h1>
          <p className="text-[10px] sm:text-xs text-blue-100/75 max-w-lg mx-auto">
            Honoring the outstanding young innovators shaping the future of engineering & technology in Sri Lanka.
          </p>
        </div>

        {/* Podium Area */}
        <div className="flex items-end justify-center gap-2 sm:gap-3.5 max-w-xl mx-auto w-full flex-1">
          {/* ================= 2ND PLACE (1st Runners-Up) ================= */}
          <div className="flex flex-col items-center flex-1 order-1 group w-full min-w-0">
            {/* Team Info & Photo */}
            <div className="flex flex-col items-center mb-1.5 w-full">
              <div className="relative mb-1 w-full">
                <div className="w-full aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden p-0.5 bg-gradient-to-b from-slate-200 to-slate-400 shadow-[0_0_12px_rgba(226,232,240,0.3)]">
                  <img
                    src="/images/banner/2nd.jpeg"
                    alt="1st Runners-Up - Team Thoraxis"
                    className="w-full h-full object-cover rounded-md sm:rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {/* Rank Badge */}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-slate-200 to-slate-400 text-slate-900 text-[9px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5 border border-white">
                  <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-800" /> 2nd
                </span>
              </div>

              <h2 className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-100 text-center truncate w-full mt-1">
                Team Thoraxis
              </h2>
              <span className="text-[8px] sm:text-[10px] text-slate-300/90 font-medium text-center truncate w-full leading-tight">
                University of Ruhuna
              </span>
            </div>

            {/* Podium Pillar */}
            <div className="w-full h-12 sm:h-16 md:h-20 rounded-t-lg sm:rounded-xl bg-gradient-to-b from-slate-400/30 via-slate-500/20 to-slate-700/40 border-t-2 border-x border-slate-300/50 backdrop-blur-md flex flex-col items-center justify-start pt-1.5 sm:pt-2 shadow-[inset_0_2px_8px_rgba(255,255,255,0.2)]">
              <span className="text-base sm:text-2xl font-black text-slate-300/40">2</span>
              <span className="text-[7px] sm:text-[9px] font-semibold tracking-widest text-slate-300 uppercase">
                1st Runners-Up
              </span>
            </div>
          </div>

          {/* ================= 1ST PLACE (Winner - Highest & Center) ================= */}
          <div className="flex flex-col items-center flex-1 order-2 group w-full min-w-0">
            {/* Crown Icon strictly centered above 1st place card */}
            <div className="w-full flex items-center justify-center mb-0.5 text-amber-400">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-bounce" />
            </div>

            {/* Team Info & Photo */}
            <div className="flex flex-col items-center mb-1.5 w-full">
              <div className="relative mb-1 w-full">
                <div className="w-full aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden p-0.5 sm:p-1 bg-gradient-to-b from-amber-300 via-amber-400 to-yellow-600 shadow-[0_0_20px_rgba(245,158,11,0.55)] ring-1 sm:ring-1.5 ring-amber-300/80">
                  <img
                    src="/images/banner/1st.jpeg"
                    alt="1st Place - Team iHeart"
                    className="w-full h-full object-cover rounded-md sm:rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {/* Rank Badge */}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 text-slate-950 text-[9px] sm:text-[11px] font-black px-2 sm:px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-0.5 border border-white">
                  <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-slate-950" /> 1st
                </span>
              </div>

              <h2 className="text-[11px] sm:text-xs md:text-sm font-extrabold text-amber-300 text-center truncate w-full mt-1 drop-shadow-sm">
                Team iHeart
              </h2>
              <span className="text-[8px] sm:text-[10px] text-amber-200/90 font-bold uppercase tracking-wider text-center truncate w-full leading-tight">
                University of Ruhuna
              </span>
            </div>

            {/* Podium Pillar */}
            <div className="w-full h-16 sm:h-24 md:h-28 rounded-t-lg sm:rounded-xl bg-gradient-to-b from-amber-500/40 via-amber-600/25 to-yellow-900/40 border-t-2 border-x border-amber-300/70 backdrop-blur-md flex flex-col items-center justify-start pt-1.5 sm:pt-2 shadow-[inset_0_2px_12px_rgba(251,191,36,0.3)]">
              <span className="text-lg sm:text-3xl font-black text-amber-300/40">1</span>
              <span className="text-[8px] sm:text-[10px] font-bold tracking-widest text-amber-300 uppercase">
                1st Place
              </span>
            </div>
          </div>

          {/* ================= 3RD PLACE (2nd Runners-Up) ================= */}
          <div className="flex flex-col items-center flex-1 order-3 group w-full min-w-0">
            {/* Team Info & Photo */}
            <div className="flex flex-col items-center mb-1.5 w-full">
              <div className="relative mb-1 w-full">
                <div className="w-full aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden p-0.5 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 shadow-[0_0_12px_rgba(180,83,9,0.3)]">
                  <img
                    src="/images/banner/3rd.jpeg"
                    alt="2nd Runners-Up - Team CricKine"
                    className="w-full h-full object-cover rounded-md sm:rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {/* Rank Badge */}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-700 to-amber-800 text-amber-100 text-[9px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5 border border-amber-300/40">
                  <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" /> 3rd
                </span>
              </div>

              <h2 className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-100 text-center truncate w-full mt-1">
                Team CricKine
              </h2>
              <span className="text-[8px] sm:text-[10px] text-amber-200/80 font-medium text-center truncate w-full leading-tight">
                Uni. Sri Jayewardenepura
              </span>
            </div>

            {/* Podium Pillar */}
            <div className="w-full h-10 sm:h-14 md:h-16 rounded-t-lg sm:rounded-xl bg-gradient-to-b from-amber-800/35 via-amber-900/20 to-amber-950/40 border-t-2 border-x border-amber-700/50 backdrop-blur-md flex flex-col items-center justify-start pt-1.5 sm:pt-2 shadow-[inset_0_2px_8px_rgba(245,158,11,0.15)]">
              <span className="text-base sm:text-2xl font-black text-amber-600/40">3</span>
              <span className="text-[7px] sm:text-[9px] font-semibold tracking-widest text-amber-400 uppercase">
                2nd Runners-Up
              </span>
            </div>
          </div>
        </div>

        {/* Footer Action Button */}
        <div className="mt-2 sm:mt-3 pt-2 border-t border-white/10 flex items-center justify-center">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-blue-600 to-uiy-blue hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm shadow-[0_0_18px_rgba(37,99,235,0.4)] hover:shadow-[0_0_22px_rgba(37,99,235,0.6)] transition-all hover:scale-[1.02] cursor-pointer"
          >
            Continue to Website &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
