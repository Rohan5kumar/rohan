'use client';

import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const skills = [
  { name: 'React', color: '#61dafb' },
  { name: 'Next.js', color: '#ffffff' },
  { name: 'Postgres', color: '#336791' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'WebGL', color: '#990000' },
  { name: 'AWS', color: '#ff9900' },
  { name: 'Node.js', color: '#339933' },
  { name: 'Docker', color: '#2496ed' }
];

function SkillNode({ position, name, color }: { position: [number, number, number], name: string, color: string }) {
  const [ref, api] = useBox(() => ({ mass: 1, position, args: [2, 0.8, 0.5] }), useRef<THREE.Mesh>(null));

  // Add slight mouse interaction pushing nodes around
  useFrame((state) => {
    if (ref.current) {
      const mouseX = (state.pointer.x * state.viewport.width) / 2;
      const mouseY = (state.pointer.y * state.viewport.height) / 2;
      
      const nodePos = new THREE.Vector3();
      ref.current.getWorldPosition(nodePos);
      
      const dist = new THREE.Vector2(mouseX - nodePos.x, mouseY - nodePos.y).length();
      
      // If mouse is close, apply a repulsive force
      if (dist < 3) {
        const forceDir = new THREE.Vector3(nodePos.x - mouseX, nodePos.y - mouseY, 0).normalize().multiplyScalar(5);
        api.applyImpulse([forceDir.x, forceDir.y, 0], [0, 0, 0]);
      }
    }
  });

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[2, 0.8, 0.5]} />
      <meshPhysicalMaterial 
        color={color} 
        transmission={0.9} 
        opacity={1} 
        metalness={0.2} 
        roughness={0.1} 
        ior={1.5} 
        thickness={0.5} 
        transparent
      />
      <Text
        position={[0, 0, 0.26]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
      >
        {name}
      </Text>
    </mesh>
  );
}

function Boundaries() {
  // Container boundaries so blocks don't fall off screen
  usePlane(() => ({ position: [0, -4, 0], rotation: [-Math.PI / 2, 0, 0] })); // Bottom
  usePlane(() => ({ position: [0, 4, 0], rotation: [Math.PI / 2, 0, 0] }));  // Top
  usePlane(() => ({ position: [-8, 0, 0], rotation: [0, Math.PI / 2, 0] })); // Left
  usePlane(() => ({ position: [8, 0, 0], rotation: [0, -Math.PI / 2, 0] })); // Right
  usePlane(() => ({ position: [0, 0, -1], rotation: [0, 0, 0] }));           // Back
  usePlane(() => ({ position: [0, 0, 2], rotation: [0, Math.PI, 0] }));      // Front
  return null;
}

function GravityController() {
  const { gravity } = useFrame((state) => {
    // Subtle zero-G drift effect
    return { gravity: [Math.sin(state.clock.elapsedTime) * 0.5, Math.cos(state.clock.elapsedTime * 0.8) * 0.5, 0] };
  }) as any;
  
  return null;
}

export default function SkillPhysics() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        
        <div className="flex-1 space-y-6 z-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">The Physics of Scale.</h2>
          <p className="text-neutral-400 text-lg leading-relaxed">
            I construct resilient infrastructure using modern tools. Interact with the technology stack below — representing the dynamic, collision-tested nature of production systems.
          </p>
        </div>

        <div className="flex-1 w-full h-[500px] glass rounded-3xl border border-white/10 overflow-hidden relative cursor-crosshair shadow-[0_0_50px_rgba(0,243,255,0.05)]">
          <Canvas shadows camera={{ position: [0, 0, 8], fov: 50 }} gl={{ alpha: true }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#00f3ff" />
            
            <Suspense fallback={null}>
              <Physics gravity={[0, -2, 0]} defaultContactMaterial={{ restitution: 0.8, friction: 0.1 }}>
                <Boundaries />
                {skills.map((skill, i) => (
                  <SkillNode 
                    key={skill.name} 
                    name={skill.name} 
                    color={skill.color} 
                    position={[(Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, 0]} 
                  />
                ))}
              </Physics>
            </Suspense>
          </Canvas>
          <div className="absolute top-4 left-4 text-xs font-mono text-neutral-500 uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full border border-white/10">
            Interactive Physics Engine Active
          </div>
        </div>

      </div>
    </section>
  );
}
