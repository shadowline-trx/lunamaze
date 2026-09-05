'use client';
import { useEffect, useRef, useState } from 'react';
import type { Tool, View, World } from '@/lib/simulation';

const vertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`;
const fragment = `
precision highp float;
uniform vec2 resolution;
uniform float time,seed,water,temperature,biomass,atmosphere,mode,zoom;
uniform vec2 rotation;
uniform vec4 stamps[16];
uniform int stampCount;
float hash(vec3 p){p=fract(p*.3183099+vec3(.13,.71,.37));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*noise(p);p=p*2.03+vec3(7.1,3.7,1.2);a*=.5;}return v;}
vec3 rotate(vec3 p){float a=rotation.x,b=rotation.y; p=vec3(p.x,cos(b)*p.y-sin(b)*p.z,sin(b)*p.y+cos(b)*p.z);return vec3(cos(a)*p.x+sin(a)*p.z,p.y,-sin(a)*p.x+cos(a)*p.z);}
float heightAt(vec3 p){float h=fbm(p*3.+vec3(seed*.83,seed*.21,seed*.44)); h+=.07*noise(p*37.); for(int i=0;i<16;i++){if(i<stampCount){float d=distance(p,stamps[i].xyz);h+=stamps[i].w*exp(-d*d*42.);}}return h;}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*resolution)/min(resolution.x,resolution.y)*2.;uv/=zoom;
 float radius=.78;float rr=dot(uv,uv);float edge=sqrt(rr);vec3 color=pow(vec3(.031373,.054902,.074510),vec3(1./.86));
 float halo=exp(-max(0.,edge-radius)*23.)*.13*clamp(atmosphere/80.,.08,1.4);
 color+=vec3(.09,.42,.52)*halo;
 if(rr<radius*radius){
  vec3 n=normalize(vec3(uv,sqrt(radius*radius-rr))); vec3 p=rotate(n);
  float h=heightAt(p);float sea=.27+water*.0044;float land=smoothstep(sea-.007,sea+.006,h);
  float elev=max(0.,h-sea);float latitude=abs(p.y);
  float localTemp=temperature+12.-latitude*42.-elev*60.;
  vec3 ocean=mix(vec3(.018,.075,.105),vec3(.025,.29,.33),smoothstep(sea-.11,sea,h));
  vec3 rock=mix(vec3(.21,.125,.075),vec3(.49,.37,.23),noise(p*22.));
  float lush=clamp(biomass*.014,0.,1.)*smoothstep(-2.,15.,localTemp)*(1.-smoothstep(35.,52.,localTemp));
  vec3 grass=mix(vec3(.15,.23,.13),vec3(.25,.39,.21),noise(p*45.));
  vec3 terrain=mix(rock,grass,lush);terrain=mix(terrain,vec3(.43,.41,.33),smoothstep(.14,.27,elev));
  terrain=mix(vec3(.46,.42,.26),terrain,smoothstep(0.,.025,elev));
  color=mix(ocean,terrain,land);
  float ice=1.-smoothstep(-6.,3.,localTemp+noise(p*20.)*6.);
  color=mix(color,vec3(.66,.81,.83),ice*.97);
  vec3 light=normalize(vec3(-.8,.5,1.2));float day=max(0.,dot(n,light));
  float detail=(noise(p*135.)-.5)*.09*land; color+=detail;
  float spec=pow(max(0.,dot(reflect(-light,n),vec3(0,0,1))),65.)*(1.-land)*(1.-ice);
  if(mode<.5){
   color*=.07+day*.99;
   color+=vec3(.38,.65,.65)*spec*.65;
   float clouds=fbm(rotate(n)*7.+vec3(time*.008,0.,time*.005));
   clouds=smoothstep(.52,.7,clouds)*clamp(water/60.,0.,1.)*clamp(atmosphere/85.,0.,1.);
   color=mix(color,vec3(.8,.86,.85)*(.12+day*.85),clouds*.87);
   float rim=pow(1.-max(0.,n.z),3.7)*clamp(atmosphere/100.,.05,1.6);
   color+=vec3(.18,.51,.65)*rim*(.18+day);
  }else if(mode<1.5){float t=clamp((localTemp+40.)/100.,0.,1.);color=mix(vec3(.08,.23,.65),vec3(.14,.72,.63),smoothstep(0.,.5,t));color=mix(color,vec3(1.,.25,.08),smoothstep(.5,1.,t));color*=.35+day*.65;
  }else{color=mix(vec3(.015,.14,.2),vec3(.54,.7,.55),smoothstep(.15,.85,h));float contour=1.-smoothstep(.018,.045,abs(fract(h*35.)-.5));color+=contour*.18;color*=.28+day*.72;}
 }
 color=pow(max(color,0.),vec3(.86));gl_FragColor=vec4(color,1.);
}`;

export default function Planet({ world, view, tool, running, onSculpt }: { world: World; view: View; tool: Tool; running: boolean; onSculpt: (point: [number, number, number]) => void }) {
 const canvas=useRef<HTMLCanvasElement>(null), values=useRef({world,view,running}); values.current={world,view,running};
 const angle=useRef({x:.35,y:-.18,zoom:1});
 const pointer=useRef<{x:number;y:number}|null>(null);
 const [error,setError]=useState('');
 useEffect(()=>{
  const el=canvas.current!,gl=el.getContext('webgl',{antialias:false,alpha:false,powerPreference:'low-power'});
  if(!gl){setError('This browser cannot display the 3D globe. Try a browser with WebGL enabled. The simulation controls still work.');return;}
  const compile=(type:number,source:string)=>{const shader=gl.createShader(type)!;gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader)||'Shader compilation failed');return shader;};
  let program:WebGLProgram,vs:WebGLShader,fs:WebGLShader;
  try{vs=compile(gl.VERTEX_SHADER,vertex);fs=compile(gl.FRAGMENT_SHADER,fragment);program=gl.createProgram()!;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Link failed');}catch{setError('The globe could not start on this device. The simulation controls still work.');return;}
  gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const u=Object.fromEntries(['resolution','time','seed','water','temperature','biomass','atmosphere','mode','zoom','rotation','stamps[0]','stampCount'].map(k=>[k,gl.getUniformLocation(program,k)]));
  let frame=0,last=0,clock=0;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const render=(now:number)=>{frame=requestAnimationFrame(render);if(now-last<40||document.hidden)return;const dt=Math.min((now-last)/1000,.1);last=now;const {world:w,view:v,running:r}=values.current;
   if(r&&!pointer.current&&!reduced){angle.current.x+=dt*.025;clock+=dt;}
   const box=el.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.5),width=Math.round(box.width*dpr),height=Math.round(box.height*dpr);if(el.width!==width||el.height!==height){el.width=width;el.height=height;gl.viewport(0,0,width,height);}
   gl.uniform2f(u.resolution,width,height);gl.uniform1f(u.time,clock);gl.uniform1f(u.seed,w.seed);gl.uniform1f(u.water,w.water);gl.uniform1f(u.temperature,w.temperature);gl.uniform1f(u.biomass,w.biomass);gl.uniform1f(u.atmosphere,w.atmosphere);gl.uniform1f(u.mode,v==='natural'?0:v==='thermal'?1:2);gl.uniform1f(u.zoom,angle.current.zoom);gl.uniform2f(u.rotation,angle.current.x,angle.current.y);
   const stamps=new Float32Array(64);w.stamps.forEach((s,i)=>stamps.set(s,i*4));gl.uniform4fv(u['stamps[0]'],stamps);gl.uniform1i(u.stampCount,w.stamps.length);gl.drawArrays(gl.TRIANGLES,0,3);
  };frame=requestAnimationFrame(render);
  const lost=(event:Event)=>{event.preventDefault();setError('The 3D view was interrupted. Save your world, then reload this page to restore it.');};el.addEventListener('webglcontextlost',lost);
  return()=>{cancelAnimationFrame(frame);el.removeEventListener('webglcontextlost',lost);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);};
 },[]);
 function sculpt(clientX:number,clientY:number){const box=canvas.current!.getBoundingClientRect(),s=Math.min(box.width,box.height),x=(clientX-box.left-box.width/2)/s*2/angle.current.zoom/.78,y=-(clientY-box.top-box.height/2)/s*2/angle.current.zoom/.78,rr=x*x+y*y;if(rr>1)return;const z=Math.sqrt(1-rr),{x:a,y:b}=angle.current,y2=Math.cos(b)*y-Math.sin(b)*z,z2=Math.sin(b)*y+Math.cos(b)*z;onSculpt([Math.cos(a)*x+Math.sin(a)*z2,y2,-Math.sin(a)*x+Math.cos(a)*z2]);}
 return <div className={`planet-render tool-${tool}`}><canvas ref={canvas} aria-label="Interactive 3D planet. Drag to rotate. Arrow keys rotate, plus and minus zoom, and Enter applies the selected tool at the center." tabIndex={0}
  onPointerDown={e=>{pointer.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);}}
  onPointerMove={e=>{const p=pointer.current;if(!p)return;if(tool==='orbit'){angle.current.x+=(e.clientX-p.x)*.007;angle.current.y=Math.max(-1.2,Math.min(1.2,angle.current.y+(e.clientY-p.y)*.007));}p.x=e.clientX;p.y=e.clientY;}}
  onPointerUp={e=>{if(pointer.current&&tool!=='orbit')sculpt(e.clientX,e.clientY);pointer.current=null;}}
  onPointerCancel={()=>{pointer.current=null;}}
  onWheel={e=>{angle.current.zoom=Math.max(.8,Math.min(1.25,angle.current.zoom-e.deltaY*.0007));}}
  onKeyDown={e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','Enter'].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')angle.current.x-=.12;if(e.key==='ArrowRight')angle.current.x+=.12;if(e.key==='ArrowUp')angle.current.y-=.12;if(e.key==='ArrowDown')angle.current.y+=.12;if(e.key==='+')angle.current.zoom=Math.min(1.25,angle.current.zoom+.05);if(e.key==='-')angle.current.zoom=Math.max(.8,angle.current.zoom-.05);if(e.key==='Enter'&&tool!=='orbit'){const b=canvas.current!.getBoundingClientRect();sculpt(b.x+b.width/2,b.y+b.height/2);}}}} />
  {error&&<div className="planet-error" role="alert">{error}</div>}
 </div>;
}
