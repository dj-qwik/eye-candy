(()=>{var St=`#version 300 es
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
float vn(vec2 p){ return vnoise(p); }
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
#ifndef SS
#define SS 1
#endif
void main(){
  vec4 c=vec4(0,0,0,1);
#if SS>=4
  const vec2 O[4]=vec2[4](vec2(.125,.375),vec2(.375,-.125),vec2(-.125,-.375),vec2(-.375,.125));
  vec3 acc=vec3(0); for(int i=0;i<4;i++){ mainImage(c, gl_FragCoord.xy+O[i]); acc+=any(isnan(c.rgb))||any(isinf(c.rgb))?vec3(0):max(c.rgb,0.); } fragColor=vec4(acc*.25,1.);
#elif SS>=2
  vec3 acc=vec3(0); mainImage(c, gl_FragCoord.xy+vec2(.25,.25)); acc+=any(isnan(c.rgb))?vec3(0):max(c.rgb,0.); mainImage(c, gl_FragCoord.xy-vec2(.25,.25)); acc+=any(isnan(c.rgb))?vec3(0):max(c.rgb,0.); fragColor=vec4(acc*.5,1.);
#else
  mainImage(c, gl_FragCoord.xy); fragColor=vec4((any(isnan(c.rgb))||any(isinf(c.rgb)))?vec3(0):max(c.rgb,0.),1.);
#endif
}
`,Ue=[],F=a=>Ue.push(a);F({fly:!0,id:"cathedral",name:"Fractal Cathedral",params:[{n:"Fold",min:.2,max:1.6,def:.85},{n:"Twist",min:0,max:1.5,def:.45},{n:"Scale",min:1.25,max:1.75,def:1.48},{n:"Glow",min:0,max:3,def:1.2},{n:"Flight",min:0,max:3,def:1},{n:"Tunnel",min:.2,max:1.4,def:.6},{n:"Pulse",min:0,max:2,def:1},{n:"Color Spread",min:0,max:2,def:.6}],stick:[0,1],code:`
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
}`});F({id:"nebula",name:"Nebula Tunnel",params:[{n:"Speed",min:0,max:4,def:1.2},{n:"Depth",min:.1,max:1.5,def:.55},{n:"Turbulence",min:.5,max:5,def:2.2},{n:"Ring Pulse",min:0,max:3,def:1.2},{n:"Stars",min:0,max:2,def:1},{n:"Spin",min:-1,max:1,def:.15},{n:"Brightness",min:.3,max:3,def:1.3},{n:"Petals",min:0,max:8,def:0}],stick:[2,1],code:`
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
}`});F({id:"julia",name:"Julia Bloom",params:[{n:"Seed Angle",min:0,max:6.283,def:2.1},{n:"Zoom",min:.4,max:4,def:1},{n:"Color Rate",min:.1,max:3,def:1},{n:"Audio Morph",min:0,max:2,def:.8},{n:"Trap Glow",min:0,max:3,def:1.2},{n:"Seed Radius",min:.6,max:.82,def:.7885,ms:.4},{n:"Swirl",min:-1,max:1,def:.1},{n:"Symmetry",min:1,max:8,def:1}],stick:[0,5],code:`
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
}`});F({fly:!0,id:"gyroid",name:"Gyroid Hyperspace",params:[{n:"Lattice",min:.8,max:5,def:2.2},{n:"Velocity",min:0,max:5,def:1.8},{n:"Thickness",min:.01,max:.3,def:.06},{n:"Glow",min:0,max:3,def:1.2},{n:"Detail",min:0,max:1,def:.4},{n:"Breath",min:0,max:2,def:1},{n:"Fog",min:.02,max:.3,def:.09},{n:"Hue Flow",min:0,max:2,def:.5}],stick:[0,2],code:`
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
}`});F({id:"chrome",name:"Liquid Chrome",params:[{n:"Blobs",min:2,max:8,def:6},{n:"Merge",min:.1,max:1.2,def:.55},{n:"Ripple",min:0,max:1,def:.35},{n:"Lights",min:2,max:20,def:7},{n:"Orbit",min:.3,max:2,def:1},{n:"Bass Swell",min:0,max:2,def:1},{n:"Iridescence",min:0,max:2,def:1},{n:"Env Bright",min:.3,max:2,def:1}],stick:[1,2],code:`
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
}`});F({landscape:!0,id:"horizon",name:"Neon Horizon",params:[{n:"Grid Speed",min:0,max:4,def:1.2},{n:"Sun Size",min:.1,max:.6,def:.32},{n:"Mountains",min:0,max:2,def:1},{n:"Grid Density",min:2,max:20,def:8},{n:"Terrain Warp",min:0,max:2,def:.6},{n:"Stars",min:0,max:2,def:1},{n:"Sun Stripes",min:0,max:24,def:10},{n:"Glow",min:.3,max:3,def:1.2}],stick:[4,2],code:`
float fbmN(vec2 p, int N){ float a=.5, s=0.; for(int i=0;i<5;i++){ if(i>=N) break; s+=a*vnoise(p); p=rot(.5)*p*2.03+11.7; a*=.5; } return s; }
float terr(vec2 p){
  float x=abs(p.x);
  float wob=sin(p.y*.3+p.x*.2)*.06*P4;
  float side=smoothstep(1.6,7.,x);
  if(side<=0.) return wob;                                 // flat neon road: no noise needed
  float spec=fft(clamp((x-1.2)*.07,0.,1.));
  float n=fbmN(p*.22,3)*1.1+fbmN(p*.9,2)*.25*P4;
  return side*(n*.35+spec*.75*P2)*(.85+uBass*.15)+wob;
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
  // terrain march: start at the highest point the mountains can reach, take bigger steps, then bisect to the surface
  float maxH=(1.1+.25*P4)*.35*(1.+uBass*.15)*.8+.75*P2*(1.+uBass*.15)+.06*P4+.02;
  float t=.1, tmax=60.; bool hit=false;
  if(ro.y>maxH){ if(rd.y>=0.) tmax=0.; else t=max(t,(ro.y-maxH)/-rd.y); }
  else if(rd.y>0.) tmax=min(tmax,(maxH-ro.y)/rd.y);
  float tp=t;
  for(int i=0;i<64;i++){ if(t>tmax) break;
    vec3 p=ro+rd*t; float h=p.y-terr(p.xz);
    if(h<.002*t){hit=true;break;}
    tp=t; t+=max(h*.6,.004*t);
  }
  if(hit){ for(int j=0;j<5;j++){ float tm=(tp+t)*.5; vec3 p=ro+rd*tm; if(p.y-terr(p.xz)<.002*tm) t=tm; else tp=tm; } }
  if(hit){
    vec3 skyc=col;
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
    col=mix(col,skyc,smoothstep(9.,21.,t));                 // the far grid dissolves into the sunset
  }
  c=vec4(col,1);
}`});F({crisp:!0,id:"mandala",name:"Spectral Mandala",params:[{n:"Symmetry",min:3,max:24,def:12},{n:"Rings",min:1,max:10,def:6},{n:"Petal Size",min:0,max:1,def:.5},{n:"Line Width",min:.5,max:4,def:1.5},{n:"Spin",min:-1,max:1,def:.12},{n:"Wave Ring",min:0,max:2,def:1},{n:"Lace",min:0,max:2,def:1},{n:"Zoom",min:.5,max:2.5,def:1}],stick:[0,2],code:`
float crisp(float d, float w){ float aa=fwidth(d)*1.2+1e-5; return 1.-smoothstep(w-aa,w+aa,abs(d)); }
float fillv(float d){ float aa=fwidth(d)+1e-5; return smoothstep(aa,-aa,d); }
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)/P7*1.42; uv*=rot(uCam.x*.3);
  float r=length(uv), a0=atan(uv.y,uv.x);
  float N=floor(P0), seg=TAU/N;
  float lw=.0011*P3;
  vec3 col=pal(.72)*.05*smoothstep(.9,0.,r)+pal(.2)*.02;
  float K=floor(P1);
  // tiers are painted outside-in so inner jewels sit on top
  for(int i=9;i>=0;i--){ if(float(i)>=K) continue;
    float fk=float(i)/max(K-1.,1.);
    float ri=.075+fk*.5;
    float band=fft(fk*.75+.02);
    float sc=1.+band*.12*(1.+uDrive)+uBeat*.02;
    float dir=mod(float(i),2.)*2.-1.;
    float a=a0+uTime*P4*.35*dir/(1.+fk*1.5);
    float am=mod(a+seg*.5,seg)-seg*.5, aa=abs(am);
    vec2 q=r*vec2(cos(aa),sin(aa));
    float R=ri*sc;
    float m=mod(float(i),4.), d;
    if(m<.5){ float pr=R*sin(seg*.5)*(.55+.9*P2); d=length(q-vec2(R,0.))-pr; }             // petals
    else if(m<1.5){ d=r-R-.012*R*cos(aa*N*2.)*(1.+band*2.); }                                    // scalloped ring
    else if(m<2.5){ d=length(q-vec2(R,0.))-(.008+.012*band)*(1.+fk); }                           // bead ring
    else { d=sdSeg(q,vec2(R-.035,0.),vec2(R+.04+band*.06,0.))-.004*(1.+band); }                  // star points
    vec3 tc=pal(fk*.7+uTime*.015+band*.15);
    float shade=.45+.9*smoothstep(-.04,0.,d);                                      // fills glow toward their rim
    col=mix(col,tc*(.1+band*.5)*shade+tc*.05,fillv(d)*.93);
    col+=tc*1.15*crisp(d,lw)+tc*.45*crisp(d+.007,lw*.6)+tc*exp(-abs(d)*90.)*.16*band;   // double ornamental outline
    col+=tc*.22*crisp((seg*.5-aa)*r,lw*.5)*smoothstep(R+.06,R-.06,r)*smoothstep(.04,.1,r);  // fine spokes
    // lace filigree inside each tier
    float lace=abs(sin(q.x*70.*P6+uTime*.5)*sin(q.y*70.*P6));
    col+=tc*crisp(lace,.04)*.18*P6*fillv(d)*(.4+band);
  }
  // centre jewel
  float cj=r-(.045+uBass*.015);
  col=mix(col,pal(.05)*(.6+uBass*.6),fillv(cj));
  col+=pal(.1)*crisp(cj,lw*1.5)+pal(0.)*exp(-r*28.)*(.5+uBeat);
  // outer oscilloscope ring
  float wr=.64+wav(a0/TAU+.5)*.035*P5*(1.+uDrive);
  col+=pal(.1+a0/TAU)*(crisp(r-wr,lw)+exp(-abs(r-wr)*160.)*.25)*P5;
  col*=smoothstep(.9,.66,r)*.85+.15*smoothstep(1.2,.6,r);
  c=vec4(col,1);
}`});F({id:"silk",name:"Silk Warp",params:[{n:"Scale",min:.5,max:6,def:2.2},{n:"Warp",min:0,max:3,def:1.2},{n:"Color Rate",min:.2,max:3,def:1.1},{n:"Flow",min:0,max:2,def:.6},{n:"Sheen",min:0,max:3,def:1.2},{n:"Bass Warp",min:0,max:2,def:1},{n:"Contrast",min:.5,max:3,def:1.4},{n:"Marble",min:0,max:1,def:0}],stick:[1,0],code:`
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
}`});F({id:"apollo",name:"Apollonian Dream",params:[{n:"Inversion",min:1,max:1.5,def:1.18,ms:.35},{n:"Orbit Speed",min:0,max:2,def:.6},{n:"Glow",min:0,max:3,def:1},{n:"Color Rate",min:.2,max:4,def:1.5},{n:"Distance",min:.5,max:3,def:1.4},{n:"Bass Breathe",min:0,max:1,def:.4},{n:"Fog",min:0,max:1,def:.3},{n:"Light",min:.3,max:2,def:1}],stick:[0,4],code:`
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
}`});F({id:"voronoi",name:"Stained Voronoi",params:[{n:"Cells",min:2,max:20,def:6},{n:"Motion",min:0,max:2,def:.7},{n:"Lead Width",min:0,max:.2,def:.05},{n:"Edge Glow",min:0,max:3,def:1.2},{n:"Audio Light",min:0,max:3,def:1.5},{n:"Layers",min:0,max:1,def:.5},{n:"Swirl",min:0,max:2,def:.4},{n:"Facets",min:0,max:1,def:.6}],stick:[0,6],code:`
vec4 vor(vec2 p, float t){
  vec2 n=floor(p), f=fract(p); float F1=8., F2=8.; vec2 id=vec2(0), mr=vec2(0);
  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
    vec2 g=vec2(i,j); vec2 o=h22(n+g); o=.5+.5*sin(t+TAU*o);
    vec2 r=g+o-f; float d=length(r);
    if(d<F1){F2=F1;F1=d;id=n+g;mr=r;} else if(d<F2) F2=d;
  }
  return vec4(F1,F2,id);
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc); float r=length(uv);
  vec2 wv=uv*rot(r*P6*(1.+uBass*.5)*.8+uCam.x); wv+=vec2(0,uCam.y);
  vec2 P=wv*P0;
  vec4 v=vor(P, uTime*P1);
  float id=h21(v.zw);
  float edge=v.y-v.x;
  float k=fft(id);
  // backlight: a slow-moving sun behind the window plus soft cloud light
  vec2 sun=vec2(sin(uTime*.07)*.6,cos(uTime*.05)*.35);
  float back=.35+.9*exp(-length(uv-sun)*1.6)+.35*fbm(uv*1.4+uTime*.05);
  // glass: tinted, streaky, slightly domed facets
  float streak=.75+.25*fbm(vec2(P.x*3.,P.y*14.)+id*9.);
  float dome=mix(1.,.65+.35*smoothstep(0.,.5,v.x*2.),P7);
  vec3 glass=pal(id+uTime*.015)*back*streak*dome*(.35+k*P4*.8);
  // bevel highlight along each pane's inner edge
  float lw=P2*.6;
  float bev=smoothstep(lw+.12,lw,edge)*smoothstep(lw-.005,lw+.02,edge);
  glass+=pal(id+.5)*bev*.35*P3*(.6+k);
  // lead came: dark metal with a specular ridge
  float aa=fwidth(edge)+1e-4;
  float lead=1.-smoothstep(lw-aa,lw+aa,edge);
  float ridge=1.-abs(edge/max(lw,1e-3)-.5)*2.;
  vec3 leadc=vec3(.035,.035,.045)+vec3(.35,.33,.3)*pow(max(ridge,0.),6.)*(.5+.5*back)*.6;
  vec3 col=mix(glass,leadc,lead);
  // second, finer layer of cracks / panes
  vec4 v2=vor(P*2.3+7., -uTime*P1*.7);
  float e2=v2.y-v2.x;
  col*=1.-P5*.5*(1.-smoothstep(0.,.03,e2));
  // god rays through the glass
  float ang=atan(uv.y-sun.y,uv.x-sun.x);
  col+=pal(.1)*pow(vn(vec2(ang*9.,uTime*.2)),4.)*exp(-length(uv-sun)*1.2)*.35*(1.+uBeat*.6);
  c=vec4(col,1);
}`});F({id:"wavefield",name:"Neon Wavefield",params:[{n:"Scroll",min:0,max:2,def:.35},{n:"Peak Height",min:0,max:2,def:1},{n:"Line Glow",min:.3,max:3,def:1.2},{n:"Spread",min:.2,max:1.5,def:.6},{n:"Wave Mix",min:0,max:1,def:.3},{n:"Fill",min:0,max:1,def:.85},{n:"Hue Depth",min:0,max:2,def:.8},{n:"Horizon",min:-.3,max:.3,def:.05}],stick:[1,3],code:`
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
    float y=yb+(f*.9*P1+wav(x*.3+fi)*.05*P4)*env*sqrt(persp)*.2+(vn(vec2(x*4.,fi*20.))*.75+vn(vec2(x*9.,fi*31.))*.25)*.02*env;
    if(uv.y<y) col*=1.-P5*smoothstep(0.,.02,y-uv.y);
    float d=uv.y-y;
    if(abs(d)>.25) continue;                                  // far from this line: its glow is negligible
    col+=pal(z*P6+f*.3+uTime*.02)*glowLine(d,.0028*persp)*.3*P2*(.35+env)*(1.-z*.7)*(1.+uBeat*.5);
  }
  c=vec4(col,1);
}`});F({id:"starcore",name:"Star Core",params:[{n:"Plasma Scale",min:.5,max:5,def:2},{n:"Churn",min:0,max:3,def:1},{n:"Filaments",min:.2,max:3,def:1.2},{n:"Corona",min:0,max:3,def:1.2},{n:"Rays",min:0,max:3,def:1},{n:"Bass Flare",min:0,max:2,def:1},{n:"Core Heat",min:0,max:3,def:1.3},{n:"Size",min:.5,max:1.6,def:1}],stick:[0,3],code:`
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
}`});F({ss:2,id:"flower",name:"Flower of Life",params:[{n:"Lattice Scale",min:1,max:8,def:3},{n:"Rotation",min:-1,max:1,def:.08},{n:"Metatron",min:0,max:2,def:1},{n:"Line Width",min:.5,max:4,def:1.4},{n:"Layer Count",min:1,max:5,def:3},{n:"Bloom Pulse",min:0,max:2,def:1},{n:"Fill",min:0,max:1,def:.35},{n:"Depth Drift",min:0,max:2,def:.6}],stick:[0,7],code:`
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
}`});F({ss:2,id:"fall",name:"Endless Fall",params:[{n:"Fall Speed",min:-2,max:3,def:.8},{n:"Spiral",min:0,max:2,def:.6},{n:"Arms",min:1,max:12,def:5},{n:"Tile Detail",min:1,max:6,def:3},{n:"Glow",min:0,max:3,def:1.2},{n:"Audio Rings",min:0,max:3,def:1.2},{n:"Fractal Bite",min:0,max:1,def:.5},{n:"Twist Pulse",min:0,max:2,def:.6}],stick:[1,2],code:`
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
}`});F({ss:2,id:"hyper",name:"Hyperbolic Temple",params:[{n:"P (sides)",min:3,max:8,def:5},{n:"Q (meet)",min:3,max:8,def:4},{n:"Drift",min:0,max:2,def:.5},{n:"Line Glow",min:0,max:3,def:1.2},{n:"Cell Color",min:0,max:2,def:1},{n:"Spin",min:-1,max:1,def:.1},{n:"Disk Zoom",min:.6,max:1.6,def:1},{n:"Audio Fill",min:0,max:3,def:1.2}],stick:[2,6],code:`
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
}`});F({ss:2,id:"burst",name:"Supernova Burst",params:[{n:"Shards",min:20,max:200,def:90},{n:"Burst Force",min:0,max:3,def:1.3},{n:"Shell Count",min:1,max:6,def:3},{n:"Trail",min:0,max:2,def:1},{n:"Core",min:0,max:3,def:1.2},{n:"Spin",min:-1,max:1,def:.1},{n:"Shimmer",min:0,max:2,def:1},{n:"Warp",min:0,max:2,def:.5}],stick:[1,7],code:`
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
}`});F({ss:2,id:"fold",name:"Origami Fold",params:[{n:"Fold Angle",min:0,max:3.14,def:.3},{n:"Iterations",min:3,max:14,def:10},{n:"Scale",min:1.1,max:1.8,def:1.33,ms:.5},{n:"Offset",min:.3,max:1.2,def:.7},{n:"Glow",min:.3,max:3,def:1},{n:"Fold Pulse",min:0,max:2,def:1},{n:"Color Rate",min:0,max:3,def:1},{n:"Zoom",min:.3,max:4,def:1}],stick:[0,3],code:`
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
}`});var Ye=(a,e)=>`
float tr;
${a}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  vec3 ro=vec3(0,0,-P4); ro.yz*=rot(uCam.y+sin(uTime*.1)*.3); ro.xz*=rot(uCam.x+uTime*P1);
  vec3 f=normalize(-ro), r=normalize(cross(vec3(0,1,0),f)), u=cross(f,r);
  vec3 rd=normalize(uv.x*r+uv.y*u+1.45*f);
  vec3 col=pal(.7)*.02+pal(.55)*.035*exp(-length(uv)*2.5);
  float B=${e};
  float bb=dot(ro,rd), cc=dot(ro,ro)-B*B, hh=bb*bb-cc, g=0.;
  if(hh>0.){                                            // only march inside the bounding sphere
    float t=max(-bb-sqrt(hh),0.), tmax=-bb+sqrt(hh), st=0.; bool hit=false;
    for(int i=0;i<110;i++){ vec3 p=ro+rd*t; float d=map(p); g+=exp(-d*20.); if(d<.0007*t){hit=true;break;} t+=d*.9; st++; if(t>tmax) break; }
    if(hit){
      vec3 p=ro+rd*t;
      float trc=tr, ao=1.-st/110.;
      float k=fft(fract(trc*.8));
      vec2 e=vec2(.0012,0.);
      vec3 n=normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));
      vec3 ld=normalize(vec3(.6,.8,-.5)); ld.xz*=rot(uTime*.07);
      float sh=1., s2=.01;
      for(int j=0;j<12;j++){ float h=map(p+n*.002+ld*s2); sh=min(sh,8.*h/s2); s2+=clamp(h,.03,.22); if(sh<.02||s2>2.5) break; }
      sh=clamp(sh,0.,1.);
      float dif=max(dot(n,ld),0.)*sh, spe=pow(max(dot(reflect(rd,n),ld),0.),28.)*sh, fil=dot(n,-ld)*.5+.5;
      vec3 base=pal(trc*P3+uTime*.02+k*.12)*(.85+k*.9);
      col=base*(.12+1.05*dif*(.75+uBass*.45))*mix(.35,1.,ao*ao)+base*pal(.6)*fil*.18*ao;
      col+=vec3(1.,.95,.9)*spe*.55;
      col+=pal(trc*P3+.5)*pow(1.-ao,4.)*P6*.9;
      col+=pal(trc*P3+.25)*pow(1.-ao,2.)*k*.9*(1.+uBeat);
      float vein=exp(-abs(fract(trc*5.-uTime*.25)-.5)*36.);
      col+=pal(trc*P3+.55)*vein*(.15+k*1.3+uBeat*.4)*ao*.8;
      float sw=exp(-abs(length(p)-(.35+uSinceBeat*1.4))*12.)*exp(-uSinceBeat*1.6);
      col+=pal(trc*P3+.3)*sw*1.3*ao;
    }
  }
  col+=pal(.3)*g*.006*P2*(1.+uBeat*2.);
  c=vec4(col,1);
}`,Ke=(a,e)=>[a,{n:"Orbit",min:0,max:1,def:.25},{n:"Glow",min:0,max:3,def:1},{n:"Color Rate",min:.2,max:4,def:1.2},{n:"Distance",min:1.6,max:7,def:4,ms:.3},{n:"Audio Morph",min:0,max:2,def:.8},{n:"Rim",min:0,max:3,def:1.2},e];F({camSens:.45,space:!0,id:"bulb",name:"Mandelbulb Shrine",params:Ke({n:"Power",min:2,max:12,def:8,ms:.1},{n:"Detail",min:4,max:10,def:7}),stick:[0,4],code:Ye(`
float map(vec3 p){
  vec3 z=p; float dr=1., r=0., pw=P0+uBass*.35*P5; tr=1e9;
  for(int i=0;i<10;i++){ if(float(i)>=P7) break;
    r=max(length(z),1e-5); if(r>2.) break;
    float th=acos(clamp(z.z/r,-1.,1.))+uTime*.1, ph=atan(z.y,z.x);
    dr=pow(r,pw-1.)*pw*dr+1.;
    float zr=pow(r,pw); th*=pw; ph*=pw;
    z=zr*vec3(sin(th)*cos(ph),sin(ph)*sin(th),cos(th))+p;
    tr=min(tr,length(z));
  }
  return .5*log(r)*r/dr;
}`,"1.25")});F({camSens:.45,space:!0,id:"qjulia",name:"Julia Organism",params:Ke({n:"Mutation",min:0,max:1,def:.5,ms:.15},{n:"Drift",min:0,max:2,def:.6}),stick:[0,4],code:Ye(`
float map(vec3 p){
  vec4 z=vec4(p,0.);
  vec4 cq=vec4(-.291,-.399,.339,.437)+(P0-.5)*vec4(.12,-.08,.1,-.06)+.06*sin(uTime*.13*P7+vec4(0.,1.7,3.1,4.4))+uBass*.025*P5*vec4(1.,-1.,1.,0.);
  float md2=1., mz2=dot(z,z); tr=1e9;
  for(int i=0;i<11;i++){
    md2*=4.*mz2;
    z=vec4(z.x*z.x-dot(z.yzw,z.yzw),2.*z.x*z.yzw)+cq;
    mz2=dot(z,z); tr=min(tr,mz2);
    if(mz2>4.) break;
  }
  tr=sqrt(tr);
  return .25*sqrt(mz2/md2)*log(mz2);
}`,"1.65")});F({camSens:.45,space:!0,id:"jbulb",name:"Living Bulb",params:Ke({n:"Base Power",min:3,max:10,def:6,ms:.08},{n:"Morph Range",min:0,max:3,def:2,ms:.2}),stick:[0,7],code:Ye(`
float map(vec3 p){
  p.xy*=rot(.6); p.yz*=rot(uTime*.03);
  float pw=P0+sin(uTime*.045)*P7+uBass*.25*P5;              // the power itself slowly breathes
  vec3 z=p; float dr=1., r=0.; tr=1e9;
  for(int i=0;i<7;i++){
    r=max(length(z),1e-5); if(r>2.) break;
    float th=acos(clamp(z.z/r,-1.,1.)), ph=atan(z.y,z.x)+uTime*.05;
    dr=pow(r,pw-1.)*pw*dr+1.;
    float zr=pow(r,pw); th*=pw; ph*=pw;
    z=zr*vec3(sin(th)*cos(ph),sin(ph)*sin(th),cos(th))+p;
    tr=min(tr,length(z));
  }
  return .5*log(r)*r/dr;
}`,"1.3")});F({camSens:.45,space:!0,id:"kifs",name:"Crystal Reliquary",params:Ke({n:"Twist",min:0,max:1,def:.35,ms:.25},{n:"Facet",min:.2,max:1,def:.55,ms:.3}),stick:[0,7],code:Ye(`
float map(vec3 p){
  float s=1.; tr=1e9;
  vec3 off=vec3(1.,.5+P7*.4,.25)*(1.+uBass*.03*P5);
  for(int i=0;i<9;i++){
    p=abs(p);
    if(p.x<p.y) p.xy=p.yx; if(p.x<p.z) p.xz=p.zx; if(p.y<p.z) p.yz=p.zy;   // octahedral symmetry fold
    p.xy*=rot(P0*.6+sin(uTime*.07)*.05); p.yz*=rot(.25+P0*.3);
    p=p*2.-off;
    s*=2.; tr=min(tr,length(p)*.5);
  }
  return (length(max(abs(p)-vec3(.9),0.))-.05)/s;
}`,"3.4")});F({fly:!0,id:"hextunnel",name:"Hex Temple",params:[{n:"Speed",min:0,max:4,def:1.4},{n:"Hex Size",min:2,max:14,def:6},{n:"Eyes",min:0,max:2,def:1},{n:"Glow",min:0,max:3,def:1.2},{n:"Warp",min:0,max:2,def:.6},{n:"Twist",min:-2,max:2,def:.4},{n:"Depth Fade",min:0,max:2,def:1},{n:"Glyphs",min:0,max:2,def:1}],stick:[5,4],code:`
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
}`});F({ss:2,id:"yantra",name:"Sri Yantra",params:[{n:"Triangles",min:3,max:12,def:9},{n:"Breathing",min:0,max:2,def:1},{n:"Lotus Petals",min:4,max:24,def:16},{n:"Line Width",min:.5,max:4,def:1.5},{n:"Spin",min:-1,max:1,def:.05},{n:"Halo",min:0,max:3,def:1.2},{n:"Fill Glow",min:0,max:2,def:.6},{n:"Zoom",min:.5,max:2,def:1}],stick:[1,6],code:`
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
}`});F({fly:!0,id:"menger",name:"Menger Crystal",params:[{n:"Speed",min:0,max:3,def:.8},{n:"Hole Size",min:.8,max:1.2,def:1,ms:.5},{n:"Glow",min:0,max:3,def:1.2},{n:"Color Rate",min:.2,max:3,def:1},{n:"Twist",min:0,max:1,def:.3},{n:"Bass Shake",min:0,max:2,def:.6},{n:"Fog",min:0,max:1,def:.4},{n:"Iterations",min:2,max:5,def:4}],stick:[4,1],code:`
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
}`});F({landscape:!0,id:"aurora",name:"Aurora Ocean",params:[{n:"Curtains",min:1,max:4,def:3},{n:"Flow",min:0,max:3,def:1},{n:"Height",min:.4,max:1.6,def:1},{n:"Brightness",min:.3,max:3,def:1.3},{n:"Reflection",min:0,max:1,def:.75},{n:"Waves",min:0,max:2,def:1},{n:"Stars",min:0,max:2,def:1},{n:"Audio Fold",min:0,max:3,def:1.2}],stick:[1,7],code:`
// Curtains are vertical gaussian sheets z = lane_k(x). Instead of noisy random-offset ray marching we find
// every place the view ray crosses each sheet (deterministic sign-change search) and add the sheet's exact
// integrated glow there: w*sqrt(pi)/|slope|. No jitter -> no grain, and it's cheaper.
vec4 auroraF(vec3 rd, float t, float drift, out float x, out float sp){
  x=rd.x*t+drift;
  sp=fft(fract(abs(x)*.012));
  float mea=vn(vec2(x*.045,uTime*.02*P1))*16.-8.;
  vec4 fk=vec4(0.,1.,2.,3.);
  vec4 lane=sin(x*.11+fk*2.1+uTime*.03*P1)*7.+mea*(1.-fk*.25)+fk*23.+30.
           +sin(x*.35+uTime*.9+fk)*1.6*P7*sp;
  return rd.z*t-lane;
}
vec3 aurora(vec3 rd, int NS){
  if(rd.y<.002||rd.z<.05) return vec3(0);
  float h0=7., h1=7.+9.*P2;
  float drift=sin(uTime*.013*P1)*20.;
  // samples sit on a FIXED depth grid (z = 8..140) so neighbouring pixels share it -> no banding.
  // Only intervals overlapping the curtain altitude band are evaluated.
  float za=max(8.,h0/rd.y*rd.z), zb=min(140.,(h0+(h1-h0)*1.35)/rd.y*rd.z);
  if(zb<=za) return vec3(0);
  float dz=132./float(NS);
  int i0=int(floor((za-8.)/dz)), i1=int(ceil((zb-8.)/dz));
  vec3 acc=vec3(0);
  float x, sp;
  float tp=(8.+float(i0)*dz)/rd.z;
  vec4 fp=auroraF(rd,tp,drift,x,sp), fpp=fp;
  for(int i=1;i<=28;i++){ if(i>NS||i0+i>i1) break;
    float t=(8.+float(i0+i)*dz)/rd.z;
    vec4 fc=auroraF(rd,t,drift,x,sp);
    for(int k=0;k<4;k++){ if(float(k)>=P0) break;
      float a=fp[k], b=fc[k];
      float tt, nearW=1.;
      if(a*b>0.){
        // no crossing: a fold may graze the ray between samples (|f| has a local minimum at tp)
        float pa=fpp[k];
        if(i<2 || abs(a)>abs(pa) || abs(a)>abs(b) || pa*a<=0.) continue;
        tt=tp; nearW=exp(-a*a/((1.1+.8*P2)*(1.1+.8*P2)));
        if(nearW<.02) continue;
      } else tt=mix(tp,t,a/(a-b+1e-6));
      float alt=(rd.y*tt-h0)/(h1-h0);
      if(alt<0.||alt>1.3) continue;
      float xx=rd.x*tt+drift;
      float spk=fft(fract(abs(xx)*.012));
      float w=1.1+alt*1.6;
      float prof=smoothstep(0.,.08,alt)*smoothstep(1.3,.8,alt)*exp(-alt*(2.6-uBass*.4))*(1.+spk*1.6);
      float rays=.35+.65*pow(vn(vec2(xx*1.7,uTime*.25*P1)),2.);
      rays=mix(.6,rays,exp(-tt*.006));                       // far curtains: average the fine rays (no shimmer)
      float slope=nearW<1.?0.:abs(b-a)/(t-tp);
      float glow=w*1.772/sqrt(slope*slope+.16);              // soft cap where a fold is seen edge-on
      vec3 c=mix(vec3(.15,1.,.45),vec3(.9,.25,1.),smoothstep(.15,.85,alt));
      c=mix(c,pal(alt*.6+.1),.45);
      acc+=c*prof*rays*glow*nearW*.055;
    }
    fpp=fp; fp=fc; tp=t;
  }
  return acc*P3*(.82+uBass*.22+uBeat*.12);
}
vec3 sky(vec3 rd){
  float y=max(rd.y,0.);
  vec3 col=mix(vec3(.02,.04,.09),vec3(.003,.004,.015),smoothstep(0.,.6,y));
  col+=pal(.55)*.03*exp(-y*14.);
  // stars + milky way band
  vec2 sp=vec2(atan(rd.x,rd.z),asin(clamp(rd.y,-1.,1.)))*90.;
  float st=h21(floor(sp)); vec2 fp=fract(sp)-.5;
  float star=step(.985-.006*P6,st)*smoothstep(.12,0.,length(fp))*(.5+.5*sin(uTime*2.+st*90.))*(.6+uHigh*.8);
  float mw=exp(-pow((rd.y-rd.x*.35-.35)*4.,2.));
  col+=vec3(.8,.85,1.)*star*P6*smoothstep(0.,.12,y);
  col+=vec3(.35,.3,.5)*fbm(sp*.06)*mw*.12*P6*smoothstep(0.,.2,y);
  return col;
}
float mount(float a){ return .012+fbm(vec2(a*2.6,1.7))*.045+fbm(vec2(a*11.,4.))*.012; }
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  vec3 rd=normalize(vec3(uv.x,uv.y+.1,1.1)); rd.xz*=rot(uCam.x*.6); rd.yz*=rot(-uCam.y*.25);
  float az=atan(rd.x,rd.z);
  float mh=mount(az);
  vec3 col;
  if(rd.y>0.){
    if(rd.y<mh){ col=vec3(.004,.006,.012)+pal(.35)*.03*P3*smoothstep(mh-.03,mh,rd.y); }   // mountain silhouette with a soft rim
    else col=sky(rd)+aurora(rd,28);                       // mountain silhouette with aurora rim
  } else {
    // mirror lake: ripples + beat rings
    float dist=1.2/max(-rd.y,.01);
    vec2 wp=rd.xz*dist;
    float rr=length(wp-vec2(0.,4.));
    float ring=sin((rr-uSinceBeat*6.)*3.)*exp(-abs(rr-uSinceBeat*6.)*.7)*exp(-uSinceBeat*1.2)/(1.+dist*.04);
    vec2 n=(vec2(vn(wp*1.3+uTime*.4),vn(wp*1.3-uTime*.35+7.))-.5)/(1.+dist*.06);   // fade far ripples (no sparkle noise)
    vec3 rr3=vec3(rd.x,-rd.y,rd.z);
    rr3.xy+=n*.025*P5*(1.+uBass*.6)+ring*.012*P5;
    rr3=normalize(rr3);
    float fres=.25+.75*pow(1.+rd.y,6.);
    float raz=atan(rr3.x,rr3.z);
    vec3 refl=rr3.y<mount(raz)?vec3(.004,.006,.012):sky(rr3)+aurora(rr3,18);
    col=refl*P4*fres+vec3(.002,.004,.008);
    col*=smoothstep(-.005,-.03,rd.y)*.8+.2;
  }
  c=vec4(col,1);
}`});F({id:"flux",name:"Flux",selfFeedback:!0,params:[{n:"Wave Size",min:.3,max:2,def:1},{n:"Wave Glow",min:.3,max:3,def:1},{n:"Flow Strength",min:0,max:3,def:1},{n:"Persistence",min:.8,max:.995,def:.965},{n:"Morph Time",min:4,max:40,def:14},{n:"Colour Flow",min:0,max:3,def:1},{n:"Map Spread",min:.2,max:3,def:1},{n:"Beat Sparks",min:0,max:2,def:1}],stick:[2,0],code:`
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
}`});var si=`
uniform sampler2D uPhoto; uniform float uPhotoAR;
// photo space: the photo spans y in [-.5,.5] and x in [-AR/2, AR/2]; beyond that it mirrors forever
vec2 phUV(vec2 p){ return vec2(p.x/uPhotoAR+.5, .5-p.y); }
vec3 photo(vec2 p){ return texture(uPhoto, phUV(p)).rgb; }
vec3 photoL(vec2 p, float lod){ return textureLod(uPhoto, phUV(p), lod).rgb; }
float lum(vec3 c){ return dot(c, vec3(.299,.587,.114)); }
vec3 sat(vec3 c, float s){ float l=lum(c); return max(mix(vec3(l), c, s), 0.); }
// screen -> photo space so the photo just covers the screen
float kick(){ return exp(-uSinceBeat*5.); }
// smooth beat step: +1 per beat, eased in over ~1/k seconds (no jumps)
float bstep(float k){ return uBeatCount+1.-exp(-uSinceBeat*k); }
// screen -> photo space so the photo just covers the screen; breathes with the bass and punches in on the kick
vec2 cover(vec2 uv){ float sAR=uRes.x/uRes.y; return uv/max(sAR/uPhotoAR, 1.)*(1.-uBass*.035-kick()*.035); }
// shared music response: bass/kick breath + highlight bloom + treble sparkle
vec3 react(vec3 col){ float k=kick(); col*=.84+.26*uBass+.32*k; col+=col*col*(k*.45+uHigh*.12); return col; }
`,L=a=>F({camSens:.5,...a,photo:!0,code:si+a.code});L({id:"ph_mandala",name:"Photo Mandala",desc:"Slices of your photo mirrored into a turning kaleidoscope",params:[{n:"Segments",min:3,max:16,def:8,ms:.25},{n:"Spin",min:0,max:1,def:.3},{n:"Zoom",min:.3,max:3,def:1.1},{n:"Pan X",min:-1,max:1,def:0},{n:"Pan Y",min:-1,max:1,def:0},{n:"Bass Breath",min:0,max:2,def:1},{n:"Seam Glow",min:0,max:2,def:.8},{n:"Inner Swirl",min:0,max:2,def:.5}],stick:[3,4],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)*rot(uCam.x*.5);
  float r=length(uv), a=atan(uv.y,uv.x)+uTime*.12*P1+bstep(4.)*.06*P1;
  float N=floor(P0+.5), seg=TAU/N;
  float sa=mod(a,seg); sa=min(sa,seg-sa);                       // mirror fold -> seamless wedges
  float rr=r/P2*(1.-uBass*.14*P5-kick()*.08*P5)-uTime*.025*P1;                 // endless outward flow (photo mirrors beyond its edges)
  vec2 q=vec2(cos(sa),sin(sa))*rr;
  q*=rot(r*P7*sin(uTime*.17)*1.5);
  q+=vec2(P3,P4)*.45+uCam.y*vec2(.2,0);
  vec3 col=sat(photo(q),1.15);
  float sd=sa*r;                                                 // distance to a fold line
  col+=pal(r*.6+uTime*.04)*glowLine(sd,.0025)*.05*P6*(.35+uBeat*1.2+uHigh);
  float ring=exp(-abs(r-uSinceBeat*.8)*22.)*exp(-uSinceBeat*2.2)*P6;
  col+=pal(.25+r)*ring*.5;
  c=vec4(react(col*(.92+uBass*.18*P5)),1);
}`});L({id:"ph_glass",name:"Photo Stained Glass",desc:"Your photo rebuilt as glowing glass panes with lead lines that pulse on the beat",params:[{n:"Panes",min:5,max:40,def:13,ms:.25},{n:"Drift",min:0,max:2,def:.5},{n:"Lead Width",min:.02,max:.25,def:.12},{n:"Lead Glow",min:0,max:2,def:1},{n:"Breathe",min:0,max:2,def:.6},{n:"Photo Detail",min:0,max:1,def:.3},{n:"Pane Light",min:0,max:2,def:1},{n:"Color Boost",min:.5,max:2.5,def:1.5}],stick:[5,7],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=cover(UV(fc))*(1.-uBass*.04*P4)+uCam.xy*vec2(.15,.1);
  vec2 p=uv*P0;
  vec2 n=floor(p), f=fract(p); float F1=9., F2=9.; vec2 cc=vec2(0), cid=vec2(0);
  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
    vec2 g=vec2(i,j), o=h22(n+g); o=.5+.38*sin(uTime*.5*P1+TAU*o);
    vec2 r=g+o-f; float d=dot(r,r);
    if(d<F1){ F2=F1; F1=d; cc=(n+g+o)/P0; cid=n+g; } else if(d<F2) F2=d;
  }
  F1=sqrt(F1); F2=sqrt(F2);
  float edge=F2-F1;
  vec3 glass=sat(photoL(cc,2.5),P7);
  vec3 col=mix(glass, sat(photo(uv),P7*.9), P5*smoothstep(.0,.5,edge));
  float id=h21(cid);
  float light=.7+.5*smoothstep(.7,0.,F1);
  light*=1.+fft(.05+id*.6)*P6*.9+uHigh*.3*P6*(.5+.5*sin(id*50.+uTime*2.));
  col*=light*(.93+.14*vn(uv*P0*7.+id*9.));
  float lead=smoothstep(P2,P2*.45,edge);
  vec3 leadC=vec3(.012)+pal(.08+uv.y*.3)*(.15+exp(-uSinceBeat*3.)*1.1)*P3*smoothstep(P2*.2,P2*.6,edge);
  c=vec4(react(mix(col,leadC,lead)),1);
}`});L({id:"ph_zoom",name:"Infinite Photo",desc:"Your photo framed inside itself forever, spiraling inward",params:[{n:"Frame Ratio",min:1.4,max:4,def:2.2,ms:.15},{n:"Zoom Speed",min:0,max:2,def:.7},{n:"Twist",min:-1,max:1,def:.25,ms:.3},{n:"Frame Glow",min:0,max:2,def:1},{n:"Size",min:.3,max:.5,def:.43},{n:"Bass Kick",min:0,max:2,def:1},{n:"Color Shift",min:0,max:1,def:.2},{n:"Rock",min:0,max:1,def:.3}],stick:[4,6],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)*rot(sin(uTime*.21)*.15*P7+uCam.x*.4);
  float k=P0, tw=P2*1.2;
  float t=uTime*.12*P1+bstep(5.)*.06*P5;
  float ft=fract(t);
  vec2 q=uv/P4*(1.-kick()*.05*P5);                      // frame: |x|<=AR*.5, |y|<=.5
  q=rot(tw*ft)*q*pow(k,-ft);                             // zoom + twist by one level per cycle = seamless
  float m=max(abs(q.x)/(uPhotoAR*.5), abs(q.y)/.5);
  float n=floor(-log(max(m,1e-6))/log(k));               // which nested copy this pixel sees
  vec2 ql=rot(-tw*n)*q*pow(k,n);
  float ml=max(abs(ql.x)/(uPhotoAR*.5), abs(ql.y)/.5);   // 1 at this copy's frame, 1/k at the next one
  vec3 col=photo(ql*.999);
  float lev=n+ft;
  col=mix(col, col*pal(lev*.13+uTime*.02)*1.6, P6*.6);
  float fr=abs(ml-1.)*.5;
  col=mix(col, pal(lev*.1+.3)*1.4, smoothstep(.012,.0,fr)*.9*P3);
  col+=pal(lev*.1+.5)*glowLine(fr,.004)*.04*P3*(.4+uBeat*1.5);
  c=vec4(react(col),1);
}`});L({id:"ph_neon",name:"Neon Trace",desc:"The edges in your photo redrawn as glowing neon lines",params:[{n:"Line Gain",min:.5,max:6,def:2.6},{n:"Threshold",min:0,max:.4,def:.08},{n:"Line Width",min:.5,max:3,def:1.2},{n:"Color Flow",min:0,max:2,def:.6},{n:"Photo Ghost",min:0,max:.6,def:.12},{n:"Scan Beam",min:0,max:2,def:1},{n:"Flicker",min:0,max:2,def:.7},{n:"Ripple",min:0,max:2,def:.6}],stick:[0,4],code:`
float edgeAt(vec2 p, float lod, float d){
  float a=lum(photoL(p+vec2(d,0),lod)), b=lum(photoL(p-vec2(d,0),lod));
  float e=lum(photoL(p+vec2(0,d),lod)), f=lum(photoL(p-vec2(0,d),lod));
  return length(vec2(a-b,e-f));
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv0=UV(fc);
  vec2 uv=cover(uv0*(1.-uBass*.03));
  float rr=length(uv0);
  uv+=uv0/max(rr,1e-3)*sin(rr*28.-uTime*5.)*.002*P7*(.3+uBass);
  float px=1./uRes.y;
  float e1=edgeAt(uv,.0,px*1.5*P2), e2=edgeAt(uv,2.,px*5.*P2);
  float e=max(e1*.8, e2*1.3);
  float line=smoothstep(P1,P1+.12,e)*P0*.5;
  float hue=uv.y*.6+uv.x*.25+uTime*.05*P3+e*.8;
  float fl=1.+P6*(uHigh*.8*(.5+.5*sin(uTime*31.+uv.y*90.))-.15);
  vec3 col=pal(hue)*line*fl;
  float scan=exp(-abs(uv.x*1.2-(fract(uTime*.07+uSinceBeat*.0)*2.4-1.2))*9.)*P5;
  col*=1.+scan*1.5+kick()*1.2;
  col+=photo(uv)*P4*(.6+uVol*.5);
  c=vec4(react(col),1);
}`});L({id:"ph_land",name:"Photo Terrain",desc:"Brightness becomes height: fly low over a landscape made of your photo",fly:!0,params:[{n:"Height",min:.2,max:2,def:.9},{n:"Speed",min:0,max:2,def:.6},{n:"Scale",min:.1,max:1,def:.35},{n:"Smooth",min:1,max:4,def:2.4},{n:"Spectrum Lift",min:0,max:2,def:.8},{n:"Sky Glow",min:0,max:2,def:1},{n:"Altitude",min:.3,max:1.6,def:.85},{n:"Banking",min:0,max:1,def:.5}],stick:[0,6],code:`
float terrH(vec2 x){
  float h=lum(photoL(x*P2,P3))*P0;
  h+=fft(clamp(abs(x.x)*.05,0.,1.))*.35*P4*smoothstep(.5,2.5,abs(x.x));
  return h;
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  float tt=uTime*.6*P1;
  vec3 ro=vec3(sin(tt*.3)*1.5, P6+P0*.6, tt*2.+bstep(3.)*.5*P1);
  vec3 rd=normalize(vec3(uv,1.4));
  rd.xy*=rot(sin(tt*.3)*.12*P7);
  rd.yz*=rot(.18+uCam.y*.4); rd.xz*=rot(uCam.x*.6+cos(tt*.3)*.1*P7);
  float sy=rd.y;
  vec3 avg=photoL(vec2(0),9.);                                    // the photo's overall colour tints the sky
  vec3 sky=mix(sat(avg,1.4)*1.1+pal(.1)*.15, sat(avg,1.6)*.12, smoothstep(-.05,.55,sy));
  sky+=mix(pal(.1),sat(avg,2.),.5)*exp(-abs(sy-.03)*14.)*.45*P5*(.7+uBass*.5);
  vec3 col=sky;
  float maxH=P0*1.05+.35*P4+.02;
  float t=.05, tmax=32.; bool hit=false;
  if(ro.y>maxH){ if(rd.y>=0.) tmax=0.; else t=(ro.y-maxH)/-rd.y; }
  float tp=t;
  for(int i=0;i<48;i++){ if(t>tmax) break;
    vec3 p=ro+rd*t; float h=p.y-terrH(p.xz);
    if(h<.002*t){ hit=true; break; }
    tp=t; t+=max(h*.65,.02*t);
  }
  if(hit){
    for(int j=0;j<5;j++){ float tm=(tp+t)*.5; vec3 p=ro+rd*tm; if(p.y-terrH(p.xz)<.002*tm) t=tm; else tp=tm; }
    vec3 p=ro+rd*t; vec2 e=vec2(.03,0); float h0=terrH(p.xz);
    vec3 nr=normalize(vec3(h0-terrH(p.xz+e.xy), e.x, h0-terrH(p.xz+e.yx)));
    vec3 alb=sat(photoL(p.xz*P2,.5),1.35);
    float dif=clamp(dot(nr,normalize(vec3(.4,.7,.6))),0.,1.);
    col=alb*(.45+.85*dif)+pal(.1)*pow(1.-max(nr.y,0.),3.)*.25;
    col+=pal(.6)*exp(-abs(fract(p.z*.25-uTime*.4)-.5)*30.)*.25*uBeat;
    col=mix(col,sky,smoothstep(8.,tmax*.95,t));
  }
  c=vec4(react(col),1);
}`});L({id:"ph_liquid",name:"Liquid Photo",desc:"Your photo melts and swirls like paint in water, pulsing with the bass",params:[{n:"Melt",min:0,max:1.2,def:.6},{n:"Flow",min:0,max:2,def:.6},{n:"Scale",min:.5,max:4,def:1.6},{n:"Bass Wobble",min:0,max:2,def:1},{n:"Color Bleed",min:0,max:1,def:.35},{n:"Tide",min:0,max:1,def:.5},{n:"Oil Sheen",min:0,max:1.5,def:.5},{n:"Zoom",min:.6,max:1.6,def:1}],stick:[0,6],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=cover(UV(fc))/P7;
  float t=uTime*.12*P1+bstep(3.)*.08*P1;
  float tide=mix(1.,.7+.3*sin(uTime*.08),P5);
  float amt=P0*.32*tide+uBass*.09*P3+kick()*.05*P3;
  vec2 w=vec2(fbm(uv*P2+t), fbm(uv*P2-t+5.2))-.5;
  vec2 w2=vec2(fbm(uv*P2*1.6+w*3.+t*1.3), fbm(uv*P2*1.6+w*3.-t+1.7))-.5;
  vec2 q=uv+w2*amt*2.+uCam.xy*.1;
  vec3 col=photo(q);
  vec3 bled=photoL(q+w*amt,3.);
  col=mix(col,sat(bled,1.6),P4*smoothstep(.1,.6,length(w2)*2.));
  float sheen=pow(.5+.5*sin(dot(w2,vec2(30.,22.))+uTime),6.);
  col+=pal(dot(w2,vec2(2.,3.))+uTime*.03)*sheen*.25*P6*(.5+uHigh);
  c=vec4(react(col*(.95+uBass*.12)),1);
}`});L({id:"ph_tunnel",name:"Photo Tunnel",desc:"Your photo wrapped around the walls of a tunnel you fly through",fly:!0,params:[{n:"Depth",min:.1,max:1,def:.35},{n:"Speed",min:0,max:2,def:.7},{n:"Wraps",min:1,max:6,def:2,ms:.25},{n:"Twist",min:-1,max:1,def:.2},{n:"Sway",min:0,max:1,def:.4},{n:"Core Glow",min:0,max:2,def:1},{n:"Rings",min:0,max:2,def:.8},{n:"Fog",min:0,max:1,def:.5}],stick:[0,4],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  uv+=vec2(sin(uTime*.31),cos(uTime*.23))*.08*P4+uCam.xy*vec2(-.3,.3);
  float r=length(uv), a=atan(uv.y,uv.x);
  float z=P0/max(r,1e-3);
  float zz=z+uTime*.6*P1*(1.+uDrive)+bstep(4.)*.7*P1;
  float ang=abs(a+zz*P3*.15)/PI;                      // mirrored angle: no seam
  vec2 tc=vec2((ang-.5)*uPhotoAR*P2*.5, fract(zz*.3)*2.-1.);
  tc.y=abs(tc.y)-.5;                                  // mirror along depth too
  vec3 col=sat(photo(tc),1.1);
  float ring=exp(-abs(fract(zz*.5)-.5)*14.)*P6*(.2+kick()*1.5+uBass*.4);
  col+=pal(zz*.05)*ring*.4;
  col*=mix(1.,smoothstep(0.,.5,r*1.6),P7);
  col+=pal(.1+uTime*.02)*exp(-r*16.)*P5*(.35+uBass*.6);
  c=vec4(react(col),1);
}`});L({id:"ph_dots",name:"Halftone Pulse",desc:"Your photo printed as dots that swell with the bass",crisp:!0,params:[{n:"Dots",min:20,max:160,def:70,ms:.2},{n:"Angle Drift",min:0,max:1,def:.3},{n:"Dot Size",min:.4,max:1.4,def:.95},{n:"Bass Swell",min:0,max:2,def:1},{n:"Tint",min:0,max:1,def:.25},{n:"Wave",min:0,max:2,def:.8},{n:"Color Boost",min:.5,max:2.5,def:1.5},{n:"Glow",min:0,max:1,def:.4}],stick:[2,4],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=cover(UV(fc))+uCam.xy*.1;
  mat2 R=rot(.4+sin(uTime*.05)*P1);
  vec2 g=R*uv*P0;
  vec2 id=floor(g)+.5, f=g-id;
  vec2 ctr=transpose(R)*id/P0;
  vec3 pc=sat(photoL(ctr,1.5),P6);
  float l=lum(pc);
  float rr=length(uv);
  float wave=sin(rr*14.-uSinceBeat*9.)*exp(-uSinceBeat*1.6)*.25*P5;
  float rad=sqrt(clamp(l,0.,1.))*.5*P2*(1.+uBass*.45*P3+kick()*.2*P3+wave);
  float d=length(f);
  float aa=fwidth(d)*1.2;
  float dot1=smoothstep(rad+aa,rad-aa,d);
  vec3 dc=mix(pc,pal(l*.6+uTime*.03)*(.4+l),P4);
  vec3 col=dc*dot1*1.15;
  col+=dc*exp(-max(d-rad,0.)*12.)*.25*P7;
  c=vec4(react(col),1);
}`});var Mt=`
vec2 cmul(vec2 a, vec2 b){ return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x); }
vec2 cdiv(vec2 a, vec2 b){ return vec2(a.x*b.x+a.y*b.y, a.y*b.x-a.x*b.y)/dot(b,b); }
`;L({id:"ph_hex",name:"Hex Kaleidoscope",desc:"Honeycomb mirrors: your photo folded into a sacred-geometry hex lattice",params:[{n:"Cells",min:1.5,max:8,def:3.2,ms:.25},{n:"Spin",min:0,max:1,def:.25},{n:"Drift",min:0,max:1,def:.3},{n:"Sample Size",min:.15,max:1.5,def:.55},{n:"Turn",min:0,max:1,def:.3},{n:"Pan X",min:-1,max:1,def:0},{n:"Pan Y",min:-1,max:1,def:0},{n:"Edge Glow",min:0,max:2,def:.9}],stick:[5,6],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)*rot(uTime*.05*P1+bstep(4.)*.08+uCam.x*.5);
  vec2 p=uv*P0*(1.-uBass*.08-kick()*.05)+vec2(0.,uTime*.12*P2);
  vec2 r=vec2(1.,1.7320508), h=r*.5;
  vec2 a=mod(p,r)-h, b=mod(p-h,r)-h;
  vec2 g=dot(a,a)<dot(b,b)?a:b;
  float hd=max(abs(g.y), dot(abs(g),vec2(.8660254,.5)));
  float ang=atan(g.y,g.x), seg=PI/3.; ang=mod(ang,seg); ang=min(ang,seg-ang);
  vec2 q=vec2(cos(ang),sin(ang))*length(g)*P3;
  q=rot(uTime*.1*P4)*q+vec2(P5,P6)*.4+uCam.yx*vec2(.15,0);
  vec3 col=sat(photo(q),1.15);
  float e=.5-hd;
  col+=pal(hd*2.+uTime*.05)*glowLine(e,.004)*.05*P7*(.4+uBeat*1.3+uHigh*.6);
  col*=.9+.2*smoothstep(.5,0.,hd)*uBass;
  c=vec4(react(col),1);
}`});L({id:"ph_flower",name:"Photo Flower of Life",desc:"The Flower of Life drawn in light over your photo, petals glowing where circles overlap",crisp:!0,params:[{n:"Circle Size",min:.06,max:.22,def:.12,ms:.2},{n:"Petal Tint",min:0,max:1,def:.55},{n:"Spin",min:0,max:1,def:.2},{n:"Line Glow",min:0,max:2,def:1.1},{n:"Petal Light",min:0,max:2,def:1},{n:"Outer Ring",min:1.5,max:5,def:3.2},{n:"Breath",min:0,max:2,def:1},{n:"Outside Dim",min:0,max:1,def:.7}],stick:[0,1],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)*rot(uTime*.04*P2+bstep(4.)*.1*P2+uCam.x*.4);
  float R=P0*(1.+uBass*.07*P6+kick()*.04*P6);
  vec2 A=vec2(R,0.), B=vec2(R*.5,R*.8660254);
  mat2 M=mat2(A,B), Mi=inverse(M);
  vec2 l=floor(Mi*uv);
  float outer=R*P5, rim=1e9, cnt=0.;
  for(int j=-2;j<=3;j++) for(int i=-2;i<=3;i++){
    vec2 cc=M*(l+vec2(i,j));
    if(length(cc)>outer-R*.99) continue;
    float d=length(uv-cc);
    rim=min(rim,abs(d-R));
    cnt+=step(d,R);
  }
  float ro=length(uv);
  vec3 col=sat(photo(cover(UV(fc))),1.1);
  float inside=step(ro,outer);
  vec3 tint=pal(cnt*.13+uTime*.03);
  col=mix(col, col*tint*1.8, P1*inside*step(1.5,cnt)*(.6+.4*mod(cnt,2.)));
  col*=mix(1.-P7, 1.+cnt*.06*P4*(.5+uMid), inside);
  float lineW=.0035+.0015*uBeat;
  vec3 lc=pal(.12+ro*1.5+uTime*.04);
  col=mix(col, lc*1.25, smoothstep(lineW,lineW*.3,rim)*inside*.9);
  col+=lc*glowLine(rim,.004)*.02*P3*inside*(.5+uBeat*1.2);
  float ring=min(abs(ro-outer),abs(ro-outer-R*.18));
  col=mix(col, lc*1.3, smoothstep(.004,.001,ring));
  c=vec4(react(col),1);
}`});L({id:"ph_hyper",name:"Hyperbolic Photo",desc:"Your photo tiled across a hyperbolic disk, shrinking infinitely toward the rim",params:[{n:"P (sides)",min:3,max:8,def:4,ms:.2},{n:"Q (meet)",min:3,max:8,def:5,ms:.2},{n:"Drift",min:0,max:2,def:.5},{n:"Line Glow",min:0,max:2,def:.9},{n:"Photo Scale",min:.3,max:3,def:1.2},{n:"Spin",min:-1,max:1,def:.1},{n:"Disk Zoom",min:.6,max:1.5,def:1},{n:"Mirror Tint",min:0,max:1,def:.3}],stick:[4,6],code:Mt+`
vec2 mobius(vec2 z, vec2 a){ return cdiv(z-a, vec2(1,0)-cmul(vec2(a.x,-a.y),z)); }
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)*1.05/P6;
  float r0=length(uv);
  vec3 bg=photoL(uv*.6,5.)*.18;
  if(r0>=1.){ c=vec4(react(bg+pal(.5)*glowLine(r0-1.,.004)*.03*P3),1); return; }
  float p=floor(P0+.5), q=floor(P1+.5);
  if((p-2.)*(q-2.)<=4.) q=floor(4./(p-2.))+3.;
  float pa=PI/p, qa=PI/q;
  float rr=1./sqrt(cos(qa)*cos(qa)/(sin(pa)*sin(pa))-1.);
  float cx=sqrt(1.+rr*rr);
  vec2 drift=.3*vec2(sin(uTime*.2*P2),cos(uTime*.17*P2))*P2+uCam.xy*.4;
  drift*=min(1.,.9/max(length(drift),.001));
  vec2 z=mobius(uv,drift*.8)*rot(uTime*P5*.3+bstep(4.)*.12);
  vec2 n=vec2(-sin(pa),cos(pa));
  float inv=0.;
  for(int i=0;i<40;i++){
    bool done=true;
    if(z.y<0.){ z.y=-z.y; inv++; done=false; }
    float dd=dot(z,n); if(dd>0.){ z-=2.*dd*n; inv++; done=false; }
    vec2 dz=z-vec2(cx,0.); float l2=dot(dz,dz);
    if(l2<rr*rr){ z=vec2(cx,0.)+dz*rr*rr/l2; inv++; done=false; }
    if(done) break;
  }
  vec3 col=photo(z*P4-vec2(.1,.05));
  col=mix(col, col.gbr, P7*mod(inv,2.));
  col=sat(col,1.1);
  float e=min(abs(length(z-vec2(cx,0.))-rr), 1.);
  float fade=1.-r0*r0;
  col+=pal(inv*.07+uTime*.03)*glowLine(e,.003*fade+.0005)*.03*P3*(.5+uBeat);
  col*=.25+.75*smoothstep(1.,.85,r0);
  c=vec4(react(col),1);
}`});L({id:"ph_cube",name:"Photo Cube",desc:"A floating cube wrapped in your photo, tumbling to the beat",params:[{n:"Spin",min:0,max:2,def:.6},{n:"Size",min:.6,max:1.6,def:1},{n:"Edge Neon",min:0,max:2,def:1},{n:"Bounce",min:0,max:2,def:1},{n:"Distance",min:4.5,max:10,def:6.5,ms:.3},{n:"Backdrop",min:0,max:1,def:.35},{n:"Tilt",min:-1,max:1,def:.3},{n:"Shine",min:0,max:2,def:1}],stick:[1,6],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  float t=uTime*.35*P0+bstep(5.)*.22*P3;
  vec3 ro=vec3(0,0,-P4), rd=normalize(vec3(uv,1.6));
  mat2 ry=rot(t+uCam.x*.6), rx=rot(.5+P6*.6+sin(t*.7)*.3+uCam.y*.5);
  ro.xz*=ry; rd.xz*=ry; ro.yz*=rx; rd.yz*=rx;
  float s=P1*(1.+uBass*.1*P3+kick()*.08*P3);
  vec3 m=1./rd, n0=m*ro, k=abs(m)*s, t1=-n0-k, t2=-n0+k;
  float tN=max(max(t1.x,t1.y),t1.z), tF=min(min(t2.x,t2.y),t2.z);
  vec3 bg=sat(photoL(uv*.7,5.5),1.3)*P5+pal(.7)*.05*(1.-length(uv));
  vec3 col=bg;
  if(tN<tF && tF>0.){
    vec3 p=ro+rd*tN;
    vec3 nr=-sign(rd)*step(t1.yzx,t1.xyz)*step(t1.zxy,t1.xyz);
    vec2 f=abs(nr.x)>.5?p.zy:abs(nr.y)>.5?p.xz:p.xy;
    f/=s;
    vec3 tex=sat(photo(f*.5*vec2(min(uPhotoAR,1.),1.)),1.1);
    vec3 L=normalize(vec3(.5,.8,-.6));
    float dif=.45+.55*max(dot(nr,L),0.);
    float fre=pow(1.-abs(dot(nr,-rd)),3.);
    col=tex*dif+pal(.15)*fre*.35*P7;
    float ed=1.-max(abs(f.x),abs(f.y));
    col+=pal(.55+uTime*.03)*glowLine(ed,.006)*.04*P2*(.5+uBeat*1.5);
  }
  c=vec4(react(col),1);
}`});L({id:"ph_prism",name:"Prism Split",desc:"Your photo seen through triangular crystal facets that split it into rainbow light",params:[{n:"Facets",min:2,max:14,def:6,ms:.25},{n:"Dispersion",min:0,max:2,def:.9},{n:"Shift",min:0,max:2,def:.7},{n:"Edge Light",min:0,max:2,def:.8},{n:"Spin",min:0,max:1,def:.2},{n:"Bass Shatter",min:0,max:2,def:1},{n:"Facet Tint",min:0,max:1,def:.25},{n:"Zoom",min:.6,max:1.6,def:1}],stick:[1,2],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv0=UV(fc);
  vec2 uv=cover(uv0)/P7;
  vec2 p=uv0*rot(uTime*.03*P4+uCam.x*.4)*P0;
  vec2 q=vec2(p.x-p.y*.57735, p.y*1.1547);
  vec2 id=floor(q), f=fract(q);
  float up=step(f.x+f.y,1.);
  vec2 tid=id*2.+up;
  float e=up>.5?min(min(f.x,f.y),1.-f.x-f.y):min(min(1.-f.x,1.-f.y),f.x+f.y-1.);
  vec2 o=(h22(tid)-.5);
  float amt=(.02+.05*P2*(.6+.4*sin(uTime*.4+h21(tid)*6.)))*(1.+uBass*P5*.9+kick()*P5*1.2);
  vec2 base=uv+o*amt;
  float d=.006*P1*(1.+uHigh);
  vec3 col=vec3(photo(base+o*d).r, photo(base).g, photo(base-o*d).b);
  col=mix(col, col*pal(h21(tid)+uTime*.02)*1.6, P6*.5);
  col*=.85+.3*h21(tid+3.);
  col+=pal(.1+h21(tid))*glowLine(e,.012)*.06*P3*(.4+uBeat*1.4);
  c=vec4(react(sat(col,1.15)),1);
}`});L({id:"ph_ribbon",name:"Twisted Ribbons",desc:"Your photo printed on ribbons that twist and wave through space",params:[{n:"Ribbons",min:1,max:6,def:4,ms:.2},{n:"Twist",min:0,max:3,def:1.2},{n:"Wave",min:0,max:2,def:.8},{n:"Width",min:.05,max:.3,def:.15},{n:"Speed",min:0,max:2,def:.7},{n:"Back Tint",min:0,max:1,def:.6},{n:"Glow",min:0,max:2,def:1},{n:"Backdrop",min:0,max:1,def:.2}],stick:[1,2],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)*rot(uCam.x*.3);
  vec3 col=photoL(uv*.5,6.)*P7*.6;
  float N=floor(P0+.5);
  for(int i=0;i<6;i++){ if(float(i)>=N) break;
    float fi=float(i), ph=fi*1.7+uTime*.6*P4+bstep(4.)*.35;
    float yc=(fi-(N-1.)*.5)*.9/N+sin(uv.x*2.2*P2+ph)*.12*P2*(1.+uBass*.6+kick()*.4)+uCam.y*.2;
    float tw=uv.x*2.*P1+ph*.8+fi;
    float cw=cos(tw), w=P3*abs(cw)+.002;
    float v=(uv.y-yc)/w;
    if(abs(v)<1.){
      vec2 tc=vec2(uv.x*.6+fi*.37, v*.5*sign(cw));
      vec3 im=sat(photo(tc),1.15);
      if(cw<0.) im=mix(im, pal(fi*.2+uTime*.03)*lum(im)*1.6, P5);
      float shade=.45+.55*abs(cw);
      float edge=1.-abs(v);
      col=im*shade*(.85+.3*smoothstep(0.,.3,edge));
      col+=pal(fi*.15+.1)*glowLine(edge*w,.0025)*.03*P6*(.5+uBeat);
    } else col+=pal(fi*.15+.1)*glowLine(abs(uv.y-yc)-w,.003)*.012*P6;
  }
  c=vec4(react(col),1);
}`});L({id:"ph_spiral",name:"Droste Spiral",desc:"Escher-style spiral: your photo nested inside itself, curling forever inward",params:[{n:"Ratio",min:1.5,max:6,def:3,ms:.15},{n:"Flow",min:0,max:2,def:.6},{n:"Arms",min:1,max:3,def:1,ms:.2},{n:"Seam Glow",min:0,max:2,def:1.3},{n:"Photo Scale",min:.4,max:1.5,def:.9},{n:"Spin",min:-1,max:1,def:.15},{n:"Bass Pump",min:0,max:2,def:1},{n:"Color Shift",min:0,max:1,def:.15}],stick:[4,7],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)*rot(uTime*.05*P5+uCam.x*.5);
  float r=max(length(uv),1e-5), a=atan(uv.y,uv.x);
  float lk=log(P0), arms=floor(P2+.5);
  float u=log(r)-a*lk*arms/TAU-uTime*.15*P1-bstep(4.)*.12*P6*lk;
  float m=mod(u,lk);
  float rr=exp(m-lk);
  vec2 q=rr*vec2(cos(a),sin(a))*P4;
  float lev=floor(u/lk);
  vec3 col=sat(photo(q*.5/max(uPhotoAR,1.)),1.1);
  col=mix(col,col*pal(lev*.17+uTime*.02)*1.7,P7);
  float seam=min(m,lk-m)*r;
  col+=pal(.3+lev*.1)*glowLine(seam,.003)*.04*P3*(.4+uBeat*1.4);
  c=vec4(react(col),1);
}`});L({id:"ph_julia",name:"Photo Julia",desc:"Your photo poured through a living Julia-set fractal",params:[{n:"Morph",min:0,max:2,def:.5},{n:"Iterations",min:3,max:12,def:7,ms:.2},{n:"Photo Scale",min:.1,max:1.5,def:.45},{n:"Zoom",min:.6,max:2.5,def:1.3},{n:"Shape",min:-1,max:1,def:0},{n:"Depth Glow",min:0,max:2,def:.8},{n:"Bass Warp",min:0,max:2,def:1},{n:"Spin",min:0,max:1,def:.15}],stick:[4,3],code:Mt+`
void mainImage(out vec4 c, in vec2 fc){
  vec2 z=UV(fc)*rot(uTime*.05*P7+uCam.x*.5)*2.4/P3;
  float ang=uTime*.07*P0+bstep(3.)*.05*P6+P4*1.5+uCam.y;
  vec2 cc=vec2(-.75,.0)+.38*vec2(cos(ang),sin(ang))+vec2(uBass*.03*P6,0.);
  float it=0.; float N=floor(P1+.5);
  for(int i=0;i<12;i++){ if(float(i)>=N||dot(z,z)>16.) break; z=cmul(z,z)+cc; it++; }
  vec3 col=sat(photo(z*P2),1.2);
  float esc=it/N;
  col*=.55+.6*esc;
  col+=pal(esc*.8+uTime*.03)*(1.-esc)*.25*P5*(.5+uBass);
  c=vec4(react(col),1);
}`});L({id:"ph_trap",name:"Orbit Trap",desc:"A Mandelbrot dive where your photo is caught in the fractal's orbits",params:[{n:"Dive",min:0,max:2,def:.6},{n:"Trap Size",min:.2,max:1.5,def:.6},{n:"Iterations",min:16,max:64,def:40,ms:.2},{n:"Glow",min:0,max:2,def:1},{n:"Spot",min:0,max:3,def:0,ms:.2},{n:"Spin",min:0,max:1,def:.2},{n:"Bass Pulse",min:0,max:2,def:1},{n:"Fill",min:0,max:1,def:.35}],stick:[1,3],code:Mt+`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)*rot(uTime*.04*P5+uCam.x*.4);
  int spot=int(floor(P4+.5));
  vec2 ctr=spot==0?vec2(-.7453,.1127):spot==1?vec2(-.1011,.9563):spot==2?vec2(.2549,.0005):vec2(-1.4012,0.);
  float zoom=exp(-(.6+1.6*(.5+.5*sin(uTime*.05*P0-1.57))))*(1.-uBass*.07*P6-kick()*.05*P6);
  vec2 cc=ctr+uv*zoom*3.;
  vec2 z=vec2(0); vec3 hit=vec3(0); float got=0., it=0.;
  float ts=P1;
  for(int i=0;i<64;i++){ if(float(i)>=P2) break;
    z=cmul(z,z)+cc; it++;
    if(dot(z,z)>64.) break;
    vec2 q=z/ts;
    if(i>2 && got<.5 && abs(q.x)<uPhotoAR*.5 && abs(q.y)<.5){ hit=photo(q); got=1.; }
  }
  float esc=it/P2;
  vec3 fill=pal(esc*1.5+uTime*.02)*esc*.6*P7;
  vec3 col=got>.5?sat(hit,1.15)*(.7+.5*esc):fill;
  col+=pal(.5+esc)*pow(esc,4.)*.6*P3*(.5+uBeat);
  c=vec4(react(col),1);
}`});L({id:"ph_sort",name:"Pixel Sort",desc:"Glitch-art streaks: bright parts of your photo drip and smear like sorted pixels",params:[{n:"Threshold",min:0,max:.9,def:.4},{n:"Streak Length",min:0,max:1,def:.65},{n:"Angle",min:-1,max:1,def:0},{n:"Bass Melt",min:0,max:2,def:1},{n:"Smear",min:0,max:1,def:.6},{n:"Color Pop",min:.8,max:2,def:1.3},{n:"Flow",min:0,max:2,def:.5},{n:"Glitch Hits",min:0,max:2,def:1}],stick:[0,1],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=cover(UV(fc));
  mat2 Rm=rot(P2*1.57+uCam.x*.5);
  vec2 dir=Rm*vec2(0.,-1.);
  float thr=P0-uBass*.15*P3-exp(-uSinceBeat*3.)*.15*P7;
  float l=lum(photoL(uv,2.5));
  float len=P1*(.3+uBass*.15*P3+kick()*.1*P3)*smoothstep(thr,thr+.25,l)*(.7+.3*sin(uTime*.3*P6+dot(uv,vec2(9.,3.))));
  vec3 avg=vec3(0), best=photo(uv); float bl=lum(best);
  for(int i=1;i<12;i++){ float k=float(i)/11.; vec3 s=photo(uv+dir*len*k); avg+=s; float sl=lum(s); if(sl>bl){ bl=sl; best=s; } }
  avg/=11.;
  vec3 col=mix(best, avg, P4*.5);
  float band=h11(floor(uv.y*60.)+floor(uTime*6.));
  if(band>1.-exp(-uSinceBeat*6.)*.08*P7) col=photo(uv+vec2(.03*(band-.5),0.));
  c=vec4(react(sat(col,P5)),1);
}`});L({id:"ph_vhs",name:"VHS Dream",desc:"Your photo as a warm, wobbly old videotape with tracking glitches on the beat",params:[{n:"Wobble",min:0,max:2,def:.8},{n:"Color Bleed",min:0,max:2,def:1},{n:"Scanlines",min:0,max:1,def:.5},{n:"Tape Noise",min:0,max:1,def:.35},{n:"Tracking Hits",min:0,max:2,def:1},{n:"Warmth",min:0,max:1,def:.5},{n:"Zoom",min:.8,max:1.4,def:1},{n:"Roll",min:0,max:1,def:.2}],stick:[0,1],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=cover(UV(fc))/P6;
  float y=fc.y/uRes.y;
  float t=uTime;
  uv.x+=sin(y*24.+t*2.3)*.0025*P0+sin(y*3.+t*.7)*.004*P0*(.5+uBass);
  float bandY=fract(-t*.08*P7-uSinceBeat*.0);
  float band=smoothstep(.06,0.,abs(y-bandY));
  float hit=exp(-uSinceBeat*3.5)*P4;
  float tear=step(.75,h11(floor(y*48.)+floor(t*10.)))*hit;
  uv.x+=(band*.02+tear*.04)*(h11(floor(y*200.)+t)-.5)*4.;
  float o=.004*P1;
  vec3 sharp=photo(uv);
  vec3 bleedC=vec3(photoL(uv+vec2(o,0.),1.8).r, photoL(uv,1.8).g, photoL(uv-vec2(o,0.),1.8).b);
  vec3 col=mix(sharp, lum(sharp)+(bleedC-lum(bleedC)), .75);
  col=mix(col, col*vec3(1.08,.98,.85), P5);
  col*=1.-P2*.25*(.5+.5*sin(fc.y*1.7));
  col+=(h21(fc+fract(t)*97.)-.5)*.18*P3+band*.12*P3;
  col=sat(col,1.25)*(.95+uBass*.1);
  c=vec4(react(col),1);
}`});L({id:"ph_mosaic",name:"Photomosaic",desc:"Your photo built from hundreds of tiny copies of itself",params:[{n:"Tiles",min:8,max:60,def:22,ms:.2},{n:"Tint",min:0,max:1,def:.65},{n:"Dive",min:0,max:1,def:.4},{n:"Grout",min:0,max:.2,def:.06},{n:"Tile Pop",min:0,max:2,def:1},{n:"Drift",min:0,max:1,def:.3},{n:"Real Photo",min:0,max:1,def:.15},{n:"Shimmer",min:0,max:2,def:.8}],stick:[1,6],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=cover(UV(fc))*(1.-P2*.35*(.5+.5*sin(uTime*.07)))+vec2(sin(uTime*.05),cos(uTime*.04))*.05*P5;
  float N=P0;
  vec2 g=uv*N, id=floor(g), f=fract(g);
  vec3 target=photoL((id+.5)/N,3.);
  vec2 tq=(f-.5)*vec2(uPhotoAR,1.)*min(1./uPhotoAR,1.);
  vec3 tile=photoL(tq,1.);
  vec3 avg=photoL(vec2(0),9.);
  vec3 col=tile*(target/max(avg,vec3(.05)));
  col=mix(col, mix(tile,target,.6)*1.1, P1*.5);
  float hid=h21(id);
  col*=1.+P4*.8*exp(-uSinceBeat*3.)*step(.7,fract(hid+uBeatCount*.37));
  col*=1.+P7*.25*fft(hid)*uHigh;
  col=mix(col, photo(uv), P6);
  float gr=min(min(f.x,1.-f.x),min(f.y,1.-f.y));
  col*=smoothstep(0.,P3*.5+.001,gr)*.85+.15;
  c=vec4(react(col),1);
}`});L({id:"ph_pop",name:"Pop Art",desc:"Warhol-style panels of your photo in bold flat colours that swap on the beat",crisp:!0,params:[{n:"Panels",min:1,max:4,def:2,ms:.2},{n:"Color Levels",min:2,max:5,def:3,ms:.2},{n:"Ink Lines",min:0,max:2,def:1},{n:"Dots",min:0,max:1,def:.35},{n:"Swap Speed",min:0,max:2,def:1},{n:"Panel Gap",min:0,max:.08,def:.02},{n:"Contrast",min:.6,max:2,def:1.2},{n:"Zoom",min:.7,max:1.5,def:1}],stick:[3,6],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  float N=floor(P0+.5);
  float sAR=uRes.x/uRes.y;
  vec2 g=(uv+vec2(sAR,1.)*.5)/vec2(sAR,1.)*N;
  vec2 id=floor(g), f=fract(g);
  vec2 local=(f-.5)*vec2(sAR,1.)/N;
  vec2 q=cover(local*N)/P7;
  float l=clamp((lum(photoL(q,.8))-.5)*P6+.5,0.,1.);
  float lv=floor(P1+.5);
  float lev=floor(l*lv)/max(lv-1.,1.);
  float seed=h21(id)+floor(uBeatCount*.25*P4)*.31+floor(uTime*.1*P4)*.17;
  vec3 col=pal(seed+lev*.45)*(.35+lev*.8);
  float px=1./uRes.y;
  float e=length(vec2(lum(photoL(q+vec2(px*2.,0),1.))-lum(photoL(q-vec2(px*2.,0),1.)), lum(photoL(q+vec2(0,px*2.),1.))-lum(photoL(q-vec2(0,px*2.),1.))));
  col*=1.-smoothstep(.06,.14,e)*.9*P2;
  vec2 dg=fract(uv*90.*rot(.785))-.5;
  col*=1.-P3*.35*step(length(dg),.32*(1.-l));
  float gap=min(min(f.x,1.-f.x),min(f.y,1.-f.y));
  col*=step(P5*N*.5,gap)*.9+.1*step(N,1.5);
  c=vec4(react(col*(.95+uBass*.12)),1);
}`});L({id:"ph_ascii",name:"ASCII Art",desc:"Your photo typed out in glowing text characters, like an old terminal",crisp:!0,params:[{n:"Characters",min:24,max:110,def:44,ms:.2},{n:"Terminal Green",min:0,max:1,def:.2},{n:"Brightness",min:.6,max:2,def:1.2},{n:"Rain",min:0,max:2,def:.7},{n:"Glow",min:0,max:2,def:.8},{n:"Contrast",min:.6,max:2,def:1.2},{n:"Beat Flash",min:0,max:2,def:1},{n:"Back Photo",min:0,max:.5,def:.06}],stick:[5,1],code:`
float glyph(float n, vec2 p){
  p=floor(p*vec2(-4.,4.)+2.5);
  if(clamp(p.x,0.,4.)==p.x && clamp(p.y,0.,4.)==p.y){
    int a=int(round(p.x)+5.*round(p.y));
    if(((int(n)>>a)&1)==1) return 1.;
  }
  return 0.;
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=cover(UV(fc));
  float N=P0;
  vec2 g=uv*N, id=floor(g), f=fract(g);
  vec3 pc=photoL((id+.5)/N,1.5);
  float rain=fract(id.y*.0+uTime*.25*P3+h11(id.x)*7.);
  float lm=clamp((lum(pc)-.5)*P5+.5,0.,1.)*(1.+exp(-rain*9.)*.8*P3);
  float n=4096.;
  if(lm>.15) n=65600.; if(lm>.27) n=332772.; if(lm>.38) n=15255086.;
  if(lm>.5) n=23385164.; if(lm>.62) n=15252014.; if(lm>.74) n=13199452.; if(lm>.86) n=11512810.;
  float ch=glyph(n, (f-.5)*2.2);
  vec3 ink=mix(sat(pc,1.4), vec3(.25,1.,.45)*lm, P1)*P2;
  ink*=1.+exp(-uSinceBeat*4.)*.6*P6*step(.7,h21(id+uBeatCount));
  vec3 col=ink*ch+ink*.05*P4+photo(uv)*P7;
  c=vec4(react(col),1);
}`});L({id:"ph_weave",name:"Woven Threads",desc:"Your photo woven from shimmering threads that ripple with the bass",params:[{n:"Threads",min:30,max:180,def:80,ms:.2},{n:"Shimmer",min:0,max:2,def:1},{n:"Ripple",min:0,max:2,def:.8},{n:"Thread Depth",min:0,max:1,def:.6},{n:"Color Play",min:0,max:1,def:.2},{n:"Gaps",min:0,max:.3,def:.08},{n:"Pattern",min:1,max:3,def:1,ms:.2},{n:"Zoom",min:.7,max:1.5,def:1}],stick:[2,4],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=cover(UV(fc))/P7;
  uv+=vec2(sin(uv.y*14.+uTime*1.5),sin(uv.x*12.-uTime*1.2))*.004*P2*(.4+uBass);
  float N=P0;
  vec2 g=uv*N, id=floor(g), f=fract(g);
  float pat=floor(P6+.5);
  float over=mod(id.x+id.y*pat,2.);
  float across=over>.5?f.x:f.y, along=over>.5?f.y:f.x;
  float prof=sin(across*PI);
  vec3 pc=photoL((id+.5)/N,.8);
  vec3 tint=mix(vec3(1.),pal(h21(id)*.3+(over>.5?.0:.5)+uTime*.02)*1.5,P4);
  float shine=pow(max(prof,0.),8.)*(.4+.6*sin(along*3.14+uTime*2.+id.x*.3+id.y*.2))*P1*(.5+uHigh+kick()*1.2);
  vec3 col=pc*tint*mix(1.,.45+.75*prof,P3)+vec3(shine*.35);
  col*=smoothstep(0.,P5+.001,prof)*.8+.2;
  c=vec4(react(col),1);
}`});L({id:"ph_disco",name:"Disco Ball",desc:"A mirror ball whose facets reflect your photo, throwing sparkles around the room",params:[{n:"Facets",min:8,max:30,def:16,ms:.2},{n:"Spin",min:0,max:2,def:.6},{n:"Size",min:.22,max:.45,def:.33},{n:"Sparkle",min:0,max:2,def:1},{n:"Light Spots",min:0,max:2,def:1},{n:"Reflection",min:.3,max:2,def:1},{n:"Room Photo",min:0,max:1,def:.3},{n:"Wobble",min:0,max:1,def:.3}],stick:[2,5],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  float spin=uTime*.25*P1+bstep(4.)*.18*P1+uCam.x*.5;
  vec3 col=photoL(uv*.6,5.)*P6*.5;
  // light spots sweeping the room
  vec2 sp=vec2(atan(uv.x,1.2)+spin*.6, uv.y*1.6);
  vec2 sg=sp*12., sid=floor(sg), sf=fract(sg)-.5;
  float hs=h21(sid);
  col+=pal(hs+uTime*.03)*smoothstep(.22,.0,length(sf))*step(.55,hs)*.35*P4*(.4+uBass);
  float R=P2*(1.+uBass*.04);
  vec2 q=uv-vec2(sin(uTime*.4)*.03*P7,.05+sin(uTime*.3)*.02*P7);
  float d2=dot(q,q);
  if(d2<R*R){
    vec3 n=vec3(q,-sqrt(R*R-d2))/R;
    n.yz*=rot(-.3); n.xz*=rot(spin);
    float lat=asin(clamp(n.y,-1.,1.)), lon=atan(n.z,n.x);
    float rows=P0, li=floor((lat/PI+.5)*rows);
    float latc=(li+.5)/rows*PI-PI*.5;
    float cols=max(floor(rows*2.*cos(latc)),3.);
    float lo=floor((lon/TAU+.5)*cols);
    float lonc=(lo+.5)/cols*TAU-PI;
    vec3 fn=vec3(cos(latc)*cos(lonc), sin(latc), cos(latc)*sin(lonc));
    fn.xz*=rot(-spin); fn.yz*=rot(.3);
    vec3 rd=reflect(vec3(0,0,1),fn);
    vec3 refl=photo(rd.xy*.5*P5);
    vec2 fl=vec2(fract((lat/PI+.5)*rows), fract((lon/TAU+.5)*cols));
    float grout=smoothstep(0.,.12,min(min(fl.x,1.-fl.x),min(fl.y,1.-fl.y)));
    float fid=h21(vec2(li,lo));
    float spark=step(.93-kick()*.08,fract(fid+uTime*.7))*P3*(.5+uHigh*1.5+kick());
    col=sat(refl,1.2)*(.55+.6*fn.z*0.+.45)*grout+spark*vec3(1.2);
    col*=.7+.4*smoothstep(-1.,1.,-n.z);
  } else col+=pal(.1)*glowLine(sqrt(d2)-R,.01)*.02*(.5+uBeat);
  c=vec4(react(col),1);
}`});L({id:"ph_thermal",name:"Thermal Vision",desc:"Your photo seen through a heat camera, glowing hotter with the bass",params:[{n:"Heat",min:.5,max:1.8,def:1},{n:"Shimmer",min:0,max:2,def:.8},{n:"Bass Heat",min:0,max:2,def:1},{n:"Edge Glow",min:0,max:2,def:.8},{n:"Scan",min:0,max:1,def:.4},{n:"Palette",min:0,max:1,def:0},{n:"Pulse Rings",min:0,max:2,def:.8},{n:"Zoom",min:.8,max:1.4,def:1}],stick:[0,2],code:`
vec3 heat(float t){
  t=clamp(t,0.,1.);
  vec3 a=mix(vec3(0.,0.,.05),vec3(.35,0.,.55),smoothstep(0.,.25,t));
  a=mix(a,vec3(.9,.05,.15),smoothstep(.2,.45,t));
  a=mix(a,vec3(1.,.55,0.),smoothstep(.4,.7,t));
  a=mix(a,vec3(1.,.95,.6),smoothstep(.65,.95,t));
  return a;
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=cover(UV(fc))/P7;
  uv+=vec2(0.,1.)*(vn(uv*18.+vec2(0.,-uTime*2.))-.5)*.006*P1;
  float l=lum(photoL(uv,1.))*P0;
  float px=1./uRes.y;
  float e=length(vec2(lum(photoL(uv+vec2(px*2.,0),1.5))-lum(photoL(uv-vec2(px*2.,0),1.5)), lum(photoL(uv+vec2(0,px*2.),1.5))-lum(photoL(uv-vec2(0,px*2.),1.5))));
  float rr=length(UV(fc));
  float ring=exp(-abs(rr-uSinceBeat*.9)*14.)*exp(-uSinceBeat*1.8)*P6;
  float t=l+uBass*.18*P2+e*1.5*P3+ring*.35;
  vec3 col=mix(heat(t), pal(t*.9), P5);
  col*=1.-P4*.15*step(.5,fract(fc.y*.25));
  c=vec4(react(col),1);
}`});L({id:"ph_holo",name:"Hologram",desc:"Your photo as a flickering sci-fi hologram with scanlines and glitches",params:[{n:"Flicker",min:0,max:2,def:.8},{n:"Scanlines",min:0,max:2,def:1},{n:"Glitch",min:0,max:2,def:1},{n:"Hue",min:0,max:1,def:.55},{n:"RGB Split",min:0,max:2,def:.8},{n:"Detail",min:.6,max:2,def:1.2},{n:"Projection Fade",min:0,max:1,def:.5},{n:"Size",min:.6,max:1.2,def:.9}],stick:[3,0],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  vec2 q=cover(uv)/P7;
  float y=fc.y/uRes.y;
  float gl=step(.8,h11(floor(y*30.)+floor(uTime*12.)))*exp(-uSinceBeat*3.)*P2;
  q.x+=gl*(h11(floor(y*30.)+uTime)-.5)*.08;
  float o=.004*P4*(1.+uBass);
  float r=lum(photo(q+vec2(o,0))), g=lum(photo(q)), b=lum(photo(q-vec2(o,0)));
  float l=pow(clamp(g,0.,1.),1./P5);
  vec3 base=mix(vec3(.2,.9,1.),pal(.0),.0);
  vec3 tint=.5+.5*cos(TAU*(P3+vec3(0.,.33,.67)));
  tint=mix(vec3(.2,.95,1.),tint,step(.01,abs(P3-.55))*.0+abs(P3-.55)*1.8);
  vec3 col=tint*l*(1.15+uBass*.3+kick()*.5)+vec3(r-g,0.,b-g)*.6;
  col*=1.-P1*.35*(.5+.5*sin(fc.y*1.6+uTime*14.));
  col*=1.-P0*.2*step(.92,h11(floor(uTime*20.)));
  col+=tint*smoothstep(.02,0.,abs(fract(y*1.5-uTime*.3)-.5))*.25;
  float fade=mix(1.,smoothstep(.95,.25,abs(uv.x)/max(uRes.x/uRes.y*.5,.1))*smoothstep(-.5,-.2,uv.y)*1.1,P6);
  c=vec4(react(col*fade),1);
}`});L({id:"ph_rays",name:"Cathedral Light",desc:"Light pours through the bright parts of your photo in glowing shafts",params:[{n:"Ray Strength",min:0,max:2.5,def:1.3},{n:"Ray Length",min:.2,max:1,def:.8},{n:"Threshold",min:-.2,max:.5,def:.08},{n:"Light Drift",min:0,max:2,def:.6},{n:"Bass Beams",min:0,max:2,def:1},{n:"Photo Dim",min:.1,max:1,def:.32},{n:"Warm Light",min:0,max:1,def:.4},{n:"Dust",min:0,max:1,def:.4}],stick:[0,1],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  vec2 q=cover(uv);
  float avgL=lum(photoL(vec2(0),9.));
  float thr=avgL+P2;
  vec2 L=vec2(sin(uTime*.13*P3),.3+cos(uTime*.11*P3)*.12)*.45+uCam.xy*vec2(.3,-.2);
  vec2 d=(uv-L)*P1/16.;
  vec2 s=uv-d*h21(fc+fract(uTime)*31.);
  float decay=1., acc=0.;
  for(int i=0;i<16;i++){
    s-=d;
    acc+=smoothstep(thr,thr+.18,lum(photoL(cover(s),3.)))*decay;
    decay*=.9;
  }
  acc/=6.5;
  vec3 lc=mix(vec3(1.),vec3(1.,.83,.55),P6);
  vec3 col=photo(q)*P5*(.8+.2*acc);
  col+=lc*pow(acc,1.3)*P0*.7*(.6+uBass*.7*P4);
  col+=lc*exp(-length(uv-L)*9.)*.5*P0*(.5+uBass*.5);
  col+=lc*step(.996,h21(floor(fc*.5)+floor(uTime*3.)))*P7*acc*1.5;
  c=vec4(react(col),1);
}`});L({id:"ph_shatter",name:"Shatter",desc:"Your photo cracks into glass shards that burst apart on the beat and settle back",params:[{n:"Shards",min:3,max:20,def:8,ms:.2},{n:"Burst",min:0,max:2,def:1},{n:"Spin",min:0,max:2,def:.8},{n:"Crack Glint",min:0,max:2,def:1},{n:"Drift",min:0,max:1,def:.3},{n:"Shard Tint",min:0,max:1,def:.25},{n:"Depth",min:0,max:1,def:.5},{n:"Settle",min:.5,max:4,def:2}],stick:[1,2],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  vec2 p=uv*P0;
  vec2 n=floor(p), f=fract(p); float F1=9., F2=9.; vec2 cid=vec2(0), cpt=vec2(0);
  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
    vec2 g=vec2(i,j), o=h22(n+g); vec2 r=g+o-f; float d=dot(r,r);
    if(d<F1){ F2=F1; F1=d; cid=n+g; cpt=(n+g+o)/P0; } else if(d<F2) F2=d;
  }
  float edge=sqrt(F2)-sqrt(F1);
  float hid=h21(cid);
  float ex=exp(-uSinceBeat*P7)*P1*(.6+uBass*.6)+P4*.02*sin(uTime*.5+hid*6.);
  vec2 dir=normalize(cpt+1e-4)*(.5+hid);
  float ang=(hid-.5)*ex*P2*.8;
  vec2 local=(uv-cpt)*rot(ang)/(1.+ex*.15*P6*hid);
  vec2 src=cpt+local-dir*ex*.06;
  vec3 col=sat(photo(cover(src)),1.1);
  col=mix(col, col*pal(hid+uTime*.02)*1.6, P5*step(.6,hid));
  col*=(.85+.3*hid*P6)*(1.+ex*.35);
  float crack=smoothstep(.04+ex*.05,.0,edge);
  col=mix(col, vec3(.01), crack*.85);
  col+=pal(.1+hid*.3)*glowLine(edge,.006)*.04*P3*(.3+ex*2.+uHigh);
  c=vec4(react(col),1);
}`});L({id:"ph_water",name:"Water Reflection",desc:"Your photo above a lake, reflected in ripples that rain down on every beat",landscape:!0,params:[{n:"Horizon",min:-.3,max:.2,def:-.08},{n:"Ripples",min:0,max:2,def:1},{n:"Rain Drops",min:0,max:2,def:1},{n:"Water Tint",min:0,max:1,def:.4},{n:"Reflect",min:.3,max:1,def:.75},{n:"Wind",min:0,max:2,def:.7},{n:"Shimmer",min:0,max:2,def:1},{n:"Photo Zoom",min:.6,max:1.5,def:1}],stick:[0,1],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  float hz=P0+uCam.y*.1;
  vec2 q=cover(uv-vec2(0.,hz*.5))/P7;
  vec3 col;
  if(uv.y>hz){ col=sat(photo(q),1.1); }
  else{
    float depth=hz-uv.y;
    float persp=1./(depth*6.+.15);
    vec2 wp=vec2(uv.x*persp, persp*2.);
    vec2 n=vec2(vn(wp*2.+vec2(uTime*.3*P5,uTime*.5)), vn(wp*2.3-vec2(uTime*.4,0.)+5.))-.5;
    n*=P1*.06*(.5+uBass*.5)/(1.+persp*.08);
    float rings=0.;
    for(int k=0;k<3;k++){
      float fk=float(k), bt=uSinceBeat+fk*.45;
      vec2 cpos=vec2((h11(floor(uBeatCount-fk)+.3)-.5)*1.4, hz-.05-h11(floor(uBeatCount-fk)+.7)*.4);
      vec2 dd=(uv-cpos)*vec2(1.,3.2);
      float rr=length(dd);
      rings+=sin((rr-bt*.25)*90.)*exp(-abs(rr-bt*.25)*25.)*exp(-bt*1.6);
    }
    n.y+=rings*.012*P2;
    vec2 rq=vec2(uv.x, 2.*hz-uv.y)+n;
    vec3 refl=photo(cover(rq-vec2(0.,hz*.5))/P7);
    vec3 wc=mix(vec3(.02,.06,.1), pal(.6)*.15, .5);
    float fres=mix(.35,1.,smoothstep(.5,0.,depth));
    col=mix(wc, refl*mix(vec3(1.),vec3(.7,.85,1.),P3), P4*fres);
    col+=vec3(pow(max(n.x+n.y,0.)*12.,3.))*.15*P6*(.5+uHigh);
  }
  col+=pal(.1)*exp(-abs(uv.y-hz)*60.)*.15*(.5+uBass);
  c=vec4(react(col),1);
}`});L({id:"ph_tiles",name:"Flip Tiles",desc:"Your photo on a wall of tiles that flip over in waves with the beat",crisp:!0,params:[{n:"Tiles",min:4,max:24,def:10,ms:.2},{n:"Wave Speed",min:.5,max:4,def:2},{n:"Back Style",min:0,max:1,def:.7},{n:"Gap",min:0,max:.15,def:.04},{n:"Depth Shade",min:0,max:1,def:.6},{n:"Wave Shape",min:0,max:2,def:1,ms:.2},{n:"Idle Flips",min:0,max:1,def:.3},{n:"Zoom",min:.7,max:1.4,def:1}],stick:[4,7],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  float N=P0;
  vec2 g=uv*N, id=floor(g), f=fract(g)-.5;
  vec2 cc=(id+.5)/N;
  int sh=int(floor(P5+.5));
  float dist=sh==0?length(cc):sh==1?abs(cc.x)+abs(cc.y):(cc.x+.9);
  float prog=clamp(uSinceBeat*P1-dist*1.4,0.,1.);
  prog=prog*prog*(3.-2.*prog);
  float flips=uBeatCount-1.+prog+floor(uTime*.15*P6+h21(id)*P6*2.)*0.;
  float a=PI*flips;
  float cw=cos(a);
  float side=mod(floor(flips+.5),2.);
  float sx=abs(cw);
  vec3 col=vec3(.01);
  if(abs(f.x)<sx*.5*(1.-P3) && abs(f.y)<.5*(1.-P3)){
    vec2 lf=vec2(f.x/max(sx,.001), f.y);
    vec2 src=cover((id+.5+lf)/N)/P7;
    vec3 front=sat(photo(src),1.1);
    vec3 back=mix(front.bgr, pal(h21(id)+uTime*.02)*lum(front)*1.7, .5);
    col=mix(front, back, side*P2);
    col*=mix(1., .45+.55*sx, P4);
    col+=vec3(.25)*pow(1.-sx,6.)*P4+pal(h21(id))*pow(1.-sx,3.)*.4*kick();
  }
  c=vec4(react(col),1);
}`});L({id:"ph_bubbles",name:"Fisheye Bubbles",desc:"Soap bubbles drift up through your photo, each one a fisheye lens",params:[{n:"Bubbles",min:1.5,max:6,def:2.6,ms:.2},{n:"Rise",min:0,max:2,def:.6},{n:"Size",min:.3,max:1.2,def:.85},{n:"Magnify",min:1,max:4,def:2.2},{n:"Rainbow Film",min:0,max:2,def:1},{n:"Back Blur",min:0,max:6,def:2.5},{n:"Back Dim",min:.2,max:1,def:.55},{n:"Bass Swell",min:0,max:2,def:1}],stick:[2,3],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  vec3 col=sat(photoL(cover(uv),P5),1.05)*P6;
  for(int L=0;L<2;L++){
    float fl=float(L), sc=P0*(1.+fl*.7);
    vec2 p=uv*sc+vec2(fl*3.7, -uTime*.25*P1*(1.+fl*.4));
    vec2 id=floor(p), f=fract(p)-.5;
    for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
      vec2 cid=id+vec2(i,j);
      float h=h21(cid+fl*13.);
      if(h<.72) continue;
      vec2 o=(h22(cid+fl*7.)-.5)*.5+vec2(sin(uTime*.7+h*20.)*.08,0.);
      float R=(.18+.22*h)*P2*(1.+uBass*.18*P7+kick()*.08*P7);
      vec2 d=f-vec2(i,j)-o;
      float r=length(d);
      if(r<R){
        float k=r/R;
        vec2 lens=d*(1.-pow(1.-k*k,.5)*(1.-1./P3))/sc;
        vec2 ctr=uv-d/sc;
        vec3 inside=sat(photo(cover(ctr+lens*1.0+d/sc*(1./P3-1.)*(1.-k*k))),1.15);
        float film=pow(k,6.);
        inside+=pal(k*1.5+h*3.+uTime*.1)*film*.6*P4;
        inside+=vec3(1.)*smoothstep(.12,.0,length(d/R-vec2(-.35,.4)))*.5;
        col=mix(col, inside, smoothstep(R,R*.95,r));
      }
    }
  }
  c=vec4(react(col),1);
}`});L({id:"ph_planet",name:"Photo Planet",desc:"Your photo wrapped around a spinning planet with a glowing atmosphere",space:!0,params:[{n:"Spin",min:0,max:2,def:.5},{n:"Size",min:.25,max:.5,def:.37},{n:"Atmosphere",min:0,max:2,def:1},{n:"Sun Angle",min:-1,max:1,def:.4},{n:"Night Side",min:0,max:1,def:.15},{n:"Tilt",min:-1,max:1,def:.3},{n:"Stars",min:0,max:2,def:1},{n:"Moon",min:0,max:1,def:.6}],stick:[3,5],code:`
vec3 planetCol(vec2 uv, vec2 ctr, float R, float spin, float tilt, vec3 sun, out float hit){
  vec2 q=uv-ctr; float d2=dot(q,q); hit=0.;
  if(d2>=R*R) return vec3(0);
  hit=1.;
  vec3 n=vec3(q,-sqrt(R*R-d2))/R;
  vec3 m=n; m.xy*=rot(tilt); m.xz*=rot(spin);
  float lat=asin(clamp(m.y,-1.,1.)), lon=atan(m.z,m.x);
  vec2 tc=vec2((abs(lon)/PI-.5)*uPhotoAR, lat/PI);
  vec3 alb=sat(photo(tc),1.15);
  float dif=max(dot(n,sun),0.);
  vec3 col=alb*(P4*.25+dif*1.1);
  col+=pal(.55)*pow(1.-abs(n.z),3.)*.6*P2*(.6+uBass*.5);
  return col;
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)+uCam.xy*vec2(.2,-.2);
  vec2 sg=floor(fc/3.);
  float st=step(.995,h21(sg))*h21(sg+1.)*P6*(.6+.4*sin(uTime*3.+h21(sg)*40.));
  vec3 col=vec3(st)+pal(.7)*.04;
  vec3 sun=normalize(vec3(P3,.3,-.6));
  float R=P1*(1.+uBass*.04+kick()*.03);
  float hit;
  vec3 pc=planetCol(uv,vec2(0),R,uTime*.15*P0+bstep(4.)*.1,P5,sun,hit);
  float r=length(uv);
  col+=pal(.55)*exp(-max(r-R,0.)*28.)*.35*P2*(.5+uBass*.6)*(1.-hit);
  col=mix(col,pc,hit);
  float ma=uTime*.2;
  vec2 mc=vec2(cos(ma),sin(ma)*.35)*R*1.9;
  float mh;
  vec3 mcol=planetCol(uv,mc,R*.22,uTime*.5,0.,sun,mh);
  if(sin(ma)<0.||hit<.5) col=mix(col,mcol,mh*P7);
  c=vec4(react(col),1);
}`});L({id:"ph_tiny",name:"Tiny Planet",desc:"Your photo curled into a little round world that turns with the music",params:[{n:"Planet Size",min:.15,max:.8,def:.35},{n:"Spin",min:0,max:2,def:.4},{n:"Bass Bounce",min:0,max:2,def:1},{n:"Flip Inside Out",min:0,max:1,def:0,ms:.1},{n:"Horizon Glow",min:0,max:2,def:.8},{n:"Swirl",min:0,max:2,def:.3},{n:"Photo Width",min:.5,max:2,def:1},{n:"Sky Tint",min:0,max:1,def:.2}],stick:[0,5],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)*rot(uCam.x*.6);
  float r=length(uv), a=atan(uv.y,uv.x)+uTime*.12*P1+bstep(4.)*.1*P1+r*P5*sin(uTime*.2)*.8;
  float k=P0*(1.-uBass*.08*P2-exp(-uSinceBeat*4.)*.04*P2);
  float yy=-.5+2.*atan(r/k)/PI;
  if(P3>.5) yy=-yy;
  vec2 tc=vec2((abs(a)/PI-.5)*uPhotoAR*P6, yy);
  vec3 col=sat(photo(tc),1.15);
  col=mix(col, col*pal(.6+yy*.4)*1.6, P7*smoothstep(0.,.5,yy));
  col+=pal(.1+uTime*.02)*exp(-abs(r-k)*30.)*.25*P4*(.4+uBeat);
  c=vec4(react(col),1);
}`});L({id:"ph_gallery",name:"Photo Gallery",desc:"Glide down an endless gallery hall lined with framed copies of your photo",fly:!0,params:[{n:"Speed",min:0,max:2,def:.6},{n:"Frame Spacing",min:2,max:6,def:3.2},{n:"Spot Lights",min:0,max:2,def:1},{n:"Sway",min:0,max:1,def:.4},{n:"Floor Shine",min:0,max:1,def:.5},{n:"Ceiling Pulse",min:0,max:2,def:1},{n:"Frame Glow",min:0,max:2,def:.8},{n:"Hall Width",min:1.2,max:2.5,def:1.6}],stick:[3,6],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  float z0=uTime*1.2*P0+bstep(3.)*.8*P0;
  vec3 ro=vec3(sin(uTime*.3)*.25*P3, .05, z0);
  vec3 rd=normalize(vec3(uv,1.3));
  rd.xz*=rot(uCam.x*.4+sin(uTime*.2)*.08*P3); rd.yz*=rot(uCam.y*.25);
  float W=P7, H=1.1;
  float tw=rd.x>0.?(W-ro.x)/rd.x:(-W-ro.x)/rd.x;
  float tf=rd.y>0.?(H-ro.y)/rd.y:(-H-ro.y)/rd.y;
  float t=min(tw,tf);
  vec3 p=ro+rd*t;
  vec3 col;
  float fog=exp(-t*.06);
  if(tw<tf){
    float zz=p.z, sp=P1;
    float cz=(floor(zz/sp)+.5)*sp;
    vec2 fl=vec2((zz-cz)/(.9*min(uPhotoAR,1.6)), p.y/.62);
    col=vec3(.05,.045,.06)+pal(.8)*.02;
    float spot=exp(-length(vec2((zz-cz)*.6,p.y-.6))*1.6)*P2;
    col+=vec3(1.,.9,.75)*spot*.12;
    if(abs(fl.x)<.5 && abs(fl.y)<.5){
      vec2 tc=vec2(fl.x*(p.x>0.?-1.:1.)*uPhotoAR, fl.y);
      col=sat(photo(tc),1.1)*(.75+spot*.5);
    } else {
      float fr=max(abs(fl.x)-.5, abs(fl.y)-.5);
      if(fr<.06) col=mix(vec3(.25,.18,.08),pal(.1)*1.2,.4*P6*(.4+uBeat))*(.6+spot);
    }
  } else if(rd.y<0.){
    col=vec3(.03,.028,.035)*(1.+.4*step(.5,fract(p.z*.5)+.0)*step(.5,fract(p.x+.5)));
    vec3 rr=reflect(rd,vec3(0,1,0));
    float twr=rr.x>0.?(W-p.x)/rr.x:(-W-p.x)/rr.x;
    vec3 rp=p+rr*twr;
    float cz=(floor(rp.z/P1)+.5)*P1;
    vec2 fl=vec2((rp.z-cz)/(.9*min(uPhotoAR,1.6)), rp.y/.62);
    if(abs(fl.x)<.5 && abs(fl.y)<.5) col+=photo(vec2(fl.x*uPhotoAR,fl.y))*.25*P4;
  } else {
    col=vec3(.02)+pal(.6)*smoothstep(.15,.0,abs(fract(p.z*.5)-.5))*smoothstep(.3,.0,abs(p.x))*.6*P5*(.3+uBass*.8+exp(-uSinceBeat*3.)*.6);
  }
  col*=fog;
  c=vec4(react(col),1);
}`});L({id:"ph_cards",name:"Floating Cards",desc:"Hundreds of cards printed with your photo drift past you through space",fly:!0,params:[{n:"Density",min:.1,max:.7,def:.35},{n:"Speed",min:0,max:2,def:.6},{n:"Card Size",min:.2,max:.6,def:.38},{n:"Tumble",min:0,max:2,def:.8},{n:"Glow Edges",min:0,max:2,def:.8},{n:"Crop Variety",min:0,max:1,def:.5},{n:"Stars",min:0,max:2,def:1},{n:"Color Wash",min:0,max:1,def:.15}],stick:[2,7],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)+uCam.xy*vec2(.3,-.3);
  float z0=uTime*1.5*P1+bstep(3.)*.6*P1;
  vec3 col=vec3(step(.996,h21(floor(fc/2.)))*P6*.8)+pal(.7)*.03;
  bool done=false;
  for(int L=0;L<10;L++){ if(done) break;
    float fl=float(L);
    float zl=floor(z0)+fl+1.;
    float dz=zl-z0;
    if(dz<.15) continue;
    vec2 p=uv*dz*1.2;
    vec2 g=p/1.1, id=floor(g), f=fract(g)-.5;
    vec2 cid=id+zl*vec2(17.,31.);
    float h=h21(cid);
    if(h>P0) continue;
    vec2 o=(h22(cid)-.5)*.4;
    float ang=(h21(cid+5.)-.5)*3.*P3+uTime*.3*(h-.5)*P3;
    vec2 lf=rot(ang)*(f-o);
    float tilt=cos(uTime*.8*P3+h*20.);
    lf.x/=max(abs(tilt),.15);
    float S=P2;
    vec2 half_=vec2(S*min(uPhotoAR,1.6),S)*.5;
    if(abs(lf.x)<half_.x && abs(lf.y)<half_.y){
      vec2 tc=lf/half_*vec2(uPhotoAR,1.)*.5*(1.-P5*.5*h)+(h22(cid+3.)-.5)*P5*.4;
      vec3 im=sat(photo(tc*sign(tilt+1e-4)),1.1);
      im=mix(im, im*pal(h+uTime*.02)*1.6, P7);
      float e=min(half_.x-abs(lf.x), half_.y-abs(lf.y));
      im+=pal(h*.5)*glowLine(e,.01)*.03*P4*(.5+uBeat);
      float fog=smoothstep(10.,1.,dz);
      col=mix(col, im*(.55+.45*abs(tilt)), fog);
      done=true;
    }
  }
  c=vec4(react(col),1);
}`});var Re=Ue,Le=Ue.filter(a=>!a.photo),Ze=Ue.filter(a=>a.photo),_=Object.fromEntries(Ue.map(a=>[a.id,a])),le=`#version 300 es
in vec2 aPos; void main(){ gl_Position=vec4(aPos,0,1); }`,da=`#version 300 es
precision highp float;
uniform sampler2D uScene, uPrev, uMilk;
uniform vec2 uRes; uniform float uTime;
uniform float uTrail, uZoom, uSpin, uWarp, uHueDrift, uKaleido, uKaleidoSpin, uFusion, uBreathe, uBass, uBeat, uBurstT, uMelt, uMirror;
uniform vec2 uFlow, uBurstC;
uniform float uLensRot, uLensZoom, uSwirl, uBulge, uBeatRipT, uBeatRipAmt, uPunch, uShake;
uniform vec2 uLensPan;
uniform vec4 uTouch, uTouch2;   // xy pos, z strength, w active
uniform vec2 uTouchVel;
uniform vec3 uTouchColor; uniform float uTouchPaint, uEdgeBlack;
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
  vec2 inside=step(vec2(0.),tuv)*step(tuv,vec2(1.));
  float edgeK=mix(1.,inside.x*inside.y,uEdgeBlack);      // objects in space fade to black; patterns mirror-wrap
  tuv=1.-abs(1.-mod(tuv,2.));   // mirror-wrap: the lens never reveals black edges
  vec3 scene=texture(uScene, tuv).rgb*edgeK;
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
}`,ha=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes; out vec4 fragColor;
void main(){ vec2 uv=gl_FragCoord.xy/uRes; vec3 c=texture(uTex,uv).rgb; float l=max(c.r,max(c.g,c.b)); fragColor=vec4(c*smoothstep(.75,1.5,l),1); }`,pa=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes, uDir; out vec4 fragColor;
void main(){ vec2 uv=gl_FragCoord.xy/uRes; vec2 o=uDir/uRes; vec3 c=texture(uTex,uv).rgb*.227;
  c+=(texture(uTex,uv+o*1.38).rgb+texture(uTex,uv-o*1.38).rgb)*.316;
  c+=(texture(uTex,uv+o*3.23).rgb+texture(uTex,uv-o*3.23).rgb)*.07; fragColor=vec4(c,1); }`,va=`#version 300 es
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
}`,xa=`#version 300 es
precision highp float; uniform sampler2D uSmall, uPrev; uniform float uRate; out vec4 fragColor;
void main(){ vec3 c=textureLod(uSmall, vec2(.5), 10.).rgb; float l=mix(dot(c,vec3(.3,.59,.11)), max(c.r,max(c.g,c.b)), .55); float pl=texture(uPrev, vec2(.5)).r; fragColor=vec4(mix(pl,l,uRate),0,0,1); }`,ga=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes; out vec4 fragColor;
void main(){ fragColor=texture(uTex, gl_FragCoord.xy/uRes); }`;var Je=class{constructor(e){this.canvas=e;let t=this.gl=e.getContext("webgl2",{antialias:!1,alpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"});if(!t)throw new Error("WebGL2 is not available on this system.");this.halfFloat=!!t.getExtension("EXT_color_buffer_float"),t.getExtension("OES_texture_float_linear");let i=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,i),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),this.progs={},this.errors={},this.post={feedback:this.program(le,da),bright:this.program(le,ha),blur:this.program(le,pa),final:this.program(le,va),blit:this.program(le,ga),adapt:this.program(le,xa)},this.audioTex=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.audioTex),t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.texImage2D(t.TEXTURE_2D,0,t.R8,512,2,0,t.RED,t.UNSIGNED_BYTE,null),this.texParams(t.LINEAR,t.CLAMP_TO_EDGE),this.milkTex=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.milkTex),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,0,255])),this.texParams(t.LINEAR,t.CLAMP_TO_EDGE),this.photoTex=t.createTexture(),this.photoAR=1,this.photoId=null,t.bindTexture(t.TEXTURE_2D,this.photoTex),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([40,20,60,255])),this.aniso=t.getExtension("EXT_texture_filter_anisotropic"),this.scale=.75,this.fbIdx=0,this.finIdx=0,this.lumSmall=this.makeTarget(64,36),t.bindTexture(t.TEXTURE_2D,this.lumSmall.tex),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR_MIPMAP_LINEAR),t.generateMipmap(t.TEXTURE_2D),this.adapt=[this.makeTarget(1,1),this.makeTarget(1,1)],this.adIdx=0,this.W=0,this.H=0}texParams(e,t){let i=this.gl;i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,e),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,e),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,t),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,t)}shader(e,t){let i=this.gl,o=i.createShader(e);if(i.shaderSource(o,t),i.compileShader(o),!i.getShaderParameter(o,i.COMPILE_STATUS)){let n=i.getShaderInfoLog(o);throw i.deleteShader(o),new Error(n)}return o}program(e,t){let i=this.gl,o=i.createProgram();if(i.attachShader(o,this.shader(i.VERTEX_SHADER,e)),i.attachShader(o,this.shader(i.FRAGMENT_SHADER,t)),i.bindAttribLocation(o,0,"aPos"),i.linkProgram(o),!i.getProgramParameter(o,i.LINK_STATUS))throw new Error(i.getProgramInfoLog(o));let n={},s=i.getProgramParameter(o,i.ACTIVE_UNIFORMS);for(let l=0;l<s;l++){let c=i.getActiveUniform(o,l);n[c.name.replace(/\[0\]$/,"")]=i.getUniformLocation(o,c.name)}return{p:o,u:n}}sceneProg(e){let t=Re.find(s=>s.id===e),i=Math.min(t.ss||1,this.ssMax??4),o=i>1?e+"@"+i:e;if(this.progs[o])return this.progs[o];let n=St.replace(`#version 300 es
`,`#version 300 es
#define SS `+i+`
`)+t.code;try{this.progs[o]=this.program(le,n)}catch(s){this.errors[e]=String(s),console.error("Scene",e,s),this.progs[o]=null}return this.progs[o]}mapProg(e){let t=e+":map";if(this.progs[t]!==void 0)return this.progs[t];let i=Re.find(o=>o.id===e);try{this.progs[t]=this.program(le,St+i.map)}catch(o){this.errors[t]=String(o),console.error("Map",e,o),this.progs[t]=null}return this.progs[t]}precompile(e,t){let i=0,o=()=>{if(i>=e.length)return t&&t();this.sceneProg(e[i++]),setTimeout(o,0)};o()}makeTarget(e,t,i=!0){let o=this.gl,n=o.createTexture();o.bindTexture(o.TEXTURE_2D,n),i&&this.halfFloat?o.texImage2D(o.TEXTURE_2D,0,o.RGBA16F,e,t,0,o.RGBA,o.HALF_FLOAT,null):o.texImage2D(o.TEXTURE_2D,0,o.RGBA8,e,t,0,o.RGBA,o.UNSIGNED_BYTE,null),this.texParams(o.LINEAR,o.CLAMP_TO_EDGE);let s=o.createFramebuffer();return o.bindFramebuffer(o.FRAMEBUFFER,s),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,n,0),o.clearColor(0,0,0,1),o.clear(o.COLOR_BUFFER_BIT),{tex:n,fb:s,w:e,h:t}}freeTarget(e){e&&(this.gl.deleteTexture(e.tex),this.gl.deleteFramebuffer(e.fb))}resize(e,t,i){if(e===this.W&&t===this.H&&i===this.scaleUsed)return;let o=this.gl,n=Math.max(64,Math.round(e*i)),s=Math.max(64,Math.round(t*i)),l=[this.sceneT,...this.fb||[],...this.fin||[],this.bA,this.bB],c=this.fb;this.sceneT=this.makeTarget(n,s),this.fb=[this.makeTarget(n,s),this.makeTarget(n,s)],c&&this.drawTo(this.fb[this.fbIdx],this.post.blit,{uTex:c[this.fbIdx].tex}),!this.fin||e!==this.W||t!==this.H?((this.fin||[]).forEach(p=>this.freeTarget(p)),this.fin=[this.makeTarget(e,t,!1),this.makeTarget(e,t,!1)]):l.splice(l.indexOf(this.fin[0]),2);let m=Math.max(32,Math.round(n/4)),d=Math.max(32,Math.round(s/4));this.bA=this.makeTarget(m,d),this.bB=this.makeTarget(m,d),l.forEach(p=>{p&&!this.fin.includes(p)&&this.freeTarget(p)}),this.W=e,this.H=t,this.scaleUsed=i,this.sw=n,this.sh=s}drawTo(e,t,i,o){let n=this.gl;n.bindFramebuffer(n.FRAMEBUFFER,e?e.fb:null);let s=e?e.w:this.W,l=e?e.h:this.H;n.viewport(0,0,s,l),n.useProgram(t.p);let c=0;for(let[m,d]of Object.entries(i)){let p=t.u[m];p!=null&&(d instanceof WebGLTexture?(n.activeTexture(n.TEXTURE0+c),n.bindTexture(n.TEXTURE_2D,d),n.uniform1i(p,c++)):typeof d=="number"?n.uniform1f(p,d):d.length===2?n.uniform2fv(p,d):d.length===3?n.uniform3fv(p,d):d.length===4&&n.uniform4fv(p,d))}t.u.uRes,t.u.uRes&&n.uniform2f(t.u.uRes,s,l),n.drawArrays(n.TRIANGLES,0,3)}setPhoto(e,t){let i=this.gl;i.bindTexture(i.TEXTURE_2D,this.photoTex),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,e),i.generateMipmap(i.TEXTURE_2D),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR_MIPMAP_LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.MIRRORED_REPEAT),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.MIRRORED_REPEAT),this.aniso&&i.texParameterf(i.TEXTURE_2D,this.aniso.TEXTURE_MAX_ANISOTROPY_EXT,8),this.photoAR=e.width/e.height,this.photoId=t}uploadAudio(e){let t=this.gl;t.bindTexture(t.TEXTURE_2D,this.audioTex),t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.texSubImage2D(t.TEXTURE_2D,0,0,0,512,2,t.RED,t.UNSIGNED_BYTE,e)}uploadMilk(e){let t=this.gl;t.bindTexture(t.TEXTURE_2D,this.milkTex),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!0),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1)}snapshot(){this.transTex=this.fin[this.finIdx].tex,this.finIdx^=1}frame(e){let t=this.post;if(e.engine==="scene"){let d=Re.find(P=>P.id===e.scene),p=this.sceneProg(e.scene);if(p&&d&&d.selfFeedback){(!this.selfT||this.selfT[0].w!==this.sceneT.w||this.selfT[0].h!==this.sceneT.h)&&((this.selfT||[]).forEach(A=>this.freeTarget(A)),this.selfT=[this.makeTarget(this.sceneT.w,this.sceneT.h),this.makeTarget(this.sceneT.w,this.sceneT.h)],this.selfIdx=0);let P=this.selfT[this.selfIdx],y=this.selfT[this.selfIdx^1];this.drawTo(y,p,{...e.sceneU,uSelf:P.tex}),this.selfIdx^=1;let M=this.mapProg(e.scene);M&&this.drawTo(this.sceneT,M,{...e.sceneU,uSelf:y.tex})}else p&&this.drawTo(this.sceneT,p,e.sceneU)}let i=e.engine==="milk"?this.milkTex:this.sceneT.tex,o=this.fb[this.fbIdx],n=this.fb[this.fbIdx^1];this.drawTo(n,t.feedback,{...e.fbU,uScene:i,uPrev:o.tex,uMilk:this.milkTex}),this.fbIdx^=1,this.drawTo(this.bA,t.bright,{uTex:n.tex});for(let d=0;d<2;d++)this.drawTo(this.bB,t.blur,{uTex:this.bA.tex,uDir:[1+d,0]}),this.drawTo(this.bA,t.blur,{uTex:this.bB.tex,uDir:[0,1+d]});this.drawTo(this.lumSmall,t.blit,{uTex:n.tex});let s=this.gl;s.bindTexture(s.TEXTURE_2D,this.lumSmall.tex),s.generateMipmap(s.TEXTURE_2D);let l=this.adapt[this.adIdx],c=this.adapt[this.adIdx^1];this.drawTo(c,t.adapt,{uSmall:this.lumSmall.tex,uPrev:l.tex,uRate:e.adaptRate??.04}),this.adIdx^=1;let m=this.fin[this.finIdx];this.drawTo(m,t.final,{...e.finU,uTex:n.tex,uBloom:this.bA.tex,uTrans:this.transTex||n.tex,uAdapt:c.tex}),this.drawTo(null,t.blit,{uTex:m.tex})}};var ri=`
class KickDetector extends AudioWorkletProcessor {
  constructor(){
    super();
    this.k = .8; this.port.onmessage = (e) => { if (e.data.k !== undefined) this.k = e.data.k; };
    // two cascaded RBJ low-pass biquads at 120 Hz: keep the kick, drop everything else
    const f = 120, q = .707, w = 2*Math.PI*f/sampleRate, al = Math.sin(w)/(2*q), cw = Math.cos(w), a0 = 1+al;
    this.b0 = (1-cw)/2/a0; this.b1 = (1-cw)/a0; this.b2 = (1-cw)/2/a0; this.a1 = -2*cw/a0; this.a2 = (1-al)/a0;
    this.s = new Float64Array(8);
    this.slow = -90; this.mean = 0; this.var = 4; this.ref = 0; this.hiL = -90;
    this.blk = 0; this.odfMax = 0; this.acc = 0; this.prev4 = null;
  }
  bq(x, o){ const s = this.s; const y = this.b0*x + this.b1*s[o] + this.b2*s[o+1] - this.a1*s[o+2] - this.a2*s[o+3];
    s[o+1] = s[o]; s[o] = x; s[o+3] = s[o+2]; s[o+2] = y; return y; }
  process(inputs, outputs){
    const inp = inputs[0]; if (!inp || !inp.length) return true;
    const L0 = inp[0], R0 = inp[1] || inp[0], n = L0.length; let e = 0;
    for (let i = 0; i < n; i++){ const y = this.bq(this.bq((L0[i] + R0[i]) * .5, 0), 4); e += y*y; }
    const L = 10 * Math.log10(e / n + 1e-12);
    const odf = Math.max(0, L - this.slow);                       // rise above the recent kick-band level (dB)
    this.slow += (L - this.slow) * (1 - Math.exp(-n / (sampleRate * .12)));
    const b = 1 - Math.exp(-n / (sampleRate * 2));
    this.mean += (odf - this.mean) * b; this.var += ((odf - this.mean) ** 2 - this.var) * b;
    this.hiL = Math.max(L, this.hiL - n / sampleRate * 2.5);      // loudest recent kick-band level (decays 2.5 dB/s)
    const thr = this.mean + this.k * Math.sqrt(this.var) + 2;
    const t = currentTime;
    if (odf > thr && t - this.ref > .11 && L > this.hiL - 15){ this.ref = t; this.port.postMessage({ on: t, s: odf / (Math.sqrt(this.var) + 1) }); }
    this.odfMax = Math.max(this.odfMax, odf); this.acc += e / n;
    if (++this.blk % 4 === 0){
      const L4 = 10 * Math.log10(this.acc / 4 + 1e-12), fl = this.prev4 === null ? 0 : Math.max(0, L4 - this.prev4);
      this.prev4 = L4; this.acc = 0;
      this.port.postMessage({ odf: this.odfMax, fl, t }); this.odfMax = 0;
    }
    return true;
  }
}
registerProcessor('kick-detector', KickDetector);
`,Qe=class{constructor(e,t){if(this.ctx=e,this.ready=!1,this.T=0,this.conf=0,this.next=0,this.cand=null,this.hist=[],this.pendingHit=!1,this.locked=!1,this.lastEmit=-9,this.onBeat=()=>{},this.dbg={ticks:0,adv:0,reseed:0,hit:0,onsets:0},this.odf=new Float32Array(1024),this.odfN=0,this.odfHop=512/e.sampleRate,this.lastEst=0,!e.audioWorklet)return;let i=URL.createObjectURL(new Blob([ri],{type:"application/javascript"}));e.audioWorklet.addModule(i).then(()=>{this.node=new AudioWorkletNode(e,"kick-detector",{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[1],channelCount:2,channelCountMode:"explicit"});let o=e.createGain();o.gain.value=0,t.connect(this.node),this.node.connect(o),o.connect(e.destination),this.node.port.onmessage=n=>this.msg(n.data),this.ready=!0,this.timer=setInterval(()=>this.tick(),4)}).catch(o=>console.warn("beat worklet unavailable",o))}setSensitivity(e){this.node&&this.node.port.postMessage({k:Math.max(.3,1.55-e*.5)})}emit(e){if(e-this.lastEmit<Math.max(.2,this.T*.5))return;this.lastEmit=e;let t=Math.min(.15,(this.ctx.outputLatency||0)+(this.ctx.baseLatency||0));t>.005?setTimeout(()=>this.onBeat(),t*1e3):this.onBeat()}msg(e){if(e.odf!==void 0){this.odf[this.odfN++%this.odf.length]=e.odf,this.frame(e.t,e.fl);return}let t=e.on,i=e.s;if(this.dbg.onsets++,this.T>0&&this.next>0){let o=this.T,n=this.next-o,s=Math.abs(t-n)<Math.abs(t-this.next),l=s?t-n:t-this.next;Math.abs(l)<o*.2?(this.dbg.hit++,this.next+=l*(this.locked?.25:.5),this.T+=l*.015,s?this.lastScored||(this.lastHit=!0):this.earlyHit=!0):this.hist.length>=3&&!this.hist.slice(-3).some(Boolean)&&i>1.2&&(this.next=t+o,this.earlyHit=!1,this.lastHit=!0,this.lastScored=!1,this.phHist=null,this.dbg.reseed++)}else this.T>0&&(this.next=t+this.T);!this.locked&&i>1&&this.emit(t)}frame(e,t){if(!(this.T>0)||!(this.next>0)||!(t>0))return;let i=((e-this.next)/this.T%1+1)%1,o=this.phHist||(this.phHist=new Float32Array(16)),n=i*16,s=Math.floor(n)%16,l=n-Math.floor(n);o[s]+=t*(1-l),o[(s+1)%16]+=t*l}tick(){let e=this.ctx.currentTime;if(this.dbg.ticks++,e-this.lastEst>.5&&this.odfN>200&&(this.lastEst=e,this.estimateTempo()),!(this.T>0)||!(this.next>0))return;this.next<e-2&&(this.next=e+this.T,this.hist=[],this.locked=!1);let t=this.T;for(;e>=this.next;){this.dbg.adv++,this.locked&&this.emit(this.next),this.lastHit=!!this.earlyHit,this.earlyHit=!1,this.lastScored=!1,this.next+=t,this.sinceFlip=(this.sinceFlip||0)+1;let o=this.phHist;if(o){for(let m=0;m<16;m++)o[m]*=.92;let n=o[15]*.5+o[0]+o[1]*.5,s=0,l=0;for(let m=2;m<15;m++){let d=o[m-1]*.5+o[m]+o[m+1]*.5;d>l&&(l=d,s=m)}let c=this.locked?1.2:1.06;if(this.sinceFlip>(this.locked?6:3)&&l>n*c&&l>30){let m=(s>8?s-16:s)/16*t;for(this.next+=m;this.next<=e;)this.next+=t;let d=new Float32Array(16);for(let p=0;p<16;p++)d[p]=o[(p+s)%16];this.phHist=d,this.sinceFlip=0,this.dbg.flips=(this.dbg.flips||0)+1}}}let i=this.next-t;if(!this.lastScored&&e>=i+t*.2){this.lastScored=!0,this.hist.push(!!this.lastHit),this.hist.length>8&&this.hist.shift();let o=this.hist,n=e-(this.unlockedAt||-99)<8&&this.conf>.3,s=this.phHist,l=0;if(s)for(let c=0;c<16;c++)l+=s[c];if(!this.locked&&this.conf>.1&&l>40&&(o.length>=5&&o.slice(-5).filter(Boolean).length>=4||n&&o.length>=2&&o[o.length-1]&&o[o.length-2])){let c=0,m=-1;for(let d=0;d<16;d++){let p=s[(d+15)%16]*.5+s[d]+s[(d+1)%16]*.5;p>m&&(m=p,c=d)}if(c!==0){for(this.next+=(c>8?c-16:c)/16*t;this.next<=e;)this.next+=t;let d=new Float32Array(16);for(let p=0;p<16;p++)d[p]=s[(p+c)%16];this.phHist=d,this.hist=[],this.sinceFlip=0}else this.locked=!0}else this.locked&&(o.length>=3&&!o[o.length-1]&&!o[o.length-2]&&!o[o.length-3]||this.conf<.05)&&(this.locked=!1,this.unlockedAt=e)}}estimateTempo(){let e=Math.min(this.odfN,this.odf.length),t=new Float32Array(e),i=0;for(let T=0;T<e;T++)t[T]=this.odf[(this.odfN-e+T)%this.odf.length],i+=t[T];i/=e;let o=0;for(let T=0;T<e;T++)t[T]-=i,o+=t[T]*t[T];if(o<=0)return;let n=this.odfHop,s=Math.floor(60/190/n),l=Math.ceil(60/68/n),c=new Float32Array(l*2+2);for(let T=s;T<=Math.min(l*2+1,e-1);T++){let b=0;for(let R=T;R<e;R++)b+=t[R]*t[R-T];c[T]=b/o}let m=T=>c[T]+.5*(c[2*T]||0),d=-1,p=0;for(let T=s;T<=l;T++){let b=60/(T*n),R=Math.exp(-.5*(Math.log2(b/128)/1.1)**2),S=m(T)*R;S>d&&(d=S,p=T)}let y=(T=>{let b=c[T-1]||0,R=c[T],S=c[T+1]||0,C=b-2*R+S;return T+(C<0?.5*(b-S)/C:0)})(p)*n;if(!(this.T>0)){this.T=y,this.conf=c[p];return}let M=Math.round(this.T/n),A=M>=s&&M<=l?m(M):0;if(this.conf=Math.max(c[p],M<c.length?c[M]:0),Math.abs(y/this.T-1)<.04){this.T=this.T*.8+y*.2,this.cand=null,this.candN=0;return}let k=y/this.T,X=Math.abs(k-2)<.1||Math.abs(k-.5)<.05?1.6:1.25;m(p)>A*X?this.cand&&Math.abs(y/this.cand-1)<.04?++this.candN>=3&&(this.T=y,this.cand=null,this.candN=0,this.locked=!1,this.hist=[]):(this.cand=y,this.candN=1):(this.cand=null,this.candN=0)}get bpm(){return this.T>0?60/this.T:0}};var et=class{constructor(){this.ctx=new(window.AudioContext||window.webkitAudioContext)({latencyHint:"interactive"}),this.el=new Audio,this.el.crossOrigin="anonymous",this.el.preload="auto",this.elSrc=this.ctx.createMediaElementSource(this.el),this.input=this.ctx.createGain(),this.analyser=this.ctx.createAnalyser(),this.analyser.fftSize=2048,this.analyser.smoothingTimeConstant=.55,this.out=this.ctx.createGain(),this.elSrc.connect(this.input),this.input.connect(this.analyser),this.elSrc.connect(this.out),this.out.connect(this.ctx.destination),this.freq=new Uint8Array(1024),this.time=new Uint8Array(2048),this.tex=new Uint8Array(512*2),this.bass=0,this.mid=0,this.high=0,this.vol=0,this.beat=0,this.beatCount=0,this.peak={b:.2,m:.2,h:.2,v:.2},this.bassAvg=0,this.lastBeat=0,this.drop=0,this.playlist=[],this.index=-1,this.shuffle=!1,this.repeat="all",this.mode="player",this.stream=null,this.streamSrc=null,this.onchange=()=>{},this.tracker=new Qe(this.ctx,this.input),this.tracker.onBeat=()=>{this.pendingBeat=!0},this.el.addEventListener("ended",()=>this.next(!0)),this.el.addEventListener("play",()=>this.onchange()),this.el.addEventListener("pause",()=>this.onchange());let e=this.ctx.sampleRate/2;this.binMap=new Float32Array(512);for(let t=0;t<512;t++){let i=30*Math.pow(533.3333333333334,t/511);this.binMap[t]=Math.min(1023,i/e*1024)}}async setOutput(e){try{return this.ctx.setSinkId?await this.ctx.setSinkId(e==="default"?"":e):this.el.setSinkId&&await this.el.setSinkId(e),!0}catch(t){return console.warn(t),!1}}resume(){this.ctx.state!=="running"&&this.ctx.resume()}addTracks(e){let t=this.playlist.length===0;this.playlist.push(...e),t&&e.length&&this.play(0),this.onchange()}remove(e){this.playlist.splice(e,1),e<this.index?this.index--:e===this.index&&(this.index=Math.min(this.index,this.playlist.length-1),this.index>=0?this.play(this.index):this.el.pause()),this.onchange()}clear(){this.playlist=[],this.index=-1,this.el.pause(),this.el.removeAttribute("src"),this.onchange()}async play(e){if(!(e<0||e>=this.playlist.length)){this.useSource("player"),this.index=e,this.el.src=this.playlist[e].url,this.resume();try{await this.el.play()}catch(t){console.warn(t)}this.onchange()}}toggle(){if(this.resume(),this.mode!=="player"&&this.useSource("player"),this.index<0&&this.playlist.length)return this.play(0);this.el.paused?this.el.play():this.el.pause()}next(e){if(!this.playlist.length)return;if(this.repeat==="one"&&e)return this.play(this.index);let t=this.shuffle?Math.floor(Math.random()*this.playlist.length):this.index+1;if(t>=this.playlist.length){if(this.repeat==="off"&&e)return;t=0}this.play(t)}prev(){if(this.el.currentTime>3){this.el.currentTime=0;return}this.play((this.index-1+this.playlist.length)%Math.max(1,this.playlist.length))}get current(){return this.playlist[this.index]}stopStream(){this.stream&&(this.stream.getTracks().forEach(e=>e.stop()),this.stream=null),this.streamSrc&&(this.streamSrc.disconnect(),this.streamSrc=null)}useSource(e){e==="player"&&this.mode!=="player"&&(this.stopStream(),this.mode="player",this.onchange())}async useLoopback(){this.resume();let e=await navigator.mediaDevices.getDisplayMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1},video:!0,systemAudio:"include",selfBrowserSurface:"exclude"});if(e.getVideoTracks().forEach(t=>t.stop()),!e.getAudioTracks().length)throw new Error("No audio was shared \u2014 pick a tab or \u201CEntire screen\u201D and turn on \u201CShare audio\u201D.");this.attachStream(e,"loopback")}async useMic(){this.resume();let e=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});this.attachStream(e,"mic")}attachStream(e,t){this.el.pause(),this.stopStream(),this.stream=e,this.streamSrc=this.ctx.createMediaStreamSource(e),this.streamSrc.connect(this.input),this.mode=t,this.onchange()}update(e,t=1,i={}){let o=i.sens??1,n=i.gB??1,s=i.gM??1,l=i.gH??1,c=this.analyser;c.getByteFrequencyData(this.freq),c.getByteTimeDomainData(this.time);let m=this.ctx.sampleRate/2,d=this.freq,p=(E,q)=>{let N=Math.max(1,Math.floor(E/m*1024)),J=Math.max(N+1,Math.floor(q/m*1024)),te=0;for(let De=N;De<J;De++)te+=d[De];return te/(J-N)/255},P=p(25,160)*n,y=p(160,2200)*s,M=p(2200,12e3)*l,A=0;for(let E=0;E<2048;E+=4){let q=(this.time[E]-128)/128;A+=q*q}A=Math.sqrt(A/512);let k=this.peak,j=Math.pow(.25,e/8);k.b=Math.max(P,k.b*j,.05),k.m=Math.max(y,k.m*j,.05),k.h=Math.max(M,k.h*j,.03),k.v=Math.max(A,k.v*j,.02);let X=(E,q,N,J)=>E+(q-E)*(1-Math.exp(-e*(q>E?N:J))),T=Math.min(2.5,t);this.bass=X(this.bass,Math.pow(P/k.b,1.6)*T,30,8),this.mid=X(this.mid,Math.pow(y/k.m,1.4)*T,20,6),this.high=X(this.high,Math.pow(M/k.h,1.3)*T,25,7),this.vol=X(this.vol,A/k.v*T,15,4),this.bassAvg=this.bassAvg+(P-this.bassAvg)*(1-Math.exp(-e*2));let b=1-Math.exp(-e*1.4);this.bMean=(this.bMean??P)+(P-(this.bMean??P))*b;let R=(P-this.bMean)*(P-this.bMean);this.bVar=(this.bVar??.001)+(R-(this.bVar??.001))*b;let S=Math.sqrt(this.bVar),C=this.bMean+(1.25-o*.4)*S+.015,B=performance.now()/1e3;this.isBeat=!1,this.tracker.ready?(this.sensSent!==o&&(this.sensSent=o,this.tracker.setSensitivity(o)),this.pendingBeat&&(this.pendingBeat=!1,this.lastBeat=B,this.beat=1,this.beatCount++,this.isBeat=!0)):!this.above&&P>C&&P>.1&&B-this.lastBeat>.16?(this.lastBeat=B,this.beat=1,this.beatCount++,this.isBeat=!0,this.above=!0):this.above&&P<this.bMean+.3*S&&(this.above=!1),this.beat*=Math.exp(-e*7),this.drop=this.drop*Math.exp(-e*.5)+Math.max(0,P-this.bassAvg*1.6)*e*4;for(let E=0;E<512;E++){let q=this.binMap[E],N=Math.floor(q),J=q-N,te=d[N]*(1-J)+d[Math.min(1023,N+1)]*J;this.tex[E]=Math.min(255,te*(1+E/512*.8))}for(let E=0;E<512;E++)this.tex[512+E]=this.time[E*2]}};var I={A:0,B:1,X:2,Y:3,LB:4,RB:5,LT:6,RT:7,BACK:8,START:9,L3:10,R3:11,UP:12,DOWN:13,LEFT:14,RIGHT:15,TOUCH:17},tt=class{constructor(){this.prev=[],this.downAt=[],this.held=[],this.axes=[0,0,0,0],this.lt=0,this.rt=0,this.connected=!1,this.id="",this.deadzone=.14,this.style="xbox",this.lastInput=0,this.gp=null}poll(){let e=navigator.getGamepads?navigator.getGamepads():[],t=null;for(let y of e)if(y&&y.connected){t=y;break}this.hid&&this.hid.fresh&&(t=this.hid.asGamepad()),!t&&this.touch&&this.touch.active&&(t=this.touch.asGamepad()),this.gp=t;let i=this.connected;if(this.connected=!!t,this.justConnected=!i&&this.connected,!t){this.pressed=[],this.released=[];return}this.id=t.id,this.style=t.id==="Touch controls"?"touch":/054c|playstation|dualsense|dualshock/i.test(t.id)||/wireless controller/i.test(t.id)&&!/xbox|xinput|045e/i.test(t.id)?"ps":"xbox";let o=performance.now();this.pressed=[],this.released=[];let n=Math.min(t.buttons.length,18);for(let y=0;y<n;y++){let M=t.buttons[y],A=typeof M=="object"?M.value:M,k=typeof M=="object"&&M.pressed||A>.5;k&&!this.prev[y]&&(this.pressed[y]=!0,this.downAt[y]=o,this.held[y]=!1,this.lastInput=o),!k&&this.prev[y]&&(this.released[y]=!0),this.prev[y]=k}let s=y=>{let M=Math.abs(y);return M<this.deadzone?0:Math.sign(y)*((M-this.deadzone)/(1-this.deadzone))},l=t.axes,c=(y,M)=>{let A=Math.hypot(y,M);if(A<this.deadzone)return[0,0];let k=(A-this.deadzone)/(1-this.deadzone)/A;return[y*k,M*k]},[m,d]=c(l[0]||0,l[1]||0),[p,P]=c(l[2]||0,l[3]||0);this.axes=[m,d,p,P],this.lt=t.buttons[6]?t.buttons[6].value:0,this.rt=t.buttons[7]?t.buttons[7].value:0,Math.abs(m)+Math.abs(d)+Math.abs(p)+Math.abs(P)+this.lt+this.rt>.05&&(this.lastInput=o)}down(e){return!!this.prev[e]}tap(e){return!!this.pressed[e]}hold(e,t){return this.prev[e]&&!this.held[e]&&performance.now()-this.downAt[e]>t?(this.held[e]=!0,!0):!1}shortRelease(e){return!!this.released[e]&&!this.held[e]}rumble(e,t,i=80){let o=this.gp;if(!(!o||!o.vibrationActuator))try{o.vibrationActuator.playEffect("dual-rumble",{duration:i,strongMagnitude:Math.min(1,e),weakMagnitude:Math.min(1,t)})}catch{}}label(e){return this.style==="touch"?{A:"\u2738",B:"B",X:"\u2684",Y:"\u2605",LB:"\u2756",RB:"\u25D1",LT:"WARP",RT:"DRIVE",BACK:"?",START:"\u2630",L3:"L",R3:"R"}[e]||e:this.style==="ps"?{A:"\u2715",B:"\u25CB",X:"\u25A1",Y:"\u25B3",LB:"L1",RB:"R1",LT:"L2",RT:"R2",BACK:"Create",START:"Options",L3:"L3",R3:"R3"}[e]||e:{A:"A",B:"B",X:"X",Y:"Y",LB:"LB",RB:"RB",LT:"LT",RT:"RT",BACK:"View",START:"Menu",L3:"LS",R3:"RS"}[e]||e}};var K=[{name:"Acid Rainbow",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.33,.67]},{name:"Psilocybin",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[.8,.9,.3]},{name:"Synthwave",a:[.55,.3,.6],b:[.45,.3,.4],c:[1,1,1],d:[0,.15,.25]},{name:"Aurora",a:[.3,.55,.5],b:[.3,.45,.45],c:[1,1,1],d:[.55,.25,.3]},{name:"Molten Gold",a:[.6,.4,.2],b:[.4,.35,.2],c:[1,1,1],d:[0,.1,.2]},{name:"Deep Ocean",a:[.2,.4,.6],b:[.2,.35,.4],c:[1,1,1],d:[.3,.2,.1]},{name:"Toxic",a:[.4,.6,.3],b:[.4,.4,.4],c:[1,1.5,1],d:[.2,0,.5]},{name:"Candy",a:[.65,.5,.65],b:[.35,.45,.35],c:[1,1,1],d:[0,.5,.25]},{name:"Infrared",a:[.5,.2,.25],b:[.5,.3,.3],c:[1,1,1.5],d:[0,.1,.6]},{name:"Ultraviolet",a:[.45,.25,.65],b:[.45,.3,.35],c:[1,2,1],d:[.6,.1,0]},{name:"Ice Fire",a:[.5,.5,.5],b:[.5,.5,.5],c:[.5,.5,.5],d:[0,.15,.5]},{name:"Peacock",a:[.4,.5,.5],b:[.4,.4,.5],c:[2,1,1],d:[.5,.2,.25]},{name:"Sunset Dream",a:[.6,.4,.4],b:[.4,.4,.3],c:[1,1,1],d:[0,.2,.45]},{name:"Emerald Temple",a:[.25,.5,.35],b:[.25,.45,.3],c:[1,1,2],d:[.6,.3,.5]},{name:"Holographic",a:[.6,.6,.7],b:[.4,.4,.3],c:[2,2,2],d:[0,.33,.67]},{name:"Blacklight",a:[.35,.2,.55],b:[.35,.45,.45],c:[1.5,1,1],d:[.35,.7,.1]}],ie={trail:.55,zoom:1.01,spin:0,warp:.3,hueDrift:0,kaleido:0,kaleidoSpin:0,mirror:0,breathe:.4,melt:0,chroma:1,bloom:.8,grain:.3,vignette:.6,exposure:1,saturation:1.1,contrast:1.05,react:1,speed:1,fusion:0,hueSpin:0,dance:1,ripple:1,punch:1,shake:1,swirlA:1,bulgeA:1};function Bt(a){let e=2166136261;for(let t of a)e=Math.imul(e^t.charCodeAt(0),16777619)>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}var li={trail:[.1,.62],zoom:[.995,1.018],spin:[-.006,.006],warp:[0,1],breathe:[.1,1.2],melt:[0,.6],hueDrift:[-.01,.01],hueSpin:[-.05,.05],kaleidoSpin:[-.3,.3],chroma:[.4,1.6],bloom:[.35,.85],exposure:[.95,1.08],saturation:[1,1.4],contrast:[1,1.12],grain:[.08,.45],vignette:[.3,.95],react:[.8,1.5],speed:[.7,1.45],dance:[.4,1.9],ripple:[.3,1.7],punch:[.4,1.7],shake:[.15,1.4],swirlA:[.3,1.9],bulgeA:[.3,1.7]};function at(a,e=ie,t={}){let i=Bt(a),o={...ie,...e};for(let[n,[s,l]]of Object.entries(li))o[n]=+(s+i()*(l-s)).toFixed(4);return e.trail===0&&(o.trail=0),e.zoom===1&&(o.zoom=1),{...o,...t}}var x=(a,e,t,i={},o=0)=>{let n=_[a],s=Bt(e+"#shape"),l=n.params.map((m,d)=>{if(t[d]!==void 0)return t[d];let p=m.def+(s()-.5)*.16*(m.max-m.min);return+Math.max(m.min,Math.min(m.max,p)).toFixed(4)}),c=at(e,ie,i);return n.fly&&(c.trail=Math.min(c.trail,i.trail!==void 0?.3:.08+s()*.17)),n.selfFeedback&&i.trail===void 0&&(c.trail=s()*.15),n.crisp&&(c.trail=Math.min(c.trail,.28),c.melt=Math.min(c.melt,.2)),{id:"eye-"+e.toLowerCase().replace(/[^a-z0-9]+/g,"-"),name:e,engine:"scene",scene:a,params:l,palette:o,fx:c,builtin:!0}};var be=[x("cathedral","Cathedral of Echoes",[],{trail:.45},0),x("cathedral","Infinite Basilica",[1.1,.2,1.42,1.3,1.4,.95],{trail:.35,kaleido:0},4),x("cathedral","Neon Spine",[.55,1.1,1.6,1.3,2,.75,1.5,1.4],{trail:.5,zoom:1.012,hueDrift:.006},15),x("cathedral","Gothic Mushroom Vault",[.95,.7,1.5,1.2,.7,1.05,1,1.8],{breathe:.8,melt:.4,trail:.35},1),x("nebula","Warp Nebula",[],{},9),x("nebula","Wormhole Petals",[2,.4,3.2,1.6,1,.3,1.1,6],{kaleido:6,trail:.4},0),x("nebula","Cosmic Drain",[.6,.9,1.5,2.5,.4,-.6,1.2],{spin:.01,trail:.7,zoom:.985},5),x("julia","Julia Bloom",[],{},0),x("julia","Dendrite Garden",[1.2,1.3,.6,1.2,2,.76,.2,6],{trail:.4},13),x("julia","Paisley Mind",[2.6,.8,1.8,1,1.5,.79,-.4,1],{breathe:1.2,melt:.5},1),x("julia","Electric Lace",[4.2,1.6,2.4,1.5,2.8,.7885,.3,4],{kaleido:0,trail:.6,hueDrift:.02},15),x("gyroid","Gyroid Hyperspace",[],{},9),x("gyroid","Coral Lungs",[1.4,.8,.15,1.4,.7,1.8,.06,.3],{breathe:1.5,trail:.5},12),x("gyroid","Light Speed Lattice",[3,4.5,.03,1.6,.2,.6,.05,1.6],{trail:.5,zoom:1.02,chroma:1.6},0),x("chrome","Liquid Chrome",[],{},14),x("chrome","Mercury Heartbeat",[4,.9,.15,4,.6,2,.4,1.3],{trail:.3},10),x("chrome","Oil Slick Orbit",[8,.35,.7,12,1.6,1,2,1],{trail:.5,breathe:.8},1),x("horizon","Neon Horizon",[],{},2),x("horizon","Outrun Forever",[2.5,.38,1.5,10,1.2,1.5,14,1.5],{trail:.4,chroma:2},2),x("horizon","Hallucinated Highway",[1.5,.25,1.2,6,2,1,6,1.4],{breathe:1.2,melt:1,trail:.6,hueDrift:.01},0),x("mandala","Spectral Mandala",[],{},0),x("mandala","Lotus Reactor",[8,8,.8,2,.05,1.4,1.4,1.1],{trail:.6,zoom:1.015},7),x("mandala","Chakra Spin",[16,4,.3,1.2,.5,1,.4,.8],{trail:.75,spin:.008},9),x("mandala","Lace Galaxy",[24,10,1,1,-.2,2,2,1.3],{kaleido:0,trail:.5,hueDrift:.015},15),x("silk","Silk Warp",[],{},1),x("silk","Melting Marble",[1.4,2,1.6,.4,1.8,1.2,1.8,1],{breathe:1,melt:.5},4),x("silk","Liquid Thought",[3.5,1.6,.8,1.2,1,1.5,1.2,.2],{kaleido:8,trail:.4},3),x("silk","Tie-Dye Ocean",[2.6,2.6,2.6,.9,.8,1,1.1,.6],{trail:.3,hueDrift:.02},0),x("apollo","Apollonian Dream",[],{},14),x("apollo","Bubble Universe",[1.32,.4,2.2,2.5,1,.8,.2,1.3],{trail:.5},11),x("apollo","Pearl Labyrinth",[1.08,1.2,.8,.8,1.8,.3,.6,1.6],{breathe:.6},4),x("voronoi","Stained Voronoi",[],{},7),x("voronoi","Cathedral Window",[4,.3,.08,1.5,2,.3,0,.9],{kaleido:12,trail:.3},0),x("voronoi","Cell Division",[12,1.5,.02,2.5,2.5,1,1.4,.3],{trail:.6,breathe:1.2,melt:.4},6),x("wavefield","Neon Wavefield",[],{},2),x("wavefield","Pulsar Ridge",[.6,1.6,1.8,.4,.1,1,.4,.1],{trail:.5,chroma:1.5},10),x("wavefield","Spectral Dunes",[.2,1.2,1,1.2,.8,.6,1.8,0],{mirror:1,trail:.6},3),x("starcore","Star Core",[],{},4),x("starcore","Blue Giant",[3,1.6,1.6,2,1.6,1.4,1,1.2],{trail:.6},5),x("starcore","Quasar Eye",[2.2,2,1.4,2.2,2,1.4,1.2,.85],{kaleido:6,trail:.35},8),x("flower","Flower of Life",[],{},4),x("flower","Metatron Gate",[2,.15,2,1.6,4,1.5,.6,1],{trail:.5,zoom:1.012},13),x("flower","Seed of Creation",[2.6,-.05,.6,1.2,4,1,.35,1.4],{trail:.45,breathe:1,hueDrift:.006},1),x("fall","Endless Fall",[],{},0),x("fall","Droste Staircase",[1.5,1.2,3,4,1.5,1,.2,1],{trail:.5},4),x("fall","Spiral Abyss",[2.2,1.8,8,5,1.8,2,.8,1.5],{trail:.7,zoom:.99,spin:-.01},9),x("fall","Rising Up",[-1.2,.4,6,3,1.2,1.5,.5,.4],{kaleido:0,trail:.4,hueDrift:.01},3),x("hyper","Hyperbolic Temple",[],{},0),x("hyper","Escher Heaven",[7,3,.8,2,.5,.2,1,.8],{trail:.4},10),x("hyper","Infinite Mosaic",[4,6,1.4,1.5,.8,-.3,1.3,1.2],{trail:.5,breathe:.6},7),x("burst","Supernova Burst",[],{},4),x("burst","Firework Mind",[180,2,6,1.5,.8,.4,2,.4],{trail:.66,zoom:1.02},0),x("burst","Crystal Detonation",[60,2.2,4,.8,1.2,0,1.6,1],{kaleido:8,trail:.7,zoom:1.02},15),x("fold","Origami Fold",[],{},1),x("fold","Folding Cathedral",[.15,12,1.4,.8,1.4,1.5,1.4,.8],{trail:.5},4),x("fold","Dragon Paper",[.6,10,1.3,.62,1.2,1.2,2,1.3],{trail:.65,breathe:1},9),x("fold","Snowflake Engine",[1.05,9,1.36,.75,1.6,1,.8,.7],{kaleido:6,trail:.4},5),x("bulb","Mandelbulb Shrine",[8,.2,1,1.2,3.9,.8,1.2,7],{},14),x("bulb","Alien Spore",[5,.3,1.4,1.6,3.6,1,1.8,7],{breathe:.3},6),x("bulb","Golden Idol",[9,.12,.6,.8,3.4,.5,1.4,8],{trail:.2},4),x("qjulia","Julia Organism",[.5,.22,1,.8,3.5,.8,1.3,.6],{trail:.15},1),x("qjulia","Coral Mind",[.8,.15,1.4,1.1,3.3,1,1.8,1],{trail:.2},13),x("qjulia","Quantum Larva",[.25,.3,.8,.7,3.7,.6,1,.35],{trail:.1},9),x("jbulb","Living Bulb",[6,.2,1,1.1,3.9,.8,1.2,2.5],{trail:.15},0),x("jbulb","Pulsing Seed",[4,.25,1.3,1.5,3.8,1.2,1.6,1.2],{trail:.2},7),x("jbulb","Bone Orchid",[8.5,.15,.7,.9,4,.6,1,1.6],{trail:.1},4),x("kifs","Crystal Reliquary",[.08,.18,1.1,1.8,6,.8,1.5,.78],{trail:.12},5),x("kifs","Octahedral Throne",[.15,.12,1.3,1.6,5.8,1,1.6,.8],{trail:.2},15),x("kifs","Ice Cathedral",[.6,.2,.8,1,6,.6,1.1,.3],{trail:.1},10),x("hextunnel","Hex Temple",[],{},1),x("hextunnel","Machine Elf Hall",[2.2,8,2,2,1.4,1.2,1,2],{trail:.6,breathe:1.4,melt:.4},0),x("yantra","Sri Yantra",[],{},4),x("yantra","Third Eye Opening",[12,2,24,1.2,.2,2.5,1.2,1.2],{trail:.7,zoom:1.018},9),x("menger","Menger Crystal",[],{},5),x("menger","Sponge Cathedral",[1.6,.95,2,2,.6,1.2,.2,4],{trail:.5},4),x("aurora","Aurora Ocean",[3,1,1,1.3,.75,1,1,1.2],{trail:.15,kaleido:0,mirror:0,breathe:.2,melt:0,grain:.06,chroma:.45},3),x("aurora","Borealis Mirror",[4,1.4,1.3,1.6,.9,1.4,1.6,1.8],{trail:.2,kaleido:0,mirror:0,breathe:.15,melt:0,grain:.06,chroma:.45},12)],ci=[["Liquid Oscilloscope",[2,7],[0,3]],["Spectral Whirlpool",[2,3],[2,5]],["Lissajous Lagoon",[8,3],[3,0]],["Golden Spiral Engine",[7,5],[4,6]],["Bass Bloom",[9,0],[5,2]],["Rising Phoenix",[6,8],[1,8]],["Twin Vortex",[3,2],[7,0]],["Ripple Mind",[4,10],[0,6]],["Petal Storm",[10,5],[6,2]],["Helix Current",[8,6],[8,1]],["Starburst Tunnel",[0,7],[9,5]],["Mirror Pulse",[1,4],[10,0]],["Trinity Drift",[5,8],[11,3]],["Orbital Smoke",[8,2],[7,4]],["Infinite Zoom Scope",[0,9],[0,1]],["Collapsing Stars",[1,3],[6,9]],["Plasma Flame",[6,9],[5,8]],["Deep Current",[8,8],[1,3]],["Kaleido Rose",[10,4],[2,11]],["Mandala Machine",[5,10],[6,11]],["Ghost Knots",[2,8],[3,3]],["Comet Tails",[7,0],[7,9]],["Sonic Lotus",[10,2],[2,6]],["Wave Temple",[4,5],[10,1]],["Ember Spiral",[7,6],[4,8]],["Pulse Reactor",[9,4],[5,0]],["Silk Scope",[8,1],[0,10]],["Aurora Knot",[6,3],[3,8]],["Gravity Well",[2,9],[7,2]],["Quantum Foam",[8,10],[9,6]],["Spinning Prism",[5,3],[11,5]],["Echo Chamber",[1,7],[0,4]],["Fireflies",[3,8],[7,9]],["Hypno Rings",[4,7],[6,0]],["Dream Scope",[0,1,2,3,4,5,6,7,8,9,10],[0,1,2,3,4,5,6,7,8,10,11]],["Chaos Garden",[0,1,2,3,4,5,6,7,8,9,10],[0,1,2,3,4,5,6,7,8,9,10,11]]];ci.forEach(([a,e,t],i)=>{let o=x("flux",a,[],{},(i*5+3)%K.length);o.flux={flows:e,waves:t},a==="Chaos Garden"&&(o.params[4]=6),be.push(o)});function ya(){let a=(e,t)=>[...Array(e).keys()].sort(()=>Math.random()-.5).slice(0,t);return{flows:a(11,2+Math.floor(Math.random()*3)),waves:a(12,2+Math.floor(Math.random()*3))}}var mi=["Velvet","Chrome","Fractal","Liquid","Astral","Neon","Cosmic","Prismatic","Holographic","Molten","Electric","Dreaming","Infinite","Sacred","Psychedelic","Iridescent","Quantum","Lucid","Melting","Hyper","Ancient","Crystal","Sonic","Shimmering","Feral","Halcyon","Opal","Ultraviolet"],fi=["Singularity","Aurora","Cathedral","Lotus","Vortex","Garden","Labyrinth","Mandala","Spiral","Bloom","Engine","Temple","Ocean","Nebula","Serpent","Oracle","Echo","Portal","Reactor","Dream","Prism","Hive","Halo","Abyss","Lattice","Comet","Membrane","Kaleidoscope"],ae=(a,e)=>a+Math.random()*(e-a),ge=a=>a[Math.floor(Math.random()*a.length)];function it(){return`${ge(mi)} ${ge(fi)}`}function Pa(){return{name:"Generated",a:[ae(.3,.65),ae(.3,.65),ae(.3,.65)],b:[ae(.3,.55),ae(.3,.55),ae(.3,.55)],c:[ge([.5,1,1,1,1.5,2]),ge([.5,1,1,1,1.5,2]),ge([.5,1,1,1,1.5,2])],d:[Math.random(),Math.random(),Math.random()]}}function Ta(a=ie,e=1){let t={...a},i=(o,n,s)=>{t[o]=t[o]+(ae(n,s)-t[o])*e};i("trail",0,.85),i("zoom",.985,1.03),i("spin",-.012,.012),i("warp",0,1.2),i("breathe",0,1.6),i("melt",0,.8),i("chroma",.3,2.2),i("bloom",.4,1.4),t.hueDrift=Math.random()<.3?ae(-.02,.02):0,e>=1&&(t.kaleido=Math.random()<.3?ge([3,4,5,6,8,12]):0),t.mirror=Math.random()<.12?1:0;for(let o of["dance","ripple","punch","shake","swirlA","bulgeA"])i(o,.3,1.9);return t}function Rt(a,e=.55){let t=_[a.scene],i=structuredClone(a);return i.builtin=!1,t&&(i.params=t.params.map((o,n)=>{let s=a.params[n]??o.def,l=ae(o.min,o.max);return+(s+(l-s)*e).toFixed(4)})),i.fx=Ta(a.fx,e*.7),t&&t.fly&&(i.fx.trail=Math.min(i.fx.trail,.25)),t&&t.selfFeedback&&(i.fx.trail=Math.min(i.fx.trail,.15),Math.random()<.6&&(i.flux=ya())),Math.random()<.5&&(i.palette=Math.random()<.4?Pa():Math.floor(Math.random()*K.length)),i.name=it(),i.id="gen-"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),i}function Lt(a){let e=a&&_[a]||ge(Le),t=e.params.map(o=>{let n=ae(o.min,o.max);return+(o.def+(n-o.def)*.7).toFixed(4)}),i=Ta(ie,1);return e.fly&&(i.trail=Math.min(i.trail,.25)),e.selfFeedback&&(i.trail=Math.random()*.15),{id:"gen-"+Date.now().toString(36),name:it(),engine:"scene",scene:e.id,params:t,palette:Math.random()<.5?Pa():Math.floor(Math.random()*K.length),fx:i,builtin:!1,...e.selfFeedback?{flux:ya()}:{}}}function ot(a){return typeof a=="number"?K[(a%K.length+K.length)%K.length]:a}var wa="eyecandy.userPresets.v1";function ka(){try{return JSON.parse(localStorage.getItem(wa)||"[]")}catch{return[]}}function _e(a){try{localStorage.setItem(wa,JSON.stringify(a))}catch{}}var ba=[0,2,3,5,7,9,11,13];function zt(a,e){let t=_[e],i=a.id+"/"+e,o=Bt(i),n=t.params.map(l=>+Math.max(l.min,Math.min(l.max,l.def+(o()-.5)*.12*(l.max-l.min))).toFixed(4)),s=at(i,ie,{kaleido:0,mirror:0});return s.trail=Math.min(s.trail,t.fly?.15:.32),s.melt=Math.min(s.melt,.12),s.warp=Math.min(s.warp,t.fly?.15:.45),s.chroma=Math.min(s.chroma,.5),(t.crisp||t.space)&&(s.warp=Math.min(s.warp,.08),s.trail=Math.min(s.trail,.2),s.breathe=Math.min(s.breathe,.3),s.swirlA=Math.min(s.swirlA,.25),s.bulgeA=Math.min(s.bulgeA,.25),s.ripple=Math.min(s.ripple,.45),s.dance=Math.min(s.dance,.7)),s.grain=Math.min(s.grain,.15),s.saturation=Math.min(s.saturation,1.2),{id:"photo-"+i,name:t.name.replace(/^Photo /,"")+" \xB7 "+a.name,engine:"scene",scene:e,params:n,palette:ba[Math.floor(o()*ba.length)],fx:s,photo:a.id,builtin:!0}}var ui="eyecandy-photos",At="photos",Ct=null;function di(){return Ct||(Ct=new Promise((a,e)=>{let t=indexedDB.open(ui,1);t.onupgradeneeded=()=>t.result.createObjectStore(At,{keyPath:"id"}),t.onsuccess=()=>a(t.result),t.onerror=()=>e(t.error)})),Ct}var nt=async(a,e)=>{let t=await di();return new Promise((i,o)=>{let n=t.transaction(At,a),s=n.objectStore(At),l=e(s);n.oncomplete=()=>i(l&&"result"in l?l.result:l),n.onerror=()=>o(n.error),n.onabort=()=>o(n.error)})};function Et(a,e){let t=document.createElement("canvas");return t.width=a,t.height=e,t}var hi=(a,e,t)=>new Promise(i=>a.toBlob(i,e,t));async function Sa(a,e=2048){let t=await createImageBitmap(a,{imageOrientation:"from-image"}),i=Math.min(1,e/Math.max(t.width,t.height)),o=Math.max(1,Math.round(t.width*i)),n=Math.max(1,Math.round(t.height*i)),s=Et(o,n);s.getContext("2d").drawImage(t,0,0,o,n);let l=await hi(s,"image/jpeg",.9),c=160/Math.max(o,n),m=Et(Math.round(o*c)||1,Math.round(n*c)||1);m.getContext("2d").drawImage(s,0,0,m.width,m.height);let d=m.toDataURL("image/jpeg",.75);t.close&&t.close();let p=(a.name||"Photo").replace(/\.[^.]+$/,"").replace(/[_-]+/g," ").trim().slice(0,28)||"Photo",P={id:"ph"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:p,w:o,h:n,thumb:d,created:Date.now()};return await nt("readwrite",y=>y.put({...P,blob:l})),P}async function Ma(){try{return(await nt("readonly",e=>e.getAll())).map(({blob:e,...t})=>t).sort((e,t)=>t.created-e.created)}catch{return[]}}async function Ba(a){try{let e=await nt("readonly",t=>t.get(a));return e?await createImageBitmap(e.blob):null}catch{return null}}async function Ra(a){try{await nt("readwrite",e=>e.delete(a))}catch{}}function La(){let a=Et(1024,768),e=a.getContext("2d"),t=e.createLinearGradient(0,0,1024,768);t.addColorStop(0,"#1b0b3a"),t.addColorStop(.5,"#0d3b5c"),t.addColorStop(1,"#3a0b2e"),e.fillStyle=t,e.fillRect(0,0,1024,768);let i=["#ff3da8","#ffd23d","#3dffb5","#3db2ff","#b03dff","#ff7a3d"];for(let o=0;o<26;o++){let n=(Math.sin(o*12.9898)*.5+.5)*1024,s=(Math.sin(o*78.233)*.5+.5)*768,l=40+o*37%150,c=e.createRadialGradient(n,s,0,n,s,l);c.addColorStop(0,i[o%i.length]),c.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=c,e.beginPath(),e.arc(n,s,l,0,Math.PI*2),e.fill()}e.strokeStyle="rgba(255,255,255,.55)",e.lineWidth=6;for(let o=0;o<7;o++)e.beginPath(),e.arc(512,384,50+o*45,0,Math.PI*2),e.stroke();return a}function za(a){let e=a.ctx,t=e.createGain();t.gain.value=.55,t.connect(a.input),t.connect(a.out);let i=124,o=60/i/4,n=e.currentTime+.1,s=0,l=!0,c=[0,3,5,7,10,12,15],m=e.createBuffer(1,e.sampleRate,e.sampleRate),d=m.getChannelData(0);for(let b=0;b<d.length;b++)d[b]=Math.random()*2-1;let p=e.createDelay(1);p.delayTime.value=o*3;let P=e.createGain();P.gain.value=.35,p.connect(P),P.connect(p),p.connect(t);let y=b=>{let R=e.createOscillator(),S=e.createGain();R.frequency.setValueAtTime(150,b),R.frequency.exponentialRampToValueAtTime(42,b+.12),S.gain.setValueAtTime(1,b),S.gain.exponentialRampToValueAtTime(.001,b+.45),R.connect(S),S.connect(t),R.start(b),R.stop(b+.5)},M=(b,R)=>{let S=e.createBufferSource();S.buffer=m;let C=e.createBiquadFilter();C.type="highpass",C.frequency.value=8e3;let B=e.createGain();B.gain.setValueAtTime(R,b),B.gain.exponentialRampToValueAtTime(.001,b+.05),S.connect(C),C.connect(B),B.connect(t),S.start(b),S.stop(b+.06)},A=b=>{let R=e.createBufferSource();R.buffer=m;let S=e.createBiquadFilter();S.type="bandpass",S.frequency.value=1500;let C=e.createGain();C.gain.setValueAtTime(.5,b),C.gain.exponentialRampToValueAtTime(.001,b+.18),R.connect(S),S.connect(C),C.connect(t),C.connect(p),R.start(b),R.stop(b+.2)},k=(b,R,S,C)=>{let B=e.createOscillator(),E=e.createOscillator(),q=e.createBiquadFilter(),N=e.createGain();B.type="sawtooth",E.type="square";let J=55*Math.pow(2,R/12);B.frequency.value=J,E.frequency.value=J*1.005,q.type="lowpass",q.Q.value=9,q.frequency.setValueAtTime(C,b),q.frequency.exponentialRampToValueAtTime(120,b+S),N.gain.setValueAtTime(.22,b),N.gain.exponentialRampToValueAtTime(.001,b+S),B.connect(q),E.connect(q),q.connect(N),N.connect(t),N.connect(p),B.start(b),E.start(b),B.stop(b+S),E.stop(b+S)},j=(b,R)=>{[0,7,15,19].forEach(S=>{let C=e.createOscillator(),B=e.createGain();C.type="triangle",C.frequency.value=110*Math.pow(2,(R+S)/12),B.gain.setValueAtTime(0,b),B.gain.linearRampToValueAtTime(.05,b+1),B.gain.linearRampToValueAtTime(0,b+o*64),C.connect(B),B.connect(t),B.connect(p),C.start(b),C.stop(b+o*64)})},X=[0,-4,3,-2],T=()=>{if(l){for(;n<e.currentTime+.15;){let b=s%16,R=Math.floor(s/16),S=Math.floor(R/8)%4,C=X[Math.floor(R/2)%4],B=R%32>=28;!B&&b%4===0&&y(n),b%2===1&&M(n,b%4===3?.25:.1),!B&&(b===4||b===12)&&A(n),Math.random()<(S===2?.8:.55)&&k(n,C+12+c[Math.floor(Math.random()*c.length)]+(Math.random()<.2?12:0),o*1.8,600+3e3*Math.abs(Math.sin(s*.03))),b===0&&R%4===0&&j(n,C),n+=o,s++}setTimeout(T,25)}};return T(),()=>{l=!1,t.gain.setTargetAtTime(0,e.currentTime,.2),setTimeout(()=>t.disconnect(),800)}}var Ca=[3302,3570],pi=[1476,2508,2976],vi=(()=>{let a=new Uint32Array(256);for(let e=0;e<256;e++){let t=e;for(let i=0;i<8;i++)t=t&1?3988292384^t>>>1:t>>>1;a[e]=t>>>0}return a})();function Aa(a){let e=4294967295;for(let t of a)e=vi[(e^t)&255]^e>>>8;return(e^4294967295)>>>0}var xi=[[1,0,0,0],[1,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,1,1],[0,0,0,1],[1,0,0,1],[0,0,0,0]],st=class{constructor(){this.supported=!!navigator.hid,this.device=null,this.kind=null,this.bt=!1,this.status=this.supported?"not connected":"unsupported",this.t=[{active:!1,x:.5,y:.5,id:-1},{active:!1,x:.5,y:.5,id:-1}],this.axes=[0,0,0,0],this.buttons=new Array(18).fill(0),this.lastReport=0,this.lastPadReport=0,this.onstatus=()=>{},this.seq=0,this.rumbleTimer=0,this.supported&&(navigator.hid.addEventListener("disconnect",e=>{e.device===this.device&&(this.device=null,this.set("not connected"))}),navigator.hid.addEventListener("connect",()=>this.autoConnect()))}set(e){this.status=e,this.onstatus(e)}get connected(){return!!this.device}get fresh(){return this.device&&performance.now()-this.lastPadReport<400}async autoConnect(){if(!this.supported||this.device)return!1;try{let t=(await navigator.hid.getDevices()).find(i=>i.vendorId===1356&&(Ca.includes(i.productId)||pi.includes(i.productId)));if(t)return await this.open(t),!0}catch(e){console.warn(e)}return!1}async request(){if(!this.supported)return!1;try{window.eyecandy&&window.eyecandy.requestHid?await window.eyecandy.requestHid():await navigator.hid.requestDevice({filters:[{vendorId:1356}]})}catch(e){console.warn(e)}return this.autoConnect()}async open(e){try{e.opened||await e.open()}catch{this.set("could not open (close Steam / DS4Windows?)");return}this.device=e,this.kind=Ca.includes(e.productId)?"ds5":"ds4";try{await e.receiveFeatureReport(this.kind==="ds5"?5:2)}catch{}e.addEventListener("inputreport",t=>this.parse(t)),this.set((this.kind==="ds5"?"DualSense":"DualShock 4")+" connected (touchpad + full controller)")}parse(e){let t=e.data,i=e.reportId,o=k=>t.getUint8(k),n=-1,s=-1;if(this.kind==="ds5"?i===1&&t.byteLength>=40?(n=0,s=32,this.bt=!1):i===49&&t.byteLength>=41?(n=1,s=33,this.bt=!0):i===1&&t.byteLength>=9&&(n=0,this.bt=!0):i===1&&t.byteLength>=42?(n=0,s=34,this.bt=!1):i===17&&t.byteLength>=44?(n=2,s=36,this.bt=!0):i===1&&t.byteLength>=9&&(n=0,this.bt=!0),n<0)return;let l=k=>(o(k)-128)/127.5,c=this.buttons;this.axes=[l(n),l(n+1),l(n+2),l(n+3)];let m,d,p,P,y;this.kind==="ds5"&&s>=0?(P=o(n+4),y=o(n+5),m=o(n+7),d=o(n+8),p=o(n+9)):(m=o(n+4),d=o(n+5),p=o(n+6),P=o(n+7),y=o(n+8));let M=xi[Math.min(8,m&15)];if(c[2]=m>>4&1,c[0]=m>>5&1,c[1]=m>>6&1,c[3]=m>>7&1,c[4]=d&1,c[5]=d>>1&1,c[6]=P/255,c[7]=y/255,c[8]=d>>4&1,c[9]=d>>5&1,c[10]=d>>6&1,c[11]=d>>7&1,c[12]=M[0],c[15]=M[1],c[13]=M[2],c[14]=M[3],c[16]=p&1,c[17]=p>>1&1,this.lastPadReport=performance.now(),s<0)return;let A=this.kind==="ds5"?1079:942;for(let k=0;k<2;k++){let j=s+k*4,X=o(j),T=o(j+1),b=o(j+2),R=o(j+3),S=this.t[k];S.active=!(X&128),S.id=X&127,S.active&&(S.x=Math.min(1,(T|(b&15)<<8)/1919),S.y=Math.min(1,(b>>4|R<<4)/A))}this.lastReport=performance.now()}asGamepad(){return{id:(this.kind==="ds5"?"DualSense":"DualShock 4")+" (HID, Vendor: 054c)",connected:!0,mapping:"standard",axes:this.axes,buttons:this.buttons.map(e=>({pressed:e>.5,value:e})),vibrationActuator:{playEffect:(e,t)=>this.rumble(t)}}}async rumble({duration:e=100,strongMagnitude:t=0,weakMagnitude:i=0}={}){if(!this.device)return;let n=Math.round(Math.min(1,t)*255),s=Math.round(Math.min(1,i)*255);try{await this.sendMotors(n,s),clearTimeout(this.rumbleTimer),this.rumbleTimer=setTimeout(()=>this.sendMotors(0,0).catch(()=>{}),e)}catch{}}async sendMotors(e,t){let i=this.device;if(i)if(this.kind==="ds5"){let o=new Uint8Array(47);if(o[0]=3,o[2]=t,o[3]=e,!this.bt)return i.sendReport(2,o);let n=new Uint8Array(77);n[0]=(this.seq=this.seq+1&15)<<4,n[1]=16,n.set(o,2);let s=Aa(new Uint8Array([162,49,...n.subarray(0,73)]));return n[73]=s&255,n[74]=s>>>8&255,n[75]=s>>>16&255,n[76]=s>>>24&255,i.sendReport(49,n)}else{if(!this.bt){let s=new Uint8Array(31);return s[0]=7,s[3]=t,s[4]=e,i.sendReport(5,s)}let o=new Uint8Array(77);o[0]=192,o[2]=7,o[5]=t,o[6]=e;let n=Aa(new Uint8Array([162,17,...o.subarray(0,73)]));return o[73]=n&255,o[74]=n>>>8&255,o[75]=n>>>16&255,o[76]=n>>>24&255,i.sendReport(17,o)}}};var he=(matchMedia("(pointer: coarse)").matches||"ontouchstart"in window)&&!matchMedia("(pointer: fine)").matches,gi=[[0,"\u2738","Burst","r",0],[2,"\u2684","Random","r",1],[3,"\u2605","Save","r",2],[4,"\u2756","Kaleido","l",0],[5,"\u25D1","Colors","l",1],[17,"\u266A","Dance","l",2]],rt=class{constructor(e){this.axes=[0,0,0,0],this.buttons=new Array(18).fill(0),this.sticks={l:null,r:null},this.lastInput=0,this.active=!1,this.el=document.createElement("div"),this.el.id="touchUI",this.el.innerHTML=`
      <div class="tzone" data-side="l"></div><div class="tzone" data-side="r"></div>
      <div class="tstick" data-side="l"><i></i></div><div class="tstick" data-side="r"><i></i></div>
      <div class="ttrig" data-b="6" data-side="l"><b>WARP</b><small>hold</small></div>
      <div class="ttrig" data-b="7" data-side="r"><b>DRIVE</b><small>hold</small></div>
      ${gi.map(([l,c,m,d,p])=>`<button class="tbtn" data-b="${l}" data-side="${d}" style="--slot:${p}"><span>${c}</span><small>${m}</small></button>`).join("")}
      <div class="ttop">
        <button class="tico" data-act="sheetVisuals" title="Presets & settings">\u2630</button>
        <button class="tico" data-act="prevPreset">\u2039</button>
        <div class="tname" data-act="sheetVisuals"></div>
        <button class="tico" data-act="nextPreset">\u203A</button>
        <button class="tico" data-act="sheetMusic" title="Music">\u266B</button>
        <button class="tico" data-act="fullscreen" title="Fullscreen">\u26F6</button>
      </div>
      <div class="thint">Left thumb steers \xB7 right thumb morphs</div>`,e.appendChild(this.el);let t=56,i=l=>this.el.querySelector(`.tstick[data-side="${l}"]`),o=l=>{let c=l.target.closest(".tzone");if(!c)return;let m=c.dataset.side;if(this.sticks[m])return;l.preventDefault(),c.setPointerCapture(l.pointerId),this.sticks[m]={id:l.pointerId,x:l.clientX,y:l.clientY};let d=i(m);d.style.left=l.clientX+"px",d.style.top=l.clientY+"px",d.classList.add("on"),this.touch()},n=l=>{for(let c of["l","r"]){let m=this.sticks[c];if(!m||m.id!==l.pointerId)continue;let d=(l.clientX-m.x)/t,p=(l.clientY-m.y)/t,P=Math.hypot(d,p);P>1&&(d/=P,p/=P);let y=c==="l"?0:2;this.axes[y]=d,this.axes[y+1]=p,i(c).querySelector("i").style.transform=`translate(${d*t}px,${p*t}px)`,this.touch()}},s=l=>{for(let c of["l","r"]){let m=this.sticks[c];if(!m||m.id!==l.pointerId)continue;this.sticks[c]=null;let d=c==="l"?0:2;this.axes[d]=this.axes[d+1]=0;let p=i(c);p.classList.remove("on"),p.querySelector("i").style.transform=""}};this.el.addEventListener("pointerdown",o),this.el.addEventListener("pointermove",n),this.el.addEventListener("pointerup",s),this.el.addEventListener("pointercancel",s),this.el.querySelectorAll("[data-b]").forEach(l=>{let c=+l.dataset.b,m=0,d=0,p=y=>{y.preventDefault(),y.stopPropagation(),l.setPointerCapture?.(y.pointerId),clearTimeout(d),m=performance.now(),this.buttons[c]=1,l.classList.add("down"),this.touch()},P=()=>{let y=90-(performance.now()-m),M=()=>{this.buttons[c]=0,l.classList.remove("down")};clearTimeout(d),y>0?d=setTimeout(M,y):M()};l.addEventListener("pointerdown",p),l.addEventListener("pointerup",P),l.addEventListener("pointercancel",P),l.addEventListener("lostpointercapture",P)}),this.el.addEventListener("contextmenu",l=>l.preventDefault())}touch(){this.lastInput=performance.now(),this.active=!0,this.el.classList.add("awake"),this.el.querySelector(".thint").classList.add("gone"),clearTimeout(this._t),this._t=setTimeout(()=>this.el.classList.remove("awake"),3500)}setName(e){let t=this.el.querySelector(".tname");t&&(t.textContent=e)}asGamepad(){return{id:"Touch controls",connected:!0,mapping:"standard",axes:this.axes.slice(),buttons:this.buttons.map(e=>({pressed:e>.5,value:e})),vibrationActuator:{playEffect:(e,t)=>(navigator.vibrate&&t&&t.duration>=100&&navigator.vibrate(Math.min(60,t.duration*.4)),Promise.resolve())}}}};var pt=be.filter(a=>a.scene!=="flux"),Ga=be.filter(a=>a.scene==="flux"),v=a=>document.querySelector(a),me=a=>[...document.querySelectorAll(a)],W=(a,e,t)=>Math.max(e,Math.min(t,a)),D=(a,e,t)=>a+(e-a)*t,$=window.eyecandy||null;$||document.addEventListener("DOMContentLoaded",()=>{},{once:!0});var Kt="eyecandy.settings.v1",ft={resolution:"native",renderScale:"auto",aa:"off",autoExposure:!0,fpsCap:"0",uiScale:1,startFullscreen:!0,showFps:!1,autopilot:!0,autoInterval:20,autoSource:"mix",autoOnDrop:!0,idle:5,reactIntensity:1.5,idleDance:!1,beatRipples:!0,beatPulse:1,beatFlash:.3,cameraShake:.5,beatSens:1.5,gainBass:1,gainMid:1,gainHigh:1,outputDevice:"default",rumble:!0,rumbleStrength:.7,deadzone:.14,stickSens:1,invertY:!1,touchMode:"both",transition:1,autoPause:!0,uiAutoHide:!0,volume:.85,seenGuide:!1},h={...ft,...JSON.parse(localStorage.getItem(Kt)||"{}")};if(!h.aaV){h.aa="off",h.aaV=1;try{localStorage.setItem(Kt,JSON.stringify(h))}catch{}}var fe=()=>localStorage.setItem(Kt,JSON.stringify(h)),ce=v("#gl"),z;try{z=new Je(ce)}catch(a){throw document.body.innerHTML=`<div style="padding:40px;font:16px sans-serif;color:#fff">Eye Candy needs WebGL2.<br><br>${a.message}</div>`,a}z.ssMax=1;var u=new et;u.out.gain.value=h.volume;var g=new tt;g.deadzone=h.deadzone;var H=new st;g.hid=H;var ue={active:!1,x:.5,y:.5},we=null;he&&(document.body.classList.add("mobile"),we=new rt(document.body),g.touch=we);var O=ka(),Fe=null,V=null,oe=null,Ie=null,vt=[],lt=null,Se=null,Va={...ie,trail:0,zoom:1,warp:0,breathe:.15,bloom:.6,chroma:.8,grain:.25};function ve(){return V?Promise.resolve():lt||(Xt(),lt=new Promise((a,e)=>{let t=document.createElement("script");t.src="milk.js",t.onload=()=>{let i=window.EyeMilk;Ie={};for(let o of i.packs)try{Object.assign(Ie,o.getPresets?o.getPresets():o.default?.getPresets())}catch(n){console.warn(n)}vt=Object.keys(Ie).sort((o,n)=>o.localeCompare(n)),oe=document.createElement("canvas"),oe.width=1280,oe.height=720,V=i.butterchurn.createVisualizer(u.ctx,oe,{width:1280,height:720,pixelRatio:1,textureRatio:1}),V.connectAudio(u.input),fetch("milktex/manifest.json").then(o=>o.json()).then(o=>V.loadExtraImages(o)).catch(()=>{}),Xt().then(()=>a())},t.onerror=e,document.head.appendChild(t)}),lt)}function bi(a,e){if(!V)return;let t=Math.min(1,1280/a),i=Math.round(a*t),o=Math.round(e*t);(oe.width!==i||oe.height!==o)&&(oe.width=i,oe.height=o,V.setRendererSize(i,o))}var He=null,qe={},Ft={},It=null;function Xt(){return It||(It=fetch("milklib/index.json").then(a=>a.json()).then(a=>{He={};for(let[e,t,i]of a)He[e]={cat:t,chunk:i},(qe[t]=qe[t]||[]).push(e);return He}).catch(()=>He={}))}async function Oa(a){if(Ie&&Ie[a])return Ie[a];await Xt();let e=He[a];return e?(Ft[e.chunk]||(Ft[e.chunk]=fetch(`milklib/c${e.chunk}.json`).then(i=>i.json())),(await Ft[e.chunk])[a]||null):null}async function Ge(a,e=2){if(!V)return;let t=await Oa(a);if(t)try{V.loadPreset(t,e),Se=a}catch(i){console.warn("MilkDrop preset failed",a,i)}}var de="all";function Me(a){return a==="classic"?vt:a!=="all"?qe[a]||[]:[...vt,...Object.values(qe).flat()]}var Zt=()=>{let a=Me(de==="classic"||de==="all"?"all":de);return a[Math.floor(Math.random()*a.length)]},qt=new Map;function Jt(a){return qt.has(a)||qt.set(a,{id:"milk:"+a,name:a,engine:"milk",milk:a,fx:at(a,Va,{trail:0,zoom:1,kaleido:0,mirror:0}),palette:0,builtin:!0}),qt.get(a)}var U="eye",f=structuredClone(be[0]),Oe=structuredClone(f),ne=0,r={camX:0,camY:0,roll:0,morphX:0,morphY:0,waitCenter:!1,time:0,timeScale:1,hue:0,burstT:9,flash:0,freeze:!1,lt:0,rt:0,transMix:0,lastSwitch:0,lastHuman:-1e9,kAngle:0,pal:null,flowX:0,flowY:0,hyper:0,autoT:0,panels:!0,cinema:!1,amX:0,amY:0,danceT:0,sinceBeat:9,beatInt:.5,jolt:0,beatRipT:9,beatRipAmt:0,lastAutoBurst:0,lastStick:-1e9,lensRot:0,lensZoom:1,swirl:0,bulge:0,swirlT:0,bulgeT:0,burstCX:0,burstCY:0,pinch:null,touch:[{on:!1,x:0,y:0,vx:0,vy:0,s:0},{on:!1,x:0,y:0,vx:0,vy:0,s:0}],flux:{fa:0,fb:0,fm:0,wa:0,wb:0,wm:0,tf:0,tw:0,mapT:0}},ja=a=>[...a.a,...a.b,...a.c,...a.d];r.pal=ja(ot(f.palette));var Dt=[-1,-.5,.25,.5,.75,1,1.5,2,3,4];function Pt(a){return a==="eye"?pt:a==="flux"?Ga:a==="user"?O:a==="milk"?Me(de).map(Jt):a==="photo"?Wa(se):be}var Y=[],se=null,Ut=new Map;function Wa(a){let e=Y.find(i=>i.id===a);if(!e)return[];let t=a+":"+e.name;return Ut.has(t)||Ut.set(t,Ze.map(i=>zt(e,i.id))),Ut.get(t)}var Ea=null;async function yi(a){if(z.photoId===a)return!0;let e=a&&!a.startsWith("__")?await Ba(a):null;return e?(z.setPhoto(e,a),e.close&&e.close(),!0):(z.setPhoto(Ea||(Ea=La()),a),!1)}function Qt(){let a=_[f.scene];if(!a)return[];let e=f.params.slice(),[t,i]=a.stick||[0,1],o=(r.waitCenter?0:r.morphX)+r.amX,n=(r.waitCenter?0:r.morphY)+r.amY,s=(l,c)=>{let m=a.params[l];m&&(e[l]=W(e[l]+c*(m.max-m.min)*.35*(m.ms??1),m.min,m.max))};return s(t,o),s(i,n),e}function Z(a,e={}){if(a){if(a.photo&&z.photoId!==a.photo){yi(a.photo).then(t=>{!t&&!e.quiet&&w("\u26A0","That photo is no longer on this device"),Z(a,e)});return}if(e.transition!==!1&&z.fin&&(z.snapshot(),r.transMix=1),f=structuredClone(a),f.fx={...ie,...a.engine==="milk"?Va:{},...a.fx},Oe=structuredClone(f),r.waitCenter=Math.abs(r.morphX)+Math.abs(r.morphY)>.1,r.hue=f.fx.hueOffset||0,r.lastSwitch=performance.now(),Bi(a),r.camX=0,r.camY=0,r.lensRot=0,r.lensZoom=1,f.scene==="flux"){let t=f.flux||{flows:[2,7],waves:[0,3]};f.flux=t,Object.assign(r.flux,{fa:t.flows[0],fb:t.flows[0],fm:0,wa:t.waves[0],wb:t.waves[0],wm:0,tf:0,tw:0})}f.engine==="milk"?ve().then(()=>Ge(f.milk,e.transition===!1?0:2)):f.fx.fusion>0&&ve().then(()=>{f.milk?Ge(f.milk):Se||Ge(Zt())}),f.engine==="scene"&&z.errors[f.scene]&&w("\u26A0","Scene failed to compile \u2014 skipping"),v("#presetName").textContent=f.name,G(),re(),e.quiet||w("\u25C6",f.name)}}function xe(a){let e=Pt(U);if(!e.length){U==="milk"&&ve().then(()=>{G(),xe(a)});return}ne=((ne+a)%e.length+e.length)%e.length,Z(e[ne])}function ea(){if(f.engine==="milk"){f.fx={...f.fx,...Rt({...f,scene:"none"}).fx},f.name=f.milk+" \u2684",v("#presetName").textContent=f.name,re(),w("\u2684","Randomized FX");return}Z(Rt(f),{quiet:!0}),w("\u2684","Randomized \xB7 "+f.name)}function ta(){Z(Lt(),{quiet:!0}),w("\u2726","Generated \xB7 "+f.name)}function $a(){let a=structuredClone(f);return a.engine==="scene"&&(a.params=Qt().map(e=>+e.toFixed(4))),a.fx={...a.fx,hueOffset:(r.hue%1+1)%1,speed:+(a.fx.speed*Math.abs(r.timeScale)).toFixed(3)},a.engine==="scene"&&a.fx.fusion>0&&Se&&(a.milk=Se),a}function Tt(){let a=$a();a.id="user-"+Date.now().toString(36),a.builtin=!1,(Oe.builtin||!a.name||O.some(e=>e.name===a.name))&&(a.name=(a.engine==="milk"?"Milk \xB7 ":"")+it()),O.push(a),_e(O),f=structuredClone(a),Oe=structuredClone(a),v("#presetName").textContent=f.name,G(),re(),w("\u2605","Saved \u201C"+a.name+"\u201D to My Presets"),g.rumble(.4,.6,120)}function Pi(){let a=O.findIndex(t=>t.id===f.id);if(a<0)return Tt();let e=$a();e.name=v("#pName").value||e.name,O[a]=e,_e(O),Oe=structuredClone(e),f=structuredClone(e),r.timeScale=1,G(),w("\u2605","Updated \u201C"+e.name+"\u201D")}function Ti(){let a=O.findIndex(e=>e.id===f.id);a<0||(O.splice(a,1),_e(O),G(),w("\u2716","Deleted"),xe(0))}function je(a=1,e=0,t=0){r.burstCX=e,r.burstCY=t,r.burstT=0,r.flash=.55*a,g.rumble(.9*a*h.rumbleStrength,.5*a*h.rumbleStrength,160)}function Xa(a=1){let e=typeof f.palette=="number"?f.palette:-1;f.palette=((e+a)%K.length+K.length)%K.length,w(g.label("RB"),"Palette \xB7 "+K[f.palette].name),re()}var _t=[0,3,4,5,6,8,12,16];function Ya(){let a=_t.indexOf(f.fx.kaleido);f.fx.kaleido=_t[(a+1)%_t.length],w(g.label("LB"),f.fx.kaleido?"Kaleidoscope \xD7"+f.fx.kaleido:"Kaleidoscope off"),re()}function Ka(){f.fx.mirror=f.fx.mirror?0:1,w(g.label("LB"),f.fx.mirror?"Mirror world":"Mirror off"),re()}function xt(a){let e=Dt.indexOf(r.timeScale);e<0&&(e=5),e=W(e+a,0,Dt.length-1),r.timeScale=Dt[e],w(a>0?"\u25B2":"\u25BC",r.timeScale<0?"Time reversed \xD7"+Math.abs(r.timeScale):"Time \xD7"+r.timeScale)}function wi(){r.camX=r.camY=r.roll=0,r.lensRot=0,r.lensZoom=1,r.timeScale=1,r.flowX=r.flowY=0,w(g.label("L3"),"View reset")}function ki(){f.engine==="scene"&&(f.params=Qt(),r.waitCenter=!0,re(),w(g.label("R3"),"Shape locked in"),g.rumble(.2,.5,60))}function aa(a){h.autopilot=a,fe(),v("#autoBtn").classList.toggle("on",a),w("\u27F3",a?"Autopilot on":"Autopilot off"),kt()}function Be(){r.lastHuman=performance.now()}var Fa={},ut=[],Si=6;function Mi(a){let e=[...Array(a).keys()];for(let t=a-1;t>0;t--){let i=Math.floor(Math.random()*(t+1));[e[t],e[i]]=[e[i],e[t]]}return e}function Pe(a,e,t=()=>!0){if(!e.length)return null;let i=Fa[a];(!i||i.n!==e.length||!i.left.length)&&(i=Fa[a]={n:e.length,left:Mi(e.length)});for(let o=i.left.length-1;o>=Math.max(0,i.left.length-40);o--){let n=e[i.left[o]];if(t(n))return i.left.splice(o,1),n}return e[i.left.pop()]}var ct=a=>!a.scene||!ut.includes(a.scene)&&!z.errors[a.scene];function Bi(a){a&&a.engine!=="milk"&&a.scene&&(ut.push(a.scene),ut.length>Si&&ut.shift())}var Ia=()=>[...new Set(Me("all"))],Ri=Le.map(a=>({scene:a.id})),Li=[["milk",.36],["eye",.32],["flux",.12],["generate",.14],["user",.06]];function zi(a){if(a==="all")return Math.random()<.5?"milk":"eye";if(a==="photo")return Y.length?"photo":"eye";if(a!=="mix"&&a!=="mixp")return a;let e=[...Li,...a==="mixp"&&Y.length?[["photo",.2]]:[]].filter(([o])=>o!=="user"||O.length),t=e.reduce((o,[,n])=>o+n,0),i=Math.random()*t;for(let[o,n]of e)if((i-=n)<0)return o;return"eye"}function Za(){let a=h.autoSource,e=zi(a);if(e==="milk")return r.autoBusy=!0,ve().then(()=>{let n=a==="milk"?Me(de==="classic"?"all":de):Ia(),s=Pe(a==="milk"?"milk:"+de:"milk:all",n.length?n:Ia());s&&Z(Jt(s),{quiet:!0})}).finally(()=>{r.autoBusy=!1,r.lastSwitch=performance.now()});let t=null;if(e==="generate"){let n=Pe("gen",Ri,ct);t=Lt(n&&n.scene)}else if(e==="flux")t=Pe("flux",Ga);else if(e==="user")t=Pe("user",O,ct);else if(e==="photo"){let n=Y.flatMap(l=>Ze.map(c=>({ph:l,scene:c.id}))),s=Pe("photo:"+Y.length,n,ct);s&&(t=zt(s.ph,s.scene))}t||(t=Pe("eye",pt,ct));let i=Pt(U),o=i.indexOf(t);o>=0&&(ne=o),t.photo&&U==="photo"&&se!==t.photo&&(se=t.photo,G()),Z(t,{quiet:!0})}function Ci(a,e){let t=h.autopilot&&(!h.autoPause||e-r.lastHuman>h.idle*1e3);if(r.autoActive=t,!t||r.autoBusy)return;r.autoT+=a;let i=(e-r.lastSwitch)/1e3,o=h.autoOnDrop&&u.drop>1.1&&i>12;(i>h.autoInterval||o)&&(u.drop=0,r.lastSwitch=e,Za(),o&&je(.8))}function Ai(a){if(g.poll(),g.justConnected&&g.style!=="touch"&&(w("\u{1F3AE}",(g.style==="ps"?"PlayStation":"Xbox")+" controller connected"),g.rumble(.5,.8,200),h.seenGuide||(h.seenGuide=!0,fe(),ke(!0)),g.style==="ps"&&H.supported&&!H.connected&&!$&&(v("#tpChip").classList.remove("hidden"),setTimeout(()=>w("\u25C9","PlayStation pad: click \u201CEnable touchpad\u201D up top to use the touchpad"),1500)),ma()),!g.connected){r.lt=D(r.lt,0,a*6),r.rt=D(r.rt,0,a*6);return}let[e,t,i,o]=g.axes;if((g.pressed.some(Boolean)||Math.abs(e)+Math.abs(t)+Math.abs(i)+Math.abs(o)+g.lt+g.rt>.05)&&(Be(),v("#splash").classList.contains("gone")||Ei(),h.uiAutoHide&&wt()),!v("#controls").classList.contains("hidden")){(g.tap(I.B)||g.tap(I.A)||g.shortRelease(I.BACK))&&ke(!1);return}let s=h.stickSens,l=h.invertY?-1:1;if(Math.abs(e)+Math.abs(t)+Math.abs(i)+Math.abs(o)>.05&&(r.lastStick=performance.now()),f.engine==="milk")r.lensRot+=e*a*1.8*s,r.lensZoom=W(r.lensZoom*Math.exp(t*l*a*1.3*s),.3,4),r.swirlT=i*1.5*s,r.bulgeT=-o*l*1.1*s;else{let m=_[f.scene]&&_[f.scene].camSens||1;r.camX+=e*a*1.5*s*m,r.camY=W(r.camY-t*l*a*1.1*s*m,-1.3,1.3),r.waitCenter&&Math.hypot(i,o)<.12&&(r.waitCenter=!1),r.morphX=D(r.morphX,W(i*s,-1.5,1.5),a*8),r.morphY=D(r.morphY,W(-o*l*s,-1.5,1.5),a*8),r.swirlT=i*.3*s,r.bulgeT=-o*l*.15*s}r.flowX=D(r.flowX,e,a*5),r.flowY=D(r.flowY,-t*l,a*5),r.lt=D(r.lt,g.lt,a*10),r.rt=D(r.rt,g.rt,a*10),g.lt>.08&&Math.random()<a*3&&Yt("LT","Warp",g.lt),g.rt>.08&&Math.random()<a*3&&Yt("RT","Drive",g.rt);let c=g.lt>.92&&g.rt>.92;c&&!r.hyperOn&&(w("\u2604","HYPERDRIVE"),je(1.2)),r.hyperOn=c,g.tap(I.A)&&je(1),g.tap(I.TOUCH)&&(h.idleDance=!h.idleDance,fe(),kt(),w("\u25C9",h.idleDance?"Music dance ON":"Music dance OFF \u2014 pure beat reactive"),g.rumble(.3,.5,90)),g.style==="ps"&&H.supported&&!H.connected&&!r.tpTried&&(r.tpTried=!0,H.autoConnect().then(m=>{!m&&$&&H.request()})),r.freeze=g.down(I.B),g.tap(I.B)&&w(g.label("B"),"Freeze"),g.shortRelease(I.X)&&ea(),g.hold(I.X,550)&&(ta(),g.rumble(.6,.6,150)),g.tap(I.Y)&&Tt(),g.shortRelease(I.LB)&&Ya(),g.hold(I.LB,500)&&Ka(),g.shortRelease(I.RB)&&Xa(1),g.down(I.RB)&&performance.now()-g.downAt[I.RB]>300&&(r.hue+=a*.5,Math.random()<a*2&&w(g.label("RB"),"Hue spin")),g.tap(I.RIGHT)&&xe(1),g.tap(I.LEFT)&&xe(-1),g.tap(I.UP)&&xt(1),g.tap(I.DOWN)&&xt(-1),g.tap(I.L3)&&wi(),g.tap(I.R3)&&ki(),g.tap(I.START)&&(r.cinema=!1,ia(!0),ei()),g.shortRelease(I.BACK)&&ke(!0),g.hold(I.BACK,700)&&aa(!h.autopilot)}function Ei(){!u.playlist.length&&u.mode==="player"&&!Fe&&oa(),Ve()}function Fi(a,e){if(f.scene!=="flux"||!f.flux)return;let t=r.flux,i=f.flux,o=e[4]||14,n=(l,c)=>{let m=l.filter(d=>d!==c);return m.length?m[Math.floor(Math.random()*m.length)]:l[0]};t.tf+=a,t.tw+=a,t.fm>0&&t.fm<1&&(t.fm=Math.min(1,t.fm+a/3.5)),t.fm>=1&&(t.fa=t.fb,t.fm=0),t.fm===0&&t.tf>o&&i.flows.length>1&&(t.fb=n(i.flows,t.fa),t.fm=.001,t.tf=0),t.wm>0&&t.wm<1&&(t.wm=Math.min(1,t.wm+a/2)),t.wm>=1&&(t.wa=t.wb,t.wm=0);let s=u.drop>.9&&t.tw>4;t.wm===0&&(t.tw>o*.7||s)&&i.waves.length>1&&(t.wb=n(i.waves,t.wa),t.wm=.001,t.tw=0),t.mapT+=a*.03*(e[5]??1)*(1+u.vol*.8)}function Ii(a){let e=z.W&&z.H?z.W/z.H:1.7777777777777777,t;H.connected&&performance.now()-H.lastReport<600?t=H.t.map(n=>n.active?n:null):t=[ue.active?ue:null,null];for(let n=0;n<2;n++){let s=r.touch[n],l=t[n];if(l&&h.touchMode!=="off"){let c=(l.x-.5)*e,m=.5-l.y;s.on||(s.x=c,s.y=m,s.vx=s.vy=0);let d=(c-s.x)/Math.max(a,.001),p=(m-s.y)/Math.max(a,.001);s.vx=D(s.vx,d,.35),s.vy=D(s.vy,p,.35),s.x=c,s.y=m,s.on=!0,s.s=Math.min(1,s.s+a*3),Be()}else s.on=!1,s.s=Math.max(0,s.s-a*2),s.vx*=.9,s.vy*=.9}let[i,o]=r.touch;if(i.on&&o.on){let n=Math.hypot(i.x-o.x,i.y-o.y),s=Math.atan2(o.y-i.y,o.x-i.x);if(r.pinch){r.lensZoom=W(r.lensZoom*(n/Math.max(.02,r.pinch.d)),.3,4);let l=s-r.pinch.a;l>Math.PI&&(l-=2*Math.PI),l<-Math.PI&&(l+=2*Math.PI),r.lensRot+=l}r.pinch={d:n,a:s}}else r.pinch=null}var qa=(a,e)=>[a.x,a.y,e?a.s*(r.pinch?.3:1):0,a.s>.01?1:0];function Ja(a){let e=r.pal,t=[];for(let i=0;i<3;i++)t.push(W(e[i]+e[3+i]*Math.cos(6.2831853*(e[6+i]*a+e[9+i]+r.hue)),0,1));return t}var Nt=performance.now(),mt=0,Ht=0,Ne=16,ze=0,Gt=0;function Qa(a){requestAnimationFrame(Qa);let e=+h.fpsCap;if(e>0&&a-Nt<1e3/e-1.5)return;let t=Math.min(.05,(a-Nt)/1e3);Nt=a,Ai(t),Ii(t);let i=f.fx,o=r.rt,n=r.lt,s=r.hyperOn?1:0;r.hyper=D(r.hyper,s,t*3),u.update(t,i.react*(1+o*1.6),{sens:h.beatSens,gB:h.gainBass,gM:h.gainMid,gH:h.gainHigh}),Ci(t,a);let l=h.reactIntensity*i.react,c=h.idleDance?1:0;r.danceT+=t*(.5+u.vol*1.2);let m=r.danceT;r.amX=D(r.amX,c*l*i.dance*(Math.sin(m*.53)*.3*(.35+u.mid)+u.bass*.22*Math.sin(m*.19+1)),t*4),r.amY=D(r.amY,c*l*i.dance*(Math.cos(m*.41)*.25*(.35+u.high)+u.beat*.28),t*6);let d=c*Math.min(l,2)*i.dance*Math.sin(m*.07+.5)*(.04+u.vol*.1),p=c*Math.min(l,2)*i.dance*Math.sin(m*.11)*(.02+u.mid*.05);f.engine==="milk"&&c>.5&&(r.lensRot+=t*l*i.swirlA*.05*Math.sin(m*.05),a-r.lastStick>4e3&&(r.lensZoom=D(r.lensZoom,1+Math.sin(m*.09)*.15*i.bulgeA,t*.2))),r.sinceBeat+=t,u.isBeat&&(r.sinceBeat>.2&&r.sinceBeat<2&&(r.beatInt=D(r.beatInt,r.sinceBeat,.3)),r.sinceBeat=0,r.jolt=(Math.random()-.5)*2,r.beatRipT=0,r.beatRipAmt=Math.min(1.6,u.bass*.9)*l*i.ripple,h.beatFlash>0&&u.bass>1.2&&a-r.lastAutoBurst>2200&&(r.flash=Math.max(r.flash,h.beatFlash*.5*Math.min(l,1.5)),r.lastAutoBurst=a)),r.jolt*=Math.exp(-t*7),r.beatRipT+=t;let P=f.engine==="scene"&&_[f.scene]&&_[f.scene].landscape?.12:1;r.swirl=D(r.swirl,r.swirlT*(P<1?.4:1)+P*Math.min(l,2)*c*i.swirlA*Math.sin(m*.17)*(.04+u.mid*.16),t*4),r.bulge=D(r.bulge,r.bulgeT+P*Math.min(l,2)*i.bulgeA*u.bass*.08,t*10),i.kaleido>1&&(r.kAngle+=t*u.mid*.25*l*Math.sin(m*.11));let y=window.devicePixelRatio||1,M=h.resolution==="native"?Math.round(innerHeight*Math.min(y,he?1.25:2)):+h.resolution,A=Math.round(M*innerWidth/Math.max(1,innerHeight));(ce.width!==A||ce.height!==M)&&(ce.width=A,ce.height=M),Ne=D(Ne,t*1e3,.05);let k,j,X=f.engine==="scene"?_[f.scene]:null,T=f.engine==="milk"?"milk":f.scene||"x",b=[1,1,.9,.8,.7,.6,.5,.4],R=X&&X.ss&&!he&&h.aa==="auto"?0:1,S=f.engine==="milk"?4:b.length-1,C=r.quality||(r.quality={});C[T]||(C[T]={rung:he?5:R,lockUntil:0,probeAt:-1});let B=C[T];if(B.rung=W(B.rung,R,S),h.renderScale==="auto"){ze+=t;let Q=e>0?1e3/e:16.7,Xe=performance.now()/1e3;r.qKey!==T&&(r.qKey=T,ze=-1.5,Ne=Q),ze>1.5&&(Ne>Q*1.22&&B.rung<S?(B.probeAt>0&&Xe-B.probeAt<5&&(B.lockUntil=Xe+45),B.rung++,B.probeAt=-1,ze=0):Ne<Q*1.08&&B.rung>R&&Xe>B.lockUntil&&ze>4&&(B.rung--,B.probeAt=Xe,ze=0)),k=b[B.rung],f.engine==="milk"&&(k=Math.max(k,.7))}else k=W(+h.renderScale,.25,2);j=h.aa==="off"?1:h.aa==="2x"?2:h.aa==="4x"?4:he?1:h.renderScale==="auto"?B.rung===0?2:1:2,r.qs=k,z.ssMax=j;let E=z.fin;z.resize(A,M,k),E!==z.fin&&(z.transTex=null);let q=i.speed*r.timeScale*(1+o*1.2+r.hyper*2);r.freeze||(r.time+=t*q*(1+u.vol*.45*Math.min(l,2.5))),r.hue+=t*(i.hueSpin||0),r.kAngle+=t*(i.kaleidoSpin||0)*.5,r.burstT+=t,r.flash*=Math.exp(-t*6),r.transMix=Math.max(0,r.transMix-t/Math.max(.2,h.transition)),r.roll=D(r.roll,r.flowX*.25,t*2);let N=ja(ot(f.palette));for(let Q=0;Q<12;Q++)r.pal[Q]=D(r.pal[Q],N[Q],1-Math.exp(-t*2.5));if(z.uploadAudio(u.tex),(f.engine==="milk"||i.fusion>0)&&V){bi(Math.max(z.sw,Math.min(A,1280)),Math.max(z.sh,Math.round(Math.min(A,1280)*M/A)));try{V.render(),z.uploadMilk(oe)}catch(Q){console.warn(Q)}}let te=f.engine==="scene"?Qt():[0,0,0,0,0,0,0,0];for(;te.length<8;)te.push(0);Fi(t,te);let De=u.beat*h.beatPulse*i.punch*.05*Math.min(l,2.5),ii=u.beat*h.cameraShake*i.shake*Math.min(l,2)*.5,$e=r.pal,fa=h.touchMode==="both"||h.touchMode==="vortex",oi=h.touchMode==="both"||h.touchMode==="paint",ua=r.touch[0],ni=i.trail>.15?u.bass*.05*Math.min(l,2):0;z.frame({adaptRate:1-Math.exp(-t*2.5),engine:f.engine==="milk"&&V?"milk":"scene",scene:f.engine==="milk"?"nebula":f.scene,sceneU:{uTime:r.time,uBass:u.bass,uMid:u.mid,uHigh:u.high,uVol:u.vol,uBeat:u.beat,uDrive:o,uBurst:r.burstT,uHue:r.hue,uBeatCount:u.beatCount,uSinceBeat:r.sinceBeat,uBeatInt:r.beatInt,uFlowA:r.flux.fa,uFlowB:r.flux.fb,uFlowMix:r.flux.fm,uWaveA:r.flux.wa,uWaveB:r.flux.wb,uWaveMix:r.flux.wm,uMapT:r.flux.mapT,uPhoto:z.photoTex,uPhotoAR:z.photoAR,uAudio:z.audioTex,uP0:te.slice(0,4),uP1:te.slice(4,8),uPalA:$e.slice(0,3),uPalB:$e.slice(3,6),uPalC:$e.slice(6,9),uPalD:$e.slice(9,12),uCam:[r.camX+d,r.camY+p,r.roll+r.jolt*.06*h.cameraShake]},fbU:{uTime:r.time,uTrail:Math.min(.96,Math.max(i.trail+ni,n*.9,r.hyper*.86)),uZoom:i.zoom+n*.035+r.hyper*.04+u.beat*h.beatPulse*.008*l,uSpin:i.spin+n*r.flowX*.03+r.jolt*.004*h.cameraShake,uWarp:i.warp+n*.8+u.mid*.3*Math.min(l,2),uHueDrift:i.hueDrift+n*.012+r.hyper*.05+u.high*.006*l,uKaleido:i.kaleido,uKaleidoSpin:r.kAngle,uMirror:i.mirror,uFusion:f.engine==="milk"?0:V?i.fusion:0,uBreathe:i.breathe+o*.6+u.bass*.35*Math.min(l,2),uMelt:i.melt+n*.5+u.high*.25*Math.min(l,2),uBass:u.bass,uBeat:u.beat,uBurstT:r.burstT,uBurstC:[r.burstCX,r.burstCY],uFlow:[r.flowX*n,r.flowY*n],uLensRot:r.lensRot+r.jolt*.025*h.cameraShake,uLensZoom:r.lensZoom,uLensPan:[0,0],uSwirl:r.swirl,uBulge:r.bulge,uPunch:De,uShake:ii,uBeatRipT:h.beatRipples?r.beatRipT:9,uBeatRipAmt:r.beatRipAmt,uEdgeBlack:f.engine==="scene"&&_[f.scene]&&_[f.scene].space?1:0,uTouch:qa(r.touch[0],fa),uTouch2:qa(r.touch[1],fa),uTouchVel:[W(ua.vx*.02,-.08,.08),W(ua.vy*.02,-.08,.08)],uTouchColor:Ja(r.time*.05),uTouchPaint:oi?1.2:0},finU:{uTime:a/1e3,uChroma:i.chroma+o*2+r.hyper*2+u.beat*1.2*Math.min(l,2),uBloomAmt:i.bloom*(1-r.hyper*.5)+o*.45,uAutoExp:h.autoExposure?1:0,uGrain:i.grain,uVignette:i.vignette,uBurstC:[r.burstCX,r.burstCY],uExposure:i.exposure*(1+o*.12-r.hyper*.15),uSat:i.saturation,uContrast:i.contrast+n*.06,uFlash:r.flash,uTransMix:r.transMix,uBurstT:r.burstT,uBeat:u.beat,uInvert:0}}),h.rumble&&g.connected&&u.isBeat&&performance.now()-r.lastHuman<3e4&&g.rumble(Math.min(1,u.bass*.45)*h.rumbleStrength*(.35+o),.15*h.rumbleStrength,70),r.hyperOn&&h.rumble&&Math.random()<t*10&&g.rumble(.25*h.rumbleStrength,.6*h.rumbleStrength,60),Gt+=t,Gt>1/30&&(Gt=0,qi(),we&&we._n!==f.name&&(we._n=f.name,we.setName(f.name))),mt+=t,Ht++,mt>.5&&(h.showFps?v("#fps").textContent=`${Math.round(Ht/mt)} fps \xB7 out ${A}\xD7${M} \xB7 render ${z.sw}\xD7${z.sh} (${Math.round(k*100)}%)`:v("#fps").textContent="",mt=0,Ht=0)}var Te=document.documentElement.style,Ce=document.getElementById("spec"),ye=Ce?Ce.getContext("2d"):null;function qi(){let a=e=>Ja(e).map(t=>Math.round(t*255)).join(",");if(Te.setProperty("--c1",a(0)),Te.setProperty("--c2",a(.33)),Te.setProperty("--c3",a(.66)),Te.setProperty("--bass",Math.min(1.5,u.bass).toFixed(3)),Te.setProperty("--beat",u.beat.toFixed(3)),ye&&We.classList.contains("show")){let e=Ce.width=Ce.clientWidth*2,t=Ce.height=Ce.clientHeight*2;ye.clearRect(0,0,e,t);let i=48,o=e/i,n=ye.createLinearGradient(0,0,e,0);n.addColorStop(0,`rgb(${a(0)})`),n.addColorStop(.5,`rgb(${a(.33)})`),n.addColorStop(1,`rgb(${a(.66)})`),ye.fillStyle=n;for(let s=0;s<i;s++){let l=u.tex[Math.floor(s/i*400)]/255,c=Math.max(2,l*l*t);ye.globalAlpha=.35+l*.6,ye.fillRect(s*o+1,t-c,o-2,c)}ye.globalAlpha=1}}var dt=v("#hud");function w(a,e){let t=document.createElement("div");for(t.className="toast",t.innerHTML=`<span class="g">${a}</span><span>${ee(e)}</span>`,dt.appendChild(t);dt.children.length>3;)dt.firstChild.remove();setTimeout(()=>{t.style.opacity=0,setTimeout(()=>t.remove(),450)},1700)}var Da={};function Yt(a,e,t){let i=Da[a];(!i||!i.isConnected)&&(i=document.createElement("div"),i.className="toast",i.innerHTML=`<span class="g">${g.label(a)}</span><span>${e}</span><span class="bar"><i></i></span>`,dt.appendChild(i),Da[a]=i),i.querySelector("i").style.width=Math.round(t*100)+"%",i.style.opacity=1,clearTimeout(i._t),i._t=setTimeout(()=>{i.style.opacity=0,setTimeout(()=>i.remove(),450)},900)}var ee=a=>String(a).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),We=v("#ui"),gt=0;function ia(a){r.cinema&&!a||(We.classList.add("show"),document.body.classList.remove("idle"),clearTimeout(gt),h.uiAutoHide&&(gt=setTimeout(()=>{(!We.matches(":hover")||a==="fromPad")&&wt()},3500)))}function wt(){v("#splash").classList.contains("gone")&&!document.activeElement?.matches("input,select")&&(We.classList.remove("show"),document.body.classList.add("idle"))}function ei(){r.panels=!r.panels,document.body.classList.toggle("panels-off",!r.panels)}window.addEventListener("mousemove",()=>ia());We.addEventListener("mouseleave",()=>{clearTimeout(gt),h.uiAutoHide&&(gt=setTimeout(wt,1500))});function Ve(){v("#splash").classList.add("gone"),document.body.classList.add("started"),we&&!h.seenTouchHint&&(h.seenTouchHint=!0,fe(),setTimeout(()=>w("\u{1F44D}","Put your thumbs down \u2014 left steers, right morphs"),900))}var Di={addFiles:()=>v("#fileIn").click(),addFolder:()=>v("#folderIn").click(),loopback:async()=>{try{Ae(),await u.useLoopback(),Ve(),w("\u{1F50A}","Listening to your PC audio")}catch(a){w("\u26A0",a.message||"Capture cancelled")}},mic:async()=>{try{Ae(),await u.useMic(),Ve(),w("\u{1F399}","Listening to microphone")}catch{w("\u26A0","Microphone unavailable")}},demo:()=>{oa(),Ve()},srcPlayer:()=>{Ae(),u.useSource("player"),u.playlist.length&&u.toggle()},prevPreset:()=>xe(-1),nextPreset:()=>xe(1),mutate:ea,generate:ta,save:Tt,overwrite:Pi,revert:()=>{Z(Oe,{quiet:!0}),w("\u21BA","Reverted")},deletePreset:Ti,resetSettings:()=>{let a=document.querySelector("[data-act=resetSettings]");if(a&&!a.dataset.armed){a.dataset.armed="1";let t=a.textContent;a.textContent="Tap again to reset everything",setTimeout(()=>{delete a.dataset.armed,a.textContent=t},3e3);return}let e=["volume","seenGuide","seenTouchHint","outputDevice","aaV"];for(let t of Object.keys(ft))e.includes(t)||h[t]===ft[t]||(h[t]=ft[t],pe[t]&&pe[t](h[t]));fe(),kt(),v("#autoBtn").classList.toggle("on",h.autopilot),w("\u21BA","Settings back to defaults")},autopilot:()=>aa(!h.autopilot),controls:()=>ke(!0),fullscreen:na,playPause:()=>{Ae(),u.toggle()},prevTrack:()=>u.prev(),nextTrack:()=>u.next(),shuffle:()=>{u.shuffle=!u.shuffle,bt()},repeat:()=>{u.repeat={all:"one",one:"off",off:"all"}[u.repeat],bt()},clearList:()=>{u.clear(),ra()},exportPresets:()=>{let a=new Blob([JSON.stringify(O,null,2)],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(a),e.download="eye-candy-presets.json",e.click()},importPresets:()=>v("#importIn").click(),sheetVisuals:()=>ht("visuals"),sheetMusic:()=>ht("music"),closeSheet:()=>ht(null),touchpad:async()=>{let a=await H.request();w("\u25C9",a?"Touchpad on \u2014 swipe to stir the visuals":"No PlayStation controller found"),v("#tpChip").classList.toggle("hidden",a)}};document.addEventListener("click",a=>{let e=a.target.closest("[data-act]");if(!e)return;u.resume();let t=Di[e.dataset.act];t&&t()});function oa(){Fe||(u.el.pause(),u.stopStream(),u.mode="demo",Fe=za(u),u.resume(),ti(),w("\u2726","Demo groove"))}function Ae(){Fe&&(Fe(),Fe=null,u.mode==="demo"&&(u.mode="player"))}async function ht(a){let e=document.body,t=e.classList.contains("sheet-visuals")?"visuals":e.classList.contains("sheet-music")?"music":null;e.classList.remove("sheet-visuals","sheet-music"),a&&a!==t&&e.classList.add("sheet-"+a),a==="visuals"&&G()}async function na(){if($&&$.setFullscreen){$.setFullscreen(!await $.isFullscreen());return}document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{})}function ke(a){ma(),v("#controls").classList.toggle("hidden",!a)}var Ui=/\.(mp3|flac|wav|ogg|oga|m4a|aac|opus|webm|wma|aiff?)$/i,_i=a=>({name:a.name.replace(/\.[^.]+$/,""),url:URL.createObjectURL(a),path:$?$.pathFor(a):null});function sa(a){let e=[...a].filter(t=>Ui.test(t.name)||(t.type||"").startsWith("audio/")).sort((t,i)=>(t.webkitRelativePath||t.name).localeCompare(i.webkitRelativePath||i.name,void 0,{numeric:!0}));if(!e.length)return w("\u26A0","No audio files found");Ae(),u.addTracks(e.map(_i)),Ve(),ra(),w("\u266B",`Added ${e.length} track${e.length>1?"s":""}`)}v("#fileIn").onchange=a=>{sa(a.target.files),a.target.value=""};v("#folderIn").onchange=a=>{sa(a.target.files),a.target.value=""};v("#importIn").onchange=async a=>{try{let e=JSON.parse(await a.target.files[0].text()),t=(Array.isArray(e)?e:[e]).filter(i=>i&&i.engine);t.forEach(i=>{i.id="user-"+Math.random().toString(36).slice(2),i.builtin=!1}),O.push(...t),_e(O),G(),w("\u2605",`Imported ${t.length} presets`)}catch{w("\u26A0","Could not read that file")}a.target.value=""};window.addEventListener("dragover",a=>a.preventDefault());window.addEventListener("drop",async a=>{a.preventDefault(),u.resume();let e=[...a.dataTransfer.items||[]],t=[],i=s=>new Promise(l=>{if(s.isFile)s.file(c=>{t.push(c),l()},l);else if(s.isDirectory){let c=s.createReader(),m=[],d=()=>c.readEntries(async p=>{if(p.length)m.push(...p),d();else{for(let P of m)await i(P);l()}},l);d()}else l()}),o=e.map(s=>s.webkitGetAsEntry&&s.webkitGetAsEntry()).filter(Boolean);if(o.length)for(let s of o)await i(s);else t.push(...a.dataTransfer.files);if(t.some(s=>/^image\//.test(s.type))&&!t.some(s=>/^audio\//.test(s.type)||/\.(mp3|wav|flac|ogg|m4a|aac|opus)$/i.test(s.name))){await ca(t);return}let n=t.find(s=>/\.json$/i.test(s.name));if(n&&t.length===1){v("#importIn").onchange({target:{files:[n],value:""}});return}sa(t)});function Ni(a){return"app://eye/media/"+encodeURIComponent(a)}function ra(){$&&localStorage.setItem("eyecandy.playlist",JSON.stringify(u.playlist.filter(a=>a.path).map(a=>({name:a.name,path:a.path}))))}function Hi(){if($)try{let a=JSON.parse(localStorage.getItem("eyecandy.playlist")||"[]");u.playlist.push(...a.map(e=>({...e,url:Ni(e.path)})))}catch{}}var Ua=a=>isFinite(a)?`${Math.floor(a/60)}:${String(Math.floor(a%60)).padStart(2,"0")}`:"0:00";function bt(){let a=v("#playlist");u.playlist.length?a.innerHTML=u.playlist.map((e,t)=>`<li data-i="${t}" class="${t===u.index&&u.mode==="player"?"cur":""}"><span class="n">${t+1}</span><span class="t">${ee(e.name)}</span><button class="x" data-x="${t}">\u2715</button></li>`).join(""):a.innerHTML='<li class="empty">Drop songs or folders here<br><small>mp3 \xB7 flac \xB7 wav \xB7 ogg \xB7 m4a</small></li>',v("#shuffleBtn").classList.toggle("on",u.shuffle),v("#repeatBtn").textContent={all:"\u21BB Repeat all",one:"\u21BB Repeat one",off:"\u2192 No repeat"}[u.repeat],v("#repeatBtn").classList.toggle("on",u.repeat!=="off"),ti()}v("#playlist").addEventListener("click",a=>{let e=a.target.closest("[data-x]");if(e){u.remove(+e.dataset.x),ra();return}let t=a.target.closest("li[data-i]");t&&(Ae(),u.play(+t.dataset.i))});function ti(){let a=u.current,e=u.mode;v("#npTitle").textContent=e==="loopback"?"PC audio":e==="mic"?"Microphone":e==="demo"?"Demo groove":a?a.name:"Nothing playing",v("#npSub").textContent=e==="player"?a?`Track ${u.index+1} of ${u.playlist.length}`:"Drop music anywhere":"Live input",v("#playBtn").textContent=v("#playBtn2").textContent=e==="player"&&!u.el.paused?"\u275A\u275A":"\u25B6";for(let[t,i]of[["#srcPlayer","player"],["#srcLoop","loopback"],["#srcMic","mic"],["#srcDemo","demo"]])v(t).classList.toggle("on",e===i)}u.onchange=bt;var yt=v("#seek"),la=!1;yt.addEventListener("input",()=>{la=!0});yt.addEventListener("change",()=>{isFinite(u.el.duration)&&(u.el.currentTime=yt.value/1e3*u.el.duration),la=!1});v("#vol").value=Math.round(h.volume*100);v("#vol").addEventListener("input",a=>{h.volume=a.target.value/100,u.out.gain.value=h.volume,fe()});setInterval(()=>{let a=u.el;!la&&isFinite(a.duration)&&(yt.value=a.currentTime/a.duration*1e3),v("#tCur").textContent=Ua(a.currentTime),v("#tDur").textContent=Ua(a.duration)},250);var Vt=new Map;function _a(a){if(a.engine==="milk"){let n=0;for(let s of a.name)n=(n*31+s.charCodeAt(0))%360;return`linear-gradient(90deg,hsl(${n},90%,55%),hsl(${(n+80)%360},90%,50%),hsl(${(n+160)%360},90%,55%))`}let e=JSON.stringify(a.palette);if(Vt.has(e))return Vt.get(e);let t=ot(a.palette),i=[];for(let n=0;n<=4;n++){let s=n/4,l=[0,1,2].map(c=>Math.round(255*W(t.a[c]+t.b[c]*Math.cos(6.2831853*(t.c[c]*s+t.d[c])),0,1)));i.push(`rgb(${l})`)}let o=`linear-gradient(90deg,${i.join(",")})`;return Vt.set(e,o),o}function G(){let a=v("#search").value.trim().toLowerCase(),e=Pt(U),t=v("#presetList");if(v("#milkCat").classList.toggle("hidden",U!=="milk"),v("#photoBox").classList.toggle("hidden",U!=="photo"),v("#search").classList.toggle("hidden",U==="photo"),U==="photo"&&(Gi(),!Y.length)){t.innerHTML='<li class="msg">Add a photo and pick a style \u2014 your photo becomes a living visualizer.<br><br>Photos stay on this device. Nothing is uploaded.</li>';return}if(U==="milk"&&!V){t.innerHTML='<li class="msg">Loading MilkDrop library\u2026</li>',ve().then(()=>{Oi(),G()});return}if(U==="user"&&!e.length){t.innerHTML=`<li class="msg">No saved presets yet.<br>Press \u2605 Save (or ${g.label("Y")} on the controller) to keep the current look.</li>`;return}let i=[];for(let n=0;n<e.length;n++){let s=e[n];if(a&&!s.name.toLowerCase().includes(a))continue;let l=s.engine==="milk"?"MilkDrop":U==="photo"?"":(s.photo?"\u{1F4F7} ":"")+(_[s.scene]?.name||"");if(U==="photo"){let c=_[s.scene];i.push(`<li data-i="${n}" class="pstyle ${s.id===f.id?"cur":""}"><span class="sw" style="background:${_a(s)}"></span><span class="nm">${ee(c.name)}<span class="pdesc">${ee(c.desc||"")}</span></span></li>`);continue}if(i.push(`<li data-i="${n}" class="${s.id===f.id?"cur":""}"><span class="sw" style="background:${_a(s)}"></span><span class="nm">${ee(s.name)}</span><span class="s">${ee(l)}</span></li>`),i.length>3e3)break}t.innerHTML=i.join("");let o=t.querySelector(".cur");o&&!t.matches(":hover")&&o.scrollIntoView({block:"nearest"})}function Gi(){let a=v("#photoStrip");a.innerHTML=Y.map(e=>`<div class="pthumb ${e.id===se?"on":""}" data-ph="${e.id}" title="${ee(e.name)}"><img src="${e.thumb}" alt=""><button class="pdel" data-del="${e.id}" title="Remove photo">\u2715</button></div>`).join(""),v("#photoHint").textContent=Y.length?"Tap a photo, then pick a style \u2193":""}v("#photoStrip").addEventListener("click",async a=>{let e=a.target.closest("[data-del]");if(e){if(a.stopPropagation(),!e.dataset.armed){e.dataset.armed="1",e.textContent="Delete?",e.classList.add("armed"),setTimeout(()=>{e.isConnected&&(delete e.dataset.armed,e.textContent="\u2715",e.classList.remove("armed"))},2500);return}let i=e.dataset.del;await Ra(i),Y=Y.filter(o=>o.id!==i),se===i&&(se=Y[0]?.id||null),z.photoId===i&&(z.photoId=null),w("\u2715","Photo removed"),G();return}let t=a.target.closest("[data-ph]");t&&(se=t.dataset.ph,ai())});function ai(){let a=Wa(se);if(!a.length){G();return}let e=Math.max(0,a.findIndex(t=>t.scene===f.scene));ne=e,Z(a[e])}async function ca(a){let e=[...a].filter(o=>/^image\//.test(o.type)||/\.(jpe?g|png|webp|gif|bmp|avif|heic)$/i.test(o.name));if(!e.length)return!1;w("\u{1F4F7}",e.length>1?`Adding ${e.length} photos\u2026`:"Adding photo\u2026");let t=null;for(let o of e)try{t=await Sa(o,he?1600:2048),Y.unshift(t)}catch{w("\u26A0",`Could not read ${o.name}`)}if(!t)return!0;se=t.id,Vi(),ai(),w("\u{1F4F7}","Photo added \u2014 now pick a style");let i=v("#presetList");return i.classList.remove("pickme"),i.offsetWidth,i.classList.add("pickme"),!0}function Vi(){me(".tab").forEach(a=>a.classList.toggle("on",a.dataset.tab==="presets")),me(".tabpage").forEach(a=>a.classList.toggle("on",a.id==="tab-presets")),me(".cbtn").forEach(a=>a.classList.toggle("on",a.dataset.coll==="photo")),U="photo",G(),document.body.classList.contains("mobile")&&!document.body.classList.contains("sheet-visuals")&&ht("visuals")}v("#photoIn").onchange=async a=>{await ca(a.target.files),a.target.value=""};Ma().then(a=>{Y=a,se=a[0]?.id||null,U==="photo"&&G()});v("#presetList").addEventListener("click",a=>{let e=a.target.closest("li[data-i]");e&&(ne=+e.dataset.i,Z(Pt(U)[ne]))});v("#search").addEventListener("input",G);function Oi(){let a=v("#milkCat"),e=Object.keys(qe).sort(),t=Me("all").length;a.innerHTML=`<option value="all">All MilkDrop (${t})</option><option value="classic">Classic Butterchurn (${vt.length})</option>`+e.map(i=>`<option value="${i}">${i} (${qe[i].length})</option>`).join(""),a.value=de}v("#milkCat").addEventListener("change",a=>{de=a.target.value,ne=-1,G()});me(".cbtn").forEach(a=>a.onclick=()=>{me(".cbtn").forEach(e=>e.classList.toggle("on",e===a)),U=a.dataset.coll,ne=-1,G()});me(".tab").forEach(a=>a.onclick=()=>{me(".tab").forEach(e=>e.classList.toggle("on",e===a)),me(".tabpage").forEach(e=>e.classList.toggle("on",e.id==="tab-"+a.dataset.tab)),a.dataset.tab==="tweak"&&re()});var Na=[["trail","Tracers",0,.97],["zoom","Tunnel Zoom",.96,1.06],["spin","Spin",-.03,.03],["warp","Warp",0,2],["breathe","Breathing",0,2],["melt","Melt",0,2],["hueDrift","Color Drift",-.05,.05],["hueSpin","Hue Cycle",-.3,.3],["kaleido","Kaleidoscope",0,16,1],["kaleidoSpin","Kaleido Spin",-1,1],["mirror","Mirror",0,1,1],["fusion","MilkDrop Fusion",0,1],["react","Audio Reactivity",0,2.5],["speed","Speed",0,3],["chroma","Chromatic",0,3],["bloom","Bloom",0,2],["exposure","Exposure",.4,2],["saturation","Saturation",0,2],["contrast","Contrast",.6,1.6],["grain","Film Grain",0,1],["vignette","Vignette",0,1.5],["#","Music motion"],["dance","Shape Dance",0,2.5],["ripple","Beat Ripples",0,2.5],["punch","Bass Punch",0,2.5],["shake","Beat Shake",0,2.5],["swirlA","Audio Swirl",0,2.5],["bulgeA","Bass Bulge",0,2.5]];v("#sceneSel").innerHTML=Le.map(a=>`<option value="${a.id}">${a.name}</option>`).join("")+'<optgroup label="Photo styles">'+Ze.map(a=>`<option value="${a.id}">\u{1F4F7} ${a.name}</option>`).join("")+'</optgroup><option value="__milk">MilkDrop engine</option>';v("#palSel").innerHTML=K.map((a,e)=>`<option value="${e}">${a.name}</option>`).join("")+'<option value="custom">Custom (generated)</option>';function Ha(a,e,t,i,o,n,s){let l=document.createElement("div");l.className="sl "+(n||"");let c=o||(t-e)/400;l.innerHTML=`<span title="${ee(a)}">${ee(a)}</span><input type="range" min="${e}" max="${t}" step="${c}" value="${i}"><span class="v"></span>`;let m=l.querySelector("input"),d=l.querySelector(".v"),p=()=>d.textContent=(+m.value).toFixed(o===1?0:2);return p(),m.addEventListener("input",()=>{p(),s(+m.value),Be()}),l._set=P=>{document.activeElement!==m&&(m.value=P,p())},l}var Ot={},jt=[];function re(){if(!v("#tab-tweak").classList.contains("on"))return;if(v("#pName").value=f.name,v("#sceneSel").value=f.engine==="milk"?"__milk":f.scene,v("#palSel").value=typeof f.palette=="number"?String(f.palette):"custom",v("#milkRow").classList.toggle("hidden",!(f.engine==="milk"||f.fx.fusion>0)),V){let n=Me("all");v("#milkSel").options.length!==n.length&&(v("#milkSel").innerHTML=n.map(s=>`<option>${ee(s)}</option>`).join(""))}V&&(v("#milkSel").value=f.engine==="milk"?f.milk:Se||"");let a=v("#paramSliders"),e=_[f.scene],t=f.engine+":"+f.scene;a._key!==t?(a._key=t,a.innerHTML="",jt=[],f.engine==="scene"&&e?(e.params.forEach((n,s)=>{let l=Ha(n.n,n.min,n.max,f.params[s],0,(e.stick||[]).includes(s)?"stick":"",c=>{f.params[s]=c});jt.push(l),a.appendChild(l)}),v("#stickNames").textContent=(e.stick||[0,1]).map(n=>e.params[n].n).join(" & ")):(a.innerHTML='<p class="fine">MilkDrop presets carry their own math \u2014 shape them with the Trip FX below, the triggers, and the kaleidoscope.</p>',v("#stickNames").textContent="\u2014")):jt.forEach((n,s)=>n._set(f.params[s]));let i=v("#fxSliders");i.children.length?Na.forEach(([n])=>{Ot[n]&&Ot[n]._set(f.fx[n]??ie[n]??0)}):Na.forEach(([n,s,l,c,m])=>{if(n==="#"){let p=document.createElement("h3");p.textContent=s,i.appendChild(p);return}let d=Ha(s,l,c,f.fx[n]??0,m,"",p=>{f.fx[n]=p,n==="fusion"&&p>0&&ve().then(()=>{Se||Ge(Zt()),v("#milkRow").classList.remove("hidden"),re()})});Ot[n]=d,i.appendChild(d)});let o=O.some(n=>n.id===f.id);v("#overwriteBtn").classList.toggle("hidden",!o),v("#deleteBtn").classList.toggle("hidden",!o)}v("#pName").addEventListener("change",a=>{f.name=a.target.value,v("#presetName").textContent=f.name});v("#sceneSel").addEventListener("change",a=>{let e=a.target.value;if(e==="__milk"){ve().then(()=>Z(Jt(Se||Zt())));return}let t=_[e];Z({...f,id:"edit-"+Date.now(),engine:"scene",scene:e,params:t.params.map(i=>i.def),name:t.name+" (custom)",builtin:!1},{quiet:!0})});v("#palSel").addEventListener("change",a=>{a.target.value!=="custom"&&(f.palette=+a.target.value)});v("#milkSel").addEventListener("change",a=>{let e=a.target.value;f.engine==="milk"?(f.milk=e,f.name=e,v("#presetName").textContent=e):f.milk=e,Ge(e)});var ji=[["#","Display"],["resolution","Output resolution","select",{native:"Native (match screen)",2160:"4K \xB7 2160p",1440:"1440p",1080:"1080p",900:"900p",720:"720p",540:"540p (potato mode)"}],["renderScale","Render scale","select",{auto:"Auto (adaptive)","0.5":"50%","0.67":"67%","0.75":"75%","0.85":"85%",1:"100%","1.25":"125% \xB7 supersampled","1.5":"150% \xB7 supersampled",2:"200% \xB7 supersampled"}],["aa","Anti-aliasing","select",{off:"Off \xB7 crisp (default)",auto:"Auto (smooth when GPU has room)","2x":"2\xD7 supersampling","4x":"4\xD7 supersampling"}],["fpsCap","Frame rate cap","select",{0:"Unlimited (VSync)",144:"144 fps",120:"120 fps",60:"60 fps",30:"30 fps"}],["autoExposure","Auto exposure","toggle","Keeps every preset from blowing out to white (or sinking to black)"],["startFullscreen","Start in fullscreen","toggle","Open straight into fullscreen next launch"],["uiScale","Interface size","range",[.75,1.5,.05,"\xD7"]],["uiAutoHide","Auto-hide interface","toggle","Panels fade away when you are not using the mouse"],["showFps","Show FPS & resolution","toggle",""],["#","Music reaction"],["reactIntensity","Reaction intensity","range",[0,3,.05,"\xD7"]],["idleDance","Music dance","toggle","Shapes, lens and camera always move with the music \u2014 your controller adds on top"],["beatRipples","Beat ripples","toggle","Every kick sends a shockwave through the image"],["beatPulse","Bass punch","range",[0,2,.05,"\xD7"]],["beatFlash","Drop flashes","range",[0,1,.05,""]],["cameraShake","Beat shake","range",[0,1.5,.05,""]],["beatSens","Beat sensitivity","range",[0,2,.05,""]],["gainBass","Bass gain","range",[0,3,.05,"\xD7"]],["gainMid","Mid gain","range",[0,3,.05,"\xD7"]],["gainHigh","Treble gain","range",[0,3,.05,"\xD7"]],["outputDevice","Audio output","select",{default:"System default"}],["#","Autopilot"],["autopilot","Autopilot","toggle","Keeps changing presets on its own, even while you play"],["autoPause","Pause autopilot while I play","toggle","Hold the current preset while you are using the controller"],["autoInterval","Time per preset","range",[8,120,1,"s"]],["autoSource","Autopilot plays","select",{mix:"Everything mixed",mixp:"Everything + my photos",photo:"My photos only",eye:"Eye Candy presets",flux:"Flux engine",generate:"Fresh generated presets",milk:"MilkDrop library",user:"My presets",all:"Eye Candy + MilkDrop"}],["autoOnDrop","Switch on drops","toggle","Jump to a new preset when the beat drops"],["idle","Resume after I stop playing","range",[3,120,1,"s"]],["transition","Transition length","range",[.2,4,.1,"s"]],["#","Controller"],["stickSens","Stick sensitivity","range",[.3,2.5,.05,"\xD7"]],["invertY","Invert Y axis","toggle",""],["deadzone","Stick deadzone","range",[0,.4,.01,""]],["rumble","Rumble","toggle","Feel the bass in your hands"],["rumbleStrength","Rumble strength","range",[0,1,.05,""]],["touchMode","PS touchpad / right-drag","select",{both:"Vortex + paint light",vortex:"Vortex only",paint:"Paint light only",off:"Off"}],["@touchpad"]],pe={deadzone:a=>g.deadzone=a,uiScale:a=>Te.setProperty("--ui",a),outputDevice:a=>u.setOutput(a).then(e=>w("\u{1F508}",e?"Audio output changed":"Could not switch output")),renderScale:()=>{r.quality={}},aa:()=>{r.quality={}},autopilot:a=>v("#autoBtn").classList.toggle("on",a)};async function Wi(a){try{(await navigator.mediaDevices.enumerateDevices()).filter(t=>t.kind==="audiooutput"&&t.deviceId!=="default").forEach(t=>{let i=document.createElement("option");i.value=t.deviceId,i.textContent=t.label||"Output "+t.deviceId.slice(0,5),a.appendChild(i)}),a.value=h.outputDevice}catch{}}function kt(){let a=v("#settingsForm");a.innerHTML="";for(let[e,t,i,o]of ji){if(e==="#"){let s=document.createElement("h3");s.className="sethead",s.textContent=t,a.appendChild(s);continue}let n=document.createElement("div");if(n.className="set",e==="@touchpad"){n.innerHTML=`<div>PS touchpad<div class="d" id="tpStatus">${ee(H.status)}</div></div><button class="mini" id="tpBtn">${H.connected?"Reconnect":"Connect"}</button>`,n.querySelector("#tpBtn").onclick=async()=>{let s=await H.request();w("\u25C9",s?"Touchpad connected \u2014 swipe to stir the visuals":"No PlayStation controller found")},a.appendChild(n);continue}if(i==="toggle")n.innerHTML=`<div>${t}<div class="d">${o}</div></div><div class="toggle ${h[e]?"on":""}"></div>`,n.querySelector(".toggle").onclick=s=>{h[e]=!h[e],s.target.classList.toggle("on",h[e]),fe(),pe[e]&&pe[e](h[e])};else if(i==="select"){n.innerHTML=`<div>${t}</div><select>${Object.entries(o).map(([l,c])=>`<option value="${l}" ${String(h[e])===l?"selected":""}>${c}</option>`).join("")}</select>`;let s=n.querySelector("select");e==="outputDevice"&&Wi(s),s.onchange=l=>{h[e]=l.target.value,fe(),pe[e]&&pe[e](h[e])}}else{let[s,l,c,m]=o;n.innerHTML=`<div>${t} <span class="d">${h[e]}${m}</span></div><input type="range" min="${s}" max="${l}" step="${c}" value="${h[e]}">`,n.querySelector("input").oninput=d=>{h[e]=+d.target.value,n.querySelector(".d").textContent=h[e]+m,fe(),pe[e]&&pe[e](h[e])}}a.appendChild(n)}}H.onstatus=a=>{let e=document.getElementById("tpStatus");e&&(e.textContent=a),H.connected&&w("\u25C9",a)};function ma(){let a=t=>`<span class="k">${g.label(t)}</span>`,e=[["Left stick","Steer","Fly the camera / drag the trails"],["Right stick","Morph","Bend the two \u25C9 shape params live"],[a("LT"),"Warp","Squeeze into infinite feedback tunnels"],[a("RT"),"Drive","Overdrive audio reaction, bloom & speed"],[a("LT")+"+"+a("RT"),"Hyperdrive","Both triggers fully \u2014 hold on"],[a("LB"),"Kaleidoscope","Tap to cycle \xB7 hold for mirror world"],[a("RB"),"Palette","Tap next colors \xB7 hold to spin hues"],["\u25C0 \u25B6","Presets","Previous / next look"],["\u25B2 \u25BC","Time","Speed up, slow down, even reverse"],[a("A"),"Burst","Shockwave + flash. Hit it on the beat"],[a("B"),"Freeze","Hold to stop time while trails melt on"],[a("X"),"Randomize","Tap remix \xB7 hold for a brand-new preset"],[a("Y"),"Save","Keep this exact look in My Presets"],[a("L3"),"Reset view","Click left stick"],[a("R3"),"Lock shape","Click right stick to keep the morph"],[a("START"),"Menu","Show / hide the panels"],[a("BACK"),"This guide","Hold to toggle autopilot"],["Touchpad","Stir (PS)","Swipe to swirl & paint \xB7 pinch/twist \xB7 click = Music dance on/off"]];v("#cgrid").innerHTML=e.map(([t,i,o])=>`<div class="cg"><span class="k">${t.startsWith("<")?t.replace(/<\/?span[^>]*>/g,""):t}</span><div><b>${i}</b><small>${o}</small></div></div>`).join(""),me("[data-g]").forEach(t=>t.textContent=g.label(t.dataset.g))}v("#controls").addEventListener("click",a=>{a.target.id==="controls"&&ke(!1)});window.addEventListener("keydown",a=>{if(a.target.matches("input,select,textarea"))return;Be(),u.resume();let e=a.key;e==="ArrowRight"?xe(1):e==="ArrowLeft"?xe(-1):e==="ArrowUp"?xt(1):e==="ArrowDown"?xt(-1):e===" "?(a.preventDefault(),je(1)):e==="r"||e==="R"?ea():e==="g"||e==="G"?ta():e==="s"||e==="S"?Tt():e==="k"||e==="K"?Ya():e==="m"||e==="M"?Ka():e==="p"||e==="P"?Xa(1):e==="f"||e==="F"||e==="F11"?(a.preventDefault(),na()):e==="h"||e==="H"?(r.cinema=!r.cinema,r.cinema?wt():ia(),w("H",r.cinema?"Interface hidden (H to show)":"Interface on")):e==="Tab"?(a.preventDefault(),ei()):e==="a"||e==="A"?aa(!h.autopilot):e==="c"||e==="C"?ke(v("#controls").classList.contains("hidden")):e==="Escape"?ke(!1):e==="MediaPlayPause"?u.toggle():e==="MediaTrackNext"?u.next():e==="MediaTrackPrevious"&&u.prev()});var Ee=null;ce.addEventListener("contextmenu",a=>a.preventDefault());ce.addEventListener("pointerdown",a=>{if(a.button===2){ue.active=!0,ue.x=a.clientX/innerWidth,ue.y=a.clientY/innerHeight;return}if(a.button===1){je(1,(a.clientX/innerWidth-.5)*innerWidth/innerHeight,.5-a.clientY/innerHeight);return}Ee={x:a.clientX,y:a.clientY},Be()});window.addEventListener("pointerup",a=>{a.button===2&&(ue.active=!1)});window.addEventListener("pointermove",a=>{ue.active&&(ue.x=a.clientX/innerWidth,ue.y=a.clientY/innerHeight)});window.addEventListener("pointerup",()=>Ee=null);window.addEventListener("pointermove",a=>{Ee&&(r.camX+=(a.clientX-Ee.x)*.004,r.camY=W(r.camY+(a.clientY-Ee.y)*.003,-1.3,1.3),Ee={x:a.clientX,y:a.clientY},Be())});ce.addEventListener("wheel",a=>{f.fx.trail=W(f.fx.trail-a.deltaY*8e-4,0,.97),Yt("LT","Tracers",f.fx.trail/.97),Be(),re()},{passive:!0});ce.addEventListener("dblclick",na);Te.setProperty("--ui",h.uiScale);he&&(r.panels=!1,h.uiAutoHide=!1);$&&h.startFullscreen&&$.setFullscreen&&$.setFullscreen(!0);h.outputDevice!=="default"&&u.setOutput(h.outputDevice);H.autoConnect();$||document.querySelectorAll("[data-act=loopback]").forEach(a=>{a.innerHTML=a.classList.contains("src")?"Tab/PC":"\u{1F50A} Visualize a tab or PC audio",a.title="Pick a tab (e.g. YouTube/Spotify web) or your whole screen and tick \u201CShare audio\u201D"});Hi();bt();kt();G();ma();v("#autoBtn").classList.toggle("on",h.autopilot);v("#presetName").textContent=f.name;U="eye";{let a=Pe("eye",pt);ne=pt.indexOf(a),Z(a,{transition:!1,quiet:!0})}var Wt=Le.map(a=>a.id),$t=0;(function a(){if($t>=Wt.length){v("#loadbar").style.opacity=0;return}z.sceneProg(Wt[$t++]),v("#loadbar div").style.width=$t/Wt.length*100+"%",setTimeout(a,0)})();requestAnimationFrame(Qa);window.__eye={get milkCanvas(){return oe},getMilkPreset:Oa,ensureMilk:ve,get milk(){return V},milkNamesFor:Me,startDemoGroove:oa,R:z,audio:u,L:r,get cur(){return f},loadPreset:Z,autoNext:Za,BUILTIN:be,SCENES:Re,settings:h,get photos(){return Y},addPhotoFiles:ca,get collection(){return U}};})();
