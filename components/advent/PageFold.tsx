"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import { getFoldSeconds, FOLD_REVEAL } from "./fold-timing";

export type PageFoldHandle = {
  skip: () => void;
  play: (
    point: { x: number; y: number },
    berlin: boolean,
    onStart: () => void | (() => void),
    onReveal: () => void,
    variant?: number,
    closing?: boolean,
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
uniform float closing;
uniform vec2 cardSize;
vec2 mirror(vec2 p){return 1.-abs(mod(p,2.)-1.);}
void main(){
  float t=progress;
  if(closing>.5){
    // One continuous camera pullback, from deep inside the selected door.
    float outT=1.-t;
    float travel=1.-pow(1.-outT,3.);
    float zoom=exp(log(9.)*(1.-travel));
    vec2 focus=mix(origin,vec2(.5),travel);
    vec2 scene=(uv-.5)/zoom+focus;
    vec2 fringe=(uv-.5)*.006*berlin*(1.-travel);
    vec3 color;
    color.r=texture2D(page,clamp(scene+fringe,0.,1.)).r;
    color.g=texture2D(page,clamp(scene,0.,1.)).g;
    color.b=texture2D(page,clamp(scene-fringe,0.,1.)).b;
    float opacity=smoothstep(0.,.1,outT)*(1.-smoothstep(.92,1.,outT));
    gl_FragColor=vec4(color,opacity);
    return;
  }
  float fold=smoothstep(0.,.3,t);
  float peak=smoothstep(.28,.64,t)*(1.-smoothstep(.78,1.,t));
  vec2 center=mix(origin,vec2(.5),smoothstep(.3,.68,t));
  vec2 q=uv-center;
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
  // Repeated inversion opens a second, much deeper geometry inside the page.
  vec2 inner=q*1.6;
  float angle2=t*1.7;
  mat2 turn=mat2(cos(angle2),-sin(angle2),sin(angle2),cos(angle2));
  for(int i=0;i<5;i++){
    inner=abs(inner)/max(dot(inner,inner),.18)-vec2(.8,.65);
    inner=turn*inner;
  }
  vec2 abyss=mirror(inner*.23+vec2(t*.17,-t*.1));
  recursive=mix(recursive,abyss,peak*.88);
  recursive=mix(uv,recursive,fold);
  vec2 bend=q*.018*sin(radius*28.-t*12.)*fold;
  vec3 color;
  color.r=texture2D(page,mirror(recursive+bend)).r;
  color.g=texture2D(page,mirror(recursive)).g;
  color.b=texture2D(page,mirror(recursive-bend)).b;
  float edge=pow(abs(sin(depth*3.141593)),24.);
  color*=1.-fold*.55;
  color+=mix(vec3(.35,.16,.04),vec3(.08,.16,.32),berlin)*edge*fold*.35;
  vec3 spectral=.5+.5*cos(vec3(0.,2.1,4.2)+length(inner)*1.4+t*5.);
  color=mix(color,color*.5+spectral*.38,peak*.7);
  if(berlin<.5){
    // Christmas: fold the page into the chosen box, then carry it to the window.
    vec2 winterCenter=mix(vec2(.5),origin,smoothstep(0.,.38,t));
    winterCenter=mix(winterCenter,vec2(.5),smoothstep(.38,.68,t));
    vec2 pageScale=mix(vec2(1.),vec2(.14,.18),smoothstep(0.,.38,t));
    pageScale=mix(pageScale,vec2(cardSize.x/aspect,cardSize.y),smoothstep(.38,.68,t));
    vec2 mapped=(uv-winterCenter)/pageScale+.5;
    mapped+=sin(mapped.yx*10.+t*4.)*.012*sin(t*3.141593);
    float inside=step(0.,mapped.x)*step(mapped.x,1.)*step(0.,mapped.y)*step(mapped.y,1.);
    vec3 paper=vec3(.985,.963,.914);
    vec3 image=texture2D(page,clamp(mapped,0.,1.)).rgb;
    vec3 echo=texture2D(page,mirror(mapped*1.04)).rgb;
    color=mix(paper,mix(image,echo,.09*sin(t*3.141593)),inside);
  }
  float arrival=smoothstep(.68,1.,t);
  float size=mix(.12,1.,arrival);
  // Reveal the real dialog through a portal with its exact shape and scale.
  vec2 box=abs((uv-.5)*vec2(aspect,1.))-cardSize*.5*size;
  float distance=length(max(box,0.))+min(max(box.x,box.y),0.);
  float aperture=(1.-smoothstep(-.012,.012,distance))*smoothstep(.68,.74,t);
  float edgeGlow=exp(-abs(distance)*160.)*sin(arrival*3.141593);
  color+=mix(vec3(.26,.13,.04),vec3(.16,.26,.4),berlin)*edgeGlow;
  float fade=(1.-aperture)*(1.-smoothstep(.88,1.,t));

  gl_FragColor=vec4(color,fade);
}`;

export const PageFold = forwardRef<PageFoldHandle>(function PageFold(_, ref) {
  const [active, setActive] = useState(false);
  const busy = useRef(false);
  const lastSnapshot = useRef<HTMLCanvasElement | null>(null);
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
      skip: () => cancel.current(),
      async play(
        point,
        berlin,
        onStart,
        onReveal,
        variant = 0,
        closing = false,
      ) {
        if (busy.current) return false;
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
        busy.current = true;
        let canvas: HTMLCanvasElement | undefined;
        let gl: WebGLRenderingContext | null = null;
        let frame = 0;
        let timer: ReturnType<typeof setTimeout> | undefined;
        let finish: (value: boolean) => void = () => {};
        let cancelled = false;
        let stopSound: void | (() => void);
        let revealed = false;
        cancel.current = () => {
          cancelled = true;
          if (typeof stopSound === "function") stopSound();
          finish(mounted.current);
        };
        try {
          const width = innerWidth,
            height = innerHeight;
          // Lazy loaded: the calendar's initial render has no capture-library cost.
          const capture =
            closing && lastSnapshot.current
              ? Promise.resolve(lastSnapshot.current)
              : import("html-to-image").then(({ toCanvas }) =>
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
          if (!closing) lastSnapshot.current = snapshot;
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
          gl.uniform1f(
            gl.getUniformLocation(program, "closing"),
            closing ? 1 : 0,
          );
          const progress = gl.getUniformLocation(program, "progress");
          const cardSize = gl.getUniformLocation(program, "cardSize");
          gl.viewport(0, 0, canvas.width, canvas.height);
          document.body.appendChild(canvas);
          setActive(true);
          stopSound = onStart();
          const result = await new Promise<boolean>((resolve, reject) => {
            finish = resolve;
            const start = performance.now();
            const draw = (now: number) => {
              try {
                const elapsed = Math.min(
                  1,
                  (now - start) / (getFoldSeconds(berlin, closing) * 1000),
                );
                const t = closing ? 1 - elapsed : elapsed;
                if (
                  (closing ? elapsed >= 0.1 : t >= FOLD_REVEAL) &&
                  !revealed
                ) {
                  revealed = true;
                  onReveal();
                }
                const dialog =
                  document.querySelector<HTMLElement>(".adv-dialog");
                const linear = Math.max(
                  0,
                  Math.min(1, (t - FOLD_REVEAL) / (1 - FOLD_REVEAL)),
                );
                const arrival = closing
                  ? Math.max(0, 1 - elapsed / 0.1)
                  : linear * linear * (3 - 2 * linear);
                if (dialog) {
                  dialog.dataset.arriving = "";
                  dialog.dataset.folded = "";
                  dialog.style.setProperty("--adv-arrival", arrival.toFixed(4));
                }
                gl!.uniform2f(
                  cardSize,
                  (dialog?.offsetWidth ?? 560) / height,
                  (dialog?.offsetHeight ?? 600) / height,
                );
                gl!.uniform1f(progress, t);
                gl!.drawArrays(gl!.TRIANGLES, 0, 3);
                canvas!.dataset.progress = t.toFixed(2);
                if (elapsed < 1 && !cancelled)
                  frame = requestAnimationFrame(draw);
                else resolve(mounted.current);
              } catch (error) {
                reject(error);
              }
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
          const dialog = document.querySelector<HTMLElement>(".adv-dialog");
          if (dialog) {
            delete dialog.dataset.arriving;
            dialog.style.removeProperty("--adv-arrival");
            if (!closing) dialog.focus({ preventScroll: true });
          }
          gl?.getExtension("WEBGL_lose_context")?.loseContext();
          if (closing) lastSnapshot.current = null;
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
  return active
    ? createPortal(
        <button
          type="button"
          data-fold-exclude
          className="adv-fold-skip"
          onPointerDown={(event) => {
            // Keep a modal's outside-click handler from dismissing its content.
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
            cancel.current();
          }}
        >
          Skip effect <kbd>Esc</kbd>
        </button>,
        document.body,
      )
    : null;
});
