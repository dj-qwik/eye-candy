(()=>{var it=`#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime, uBass, uMid, uHigh, uVol, uBeat, uDrive, uBurst, uHue, uBeatCount, uSinceBeat, uBeatInt;
uniform sampler2D uAudio, uSelf;
uniform float uFlowA, uFlowB, uFlowMix, uWaveA, uWaveB, uWaveMix, uMapT;
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
`,nt=[],E=a=>nt.push(a);E({fly:!0,id:"cathedral",name:"Fractal Cathedral",params:[{n:"Fold",min:.2,max:1.6,def:.85},{n:"Twist",min:0,max:1.5,def:.45},{n:"Scale",min:1.25,max:1.75,def:1.48},{n:"Glow",min:0,max:3,def:1.2},{n:"Flight",min:0,max:3,def:1},{n:"Tunnel",min:.2,max:1.4,def:.6},{n:"Pulse",min:0,max:2,def:1},{n:"Color Spread",min:0,max:2,def:.6}],stick:[0,1],code:`
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
}`});E({id:"flux",name:"Flux",selfFeedback:!0,params:[{n:"Wave Size",min:.3,max:2,def:1},{n:"Wave Glow",min:.3,max:3,def:1},{n:"Flow Strength",min:0,max:3,def:1},{n:"Persistence",min:.8,max:.995,def:.965},{n:"Morph Time",min:4,max:40,def:14},{n:"Colour Flow",min:0,max:3,def:1},{n:"Map Spread",min:.2,max:3,def:1},{n:"Beat Sparks",min:0,max:2,def:1}],stick:[2,0],code:`
float ln(float d, float w){ return w*w/(d*d+w*w); }
vec2 flowF(float k, vec2 p, float t){
  float r=length(p), a=atan(p.y,p.x), s=P2;
  if(k<.5) return p*(1.-.022*s);
  if(k<1.5) return p*(1.+.018*s);
  if(k<2.5) return rot(.035*s*(1.25-min(r,1.25)))*p*(1.-.007*s);
  if(k<3.5){ vec2 c1=vec2(.38*cos(t*.3),.26*sin(t*.41)), c2=-c1; vec2 q=c1+rot(.06*s*exp(-length(p-c1)*3.))*(p-c1); q=c2+rot(-.06*s*exp(-length(q-c2)*3.))*(q-c2); return q*(1.-.004*s); }
  if(k<4.5) return p*(1.-.02*s*sin(r*16.-t*3.));
  if(k<5.5) return rot(.022*s)*p*(1.-.013*s);
  if(k<6.5) return p+vec2(sin(p.y*6.+t)*.004,.008)*s;
  if(k<7.5){ float nr=r*(1.-.014*s), na=a+.035*s/(r+.3); return nr*vec2(cos(na),sin(na)); }
  if(k<8.5){ float e=.01; vec2 q=p*2.4+t*.08; float n=fbm(q), nx=fbm(q+vec2(e,0)), ny=fbm(q+vec2(0,e)); return p+vec2(ny-n,-(nx-n))*1.3*s; }
  if(k<9.5) return p*(1.-.04*s*uBass);
  return p*(1.-.012*s*(1.+cos(a*6.+t)));
}
float waveF(float k, vec2 p, float t){
  float r=length(p), a=atan(p.y,p.x), S=P0, w=.0042*P1;
  if(k<.5){ float R=.3*S+wav(a/TAU+.5)*.1*S*(1.+uBass); return ln(r-R,w); }
  if(k<1.5){ float y=wav(p.x*.45+.5)*.22*S; return ln(p.y-y,w)*smoothstep(1.1,.6,abs(p.x)); }
  if(k<2.5){ float f=fft(abs(a)/PI*.8+.02); return ln(r-(.1+f*.45*S),w*1.3); }
  if(k<3.5){ float d=1e9; vec2 pr=vec2(wav(0.),wav(.13))*.5*S; for(int i=1;i<56;i++){ float q=float(i)/55.; vec2 c=vec2(wav(q*.5),wav(q*.5+.13))*.5*S; d=min(d,sdSeg(p,pr,c)); pr=c; } return ln(d,w); }
  if(k<4.5){ float g=.09*S; float v=fract((r-a/TAU*g)/g-t*.15); return ln((abs(v-.5)-.46)*g,w)*(.2+fft(clamp(r,0.,1.))*.9)*smoothstep(.8,.3,r); }
  if(k<5.5){ float sg=floor((a/TAU+.5)*56.), ac=(sg+.5)/56.*TAU-PI; float f=fft(sg/56.*.9); vec2 dir=vec2(cos(ac),sin(ac)); return ln(sdSeg(p,dir*.2*S,dir*(.2+f*.45)*S),w*1.1)*.7; }
  if(k<6.5){ float n=5.+floor(uBass*2.); float R=.28*S*(1.+.3*cos(a*n+t))*(1.+uBass*.25); return ln(r-R,w); }
  if(k<7.5){ float v=0.; for(int i=0;i<12;i++){ float fi=float(i); vec2 c=rot(t*(.6+fi*.13)+fi)*vec2(.1+fft(fi/12.)*.45*S,0.); v+=ln(length(p-c),.008)*.9; } return v; }
  if(k<8.5){ float e=fft(clamp(abs(p.x)*.6,0.,1.)); float y1=sin(p.x*7.+t*2.)*.18*S*(.5+e), y2=-y1; return (ln(p.y-y1,w)+ln(p.y-y2,w))*smoothstep(1.1,.5,abs(p.x)); }
  if(k<9.5){ float v=0.; for(int i=0;i<24;i++){ float fi=float(i); float an=h11(fi+uBeatCount*7.)*TAU; vec2 c=vec2(cos(an),sin(an))*uSinceBeat*(.5+h11(fi*3.1)*.7)*S; v+=ln(length(p-c),.006)*exp(-uSinceBeat*2.); } return v*P7; }
  if(k<10.5){ float x=abs(p.x)-.45*S; float y=wav(p.y*.4+.5)*.12*S; return ln(x-y,w)*smoothstep(.6,.3,abs(p.y)); }
  float tri=0.; for(int i=0;i<3;i++){ vec2 a1=rot(float(i)*TAU/3.+t*.2)*vec2(0.,.35*S), b1=rot(float(i+1)*TAU/3.+t*.2)*vec2(0.,.35*S); tri+=ln(sdSeg(p,a1,b1)-wav(float(i)/3.)*.03,w); } return tri;
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=fc/uRes, asp=vec2(uRes.x/uRes.y,1.);
  vec2 p=(uv-.5)*asp;
  vec2 q=mix(flowF(uFlowA,p,uTime), flowF(uFlowB,p,uTime), uFlowMix);
  float prev=texture(uSelf, q/asp+.5).r;
  float wv=mix(waveF(uWaveA,p,uTime), waveF(uWaveB,p,uTime), uWaveMix);
  wv*=.5+uVol*.7+uBeat*.4;
  if(uBeat>.6) wv+=waveF(9.,p,uTime)*.6*P7;
  float v=min(max(prev*P3-.01,0.)+wv*.42, 3.);
  c=vec4(v,0,0,1);
}`,map:`
void mainImage(out vec4 c, in vec2 fc){
  float i=texture(uSelf, fc/uRes).r;
  float m=i*.35*P6+uMapT;
  vec3 col=pal(m)*(1.-exp(-i*1.5))*smoothstep(.015,.2,i);
  col+=pal(m+.5)*max(i-1.6,0.)*.12;
  c=vec4(col,1);
}`});var K=nt,oe=Object.fromEntries(nt.map(a=>[a.id,a])),ee=`#version 300 es
in vec2 aPos; void main(){ gl_Position=vec4(aPos,0,1); }`,qt=`#version 300 es
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
}`,Ht=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes; out vec4 fragColor;
void main(){ vec2 uv=gl_FragCoord.xy/uRes; vec3 c=texture(uTex,uv).rgb; float l=max(c.r,max(c.g,c.b)); fragColor=vec4(c*smoothstep(.75,1.5,l),1); }`,_t=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes, uDir; out vec4 fragColor;
void main(){ vec2 uv=gl_FragCoord.xy/uRes; vec2 o=uDir/uRes; vec3 c=texture(uTex,uv).rgb*.227;
  c+=(texture(uTex,uv+o*1.38).rgb+texture(uTex,uv-o*1.38).rgb)*.316;
  c+=(texture(uTex,uv+o*3.23).rgb+texture(uTex,uv-o*3.23).rgb)*.07; fragColor=vec4(c,1); }`,Nt=`#version 300 es
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
}`,Gt=`#version 300 es
precision highp float; uniform sampler2D uSmall, uPrev; uniform float uRate; out vec4 fragColor;
void main(){ vec3 c=textureLod(uSmall, vec2(.5), 10.).rgb; float l=mix(dot(c,vec3(.3,.59,.11)), max(c.r,max(c.g,c.b)), .55); float pl=texture(uPrev, vec2(.5)).r; fragColor=vec4(mix(pl,l,uRate),0,0,1); }`,Ot=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes; out vec4 fragColor;
void main(){ fragColor=texture(uTex, gl_FragCoord.xy/uRes); }`;var Ue=class{constructor(e){this.canvas=e;let t=this.gl=e.getContext("webgl2",{antialias:!1,alpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"});if(!t)throw new Error("WebGL2 is not available on this system.");this.halfFloat=!!t.getExtension("EXT_color_buffer_float"),t.getExtension("OES_texture_float_linear");let i=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,i),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),this.progs={},this.errors={},this.post={feedback:this.program(ee,qt),bright:this.program(ee,Ht),blur:this.program(ee,_t),final:this.program(ee,Nt),blit:this.program(ee,Ot),adapt:this.program(ee,Gt)},this.audioTex=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.audioTex),t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.texImage2D(t.TEXTURE_2D,0,t.R8,512,2,0,t.RED,t.UNSIGNED_BYTE,null),this.texParams(t.LINEAR,t.CLAMP_TO_EDGE),this.milkTex=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.milkTex),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,0,255])),this.texParams(t.LINEAR,t.CLAMP_TO_EDGE),this.scale=.75,this.fbIdx=0,this.finIdx=0,this.lumSmall=this.makeTarget(64,36),t.bindTexture(t.TEXTURE_2D,this.lumSmall.tex),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR_MIPMAP_LINEAR),t.generateMipmap(t.TEXTURE_2D),this.adapt=[this.makeTarget(1,1),this.makeTarget(1,1)],this.adIdx=0,this.W=0,this.H=0}texParams(e,t){let i=this.gl;i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,e),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,e),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,t),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,t)}shader(e,t){let i=this.gl,r=i.createShader(e);if(i.shaderSource(r,t),i.compileShader(r),!i.getShaderParameter(r,i.COMPILE_STATUS)){let o=i.getShaderInfoLog(r);throw i.deleteShader(r),new Error(o)}return r}program(e,t){let i=this.gl,r=i.createProgram();if(i.attachShader(r,this.shader(i.VERTEX_SHADER,e)),i.attachShader(r,this.shader(i.FRAGMENT_SHADER,t)),i.bindAttribLocation(r,0,"aPos"),i.linkProgram(r),!i.getProgramParameter(r,i.LINK_STATUS))throw new Error(i.getProgramInfoLog(r));let o={},s=i.getProgramParameter(r,i.ACTIVE_UNIFORMS);for(let l=0;l<s;l++){let f=i.getActiveUniform(r,l);o[f.name.replace(/\[0\]$/,"")]=i.getUniformLocation(r,f.name)}return{p:r,u:o}}sceneProg(e){if(this.progs[e])return this.progs[e];let t=K.find(i=>i.id===e);try{this.progs[e]=this.program(ee,it+t.code)}catch(i){this.errors[e]=String(i),console.error("Scene",e,i),this.progs[e]=null}return this.progs[e]}mapProg(e){let t=e+":map";if(this.progs[t]!==void 0)return this.progs[t];let i=K.find(r=>r.id===e);try{this.progs[t]=this.program(ee,it+i.map)}catch(r){this.errors[t]=String(r),console.error("Map",e,r),this.progs[t]=null}return this.progs[t]}precompile(e,t){let i=0,r=()=>{if(i>=e.length)return t&&t();this.sceneProg(e[i++]),setTimeout(r,0)};r()}makeTarget(e,t,i=!0){let r=this.gl,o=r.createTexture();r.bindTexture(r.TEXTURE_2D,o),i&&this.halfFloat?r.texImage2D(r.TEXTURE_2D,0,r.RGBA16F,e,t,0,r.RGBA,r.HALF_FLOAT,null):r.texImage2D(r.TEXTURE_2D,0,r.RGBA8,e,t,0,r.RGBA,r.UNSIGNED_BYTE,null),this.texParams(r.LINEAR,r.CLAMP_TO_EDGE);let s=r.createFramebuffer();return r.bindFramebuffer(r.FRAMEBUFFER,s),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,o,0),r.clearColor(0,0,0,1),r.clear(r.COLOR_BUFFER_BIT),{tex:o,fb:s,w:e,h:t}}freeTarget(e){e&&(this.gl.deleteTexture(e.tex),this.gl.deleteFramebuffer(e.fb))}resize(e,t,i){if(e===this.W&&t===this.H&&i===this.scaleUsed)return;let r=this.gl,o=Math.max(64,Math.round(e*i)),s=Math.max(64,Math.round(t*i)),l=[this.sceneT,...this.fb||[],...this.fin||[],this.bA,this.bB],f=this.fb;this.sceneT=this.makeTarget(o,s),this.fb=[this.makeTarget(o,s),this.makeTarget(o,s)],f&&this.drawTo(this.fb[this.fbIdx],this.post.blit,{uTex:f[this.fbIdx].tex}),!this.fin||e!==this.W||t!==this.H?((this.fin||[]).forEach(g=>this.freeTarget(g)),this.fin=[this.makeTarget(e,t,!1),this.makeTarget(e,t,!1)]):l.splice(l.indexOf(this.fin[0]),2);let d=Math.max(32,Math.round(o/4)),x=Math.max(32,Math.round(s/4));this.bA=this.makeTarget(d,x),this.bB=this.makeTarget(d,x),l.forEach(g=>{g&&!this.fin.includes(g)&&this.freeTarget(g)}),this.W=e,this.H=t,this.scaleUsed=i,this.sw=o,this.sh=s}drawTo(e,t,i,r){let o=this.gl;o.bindFramebuffer(o.FRAMEBUFFER,e?e.fb:null);let s=e?e.w:this.W,l=e?e.h:this.H;o.viewport(0,0,s,l),o.useProgram(t.p);let f=0;for(let[d,x]of Object.entries(i)){let g=t.u[d];g!=null&&(x instanceof WebGLTexture?(o.activeTexture(o.TEXTURE0+f),o.bindTexture(o.TEXTURE_2D,x),o.uniform1i(g,f++)):typeof x=="number"?o.uniform1f(g,x):x.length===2?o.uniform2fv(g,x):x.length===3?o.uniform3fv(g,x):x.length===4&&o.uniform4fv(g,x))}t.u.uRes,t.u.uRes&&o.uniform2f(t.u.uRes,s,l),o.drawArrays(o.TRIANGLES,0,3)}uploadAudio(e){let t=this.gl;t.bindTexture(t.TEXTURE_2D,this.audioTex),t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.texSubImage2D(t.TEXTURE_2D,0,0,0,512,2,t.RED,t.UNSIGNED_BYTE,e)}uploadMilk(e){let t=this.gl;t.bindTexture(t.TEXTURE_2D,this.milkTex),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!0),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1)}snapshot(){this.transTex=this.fin[this.finIdx].tex,this.finIdx^=1}frame(e){let t=this.post;if(e.engine==="scene"){let x=K.find(P=>P.id===e.scene),g=this.sceneProg(e.scene);if(g&&x&&x.selfFeedback){(!this.selfT||this.selfT[0].w!==this.sceneT.w||this.selfT[0].h!==this.sceneT.h)&&((this.selfT||[]).forEach(L=>this.freeTarget(L)),this.selfT=[this.makeTarget(this.sceneT.w,this.sceneT.h),this.makeTarget(this.sceneT.w,this.sceneT.h)],this.selfIdx=0);let P=this.selfT[this.selfIdx],y=this.selfT[this.selfIdx^1];this.drawTo(y,g,{...e.sceneU,uSelf:P.tex}),this.selfIdx^=1;let k=this.mapProg(e.scene);k&&this.drawTo(this.sceneT,k,{...e.sceneU,uSelf:y.tex})}else g&&this.drawTo(this.sceneT,g,e.sceneU)}let i=e.engine==="milk"?this.milkTex:this.sceneT.tex,r=this.fb[this.fbIdx],o=this.fb[this.fbIdx^1];this.drawTo(o,t.feedback,{...e.fbU,uScene:i,uPrev:r.tex,uMilk:this.milkTex}),this.fbIdx^=1,this.drawTo(this.bA,t.bright,{uTex:o.tex});for(let x=0;x<2;x++)this.drawTo(this.bB,t.blur,{uTex:this.bA.tex,uDir:[1+x,0]}),this.drawTo(this.bA,t.blur,{uTex:this.bB.tex,uDir:[0,1+x]});this.drawTo(this.lumSmall,t.blit,{uTex:o.tex});let s=this.gl;s.bindTexture(s.TEXTURE_2D,this.lumSmall.tex),s.generateMipmap(s.TEXTURE_2D);let l=this.adapt[this.adIdx],f=this.adapt[this.adIdx^1];this.drawTo(f,t.adapt,{uSmall:this.lumSmall.tex,uPrev:l.tex,uRate:e.adaptRate??.04}),this.adIdx^=1;let d=this.fin[this.finIdx];this.drawTo(d,t.final,{...e.finU,uTex:o.tex,uBloom:this.bA.tex,uTrans:this.transTex||o.tex,uAdapt:f.tex}),this.drawTo(null,t.blit,{uTex:d.tex})}};var qe=class{constructor(){this.ctx=new(window.AudioContext||window.webkitAudioContext)({latencyHint:"interactive"}),this.el=new Audio,this.el.crossOrigin="anonymous",this.el.preload="auto",this.elSrc=this.ctx.createMediaElementSource(this.el),this.input=this.ctx.createGain(),this.analyser=this.ctx.createAnalyser(),this.analyser.fftSize=2048,this.analyser.smoothingTimeConstant=.55,this.out=this.ctx.createGain(),this.elSrc.connect(this.input),this.input.connect(this.analyser),this.elSrc.connect(this.out),this.out.connect(this.ctx.destination),this.freq=new Uint8Array(1024),this.time=new Uint8Array(2048),this.tex=new Uint8Array(512*2),this.bass=0,this.mid=0,this.high=0,this.vol=0,this.beat=0,this.beatCount=0,this.peak={b:.2,m:.2,h:.2,v:.2},this.bassAvg=0,this.lastBeat=0,this.drop=0,this.playlist=[],this.index=-1,this.shuffle=!1,this.repeat="all",this.mode="player",this.stream=null,this.streamSrc=null,this.onchange=()=>{},this.el.addEventListener("ended",()=>this.next(!0)),this.el.addEventListener("play",()=>this.onchange()),this.el.addEventListener("pause",()=>this.onchange());let e=this.ctx.sampleRate/2;this.binMap=new Float32Array(512);for(let t=0;t<512;t++){let i=30*Math.pow(533.3333333333334,t/511);this.binMap[t]=Math.min(1023,i/e*1024)}}async setOutput(e){try{return this.ctx.setSinkId?await this.ctx.setSinkId(e==="default"?"":e):this.el.setSinkId&&await this.el.setSinkId(e),!0}catch(t){return console.warn(t),!1}}resume(){this.ctx.state!=="running"&&this.ctx.resume()}addTracks(e){let t=this.playlist.length===0;this.playlist.push(...e),t&&e.length&&this.play(0),this.onchange()}remove(e){this.playlist.splice(e,1),e<this.index?this.index--:e===this.index&&(this.index=Math.min(this.index,this.playlist.length-1),this.index>=0?this.play(this.index):this.el.pause()),this.onchange()}clear(){this.playlist=[],this.index=-1,this.el.pause(),this.el.removeAttribute("src"),this.onchange()}async play(e){if(!(e<0||e>=this.playlist.length)){this.useSource("player"),this.index=e,this.el.src=this.playlist[e].url,this.resume();try{await this.el.play()}catch(t){console.warn(t)}this.onchange()}}toggle(){if(this.resume(),this.mode!=="player"&&this.useSource("player"),this.index<0&&this.playlist.length)return this.play(0);this.el.paused?this.el.play():this.el.pause()}next(e){if(!this.playlist.length)return;if(this.repeat==="one"&&e)return this.play(this.index);let t=this.shuffle?Math.floor(Math.random()*this.playlist.length):this.index+1;if(t>=this.playlist.length){if(this.repeat==="off"&&e)return;t=0}this.play(t)}prev(){if(this.el.currentTime>3){this.el.currentTime=0;return}this.play((this.index-1+this.playlist.length)%Math.max(1,this.playlist.length))}get current(){return this.playlist[this.index]}stopStream(){this.stream&&(this.stream.getTracks().forEach(e=>e.stop()),this.stream=null),this.streamSrc&&(this.streamSrc.disconnect(),this.streamSrc=null)}useSource(e){e==="player"&&this.mode!=="player"&&(this.stopStream(),this.mode="player",this.onchange())}async useLoopback(){this.resume();let e=await navigator.mediaDevices.getDisplayMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1},video:!0,systemAudio:"include",selfBrowserSurface:"exclude"});if(e.getVideoTracks().forEach(t=>t.stop()),!e.getAudioTracks().length)throw new Error("No audio was shared \u2014 pick a tab or \u201CEntire screen\u201D and turn on \u201CShare audio\u201D.");this.attachStream(e,"loopback")}async useMic(){this.resume();let e=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});this.attachStream(e,"mic")}attachStream(e,t){this.el.pause(),this.stopStream(),this.stream=e,this.streamSrc=this.ctx.createMediaStreamSource(e),this.streamSrc.connect(this.input),this.mode=t,this.onchange()}update(e,t=1,i={}){let r=i.sens??1,o=i.gB??1,s=i.gM??1,l=i.gH??1,f=this.analyser;f.getByteFrequencyData(this.freq),f.getByteTimeDomainData(this.time);let d=this.ctx.sampleRate/2,x=this.freq,g=(B,z)=>{let U=Math.max(1,Math.floor(B/d*1024)),D=Math.max(U+1,Math.floor(z/d*1024)),Ie=0;for(let at=U;at<D;at++)Ie+=x[at];return Ie/(D-U)/255},P=g(25,160)*o,y=g(160,2200)*s,k=g(2200,12e3)*l,L=0;for(let B=0;B<2048;B+=4){let z=(this.time[B]-128)/128;L+=z*z}L=Math.sqrt(L/512);let S=this.peak,$=Math.pow(.25,e/8);S.b=Math.max(P,S.b*$,.05),S.m=Math.max(y,S.m*$,.05),S.h=Math.max(k,S.h*$,.03),S.v=Math.max(L,S.v*$,.02);let Y=(B,z,U,D)=>B+(z-B)*(1-Math.exp(-e*(z>B?U:D))),j=Math.min(2.5,t);this.bass=Y(this.bass,Math.pow(P/S.b,1.6)*j,30,8),this.mid=Y(this.mid,Math.pow(y/S.m,1.4)*j,20,6),this.high=Y(this.high,Math.pow(k/S.h,1.3)*j,25,7),this.vol=Y(this.vol,L/S.v*j,15,4),this.bassAvg=this.bassAvg+(P-this.bassAvg)*(1-Math.exp(-e*2));let b=1-Math.exp(-e*1.4);this.bMean=(this.bMean??P)+(P-(this.bMean??P))*b;let C=(P-this.bMean)*(P-this.bMean);this.bVar=(this.bVar??.001)+(C-(this.bVar??.001))*b;let w=Math.sqrt(this.bVar),M=this.bMean+(1.25-r*.4)*w+.015,R=performance.now()/1e3;this.isBeat=!1,!this.above&&P>M&&P>.1&&R-this.lastBeat>.16?(this.lastBeat=R,this.beat=1,this.beatCount++,this.isBeat=!0,this.above=!0):this.above&&P<this.bMean+.3*w&&(this.above=!1),this.beat*=Math.exp(-e*7),this.drop=this.drop*Math.exp(-e*.5)+Math.max(0,P-this.bassAvg*1.6)*e*4;for(let B=0;B<512;B++){let z=this.binMap[B],U=Math.floor(z),D=z-U,Ie=x[U]*(1-D)+x[Math.min(1023,U+1)]*D;this.tex[B]=Math.min(255,Ie*(1+B/512*.8))}for(let B=0;B<512;B++)this.tex[512+B]=this.time[B*2]}};var A={A:0,B:1,X:2,Y:3,LB:4,RB:5,LT:6,RT:7,BACK:8,START:9,L3:10,R3:11,UP:12,DOWN:13,LEFT:14,RIGHT:15,TOUCH:17},He=class{constructor(){this.prev=[],this.downAt=[],this.held=[],this.axes=[0,0,0,0],this.lt=0,this.rt=0,this.connected=!1,this.id="",this.deadzone=.14,this.style="xbox",this.lastInput=0,this.gp=null}poll(){let e=navigator.getGamepads?navigator.getGamepads():[],t=null;for(let y of e)if(y&&y.connected){t=y;break}this.hid&&this.hid.fresh&&(t=this.hid.asGamepad()),this.gp=t;let i=this.connected;if(this.connected=!!t,this.justConnected=!i&&this.connected,!t){this.pressed=[],this.released=[];return}this.id=t.id,this.style=/054c|playstation|dualsense|dualshock/i.test(t.id)||/wireless controller/i.test(t.id)&&!/xbox|xinput|045e/i.test(t.id)?"ps":"xbox";let r=performance.now();this.pressed=[],this.released=[];let o=Math.min(t.buttons.length,18);for(let y=0;y<o;y++){let k=t.buttons[y],L=typeof k=="object"?k.value:k,S=typeof k=="object"&&k.pressed||L>.5;S&&!this.prev[y]&&(this.pressed[y]=!0,this.downAt[y]=r,this.held[y]=!1,this.lastInput=r),!S&&this.prev[y]&&(this.released[y]=!0),this.prev[y]=S}let s=y=>{let k=Math.abs(y);return k<this.deadzone?0:Math.sign(y)*((k-this.deadzone)/(1-this.deadzone))},l=t.axes,f=(y,k)=>{let L=Math.hypot(y,k);if(L<this.deadzone)return[0,0];let S=(L-this.deadzone)/(1-this.deadzone)/L;return[y*S,k*S]},[d,x]=f(l[0]||0,l[1]||0),[g,P]=f(l[2]||0,l[3]||0);this.axes=[d,x,g,P],this.lt=t.buttons[6]?t.buttons[6].value:0,this.rt=t.buttons[7]?t.buttons[7].value:0,Math.abs(d)+Math.abs(x)+Math.abs(g)+Math.abs(P)+this.lt+this.rt>.05&&(this.lastInput=r)}down(e){return!!this.prev[e]}tap(e){return!!this.pressed[e]}hold(e,t){return this.prev[e]&&!this.held[e]&&performance.now()-this.downAt[e]>t?(this.held[e]=!0,!0):!1}shortRelease(e){return!!this.released[e]&&!this.held[e]}rumble(e,t,i=80){let r=this.gp;if(!(!r||!r.vibrationActuator))try{r.vibrationActuator.playEffect("dual-rumble",{duration:i,strongMagnitude:Math.min(1,e),weakMagnitude:Math.min(1,t)})}catch{}}label(e){return this.style==="ps"?{A:"\u2715",B:"\u25CB",X:"\u25A1",Y:"\u25B3",LB:"L1",RB:"R1",LT:"L2",RT:"R2",BACK:"Create",START:"Options",L3:"L3",R3:"R3"}[e]||e:{A:"A",B:"B",X:"X",Y:"Y",LB:"LB",RB:"RB",LT:"LT",RT:"RT",BACK:"View",START:"Menu",L3:"LS",R3:"RS"}[e]||e}};var X=[{name:"Acid Rainbow",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.33,.67]},{name:"Psilocybin",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[.8,.9,.3]},{name:"Synthwave",a:[.55,.3,.6],b:[.45,.3,.4],c:[1,1,1],d:[0,.15,.25]},{name:"Aurora",a:[.3,.55,.5],b:[.3,.45,.45],c:[1,1,1],d:[.55,.25,.3]},{name:"Molten Gold",a:[.6,.4,.2],b:[.4,.35,.2],c:[1,1,1],d:[0,.1,.2]},{name:"Deep Ocean",a:[.2,.4,.6],b:[.2,.35,.4],c:[1,1,1],d:[.3,.2,.1]},{name:"Toxic",a:[.4,.6,.3],b:[.4,.4,.4],c:[1,1.5,1],d:[.2,0,.5]},{name:"Candy",a:[.65,.5,.65],b:[.35,.45,.35],c:[1,1,1],d:[0,.5,.25]},{name:"Infrared",a:[.5,.2,.25],b:[.5,.3,.3],c:[1,1,1.5],d:[0,.1,.6]},{name:"Ultraviolet",a:[.45,.25,.65],b:[.45,.3,.35],c:[1,2,1],d:[.6,.1,0]},{name:"Ice Fire",a:[.5,.5,.5],b:[.5,.5,.5],c:[.5,.5,.5],d:[0,.15,.5]},{name:"Peacock",a:[.4,.5,.5],b:[.4,.4,.5],c:[2,1,1],d:[.5,.2,.25]},{name:"Sunset Dream",a:[.6,.4,.4],b:[.4,.4,.3],c:[1,1,1],d:[0,.2,.45]},{name:"Emerald Temple",a:[.25,.5,.35],b:[.25,.45,.3],c:[1,1,2],d:[.6,.3,.5]},{name:"Holographic",a:[.6,.6,.7],b:[.4,.4,.3],c:[2,2,2],d:[0,.33,.67]},{name:"Blacklight",a:[.35,.2,.55],b:[.35,.45,.45],c:[1.5,1,1],d:[.35,.7,.1]}],te={trail:.55,zoom:1.01,spin:0,warp:.3,hueDrift:0,kaleido:0,kaleidoSpin:0,mirror:0,breathe:.4,melt:0,chroma:1,bloom:.8,grain:.3,vignette:.6,exposure:1,saturation:1.1,contrast:1.05,react:1,speed:1,fusion:0,hueSpin:0,dance:1,ripple:1,punch:1,shake:1,swirlA:1,bulgeA:1};function $t(a){let e=2166136261;for(let t of a)e=Math.imul(e^t.charCodeAt(0),16777619)>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}var va={trail:[.1,.62],zoom:[.995,1.018],spin:[-.006,.006],warp:[0,1],breathe:[.1,1.2],melt:[0,.6],hueDrift:[-.01,.01],hueSpin:[-.05,.05],kaleidoSpin:[-.3,.3],chroma:[.4,1.6],bloom:[.35,.85],exposure:[.95,1.08],saturation:[1,1.4],contrast:[1,1.12],grain:[.08,.45],vignette:[.3,.95],react:[.8,1.5],speed:[.7,1.45],dance:[.4,1.9],ripple:[.3,1.7],punch:[.4,1.7],shake:[.15,1.4],swirlA:[.3,1.9],bulgeA:[.3,1.7]};function ot(a,e=te,t={}){let i=$t(a),r={...te,...e};for(let[o,[s,l]]of Object.entries(va))r[o]=+(s+i()*(l-s)).toFixed(4);return e.trail===0&&(r.trail=0),e.zoom===1&&(r.zoom=1),{...r,...t}}var h=(a,e,t,i={},r=0)=>{let o=oe[a],s=$t(e+"#shape"),l=o.params.map((d,x)=>{if(t[x]!==void 0)return t[x];let g=d.def+(s()-.5)*.16*(d.max-d.min);return+Math.max(d.min,Math.min(d.max,g)).toFixed(4)}),f=ot(e,te,i);return o.fly&&(f.trail=Math.min(f.trail,i.trail!==void 0?.3:.08+s()*.17)),o.selfFeedback&&i.trail===void 0&&(f.trail=s()*.15),{id:"eye-"+e.toLowerCase().replace(/[^a-z0-9]+/g,"-"),name:e,engine:"scene",scene:a,params:l,palette:r,fx:f,builtin:!0}};var fe=[h("cathedral","Cathedral of Echoes",[],{trail:.45},0),h("cathedral","Infinite Basilica",[1.1,.2,1.42,1.3,1.4,.95],{trail:.35,kaleido:0},4),h("cathedral","Neon Spine",[.55,1.1,1.6,1.3,2,.75,1.5,1.4],{trail:.5,zoom:1.012,hueDrift:.006},15),h("cathedral","Gothic Mushroom Vault",[.95,.7,1.5,1.2,.7,1.05,1,1.8],{breathe:.8,melt:.4,trail:.35},1),h("nebula","Warp Nebula",[],{},9),h("nebula","Wormhole Petals",[2,.4,3.2,1.6,1,.3,1.1,6],{kaleido:6,trail:.4},0),h("nebula","Cosmic Drain",[.6,.9,1.5,2.5,.4,-.6,1.2],{spin:.01,trail:.7,zoom:.985},5),h("julia","Julia Bloom",[],{},0),h("julia","Dendrite Garden",[1.2,1.3,.6,1.2,2,.76,.2,6],{trail:.4},13),h("julia","Paisley Mind",[2.6,.8,1.8,1,1.5,.79,-.4,1],{breathe:1.2,melt:.5},1),h("julia","Electric Lace",[4.2,1.6,2.4,1.5,2.8,.7885,.3,4],{kaleido:0,trail:.6,hueDrift:.02},15),h("gyroid","Gyroid Hyperspace",[],{},9),h("gyroid","Coral Lungs",[1.4,.8,.15,1.4,.7,1.8,.06,.3],{breathe:1.5,trail:.5},12),h("gyroid","Light Speed Lattice",[3,4.5,.03,1.6,.2,.6,.05,1.6],{trail:.5,zoom:1.02,chroma:1.6},0),h("chrome","Liquid Chrome",[],{},14),h("chrome","Mercury Heartbeat",[4,.9,.15,4,.6,2,.4,1.3],{trail:.3},10),h("chrome","Oil Slick Orbit",[8,.35,.7,12,1.6,1,2,1],{trail:.5,breathe:.8},1),h("horizon","Neon Horizon",[],{},2),h("horizon","Outrun Forever",[2.5,.38,1.5,10,1.2,1.5,14,1.5],{trail:.4,chroma:2},2),h("horizon","Hallucinated Highway",[1.5,.25,1.2,6,2,1,6,1.4],{breathe:1.2,melt:1,trail:.6,hueDrift:.01},0),h("mandala","Spectral Mandala",[],{},0),h("mandala","Lotus Reactor",[8,8,.8,2,.05,1.4,1.4,1.1],{trail:.6,zoom:1.015},7),h("mandala","Chakra Spin",[16,4,.3,1.2,.5,1,.4,.8],{trail:.75,spin:.008},9),h("mandala","Lace Galaxy",[24,10,1,1,-.2,2,2,1.3],{kaleido:0,trail:.5,hueDrift:.015},15),h("silk","Silk Warp",[],{},1),h("silk","Melting Marble",[1.4,2,1.6,.4,1.8,1.2,1.8,1],{breathe:1,melt:.5},4),h("silk","Liquid Thought",[3.5,1.6,.8,1.2,1,1.5,1.2,.2],{kaleido:8,trail:.4},3),h("silk","Tie-Dye Ocean",[2.6,2.6,2.6,.9,.8,1,1.1,.6],{trail:.3,hueDrift:.02},0),h("apollo","Apollonian Dream",[],{},14),h("apollo","Bubble Universe",[1.32,.4,2.2,2.5,1,.8,.2,1.3],{trail:.5},11),h("apollo","Pearl Labyrinth",[1.08,1.2,.8,.8,1.8,.3,.6,1.6],{breathe:.6},4),h("voronoi","Stained Voronoi",[],{},7),h("voronoi","Cathedral Window",[4,.3,.08,1.5,2,.3,0,.9],{kaleido:12,trail:.3},0),h("voronoi","Cell Division",[12,1.5,.02,2.5,2.5,1,1.4,.3],{trail:.6,breathe:1.2,melt:.4},6),h("wavefield","Neon Wavefield",[],{},2),h("wavefield","Pulsar Ridge",[.6,1.6,1.8,.4,.1,1,.4,.1],{trail:.5,chroma:1.5},10),h("wavefield","Spectral Dunes",[.2,1.2,1,1.2,.8,.6,1.8,0],{mirror:1,trail:.6},3),h("starcore","Star Core",[],{},4),h("starcore","Blue Giant",[3,1.6,1.6,2,1.6,1.4,1,1.2],{trail:.6},5),h("starcore","Quasar Eye",[2.2,2,1.4,2.2,2,1.4,1.2,.85],{kaleido:6,trail:.35},8),h("flower","Flower of Life",[],{},4),h("flower","Metatron Gate",[2,.15,2,1.6,4,1.5,.6,1],{trail:.5,zoom:1.012},13),h("flower","Seed of Creation",[2.6,-.05,.6,1.2,4,1,.35,1.4],{trail:.45,breathe:1,hueDrift:.006},1),h("fall","Endless Fall",[],{},0),h("fall","Droste Staircase",[1.5,1.2,3,4,1.5,1,.2,1],{trail:.5},4),h("fall","Spiral Abyss",[2.2,1.8,8,5,1.8,2,.8,1.5],{trail:.7,zoom:.99,spin:-.01},9),h("fall","Rising Up",[-1.2,.4,6,3,1.2,1.5,.5,.4],{kaleido:0,trail:.4,hueDrift:.01},3),h("hyper","Hyperbolic Temple",[],{},0),h("hyper","Escher Heaven",[7,3,.8,2,.5,.2,1,.8],{trail:.4},10),h("hyper","Infinite Mosaic",[4,6,1.4,1.5,.8,-.3,1.3,1.2],{trail:.5,breathe:.6},7),h("burst","Supernova Burst",[],{},4),h("burst","Firework Mind",[180,2,6,1.5,.8,.4,2,.4],{trail:.66,zoom:1.02},0),h("burst","Crystal Detonation",[60,2.2,4,.8,1.2,0,1.6,1],{kaleido:8,trail:.7,zoom:1.02},15),h("fold","Origami Fold",[],{},1),h("fold","Folding Cathedral",[.15,12,1.4,.8,1.4,1.5,1.4,.8],{trail:.5},4),h("fold","Dragon Paper",[.6,10,1.3,.62,1.2,1.2,2,1.3],{trail:.65,breathe:1},9),h("fold","Snowflake Engine",[1.05,9,1.36,.75,1.6,1,.8,.7],{kaleido:6,trail:.4},5),h("bulb","Mandelbulb Shrine",[],{},14),h("bulb","Alien Spore",[4,.4,1.6,2,2.2,1.5,2,7],{trail:.5,breathe:1},6),h("bulb","Golden Idol",[10,.15,.6,.8,2.4,.4,1.6,8],{trail:.3},4),h("hextunnel","Hex Temple",[],{},1),h("hextunnel","Machine Elf Hall",[2.2,8,2,2,1.4,1.2,1,2],{trail:.6,breathe:1.4,melt:.4},0),h("yantra","Sri Yantra",[],{},4),h("yantra","Third Eye Opening",[12,2,24,1.2,.2,2.5,1.2,1.2],{trail:.7,zoom:1.018},9),h("menger","Menger Crystal",[],{},5),h("menger","Sponge Cathedral",[1.6,.95,2,2,.6,1.2,.2,4],{trail:.5},4),h("aurora","Aurora Ocean",[],{},3),h("aurora","Borealis Mirror",[8,1.5,1.1,1.8,1,1.6,2,2],{trail:.5,breathe:.6},12)],xa=[["Liquid Oscilloscope",[2,7],[0,3]],["Spectral Whirlpool",[2,3],[2,5]],["Lissajous Lagoon",[8,3],[3,0]],["Golden Spiral Engine",[7,5],[4,6]],["Bass Bloom",[9,0],[5,2]],["Rising Phoenix",[6,8],[1,8]],["Twin Vortex",[3,2],[7,0]],["Ripple Mind",[4,10],[0,6]],["Petal Storm",[10,5],[6,2]],["Helix Current",[8,6],[8,1]],["Starburst Tunnel",[0,7],[9,5]],["Mirror Pulse",[1,4],[10,0]],["Trinity Drift",[5,8],[11,3]],["Orbital Smoke",[8,2],[7,4]],["Infinite Zoom Scope",[0,9],[0,1]],["Collapsing Stars",[1,3],[6,9]],["Plasma Flame",[6,9],[5,8]],["Deep Current",[8,8],[1,3]],["Kaleido Rose",[10,4],[2,11]],["Mandala Machine",[5,10],[6,11]],["Ghost Knots",[2,8],[3,3]],["Comet Tails",[7,0],[7,9]],["Sonic Lotus",[10,2],[2,6]],["Wave Temple",[4,5],[10,1]],["Ember Spiral",[7,6],[4,8]],["Pulse Reactor",[9,4],[5,0]],["Silk Scope",[8,1],[0,10]],["Aurora Knot",[6,3],[3,8]],["Gravity Well",[2,9],[7,2]],["Quantum Foam",[8,10],[9,6]],["Spinning Prism",[5,3],[11,5]],["Echo Chamber",[1,7],[0,4]],["Fireflies",[3,8],[7,9]],["Hypno Rings",[4,7],[6,0]],["Dream Scope",[0,1,2,3,4,5,6,7,8,9,10],[0,1,2,3,4,5,6,7,8,10,11]],["Chaos Garden",[0,1,2,3,4,5,6,7,8,9,10],[0,1,2,3,4,5,6,7,8,9,10,11]]];xa.forEach(([a,e,t],i)=>{let r=h("flux",a,[],{},(i*5+3)%X.length);r.flux={flows:e,waves:t},a==="Chaos Garden"&&(r.params[4]=6),fe.push(r)});function Xt(){let a=(e,t)=>[...Array(e).keys()].sort(()=>Math.random()-.5).slice(0,t);return{flows:a(11,2+Math.floor(Math.random()*3)),waves:a(12,2+Math.floor(Math.random()*3))}}var ga=["Velvet","Chrome","Fractal","Liquid","Astral","Neon","Cosmic","Prismatic","Holographic","Molten","Electric","Dreaming","Infinite","Sacred","Psychedelic","Iridescent","Quantum","Lucid","Melting","Hyper","Ancient","Crystal","Sonic","Shimmering","Feral","Halcyon","Opal","Ultraviolet"],ba=["Singularity","Aurora","Cathedral","Lotus","Vortex","Garden","Labyrinth","Mandala","Spiral","Bloom","Engine","Temple","Ocean","Nebula","Serpent","Oracle","Echo","Portal","Reactor","Dream","Prism","Hive","Halo","Abyss","Lattice","Comet","Membrane","Kaleidoscope"],Z=(a,e)=>a+Math.random()*(e-a),ue=a=>a[Math.floor(Math.random()*a.length)];function _e(){return`${ue(ga)} ${ue(ba)}`}function Vt(){return{name:"Generated",a:[Z(.3,.65),Z(.3,.65),Z(.3,.65)],b:[Z(.3,.55),Z(.3,.55),Z(.3,.55)],c:[ue([.5,1,1,1,1.5,2]),ue([.5,1,1,1,1.5,2]),ue([.5,1,1,1,1.5,2])],d:[Math.random(),Math.random(),Math.random()]}}function Yt(a=te,e=1){let t={...a},i=(r,o,s)=>{t[r]=t[r]+(Z(o,s)-t[r])*e};i("trail",0,.85),i("zoom",.985,1.03),i("spin",-.012,.012),i("warp",0,1.2),i("breathe",0,1.6),i("melt",0,.8),i("chroma",.3,2.2),i("bloom",.4,1.4),t.hueDrift=Math.random()<.3?Z(-.02,.02):0,e>=1&&(t.kaleido=Math.random()<.3?ue([3,4,5,6,8,12]):0),t.mirror=Math.random()<.12?1:0;for(let r of["dance","ripple","punch","shake","swirlA","bulgeA"])i(r,.3,1.9);return t}function rt(a,e=.55){let t=oe[a.scene],i=structuredClone(a);return i.builtin=!1,t&&(i.params=t.params.map((r,o)=>{let s=a.params[o]??r.def,l=Z(r.min,r.max);return+(s+(l-s)*e).toFixed(4)})),i.fx=Yt(a.fx,e*.7),t&&t.fly&&(i.fx.trail=Math.min(i.fx.trail,.25)),t&&t.selfFeedback&&(i.fx.trail=Math.min(i.fx.trail,.15),Math.random()<.6&&(i.flux=Xt())),Math.random()<.5&&(i.palette=Math.random()<.4?Vt():Math.floor(Math.random()*X.length)),i.name=_e(),i.id="gen-"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),i}function st(){let a=ue(K),e=a.params.map(i=>{let r=Z(i.min,i.max);return+(i.def+(r-i.def)*.7).toFixed(4)}),t=Yt(te,1);return a.fly&&(t.trail=Math.min(t.trail,.25)),a.selfFeedback&&(t.trail=Math.random()*.15),{id:"gen-"+Date.now().toString(36),name:_e(),engine:"scene",scene:a.id,params:e,palette:Math.random()<.5?Vt():Math.floor(Math.random()*X.length),fx:t,builtin:!1,...a.selfFeedback?{flux:Xt()}:{}}}function Ne(a){return typeof a=="number"?X[(a%X.length+X.length)%X.length]:a}var Wt="eyecandy.userPresets.v1";function jt(){try{return JSON.parse(localStorage.getItem(Wt)||"[]")}catch{return[]}}function Be(a){try{localStorage.setItem(Wt,JSON.stringify(a))}catch{}}function Kt(a){let e=a.ctx,t=e.createGain();t.gain.value=.55,t.connect(a.input),t.connect(a.out);let i=124,r=60/i/4,o=e.currentTime+.1,s=0,l=!0,f=[0,3,5,7,10,12,15],d=e.createBuffer(1,e.sampleRate,e.sampleRate),x=d.getChannelData(0);for(let b=0;b<x.length;b++)x[b]=Math.random()*2-1;let g=e.createDelay(1);g.delayTime.value=r*3;let P=e.createGain();P.gain.value=.35,g.connect(P),P.connect(g),g.connect(t);let y=b=>{let C=e.createOscillator(),w=e.createGain();C.frequency.setValueAtTime(150,b),C.frequency.exponentialRampToValueAtTime(42,b+.12),w.gain.setValueAtTime(1,b),w.gain.exponentialRampToValueAtTime(.001,b+.45),C.connect(w),w.connect(t),C.start(b),C.stop(b+.5)},k=(b,C)=>{let w=e.createBufferSource();w.buffer=d;let M=e.createBiquadFilter();M.type="highpass",M.frequency.value=8e3;let R=e.createGain();R.gain.setValueAtTime(C,b),R.gain.exponentialRampToValueAtTime(.001,b+.05),w.connect(M),M.connect(R),R.connect(t),w.start(b),w.stop(b+.06)},L=b=>{let C=e.createBufferSource();C.buffer=d;let w=e.createBiquadFilter();w.type="bandpass",w.frequency.value=1500;let M=e.createGain();M.gain.setValueAtTime(.5,b),M.gain.exponentialRampToValueAtTime(.001,b+.18),C.connect(w),w.connect(M),M.connect(t),M.connect(g),C.start(b),C.stop(b+.2)},S=(b,C,w,M)=>{let R=e.createOscillator(),B=e.createOscillator(),z=e.createBiquadFilter(),U=e.createGain();R.type="sawtooth",B.type="square";let D=55*Math.pow(2,C/12);R.frequency.value=D,B.frequency.value=D*1.005,z.type="lowpass",z.Q.value=9,z.frequency.setValueAtTime(M,b),z.frequency.exponentialRampToValueAtTime(120,b+w),U.gain.setValueAtTime(.22,b),U.gain.exponentialRampToValueAtTime(.001,b+w),R.connect(z),B.connect(z),z.connect(U),U.connect(t),U.connect(g),R.start(b),B.start(b),R.stop(b+w),B.stop(b+w)},$=(b,C)=>{[0,7,15,19].forEach(w=>{let M=e.createOscillator(),R=e.createGain();M.type="triangle",M.frequency.value=110*Math.pow(2,(C+w)/12),R.gain.setValueAtTime(0,b),R.gain.linearRampToValueAtTime(.05,b+1),R.gain.linearRampToValueAtTime(0,b+r*64),M.connect(R),R.connect(t),R.connect(g),M.start(b),M.stop(b+r*64)})},Y=[0,-4,3,-2],j=()=>{if(l){for(;o<e.currentTime+.15;){let b=s%16,C=Math.floor(s/16),w=Math.floor(C/8)%4,M=Y[Math.floor(C/2)%4],R=C%32>=28;!R&&b%4===0&&y(o),b%2===1&&k(o,b%4===3?.25:.1),!R&&(b===4||b===12)&&L(o),Math.random()<(w===2?.8:.55)&&S(o,M+12+f[Math.floor(Math.random()*f.length)]+(Math.random()<.2?12:0),r*1.8,600+3e3*Math.abs(Math.sin(s*.03))),b===0&&C%4===0&&$(o,M),o+=r,s++}setTimeout(j,25)}};return j(),()=>{l=!1,t.gain.setTargetAtTime(0,e.currentTime,.2),setTimeout(()=>t.disconnect(),800)}}var Zt=[3302,3570],ya=[1476,2508,2976],Ta=(()=>{let a=new Uint32Array(256);for(let e=0;e<256;e++){let t=e;for(let i=0;i<8;i++)t=t&1?3988292384^t>>>1:t>>>1;a[e]=t>>>0}return a})();function Jt(a){let e=4294967295;for(let t of a)e=Ta[(e^t)&255]^e>>>8;return(e^4294967295)>>>0}var wa=[[1,0,0,0],[1,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,1,1],[0,0,0,1],[1,0,0,1],[0,0,0,0]],Ge=class{constructor(){this.supported=!!navigator.hid,this.device=null,this.kind=null,this.bt=!1,this.status=this.supported?"not connected":"unsupported",this.t=[{active:!1,x:.5,y:.5,id:-1},{active:!1,x:.5,y:.5,id:-1}],this.axes=[0,0,0,0],this.buttons=new Array(18).fill(0),this.lastReport=0,this.lastPadReport=0,this.onstatus=()=>{},this.seq=0,this.rumbleTimer=0,this.supported&&(navigator.hid.addEventListener("disconnect",e=>{e.device===this.device&&(this.device=null,this.set("not connected"))}),navigator.hid.addEventListener("connect",()=>this.autoConnect()))}set(e){this.status=e,this.onstatus(e)}get connected(){return!!this.device}get fresh(){return this.device&&performance.now()-this.lastPadReport<400}async autoConnect(){if(!this.supported||this.device)return!1;try{let t=(await navigator.hid.getDevices()).find(i=>i.vendorId===1356&&(Zt.includes(i.productId)||ya.includes(i.productId)));if(t)return await this.open(t),!0}catch(e){console.warn(e)}return!1}async request(){if(!this.supported)return!1;try{window.eyecandy&&window.eyecandy.requestHid?await window.eyecandy.requestHid():await navigator.hid.requestDevice({filters:[{vendorId:1356}]})}catch(e){console.warn(e)}return this.autoConnect()}async open(e){try{e.opened||await e.open()}catch{this.set("could not open (close Steam / DS4Windows?)");return}this.device=e,this.kind=Zt.includes(e.productId)?"ds5":"ds4";try{await e.receiveFeatureReport(this.kind==="ds5"?5:2)}catch{}e.addEventListener("inputreport",t=>this.parse(t)),this.set((this.kind==="ds5"?"DualSense":"DualShock 4")+" connected (touchpad + full controller)")}parse(e){let t=e.data,i=e.reportId,r=S=>t.getUint8(S),o=-1,s=-1;if(this.kind==="ds5"?i===1&&t.byteLength>=40?(o=0,s=32,this.bt=!1):i===49&&t.byteLength>=41?(o=1,s=33,this.bt=!0):i===1&&t.byteLength>=9&&(o=0,this.bt=!0):i===1&&t.byteLength>=42?(o=0,s=34,this.bt=!1):i===17&&t.byteLength>=44?(o=2,s=36,this.bt=!0):i===1&&t.byteLength>=9&&(o=0,this.bt=!0),o<0)return;let l=S=>(r(S)-128)/127.5,f=this.buttons;this.axes=[l(o),l(o+1),l(o+2),l(o+3)];let d,x,g,P,y;this.kind==="ds5"&&s>=0?(P=r(o+4),y=r(o+5),d=r(o+7),x=r(o+8),g=r(o+9)):(d=r(o+4),x=r(o+5),g=r(o+6),P=r(o+7),y=r(o+8));let k=wa[Math.min(8,d&15)];if(f[2]=d>>4&1,f[0]=d>>5&1,f[1]=d>>6&1,f[3]=d>>7&1,f[4]=x&1,f[5]=x>>1&1,f[6]=P/255,f[7]=y/255,f[8]=x>>4&1,f[9]=x>>5&1,f[10]=x>>6&1,f[11]=x>>7&1,f[12]=k[0],f[15]=k[1],f[13]=k[2],f[14]=k[3],f[16]=g&1,f[17]=g>>1&1,this.lastPadReport=performance.now(),s<0)return;let L=this.kind==="ds5"?1079:942;for(let S=0;S<2;S++){let $=s+S*4,Y=r($),j=r($+1),b=r($+2),C=r($+3),w=this.t[S];w.active=!(Y&128),w.id=Y&127,w.active&&(w.x=Math.min(1,(j|(b&15)<<8)/1919),w.y=Math.min(1,(b>>4|C<<4)/L))}this.lastReport=performance.now()}asGamepad(){return{id:(this.kind==="ds5"?"DualSense":"DualShock 4")+" (HID, Vendor: 054c)",connected:!0,mapping:"standard",axes:this.axes,buttons:this.buttons.map(e=>({pressed:e>.5,value:e})),vibrationActuator:{playEffect:(e,t)=>this.rumble(t)}}}async rumble({duration:e=100,strongMagnitude:t=0,weakMagnitude:i=0}={}){if(!this.device)return;let o=Math.round(Math.min(1,t)*255),s=Math.round(Math.min(1,i)*255);try{await this.sendMotors(o,s),clearTimeout(this.rumbleTimer),this.rumbleTimer=setTimeout(()=>this.sendMotors(0,0).catch(()=>{}),e)}catch{}}async sendMotors(e,t){let i=this.device;if(i)if(this.kind==="ds5"){let r=new Uint8Array(47);if(r[0]=3,r[2]=t,r[3]=e,!this.bt)return i.sendReport(2,r);let o=new Uint8Array(77);o[0]=(this.seq=this.seq+1&15)<<4,o[1]=16,o.set(r,2);let s=Jt(new Uint8Array([162,49,...o.subarray(0,73)]));return o[73]=s&255,o[74]=s>>>8&255,o[75]=s>>>16&255,o[76]=s>>>24&255,i.sendReport(49,o)}else{if(!this.bt){let s=new Uint8Array(31);return s[0]=7,s[3]=t,s[4]=e,i.sendReport(5,s)}let r=new Uint8Array(77);r[0]=192,r[2]=7,r[5]=t,r[6]=e;let o=Jt(new Uint8Array([162,17,...r.subarray(0,73)]));return r[73]=o&255,r[74]=o>>>8&255,r[75]=o>>>16&255,r[76]=o>>>24&255,i.sendReport(17,r)}}};var Le=fe.filter(a=>a.scene!=="flux"),Tt=fe.filter(a=>a.scene==="flux"),p=a=>document.querySelector(a),we=a=>[...document.querySelectorAll(a)],O=(a,e,t)=>Math.max(e,Math.min(t,a)),I=(a,e,t)=>a+(e-a)*t,N=window.eyecandy||null;N||document.addEventListener("DOMContentLoaded",()=>{},{once:!0});var na="eyecandy.settings.v1",Pa={resolution:"native",renderScale:"auto",autoExposure:!0,fpsCap:"0",uiScale:1,startFullscreen:!1,showFps:!1,autopilot:!0,autoInterval:30,autoSource:"mix",autoOnDrop:!0,idle:20,reactIntensity:1.4,idleDance:!0,beatRipples:!0,beatPulse:.8,beatFlash:.3,cameraShake:.5,beatSens:1,gainBass:1,gainMid:1,gainHigh:1,outputDevice:"default",rumble:!0,rumbleStrength:.7,deadzone:.14,stickSens:1,invertY:!1,touchMode:"both",transition:1.4,autoPause:!1,uiAutoHide:!0,volume:.85,seenGuide:!1},m={...Pa,...JSON.parse(localStorage.getItem(na)||"{}")},de=()=>localStorage.setItem(na,JSON.stringify(m)),ae=p("#gl"),F;try{F=new Ue(ae)}catch(a){throw document.body.innerHTML=`<div style="padding:40px;font:16px sans-serif;color:#fff">Eye Candy needs WebGL2.<br><br>${a.message}</div>`,a}var c=new qe;c.out.gain.value=m.volume;var v=new He;v.deadzone=m.deadzone;var q=new Ge;v.hid=q;var ne={active:!1,x:.5,y:.5},H=jt(),Pe=null,_=null,J=null,ke=null,We=[],Oe=null,ve=null,oa={...te,trail:0,zoom:1,warp:0,breathe:.15,bloom:.6,chroma:.8,grain:.25};function se(){return _?Promise.resolve():Oe||(wt(),Oe=new Promise((a,e)=>{let t=document.createElement("script");t.src="milk.js",t.onload=()=>{let i=window.EyeMilk;ke={};for(let r of i.packs)try{Object.assign(ke,r.getPresets?r.getPresets():r.default?.getPresets())}catch(o){console.warn(o)}We=Object.keys(ke).sort((r,o)=>r.localeCompare(o)),J=document.createElement("canvas"),J.width=1280,J.height=720,_=i.butterchurn.createVisualizer(c.ctx,J,{width:1280,height:720,pixelRatio:1,textureRatio:1}),_.connectAudio(c.input),fetch("milktex/manifest.json").then(r=>r.json()).then(r=>_.loadExtraImages(r)).catch(()=>{}),wt().then(()=>a())},t.onerror=e,document.head.appendChild(t)}),Oe)}function ka(a,e){if(!_)return;let t=Math.min(1,1280/a),i=Math.round(a*t),r=Math.round(e*t);(J.width!==i||J.height!==r)&&(J.width=i,J.height=r,_.setRendererSize(i,r))}var Ce=null,Me={},lt={},ct=null;function wt(){return ct||(ct=fetch("milklib/index.json").then(a=>a.json()).then(a=>{Ce={};for(let[e,t,i]of a)Ce[e]={cat:t,chunk:i},(Me[t]=Me[t]||[]).push(e);return Ce}).catch(()=>Ce={}))}async function ra(a){if(ke&&ke[a])return ke[a];await wt();let e=Ce[a];return e?(lt[e.chunk]||(lt[e.chunk]=fetch(`milklib/c${e.chunk}.json`).then(i=>i.json())),(await lt[e.chunk])[a]||null):null}async function Re(a,e=2){if(!_)return;let t=await ra(a);if(t)try{_.loadPreset(t,e),ve=a}catch(i){console.warn("MilkDrop preset failed",a,i)}}var Se="all";function De(a){return a==="classic"?We:a!=="all"?Me[a]||[]:[...We,...Object.values(Me).flat()]}var Qe=()=>{let a=De(Se==="classic"||Se==="all"?"all":Se);return a[Math.floor(Math.random()*a.length)]},ut=new Map;function kt(a){return ut.has(a)||ut.set(a,{id:"milk:"+a,name:a,engine:"milk",milk:a,fx:ot(a,oa,{trail:0,zoom:1,kaleido:0,mirror:0}),palette:0,builtin:!0}),ut.get(a)}var ie="eye",u=structuredClone(fe[0]),Ee=structuredClone(u),V=0,n={camX:0,camY:0,roll:0,morphX:0,morphY:0,waitCenter:!1,time:0,timeScale:1,hue:0,burstT:9,flash:0,freeze:!1,lt:0,rt:0,transMix:0,lastSwitch:0,lastHuman:-1e9,kAngle:0,pal:null,flowX:0,flowY:0,hyper:0,autoT:0,panels:!0,cinema:!1,amX:0,amY:0,danceT:0,sinceBeat:9,beatInt:.5,jolt:0,beatRipT:9,beatRipAmt:0,lastAutoBurst:0,lastStick:-1e9,lensRot:0,lensZoom:1,swirl:0,bulge:0,swirlT:0,bulgeT:0,burstCX:0,burstCY:0,pinch:null,touch:[{on:!1,x:0,y:0,vx:0,vy:0,s:0},{on:!1,x:0,y:0,vx:0,vy:0,s:0}],flux:{fa:0,fb:0,fm:0,wa:0,wb:0,wm:0,tf:0,tw:0,mapT:0}},sa=a=>[...a.a,...a.b,...a.c,...a.d];n.pal=sa(Ne(u.palette));var ft=[-1,-.5,.25,.5,.75,1,1.5,2,3,4];function St(a){return a==="eye"?Le:a==="flux"?Tt:a==="user"?H:a==="milk"?De(Se).map(kt):fe}function Mt(){let a=oe[u.scene];if(!a)return[];let e=u.params.slice(),[t,i]=a.stick||[0,1],r=(n.waitCenter?0:n.morphX)+n.amX,o=(n.waitCenter?0:n.morphY)+n.amY,s=(l,f)=>{let d=a.params[l];d&&(e[l]=O(e[l]+f*(d.max-d.min)*.35,d.min,d.max))};return s(t,r),s(i,o),e}function G(a,e={}){if(a){if(e.transition!==!1&&F.fin&&(F.snapshot(),n.transMix=1),u=structuredClone(a),u.fx={...te,...a.engine==="milk"?oa:{},...a.fx},Ee=structuredClone(u),n.waitCenter=Math.abs(n.morphX)+Math.abs(n.morphY)>.1,n.hue=u.fx.hueOffset||0,n.lastSwitch=performance.now(),n.camX=0,n.camY=0,n.lensRot=0,n.lensZoom=1,u.scene==="flux"){let t=u.flux||{flows:[2,7],waves:[0,3]};u.flux=t,Object.assign(n.flux,{fa:t.flows[0],fb:t.flows[0],fm:0,wa:t.waves[0],wb:t.waves[0],wm:0,tf:0,tw:0})}u.engine==="milk"?se().then(()=>Re(u.milk,e.transition===!1?0:2)):u.fx.fusion>0&&se().then(()=>{u.milk?Re(u.milk):ve||Re(Qe())}),u.engine==="scene"&&F.errors[u.scene]&&T("\u26A0","Scene failed to compile \u2014 skipping"),p("#presetName").textContent=u.name,W(),Q(),e.quiet||T("\u25C6",u.name)}}function le(a){let e=St(ie);if(!e.length){ie==="milk"&&se().then(()=>{W(),le(a)});return}V=((V+a)%e.length+e.length)%e.length,G(e[V])}function Bt(){if(u.engine==="milk"){u.fx={...u.fx,...rt({...u,scene:"none"}).fx},u.name=u.milk+" \u2684",p("#presetName").textContent=u.name,Q(),T("\u2684","Randomized FX");return}G(rt(u),{quiet:!0}),T("\u2684","Randomized \xB7 "+u.name)}function Ct(){G(st(),{quiet:!0}),T("\u2726","Generated \xB7 "+u.name)}function la(){let a=structuredClone(u);return a.engine==="scene"&&(a.params=Mt().map(e=>+e.toFixed(4))),a.fx={...a.fx,hueOffset:(n.hue%1+1)%1,speed:+(a.fx.speed*Math.abs(n.timeScale)).toFixed(3)},a.engine==="scene"&&a.fx.fusion>0&&ve&&(a.milk=ve),a}function et(){let a=la();a.id="user-"+Date.now().toString(36),a.builtin=!1,(Ee.builtin||!a.name||H.some(e=>e.name===a.name))&&(a.name=(a.engine==="milk"?"Milk \xB7 ":"")+_e()),H.push(a),Be(H),u=structuredClone(a),Ee=structuredClone(a),p("#presetName").textContent=u.name,W(),Q(),T("\u2605","Saved \u201C"+a.name+"\u201D to My Presets"),v.rumble(.4,.6,120)}function Sa(){let a=H.findIndex(t=>t.id===u.id);if(a<0)return et();let e=la();e.name=p("#pName").value||e.name,H[a]=e,Be(H),Ee=structuredClone(e),u=structuredClone(e),n.timeScale=1,W(),T("\u2605","Updated \u201C"+e.name+"\u201D")}function Ma(){let a=H.findIndex(e=>e.id===u.id);a<0||(H.splice(a,1),Be(H),W(),T("\u2716","Deleted"),le(0))}function Fe(a=1,e=0,t=0){n.burstCX=e,n.burstCY=t,n.burstT=0,n.flash=.55*a,v.rumble(.9*a*m.rumbleStrength,.5*a*m.rumbleStrength,160)}function ca(a=1){let e=typeof u.palette=="number"?u.palette:-1;u.palette=((e+a)%X.length+X.length)%X.length,T(v.label("RB"),"Palette \xB7 "+X[u.palette].name),Q()}var mt=[0,3,4,5,6,8,12,16];function ua(){let a=mt.indexOf(u.fx.kaleido);u.fx.kaleido=mt[(a+1)%mt.length],T(v.label("LB"),u.fx.kaleido?"Kaleidoscope \xD7"+u.fx.kaleido:"Kaleidoscope off"),Q()}function fa(){u.fx.mirror=u.fx.mirror?0:1,T(v.label("LB"),u.fx.mirror?"Mirror world":"Mirror off"),Q()}function je(a){let e=ft.indexOf(n.timeScale);e<0&&(e=5),e=O(e+a,0,ft.length-1),n.timeScale=ft[e],T(a>0?"\u25B2":"\u25BC",n.timeScale<0?"Time reversed \xD7"+Math.abs(n.timeScale):"Time \xD7"+n.timeScale)}function Ba(){n.camX=n.camY=n.roll=0,n.lensRot=0,n.lensZoom=1,n.timeScale=1,n.flowX=n.flowY=0,T(v.label("L3"),"View reset")}function Ca(){u.engine==="scene"&&(u.params=Mt(),n.waitCenter=!0,Q(),T(v.label("R3"),"Shape locked in"),v.rumble(.2,.5,60))}function Rt(a){m.autopilot=a,de(),p("#autoBtn").classList.toggle("on",a),T("\u27F3",a?"Autopilot on":"Autopilot off"),It()}function xe(){n.lastHuman=performance.now()}function Ra(a,e){let t=m.autopilot&&(!m.autoPause||e-n.lastHuman>m.idle*1e3);if(n.autoActive=t,!t)return;n.autoT+=a;let i=(e-n.lastSwitch)/1e3,r=m.autoOnDrop&&c.drop>1.1&&i>12;if(i>m.autoInterval||r){c.drop=0;let o=m.autoSource,s=Math.random();o==="generate"||o==="mix"&&s<.25?G(st(),{quiet:!0}):o==="milk"||o==="mix"&&s<.4||o==="all"&&s<.5?se().then(()=>G(kt(Qe()),{quiet:!0})):o==="flux"||o==="mix"&&s<.55?(V=Math.floor(Math.random()*Tt.length),G(Tt[V],{quiet:!0})):o==="user"&&H.length?G(H[Math.floor(Math.random()*H.length)],{quiet:!0}):(V=Math.floor(Math.random()*Le.length),G(Le[V],{quiet:!0})),r&&Fe(.8)}}function Aa(a){if(v.poll(),v.justConnected&&(T("\u{1F3AE}",(v.style==="ps"?"PlayStation":"Xbox")+" controller connected"),v.rumble(.5,.8,200),m.seenGuide||(m.seenGuide=!0,de(),he(!0)),v.style==="ps"&&q.supported&&!q.connected&&!N&&(p("#tpChip").classList.remove("hidden"),setTimeout(()=>T("\u25C9","PlayStation pad: click \u201CEnable touchpad\u201D up top to use the touchpad"),1500)),Ut()),!v.connected){n.lt=I(n.lt,0,a*6),n.rt=I(n.rt,0,a*6);return}let[e,t,i,r]=v.axes;if((v.pressed.some(Boolean)||Math.abs(e)+Math.abs(t)+Math.abs(i)+Math.abs(r)+v.lt+v.rt>.05)&&(xe(),p("#splash").classList.contains("gone")||La(),m.uiAutoHide&&tt()),!p("#controls").classList.contains("hidden")){(v.tap(A.B)||v.tap(A.A)||v.shortRelease(A.BACK))&&he(!1);return}let s=m.stickSens,l=m.invertY?-1:1;Math.abs(e)+Math.abs(t)+Math.abs(i)+Math.abs(r)>.05&&(n.lastStick=performance.now()),u.engine==="milk"?(n.lensRot+=e*a*1.8*s,n.lensZoom=O(n.lensZoom*Math.exp(t*l*a*1.3*s),.3,4),n.swirlT=i*1.5*s,n.bulgeT=-r*l*1.1*s):(n.camX+=e*a*1.5*s,n.camY=O(n.camY-t*l*a*1.1*s,-1.3,1.3),n.waitCenter&&Math.hypot(i,r)<.12&&(n.waitCenter=!1),n.morphX=I(n.morphX,O(i*s,-1.5,1.5),a*8),n.morphY=I(n.morphY,O(-r*l*s,-1.5,1.5),a*8),n.swirlT=i*.3*s,n.bulgeT=-r*l*.15*s),n.flowX=I(n.flowX,e,a*5),n.flowY=I(n.flowY,-t*l,a*5),n.lt=I(n.lt,v.lt,a*10),n.rt=I(n.rt,v.rt,a*10),v.lt>.08&&Math.random()<a*3&&Pt("LT","Warp",v.lt),v.rt>.08&&Math.random()<a*3&&Pt("RT","Drive",v.rt);let f=v.lt>.92&&v.rt>.92;f&&!n.hyperOn&&(T("\u2604","HYPERDRIVE"),Fe(1.2)),n.hyperOn=f,v.tap(A.A)&&Fe(1),v.tap(A.TOUCH)&&(m.idleDance=!m.idleDance,de(),It(),T("\u25C9",m.idleDance?"Music dance ON":"Music dance OFF \u2014 pure beat reactive"),v.rumble(.3,.5,90)),v.style==="ps"&&q.supported&&!q.connected&&!n.tpTried&&(n.tpTried=!0,q.autoConnect().then(d=>{!d&&N&&q.request()})),n.freeze=v.down(A.B),v.tap(A.B)&&T(v.label("B"),"Freeze"),v.shortRelease(A.X)&&Bt(),v.hold(A.X,550)&&(Ct(),v.rumble(.6,.6,150)),v.tap(A.Y)&&et(),v.shortRelease(A.LB)&&ua(),v.hold(A.LB,500)&&fa(),v.shortRelease(A.RB)&&ca(1),v.down(A.RB)&&performance.now()-v.downAt[A.RB]>300&&(n.hue+=a*.5,Math.random()<a*2&&T(v.label("RB"),"Hue spin")),v.tap(A.RIGHT)&&le(1),v.tap(A.LEFT)&&le(-1),v.tap(A.UP)&&je(1),v.tap(A.DOWN)&&je(-1),v.tap(A.L3)&&Ba(),v.tap(A.R3)&&Ca(),v.tap(A.START)&&(n.cinema=!1,At(!0),da()),v.shortRelease(A.BACK)&&he(!0),v.hold(A.BACK,700)&&Rt(!m.autopilot)}function La(){!c.playlist.length&&c.mode==="player"&&!Pe&&Lt(),Ae()}function Ea(a,e){if(u.scene!=="flux"||!u.flux)return;let t=n.flux,i=u.flux,r=e[4]||14,o=(l,f)=>{let d=l.filter(x=>x!==f);return d.length?d[Math.floor(Math.random()*d.length)]:l[0]};t.tf+=a,t.tw+=a,t.fm>0&&t.fm<1&&(t.fm=Math.min(1,t.fm+a/3.5)),t.fm>=1&&(t.fa=t.fb,t.fm=0),t.fm===0&&t.tf>r&&i.flows.length>1&&(t.fb=o(i.flows,t.fa),t.fm=.001,t.tf=0),t.wm>0&&t.wm<1&&(t.wm=Math.min(1,t.wm+a/2)),t.wm>=1&&(t.wa=t.wb,t.wm=0);let s=c.drop>.9&&t.tw>4;t.wm===0&&(t.tw>r*.7||s)&&i.waves.length>1&&(t.wb=o(i.waves,t.wa),t.wm=.001,t.tw=0),t.mapT+=a*.03*(e[5]??1)*(1+c.vol*.8)}function Fa(a){let e=F.W&&F.H?F.W/F.H:1.7777777777777777,t;q.connected&&performance.now()-q.lastReport<600?t=q.t.map(o=>o.active?o:null):t=[ne.active?ne:null,null];for(let o=0;o<2;o++){let s=n.touch[o],l=t[o];if(l&&m.touchMode!=="off"){let f=(l.x-.5)*e,d=.5-l.y;s.on||(s.x=f,s.y=d,s.vx=s.vy=0);let x=(f-s.x)/Math.max(a,.001),g=(d-s.y)/Math.max(a,.001);s.vx=I(s.vx,x,.35),s.vy=I(s.vy,g,.35),s.x=f,s.y=d,s.on=!0,s.s=Math.min(1,s.s+a*3),xe()}else s.on=!1,s.s=Math.max(0,s.s-a*2),s.vx*=.9,s.vy*=.9}let[i,r]=n.touch;if(i.on&&r.on){let o=Math.hypot(i.x-r.x,i.y-r.y),s=Math.atan2(r.y-i.y,r.x-i.x);if(n.pinch){n.lensZoom=O(n.lensZoom*(o/Math.max(.02,n.pinch.d)),.3,4);let l=s-n.pinch.a;l>Math.PI&&(l-=2*Math.PI),l<-Math.PI&&(l+=2*Math.PI),n.lensRot+=l}n.pinch={d:o,a:s}}else n.pinch=null}var Qt=(a,e)=>[a.x,a.y,e?a.s*(n.pinch?.3:1):0,a.s>.01?1:0];function ma(a){let e=n.pal,t=[];for(let i=0;i<3;i++)t.push(O(e[i]+e[3+i]*Math.cos(6.2831853*(e[6+i]*a+e[9+i]+n.hue)),0,1));return t}var pt=performance.now(),$e=0,dt=0,Xe=16,Ve=0,re=.8,ht=0;function pa(a){requestAnimationFrame(pa);let e=+m.fpsCap;if(e>0&&a-pt<1e3/e-1.5)return;let t=Math.min(.05,(a-pt)/1e3);pt=a,Aa(t),Fa(t);let i=u.fx,r=n.rt,o=n.lt,s=n.hyperOn?1:0;n.hyper=I(n.hyper,s,t*3),c.update(t,i.react*(1+r*1.6),{sens:m.beatSens,gB:m.gainBass,gM:m.gainMid,gH:m.gainHigh}),Ra(t,a);let l=m.reactIntensity*i.react,f=m.idleDance?1:0;n.danceT+=t*(.5+c.vol*1.2);let d=n.danceT;n.amX=I(n.amX,f*l*i.dance*(Math.sin(d*.53)*.3*(.35+c.mid)+c.bass*.22*Math.sin(d*.19+1)),t*4),n.amY=I(n.amY,f*l*i.dance*(Math.cos(d*.41)*.25*(.35+c.high)+c.beat*.28),t*6);let x=f*Math.min(l,2)*i.dance*Math.sin(d*.07+.5)*(.04+c.vol*.1),g=f*Math.min(l,2)*i.dance*Math.sin(d*.11)*(.02+c.mid*.05);u.engine==="milk"&&f>.5&&(n.lensRot+=t*l*i.swirlA*.05*Math.sin(d*.05),a-n.lastStick>4e3&&(n.lensZoom=I(n.lensZoom,1+Math.sin(d*.09)*.15*i.bulgeA,t*.2))),n.sinceBeat+=t,c.isBeat&&(n.sinceBeat>.2&&n.sinceBeat<2&&(n.beatInt=I(n.beatInt,n.sinceBeat,.3)),n.sinceBeat=0,n.jolt=(Math.random()-.5)*2,n.beatRipT=0,n.beatRipAmt=Math.min(1.6,c.bass*.9)*l*i.ripple,m.beatFlash>0&&c.bass>1.2&&a-n.lastAutoBurst>2200&&(n.flash=Math.max(n.flash,m.beatFlash*.5*Math.min(l,1.5)),n.lastAutoBurst=a)),n.jolt*=Math.exp(-t*7),n.beatRipT+=t,n.swirl=I(n.swirl,n.swirlT+Math.min(l,2)*f*i.swirlA*Math.sin(d*.17)*(.04+c.mid*.16),t*4),n.bulge=I(n.bulge,n.bulgeT+Math.min(l,2)*i.bulgeA*c.bass*.08,t*10),i.kaleido>1&&(n.kAngle+=t*c.mid*.25*l*Math.sin(d*.11));let P=window.devicePixelRatio||1,y=m.resolution==="native"?Math.round(innerHeight*Math.min(P,2)):+m.resolution,k=Math.round(y*innerWidth/Math.max(1,innerHeight));(ae.width!==k||ae.height!==y)&&(ae.width=k,ae.height=y),Xe=I(Xe,t*1e3,.05);let L;if(m.renderScale==="auto"){Ve+=t;let D=e>0?1e3/e:16.7;Ve>1.5&&(Xe>D*1.25&&re>.4?(re=Math.max(.4,re-.08),Ve=0):Xe<D*.88&&re<1&&(re=Math.min(1,re+.05),Ve=0)),L=Math.max(u.engine==="milk"?.7:.4,Math.round(re*20)/20)}else L=O(+m.renderScale,.25,2);let S=F.fin;F.resize(k,y,L),S!==F.fin&&(F.transTex=null);let $=i.speed*n.timeScale*(1+r*1.2+n.hyper*2);n.freeze||(n.time+=t*$*(1+c.vol*.45*Math.min(l,2.5))),n.hue+=t*(i.hueSpin||0),n.kAngle+=t*(i.kaleidoSpin||0)*.5,n.burstT+=t,n.flash*=Math.exp(-t*6),n.transMix=Math.max(0,n.transMix-t/Math.max(.2,m.transition)),n.roll=I(n.roll,n.flowX*.25,t*2);let Y=sa(Ne(u.palette));for(let D=0;D<12;D++)n.pal[D]=I(n.pal[D],Y[D],1-Math.exp(-t*2.5));if(F.uploadAudio(c.tex),(u.engine==="milk"||i.fusion>0)&&_){ka(Math.max(F.sw,Math.min(k,1280)),Math.max(F.sh,Math.round(Math.min(k,1280)*y/k)));try{_.render(),F.uploadMilk(J)}catch(D){console.warn(D)}}let b=u.engine==="scene"?Mt():[0,0,0,0,0,0,0,0];for(;b.length<8;)b.push(0);Ea(t,b);let C=c.beat*m.beatPulse*i.punch*.05*Math.min(l,2.5),w=c.beat*m.cameraShake*i.shake*Math.min(l,2)*.5,M=n.pal,R=m.touchMode==="both"||m.touchMode==="vortex",B=m.touchMode==="both"||m.touchMode==="paint",z=n.touch[0],U=i.trail>.15?c.bass*.05*Math.min(l,2):0;F.frame({adaptRate:1-Math.exp(-t*2.5),engine:u.engine==="milk"&&_?"milk":"scene",scene:u.engine==="milk"?"nebula":u.scene,sceneU:{uTime:n.time,uBass:c.bass,uMid:c.mid,uHigh:c.high,uVol:c.vol,uBeat:c.beat,uDrive:r,uBurst:n.burstT,uHue:n.hue,uBeatCount:c.beatCount,uSinceBeat:n.sinceBeat,uBeatInt:n.beatInt,uFlowA:n.flux.fa,uFlowB:n.flux.fb,uFlowMix:n.flux.fm,uWaveA:n.flux.wa,uWaveB:n.flux.wb,uWaveMix:n.flux.wm,uMapT:n.flux.mapT,uAudio:F.audioTex,uP0:b.slice(0,4),uP1:b.slice(4,8),uPalA:M.slice(0,3),uPalB:M.slice(3,6),uPalC:M.slice(6,9),uPalD:M.slice(9,12),uCam:[n.camX+x,n.camY+g,n.roll+n.jolt*.06*m.cameraShake]},fbU:{uTime:n.time,uTrail:Math.min(.96,Math.max(i.trail+U,o*.9,n.hyper*.86)),uZoom:i.zoom+o*.035+n.hyper*.04+c.beat*m.beatPulse*.008*l,uSpin:i.spin+o*n.flowX*.03+n.jolt*.004*m.cameraShake,uWarp:i.warp+o*.8+c.mid*.3*Math.min(l,2),uHueDrift:i.hueDrift+o*.012+n.hyper*.05+c.high*.006*l,uKaleido:i.kaleido,uKaleidoSpin:n.kAngle,uMirror:i.mirror,uFusion:u.engine==="milk"?0:_?i.fusion:0,uBreathe:i.breathe+r*.6+c.bass*.35*Math.min(l,2),uMelt:i.melt+o*.5+c.high*.25*Math.min(l,2),uBass:c.bass,uBeat:c.beat,uBurstT:n.burstT,uBurstC:[n.burstCX,n.burstCY],uFlow:[n.flowX*o,n.flowY*o],uLensRot:n.lensRot+n.jolt*.025*m.cameraShake,uLensZoom:n.lensZoom,uLensPan:[0,0],uSwirl:n.swirl,uBulge:n.bulge,uPunch:C,uShake:w,uBeatRipT:m.beatRipples?n.beatRipT:9,uBeatRipAmt:n.beatRipAmt,uTouch:Qt(n.touch[0],R),uTouch2:Qt(n.touch[1],R),uTouchVel:[O(z.vx*.02,-.08,.08),O(z.vy*.02,-.08,.08)],uTouchColor:ma(n.time*.05),uTouchPaint:B?1.2:0},finU:{uTime:a/1e3,uChroma:i.chroma+r*2+n.hyper*2+c.beat*1.2*Math.min(l,2),uBloomAmt:i.bloom*(1-n.hyper*.5)+r*.45,uAutoExp:m.autoExposure?1:0,uGrain:i.grain,uVignette:i.vignette,uBurstC:[n.burstCX,n.burstCY],uExposure:i.exposure*(1+r*.12-n.hyper*.15),uSat:i.saturation,uContrast:i.contrast+o*.06,uFlash:n.flash,uTransMix:n.transMix,uBurstT:n.burstT,uBeat:c.beat,uInvert:0}}),m.rumble&&v.connected&&c.isBeat&&performance.now()-n.lastHuman<3e4&&v.rumble(Math.min(1,c.bass*.45)*m.rumbleStrength*(.35+r),.15*m.rumbleStrength,70),n.hyperOn&&m.rumble&&Math.random()<t*10&&v.rumble(.25*m.rumbleStrength,.6*m.rumbleStrength,60),ht+=t,ht>1/30&&(ht=0,za()),$e+=t,dt++,$e>.5&&(m.showFps?p("#fps").textContent=`${Math.round(dt/$e)} fps \xB7 out ${k}\xD7${y} \xB7 render ${F.sw}\xD7${F.sh} (${Math.round(L*100)}%)`:p("#fps").textContent="",$e=0,dt=0)}var pe=document.documentElement.style,be=document.getElementById("spec"),me=be?be.getContext("2d"):null;function za(){let a=e=>ma(e).map(t=>Math.round(t*255)).join(",");if(pe.setProperty("--c1",a(0)),pe.setProperty("--c2",a(.33)),pe.setProperty("--c3",a(.66)),pe.setProperty("--bass",Math.min(1.5,c.bass).toFixed(3)),pe.setProperty("--beat",c.beat.toFixed(3)),me&&ze.classList.contains("show")){let e=be.width=be.clientWidth*2,t=be.height=be.clientHeight*2;me.clearRect(0,0,e,t);let i=48,r=e/i,o=me.createLinearGradient(0,0,e,0);o.addColorStop(0,`rgb(${a(0)})`),o.addColorStop(.5,`rgb(${a(.33)})`),o.addColorStop(1,`rgb(${a(.66)})`),me.fillStyle=o;for(let s=0;s<i;s++){let l=c.tex[Math.floor(s/i*400)]/255,f=Math.max(2,l*l*t);me.globalAlpha=.35+l*.6,me.fillRect(s*r+1,t-f,r-2,f)}me.globalAlpha=1}}var Ye=p("#hud");function T(a,e){let t=document.createElement("div");for(t.className="toast",t.innerHTML=`<span class="g">${a}</span><span>${ce(e)}</span>`,Ye.appendChild(t);Ye.children.length>3;)Ye.firstChild.remove();setTimeout(()=>{t.style.opacity=0,setTimeout(()=>t.remove(),450)},1700)}var ea={};function Pt(a,e,t){let i=ea[a];(!i||!i.isConnected)&&(i=document.createElement("div"),i.className="toast",i.innerHTML=`<span class="g">${v.label(a)}</span><span>${e}</span><span class="bar"><i></i></span>`,Ye.appendChild(i),ea[a]=i),i.querySelector("i").style.width=Math.round(t*100)+"%",i.style.opacity=1,clearTimeout(i._t),i._t=setTimeout(()=>{i.style.opacity=0,setTimeout(()=>i.remove(),450)},900)}var ce=a=>String(a).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),ze=p("#ui"),Ke=0;function At(a){n.cinema&&!a||(ze.classList.add("show"),document.body.classList.remove("idle"),clearTimeout(Ke),m.uiAutoHide&&(Ke=setTimeout(()=>{(!ze.matches(":hover")||a==="fromPad")&&tt()},3500)))}function tt(){p("#splash").classList.contains("gone")&&!document.activeElement?.matches("input,select")&&(ze.classList.remove("show"),document.body.classList.add("idle"))}function da(){n.panels=!n.panels,document.body.classList.toggle("panels-off",!n.panels)}window.addEventListener("mousemove",()=>At());ze.addEventListener("mouseleave",()=>{clearTimeout(Ke),m.uiAutoHide&&(Ke=setTimeout(tt,1500))});function Ae(){p("#splash").classList.add("gone"),document.body.classList.add("started")}var Da={addFiles:()=>p("#fileIn").click(),addFolder:()=>p("#folderIn").click(),loopback:async()=>{try{ye(),await c.useLoopback(),Ae(),T("\u{1F50A}","Listening to your PC audio")}catch(a){T("\u26A0",a.message||"Capture cancelled")}},mic:async()=>{try{ye(),await c.useMic(),Ae(),T("\u{1F399}","Listening to microphone")}catch{T("\u26A0","Microphone unavailable")}},demo:()=>{Lt(),Ae()},srcPlayer:()=>{ye(),c.useSource("player"),c.playlist.length&&c.toggle()},prevPreset:()=>le(-1),nextPreset:()=>le(1),mutate:Bt,generate:Ct,save:et,overwrite:Sa,revert:()=>{G(Ee,{quiet:!0}),T("\u21BA","Reverted")},deletePreset:Ma,autopilot:()=>Rt(!m.autopilot),controls:()=>he(!0),fullscreen:Et,playPause:()=>{ye(),c.toggle()},prevTrack:()=>c.prev(),nextTrack:()=>c.next(),shuffle:()=>{c.shuffle=!c.shuffle,Ze()},repeat:()=>{c.repeat={all:"one",one:"off",off:"all"}[c.repeat],Ze()},clearList:()=>{c.clear(),zt()},exportPresets:()=>{let a=new Blob([JSON.stringify(H,null,2)],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(a),e.download="eye-candy-presets.json",e.click()},importPresets:()=>p("#importIn").click(),touchpad:async()=>{let a=await q.request();T("\u25C9",a?"Touchpad on \u2014 swipe to stir the visuals":"No PlayStation controller found"),p("#tpChip").classList.toggle("hidden",a)}};document.addEventListener("click",a=>{let e=a.target.closest("[data-act]");if(!e)return;c.resume();let t=Da[e.dataset.act];t&&t()});function Lt(){Pe||(c.el.pause(),c.stopStream(),c.mode="demo",Pe=Kt(c),c.resume(),ha(),T("\u2726","Demo groove"))}function ye(){Pe&&(Pe(),Pe=null,c.mode==="demo"&&(c.mode="player"))}async function Et(){if(N&&N.setFullscreen){N.setFullscreen(!await N.isFullscreen());return}document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{})}function he(a){Ut(),p("#controls").classList.toggle("hidden",!a)}var Ia=/\.(mp3|flac|wav|ogg|oga|m4a|aac|opus|webm|wma|aiff?)$/i,Ua=a=>({name:a.name.replace(/\.[^.]+$/,""),url:URL.createObjectURL(a),path:N?N.pathFor(a):null});function Ft(a){let e=[...a].filter(t=>Ia.test(t.name)||(t.type||"").startsWith("audio/")).sort((t,i)=>(t.webkitRelativePath||t.name).localeCompare(i.webkitRelativePath||i.name,void 0,{numeric:!0}));if(!e.length)return T("\u26A0","No audio files found");ye(),c.addTracks(e.map(Ua)),Ae(),zt(),T("\u266B",`Added ${e.length} track${e.length>1?"s":""}`)}p("#fileIn").onchange=a=>{Ft(a.target.files),a.target.value=""};p("#folderIn").onchange=a=>{Ft(a.target.files),a.target.value=""};p("#importIn").onchange=async a=>{try{let e=JSON.parse(await a.target.files[0].text()),t=(Array.isArray(e)?e:[e]).filter(i=>i&&i.engine);t.forEach(i=>{i.id="user-"+Math.random().toString(36).slice(2),i.builtin=!1}),H.push(...t),Be(H),W(),T("\u2605",`Imported ${t.length} presets`)}catch{T("\u26A0","Could not read that file")}a.target.value=""};window.addEventListener("dragover",a=>a.preventDefault());window.addEventListener("drop",async a=>{a.preventDefault(),c.resume();let e=[...a.dataTransfer.items||[]],t=[],i=s=>new Promise(l=>{if(s.isFile)s.file(f=>{t.push(f),l()},l);else if(s.isDirectory){let f=s.createReader(),d=[],x=()=>f.readEntries(async g=>{if(g.length)d.push(...g),x();else{for(let P of d)await i(P);l()}},l);x()}else l()}),r=e.map(s=>s.webkitGetAsEntry&&s.webkitGetAsEntry()).filter(Boolean);if(r.length)for(let s of r)await i(s);else t.push(...a.dataTransfer.files);let o=t.find(s=>/\.json$/i.test(s.name));if(o&&t.length===1){p("#importIn").onchange({target:{files:[o],value:""}});return}Ft(t)});function qa(a){return"app://eye/media/"+encodeURIComponent(a)}function zt(){N&&localStorage.setItem("eyecandy.playlist",JSON.stringify(c.playlist.filter(a=>a.path).map(a=>({name:a.name,path:a.path}))))}function Ha(){if(N)try{let a=JSON.parse(localStorage.getItem("eyecandy.playlist")||"[]");c.playlist.push(...a.map(e=>({...e,url:qa(e.path)})))}catch{}}var ta=a=>isFinite(a)?`${Math.floor(a/60)}:${String(Math.floor(a%60)).padStart(2,"0")}`:"0:00";function Ze(){let a=p("#playlist");c.playlist.length?a.innerHTML=c.playlist.map((e,t)=>`<li data-i="${t}" class="${t===c.index&&c.mode==="player"?"cur":""}"><span class="n">${t+1}</span><span class="t">${ce(e.name)}</span><button class="x" data-x="${t}">\u2715</button></li>`).join(""):a.innerHTML='<li class="empty">Drop songs or folders here<br><small>mp3 \xB7 flac \xB7 wav \xB7 ogg \xB7 m4a</small></li>',p("#shuffleBtn").classList.toggle("on",c.shuffle),p("#repeatBtn").textContent={all:"\u21BB Repeat all",one:"\u21BB Repeat one",off:"\u2192 No repeat"}[c.repeat],p("#repeatBtn").classList.toggle("on",c.repeat!=="off"),ha()}p("#playlist").addEventListener("click",a=>{let e=a.target.closest("[data-x]");if(e){c.remove(+e.dataset.x),zt();return}let t=a.target.closest("li[data-i]");t&&(ye(),c.play(+t.dataset.i))});function ha(){let a=c.current,e=c.mode;p("#npTitle").textContent=e==="loopback"?"PC audio":e==="mic"?"Microphone":e==="demo"?"Demo groove":a?a.name:"Nothing playing",p("#npSub").textContent=e==="player"?a?`Track ${c.index+1} of ${c.playlist.length}`:"Drop music anywhere":"Live input",p("#playBtn").textContent=e==="player"&&!c.el.paused?"\u275A\u275A":"\u25B6";for(let[t,i]of[["#srcPlayer","player"],["#srcLoop","loopback"],["#srcMic","mic"],["#srcDemo","demo"]])p(t).classList.toggle("on",e===i)}c.onchange=Ze;var Je=p("#seek"),Dt=!1;Je.addEventListener("input",()=>{Dt=!0});Je.addEventListener("change",()=>{isFinite(c.el.duration)&&(c.el.currentTime=Je.value/1e3*c.el.duration),Dt=!1});p("#vol").value=Math.round(m.volume*100);p("#vol").addEventListener("input",a=>{m.volume=a.target.value/100,c.out.gain.value=m.volume,de()});setInterval(()=>{let a=c.el;!Dt&&isFinite(a.duration)&&(Je.value=a.currentTime/a.duration*1e3),p("#tCur").textContent=ta(a.currentTime),p("#tDur").textContent=ta(a.duration)},250);var vt=new Map;function _a(a){if(a.engine==="milk"){let o=0;for(let s of a.name)o=(o*31+s.charCodeAt(0))%360;return`linear-gradient(90deg,hsl(${o},90%,55%),hsl(${(o+80)%360},90%,50%),hsl(${(o+160)%360},90%,55%))`}let e=JSON.stringify(a.palette);if(vt.has(e))return vt.get(e);let t=Ne(a.palette),i=[];for(let o=0;o<=4;o++){let s=o/4,l=[0,1,2].map(f=>Math.round(255*O(t.a[f]+t.b[f]*Math.cos(6.2831853*(t.c[f]*s+t.d[f])),0,1)));i.push(`rgb(${l})`)}let r=`linear-gradient(90deg,${i.join(",")})`;return vt.set(e,r),r}function W(){let a=p("#search").value.trim().toLowerCase(),e=St(ie),t=p("#presetList");if(p("#milkCat").classList.toggle("hidden",ie!=="milk"),ie==="milk"&&!_){t.innerHTML='<li class="msg">Loading MilkDrop library\u2026</li>',se().then(()=>{Na(),W()});return}if(ie==="user"&&!e.length){t.innerHTML=`<li class="msg">No saved presets yet.<br>Press \u2605 Save (or ${v.label("Y")} on the controller) to keep the current look.</li>`;return}let i=[];for(let o=0;o<e.length;o++){let s=e[o];if(a&&!s.name.toLowerCase().includes(a))continue;let l=s.engine==="milk"?"MilkDrop":oe[s.scene]?.name||"";if(i.push(`<li data-i="${o}" class="${s.id===u.id?"cur":""}"><span class="sw" style="background:${_a(s)}"></span><span class="nm">${ce(s.name)}</span><span class="s">${ce(l)}</span></li>`),i.length>3e3)break}t.innerHTML=i.join("");let r=t.querySelector(".cur");r&&!t.matches(":hover")&&r.scrollIntoView({block:"nearest"})}p("#presetList").addEventListener("click",a=>{let e=a.target.closest("li[data-i]");e&&(V=+e.dataset.i,G(St(ie)[V]))});p("#search").addEventListener("input",W);function Na(){let a=p("#milkCat"),e=Object.keys(Me).sort(),t=De("all").length;a.innerHTML=`<option value="all">All MilkDrop (${t})</option><option value="classic">Classic Butterchurn (${We.length})</option>`+e.map(i=>`<option value="${i}">${i} (${Me[i].length})</option>`).join(""),a.value=Se}p("#milkCat").addEventListener("change",a=>{Se=a.target.value,V=-1,W()});we(".cbtn").forEach(a=>a.onclick=()=>{we(".cbtn").forEach(e=>e.classList.toggle("on",e===a)),ie=a.dataset.coll,V=-1,W()});we(".tab").forEach(a=>a.onclick=()=>{we(".tab").forEach(e=>e.classList.toggle("on",e===a)),we(".tabpage").forEach(e=>e.classList.toggle("on",e.id==="tab-"+a.dataset.tab)),a.dataset.tab==="tweak"&&Q()});var aa=[["trail","Tracers",0,.97],["zoom","Tunnel Zoom",.96,1.06],["spin","Spin",-.03,.03],["warp","Warp",0,2],["breathe","Breathing",0,2],["melt","Melt",0,2],["hueDrift","Color Drift",-.05,.05],["hueSpin","Hue Cycle",-.3,.3],["kaleido","Kaleidoscope",0,16,1],["kaleidoSpin","Kaleido Spin",-1,1],["mirror","Mirror",0,1,1],["fusion","MilkDrop Fusion",0,1],["react","Audio Reactivity",0,2.5],["speed","Speed",0,3],["chroma","Chromatic",0,3],["bloom","Bloom",0,2],["exposure","Exposure",.4,2],["saturation","Saturation",0,2],["contrast","Contrast",.6,1.6],["grain","Film Grain",0,1],["vignette","Vignette",0,1.5],["#","Music motion"],["dance","Shape Dance",0,2.5],["ripple","Beat Ripples",0,2.5],["punch","Bass Punch",0,2.5],["shake","Beat Shake",0,2.5],["swirlA","Audio Swirl",0,2.5],["bulgeA","Bass Bulge",0,2.5]];p("#sceneSel").innerHTML=K.map(a=>`<option value="${a.id}">${a.name}</option>`).join("")+'<option value="__milk">MilkDrop engine</option>';p("#palSel").innerHTML=X.map((a,e)=>`<option value="${e}">${a.name}</option>`).join("")+'<option value="custom">Custom (generated)</option>';function ia(a,e,t,i,r,o,s){let l=document.createElement("div");l.className="sl "+(o||"");let f=r||(t-e)/400;l.innerHTML=`<span title="${ce(a)}">${ce(a)}</span><input type="range" min="${e}" max="${t}" step="${f}" value="${i}"><span class="v"></span>`;let d=l.querySelector("input"),x=l.querySelector(".v"),g=()=>x.textContent=(+d.value).toFixed(r===1?0:2);return g(),d.addEventListener("input",()=>{g(),s(+d.value),xe()}),l._set=P=>{document.activeElement!==d&&(d.value=P,g())},l}var xt={},gt=[];function Q(){if(!p("#tab-tweak").classList.contains("on"))return;if(p("#pName").value=u.name,p("#sceneSel").value=u.engine==="milk"?"__milk":u.scene,p("#palSel").value=typeof u.palette=="number"?String(u.palette):"custom",p("#milkRow").classList.toggle("hidden",!(u.engine==="milk"||u.fx.fusion>0)),_){let o=De("all");p("#milkSel").options.length!==o.length&&(p("#milkSel").innerHTML=o.map(s=>`<option>${ce(s)}</option>`).join(""))}_&&(p("#milkSel").value=u.engine==="milk"?u.milk:ve||"");let a=p("#paramSliders"),e=oe[u.scene],t=u.engine+":"+u.scene;a._key!==t?(a._key=t,a.innerHTML="",gt=[],u.engine==="scene"&&e?(e.params.forEach((o,s)=>{let l=ia(o.n,o.min,o.max,u.params[s],0,(e.stick||[]).includes(s)?"stick":"",f=>{u.params[s]=f});gt.push(l),a.appendChild(l)}),p("#stickNames").textContent=(e.stick||[0,1]).map(o=>e.params[o].n).join(" & ")):(a.innerHTML='<p class="fine">MilkDrop presets carry their own math \u2014 shape them with the Trip FX below, the triggers, and the kaleidoscope.</p>',p("#stickNames").textContent="\u2014")):gt.forEach((o,s)=>o._set(u.params[s]));let i=p("#fxSliders");i.children.length?aa.forEach(([o])=>{xt[o]&&xt[o]._set(u.fx[o]??te[o]??0)}):aa.forEach(([o,s,l,f,d])=>{if(o==="#"){let g=document.createElement("h3");g.textContent=s,i.appendChild(g);return}let x=ia(s,l,f,u.fx[o]??0,d,"",g=>{u.fx[o]=g,o==="fusion"&&g>0&&se().then(()=>{ve||Re(Qe()),p("#milkRow").classList.remove("hidden"),Q()})});xt[o]=x,i.appendChild(x)});let r=H.some(o=>o.id===u.id);p("#overwriteBtn").classList.toggle("hidden",!r),p("#deleteBtn").classList.toggle("hidden",!r)}p("#pName").addEventListener("change",a=>{u.name=a.target.value,p("#presetName").textContent=u.name});p("#sceneSel").addEventListener("change",a=>{let e=a.target.value;if(e==="__milk"){se().then(()=>G(kt(ve||Qe())));return}let t=oe[e];G({...u,id:"edit-"+Date.now(),engine:"scene",scene:e,params:t.params.map(i=>i.def),name:t.name+" (custom)",builtin:!1},{quiet:!0})});p("#palSel").addEventListener("change",a=>{a.target.value!=="custom"&&(u.palette=+a.target.value)});p("#milkSel").addEventListener("change",a=>{let e=a.target.value;u.engine==="milk"?(u.milk=e,u.name=e,p("#presetName").textContent=e):u.milk=e,Re(e)});var Ga=[["#","Display"],["resolution","Output resolution","select",{native:"Native (match screen)",2160:"4K \xB7 2160p",1440:"1440p",1080:"1080p",900:"900p",720:"720p",540:"540p (potato mode)"}],["renderScale","Render scale","select",{auto:"Auto (adaptive)","0.5":"50%","0.67":"67%","0.75":"75%","0.85":"85%",1:"100%","1.25":"125% \xB7 supersampled","1.5":"150% \xB7 supersampled",2:"200% \xB7 supersampled"}],["fpsCap","Frame rate cap","select",{0:"Unlimited (VSync)",144:"144 fps",120:"120 fps",60:"60 fps",30:"30 fps"}],["autoExposure","Auto exposure","toggle","Keeps every preset from blowing out to white (or sinking to black)"],["startFullscreen","Start in fullscreen","toggle","Open straight into fullscreen next launch"],["uiScale","Interface size","range",[.75,1.5,.05,"\xD7"]],["uiAutoHide","Auto-hide interface","toggle","Panels fade away when you are not using the mouse"],["showFps","Show FPS & resolution","toggle",""],["#","Music reaction"],["reactIntensity","Reaction intensity","range",[0,3,.05,"\xD7"]],["idleDance","Music dance","toggle","Shapes, lens and camera always move with the music \u2014 your controller adds on top"],["beatRipples","Beat ripples","toggle","Every kick sends a shockwave through the image"],["beatPulse","Bass punch","range",[0,2,.05,"\xD7"]],["beatFlash","Drop flashes","range",[0,1,.05,""]],["cameraShake","Beat shake","range",[0,1.5,.05,""]],["beatSens","Beat sensitivity","range",[0,2,.05,""]],["gainBass","Bass gain","range",[0,3,.05,"\xD7"]],["gainMid","Mid gain","range",[0,3,.05,"\xD7"]],["gainHigh","Treble gain","range",[0,3,.05,"\xD7"]],["outputDevice","Audio output","select",{default:"System default"}],["#","Autopilot"],["autopilot","Autopilot","toggle","Keeps changing presets on its own, even while you play"],["autoPause","Pause autopilot while I play","toggle","Hold the current preset while you are using the controller"],["autoInterval","Time per preset","range",[8,120,1,"s"]],["autoSource","Autopilot plays","select",{mix:"Everything mixed",eye:"Eye Candy presets",flux:"Flux engine",generate:"Fresh generated presets",milk:"MilkDrop library",user:"My presets",all:"Eye Candy + MilkDrop"}],["autoOnDrop","Switch on drops","toggle","Jump to a new preset when the beat drops"],["idle","Resume after I stop playing","range",[3,120,1,"s"]],["transition","Transition length","range",[.2,4,.1,"s"]],["#","Controller"],["stickSens","Stick sensitivity","range",[.3,2.5,.05,"\xD7"]],["invertY","Invert Y axis","toggle",""],["deadzone","Stick deadzone","range",[0,.4,.01,""]],["rumble","Rumble","toggle","Feel the bass in your hands"],["rumbleStrength","Rumble strength","range",[0,1,.05,""]],["touchMode","PS touchpad / right-drag","select",{both:"Vortex + paint light",vortex:"Vortex only",paint:"Paint light only",off:"Off"}],["@touchpad"]],ge={deadzone:a=>v.deadzone=a,uiScale:a=>pe.setProperty("--ui",a),outputDevice:a=>c.setOutput(a).then(e=>T("\u{1F508}",e?"Audio output changed":"Could not switch output")),renderScale:()=>{re=.8},autopilot:a=>p("#autoBtn").classList.toggle("on",a)};async function Oa(a){try{(await navigator.mediaDevices.enumerateDevices()).filter(t=>t.kind==="audiooutput"&&t.deviceId!=="default").forEach(t=>{let i=document.createElement("option");i.value=t.deviceId,i.textContent=t.label||"Output "+t.deviceId.slice(0,5),a.appendChild(i)}),a.value=m.outputDevice}catch{}}function It(){let a=p("#settingsForm");a.innerHTML="";for(let[e,t,i,r]of Ga){if(e==="#"){let s=document.createElement("h3");s.className="sethead",s.textContent=t,a.appendChild(s);continue}let o=document.createElement("div");if(o.className="set",e==="@touchpad"){o.innerHTML=`<div>PS touchpad<div class="d" id="tpStatus">${ce(q.status)}</div></div><button class="mini" id="tpBtn">${q.connected?"Reconnect":"Connect"}</button>`,o.querySelector("#tpBtn").onclick=async()=>{let s=await q.request();T("\u25C9",s?"Touchpad connected \u2014 swipe to stir the visuals":"No PlayStation controller found")},a.appendChild(o);continue}if(i==="toggle")o.innerHTML=`<div>${t}<div class="d">${r}</div></div><div class="toggle ${m[e]?"on":""}"></div>`,o.querySelector(".toggle").onclick=s=>{m[e]=!m[e],s.target.classList.toggle("on",m[e]),de(),ge[e]&&ge[e](m[e])};else if(i==="select"){o.innerHTML=`<div>${t}</div><select>${Object.entries(r).map(([l,f])=>`<option value="${l}" ${String(m[e])===l?"selected":""}>${f}</option>`).join("")}</select>`;let s=o.querySelector("select");e==="outputDevice"&&Oa(s),s.onchange=l=>{m[e]=l.target.value,de(),ge[e]&&ge[e](m[e])}}else{let[s,l,f,d]=r;o.innerHTML=`<div>${t} <span class="d">${m[e]}${d}</span></div><input type="range" min="${s}" max="${l}" step="${f}" value="${m[e]}">`,o.querySelector("input").oninput=x=>{m[e]=+x.target.value,o.querySelector(".d").textContent=m[e]+d,de(),ge[e]&&ge[e](m[e])}}a.appendChild(o)}}q.onstatus=a=>{let e=document.getElementById("tpStatus");e&&(e.textContent=a),q.connected&&T("\u25C9",a)};function Ut(){let a=t=>`<span class="k">${v.label(t)}</span>`,e=[["Left stick","Steer","Fly the camera / drag the trails"],["Right stick","Morph","Bend the two \u25C9 shape params live"],[a("LT"),"Warp","Squeeze into infinite feedback tunnels"],[a("RT"),"Drive","Overdrive audio reaction, bloom & speed"],[a("LT")+"+"+a("RT"),"Hyperdrive","Both triggers fully \u2014 hold on"],[a("LB"),"Kaleidoscope","Tap to cycle \xB7 hold for mirror world"],[a("RB"),"Palette","Tap next colors \xB7 hold to spin hues"],["\u25C0 \u25B6","Presets","Previous / next look"],["\u25B2 \u25BC","Time","Speed up, slow down, even reverse"],[a("A"),"Burst","Shockwave + flash. Hit it on the beat"],[a("B"),"Freeze","Hold to stop time while trails melt on"],[a("X"),"Randomize","Tap remix \xB7 hold for a brand-new preset"],[a("Y"),"Save","Keep this exact look in My Presets"],[a("L3"),"Reset view","Click left stick"],[a("R3"),"Lock shape","Click right stick to keep the morph"],[a("START"),"Menu","Show / hide the panels"],[a("BACK"),"This guide","Hold to toggle autopilot"],["Touchpad","Stir (PS)","Swipe to swirl & paint \xB7 pinch/twist \xB7 click = Music dance on/off"]];p("#cgrid").innerHTML=e.map(([t,i,r])=>`<div class="cg"><span class="k">${t.startsWith("<")?t.replace(/<\/?span[^>]*>/g,""):t}</span><div><b>${i}</b><small>${r}</small></div></div>`).join(""),we("[data-g]").forEach(t=>t.textContent=v.label(t.dataset.g))}p("#controls").addEventListener("click",a=>{a.target.id==="controls"&&he(!1)});window.addEventListener("keydown",a=>{if(a.target.matches("input,select,textarea"))return;xe(),c.resume();let e=a.key;e==="ArrowRight"?le(1):e==="ArrowLeft"?le(-1):e==="ArrowUp"?je(1):e==="ArrowDown"?je(-1):e===" "?(a.preventDefault(),Fe(1)):e==="r"||e==="R"?Bt():e==="g"||e==="G"?Ct():e==="s"||e==="S"?et():e==="k"||e==="K"?ua():e==="m"||e==="M"?fa():e==="p"||e==="P"?ca(1):e==="f"||e==="F"||e==="F11"?(a.preventDefault(),Et()):e==="h"||e==="H"?(n.cinema=!n.cinema,n.cinema?tt():At(),T("H",n.cinema?"Interface hidden (H to show)":"Interface on")):e==="Tab"?(a.preventDefault(),da()):e==="a"||e==="A"?Rt(!m.autopilot):e==="c"||e==="C"?he(p("#controls").classList.contains("hidden")):e==="Escape"?he(!1):e==="MediaPlayPause"?c.toggle():e==="MediaTrackNext"?c.next():e==="MediaTrackPrevious"&&c.prev()});var Te=null;ae.addEventListener("contextmenu",a=>a.preventDefault());ae.addEventListener("pointerdown",a=>{if(a.button===2){ne.active=!0,ne.x=a.clientX/innerWidth,ne.y=a.clientY/innerHeight;return}if(a.button===1){Fe(1,(a.clientX/innerWidth-.5)*innerWidth/innerHeight,.5-a.clientY/innerHeight);return}Te={x:a.clientX,y:a.clientY},xe()});window.addEventListener("pointerup",a=>{a.button===2&&(ne.active=!1)});window.addEventListener("pointermove",a=>{ne.active&&(ne.x=a.clientX/innerWidth,ne.y=a.clientY/innerHeight)});window.addEventListener("pointerup",()=>Te=null);window.addEventListener("pointermove",a=>{Te&&(n.camX+=(a.clientX-Te.x)*.004,n.camY=O(n.camY+(a.clientY-Te.y)*.003,-1.3,1.3),Te={x:a.clientX,y:a.clientY},xe())});ae.addEventListener("wheel",a=>{u.fx.trail=O(u.fx.trail-a.deltaY*8e-4,0,.97),Pt("LT","Tracers",u.fx.trail/.97),xe(),Q()},{passive:!0});ae.addEventListener("dblclick",Et);pe.setProperty("--ui",m.uiScale);N&&m.startFullscreen&&N.setFullscreen&&N.setFullscreen(!0);m.outputDevice!=="default"&&c.setOutput(m.outputDevice);q.autoConnect();N||document.querySelectorAll("[data-act=loopback]").forEach(a=>{a.innerHTML=a.classList.contains("src")?"Tab/PC":"\u{1F50A} Visualize a tab or PC audio",a.title="Pick a tab (e.g. YouTube/Spotify web) or your whole screen and tick \u201CShare audio\u201D"});Ha();Ze();It();W();Ut();p("#autoBtn").classList.toggle("on",m.autopilot);p("#presetName").textContent=u.name;ie="eye";V=Math.floor(Math.random()*Le.length);G(Le[V],{transition:!1,quiet:!0});var bt=K.map(a=>a.id),yt=0;(function a(){if(yt>=bt.length){p("#loadbar").style.opacity=0;return}F.sceneProg(bt[yt++]),p("#loadbar div").style.width=yt/bt.length*100+"%",setTimeout(a,0)})();requestAnimationFrame(pa);window.__eye={get milkCanvas(){return J},getMilkPreset:ra,ensureMilk:se,get milk(){return _},milkNamesFor:De,startDemoGroove:Lt,R:F,audio:c,L:n,get cur(){return u},loadPreset:G,BUILTIN:fe,SCENES:K,settings:m};})();
