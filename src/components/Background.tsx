import * as THREE from 'three';

export class BackgroundManager {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  private animationId: number | null = null;
  private program: WebGLProgram | null = null;
  private mouseX: number = 0.5;
  private mouseY: number = 0.5;
  private targetMouseX: number = 0.5;
  private targetMouseY: number = 0.5;
  private startTime: number = Date.now();

  // Three.js for particles
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private particles: THREE.Points | null = null;

  constructor(containerId: string = 'background-container') {
    this.container = document.getElementById(containerId) || document.body;
    this.init();
    this.setupEventListeners();
  }

  private init() {
    // Create background structure without static image
    this.container.innerHTML = `
      <div class="background-wrapper" style="background: #0B0B0B;">
        <img src="/hero-landscape.jpg" class="background-image" style="opacity: 0.4; filter: brightness(0.6) contrast(1.2) saturate(1.2);">
        <canvas id="nebula-canvas" class="fluid-canvas" style="opacity: 0.7; mix-blend-mode: screen;"></canvas>
        <div id="particle-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;"></div>
        <div class="backdrop-blur"></div>
      </div>
    `;

    this.canvas = document.getElementById('nebula-canvas') as HTMLCanvasElement;
    if (!this.canvas) return;

    this.gl = this.canvas.getContext('webgl2', { alpha: false }) || this.canvas.getContext('webgl', { alpha: false });
    if (!this.gl) return;

    this.setupCanvas();
    this.createShaders();
    this.initParticles();
    this.animate();
  }

  private setupCanvas() {
    if (!this.canvas || !this.gl) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      this.canvas!.width = window.innerWidth * dpr;
      this.canvas!.height = window.innerHeight * dpr;
      this.gl!.viewport(0, 0, this.canvas!.width, this.canvas!.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
  }

  private createShaders() {
    if (!this.gl) return;

    const vertexShader = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec2 u_resolution;

      // Fractional Brownian Motion for nebula-like noise
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 5; ++i) {
          v += a * noise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        uv = uv * 2.0 - 1.0;
        uv.x *= u_resolution.x / u_resolution.y;

        float t = u_time * 0.05;
        vec2 mouse = (u_mouse - 0.5) * 2.0;
        
        // Animated coordinate warping
        vec2 q = vec2(0.0);
        q.x = fbm(uv + 0.0 * t);
        q.y = fbm(uv + vec2(1.0));

        vec2 r = vec2(0.0);
        r.x = fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);
        r.y = fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);

        float f = fbm(uv + r + mouse * 0.1);

        // Dynamic color scheme based on Amber (Lava) and Cyan (Holographic)
        vec3 color = mix(vec3(0.01, 0.01, 0.02), // Deep black-blue
                         vec3(0.8, 0.4, 0.1),   // Amber/Orange (Lava)
                         clamp((f * f) * 5.0, 0.0, 1.0));

        color = mix(color,
                    vec3(0.02, 0.05, 0.1),      // Deep Space Blue
                    clamp(length(q), 0.0, 1.0));

        color = mix(color,
                    vec3(0.1, 0.6, 0.8),       // Holographic Cyan
                    clamp(length(r.x), 0.0, 1.0));

        // Final brightness adjustment
        float intensity = f * f * f * 1.2 + 0.3 * f * f + 0.6 * f;
        color *= intensity;

        // Subtle vignette
        float vignette = 1.0 - length(uv * 0.5);
        color *= pow(vignette, 1.5);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    this.program = this.createShaderProgram(vertexShader, fragmentShader);
    this.setupGeometry();
  }

  private createShaderProgram(vertexSource: string, fragmentSource: string): WebGLProgram | null {
    if (!this.gl) return null;
    const vs = this.compileShader(this.gl.VERTEX_SHADER, vertexSource);
    const fs = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentSource);
    if (!vs || !fs) return null;

    const program = this.gl.createProgram()!;
    this.gl.attachShader(program, vs);
    this.gl.attachShader(program, fs);
    this.gl.linkProgram(program);
    return program;
  }

  private compileShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    return shader;
  }

  private setupGeometry() {
    if (!this.gl || !this.program) return;
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
    const pos = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.enableVertexAttribArray(pos);
    this.gl.vertexAttribPointer(pos, 2, this.gl.FLOAT, false, 0, 0);
  }

  private initParticles() {
    const particleContainer = document.getElementById('particle-container');
    if (!particleContainer) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    particleContainer.appendChild(this.renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: 0xF59E0B, // Amber particles
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(this.particles);
    this.camera.position.z = 2;
  }

  private animate() {
    const render = () => {
      if (!this.gl || !this.program || !this.canvas) return;

      // Smooth mouse damping
      this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
      this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

      const time = (Date.now() - this.startTime) / 1000;

      // Update WebGL Shader Background
      this.gl.useProgram(this.program);
      this.gl.uniform1f(this.gl.getUniformLocation(this.program, 'u_time'), time);
      this.gl.uniform2f(this.gl.getUniformLocation(this.program, 'u_mouse'), this.mouseX, this.mouseY);
      this.gl.uniform2f(this.gl.getUniformLocation(this.program, 'u_resolution'), this.canvas.width, this.canvas.height);
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

      // Update Three.js Particles
      if (this.particles && this.renderer && this.scene && this.camera) {
        this.particles.rotation.y = time * 0.05;
        this.particles.rotation.x = this.mouseY * 0.1;
        this.renderer.render(this.scene, this.camera);
      }

      this.animationId = requestAnimationFrame(render);
    };
    render();
  }

  public destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.renderer) this.renderer.dispose();
  }
}

let backgroundManager: BackgroundManager | null = null;
export const initBackground = () => {
  if (!backgroundManager) backgroundManager = new BackgroundManager();
  return backgroundManager;
};
export const destroyBackground = () => {
  if (backgroundManager) {
    backgroundManager.destroy();
    backgroundManager = null;
  }
};
