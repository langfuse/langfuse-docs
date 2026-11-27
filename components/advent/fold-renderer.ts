import { WINTER_OPTICS } from "./winter-optics";
import { logAdvent } from "./advent-debug";

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

export type FoldRenderer = {
  canvas: HTMLCanvasElement;
  kind: "webgl" | "canvas";
  draw: (t: number, width: number, height: number) => boolean;
  texture: (image: HTMLCanvasElement, panel?: boolean) => void;
  dispose: () => void;
};

type Options = {
  x: number;
  y: number;
  aspect: number;
  berlin: boolean;
  variant: number;
  closing: boolean;
};

/** A useful image from frame one, even with blocked fonts/images or no screenshot. */
function winterMaterial(berlin: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = berlin ? "#101c31" : "#eaeadd";
  ctx.fillRect(0, 0, 256, 256);
  ctx.translate(128, 128);
  ctx.strokeStyle = berlin ? "#7f76ba" : "#45877c";
  for (let arm = 0; arm < 6; arm++) {
    ctx.rotate(Math.PI / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(110, 0);
    for (let branch = 20; branch < 100; branch += 20) {
      ctx.moveTo(branch + 20, -15);
      ctx.lineTo(branch, 0);
      ctx.lineTo(branch + 20, 15);
    }
    ctx.stroke();
  }
  return canvas;
}

export function createFoldRenderer(options: Options): FoldRenderer {
  const canvas = document.createElement("canvas");
  let gl: WebGLRenderingContext | null = null;
  let cleanup = () => {};
  try {
    gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      depth: false,
      antialias: false,
    });
    if (!gl) throw new Error("webgl_unavailable");
    const gpu = gl;
    const program = gpu.createProgram();
    const buffer = gpu.createBuffer();
    const textures = [gpu.createTexture(), gpu.createTexture()];
    cleanup = () => {
      textures.forEach((texture) => gpu.deleteTexture(texture));
      gpu.deleteBuffer(buffer);
      gpu.deleteProgram(program);
      gpu.getExtension("WEBGL_lose_context")?.loseContext();
    };
    if (!program || !buffer || textures.some((texture) => !texture))
      throw new Error("webgl_allocation_failed");
    for (const [type, source] of [
      [gpu.VERTEX_SHADER, VERTEX],
      [gpu.FRAGMENT_SHADER, FRAGMENT],
    ] as const) {
      const shader = gpu.createShader(type);
      if (!shader) throw new Error("shader_allocation_failed");
      gpu.shaderSource(shader, source);
      gpu.compileShader(shader);
      const compiled = gpu.getShaderParameter(shader, gpu.COMPILE_STATUS);
      if (!compiled)
        logAdvent("shader.compile_failed", {
          info: gpu.getShaderInfoLog(shader),
        });
      if (compiled) gpu.attachShader(program, shader);
      gpu.deleteShader(shader);
      if (!compiled) throw new Error("shader_compile_failed");
    }
    gpu.linkProgram(program);
    if (!gpu.getProgramParameter(program, gpu.LINK_STATUS)) {
      logAdvent("shader.link_failed", { info: gpu.getProgramInfoLog(program) });
      throw new Error("shader_link_failed");
    }
    gpu.useProgram(program);
    gpu.bindBuffer(gpu.ARRAY_BUFFER, buffer);
    gpu.bufferData(
      gpu.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gpu.STATIC_DRAW,
    );
    const position = gpu.getAttribLocation(program, "p");
    gpu.enableVertexAttribArray(position);
    gpu.vertexAttribPointer(position, 2, gpu.FLOAT, false, 0, 0);
    const uniform = (name: string) => gpu.getUniformLocation(program, name);
    gpu.uniform1i(uniform("page"), 0);
    gpu.uniform1i(uniform("panel"), 1);
    gpu.uniform2f(uniform("origin"), options.x, 1 - options.y);
    gpu.uniform1f(uniform("aspect"), options.aspect);
    gpu.uniform1f(uniform("berlin"), Number(options.berlin));
    gpu.uniform1f(uniform("variant"), options.variant % 3);
    gpu.uniform1f(uniform("closing"), Number(options.closing));
    const progress = uniform("progress"),
      cardSize = uniform("cardSize"),
      hasPanel = uniform("hasPanel");
    const texture = (image: HTMLCanvasElement, panel = false) => {
      gpu.activeTexture(panel ? gpu.TEXTURE1 : gpu.TEXTURE0);
      gpu.bindTexture(gpu.TEXTURE_2D, textures[Number(panel)]);
      gpu.pixelStorei(gpu.UNPACK_FLIP_Y_WEBGL, true);
      gpu.texImage2D(
        gpu.TEXTURE_2D,
        0,
        gpu.RGBA,
        gpu.RGBA,
        gpu.UNSIGNED_BYTE,
        image,
      );
      gpu.texParameteri(gpu.TEXTURE_2D, gpu.TEXTURE_MIN_FILTER, gpu.LINEAR);
      gpu.texParameteri(gpu.TEXTURE_2D, gpu.TEXTURE_MAG_FILTER, gpu.LINEAR);
      gpu.texParameteri(gpu.TEXTURE_2D, gpu.TEXTURE_WRAP_S, gpu.CLAMP_TO_EDGE);
      gpu.texParameteri(gpu.TEXTURE_2D, gpu.TEXTURE_WRAP_T, gpu.CLAMP_TO_EDGE);
      if (panel) gpu.uniform1f(hasPanel, 1);
    };
    const material = winterMaterial(options.berlin);
    texture(material);
    texture(material, true);
    return {
      canvas,
      kind: "webgl",
      texture,
      dispose: cleanup,
      draw(t, width, height) {
        if (gpu.isContextLost()) return false;
        gpu.viewport(0, 0, canvas.width, canvas.height);
        gpu.uniform1f(progress, t);
        gpu.uniform2f(cardSize, width, height);
        gpu.drawArrays(gpu.TRIANGLES, 0, 3);
        return true;
      },
    };
  } catch (error) {
    logAdvent("renderer.fallback", {
      reason: error instanceof Error ? error.message : "webgl_failed",
    });
    cleanup();
    return createCanvasFold(options);
  }
}

/** Six cached crystal planes preserve the journey on machines without WebGL. */
export function createCanvasFold(options: Options): FoldRenderer {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas_unavailable");
  let page = winterMaterial(options.berlin);
  let panel = page;
  return {
    canvas,
    kind: "canvas",
    dispose() {},
    texture(image, isPanel = false) {
      if (isPanel) panel = image;
      else page = image;
    },
    draw(t, cardWidth, cardHeight) {
      const w = canvas.width,
        h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const elapsed = options.closing ? 1 - t : t;
      const fade = Math.min(1, elapsed / 0.07, (1 - elapsed) / 0.1);
      ctx.globalAlpha = fade;
      if (options.closing) {
        const flight = elapsed * elapsed * (3 - 2 * elapsed);
        const x = w / 2 + (options.x - 0.5) * w * flight,
          y = h / 2 + (options.y - 0.5) * h * flight;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(flight * 0.5);
        const shrink = Math.max(0.01, 1 - flight);
        ctx.globalAlpha = fade * (1 - flight);
        ctx.drawImage(
          panel,
          (-cardWidth * h * shrink) / 2,
          (-cardHeight * h * shrink) / 2,
          cardWidth * h * shrink,
          cardHeight * h * shrink,
        );
        ctx.restore();
      } else {
        ctx.fillStyle = options.berlin ? "#101326" : "#173f3b";
        ctx.fillRect(0, 0, w, h);
        for (let layer = 0; layer < 5; layer++) {
          const depth = (layer / 5 + t * t * 2) % 1;
          const scale = 0.06 + depth * depth * 2;
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.rotate(t * 0.4 + layer * 0.18);
          ctx.globalAlpha = fade * Math.sin(depth * Math.PI) * 0.32;
          for (let arm = 0; arm < 6; arm++) {
            ctx.save();
            ctx.rotate((arm * Math.PI) / 3);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(w, 0);
            ctx.lineTo(w * 0.5, w * 0.866);
            ctx.closePath();
            ctx.clip();
            ctx.scale(scale, scale);
            ctx.drawImage(page, -w / 2, -h / 2, w, h);
            ctx.restore();
          }
          ctx.restore();
        }
        if (t > 0.68) {
          const arrival = (t - 0.68) / 0.32;
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = "destination-out";
          ctx.fillRect(
            w / 2 - (cardWidth * h * arrival) / 2,
            h / 2 - (cardHeight * h * arrival) / 2,
            cardWidth * h * arrival,
            cardHeight * h * arrival,
          );
          ctx.globalCompositeOperation = "source-over";
        }
      }
      ctx.globalAlpha = 1;
      return true;
    },
  };
}
