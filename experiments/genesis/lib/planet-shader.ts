export const vertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`;
export const fragment = `
precision highp float;
uniform sampler2D atlas;
uniform vec2 resolution,rotation;
uniform float time,water,temperature,biomass,atmosphere,mode,zoom,cloudCover;
uniform vec4 stamps[16],brush,effect;
uniform int stampCount;
uniform float effectAge;
const float PI=3.14159265359;
vec3 rotate(vec3 p){float a=rotation.x,b=rotation.y;p=vec3(p.x,cos(b)*p.y-sin(b)*p.z,sin(b)*p.y+cos(b)*p.z);return vec3(cos(a)*p.x+sin(a)*p.z,p.y,-sin(a)*p.x+cos(a)*p.z);}
vec2 sphereUV(vec3 p){p=normalize(p);return vec2(atan(p.z,p.x)/(2.*PI)+.5,asin(clamp(p.y,-1.,1.))/PI+.5);}
float hash(vec3 p){p=fract(p*.3183099+vec3(.13,.71,.37));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float heightAt(vec3 p){vec4 data=texture2D(atlas,sphereUV(p));float h=(data.r*65280.+data.g*255.)/65535.;
for(int i=0;i<16;i++){if(i<stampCount){float d=distance(p,stamps[i].xyz),a=stamps[i].w;h+=a*exp(-d*d*95.);if(a<-.25)h+=.055*exp(-pow((d-.17)*28.,2.));}}return h;}
float cloudAt(vec3 p){vec2 uv=sphereUV(p);uv.x+=time*.0018;uv.y+=sin(uv.x*18.+time*.03)*.008;float a=texture2D(atlas,uv).a,b=texture2D(atlas,uv*vec2(2.,1.)+vec2(-time*.0007,.2)).a;return smoothstep(.48,.76,a*.85+b*.15)*cloudCover*clamp(atmosphere/85.,0.,1.);}
void main(){
vec2 uv=(gl_FragCoord.xy-.5*resolution)/min(resolution.x,resolution.y)*2./zoom;
float radius=.79,edge=length(uv),pixel=2./min(resolution.x,resolution.y)/zoom;
vec3 light=normalize(vec3(-.85,.45,.85)),localLight=rotate(light),color=vec3(0.);
float air=clamp(atmosphere/100.,0.,1.6),alpha=0.;
if(edge<radius){
vec3 n=vec3(uv/radius,sqrt(max(0.,1.-dot(uv,uv)/(radius*radius)))),p=rotate(n);
float h=heightAt(p),sea=.315+water*.0037,land=smoothstep(sea-.0015,sea+.002,h),elev=max(0.,h-sea);
float moisture=texture2D(atlas,sphereUV(p)).b;
float localTemp=temperature+10.-pow(abs(p.y),1.4)*35.-elev*65.;
float ice=(1.-smoothstep(-7.,1.5,localTemp+(moisture-.5)*9.))*smoothstep(4.,35.,water);
vec3 tangent=normalize(cross(p,abs(p.y)>.95?vec3(1,0,0):vec3(0,1,0))),bitangent=cross(p,tangent);
float eps=.0035,hx=heightAt(normalize(p+tangent*eps)),hy=heightAt(normalize(p+bitangent*eps));
float relief=mix(.001,.10,land);relief=mix(relief,.085,ice);
vec3 normal=normalize(p-tangent*(hx-h)/eps*relief-bitangent*(hy-h)/eps*relief);
float day=dot(p,localLight),diffuse=max(0.,dot(normal,localLight));
float lush=smoothstep(0.,45.,biomass)*smoothstep(-3.,12.,localTemp)*(1.-smoothstep(30.,49.,localTemp));
vec3 rock=mix(vec3(.27,.145,.072),vec3(.53,.38,.22),moisture),green=mix(vec3(.055,.115,.049),vec3(.21,.29,.105),moisture);
vec3 landColor=mix(rock,green,lush*smoothstep(.2,.55,moisture));
float grain=texture2D(atlas,sphereUV(p)*vec2(7.,3.)).b;landColor*=.8+grain*.4;
landColor=mix(landColor,vec3(.34,.31,.255),smoothstep(.06,.17,elev));landColor=mix(vec3(.62,.52,.33),landColor,smoothstep(0.,.012,elev));
vec3 ocean=mix(vec3(.004,.035,.065),vec3(.018,.24,.27),pow(smoothstep(sea-.10,sea,h),4.));
color=mix(ocean,landColor,land);color=mix(color,vec3(.70,.82,.83)*(.90+moisture*.18),ice);
float snow=smoothstep(.075,.18,elev)*(1.-smoothstep(-8.,24.,localTemp));color=mix(color,vec3(.87,.88,.85),snow*land);
float shadow=cloudAt(normalize(p+localLight*.018));color*=vec3(.025,.04,.065)+diffuse*1.32;color*=1.-shadow*.36;
vec3 halfVector=normalize(localLight+rotate(vec3(0,0,1)));float spec=pow(max(0.,dot(normal,halfVector)),110.)*(1.-land)*(1.-ice);color+=vec3(.65,.77,.71)*spec*.75;
float city=step(.972,hash(floor(p*640.)))*smoothstep(.34,.57,moisture)*land*(1.-ice)*smoothstep(48.,85.,biomass)*(1.-smoothstep(-.15,.18,day));color+=vec3(1.,.52,.16)*city*.8;
float cloudRadius=.803;vec3 cloudN=normalize(vec3(uv,sqrt(max(0.,cloudRadius*cloudRadius-dot(uv,uv)))));float cover=cloudAt(rotate(cloudN));
color=mix(color,vec3(.90,.94,.94)*(.06+max(0.,dot(cloudN,light))*1.13),cover*.93);
float rim=pow(1.-max(0.,n.z),3.4)*air;color+=vec3(.065,.30,.49)*rim*(.10+max(0.,day)*1.1);color=mix(color,vec3(.23,.46,.64),pow(1.-n.z,5.)*air*.30*max(0.,day));
if(mode>.5&&mode<1.5){float t=clamp((localTemp+40.)/100.,0.,1.);color=mix(vec3(.09,.19,.58),vec3(.10,.68,.62),smoothstep(0.,.5,t));color=mix(color,vec3(.96,.25,.065),smoothstep(.5,1.,t));color*=.25+diffuse*.8;}
if(mode>1.5){color=mix(vec3(.009,.058,.085),vec3(.38,.57,.35),smoothstep(.3,.65,h));color=mix(color,vec3(.86,.83,.67),smoothstep(.64,.8,h));float contour=1.-smoothstep(.015,.065,abs(fract(h*65.)-.5));color+=contour*.12;color*=.25+diffuse*.9;}
if(brush.w>0.){float d=distance(p,brush.xyz),ring=1.-smoothstep(.003,.009,abs(d-.125));color=mix(color,brush.w>3.5?vec3(1.,.55,.22):vec3(.65,.91,.75),ring*.8);}
if(effectAge<3.){float d=distance(p,effect.xyz),wave=exp(-pow((d-effectAge*.22)*55.,2.))*exp(-effectAge*1.3);color+=mix(vec3(.24,.85,.55),vec3(1.,.44,.12),step(3.5,effect.w))*wave*.7;if(effect.w>3.5)color+=vec3(1.,.49,.16)*exp(-d*d*130.)*exp(-effectAge*3.)*2.;}
alpha=1.-smoothstep(radius-pixel*1.5,radius,edge);
}else{float glow=exp(-(edge-radius)*95.)*.52+exp(-(edge-radius)*23.)*.065,lit=clamp(dot(normalize(vec3(uv,.1)),light)*.7+.3,.06,1.);color=vec3(.13,.52,.75)*lit;alpha=glow*air*lit;}
color=pow(max(color,0.),vec3(.86));gl_FragColor=vec4(color,alpha);
}`;
