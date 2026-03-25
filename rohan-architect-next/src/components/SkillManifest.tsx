'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const systemSpecsList = [
  '{',
  '  "architect": "Rohan Krishnagoudar",',
  '  "role": "Co-Founder & System Architect",',
  '  "core_competencies": [',
  '    "High-Performance Computing",',
  '    "Cloud Infrastructure (AWS/Vercel)",',
  '    "Microservices Architecture",',
  '    "Database Design (PostgreSQL, MongoDB)",',
  '    "Full-Stack TypeScript (React/Next, Node)"',
  '  ],',
  '  "frameworks": {',
  '    "frontend": ["React", "Next.js", "Tailwind CSS", "GSAP", "Three.js"],',
  '    "backend": ["Express", "GraphQL", "REST APIs", "Socket.io"]',
  '  },',
  '  "devops": ["Docker", "Nginx", "GitHub Actions", "CI/CD"],',
  '  "status": "System Online, Fully Operational"',
  '}'
];

export default function SkillManifest() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal the IDE window
      gsap.from('.ide-window', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Staggered typing effect for the JSON lines
      gsap.from('.code-line', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        x: -10,
        stagger: 0.05,
        duration: 0.5,
        ease: 'power1.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        
        {/* Left Context */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 glass">
            <Terminal size={14} className="text-[#00f3ff]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#00f3ff]">system_specs.json</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">The Architecture Stack.</h2>
          <p className="text-neutral-400 text-lg leading-relaxed">
            I build robust, scalable systems from the ground up. Whether it's setting up auto-scaling cloud infrastructure or designing complex React architectures that run at 60fps, I ensure every layer of the stack is optimized for performance and security.
          </p>
        </div>

        {/* Right IDE Window */}
        <div className="flex-1 w-full ide-window">
          <div className="glass rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* IDE Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/60 border-b border-white/10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="text-xs font-mono text-neutral-500">system_specs.json — Architect's Editor</div>
              <div className="w-12"></div>
            </div>
            
            {/* IDE Body */}
            <div className="p-6 font-mono text-sm md:text-base leading-relaxed overflow-x-auto text-neutral-300 bg-black/40">
              {systemSpecsList.map((line, index) => {
                // Simple syntax highlighting heuristic for the JSON display
                let highlightedLine = line;
                if (line.includes(':')) {
                  const parts = line.split(':');
                  highlightedLine = `<span class="text-[#00f3ff]">${parts[0]}</span>:${parts[1]}`;
                }
                
                return (
                  <div key={index} className="flex code-line">
                    <span className="text-neutral-600 mr-6 select-none w-6 text-right shrink-0">{index + 1}</span>
                    <span 
                      className="whitespace-pre"
                      dangerouslySetInnerHTML={{ __html: highlightedLine }}
                    />
                  </div>
                );
              })}
              <div className="flex mt-2">
                <span className="text-neutral-600 mr-6 select-none w-6 text-right shrink-0">{systemSpecsList.length + 1}</span>
                <span className="w-2 h-5 bg-[#00f3ff] animate-pulse"></span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
