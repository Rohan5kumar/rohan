'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function SystemCore() {
  const coreRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const [target] = useState(() => new THREE.Vector3());

  useFrame((state) => {
    if (coreRef.current && lightRef.current) {
      // Map pointer to 3D world space
      target.set((state.pointer.x * state.viewport.width) / 2, (state.pointer.y * state.viewport.height) / 2, 5);
      
      // Core tracks mouse
      coreRef.current.lookAt(target);
      
      // Spotlight follows mouse smoothly
      lightRef.current.position.lerp(new THREE.Vector3(target.x, target.y, 2), 0.1);
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight ref={lightRef} color="#00f3ff" intensity={5} distance={10} />
      
      <group position={[3, 0, 0]} ref={coreRef}>
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <mesh>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color="#1a1a1a" wireframe={true} emissive="#00f3ff" emissiveIntensity={0.2} />
          </mesh>
          <mesh>
            <icosahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color="#000000" emissive="#00f3ff" emissiveIntensity={0.5} opacity={0.8} transparent />
          </mesh>
        </Float>
      </group>
    </>
  );
}

export default function WebGLBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden right-0 pointer-events-none mix-blend-screen mask-image-fade" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Dynamic Architectural Starfield / Particles */}
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1.5} />
        
        {/* The 3D Icosahedron Core */}
        <SystemCore />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/50 to-black z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black z-10" />
    </div>
  );
}
