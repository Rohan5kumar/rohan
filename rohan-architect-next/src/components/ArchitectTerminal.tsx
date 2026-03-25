'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ArchitectTerminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'Initialize Secure Connection...' },
    { type: 'system', text: 'Connection Established: PORT 443' },
    { type: 'system', text: 'Type "help" to view available commands.' },
  ]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.terminal-container', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (history.length > 3) {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [history]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const fullCmd = input.trim();
    const cmdParts = fullCmd.split(' ');
    const cmd = cmdParts[0].toLowerCase();
    
    const newHistory = [...history, { type: 'user', text: `rohan@system:~$ ${fullCmd}` }];
    setInput('');
    setHistory(newHistory);

    if (cmd === 'contact') {
      const emailMatch = cmdParts.find(p => p.includes('@') && p.includes('.'));
      
      if (!emailMatch) {
        setHistory(prev => [...prev, { 
          type: 'system', 
          text: 'Usage: contact <your_email> [optional_message]' 
        }]);
        return;
      }

      const messageParts = cmdParts.slice(cmdParts.indexOf(emailMatch) + 1);
      const message = messageParts.length > 0 ? messageParts.join(' ').replace(/["']/g, '') : '';

      setHistory(prev => [...prev, { 
        type: 'system', 
        text: `Initiating connection protocol to ${emailMatch}...` 
      }]);

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailMatch, message }),
        });
        
        const data = await response.json();

        if (response.ok) {
          setHistory(prev => [...prev, { 
            type: 'system', 
            text: '[ 200 OK ] Connection confirmed. Watch your inbox for the handshake receipt.' 
          }]);
        } else {
          setHistory(prev => [...prev, { 
            type: 'system', 
            text: `[ ERR ] Transmission failed: ${data.error || 'Server rejected transaction.'}` 
          }]);
        }
      } catch (err) {
        setHistory(prev => [...prev, { 
          type: 'system', 
          text: '[ ERR ] Network layer timeout.' 
        }]);
      }
      return;
    }

    setTimeout(() => {
      let response = '';
      switch (cmd) {
        case 'help':
          response = 'Available commands: about, skills, contact <email> <msg>, clear';
          break;
        case 'about':
          response = 'System Architect specializing in high-performance computing and resilient infrastructure.';
          break;
        case 'skills':
          response = 'React/Next.js, TypeScript, PostgreSQL, Docker, AWS, GSAP, WebGL.';
          break;
        case 'clear':
          setHistory([]);
          return;
        default:
          response = `Command not recognized: ${cmd}. Type "help" for a list of commands.`;
      }
      setHistory(prev => [...prev, { type: 'system', text: response }]);
    }, 400);
  };

  return (
    <section ref={containerRef} className="py-24 px-6 md:px-12 lg:px-24 mb-12">
      <div className="max-w-4xl mx-auto terminal-container">
        <div className="glass rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,243,255,0.1)]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-black/80 border-b border-white/10">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="text-xs font-mono text-neutral-500">rohan@system-architect:~ — bash</div>
            <div className="w-12"></div>
          </div>
          
          {/* Terminal Body */}
          <div 
            className="p-6 h-[400px] overflow-y-auto bg-black/60 font-mono text-sm md:text-base cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            {history.map((line, idx) => (
              <div 
                key={idx} 
                className={`mb-2 ${line.type === 'system' ? 'text-[#00f3ff]' : 'text-white'}`}
              >
                {line.text}
              </div>
            ))}
            
            <form onSubmit={handleCommand} className="flex">
              <span className="text-green-400 mr-2">rohan@system:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent outline-none border-none text-white caret-[#00f3ff]"
                autoComplete="off"
                spellCheck="false"
              />
            </form>
            <div ref={endRef} />
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-[#00f3ff] font-mono text-xs uppercase tracking-[0.2em] opacity-80 animate-pulse">
            Architecting the future of enterprise finance at Explyra by transforming fragmented data into secure, AI-driven infrastructure for the global SSB ecosystem.
          </p>
        </div>
      </div>
    </section>
  );
}
