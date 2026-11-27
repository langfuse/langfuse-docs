"use client";

import { captureAdvent } from "./capture";
import { WINTER_OPTICS } from "./winter-optics";

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
uniform sampler2D panel;
uniform float hasPanel;
uniform vec2 origin;
uniform float progress;
uniform float aspect;
uniform float berlin;
uniform float variant;
uniform float closing;
uniform vec2 cardSize;
vec2 mirror(vec2 p){return 1.-abs(mod(p,2.)-1.);}
${WINTER_OPTICS}
void main(){
  float t=progress;
  if(closing>.5){
    // The actual window separates along six crystal faces and returns to its door.
    // The calendar stays at its real size throughout the return.
    float c=1.-t;
    float flight=smoothstep(.07,.94,c);
    vec2 landing=(origin-.5)*vec2(aspect,1.);
    vec2 p=(uv-.5)*vec2(aspect,1.);
    vec3 color=texture2D(page,uv).rgb;
    vec3 backdrop=mix(mix(color,vec3(.985,.975,.95),.82),color*.22,berlin);
    color=mix(backdrop,color,smoothstep(.12,.85,c));
    for(int i=0;i<6;i++){
      float a=float(i)*TAU/6.;
      vec2 wind=vec2(cos(a),sin(a))*sin(flight*3.141593)*.13;
      vec2 center=landing*flight+wind;
      float shrink=max(.025,1.-flight);
      vec2 local=spin(-flight*(.55+berlin*.65))*(p-center)/shrink;
      vec2 tex=local/cardSize+.5;
      float angle=mod(atan(local.y,local.x)+TAU,TAU);
      float sector=step(a,angle)*(1.-step(a+TAU/6.,angle));
      float inside=step(0.,tex.x)*step(tex.x,1.)*step(0.,tex.y)*step(tex.y,1.);
      vec4 fragment=texture2D(panel,clamp(tex,0.,1.));
      vec2 cell=floor(tex*vec2(42.,48.));
      float melt=smoothstep(.22,.82,c);
      vec2 dust=fract(tex*vec2(42.,48.))-vec2(.32+.36*grain(cell),.32+.36*grain(cell+7.));
      float needles=min(abs(dust.x),min(abs(dust.y*.866+dust.x*.5),abs(dust.y*.866-dust.x*.5)));
      float powder=(1.-smoothstep(.02,.065,needles))*(1.-smoothstep(.23,.46,length(dust)));
      float frost=smoothstep(melt-.16,melt+.06,grain(cell))*mix(1.,powder,smoothstep(.22,.5,c));
      float facet=sector*inside*fragment.a*hasPanel;
      vec3 ice=mix(vec3(.63,.9,.87),vec3(.29,.48,.83),berlin);
      vec3 face=mix(fragment.rgb,ice,smoothstep(.05,.42,c)*.75);
      color=mix(color,face,facet*frost);
      color+=ice*facet*(1.-frost)*exp(-length(fract(tex*vec2(42.,48.))-.5)*14.)*(1.-flight)*.8;
    }
    vec2 snow=(p-landing*flight)/max(.025,(1.-flight)*.45);
    float etch=exp(-crystal(spin(flight*.6)*snow)*180.);
    color+=mix(vec3(.44,.67,.59),vec3(.22,.32,.65),berlin)*etch*sin(c*3.141593)*.5;
    float opacity=smoothstep(0.,.065,c)*(1.-smoothstep(.90,1.,c));
    gl_FragColor=vec4(color,opacity);
    return;
  }
  if(berlin<.5){
    // A crystal grows from the door, refracts the page through six mirrors,
    // and carries us through its branches before the real window thaws out.
    float grow=smoothstep(0.,.23,t);
    float travel=smoothstep(.14,.86,t)*2.8;
    vec2 center=mix(origin,vec2(.5),smoothstep(.08,.40,t));
    vec2 p=(uv-center)*vec2(aspect,1.);
    float r=length(p);
    vec2 k=sixfold(spin(t*.42)*p);
    float depth=-log(max(r,.002))*.8+travel;
    vec2 refract=sixfold(k*(1.3+fract(depth)*1.9));
    refract=mirror(refract/vec2(aspect,1.)+origin+floor(depth)*.13);
    vec2 prism=vec2(.004,-.003)*sin(t*3.141593);
    vec3 reflection=vec3(texture2D(page,refract+prism).r,
      texture2D(page,refract).g,texture2D(page,refract-prism).b);
    vec3 vault=winterVault(p,travel,1.);
    vault+=reflection*.25*(.5+.5*cos(depth*TAU));
    float seed=exp(-crystal(p/max(.02,grow*.9))*170.);
    vault+=vec3(.5,.72,.64)*seed*(1.-smoothstep(.25,.5,t));
    float radius=grow*2.2;
    float iris=1.-smoothstep(radius-.1,radius,r*(.86+.14*cos(atan(p.y,p.x)*6.)));
    vec3 color=mix(texture2D(page,uv).rgb,vault,iris*grow);
    float arrival=smoothstep(.68,1.,t);
    // Ice clears from the center; the content keeps its size and becomes legible.
    vec2 window=(uv-.5)*vec2(aspect,1.);
    vec2 box=abs(window)-cardSize*.5;
    float edge=length(max(box,0.))+min(max(box.x,box.y),0.);
    float frost=crystal(window/max(.06,arrival))*.18;
    float thaw=1.-smoothstep(arrival-.08,arrival+.08,
      max(abs(window.x)/max(.01,cardSize.x*.5),abs(window.y)/max(.01,cardSize.y*.5))*.8+frost);
    float aperture=(1.-smoothstep(-.008,.008,edge))*thaw*smoothstep(.68,.76,t);
    color+=vec3(.3,.45,.29)*exp(-abs(edge)*180.)*sin(arrival*3.141593);
    gl_FragColor=vec4(color,(1.-aperture)*(1.-smoothstep(.88,1.,t)));
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
        let dialogResize: ResizeObserver | undefined;
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
          const dialogElement = closing
            ? document.querySelector<HTMLElement>(".adv-dialog")
            : null;
          const dialogRect = dialogElement?.getBoundingClientRect();
          const panelCapture =
            dialogElement && dialogRect
              ? captureAdvent(dialogElement, {
                  width: dialogRect.width,
                  height: dialogRect.height,
                  pixelRatio: Math.min(1, 800 / dialogRect.height),
                  style: {
                    position: "relative",
                    top: "0",
                    left: "0",
                    margin: "0",
                    transform: "none",
                    translate: "none",
                    scale: "1",
                    opacity: "1",
                    filter: "none",
                    animation: "none",
                  },
                }).catch(() => null)
              : Promise.resolve(null);
          const capture =
            closing && lastSnapshot.current
              ? Promise.resolve(lastSnapshot.current)
              : captureAdvent(
                  document.querySelector<HTMLElement>(".adv-page") ??
                    document.body,
                  {
                    width,
                    height,
                    pixelRatio: Math.min(1, 1200 / width, 1200 / height),
                    style: {
                      transform: `translateY(${-scrollY}px)`,
                      transformOrigin: "top left",
                      margin: "0",
                    },
                    filter: (node) =>
                      !["SCRIPT", "STYLE", "NEXTJS-PORTAL", "IFRAME"].includes(
                        node.tagName,
                      ) && !node.hasAttribute?.("data-fold-exclude"),
                  },
                );
          const captured = await Promise.race([
            Promise.all([capture, panelCapture]),
            new Promise<null>((resolve) => {
              timer = setTimeout(() => resolve(null), 1800);
            }),
          ]);
          clearTimeout(timer);
          if (!captured || !mounted.current || cancelled)
            return mounted.current;
          const [snapshot, panelSnapshot] = captured;
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
          gl.activeTexture(gl.TEXTURE0);
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
          gl.uniform1i(gl.getUniformLocation(program, "page"), 0);
          const panelTexture = gl.createTexture();
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, panelTexture);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            panelSnapshot ?? snapshot,
          );
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.uniform1i(gl.getUniformLocation(program, "panel"), 1);
          gl.uniform1f(
            gl.getUniformLocation(program, "hasPanel"),
            panelSnapshot ? 1 : 0,
          );
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
            let last = 0;
            let measured: HTMLElement | null = null;
            let cardWidth = dialogRect?.width ?? 560,
              cardHeight = dialogRect?.height ?? 600;
            dialogResize = new ResizeObserver(([entry]) => {
              const box = entry.borderBoxSize[0];
              if (box?.inlineSize && box.blockSize) {
                cardWidth = box.inlineSize;
                cardHeight = box.blockSize;
              }
            });
            const draw = (now: number) => {
              try {
                if (last && now - last < 1000 / 30) {
                  frame = requestAnimationFrame(draw);
                  return;
                }
                last = now;
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
                  if (!closing) canvas!.style.pointerEvents = "none";
                }
                const dialog =
                  document.querySelector<HTMLElement>(".adv-dialog");
                if (!closing && dialog && dialog !== measured) {
                  dialogResize!.disconnect();
                  dialogResize!.observe(dialog);
                  measured = dialog;
                }
                const linear = Math.max(
                  0,
                  Math.min(1, (t - FOLD_REVEAL) / (1 - FOLD_REVEAL)),
                );
                const arrival = closing
                  ? Math.max(0, 1 - elapsed / 0.1)
                  : linear * linear * (3 - 2 * linear);
                if (dialog) {
                  dialog.dataset.arriving = "";
                  dialog.dataset.journey = closing
                    ? "closing"
                    : berlin
                      ? "berlin"
                      : "winter";
                  dialog.dataset.folded = "";
                  dialog.style.setProperty("--adv-arrival", arrival.toFixed(4));
                }
                gl!.uniform2f(
                  cardSize,
                  cardWidth / height,
                  cardHeight / height,
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
          gl.deleteTexture(panelTexture);
          gl.deleteBuffer(buffer);
          gl.deleteProgram(program);
          return result;
        } catch {
          // A blocked font/image or unavailable GPU must never block the content.
          return mounted.current;
        } finally {
          clearTimeout(timer);
          cancelAnimationFrame(frame);
          dialogResize?.disconnect();
          canvas?.remove();
          const dialog = document.querySelector<HTMLElement>(".adv-dialog");
          if (dialog) {
            delete dialog.dataset.arriving;
            delete dialog.dataset.journey;
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
      if (
        event.key === "Escape" &&
        !event.defaultPrevented &&
        !document.querySelector('.adv-dialog[data-state="open"]')
      ) {
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
          Skip effect
        </button>,
        document.body,
      )
    : null;
});
