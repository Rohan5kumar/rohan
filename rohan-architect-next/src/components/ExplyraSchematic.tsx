'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

export default function ExplyraSchematic() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate data packets (circles) moving along paths
      gsap.to('.data-packet', {
        motionPath: {
          path: '#data-line-1',
          align: '#data-line-1',
          alignOrigin: [0.5, 0.5],
        },
        duration: 2,
        repeat: -1,
        ease: 'none',
        stagger: 0.8
      });

      gsap.to('.data-packet-2', {
        motionPath: {
          path: '#data-line-2',
          align: '#data-line-2',
          alignOrigin: [0.5, 0.5],
        },
        duration: 2.5,
        repeat: -1,
        ease: 'none',
        stagger: 1.2
      });

      // Pulse nodes
      gsap.to('.node-pulse', {
        scale: 1.2,
        opacity: 0.5,
        duration: 1,
        yoyo: true,
        repeat: -1,
        transformOrigin: 'center center',
        ease: 'sine.inOut'
      });
    }, svgRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center relative overflow-hidden bg-black/40 rounded-xl border border-white/5 mb-6">
      <svg
        ref={svgRef}
        viewBox="0 0 400 200"
        className="w-full h-full opacity-80"
      >
        <defs>
          <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00f3ff" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Connection Lines */}
        <path id="data-line-1" d="M 50 100 Q 150 50 200 100 T 350 100" fill="none" stroke="url(#cyanGrad)" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
        <path id="data-line-2" d="M 50 100 Q 150 150 200 100 T 350 100" fill="none" stroke="url(#purpleGrad)" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />

        {/* Nodes */}
        <g transform="translate(50, 100)">
          <circle r="20" fill="#1a1a1a" stroke="#00f3ff" strokeWidth="2" filter="url(#glow)"/>
          <circle r="12" fill="#00f3ff" className="node-pulse"/>
          <text x="-35" y="35" fill="#666" fontSize="10" fontFamily="monospace">API_GATEWAY</text>
        </g>

        <g transform="translate(200, 100)">
          <rect x="-25" y="-25" width="50" height="50" rx="8" fill="#1a1a1a" stroke="#8b5cf6" strokeWidth="2" filter="url(#glow)"/>
          <rect x="-15" y="-15" width="30" height="30" rx="4" fill="#8b5cf6" className="node-pulse"/>
          <text x="-40" y="45" fill="#666" fontSize="10" fontFamily="monospace">AI_ORCHESTRATOR</text>
        </g>

        <g transform="translate(350, 100)">
          <circle r="20" fill="#1a1a1a" stroke="#00f3ff" strokeWidth="2" filter="url(#glow)"/>
          <circle r="12" fill="#00f3ff" className="node-pulse"/>
          <text x="-25" y="35" fill="#666" fontSize="10" fontFamily="monospace">DB_CLUSTER</text>
        </g>

        {/* Data Packets */}
        <circle className="data-packet" r="4" fill="#fff" filter="url(#glow)" />
        <circle className="data-packet" r="4" fill="#fff" filter="url(#glow)" />
        <circle className="data-packet" r="4" fill="#fff" filter="url(#glow)" />
        
        <circle className="data-packet-2" r="4" fill="#fff" filter="url(#glow)" />
        <circle className="data-packet-2" r="4" fill="#fff" filter="url(#glow)" />
      </svg>
      <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/60 px-2 py-1 rounded text-[10px] font-mono border border-white/10 uppercase text-neutral-400">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
        Live Telemetry
      </div>
    </div>
  );
}
