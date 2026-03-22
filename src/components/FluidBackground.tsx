import React, { useEffect, useRef } from 'react';

interface FluidBackgroundProps {
  color1?: string; // Cyan-like
  color2?: string; // Deep Blue-like
  backgroundColor?: string;
  opacity?: number;
  simRes?: number;
  dyeRes?: number;
}

export const FluidBackground: React.FC<FluidBackgroundProps> = ({
  color1 = '#06b6d4',
  color2 = '#1e3a8a',
  backgroundColor = '#0b0e14',
  opacity = 0.8,
  simRes = 128,
  dyeRes = 512,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    }) || canvas.getContext('webgl', {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const isWebGL2 = gl instanceof WebGL2RenderingContext;
    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float');
    }
    gl.getExtension('OES_texture_float');
    gl.getExtension('OES_texture_float_linear');

    // Shader sources
    const baseVertexShader = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const displayShaderSource = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform vec3 backColor;
      uniform float opacity;
      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        float intensity = length(c);
        vec3 finalColor = mix(backColor, c, min(intensity * 1.5, 1.0));
        gl_FragColor = vec4(finalColor, opacity);
      }
    `;

    const splatShaderSource = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspect;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspect;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `;

    const advectionShaderSource = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;
      void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * texture2D(uSource, coord);
      }
    `;

    const divergenceShaderSource = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    const curlShaderSource = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `;

    const vorticityShaderSource = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
      }
    `;

    const pressureShaderSource = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float div = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - div) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `;

    const gradientSubtractShaderSource = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vel.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(vel, 0.0, 1.0);
      }
    `;

    // Helper functions
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
      }
      return shader;
    };

    const createProgram = (vertexSource: string, fragmentSource: string) => {
      const vertexShader = createShader(gl.VERTEX_SHADER, vertexSource);
      const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);
      const program = gl.createProgram()!;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
      }
      const uniforms: any = {};
      const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const name = gl.getActiveUniform(program, i)!.name;
        uniforms[name] = gl.getUniformLocation(program, name);
      }
      return { program, uniforms };
    };

    // Initialize programs
    const advectionProgram = createProgram(baseVertexShader, advectionShaderSource);
    const divergenceProgram = createProgram(baseVertexShader, divergenceShaderSource);
    const curlProgram = createProgram(baseVertexShader, curlShaderSource);
    const vorticityProgram = createProgram(baseVertexShader, vorticityShaderSource);
    const pressureProgram = createProgram(baseVertexShader, pressureShaderSource);
    const gradientSubtractProgram = createProgram(baseVertexShader, gradientSubtractShaderSource);
    const splatProgram = createProgram(baseVertexShader, splatShaderSource);
    const displayProgram = createProgram(baseVertexShader, displayShaderSource);

    // Framebuffer setup
    const internalFormat = isWebGL2 ? (gl as WebGL2RenderingContext).RGBA16F : gl.RGBA;
    const format = gl.RGBA;
    const type = isWebGL2 ? (gl as WebGL2RenderingContext).HALF_FLOAT : gl.FLOAT;
    const param = gl.LINEAR;

    const createFBO = (w: number, h: number, internalFormat: number, format: number, type: number, param: number) => {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        attach(id: number) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        }
      };
    };

    const createDoubleFBO = (w: number, h: number, internalFormat: number, format: number, type: number, param: number) => {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        get read() { return fbo1; },
        get write() { return fbo2; },
        swap() {
          const temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        }
      };
    };

    let density = createDoubleFBO(dyeRes, dyeRes, internalFormat, format, type, param);
    let velocity = createDoubleFBO(simRes, simRes, internalFormat, format, type, param);
    let divergence = createFBO(simRes, simRes, internalFormat, format, type, gl.NEAREST);
    let curl = createFBO(simRes, simRes, internalFormat, format, type, gl.NEAREST);
    let pressure = createDoubleFBO(simRes, simRes, internalFormat, format, type, gl.NEAREST);

    // Geometry
    const bl = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bl);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const il = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, il);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

    // Interaction state
    const lastMousePos = { x: 0, y: 0 };

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
      } : { r: 0, g: 0, b: 0 };
    };

    const color1Rgb = hexToRgb(color1);
    const color2Rgb = hexToRgb(color2);
    const backColorRgb = hexToRgb(backgroundColor);

    const splat = (x: number, y: number, dx: number, dy: number, color: { r: number, g: number, b: number }) => {
      gl.viewport(0, 0, simRes, simRes);
      gl.useProgram(splatProgram.program);
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProgram.uniforms.aspect, canvas.width / canvas.height);
      gl.uniform2f(splatProgram.uniforms.point, x / canvas.width, 1.0 - y / canvas.height);
      gl.uniform3f(splatProgram.uniforms.color, dx, -dy, 1.0);
      gl.uniform1f(splatProgram.uniforms.radius, 0.002);
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      velocity.swap();

      gl.viewport(0, 0, dyeRes, dyeRes);
      gl.uniform1i(splatProgram.uniforms.uTarget, density.read.attach(0));
      gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      gl.bindFramebuffer(gl.FRAMEBUFFER, density.write.fbo);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      density.swap();
    };

    const onMouseMove = (e: MouseEvent) => {
      const dx = (e.clientX - lastMousePos.x) * 10;
      const dy = (e.clientY - lastMousePos.y) * 10;
      lastMousePos.x = e.clientX;
      lastMousePos.y = e.clientY;
      const color = Math.random() > 0.5 ? color1Rgb : color2Rgb;
      splat(e.clientX, e.clientY, dx, dy, color);
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const dx = (touch.clientX - lastMousePos.x) * 10;
      const dy = (touch.clientY - lastMousePos.y) * 10;
      lastMousePos.x = touch.clientX;
      lastMousePos.y = touch.clientY;
      const color = Math.random() > 0.5 ? color1Rgb : color2Rgb;
      splat(touch.clientX, touch.clientY, dx, dy, color);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      density = createDoubleFBO(dyeRes, dyeRes, internalFormat, format, type, param);
      velocity = createDoubleFBO(simRes, simRes, internalFormat, format, type, param);
      divergence = createFBO(simRes, simRes, internalFormat, format, type, gl.NEAREST);
      curl = createFBO(simRes, simRes, internalFormat, format, type, gl.NEAREST);
      pressure = createDoubleFBO(simRes, simRes, internalFormat, format, type, gl.NEAREST);
    };
    window.addEventListener('resize', resize);
    resize();

    let lastTime = Date.now();
    const update = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;

      gl.disable(gl.BLEND);
      gl.viewport(0, 0, simRes, simRes);

      // Curl
      gl.useProgram(curlProgram.program);
      gl.uniform2f(curlProgram.uniforms.texelSize, 1.0 / simRes, 1.0 / simRes);
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.bindFramebuffer(gl.FRAMEBUFFER, curl.fbo);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

      // Vorticity
      gl.useProgram(vorticityProgram.program);
      gl.uniform2f(vorticityProgram.uniforms.texelSize, 1.0 / simRes, 1.0 / simRes);
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
      gl.uniform1f(vorticityProgram.uniforms.curl, 30.0);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      velocity.swap();

      // Divergence
      gl.useProgram(divergenceProgram.program);
      gl.uniform2f(divergenceProgram.uniforms.texelSize, 1.0 / simRes, 1.0 / simRes);
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.bindFramebuffer(gl.FRAMEBUFFER, divergence.fbo);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

      // Pressure
      gl.useProgram(pressureProgram.program);
      gl.uniform2f(pressureProgram.uniforms.texelSize, 1.0 / simRes, 1.0 / simRes);
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < 20; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write.fbo);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        pressure.swap();
      }

      // Gradient Subtract
      gl.useProgram(gradientSubtractProgram.program);
      gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, 1.0 / simRes, 1.0 / simRes);
      gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      velocity.swap();

      // Advection Velocity
      gl.useProgram(advectionProgram.program);
      gl.uniform2f(advectionProgram.uniforms.texelSize, 1.0 / simRes, 1.0 / simRes);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read.attach(0));
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(advectionProgram.uniforms.dissipation, 0.98);
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      velocity.swap();

      // Advection Density
      gl.viewport(0, 0, dyeRes, dyeRes);
      gl.uniform2f(advectionProgram.uniforms.texelSize, 1.0 / dyeRes, 1.0 / dyeRes);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource, density.read.attach(1));
      gl.uniform1f(advectionProgram.uniforms.dissipation, 0.97);
      gl.bindFramebuffer(gl.FRAMEBUFFER, density.write.fbo);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      density.swap();

      // Render
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(displayProgram.program);
      gl.uniform1i(displayProgram.uniforms.uTexture, density.read.attach(0));
      gl.uniform3f(displayProgram.uniforms.backColor, backColorRgb.r, backColorRgb.g, backColorRgb.b);
      gl.uniform1f(displayProgram.uniforms.opacity, opacity);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

      requestAnimationFrame(update);
    };
    const animationId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      // Cleanup WebGL resources
      gl.deleteBuffer(bl);
      gl.deleteBuffer(il);
      // Delete textures and framebuffers
      [density, velocity, pressure].forEach(doubleFbo => {
        gl.deleteTexture(doubleFbo.read.texture);
        gl.deleteTexture(doubleFbo.write.texture);
        gl.deleteFramebuffer(doubleFbo.read.fbo);
        gl.deleteFramebuffer(doubleFbo.write.fbo);
      });
      [divergence, curl].forEach(fbo => {
        gl.deleteTexture(fbo.texture);
        gl.deleteFramebuffer(fbo.fbo);
      });
      // Delete programs
      [advectionProgram, divergenceProgram, curlProgram, vorticityProgram, pressureProgram, gradientSubtractProgram, splatProgram, displayProgram].forEach(p => {
        gl.deleteProgram(p.program);
      });
    };
  }, [color1, color2, backgroundColor, opacity, simRes, dyeRes]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none overflow-hidden"
      style={{ backgroundColor }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
};
