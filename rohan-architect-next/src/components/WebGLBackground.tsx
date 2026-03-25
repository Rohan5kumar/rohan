'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Float } from '@react-three/drei';
import * as THREE from 'three';

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float dist = distance(uv, uMouse);
  float distortion = exp(-dist * 5.0) * 0.1;
  uv.x += sin(uTime * 0.5 + uv.y * 10.0) * distortion;
  uv.y += cos(uTime * 0.5 + uv.x * 10.0) * distortion;
  
  float r = texture2D(uTexture, uv + vec2(distortion * 0.02, 0.0)).r;
  float g = texture2D(uTexture, uv).g;
  float b = texture2D(uTexture, uv - vec2(distortion * 0.02, 0.0)).b;
  
  vec3 color = vec3(r, g, b);
  float luminance = dot(color, vec3(0.299, 0.587, 0.114));
  vec3 cyanTint = vec3(0.0, 0.3, 0.4);
  color = mix(color, color + cyanTint, (1.0 - luminance) * 0.5);

  gl_FragColor = vec4(color, 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

function FluidMesh() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const texture = useTexture('/image.jpeg');
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTexture: { value: texture },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    [texture]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      const mouseX = (state.pointer.x * 0.5) + 0.5;
      const mouseY = (state.pointer.y * 0.5) + 0.5;
      materialRef.current.uniforms.uMouse.value.lerp(new THREE.Vector2(mouseX, mouseY), 0.05);
    }
  });

  return (
    <mesh position={[0, 0, -2]}>
      <planeGeometry args={[16 + 2, 9 + 2, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

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
    <div className="absolute inset-0 w-full h-full overflow-hidden right-0 pointer-events-none opacity-80 mix-blend-screen mask-image-fade" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <FluidMesh />
        <SystemCore />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/50 to-black z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black z-10" />
    </div>
  );
}
