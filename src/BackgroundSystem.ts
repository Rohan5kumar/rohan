import * as THREE from 'three';

export interface BackgroundOptions {
  container: HTMLElement;
  primaryColor: string;
  theme: string;
}

export class BackgroundSystem {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private container: HTMLElement;
  private primaryColor: string;
  private theme: string;
  
  private particles!: THREE.Points;
  private grid!: THREE.Mesh;
  private fluidMaterial!: THREE.ShaderMaterial;
  private fluidMesh!: THREE.Mesh;
  
  private mouseX = 0;
  private mouseY = 0;
  private targetX = 0;
  private targetY = 0;
  private time = 0;
  private windowHalfX = window.innerWidth / 2;
  private windowHalfY = window.innerHeight / 2;
  
  private animationId: number | null = null;

  constructor(options: BackgroundOptions) {
    this.container = options.container;
    this.primaryColor = options.primaryColor;
    this.theme = options.theme;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.z = 800;

    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    this.initParticles();
    this.initGrid();
    this.initFluid();

    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    this.animate();
  }

  private initParticles() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const sizes = [];
    
    for (let i = 0; i < 3000; i++) {
      vertices.push(
        THREE.MathUtils.randFloatSpread(2000),
        THREE.MathUtils.randFloatSpread(2000),
        THREE.MathUtils.randFloatSpread(1000) - 500
      );
      sizes.push(Math.random() * 2 + 1);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(this.primaryColor) },
        time: { value: 0 },
        mouseX: { value: 0 },
        mouseY: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        varying float vOpacity;
        uniform float time;
        uniform float mouseX;
        uniform float mouseY;
        
        void main() {
          vec3 pos = position;
          
          // Subtle mouse repulsion
          float dist = distance(pos.xy, vec2(mouseX * 1000.0, -mouseY * 1000.0));
          if (dist < 300.0) {
            vec2 dir = normalize(pos.xy - vec2(mouseX * 1000.0, -mouseY * 1000.0));
            pos.xy += dir * (300.0 - dist) * 0.2;
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (1000.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          
          vOpacity = smoothstep(-1000.0, 500.0, mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vOpacity;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          if (d > 0.5) discard;
          gl_FragColor = vec4(color, vOpacity * (1.0 - d * 2.0));
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private initGrid() {
    const size = 2000;
    const divisions = 40;
    const geometry = new THREE.PlaneGeometry(size, size, divisions, divisions);
    
    this.fluidMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(this.primaryColor) },
        time: { value: 0 },
        mouseX: { value: 0 },
        mouseY: { value: 0 },
        opacity: { value: 0.1 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vElevation;
        uniform float time;
        uniform float mouseX;
        uniform float mouseY;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          
          float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
          
          // Mouse influence
          float dist = distance(pos.xy, vec2(mouseX * 1000.0, -mouseY * 1000.0));
          elevation += smoothstep(500.0, 0.0, dist) * 100.0;
          
          pos.z += elevation;
          vElevation = elevation;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        varying vec2 vUv;
        varying float vElevation;
        
        void main() {
          float grid = (step(0.98, fract(vUv.x * 40.0)) + step(0.98, fract(vUv.y * 40.0)));
          if (grid < 0.1) discard;
          
          float alpha = opacity * (1.0 + vElevation * 0.01);
          gl_FragColor = vec4(color, alpha * grid);
        }
      `,
      transparent: true,
      wireframe: false,
      side: THREE.DoubleSide
    });

    this.grid = new THREE.Mesh(geometry, this.fluidMaterial);
    this.grid.rotation.x = -Math.PI / 2.5;
    this.grid.position.y = -400;
    this.scene.add(this.grid);
  }

  private initFluid() {
    const geometry = new THREE.SphereGeometry(600, 64, 64);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(this.primaryColor) },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uOpacity: { value: 0.05 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform float uTime;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          
          vec3 pos = position;
          pos.x += sin(pos.y * 0.01 + uTime) * 30.0;
          pos.y += cos(pos.x * 0.01 + uTime) * 30.0;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform vec3 uColor;
        uniform float uOpacity;
        
        void main() {
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          gl_FragColor = vec4(uColor, uOpacity * (fresnel + 0.2));
        }
      `,
      transparent: true,
      side: THREE.BackSide
    });

    this.fluidMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.fluidMesh);
  }

  private onMouseMove(event: MouseEvent) {
    this.targetX = (event.clientX - this.windowHalfX) / this.windowHalfX;
    this.targetY = (event.clientY - this.windowHalfY) / this.windowHalfY;
  }

  private onWindowResize() {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public updateTheme(primaryColor: string, theme: string) {
    this.primaryColor = primaryColor;
    this.theme = theme;
    const color = new THREE.Color(primaryColor);
    
    if (this.particles.material instanceof THREE.ShaderMaterial) {
      this.particles.material.uniforms.color.value = color;
    }
    if (this.grid.material instanceof THREE.ShaderMaterial) {
      this.grid.material.uniforms.color.value = color;
    }
    if (this.fluidMesh.material instanceof THREE.ShaderMaterial) {
      this.fluidMesh.material.uniforms.uColor.value = color;
    }
  }

  private animate() {
    this.animationId = requestAnimationFrame(this.animate.bind(this));
    this.time += 0.01;
    
    // Smooth mouse movement
    this.mouseX += (this.targetX - this.mouseX) * 0.05;
    this.mouseY += (this.targetY - this.mouseY) * 0.05;

    // Update uniforms
    if (this.particles.material instanceof THREE.ShaderMaterial) {
      this.particles.material.uniforms.time.value = this.time;
      this.particles.material.uniforms.mouseX.value = this.mouseX;
      this.particles.material.uniforms.mouseY.value = this.mouseY;
    }
    
    if (this.grid.material instanceof THREE.ShaderMaterial) {
      this.grid.material.uniforms.time.value = this.time;
      this.grid.material.uniforms.mouseX.value = this.mouseX;
      this.grid.material.uniforms.mouseY.value = this.mouseY;
    }

    if (this.fluidMesh.material instanceof THREE.ShaderMaterial) {
      this.fluidMesh.material.uniforms.uTime.value = this.time;
    }

    // Parallax effects
    this.scene.rotation.y = this.mouseX * 0.1;
    this.scene.rotation.x = this.mouseY * 0.1;
    
    this.particles.rotation.y += 0.0005;

    this.renderer.render(this.scene, this.camera);
  }

  public destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}
