import './index.css';
import { createIcons, Github, Linkedin, Mail, ArrowRight, Download, Code2, Terminal, ExternalLink, ArrowLeft, Send, Bot, User, Loader2, CheckCircle2, ChevronLeft, ChevronRight, X, Sparkles, Menu, Cpu, BookOpen, Activity, Play, WifiOff, Star, MessageSquare, Zap, ShieldCheck, Layout, Database, Server, Gamepad2, Award, Book, AlertCircle } from 'lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import confetti from 'canvas-confetti';
import { GoogleGenAI } from "@google/genai";
import mermaid from 'mermaid';
import { initModalBridge } from './modalBridge';
import { initBackground } from './components/Background';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif',
});

gsap.registerPlugin(ScrollTrigger);

// --- State ---
let currentTheme = localStorage.getItem('portfolio-theme') || 'primary';

const ventures = [
  {
    company: 'Explyra',
    role: 'Co-founder & Lead Architect',
    period: '2024 - Present',
    description: 'Revolutionizing expense management through AI-driven infrastructure. Built a high-performance system capable of processing real-time financial data with zero-latency overhead.',
    type: 'founder',
    achievements: [
      'Designed scalable architecture handling 10K+ transactions/sec',
      'Implemented AI engine reducing manual entry by 80%',
      'Led product roadmap from MVP to scaling phase'
    ],
    tech: ['Node.js', 'AI Integration', 'Secure Data Architecture', 'Real-time Processing'],
    status: 'Active Development'
  },
  {
    company: 'Lumina AI',
    role: 'Full Stack Developer & System Designer',
    period: '2025 - Present',
    description: 'Advanced AI-powered analytics platform with intelligent data visualization and predictive modeling capabilities.',
    type: 'venture',
    achievements: [
      'Built real-time data processing pipeline',
      'Implemented responsive dashboard system',
      'Optimized query performance by 60%'
    ],
    tech: ['React', 'Python', 'PostgreSQL', 'WebSocket'],
    status: 'Scaling'
  }
];

const experience = [
  {
    company: 'TechVision AI',
    role: 'Lead Full Stack Developer',
    period: '2025 - Present',
    description: 'Leading the development of next-generation AI tools and scalable web architectures.',
    achievements: ['Reduced server latency by 40%', 'Implemented automated CI/CD pipelines', 'Mentored junior developers']
  },
  {
    company: 'InnovateWeb Solutions',
    role: 'Full Stack Intern',
    period: '2024 - 2025',
    description: 'Contributed to the development of high-traffic e-commerce platforms and client-facing dashboards.',
    achievements: ['Developed 5+ reusable UI components', 'Optimized database queries for faster load times']
  }
];

const testimonials = [
  { name: "Sarah Johnson", role: "CEO at TechStart", content: "Rohan is a rare talent. His ability to grasp complex AI concepts and translate them into functional web features is truly impressive.", avatar: "https://i.pravatar.cc/150?u=sarah" },
  { name: "Michael Chen", role: "Product Manager", content: "Working with Rohan was a breeze. He is professional, communicative, and delivers high-quality code on time.", avatar: "https://i.pravatar.cc/150?u=michael" },
  { name: "Elena Rodriguez", role: "Creative Director", content: "Rohan has a great eye for design. He doesn't just build features; he builds experiences that users love.", avatar: "https://i.pravatar.cc/150?u=elena" },
  { name: "Alex Rivera", role: "CEO, TechFlow", content: "Rohan's ability to blend design with complex AI logic is unparalleled. A true visionary for his age.", avatar: "https://picsum.photos/seed/alex/100/100" },
  { name: "Sarah Chen", role: "Product Manager, Innovate", content: "The portfolio he built for our startup exceeded all expectations. Fast, responsive, and beautiful.", avatar: "https://picsum.photos/seed/sarah/100/100" },
  { name: "James Wilson", role: "Founder, Nexus AI", content: "Working with Rohan was a breeze. His technical depth in Node.js and React is impressive.", avatar: "https://picsum.photos/seed/james/100/100" },
  { name: "David Kim", role: "CTO, FutureScale", content: "Rohan delivered a high-performance dashboard that our clients love. Highly recommended!", avatar: "https://picsum.photos/seed/david/100/100" },
  { name: "Maya Patel", role: "Lead Dev, CloudNine", content: "His integration of Gemini AI into our workflow saved us hundreds of hours. Brilliant work.", avatar: "https://picsum.photos/seed/maya/100/100" },
  { name: "Robert Taylor", role: "Entrepreneur", content: "A professional through and through. The project was delivered on time and with zero bugs.", avatar: "https://picsum.photos/seed/robert/100/100" },
  { name: "Sophie Martin", role: "Marketing Head, Vibe", content: "The visual storytelling in the web experiences Rohan creates is simply stunning.", avatar: "https://picsum.photos/seed/sophie/100/100" },
  { name: "Liam O'Connor", role: "Developer, ByteSize", content: "Clean code, great architecture, and a fantastic eye for UI/UX. Rohan is a gem.", avatar: "https://picsum.photos/seed/liam/100/100" },
  { name: "Isabella Rossi", role: "Founder, Artify", content: "He transformed our vision into a digital masterpiece. His creativity knows no bounds.", avatar: "https://picsum.photos/seed/isabella/100/100" },
  { name: "Marcus Thorne", role: "CTO, Quantum", content: "Rohan's technical prowess is matched only by his dedication. A top-tier developer.", avatar: "https://picsum.photos/seed/marcus/100/100" },
  { name: "Olivia Vance", role: "Lead Designer, Pixel", content: "The level of detail and polish in Rohan's work is truly exceptional. Highly recommended.", avatar: "https://picsum.photos/seed/olivia/100/100" },
  { name: "Nathan Drake", role: "Explorer, Uncharted", content: "Rohan built a map integration that is literally a treasure. Incredible work.", avatar: "https://picsum.photos/seed/nathan/100/100" }
];

const themes = [
  { id: 'light', name: 'Light', color: '#ffffff' },
  { id: 'primary', name: 'Emerald', color: '#10b981' },
  { id: 'ruby', name: 'Ruby', color: '#ef4444' },
  { id: 'sapphire', name: 'Sapphire', color: '#3b82f6' },
  { id: 'gold', name: 'Gold', color: '#f59e0b' },
  { id: 'purple', name: 'Purple', color: '#a855f7' },
  { id: 'primary', name: 'Cyan', color: '#06b6d4' },
  { id: 'rose', name: 'Rose', color: '#f43f5e' },
  { id: 'amber', name: 'Amber', color: '#fbbf24' },
  { id: 'indigo', name: 'Indigo', color: '#6366f1' },
  { id: 'lime', name: 'Lime', color: '#84cc16' },
  { id: 'teal', name: 'Teal', color: '#0d9488' },
  { id: 'orange', name: 'Orange', color: '#f97316' },
  { id: 'pink', name: 'Pink', color: '#db2777' },
  { id: 'slate', name: 'Slate', color: '#475569' },
  { id: 'sky', name: 'Sky', color: '#0ea5e9' },
];

const blogPosts = [
  { id: 1, title: 'Building with Gemini AI', date: 'Mar 10, 2026', excerpt: 'How I integrated Google\'s latest AI into my portfolio buddy.', category: 'AI' },
  { id: 2, title: 'The Power of Three.js', date: 'Mar 05, 2026', excerpt: 'Creating immersive 3D experiences on the web.', category: 'Web Graphics' },
  { id: 3, title: 'Next-Gen Portfolio Design', date: 'Feb 28, 2026', excerpt: 'Why minimalism and micro-interactions are the future.', category: 'Design' },
];



const techStack = [
  { 
    name: 'React', 
    level: 95, 
    category: 'Frontend', 
    icon: 'Code2', 
    desc: 'Expert in building complex, high-performance SPAs with advanced state management and custom hooks.',
    fact: 'React was originally created by Jordan Walke, a software engineer at Facebook, who released an early prototype called "FaxJS".',
    link: 'https://react.dev',
    related: ['Next.js', 'Redux', 'TypeScript']
  },
  { 
    name: 'Node.js', 
    level: 90, 
    category: 'Backend', 
    icon: 'Terminal', 
    desc: 'Proficient in developing scalable RESTful APIs and microservices using Express and modern middleware.',
    fact: 'Node.js uses the V8 JavaScript engine, the same engine that powers Google Chrome.',
    link: 'https://nodejs.org',
    related: ['Express', 'MongoDB', 'Docker']
  },
  { 
    name: 'TypeScript', 
    level: 92, 
    category: 'Language', 
    icon: 'Code2', 
    desc: 'Strong advocate for type safety, utilizing advanced types and interfaces for robust codebase maintenance.',
    fact: 'TypeScript was developed and is maintained by Microsoft, with Anders Hejlsberg (lead architect of C#) as its creator.',
    link: 'https://www.typescriptlang.org',
    related: ['React', 'Node.js', 'GraphQL']
  },
  { 
    name: 'Next.js', 
    level: 88, 
    category: 'Frontend', 
    icon: 'Sparkles', 
    desc: 'Experienced in SSR, SSG, and ISR patterns to optimize performance and SEO for modern web applications.',
    fact: 'Next.js was created by Vercel and is used by major companies like Netflix, TikTok, and Twitch.',
    link: 'https://nextjs.org',
    related: ['React', 'Tailwind', 'Vercel']
  },
  { 
    name: 'Three.js', 
    level: 75, 
    category: 'Graphics', 
    icon: 'Cpu', 
    desc: 'Creating immersive 3D web experiences using WebGL, custom shaders, and complex geometry animations.',
    fact: 'Three.js was first released by Ricardo Cabello (Mr.doob) in 2010 and has become the industry standard for web 3D.',
    link: 'https://threejs.org',
    related: ['WebGL', 'GSAP', 'Blender']
  },
  { 
    name: 'Tailwind', 
    level: 98, 
    category: 'Styling', 
    icon: 'Sparkles', 
    desc: 'Master of utility-first CSS, building highly responsive and pixel-perfect interfaces with rapid prototyping.',
    fact: 'Tailwind CSS was created by Adam Wathan and was originally built as a set of utility classes for a side project.',
    link: 'https://tailwindcss.com',
    related: ['PostCSS', 'React', 'Next.js']
  },
  { 
    name: 'PostgreSQL', 
    level: 85, 
    category: 'Database', 
    icon: 'Terminal', 
    desc: 'Skilled in relational database design, complex queries, and performance optimization for data-heavy apps.',
    fact: 'PostgreSQL is often called "the world\'s most advanced open source relational database".',
    link: 'https://www.postgresql.org',
    related: ['Prisma', 'Node.js', 'SQL']
  },
  { 
    name: 'MongoDB', 
    level: 82, 
    category: 'Database', 
    icon: 'Terminal', 
    desc: 'Proficient in NoSQL document modeling and aggregation pipelines for flexible and scalable data storage.',
    fact: 'The name "Mongo" is derived from the word "humongous".',
    link: 'https://www.mongodb.com',
    related: ['Mongoose', 'Node.js', 'Express']
  },
  { 
    name: 'Docker', 
    level: 70, 
    category: 'DevOps', 
    icon: 'Cpu', 
    desc: 'Containerizing applications for consistent development and deployment environments across various platforms.',
    fact: 'Docker was originally an internal project at a company called dotCloud.',
    link: 'https://www.docker.com',
    related: ['Kubernetes', 'AWS', 'CI/CD']
  },
  { 
    name: 'AWS', 
    level: 65, 
    category: 'Cloud', 
    icon: 'Sparkles', 
    desc: 'Deploying and managing cloud infrastructure using EC2, S3, and Lambda for serverless architectures.',
    fact: 'AWS launched its first services in 2006, with SQS being the very first.',
    link: 'https://aws.amazon.com',
    related: ['Terraform', 'Docker', 'Serverless']
  },
  { 
    name: 'GraphQL', 
    level: 80, 
    category: 'API', 
    icon: 'Activity', 
    desc: 'Designing efficient data fetching schemas with Apollo Client/Server to minimize over-fetching and latency.',
    fact: 'GraphQL was developed internally by Facebook in 2012 before being publicly released in 2015.',
    link: 'https://graphql.org',
    related: ['Apollo', 'TypeScript', 'Node.js']
  },
  { 
    name: 'Python', 
    level: 85, 
    category: 'Language', 
    icon: 'Terminal', 
    desc: 'Utilizing Python for data analysis, automation scripts, and backend development with Django/Flask.',
    fact: 'Python was named after the British comedy group Monty Python, not the snake.',
    link: 'https://www.python.org',
    related: ['Django', 'Flask', 'Pandas']
  },
  { 
    name: 'Git', 
    level: 90, 
    category: 'Tool', 
    icon: 'Github', 
    desc: 'Advanced version control workflows, including branching strategies, rebasing, and collaborative code reviews.',
    fact: 'Git was created by Linus Torvalds in 2005 for development of the Linux kernel.',
    link: 'https://git-scm.com',
    related: ['GitHub', 'GitLab', 'Bitbucket']
  },
  { 
    name: 'Figma', 
    level: 75, 
    category: 'Design', 
    icon: 'Sparkles', 
    desc: 'Bridging the gap between design and code by creating high-fidelity prototypes and design systems.',
    fact: 'Figma was the first design tool to offer real-time collaboration in the browser.',
    link: 'https://www.figma.com',
    related: ['Adobe XD', 'Sketch', 'UI/UX']
  },
  { 
    name: 'Redis', 
    level: 70, 
    category: 'Database', 
    icon: 'Activity', 
    desc: 'Implementing high-speed caching layers and real-time data structures for low-latency applications.',
    fact: 'Redis stands for "REmote DIctionary Server".',
    link: 'https://redis.io',
    related: ['Node.js', 'Caching', 'Pub/Sub']
  },
  { 
    name: 'Firebase', 
    level: 85, 
    category: 'Backend', 
    icon: 'Sparkles', 
    desc: 'Leveraging BaaS for rapid development, real-time databases, and seamless user authentication.',
    fact: 'Firebase was acquired by Google in 2014.',
    link: 'https://firebase.google.com',
    related: ['Firestore', 'Auth', 'Cloud Functions']
  },
];

// --- Router ---
const routes: Record<string, () => string> = {
  '/': () => renderHome(),
};

async function router() {
  const path = window.location.pathname;
  const app = document.getElementById('app');
  if (!app) return;

  // Page Transition
  gsap.to(app, { opacity: 0, y: -10, duration: 0.2, onComplete: () => {
    // Apply theme
    document.body.setAttribute('data-theme', currentTheme);
    

    if (routes[path]) {
      app.innerHTML = routes[path]();
      if (path === '/') initHome();
    } else {
      app.innerHTML = '<div class="p-20 text-center">404 - Page Not Found</div>';
    }

    gsap.to(app, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    
    createIcons({
      icons: { Github, Linkedin, Mail, ArrowRight, Download, Code2, Terminal, ExternalLink, ArrowLeft, Send, Bot, User, Loader2, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, X, Menu, Cpu, BookOpen, Activity, Play, Star, MessageSquare, Zap, ShieldCheck, Layout, Database, Server, Gamepad2 }
    });

    initCustomCursor();
    
    initScrollProgress();
    initAnimations();
  }});
}


// --- Background Animation (Three.js) ---


function initAnimations() {
  // Hero Entrance Sequence
  const heroTl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 2 } });
  
  // Set initial states
  gsap.set(['#hero-text h1', '#hero-text div', '#hero-text p', '#hero-text button', '#hero-image'], {
    opacity: 0,
    y: 50,
    filter: 'blur(20px)',
    scale: 0.95
  });
  
  heroTl
    .to('#hero-text div', { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 1.2 }, 0.5)
    .to('#hero-text h1', { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)', 
      scale: 1,
      stagger: 0.2,
      duration: 1.5,
      ease: 'power4.out'
    }, '-=0.8')
    .to('#hero-text p', { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 1.2 }, '-=1.2')
    .to('#hero-text button', { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)', 
      scale: 1,
      stagger: 0.1, 
      duration: 1 
    }, '-=1')
    .to('#hero-image', { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)', 
      scale: 1, 
      duration: 2,
      ease: 'expo.out' 
    }, '-=1.5');

  // Hero Parallax Effect
  window.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;

    gsap.to('#hero-image', {
      x: x * 1.5,
      y: y * 1.5,
      duration: 1.5,
      ease: 'power2.out'
    });

    gsap.to('#hero-text', {
      x: -x * 0.5,
      y: -y * 0.5,
      duration: 1.5,
      ease: 'power2.out'
    });
  });

  gsap.utils.toArray('section').forEach((section: any) => {
    if (section.id === 'hero') return;
    gsap.from(section, {
      opacity: 0,
      y: 60,
      filter: 'blur(10px)',
      duration: 1.2,
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  gsap.from('.skill-card', {
    scale: 0.9,
    opacity: 0,
    filter: 'blur(10px)',
    stagger: 0.15,
    duration: 1,
    scrollTrigger: {
      trigger: '.skill-card',
      start: 'top 90%'
    }
  });
}

// --- Custom Cursor with Magnetic Interaction ---
function initCustomCursor() {
  const cursor = document.getElementById('cursor') as HTMLElement;
  const dot = document.getElementById('cursor-dot') as HTMLElement;
  if (!cursor || !dot) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let isMagnetic = false;
  let magneticTarget: Element | null = null;
  let magneticStrength = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Magnetic cursor animation
  function animateCursor() {
    if (isMagnetic && magneticTarget) {
      const rect = magneticTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate magnetic pull
      const deltaX = centerX - mouseX;
      const deltaY = centerY - mouseY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 150;
      
      if (distance < maxDistance) {
        const force = (1 - distance / maxDistance) * magneticStrength;
        cursorX += (mouseX + deltaX * force - cursorX) * 0.2;
        cursorY += (mouseY + deltaY * force - cursorY) * 0.2;
      } else {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
      }
    } else {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
    }

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
    
    requestAnimationFrame(animateCursor);
  }

  document.querySelectorAll('a, button, .tech-pill').forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      isMagnetic = true;
      magneticTarget = el;
      magneticStrength = 0.3; // Adjust magnetic strength
      cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
      cursor.style.backgroundColor = 'var(--primary-glow)';
      cursor.style.mixBlendMode = 'screen';
    });
    
    el.addEventListener('mouseleave', () => {
      isMagnetic = false;
      magneticTarget = null;
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.backgroundColor = 'transparent';
      cursor.style.mixBlendMode = 'normal';
    });
  });

  animateCursor();
}

// --- Scroll Progress ---
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    bar.style.width = scrolled + "%";
  });
}

window.addEventListener('popstate', router);


document.addEventListener('DOMContentLoaded', () => {
  // Initialize new Background system
  initBackground();
  
  // Add global elements
  const body = document.body;
  body.insertAdjacentHTML('afterbegin', `
    <div id="scroll-progress" class="fixed top-0 left-0 h-[2px] bg-primary z-[100] transition-all duration-100 shadow-[0_0_10px_rgba(34,211,238,0.5)]" style="width: 0%"></div>
    <div id="cursor" class="custom-cursor"></div>
    <div id="cursor-dot" class="custom-cursor-dot"></div>
  `);

  initModalBridge();

  document.body.addEventListener('click', e => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href?.startsWith('/')) {
      e.preventDefault();
      window.history.pushState({}, '', href);
      router();
      window.scrollTo(0, 0);
    } else if (href?.startsWith('#')) {
      const id = href.slice(1);
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState({}, '', href);
      } else if (window.location.pathname !== '/') {
        // If we are on a subpage and click a hash link, go home first
        e.preventDefault();
        window.history.pushState({}, '', '/' + href);
        router().then(() => {
          setTimeout(() => {
            const el = document.getElementById(id);
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        });
      }
    }
  });

  // Initialize router
  router();
});

// --- Explyra Architecture Modal ---
function showExplyraArchitecture() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-[300] flex items-center justify-center p-6';
  modal.innerHTML = `
    <div class="glass max-w-4xl w-full max-h-[90vh] overflow-auto rounded-[2.5rem] border-primary/20 p-8 relative">
      <button onclick="this.closest('.fixed').remove()" class="absolute top-4 right-4 p-2 glass rounded-full hover:bg-red-500/20 text-red-400 transition-colors">
        <i data-lucide="x"></i>
      </button>
      
      <div class="mb-8">
        <h3 class="text-3xl font-bold text-white mb-2">Explyra System Architecture</h3>
        <p class="text-neutral-400">AI-Driven Expense Management Infrastructure</p>
      </div>
      
      <!-- Architecture Diagram using Mermaid -->
      <div class="glass p-6 rounded-xl mb-6 border border-white/5">
        <div class="mermaid" id="explyra-architecture">
          graph TD
            A[User Frontend<br/>React + TypeScript] --> B[API Gateway<br/>Express.js + Rate Limiting]
            B --> C[AI Engine<br/>Python + OpenAI API]
            B --> D[Auth Service<br/>JWT + OAuth 2.0]
            B --> E[Data Processing<br/>Node.js + Queue System]
            C --> F[Category Database<br/>PostgreSQL + Redis Cache]
            E --> F
            D --> G[User Database<br/>MongoDB + Encryption]
            F --> H[Analytics Engine<br/>Real-time Processing]
            G --> H
            H --> I[Dashboard<br/>Data Visualization]
            
            style A fill:#06b6d4,stroke:#06b6d4,color:#fff
            style B fill:#10b981,stroke:#10b981,color:#fff
            style C fill:#8b5cf6,stroke:#8b5cf6,color:#fff
            style D fill:#f59e0b,stroke:#f59e0b,color:#fff
            style E fill:#ef4444,stroke:#ef4444,color:#fff
            style F fill:#3b82f6,stroke:#3b82f6,color:#fff
            style G fill:#10b981,stroke:#10b981,color:#fff
            style H fill:#8b5cf6,stroke:#8b5cf6,color:#fff
            style I fill:#06b6d4,stroke:#06b6d4,color:#fff
        </div>
      </div>
      
      <!-- System Specifications -->
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <div class="glass p-6 rounded-xl border border-white/5">
          <h4 class="text-primary font-mono text-sm mb-4">Performance Specifications</h4>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-neutral-400 text-sm">Transaction Throughput</span>
              <span class="text-white font-mono text-sm">10K+/sec</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-400 text-sm">API Response Time</span>
              <span class="text-white font-mono text-sm">&lt;100ms</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-400 text-sm">Data Processing Latency</span>
              <span class="text-white font-mono text-sm">&lt;50ms</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-400 text-sm">System Uptime</span>
              <span class="text-white font-mono text-sm">99.9%</span>
            </div>
          </div>
        </div>
        
        <div class="glass p-6 rounded-xl border border-white/5">
          <h4 class="text-primary font-mono text-sm mb-4">Security & Compliance</h4>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-neutral-400 text-sm">Data Encryption</span>
              <span class="text-white font-mono text-sm">AES-256</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-400 text-sm">Authentication</span>
              <span class="text-white font-mono text-sm">OAuth 2.0 + JWT</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-400 text-sm">Compliance</span>
              <span class="text-white font-mono text-sm">GDPR + SOC2</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-400 text-sm">Backup Strategy</span>
              <span class="text-white font-mono text-sm">Real-time Replication</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tech Stack Details -->
      <div class="glass p-6 rounded-xl border border-white/5">
        <h4 class="text-primary font-mono text-sm mb-4">Technology Stack</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p class="text-xs font-mono text-neutral-500 mb-2">Frontend</p>
            <div class="space-y-1">
              <div class="text-xs text-white">React 18</div>
              <div class="text-xs text-white">TypeScript</div>
              <div class="text-xs text-white">Tailwind CSS</div>
            </div>
          </div>
          <div>
            <p class="text-xs font-mono text-neutral-500 mb-2">Backend</p>
            <div class="space-y-1">
              <div class="text-xs text-white">Node.js</div>
              <div class="text-xs text-white">Express.js</div>
              <div class="text-xs text-white">Python</div>
            </div>
          </div>
          <div>
            <p class="text-xs font-mono text-neutral-500 mb-2">Database</p>
            <div class="space-y-1">
              <div class="text-xs text-white">PostgreSQL</div>
              <div class="text-xs text-white">MongoDB</div>
              <div class="text-xs text-white">Redis</div>
            </div>
          </div>
          <div>
            <p class="text-xs font-mono text-neutral-500 mb-2">Infrastructure</p>
            <div class="space-y-1">
              <div class="text-xs text-white">Docker</div>
              <div class="text-xs text-white">AWS</div>
              <div class="text-xs text-white">CI/CD Pipeline</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  createIcons({ icons: { X } });
  
  // Initialize Mermaid diagram
  if ((window as any).mermaid) {
    const mermaidEl = document.getElementById('explyra-architecture');
    if (mermaidEl) {
      (window as any).mermaid.init(undefined, mermaidEl);
    }
  }
}

// --- Tech Stack Dashboard ---
function showTechStackDashboard() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-[300] flex items-center justify-center p-6';
  modal.innerHTML = `
    <div class="glass max-w-5xl w-full max-h-[90vh] overflow-auto rounded-[2.5rem] border-primary/20 p-8 relative">
      <button onclick="this.closest('.fixed').remove()" class="absolute top-4 right-4 p-2 glass rounded-full hover:bg-red-500/20 text-red-400 transition-colors">
        <i data-lucide="x"></i>
      </button>
      
      <div class="mb-8">
        <h3 class="text-3xl font-bold text-white mb-2">Tech Stack & Tools Dashboard</h3>
        <p class="text-neutral-400">System Architecture & Development Tools</p>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Development Stack -->
        <div class="glass p-6 rounded-xl border border-green-400/20">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            <h4 class="text-green-400 font-mono text-sm">Development</h4>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-xs text-white">React</span>
              <div class="w-16 h-1 bg-green-400/20 rounded">
                <div class="w-14 h-1 bg-green-400 rounded"></div>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-white">Node.js</span>
              <div class="w-16 h-1 bg-green-400/20 rounded">
                <div class="w-15 h-1 bg-green-400 rounded"></div>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-white">TypeScript</span>
              <div class="w-16 h-1 bg-green-400/20 rounded">
                <div class="w-13 h-1 bg-green-400 rounded"></div>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-white">Python</span>
              <div class="w-16 h-1 bg-green-400/20 rounded">
                <div class="w-12 h-1 bg-green-400 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Cloud & DevOps -->
        <div class="glass p-6 rounded-xl border border-blue-400/20">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
            <h4 class="text-blue-400 font-mono text-sm">Cloud & DevOps</h4>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-xs text-white">Netlify</span>
              <div class="w-16 h-1 bg-blue-400/20 rounded">
                <div class="w-14 h-1 bg-blue-400 rounded"></div>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-white">Firebase</span>
              <div class="w-16 h-1 bg-blue-400/20 rounded">
                <div class="w-12 h-1 bg-blue-400 rounded"></div>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-white">Linux (Ubuntu)</span>
              <div class="w-16 h-1 bg-blue-400/20 rounded">
                <div class="w-13 h-1 bg-blue-400 rounded"></div>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-white">Docker</span>
              <div class="w-16 h-1 bg-blue-400/20 rounded">
                <div class="w-11 h-1 bg-blue-400 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Architecture & Design -->
        <div class="glass p-6 rounded-xl border border-purple-400/20">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
            <h4 class="text-purple-400 font-mono text-sm">Architecture & Design</h4>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-xs text-white">System Design</span>
              <div class="w-16 h-1 bg-purple-400/20 rounded">
                <div class="w-15 h-1 bg-purple-400 rounded"></div>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-white">UI/UX (Figma)</span>
              <div class="w-16 h-1 bg-purple-400/20 rounded">
                <div class="w-13 h-1 bg-purple-400 rounded"></div>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-white">Database Schema</span>
              <div class="w-16 h-1 bg-purple-400/20 rounded">
                <div class="w-14 h-1 bg-purple-400 rounded"></div>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-white">API Design</span>
              <div class="w-16 h-1 bg-purple-400/20 rounded">
                <div class="w-15 h-1 bg-purple-400 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Founder Tools -->
        <div class="glass p-6 rounded-xl border border-primary/20">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-2 h-2 bg-primary rounded-full"></div>
            <h4 class="text-primary font-mono text-sm">Founder Tools</h4>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-xs text-white">Git/GitHub</span>
              <div class="w-16 h-1 bg-primary/20 rounded">
                <div class="w-16 h-1 bg-primary rounded"></div>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-white">Agile Methodology</span>
              <div class="w-16 h-1 bg-primary/20 rounded">
                <div class="w-14 h-1 bg-primary rounded"></div>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-white">Product Roadmapping</span>
              <div class="w-16 h-1 bg-primary/20 rounded">
                <div class="w-13 h-1 bg-primary rounded"></div>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-white">Analytics</span>
              <div class="w-16 h-1 bg-primary/20 rounded">
                <div class="w-12 h-1 bg-primary rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  `;
  
  document.body.appendChild(modal);
  createIcons({ icons: { X, Award: Award, ShieldCheck } });
}

// --- Helpers ---

function setupMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggle || !menu) return;

  const toggleMenu = () => {
    const isOpen = menu.classList.contains('opacity-100');
    if (isOpen) {
      menu.classList.add('opacity-0', 'invisible', 'translate-y-4');
      menu.classList.remove('opacity-100', 'visible', 'translate-y-0');
      toggle.innerHTML = '<i data-lucide="menu" class="w-5 h-5"></i>';
    } else {
      menu.classList.remove('opacity-0', 'invisible', 'translate-y-4');
      menu.classList.add('opacity-100', 'visible', 'translate-y-0');
      toggle.innerHTML = '<i data-lucide="x" class="w-5 h-5"></i>';
    }
    createIcons({ icons: { Menu, X } });
  };

  toggle.addEventListener('click', toggleMenu);

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('opacity-0', 'invisible', 'translate-y-4');
      menu.classList.remove('opacity-100', 'visible', 'translate-y-0');
      toggle.innerHTML = '<i data-lucide="menu" class="w-5 h-5"></i>';
      createIcons({ icons: { Menu } });
    });
  });

  // Close on scroll
  window.addEventListener('scroll', () => {
    if (menu.classList.contains('opacity-100')) {
      menu.classList.add('opacity-0', 'invisible', 'translate-y-4');
      menu.classList.remove('opacity-100', 'visible', 'translate-y-0');
      toggle.innerHTML = '<i data-lucide="menu" class="w-5 h-5"></i>';
      createIcons({ icons: { Menu } });
    }
  });
}

// --- Components ---

function renderHome() {
  return `
    <div class="max-w-7xl mx-auto px-6">
      <nav class="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50 px-8 py-3 glass-refined rounded-full flex items-center justify-between" id="main-nav">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black text-black text-lg">R</div>
          <span class="text-xl font-bold tracking-tight text-white">Rohan K.</span>
        </div>
        
        <div class="hidden md:flex items-center gap-8">
          <a href="#hero" class="text-xs font-bold uppercase tracking-widest text-primary hover:bloom-amber transition-all underline-offset-8">Experience</a>
          <a href="#services" class="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-all">Testimonials</a>
          <a href="#skills" class="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-all">Certificates</a>
          <a href="#contact" class="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-all">Contact</a>
        </div>

        <button id="mobile-menu-toggle" class="md:hidden p-2 text-white">
          <i data-lucide="menu" class="w-5 h-5"></i>
        </button>
      </nav>

      <section id="hero" class="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 text-center">
        <div class="max-w-4xl mx-auto" id="hero-text">
          <div class="inline-flex items-center gap-2 px-4 py-2 glass-refined rounded-full text-primary text-[10px] font-mono uppercase tracking-[0.3em] mb-8 animate-pulse">
            FULL-STACK DEVELOPER & ASPIRING SYSTEM ARCHITECT
          </div>
          
          <h1 class="text-7xl md:text-9xl font-black mb-2 sci-fi-header tracking-tighter text-white leading-[0.8]">
            Rohan
          </h1>
          <h1 class="text-7xl md:text-9xl font-black mb-10 sci-fi-header tracking-tighter text-neutral-500 leading-[0.8]">
            Krishnagoudar
          </h1>
          
          <p class="text-neutral-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            I build bridges between complex backend infrastructures and seamless user experiences. 
            Designing scalable, secure, and high-performance web applications.
          </p>
          
          <div class="flex flex-wrap gap-6 justify-center">
            <button id="download-cv" class="group relative px-8 py-4 bg-primary text-black font-black uppercase tracking-widest rounded-xl overflow-hidden hover:scale-105 transition-all">
              <span class="relative z-10">Deploy Vision</span>
              <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
            <button id="see-cv" class="px-8 py-4 glass-refined text-white font-black uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all">
              Architecture
            </button>
          </div>
        </div>

        <div class="mt-20 w-full max-w-5xl mx-auto px-6" id="hero-image">
          <div class="relative aspect-video rounded-3xl overflow-hidden border border-white/10 glass-refined shadow-2xl">
            <img src="/hero-landscape.jpg" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-bg-deep to-transparent opacity-60"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30 group cursor-pointer hover:scale-110 transition-all">
                <i data-lucide="play" class="text-primary w-8 h-8 fill-primary"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      </section>

      <!-- Services Section -->
      <section id="services" class="mb-32">
        <div class="container mx-auto px-6">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-black mb-4">My <span class="text-primary">Services</span></h2>
            <div class="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="glass p-10 rounded-3xl border-primary/20 hover:bg-primary/5 hover:-translate-y-3 transition-all duration-500 group">
              <div class="mb-6">
                <i data-lucide="layout" class="text-primary w-12 h-12 group-hover:scale-110 transition-transform"></i>
              </div>
              <h3 class="text-2xl font-bold mb-4">Web Design</h3>
              <p class="text-text-muted leading-relaxed">
                Creating visually stunning and user-centric designs that elevate your brand and provide seamless experiences.
              </p>
              <a href="#contact" class="inline-block mt-6 text-primary font-bold hover:underline">Learn More →</a>
            </div>
            
            <div class="glass p-10 rounded-3xl border-primary/20 hover:bg-primary/5 hover:-translate-y-3 transition-all duration-500 group">
              <div class="mb-6">
                <i data-lucide="code-2" class="text-primary w-12 h-12 group-hover:scale-110 transition-transform"></i>
              </div>
              <h3 class="text-2xl font-bold mb-4">Web Development</h3>
              <p class="text-text-muted leading-relaxed">
                Building robust, scalable applications with clean code and high performance using modern frameworks.
              </p>
              <a href="#contact" class="inline-block mt-6 text-primary font-bold hover:underline">Learn More →</a>
            </div>
            
            <div class="glass p-10 rounded-3xl border-primary/20 hover:bg-primary/5 hover:-translate-y-3 transition-all duration-500 group">
              <div class="mb-6">
                <i data-lucide="cpu" class="text-primary w-12 h-12 group-hover:scale-110 transition-transform"></i>
              </div>
              <h3 class="text-2xl font-bold mb-4">System Architecture</h3>
              <p class="text-text-muted leading-relaxed">
                Designing complex digital ecosystems and cloud infrastructure optimized for massive scale.
              </p>
              <a href="#contact" class="inline-block mt-6 text-primary font-bold hover:underline">Learn More →</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Bento Grid - Architectural Narrative -->
      <section id="bento" class="mb-32">
        <div class="max-w-7xl mx-auto px-6">
          <div class="text-center mb-16">
            <div class="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-primary text-xs font-mono uppercase tracking-widest border-primary/20 mb-6">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Architectural Portfolio
            </div>
            <h2 class="text-4xl sm:text-5xl font-bold tracking-tighter leading-tight mb-6">
              System <span class="text-primary">Blueprints</span> & <br/>
              <span class="text-neutral-500">Digital Infrastructure</span>
            </h2>
          </div>

          <!-- Bento Grid Layout -->
          <div class="grid grid-cols-1 md:grid-cols-3 auto-rows-[300px] gap-6">
            
            <!-- The Flagship: Explyra (Large Card) -->
            <div class="md:col-span-2 md:row-span-2 glass p-8 rounded-[2.5rem] border-primary/30 relative overflow-hidden group hover:border-primary/50 transition-all duration-700 ring-2 ring-primary/20">
              <div class="absolute top-4 right-4 px-3 py-1 bg-primary/20 text-primary text-xs font-mono rounded-full border border-primary/30">
                <i data-lucide="star" class="w-3 h-3 inline mr-1"></i>Flagship
              </div>
              
              <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all duration-700"></div>
              
              <div class="relative z-10 h-full flex flex-col">
                <div class="flex items-start justify-between mb-6">
                  <div>
                    <h3 class="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                      <div class="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                        <i data-lucide="layout" class="text-primary w-6 h-6"></i>
                      </div>
                      Explyra
                    </h3>
                    <p class="text-primary font-mono text-sm">Co-founder & Lead Architect</p>
                    <p class="text-neutral-500 text-xs font-mono mt-1">2024 - Present</p>
                  </div>
                  <div class="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded-full border border-green-400/30">
                    Active Development
                  </div>
                </div>

                <p class="text-neutral-300 leading-relaxed mb-6 text-lg">
                  Revolutionizing expense management through AI-driven infrastructure. Built a high-performance system capable of processing real-time financial data with zero-latency overhead.
                </p>

                <!-- System Specs Table -->
                <div class="glass p-4 rounded-xl mb-6 border border-white/5">
                  <h4 class="text-primary font-mono text-xs mb-3">SYSTEM SPECIFICATIONS</h4>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-neutral-400 text-xs font-mono">Architecture</span>
                      <span class="text-white font-mono text-xs">Microservices-ready Monolith</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-neutral-400 text-xs font-mono">Authentication</span>
                      <span class="text-white font-mono text-xs">JWT with OAuth2 Integration</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-neutral-400 text-xs font-mono">Data Engine</span>
                      <span class="text-white font-mono text-xs">MongoDB with Aggregation Pipelines</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-neutral-400 text-xs font-mono">Deployment</span>
                      <span class="text-white font-mono text-xs">CI/CD via GitHub Actions to Cloud</span>
                    </div>
                  </div>
                </div>

                <!-- Tech Stack -->
                <div class="flex flex-wrap gap-2 mb-6">
                  ${ventures[0].tech.map(tech => `
                    <span class="px-3 py-1 bg-muted text-xs font-mono rounded-lg border border-white/10">${tech}</span>
                  `).join('')}
                </div>

                <!-- Achievements -->
                <div class="space-y-2 mb-6">
                  ${ventures[0].achievements.map(achievement => `
                    <div class="flex items-center gap-3">
                      <div class="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <p class="text-sm text-neutral-300">${achievement}</p>
                    </div>
                  `).join('')}
                </div>

                <button onclick="showExplyraArchitecture()" class="mt-auto w-full glass hover:bg-primary/10 text-primary font-mono py-3 px-6 rounded-xl transition-all border border-primary/20 hover:border-primary/40 flex items-center justify-center gap-2">
                  <i data-lucide="layout"></i>
                  View System Blueprint
                </button>
              </div>
            </div>

            <!-- The Communication Engine: Lumina (Medium Card) -->
            <div class="glass p-6 rounded-[2.5rem] border-purple-400/20 relative overflow-hidden group hover:border-purple-400/40 transition-all duration-700">
              <div class="absolute top-4 right-4 px-3 py-1 bg-purple-400/20 text-purple-400 text-xs font-mono rounded-full border border-purple-400/30">
                <i data-lucide="wifi" class="w-3 h-3 inline mr-1"></i>Real-time
              </div>
              
              <div class="absolute -top-24 -right-24 w-48 h-48 bg-purple-400/10 blur-3xl rounded-full group-hover:bg-purple-400/20 transition-all duration-700"></div>
              
              <div class="relative z-10 h-full flex flex-col">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <div class="w-8 h-8 bg-purple-400/20 rounded-lg flex items-center justify-center">
                        <i data-lucide="activity" class="text-purple-400 w-4 h-4"></i>
                      </div>
                      Lumina AI
                    </h3>
                    <p class="text-purple-400 font-mono text-xs">Full Stack Developer</p>
                  </div>
                </div>

                <p class="text-neutral-300 text-sm leading-relaxed mb-4">
                  Advanced AI-powered analytics platform with intelligent data visualization and predictive modeling capabilities.
                </p>

                <div class="glass p-3 rounded-xl mb-4 border border-white/5">
                  <div class="flex items-center gap-2 mb-2">
                    <i data-lucide="wifi-off" class="text-purple-400 w-3 h-3"></i>
                    <span class="text-purple-400 font-mono text-xs">Socket.io Integration</span>
                  </div>
                  <p class="text-neutral-400 text-xs">Real-time data processing pipeline with WebSocket connectivity</p>
                </div>

                <div class="mt-auto">
                  <div class="flex flex-wrap gap-1">
                    ${ventures[1].tech.slice(0, 3).map(tech => `
                      <span class="px-2 py-1 bg-muted text-xs font-mono rounded border border-white/10">${tech}</span>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>


            <!-- The Tech Stack: Interactive Pill Cloud (Small Card) -->
            <div class="glass p-6 rounded-[2.5rem] border-amber-400/20 relative overflow-hidden group hover:border-amber-400/40 transition-all duration-700">
              <div class="absolute top-4 right-4 px-3 py-1 bg-amber-400/20 text-amber-400 text-xs font-mono rounded-full border border-amber-400/30">
                <i data-lucide="zap" class="w-3 h-3 inline mr-1"></i>Tools
              </div>
              
              <div class="absolute -top-24 -right-24 w-48 h-48 bg-amber-400/10 blur-3xl rounded-full group-hover:bg-amber-400/20 transition-all duration-700"></div>
              
              <div class="relative z-10">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <div class="w-8 h-8 bg-amber-400/20 rounded-lg flex items-center justify-center">
                    <i data-lucide="cpu" class="text-amber-400 w-4 h-4"></i>
                  </div>
                  Tech Stack
                </h3>

                <div class="flex flex-wrap gap-2">
                  ${['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker'].map(tech => `
                    <span class="tech-pill px-3 py-1 bg-amber-400/10 text-amber-400 text-xs font-mono rounded-full border border-amber-400/20 hover:bg-amber-400/20 transition-colors cursor-pointer" data-tech="${tech}">
                      ${tech}
                    </span>
                  `).join('')}
                </div>
                
                <button onclick="showTechStackDashboard()" class="mt-4 w-full text-amber-400 font-mono text-xs hover:underline">
                  View Full Stack →
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      </section>

      <section id="about" class="mb-32 pt-20">
        <div class="flex flex-col md:flex-row gap-12 items-center">
          <div class="flex-1 space-y-8">
            <div class="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-primary text-xs font-mono uppercase tracking-widest border-primary/20">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Currently learning: Microservices and Kubernetes
            </div>
            <h2 class="text-4xl sm:text-5xl font-bold tracking-tighter leading-tight">
              Full-Stack Developer & <br/>
              <span class="text-neutral-500">Aspiring System Architect</span>
            </h2>
            <div class="glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group mb-6">
              <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all duration-700"></div>
              <p class="text-lg text-neutral-300 leading-relaxed italic mb-6">
                "I build bridges between complex backend infrastructures and seamless user experiences. As a Class 11 student and developer, I focus on creating scalable, secure, and high-performance web applications that solve real-world problems."
              </p>
              <div class="space-y-4 text-neutral-400 leading-relaxed">
                <p>
                  My journey into technology started with a curiosity about how the web scales to millions of users. Today, I specialize in the <strong>MERN stack</strong> (MongoDB, Express, React, Node.js) with a deep interest in <strong>System Architecture</strong>.
                </p>
              </div>
            </div>

            <!-- GitHub Stats Dashboard -->
            <div id="github-stats-container" class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div class="glass p-6 rounded-3xl border-primary/20 flex items-center justify-between animate-pulse">
                <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <i data-lucide="github" class="text-primary w-6 h-6"></i>
                </div>
                <div class="text-right">
                  <p class="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Contributions</p>
                  <p class="text-2xl font-black text-white">Loading...</p>
                </div>
              </div>
              <div class="glass p-6 rounded-3xl border-primary/20 flex items-center justify-between animate-pulse">
                <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <i data-lucide="book" class="text-primary w-6 h-6"></i>
                </div>
                <div class="text-right">
                  <p class="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Projects</p>
                  <p class="text-2xl font-black text-white">Loading...</p>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="glass p-6 rounded-3xl border-white/5 hover:border-primary/30 transition-all">
                <div class="flex items-center gap-3 mb-3">
                  <div class="p-2 bg-primary/10 rounded-lg">
                    <i data-lucide="zap" class="text-primary w-4 h-4"></i>
                  </div>
                  <h4 class="font-bold text-sm">Real-time Optimization</h4>
                </div>
                <p class="text-xs text-neutral-500">Optimized a real-time chat app by implementing WebSockets, reducing latency by 40%.</p>
              </div>
              <div class="glass p-6 rounded-3xl border-white/5 hover:border-primary/30 transition-all">
                <div class="flex items-center gap-3 mb-3">
                  <div class="p-2 bg-primary/10 rounded-lg">
                    <i data-lucide="shield-check" class="text-primary w-4 h-4"></i>
                  </div>
                  <h4 class="font-bold text-sm">Secure Data Persistence</h4>
                </div>
                <p class="text-xs text-neutral-500">Integrated Firebase Auth & Cloud Firestore for secure, scalable data persistence.</p>
              </div>
            </div>
          </div>
          
          <div class="w-full md:w-1/3 space-y-6">
            <div class="glass p-8 rounded-[2.5rem] border-white/5 text-center">
              <div class="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <i data-lucide="layout" class="text-primary w-12 h-12"></i>
              </div>
              <h3 class="text-xl font-bold mb-2">Frontend Architecture</h3>
              <p class="text-sm text-neutral-500">Designing scalable, component-based user interfaces.</p>
            </div>
            <div class="glass p-8 rounded-[2.5rem] border-white/5 text-center">
              <div class="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <i data-lucide="database" class="text-primary w-12 h-12"></i>
              </div>
              <h3 class="text-xl font-bold mb-2">Backend Infrastructure</h3>
              <p class="text-sm text-neutral-500">Building robust, high-performance server-side systems.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" class="mb-32 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 pt-20">
        <div class="skill-card">${renderSkillCard('Frontend', ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Next.js', 'Redux'], 'layout', 'primary')}</div>
        <div class="skill-card">${renderSkillCard('Backend', ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'GraphQL', 'Firebase'], 'database', 'primary')}</div>
        <div class="skill-card">${renderSkillCard('DevOps & Systems', ['Docker', 'Nginx', 'GitHub Actions', 'AWS', 'Vercel', 'Git'], 'server', 'primary')}</div>
      </section>

      <section id="playground" class="mb-32">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 class="text-3xl sm:text-4xl font-bold mb-4">Code Playground</h2>
            <p class="text-neutral-400">Interactive experiments and mini-apps.</p>
          </div>
          <div class="hidden md:block h-px flex-1 bg-muted mx-12 mb-4"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="glass p-8 rounded-3xl space-y-6 group hover:border-primary/30 transition-all duration-500">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <i data-lucide="play" class="text-primary w-5 h-5"></i>
                </div>
                <h3 class="text-xl font-bold">Confetti Cannon</h3>
              </div>
              <button id="confetti-btn" class="bg-primary text-black font-bold py-2 px-6 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/20">Launch</button>
            </div>
            <p class="text-sm text-neutral-400">A simple demonstration of canvas-confetti integration. Click the button to celebrate!</p>
          </div>
          <div class="glass p-8 rounded-3xl space-y-6 group hover:border-primary/30 transition-all duration-500">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <i data-lucide="activity" class="text-primary w-5 h-5"></i>
                </div>
                <h3 class="text-xl font-bold">Theme Randomizer</h3>
              </div>
              <button id="random-theme-btn" class="bg-primary text-black font-bold py-2 px-6 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/20">Randomize</button>
            </div>
            <p class="text-sm text-neutral-400">Can't decide on a color? Let the algorithm choose a random theme for you.</p>
          </div>
          <div class="glass p-8 rounded-3xl space-y-6 group hover:border-purple-400/30 transition-all duration-500">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-3 bg-purple-400/10 rounded-xl group-hover:bg-purple-400/20 transition-colors">
                  <i data-lucide="zap" class="text-purple-400 w-5 h-5"></i>
                </div>
                <h3 class="text-xl font-bold">Particle Wave</h3>
              </div>
              <button id="particle-wave-btn" class="bg-purple-400 text-black font-bold py-2 px-6 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-purple-400/20">Toggle</button>
            </div>
            <p class="text-sm text-neutral-400">Toggle a high-performance 3D particle wave background using Three.js.</p>
          </div>
          <div class="glass p-8 rounded-3xl space-y-6 group hover:border-amber-400/30 transition-all duration-500">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-3 bg-amber-400/10 rounded-xl group-hover:bg-amber-400/20 transition-colors">
                  <i data-lucide="gamepad-2" class="text-amber-400 w-5 h-5"></i>
                </div>
                <h3 class="text-xl font-bold">3D Physics World</h3>
              </div>
              <button id="physics-world-btn" class="bg-amber-400 text-black font-bold py-2 px-6 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-amber-400/20">Enter</button>
            </div>
            <p class="text-sm text-neutral-400">A mini 3D interactive world with physics, inspired by Bruno Simon's portfolio.</p>
          </div>
        </div>
      </section>

      <section id="tech-stack" class="mb-32 overflow-hidden relative group/tech perspective-1000">
        <!-- Premium Background Layer -->
        <div id="tech-stack-bg" class="absolute inset-0 -z-10 opacity-40 pointer-events-none"></div>
        <div class="noise opacity-10"></div>
        <div class="absolute inset-0 bg-adaptive-gradient-y -z-10 pointer-events-none"></div>
        
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 relative z-10">
          <div>
            <h2 class="text-3xl sm:text-4xl font-bold mb-4 flex items-center gap-3">
              <span class="text-primary font-mono text-xl">&lt;/&gt;</span>
              Tech Stack Deep Dive
            </h2>
            <p class="text-neutral-400">The tools and technologies I master.</p>
          </div>
          <div class="hidden md:block h-px flex-1 bg-muted mx-12 mb-4"></div>
        </div>
        
        <div class="flex flex-wrap gap-4 mb-12 justify-center relative z-10">
          ${['All', 'Frontend', 'Backend', 'Language', 'Database', 'DevOps'].map(cat => `
            <button class="tech-filter-btn px-6 py-2 rounded-full border border-white/10 hover:border-primary/50 transition-all text-sm font-mono uppercase tracking-widest ${cat === 'All' ? 'bg-primary text-black border-primary' : ''}" data-category="${cat}">
              ${cat}
            </button>
          `).join('')}
        </div>

        <div class="space-y-8 relative z-10">
          <!-- Row 1: Forward -->
          <div class="relative flex overflow-x-hidden py-4 border-y border-white/5 group/marquee">
            <div class="animate-marquee group-hover/marquee:pause whitespace-nowrap flex gap-8 items-center">
              ${[...techStack.slice(0, 8), ...techStack.slice(0, 8)].map(tech => `
                <div class="tech-marquee-item group/item relative flex items-center gap-6 glass px-8 py-4 rounded-2xl border border-white/5 hover:border-primary/50 transition-all cursor-pointer overflow-hidden" data-name="${tech.name}" data-category="${tech.category}">
                  <div class="absolute inset-0 shimmer opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                  <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform relative z-10">
                    <i data-lucide="${tech.icon.toLowerCase()}" class="text-primary w-6 h-6"></i>
                  </div>
                  <div class="relative z-10">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-lg tracking-tight">${tech.name}</span>
                      <span class="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">${tech.category}</span>
                    </div>
                    <div class="flex items-center gap-3 mt-2">
                      <div class="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div class="h-full bg-primary transition-all duration-1000" style="width: ${tech.level}%"></div>
                      </div>
                      <span class="text-[10px] font-mono text-neutral-500">${tech.level}%</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="absolute inset-y-0 left-0 w-32 bg-adaptive-gradient-r z-10 pointer-events-none"></div>
            <div class="absolute inset-y-0 right-0 w-32 bg-adaptive-gradient-l z-10 pointer-events-none"></div>
          </div>

          <!-- Row 2: Reverse -->
          <div class="relative flex overflow-x-hidden py-4 border-y border-white/5 group/marquee">
            <div class="animate-marquee-reverse group-hover/marquee:pause whitespace-nowrap flex gap-8 items-center">
              ${[...techStack.slice(8), ...techStack.slice(8)].map(tech => `
                <div class="tech-marquee-item group/item relative flex items-center gap-6 glass px-8 py-4 rounded-2xl border border-white/5 hover:border-primary/50 transition-all cursor-pointer overflow-hidden" data-name="${tech.name}" data-category="${tech.category}">
                  <div class="absolute inset-0 shimmer opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                  <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform relative z-10">
                    <i data-lucide="${tech.icon.toLowerCase()}" class="text-primary w-6 h-6"></i>
                  </div>
                  <div class="relative z-10">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-lg tracking-tight">${tech.name}</span>
                      <span class="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">${tech.category}</span>
                    </div>
                    <div class="flex items-center gap-3 mt-2">
                      <div class="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div class="h-full bg-primary transition-all duration-1000" style="width: ${tech.level}%"></div>
                      </div>
                      <span class="text-[10px] font-mono text-neutral-500">${tech.level}%</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="absolute inset-y-0 left-0 w-32 bg-adaptive-gradient-r z-10 pointer-events-none"></div>
            <div class="absolute inset-y-0 right-0 w-32 bg-adaptive-gradient-l z-10 pointer-events-none"></div>
          </div>
        </div>

        <!-- Tech Details Card -->
        <div id="tech-details-card" class="mt-12 glass p-8 rounded-3xl border border-white/5 max-w-3xl mx-auto opacity-0 translate-y-4 transition-all duration-700 relative z-10 overflow-hidden group/card">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-3xl rounded-full animate-pulse"></div>
          
          <div class="relative z-10 flex flex-col md:flex-row gap-8">
            <div class="flex-1">
              <div class="flex items-center gap-6 mb-6">
                <div id="tech-detail-icon" class="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10">
                  <i data-lucide="code-2" class="text-primary w-8 h-8"></i>
                </div>
                <div>
                  <h3 id="tech-detail-name" class="text-3xl font-bold tracking-tighter">Select a Technology</h3>
                  <p id="tech-detail-category" class="text-primary font-mono text-xs uppercase tracking-widest mt-1">Hover to explore</p>
                </div>
              </div>
              
              <div class="space-y-6">
                <div class="flex justify-between text-sm">
                  <span class="text-neutral-400 font-mono uppercase tracking-widest text-[10px]">Expertise Level</span>
                  <span id="tech-detail-level" class="text-white font-bold font-mono">0%</span>
                </div>
                <div class="w-full h-1.5 bg-muted rounded-full overflow-hidden border border-white/5">
                  <div id="tech-detail-progress" class="h-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-1000 ease-out" style="width: 0%"></div>
                </div>
                <div class="p-4 bg-muted rounded-2xl border border-white/5">
                  <p id="tech-detail-desc" class="text-sm text-neutral-400 leading-relaxed italic">"Hover over any technology in the scrolling rows above to see detailed proficiency and insights about my expertise in that area."</p>
                </div>
                
                <div id="tech-detail-extra" class="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-0 transition-opacity duration-500">
                  <div class="glass p-4 rounded-2xl border border-white/5">
                    <div class="flex items-center gap-2 mb-2 text-primary">
                      <i data-lucide="sparkles" class="w-4 h-4"></i>
                      <span class="text-[10px] font-mono uppercase tracking-widest font-bold">Did you know?</span>
                    </div>
                    <p id="tech-detail-fact" class="text-xs text-neutral-300 italic leading-relaxed"></p>
                  </div>
                  <div class="glass p-4 rounded-2xl border border-white/5">
                    <div class="flex items-center gap-2 mb-2 text-primary">
                      <i data-lucide="external-link" class="w-4 h-4"></i>
                      <span class="text-[10px] font-mono uppercase tracking-widest font-bold">Resource</span>
                    </div>
                    <a id="tech-detail-link" href="#" target="_blank" class="text-xs text-primary hover:underline flex items-center gap-2">
                      Official Documentation <i data-lucide="arrow-right" class="w-3 h-3"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div id="tech-detail-related-container" class="w-full md:w-48 opacity-0 transition-opacity duration-500">
              <div class="flex items-center gap-2 mb-4 text-neutral-500">
                <i data-lucide="zap" class="w-4 h-4"></i>
                <span class="text-[10px] font-mono uppercase tracking-widest font-bold">Related Tech</span>
              </div>
              <div id="tech-detail-related" class="flex flex-wrap gap-2">
                <!-- Related tech tags -->
              </div>
            </div>
          </div>
        </div>

        <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="glass p-6 rounded-3xl border border-white/5 text-center group hover:border-primary/30 transition-all">
            <div class="text-3xl font-bold text-primary mb-2">95%</div>
            <div class="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Frontend Mastery</div>
          </div>
          <div class="glass p-6 rounded-3xl border border-white/5 text-center group hover:border-primary/30 transition-all">
            <div class="text-3xl font-bold text-primary mb-2">90%</div>
            <div class="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Backend Architecture</div>
          </div>
          <div class="glass p-6 rounded-3xl border border-white/5 text-center group hover:border-primary/30 transition-all">
            <div class="text-3xl font-bold text-primary mb-2">85%</div>
            <div class="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Cloud & DevOps</div>
          </div>
          <div class="glass p-6 rounded-3xl border border-white/5 text-center group hover:border-primary/30 transition-all">
            <div class="text-3xl font-bold text-primary mb-2">92%</div>
            <div class="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">AI Integration</div>
          </div>
        </div>
      </section>

      <section id="experience" class="mb-32">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 class="text-3xl sm:text-4xl font-bold mb-4">Professional Experience</h2>
            <p class="text-neutral-400">My journey through the tech industry.</p>
          </div>
          <div class="hidden md:block h-px flex-1 bg-muted mx-12 mb-4"></div>
        </div>
        <div class="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
          ${experience.map((exp) => `
            <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div class="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[var(--bg)] text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <i data-lucide="sparkles" class="w-4 h-4"></i>
              </div>
              <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-6 sm:p-8 rounded-3xl shadow-xl transition-all duration-300 hover:border-primary/50">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <h3 class="text-xl font-bold">${exp.role}</h3>
                  <time class="font-mono text-xs text-primary bg-primary/10 px-3 py-1 rounded-full">${exp.period}</time>
                </div>
                <div class="text-neutral-400 font-bold mb-4">${exp.company}</div>
                <p class="text-sm text-neutral-500 mb-6 leading-relaxed">${exp.description}</p>
                <div class="grid grid-cols-1 gap-2">
                  ${exp.achievements.map(a => `
                    <div class="flex items-center justify-between p-3 glass rounded-xl border-none group/achievement hover:bg-primary/5 transition-colors">
                      <div class="flex items-center gap-3">
                        <i data-lucide="check-circle-2" class="text-primary w-4 h-4"></i>
                        <span class="text-xs text-neutral-400 group-hover/achievement:text-ink transition-colors">${a}</span>
                      </div>
                      <i data-lucide="arrow-right" class="w-3 h-3 text-neutral-600 opacity-0 group-hover/achievement:opacity-100 transition-all"></i>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <section id="resume" class="mb-32">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 class="text-3xl sm:text-4xl font-bold mb-4">Academic Records</h2>
            <p class="text-neutral-400">Formal education and foundational knowledge.</p>
          </div>
          <div class="hidden md:block h-px flex-1 bg-muted mx-12 mb-4"></div>
        </div>
        <div class="glass rounded-3xl overflow-hidden border-none">
          <div class="grid grid-cols-1 md:grid-cols-4 glass bg-muted border-none">
            <div class="p-4 text-[10px] font-mono text-neutral-500 uppercase tracking-widest border-r border-muted">Level</div>
            <div class="p-4 text-[10px] font-mono text-neutral-500 uppercase tracking-widest border-r border-muted md:col-span-2">Institution & Focus</div>
            <div class="p-4 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Period</div>
          </div>
          <div class="divide-y divide-muted">
            <div class="grid grid-cols-1 md:grid-cols-4 hover:bg-primary/5 transition-colors group">
              <div class="p-6 text-sm font-bold border-r border-muted flex items-center gap-3">
                <div class="w-2 h-2 bg-primary rounded-full"></div> Class 11
              </div>
              <div class="p-6 md:col-span-2 border-r border-muted">
                <h4 class="font-bold mb-1">Science & Computer Science</h4>
                <p class="text-xs text-neutral-500">Advanced Mathematics, Physics, and CS fundamentals.</p>
              </div>
              <div class="p-6 text-xs font-mono text-neutral-400 flex items-center">2024 - Present</div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 hover:bg-primary/5 transition-colors group">
              <div class="p-6 text-sm font-bold border-r border-muted flex items-center gap-3">
                <div class="w-2 h-2 bg-neutral-600 rounded-full group-hover:bg-primary transition-colors"></div> Secondary
              </div>
              <div class="p-6 md:col-span-2 border-r border-muted">
                <h4 class="font-bold mb-1">General Education</h4>
                <p class="text-xs text-neutral-500">Completed with distinction in all core subjects.</p>
              </div>
              <div class="p-6 text-xs font-mono text-neutral-400 flex items-center">Completed 2024</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section id="testimonials" class="mb-32">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-6xl font-bold mb-4">Client Testimonials</h2>
          <p class="text-neutral-400 max-w-2xl mx-auto">What people say about working with me.</p>
        </div>
        
        <div class="flex flex-col gap-10">
          <!-- Row 1: Scrolling Left -->
          <div class="relative overflow-hidden py-4">
            <div class="flex gap-6 animate-marquee whitespace-nowrap">
              ${[...testimonials.slice(0, 8), ...testimonials.slice(0, 8)].map(t => `
                <div class="glass p-6 sm:p-8 rounded-3xl w-[280px] sm:w-[350px] shrink-0 flex flex-col gap-4">
                  <div class="flex items-center gap-4">
                    <img src="${t.avatar}" alt="${t.name}" class="w-12 h-12 rounded-full border-2 border-primary/20" />
                    <div>
                      <h4 class="font-bold text-ink">${t.name}</h4>
                      <p class="text-xs text-primary">${t.role}</p>
                    </div>
                  </div>
                  <p class="text-sm text-neutral-500 whitespace-normal leading-relaxed italic">"${t.content}"</p>
                  <div class="flex gap-1 text-primary">
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Row 2: Scrolling Right -->
          <div class="relative overflow-hidden py-4">
            <div class="flex gap-6 animate-marquee-reverse whitespace-nowrap">
              ${[...testimonials.slice(8), ...testimonials.slice(8)].map(t => `
                <div class="glass p-6 sm:p-8 rounded-3xl w-[280px] sm:w-[350px] shrink-0 flex flex-col gap-4">
                  <div class="flex items-center gap-4">
                    <img src="${t.avatar}" alt="${t.name}" class="w-12 h-12 rounded-full border-2 border-primary/20" />
                    <div>
                      <h4 class="font-bold text-ink">${t.name}</h4>
                      <p class="text-xs text-primary">${t.role}</p>
                    </div>
                  </div>
                  <p class="text-sm text-neutral-500 whitespace-normal leading-relaxed italic">"${t.content}"</p>
                  <div class="flex gap-1 text-primary">
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </section>

      </section>

      <section id="blog" class="mb-32">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 class="text-3xl sm:text-4xl font-bold mb-4">Technical Insights</h2>
            <p class="text-neutral-400">Deep dives into engineering and design.</p>
          </div>
          <div class="hidden md:block h-px flex-1 bg-white/10 mx-12 mb-4"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          ${blogPosts.map(post => `
            <div class="glass p-8 rounded-3xl hover:border-primary/50 transition-all group cursor-pointer flex flex-col md:flex-row gap-8">
              <div class="w-full md:w-48 h-48 bg-muted rounded-2xl overflow-hidden shrink-0">
                <img src="https://picsum.photos/seed/${post.id}/400/400" alt="${post.title}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700">
              </div>
              <div class="flex flex-col justify-center">
                <div class="flex justify-between items-start mb-4">
                  <span class="text-[10px] font-mono text-primary uppercase tracking-widest">${post.category}</span>
                  <span class="text-[10px] font-mono text-neutral-500 uppercase">${post.date}</span>
                </div>
                <h3 class="text-xl font-bold mb-3 group-hover:text-primary transition-colors">${post.title}</h3>
                <p class="text-sm text-neutral-500 mb-6 leading-relaxed line-clamp-2">${post.excerpt}</p>
                <div class="flex items-center gap-2 text-xs font-bold text-white/60 group-hover:text-white transition-colors">
                  Read Full Article <i data-lucide="arrow-right" class="w-3 h-3"></i>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <section id="contact" class="mb-32">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 class="text-3xl sm:text-4xl font-bold mb-4">Get In Touch</h2>
            <p class="text-neutral-400">Have a question or want to work together? Drop me a message.</p>
          </div>
          <div class="hidden md:block h-px flex-1 bg-white/10 mx-12 mb-4"></div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div class="space-y-8">
            <div class="glass p-8 rounded-3xl space-y-6">
              <h3 class="text-2xl font-bold">Contact Information</h3>
              <p class="text-neutral-400 leading-relaxed">
                I'm currently available for freelance work and open to new opportunities. 
                Whether you have a project in mind or just want to say hi, feel free to reach out!
              </p>
              
              <div class="space-y-4">
                <div class="flex items-center gap-4 group">
                  <div class="p-3 glass rounded-xl group-hover:bg-primary/10 transition-colors">
                    <i data-lucide="mail" class="text-primary w-5 h-5"></i>
                  </div>
                  <div>
                    <p class="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Email</p>
                    <a href="mailto:rkg22122008@gmail.com" class="text-ink hover:text-primary transition-colors">rkg22122008@gmail.com</a>
                  </div>
                </div>
                
                <div class="flex items-center gap-4 group">
                  <div class="p-3 glass rounded-xl group-hover:bg-primary/10 transition-colors">
                    <i data-lucide="linkedin" class="text-primary w-5 h-5"></i>
                  </div>
                  <div>
                    <p class="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">LinkedIn</p>
                    <a href="https://linkedin.com" class="text-ink hover:text-primary transition-colors">linkedin.com/in/rohan-k</a>
                  </div>
                </div>
                
                <div class="flex items-center gap-4 group">
                  <div class="p-3 glass rounded-xl group-hover:bg-primary/10 transition-colors">
                    <i data-lucide="github" class="text-primary w-5 h-5"></i>
                  </div>
                  <div>
                    <p class="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">GitHub</p>
                    <a href="https://github.com" class="text-ink hover:text-primary transition-colors">github.com/rohan-k</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="glass p-8 rounded-3xl bg-primary/5 border-primary/20">
              <div class="flex items-center gap-4">
                <div class="p-3 bg-primary rounded-xl">
                  <i data-lucide="bot" class="text-black w-6 h-6"></i>
                </div>
                <div>
                  <h4 class="font-bold">Chat with my AI</h4>
                  <p class="text-sm text-neutral-400">Try the AI Chatbot in the project showcase for instant answers!</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="glass p-8 rounded-3xl relative overflow-hidden">
            <form id="contact-form" class="space-y-6 relative z-10">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="name" class="text-xs font-mono text-neutral-500 uppercase tracking-widest">Your Name</label>
                  <input type="text" id="name" name="name" required placeholder="John Doe" 
                         class="w-full glass rounded-xl py-4 px-6 focus:outline-none focus:border-primary transition-all">
                </div>
                <div class="space-y-2">
                  <label for="email" class="text-xs font-mono text-neutral-500 uppercase tracking-widest">Email Address</label>
                  <input type="email" id="email" name="email" required placeholder="john@example.com" 
                         class="w-full glass rounded-xl py-4 px-6 focus:outline-none focus:border-primary transition-all">
                </div>
              </div>
              
              <div class="space-y-2">
                <label for="subject" class="text-xs font-mono text-neutral-500 uppercase tracking-widest">Subject</label>
                <input type="text" id="subject" name="subject" required placeholder="Project Inquiry" 
                       class="w-full glass rounded-xl py-4 px-6 focus:outline-none focus:border-primary transition-all">
              </div>
              
              <div class="space-y-2">
                <label for="message" class="text-xs font-mono text-neutral-500 uppercase tracking-widest">Message</label>
                <textarea id="message" name="message" required rows="5" placeholder="Tell me about your project..." 
                          class="w-full glass rounded-xl py-4 px-6 focus:outline-none focus:border-primary transition-all resize-none"></textarea>
              </div>
              
              <button type="submit" id="submit-btn" class="w-full bg-primary hover:opacity-90 text-black font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
                Send Message <i data-lucide="send" class="w-4 h-4"></i>
              </button>
            </form>
            
            <div id="form-success" class="absolute inset-0 bg-[var(--bg)]/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 opacity-0 invisible transition-all duration-500 z-20">
              <div class="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <i data-lucide="check-circle-2" class="text-primary w-10 h-10"></i>
              </div>
              <h3 class="text-3xl font-bold mb-4">Message Sent!</h3>
              <p class="text-neutral-400 mb-8 max-w-sm">
                Thank you for reaching out. I've received your message and will get back to you as soon as possible.
              </p>
              <button id="reset-form" class="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
                Send another message <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer class="text-center text-neutral-600 font-mono text-sm py-12 border-t border-white/5">
        <div class="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div class="flex flex-col items-center p-4 glass rounded-2xl">
            <span class="text-ink font-bold text-xl" id="visitor-count">1,248</span>
            <span class="text-[10px] uppercase tracking-widest mt-1">Visitors</span>
          </div>
          <div class="flex flex-col items-center p-4 glass rounded-2xl">
            <span class="text-ink font-bold text-xl" id="load-speed">0.4s</span>
            <span class="text-[10px] uppercase tracking-widest mt-1">Load Time</span>
          </div>
          <div class="flex flex-col items-center p-4 glass rounded-2xl">
            <span class="text-ink font-bold text-xl">100%</span>
            <span class="text-[10px] uppercase tracking-widest mt-1">Uptime</span>
          </div>
          <div class="flex flex-col items-center p-4 glass rounded-2xl">
            <span class="text-ink font-bold text-xl" id="current-time">00:00</span>
            <span class="text-[10px] uppercase tracking-widest mt-1">Local Time</span>
          </div>
        </div>
        &copy; ${new Date().getFullYear()} Rohan Krishnagoudar. Built with Vanilla JS & Tailwind.
      </footer>

      <!-- AI Buddy Widget -->
      <div id="ai-buddy-container" class="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[100]">
        <button id="ai-buddy-toggle" class="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-full shadow-2xl shadow-primary/20 flex items-center justify-center hover:scale-110 transition-all duration-500 group relative">
          <div class="absolute inset-0 bg-primary rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
          <div class="absolute -top-12 right-0 bg-primary text-black text-xs font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl flex items-center gap-1">
            <i data-lucide="sparkles" class="w-3 h-3"></i> Talk to Buddy!
          </div>
          <i data-lucide="bot" class="text-black w-6 h-6 sm:w-8 sm:h-8 relative z-10 transition-transform duration-500 group-hover:rotate-12"></i>
        </button>

        <div id="ai-buddy-chat" class="absolute bottom-full right-0 mb-4 w-[calc(100vw-2rem)] sm:w-[380px] h-[550px] max-h-[calc(100vh-12rem)] glass rounded-3xl shadow-2xl flex flex-col opacity-0 invisible translate-y-8 scale-95 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden origin-bottom-right">
          <div class="p-6 border-b border-white/10 flex items-center justify-between bg-primary/5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <i data-lucide="bot" class="text-black w-6 h-6"></i>
              </div>
              <div>
                <h3 class="font-bold text-sm">Buddy AI</h3>
                <div class="flex items-center gap-1.5">
                  <div class="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                  <span class="text-[10px] text-primary font-bold uppercase tracking-widest">Online</span>
                </div>
              </div>
            </div>
            <button id="ai-buddy-close" class="p-2 hover:bg-muted rounded-full transition-colors">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>

          <div id="ai-buddy-messages" class="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            <div class="flex gap-3">
              <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <i data-lucide="bot" class="text-primary w-4 h-4"></i>
              </div>
              <div class="bg-muted p-4 rounded-2xl rounded-tl-none text-sm leading-relaxed">
                Hi! I'm Rohan's AI assistant. Ask me anything about his projects, skills, or experience!
              </div>
            </div>
          </div>

          <div class="p-6 border-t border-white/10">
            <form id="ai-buddy-form" class="relative">
              <input type="text" id="ai-buddy-input" placeholder="Ask me something..." 
                     class="w-full glass rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-primary transition-all text-sm">
              <button type="submit" class="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary rounded-xl hover:opacity-90 transition-opacity">
                <i data-lucide="send" class="text-black w-4 h-4"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSkillCard(title: string, skills: string[], icon: string, color: string) {
  const iconColorClass = color === 'primary' ? 'text-primary' : `text-${color}-400`;
  return `
    <div class="glass p-8 rounded-3xl hover:-translate-y-2 transition-all duration-500 group">
      <div class="mb-6 p-4 glass rounded-2xl w-fit group-hover:bg-primary/10 transition-colors">
        <i data-lucide="${icon}" class="${iconColorClass} w-8 h-8"></i>
      </div>
      <h3 class="text-xl font-bold mb-4 group-hover:text-primary transition-colors">${title}</h3>
      <div class="flex flex-wrap gap-2">
        ${skills.map(s => `<span class="px-3 py-1 glass rounded-full text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-none hover:text-primary transition-colors">${s}</span>`).join('')}
      </div>
    </div>
  `;
}

function initTechStackBackground() {
  const container = document.getElementById('tech-stack-bg');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.PlaneGeometry(20, 20, 20, 20);
  const material = new THREE.MeshBasicMaterial({
    color: '#ff004f',
    wireframe: true,
    transparent: true,
    opacity: 0.1
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);

  camera.position.z = 5;
  camera.position.y = 2;

  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.005;
    
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      positions[i + 2] = Math.sin(x * 0.5 + time) * Math.cos(y * 0.5 + time) * 0.5;
    }
    geometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  animate();
}

function applyDeviceSpecificTheme() {
  const ua = navigator.userAgent;
  const isApple = /iPhone|iPad|iPod|Macintosh/.test(ua);
  const isSamsung = /Samsung|SM-/.test(ua);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  if (isApple && isMobile) {
    // Apple Phone: Very Advance Theme (Violet)
    currentTheme = 'violet';
    document.body.setAttribute('data-theme', 'violet');
    document.documentElement.classList.add('apple-theme');
  } else if (isSamsung || (isMobile && !isApple)) {
    // Samsung/Other: Linenant visuals (Emerald)
    currentTheme = 'primary';
    document.body.setAttribute('data-theme', 'primary');
    document.documentElement.classList.add('samsung-theme');
  } else if (!isMobile) {
    // Laptop: Very Advanced Different Theme (Amber)
    currentTheme = 'amber';
    document.body.setAttribute('data-theme', 'amber');
    document.documentElement.classList.add('laptop-theme');
  }
}

async function initHome() {
  applyDeviceSpecificTheme();
  initTechStackBackground();
  setupMobileMenu();
  initTypingAnimation();
  fetchGitHubStats();
  
  // Sticky Nav Logic
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav?.classList.add('glass', 'shadow-2xl', 'py-3');
      nav?.classList.remove('py-4');
    } else {
      nav?.classList.remove('glass', 'shadow-2xl', 'py-3');
      nav?.classList.add('py-4');
    }
  });

  function initTypingAnimation() {
    const roles = ['System Architect', 'Full Stack Developer', 'Co-founder Explyra', 'AI Enthusiast'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingEl = document.getElementById('typing-role');
    
    function type() {
      if (!typingEl) return;
      
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typingEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }
      
      let typeSpeed = isDeleting ? 50 : 100;
      
      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
      }
      
      setTimeout(type, typeSpeed);
    }
    
    type();
  }
  
  // Theme Switcher Logic
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const themeId = btn.getAttribute('data-theme-id') || 'primary';
      currentTheme = themeId;
      localStorage.setItem('portfolio-theme', themeId);
      document.body.setAttribute('data-theme', themeId);
      
      const bgVideo = document.getElementById('bg-video') as HTMLVideoElement;
      if (themeId === 'light') {
        bgVideo?.play().catch(() => {});
      } else {
        bgVideo?.pause();
      }

      // Background theme is now handled by the new BackgroundManager
      
      // Update icons color if needed
      createIcons({
        icons: { Github, Linkedin, Mail, ArrowRight, Download, Code2, Terminal, ExternalLink, ArrowLeft, Send, Bot, User, Loader2, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, X, Menu, Star, MessageSquare, Zap, ShieldCheck, Layout, Database, Server }
      });
    });
  });

  // Performance Dashboard Updates
  const timeEl = document.getElementById('current-time');
  if (timeEl) {
    const updateTime = () => {
      const now = new Date();
      timeEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  const loadSpeedEl = document.getElementById('load-speed');
  if (loadSpeedEl) {
    const loadTime = (performance.now() / 1000).toFixed(2);
    loadSpeedEl.innerText = `${loadTime}s`;
  }

  // Playground Logic
  document.getElementById('confetti-btn')?.addEventListener('click', () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00ff9d', '#00d2ff', '#ffffff']
    });
  });

  document.getElementById('random-theme-btn')?.addEventListener('click', () => {
    const hues = [150, 200, 280, 340, 40, 10];
    const randomHue = hues[Math.floor(Math.random() * hues.length)];
    document.documentElement.style.setProperty('--primary-hue', randomHue.toString());
    document.documentElement.style.setProperty('--primary', `hsl(${randomHue}, 100%, 50%)`);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
      colors: [`hsl(${randomHue}, 100%, 50%)`]
    });
  });

  // Particle Wave Playground
  let particleWaveActive = false;
  let particleWaveCleanup: (() => void) | null = null;
  document.getElementById('particle-wave-btn')?.addEventListener('click', (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    particleWaveActive = !particleWaveActive;
    if (particleWaveActive) {
      particleWaveCleanup = initParticleWave();
      btn.textContent = 'Stop';
      btn.classList.add('bg-purple-600');
    } else {
      if (particleWaveCleanup) particleWaveCleanup();
      btn.textContent = 'Toggle';
      btn.classList.remove('bg-purple-600');
    }
  });

  // 3D Physics World Playground
  let physicsWorldActive = false;
  let physicsWorldCleanup: (() => void) | null = null;
  document.getElementById('physics-world-btn')?.addEventListener('click', (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    physicsWorldActive = !physicsWorldActive;
    if (physicsWorldActive) {
      physicsWorldCleanup = initPhysicsWorld();
      btn.textContent = 'Exit';
      btn.classList.add('bg-amber-600');
    } else {
      if (physicsWorldCleanup) physicsWorldCleanup();
      btn.textContent = 'Enter';
      btn.classList.remove('bg-amber-600');
    }
  });

  // Tech Stack Interactivity
  const marqueeItems = document.querySelectorAll('.tech-marquee-item');
  const detailCard = document.getElementById('tech-details-card');
  const detailName = document.getElementById('tech-detail-name');
  const detailCategory = document.getElementById('tech-detail-category');
  const detailLevel = document.getElementById('tech-detail-level');
  const detailProgress = document.getElementById('tech-detail-progress');
  const detailIcon = document.getElementById('tech-detail-icon');
  const detailDesc = document.getElementById('tech-detail-desc');
  const detailExtra = document.getElementById('tech-detail-extra');
  const detailFact = document.getElementById('tech-detail-fact');
  const detailLink = document.getElementById('tech-detail-link');
  const detailRelatedContainer = document.getElementById('tech-detail-related-container');
  const detailRelated = document.getElementById('tech-detail-related');

  marqueeItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const name = item.getAttribute('data-name');
      const tech = techStack.find(t => t.name === name);
      if (tech && detailCard && detailName && detailCategory && detailLevel && detailProgress && detailIcon && detailDesc) {
        detailCard.classList.remove('opacity-0', 'translate-y-4');
        detailCard.classList.add('opacity-100', 'translate-y-0');
        
        detailName.textContent = tech.name;
        detailCategory.textContent = tech.category;
        detailLevel.textContent = tech.level + '%';
        detailProgress.style.width = tech.level + '%';
        detailDesc.textContent = tech.desc || '';
        
        if (detailExtra && detailFact && detailLink && tech.fact && tech.link) {
          detailExtra.classList.remove('opacity-0');
          detailExtra.classList.add('opacity-100');
          detailFact.textContent = tech.fact;
          (detailLink as HTMLAnchorElement).href = tech.link;
        }

        if (detailRelatedContainer && detailRelated && tech.related) {
          detailRelatedContainer.classList.remove('opacity-0');
          detailRelatedContainer.classList.add('opacity-100');
          detailRelated.innerHTML = tech.related.map(r => `
            <span class="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-neutral-400 hover:text-primary hover:border-primary/30 transition-all cursor-default">
              ${r}
            </span>
          `).join('');
        }
        
        detailIcon.innerHTML = `<i data-lucide="${tech.icon.toLowerCase()}" class="text-primary w-8 h-8"></i>`;
        createIcons({ icons: { Code2, Terminal, Sparkles, Cpu, Activity, Github, ExternalLink, Zap, ArrowRight } });

        // 3D Tilt Effect
        gsap.to(item, {
          scale: 1.1,
          rotateY: 10,
          rotateX: -5,
          duration: 0.4,
          ease: 'power2.out',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)'
        });
      }
    });

    item.addEventListener('mouseleave', () => {
      gsap.to(item, {
        scale: 1,
        rotateY: 0,
        rotateX: 0,
        duration: 0.4,
        ease: 'power2.out',
        boxShadow: 'none'
      });
    });
  });

  const techFilterBtns = document.querySelectorAll('.tech-filter-btn');
  techFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      techFilterBtns.forEach(b => b.classList.remove('bg-primary', 'text-black', 'border-primary'));
      btn.classList.add('bg-primary', 'text-black', 'border-primary');
      
      marqueeItems.forEach(item => {
        const itemName = item.getAttribute('data-name');
        const tech = techStack.find(t => t.name === itemName);
        if (cat === 'All' || tech?.category === cat) {
          gsap.to(item, { opacity: 1, scale: 1, duration: 0.3 });
        } else {
          gsap.to(item, { opacity: 0.2, scale: 0.9, duration: 0.3 });
        }
      });
    });
  });

  // Architect's Tooltip for Tech Pills
  const techPills = document.querySelectorAll('.tech-pill');
  let activeTooltip: HTMLElement | null = null;

  const techDescriptions: Record<string, string> = {
    'React': 'Chosen for its component-based architecture and virtual DOM efficiency',
    'Node.js': 'Selected for event-driven, non-blocking I/O model perfect for real-time apps',
    'TypeScript': 'Implemented for static type checking and enhanced code reliability',
    'Python': 'Utilized for AI/ML capabilities and data processing excellence',
    'AWS': 'Chosen for scalable cloud infrastructure and managed services',
    'Docker': 'Implemented for containerization and consistent deployment environments'
  };

  techPills.forEach(pill => {
    pill.addEventListener('mouseenter', (e) => {
      const tech = pill.getAttribute('data-tech');
      if (!tech || !techDescriptions[tech]) return;

      // Remove existing tooltip
      if (activeTooltip) {
        activeTooltip.remove();
      }

      // Create tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'architect-tooltip fixed z-[200] glass px-4 py-3 rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-sm shadow-[0_8px_32px_rgba(34,211,238,0.2)] opacity-0 pointer-events-none transition-all duration-300';
      tooltip.innerHTML = `
        <div class="flex items-start gap-3">
          <div class="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
          <div>
            <p class="text-primary font-mono text-xs font-bold mb-1">${tech}</p>
            <p class="text-white text-xs leading-relaxed max-w-xs">${techDescriptions[tech]}</p>
          </div>
        </div>
      `;

      document.body.appendChild(tooltip);
      activeTooltip = tooltip;

      // Position tooltip
      const rect = pill.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
      let top = rect.top - tooltipRect.height - 10;

      // Adjust if tooltip goes off screen
      if (left < 10) left = 10;
      if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      if (top < 10) {
        top = rect.bottom + 10;
      }

      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';

      // Animate in
      requestAnimationFrame(() => {
        tooltip.classList.remove('opacity-0');
        tooltip.classList.add('opacity-100');
      });
    });

    pill.addEventListener('mouseleave', () => {
      if (activeTooltip) {
        activeTooltip.classList.remove('opacity-100');
        activeTooltip.classList.add('opacity-0');
        setTimeout(() => {
          if (activeTooltip) {
            activeTooltip.remove();
            activeTooltip = null;
          }
        }, 300);
      }
    });
  });

  document.getElementById('download-cv')?.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = '/cv.jpeg';
    link.download = 'Rohan_Krishnagoudar_CV.jpeg';
    link.click();
  });

  document.getElementById('see-cv')?.addEventListener('click', () => {
    window.open('/cv.jpeg', '_blank');
  });

  document.getElementById('view-resume')?.addEventListener('click', () => {
    window.open('/rohan.pdf', '_blank');
  });

  document.getElementById('build-cv')?.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm';
    modal.innerHTML = `
      <div class="glass p-8 rounded-3xl max-w-md w-full space-y-6 text-center animate-bounce-slow">
        <div class="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
          <i data-lucide="sparkles" class="text-primary w-10 h-10"></i>
        </div>
        <h2 class="text-3xl font-bold">AI CV Builder</h2>
        <p class="text-neutral-400">Our AI-powered CV and Resume builder is currently being optimized for your success. Stay tuned for the ultimate career tool!</p>
        <button class="close-modal w-full bg-primary text-black font-bold py-4 rounded-full hover:scale-105 transition-transform">Got it!</button>
      </div>
    `;
    document.body.appendChild(modal);
    createIcons({ icons: { Sparkles } });
    modal.querySelector('.close-modal')?.addEventListener('click', () => modal.remove());
  });



  // Contact Form Handling
  const contactForm = document.getElementById('contact-form') as HTMLFormElement;
  const formSuccess = document.getElementById('form-success');
  const resetBtn = document.getElementById('reset-form');
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;

  if (contactForm && formSuccess && resetBtn && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Disable button and show loading state
      const originalContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Sending...`;
      createIcons({ icons: { Loader2 } });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      formSuccess.classList.remove('invisible', 'opacity-0');
      formSuccess.classList.add('visible', 'opacity-100');
      
      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;
      createIcons({ icons: { Send } });
      
      contactForm.reset();
    });

    resetBtn.addEventListener('click', () => {
      formSuccess.classList.remove('visible', 'opacity-100');
      formSuccess.classList.add('invisible', 'opacity-0');
    });
  }

  // AI Buddy Logic
  const aiContainer = document.getElementById('ai-buddy-container');
  const aiToggle = document.getElementById('ai-buddy-toggle');
  const aiChat = document.getElementById('ai-buddy-chat');
  const aiClose = document.getElementById('ai-buddy-close');
  const aiForm = document.getElementById('ai-buddy-form') as HTMLFormElement;
  const aiInput = document.getElementById('ai-buddy-input') as HTMLInputElement;
  const aiMessages = document.getElementById('ai-buddy-messages');

  if (aiContainer && aiToggle && aiChat && aiClose && aiForm && aiInput && aiMessages) {
    aiToggle.addEventListener('click', () => {
      const isOpen = !aiChat.classList.contains('invisible');
      if (isOpen) {
        aiChat.classList.add('opacity-0', 'invisible', 'translate-y-8', 'scale-95');
      } else {
        aiChat.classList.remove('opacity-0', 'invisible', 'translate-y-8', 'scale-95');
        aiInput.focus();
      }
    });

    aiClose.addEventListener('click', () => {
      aiChat.classList.add('opacity-0', 'invisible', 'translate-y-8', 'scale-95');
    });

    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

    const offlineKnowledge = {
      who: "I'm Buddy, Rohan's personal AI assistant! I'm here to tell you all about his amazing work, even if the internet decides to take a nap. 😴",
      skills: "Rohan is a wizard with React, Node.js, and TypeScript. He also loves playing with AI and 3D graphics! 🧙‍♂️✨",
      projects: "I'm currently updating my project showcase to bring you even more innovative and high-performance applications. Stay tuned! 🚀",
      contact: "You can reach him at rkg22122008@gmail.com. He's always up for a chat about cool tech! 📧",
      education: "He's currently a Class 11 student, balancing school with building the future of the web. Talk about a multitasker! 📚💻",
      fun: "Did you know Rohan can build a full-stack app faster than most people can finish their coffee? ☕️💨",
      default: "That's a great question! While I'm in offline mode, I can tell you about Rohan's skills, projects, or how to contact him. Once we're back online, I can get much more creative! 🌐"
    };

    const getOfflineResponse = (query: string) => {
      const q = query.toLowerCase();
      if (q.includes("who") || q.includes("buddy") || q.includes("rohan")) return offlineKnowledge.who;
      if (q.includes("skill") || q.includes("tech") || q.includes("know")) return offlineKnowledge.skills;
      if (q.includes("project") || q.includes("work") || q.includes("build")) return offlineKnowledge.projects;
      if (q.includes("contact") || q.includes("email") || q.includes("reach")) return offlineKnowledge.contact;
      if (q.includes("education") || q.includes("school") || q.includes("study")) return offlineKnowledge.education;
      if (q.includes("fun") || q.includes("fact") || q.includes("interesting")) return offlineKnowledge.fun;
      return offlineKnowledge.default;
    };

    const addMessage = (text: string, isUser: boolean) => {
      const div = document.createElement('div');
      div.className = `flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`;
      div.innerHTML = `
        <div class="w-8 h-8 ${isUser ? 'bg-primary' : 'bg-primary/10'} rounded-lg flex items-center justify-center shrink-0 shadow-lg">
          <i data-lucide="${isUser ? 'user' : 'bot'}" class="${isUser ? 'text-black' : 'text-primary'} w-4 h-4"></i>
        </div>
        <div class="${isUser ? 'bg-primary/10' : 'bg-muted'} p-4 rounded-2xl ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'} text-sm leading-relaxed max-w-[80%] border border-white/5">
          ${text}
        </div>
      `;
      aiMessages.appendChild(div);
      aiMessages.scrollTop = aiMessages.scrollHeight;
      createIcons({ icons: { Bot, User } });
    };

    aiToggle.addEventListener('click', () => {
      aiChat.classList.toggle('invisible');
      aiChat.classList.toggle('opacity-0');
      aiChat.classList.toggle('translate-y-4');
      if (!aiChat.classList.contains('invisible')) {
        aiInput.focus();
        if (aiMessages.children.length === 0) {
          setTimeout(() => addMessage("Hey there! I'm Buddy. I can tell you all about Rohan's profile. What would you like to know? 😊", false), 500);
        }
      }
    });

    aiClose.addEventListener('click', () => {
      aiChat.classList.add('invisible', 'opacity-0', 'translate-y-4');
    });

    aiForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = aiInput.value.trim();
      if (!query) return;

      addMessage(query, true);
      aiInput.value = '';

      // Loading state
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'flex gap-3';
      loadingDiv.innerHTML = `
        <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
          <i data-lucide="bot" class="text-primary w-4 h-4"></i>
        </div>
        <div class="bg-muted p-4 rounded-2xl rounded-tl-none text-sm leading-relaxed">
          <div class="flex gap-1">
            <div class="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
            <div class="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div class="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        </div>
      `;
      aiMessages.appendChild(loadingDiv);
      aiMessages.scrollTop = aiMessages.scrollHeight;
      createIcons({ icons: { Bot } });

      try {
        let responseText = "";
        if (!navigator.onLine) {
          await new Promise(resolve => setTimeout(resolve, 800)); // Simulate thinking
          responseText = getOfflineResponse(query);
        } else {
          const result = await genAI.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: query,
            config: {
              systemInstruction: "You are Buddy, Rohan's fun and interesting AI Portfolio Buddy. You know everything about Rohan: he's a Class 11 student, a Full Stack Developer (React, Node, TS), and loves AI. Tell interesting facts about him. Be witty, friendly, and use emojis. If the user asks something unrelated, bring it back to Rohan's cool projects or skills."
            }
          });
          responseText = result.text || "I'm a bit lost in the cloud right now! ☁️";
        }
        
        loadingDiv.remove();
        addMessage(responseText, false);
      } catch (error) {
        console.error("AI Error:", error);
        loadingDiv.remove();
        addMessage("I'm a bit lost in the cloud right now! ☁️", false);
      }
    });

    createIcons({ icons: { Github, Linkedin, Mail, ArrowRight, Download, Code2, Terminal, ExternalLink, ArrowLeft, Send, Bot, User, Loader2, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, X, Menu, Cpu, BookOpen, Activity, Play, Star, MessageSquare, Zap, ShieldCheck, Layout, Database, Server } });
  }
}











// Connectivity Manager
function initConnectivityManager() {
  const banner = document.createElement('div');
  banner.id = 'offline-banner';
  banner.className = 'fixed top-0 left-0 w-full bg-red-500/90 text-bg text-center py-2 text-sm font-medium z-[200] transform -translate-y-full transition-transform duration-500 flex items-center justify-center gap-2';
  banner.innerHTML = `<i data-lucide="wifi-off" class="w-4 h-4"></i> You are currently offline. Graphics paused, Buddy AI in offline mode.`;
  document.body.appendChild(banner);
  
  const updateStatus = () => {
    const aiStatusDot = document.querySelector('#ai-buddy-chat .bg-primary');
    const aiStatusText = document.querySelector('#ai-buddy-chat .text-primary');

    if (navigator.onLine) {
      banner.classList.add('-translate-y-full');
      document.body.classList.remove('is-offline');
      if (aiStatusDot) aiStatusDot.classList.replace('bg-red-500', 'bg-primary');
      if (aiStatusText) {
        aiStatusText.textContent = 'Online';
        aiStatusText.classList.replace('text-red-500', 'text-primary');
      }
    } else {
      banner.classList.remove('-translate-y-full');
      document.body.classList.add('is-offline');
      createIcons({ icons: { WifiOff } });
      if (aiStatusDot) aiStatusDot.classList.replace('bg-primary', 'bg-red-500');
      if (aiStatusText) {
        aiStatusText.textContent = 'Offline Mode';
        aiStatusText.classList.replace('text-primary', 'text-red-500');
      }
    }
  };

  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
  updateStatus();
}

initConnectivityManager();

async function fetchGitHubStats() {
  const container = document.getElementById('github-stats-container');
  if (!container) return;

  try {
    const response = await fetch('/.netlify/functions/get-github-stats');
    if (!response.ok) throw new Error('Stats unavailable');
    
    const data = await response.json();
    const contributions = data.contributionsCollection.contributionCalendar.totalContributions;
    const repos = data.repositories.nodes;

    container.innerHTML = `
      <div class="glass p-6 rounded-3xl border-primary/20 flex items-center justify-between group hover:bg-primary/5 transition-all">
        <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <i data-lucide="github" class="text-primary w-6 h-6"></i>
        </div>
        <div class="text-right">
          <p class="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Contributions (Year)</p>
          <p class="text-2xl font-black text-white group-hover:text-primary transition-colors">${contributions}</p>
        </div>
      </div>
      <div class="glass p-6 rounded-3xl border-primary/20 flex items-center justify-between group hover:bg-primary/5 transition-all">
        <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <i data-lucide="book" class="text-primary w-6 h-6"></i>
        </div>
        <div class="text-right">
          <p class="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Active Projects</p>
          <p class="text-2xl font-black text-white group-hover:text-primary transition-colors">${repos.length}</p>
        </div>
      </div>
    `;
    
    // Refresh Lucide icons
    createIcons({ icons: { Github, Book } });
    
  } catch (error) {
    console.error('GitHub Stats Fetch Error:', error);
    container.innerHTML = `
      <div class="col-span-full text-center py-4 text-xs font-mono text-neutral-500">
        <i data-lucide="alert-circle" class="w-4 h-4 inline mr-2 text-primary"></i>
        GitHub Stats temporarily cached offline
      </div>
    `;
    createIcons({ icons: { AlertCircle } });
  }
}

/**
 * Initializes a 3D Particle Wave background using Three.js
 */
function initParticleWave() {
  const container = document.createElement('div');
  container.id = 'particle-wave-container';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.zIndex = '-1';
  container.style.pointerEvents = 'none';
  container.style.opacity = '0.4';
  document.body.appendChild(container);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;
  const numParticles = AMOUNTX * AMOUNTY;
  const positions = new Float32Array(numParticles * 3);
  const scales = new Float32Array(numParticles);

  let i = 0, j = 0;
  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
      positions[i + 1] = 0; // y
      positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z
      scales[j] = 1;
      i += 3;
      j++;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

  const material = new THREE.PointsMaterial({
    color: 0x00ff9d,
    size: 2,
    transparent: true,
    opacity: 0.5
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  let count = 0;
  let animationId: number;

  function animate() {
    animationId = requestAnimationFrame(animate);
    
    const positions = geometry.attributes.position.array as Float32Array;
    const scales = geometry.attributes.scale.array as Float32Array;

    let i = 0, j = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions[i + 1] = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
        scales[j] = (Math.sin((ix + count) * 0.3) + 1) * 8 + (Math.sin((iy + count) * 0.5) + 1) * 8;
        i += 3;
        j++;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.scale.needsUpdate = true;

    renderer.render(scene, camera);
    count += 0.1;
  }

  animate();

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', handleResize);

  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', handleResize);
    renderer.dispose();
    container.remove();
  };
}

/**
 * Initializes a mini 3D Physics World inspired by Bruno Simon
 * Uses Three.js for rendering and Cannon-es for physics
 */
function initPhysicsWorld() {
  const container = document.createElement('div');
  container.id = 'physics-world-container';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.zIndex = '150';
  container.style.background = '#1a1a1a';
  document.body.appendChild(container);

  // Instructions Overlay
  const instructions = document.createElement('div');
  instructions.className = 'fixed top-10 left-1/2 -translate-x-1/2 glass p-6 rounded-2xl z-[160] text-center pointer-events-none';
  instructions.innerHTML = `
    <h3 class="text-xl font-bold mb-2">3D Physics World</h3>
    <p class="text-sm text-neutral-400">Use <b>WASD</b> or <b>Arrows</b> to move the "car".<br>Space to jump. Knock over the boxes!</p>
  `;
  container.appendChild(instructions);

  // --- Three.js Setup ---
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);
  scene.fog = new THREE.Fog(0x1a1a1a, 10, 50);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  scene.add(directionalLight);

  // --- Physics Setup ---
  const world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);
  world.broadphase = new CANNON.SAPBroadphase(world);
  (world.defaultContactMaterial as any).friction = 0.1;

  // Materials
  const groundMaterial = new CANNON.Material('ground');
  const carMaterial = new CANNON.Material('car');
  const contactMaterial = new CANNON.ContactMaterial(groundMaterial, carMaterial, {
    friction: 0.5,
    restitution: 0.3
  });
  world.addContactMaterial(contactMaterial);

  // Ground
  const groundShape = new CANNON.Plane();
  const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(groundBody);

  const groundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);

  // Grid Helper
  const grid = new THREE.GridHelper(100, 50, 0x333333, 0x222222);
  scene.add(grid);

  // Car (Cube)
  const carSize = { w: 1, h: 0.5, d: 2 };
  const carShape = new CANNON.Box(new CANNON.Vec3(carSize.w / 2, carSize.h / 2, carSize.d / 2));
  const carBody = new CANNON.Body({ mass: 5, material: carMaterial });
  carBody.addShape(carShape);
  carBody.position.set(0, 2, 0);
  world.addBody(carBody);

  const carMesh = new THREE.Mesh(
    new THREE.BoxGeometry(carSize.w, carSize.h, carSize.d),
    new THREE.MeshStandardMaterial({ color: 0x00ff9d })
  );
  carMesh.castShadow = true;
  scene.add(carMesh);

  // Boxes to knock over
  const boxes: { mesh: THREE.Mesh, body: CANNON.Body }[] = [];
  for (let i = 0; i < 20; i++) {
    const size = 0.5 + Math.random() * 0.5;
    const boxShape = new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2));
    const boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    boxBody.position.set(
      (Math.random() - 0.5) * 20,
      size / 2,
      (Math.random() - 0.5) * 20
    );
    world.addBody(boxBody);

    const boxMesh = new THREE.Mesh(
      new THREE.BoxGeometry(size, size, size),
      new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff })
    );
    boxMesh.castShadow = true;
    scene.add(boxMesh);
    boxes.push({ mesh: boxMesh, body: boxBody });
  }

  // --- Input Handling ---
  const keys = { w: false, a: false, s: false, d: false, space: false };
  const onKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (key === 'w' || key === 'arrowup') keys.w = true;
    if (key === 'a' || key === 'arrowleft') keys.a = true;
    if (key === 's' || key === 'arrowdown') keys.s = true;
    if (key === 'd' || key === 'arrowright') keys.d = true;
    if (key === ' ') keys.space = true;
  };
  const onKeyUp = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (key === 'w' || key === 'arrowup') keys.w = false;
    if (key === 'a' || key === 'arrowleft') keys.a = false;
    if (key === 's' || key === 'arrowdown') keys.s = false;
    if (key === 'd' || key === 'arrowright') keys.d = false;
    if (key === ' ') keys.space = false;
  };
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  // --- Animation Loop ---
  let animationId: number;
  const clock = new THREE.Clock();

  function animate() {
    animationId = requestAnimationFrame(animate);
    const delta = clock.getDelta();

    // Physics Step
    world.step(1 / 60, delta);

    // Apply Forces to Car
    const force = 20;
    const torque = 5;
    
    if (keys.w) {
      const direction = new CANNON.Vec3(0, 0, -1);
      carBody.quaternion.vmult(direction, direction);
      carBody.applyForce(direction.scale(force), carBody.position);
    }
    if (keys.s) {
      const direction = new CANNON.Vec3(0, 0, 1);
      carBody.quaternion.vmult(direction, direction);
      carBody.applyForce(direction.scale(force), carBody.position);
    }
    if (keys.a) {
      carBody.angularVelocity.y = torque;
    }
    if (keys.d) {
      carBody.angularVelocity.y = -torque;
    }
    if (keys.space && Math.abs(carBody.velocity.y) < 0.1) {
      carBody.applyImpulse(new CANNON.Vec3(0, 15, 0), carBody.position);
    }

    // Sync Meshes with Bodies
    carMesh.position.copy(carBody.position as any);
    carMesh.quaternion.copy(carBody.quaternion as any);

    boxes.forEach(box => {
      box.mesh.position.copy(box.body.position as any);
      box.mesh.quaternion.copy(box.body.quaternion as any);
    });

    // Camera Follow
    const relativeCameraOffset = new THREE.Vector3(0, 5, 10);
    const cameraOffset = relativeCameraOffset.applyMatrix4(carMesh.matrixWorld);
    camera.position.lerp(cameraOffset, 0.1);
    camera.lookAt(carMesh.position);

    renderer.render(scene, camera);
  }

  animate();

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', handleResize);

  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    renderer.dispose();
    container.remove();
  };
}
