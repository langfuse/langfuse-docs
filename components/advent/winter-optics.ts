import { logAdvent } from "./advent-debug";

// Original sixfold crystal geometry, shared by the entrance and door journeys.
// A small fixed number of analytic planes keeps the effect independent of DPR.
export const WINTER_OPTICS = `
const float TAU=6.2831853;
mat2 spin(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
float grain(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 sixfold(vec2 p){
  float a=abs(mod(atan(p.y,p.x)+TAU/12.,TAU/6.)-TAU/12.);
  return length(p)*vec2(cos(a),sin(a));
}
float segment(vec2 p,vec2 a,vec2 b){
  vec2 v=b-a;
  return length(p-a-v*clamp(dot(p-a,v)/dot(v,v),0.,1.));
}
float crystal(vec2 p){
  p=sixfold(p);
  float d=segment(p,vec2(.04,0.),vec2(.94,0.));
  for(int j=0;j<4;j++){
    float x=.24+float(j)*.17;
    float branch=.19-float(j)*.026;
    d=min(d,segment(p,vec2(x,0.),vec2(x+branch,branch*.72)));
    d=min(d,segment(p,vec2(x+branch*.55,branch*.40),vec2(x+branch*.55,branch*.68)));
  }
  // A faceted jewel anchors the dendrites, rather than a circular tunnel ring.
  d=min(d,abs(max(p.x*.866025+p.y*.5,p.y)-.145));
  return d;
}
vec3 winterVault(vec2 p,float travel,float bloom){
  float r=length(p);
  vec3 col=mix(vec3(.014,.075,.085),vec3(.085,.23,.23),exp(-r*2.));
  col+=vec3(.40,.27,.10)*exp(-r*7.);
  for(int i=0;i<5;i++){
    float layer=float(i);
    float z=fract(layer/5.+travel*.37);
    float scale=.08+pow(z,2.4)*2.7;
    vec2 v=spin(travel*.10+layer*.13)*p/scale;
    float d=crystal(v)*scale;
    float life=smoothstep(0.,.14,z)*(1.-smoothstep(.85,1.,z));
    float line=exp(-d*440.)+exp(-d*65.)*.26;
    vec3 ice=mix(vec3(.35,.78,.8),vec3(.98,.73,.34),layer/5.);
    col+=ice*line*life*bloom*(.32+z*.30);
  }
  // Fine frozen caustics between the crystal planes, with sixfold symmetry.
  vec2 k=sixfold(spin(travel*.05)*p);
  for(int i=0;i<3;i++) k=abs(k*1.8-vec2(.48,.21));
  float lace=pow(.5+.5*cos(length(k)*36.-travel*2.),18.);
  col+=vec3(.18,.32,.29)*lace*bloom*.22;
  return col;
}
`;

/** One bounded WebGL layer; the existing canvas flight remains the fallback. */
export function createWinterVault(canvas: HTMLCanvasElement, gentle = false) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: false,
    depth: false,
    antialias: false,
  });
  if (!gl) {
    logAdvent("intro.webgl_unavailable");
    return null;
  }
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const dispose = () => {
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
  if (!program || !buffer) {
    dispose();
    return null;
  }
  const fragment = `
precision highp float;
varying vec2 uv;
uniform float progress;
uniform float aspect;
uniform float gentle;
${WINTER_OPTICS}
void main(){
  float t=progress;
  float travel=mix(t*t*5.,t*.12,gentle);
  vec2 p=(uv-.5)*vec2(aspect,1.);
  p+=vec2(sin(t*6.),cos(t*5.))*.025*(1.-t)*(1.-gentle);
  vec3 col=winterVault(p,travel,smoothstep(.02,.3,t));
  // Interlaced red and blue threads become the ribs of the winter vault.
  float a=atan(p.y,p.x);
  float r=length(p);
  float radius=mix(.18+t*t*2.8,.38,gentle);
  for(int i=0;i<2;i++){
    float side=float(i);
    float wave=radius+sin(a*3.+side*3.141593+t*3.)*.065;
    float d=abs(r-wave);
    vec3 thread=mix(vec3(.7,.10,.16),vec3(.12,.42,.74),side);
    col+=thread*(exp(-d*110.)+exp(-d*24.)*.3)*(1.-smoothstep(.48,.68,t));
  }
  // A six-petalled opening clears for the real, assembling calendar.
  float reveal=smoothstep(.69,1.,t);
  float aperture=1.-smoothstep(reveal*2.-.1,reveal*2.+.03,
    r*(.9+.1*cos(a*6.)));
  float alpha=(1.-aperture)*smoothstep(0.,.07,t)*(1.-smoothstep(.92,1.,t));
  gl_FragColor=vec4(col,alpha);
}`;
  for (const [type, source] of [
    [
      gl.VERTEX_SHADER,
      "attribute vec2 p; varying vec2 uv; void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}",
    ],
    [gl.FRAGMENT_SHADER, fragment],
  ] as const) {
    const shader = gl.createShader(type);
    if (!shader) {
      dispose();
      return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      logAdvent("intro.shader_failed", { info: gl.getShaderInfoLog(shader) });
      gl.deleteShader(shader);
      dispose();
      return null;
    }
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    logAdvent("intro.link_failed", { info: gl.getProgramInfoLog(program) });
    dispose();
    return null;
  }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.uniform1f(gl.getUniformLocation(program, "gentle"), Number(gentle));
  const progress = gl.getUniformLocation(program, "progress");
  const aspect = gl.getUniformLocation(program, "aspect");
  return {
    draw(t: number) {
      if (gl.isContextLost()) return false;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(progress, t);
      gl.uniform1f(aspect, canvas.width / canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return true;
    },
    dispose,
  };
}
