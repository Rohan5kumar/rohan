import * as THREE from 'three';

export class BackgroundManager {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  private isMobile: boolean = false;
  private imageLoaded: boolean = false;
  private animationId: number | null = null;
  private texture: WebGLTexture | null = null;
  private program: WebGLProgram | null = null;
  private mouseX: number = 0.5;
  private mouseY: number = 0.5;

  constructor(containerId: string = 'background-container') {
    this.container = document.getElementById(containerId) || document.body;
    this.isMobile = window.innerWidth < 768;
    this.init();
    this.setupEventListeners();
  }

  private init() {
    // Create background structure
    this.container.innerHTML = `
      <div class="background-wrapper">
        <img 
          id="bg-image" 
          src="/image.jpeg" 
          alt="Professional Background" 
          class="background-image"
          style="filter: brightness(0.35) contrast(1.1); object-position: ${this.isMobile ? 'center 30%' : 'center center'}"
        />
        <div class="backdrop-blur"></div>
        <canvas id="fluid-canvas" class="fluid-canvas"></canvas>
        ${this.isMobile ? '<div class="mobile-overlay"></div>' : ''}
      </div>
    `;

    // Load image
    const img = document.getElementById('bg-image') as HTMLImageElement;
    img.onload = () => {
      this.imageLoaded = true;
      this.initFluidShader();
    };
    img.onerror = () => {
      console.error('Failed to load background image');
    };
  }

  private initFluidShader() {
    this.canvas = document.getElementById('fluid-canvas') as HTMLCanvasElement;
    if (!this.canvas) return;

    this.gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl');
    if (!this.gl) {
      console.warn('WebGL not supported, using static background');
      return;
    }

    this.setupCanvas();
    this.createShaders();
    this.animate();
  }

  private setupCanvas() {
    if (!this.canvas || !this.gl) return;

    const handleResize = () => {
      this.canvas!.width = window.innerWidth;
      this.canvas!.height = window.innerHeight;
      if (this.gl) {
        this.gl.viewport(0, 0, this.canvas!.width, this.canvas!.height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
  }

  private createShaders() {
    if (!this.gl) return;

    const vertexShader = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_image;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec2 u_resolution;
      
      float noise(vec2 p) {
        return sin(p.x * 10.0) * sin(p.y * 10.0);
      }
      
      void main() {
        vec2 uv = v_uv;
        vec2 mouseInfluence = (u_mouse - 0.5) * 0.1;
        float distortion = noise(uv + u_time * 0.1 + mouseInfluence) * 0.02;
        uv += distortion;
        
        vec4 color = texture2D(u_image, uv);
        color.rgb += vec3(sin(u_time) * 0.01, cos(u_time * 1.3) * 0.01, sin(u_time * 0.7) * 0.01);
        
        gl_FragColor = color;
      }
    `;

    this.program = this.createShaderProgram(vertexShader, fragmentShader);
    if (!this.program) return;

    this.setupGeometry();
    this.setupTexture();
  }

  private createShaderProgram(vertexSource: string, fragmentSource: string): WebGLProgram | null {
    if (!this.gl) return null;

    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertexShader || !fragmentShader) return null;

    const program = this.gl.createProgram();
    if (!program) return null;

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Shader program failed to link');
      return null;
    }

    return program;
  }

  private createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;

    const shader = this.gl.createShader(type);
    if (!shader) return null;

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private setupGeometry() {
    if (!this.gl || !this.program) return;

    const positions = new Float32Array([
      -1, -1,  1, -1,  -1,  1,  1,  1,
    ]);

    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

    const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
  }

  private setupTexture() {
    if (!this.gl || !this.program) return;

    this.texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      if (!this.gl || !this.texture) return;
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    };
    image.src = '/image.jpeg';
  }

  private setupEventListeners() {
    const handleMouseMove = (e: MouseEvent) => {
      this.mouseX = e.clientX / window.innerWidth;
      this.mouseY = 1.0 - (e.clientY / window.innerHeight);
    };

    const handleResize = () => {
      this.isMobile = window.innerWidth < 768;
      const img = document.getElementById('bg-image') as HTMLImageElement;
      if (img) {
        img.style.objectPosition = this.isMobile ? 'center 30%' : 'center center';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
  }

  private animate() {
    if (!this.gl || !this.program || !this.canvas) return;

    const startTime = Date.now();

    const render = () => {
      if (!this.gl || !this.program || !this.canvas) return;

      const currentTime = (Date.now() - startTime) / 1000;

      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      this.gl.clearColor(0, 0, 0, 1);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      this.gl.useProgram(this.program);

      // Set uniforms
      const imageLocation = this.gl.getUniformLocation(this.program, 'u_image');
      const timeLocation = this.gl.getUniformLocation(this.program, 'u_time');
      const mouseLocation = this.gl.getUniformLocation(this.program, 'u_mouse');
      const resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');

      this.gl.uniform1i(imageLocation, 0);
      this.gl.uniform1f(timeLocation, currentTime);
      this.gl.uniform2f(mouseLocation, this.mouseX, this.mouseY);
      this.gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);

      // Draw
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

      this.animationId = requestAnimationFrame(render);
    };

    render();
  }

  public destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
    }
    
    if (this.gl && this.texture) {
      this.gl.deleteTexture(this.texture);
    }
  }
}

// Auto-initialize when imported
let backgroundManager: BackgroundManager | null = null;

export const initBackground = () => {
  if (!backgroundManager) {
    backgroundManager = new BackgroundManager();
  }
  return backgroundManager;
};

export const destroyBackground = () => {
  if (backgroundManager) {
    backgroundManager.destroy();
    backgroundManager = null;
  }
};
