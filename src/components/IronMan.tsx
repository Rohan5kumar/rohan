import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

function Model() {
  const { scene } = useGLTF('/3d model1.glb');
  const modelRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (modelRef.current) {
      // Interactive rotation tracking mouse
      const targetX = (state.pointer.x * Math.PI) / 6;
      const targetY = (state.pointer.y * Math.PI) / 8;
      
      modelRef.current.rotation.y += (targetX - modelRef.current.rotation.y) * 0.1;
      modelRef.current.rotation.x += (-targetY - modelRef.current.rotation.x) * 0.1;
      
      // Based on the video reference, model scales slightly or moves dynamically
      const scrollY = window.scrollY;
      modelRef.current.position.y = (scrollY * -0.002) - 1.5;
    }
  });

  return (
    <group ref={modelRef} dispose={null}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Scale chosen generically; might need adjustment once visualized */}
        <primitive object={scene} scale={2.5} position={[0, -1, 0]} />
      </Float>
    </group>
  );
}

export function IronManCanvas() {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, right: '-25%', pointerEvents: 'none', zIndex: 10 }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} color="#00f3ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff004f" />
        <Environment preset="city" />
        <Model />
        <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={15} blur={2.5} far={4} color="#00f3ff" />
      </Canvas>
    </div>
  );
}
