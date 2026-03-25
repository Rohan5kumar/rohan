import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ProjectModal, Project } from './components/ProjectModal';
import { FluidBackground } from './components/FluidBackground';

const ModalContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const handleOpenModal = (event: CustomEvent<Project>) => {
      setProject(event.detail);
      setIsOpen(true);
    };

    window.addEventListener('open-project-modal' as any, handleOpenModal as any);
    return () => window.removeEventListener('open-project-modal' as any, handleOpenModal as any);
  }, []);

  return (
    <>
      <FluidBackground 
        color1="#06b6d4" // Cyan
        color2="#1e3a8a" // Deep Blue
        backgroundColor="#0b0e14"
        opacity={0.8}
      />
      <ProjectModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        project={project}
      />
    </>
  );
};

import { IntroLoader } from './components/IntroLoader';

// ... (existing code stays)

export const initIntroLoader = (onComplete: () => void) => {
  const container = document.createElement('div');
  container.id = 'intro-loader-root';
  document.body.appendChild(container);

  const root = createRoot(container);
  
  const handleComplete = () => {
    onComplete();
    // Use a small delay before unmounting to allow exit animation to play
    setTimeout(() => {
      root.unmount();
      container.remove();
    }, 2000); // Sufficient time for the 800ms exit + buffer
  };

  root.render(<IntroLoader onComplete={handleComplete} />);
};

export const initModalBridge = () => {
  const container = document.createElement('div');
  container.id = 'project-modal-root';
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<ModalContainer />);
};

export const openProjectModal = (project: Project) => {
  const event = new CustomEvent('open-project-modal', { detail: project });
  window.dispatchEvent(event);
};
