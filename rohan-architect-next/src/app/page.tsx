'use client';

import { useEffect } from 'react';
import IntroLoader from '@/components/IntroLoader';
import Hero from '@/components/Hero';
import SkillPhysics from '@/components/SkillPhysics';
import BentoGrid from '@/components/BentoGrid';
import ArchitectTerminal from '@/components/ArchitectTerminal';

export default function Home() {
  useEffect(() => {
    console.log("%c [ SYSTEM_ARCHITECT_LOG ] ", "color: #00f3ff; font-weight: bold; background: #000;");
    console.log("%c Status: Connection Secure", "color: #00f3ff;");
    console.log("%c Subject: Rohan Krishnagoudar", "color: #fff;");
    console.log("%c Venture: Co-Founder @ Explyra", "color: #fff;");
    console.log("%c 'Efficiency is the only true currency.'", "font-style: italic; color: #888;");
  }, []);

  return (
    <main className="min-h-screen">
      <IntroLoader />
      <Hero />
      <SkillPhysics />
      <BentoGrid />
      <ArchitectTerminal />
    </main>
  );
}
