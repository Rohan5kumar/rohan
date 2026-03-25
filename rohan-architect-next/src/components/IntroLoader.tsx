'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = [
  'Hello', 'Konnichiwa', 'Hola', 'Bonjour', 'Привет', 
  '你好', 'Hallo', 'Ciao', '안녕하세요', 'مرحبًا', 
  'Olá', 'Merhaba', 'Γειά σου', 'Hallå', 'नमस्ते'
];

export default function IntroLoader() {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if seen before in session
    const hasSeen = sessionStorage.getItem('hasSeenIntro');
    if (hasSeen) {
      setIsVisible(false);
      return;
    }

    if (index < words.length - 1) {
      const timeout = setTimeout(() => {
        setIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        sessionStorage.setItem('hasSeenIntro', 'true');
        setIsVisible(false);
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  const isFinalWord = index === words.length - 1;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
        >
          <motion.div
            key={index}
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ 
              opacity: 0, 
              scale: isFinalWord ? 2 : 1.1,
              filter: isFinalWord ? 'blur(20px)' : 'blur(5px)'
            }}
            transition={{ 
              duration: isFinalWord ? 0.8 : 0.05,
              ease: isFinalWord ? "easeIn" : "linear"
            }}
            className={`
              text-center select-none cursor-default
              ${isFinalWord ? 'font-teko text-glow font-bold text-[#00f3ff]' : 'font-sans text-white font-medium animate-glitch'}
            `}
            style={{
              fontSize: 'clamp(3rem, 15vw, 10rem)',
              lineHeight: 0.8,
              letterSpacing: isFinalWord ? '0.05em' : 'normal',
              fontFamily: isFinalWord ? 'var(--font-teko)' : 'var(--font-inter)'
            }}
          >
            {words[index]}
          </motion.div>
          
          {/* Subtle Chromatic Aberration Overlay during rapid-fire */}
          {!isFinalWord && (
            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen bg-[radial-gradient(circle_at_50%_50%,_rgba(255,0,0,0.5),_rgba(0,255,0,0.5),_rgba(0,0,255,0.5))] blur-xl animate-pulse"></div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
