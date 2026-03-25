'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, GitBranch, Cpu, Network, Lock, Zap } from 'lucide-react';
import ExplyraSchematic from './ExplyraSchematic';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: 'Explyra',
    tagline: 'High-Performance API Documentation & Delivery',
    description: 'A platform engineered for scale. Explyra unifies enterprise-grade API infrastructure with real-time documentation delivery. Built on Next.js 14 and Postgres.',
    link: 'https://explyra.com',
    github: '#',
    status: 'PRODUCTION',
    specs: ['99.99% Uptime', 'Cache Invalidation <50ms', 'Edge compute'],
    icon: <Network className="text-[#00f3ff]" size={24} />,
    colSpan: 'md:col-span-2 lg:col-span-2',
    rowSpan: 'md:row-span-2',
    primary: true,
  },
  {
    title: 'Lumina',
    tagline: 'AI Orchestration Gateway',
    description: 'Intelligent load balancing and rate-limiting wrapper for LLM endpoints. Minimizes latency while preserving strict zero-trust security.',
    link: '#',
    github: '#',
    status: 'ACTIVE',
    specs: ['Global Rate Limiting', 'Redis Token Bucket'],
    icon: <Cpu className="text-purple-400" size={24} />,
    colSpan: 'md:col-span-1 lg:col-span-1',
    rowSpan: 'md:row-span-1',
  },
  {
    title: 'Zero-Trust Auth',
    tagline: 'Identity & Access Manager',
    description: 'Custom implementation of OAuth2 with granular RBAC.',
    link: '#',
    github: '#',
    status: 'BETA',
    specs: ['Argon2id', 'JWT Revocation'],
    icon: <Lock className="text-green-400" size={24} />,
    colSpan: 'md:col-span-1 lg:col-span-1',
    rowSpan: 'md:row-span-1',
  },
  {
    title: 'Velocity Cache',
    tagline: 'Distributed Memory Store',
    description: 'High throughput key-value store optimized for reading heavy workloads.',
    link: '#',
    github: '#',
    status: 'STABLE',
    specs: ['LRU Eviction', 'Consistent Hashing'],
    icon: <Zap className="text-yellow-400" size={24} />,
    colSpan: 'md:col-span-2 lg:col-span-1',
    rowSpan: 'md:row-span-1',
  }
];

export default function BentoGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.bento-item', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Core Deployments.</h2>
          <p className="text-neutral-400 text-lg">Scalable architecture built for enterprise production environments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(0,1fr)]">
          {projects.map((project, idx) => (
            <div 
              key={idx} 
              className={`bento-item glass rounded-2xl group border border-white/5 hover:border-white/15 transition-all duration-300 relative overflow-hidden flex flex-col ${project.colSpan} ${project.rowSpan}`}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00f3ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="p-8 flex flex-col h-full z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    {project.icon}
                  </div>
                  <div className="flex gap-2">
                    {project.status && (
                      <span className="text-[10px] font-mono tracking-widest px-2 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-400">
                        {project.status}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-2xl font-bold tracking-tight mb-2 group-hover:text-glow transition-all">
                  {project.title}
                </h3>
                <h4 className="text-[#00f3ff] text-xs font-mono tracking-widest uppercase mb-4">
                  {project.tagline}
                </h4>
                
                <p className="text-neutral-400 text-sm leading-relaxed mb-8 flex-grow">
                  {project.description}
                </p>

                {project.primary && <ExplyraSchematic />}

                <div className="space-y-4 mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {project.specs.map((spec, i) => (
                      <span key={i} className="text-xs font-mono text-neutral-500 bg-black/50 px-2 py-1 rounded">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    <a href={project.link} className="text-sm font-semibold flex items-center gap-2 hover:text-[#00f3ff] transition-colors">
                      <ExternalLink size={16} /> View Production
                    </a>
                    <a href={project.github} className="text-sm text-neutral-400 flex items-center gap-2 hover:text-white transition-colors">
                      <GitBranch size={16} /> Source
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
