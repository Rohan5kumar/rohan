'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import WebGLBackground from './WebGLBackground';
import { Terminal, Code2, Database, ShieldCheck } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance sequence
      const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });

      tl.from('.hero-badge', { opacity: 0, y: 20, duration: 1 }, 0.5)
        .from('.hero-title-line', { opacity: 0, y: 50, stagger: 0.15, rotationX: -15, transformOrigin: '0% 50% -50' }, 0.7)
        .from('.hero-desc', { opacity: 0, y: 20 }, 1.2)
        .from('.hero-stats', { opacity: 0, y: 20, stagger: 0.1 }, 1.4)
        .from('.hero-cta', { opacity: 0, scale: 0.95 }, 1.6);
        
      // Continuous floating animation for the stats
      gsap.to('.hero-stats', {
        y: -5,
        stagger: 0.1,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[100svh] flex items-center justify-start overflow-hidden pt-20 px-6 md:px-12 lg:px-24">
      <WebGLBackground />
      
      <div className="relative z-10 max-w-4xl pt-12 md:pt-0">
        <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 glass mb-8">
          <span className="w-2 h-2 rounded-full bg-[#00f3ff] animate-pulse shadow-[0_0_10px_#00f3ff]"></span>
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-300">System Ready</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-[1.1]">
          <div className="overflow-hidden pb-2">
            <div className="hero-title-line">Rohan</div>
          </div>
          <div className="overflow-hidden pb-2">
            <div className="hero-title-line text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
              Krishnagoudar.
            </div>
          </div>
        </h1>
        
        <div className="hero-desc mb-10 text-lg md:text-2xl text-neutral-400 font-light max-w-2xl leading-relaxed">
          System Architect & Co-Founder at <span className="text-white font-medium">Explyra</span>. 
          Designing high-performance computing clusters and robust microservice architectures.
        </div>
        
        <div className="flex flex-wrap gap-4 mb-12">
          <div className="hero-stats glass px-5 py-3 rounded-2xl flex items-center gap-3 border border-white/5">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Code2 size={20} />
            </div>
            <div>
              <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Language</div>
              <div className="font-bold text-sm">TypeScript / Node</div>
            </div>
          </div>
          
          <div className="hero-stats glass px-5 py-3 rounded-2xl flex items-center gap-3 border border-white/5">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Database size={20} />
            </div>
            <div>
              <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Database</div>
              <div className="font-bold text-sm">PostgreSQL / Redis</div>
            </div>
          </div>
          
          <div className="hero-stats glass px-5 py-3 rounded-2xl flex items-center gap-3 border border-white/5">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Security</div>
              <div className="font-bold text-sm">Auth & Encryption</div>
            </div>
          </div>
        </div>
        
        <div className="hero-cta flex gap-4">
          <button className="bg-[#00f3ff] text-black font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] flex items-center gap-2">
            <Terminal size={18} />
            Initialize Contact
          </button>
          <button className="glass font-bold text-sm px-8 py-4 rounded-xl hover:bg-white/5 transition-all flex items-center gap-2 border border-white/10 hover:border-white/20">
            View Deployment Specs
          </button>
        </div>
      </div>
    </section>
  );
}
