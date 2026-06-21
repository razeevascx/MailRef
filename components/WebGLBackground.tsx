'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

export default function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useNextTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) {
      console.warn('WebGL not supported, falling back to CSS background');
      return;
    }

    // Vertex Shader Source
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader Source
    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_dark;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                   mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        
        // Parallax drift from pointer
        vec2 drift = u_mouse * 0.05;
        vec2 uv = st * 3.5 - drift;
        
        // breathing pulse
        float pulse = sin(u_time * 0.25) * 0.5 + 0.5;
        
        // noise computation
        float n = noise(uv + u_time * 0.03) * 0.5;
        n += noise(uv * 2.0 - u_time * 0.05) * 0.25;
        n += noise(uv * 4.0 + u_time * 0.07) * 0.125;
        
        // electric blue (#0A3BBF)
        vec3 electricBlue = vec3(0.039, 0.231, 0.749);
        
        // base bg transition: light (#FFFFFF) vs dark navy (#1A2440)
        vec3 bgLight = vec3(1.0, 1.0, 1.0);
        vec3 bgDark = vec3(0.102, 0.141, 0.251); 
        vec3 baseBg = mix(bgLight, bgDark, u_dark);
        
        // mix haze with background
        float mixVal = n * (0.08 + pulse * 0.04);
        vec3 col = mix(baseBg, electricBlue, mixVal);
        
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    // Helper to create and compile shader
    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    // Create Program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader linking error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Setup buffer with full screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');
    const darkLoc = gl.getUniformLocation(program, 'u_dark');

    // Handle mouse tracking
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let currentMouseX = 0.5;
    let currentMouseY = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = 1.0 - (e.clientY / window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // DPR clamp
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Render loop
    let animationFrameId: number;
    const startTime = Date.now();

    const render = () => {
      const elapsedSeconds = (Date.now() - startTime) / 1000.0;
      
      // Interpolate mouse coordinates for pointer drift lag
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Detect dark mode (classes contain dark)
      const isDark = document.documentElement.classList.contains('dark') || theme === 'dark';
      
      // Set uniforms
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, elapsedSeconds);
      gl.uniform2f(mouseLoc, currentMouseX, currentMouseY);
      gl.uniform1f(darkLoc, isDark ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [theme]);

  return (
    <>
      {/* Background WebGL canvas */}
      <canvas
        ref={canvasRef}
        id="gl"
        className="fixed inset-0 w-full h-full -z-10 transition-opacity duration-500 bg-white dark:bg-[#1A2440]"
        style={{ pointerEvents: 'none' }}
      />
      {/* Dot Grid overlay */}
      <div 
        className="fixed inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#0A3BBF 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
    </>
  );
}
