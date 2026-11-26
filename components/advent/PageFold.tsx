"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type PageFoldHandle = {
  play: (
    point: { x: number; y: number },
    berlin: boolean,
    onStart: () => void,
    variant?: number,
  ) => Promise<boolean>;
};

const VERTEX = `attribute vec2 p; varying vec2 uv; void main(){uv=p*.5+.5; gl_Position=vec4(p,0.,1.);}`;
const FRAGMENT = `
precision highp float;
varying vec2 uv;
uniform sampler2D page;
uniform vec2 origin;
uniform float progress;
uniform float aspect;
uniform float berlin;
uniform float variant;
vec2 mirror(vec2 p){return 1.-abs(mod(p,2.)-1.);}
void main(){
  float t=progress;
  float fold=smoothstep(0.,.65,t);
  vec2 q=uv-origin;
  q.x*=aspect;
  float radius=length(q);
  float angle=atan(q.y,q.x);
  // The clicked door becomes a recursive vanishing point. Each annulus
  // contains another copy of this exact page, folded into six mirrored faces.
  float sectors=mix(4.,6.,berlin);
  float wedge=6.283185/sectors;
  float a=abs(mod(angle+t*t*1.7+wedge*.5,wedge)-wedge*.5);
  float depth=-log(max(radius,.0005))/.75 + t*3.;
  float ring=floor(depth);
  float r=exp(-fract(depth)*.75);
  vec2 recursive=vec2(cos(a),sin(a))*r;
  recursive.x/=aspect;
  recursive=mirror(recursive*.85+origin+vec2(ring*.073));
  if(variant>1.5){
    // A mirrored prism made of the actual typography, figures and doors.
    vec2 kaleido=vec2(cos(a),sin(a))*radius*(1.+t*7.);
    kaleido.x/=aspect;
    recursive=mirror(kaleido+origin);
  } else if(variant>.5){
    // Rectangular Droste frames: the calendar contains the calendar.
    float box=max(abs(q.x)/aspect,abs(q.y));
    float layer=floor(-log(max(box,.0005))/.65+t*3.);
    float zoom=exp(layer*.65-t*1.95);
    vec2 nested=q*zoom;
    nested.x/=aspect;
    recursive=mirror(nested+origin);
  }
  recursive=mix(uv,recursive,fold);
  vec2 bend=q*.018*sin(radius*28.-t*12.)*fold;
  vec3 color;
  color.r=texture2D(page,mirror(recursive+bend)).r;
  color.g=texture2D(page,mirror(recursive)).g;
  color.b=texture2D(page,mirror(recursive-bend)).b;
  float edge=pow(abs(sin(depth*3.141593)),24.);
  color*=1.-fold*.55;
  color+=mix(vec3(.35,.16,.04),vec3(.08,.16,.32),berlin)*edge*fold*.35;
  float fade=1.-smoothstep(.72,1.,t);
  gl_FragColor=vec4(color,fade);
}`;

export const PageFold = forwardRef<PageFoldHandle>(function PageFold(_, ref) {
  const [active, setActive] = useState(false);
  const busy = useRef(false);
  const mounted = useRef(true);
  const cancel = useRef<() => void>(() => {});
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      cancel.current();
    };
  }, []);
  useImperativeHandle(
    ref,
    () => ({
      async play(point, berlin, onStart, variant = 0) {
        if (busy.current) return false;
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
        busy.current = true;
        let canvas: HTMLCanvasElement | undefined;
        let gl: WebGLRenderingContext | null = null;
        let frame = 0;
        let timer: ReturnType<typeof setTimeout> | undefined;
        let finish: (value: boolean) => void = () => {};
        let cancelled = false;
        cancel.current = () => {
          cancelled = true;
          finish(mounted.current);
        };
        try {
          const width = innerWidth,
            height = innerHeight;
          // Lazy loaded: the calendar's initial render has no capture-library cost.
          const capture = import("html-to-image").then(({ toCanvas }) =>
            toCanvas(document.body, {
              width,
              height,
              pixelRatio: Math.min(1, 1200 / width, 1200 / height),
              preferredFontFormat: "woff2",
              style: {
                transform: `translateY(${-scrollY}px)`,
                transformOrigin: "top left",
                margin: "0",
              },
              filter: (node) =>
                !["SCRIPT", "STYLE", "NEXTJS-PORTAL", "IFRAME"].includes(
                  node.tagName,
                ) && !node.hasAttribute?.("data-fold-exclude"),
            }),
          );
          const snapshot = await Promise.race([
            capture,
            new Promise<null>((resolve) => {
              timer = setTimeout(() => resolve(null), 1800);
            }),
          ]);
          clearTimeout(timer);
          if (!snapshot || !mounted.current || cancelled)
            return mounted.current;
          canvas = document.createElement("canvas");
          canvas.dataset.foldExclude = "";
          canvas.dataset.pageFold = "";
          canvas.setAttribute("aria-hidden", "true");
          canvas.width = snapshot.width;
          canvas.height = snapshot.height;
          Object.assign(canvas.style, {
            position: "fixed",
            inset: "0",
            width: "100vw",
            height: "100dvh",
            zIndex: "100",
            pointerEvents: "auto",
          });
          gl = canvas.getContext("webgl", {
            alpha: true,
            premultipliedAlpha: false,
            depth: false,
          });
          if (!gl) return true;
          const program = gl.createProgram()!;
          for (const [type, source] of [
            [gl.VERTEX_SHADER, VERTEX],
            [gl.FRAGMENT_SHADER, FRAGMENT],
          ] as const) {
            const shader = gl.createShader(type)!;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
              throw new Error("Page fold shader unavailable");
            gl.attachShader(program, shader);
            gl.deleteShader(shader);
          }
          gl.linkProgram(program);
          if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return true;
          gl.useProgram(program);
          const buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 3, -1, -1, 3]),
            gl.STATIC_DRAW,
          );
          const position = gl.getAttribLocation(program, "p");
          gl.enableVertexAttribArray(position);
          gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
          const texture = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            snapshot,
          );
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.uniform2f(
            gl.getUniformLocation(program, "origin"),
            point.x / width,
            1 - point.y / height,
          );
          gl.uniform1f(
            gl.getUniformLocation(program, "aspect"),
            width / height,
          );
          gl.uniform1f(
            gl.getUniformLocation(program, "berlin"),
            berlin ? 1 : 0,
          );
          gl.uniform1f(gl.getUniformLocation(program, "variant"), variant % 3);
          const progress = gl.getUniformLocation(program, "progress");
          gl.viewport(0, 0, canvas.width, canvas.height);
          document.body.appendChild(canvas);
          setActive(true);
          onStart();
          const result = await new Promise<boolean>((resolve) => {
            finish = resolve;
            const start = performance.now();
            const draw = (now: number) => {
              const t = Math.min(1, (now - start) / 2100);
              gl!.uniform1f(progress, t);
              gl!.drawArrays(gl!.TRIANGLES, 0, 3);
              canvas!.dataset.progress = t.toFixed(2);
              if (t < 1 && !cancelled) frame = requestAnimationFrame(draw);
              else resolve(mounted.current);
            };
            frame = requestAnimationFrame(draw);
          });
          gl.deleteTexture(texture);
          gl.deleteBuffer(buffer);
          gl.deleteProgram(program);
          return result;
        } catch {
          // A blocked font/image or unavailable GPU must never block the content.
          return mounted.current;
        } finally {
          clearTimeout(timer);
          cancelAnimationFrame(frame);
          canvas?.remove();
          gl?.getExtension("WEBGL_lose_context")?.loseContext();
          busy.current = false;
          cancel.current = () => {};
          if (mounted.current) setActive(false);
        }
      },
    }),
    [],
  );
  useEffect(() => {
    if (!active) return;
    const skip = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        cancel.current();
      }
    };
    document.addEventListener("keydown", skip);
    return () => document.removeEventListener("keydown", skip);
  }, [active]);
  return active ? (
    <button
      type="button"
      data-fold-exclude
      className="adv-fold-skip"
      onClick={() => cancel.current()}
    >
      Skip effect <kbd>Esc</kbd>
    </button>
  ) : null;
});
