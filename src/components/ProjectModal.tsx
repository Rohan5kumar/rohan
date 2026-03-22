import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Zap, Layout, Cpu, CheckCircle2 } from 'lucide-react';

export interface LighthouseScore {
  performance: number;
  accessibility: number;
  seo: number;
}

export interface Project {
  projectTitle: string;
  projectDescription: string;
  techStack: string[];
  systemDiagramURL: string;
  keyArchitecturalWins: string[];
  lighthouseScore: LighthouseScore;
  liveDemoURL: string;
  githubURL: string;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

const ScoreCircle = ({ label, score }: { label: string; score: number }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-white/10"
          />
          <motion.circle
            cx="24"
            cy="24"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className="text-emerald-400"
          />
        </svg>
        <span className="absolute text-[10px] font-bold text-emerald-400">{score}</span>
      </div>
      <span className="text-[9px] font-mono uppercase tracking-tighter text-neutral-500">{label}</span>
    </div>
  );
};

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden glass rounded-[2rem] border border-white/10 bg-[#0b0e14]/90 shadow-2xl flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
            >
              <X className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
            </button>

            {/* Left Column: Visuals & Stats */}
            <div className="w-full md:w-[40%] p-6 sm:p-8 border-b md:border-b-0 md:border-r border-white/10 overflow-y-auto">
              <div className="space-y-8">
                {/* System Diagram */}
                <div>
                  <div className="flex items-center gap-2 mb-4 text-primary">
                    <Layout className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold">System Architecture</span>
                  </div>
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-black/40 group">
                    <img
                      src={project.systemDiagramURL}
                      alt="System Diagram"
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Lighthouse Scores */}
                <div>
                  <div className="flex items-center gap-2 mb-4 text-emerald-400">
                    <Zap className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Performance Metrics</span>
                  </div>
                  <div className="flex justify-between p-4 glass rounded-2xl border-white/5 bg-white/5">
                    <ScoreCircle label="Perf" score={project.lighthouseScore.performance} />
                    <ScoreCircle label="Access" score={project.lighthouseScore.accessibility} />
                    <ScoreCircle label="SEO" score={project.lighthouseScore.seo} />
                  </div>
                </div>

                {/* Links */}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={project.liveDemoURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 glass rounded-xl border-white/10 bg-primary/10 hover:bg-primary/20 transition-all group"
                  >
                    <ExternalLink className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-primary">Live Demo</span>
                  </a>
                  <a
                    href={project.githubURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 glass rounded-xl border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
                  >
                    <Github className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-white">Source Code</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Content */}
            <div className="w-full md:w-[60%] p-6 sm:p-10 overflow-y-auto bg-gradient-to-br from-transparent to-white/[0.02]">
              <div className="max-w-2xl">
                <motion.h2
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60"
                >
                  {project.projectTitle}
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-8"
                >
                  {/* Description */}
                  <div className="prose prose-invert max-w-none">
                    <p className="text-neutral-400 leading-relaxed text-sm sm:text-base">
                      {project.projectDescription}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 text-primary/80">
                      <Cpu className="w-4 h-4" />
                      <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Technology Stack</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 text-[10px] font-mono font-bold text-neutral-300 bg-white/5 border border-white/10 rounded-lg hover:border-primary/30 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Architectural Wins */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 text-emerald-400/80">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Architectural Wins</span>
                    </div>
                    <div className="space-y-3">
                      {project.keyArchitecturalWins.map((win, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-4 glass rounded-2xl border-none bg-white/5 group hover:bg-white/[0.08] transition-colors"
                        >
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                          <p className="text-xs sm:text-sm text-neutral-400 group-hover:text-neutral-200 transition-colors">
                            {win}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
