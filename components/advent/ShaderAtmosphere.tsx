"use client";

import { logAdvent } from "./advent-debug";
import { canvasScale } from "./render-budget";

import { useEffect, useRef } from "react";
import type { MusicFrame } from "./jingles";

// Original procedural artwork: a single triangle, with no textures or assets.
const VERTEX_SHADER = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const FRAGMENT_SHADER = `
precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_size;
uniform float u_time;
uniform float u_mode;
uniform float u_beat;
uniform float u_build;
uniform float u_travel;
uniform float u_slop;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x),
             mix(hash(i + vec2(0., 1.)), hash(i + 1.), f.x), f.y);
}
float segment(vec2 p, vec2 a, vec2 b) {
  vec2 ba = b - a;
  return length(p - a - ba * clamp(dot(p - a, ba) / dot(ba, ba), 0., 1.));
}
float crystal(vec2 p, float aa) {
  float a = mod(atan(p.y, p.x) + .523599, 1.047198) - .523599;
  vec2 q = length(p) * vec2(cos(a), abs(sin(a)));
  float d = segment(q, vec2(0.), vec2(.94, 0.)) - .025;
  d = min(d, segment(q, vec2(.37, 0.), vec2(.61, .24)) - .02);
  d = min(d, segment(q, vec2(.64, 0.), vec2(.85, .21)) - .018);
  return 1. - smoothstep(-aa, aa, d);
}
vec2 snow(vec2 uv, float scale, float speed, float depth) {
  vec2 q = uv * scale;
  q.y -= u_travel * speed;
  q.x += sin(uv.y * 9. - u_time * 1.4 + depth) * u_build * .65;
  q.x += cos(uv.y * 14. + depth * 3. + u_time) * u_build * .18;
  q.x += u_time * .025 * depth + sin(u_time * .12) * .13;
  vec2 id = floor(q);
  float seed = hash(id + depth * 17.);
  vec2 center = vec2(hash(id + 12.7), hash(id + 36.1)) * .6 + .2;
  vec2 p = fract(q) - center;
  p.x += sin(u_time * .4 + seed * 30.) * .055;
  float radius = mix(.025, .075, seed) * depth;
  float aa = scale / u_resolution.x;
  float shape;
  if (depth > 1.3) {
    float angle = seed * 6.283185 + u_time * .045 * (seed - .5);
    p = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * p;
    shape = crystal(p / radius, aa / radius);
  } else {
    shape = 1. - smoothstep(radius * .4, radius + aa * 1.6, length(p));
  }
  float filament = exp(-abs(p.x) * 110.) * exp(-p.y * p.y * 25.);
  shape = mix(shape, max(shape * .6, filament), u_build * .7);
  float halo = exp(-dot(p, p) / max(.0001, radius * radius * 5.)) * .12;
  return vec2(shape, halo) * mix(.22, .9, depth / 2.);
}
float hexagon(vec2 p) {
  p = abs(p);
  return max(p.x * .866025 + p.y * .5, p.y);
}
void main() {
  vec2 screen = gl_FragCoord.xy / u_resolution;
  vec2 css = vec2(screen.x, 1. - screen.y) * u_size;
  vec2 uv = css / max(u_size.x, 900.);
  float unit = min(u_size.x, 1100.);
  vec2 p = (css - vec2(u_size.x * .5, 255.)) / unit;
  float side = smoothstep(.16, .48, abs(p.x));
  float hero = exp(-p.y * p.y * 2.56);
  float grain = (hash(gl_FragCoord.xy) - .5) * .014;

  vec3 winter = vec3(.985, .963, .914);
  winter += vec3(.038, .018, -.015) * exp(-dot(p - vec2(-.45, -.1), p - vec2(-.45, -.1)) * 2.5);
  float mist = noise(uv * 5. + vec2(u_time * .016, -u_time * .008));
  float ribbon = sin(p.x * 4.5 + noise(p * 2. + u_time * .015) * 4. + u_time * .07);
  float band = (p.y + .22 + ribbon * .10) * 8.;
  float aurora = exp(-band * band);
  winter += vec3(-.065, .018, .012) * aurora * (.2 + .8 * side);
  winter += vec3(.012, -.026, .03) * mist * hero;

  vec3 acid = vec3(.72, .96, .39);
  vec3 silver = vec3(.66, .75, .78);
  vec3 club = vec3(.019, .024, .027);
  club += acid * aurora * .035;
  club += silver * exp(-dot(p - vec2(.55, -.05), p - vec2(.55, -.05)) * 4.) * .055;
  club += acid * exp(-dot(p + vec2(.6, -.2), p + vec2(.6, -.2)) * 5.) * .025;

  float turn = u_build * sin(u_time * .28) * .55;
  vec2 portal = mat2(cos(turn), -sin(turn), sin(turn), cos(turn)) * p;
  portal.x += sin(u_time * .09) * .008;
  float radius = hexagon(portal);
  float rings = 0.;
  for (int i = 0; i < 6; i++) {
    float r = .24 + float(i) * .095 - fract(u_travel * .045 + float(i) * .14) * u_build * .12;
    float d = abs(radius - r);
    rings += exp(-d * 950.) * (.7 + .3 * sin(float(i) + u_time * .3));
    rings += exp(-d * 90.) * .012;
  }
  float sweep = .65 + .35 * sin(atan(portal.y, portal.x) * 3. - u_time * .18);
  club += mix(acid, silver, smoothstep(-.4, .4, p.x)) * rings * side * hero * sweep * (1. + u_beat * 1.1 + u_build * 1.5);

  float pressure = sin(length(p) * 48. - u_travel * 2.2);
  club += silver * pow(max(0., pressure), 16.) * side * hero * u_build * .10;
  float ray = abs(sin(atan(portal.y, portal.x) * 9. + u_time * .08));
  club += acid * exp(-ray * 110.) * side * hero * (.035 + u_beat * .06) * u_mode;
  // Red/blue light catches the steel as the room opens into afterhours.
  float beam = pow(max(0., cos(p.x * 5. + sin(u_time * .13) * 2.)), 24.);
  club += mix(vec3(.10, .25, .95), vec3(.95, .08, .16), step(0., p.x))
    * beam * side * hero * (.10 + u_build * .35);
  club += vec3(noise(css * .4) - .5) * .025;

  float horizon = p.y + .10;
  if (horizon > .04) {
    vec2 grid = vec2(p.x / horizon * 2.5, 1. / horizon + u_travel * .15);
    vec2 cell = abs(fract(grid) - .5);
    float line = 1. - smoothstep(.008, .021, min(cell.x, cell.y));
    float fade = smoothstep(.04, .32, horizon) * exp(-horizon * 1.5);
    club += acid * line * fade * side * .055;
  }

  vec2 snowfall = snow(uv, 48., .42, .55);
  snowfall += snow(uv, 30., .33, .75);
  snowfall += snow(uv, 18., .26, 1.);
  snowfall += snow(uv, 9., .20, 1.55);
  snowfall += snow(uv, 5.5, .16, 1.9);
  float textClearance = mix(.45, 1., side) * mix(1., .7, exp(-p.y * p.y * 14.));
  winter = mix(winter, vec3(.57, .67, .68), clamp(snowfall.x * .18 * textClearance, 0., .45));
  winter += vec3(.04) * snowfall.y;
  club += mix(vec3(.57, .7, .76), acid, .35 + .25 * sin(p.y * 4.)) * snowfall.x * textClearance * .58;
  club += silver * snowfall.y * .18;
  vec3 color = mix(winter, club, u_mode);
  color += grain * mix(.3, .5, u_mode);
  // Slop escalates from glossy aurora into repeated, mirrored inversions.
  if (u_slop > .001) {
    vec2 goo=(css-u_size*.5)/min(u_size.x,u_size.y);
    float a=atan(goo.y,goo.x)+u_time*.13*u_slop;
    float sectors=3.+floor(u_slop*6.);
    a=abs(mod(a+3.14159/sectors,6.28318/sectors)-3.14159/sectors);
    vec2 fold=length(goo)*vec2(cos(a),sin(a));
    for(int i=0;i<4;i++) fold=abs(fold)/max(dot(fold,fold),.22)-vec2(.82,.63)+sin(u_time*.17)*.03*u_slop;
    vec3 rainbow=.55+.45*cos(vec3(.2,2.4,4.5)+length(fold)*2.+u_time*.3);
    vec3 gloss=mix(vec3(.77,.58,.95),vec3(.98,.64,.84),.5+.5*sin(goo.x*4.+goo.y*3.+u_time*.3));
    color=mix(color,gloss,u_slop*.24);
    color=mix(color,rainbow,smoothstep(.22,1.,u_slop)*.72);
    color+=pow(max(0.,sin(length(fold)*9.-u_time)),16.)*u_slop*.15;
  }
  gl_FragColor = vec4(color, 1.);
}
`;

type ShaderAtmosphereProps = {
  techno: boolean;
  slop?: number;
  reducedMotion: boolean;
  getFrame: () => MusicFrame;
};

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

export function ShaderAtmosphere({
  techno,
  slop = 0,
  reducedMotion,
  getFrame,
}: ShaderAtmosphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef({ techno, slop, reducedMotion, getFrame });
  const invalidateRef = useRef<() => void>(() => {});
  inputRef.current = { techno, slop, reducedMotion, getFrame };

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!canvas) return;

    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let uniforms: Record<string, WebGLUniformLocation | null> = {};
    let frame = 0;
    let lastTime = 0;
    let elapsed = 12;
    let travel = 12;
    let mode = inputRef.current.techno ? 1 : 0;
    let inView = true;
    let lost = false;
    let disposed = false;
    let dirty = true;
    let width = 1;
    let height = 1;

    function release() {
      if (!gl) return;
      gl.useProgram(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      buffer = null;
      program = null;
    }
    function initialize() {
      canvas.dataset.renderer = "fallback";
      if (!gl || gl.isContextLost()) return false;
      const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
      const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      const nextProgram = gl.createProgram();
      if (!vertex || !fragment || !nextProgram) {
        if (vertex) gl.deleteShader(vertex);
        if (fragment) gl.deleteShader(fragment);
        if (nextProgram) gl.deleteProgram(nextProgram);
        return false;
      }
      gl.attachShader(nextProgram, vertex);
      gl.attachShader(nextProgram, fragment);
      gl.bindAttribLocation(nextProgram, 0, "a_position");
      gl.linkProgram(nextProgram);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(nextProgram, gl.LINK_STATUS)) {
        gl.deleteProgram(nextProgram);
        return false;
      }
      const nextBuffer = gl.createBuffer();
      if (!nextBuffer) {
        gl.deleteProgram(nextProgram);
        return false;
      }
      release();
      program = nextProgram;
      buffer = nextBuffer;
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
      );
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      uniforms = Object.fromEntries(
        [
          "u_resolution",
          "u_size",
          "u_time",
          "u_mode",
          "u_beat",
          "u_build",
          "u_travel",
          "u_slop",
        ].map((name) => [name, gl.getUniformLocation(program, name)]),
      );
      canvas.dataset.renderer = "webgl";
      return true;
    }
    initialize();
    logAdvent("atmosphere.renderer", { renderer: canvas.dataset.renderer });

    const root = canvas.parentElement;
    const setStyle = (el: HTMLElement | null, key: string, value: string) => {
      if (el && el.style.getPropertyValue(key) !== value)
        el.style.setProperty(key, value);
    };
    function schedule() {
      if (!frame && !disposed && inView && !document.hidden) {
        frame = requestAnimationFrame(draw);
      }
    }
    function invalidate() {
      dirty = true;
      schedule();
    }
    function draw(now: number) {
      frame = 0;
      if (disposed || !inView || document.hidden) {
        lastTime = 0;
        return;
      }
      const input = inputRef.current;
      if (!dirty && lastTime && now - lastTime < 1000 / 30 - 1) {
        schedule();
        return;
      }
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.06) : 0;
      lastTime = now;
      dirty = false;
      if (!input.reducedMotion) elapsed += dt;
      const music = input.getFrame();
      const target = input.techno ? 1 : 0;
      mode = input.reducedMotion ? target : music.mix;
      const build = input.reducedMotion ? 0 : music.build;
      setStyle(root, "--adv-scene", mode.toFixed(3));
      setStyle(root, "--adv-tension", build.toFixed(3));
      const pulse = input.reducedMotion ? "0" : (music.pulse * mode).toFixed(2);
      root
        ?.querySelectorAll<HTMLElement>(".adv-santa-heart, .adv-garland")
        .forEach((el) => setStyle(el, "--adv-pulse", pulse));
      setStyle(root, "--adv-ink", mode > 0.5 ? "1" : "0");
      const phase = mode > 0.5 ? "berlin" : "winter";
      if (root && root.dataset.scenePhase !== phase)
        root.dataset.scenePhase = phase;
      const dialog = document.querySelector<HTMLElement>(".adv-dialog");
      setStyle(dialog, "--adv-scene", mode.toFixed(3));
      setStyle(dialog, "--adv-ink", mode > 0.5 ? "1" : "0");
      if (!input.reducedMotion) travel += dt * (1 + mode * 3 + build * 4);
      if (
        gl &&
        program &&
        !lost &&
        !document.querySelector("[data-page-fold], [data-welcome-flight]")
      ) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
        gl.uniform2f(uniforms.u_size, width, height);
        gl.uniform1f(uniforms.u_time, elapsed);
        gl.uniform1f(uniforms.u_mode, mode);
        gl.uniform1f(uniforms.u_build, build);
        gl.uniform1f(uniforms.u_travel, travel);
        gl.uniform1f(uniforms.u_slop, input.slop);
        gl.uniform1f(
          uniforms.u_beat,
          input.reducedMotion ? 0 : music.pulse * mode,
        );
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      if (!input.reducedMotion && (program || Math.abs(mode - target) > 0.001))
        schedule();
    }

    function resize() {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const scale = canvasScale(width, height, 700_000);
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      invalidate();
    }
    function visibilityChanged() {
      lastTime = 0;
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else invalidate();
    }
    function contextLost(event: Event) {
      event.preventDefault();
      logAdvent("atmosphere.context_lost");
      lost = true;
      canvas.dataset.renderer = "fallback";
      cancelAnimationFrame(frame);
      frame = 0;
      invalidate();
    }
    function contextRestored() {
      logAdvent("atmosphere.context_restored");
      lost = !initialize();
      lastTime = 0;
      resize();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      lastTime = 0;
      if (inView) invalidate();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", visibilityChanged);
    canvas.addEventListener("webglcontextlost", contextLost);
    canvas.addEventListener("webglcontextrestored", contextRestored);
    invalidateRef.current = invalidate;
    resize();

    return () => {
      disposed = true;
      canvas.dataset.renderer = "fallback";
      invalidateRef.current = () => {};
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", visibilityChanged);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      release();
    };
  }, []);

  useEffect(() => {
    invalidateRef.current();
  }, [techno, reducedMotion, slop]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      data-renderer="fallback"
      className="adv-atmosphere pointer-events-none absolute inset-0"
      style={{
        width: "100%",
        height: "100%",
        background: techno
          ? "radial-gradient(ellipse at 10% 15%, #19251d, #080a0c 70%)"
          : "radial-gradient(ellipse at 85% 0%, #e6eeeb, #f4f3ee 75%)",
      }}
    />
  );
}
