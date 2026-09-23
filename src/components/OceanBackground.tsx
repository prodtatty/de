import { useEffect, useRef } from 'react'

// Real-time raymarched ocean surface (no video file exists to crop for the hero,
// and there's no way to fetch stock footage from this environment, so the close-up
// storm-water background is rendered procedurally instead).

const VERTEX_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAGMENT_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

const int NUM_STEPS = 7;
const int ITER_GEOMETRY = 3;
const int ITER_FRAGMENT = 4;
const float PI = 3.141592653589793;
const float SEA_HEIGHT = 0.55;
const float SEA_CHOPPY = 4.2;
const float SEA_SPEED = 0.85;
const float SEA_FREQ = 0.2;
const vec3 SEA_BASE = vec3(0.016, 0.035, 0.06);
const vec3 SEA_WATER_COLOR = vec3(0.05, 0.12, 0.17);
const mat2 OCTAVE_M = mat2(1.6, 1.2, -1.2, 1.6);

float seaTime() {
  return 1.0 + u_time * SEA_SPEED;
}

float hash(vec2 p) {
  float h = dot(p, vec2(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return -1.0 + 2.0 * mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float seaOctave(vec2 uv, float choppy) {
  uv += noise(uv);
  vec2 wv = 1.0 - abs(sin(uv));
  vec2 swv = abs(cos(uv));
  wv = mix(wv, swv, wv);
  return pow(1.0 - pow(wv.x * wv.y, 0.65), choppy);
}

float map(vec3 p) {
  float freq = SEA_FREQ;
  float amp = SEA_HEIGHT;
  float choppy = SEA_CHOPPY;
  vec2 uv = p.xz;
  uv.x *= 0.75;

  float d = 0.0;
  float h = 0.0;
  float t = seaTime();
  for (int i = 0; i < ITER_GEOMETRY; i++) {
    d = seaOctave((uv + t) * freq, choppy);
    d += seaOctave((uv - t) * freq, choppy);
    h += d * amp;
    uv *= OCTAVE_M;
    freq *= 1.9;
    amp *= 0.22;
    choppy = mix(choppy, 1.0, 0.2);
  }
  return p.y - h;
}

float mapDetailed(vec3 p) {
  float freq = SEA_FREQ;
  float amp = SEA_HEIGHT;
  float choppy = SEA_CHOPPY;
  vec2 uv = p.xz;
  uv.x *= 0.75;

  float d = 0.0;
  float h = 0.0;
  float t = seaTime();
  for (int i = 0; i < ITER_FRAGMENT; i++) {
    d = seaOctave((uv + t) * freq, choppy);
    d += seaOctave((uv - t) * freq, choppy);
    h += d * amp;
    uv *= OCTAVE_M;
    freq *= 1.9;
    amp *= 0.22;
    choppy = mix(choppy, 1.0, 0.2);
  }
  return p.y - h;
}

vec3 getSkyColor(vec3 e) {
  e.y = max(e.y, 0.0);
  return mix(vec3(0.03, 0.045, 0.07), vec3(0.09, 0.13, 0.18), pow(1.0 - e.y, 2.2));
}

float diffuse(vec3 n, vec3 l, float p) {
  return pow(dot(n, l) * 0.4 + 0.6, p);
}

float specular(vec3 n, vec3 l, vec3 e, float s) {
  float nrm = (s + 8.0) / (PI * 8.0);
  return pow(max(dot(reflect(e, n), l), 0.0), s) * nrm;
}

vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist) {
  float fresnel = clamp(1.0 - dot(n, -eye), 0.0, 1.0);
  fresnel = pow(fresnel, 3.0) * 0.55;

  vec3 reflected = getSkyColor(reflect(eye, n));
  vec3 refracted = SEA_BASE + diffuse(n, l, 80.0) * SEA_WATER_COLOR * 0.15;

  vec3 color = mix(refracted, reflected, fresnel);

  float atten = max(1.0 - dot(dist, dist) * 0.0009, 0.0);
  color += SEA_WATER_COLOR * (p.y - SEA_HEIGHT) * 0.18 * atten;
  color += vec3(specular(n, l, eye, 70.0));

  // Foam on steep wave faces, streaked with drifting noise so it reads as churn, not a flat mask.
  float steep = clamp(length(n.xz) * 2.4, 0.0, 1.0);
  float foamNoise = noise(p.xz * 3.2 + u_time * 0.55) * 0.5 + 0.5;
  float foam = smoothstep(0.4, 0.88, steep * (0.55 + 0.45 * foamNoise));
  color = mix(color, vec3(0.78, 0.83, 0.87), foam * 0.6);

  return color;
}

vec3 getNormal(vec3 p, float eps) {
  vec3 n;
  n.y = mapDetailed(p);
  n.x = mapDetailed(vec3(p.x + eps, p.y, p.z)) - n.y;
  n.z = mapDetailed(vec3(p.x, p.y, p.z + eps)) - n.y;
  n.y = eps;
  return normalize(n);
}

float heightMapTracing(vec3 ori, vec3 dir, out vec3 p) {
  float tm = 0.0;
  float tx = 500.0;
  float hx = map(ori + dir * tx);
  if (hx > 0.0) {
    p = ori + dir * tx;
    return tx;
  }
  float hm = map(ori + dir * tm);
  float tmid = 0.0;
  for (int i = 0; i < NUM_STEPS; i++) {
    tmid = mix(tm, tx, hm / (hm - hx));
    p = ori + dir * tmid;
    float hmid = map(p);
    if (hmid < 0.0) {
      tx = tmid;
      hx = hmid;
    } else {
      tm = tmid;
      hm = hmid;
    }
  }
  return tmid;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.06;

  // Close, low camera drifting slowly forward over the surface — deliberately steep
  // so the frame stays filled with water texture instead of showing open horizon.
  vec3 ori = vec3(0.0, 1.55, u_time * 1.1);
  vec3 dir = normalize(vec3(uv.x * 1.15, uv.y * 0.55 - 0.42, -1.0));
  float rot = sin(t) * 0.05;
  dir.xz = mat2(cos(rot), -sin(rot), sin(rot), cos(rot)) * dir.xz;

  vec3 p;
  heightMapTracing(ori, dir, p);
  vec3 dist = p - ori;
  float epsNrm = max(0.1 / u_resolution.x, 0.0006) * dot(dist, dist) * 0.02 + 0.0008;
  vec3 n = getNormal(p, epsNrm);

  vec3 light = normalize(vec3(0.0, 0.95, 0.55));

  vec3 color = mix(
    getSkyColor(dir),
    getSeaColor(p, n, light, dir, dist),
    pow(smoothstep(0.0, -0.02, dir.y), 0.25)
  );

  color = pow(color, vec3(0.62));
  gl_FragColor = vec4(color, 1.0);
}
`

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Ocean shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function OceanBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = (canvas.getContext('webgl', { antialias: false, powerPreference: 'low-power', alpha: false }) ||
      canvas.getContext('experimental-webgl', { antialias: false } as WebGLContextAttributes)) as WebGLRenderingContext | null
    if (!gl) return

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC)
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC)
    if (!vs || !fs) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Ocean shader link error:', gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

    const posLoc = gl.getAttribLocation(program, 'a_position')
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const timeLoc = gl.getUniformLocation(program, 'u_time')
    const resLoc = gl.getUniformLocation(program, 'u_resolution')

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let running = true
    let frameW = 0
    let frameH = 0
    const startTime = performance.now()

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const scale = rect.width < 768 ? 0.2 : 0.3
      frameW = Math.max(1, Math.round(rect.width * scale))
      frameH = Math.max(1, Math.round(rect.height * scale))
      canvas.width = frameW
      canvas.height = frameH
      gl.viewport(0, 0, frameW, frameH)
    }
    resize()
    window.addEventListener('resize', resize)

    function tick() {
      if (!running) {
        raf = 0
        return
      }
      const elapsed = reducedMotion ? 0 : (performance.now() - startTime) / 1000
      gl!.uniform1f(timeLoc, elapsed)
      gl!.uniform2f(resLoc, frameW, frameH)
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
      raf = reducedMotion ? 0 : requestAnimationFrame(tick)
    }
    tick()

    const observer = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting
        if (running && !raf) tick()
      },
      { threshold: 0 }
    )
    observer.observe(canvas)

    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      observer.disconnect()
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buffer)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ display: 'block' }} aria-hidden="true" />
}
