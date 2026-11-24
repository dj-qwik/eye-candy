(()=>{var Rt=`#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime, uBass, uMid, uHigh, uVol, uBeat, uDrive, uBurst, uHue, uBeatCount, uSinceBeat, uBeatInt;
uniform sampler2D uAudio;
uniform vec4 uP0, uP1;
uniform vec3 uPalA, uPalB, uPalC, uPalD;
uniform vec3 uCam;
out vec4 fragColor;
#define PI 3.14159265
#define TAU 6.2831853
#define P0 uP0.x
#define P1 uP0.y
#define P2 uP0.z
#define P3 uP0.w
#define P4 uP1.x
#define P5 uP1.y
#define P6 uP1.z
#define P7 uP1.w
vec3 pal(float t){ return clamp(uPalA + uPalB*cos(TAU*(uPalC*t + uPalD + uHue)), 0., 1.); }
float fft(float x){ return texture(uAudio, vec2(clamp(x,0.002,.998), .25)).r; }
float wav(float x){ return texture(uAudio, vec2(fract(x), .75)).r*2.-1.; }
mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
float h11(float p){ p=fract(p*.1031); p*=p+33.33; p*=p+p; return fract(p); }
float h21(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
vec2 h22(vec2 p){ vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); p3+=dot(p3,p3.yzx+33.33); return fract((p3.xx+p3.yz)*p3.zy); }
float h31(vec3 p){ p=fract(p*.1031); p+=dot(p,p.zyx+31.32); return fract((p.x+p.y)*p.z); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<5;i++){ s+=a*vnoise(p); p=rot(.5)*p*2.03+11.7; a*=.5; } return s; }
float n3(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.-2.*f);
  return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x), mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x), mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y), f.z); }
float fbm3(vec3 p){ float a=.5,s=0.; for(int i=0;i<4;i++){ s+=a*n3(p); p=p*2.02+vec3(1.7,9.2,3.1); a*=.5; } return s; }
float glowLine(float d, float w){ return w/(abs(d)+w*.5); }
vec2 UV(vec2 fc){ return (fc-.5*uRes)/uRes.y; }
vec3 camRay(vec2 uv, float fov){ vec3 rd=normalize(vec3(uv,fov)); rd.yz*=rot(uCam.y); rd.xz*=rot(uCam.x); return rd; }
float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h); }
void mainImage(out vec4 c, in vec2 fc);
void main(){ vec4 c=vec4(0,0,0,1); mainImage(c, gl_FragCoord.xy); fragColor=vec4(max(c.rgb,0.),1.); }
`,Je=[],E=t=>Je.push(t);E({fly:!0,id:"cathedral",name:"Fractal Cathedral",params:[{n:"Fold",min:.2,max:1.6,def:.85},{n:"Twist",min:0,max:1.5,def:.45},{n:"Scale",min:1.25,max:1.75,def:1.48},{n:"Glow",min:0,max:3,def:1.2},{n:"Flight",min:0,max:3,def:1},{n:"Tunnel",min:.2,max:1.4,def:.6},{n:"Pulse",min:0,max:2,def:1},{n:"Color Spread",min:0,max:2,def:.6}],stick:[0,1],code:`
float trap;
float map(vec3 p){
  vec3 q=p; q.xy*=rot(p.z*.07*P1);
  q.z=mod(q.z+2.,4.)-2.;
  float s=1.; trap=1e9;
  for(int i=0;i<7;i++){
    q=abs(q)-vec3(P0,P0*.75,1.1);
    q.xy*=rot(.6+P1*.6+uBass*.12*P6);
    q.xz*=rot(.37+uMid*.05);
    q*=P2; s*=P2;
    trap=min(trap,length(q.xz)*.25);
  }
  float d=length(max(abs(q)-vec3(.9),0.))/s;
  return max(d, -(length(p.xy)-P5*(1.+uBass*.15*P6)));
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  vec3 ro=vec3(sin(uTime*.3)*.1,cos(uTime*.23)*.1,uTime*1.6*P4);
  vec3 rd=camRay(uv,1.1); rd.xy*=rot(uTime*.05+uCam.z);
  float t=0., g=0., st=0.; vec3 col=vec3(0);
  for(int i=0;i<96;i++){
    vec3 p=ro+rd*t; float d=map(p);
    g+=exp(-d*30.)*(.006+fft(fract(trap*2.))*.03*P6);
    if(d<.0015*t||t>28.) break;
    t+=d*.75; st++;
  }
  vec3 p=ro+rd*t;
  float tr0=trap;
  vec2 e=vec2(.002*t+.001,0.);
  vec3 n=normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));
  float ao=1.-st/96.;
  float dif=clamp(dot(n,-rd),0.,1.);
  float rim=pow(1.-dif,3.);
  float k=fft(fract(tr0*2.));
  vec3 base=pal(tr0*P7+p.z*.03);
  col=base*ao*ao*ao*(.08+.92*dif*dif)*1.25;
  col+=pal(tr0*P7+.5)*rim*ao*(.25+k*.9)*.6;
  col+=pal(tr0*P7+.35+uTime*.03)*g*P3*.7*(1.+uBeat*.8);
  col=mix(col, pal(.6)*.015, smoothstep(4.,26.,t));
  c=vec4(col,1);
}`});E({id:"nebula",name:"Nebula Tunnel",params:[{n:"Speed",min:0,max:4,def:1.2},{n:"Depth",min:.1,max:1.5,def:.55},{n:"Turbulence",min:.5,max:5,def:2.2},{n:"Ring Pulse",min:0,max:3,def:1.2},{n:"Stars",min:0,max:2,def:1},{n:"Spin",min:-1,max:1,def:.15},{n:"Brightness",min:.3,max:3,def:1.3},{n:"Petals",min:0,max:8,def:0}],stick:[2,1],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc); uv+=uCam.xy*vec2(.25,-.25);
  uv*=rot(uTime*P5+uCam.z);
  float r=length(uv), a=atan(uv.y,uv.x);
  r*=1.+.2*sin(a*floor(P7)+uTime)*step(.5,P7);
  float z=P1/(r+.04)+uTime*P0;
  vec3 sp=vec3(cos(a),sin(a),0.)*P2+vec3(0,0,z*.35);
  float n=fbm3(sp+fbm3(sp*1.7+uTime*.1)*1.4);
  float rings=pow(.5+.5*sin(z*TAU*.5),12.)*fft(fract(z*.05))*P3*3.;
  vec3 col=pal(n*1.3+z*.04)*pow(n,2.2)*3.*P6;
  col+=pal(z*.1+.5)*rings;
  float s=h21(floor(vec2(a*60./TAU,z*3.)));
  col+=step(.985-.01*P4,s)*vec3(1.)*smoothstep(.0,.3,r)*P4*(1.+uHigh*2.);
  col*=smoothstep(0.,.25,r)*(1.+uBeat*.6);
  col+=pal(.8)*.05/(r*6.+.25)*(uBass*1.2);
  c=vec4(col,1);
}`});E({id:"julia",name:"Julia Bloom",params:[{n:"Seed Angle",min:0,max:6.283,def:2.1},{n:"Zoom",min:.4,max:4,def:1},{n:"Color Rate",min:.1,max:3,def:1},{n:"Audio Morph",min:0,max:2,def:.8},{n:"Trap Glow",min:0,max:3,def:1.2},{n:"Seed Radius",min:.6,max:.82,def:.7885},{n:"Swirl",min:-1,max:1,def:.1},{n:"Symmetry",min:1,max:8,def:1}],stick:[0,5],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  float sym=floor(P7);
  if(sym>1.5){ float a=atan(uv.y,uv.x), r=length(uv); float s=TAU/sym; a=mod(a,s); a=abs(a-s*.5); uv=r*vec2(cos(a),sin(a)); }
  uv*=rot(uTime*.05*P6+uCam.x)*(1.6/P1);
  float th=P0+uTime*.04+uCam.y+uBass*.11*P3;
  vec2 cc=P5*vec2(cos(th),sin(th));
  vec2 z=uv; float it=0., trap=1e9, trap2=1e9;
  for(int i=0;i<110;i++){
    z=vec2(z.x*z.x-z.y*z.y, 2.*z.x*z.y)+cc;
    trap=min(trap, abs(length(z)-.5-uBass*.2));
    trap2=min(trap2, abs(z.x*z.y));
    if(dot(z,z)>256.) break; it++;
  }
  float sm=it-log2(log2(dot(z,z)))+4.;
  vec3 col=pal(sm*.025*P2+uTime*.02)*(it<109.?1.:.0);
  col*=smoothstep(2.,30.,sm)*(.35+.65*sm/110.);
  col+=pal(trap*2.+.3)*exp(-trap*18.)*.5*P4*(.6+fft(fract(trap*3.))*1.3);
  col+=pal(.7)*exp(-trap2*30.)*.4*P4*uHigh;
  c=vec4(col,1);
}`});E({fly:!0,id:"gyroid",name:"Gyroid Hyperspace",params:[{n:"Lattice",min:.8,max:5,def:2.2},{n:"Velocity",min:0,max:5,def:1.8},{n:"Thickness",min:.01,max:.3,def:.06},{n:"Glow",min:0,max:3,def:1.2},{n:"Detail",min:0,max:1,def:.4},{n:"Breath",min:0,max:2,def:1},{n:"Fog",min:.02,max:.3,def:.09},{n:"Hue Flow",min:0,max:2,def:.5}],stick:[0,2],code:`
float gyr(vec3 p, float s){ p*=s; return abs(dot(sin(p),cos(p.zxy)))/s; }
float map(vec3 p){
  float th=P2*(1.+uBass*.6*P5)+uBeat*.012*P5;
  float d=gyr(p,P0*(1.-uBass*.03*P5))-th;
  d-=gyr(p+uTime*.2,P0*3.7)*P4*.4;
  return d*.6;
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  vec3 ro=vec3(0.,0.,uTime*P1);
  ro.xy+=vec2(sin(uTime*.2),cos(uTime*.17))*.6;
  vec3 rd=camRay(uv,1.); rd.xy*=rot(uTime*.07+uCam.z);
  float t=0., g=0.; vec3 col=vec3(0);
  for(int i=0;i<80;i++){
    vec3 p=ro+rd*t; float d=map(p);
    float ad=abs(d);
    float sp=fft(clamp(t/26.,0.,1.));
    g+=.01/(.012+ad*ad*60.);
    col+=pal(p.z*.05*P7+t*.03+sp*.35)*.0005/(.01+ad*ad*160.)*exp(-t*.08)*(.45+sp*1.6);
    if(t>30.) break;
    t+=max(ad,.02);
  }
  col*=P3*(1.+uBeat*.8);
  col+=pal(.5)*g*.001*P3;
  col*=exp(-t*P6*.35);
  c=vec4(col,1);
}`});E({id:"chrome",name:"Liquid Chrome",params:[{n:"Blobs",min:2,max:8,def:6},{n:"Merge",min:.1,max:1.2,def:.55},{n:"Ripple",min:0,max:1,def:.35},{n:"Lights",min:2,max:20,def:7},{n:"Orbit",min:.3,max:2,def:1},{n:"Bass Swell",min:0,max:2,def:1},{n:"Iridescence",min:0,max:2,def:1},{n:"Env Bright",min:.3,max:2,def:1}],stick:[1,2],code:`
float smin(float a,float b,float k){ float h=clamp(.5+.5*(b-a)/k,0.,1.); return mix(b,a,h)-k*h*(1.-h); }
float map(vec3 p){
  float d=1e9;
  for(int i=0;i<8;i++){ if(float(i)>=P0) break;
    float fi=float(i);
    vec3 o=vec3(sin(uTime*.7*P4+fi*1.7),cos(uTime*.53*P4+fi*2.3),sin(uTime*.61*P4+fi*.9))*1.1;
    float r=.42+fft(fi/8.)*.35*P5;
    d=smin(d,length(p-o)-r,P1);
  }
  d+=sin(p.x*8.+uTime*2.)*sin(p.y*8.)*sin(p.z*8.-uTime)*.03*P2*(1.+uMid*2.);
  return d;
}
vec3 nor(vec3 p){ vec2 e=vec2(.002,0); return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx))); }
vec3 env(vec3 rd){
  float a=atan(rd.z,rd.x), b=rd.y;
  float stripes=pow(max(0.,sin(b*P3+uTime*.5)),24.)+pow(max(0.,sin(a*3.+uTime*.3)),40.);
  return pal(b*.5+a*.1+uMid*.08)*(.15+stripes*(1.8+uBeat*1.2+fft(fract(b*.5+.5))*1.5))*P7+pal(.7)*fbm(vec2(a,b)*3.)*.2;
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  vec3 ro=vec3(0,0,-4.2); ro.yz*=rot(uCam.y); ro.xz*=rot(uCam.x+uTime*.1);
  vec3 ta=vec3(0), f=normalize(ta-ro), r=normalize(cross(vec3(0,1,0),f)), u=cross(f,r);
  vec3 rd=normalize(uv.x*r+uv.y*u+1.5*f);
  float t=0.; bool hit=false;
  for(int i=0;i<90;i++){ float d=map(ro+rd*t); if(d<.001){hit=true;break;} t+=d; if(t>12.)break; }
  vec3 col=env(rd)*.35;
  if(hit){
    vec3 p=ro+rd*t, n=nor(p), rf=reflect(rd,n);
    float fr=pow(1.-max(dot(-rd,n),0.),3.);
    vec3 irid=pal(dot(n,rd)*2.*P6+uTime*.05);
    col=env(rf)*mix(vec3(.9),irid,.6*P6)*(.4+fr*1.6);
    col+=irid*pow(max(dot(rf,normalize(vec3(1,1,-1))),0.),40.)*2.*(1.+uBeat);
  }
  c=vec4(col,1);
}`});E({id:"horizon",name:"Neon Horizon",params:[{n:"Grid Speed",min:0,max:4,def:1.2},{n:"Sun Size",min:.1,max:.6,def:.32},{n:"Mountains",min:0,max:2,def:1},{n:"Grid Density",min:2,max:20,def:8},{n:"Terrain Warp",min:0,max:2,def:.6},{n:"Stars",min:0,max:2,def:1},{n:"Sun Stripes",min:0,max:24,def:10},{n:"Glow",min:.3,max:3,def:1.2}],stick:[4,2],code:`
float terr(vec2 p){
  float x=abs(p.x);
  float side=smoothstep(1.6,7.,x);
  float spec=fft(clamp((x-1.2)*.07,0.,1.));
  float n=fbm(p*.22)*1.1+fbm(p*.9)*.25*P4;
  return side*(n*.35+spec*.75*P2)*(.85+uBass*.15)+sin(p.y*.3+p.x*.2)*.06*P4;
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  float zt=uTime*P0*3.;
  vec3 ro=vec3(uCam.x*1.5,1.25+uCam.y*.6,zt);
  vec3 rd=normalize(vec3(uv.x,uv.y-.06,1.3));
  // sky
  float sy=rd.y;
  vec3 col=mix(pal(.78)*.22,pal(.62)*.03,smoothstep(-.02,.35,sy));
  col+=step(.998-.002*P5,h21(floor(fc/2.)))*smoothstep(.05,.3,sy)*P5*(.4+uHigh*.8)*.7;
  // sun
  vec2 su=vec2(rd.x/rd.z, rd.y/rd.z)-vec2(0.,.12);
  float SR=P1*.42*(1.+uBass*.08);
  float sd=length(su)-SR;
  float stripe=step(.45,fract(su.y/SR*P6*.25+uTime*.3))*step(su.y,.0);
  vec3 sun=mix(pal(.98)*1.05,pal(.12)*1.1,smoothstep(-SR,SR,su.y));
  col=mix(col,sun,smoothstep(.006,-.006,sd)*(1.-stripe*.85));
  col+=pal(.92)*.008/(max(sd,0.)+.05)*P7*(.8+uBass*.5);
  // terrain march
  float t=.1; bool hit=false;
  for(int i=0;i<90;i++){ vec3 p=ro+rd*t; float h=p.y-terr(p.xz); if(h<.002*t){hit=true;break;} t+=h*.45; if(t>60.)break; }
  if(hit){
    vec3 p=ro+rd*t;
    float hh=terr(p.xz);
    vec2 g=p.xz*P3*.25; g.y-=zt*0.; 
    vec2 gd=abs(fract(g)-.5); float w=.012*t*P3*.25+.01;
    float line=max(1.-smoothstep(0.,w,gd.x),1.-smoothstep(0.,w,gd.y));
    float spec=fft(clamp((abs(p.x)-1.2)*.07,0.,1.));
    vec3 base=mix(pal(.7)*.05,pal(.85)*.18,clamp(hh*.6,0.,1.));
    vec3 lc=pal(.85+hh*.12+spec*.2)*(1.+spec*1.6*step(.8,abs(p.x)))*P7*(.8+uBeat*.35);
    col=base+lc*line;
    float fog=1.-exp(-t*.045);
    col=mix(col,pal(.8)*.35,fog);
  }
  c=vec4(col,1);
}`});E({id:"mandala",name:"Spectral Mandala",params:[{n:"Symmetry",min:3,max:24,def:12},{n:"Rings",min:1,max:10,def:6},{n:"Petal Size",min:0,max:1,def:.5},{n:"Line Width",min:.5,max:4,def:1.5},{n:"Spin",min:-1,max:1,def:.12},{n:"Wave Ring",min:0,max:2,def:1},{n:"Lace",min:0,max:2,def:1},{n:"Zoom",min:.5,max:2.5,def:1}],stick:[0,2],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)/P7; uv*=rot(uTime*P4*.3+uCam.x);
  float r=length(uv), a=atan(uv.y,uv.x);
  float N=floor(P0), seg=TAU/N;
  float am=mod(a+seg*.5,seg)-seg*.5; float aa=abs(am);
  vec2 q=r*vec2(cos(aa),sin(aa));
  float w=.0025*P3;
  vec3 col=vec3(0);
  for(int k=0;k<10;k++){ if(float(k)>=P1) break;
    float fk=float(k)/P1;
    float rk=.08+fk*.42+fft(fk*.7)*.06*(1.+uDrive);
    col+=pal(fk+uTime*.03)*glowLine(r-rk,w)*.25*(.5+fft(fk*.7));
    float pr=rk+.05*P2*(1.+fft(fk)*2.)*cos(aa*N*.5+fk*6.+uTime);
    col+=pal(fk+.33)*glowLine(r-pr,w)*.18;
  }
  float pet=abs(length(q-vec2(.3,0.))-.22*P2*(1.+uBass*.4));
  col+=pal(.6+r)*glowLine(pet,w)*.35;
  float wr=.58+wav(a/TAU)*.08*P5*(1.+uDrive);
  col+=pal(.1+a/TAU)*glowLine(r-wr,w)*.4*P5;
  float lace=sin(q.x*40.*P6+uTime)*sin(q.y*40.*P6);
  col+=pal(r*2.)*smoothstep(.9,1.,lace)*.25*P6*fft(r);
  col+=pal(.0)*.04/(r+.02)*(.5+uBass*2.);
  col*=smoothstep(.95,.6,r);
  c=vec4(col,1);
}`});E({id:"silk",name:"Silk Warp",params:[{n:"Scale",min:.5,max:6,def:2.2},{n:"Warp",min:0,max:3,def:1.2},{n:"Color Rate",min:.2,max:3,def:1.1},{n:"Flow",min:0,max:2,def:.6},{n:"Sheen",min:0,max:3,def:1.2},{n:"Bass Warp",min:0,max:2,def:1},{n:"Contrast",min:.5,max:3,def:1.4},{n:"Marble",min:0,max:1,def:0}],stick:[1,0],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)+uCam.xy*.4; float t=uTime*P3*.3;
  vec2 p=uv*P0;
  vec2 q=vec2(fbm(p+vec2(0.,t)), fbm(p+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p+4.*q+vec2(1.7,9.2)+t*.7+uBass*.5*P5), fbm(p+4.*q+vec2(8.3,2.8)-t*.4));
  float f=fbm(p+P1*(4.+uBass*.9*P5)*r);
  f=mix(f, abs(sin(f*20.)), P7*.5);
  vec3 col=pal(f*P2+length(q)*.6);
  col=mix(col, pal(r.x*P2+.4), clamp(length(r)*.6,0.,1.));
  float e=.01;
  float fx=fbm(p+P1*4.*r+vec2(e,0))-f;
  col*=.6+P4*.6*clamp(fx*30.+.5,0.,1.5);
  col*=.75+fft(fract(f*1.3+length(q)*.4))*.7;
  col=pow(col,vec3(P6*1.3))*(1.+uBeat*.5);
  c=vec4(col,1);
}`});E({id:"apollo",name:"Apollonian Dream",params:[{n:"Inversion",min:1,max:1.5,def:1.18},{n:"Orbit Speed",min:0,max:2,def:.6},{n:"Glow",min:0,max:3,def:1},{n:"Color Rate",min:.2,max:4,def:1.5},{n:"Distance",min:.5,max:3,def:1.4},{n:"Bass Breathe",min:0,max:1,def:.4},{n:"Fog",min:0,max:1,def:.3},{n:"Light",min:.3,max:2,def:1}],stick:[0,4],code:`
vec4 trap;
float map(vec3 p){
  float s=P0+uBass*.07*P5; float scale=1.; trap=vec4(1000.);
  for(int i=0;i<8;i++){
    p=-1.+2.*fract(.5*p+.5);
    float r2=dot(p,p);
    trap=min(trap,vec4(abs(p),r2));
    float k=s/r2; p*=k; scale*=k;
  }
  return .25*abs(p.y)/scale;
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc); float t=uTime*P1*.3;
  vec3 ro=vec3(2.8*cos(.1+.33*t),.4+.3*cos(.37*t),2.8*cos(.5+.35*t))*P4*.7;
  vec3 ta=vec3(1.9*cos(1.2+.41*t),.4+.1*cos(.27*t),1.9*cos(2.+.38*t));
  ro.xz*=rot(uCam.x); ro.y+=uCam.y;
  vec3 f=normalize(ta-ro), r=normalize(cross(vec3(sin(uCam.z),1,0),f)), u=cross(f,r);
  vec3 rd=normalize(uv.x*r+uv.y*u+1.6*f);
  float tt=0., g=0.; int k;
  for(int i=0;i<110;i++){ float d=map(ro+rd*tt); g+=exp(-d*200.); if(d<.0004*tt||tt>12.)break; tt+=d; }
  vec3 col=pal(.6)*.03;
  if(tt<12.){
    float k=fft(fract(trap.w*.7+trap.x*.3));
    vec3 b=pal(trap.w*P3+trap.x+k*.15)*clamp(1.-trap.y*1.5,.2,1.)*(.65+k*.9);
    float ao=clamp(pow(trap.w,.5)*1.4,0.,1.);
    col=b*ao*ao*P7*1.1;
    col+=pal(trap.w*P3+.5)*exp(-abs(tt-uSinceBeat*6.)*2.)*exp(-uSinceBeat*1.4)*.5*ao;
    col*=exp(-tt*P6*.4);
  }
  col+=pal(.3+uTime*.02)*g*.0035*P2*(1.+uBeat*2.);
  c=vec4(col,1);
}`});E({id:"voronoi",name:"Stained Voronoi",params:[{n:"Cells",min:2,max:20,def:6},{n:"Motion",min:0,max:2,def:.7},{n:"Lead Width",min:0,max:.2,def:.05},{n:"Edge Glow",min:0,max:3,def:1.2},{n:"Audio Light",min:0,max:3,def:1.5},{n:"Layers",min:0,max:1,def:.5},{n:"Swirl",min:0,max:2,def:.4},{n:"Facets",min:0,max:1,def:.6}],stick:[0,6],code:`
vec4 vor(vec2 p, float t){
  vec2 n=floor(p), f=fract(p); float F1=8., F2=8.; vec2 id=vec2(0);
  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
    vec2 g=vec2(i,j); vec2 o=h22(n+g); o=.5+.5*sin(t+TAU*o);
    float d=length(g+o-f);
    if(d<F1){F2=F1;F1=d;id=n+g;} else if(d<F2) F2=d;
  }
  return vec4(F1,F2,id);
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc); float r=length(uv);
  uv*=rot(r*P6*(1.+uBass)*.8+uCam.x); uv+=vec2(0,uCam.y);
  vec4 v=vor(uv*P0, uTime*P1);
  float id=h21(v.zw);
  float edge=v.y-v.x;
  vec3 cell=pal(id+uTime*.02)*(.25+fft(id)*P4);
  cell*=1.-P7*.5+P7*.5*smoothstep(0.,.8,v.x)*2.;
  vec3 col=cell*smoothstep(P2,P2+.03,edge);
  col+=pal(id+.5)*glowLine(edge-P2,.01)*.15*P3*(1.+uBeat);
  vec4 v2=vor(uv*P0*2.3+7., -uTime*P1*.7);
  col+=pal(h21(v2.zw)+.3)*smoothstep(.05,0.,v2.y-v2.x)*.4*P5*(.5+uHigh);
  c=vec4(col,1);
}`});E({id:"wavefield",name:"Neon Wavefield",params:[{n:"Scroll",min:0,max:2,def:.35},{n:"Peak Height",min:0,max:2,def:1},{n:"Line Glow",min:.3,max:3,def:1.2},{n:"Spread",min:.2,max:1.5,def:.6},{n:"Wave Mix",min:0,max:1,def:.3},{n:"Fill",min:0,max:1,def:.85},{n:"Hue Depth",min:0,max:2,def:.8},{n:"Horizon",min:-.3,max:.3,def:.05}],stick:[1,3],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc); uv.x+=uCam.x*.3;
  vec3 col=vec3(0);
  const int N=48;
  for(int i=0;i<N;i++){
    float sc=uTime*P0*4.;
    float z=1.-(float(i)+fract(sc))/float(N);
    float fi=h11(float(i)-floor(sc));
    float persp=1./(z*2.2+.35);
    float yb=P7+uCam.y*.2-(1.-z)*.95+.4;
    float x=uv.x*(z*2.+.6);
    float env=exp(-x*x/(P3*P3*.9));
    float f=fft(abs(x)*.4+.02);
    float y=yb+(f*.9*P1+wav(x*.3+fi)*.05*P4)*env*sqrt(persp)*.2+fbm(vec2(x*4.,fi*20.))*.02*env;
    if(uv.y<y) col*=1.-P5*smoothstep(0.,.02,y-uv.y);
    float d=uv.y-y;
    col+=pal(z*P6+f*.3+uTime*.02)*glowLine(d,.0028*persp)*.3*P2*(.35+env)*(1.-z*.7)*(1.+uBeat*.5);
  }
  c=vec4(col,1);
}`});E({id:"starcore",name:"Star Core",params:[{n:"Plasma Scale",min:.5,max:5,def:2},{n:"Churn",min:0,max:3,def:1},{n:"Filaments",min:.2,max:3,def:1.2},{n:"Corona",min:0,max:3,def:1.2},{n:"Rays",min:0,max:3,def:1},{n:"Bass Flare",min:0,max:2,def:1},{n:"Core Heat",min:0,max:3,def:1.3},{n:"Size",min:.5,max:1.6,def:1}],stick:[0,3],code:`
float ridge(vec3 p){ float a=.5,s=0.; for(int i=0;i<5;i++){ float n=1.-abs(n3(p)*2.-1.); s+=a*n*n; p=p*2.07+vec3(3.1,1.7,5.3); a*=.5; } return s; }
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  float R=.42*P7*(1.+uBass*.05*P5);
  vec3 col=vec3(0);
  // starfield
  vec2 sg=floor(fc/3.); float st=h21(sg); col+=vec3(.9,.95,1.)*step(.997,st)*(.4+.6*sin(uTime*3.+st*60.))*.6;
  float r=length(uv), a=atan(uv.y,uv.x);
  // spectrum corona: every direction's streamer length is driven by its slice of the spectrum
  float sa=abs(fract(a/TAU+.25)-.5)*2.;
  float spec=fft(sa*.85+.02);
  float streak=pow(fbm(vec2(a*9./TAU*TAU, r*2.5-uTime*.35*P1)),2.2);
  float reach=R*(1.25+spec*1.6*P3+uBass*.15*P5);
  float corona=smoothstep(reach,R,r)*step(R*.98,r);
  col+=pal(.08+spec*.25+r*.3)*corona*(.25+streak*1.6)*P3*.9;
  col+=pal(.12)*exp(-(r-R)*9./max(P3,.2))*step(R,r)*.35*P3*(.7+uBass*.5);
  // thin glowing spectrum ring
  float ring=abs(r-(R*1.1+spec*.05));
  col+=pal(.55+sa*.4)*.0015/(ring+.0015)*.25*P4*(.6+spec);
  // rays
  float rays=pow(max(0.,sin(a*13.+uTime*.2)*sin(a*7.-uTime*.13)),12.)*exp(-(r-R)*2.)*step(R,r);
  col+=pal(.3)*rays*P4*.35*(1.+uBeat*.6);
  // the sun itself: a real surface with sharp plasma filaments and granulation
  if(r<R){
    float z=sqrt(R*R-r*r);
    vec3 n=normalize(vec3(uv,z));
    n.xz*=rot(uTime*.05*P1+uCam.x); n.yz*=rot(uCam.y*.5);
    vec3 q=n*P0*1.6;
    float w=fbm3(q+vec3(0,0,uTime*.15*P1));
    float fil=ridge(q*1.4+w*1.6*P2+vec3(0,uTime*.08*P1,0));
    float gran=ridge(q*6.+w);
    float band=fft(abs(n.y)*.9+.02);
    float heat=(fil*.9*P2+gran*.25+band*.35*P6)/(.55+.45*P2+.15*P6);
    float limb=pow(z/R,.45);
    vec3 s1=pal(heat*.45+.05)*heat*1.15;
    s1+=pal(.15)*pow(heat,3.)*.5*P6;
    col=s1*limb*(.85+uBass*.25*P5)+pal(.1)*(1.-limb)*.25;
  }
  c=vec4(col,1);
}`});E({id:"flower",name:"Flower of Life",params:[{n:"Lattice Scale",min:1,max:8,def:3},{n:"Rotation",min:-1,max:1,def:.08},{n:"Metatron",min:0,max:2,def:1},{n:"Line Width",min:.5,max:4,def:1.4},{n:"Layer Count",min:1,max:5,def:3},{n:"Bloom Pulse",min:0,max:2,def:1},{n:"Fill",min:0,max:1,def:.35},{n:"Depth Drift",min:0,max:2,def:.6}],stick:[0,7],code:`
float circleLattice(vec2 p, float R){
  // hex lattice of circle centers: distance to nearest circle outline
  vec2 s=vec2(1.,1.7320508)*R;
  vec2 a=mod(p,s)-s*.5, b=mod(p-s*.5,s)-s*.5;
  float d=1e9;
  d=min(d,abs(length(a)-R)); d=min(d,abs(length(b)-R));
  return d;
}
float metatron(vec2 p, float R){
  float d=1e9;
  for(int i=0;i<6;i++){ float a=float(i)*TAU/6.; vec2 v=vec2(cos(a),sin(a))*R*2.;
    for(int j=0;j<6;j++){ float b=float(j)*TAU/6.; vec2 w=vec2(cos(b),sin(b))*R*2.; d=min(d,sdSeg(p,v,w)); d=min(d,sdSeg(p,v*.5,w)); }
    d=min(d,abs(length(p-v)-R*.5)); }
  return d;
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)+uCam.xy*.3; float r=length(uv);
  vec3 col=vec3(0); float w=.0018*P3;
  for(int L=0;L<5;L++){ if(float(L)>=P4) break;
    float fl=float(L);
    float sc=P0*pow(1.6,fl)*(1.+sin(uTime*.2*P7+fl)*.08);
    vec2 p=uv*rot(uTime*P1*(fl+1.)*(mod(fl,2.)*2.-1.)*.3+uCam.z)*sc;
    float R=.5;
    float d=circleLattice(p,R)/sc;
    float k=fft(fract(fl*.23+r));
    col+=pal(fl*.2+r*.5+uTime*.02)*glowLine(d,w*1.5)*(.3+.6*k)*(1.+uBeat*P5)/(1.+fl*.3);
    float inside=smoothstep(.02,0.,circleLattice(p,R*.98)-.0);
    col+=pal(fl*.2+.5)*P6*.05*smoothstep(R,0.,length(fract(p/vec2(1.,1.732))-.5))*k;
  }
  vec2 mp=uv*rot(-uTime*.07)*(1.4-uBass*.2*P5);
  col+=pal(.6+uTime*.03)*glowLine(metatron(mp,.18),w)*.3*P2*(.5+uMid*1.5);
  col*=smoothstep(1.3,.2,r);
  c=vec4(col,1);
}`});E({id:"fall",name:"Endless Fall",params:[{n:"Fall Speed",min:-2,max:3,def:.8},{n:"Spiral",min:0,max:2,def:.6},{n:"Arms",min:1,max:12,def:5},{n:"Tile Detail",min:1,max:6,def:3},{n:"Glow",min:0,max:3,def:1.2},{n:"Audio Rings",min:0,max:3,def:1.2},{n:"Fractal Bite",min:0,max:1,def:.5},{n:"Twist Pulse",min:0,max:2,def:.6}],stick:[1,2],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)-uCam.xy*vec2(.2,-.2);
  float r=length(uv)+1e-4, a=atan(uv.y,uv.x);
  float lr=log(r);
  float arms=floor(P2);
  vec2 lp=vec2(a/TAU*arms + lr*P1*arms*.5, lr - uTime*P0*.5);
  lp.x+=sin(lp.y*2.+uTime)*.1*P7*uBass;
  float scale=1.;
  vec3 col=vec3(0);
  vec2 q=lp*vec2(1.,arms*.5);
  for(int i=0;i<6;i++){ if(float(i)>=P3) break;
    vec2 g=fract(q)-.5; vec2 id=floor(q);
    float d=max(abs(g.x),abs(g.y));
    float hole=length(g)-.3*P6;
    float k=fft(fract(id.y*.07+float(i)*.13));
    col+=pal(id.y*.05+float(i)*.15+uTime*.02)*glowLine(d-.45,.006)*.14*P4*(1.+k*2.)/(1.+float(i)*.5);
    col+=pal(id.x*.1+.5)*smoothstep(.02,0.,hole)*.15*k*P5;
    q=q*2.+vec2(.5);
    q*=rot(.0);
  }
  float rings=pow(.5+.5*sin(lr*12.-uTime*P0*6.),8.)*fft(fract(-lr*.2))*P5;
  col+=pal(lr*.2+.2)*rings*.6;
  col*=smoothstep(0.,.12,r)*(1.+uBeat*.7);
  col+=pal(.9)*.02/r*uBass;
  c=vec4(col,1);
}`});E({id:"hyper",name:"Hyperbolic Temple",params:[{n:"P (sides)",min:3,max:8,def:5},{n:"Q (meet)",min:3,max:8,def:4},{n:"Drift",min:0,max:2,def:.5},{n:"Line Glow",min:0,max:3,def:1.2},{n:"Cell Color",min:0,max:2,def:1},{n:"Spin",min:-1,max:1,def:.1},{n:"Disk Zoom",min:.6,max:1.6,def:1},{n:"Audio Fill",min:0,max:3,def:1.2}],stick:[2,6],code:`
// Fold a point into the fundamental triangle of the {p,q} tiling via reflections.
vec2 cmul(vec2 a, vec2 b){ return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x); }
vec2 cdiv(vec2 a, vec2 b){ return vec2(a.x*b.x+a.y*b.y, a.y*b.x-a.x*b.y)/dot(b,b); }
vec2 mobius(vec2 z, vec2 a){ return cdiv(z-a, vec2(1,0)-cmul(vec2(a.x,-a.y),z)); }
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)*1.05/P6;
  float r0=length(uv);
  vec3 col=vec3(0);
  if(r0<1.){
    float p=floor(P0), q=floor(P1);
    if((p-2.)*(q-2.)<=4.) q=floor(4./(p-2.))+3.;
    float pa=PI/p, qa=PI/q;
    // circle orthogonal to the unit circle that forms the third mirror
    float cs=cos(pa+qa), sp=sin(pa);
    float d2=cos(qa)/sqrt(cs*cs*0.+1.);
    float k=cos(pa+qa)/sin(pa);
    // inversion circle center & radius (standard construction)
    float ca=cos(qa), sa=sin(pa);
    float rr=1./sqrt(ca*ca/(sa*sa)-1.);
    float cx=sqrt(1.+rr*rr);
    vec2 cen=vec2(cx,0.)*rot(-pa*0.);
    vec2 z=uv;
    vec2 drift=.3*vec2(sin(uTime*.2*P2),cos(uTime*.17*P2))*P2+uCam.xy*.4;
    drift*=min(1.,.9/max(length(drift),.001));
    z=mobius(z,drift*.8);
    z*=rot(uTime*P5*.3);
    float inv=0.;
    for(int i=0;i<40;i++){
      // mirror 1: x axis
      if(z.y<0.){ z.y=-z.y; inv++; }
      // mirror 2: line at angle pa
      vec2 n=vec2(-sin(pa),cos(pa));
      float dd=dot(z,n); if(dd>0.){ z-=2.*dd*n; inv++; }
      // mirror 3: circle inversion
      vec2 dz=z-vec2(cx,0.); float l2=dot(dz,dz);
      if(l2<rr*rr){ z=vec2(cx,0.)+dz*rr*rr/l2; inv++; }
      else if(i>3 && z.y>=0. && dot(z,n)<=0.) break;
    }
    vec2 dz=z-vec2(cx,0.);
    float e1=abs(z.y), e2=abs(dot(z,vec2(-sin(pa),cos(pa)))), e3=abs(length(dz)-rr);
    float edge=min(e3, min(e1,e2)*0.+1e9);
    float lw=.004*(1.-r0*r0)+.0005;
    float k2=fft(fract(inv*.05));
    vec3 cell=pal(mod(inv,2.)*.5+inv*.03+uTime*.02)*(.2+k2*P7)*P4;
    col=cell*.6*(1.-r0*r0*.6);
    col+=pal(.1+r0)*glowLine(e3,lw*3.)*.25*P3*(1.+uBeat);
    col+=pal(.6)*glowLine(e1,lw)*.08*P3;
    col*=smoothstep(1.,.97,r0);
  }
  col+=pal(.8)*.03/(abs(r0-1.)+.02)*(.3+uBass);
  c=vec4(col,1);
}`});E({id:"burst",name:"Supernova Burst",params:[{n:"Shards",min:20,max:200,def:90},{n:"Burst Force",min:0,max:3,def:1.3},{n:"Shell Count",min:1,max:6,def:3},{n:"Trail",min:0,max:2,def:1},{n:"Core",min:0,max:3,def:1.2},{n:"Spin",min:-1,max:1,def:.1},{n:"Shimmer",min:0,max:2,def:1},{n:"Warp",min:0,max:2,def:.5}],stick:[1,7],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)+uCam.xy*.2;
  uv*=rot(uTime*P5*.2);
  float r=length(uv), a=atan(uv.y,uv.x);
  vec3 col=vec3(0);
  float n=floor(P0);
  float bi=clamp(uBeatInt,.25,1.5);
  for(int s=0;s<6;s++){ if(float(s)>=P2) break;
    float fs=float(s);
    float age=uSinceBeat+fs*bi;                 // shell 0 = newest beat
    float id=uBeatCount-fs;
    float ph=age/(bi*P2+.7);
    if(ph>1.) continue;
    float R=(.08+(1.-pow(1.-min(age*.9,1.),2.2)))*(1.1+.3*P1);
    float rot0=h11(id)*TAU;
    float aa=a+rot0;
    float sector=floor((aa/TAU+.5)*n);
    float hs=h11(sector+id*17.);
    float rr=R*(.75+.5*hs)+sin(aa*7.+uTime)*.015*P7;
    float d=r-rr;
    float ang=fract((aa/TAU+.5)*n)-.5;
    float shard=exp(-ang*ang*22.)*exp(-max(d,0.)*45.)*smoothstep(-.45*P3,0.,d);
    float fade=(1.-ph)*(1.-ph)*(1.+1.6*exp(-age*7.));
    col+=pal(hs*.3+h11(id)*.5+uTime*.02)*shard*fade*1.6*(.5+fft(hs))*(1.+P6*uHigh*.5);
    col+=pal(h11(id)+.5)*glowLine(d,.005)*fade*.22*P1;
  }
  col+=pal(.05)*P4*.035/(r+.04)*(.5+uBass*1.);
  col+=pal(.8+r)*pow(fbm(uv*3.*rot(uTime*.1)+uTime*.2),3.)*P7*.5*smoothstep(1.,0.,r);
  c=vec4(col,1);
}`});E({id:"fold",name:"Origami Fold",params:[{n:"Fold Angle",min:0,max:3.14,def:.3},{n:"Iterations",min:3,max:14,def:10},{n:"Scale",min:1.1,max:1.8,def:1.33},{n:"Offset",min:.3,max:1.2,def:.7},{n:"Glow",min:.3,max:3,def:1},{n:"Fold Pulse",min:0,max:2,def:1},{n:"Color Rate",min:0,max:3,def:1},{n:"Zoom",min:.3,max:4,def:1}],stick:[0,3],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 p=UV(fc)*2./P7; p*=rot(uCam.x*.5+uTime*.03); p+=uCam.y*vec2(.3,.2);
  vec3 col=vec3(0);
  float ang=P0+sin(uTime*.13)*.2+uBass*.08*P5;
  vec2 cc=vec2(P3,P3*.85)+vec2(sin(uTime*.07),cos(uTime*.09))*.05*(1.+uMid*P5);
  for(int i=0;i<14;i++){ if(float(i)>=P1) break;
    float fi=float(i);
    p=abs(p)/clamp(dot(p,p),.06,20.)*P2*.75-cc;
    p*=rot(ang);
    float l=length(p);
    float k=fft(fi/14.);
    col+=pal(fi*.08*P6+l*.15+uTime*.02)*exp(-abs(l-1.)*6./P4)*(.085+k*.22)*(1.+uBeat*.5);
  }
  c=vec4(col,1);
}`});E({id:"bulb",name:"Mandelbulb Shrine",params:[{n:"Power",min:2,max:12,def:8},{n:"Orbit",min:0,max:1,def:.25},{n:"Glow",min:0,max:3,def:1},{n:"Color Rate",min:.2,max:4,def:1.2},{n:"Distance",min:1.6,max:4,def:2.6},{n:"Power Pulse",min:0,max:2,def:.8},{n:"Rim",min:0,max:3,def:1.2},{n:"Detail",min:4,max:10,def:7}],stick:[0,4],code:`
float tr;
float map(vec3 p){
  vec3 z=p; float dr=1., r=0., pw=P0+uBass*P5; tr=1e9;
  for(int i=0;i<10;i++){ if(float(i)>=P7) break;
    r=length(z); if(r>2.) break;
    float th=acos(clamp(z.z/r,-1.,1.))+uTime*.1, ph=atan(z.y,z.x);
    dr=pow(r,pw-1.)*pw*dr+1.;
    float zr=pow(r,pw); th*=pw; ph*=pw;
    z=zr*vec3(sin(th)*cos(ph),sin(ph)*sin(th),cos(th))+p;
    tr=min(tr,length(z));
  }
  return .5*log(r)*r/dr;
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  vec3 ro=vec3(0,0,-P4); ro.yz*=rot(uCam.y+sin(uTime*.1)*.3); ro.xz*=rot(uCam.x+uTime*P1);
  vec3 f=normalize(-ro), r=normalize(cross(vec3(0,1,0),f)), u=cross(f,r);
  vec3 rd=normalize(uv.x*r+uv.y*u+1.8*f);
  float t=0., g=0., st=0.;
  for(int i=0;i<100;i++){ float d=map(ro+rd*t); g+=exp(-d*20.); if(d<.0008||t>8.)break; t+=d*.9; st++; }
  vec3 col=pal(.7)*.02;
  if(t<8.){
    vec3 p=ro+rd*t;
    float ao=1.-st/100.;
    float k=fft(fract(tr*.8));
    col=pal(tr*P3+uTime*.02+k*.12)*ao*ao*ao*(.85+k*.9);
    col+=pal(tr*P3+.5)*pow(1.-ao,4.)*P6*1.2;
    float sw=exp(-abs(length(p)-(.35+uSinceBeat*1.4))*12.)*exp(-uSinceBeat*1.6);
    col+=pal(tr*P3+.3)*sw*.85*ao;
  }
  col+=pal(.3)*g*.004*P2*(1.+uBeat*2.);
  c=vec4(col,1);
}`});E({fly:!0,id:"hextunnel",name:"Hex Temple",params:[{n:"Speed",min:0,max:4,def:1.4},{n:"Hex Size",min:2,max:14,def:6},{n:"Eyes",min:0,max:2,def:1},{n:"Glow",min:0,max:3,def:1.2},{n:"Warp",min:0,max:2,def:.6},{n:"Twist",min:-2,max:2,def:.4},{n:"Depth Fade",min:0,max:2,def:1},{n:"Glyphs",min:0,max:2,def:1}],stick:[5,4],code:`
vec4 hexc(vec2 p){ vec2 s=vec2(1,1.7320508); vec4 hc=floor(vec4(p,p-vec2(.5,1))/s.xyxy)+.5;
  vec4 h=vec4(p-hc.xy*s, p-(hc.zw+.5)*s); return dot(h.xy,h.xy)<dot(h.zw,h.zw)?vec4(h.xy,hc.xy):vec4(h.zw,hc.zw+.5); }
float hexd(vec2 p){ p=abs(p); return max(dot(p,vec2(.5,.8660254)),p.x); }
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)+uCam.xy*vec2(.2,-.2);
  float r=length(uv), a=atan(uv.y,uv.x);
  float z=.4/(r+.02)+uTime*P0;
  vec2 tp=vec2(a/TAU*P1*2.+z*P5*.1, z);
  tp+=vec2(sin(z*.7),cos(z*.5))*P4*.3;
  vec4 h=hexc(tp*1.);
  float hd=hexd(h.xy);
  float id=h21(h.zw);
  float k=fft(fract(id*.7+h.w*.02));
  vec3 col=pal(id*.5+h.w*.03+uTime*.03)*(.15+k*1.2);
  col*=smoothstep(.5,.42,hd);
  col+=pal(id+.4)*glowLine(hd-.47,.01)*.12*P3*(1.+uBeat);
  float eye=length(h.xy*vec2(1.,1.8));
  float iris=smoothstep(.2,.18,eye)*step(.6,id)*P2;
  col=mix(col, pal(id+.7)*1.5, iris*.8);
  col*=1.-smoothstep(.06,.05,length(h.xy))*iris;
  col+=pal(.2+id)*smoothstep(.02,0.,abs(sin(atan(h.y,h.x)*3.+uTime)*.15-hd+.25))*P7*.4*k;
  col*=smoothstep(0.,.3*P6,r)*(1.+uBass*.4);
  c=vec4(col,1);
}`});E({id:"yantra",name:"Sri Yantra",params:[{n:"Triangles",min:3,max:12,def:9},{n:"Breathing",min:0,max:2,def:1},{n:"Lotus Petals",min:4,max:24,def:16},{n:"Line Width",min:.5,max:4,def:1.5},{n:"Spin",min:-1,max:1,def:.05},{n:"Halo",min:0,max:3,def:1.2},{n:"Fill Glow",min:0,max:2,def:.6},{n:"Zoom",min:.5,max:2,def:1}],stick:[1,6],code:`
float tri(vec2 p, float s){ const float k=1.7320508; p.x=abs(p.x)-s; p.y=p.y+s/k;
  if(p.x+k*p.y>0.) p=vec2(p.x-k*p.y,-k*p.x-p.y)/2.; p.x-=clamp(p.x,-2.*s,0.); return -length(p)*sign(p.y); }
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)/P7*rot(uTime*P4*.2+uCam.x);
  float r=length(uv), a=atan(uv.y,uv.x);
  vec3 col=vec3(0); float w=.002*P3;
  float N=floor(P0);
  for(int i=0;i<12;i++){ if(float(i)>=N) break;
    float fi=float(i)/N;
    float up=mod(float(i),2.)*2.-1.;
    float s=.08+fi*.32+sin(uTime*.5+fi*6.)*.01*P1+fft(fi)*.04*P1;
    float d=tri(vec2(uv.x,uv.y*up+fi*.05*up), s);
    col+=pal(fi+uTime*.02)*glowLine(d,w)*.22*(.6+fft(fi));
    col+=pal(fi+.5)*smoothstep(.01,-.01,d)*.012*P6;
  }
  float pet=floor(P2);
  float pr=.52+.05*abs(sin(a*pet*.5))+fft(.3)*.03;
  col+=pal(.15+a/TAU)*glowLine(r-pr,w)*.35;
  col+=pal(.2)*glowLine(r-.48,w)*.3+pal(.25)*glowLine(r-.62,w)*.3;
  vec2 sq=abs(uv); float box=max(sq.x,sq.y);
  col+=pal(.45)*glowLine(box-.7,w)*.25*step(.04,abs(sq.x*sign(1.)-.0))*1.;
  col+=pal(.0)*.03/(r+.01)*(1.+uBeat*2.);
  col+=pal(.7+r)*P5*.05/(abs(r-.75-uBass*.05)+.05);
  c=vec4(col,1);
}`});E({fly:!0,id:"menger",name:"Menger Crystal",params:[{n:"Speed",min:0,max:3,def:.8},{n:"Hole Size",min:.8,max:1.2,def:1},{n:"Glow",min:0,max:3,def:1.2},{n:"Color Rate",min:.2,max:3,def:1},{n:"Twist",min:0,max:1,def:.3},{n:"Bass Shake",min:0,max:2,def:.6},{n:"Fog",min:0,max:1,def:.4},{n:"Iterations",min:2,max:5,def:4}],stick:[4,1],code:`
float tr;
float sdBox(vec3 p, vec3 b){ vec3 q=abs(p)-b; return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.); }
float map(vec3 p){
  p.xy*=rot(p.z*.1*P4);
  vec3 q=mod(p+1.,2.)-1.;
  float d=sdBox(q,vec3(1.)); float s=1.; tr=1e9;
  for(int m=0;m<5;m++){ if(float(m)>=P7) break;
    vec3 a=mod(q*s,2.)-1.; s*=3.;
    vec3 r=abs(1.-3.*abs(a));
    float da=max(r.x,r.y), db=max(r.y,r.z), dc=max(r.z,r.x);
    float cc=(min(da,min(db,dc))-P1*(1.+uBass*.05*P5))/s;
    d=max(d,cc); tr=min(tr,length(a));
  }
  return d;
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  vec3 ro=vec3(0.,0.,uTime*P0)+vec3(sin(uTime*7.),cos(uTime*9.),0.)*uBass*.01*P5;
  vec3 rd=camRay(uv,1.); rd.xy*=rot(uTime*.05+uCam.z);
  float t=0., g=0., st=0.;
  for(int i=0;i<90;i++){ float d=map(ro+rd*t); g+=exp(-d*40.)*(.3+fft(clamp(t/18.,0.,1.))*1.2); if(d<.001*t||t>20.)break; t+=d; st++; }
  float ao=1.-st/90.;
  vec3 col=pal(tr*P3+t*.05+uTime*.02+uMid*.06)*ao*ao*ao*(1.+fft(fract(tr*1.7))*.5);
  col+=pal(tr*P3+.5)*g*.005*P2*(1.+uBeat+fft(fract(t*.1)));
  col+=pal(tr*P3+.45)*exp(-abs(t-uSinceBeat*13.)*1.2)*exp(-uSinceBeat*1.2)*.55*(.4+ao);
  col=mix(col,pal(.6)*.03,smoothstep(2.,20.,t)*P6);
  c=vec4(col,1);
}`});E({id:"aurora",name:"Aurora Ocean",params:[{n:"Curtains",min:1,max:8,def:5},{n:"Flow",min:0,max:3,def:1},{n:"Height",min:.2,max:1.5,def:.7},{n:"Brightness",min:.3,max:3,def:1.3},{n:"Reflection",min:0,max:1,def:.7},{n:"Waves",min:0,max:2,def:1},{n:"Stars",min:0,max:2,def:1},{n:"Audio Fold",min:0,max:3,def:1.2}],stick:[1,7],code:`
vec3 aurora(vec3 rd){
  vec3 col=vec3(0);
  float seed=h21(gl_FragCoord.xy)*.6;
  for(int i=0;i<34;i++){
    float fi=float(i)+seed;
    float hgt=.5+fi*.035*P2;                       // stacked sheets of light
    float t=hgt/max(rd.y,.015);
    vec2 p=rd.xz*t*.18;
    p.y+=uTime*.04*P1;
    float lane=fbm(vec2(p.x*.55,uTime*.025*P1))*3.2;
    float k=0.;
    for(int c=0;c<8;c++){ if(float(c)>=P0) break;
      float fc=float(c);
      float z=fract((p.y+fc*1.37+lane*.35)*.25)*4.-2.+sin(p.x*.8+fc+uTime*.2*P1)*.6;
      float sp=fft(fract(abs(p.x)*.06+fc*.13));
      float fold=sin(p.x*2.3+uTime*.6+fc*2.)*.25*P7*sp;
      k+=exp(-pow((z-fold)*(3.-sp*1.2),2.)*4.)*(.35+sp*1.5);
    }
    float fade=exp(-fi*.075)*smoothstep(0.,4.,fi);
    col+=pal(fi*.018+p.x*.03+.3)*k*fade*.055;
  }
  float rays=.45+.75*pow(fbm(vec2(rd.x/max(rd.z,.2)*38.,uTime*.15*P1)),1.6);
  return col*rays*P3*1.35*smoothstep(0.,.08,rd.y);
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  vec3 rd=normalize(vec3(uv.x,uv.y+.12,1.)); rd.xz*=rot(uCam.x*.6); rd.yz*=rot(-uCam.y*.25);
  vec3 col;
  float sky=rd.y;
  if(sky>0.){
    col=mix(pal(.65)*.07,vec3(.005,.006,.02),smoothstep(0.,.5,sky));
    vec2 sg=floor(rd.xy/rd.z*260.); float st=h21(sg);
    col+=step(.996-.002*P6,st)*(.5+.5*sin(uTime*2.+st*50.))*P6*.55*(.6+uHigh*.6)*smoothstep(.02,.2,sky);
    col+=aurora(rd);
  } else {
    vec3 rr=vec3(rd.x,-rd.y,rd.z);
    float w=sin(rd.x*60./max(-rd.y,.05)+uTime*2.)*.004+sin(rd.x*23./max(-rd.y,.05)-uTime*1.3)*.006;
    rr.y+=w*P5*(1.+uBass*.8); rr.x+=w*P5*.5;
    col=aurora(normalize(rr))*P4*.75+pal(.65)*.03;
    col*=.7+.3*smoothstep(0.,-.3,rd.y);
    col+=pal(.5)*pow(max(0.,1.-abs(rd.y)*40.),3.)*.08;
  }
  c=vec4(col,1);
}`});var ie=Je,ne=Object.fromEntries(Je.map(t=>[t.id,t])),oe=`#version 300 es
in vec2 aPos; void main(){ gl_Position=vec4(aPos,0,1); }`,Ct=`#version 300 es
precision highp float;
uniform sampler2D uScene, uPrev, uMilk;
uniform vec2 uRes; uniform float uTime;
uniform float uTrail, uZoom, uSpin, uWarp, uHueDrift, uKaleido, uKaleidoSpin, uFusion, uBreathe, uBass, uBeat, uBurstT, uMelt, uMirror;
uniform vec2 uFlow, uBurstC;
uniform float uLensRot, uLensZoom, uSwirl, uBulge, uBeatRipT, uBeatRipAmt, uPunch, uShake;
uniform vec2 uLensPan;
uniform vec4 uTouch, uTouch2;   // xy pos, z strength, w active
uniform vec2 uTouchVel;
uniform vec3 uTouchColor; uniform float uTouchPaint;
out vec4 fragColor;
mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
float h21(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }
vec3 hue(vec3 c, float a){ const vec3 k=vec3(.57735); float ca=cos(a); return c*ca+cross(k,c)*sin(a)+k*dot(k,c)*(1.-ca); }
vec2 ripple(vec2 p, vec2 c, float t, float spd, float amt){
  vec2 d=p-c; float r=length(d); float dd=r-t*spd; return normalize(d+1e-5)*exp(-dd*dd*90.)*amt*max(0.,1.-t*.6);
}
vec2 touchWarp(vec2 p, vec4 T, float k){
  vec2 d=p-T.xy; float g=exp(-dot(d,d)*7.);
  d=rot(T.z*2.6*g*k)*d*(1.-T.z*.22*g*k);
  return T.xy+d-uTouchVel*g*T.w*.9*k;
}
vec2 lens(vec2 p){
  p+=vec2(sin(uTime*37.),cos(uTime*29.))*uShake*.01;
  p-=uLensPan;
  p=rot(uLensRot)*p;
  float r=length(p);
  p*=1./(uLensZoom*(1.+uPunch)*(1.+uBulge*exp(-r*r*1.5)));
  p=rot(uSwirl*exp(-r*1.3)*3.)*p;
  if(uTouch.w>0.) p=touchWarp(p,uTouch,1.);
  if(uTouch2.w>0.) p=touchWarp(p,uTouch2,1.);
  return p;
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes; float asp=uRes.x/uRes.y;
  vec2 p=(uv-.5)*vec2(asp,1.);
  vec2 br=vec2(vn(p*3.+uTime*.3),vn(p*3.-uTime*.27+9.))-.5;
  p+=br*uBreathe*.03*(1.+uBass);
  if(uBeatRipT<2.) p+=ripple(p,vec2(0),uBeatRipT,.8,.018*uBeatRipAmt);
  if(uBurstT<2.) p+=ripple(p,uBurstC,uBurstT,.9,.03);
  vec2 sp=lens(p);
  if(uMirror>.5){ sp.x=abs(sp.x); }
  if(uKaleido>1.5){
    float r=length(sp), a=atan(sp.y,sp.x)+uKaleidoSpin;
    float s=6.2831853/uKaleido; a=mod(a,s); a=abs(a-s*.5);
    sp=r*vec2(cos(a),sin(a));
  }
  vec2 tuv=sp/vec2(asp,1.)+.5;
  tuv=1.-abs(1.-mod(tuv,2.));   // mirror-wrap: the lens never reveals black edges
  vec3 scene=texture(uScene, tuv).rgb;
  vec3 milk=texture(uMilk, tuv).rgb;
  scene=mix(scene, max(scene, milk)+milk*.25, uFusion);
  // warp previous frame
  vec2 q=p; float rr=length(q);
  q*=1./uZoom;
  q=rot(uSpin)*q;
  q+=(vec2(vn(q*4.+uTime*.5),vn(q*4.+3.1-uTime*.4))-.5)*uWarp*.02;
  q+=normalize(q+1e-5)*sin(rr*18.-uTime*3.)*uMelt*.003;
  q-=uFlow*.01;
  if(uTouch.w>0.) q=touchWarp(q,uTouch,.35);
  if(uTouch2.w>0.) q=touchWarp(q,uTouch2,.35);
  vec2 puv=q/vec2(asp,1.)+.5; puv=1.-abs(1.-mod(puv,2.));
  vec3 prev=texture(uPrev, puv).rgb;
  prev=hue(prev, uHueDrift);
  vec3 col=max(scene, max(prev*uTrail-.006*uTrail, 0.));
  // finger paints light into the trails
  if(uTouch.w>0.){ vec2 d=p-uTouch.xy; col+=uTouchColor*exp(-dot(d,d)*260.)*uTouchPaint; }
  if(uTouch2.w>0.){ vec2 d=p-uTouch2.xy; col+=hue(uTouchColor,2.)*exp(-dot(d,d)*260.)*uTouchPaint; }
  fragColor=vec4(max(col,0.),1);
}`,At=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes; out vec4 fragColor;
void main(){ vec2 uv=gl_FragCoord.xy/uRes; vec3 c=texture(uTex,uv).rgb; float l=max(c.r,max(c.g,c.b)); fragColor=vec4(c*smoothstep(.75,1.5,l),1); }`,Et=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes, uDir; out vec4 fragColor;
void main(){ vec2 uv=gl_FragCoord.xy/uRes; vec2 o=uDir/uRes; vec3 c=texture(uTex,uv).rgb*.227;
  c+=(texture(uTex,uv+o*1.38).rgb+texture(uTex,uv-o*1.38).rgb)*.316;
  c+=(texture(uTex,uv+o*3.23).rgb+texture(uTex,uv-o*3.23).rgb)*.07; fragColor=vec4(c,1); }`,Lt=`#version 300 es
precision highp float;
uniform sampler2D uTex, uBloom, uTrans, uAdapt;
uniform float uAutoExp;
uniform vec2 uRes; uniform vec2 uBurstC;
uniform float uTime, uChroma, uBloomAmt, uGrain, uVignette, uExposure, uSat, uFlash, uTransMix, uBurstT, uBeat, uInvert, uContrast;
out vec4 fragColor;
float h21(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.); }
void main(){
  vec2 uv=gl_FragCoord.xy/uRes; vec2 d=uv-.5;
  float bt=uBurstT; vec2 suv=uv;
  if(bt<1.5){ float asp=uRes.x/uRes.y; vec2 pp=d*vec2(asp,1.)-uBurstC; float rr=length(pp); float ring=bt*1.1; float dd=rr-ring; suv+=normalize(d+1e-5)*exp(-dd*dd*120.)*.04*(1.-bt/1.5); }
  float ca=uChroma*(.003+uBeat*.004);
  vec3 col;
  col.r=texture(uTex, suv+d*ca*2.).r;
  col.g=texture(uTex, suv).g;
  col.b=texture(uTex, suv-d*ca*2.).b;
  col+=texture(uBloom, suv).rgb*uBloomAmt;
  float avgL=max(texture(uAdapt, vec2(.5)).r, .015);
  col*=uExposure*mix(1., clamp(.4/avgL, .35, 1.25), uAutoExp);
  vec3 xx=col*1.15; float mx=max(max(xx.r,xx.g),max(xx.b,1e-4));
  vec3 hp=xx*(aces(vec3(mx)).r/mx);                 // max-channel tone map: never clips, keeps hue & gradients
  col=mix(aces(xx), hp, .65);
  float l=dot(col,vec3(.299,.587,.114));
  col=mix(vec3(l),col,uSat);
  col=max((col-.22)*uContrast+.22, col*.6);
  col=mix(col, 1.-col, uInvert);
  col+=uFlash*vec3(1.,.95,.9)*.6;
  col*=1.-uVignette*dot(d,d)*1.6;
  col+=(h21(gl_FragCoord.xy+fract(uTime)*100.)-.5)*uGrain*.08;
  if(uTransMix>0.){
    vec3 tc=texture(uTrans, (uv-.5)*(1.+(1.-uTransMix)*.15)+.5).rgb;
    float n=h21(floor(gl_FragCoord.xy/6.));
    float m=smoothstep(uTransMix-.25, uTransMix, n*.75+length(d)*.35);
    col=mix(col, tc, m*uTransMix);
  }
  fragColor=vec4(clamp(col,0.,1.),1);
}`,zt=`#version 300 es
precision highp float; uniform sampler2D uSmall, uPrev; uniform float uRate; out vec4 fragColor;
void main(){ vec3 c=textureLod(uSmall, vec2(.5), 10.).rgb; float l=mix(dot(c,vec3(.3,.59,.11)), max(c.r,max(c.g,c.b)), .55); float pl=texture(uPrev, vec2(.5)).r; fragColor=vec4(mix(pl,l,uRate),0,0,1); }`,Ft=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes; out vec4 fragColor;
void main(){ fragColor=texture(uTex, gl_FragCoord.xy/uRes); }`;var ze=class{constructor(e){this.canvas=e;let a=this.gl=e.getContext("webgl2",{antialias:!1,alpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"});if(!a)throw new Error("WebGL2 is not available on this system.");this.halfFloat=!!a.getExtension("EXT_color_buffer_float"),a.getExtension("OES_texture_float_linear");let i=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,i),a.bufferData(a.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),a.STATIC_DRAW),this.vao=a.createVertexArray(),a.bindVertexArray(this.vao),a.enableVertexAttribArray(0),a.vertexAttribPointer(0,2,a.FLOAT,!1,0,0),this.progs={},this.errors={},this.post={feedback:this.program(oe,Ct),bright:this.program(oe,At),blur:this.program(oe,Et),final:this.program(oe,Lt),blit:this.program(oe,Ft),adapt:this.program(oe,zt)},this.audioTex=a.createTexture(),a.bindTexture(a.TEXTURE_2D,this.audioTex),a.pixelStorei(a.UNPACK_ALIGNMENT,1),a.texImage2D(a.TEXTURE_2D,0,a.R8,512,2,0,a.RED,a.UNSIGNED_BYTE,null),this.texParams(a.LINEAR,a.CLAMP_TO_EDGE),this.milkTex=a.createTexture(),a.bindTexture(a.TEXTURE_2D,this.milkTex),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,1,1,0,a.RGBA,a.UNSIGNED_BYTE,new Uint8Array([0,0,0,255])),this.texParams(a.LINEAR,a.CLAMP_TO_EDGE),this.scale=.75,this.fbIdx=0,this.finIdx=0,this.lumSmall=this.makeTarget(64,36),a.bindTexture(a.TEXTURE_2D,this.lumSmall.tex),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR_MIPMAP_LINEAR),a.generateMipmap(a.TEXTURE_2D),this.adapt=[this.makeTarget(1,1),this.makeTarget(1,1)],this.adIdx=0,this.W=0,this.H=0}texParams(e,a){let i=this.gl;i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,e),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,e),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,a),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,a)}shader(e,a){let i=this.gl,r=i.createShader(e);if(i.shaderSource(r,a),i.compileShader(r),!i.getShaderParameter(r,i.COMPILE_STATUS)){let o=i.getShaderInfoLog(r);throw i.deleteShader(r),new Error(o)}return r}program(e,a){let i=this.gl,r=i.createProgram();if(i.attachShader(r,this.shader(i.VERTEX_SHADER,e)),i.attachShader(r,this.shader(i.FRAGMENT_SHADER,a)),i.bindAttribLocation(r,0,"aPos"),i.linkProgram(r),!i.getProgramParameter(r,i.LINK_STATUS))throw new Error(i.getProgramInfoLog(r));let o={},s=i.getProgramParameter(r,i.ACTIVE_UNIFORMS);for(let l=0;l<s;l++){let m=i.getActiveUniform(r,l);o[m.name.replace(/\[0\]$/,"")]=i.getUniformLocation(r,m.name)}return{p:r,u:o}}sceneProg(e){if(this.progs[e])return this.progs[e];let a=ie.find(i=>i.id===e);try{this.progs[e]=this.program(oe,Rt+a.code)}catch(i){this.errors[e]=String(i),console.error("Scene",e,i),this.progs[e]=null}return this.progs[e]}precompile(e,a){let i=0,r=()=>{if(i>=e.length)return a&&a();this.sceneProg(e[i++]),setTimeout(r,0)};r()}makeTarget(e,a,i=!0){let r=this.gl,o=r.createTexture();r.bindTexture(r.TEXTURE_2D,o),i&&this.halfFloat?r.texImage2D(r.TEXTURE_2D,0,r.RGBA16F,e,a,0,r.RGBA,r.HALF_FLOAT,null):r.texImage2D(r.TEXTURE_2D,0,r.RGBA8,e,a,0,r.RGBA,r.UNSIGNED_BYTE,null),this.texParams(r.LINEAR,r.CLAMP_TO_EDGE);let s=r.createFramebuffer();return r.bindFramebuffer(r.FRAMEBUFFER,s),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,o,0),r.clearColor(0,0,0,1),r.clear(r.COLOR_BUFFER_BIT),{tex:o,fb:s,w:e,h:a}}freeTarget(e){e&&(this.gl.deleteTexture(e.tex),this.gl.deleteFramebuffer(e.fb))}resize(e,a,i){if(e===this.W&&a===this.H&&i===this.scaleUsed)return;let r=this.gl,o=Math.max(64,Math.round(e*i)),s=Math.max(64,Math.round(a*i)),l=[this.sceneT,...this.fb||[],...this.fin||[],this.bA,this.bB],m=this.fb;this.sceneT=this.makeTarget(o,s),this.fb=[this.makeTarget(o,s),this.makeTarget(o,s)],m&&this.drawTo(this.fb[this.fbIdx],this.post.blit,{uTex:m[this.fbIdx].tex}),!this.fin||e!==this.W||a!==this.H?((this.fin||[]).forEach(b=>this.freeTarget(b)),this.fin=[this.makeTarget(e,a,!1),this.makeTarget(e,a,!1)]):l.splice(l.indexOf(this.fin[0]),2);let h=Math.max(32,Math.round(o/4)),x=Math.max(32,Math.round(s/4));this.bA=this.makeTarget(h,x),this.bB=this.makeTarget(h,x),l.forEach(b=>{b&&!this.fin.includes(b)&&this.freeTarget(b)}),this.W=e,this.H=a,this.scaleUsed=i,this.sw=o,this.sh=s}drawTo(e,a,i,r){let o=this.gl;o.bindFramebuffer(o.FRAMEBUFFER,e?e.fb:null);let s=e?e.w:this.W,l=e?e.h:this.H;o.viewport(0,0,s,l),o.useProgram(a.p);let m=0;for(let[h,x]of Object.entries(i)){let b=a.u[h];b!=null&&(x instanceof WebGLTexture?(o.activeTexture(o.TEXTURE0+m),o.bindTexture(o.TEXTURE_2D,x),o.uniform1i(b,m++)):typeof x=="number"?o.uniform1f(b,x):x.length===2?o.uniform2fv(b,x):x.length===3?o.uniform3fv(b,x):x.length===4&&o.uniform4fv(b,x))}a.u.uRes,a.u.uRes&&o.uniform2f(a.u.uRes,s,l),o.drawArrays(o.TRIANGLES,0,3)}uploadAudio(e){let a=this.gl;a.bindTexture(a.TEXTURE_2D,this.audioTex),a.pixelStorei(a.UNPACK_ALIGNMENT,1),a.texSubImage2D(a.TEXTURE_2D,0,0,0,512,2,a.RED,a.UNSIGNED_BYTE,e)}uploadMilk(e){let a=this.gl;a.bindTexture(a.TEXTURE_2D,this.milkTex),a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,!0),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,a.RGBA,a.UNSIGNED_BYTE,e),a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,!1)}snapshot(){this.transTex=this.fin[this.finIdx].tex,this.finIdx^=1}frame(e){let a=this.post;if(e.engine==="scene"){let x=this.sceneProg(e.scene);x&&this.drawTo(this.sceneT,x,e.sceneU)}let i=e.engine==="milk"?this.milkTex:this.sceneT.tex,r=this.fb[this.fbIdx],o=this.fb[this.fbIdx^1];this.drawTo(o,a.feedback,{...e.fbU,uScene:i,uPrev:r.tex,uMilk:this.milkTex}),this.fbIdx^=1,this.drawTo(this.bA,a.bright,{uTex:o.tex});for(let x=0;x<2;x++)this.drawTo(this.bB,a.blur,{uTex:this.bA.tex,uDir:[1+x,0]}),this.drawTo(this.bA,a.blur,{uTex:this.bB.tex,uDir:[0,1+x]});this.drawTo(this.lumSmall,a.blit,{uTex:o.tex});let s=this.gl;s.bindTexture(s.TEXTURE_2D,this.lumSmall.tex),s.generateMipmap(s.TEXTURE_2D);let l=this.adapt[this.adIdx],m=this.adapt[this.adIdx^1];this.drawTo(m,a.adapt,{uSmall:this.lumSmall.tex,uPrev:l.tex,uRate:e.adaptRate??.04}),this.adIdx^=1;let h=this.fin[this.finIdx];this.drawTo(h,a.final,{...e.finU,uTex:o.tex,uBloom:this.bA.tex,uTrans:this.transTex||o.tex,uAdapt:m.tex}),this.drawTo(null,a.blit,{uTex:h.tex})}};var Fe=class{constructor(){this.ctx=new(window.AudioContext||window.webkitAudioContext)({latencyHint:"interactive"}),this.el=new Audio,this.el.crossOrigin="anonymous",this.el.preload="auto",this.elSrc=this.ctx.createMediaElementSource(this.el),this.input=this.ctx.createGain(),this.analyser=this.ctx.createAnalyser(),this.analyser.fftSize=2048,this.analyser.smoothingTimeConstant=.55,this.out=this.ctx.createGain(),this.elSrc.connect(this.input),this.input.connect(this.analyser),this.elSrc.connect(this.out),this.out.connect(this.ctx.destination),this.freq=new Uint8Array(1024),this.time=new Uint8Array(2048),this.tex=new Uint8Array(512*2),this.bass=0,this.mid=0,this.high=0,this.vol=0,this.beat=0,this.beatCount=0,this.peak={b:.2,m:.2,h:.2,v:.2},this.bassAvg=0,this.lastBeat=0,this.drop=0,this.playlist=[],this.index=-1,this.shuffle=!1,this.repeat="all",this.mode="player",this.stream=null,this.streamSrc=null,this.onchange=()=>{},this.el.addEventListener("ended",()=>this.next(!0)),this.el.addEventListener("play",()=>this.onchange()),this.el.addEventListener("pause",()=>this.onchange());let e=this.ctx.sampleRate/2;this.binMap=new Float32Array(512);for(let a=0;a<512;a++){let i=30*Math.pow(533.3333333333334,a/511);this.binMap[a]=Math.min(1023,i/e*1024)}}async setOutput(e){try{return this.ctx.setSinkId?await this.ctx.setSinkId(e==="default"?"":e):this.el.setSinkId&&await this.el.setSinkId(e),!0}catch(a){return console.warn(a),!1}}resume(){this.ctx.state!=="running"&&this.ctx.resume()}addTracks(e){let a=this.playlist.length===0;this.playlist.push(...e),a&&e.length&&this.play(0),this.onchange()}remove(e){this.playlist.splice(e,1),e<this.index?this.index--:e===this.index&&(this.index=Math.min(this.index,this.playlist.length-1),this.index>=0?this.play(this.index):this.el.pause()),this.onchange()}clear(){this.playlist=[],this.index=-1,this.el.pause(),this.el.removeAttribute("src"),this.onchange()}async play(e){if(!(e<0||e>=this.playlist.length)){this.useSource("player"),this.index=e,this.el.src=this.playlist[e].url,this.resume();try{await this.el.play()}catch(a){console.warn(a)}this.onchange()}}toggle(){if(this.resume(),this.mode!=="player"&&this.useSource("player"),this.index<0&&this.playlist.length)return this.play(0);this.el.paused?this.el.play():this.el.pause()}next(e){if(!this.playlist.length)return;if(this.repeat==="one"&&e)return this.play(this.index);let a=this.shuffle?Math.floor(Math.random()*this.playlist.length):this.index+1;if(a>=this.playlist.length){if(this.repeat==="off"&&e)return;a=0}this.play(a)}prev(){if(this.el.currentTime>3){this.el.currentTime=0;return}this.play((this.index-1+this.playlist.length)%Math.max(1,this.playlist.length))}get current(){return this.playlist[this.index]}stopStream(){this.stream&&(this.stream.getTracks().forEach(e=>e.stop()),this.stream=null),this.streamSrc&&(this.streamSrc.disconnect(),this.streamSrc=null)}useSource(e){e==="player"&&this.mode!=="player"&&(this.stopStream(),this.mode="player",this.onchange())}async useLoopback(){this.resume();let e=await navigator.mediaDevices.getDisplayMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1},video:!0,systemAudio:"include",selfBrowserSurface:"exclude"});if(e.getVideoTracks().forEach(a=>a.stop()),!e.getAudioTracks().length)throw new Error("No audio was shared \u2014 pick a tab or \u201CEntire screen\u201D and turn on \u201CShare audio\u201D.");this.attachStream(e,"loopback")}async useMic(){this.resume();let e=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});this.attachStream(e,"mic")}attachStream(e,a){this.el.pause(),this.stopStream(),this.stream=e,this.streamSrc=this.ctx.createMediaStreamSource(e),this.streamSrc.connect(this.input),this.mode=a,this.onchange()}update(e,a=1,i={}){let r=i.sens??1,o=i.gB??1,s=i.gM??1,l=i.gH??1,m=this.analyser;m.getByteFrequencyData(this.freq),m.getByteTimeDomainData(this.time);let h=this.ctx.sampleRate/2,x=this.freq,b=(B,F)=>{let U=Math.max(1,Math.floor(B/h*1024)),D=Math.max(U+1,Math.floor(F/h*1024)),Le=0;for(let Ze=U;Ze<D;Ze++)Le+=x[Ze];return Le/(D-U)/255},k=b(25,160)*o,y=b(160,2200)*s,M=b(2200,12e3)*l,z=0;for(let B=0;B<2048;B+=4){let F=(this.time[B]-128)/128;z+=F*F}z=Math.sqrt(z/512);let w=this.peak,O=Math.pow(.25,e/8);w.b=Math.max(k,w.b*O,.05),w.m=Math.max(y,w.m*O,.05),w.h=Math.max(M,w.h*O,.03),w.v=Math.max(z,w.v*O,.02);let $=(B,F,U,D)=>B+(F-B)*(1-Math.exp(-e*(F>B?U:D))),Y=Math.min(2.5,a);this.bass=$(this.bass,Math.pow(k/w.b,1.6)*Y,30,8),this.mid=$(this.mid,Math.pow(y/w.m,1.4)*Y,20,6),this.high=$(this.high,Math.pow(M/w.h,1.3)*Y,25,7),this.vol=$(this.vol,z/w.v*Y,15,4),this.bassAvg=this.bassAvg+(k-this.bassAvg)*(1-Math.exp(-e*2));let g=1-Math.exp(-e*1.4);this.bMean=(this.bMean??k)+(k-(this.bMean??k))*g;let R=(k-this.bMean)*(k-this.bMean);this.bVar=(this.bVar??.001)+(R-(this.bVar??.001))*g;let P=Math.sqrt(this.bVar),S=this.bMean+(1.25-r*.4)*P+.015,C=performance.now()/1e3;this.isBeat=!1,!this.above&&k>S&&k>.1&&C-this.lastBeat>.16?(this.lastBeat=C,this.beat=1,this.beatCount++,this.isBeat=!0,this.above=!0):this.above&&k<this.bMean+.3*P&&(this.above=!1),this.beat*=Math.exp(-e*7),this.drop=this.drop*Math.exp(-e*.5)+Math.max(0,k-this.bassAvg*1.6)*e*4;for(let B=0;B<512;B++){let F=this.binMap[B],U=Math.floor(F),D=F-U,Le=x[U]*(1-D)+x[Math.min(1023,U+1)]*D;this.tex[B]=Math.min(255,Le*(1+B/512*.8))}for(let B=0;B<512;B++)this.tex[512+B]=this.time[B*2]}};var A={A:0,B:1,X:2,Y:3,LB:4,RB:5,LT:6,RT:7,BACK:8,START:9,L3:10,R3:11,UP:12,DOWN:13,LEFT:14,RIGHT:15,TOUCH:17},De=class{constructor(){this.prev=[],this.downAt=[],this.held=[],this.axes=[0,0,0,0],this.lt=0,this.rt=0,this.connected=!1,this.id="",this.deadzone=.14,this.style="xbox",this.lastInput=0,this.gp=null}poll(){let e=navigator.getGamepads?navigator.getGamepads():[],a=null;for(let y of e)if(y&&y.connected){a=y;break}this.hid&&this.hid.fresh&&(a=this.hid.asGamepad()),this.gp=a;let i=this.connected;if(this.connected=!!a,this.justConnected=!i&&this.connected,!a){this.pressed=[],this.released=[];return}this.id=a.id,this.style=/054c|playstation|dualsense|dualshock/i.test(a.id)||/wireless controller/i.test(a.id)&&!/xbox|xinput|045e/i.test(a.id)?"ps":"xbox";let r=performance.now();this.pressed=[],this.released=[];let o=Math.min(a.buttons.length,18);for(let y=0;y<o;y++){let M=a.buttons[y],z=typeof M=="object"?M.value:M,w=typeof M=="object"&&M.pressed||z>.5;w&&!this.prev[y]&&(this.pressed[y]=!0,this.downAt[y]=r,this.held[y]=!1,this.lastInput=r),!w&&this.prev[y]&&(this.released[y]=!0),this.prev[y]=w}let s=y=>{let M=Math.abs(y);return M<this.deadzone?0:Math.sign(y)*((M-this.deadzone)/(1-this.deadzone))},l=a.axes,m=(y,M)=>{let z=Math.hypot(y,M);if(z<this.deadzone)return[0,0];let w=(z-this.deadzone)/(1-this.deadzone)/z;return[y*w,M*w]},[h,x]=m(l[0]||0,l[1]||0),[b,k]=m(l[2]||0,l[3]||0);this.axes=[h,x,b,k],this.lt=a.buttons[6]?a.buttons[6].value:0,this.rt=a.buttons[7]?a.buttons[7].value:0,Math.abs(h)+Math.abs(x)+Math.abs(b)+Math.abs(k)+this.lt+this.rt>.05&&(this.lastInput=r)}down(e){return!!this.prev[e]}tap(e){return!!this.pressed[e]}hold(e,a){return this.prev[e]&&!this.held[e]&&performance.now()-this.downAt[e]>a?(this.held[e]=!0,!0):!1}shortRelease(e){return!!this.released[e]&&!this.held[e]}rumble(e,a,i=80){let r=this.gp;if(!(!r||!r.vibrationActuator))try{r.vibrationActuator.playEffect("dual-rumble",{duration:i,strongMagnitude:Math.min(1,e),weakMagnitude:Math.min(1,a)})}catch{}}label(e){return this.style==="ps"?{A:"\u2715",B:"\u25CB",X:"\u25A1",Y:"\u25B3",LB:"L1",RB:"R1",LT:"L2",RT:"R2",BACK:"Create",START:"Options",L3:"L3",R3:"R3"}[e]||e:{A:"A",B:"B",X:"X",Y:"Y",LB:"LB",RB:"RB",LT:"LT",RT:"RT",BACK:"View",START:"Menu",L3:"LS",R3:"RS"}[e]||e}};var X=[{name:"Acid Rainbow",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.33,.67]},{name:"Psilocybin",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[.8,.9,.3]},{name:"Synthwave",a:[.55,.3,.6],b:[.45,.3,.4],c:[1,1,1],d:[0,.15,.25]},{name:"Aurora",a:[.3,.55,.5],b:[.3,.45,.45],c:[1,1,1],d:[.55,.25,.3]},{name:"Molten Gold",a:[.6,.4,.2],b:[.4,.35,.2],c:[1,1,1],d:[0,.1,.2]},{name:"Deep Ocean",a:[.2,.4,.6],b:[.2,.35,.4],c:[1,1,1],d:[.3,.2,.1]},{name:"Toxic",a:[.4,.6,.3],b:[.4,.4,.4],c:[1,1.5,1],d:[.2,0,.5]},{name:"Candy",a:[.65,.5,.65],b:[.35,.45,.35],c:[1,1,1],d:[0,.5,.25]},{name:"Infrared",a:[.5,.2,.25],b:[.5,.3,.3],c:[1,1,1.5],d:[0,.1,.6]},{name:"Ultraviolet",a:[.45,.25,.65],b:[.45,.3,.35],c:[1,2,1],d:[.6,.1,0]},{name:"Ice Fire",a:[.5,.5,.5],b:[.5,.5,.5],c:[.5,.5,.5],d:[0,.15,.5]},{name:"Peacock",a:[.4,.5,.5],b:[.4,.4,.5],c:[2,1,1],d:[.5,.2,.25]},{name:"Sunset Dream",a:[.6,.4,.4],b:[.4,.4,.3],c:[1,1,1],d:[0,.2,.45]},{name:"Emerald Temple",a:[.25,.5,.35],b:[.25,.45,.3],c:[1,1,2],d:[.6,.3,.5]},{name:"Holographic",a:[.6,.6,.7],b:[.4,.4,.3],c:[2,2,2],d:[0,.33,.67]},{name:"Blacklight",a:[.35,.2,.55],b:[.35,.45,.45],c:[1.5,1,1],d:[.35,.7,.1]}],J={trail:.55,zoom:1.01,spin:0,warp:.3,hueDrift:0,kaleido:0,kaleidoSpin:0,mirror:0,breathe:.4,melt:0,chroma:1,bloom:.8,grain:.3,vignette:.6,exposure:1,saturation:1.1,contrast:1.05,react:1,speed:1,fusion:0,hueSpin:0,dance:1,ripple:1,punch:1,shake:1,swirlA:1,bulgeA:1};function Dt(t){let e=2166136261;for(let a of t)e=Math.imul(e^a.charCodeAt(0),16777619)>>>0;return()=>{e=e+1831565813>>>0;let a=e;return a=Math.imul(a^a>>>15,a|1),a^=a+Math.imul(a^a>>>7,a|61),((a^a>>>14)>>>0)/4294967296}}var oa={trail:[.1,.62],zoom:[.995,1.018],spin:[-.006,.006],warp:[0,1],breathe:[.1,1.2],melt:[0,.6],hueDrift:[-.01,.01],hueSpin:[-.05,.05],kaleidoSpin:[-.3,.3],chroma:[.4,1.6],bloom:[.35,.85],exposure:[.95,1.08],saturation:[1,1.4],contrast:[1,1.12],grain:[.08,.45],vignette:[.3,.95],react:[.8,1.5],speed:[.7,1.45],dance:[.4,1.9],ripple:[.3,1.7],punch:[.4,1.7],shake:[.15,1.4],swirlA:[.3,1.9],bulgeA:[.3,1.7]};function Qe(t,e=J,a={}){let i=Dt(t),r={...J,...e};for(let[o,[s,l]]of Object.entries(oa))r[o]=+(s+i()*(l-s)).toFixed(4);return e.trail===0&&(r.trail=0),e.zoom===1&&(r.zoom=1),{...r,...a}}var p=(t,e,a,i={},r=0)=>{let o=ne[t],s=Dt(e+"#shape"),l=o.params.map((h,x)=>{if(a[x]!==void 0)return a[x];let b=h.def+(s()-.5)*.16*(h.max-h.min);return+Math.max(h.min,Math.min(h.max,b)).toFixed(4)}),m=Qe(e,J,i);return o.fly&&(m.trail=Math.min(m.trail,i.trail!==void 0?.3:.08+s()*.17)),{id:"eye-"+e.toLowerCase().replace(/[^a-z0-9]+/g,"-"),name:e,engine:"scene",scene:t,params:l,palette:r,fx:m,builtin:!0}};var Q=[p("cathedral","Cathedral of Echoes",[],{trail:.45},0),p("cathedral","Infinite Basilica",[1.1,.2,1.42,1.3,1.4,.95],{trail:.35,kaleido:0},4),p("cathedral","Neon Spine",[.55,1.1,1.6,1.3,2,.75,1.5,1.4],{trail:.5,zoom:1.012,hueDrift:.006},15),p("cathedral","Gothic Mushroom Vault",[.95,.7,1.5,1.2,.7,1.05,1,1.8],{breathe:.8,melt:.4,trail:.35},1),p("nebula","Warp Nebula",[],{},9),p("nebula","Wormhole Petals",[2,.4,3.2,1.6,1,.3,1.1,6],{kaleido:6,trail:.4},0),p("nebula","Cosmic Drain",[.6,.9,1.5,2.5,.4,-.6,1.2],{spin:.01,trail:.7,zoom:.985},5),p("julia","Julia Bloom",[],{},0),p("julia","Dendrite Garden",[1.2,1.3,.6,1.2,2,.76,.2,6],{trail:.4},13),p("julia","Paisley Mind",[2.6,.8,1.8,1,1.5,.79,-.4,1],{breathe:1.2,melt:.5},1),p("julia","Electric Lace",[4.2,1.6,2.4,1.5,2.8,.7885,.3,4],{kaleido:0,trail:.6,hueDrift:.02},15),p("gyroid","Gyroid Hyperspace",[],{},9),p("gyroid","Coral Lungs",[1.4,.8,.15,1.4,.7,1.8,.06,.3],{breathe:1.5,trail:.5},12),p("gyroid","Light Speed Lattice",[3,4.5,.03,1.6,.2,.6,.05,1.6],{trail:.5,zoom:1.02,chroma:1.6},0),p("chrome","Liquid Chrome",[],{},14),p("chrome","Mercury Heartbeat",[4,.9,.15,4,.6,2,.4,1.3],{trail:.3},10),p("chrome","Oil Slick Orbit",[8,.35,.7,12,1.6,1,2,1],{trail:.5,breathe:.8},1),p("horizon","Neon Horizon",[],{},2),p("horizon","Outrun Forever",[2.5,.38,1.5,10,1.2,1.5,14,1.5],{trail:.4,chroma:2},2),p("horizon","Hallucinated Highway",[1.5,.25,1.2,6,2,1,6,1.4],{breathe:1.2,melt:1,trail:.6,hueDrift:.01},0),p("mandala","Spectral Mandala",[],{},0),p("mandala","Lotus Reactor",[8,8,.8,2,.05,1.4,1.4,1.1],{trail:.6,zoom:1.015},7),p("mandala","Chakra Spin",[16,4,.3,1.2,.5,1,.4,.8],{trail:.75,spin:.008},9),p("mandala","Lace Galaxy",[24,10,1,1,-.2,2,2,1.3],{kaleido:0,trail:.5,hueDrift:.015},15),p("silk","Silk Warp",[],{},1),p("silk","Melting Marble",[1.4,2,1.6,.4,1.8,1.2,1.8,1],{breathe:1,melt:.5},4),p("silk","Liquid Thought",[3.5,1.6,.8,1.2,1,1.5,1.2,.2],{kaleido:8,trail:.4},3),p("silk","Tie-Dye Ocean",[2.6,2.6,2.6,.9,.8,1,1.1,.6],{trail:.3,hueDrift:.02},0),p("apollo","Apollonian Dream",[],{},14),p("apollo","Bubble Universe",[1.32,.4,2.2,2.5,1,.8,.2,1.3],{trail:.5},11),p("apollo","Pearl Labyrinth",[1.08,1.2,.8,.8,1.8,.3,.6,1.6],{breathe:.6},4),p("voronoi","Stained Voronoi",[],{},7),p("voronoi","Cathedral Window",[4,.3,.08,1.5,2,.3,0,.9],{kaleido:12,trail:.3},0),p("voronoi","Cell Division",[12,1.5,.02,2.5,2.5,1,1.4,.3],{trail:.6,breathe:1.2,melt:.4},6),p("wavefield","Neon Wavefield",[],{},2),p("wavefield","Pulsar Ridge",[.6,1.6,1.8,.4,.1,1,.4,.1],{trail:.5,chroma:1.5},10),p("wavefield","Spectral Dunes",[.2,1.2,1,1.2,.8,.6,1.8,0],{mirror:1,trail:.6},3),p("starcore","Star Core",[],{},4),p("starcore","Blue Giant",[3,1.6,1.6,2,1.6,1.4,1,1.2],{trail:.6},5),p("starcore","Quasar Eye",[2.2,2,1.4,2.2,2,1.4,1.2,.85],{kaleido:6,trail:.35},8),p("flower","Flower of Life",[],{},4),p("flower","Metatron Gate",[2,.15,2,1.6,4,1.5,.6,1],{trail:.5,zoom:1.012},13),p("flower","Seed of Creation",[2.6,-.05,.6,1.2,4,1,.35,1.4],{trail:.45,breathe:1,hueDrift:.006},1),p("fall","Endless Fall",[],{},0),p("fall","Droste Staircase",[1.5,1.2,3,4,1.5,1,.2,1],{trail:.5},4),p("fall","Spiral Abyss",[2.2,1.8,8,5,1.8,2,.8,1.5],{trail:.7,zoom:.99,spin:-.01},9),p("fall","Rising Up",[-1.2,.4,6,3,1.2,1.5,.5,.4],{kaleido:0,trail:.4,hueDrift:.01},3),p("hyper","Hyperbolic Temple",[],{},0),p("hyper","Escher Heaven",[7,3,.8,2,.5,.2,1,.8],{trail:.4},10),p("hyper","Infinite Mosaic",[4,6,1.4,1.5,.8,-.3,1.3,1.2],{trail:.5,breathe:.6},7),p("burst","Supernova Burst",[],{},4),p("burst","Firework Mind",[180,2,6,1.5,.8,.4,2,.4],{trail:.66,zoom:1.02},0),p("burst","Crystal Detonation",[60,2.2,4,.8,1.2,0,1.6,1],{kaleido:8,trail:.7,zoom:1.02},15),p("fold","Origami Fold",[],{},1),p("fold","Folding Cathedral",[.15,12,1.4,.8,1.4,1.5,1.4,.8],{trail:.5},4),p("fold","Dragon Paper",[.6,10,1.3,.62,1.2,1.2,2,1.3],{trail:.65,breathe:1},9),p("fold","Snowflake Engine",[1.05,9,1.36,.75,1.6,1,.8,.7],{kaleido:6,trail:.4},5),p("bulb","Mandelbulb Shrine",[],{},14),p("bulb","Alien Spore",[4,.4,1.6,2,2.2,1.5,2,7],{trail:.5,breathe:1},6),p("bulb","Golden Idol",[10,.15,.6,.8,2.4,.4,1.6,8],{trail:.3},4),p("hextunnel","Hex Temple",[],{},1),p("hextunnel","Machine Elf Hall",[2.2,8,2,2,1.4,1.2,1,2],{trail:.6,breathe:1.4,melt:.4},0),p("yantra","Sri Yantra",[],{},4),p("yantra","Third Eye Opening",[12,2,24,1.2,.2,2.5,1.2,1.2],{trail:.7,zoom:1.018},9),p("menger","Menger Crystal",[],{},5),p("menger","Sponge Cathedral",[1.6,.95,2,2,.6,1.2,.2,4],{trail:.5},4),p("aurora","Aurora Ocean",[],{},3),p("aurora","Borealis Mirror",[8,1.5,1.1,1.8,1,1.6,2,2],{trail:.5,breathe:.6},12)],ra=["Velvet","Chrome","Fractal","Liquid","Astral","Neon","Cosmic","Prismatic","Holographic","Molten","Electric","Dreaming","Infinite","Sacred","Psychedelic","Iridescent","Quantum","Lucid","Melting","Hyper","Ancient","Crystal","Sonic","Shimmering","Feral","Halcyon","Opal","Ultraviolet"],sa=["Singularity","Aurora","Cathedral","Lotus","Vortex","Garden","Labyrinth","Mandala","Spiral","Bloom","Engine","Temple","Ocean","Nebula","Serpent","Oracle","Echo","Portal","Reactor","Dream","Prism","Hive","Halo","Abyss","Lattice","Comet","Membrane","Kaleidoscope"],W=(t,e)=>t+Math.random()*(e-t),ce=t=>t[Math.floor(Math.random()*t.length)];function Ie(){return`${ce(ra)} ${ce(sa)}`}function It(){return{name:"Generated",a:[W(.3,.65),W(.3,.65),W(.3,.65)],b:[W(.3,.55),W(.3,.55),W(.3,.55)],c:[ce([.5,1,1,1,1.5,2]),ce([.5,1,1,1,1.5,2]),ce([.5,1,1,1,1.5,2])],d:[Math.random(),Math.random(),Math.random()]}}function Ut(t=J,e=1){let a={...t},i=(r,o,s)=>{a[r]=a[r]+(W(o,s)-a[r])*e};i("trail",0,.85),i("zoom",.985,1.03),i("spin",-.012,.012),i("warp",0,1.2),i("breathe",0,1.6),i("melt",0,.8),i("chroma",.3,2.2),i("bloom",.4,1.4),a.hueDrift=Math.random()<.3?W(-.02,.02):0,e>=1&&(a.kaleido=Math.random()<.3?ce([3,4,5,6,8,12]):0),a.mirror=Math.random()<.12?1:0;for(let r of["dance","ripple","punch","shake","swirlA","bulgeA"])i(r,.3,1.9);return a}function et(t,e=.55){let a=ne[t.scene],i=structuredClone(t);return i.builtin=!1,a&&(i.params=a.params.map((r,o)=>{let s=t.params[o]??r.def,l=W(r.min,r.max);return+(s+(l-s)*e).toFixed(4)})),i.fx=Ut(t.fx,e*.7),a&&a.fly&&(i.fx.trail=Math.min(i.fx.trail,.25)),Math.random()<.5&&(i.palette=Math.random()<.4?It():Math.floor(Math.random()*X.length)),i.name=Ie(),i.id="gen-"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),i}function tt(){let t=ce(ie),e=t.params.map(i=>{let r=W(i.min,i.max);return+(i.def+(r-i.def)*.7).toFixed(4)}),a=Ut(J,1);return t.fly&&(a.trail=Math.min(a.trail,.25)),{id:"gen-"+Date.now().toString(36),name:Ie(),engine:"scene",scene:t.id,params:e,palette:Math.random()<.5?It():Math.floor(Math.random()*X.length),fx:a,builtin:!1}}function Ue(t){return typeof t=="number"?X[(t%X.length+X.length)%X.length]:t}var qt="eyecandy.userPresets.v1";function Ht(){try{return JSON.parse(localStorage.getItem(qt)||"[]")}catch{return[]}}function Me(t){try{localStorage.setItem(qt,JSON.stringify(t))}catch{}}function Nt(t){let e=t.ctx,a=e.createGain();a.gain.value=.55,a.connect(t.input),a.connect(t.out);let i=124,r=60/i/4,o=e.currentTime+.1,s=0,l=!0,m=[0,3,5,7,10,12,15],h=e.createBuffer(1,e.sampleRate,e.sampleRate),x=h.getChannelData(0);for(let g=0;g<x.length;g++)x[g]=Math.random()*2-1;let b=e.createDelay(1);b.delayTime.value=r*3;let k=e.createGain();k.gain.value=.35,b.connect(k),k.connect(b),b.connect(a);let y=g=>{let R=e.createOscillator(),P=e.createGain();R.frequency.setValueAtTime(150,g),R.frequency.exponentialRampToValueAtTime(42,g+.12),P.gain.setValueAtTime(1,g),P.gain.exponentialRampToValueAtTime(.001,g+.45),R.connect(P),P.connect(a),R.start(g),R.stop(g+.5)},M=(g,R)=>{let P=e.createBufferSource();P.buffer=h;let S=e.createBiquadFilter();S.type="highpass",S.frequency.value=8e3;let C=e.createGain();C.gain.setValueAtTime(R,g),C.gain.exponentialRampToValueAtTime(.001,g+.05),P.connect(S),S.connect(C),C.connect(a),P.start(g),P.stop(g+.06)},z=g=>{let R=e.createBufferSource();R.buffer=h;let P=e.createBiquadFilter();P.type="bandpass",P.frequency.value=1500;let S=e.createGain();S.gain.setValueAtTime(.5,g),S.gain.exponentialRampToValueAtTime(.001,g+.18),R.connect(P),P.connect(S),S.connect(a),S.connect(b),R.start(g),R.stop(g+.2)},w=(g,R,P,S)=>{let C=e.createOscillator(),B=e.createOscillator(),F=e.createBiquadFilter(),U=e.createGain();C.type="sawtooth",B.type="square";let D=55*Math.pow(2,R/12);C.frequency.value=D,B.frequency.value=D*1.005,F.type="lowpass",F.Q.value=9,F.frequency.setValueAtTime(S,g),F.frequency.exponentialRampToValueAtTime(120,g+P),U.gain.setValueAtTime(.22,g),U.gain.exponentialRampToValueAtTime(.001,g+P),C.connect(F),B.connect(F),F.connect(U),U.connect(a),U.connect(b),C.start(g),B.start(g),C.stop(g+P),B.stop(g+P)},O=(g,R)=>{[0,7,15,19].forEach(P=>{let S=e.createOscillator(),C=e.createGain();S.type="triangle",S.frequency.value=110*Math.pow(2,(R+P)/12),C.gain.setValueAtTime(0,g),C.gain.linearRampToValueAtTime(.05,g+1),C.gain.linearRampToValueAtTime(0,g+r*64),S.connect(C),C.connect(a),C.connect(b),S.start(g),S.stop(g+r*64)})},$=[0,-4,3,-2],Y=()=>{if(l){for(;o<e.currentTime+.15;){let g=s%16,R=Math.floor(s/16),P=Math.floor(R/8)%4,S=$[Math.floor(R/2)%4],C=R%32>=28;!C&&g%4===0&&y(o),g%2===1&&M(o,g%4===3?.25:.1),!C&&(g===4||g===12)&&z(o),Math.random()<(P===2?.8:.55)&&w(o,S+12+m[Math.floor(Math.random()*m.length)]+(Math.random()<.2?12:0),r*1.8,600+3e3*Math.abs(Math.sin(s*.03))),g===0&&R%4===0&&O(o,S),o+=r,s++}setTimeout(Y,25)}};return Y(),()=>{l=!1,a.gain.setTargetAtTime(0,e.currentTime,.2),setTimeout(()=>a.disconnect(),800)}}var _t=[3302,3570],la=[1476,2508,2976],ca=(()=>{let t=new Uint32Array(256);for(let e=0;e<256;e++){let a=e;for(let i=0;i<8;i++)a=a&1?3988292384^a>>>1:a>>>1;t[e]=a>>>0}return t})();function Gt(t){let e=4294967295;for(let a of t)e=ca[(e^a)&255]^e>>>8;return(e^4294967295)>>>0}var ua=[[1,0,0,0],[1,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,1,1],[0,0,0,1],[1,0,0,1],[0,0,0,0]],qe=class{constructor(){this.supported=!!navigator.hid,this.device=null,this.kind=null,this.bt=!1,this.status=this.supported?"not connected":"unsupported",this.t=[{active:!1,x:.5,y:.5,id:-1},{active:!1,x:.5,y:.5,id:-1}],this.axes=[0,0,0,0],this.buttons=new Array(18).fill(0),this.lastReport=0,this.lastPadReport=0,this.onstatus=()=>{},this.seq=0,this.rumbleTimer=0,this.supported&&(navigator.hid.addEventListener("disconnect",e=>{e.device===this.device&&(this.device=null,this.set("not connected"))}),navigator.hid.addEventListener("connect",()=>this.autoConnect()))}set(e){this.status=e,this.onstatus(e)}get connected(){return!!this.device}get fresh(){return this.device&&performance.now()-this.lastPadReport<400}async autoConnect(){if(!this.supported||this.device)return!1;try{let a=(await navigator.hid.getDevices()).find(i=>i.vendorId===1356&&(_t.includes(i.productId)||la.includes(i.productId)));if(a)return await this.open(a),!0}catch(e){console.warn(e)}return!1}async request(){if(!this.supported)return!1;try{window.eyecandy&&window.eyecandy.requestHid?await window.eyecandy.requestHid():await navigator.hid.requestDevice({filters:[{vendorId:1356}]})}catch(e){console.warn(e)}return this.autoConnect()}async open(e){try{e.opened||await e.open()}catch{this.set("could not open (close Steam / DS4Windows?)");return}this.device=e,this.kind=_t.includes(e.productId)?"ds5":"ds4";try{await e.receiveFeatureReport(this.kind==="ds5"?5:2)}catch{}e.addEventListener("inputreport",a=>this.parse(a)),this.set((this.kind==="ds5"?"DualSense":"DualShock 4")+" connected (touchpad + full controller)")}parse(e){let a=e.data,i=e.reportId,r=w=>a.getUint8(w),o=-1,s=-1;if(this.kind==="ds5"?i===1&&a.byteLength>=40?(o=0,s=32,this.bt=!1):i===49&&a.byteLength>=41?(o=1,s=33,this.bt=!0):i===1&&a.byteLength>=9&&(o=0,this.bt=!0):i===1&&a.byteLength>=42?(o=0,s=34,this.bt=!1):i===17&&a.byteLength>=44?(o=2,s=36,this.bt=!0):i===1&&a.byteLength>=9&&(o=0,this.bt=!0),o<0)return;let l=w=>(r(w)-128)/127.5,m=this.buttons;this.axes=[l(o),l(o+1),l(o+2),l(o+3)];let h,x,b,k,y;this.kind==="ds5"&&s>=0?(k=r(o+4),y=r(o+5),h=r(o+7),x=r(o+8),b=r(o+9)):(h=r(o+4),x=r(o+5),b=r(o+6),k=r(o+7),y=r(o+8));let M=ua[Math.min(8,h&15)];if(m[2]=h>>4&1,m[0]=h>>5&1,m[1]=h>>6&1,m[3]=h>>7&1,m[4]=x&1,m[5]=x>>1&1,m[6]=k/255,m[7]=y/255,m[8]=x>>4&1,m[9]=x>>5&1,m[10]=x>>6&1,m[11]=x>>7&1,m[12]=M[0],m[15]=M[1],m[13]=M[2],m[14]=M[3],m[16]=b&1,m[17]=b>>1&1,this.lastPadReport=performance.now(),s<0)return;let z=this.kind==="ds5"?1079:942;for(let w=0;w<2;w++){let O=s+w*4,$=r(O),Y=r(O+1),g=r(O+2),R=r(O+3),P=this.t[w];P.active=!($&128),P.id=$&127,P.active&&(P.x=Math.min(1,(Y|(g&15)<<8)/1919),P.y=Math.min(1,(g>>4|R<<4)/z))}this.lastReport=performance.now()}asGamepad(){return{id:(this.kind==="ds5"?"DualSense":"DualShock 4")+" (HID, Vendor: 054c)",connected:!0,mapping:"standard",axes:this.axes,buttons:this.buttons.map(e=>({pressed:e>.5,value:e})),vibrationActuator:{playEffect:(e,a)=>this.rumble(a)}}}async rumble({duration:e=100,strongMagnitude:a=0,weakMagnitude:i=0}={}){if(!this.device)return;let o=Math.round(Math.min(1,a)*255),s=Math.round(Math.min(1,i)*255);try{await this.sendMotors(o,s),clearTimeout(this.rumbleTimer),this.rumbleTimer=setTimeout(()=>this.sendMotors(0,0).catch(()=>{}),e)}catch{}}async sendMotors(e,a){let i=this.device;if(i)if(this.kind==="ds5"){let r=new Uint8Array(47);if(r[0]=3,r[2]=a,r[3]=e,!this.bt)return i.sendReport(2,r);let o=new Uint8Array(77);o[0]=(this.seq=this.seq+1&15)<<4,o[1]=16,o.set(r,2);let s=Gt(new Uint8Array([162,49,...o.subarray(0,73)]));return o[73]=s&255,o[74]=s>>>8&255,o[75]=s>>>16&255,o[76]=s>>>24&255,i.sendReport(49,o)}else{if(!this.bt){let s=new Uint8Array(31);return s[0]=7,s[3]=a,s[4]=e,i.sendReport(5,s)}let r=new Uint8Array(77);r[0]=192,r[2]=7,r[5]=a,r[6]=e;let o=Gt(new Uint8Array([162,17,...r.subarray(0,73)]));return r[73]=o&255,r[74]=o>>>8&255,r[75]=o>>>16&255,r[76]=o>>>24&255,i.sendReport(17,r)}}};var d=t=>document.querySelector(t),Pe=t=>[...document.querySelectorAll(t)],_=(t,e,a)=>Math.max(e,Math.min(a,t)),I=(t,e,a)=>t+(e-t)*a,N=window.eyecandy||null;N||document.addEventListener("DOMContentLoaded",()=>{},{once:!0});var Wt="eyecandy.settings.v1",fa={resolution:"native",renderScale:"auto",autoExposure:!0,fpsCap:"0",uiScale:1,startFullscreen:!1,showFps:!1,autopilot:!0,autoInterval:30,autoSource:"mix",autoOnDrop:!0,idle:20,reactIntensity:1.4,idleDance:!0,beatRipples:!0,beatPulse:.8,beatFlash:.3,cameraShake:.5,beatSens:1,gainBass:1,gainMid:1,gainHigh:1,outputDevice:"default",rumble:!0,rumbleStrength:.7,deadzone:.14,stickSens:1,invertY:!1,touchMode:"both",transition:1.4,autoPause:!1,uiAutoHide:!0,volume:.85,seenGuide:!1},f={...fa,...JSON.parse(localStorage.getItem(Wt)||"{}")},me=()=>localStorage.setItem(Wt,JSON.stringify(f)),ee=d("#gl"),L;try{L=new ze(ee)}catch(t){throw document.body.innerHTML=`<div style="padding:40px;font:16px sans-serif;color:#fff">Eye Candy needs WebGL2.<br><br>${t.message}</div>`,t}var c=new Fe;c.out.gain.value=f.volume;var v=new De;v.deadzone=f.deadzone;var q=new qe;v.hid=q;var ae={active:!1,x:.5,y:.5},H=Ht(),we=null,G=null,te=null,Se=null,ke=[],He=null,he=null,jt={...J,trail:0,zoom:1,warp:0,breathe:.15,bloom:.6,chroma:.8,grain:.25};function ve(){return G?Promise.resolve():He||(He=new Promise((t,e)=>{let a=document.createElement("script");a.src="milk.js",a.onload=()=>{let i=window.EyeMilk;Se={};for(let r of i.packs)try{Object.assign(Se,r.getPresets?r.getPresets():r.default?.getPresets())}catch(o){console.warn(o)}ke=Object.keys(Se).sort((r,o)=>r.localeCompare(o)),te=document.createElement("canvas"),te.width=1280,te.height=720,G=i.butterchurn.createVisualizer(c.ctx,te,{width:1280,height:720,pixelRatio:1,textureRatio:1}),G.connectAudio(c.input),t()},a.onerror=e,document.head.appendChild(a)}),He)}function ma(t,e){if(!G)return;let a=Math.min(1,1280/t),i=Math.round(t*a),r=Math.round(e*a);(te.width!==i||te.height!==r)&&(te.width=i,te.height=r,G.setRendererSize(i,r))}function Be(t,e=2){!G||!Se[t]||(G.loadPreset(Se[t],e),he=t)}var We=()=>ke[Math.floor(Math.random()*ke.length)],at=new Map;function pt(t){return at.has(t)||at.set(t,{id:"milk:"+t,name:t,engine:"milk",milk:t,fx:Qe(t,jt,{trail:0,zoom:1,kaleido:0,mirror:0}),palette:0,builtin:!0}),at.get(t)}var de="eye",u=structuredClone(Q[0]),Ce=structuredClone(u),j=0,n={camX:0,camY:0,roll:0,morphX:0,morphY:0,waitCenter:!1,time:0,timeScale:1,hue:0,burstT:9,flash:0,freeze:!1,lt:0,rt:0,transMix:0,lastSwitch:0,lastHuman:-1e9,kAngle:0,pal:null,flowX:0,flowY:0,hyper:0,autoT:0,panels:!0,cinema:!1,amX:0,amY:0,danceT:0,sinceBeat:9,beatInt:.5,jolt:0,beatRipT:9,beatRipAmt:0,lastAutoBurst:0,lastStick:-1e9,lensRot:0,lensZoom:1,swirl:0,bulge:0,swirlT:0,bulgeT:0,burstCX:0,burstCY:0,pinch:null,touch:[{on:!1,x:0,y:0,vx:0,vy:0,s:0},{on:!1,x:0,y:0,vx:0,vy:0,s:0}]},Kt=t=>[...t.a,...t.b,...t.c,...t.d];n.pal=Kt(Ue(u.palette));var it=[-1,-.5,.25,.5,.75,1,1.5,2,3,4];function ht(t){return t==="eye"?Q:t==="user"?H:t==="milk"?ke.map(pt):Q}function vt(){let t=ne[u.scene];if(!t)return[];let e=u.params.slice(),[a,i]=t.stick||[0,1],r=(n.waitCenter?0:n.morphX)+n.amX,o=(n.waitCenter?0:n.morphY)+n.amY,s=(l,m)=>{let h=t.params[l];h&&(e[l]=_(e[l]+m*(h.max-h.min)*.35,h.min,h.max))};return s(a,r),s(i,o),e}function V(t,e={}){t&&(e.transition!==!1&&L.fin&&(L.snapshot(),n.transMix=1),u=structuredClone(t),u.fx={...J,...t.engine==="milk"?jt:{},...t.fx},Ce=structuredClone(u),n.waitCenter=Math.abs(n.morphX)+Math.abs(n.morphY)>.1,n.hue=u.fx.hueOffset||0,n.lastSwitch=performance.now(),n.camX=0,n.camY=0,n.lensRot=0,n.lensZoom=1,u.engine==="milk"?ve().then(()=>Be(u.milk,e.transition===!1?0:2)):u.fx.fusion>0&&ve().then(()=>{u.milk?Be(u.milk):he||Be(We())}),u.engine==="scene"&&L.errors[u.scene]&&T("\u26A0","Scene failed to compile \u2014 skipping"),d("#presetName").textContent=u.name,K(),Z(),e.quiet||T("\u25C6",u.name))}function se(t){let e=ht(de);if(!e.length){de==="milk"&&ve().then(()=>{K(),se(t)});return}j=((j+t)%e.length+e.length)%e.length,V(e[j])}function xt(){if(u.engine==="milk"){u.fx={...u.fx,...et({...u,scene:"none"}).fx},u.name=u.milk+" \u2684",d("#presetName").textContent=u.name,Z(),T("\u2684","Randomized FX");return}V(et(u),{quiet:!0}),T("\u2684","Randomized \xB7 "+u.name)}function gt(){V(tt(),{quiet:!0}),T("\u2726","Generated \xB7 "+u.name)}function Zt(){let t=structuredClone(u);return t.engine==="scene"&&(t.params=vt().map(e=>+e.toFixed(4))),t.fx={...t.fx,hueOffset:(n.hue%1+1)%1,speed:+(t.fx.speed*Math.abs(n.timeScale)).toFixed(3)},t.engine==="scene"&&t.fx.fusion>0&&he&&(t.milk=he),t}function je(){let t=Zt();t.id="user-"+Date.now().toString(36),t.builtin=!1,(Ce.builtin||!t.name||H.some(e=>e.name===t.name))&&(t.name=(t.engine==="milk"?"Milk \xB7 ":"")+Ie()),H.push(t),Me(H),u=structuredClone(t),Ce=structuredClone(t),d("#presetName").textContent=u.name,K(),Z(),T("\u2605","Saved \u201C"+t.name+"\u201D to My Presets"),v.rumble(.4,.6,120)}function da(){let t=H.findIndex(a=>a.id===u.id);if(t<0)return je();let e=Zt();e.name=d("#pName").value||e.name,H[t]=e,Me(H),Ce=structuredClone(e),u=structuredClone(e),n.timeScale=1,K(),T("\u2605","Updated \u201C"+e.name+"\u201D")}function pa(){let t=H.findIndex(e=>e.id===u.id);t<0||(H.splice(t,1),Me(H),K(),T("\u2716","Deleted"),se(0))}function Ae(t=1,e=0,a=0){n.burstCX=e,n.burstCY=a,n.burstT=0,n.flash=.55*t,v.rumble(.9*t*f.rumbleStrength,.5*t*f.rumbleStrength,160)}function Jt(t=1){let e=typeof u.palette=="number"?u.palette:-1;u.palette=((e+t)%X.length+X.length)%X.length,T(v.label("RB"),"Palette \xB7 "+X[u.palette].name),Z()}var nt=[0,3,4,5,6,8,12,16];function Qt(){let t=nt.indexOf(u.fx.kaleido);u.fx.kaleido=nt[(t+1)%nt.length],T(v.label("LB"),u.fx.kaleido?"Kaleidoscope \xD7"+u.fx.kaleido:"Kaleidoscope off"),Z()}function ea(){u.fx.mirror=u.fx.mirror?0:1,T(v.label("LB"),u.fx.mirror?"Mirror world":"Mirror off"),Z()}function Ve(t){let e=it.indexOf(n.timeScale);e<0&&(e=5),e=_(e+t,0,it.length-1),n.timeScale=it[e],T(t>0?"\u25B2":"\u25BC",n.timeScale<0?"Time reversed \xD7"+Math.abs(n.timeScale):"Time \xD7"+n.timeScale)}function ha(){n.camX=n.camY=n.roll=0,n.lensRot=0,n.lensZoom=1,n.timeScale=1,n.flowX=n.flowY=0,T(v.label("L3"),"View reset")}function va(){u.engine==="scene"&&(u.params=vt(),n.waitCenter=!0,Z(),T(v.label("R3"),"Shape locked in"),v.rumble(.2,.5,60))}function bt(t){f.autopilot=t,me(),d("#autoBtn").classList.toggle("on",t),T("\u27F3",t?"Autopilot on":"Autopilot off"),St()}function xe(){n.lastHuman=performance.now()}function xa(t,e){let a=f.autopilot&&(!f.autoPause||e-n.lastHuman>f.idle*1e3);if(n.autoActive=a,!a)return;n.autoT+=t;let i=(e-n.lastSwitch)/1e3,r=f.autoOnDrop&&c.drop>1.1&&i>12;if(i>f.autoInterval||r){c.drop=0;let o=f.autoSource,s=Math.random();o==="generate"||o==="mix"&&s<.25?V(tt(),{quiet:!0}):o==="milk"||o==="mix"&&s<.4||o==="all"&&s<.5?ve().then(()=>V(pt(We()),{quiet:!0})):o==="user"&&H.length?V(H[Math.floor(Math.random()*H.length)],{quiet:!0}):(j=Math.floor(Math.random()*Q.length),V(Q[j],{quiet:!0})),r&&Ae(.8)}}function ga(t){if(v.poll(),v.justConnected&&(T("\u{1F3AE}",(v.style==="ps"?"PlayStation":"Xbox")+" controller connected"),v.rumble(.5,.8,200),f.seenGuide||(f.seenGuide=!0,me(),pe(!0)),v.style==="ps"&&q.supported&&!q.connected&&!N&&(d("#tpChip").classList.remove("hidden"),setTimeout(()=>T("\u25C9","PlayStation pad: click \u201CEnable touchpad\u201D up top to use the touchpad"),1500)),Bt()),!v.connected){n.lt=I(n.lt,0,t*6),n.rt=I(n.rt,0,t*6);return}let[e,a,i,r]=v.axes;if((v.pressed.some(Boolean)||Math.abs(e)+Math.abs(a)+Math.abs(i)+Math.abs(r)+v.lt+v.rt>.05)&&(xe(),d("#splash").classList.contains("gone")||ba(),f.uiAutoHide&&Ke()),!d("#controls").classList.contains("hidden")){(v.tap(A.B)||v.tap(A.A)||v.shortRelease(A.BACK))&&pe(!1);return}let s=f.stickSens,l=f.invertY?-1:1;Math.abs(e)+Math.abs(a)+Math.abs(i)+Math.abs(r)>.05&&(n.lastStick=performance.now()),u.engine==="milk"?(n.lensRot+=e*t*1.8*s,n.lensZoom=_(n.lensZoom*Math.exp(a*l*t*1.3*s),.3,4),n.swirlT=i*1.5*s,n.bulgeT=-r*l*1.1*s):(n.camX+=e*t*1.5*s,n.camY=_(n.camY-a*l*t*1.1*s,-1.3,1.3),n.waitCenter&&Math.hypot(i,r)<.12&&(n.waitCenter=!1),n.morphX=I(n.morphX,_(i*s,-1.5,1.5),t*8),n.morphY=I(n.morphY,_(-r*l*s,-1.5,1.5),t*8),n.swirlT=i*.3*s,n.bulgeT=-r*l*.15*s),n.flowX=I(n.flowX,e,t*5),n.flowY=I(n.flowY,-a*l,t*5),n.lt=I(n.lt,v.lt,t*10),n.rt=I(n.rt,v.rt,t*10),v.lt>.08&&Math.random()<t*3&&dt("LT","Warp",v.lt),v.rt>.08&&Math.random()<t*3&&dt("RT","Drive",v.rt);let m=v.lt>.92&&v.rt>.92;m&&!n.hyperOn&&(T("\u2604","HYPERDRIVE"),Ae(1.2)),n.hyperOn=m,v.tap(A.A)&&Ae(1),v.tap(A.TOUCH)&&(f.idleDance=!f.idleDance,me(),St(),T("\u25C9",f.idleDance?"Music dance ON":"Music dance OFF \u2014 pure beat reactive"),v.rumble(.3,.5,90)),v.style==="ps"&&q.supported&&!q.connected&&!n.tpTried&&(n.tpTried=!0,q.autoConnect().then(h=>{!h&&N&&q.request()})),n.freeze=v.down(A.B),v.tap(A.B)&&T(v.label("B"),"Freeze"),v.shortRelease(A.X)&&xt(),v.hold(A.X,550)&&(gt(),v.rumble(.6,.6,150)),v.tap(A.Y)&&je(),v.shortRelease(A.LB)&&Qt(),v.hold(A.LB,500)&&ea(),v.shortRelease(A.RB)&&Jt(1),v.down(A.RB)&&performance.now()-v.downAt[A.RB]>300&&(n.hue+=t*.5,Math.random()<t*2&&T(v.label("RB"),"Hue spin")),v.tap(A.RIGHT)&&se(1),v.tap(A.LEFT)&&se(-1),v.tap(A.UP)&&Ve(1),v.tap(A.DOWN)&&Ve(-1),v.tap(A.L3)&&ha(),v.tap(A.R3)&&va(),v.tap(A.START)&&(n.cinema=!1,yt(!0),ia()),v.shortRelease(A.BACK)&&pe(!0),v.hold(A.BACK,700)&&bt(!f.autopilot)}function ba(){!c.playlist.length&&c.mode==="player"&&!we&&Tt(),Re()}function ya(t){let e=L.W&&L.H?L.W/L.H:1.7777777777777777,a;q.connected&&performance.now()-q.lastReport<600?a=q.t.map(o=>o.active?o:null):a=[ae.active?ae:null,null];for(let o=0;o<2;o++){let s=n.touch[o],l=a[o];if(l&&f.touchMode!=="off"){let m=(l.x-.5)*e,h=.5-l.y;s.on||(s.x=m,s.y=h,s.vx=s.vy=0);let x=(m-s.x)/Math.max(t,.001),b=(h-s.y)/Math.max(t,.001);s.vx=I(s.vx,x,.35),s.vy=I(s.vy,b,.35),s.x=m,s.y=h,s.on=!0,s.s=Math.min(1,s.s+t*3),xe()}else s.on=!1,s.s=Math.max(0,s.s-t*2),s.vx*=.9,s.vy*=.9}let[i,r]=n.touch;if(i.on&&r.on){let o=Math.hypot(i.x-r.x,i.y-r.y),s=Math.atan2(r.y-i.y,r.x-i.x);if(n.pinch){n.lensZoom=_(n.lensZoom*(o/Math.max(.02,n.pinch.d)),.3,4);let l=s-n.pinch.a;l>Math.PI&&(l-=2*Math.PI),l<-Math.PI&&(l+=2*Math.PI),n.lensRot+=l}n.pinch={d:o,a:s}}else n.pinch=null}var Ot=(t,e)=>[t.x,t.y,e?t.s*(n.pinch?.3:1):0,t.s>.01?1:0];function ta(t){let e=n.pal,a=[];for(let i=0;i<3;i++)a.push(_(e[i]+e[3+i]*Math.cos(6.2831853*(e[6+i]*t+e[9+i]+n.hue)),0,1));return a}var ot=performance.now(),Ne=0,rt=0,_e=16,Ge=0,re=.8,st=0;function aa(t){requestAnimationFrame(aa);let e=+f.fpsCap;if(e>0&&t-ot<1e3/e-1.5)return;let a=Math.min(.05,(t-ot)/1e3);ot=t,ga(a),ya(a);let i=u.fx,r=n.rt,o=n.lt,s=n.hyperOn?1:0;n.hyper=I(n.hyper,s,a*3),c.update(a,i.react*(1+r*1.6),{sens:f.beatSens,gB:f.gainBass,gM:f.gainMid,gH:f.gainHigh}),xa(a,t);let l=f.reactIntensity*i.react,m=f.idleDance?1:0;n.danceT+=a*(.5+c.vol*1.2);let h=n.danceT;n.amX=I(n.amX,m*l*i.dance*(Math.sin(h*.53)*.3*(.35+c.mid)+c.bass*.22*Math.sin(h*.19+1)),a*4),n.amY=I(n.amY,m*l*i.dance*(Math.cos(h*.41)*.25*(.35+c.high)+c.beat*.28),a*6);let x=m*Math.min(l,2)*i.dance*Math.sin(h*.07+.5)*(.04+c.vol*.1),b=m*Math.min(l,2)*i.dance*Math.sin(h*.11)*(.02+c.mid*.05);u.engine==="milk"&&m>.5&&(n.lensRot+=a*l*i.swirlA*.05*Math.sin(h*.05),t-n.lastStick>4e3&&(n.lensZoom=I(n.lensZoom,1+Math.sin(h*.09)*.15*i.bulgeA,a*.2))),n.sinceBeat+=a,c.isBeat&&(n.sinceBeat>.2&&n.sinceBeat<2&&(n.beatInt=I(n.beatInt,n.sinceBeat,.3)),n.sinceBeat=0,n.jolt=(Math.random()-.5)*2,n.beatRipT=0,n.beatRipAmt=Math.min(1.6,c.bass*.9)*l*i.ripple,f.beatFlash>0&&c.bass>1.2&&t-n.lastAutoBurst>2200&&(n.flash=Math.max(n.flash,f.beatFlash*.5*Math.min(l,1.5)),n.lastAutoBurst=t)),n.jolt*=Math.exp(-a*7),n.beatRipT+=a,n.swirl=I(n.swirl,n.swirlT+Math.min(l,2)*m*i.swirlA*Math.sin(h*.17)*(.04+c.mid*.16),a*4),n.bulge=I(n.bulge,n.bulgeT+Math.min(l,2)*i.bulgeA*c.bass*.08,a*10),i.kaleido>1&&(n.kAngle+=a*c.mid*.25*l*Math.sin(h*.11));let k=window.devicePixelRatio||1,y=f.resolution==="native"?Math.round(innerHeight*Math.min(k,2)):+f.resolution,M=Math.round(y*innerWidth/Math.max(1,innerHeight));(ee.width!==M||ee.height!==y)&&(ee.width=M,ee.height=y),_e=I(_e,a*1e3,.05);let z;if(f.renderScale==="auto"){Ge+=a;let D=e>0?1e3/e:16.7;Ge>1.5&&(_e>D*1.25&&re>.4?(re=Math.max(.4,re-.08),Ge=0):_e<D*.88&&re<1&&(re=Math.min(1,re+.05),Ge=0)),z=Math.max(u.engine==="milk"?.7:.4,Math.round(re*20)/20)}else z=_(+f.renderScale,.25,2);let w=L.fin;L.resize(M,y,z),w!==L.fin&&(L.transTex=null);let O=i.speed*n.timeScale*(1+r*1.2+n.hyper*2);n.freeze||(n.time+=a*O*(1+c.vol*.45*Math.min(l,2.5))),n.hue+=a*(i.hueSpin||0),n.kAngle+=a*(i.kaleidoSpin||0)*.5,n.burstT+=a,n.flash*=Math.exp(-a*6),n.transMix=Math.max(0,n.transMix-a/Math.max(.2,f.transition)),n.roll=I(n.roll,n.flowX*.25,a*2);let $=Kt(Ue(u.palette));for(let D=0;D<12;D++)n.pal[D]=I(n.pal[D],$[D],1-Math.exp(-a*2.5));if(L.uploadAudio(c.tex),(u.engine==="milk"||i.fusion>0)&&G){ma(Math.max(L.sw,Math.min(M,1280)),Math.max(L.sh,Math.round(Math.min(M,1280)*y/M)));try{G.render(),L.uploadMilk(te)}catch(D){console.warn(D)}}let g=u.engine==="scene"?vt():[0,0,0,0,0,0,0,0];for(;g.length<8;)g.push(0);let R=c.beat*f.beatPulse*i.punch*.05*Math.min(l,2.5),P=c.beat*f.cameraShake*i.shake*Math.min(l,2)*.5,S=n.pal,C=f.touchMode==="both"||f.touchMode==="vortex",B=f.touchMode==="both"||f.touchMode==="paint",F=n.touch[0],U=i.trail>.15?c.bass*.05*Math.min(l,2):0;L.frame({adaptRate:1-Math.exp(-a*2.5),engine:u.engine==="milk"&&G?"milk":"scene",scene:u.engine==="milk"?"nebula":u.scene,sceneU:{uTime:n.time,uBass:c.bass,uMid:c.mid,uHigh:c.high,uVol:c.vol,uBeat:c.beat,uDrive:r,uBurst:n.burstT,uHue:n.hue,uBeatCount:c.beatCount,uSinceBeat:n.sinceBeat,uBeatInt:n.beatInt,uAudio:L.audioTex,uP0:g.slice(0,4),uP1:g.slice(4,8),uPalA:S.slice(0,3),uPalB:S.slice(3,6),uPalC:S.slice(6,9),uPalD:S.slice(9,12),uCam:[n.camX+x,n.camY+b,n.roll+n.jolt*.06*f.cameraShake]},fbU:{uTime:n.time,uTrail:Math.min(.96,Math.max(i.trail+U,o*.9,n.hyper*.86)),uZoom:i.zoom+o*.035+n.hyper*.04+c.beat*f.beatPulse*.008*l,uSpin:i.spin+o*n.flowX*.03+n.jolt*.004*f.cameraShake,uWarp:i.warp+o*.8+c.mid*.3*Math.min(l,2),uHueDrift:i.hueDrift+o*.012+n.hyper*.05+c.high*.006*l,uKaleido:i.kaleido,uKaleidoSpin:n.kAngle,uMirror:i.mirror,uFusion:u.engine==="milk"?0:G?i.fusion:0,uBreathe:i.breathe+r*.6+c.bass*.35*Math.min(l,2),uMelt:i.melt+o*.5+c.high*.25*Math.min(l,2),uBass:c.bass,uBeat:c.beat,uBurstT:n.burstT,uBurstC:[n.burstCX,n.burstCY],uFlow:[n.flowX*o,n.flowY*o],uLensRot:n.lensRot+n.jolt*.025*f.cameraShake,uLensZoom:n.lensZoom,uLensPan:[0,0],uSwirl:n.swirl,uBulge:n.bulge,uPunch:R,uShake:P,uBeatRipT:f.beatRipples?n.beatRipT:9,uBeatRipAmt:n.beatRipAmt,uTouch:Ot(n.touch[0],C),uTouch2:Ot(n.touch[1],C),uTouchVel:[_(F.vx*.02,-.08,.08),_(F.vy*.02,-.08,.08)],uTouchColor:ta(n.time*.05),uTouchPaint:B?1.2:0},finU:{uTime:t/1e3,uChroma:i.chroma+r*2+n.hyper*2+c.beat*1.2*Math.min(l,2),uBloomAmt:i.bloom*(1-n.hyper*.5)+r*.45,uAutoExp:f.autoExposure?1:0,uGrain:i.grain,uVignette:i.vignette,uBurstC:[n.burstCX,n.burstCY],uExposure:i.exposure*(1+r*.12-n.hyper*.15),uSat:i.saturation,uContrast:i.contrast+o*.06,uFlash:n.flash,uTransMix:n.transMix,uBurstT:n.burstT,uBeat:c.beat,uInvert:0}}),f.rumble&&v.connected&&c.isBeat&&performance.now()-n.lastHuman<3e4&&v.rumble(Math.min(1,c.bass*.45)*f.rumbleStrength*(.35+r),.15*f.rumbleStrength,70),n.hyperOn&&f.rumble&&Math.random()<a*10&&v.rumble(.25*f.rumbleStrength,.6*f.rumbleStrength,60),st+=a,st>1/30&&(st=0,Ta()),Ne+=a,rt++,Ne>.5&&(f.showFps?d("#fps").textContent=`${Math.round(rt/Ne)} fps \xB7 out ${M}\xD7${y} \xB7 render ${L.sw}\xD7${L.sh} (${Math.round(z*100)}%)`:d("#fps").textContent="",Ne=0,rt=0)}var fe=document.documentElement.style,be=document.getElementById("spec"),ue=be?be.getContext("2d"):null;function Ta(){let t=e=>ta(e).map(a=>Math.round(a*255)).join(",");if(fe.setProperty("--c1",t(0)),fe.setProperty("--c2",t(.33)),fe.setProperty("--c3",t(.66)),fe.setProperty("--bass",Math.min(1.5,c.bass).toFixed(3)),fe.setProperty("--beat",c.beat.toFixed(3)),ue&&Ee.classList.contains("show")){let e=be.width=be.clientWidth*2,a=be.height=be.clientHeight*2;ue.clearRect(0,0,e,a);let i=48,r=e/i,o=ue.createLinearGradient(0,0,e,0);o.addColorStop(0,`rgb(${t(0)})`),o.addColorStop(.5,`rgb(${t(.33)})`),o.addColorStop(1,`rgb(${t(.66)})`),ue.fillStyle=o;for(let s=0;s<i;s++){let l=c.tex[Math.floor(s/i*400)]/255,m=Math.max(2,l*l*a);ue.globalAlpha=.35+l*.6,ue.fillRect(s*r+1,a-m,r-2,m)}ue.globalAlpha=1}}var Oe=d("#hud");function T(t,e){let a=document.createElement("div");for(a.className="toast",a.innerHTML=`<span class="g">${t}</span><span>${le(e)}</span>`,Oe.appendChild(a);Oe.children.length>3;)Oe.firstChild.remove();setTimeout(()=>{a.style.opacity=0,setTimeout(()=>a.remove(),450)},1700)}var Vt={};function dt(t,e,a){let i=Vt[t];(!i||!i.isConnected)&&(i=document.createElement("div"),i.className="toast",i.innerHTML=`<span class="g">${v.label(t)}</span><span>${e}</span><span class="bar"><i></i></span>`,Oe.appendChild(i),Vt[t]=i),i.querySelector("i").style.width=Math.round(a*100)+"%",i.style.opacity=1,clearTimeout(i._t),i._t=setTimeout(()=>{i.style.opacity=0,setTimeout(()=>i.remove(),450)},900)}var le=t=>String(t).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),Ee=d("#ui"),Xe=0;function yt(t){n.cinema&&!t||(Ee.classList.add("show"),document.body.classList.remove("idle"),clearTimeout(Xe),f.uiAutoHide&&(Xe=setTimeout(()=>{(!Ee.matches(":hover")||t==="fromPad")&&Ke()},3500)))}function Ke(){d("#splash").classList.contains("gone")&&!document.activeElement?.matches("input,select")&&(Ee.classList.remove("show"),document.body.classList.add("idle"))}function ia(){n.panels=!n.panels,document.body.classList.toggle("panels-off",!n.panels)}window.addEventListener("mousemove",()=>yt());Ee.addEventListener("mouseleave",()=>{clearTimeout(Xe),f.uiAutoHide&&(Xe=setTimeout(Ke,1500))});function Re(){d("#splash").classList.add("gone"),document.body.classList.add("started")}var Pa={addFiles:()=>d("#fileIn").click(),addFolder:()=>d("#folderIn").click(),loopback:async()=>{try{ye(),await c.useLoopback(),Re(),T("\u{1F50A}","Listening to your PC audio")}catch(t){T("\u26A0",t.message||"Capture cancelled")}},mic:async()=>{try{ye(),await c.useMic(),Re(),T("\u{1F399}","Listening to microphone")}catch{T("\u26A0","Microphone unavailable")}},demo:()=>{Tt(),Re()},srcPlayer:()=>{ye(),c.useSource("player"),c.playlist.length&&c.toggle()},prevPreset:()=>se(-1),nextPreset:()=>se(1),mutate:xt,generate:gt,save:je,overwrite:da,revert:()=>{V(Ce,{quiet:!0}),T("\u21BA","Reverted")},deletePreset:pa,autopilot:()=>bt(!f.autopilot),controls:()=>pe(!0),fullscreen:Pt,playPause:()=>{ye(),c.toggle()},prevTrack:()=>c.prev(),nextTrack:()=>c.next(),shuffle:()=>{c.shuffle=!c.shuffle,$e()},repeat:()=>{c.repeat={all:"one",one:"off",off:"all"}[c.repeat],$e()},clearList:()=>{c.clear(),kt()},exportPresets:()=>{let t=new Blob([JSON.stringify(H,null,2)],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(t),e.download="eye-candy-presets.json",e.click()},importPresets:()=>d("#importIn").click(),touchpad:async()=>{let t=await q.request();T("\u25C9",t?"Touchpad on \u2014 swipe to stir the visuals":"No PlayStation controller found"),d("#tpChip").classList.toggle("hidden",t)}};document.addEventListener("click",t=>{let e=t.target.closest("[data-act]");if(!e)return;c.resume();let a=Pa[e.dataset.act];a&&a()});function Tt(){we||(c.el.pause(),c.stopStream(),c.mode="demo",we=Nt(c),c.resume(),na(),T("\u2726","Demo groove"))}function ye(){we&&(we(),we=null,c.mode==="demo"&&(c.mode="player"))}async function Pt(){if(N&&N.setFullscreen){N.setFullscreen(!await N.isFullscreen());return}document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{})}function pe(t){Bt(),d("#controls").classList.toggle("hidden",!t)}var wa=/\.(mp3|flac|wav|ogg|oga|m4a|aac|opus|webm|wma|aiff?)$/i,ka=t=>({name:t.name.replace(/\.[^.]+$/,""),url:URL.createObjectURL(t),path:N?N.pathFor(t):null});function wt(t){let e=[...t].filter(a=>wa.test(a.name)||(a.type||"").startsWith("audio/")).sort((a,i)=>(a.webkitRelativePath||a.name).localeCompare(i.webkitRelativePath||i.name,void 0,{numeric:!0}));if(!e.length)return T("\u26A0","No audio files found");ye(),c.addTracks(e.map(ka)),Re(),kt(),T("\u266B",`Added ${e.length} track${e.length>1?"s":""}`)}d("#fileIn").onchange=t=>{wt(t.target.files),t.target.value=""};d("#folderIn").onchange=t=>{wt(t.target.files),t.target.value=""};d("#importIn").onchange=async t=>{try{let e=JSON.parse(await t.target.files[0].text()),a=(Array.isArray(e)?e:[e]).filter(i=>i&&i.engine);a.forEach(i=>{i.id="user-"+Math.random().toString(36).slice(2),i.builtin=!1}),H.push(...a),Me(H),K(),T("\u2605",`Imported ${a.length} presets`)}catch{T("\u26A0","Could not read that file")}t.target.value=""};window.addEventListener("dragover",t=>t.preventDefault());window.addEventListener("drop",async t=>{t.preventDefault(),c.resume();let e=[...t.dataTransfer.items||[]],a=[],i=s=>new Promise(l=>{if(s.isFile)s.file(m=>{a.push(m),l()},l);else if(s.isDirectory){let m=s.createReader(),h=[],x=()=>m.readEntries(async b=>{if(b.length)h.push(...b),x();else{for(let k of h)await i(k);l()}},l);x()}else l()}),r=e.map(s=>s.webkitGetAsEntry&&s.webkitGetAsEntry()).filter(Boolean);if(r.length)for(let s of r)await i(s);else a.push(...t.dataTransfer.files);let o=a.find(s=>/\.json$/i.test(s.name));if(o&&a.length===1){d("#importIn").onchange({target:{files:[o],value:""}});return}wt(a)});function Ma(t){return"app://eye/media/"+encodeURIComponent(t)}function kt(){N&&localStorage.setItem("eyecandy.playlist",JSON.stringify(c.playlist.filter(t=>t.path).map(t=>({name:t.name,path:t.path}))))}function Sa(){if(N)try{let t=JSON.parse(localStorage.getItem("eyecandy.playlist")||"[]");c.playlist.push(...t.map(e=>({...e,url:Ma(e.path)})))}catch{}}var Xt=t=>isFinite(t)?`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,"0")}`:"0:00";function $e(){let t=d("#playlist");c.playlist.length?t.innerHTML=c.playlist.map((e,a)=>`<li data-i="${a}" class="${a===c.index&&c.mode==="player"?"cur":""}"><span class="n">${a+1}</span><span class="t">${le(e.name)}</span><button class="x" data-x="${a}">\u2715</button></li>`).join(""):t.innerHTML='<li class="empty">Drop songs or folders here<br><small>mp3 \xB7 flac \xB7 wav \xB7 ogg \xB7 m4a</small></li>',d("#shuffleBtn").classList.toggle("on",c.shuffle),d("#repeatBtn").textContent={all:"\u21BB Repeat all",one:"\u21BB Repeat one",off:"\u2192 No repeat"}[c.repeat],d("#repeatBtn").classList.toggle("on",c.repeat!=="off"),na()}d("#playlist").addEventListener("click",t=>{let e=t.target.closest("[data-x]");if(e){c.remove(+e.dataset.x),kt();return}let a=t.target.closest("li[data-i]");a&&(ye(),c.play(+a.dataset.i))});function na(){let t=c.current,e=c.mode;d("#npTitle").textContent=e==="loopback"?"PC audio":e==="mic"?"Microphone":e==="demo"?"Demo groove":t?t.name:"Nothing playing",d("#npSub").textContent=e==="player"?t?`Track ${c.index+1} of ${c.playlist.length}`:"Drop music anywhere":"Live input",d("#playBtn").textContent=e==="player"&&!c.el.paused?"\u275A\u275A":"\u25B6";for(let[a,i]of[["#srcPlayer","player"],["#srcLoop","loopback"],["#srcMic","mic"],["#srcDemo","demo"]])d(a).classList.toggle("on",e===i)}c.onchange=$e;var Ye=d("#seek"),Mt=!1;Ye.addEventListener("input",()=>{Mt=!0});Ye.addEventListener("change",()=>{isFinite(c.el.duration)&&(c.el.currentTime=Ye.value/1e3*c.el.duration),Mt=!1});d("#vol").value=Math.round(f.volume*100);d("#vol").addEventListener("input",t=>{f.volume=t.target.value/100,c.out.gain.value=f.volume,me()});setInterval(()=>{let t=c.el;!Mt&&isFinite(t.duration)&&(Ye.value=t.currentTime/t.duration*1e3),d("#tCur").textContent=Xt(t.currentTime),d("#tDur").textContent=Xt(t.duration)},250);var lt=new Map;function Ba(t){if(t.engine==="milk"){let o=0;for(let s of t.name)o=(o*31+s.charCodeAt(0))%360;return`linear-gradient(90deg,hsl(${o},90%,55%),hsl(${(o+80)%360},90%,50%),hsl(${(o+160)%360},90%,55%))`}let e=JSON.stringify(t.palette);if(lt.has(e))return lt.get(e);let a=Ue(t.palette),i=[];for(let o=0;o<=4;o++){let s=o/4,l=[0,1,2].map(m=>Math.round(255*_(a.a[m]+a.b[m]*Math.cos(6.2831853*(a.c[m]*s+a.d[m])),0,1)));i.push(`rgb(${l})`)}let r=`linear-gradient(90deg,${i.join(",")})`;return lt.set(e,r),r}function K(){let t=d("#search").value.trim().toLowerCase(),e=ht(de),a=d("#presetList");if(de==="milk"&&!G){a.innerHTML='<li class="msg">Loading MilkDrop library\u2026</li>',ve().then(K);return}if(de==="user"&&!e.length){a.innerHTML=`<li class="msg">No saved presets yet.<br>Press \u2605 Save (or ${v.label("Y")} on the controller) to keep the current look.</li>`;return}let i=[];for(let o=0;o<e.length;o++){let s=e[o];if(t&&!s.name.toLowerCase().includes(t))continue;let l=s.engine==="milk"?"MilkDrop":ne[s.scene]?.name||"";if(i.push(`<li data-i="${o}" class="${s.id===u.id?"cur":""}"><span class="sw" style="background:${Ba(s)}"></span><span class="nm">${le(s.name)}</span><span class="s">${le(l)}</span></li>`),i.length>1500)break}a.innerHTML=i.join("");let r=a.querySelector(".cur");r&&!a.matches(":hover")&&r.scrollIntoView({block:"nearest"})}d("#presetList").addEventListener("click",t=>{let e=t.target.closest("li[data-i]");e&&(j=+e.dataset.i,V(ht(de)[j]))});d("#search").addEventListener("input",K);Pe(".cbtn").forEach(t=>t.onclick=()=>{Pe(".cbtn").forEach(e=>e.classList.toggle("on",e===t)),de=t.dataset.coll,j=-1,K()});Pe(".tab").forEach(t=>t.onclick=()=>{Pe(".tab").forEach(e=>e.classList.toggle("on",e===t)),Pe(".tabpage").forEach(e=>e.classList.toggle("on",e.id==="tab-"+t.dataset.tab)),t.dataset.tab==="tweak"&&Z()});var $t=[["trail","Tracers",0,.97],["zoom","Tunnel Zoom",.96,1.06],["spin","Spin",-.03,.03],["warp","Warp",0,2],["breathe","Breathing",0,2],["melt","Melt",0,2],["hueDrift","Color Drift",-.05,.05],["hueSpin","Hue Cycle",-.3,.3],["kaleido","Kaleidoscope",0,16,1],["kaleidoSpin","Kaleido Spin",-1,1],["mirror","Mirror",0,1,1],["fusion","MilkDrop Fusion",0,1],["react","Audio Reactivity",0,2.5],["speed","Speed",0,3],["chroma","Chromatic",0,3],["bloom","Bloom",0,2],["exposure","Exposure",.4,2],["saturation","Saturation",0,2],["contrast","Contrast",.6,1.6],["grain","Film Grain",0,1],["vignette","Vignette",0,1.5],["#","Music motion"],["dance","Shape Dance",0,2.5],["ripple","Beat Ripples",0,2.5],["punch","Bass Punch",0,2.5],["shake","Beat Shake",0,2.5],["swirlA","Audio Swirl",0,2.5],["bulgeA","Bass Bulge",0,2.5]];d("#sceneSel").innerHTML=ie.map(t=>`<option value="${t.id}">${t.name}</option>`).join("")+'<option value="__milk">MilkDrop engine</option>';d("#palSel").innerHTML=X.map((t,e)=>`<option value="${e}">${t.name}</option>`).join("")+'<option value="custom">Custom (generated)</option>';function Yt(t,e,a,i,r,o,s){let l=document.createElement("div");l.className="sl "+(o||"");let m=r||(a-e)/400;l.innerHTML=`<span title="${le(t)}">${le(t)}</span><input type="range" min="${e}" max="${a}" step="${m}" value="${i}"><span class="v"></span>`;let h=l.querySelector("input"),x=l.querySelector(".v"),b=()=>x.textContent=(+h.value).toFixed(r===1?0:2);return b(),h.addEventListener("input",()=>{b(),s(+h.value),xe()}),l._set=k=>{document.activeElement!==h&&(h.value=k,b())},l}var ct={},ut=[];function Z(){if(!d("#tab-tweak").classList.contains("on"))return;d("#pName").value=u.name,d("#sceneSel").value=u.engine==="milk"?"__milk":u.scene,d("#palSel").value=typeof u.palette=="number"?String(u.palette):"custom",d("#milkRow").classList.toggle("hidden",!(u.engine==="milk"||u.fx.fusion>0)),G&&d("#milkSel").options.length!==ke.length&&(d("#milkSel").innerHTML=ke.map(o=>`<option>${le(o)}</option>`).join("")),G&&(d("#milkSel").value=u.engine==="milk"?u.milk:he||"");let t=d("#paramSliders"),e=ne[u.scene],a=u.engine+":"+u.scene;t._key!==a?(t._key=a,t.innerHTML="",ut=[],u.engine==="scene"&&e?(e.params.forEach((o,s)=>{let l=Yt(o.n,o.min,o.max,u.params[s],0,(e.stick||[]).includes(s)?"stick":"",m=>{u.params[s]=m});ut.push(l),t.appendChild(l)}),d("#stickNames").textContent=(e.stick||[0,1]).map(o=>e.params[o].n).join(" & ")):(t.innerHTML='<p class="fine">MilkDrop presets carry their own math \u2014 shape them with the Trip FX below, the triggers, and the kaleidoscope.</p>',d("#stickNames").textContent="\u2014")):ut.forEach((o,s)=>o._set(u.params[s]));let i=d("#fxSliders");i.children.length?$t.forEach(([o])=>{ct[o]&&ct[o]._set(u.fx[o]??J[o]??0)}):$t.forEach(([o,s,l,m,h])=>{if(o==="#"){let b=document.createElement("h3");b.textContent=s,i.appendChild(b);return}let x=Yt(s,l,m,u.fx[o]??0,h,"",b=>{u.fx[o]=b,o==="fusion"&&b>0&&ve().then(()=>{he||Be(We()),d("#milkRow").classList.remove("hidden"),Z()})});ct[o]=x,i.appendChild(x)});let r=H.some(o=>o.id===u.id);d("#overwriteBtn").classList.toggle("hidden",!r),d("#deleteBtn").classList.toggle("hidden",!r)}d("#pName").addEventListener("change",t=>{u.name=t.target.value,d("#presetName").textContent=u.name});d("#sceneSel").addEventListener("change",t=>{let e=t.target.value;if(e==="__milk"){ve().then(()=>V(pt(he||We())));return}let a=ne[e];V({...u,id:"edit-"+Date.now(),engine:"scene",scene:e,params:a.params.map(i=>i.def),name:a.name+" (custom)",builtin:!1},{quiet:!0})});d("#palSel").addEventListener("change",t=>{t.target.value!=="custom"&&(u.palette=+t.target.value)});d("#milkSel").addEventListener("change",t=>{let e=t.target.value;u.engine==="milk"?(u.milk=e,u.name=e,d("#presetName").textContent=e):u.milk=e,Be(e)});var Ra=[["#","Display"],["resolution","Output resolution","select",{native:"Native (match screen)",2160:"4K \xB7 2160p",1440:"1440p",1080:"1080p",900:"900p",720:"720p",540:"540p (potato mode)"}],["renderScale","Render scale","select",{auto:"Auto (adaptive)","0.5":"50%","0.67":"67%","0.75":"75%","0.85":"85%",1:"100%","1.25":"125% \xB7 supersampled","1.5":"150% \xB7 supersampled",2:"200% \xB7 supersampled"}],["fpsCap","Frame rate cap","select",{0:"Unlimited (VSync)",144:"144 fps",120:"120 fps",60:"60 fps",30:"30 fps"}],["autoExposure","Auto exposure","toggle","Keeps every preset from blowing out to white (or sinking to black)"],["startFullscreen","Start in fullscreen","toggle","Open straight into fullscreen next launch"],["uiScale","Interface size","range",[.75,1.5,.05,"\xD7"]],["uiAutoHide","Auto-hide interface","toggle","Panels fade away when you are not using the mouse"],["showFps","Show FPS & resolution","toggle",""],["#","Music reaction"],["reactIntensity","Reaction intensity","range",[0,3,.05,"\xD7"]],["idleDance","Music dance","toggle","Shapes, lens and camera always move with the music \u2014 your controller adds on top"],["beatRipples","Beat ripples","toggle","Every kick sends a shockwave through the image"],["beatPulse","Bass punch","range",[0,2,.05,"\xD7"]],["beatFlash","Drop flashes","range",[0,1,.05,""]],["cameraShake","Beat shake","range",[0,1.5,.05,""]],["beatSens","Beat sensitivity","range",[0,2,.05,""]],["gainBass","Bass gain","range",[0,3,.05,"\xD7"]],["gainMid","Mid gain","range",[0,3,.05,"\xD7"]],["gainHigh","Treble gain","range",[0,3,.05,"\xD7"]],["outputDevice","Audio output","select",{default:"System default"}],["#","Autopilot"],["autopilot","Autopilot","toggle","Keeps changing presets on its own, even while you play"],["autoPause","Pause autopilot while I play","toggle","Hold the current preset while you are using the controller"],["autoInterval","Time per preset","range",[8,120,1,"s"]],["autoSource","Autopilot plays","select",{mix:"Everything mixed",eye:"Eye Candy presets",generate:"Fresh generated presets",milk:"MilkDrop library",user:"My presets",all:"Eye Candy + MilkDrop"}],["autoOnDrop","Switch on drops","toggle","Jump to a new preset when the beat drops"],["idle","Resume after I stop playing","range",[3,120,1,"s"]],["transition","Transition length","range",[.2,4,.1,"s"]],["#","Controller"],["stickSens","Stick sensitivity","range",[.3,2.5,.05,"\xD7"]],["invertY","Invert Y axis","toggle",""],["deadzone","Stick deadzone","range",[0,.4,.01,""]],["rumble","Rumble","toggle","Feel the bass in your hands"],["rumbleStrength","Rumble strength","range",[0,1,.05,""]],["touchMode","PS touchpad / right-drag","select",{both:"Vortex + paint light",vortex:"Vortex only",paint:"Paint light only",off:"Off"}],["@touchpad"]],ge={deadzone:t=>v.deadzone=t,uiScale:t=>fe.setProperty("--ui",t),outputDevice:t=>c.setOutput(t).then(e=>T("\u{1F508}",e?"Audio output changed":"Could not switch output")),renderScale:()=>{re=.8},autopilot:t=>d("#autoBtn").classList.toggle("on",t)};async function Ca(t){try{(await navigator.mediaDevices.enumerateDevices()).filter(a=>a.kind==="audiooutput"&&a.deviceId!=="default").forEach(a=>{let i=document.createElement("option");i.value=a.deviceId,i.textContent=a.label||"Output "+a.deviceId.slice(0,5),t.appendChild(i)}),t.value=f.outputDevice}catch{}}function St(){let t=d("#settingsForm");t.innerHTML="";for(let[e,a,i,r]of Ra){if(e==="#"){let s=document.createElement("h3");s.className="sethead",s.textContent=a,t.appendChild(s);continue}let o=document.createElement("div");if(o.className="set",e==="@touchpad"){o.innerHTML=`<div>PS touchpad<div class="d" id="tpStatus">${le(q.status)}</div></div><button class="mini" id="tpBtn">${q.connected?"Reconnect":"Connect"}</button>`,o.querySelector("#tpBtn").onclick=async()=>{let s=await q.request();T("\u25C9",s?"Touchpad connected \u2014 swipe to stir the visuals":"No PlayStation controller found")},t.appendChild(o);continue}if(i==="toggle")o.innerHTML=`<div>${a}<div class="d">${r}</div></div><div class="toggle ${f[e]?"on":""}"></div>`,o.querySelector(".toggle").onclick=s=>{f[e]=!f[e],s.target.classList.toggle("on",f[e]),me(),ge[e]&&ge[e](f[e])};else if(i==="select"){o.innerHTML=`<div>${a}</div><select>${Object.entries(r).map(([l,m])=>`<option value="${l}" ${String(f[e])===l?"selected":""}>${m}</option>`).join("")}</select>`;let s=o.querySelector("select");e==="outputDevice"&&Ca(s),s.onchange=l=>{f[e]=l.target.value,me(),ge[e]&&ge[e](f[e])}}else{let[s,l,m,h]=r;o.innerHTML=`<div>${a} <span class="d">${f[e]}${h}</span></div><input type="range" min="${s}" max="${l}" step="${m}" value="${f[e]}">`,o.querySelector("input").oninput=x=>{f[e]=+x.target.value,o.querySelector(".d").textContent=f[e]+h,me(),ge[e]&&ge[e](f[e])}}t.appendChild(o)}}q.onstatus=t=>{let e=document.getElementById("tpStatus");e&&(e.textContent=t),q.connected&&T("\u25C9",t)};function Bt(){let t=a=>`<span class="k">${v.label(a)}</span>`,e=[["Left stick","Steer","Fly the camera / drag the trails"],["Right stick","Morph","Bend the two \u25C9 shape params live"],[t("LT"),"Warp","Squeeze into infinite feedback tunnels"],[t("RT"),"Drive","Overdrive audio reaction, bloom & speed"],[t("LT")+"+"+t("RT"),"Hyperdrive","Both triggers fully \u2014 hold on"],[t("LB"),"Kaleidoscope","Tap to cycle \xB7 hold for mirror world"],[t("RB"),"Palette","Tap next colors \xB7 hold to spin hues"],["\u25C0 \u25B6","Presets","Previous / next look"],["\u25B2 \u25BC","Time","Speed up, slow down, even reverse"],[t("A"),"Burst","Shockwave + flash. Hit it on the beat"],[t("B"),"Freeze","Hold to stop time while trails melt on"],[t("X"),"Randomize","Tap remix \xB7 hold for a brand-new preset"],[t("Y"),"Save","Keep this exact look in My Presets"],[t("L3"),"Reset view","Click left stick"],[t("R3"),"Lock shape","Click right stick to keep the morph"],[t("START"),"Menu","Show / hide the panels"],[t("BACK"),"This guide","Hold to toggle autopilot"],["Touchpad","Stir (PS)","Swipe to swirl & paint \xB7 pinch/twist \xB7 click = Music dance on/off"]];d("#cgrid").innerHTML=e.map(([a,i,r])=>`<div class="cg"><span class="k">${a.startsWith("<")?a.replace(/<\/?span[^>]*>/g,""):a}</span><div><b>${i}</b><small>${r}</small></div></div>`).join(""),Pe("[data-g]").forEach(a=>a.textContent=v.label(a.dataset.g))}d("#controls").addEventListener("click",t=>{t.target.id==="controls"&&pe(!1)});window.addEventListener("keydown",t=>{if(t.target.matches("input,select,textarea"))return;xe(),c.resume();let e=t.key;e==="ArrowRight"?se(1):e==="ArrowLeft"?se(-1):e==="ArrowUp"?Ve(1):e==="ArrowDown"?Ve(-1):e===" "?(t.preventDefault(),Ae(1)):e==="r"||e==="R"?xt():e==="g"||e==="G"?gt():e==="s"||e==="S"?je():e==="k"||e==="K"?Qt():e==="m"||e==="M"?ea():e==="p"||e==="P"?Jt(1):e==="f"||e==="F"||e==="F11"?(t.preventDefault(),Pt()):e==="h"||e==="H"?(n.cinema=!n.cinema,n.cinema?Ke():yt(),T("H",n.cinema?"Interface hidden (H to show)":"Interface on")):e==="Tab"?(t.preventDefault(),ia()):e==="a"||e==="A"?bt(!f.autopilot):e==="c"||e==="C"?pe(d("#controls").classList.contains("hidden")):e==="Escape"?pe(!1):e==="MediaPlayPause"?c.toggle():e==="MediaTrackNext"?c.next():e==="MediaTrackPrevious"&&c.prev()});var Te=null;ee.addEventListener("contextmenu",t=>t.preventDefault());ee.addEventListener("pointerdown",t=>{if(t.button===2){ae.active=!0,ae.x=t.clientX/innerWidth,ae.y=t.clientY/innerHeight;return}if(t.button===1){Ae(1,(t.clientX/innerWidth-.5)*innerWidth/innerHeight,.5-t.clientY/innerHeight);return}Te={x:t.clientX,y:t.clientY},xe()});window.addEventListener("pointerup",t=>{t.button===2&&(ae.active=!1)});window.addEventListener("pointermove",t=>{ae.active&&(ae.x=t.clientX/innerWidth,ae.y=t.clientY/innerHeight)});window.addEventListener("pointerup",()=>Te=null);window.addEventListener("pointermove",t=>{Te&&(n.camX+=(t.clientX-Te.x)*.004,n.camY=_(n.camY+(t.clientY-Te.y)*.003,-1.3,1.3),Te={x:t.clientX,y:t.clientY},xe())});ee.addEventListener("wheel",t=>{u.fx.trail=_(u.fx.trail-t.deltaY*8e-4,0,.97),dt("LT","Tracers",u.fx.trail/.97),xe(),Z()},{passive:!0});ee.addEventListener("dblclick",Pt);fe.setProperty("--ui",f.uiScale);N&&f.startFullscreen&&N.setFullscreen&&N.setFullscreen(!0);f.outputDevice!=="default"&&c.setOutput(f.outputDevice);q.autoConnect();N||document.querySelectorAll("[data-act=loopback]").forEach(t=>{t.innerHTML=t.classList.contains("src")?"Tab/PC":"\u{1F50A} Visualize a tab or PC audio",t.title="Pick a tab (e.g. YouTube/Spotify web) or your whole screen and tick \u201CShare audio\u201D"});Sa();$e();St();K();Bt();d("#autoBtn").classList.toggle("on",f.autopilot);d("#presetName").textContent=u.name;j=Math.floor(Math.random()*Q.length);V(Q[j],{transition:!1,quiet:!0});var ft=ie.map(t=>t.id),mt=0;(function t(){if(mt>=ft.length){d("#loadbar").style.opacity=0;return}L.sceneProg(ft[mt++]),d("#loadbar div").style.width=mt/ft.length*100+"%",setTimeout(t,0)})();requestAnimationFrame(aa);window.__eye={startDemoGroove:Tt,R:L,audio:c,L:n,get cur(){return u},loadPreset:V,BUILTIN:Q,SCENES:ie,settings:f};})();
