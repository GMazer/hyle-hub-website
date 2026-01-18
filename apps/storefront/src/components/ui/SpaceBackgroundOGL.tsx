import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Program, Mesh, Sphere, Plane, Geometry, Vec3, Color } from 'ogl';

// --- SHADERS ---

// 1. NEBULA SHADER (Background)
// Uses Fractal Brownian Motion (FBM) for cloud-like noise
const nebulaVertex = `
  attribute vec3 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0); // Render as fullscreen quad
  }
`;

const nebulaFragment = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Simple noise function
  float random (in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // 2D Noise
  float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  // FBM (Fractal Brownian Motion)
  float fbm (in vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 0.;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(st);
      st *= 2.;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.x *= uResolution.x / uResolution.y;

    // Moving coordinates for drift
    vec2 q = vec2(0.);
    q.x = fbm(st + 0.05 * uTime);
    q.y = fbm(st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * uTime);
    r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * uTime);

    float f = fbm(st + r);

    // Color mixing (Deep Space Theme)
    // Dark background base
    vec3 color = vec3(0.01, 0.02, 0.05);

    // Emerald Nebula parts
    vec3 colorEmerald = vec3(0.0, 0.6, 0.4);
    color = mix(color, colorEmerald, clamp(length(q), 0.0, 1.0) * 0.4);

    // Purple/Indigo Nebula parts
    vec3 colorPurple = vec3(0.3, 0.1, 0.6);
    color = mix(color, colorPurple, clamp(length(r), 0.0, 1.0) * 0.3);

    // Highlights
    color += f * f * f * 0.4 + f * 0.2 * vec3(0.5, 0.8, 0.9);

    // Vignette
    vec2 uv = vUv * 2.0 - 1.0;
    float vignette = 1.0 - dot(uv, uv) * 0.3;
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// 2. PLANET SHADER (Procedural Gas Giant with Atmosphere)
const planetVertex = `
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const planetFragment = `
  precision highp float;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vViewPosition;
  uniform float uTime;
  uniform vec3 uColorA; // Main planet color
  uniform vec3 uColorB; // Secondary bands
  uniform vec3 uLightPos;

  // Reusing simple noise for planet bands
  float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
  float noise(vec2 x) {
      vec2 i = floor(x);
      vec2 f = fract(x);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 x) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100);
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
      for (int i = 0; i < 5; ++i) {
          v += a * noise(x);
          x = rot * x * 2.0 + shift;
          a *= 0.5;
      }
      return v;
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    vec3 lightDir = normalize(uLightPos);

    // 1. Procedural Surface (Gas Giant Bands)
    // Rotate uv over time
    vec2 rotUv = vUv;
    rotUv.x += uTime * 0.02; 
    
    // Warped noise for gaseous look
    float n = fbm(rotUv * vec2(6.0, 20.0) + fbm(rotUv * 4.0));
    
    vec3 surfaceColor = mix(uColorA, uColorB, n);

    // 2. Diffuse Lighting
    float diff = max(dot(normal, lightDir), 0.0);
    // Add some ambient
    vec3 finalColor = surfaceColor * (diff + 0.1);

    // 3. Atmosphere / Fresnel Glow
    // Calculate rim factor
    float fresnel = pow(1.0 - dot(normal, viewDir), 3.0);
    // Add glow color on the rim, mostly on the lit side
    float atmosphereIntensity = fresnel * (diff * 0.8 + 0.2);
    vec3 atmosphereColor = vec3(0.6, 0.9, 1.0); // Cyan/White glow

    finalColor += atmosphereColor * atmosphereIntensity * 0.8;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// 3. STARS SHADER (Particles)
const starVertex = `
  attribute vec3 position;
  attribute float aSize;
  attribute float aAlpha;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  varying float vAlpha;

  void main() {
    vAlpha = aAlpha;
    // Twinkle effect
    float twinkle = 0.5 + 0.5 * sin(uTime * 2.0 + position.x * 10.0 + position.y);
    vAlpha *= twinkle;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
  }
`;

const starFragment = `
  precision highp float;
  varying float vAlpha;

  void main() {
    // Round particles
    vec2 coord = gl_PointCoord - vec2(0.5);
    if(length(coord) > 0.5) discard;
    
    // Soft edge
    float d = length(coord);
    float alpha = 1.0 - smoothstep(0.4, 0.5, d);

    gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha * alpha);
  }
`;

const SpaceBackgroundOGL: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- SETUP OGL ---
    const renderer = new Renderer({ 
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: false // Opaque canvas since we draw a nebula background
    });
    const gl = renderer.gl;
    containerRef.current.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 45 });
    camera.position.set(0, 0, 10);

    const scene = new Transform();

    // --- 1. NEBULA BACKGROUND (Fullscreen Quad) ---
    const nebulaGeometry = new Plane(gl, { width: 2, height: 2 }); // Clip space quad
    const nebulaProgram = new Program(gl, {
      vertex: nebulaVertex,
      fragment: nebulaFragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Float32Array([gl.canvas.width, gl.canvas.height]) },
      },
      depthTest: false, // Always draw behind
      depthWrite: false,
    });
    const nebulaMesh = new Mesh(gl, { geometry: nebulaGeometry, program: nebulaProgram });
    // Don't add to main scene, we render it manually first to act as background

    // --- 2. PLANET (Hero Planet) ---
    const planetGeometry = new Sphere(gl, { radius: 2.5, widthSegments: 64, heightSegments: 64 });
    const planetProgram = new Program(gl, {
      vertex: planetVertex,
      fragment: planetFragment,
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new Color('#064e3b') }, // Emerald Dark
        uColorB: { value: new Color('#34d399') }, // Emerald Light
        uLightPos: { value: new Vec3(5, 5, 10) },
      },
      transparent: true,
      cullFace: gl.BACK,
    });
    const planet = new Mesh(gl, { geometry: planetGeometry, program: planetProgram });
    planet.position.set(3.5, 1.5, -5); // Top right, slightly back
    planet.setParent(scene);

    // --- 3. MOON (Smaller Planet) ---
    const moonGeometry = new Sphere(gl, { radius: 0.6, widthSegments: 32, heightSegments: 32 });
    const moonProgram = new Program(gl, {
      vertex: planetVertex,
      fragment: planetFragment,
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new Color('#1e1b4b') }, // Indigo
        uColorB: { value: new Color('#6366f1') }, // Indigo light
        uLightPos: { value: new Vec3(5, 5, 10) },
      },
    });
    const moon = new Mesh(gl, { geometry: moonGeometry, program: moonProgram });
    moon.position.set(-4, -2, 0); // Bottom left
    moon.setParent(scene);

    // --- 4. STARS (Particles) ---
    const starCount = 500;
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const alphas = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 25; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5; // z
      sizes[i] = Math.random() * 20.0 + 5.0;
      alphas[i] = Math.random() * 0.8 + 0.2;
    }

    const starGeometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      aSize: { size: 1, data: sizes },
      aAlpha: { size: 1, data: alphas },
    });

    const starProgram = new Program(gl, {
      vertex: starVertex,
      fragment: starFragment,
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
    });

    const stars = new Mesh(gl, { mode: gl.POINTS, geometry: starGeometry, program: starProgram });
    stars.setParent(scene);


    // --- RESIZE ---
    function resize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
      nebulaProgram.uniforms.uResolution.value.set([gl.canvas.width, gl.canvas.height]);
    }
    window.addEventListener('resize', resize, false);
    resize();

    // --- ANIMATION LOOP ---
    let reqId: number;

    function update(t: number) {
      reqId = requestAnimationFrame(update);
      const dt = t * 0.001;
      
      // Update Uniforms
      nebulaProgram.uniforms.uTime.value = dt * 0.2; // Slow nebula
      
      planetProgram.uniforms.uTime.value = dt;
      planet.rotation.y = dt * 0.05; // Rotate planet slowly
      // Float planet slightly
      planet.position.y = 1.5 + Math.sin(dt * 0.5) * 0.1;

      moonProgram.uniforms.uTime.value = dt + 100.0; // Offset seed
      moon.rotation.y = dt * 0.1;
      moon.position.y = -2 + Math.cos(dt * 0.3) * 0.2;

      starProgram.uniforms.uTime.value = dt;

      // Render Background first (Nebula)
      // Corrected: Use renderer.render({ scene: nebulaMesh }) instead of mesh.render()
      renderer.autoClear = true; 
      renderer.render({ scene: nebulaMesh });
      
      // Render Scene (Planets + Stars) on top
      renderer.autoClear = false; // Don't clear for the second pass, draw on top
      renderer.render({ scene, camera });
    }

    reqId = requestAnimationFrame(update);

    // --- CLEANUP ---
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(reqId);
      if (containerRef.current && gl.canvas) {
        containerRef.current.removeChild(gl.canvas);
      }
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default SpaceBackgroundOGL;