import './index.css';
import { createIcons, Github, Linkedin, Mail, ArrowRight, Download, Code2, Terminal, ExternalLink, ArrowLeft, Send, Bot, User, Loader2, CheckCircle2, ChevronLeft, ChevronRight, X, Sparkles, Menu, Cpu, BookOpen, Activity, Play, Search, WifiOff, Star, MessageSquare, Zap, ShieldCheck, Layout, Database, Server, Gamepad2 } from 'lucide';
import { jsPDF } from 'jspdf';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import confetti from 'canvas-confetti';
import { GoogleGenAI } from "@google/genai";
import mermaid from 'mermaid';
import { initModalBridge, openProjectModal } from './modalBridge';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif',
});

gsap.registerPlugin(ScrollTrigger);

// --- State ---
let currentTheme = localStorage.getItem('portfolio-theme') || 'emerald';

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
  },
  {
    company: 'Freelance',
    role: 'Web Developer',
    period: '2023 - 2024',
    description: 'Built custom websites and web applications for various clients across different industries.',
    achievements: ['Delivered 10+ successful projects', 'Maintained 100% client satisfaction rate']
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
  { id: 'emerald', name: 'Emerald', color: '#10b981' },
  { id: 'ruby', name: 'Ruby', color: '#ef4444' },
  { id: 'sapphire', name: 'Sapphire', color: '#3b82f6' },
  { id: 'gold', name: 'Gold', color: '#f59e0b' },
  { id: 'purple', name: 'Purple', color: '#a855f7' },
  { id: 'cyan', name: 'Cyan', color: '#06b6d4' },
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

const certificates = [
  { id: 1, title: 'Professional Portfolio Certification', issuer: 'Rohan Krishnagoudar', date: '2026', link: '/rohan.pdf' },
  { id: 2, title: 'IBM Full Stack Software Developer Professional Certificate', issuer: 'IBM', date: '2024', link: '#' },
  { id: 3, title: 'Google IT Automation with Python Professional Certificate', issuer: 'Google', date: '2023', link: '#' },
  { id: 4, title: 'IBM Data Science Professional Certificate', issuer: 'IBM', date: '2023', link: '#' },
  { id: 5, title: 'Google Cybersecurity Professional Certificate', issuer: 'Google', date: '2024', link: '#' },
  { id: 6, title: 'IBM AI Engineering Professional Certificate', issuer: 'IBM', date: '2024', link: '#' },
  { id: 7, title: 'Google Cloud Digital Leader Training', issuer: 'Google', date: '2023', link: '#' },
  { id: 8, title: 'IBM Applied AI Professional Certificate', issuer: 'IBM', date: '2023', link: '#' },
  { id: 9, title: 'Google UX Design Professional Certificate', issuer: 'Google', date: '2024', link: '#' },
  { id: 10, title: 'IBM Cloud Application Development Foundations', issuer: 'IBM', date: '2023', link: '#' },
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
  gsap.to(app, { opacity: 0, y: -20, duration: 0.3, onComplete: () => {
    // Apply theme
    document.body.setAttribute('data-theme', currentTheme);
    
    const bgVideo = document.getElementById('bg-video') as HTMLVideoElement;
    if (currentTheme === 'light') {
      bgVideo?.play().catch(() => {});
    } else {
      bgVideo?.pause();
    }

    if (routes[path]) {
      app.innerHTML = routes[path]();
      if (path === '/') initHome();
    } else {
      app.innerHTML = '<div class="p-20 text-center">404 - Page Not Found</div>';
    }

    gsap.to(app, { opacity: 1, y: 0, duration: 0.5 });
    
    createIcons({
      icons: { Github, Linkedin, Mail, ArrowRight, Download, Code2, Terminal, ExternalLink, ArrowLeft, Send, Bot, User, Loader2, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, X, Menu, Cpu, BookOpen, Activity, Play, Star, MessageSquare, Zap, ShieldCheck, Layout, Database, Server, Gamepad2 }
    });

    initCustomCursor();
    initThreeWallpaper();
    initHero3D();
    initScrollProgress();
    initAnimations();
  }});
}

function initHero3D() {
  const container = document.getElementById('hero-3d-container');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#10b981';
  const material = new THREE.MeshPhongMaterial({ 
    color: primaryColor,
    emissive: primaryColor,
    emissiveIntensity: 0.5,
    wireframe: true 
  });
  const torusKnot = new THREE.Mesh(geometry, material);
  scene.add(torusKnot);

  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(0, 0, 20);
  scene.add(light);

  camera.position.z = 30;

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) / 100;
    mouseY = (e.clientY - window.innerHeight / 2) / 100;
  });

  function animate() {
    requestAnimationFrame(animate);
    if (!navigator.onLine || currentTheme === 'light') return; // Pause graphics when offline or in light mode
    
    // Subtle mouse parallax
    torusKnot.rotation.x += 0.01 + (mouseY * 0.01);
    torusKnot.rotation.y += 0.01 + (mouseX * 0.01);
    
    renderer.render(scene, camera);
  }

  animate();
}

// --- Background Animation (Three.js) ---
function initThreeWallpaper() {
  const container = document.getElementById('wallpaper-container');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i < 2000; i++) {
    vertices.push(
      THREE.MathUtils.randFloatSpread(2000),
      THREE.MathUtils.randFloatSpread(2000),
      THREE.MathUtils.randFloatSpread(2000)
    );
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#10b981';
  const material = new THREE.PointsMaterial({ color: primaryColor, size: 2, transparent: true, opacity: 0.5 });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  camera.position.z = 500;

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) / 1000;
    mouseY = (e.clientY - window.innerHeight / 2) / 1000;
  });

  function animate() {
    requestAnimationFrame(animate);
    if (!navigator.onLine || currentTheme === 'light') return; // Pause graphics when offline or in light mode
    points.rotation.x += 0.0005 + mouseY;
    points.rotation.y += 0.0005 + mouseX;
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
}

function initAnimations() {
  // Hero Animation
  const heroTl = gsap.timeline();
  
  heroTl.to('#hero-text', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power4.out'
  })
  .to('#hero-image', {
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: 'back.out(1.7)'
  }, '-=0.6');

  // Hero Parallax Effect
  window.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;

    gsap.to('#hero-image', {
      x: x,
      y: y,
      duration: 1,
      ease: 'power2.out'
    });

    gsap.to('#hero-text', {
      x: -x * 0.5,
      y: -y * 0.5,
      duration: 1,
      ease: 'power2.out'
    });
  });

  gsap.utils.toArray('section').forEach((section: any) => {
    if (section.id === 'hero') return; // Skip hero as it has its own animation
    gsap.from(section, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });

  gsap.from('.skill-card', {
    scale: 0.8,
    opacity: 0,
    stagger: 0.2,
    duration: 0.8,
    scrollTrigger: {
      trigger: '.skill-card',
      start: 'top 85%'
    }
  });
}

// --- Custom Cursor ---
function initCustomCursor() {
  const cursor = document.getElementById('cursor') as HTMLElement;
  const dot = document.getElementById('cursor-dot') as HTMLElement;
  if (!cursor || !dot) return;

  window.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
      cursor.style.backgroundColor = 'var(--primary-glow)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.backgroundColor = 'transparent';
    });
  });
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
  // Add global elements
  const body = document.body;
  body.insertAdjacentHTML('afterbegin', `
    <div id="scroll-progress" class="fixed top-0 left-0 h-1 bg-primary z-[100] transition-all duration-100" style="width: 0%"></div>
    <div id="cursor" class="custom-cursor"></div>
    <div id="cursor-dot" class="custom-cursor-dot"></div>
    <video id="bg-video" class="fixed inset-0 w-full h-full object-cover -z-20 opacity-0 transition-opacity duration-1000 pointer-events-none" autoplay muted loop playsinline>
      <source src="/background-video.mp4" type="video/mp4">
    </video>
    <div id="wallpaper-container" class="fixed inset-0 -z-10 pointer-events-none"></div>
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

  router();
});

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
    <div class="max-w-6xl mx-auto px-6 py-12">
      <nav class="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl">
        <div class="glass px-4 sm:px-6 py-2.5 rounded-full flex items-center justify-between shadow-2xl">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span class="text-black font-bold">R</span>
            </div>
            <span class="font-bold hidden sm:block">Rohan K.</span>
          </div>
          
          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center gap-6">
            <a href="#experience" class="text-sm font-medium hover:text-primary transition-colors">Experience</a>
            <a href="#testimonials" class="text-sm font-medium hover:text-primary transition-colors">Testimonials</a>
            <a href="#certs" class="text-sm font-medium hover:text-primary transition-colors">Certificates</a>
            <a href="#contact" class="text-sm font-medium hover:text-primary transition-colors">Contact</a>
          </div>

          <div class="flex items-center gap-2 sm:gap-4">
            <div class="hidden sm:block h-6 w-px bg-muted mx-2"></div>
            <div class="flex items-center gap-1 sm:gap-2">
              <div class="relative group">
                <button id="theme-toggle" class="p-2 hover:bg-muted rounded-full transition-colors">
                  <div class="w-5 h-5 rounded-full bg-primary shadow-primary"></div>
                </button>
                <div class="absolute right-0 top-full mt-4 p-4 glass rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 grid grid-cols-5 gap-2 w-48 shadow-2xl">
                  ${themes.map(t => `
                    <button class="theme-btn w-6 h-6 rounded-full border border-white/20 hover:scale-125 transition-transform" 
                            data-theme-id="${t.id}" 
                            style="background-color: ${t.color}" 
                            title="${t.name}"></button>
                  `).join('')}
                </div>
              </div>
              <!-- Mobile Menu Toggle -->
              <button id="mobile-menu-toggle" class="md:hidden p-2 hover:bg-muted rounded-full transition-colors">
                <i data-lucide="menu" class="w-5 h-5"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Overlay -->
        <div id="mobile-menu" class="absolute top-full left-0 right-0 mt-4 p-6 glass rounded-3xl opacity-0 invisible translate-y-4 transition-all duration-300 md:hidden shadow-2xl">
          <div class="flex flex-col gap-4">
            <a href="#experience" class="mobile-nav-link text-lg font-medium py-2 border-b border-white/5">Experience</a>
            <a href="#testimonials" class="mobile-nav-link text-lg font-medium py-2 border-b border-white/5">Testimonials</a>
            <a href="#certs" class="mobile-nav-link text-lg font-medium py-2 border-b border-white/5">Certificates</a>
            <a href="#contact" class="mobile-nav-link text-lg font-medium py-2 border-b border-white/5">Contact</a>
          </div>
        </div>
      </nav>

      <section id="hero" class="min-h-screen flex flex-col md:flex-row items-center justify-start md:justify-between gap-12 mb-24 pt-32 md:pt-48">
        <div class="flex-1 text-center md:text-left opacity-0 translate-y-4 transition-all duration-1000 ease-out" id="hero-text">
          <span class="text-primary font-mono mb-4 block tracking-widest uppercase text-xs sm:text-sm">
            Full-Stack Developer & Aspiring System Architect
          </span>
          <h1 class="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6 sm:mb-8 tracking-tighter leading-[0.85]">
            Rohan <br class="hidden sm:block" />
            <span class="text-neutral-500">Krishnagoudar</span>
          </h1>
          <p class="text-lg sm:text-xl text-neutral-400 max-w-xl leading-relaxed mb-8 sm:mb-12 mx-auto md:mx-0">
            I build bridges between complex backend infrastructures and seamless user experiences. 
            Designing scalable, secure, and high-performance web applications.
          </p>
          <div class="flex flex-wrap gap-4 sm:gap-6 items-center justify-center md:justify-start">
            <button id="download-cv" class="w-full sm:w-auto bg-primary hover:opacity-90 text-bg font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">
              Download CV <i data-lucide="download"></i>
            </button>
            <button id="see-cv" class="w-full sm:w-auto glass hover:bg-muted text-ink font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 flex items-center justify-center gap-2 border border-white/20">
              See CV <i data-lucide="eye"></i>
            </button>
            <button id="view-resume" class="w-full sm:w-auto bg-cyan-400 hover:bg-cyan-500 text-bg font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              Resume <i data-lucide="file-text"></i>
            </button>
            <a href="#contact" class="w-full sm:w-auto bg-ink hover:bg-opacity-90 text-bg font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg">
              Let's Talk <i data-lucide="message-square"></i>
            </a>
            <div class="flex gap-4">
              <a href="https://github.com" class="p-3 glass rounded-full hover:bg-muted transition-colors"><i data-lucide="github"></i></a>
              <a href="https://linkedin.com" class="p-3 glass rounded-full hover:bg-muted transition-colors"><i data-lucide="linkedin"></i></a>
              <a href="mailto:rkg22122008@gmail.com" class="p-3 glass rounded-full hover:bg-muted transition-colors"><i data-lucide="mail"></i></a>
            </div>
          </div>
        </div>

        <div class="relative flex-1 flex justify-center opacity-0 scale-90 transition-all duration-1000 delay-300 ease-out" id="hero-image">
          <div class="relative w-64 h-80 md:w-80 md:h-[450px]">
            <div class="absolute inset-0 border-2 border-primary/30 rounded-[40px] rotate-6 translate-x-4 translate-y-4"></div>
            <div class="absolute inset-0 border-2 border-white/10 rounded-[40px] -rotate-3 -translate-x-2 -translate-y-2"></div>
            <div class="relative w-full h-full overflow-hidden rounded-[40px] glass group">
              <div id="hero-3d-container" class="absolute inset-0 z-0"></div>
              <img src="/image.jpeg" alt="Rohan Krishnagoudar" class="relative z-10 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 mix-blend-overlay" onerror="this.src='https://picsum.photos/seed/rohan/800/1200'">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-20"></div>
              <div class="absolute bottom-6 left-6 z-30">
                <p class="text-primary font-mono text-xs uppercase tracking-widest">Rohan K.</p>
                <p class="text-white text-sm font-bold">System Architect</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" class="mb-32">
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
            <div class="glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
              <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all duration-700"></div>
              <p class="text-lg text-neutral-300 leading-relaxed italic mb-6">
                "I build bridges between complex backend infrastructures and seamless user experiences. As a Class 11 student and developer, I focus on creating scalable, secure, and high-performance web applications that solve real-world problems."
              </p>
              <div class="space-y-4 text-neutral-400 leading-relaxed">
                <p>
                  My journey into technology started with a curiosity about how the web scales to millions of users. Today, I specialize in the <strong>MERN stack</strong> (MongoDB, Express, React, Node.js) with a deep interest in <strong>System Architecture</strong>.
                </p>
                <p>
                  I don't just build features; I design systems. Whether it's implementing <strong>Role-Based Access Control (RBAC)</strong> in a chat application or optimizing <strong>CI/CD pipelines</strong> for automated deployments, I treat every project as an engineering challenge. My goal is to transition from a full-stack developer to a system architect, focusing on distributed systems and cloud infrastructure.
                </p>
                <p>
                  When I’m not debugging React hooks or configuring Nginx reverse proxies, I’m exploring the world of <strong>Forex trading</strong> and <strong>AI-driven health tools</strong>, constantly looking for ways to merge financial logic with modern software engineering.
                </p>
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
              <div class="glass p-6 rounded-3xl border-white/5 hover:border-cyan-400/30 transition-all">
                <div class="flex items-center gap-3 mb-3">
                  <div class="p-2 bg-cyan-400/10 rounded-lg">
                    <i data-lucide="shield-check" class="text-cyan-400 w-4 h-4"></i>
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
              <div class="w-24 h-24 bg-cyan-400/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <i data-lucide="database" class="text-cyan-400 w-12 h-12"></i>
              </div>
              <h3 class="text-xl font-bold mb-2">Backend Infrastructure</h3>
              <p class="text-sm text-neutral-500">Building robust, high-performance server-side systems.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-32 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        <div class="skill-card">${renderSkillCard('Frontend', ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Next.js', 'Redux'], 'layout', 'primary')}</div>
        <div class="skill-card">${renderSkillCard('Backend', ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'GraphQL', 'Firebase'], 'database', 'cyan')}</div>
        <div class="skill-card">${renderSkillCard('DevOps & Systems', ['Docker', 'Nginx', 'GitHub Actions', 'AWS', 'Vercel', 'Git'], 'server', 'purple')}</div>
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
          <div class="glass p-8 rounded-3xl space-y-6 group hover:border-cyan-400/30 transition-all duration-500">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-3 bg-cyan-400/10 rounded-xl group-hover:bg-cyan-400/20 transition-colors">
                  <i data-lucide="activity" class="text-cyan-400 w-5 h-5"></i>
                </div>
                <h3 class="text-xl font-bold">Theme Randomizer</h3>
              </div>
              <button id="random-theme-btn" class="bg-cyan-400 text-black font-bold py-2 px-6 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-cyan-400/20">Randomize</button>
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

      <section id="certs" class="mb-32">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 class="text-3xl sm:text-4xl font-bold mb-4">Verified Credentials</h2>
            <p class="text-neutral-400">Official certifications from industry leaders.</p>
          </div>
          <div class="hidden md:block h-px flex-1 bg-white/10 mx-12 mb-4"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${certificates.map(c => `
            <div class="glass p-6 rounded-3xl flex items-center justify-between group hover:border-primary/50 transition-all duration-500">
              <div class="flex items-center gap-6">
                <div class="w-16 h-16 glass rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <i data-lucide="check-circle-2" class="text-primary w-8 h-8"></i>
                </div>
                <div>
                  <h3 class="font-bold text-lg group-hover:text-primary transition-colors">${c.title}</h3>
                  <p class="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1">${c.issuer} • ${c.date}</p>
                </div>
              </div>
              <a href="${c.link}" target="_blank" class="p-3 glass rounded-full hover:bg-primary hover:text-black transition-all">
                <i data-lucide="external-link" class="w-5 h-5"></i>
              </a>
            </div>
          `).join('')}
        </div>
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
                  <div class="p-3 glass rounded-xl group-hover:bg-cyan-400/10 transition-colors">
                    <i data-lucide="linkedin" class="text-cyan-400 w-5 h-5"></i>
                  </div>
                  <div>
                    <p class="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">LinkedIn</p>
                    <a href="https://linkedin.com" class="text-ink hover:text-primary transition-colors">linkedin.com/in/rohan-k</a>
                  </div>
                </div>
                
                <div class="flex items-center gap-4 group">
                  <div class="p-3 glass rounded-xl group-hover:bg-rose-400/10 transition-colors">
                    <i data-lucide="github" class="text-rose-400 w-5 h-5"></i>
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
    color: '#10b981',
    wireframe: true,
    transparent: true,
    opacity: 0.05
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
    currentTheme = 'emerald';
    document.body.setAttribute('data-theme', 'emerald');
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
  
  // Theme Switcher Logic
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const themeId = btn.getAttribute('data-theme-id') || 'emerald';
      currentTheme = themeId;
      localStorage.setItem('portfolio-theme', themeId);
      document.body.setAttribute('data-theme', themeId);
      
      const bgVideo = document.getElementById('bg-video') as HTMLVideoElement;
      if (themeId === 'light') {
        bgVideo?.play().catch(() => {});
      } else {
        bgVideo?.pause();
      }
      
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

  document.getElementById('download-cv')?.addEventListener('click', () => {
    generateCV('download');
  });

  document.getElementById('see-cv')?.addEventListener('click', () => {
    generateCV('view');
  });

  document.getElementById('view-resume')?.addEventListener('click', () => {
    generateCV('view');
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

  function generateCV(action: 'download' | 'view') {
    const doc = new jsPDF();
    doc.setFontSize(24);
    doc.setTextColor(16, 185, 129); 
    doc.text("ROHAN KRISHNAGOUDAR", 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("Full Stack Developer | Class 11 Student", 20, 28);
    doc.text("Email: rkg22122008@gmail.com", 20, 34);
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 40, 190, 40);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("EDUCATION", 20, 55);
    doc.setFontSize(12);
    doc.text("Class 11 (Science & Computer Science)", 20, 65);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("2024 - Present", 160, 65);
    doc.text("Focusing on Advanced Mathematics, Physics, and Computer Science.", 20, 70);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("EXPERIENCE", 20, 90);
    doc.setFontSize(12);
    doc.text("Freelance Full Stack Developer", 20, 100);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Built multiple production-ready web applications using React and Node.js.", 20, 107);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("SKILLS", 20, 125);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Frontend: React, TypeScript, Tailwind CSS, Three.js", 20, 135);
    doc.text("Backend: Node.js, Express, PostgreSQL, Firebase", 20, 142);
    doc.text("Tools: Git, Docker, Gemini AI, Vite", 20, 149);

    if (action === 'download') {
      doc.save("Rohan_Krishnagoudar_CV.pdf");
    } else {
      window.open(doc.output('bloburl'), '_blank');
    }
  }

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
        addMessage(getOffl  // Carousel logic removed
size', updateCarousel);

    filterProjects();
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
