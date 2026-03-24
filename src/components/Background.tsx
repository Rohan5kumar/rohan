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

  constructor(containerId: string = 'background-container') {
    this.container = document.getElementById(containerId) || document.body;
    this.init();
    this.setupEventListeners();
  }

  private init() {
    // Create background structure without static image
    this.container.innerHTML = `
      <div class="background-wrapper" style="background: #020205;">
        <canvas id="nebula-canvas" class="fluid-canvas" style="opacity: 0.8;"></canvas>
        <div class="backdrop-blur" style="background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%);"></div>
      </div>
    `;

    this.canvas = document.getElementById('nebula-canvas') as HTMLCanvasElement;
    if (!this.canvas) return;

    this.gl = this.canvas.getContext('webgl2', { alpha: false }) || this.canvas.getContext('webgl', { alpha: false });
    if (!this.gl) return;

    this.setupCanvas();
    this.createShaders();
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

        // Dynamic color scheme based on primary emerald/cyan tones
        vec3 color = mix(vec3(0.01, 0.02, 0.05), // Deep space
                         vec3(0.0, 0.4, 0.3),   // Emerald/Teal
                         clamp((f * f) * 4.0, 0.0, 1.0));

        color = mix(color,
                    vec3(0.0, 0.1, 0.2),       // Deep Blue
                    clamp(length(q), 0.0, 1.0));

        color = mix(color,
                    vec3(0.2, 0.8, 0.6),       // Bright Cyan/Emerald
                    clamp(length(r.x), 0.0, 1.0));

        // Final brightness adjustment
        float intensity = f * f * f * 1.1 + 0.2 * f * f + 0.5 * f;
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

  private setupEventListeners() {
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = e.clientX / window.innerWidth;
      this.targetMouseY = 1.0 - (e.clientY / window.innerHeight);
    });
  }

  private animate() {
    const render = () => {
      if (!this.gl || !this.program || !this.canvas) return;

      // Smooth mouse damping
      this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
      this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

      const time = (Date.now() - this.startTime) / 1000;

      this.gl.useProgram(this.program);
      this.gl.uniform1f(this.gl.getUniformLocation(this.program, 'u_time'), time);
      this.gl.uniform2f(this.gl.getUniformLocation(this.program, 'u_mouse'), this.mouseX, this.mouseY);
      this.gl.uniform2f(this.gl.getUniformLocation(this.program, 'u_resolution'), this.canvas.width, this.canvas.height);

      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
      this.animationId = requestAnimationFrame(render);
    };
    render();
  }

  public destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
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
