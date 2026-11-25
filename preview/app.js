(()=>{var kt=`#version 300 es
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
`,Ue=[],A=a=>Ue.push(a);A({fly:!0,id:"cathedral",name:"Fractal Cathedral",params:[{n:"Fold",min:.2,max:1.6,def:.85},{n:"Twist",min:0,max:1.5,def:.45},{n:"Scale",min:1.25,max:1.75,def:1.48},{n:"Glow",min:0,max:3,def:1.2},{n:"Flight",min:0,max:3,def:1},{n:"Tunnel",min:.2,max:1.4,def:.6},{n:"Pulse",min:0,max:2,def:1},{n:"Color Spread",min:0,max:2,def:.6}],stick:[0,1],code:`
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
}`});A({id:"nebula",name:"Nebula Tunnel",params:[{n:"Speed",min:0,max:4,def:1.2},{n:"Depth",min:.1,max:1.5,def:.55},{n:"Turbulence",min:.5,max:5,def:2.2},{n:"Ring Pulse",min:0,max:3,def:1.2},{n:"Stars",min:0,max:2,def:1},{n:"Spin",min:-1,max:1,def:.15},{n:"Brightness",min:.3,max:3,def:1.3},{n:"Petals",min:0,max:8,def:0}],stick:[2,1],code:`
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
}`});A({id:"julia",name:"Julia Bloom",params:[{n:"Seed Angle",min:0,max:6.283,def:2.1},{n:"Zoom",min:.4,max:4,def:1},{n:"Color Rate",min:.1,max:3,def:1},{n:"Audio Morph",min:0,max:2,def:.8},{n:"Trap Glow",min:0,max:3,def:1.2},{n:"Seed Radius",min:.6,max:.82,def:.7885,ms:.4},{n:"Swirl",min:-1,max:1,def:.1},{n:"Symmetry",min:1,max:8,def:1}],stick:[0,5],code:`
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
}`});A({fly:!0,id:"gyroid",name:"Gyroid Hyperspace",params:[{n:"Lattice",min:.8,max:5,def:2.2},{n:"Velocity",min:0,max:5,def:1.8},{n:"Thickness",min:.01,max:.3,def:.06},{n:"Glow",min:0,max:3,def:1.2},{n:"Detail",min:0,max:1,def:.4},{n:"Breath",min:0,max:2,def:1},{n:"Fog",min:.02,max:.3,def:.09},{n:"Hue Flow",min:0,max:2,def:.5}],stick:[0,2],code:`
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
}`});A({id:"chrome",name:"Liquid Chrome",params:[{n:"Blobs",min:2,max:8,def:6},{n:"Merge",min:.1,max:1.2,def:.55},{n:"Ripple",min:0,max:1,def:.35},{n:"Lights",min:2,max:20,def:7},{n:"Orbit",min:.3,max:2,def:1},{n:"Bass Swell",min:0,max:2,def:1},{n:"Iridescence",min:0,max:2,def:1},{n:"Env Bright",min:.3,max:2,def:1}],stick:[1,2],code:`
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
}`});A({landscape:!0,id:"horizon",name:"Neon Horizon",params:[{n:"Grid Speed",min:0,max:4,def:1.2},{n:"Sun Size",min:.1,max:.6,def:.32},{n:"Mountains",min:0,max:2,def:1},{n:"Grid Density",min:2,max:20,def:8},{n:"Terrain Warp",min:0,max:2,def:.6},{n:"Stars",min:0,max:2,def:1},{n:"Sun Stripes",min:0,max:24,def:10},{n:"Glow",min:.3,max:3,def:1.2}],stick:[4,2],code:`
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
}`});A({crisp:!0,id:"mandala",name:"Spectral Mandala",params:[{n:"Symmetry",min:3,max:24,def:12},{n:"Rings",min:1,max:10,def:6},{n:"Petal Size",min:0,max:1,def:.5},{n:"Line Width",min:.5,max:4,def:1.5},{n:"Spin",min:-1,max:1,def:.12},{n:"Wave Ring",min:0,max:2,def:1},{n:"Lace",min:0,max:2,def:1},{n:"Zoom",min:.5,max:2.5,def:1}],stick:[0,2],code:`
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
}`});A({id:"silk",name:"Silk Warp",params:[{n:"Scale",min:.5,max:6,def:2.2},{n:"Warp",min:0,max:3,def:1.2},{n:"Color Rate",min:.2,max:3,def:1.1},{n:"Flow",min:0,max:2,def:.6},{n:"Sheen",min:0,max:3,def:1.2},{n:"Bass Warp",min:0,max:2,def:1},{n:"Contrast",min:.5,max:3,def:1.4},{n:"Marble",min:0,max:1,def:0}],stick:[1,0],code:`
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
}`});A({id:"apollo",name:"Apollonian Dream",params:[{n:"Inversion",min:1,max:1.5,def:1.18,ms:.35},{n:"Orbit Speed",min:0,max:2,def:.6},{n:"Glow",min:0,max:3,def:1},{n:"Color Rate",min:.2,max:4,def:1.5},{n:"Distance",min:.5,max:3,def:1.4},{n:"Bass Breathe",min:0,max:1,def:.4},{n:"Fog",min:0,max:1,def:.3},{n:"Light",min:.3,max:2,def:1}],stick:[0,4],code:`
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
}`});A({id:"voronoi",name:"Stained Voronoi",params:[{n:"Cells",min:2,max:20,def:6},{n:"Motion",min:0,max:2,def:.7},{n:"Lead Width",min:0,max:.2,def:.05},{n:"Edge Glow",min:0,max:3,def:1.2},{n:"Audio Light",min:0,max:3,def:1.5},{n:"Layers",min:0,max:1,def:.5},{n:"Swirl",min:0,max:2,def:.4},{n:"Facets",min:0,max:1,def:.6}],stick:[0,6],code:`
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
}`});A({id:"wavefield",name:"Neon Wavefield",params:[{n:"Scroll",min:0,max:2,def:.35},{n:"Peak Height",min:0,max:2,def:1},{n:"Line Glow",min:.3,max:3,def:1.2},{n:"Spread",min:.2,max:1.5,def:.6},{n:"Wave Mix",min:0,max:1,def:.3},{n:"Fill",min:0,max:1,def:.85},{n:"Hue Depth",min:0,max:2,def:.8},{n:"Horizon",min:-.3,max:.3,def:.05}],stick:[1,3],code:`
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
}`});A({id:"starcore",name:"Star Core",params:[{n:"Plasma Scale",min:.5,max:5,def:2},{n:"Churn",min:0,max:3,def:1},{n:"Filaments",min:.2,max:3,def:1.2},{n:"Corona",min:0,max:3,def:1.2},{n:"Rays",min:0,max:3,def:1},{n:"Bass Flare",min:0,max:2,def:1},{n:"Core Heat",min:0,max:3,def:1.3},{n:"Size",min:.5,max:1.6,def:1}],stick:[0,3],code:`
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
}`});A({ss:2,id:"flower",name:"Flower of Life",params:[{n:"Lattice Scale",min:1,max:8,def:3},{n:"Rotation",min:-1,max:1,def:.08},{n:"Metatron",min:0,max:2,def:1},{n:"Line Width",min:.5,max:4,def:1.4},{n:"Layer Count",min:1,max:5,def:3},{n:"Bloom Pulse",min:0,max:2,def:1},{n:"Fill",min:0,max:1,def:.35},{n:"Depth Drift",min:0,max:2,def:.6}],stick:[0,7],code:`
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
}`});A({ss:2,id:"fall",name:"Endless Fall",params:[{n:"Fall Speed",min:-2,max:3,def:.8},{n:"Spiral",min:0,max:2,def:.6},{n:"Arms",min:1,max:12,def:5},{n:"Tile Detail",min:1,max:6,def:3},{n:"Glow",min:0,max:3,def:1.2},{n:"Audio Rings",min:0,max:3,def:1.2},{n:"Fractal Bite",min:0,max:1,def:.5},{n:"Twist Pulse",min:0,max:2,def:.6}],stick:[1,2],code:`
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
}`});A({ss:2,id:"hyper",name:"Hyperbolic Temple",params:[{n:"P (sides)",min:3,max:8,def:5},{n:"Q (meet)",min:3,max:8,def:4},{n:"Drift",min:0,max:2,def:.5},{n:"Line Glow",min:0,max:3,def:1.2},{n:"Cell Color",min:0,max:2,def:1},{n:"Spin",min:-1,max:1,def:.1},{n:"Disk Zoom",min:.6,max:1.6,def:1},{n:"Audio Fill",min:0,max:3,def:1.2}],stick:[2,6],code:`
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
}`});A({ss:2,id:"burst",name:"Supernova Burst",params:[{n:"Shards",min:20,max:200,def:90},{n:"Burst Force",min:0,max:3,def:1.3},{n:"Shell Count",min:1,max:6,def:3},{n:"Trail",min:0,max:2,def:1},{n:"Core",min:0,max:3,def:1.2},{n:"Spin",min:-1,max:1,def:.1},{n:"Shimmer",min:0,max:2,def:1},{n:"Warp",min:0,max:2,def:.5}],stick:[1,7],code:`
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
}`});A({ss:2,id:"fold",name:"Origami Fold",params:[{n:"Fold Angle",min:0,max:3.14,def:.3},{n:"Iterations",min:3,max:14,def:10},{n:"Scale",min:1.1,max:1.8,def:1.33,ms:.5},{n:"Offset",min:.3,max:1.2,def:.7},{n:"Glow",min:.3,max:3,def:1},{n:"Fold Pulse",min:0,max:2,def:1},{n:"Color Rate",min:0,max:3,def:1},{n:"Zoom",min:.3,max:4,def:1}],stick:[0,3],code:`
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
}`,Ke=(a,e)=>[a,{n:"Orbit",min:0,max:1,def:.25},{n:"Glow",min:0,max:3,def:1},{n:"Color Rate",min:.2,max:4,def:1.2},{n:"Distance",min:1.6,max:7,def:4,ms:.3},{n:"Audio Morph",min:0,max:2,def:.8},{n:"Rim",min:0,max:3,def:1.2},e];A({camSens:.45,space:!0,id:"bulb",name:"Mandelbulb Shrine",params:Ke({n:"Power",min:2,max:12,def:8,ms:.1},{n:"Detail",min:4,max:10,def:7}),stick:[0,4],code:Ye(`
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
}`,"1.25")});A({camSens:.45,space:!0,id:"qjulia",name:"Julia Organism",params:Ke({n:"Mutation",min:0,max:1,def:.5,ms:.15},{n:"Drift",min:0,max:2,def:.6}),stick:[0,4],code:Ye(`
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
}`,"1.65")});A({camSens:.45,space:!0,id:"jbulb",name:"Living Bulb",params:Ke({n:"Base Power",min:3,max:10,def:6,ms:.08},{n:"Morph Range",min:0,max:3,def:2,ms:.2}),stick:[0,7],code:Ye(`
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
}`,"1.3")});A({camSens:.45,space:!0,id:"kifs",name:"Crystal Reliquary",params:Ke({n:"Twist",min:0,max:1,def:.35,ms:.25},{n:"Facet",min:.2,max:1,def:.55,ms:.3}),stick:[0,7],code:Ye(`
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
}`,"3.4")});A({fly:!0,id:"hextunnel",name:"Hex Temple",params:[{n:"Speed",min:0,max:4,def:1.4},{n:"Hex Size",min:2,max:14,def:6},{n:"Eyes",min:0,max:2,def:1},{n:"Glow",min:0,max:3,def:1.2},{n:"Warp",min:0,max:2,def:.6},{n:"Twist",min:-2,max:2,def:.4},{n:"Depth Fade",min:0,max:2,def:1},{n:"Glyphs",min:0,max:2,def:1}],stick:[5,4],code:`
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
}`});A({ss:2,id:"yantra",name:"Sri Yantra",params:[{n:"Triangles",min:3,max:12,def:9},{n:"Breathing",min:0,max:2,def:1},{n:"Lotus Petals",min:4,max:24,def:16},{n:"Line Width",min:.5,max:4,def:1.5},{n:"Spin",min:-1,max:1,def:.05},{n:"Halo",min:0,max:3,def:1.2},{n:"Fill Glow",min:0,max:2,def:.6},{n:"Zoom",min:.5,max:2,def:1}],stick:[1,6],code:`
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
}`});A({fly:!0,id:"menger",name:"Menger Crystal",params:[{n:"Speed",min:0,max:3,def:.8},{n:"Hole Size",min:.8,max:1.2,def:1,ms:.5},{n:"Glow",min:0,max:3,def:1.2},{n:"Color Rate",min:.2,max:3,def:1},{n:"Twist",min:0,max:1,def:.3},{n:"Bass Shake",min:0,max:2,def:.6},{n:"Fog",min:0,max:1,def:.4},{n:"Iterations",min:2,max:5,def:4}],stick:[4,1],code:`
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
}`});A({landscape:!0,id:"aurora",name:"Aurora Ocean",params:[{n:"Curtains",min:1,max:4,def:3},{n:"Flow",min:0,max:3,def:1},{n:"Height",min:.4,max:1.6,def:1},{n:"Brightness",min:.3,max:3,def:1.3},{n:"Reflection",min:0,max:1,def:.75},{n:"Waves",min:0,max:2,def:1},{n:"Stars",min:0,max:2,def:1},{n:"Audio Fold",min:0,max:3,def:1.2}],stick:[1,7],code:`
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
}`});A({id:"flux",name:"Flux",selfFeedback:!0,params:[{n:"Wave Size",min:.3,max:2,def:1},{n:"Wave Glow",min:.3,max:3,def:1},{n:"Flow Strength",min:0,max:3,def:1},{n:"Persistence",min:.8,max:.995,def:.965},{n:"Morph Time",min:4,max:40,def:14},{n:"Colour Flow",min:0,max:3,def:1},{n:"Map Spread",min:.2,max:3,def:1},{n:"Beat Sparks",min:0,max:2,def:1}],stick:[2,0],code:`
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
}`});var oi=`
uniform sampler2D uPhoto; uniform float uPhotoAR;
// photo space: the photo spans y in [-.5,.5] and x in [-AR/2, AR/2]; beyond that it mirrors forever
vec2 phUV(vec2 p){ return vec2(p.x/uPhotoAR+.5, .5-p.y); }
vec3 photo(vec2 p){ return texture(uPhoto, phUV(p)).rgb; }
vec3 photoL(vec2 p, float lod){ return textureLod(uPhoto, phUV(p), lod).rgb; }
float lum(vec3 c){ return dot(c, vec3(.299,.587,.114)); }
vec3 sat(vec3 c, float s){ float l=lum(c); return max(mix(vec3(l), c, s), 0.); }
// screen -> photo space so the photo just covers the screen
vec2 cover(vec2 uv){ float sAR=uRes.x/uRes.y; return uv/max(sAR/uPhotoAR, 1.); }
`,de=a=>A({...a,photo:!0,code:oi+a.code});de({id:"ph_mandala",name:"Photo Mandala",desc:"Slices of your photo mirrored into a turning kaleidoscope",params:[{n:"Segments",min:3,max:16,def:8,ms:.25},{n:"Spin",min:0,max:1,def:.3},{n:"Zoom",min:.3,max:3,def:1.1},{n:"Pan X",min:-1,max:1,def:0},{n:"Pan Y",min:-1,max:1,def:0},{n:"Bass Breath",min:0,max:2,def:1},{n:"Seam Glow",min:0,max:2,def:.8},{n:"Inner Swirl",min:0,max:2,def:.5}],stick:[3,4],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)*rot(uCam.x*.5);
  float r=length(uv), a=atan(uv.y,uv.x)+uTime*.12*P1;
  float N=floor(P0+.5), seg=TAU/N;
  float sa=mod(a,seg); sa=min(sa,seg-sa);                       // mirror fold -> seamless wedges
  float rr=r/P2*(1.-uBass*.12*P5)-uTime*.025*P1;                 // endless outward flow (photo mirrors beyond its edges)
  vec2 q=vec2(cos(sa),sin(sa))*rr;
  q*=rot(r*P7*sin(uTime*.17)*1.5);
  q+=vec2(P3,P4)*.45+uCam.y*vec2(.2,0);
  vec3 col=sat(photo(q),1.15);
  float sd=sa*r;                                                 // distance to a fold line
  col+=pal(r*.6+uTime*.04)*glowLine(sd,.0025)*.05*P6*(.35+uBeat*1.2+uHigh);
  float ring=exp(-abs(r-uSinceBeat*.8)*22.)*exp(-uSinceBeat*2.2)*P6;
  col+=pal(.25+r)*ring*.5;
  c=vec4(col*(.92+uBass*.18*P5),1);
}`});de({id:"ph_glass",name:"Photo Stained Glass",desc:"Your photo rebuilt as glowing glass panes with lead lines that pulse on the beat",params:[{n:"Panes",min:5,max:40,def:13,ms:.25},{n:"Drift",min:0,max:2,def:.5},{n:"Lead Width",min:.02,max:.25,def:.12},{n:"Lead Glow",min:0,max:2,def:1},{n:"Breathe",min:0,max:2,def:.6},{n:"Photo Detail",min:0,max:1,def:.3},{n:"Pane Light",min:0,max:2,def:1},{n:"Color Boost",min:.5,max:2.5,def:1.5}],stick:[0,5],code:`
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
  c=vec4(mix(col,leadC,lead),1);
}`});de({id:"ph_zoom",name:"Infinite Photo",desc:"Your photo framed inside itself forever, spiraling inward",params:[{n:"Frame Ratio",min:1.4,max:4,def:2.2,ms:.15},{n:"Zoom Speed",min:0,max:2,def:.7},{n:"Twist",min:-1,max:1,def:.25,ms:.3},{n:"Frame Glow",min:0,max:2,def:1},{n:"Size",min:.3,max:.5,def:.43},{n:"Bass Kick",min:0,max:2,def:1},{n:"Color Shift",min:0,max:1,def:.2},{n:"Rock",min:0,max:1,def:.3}],stick:[2,0],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)*rot(sin(uTime*.21)*.15*P7+uCam.x*.4);
  float k=P0, tw=P2*1.2;
  float t=uTime*.12*P1+uBass*.04*P5;
  float ft=fract(t);
  vec2 q=uv/P4;                                          // frame: |x|<=AR*.5, |y|<=.5
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
  c=vec4(col,1);
}`});de({id:"ph_neon",name:"Neon Trace",desc:"The edges in your photo redrawn as glowing neon lines",params:[{n:"Line Gain",min:.5,max:6,def:2.6},{n:"Threshold",min:0,max:.4,def:.08},{n:"Line Width",min:.5,max:3,def:1.2},{n:"Color Flow",min:0,max:2,def:.6},{n:"Photo Ghost",min:0,max:.6,def:.12},{n:"Scan Beam",min:0,max:2,def:1},{n:"Flicker",min:0,max:2,def:.7},{n:"Ripple",min:0,max:2,def:.6}],stick:[0,4],code:`
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
  col*=1.+scan*1.5+exp(-uSinceBeat*3.)*.6;
  col+=photo(uv)*P4*(.6+uVol*.5);
  c=vec4(col,1);
}`});de({id:"ph_land",name:"Photo Terrain",desc:"Brightness becomes height: fly low over a landscape made of your photo",fly:!0,params:[{n:"Height",min:.2,max:2,def:.9},{n:"Speed",min:0,max:2,def:.6},{n:"Scale",min:.1,max:1,def:.35},{n:"Smooth",min:1,max:4,def:2.4},{n:"Spectrum Lift",min:0,max:2,def:.8},{n:"Sky Glow",min:0,max:2,def:1},{n:"Altitude",min:.3,max:1.6,def:.85},{n:"Banking",min:0,max:1,def:.5}],stick:[0,6],code:`
float terrH(vec2 x){
  float h=lum(photoL(x*P2,P3))*P0;
  h+=fft(clamp(abs(x.x)*.05,0.,1.))*.35*P4*smoothstep(.5,2.5,abs(x.x));
  return h;
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  float tt=uTime*.6*P1;
  vec3 ro=vec3(sin(tt*.3)*1.5, P6+P0*.6, tt*2.);
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
  c=vec4(col,1);
}`});de({id:"ph_liquid",name:"Liquid Photo",desc:"Your photo melts and swirls like paint in water, pulsing with the bass",params:[{n:"Melt",min:0,max:1.2,def:.6},{n:"Flow",min:0,max:2,def:.6},{n:"Scale",min:.5,max:4,def:1.6},{n:"Bass Wobble",min:0,max:2,def:1},{n:"Color Bleed",min:0,max:1,def:.35},{n:"Tide",min:0,max:1,def:.5},{n:"Oil Sheen",min:0,max:1.5,def:.5},{n:"Zoom",min:.6,max:1.6,def:1}],stick:[0,2],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=cover(UV(fc))/P7;
  float t=uTime*.12*P1;
  float tide=mix(1.,.7+.3*sin(uTime*.08),P5);
  float amt=P0*.32*tide+uBass*.05*P3;
  vec2 w=vec2(fbm(uv*P2+t), fbm(uv*P2-t+5.2))-.5;
  vec2 w2=vec2(fbm(uv*P2*1.6+w*3.+t*1.3), fbm(uv*P2*1.6+w*3.-t+1.7))-.5;
  vec2 q=uv+w2*amt*2.+uCam.xy*.1;
  vec3 col=photo(q);
  vec3 bled=photoL(q+w*amt,3.);
  col=mix(col,sat(bled,1.6),P4*smoothstep(.1,.6,length(w2)*2.));
  float sheen=pow(.5+.5*sin(dot(w2,vec2(30.,22.))+uTime),6.);
  col+=pal(dot(w2,vec2(2.,3.))+uTime*.03)*sheen*.25*P6*(.5+uHigh);
  c=vec4(col*(.95+uBass*.12),1);
}`});de({id:"ph_tunnel",name:"Photo Tunnel",desc:"Your photo wrapped around the walls of a tunnel you fly through",fly:!0,params:[{n:"Depth",min:.1,max:1,def:.35},{n:"Speed",min:0,max:2,def:.7},{n:"Wraps",min:1,max:6,def:2,ms:.25},{n:"Twist",min:-1,max:1,def:.2},{n:"Sway",min:0,max:1,def:.4},{n:"Core Glow",min:0,max:2,def:1},{n:"Rings",min:0,max:2,def:.8},{n:"Fog",min:0,max:1,def:.5}],stick:[3,2],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  uv+=vec2(sin(uTime*.31),cos(uTime*.23))*.08*P4+uCam.xy*vec2(-.3,.3);
  float r=length(uv), a=atan(uv.y,uv.x);
  float z=P0/max(r,1e-3);
  float zz=z+uTime*.6*P1*(1.+uDrive);
  float ang=abs(a+zz*P3*.15)/PI;                      // mirrored angle: no seam
  vec2 tc=vec2((ang-.5)*uPhotoAR*P2*.5, fract(zz*.3)*2.-1.);
  tc.y=abs(tc.y)-.5;                                  // mirror along depth too
  vec3 col=sat(photo(tc),1.1);
  float ring=exp(-abs(fract(zz*.5-uSinceBeat*.0)-.5)*14.)*P6*(.2+uBeat);
  col+=pal(zz*.05)*ring*.4;
  col*=mix(1.,smoothstep(0.,.5,r*1.6),P7);
  col+=pal(.1+uTime*.02)*exp(-r*16.)*P5*(.35+uBass*.6);
  c=vec4(col,1);
}`});de({id:"ph_dots",name:"Halftone Pulse",desc:"Your photo printed as dots that swell with the bass",crisp:!0,params:[{n:"Dots",min:20,max:160,def:70,ms:.2},{n:"Angle Drift",min:0,max:1,def:.3},{n:"Dot Size",min:.4,max:1.4,def:.95},{n:"Bass Swell",min:0,max:2,def:1},{n:"Tint",min:0,max:1,def:.25},{n:"Wave",min:0,max:2,def:.8},{n:"Color Boost",min:.5,max:2.5,def:1.5},{n:"Glow",min:0,max:1,def:.4}],stick:[0,4],code:`
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
  float rad=sqrt(clamp(l,0.,1.))*.5*P2*(1.+uBass*.35*P3+wave);
  float d=length(f);
  float aa=fwidth(d)*1.2;
  float dot1=smoothstep(rad+aa,rad-aa,d);
  vec3 dc=mix(pc,pal(l*.6+uTime*.03)*(.4+l),P4);
  vec3 col=dc*dot1*1.15;
  col+=dc*exp(-max(d-rad,0.)*12.)*.25*P7;
  c=vec4(col,1);
}`});var Re=Ue,Ce=Ue.filter(a=>!a.photo),Ze=Ue.filter(a=>a.photo),q=Object.fromEntries(Ue.map(a=>[a.id,a])),re=`#version 300 es
in vec2 aPos; void main(){ gl_Position=vec4(aPos,0,1); }`,fa=`#version 300 es
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
}`,ma=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes; out vec4 fragColor;
void main(){ vec2 uv=gl_FragCoord.xy/uRes; vec3 c=texture(uTex,uv).rgb; float l=max(c.r,max(c.g,c.b)); fragColor=vec4(c*smoothstep(.75,1.5,l),1); }`,da=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes, uDir; out vec4 fragColor;
void main(){ vec2 uv=gl_FragCoord.xy/uRes; vec2 o=uDir/uRes; vec3 c=texture(uTex,uv).rgb*.227;
  c+=(texture(uTex,uv+o*1.38).rgb+texture(uTex,uv-o*1.38).rgb)*.316;
  c+=(texture(uTex,uv+o*3.23).rgb+texture(uTex,uv-o*3.23).rgb)*.07; fragColor=vec4(c,1); }`,pa=`#version 300 es
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
}`,ha=`#version 300 es
precision highp float; uniform sampler2D uSmall, uPrev; uniform float uRate; out vec4 fragColor;
void main(){ vec3 c=textureLod(uSmall, vec2(.5), 10.).rgb; float l=mix(dot(c,vec3(.3,.59,.11)), max(c.r,max(c.g,c.b)), .55); float pl=texture(uPrev, vec2(.5)).r; fragColor=vec4(mix(pl,l,uRate),0,0,1); }`,va=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes; out vec4 fragColor;
void main(){ fragColor=texture(uTex, gl_FragCoord.xy/uRes); }`;var Je=class{constructor(e){this.canvas=e;let t=this.gl=e.getContext("webgl2",{antialias:!1,alpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"});if(!t)throw new Error("WebGL2 is not available on this system.");this.halfFloat=!!t.getExtension("EXT_color_buffer_float"),t.getExtension("OES_texture_float_linear");let i=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,i),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),this.progs={},this.errors={},this.post={feedback:this.program(re,fa),bright:this.program(re,ma),blur:this.program(re,da),final:this.program(re,pa),blit:this.program(re,va),adapt:this.program(re,ha)},this.audioTex=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.audioTex),t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.texImage2D(t.TEXTURE_2D,0,t.R8,512,2,0,t.RED,t.UNSIGNED_BYTE,null),this.texParams(t.LINEAR,t.CLAMP_TO_EDGE),this.milkTex=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.milkTex),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,0,255])),this.texParams(t.LINEAR,t.CLAMP_TO_EDGE),this.photoTex=t.createTexture(),this.photoAR=1,this.photoId=null,t.bindTexture(t.TEXTURE_2D,this.photoTex),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([40,20,60,255])),this.aniso=t.getExtension("EXT_texture_filter_anisotropic"),this.scale=.75,this.fbIdx=0,this.finIdx=0,this.lumSmall=this.makeTarget(64,36),t.bindTexture(t.TEXTURE_2D,this.lumSmall.tex),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR_MIPMAP_LINEAR),t.generateMipmap(t.TEXTURE_2D),this.adapt=[this.makeTarget(1,1),this.makeTarget(1,1)],this.adIdx=0,this.W=0,this.H=0}texParams(e,t){let i=this.gl;i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,e),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,e),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,t),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,t)}shader(e,t){let i=this.gl,o=i.createShader(e);if(i.shaderSource(o,t),i.compileShader(o),!i.getShaderParameter(o,i.COMPILE_STATUS)){let n=i.getShaderInfoLog(o);throw i.deleteShader(o),new Error(n)}return o}program(e,t){let i=this.gl,o=i.createProgram();if(i.attachShader(o,this.shader(i.VERTEX_SHADER,e)),i.attachShader(o,this.shader(i.FRAGMENT_SHADER,t)),i.bindAttribLocation(o,0,"aPos"),i.linkProgram(o),!i.getProgramParameter(o,i.LINK_STATUS))throw new Error(i.getProgramInfoLog(o));let n={},r=i.getProgramParameter(o,i.ACTIVE_UNIFORMS);for(let l=0;l<r;l++){let c=i.getActiveUniform(o,l);n[c.name.replace(/\[0\]$/,"")]=i.getUniformLocation(o,c.name)}return{p:o,u:n}}sceneProg(e){let t=Re.find(r=>r.id===e),i=Math.min(t.ss||1,this.ssMax??4),o=i>1?e+"@"+i:e;if(this.progs[o])return this.progs[o];let n=kt.replace(`#version 300 es
`,`#version 300 es
#define SS `+i+`
`)+t.code;try{this.progs[o]=this.program(re,n)}catch(r){this.errors[e]=String(r),console.error("Scene",e,r),this.progs[o]=null}return this.progs[o]}mapProg(e){let t=e+":map";if(this.progs[t]!==void 0)return this.progs[t];let i=Re.find(o=>o.id===e);try{this.progs[t]=this.program(re,kt+i.map)}catch(o){this.errors[t]=String(o),console.error("Map",e,o),this.progs[t]=null}return this.progs[t]}precompile(e,t){let i=0,o=()=>{if(i>=e.length)return t&&t();this.sceneProg(e[i++]),setTimeout(o,0)};o()}makeTarget(e,t,i=!0){let o=this.gl,n=o.createTexture();o.bindTexture(o.TEXTURE_2D,n),i&&this.halfFloat?o.texImage2D(o.TEXTURE_2D,0,o.RGBA16F,e,t,0,o.RGBA,o.HALF_FLOAT,null):o.texImage2D(o.TEXTURE_2D,0,o.RGBA8,e,t,0,o.RGBA,o.UNSIGNED_BYTE,null),this.texParams(o.LINEAR,o.CLAMP_TO_EDGE);let r=o.createFramebuffer();return o.bindFramebuffer(o.FRAMEBUFFER,r),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,n,0),o.clearColor(0,0,0,1),o.clear(o.COLOR_BUFFER_BIT),{tex:n,fb:r,w:e,h:t}}freeTarget(e){e&&(this.gl.deleteTexture(e.tex),this.gl.deleteFramebuffer(e.fb))}resize(e,t,i){if(e===this.W&&t===this.H&&i===this.scaleUsed)return;let o=this.gl,n=Math.max(64,Math.round(e*i)),r=Math.max(64,Math.round(t*i)),l=[this.sceneT,...this.fb||[],...this.fin||[],this.bA,this.bB],c=this.fb;this.sceneT=this.makeTarget(n,r),this.fb=[this.makeTarget(n,r),this.makeTarget(n,r)],c&&this.drawTo(this.fb[this.fbIdx],this.post.blit,{uTex:c[this.fbIdx].tex}),!this.fin||e!==this.W||t!==this.H?((this.fin||[]).forEach(x=>this.freeTarget(x)),this.fin=[this.makeTarget(e,t,!1),this.makeTarget(e,t,!1)]):l.splice(l.indexOf(this.fin[0]),2);let d=Math.max(32,Math.round(n/4)),h=Math.max(32,Math.round(r/4));this.bA=this.makeTarget(d,h),this.bB=this.makeTarget(d,h),l.forEach(x=>{x&&!this.fin.includes(x)&&this.freeTarget(x)}),this.W=e,this.H=t,this.scaleUsed=i,this.sw=n,this.sh=r}drawTo(e,t,i,o){let n=this.gl;n.bindFramebuffer(n.FRAMEBUFFER,e?e.fb:null);let r=e?e.w:this.W,l=e?e.h:this.H;n.viewport(0,0,r,l),n.useProgram(t.p);let c=0;for(let[d,h]of Object.entries(i)){let x=t.u[d];x!=null&&(h instanceof WebGLTexture?(n.activeTexture(n.TEXTURE0+c),n.bindTexture(n.TEXTURE_2D,h),n.uniform1i(x,c++)):typeof h=="number"?n.uniform1f(x,h):h.length===2?n.uniform2fv(x,h):h.length===3?n.uniform3fv(x,h):h.length===4&&n.uniform4fv(x,h))}t.u.uRes,t.u.uRes&&n.uniform2f(t.u.uRes,r,l),n.drawArrays(n.TRIANGLES,0,3)}setPhoto(e,t){let i=this.gl;i.bindTexture(i.TEXTURE_2D,this.photoTex),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,e),i.generateMipmap(i.TEXTURE_2D),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR_MIPMAP_LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.MIRRORED_REPEAT),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.MIRRORED_REPEAT),this.aniso&&i.texParameterf(i.TEXTURE_2D,this.aniso.TEXTURE_MAX_ANISOTROPY_EXT,8),this.photoAR=e.width/e.height,this.photoId=t}uploadAudio(e){let t=this.gl;t.bindTexture(t.TEXTURE_2D,this.audioTex),t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.texSubImage2D(t.TEXTURE_2D,0,0,0,512,2,t.RED,t.UNSIGNED_BYTE,e)}uploadMilk(e){let t=this.gl;t.bindTexture(t.TEXTURE_2D,this.milkTex),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!0),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1)}snapshot(){this.transTex=this.fin[this.finIdx].tex,this.finIdx^=1}frame(e){let t=this.post;if(e.engine==="scene"){let h=Re.find(y=>y.id===e.scene),x=this.sceneProg(e.scene);if(x&&h&&h.selfFeedback){(!this.selfT||this.selfT[0].w!==this.sceneT.w||this.selfT[0].h!==this.sceneT.h)&&((this.selfT||[]).forEach(L=>this.freeTarget(L)),this.selfT=[this.makeTarget(this.sceneT.w,this.sceneT.h),this.makeTarget(this.sceneT.w,this.sceneT.h)],this.selfIdx=0);let y=this.selfT[this.selfIdx],T=this.selfT[this.selfIdx^1];this.drawTo(T,x,{...e.sceneU,uSelf:y.tex}),this.selfIdx^=1;let M=this.mapProg(e.scene);M&&this.drawTo(this.sceneT,M,{...e.sceneU,uSelf:T.tex})}else x&&this.drawTo(this.sceneT,x,e.sceneU)}let i=e.engine==="milk"?this.milkTex:this.sceneT.tex,o=this.fb[this.fbIdx],n=this.fb[this.fbIdx^1];this.drawTo(n,t.feedback,{...e.fbU,uScene:i,uPrev:o.tex,uMilk:this.milkTex}),this.fbIdx^=1,this.drawTo(this.bA,t.bright,{uTex:n.tex});for(let h=0;h<2;h++)this.drawTo(this.bB,t.blur,{uTex:this.bA.tex,uDir:[1+h,0]}),this.drawTo(this.bA,t.blur,{uTex:this.bB.tex,uDir:[0,1+h]});this.drawTo(this.lumSmall,t.blit,{uTex:n.tex});let r=this.gl;r.bindTexture(r.TEXTURE_2D,this.lumSmall.tex),r.generateMipmap(r.TEXTURE_2D);let l=this.adapt[this.adIdx],c=this.adapt[this.adIdx^1];this.drawTo(c,t.adapt,{uSmall:this.lumSmall.tex,uPrev:l.tex,uRate:e.adaptRate??.04}),this.adIdx^=1;let d=this.fin[this.finIdx];this.drawTo(d,t.final,{...e.finU,uTex:n.tex,uBloom:this.bA.tex,uTrans:this.transTex||n.tex,uAdapt:c.tex}),this.drawTo(null,t.blit,{uTex:d.tex})}};var Qe=class{constructor(){this.ctx=new(window.AudioContext||window.webkitAudioContext)({latencyHint:"interactive"}),this.el=new Audio,this.el.crossOrigin="anonymous",this.el.preload="auto",this.elSrc=this.ctx.createMediaElementSource(this.el),this.input=this.ctx.createGain(),this.analyser=this.ctx.createAnalyser(),this.analyser.fftSize=2048,this.analyser.smoothingTimeConstant=.55,this.out=this.ctx.createGain(),this.elSrc.connect(this.input),this.input.connect(this.analyser),this.elSrc.connect(this.out),this.out.connect(this.ctx.destination),this.freq=new Uint8Array(1024),this.time=new Uint8Array(2048),this.tex=new Uint8Array(512*2),this.bass=0,this.mid=0,this.high=0,this.vol=0,this.beat=0,this.beatCount=0,this.peak={b:.2,m:.2,h:.2,v:.2},this.bassAvg=0,this.lastBeat=0,this.drop=0,this.playlist=[],this.index=-1,this.shuffle=!1,this.repeat="all",this.mode="player",this.stream=null,this.streamSrc=null,this.onchange=()=>{},this.el.addEventListener("ended",()=>this.next(!0)),this.el.addEventListener("play",()=>this.onchange()),this.el.addEventListener("pause",()=>this.onchange());let e=this.ctx.sampleRate/2;this.binMap=new Float32Array(512);for(let t=0;t<512;t++){let i=30*Math.pow(533.3333333333334,t/511);this.binMap[t]=Math.min(1023,i/e*1024)}}async setOutput(e){try{return this.ctx.setSinkId?await this.ctx.setSinkId(e==="default"?"":e):this.el.setSinkId&&await this.el.setSinkId(e),!0}catch(t){return console.warn(t),!1}}resume(){this.ctx.state!=="running"&&this.ctx.resume()}addTracks(e){let t=this.playlist.length===0;this.playlist.push(...e),t&&e.length&&this.play(0),this.onchange()}remove(e){this.playlist.splice(e,1),e<this.index?this.index--:e===this.index&&(this.index=Math.min(this.index,this.playlist.length-1),this.index>=0?this.play(this.index):this.el.pause()),this.onchange()}clear(){this.playlist=[],this.index=-1,this.el.pause(),this.el.removeAttribute("src"),this.onchange()}async play(e){if(!(e<0||e>=this.playlist.length)){this.useSource("player"),this.index=e,this.el.src=this.playlist[e].url,this.resume();try{await this.el.play()}catch(t){console.warn(t)}this.onchange()}}toggle(){if(this.resume(),this.mode!=="player"&&this.useSource("player"),this.index<0&&this.playlist.length)return this.play(0);this.el.paused?this.el.play():this.el.pause()}next(e){if(!this.playlist.length)return;if(this.repeat==="one"&&e)return this.play(this.index);let t=this.shuffle?Math.floor(Math.random()*this.playlist.length):this.index+1;if(t>=this.playlist.length){if(this.repeat==="off"&&e)return;t=0}this.play(t)}prev(){if(this.el.currentTime>3){this.el.currentTime=0;return}this.play((this.index-1+this.playlist.length)%Math.max(1,this.playlist.length))}get current(){return this.playlist[this.index]}stopStream(){this.stream&&(this.stream.getTracks().forEach(e=>e.stop()),this.stream=null),this.streamSrc&&(this.streamSrc.disconnect(),this.streamSrc=null)}useSource(e){e==="player"&&this.mode!=="player"&&(this.stopStream(),this.mode="player",this.onchange())}async useLoopback(){this.resume();let e=await navigator.mediaDevices.getDisplayMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1},video:!0,systemAudio:"include",selfBrowserSurface:"exclude"});if(e.getVideoTracks().forEach(t=>t.stop()),!e.getAudioTracks().length)throw new Error("No audio was shared \u2014 pick a tab or \u201CEntire screen\u201D and turn on \u201CShare audio\u201D.");this.attachStream(e,"loopback")}async useMic(){this.resume();let e=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});this.attachStream(e,"mic")}attachStream(e,t){this.el.pause(),this.stopStream(),this.stream=e,this.streamSrc=this.ctx.createMediaStreamSource(e),this.streamSrc.connect(this.input),this.mode=t,this.onchange()}update(e,t=1,i={}){let o=i.sens??1,n=i.gB??1,r=i.gM??1,l=i.gH??1,c=this.analyser;c.getByteFrequencyData(this.freq),c.getByteTimeDomainData(this.time);let d=this.ctx.sampleRate/2,h=this.freq,x=(C,F)=>{let U=Math.max(1,Math.floor(C/d*1024)),Z=Math.max(U+1,Math.floor(F/d*1024)),ee=0;for(let qe=U;qe<Z;qe++)ee+=h[qe];return ee/(Z-U)/255},y=x(25,160)*n,T=x(160,2200)*r,M=x(2200,12e3)*l,L=0;for(let C=0;C<2048;C+=4){let F=(this.time[C]-128)/128;L+=F*F}L=Math.sqrt(L/512);let P=this.peak,V=Math.pow(.25,e/8);P.b=Math.max(y,P.b*V,.05),P.m=Math.max(T,P.m*V,.05),P.h=Math.max(M,P.h*V,.03),P.v=Math.max(L,P.v*V,.02);let K=(C,F,U,Z)=>C+(F-C)*(1-Math.exp(-e*(F>C?U:Z))),O=Math.min(2.5,t);this.bass=K(this.bass,Math.pow(y/P.b,1.6)*O,30,8),this.mid=K(this.mid,Math.pow(T/P.m,1.4)*O,20,6),this.high=K(this.high,Math.pow(M/P.h,1.3)*O,25,7),this.vol=K(this.vol,L/P.v*O,15,4),this.bassAvg=this.bassAvg+(y-this.bassAvg)*(1-Math.exp(-e*2));let b=1-Math.exp(-e*1.4);this.bMean=(this.bMean??y)+(y-(this.bMean??y))*b;let R=(y-this.bMean)*(y-this.bMean);this.bVar=(this.bVar??.001)+(R-(this.bVar??.001))*b;let S=Math.sqrt(this.bVar),E=this.bMean+(1.25-o*.4)*S+.015,k=performance.now()/1e3;this.isBeat=!1,!this.above&&y>E&&y>.1&&k-this.lastBeat>.16?(this.lastBeat=k,this.beat=1,this.beatCount++,this.isBeat=!0,this.above=!0):this.above&&y<this.bMean+.3*S&&(this.above=!1),this.beat*=Math.exp(-e*7),this.drop=this.drop*Math.exp(-e*.5)+Math.max(0,y-this.bassAvg*1.6)*e*4;for(let C=0;C<512;C++){let F=this.binMap[C],U=Math.floor(F),Z=F-U,ee=h[U]*(1-Z)+h[Math.min(1023,U+1)]*Z;this.tex[C]=Math.min(255,ee*(1+C/512*.8))}for(let C=0;C<512;C++)this.tex[512+C]=this.time[C*2]}};var z={A:0,B:1,X:2,Y:3,LB:4,RB:5,LT:6,RT:7,BACK:8,START:9,L3:10,R3:11,UP:12,DOWN:13,LEFT:14,RIGHT:15,TOUCH:17},et=class{constructor(){this.prev=[],this.downAt=[],this.held=[],this.axes=[0,0,0,0],this.lt=0,this.rt=0,this.connected=!1,this.id="",this.deadzone=.14,this.style="xbox",this.lastInput=0,this.gp=null}poll(){let e=navigator.getGamepads?navigator.getGamepads():[],t=null;for(let T of e)if(T&&T.connected){t=T;break}this.hid&&this.hid.fresh&&(t=this.hid.asGamepad()),!t&&this.touch&&this.touch.active&&(t=this.touch.asGamepad()),this.gp=t;let i=this.connected;if(this.connected=!!t,this.justConnected=!i&&this.connected,!t){this.pressed=[],this.released=[];return}this.id=t.id,this.style=t.id==="Touch controls"?"touch":/054c|playstation|dualsense|dualshock/i.test(t.id)||/wireless controller/i.test(t.id)&&!/xbox|xinput|045e/i.test(t.id)?"ps":"xbox";let o=performance.now();this.pressed=[],this.released=[];let n=Math.min(t.buttons.length,18);for(let T=0;T<n;T++){let M=t.buttons[T],L=typeof M=="object"?M.value:M,P=typeof M=="object"&&M.pressed||L>.5;P&&!this.prev[T]&&(this.pressed[T]=!0,this.downAt[T]=o,this.held[T]=!1,this.lastInput=o),!P&&this.prev[T]&&(this.released[T]=!0),this.prev[T]=P}let r=T=>{let M=Math.abs(T);return M<this.deadzone?0:Math.sign(T)*((M-this.deadzone)/(1-this.deadzone))},l=t.axes,c=(T,M)=>{let L=Math.hypot(T,M);if(L<this.deadzone)return[0,0];let P=(L-this.deadzone)/(1-this.deadzone)/L;return[T*P,M*P]},[d,h]=c(l[0]||0,l[1]||0),[x,y]=c(l[2]||0,l[3]||0);this.axes=[d,h,x,y],this.lt=t.buttons[6]?t.buttons[6].value:0,this.rt=t.buttons[7]?t.buttons[7].value:0,Math.abs(d)+Math.abs(h)+Math.abs(x)+Math.abs(y)+this.lt+this.rt>.05&&(this.lastInput=o)}down(e){return!!this.prev[e]}tap(e){return!!this.pressed[e]}hold(e,t){return this.prev[e]&&!this.held[e]&&performance.now()-this.downAt[e]>t?(this.held[e]=!0,!0):!1}shortRelease(e){return!!this.released[e]&&!this.held[e]}rumble(e,t,i=80){let o=this.gp;if(!(!o||!o.vibrationActuator))try{o.vibrationActuator.playEffect("dual-rumble",{duration:i,strongMagnitude:Math.min(1,e),weakMagnitude:Math.min(1,t)})}catch{}}label(e){return this.style==="touch"?{A:"\u2738",B:"B",X:"\u2684",Y:"\u2605",LB:"\u2756",RB:"\u25D1",LT:"WARP",RT:"DRIVE",BACK:"?",START:"\u2630",L3:"L",R3:"R"}[e]||e:this.style==="ps"?{A:"\u2715",B:"\u25CB",X:"\u25A1",Y:"\u25B3",LB:"L1",RB:"R1",LT:"L2",RT:"R2",BACK:"Create",START:"Options",L3:"L3",R3:"R3"}[e]||e:{A:"A",B:"B",X:"X",Y:"Y",LB:"LB",RB:"RB",LT:"LT",RT:"RT",BACK:"View",START:"Menu",L3:"LS",R3:"RS"}[e]||e}};var W=[{name:"Acid Rainbow",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.33,.67]},{name:"Psilocybin",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[.8,.9,.3]},{name:"Synthwave",a:[.55,.3,.6],b:[.45,.3,.4],c:[1,1,1],d:[0,.15,.25]},{name:"Aurora",a:[.3,.55,.5],b:[.3,.45,.45],c:[1,1,1],d:[.55,.25,.3]},{name:"Molten Gold",a:[.6,.4,.2],b:[.4,.35,.2],c:[1,1,1],d:[0,.1,.2]},{name:"Deep Ocean",a:[.2,.4,.6],b:[.2,.35,.4],c:[1,1,1],d:[.3,.2,.1]},{name:"Toxic",a:[.4,.6,.3],b:[.4,.4,.4],c:[1,1.5,1],d:[.2,0,.5]},{name:"Candy",a:[.65,.5,.65],b:[.35,.45,.35],c:[1,1,1],d:[0,.5,.25]},{name:"Infrared",a:[.5,.2,.25],b:[.5,.3,.3],c:[1,1,1.5],d:[0,.1,.6]},{name:"Ultraviolet",a:[.45,.25,.65],b:[.45,.3,.35],c:[1,2,1],d:[.6,.1,0]},{name:"Ice Fire",a:[.5,.5,.5],b:[.5,.5,.5],c:[.5,.5,.5],d:[0,.15,.5]},{name:"Peacock",a:[.4,.5,.5],b:[.4,.4,.5],c:[2,1,1],d:[.5,.2,.25]},{name:"Sunset Dream",a:[.6,.4,.4],b:[.4,.4,.3],c:[1,1,1],d:[0,.2,.45]},{name:"Emerald Temple",a:[.25,.5,.35],b:[.25,.45,.3],c:[1,1,2],d:[.6,.3,.5]},{name:"Holographic",a:[.6,.6,.7],b:[.4,.4,.3],c:[2,2,2],d:[0,.33,.67]},{name:"Blacklight",a:[.35,.2,.55],b:[.35,.45,.45],c:[1.5,1,1],d:[.35,.7,.1]}],ae={trail:.55,zoom:1.01,spin:0,warp:.3,hueDrift:0,kaleido:0,kaleidoSpin:0,mirror:0,breathe:.4,melt:0,chroma:1,bloom:.8,grain:.3,vignette:.6,exposure:1,saturation:1.1,contrast:1.05,react:1,speed:1,fusion:0,hueSpin:0,dance:1,ripple:1,punch:1,shake:1,swirlA:1,bulgeA:1};function St(a){let e=2166136261;for(let t of a)e=Math.imul(e^t.charCodeAt(0),16777619)>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}var ni={trail:[.1,.62],zoom:[.995,1.018],spin:[-.006,.006],warp:[0,1],breathe:[.1,1.2],melt:[0,.6],hueDrift:[-.01,.01],hueSpin:[-.05,.05],kaleidoSpin:[-.3,.3],chroma:[.4,1.6],bloom:[.35,.85],exposure:[.95,1.08],saturation:[1,1.4],contrast:[1,1.12],grain:[.08,.45],vignette:[.3,.95],react:[.8,1.5],speed:[.7,1.45],dance:[.4,1.9],ripple:[.3,1.7],punch:[.4,1.7],shake:[.15,1.4],swirlA:[.3,1.9],bulgeA:[.3,1.7]};function tt(a,e=ae,t={}){let i=St(a),o={...ae,...e};for(let[n,[r,l]]of Object.entries(ni))o[n]=+(r+i()*(l-r)).toFixed(4);return e.trail===0&&(o.trail=0),e.zoom===1&&(o.zoom=1),{...o,...t}}var v=(a,e,t,i={},o=0)=>{let n=q[a],r=St(e+"#shape"),l=n.params.map((d,h)=>{if(t[h]!==void 0)return t[h];let x=d.def+(r()-.5)*.16*(d.max-d.min);return+Math.max(d.min,Math.min(d.max,x)).toFixed(4)}),c=tt(e,ae,i);return n.fly&&(c.trail=Math.min(c.trail,i.trail!==void 0?.3:.08+r()*.17)),n.selfFeedback&&i.trail===void 0&&(c.trail=r()*.15),n.crisp&&(c.trail=Math.min(c.trail,.28),c.melt=Math.min(c.melt,.2)),{id:"eye-"+e.toLowerCase().replace(/[^a-z0-9]+/g,"-"),name:e,engine:"scene",scene:a,params:l,palette:o,fx:c,builtin:!0}};var be=[v("cathedral","Cathedral of Echoes",[],{trail:.45},0),v("cathedral","Infinite Basilica",[1.1,.2,1.42,1.3,1.4,.95],{trail:.35,kaleido:0},4),v("cathedral","Neon Spine",[.55,1.1,1.6,1.3,2,.75,1.5,1.4],{trail:.5,zoom:1.012,hueDrift:.006},15),v("cathedral","Gothic Mushroom Vault",[.95,.7,1.5,1.2,.7,1.05,1,1.8],{breathe:.8,melt:.4,trail:.35},1),v("nebula","Warp Nebula",[],{},9),v("nebula","Wormhole Petals",[2,.4,3.2,1.6,1,.3,1.1,6],{kaleido:6,trail:.4},0),v("nebula","Cosmic Drain",[.6,.9,1.5,2.5,.4,-.6,1.2],{spin:.01,trail:.7,zoom:.985},5),v("julia","Julia Bloom",[],{},0),v("julia","Dendrite Garden",[1.2,1.3,.6,1.2,2,.76,.2,6],{trail:.4},13),v("julia","Paisley Mind",[2.6,.8,1.8,1,1.5,.79,-.4,1],{breathe:1.2,melt:.5},1),v("julia","Electric Lace",[4.2,1.6,2.4,1.5,2.8,.7885,.3,4],{kaleido:0,trail:.6,hueDrift:.02},15),v("gyroid","Gyroid Hyperspace",[],{},9),v("gyroid","Coral Lungs",[1.4,.8,.15,1.4,.7,1.8,.06,.3],{breathe:1.5,trail:.5},12),v("gyroid","Light Speed Lattice",[3,4.5,.03,1.6,.2,.6,.05,1.6],{trail:.5,zoom:1.02,chroma:1.6},0),v("chrome","Liquid Chrome",[],{},14),v("chrome","Mercury Heartbeat",[4,.9,.15,4,.6,2,.4,1.3],{trail:.3},10),v("chrome","Oil Slick Orbit",[8,.35,.7,12,1.6,1,2,1],{trail:.5,breathe:.8},1),v("horizon","Neon Horizon",[],{},2),v("horizon","Outrun Forever",[2.5,.38,1.5,10,1.2,1.5,14,1.5],{trail:.4,chroma:2},2),v("horizon","Hallucinated Highway",[1.5,.25,1.2,6,2,1,6,1.4],{breathe:1.2,melt:1,trail:.6,hueDrift:.01},0),v("mandala","Spectral Mandala",[],{},0),v("mandala","Lotus Reactor",[8,8,.8,2,.05,1.4,1.4,1.1],{trail:.6,zoom:1.015},7),v("mandala","Chakra Spin",[16,4,.3,1.2,.5,1,.4,.8],{trail:.75,spin:.008},9),v("mandala","Lace Galaxy",[24,10,1,1,-.2,2,2,1.3],{kaleido:0,trail:.5,hueDrift:.015},15),v("silk","Silk Warp",[],{},1),v("silk","Melting Marble",[1.4,2,1.6,.4,1.8,1.2,1.8,1],{breathe:1,melt:.5},4),v("silk","Liquid Thought",[3.5,1.6,.8,1.2,1,1.5,1.2,.2],{kaleido:8,trail:.4},3),v("silk","Tie-Dye Ocean",[2.6,2.6,2.6,.9,.8,1,1.1,.6],{trail:.3,hueDrift:.02},0),v("apollo","Apollonian Dream",[],{},14),v("apollo","Bubble Universe",[1.32,.4,2.2,2.5,1,.8,.2,1.3],{trail:.5},11),v("apollo","Pearl Labyrinth",[1.08,1.2,.8,.8,1.8,.3,.6,1.6],{breathe:.6},4),v("voronoi","Stained Voronoi",[],{},7),v("voronoi","Cathedral Window",[4,.3,.08,1.5,2,.3,0,.9],{kaleido:12,trail:.3},0),v("voronoi","Cell Division",[12,1.5,.02,2.5,2.5,1,1.4,.3],{trail:.6,breathe:1.2,melt:.4},6),v("wavefield","Neon Wavefield",[],{},2),v("wavefield","Pulsar Ridge",[.6,1.6,1.8,.4,.1,1,.4,.1],{trail:.5,chroma:1.5},10),v("wavefield","Spectral Dunes",[.2,1.2,1,1.2,.8,.6,1.8,0],{mirror:1,trail:.6},3),v("starcore","Star Core",[],{},4),v("starcore","Blue Giant",[3,1.6,1.6,2,1.6,1.4,1,1.2],{trail:.6},5),v("starcore","Quasar Eye",[2.2,2,1.4,2.2,2,1.4,1.2,.85],{kaleido:6,trail:.35},8),v("flower","Flower of Life",[],{},4),v("flower","Metatron Gate",[2,.15,2,1.6,4,1.5,.6,1],{trail:.5,zoom:1.012},13),v("flower","Seed of Creation",[2.6,-.05,.6,1.2,4,1,.35,1.4],{trail:.45,breathe:1,hueDrift:.006},1),v("fall","Endless Fall",[],{},0),v("fall","Droste Staircase",[1.5,1.2,3,4,1.5,1,.2,1],{trail:.5},4),v("fall","Spiral Abyss",[2.2,1.8,8,5,1.8,2,.8,1.5],{trail:.7,zoom:.99,spin:-.01},9),v("fall","Rising Up",[-1.2,.4,6,3,1.2,1.5,.5,.4],{kaleido:0,trail:.4,hueDrift:.01},3),v("hyper","Hyperbolic Temple",[],{},0),v("hyper","Escher Heaven",[7,3,.8,2,.5,.2,1,.8],{trail:.4},10),v("hyper","Infinite Mosaic",[4,6,1.4,1.5,.8,-.3,1.3,1.2],{trail:.5,breathe:.6},7),v("burst","Supernova Burst",[],{},4),v("burst","Firework Mind",[180,2,6,1.5,.8,.4,2,.4],{trail:.66,zoom:1.02},0),v("burst","Crystal Detonation",[60,2.2,4,.8,1.2,0,1.6,1],{kaleido:8,trail:.7,zoom:1.02},15),v("fold","Origami Fold",[],{},1),v("fold","Folding Cathedral",[.15,12,1.4,.8,1.4,1.5,1.4,.8],{trail:.5},4),v("fold","Dragon Paper",[.6,10,1.3,.62,1.2,1.2,2,1.3],{trail:.65,breathe:1},9),v("fold","Snowflake Engine",[1.05,9,1.36,.75,1.6,1,.8,.7],{kaleido:6,trail:.4},5),v("bulb","Mandelbulb Shrine",[8,.2,1,1.2,3.9,.8,1.2,7],{},14),v("bulb","Alien Spore",[5,.3,1.4,1.6,3.6,1,1.8,7],{breathe:.3},6),v("bulb","Golden Idol",[9,.12,.6,.8,3.4,.5,1.4,8],{trail:.2},4),v("qjulia","Julia Organism",[.5,.22,1,.8,3.5,.8,1.3,.6],{trail:.15},1),v("qjulia","Coral Mind",[.8,.15,1.4,1.1,3.3,1,1.8,1],{trail:.2},13),v("qjulia","Quantum Larva",[.25,.3,.8,.7,3.7,.6,1,.35],{trail:.1},9),v("jbulb","Living Bulb",[6,.2,1,1.1,3.9,.8,1.2,2.5],{trail:.15},0),v("jbulb","Pulsing Seed",[4,.25,1.3,1.5,3.8,1.2,1.6,1.2],{trail:.2},7),v("jbulb","Bone Orchid",[8.5,.15,.7,.9,4,.6,1,1.6],{trail:.1},4),v("kifs","Crystal Reliquary",[.08,.18,1.1,1.8,6,.8,1.5,.78],{trail:.12},5),v("kifs","Octahedral Throne",[.15,.12,1.3,1.6,5.8,1,1.6,.8],{trail:.2},15),v("kifs","Ice Cathedral",[.6,.2,.8,1,6,.6,1.1,.3],{trail:.1},10),v("hextunnel","Hex Temple",[],{},1),v("hextunnel","Machine Elf Hall",[2.2,8,2,2,1.4,1.2,1,2],{trail:.6,breathe:1.4,melt:.4},0),v("yantra","Sri Yantra",[],{},4),v("yantra","Third Eye Opening",[12,2,24,1.2,.2,2.5,1.2,1.2],{trail:.7,zoom:1.018},9),v("menger","Menger Crystal",[],{},5),v("menger","Sponge Cathedral",[1.6,.95,2,2,.6,1.2,.2,4],{trail:.5},4),v("aurora","Aurora Ocean",[3,1,1,1.3,.75,1,1,1.2],{trail:.15,kaleido:0,mirror:0,breathe:.2,melt:0,grain:.06,chroma:.45},3),v("aurora","Borealis Mirror",[4,1.4,1.3,1.6,.9,1.4,1.6,1.8],{trail:.2,kaleido:0,mirror:0,breathe:.15,melt:0,grain:.06,chroma:.45},12)],si=[["Liquid Oscilloscope",[2,7],[0,3]],["Spectral Whirlpool",[2,3],[2,5]],["Lissajous Lagoon",[8,3],[3,0]],["Golden Spiral Engine",[7,5],[4,6]],["Bass Bloom",[9,0],[5,2]],["Rising Phoenix",[6,8],[1,8]],["Twin Vortex",[3,2],[7,0]],["Ripple Mind",[4,10],[0,6]],["Petal Storm",[10,5],[6,2]],["Helix Current",[8,6],[8,1]],["Starburst Tunnel",[0,7],[9,5]],["Mirror Pulse",[1,4],[10,0]],["Trinity Drift",[5,8],[11,3]],["Orbital Smoke",[8,2],[7,4]],["Infinite Zoom Scope",[0,9],[0,1]],["Collapsing Stars",[1,3],[6,9]],["Plasma Flame",[6,9],[5,8]],["Deep Current",[8,8],[1,3]],["Kaleido Rose",[10,4],[2,11]],["Mandala Machine",[5,10],[6,11]],["Ghost Knots",[2,8],[3,3]],["Comet Tails",[7,0],[7,9]],["Sonic Lotus",[10,2],[2,6]],["Wave Temple",[4,5],[10,1]],["Ember Spiral",[7,6],[4,8]],["Pulse Reactor",[9,4],[5,0]],["Silk Scope",[8,1],[0,10]],["Aurora Knot",[6,3],[3,8]],["Gravity Well",[2,9],[7,2]],["Quantum Foam",[8,10],[9,6]],["Spinning Prism",[5,3],[11,5]],["Echo Chamber",[1,7],[0,4]],["Fireflies",[3,8],[7,9]],["Hypno Rings",[4,7],[6,0]],["Dream Scope",[0,1,2,3,4,5,6,7,8,9,10],[0,1,2,3,4,5,6,7,8,10,11]],["Chaos Garden",[0,1,2,3,4,5,6,7,8,9,10],[0,1,2,3,4,5,6,7,8,9,10,11]]];si.forEach(([a,e,t],i)=>{let o=v("flux",a,[],{},(i*5+3)%W.length);o.flux={flows:e,waves:t},a==="Chaos Garden"&&(o.params[4]=6),be.push(o)});function ga(){let a=(e,t)=>[...Array(e).keys()].sort(()=>Math.random()-.5).slice(0,t);return{flows:a(11,2+Math.floor(Math.random()*3)),waves:a(12,2+Math.floor(Math.random()*3))}}var ri=["Velvet","Chrome","Fractal","Liquid","Astral","Neon","Cosmic","Prismatic","Holographic","Molten","Electric","Dreaming","Infinite","Sacred","Psychedelic","Iridescent","Quantum","Lucid","Melting","Hyper","Ancient","Crystal","Sonic","Shimmering","Feral","Halcyon","Opal","Ultraviolet"],li=["Singularity","Aurora","Cathedral","Lotus","Vortex","Garden","Labyrinth","Mandala","Spiral","Bloom","Engine","Temple","Ocean","Nebula","Serpent","Oracle","Echo","Portal","Reactor","Dream","Prism","Hive","Halo","Abyss","Lattice","Comet","Membrane","Kaleidoscope"],te=(a,e)=>a+Math.random()*(e-a),ge=a=>a[Math.floor(Math.random()*a.length)];function at(){return`${ge(ri)} ${ge(li)}`}function ba(){return{name:"Generated",a:[te(.3,.65),te(.3,.65),te(.3,.65)],b:[te(.3,.55),te(.3,.55),te(.3,.55)],c:[ge([.5,1,1,1,1.5,2]),ge([.5,1,1,1,1.5,2]),ge([.5,1,1,1,1.5,2])],d:[Math.random(),Math.random(),Math.random()]}}function ya(a=ae,e=1){let t={...a},i=(o,n,r)=>{t[o]=t[o]+(te(n,r)-t[o])*e};i("trail",0,.85),i("zoom",.985,1.03),i("spin",-.012,.012),i("warp",0,1.2),i("breathe",0,1.6),i("melt",0,.8),i("chroma",.3,2.2),i("bloom",.4,1.4),t.hueDrift=Math.random()<.3?te(-.02,.02):0,e>=1&&(t.kaleido=Math.random()<.3?ge([3,4,5,6,8,12]):0),t.mirror=Math.random()<.12?1:0;for(let o of["dance","ripple","punch","shake","swirlA","bulgeA"])i(o,.3,1.9);return t}function Mt(a,e=.55){let t=q[a.scene],i=structuredClone(a);return i.builtin=!1,t&&(i.params=t.params.map((o,n)=>{let r=a.params[n]??o.def,l=te(o.min,o.max);return+(r+(l-r)*e).toFixed(4)})),i.fx=ya(a.fx,e*.7),t&&t.fly&&(i.fx.trail=Math.min(i.fx.trail,.25)),t&&t.selfFeedback&&(i.fx.trail=Math.min(i.fx.trail,.15),Math.random()<.6&&(i.flux=ga())),Math.random()<.5&&(i.palette=Math.random()<.4?ba():Math.floor(Math.random()*W.length)),i.name=at(),i.id="gen-"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),i}function Bt(a){let e=a&&q[a]||ge(Ce),t=e.params.map(o=>{let n=te(o.min,o.max);return+(o.def+(n-o.def)*.7).toFixed(4)}),i=ya(ae,1);return e.fly&&(i.trail=Math.min(i.trail,.25)),e.selfFeedback&&(i.trail=Math.random()*.15),{id:"gen-"+Date.now().toString(36),name:at(),engine:"scene",scene:e.id,params:t,palette:Math.random()<.5?ba():Math.floor(Math.random()*W.length),fx:i,builtin:!1,...e.selfFeedback?{flux:ga()}:{}}}function it(a){return typeof a=="number"?W[(a%W.length+W.length)%W.length]:a}var Ta="eyecandy.userPresets.v1";function wa(){try{return JSON.parse(localStorage.getItem(Ta)||"[]")}catch{return[]}}function _e(a){try{localStorage.setItem(Ta,JSON.stringify(a))}catch{}}var xa=[0,2,3,5,7,9,11,13];function Rt(a,e){let t=q[e],i=a.id+"/"+e,o=St(i),n=t.params.map(l=>+Math.max(l.min,Math.min(l.max,l.def+(o()-.5)*.12*(l.max-l.min))).toFixed(4)),r=tt(i,ae,{kaleido:0,mirror:0});return r.trail=Math.min(r.trail,t.fly?.15:.32),r.melt=Math.min(r.melt,.12),r.warp=Math.min(r.warp,t.fly?.15:.45),r.chroma=Math.min(r.chroma,.5),r.grain=Math.min(r.grain,.15),r.saturation=Math.min(r.saturation,1.2),{id:"photo-"+i,name:t.name.replace(/^Photo /,"")+" \xB7 "+a.name,engine:"scene",scene:e,params:n,palette:xa[Math.floor(o()*xa.length)],fx:r,photo:a.id,builtin:!0}}var ci="eyecandy-photos",Et="photos",Ct=null;function ui(){return Ct||(Ct=new Promise((a,e)=>{let t=indexedDB.open(ci,1);t.onupgradeneeded=()=>t.result.createObjectStore(Et,{keyPath:"id"}),t.onsuccess=()=>a(t.result),t.onerror=()=>e(t.error)})),Ct}var ot=async(a,e)=>{let t=await ui();return new Promise((i,o)=>{let n=t.transaction(Et,a),r=n.objectStore(Et),l=e(r);n.oncomplete=()=>i(l&&"result"in l?l.result:l),n.onerror=()=>o(n.error),n.onabort=()=>o(n.error)})};function At(a,e){let t=document.createElement("canvas");return t.width=a,t.height=e,t}var fi=(a,e,t)=>new Promise(i=>a.toBlob(i,e,t));async function Pa(a,e=2048){let t=await createImageBitmap(a,{imageOrientation:"from-image"}),i=Math.min(1,e/Math.max(t.width,t.height)),o=Math.max(1,Math.round(t.width*i)),n=Math.max(1,Math.round(t.height*i)),r=At(o,n);r.getContext("2d").drawImage(t,0,0,o,n);let l=await fi(r,"image/jpeg",.9),c=160/Math.max(o,n),d=At(Math.round(o*c)||1,Math.round(n*c)||1);d.getContext("2d").drawImage(r,0,0,d.width,d.height);let h=d.toDataURL("image/jpeg",.75);t.close&&t.close();let x=(a.name||"Photo").replace(/\.[^.]+$/,"").replace(/[_-]+/g," ").trim().slice(0,28)||"Photo",y={id:"ph"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:x,w:o,h:n,thumb:h,created:Date.now()};return await ot("readwrite",T=>T.put({...y,blob:l})),y}async function ka(){try{return(await ot("readonly",e=>e.getAll())).map(({blob:e,...t})=>t).sort((e,t)=>t.created-e.created)}catch{return[]}}async function Sa(a){try{let e=await ot("readonly",t=>t.get(a));return e?await createImageBitmap(e.blob):null}catch{return null}}async function Ma(a){try{await ot("readwrite",e=>e.delete(a))}catch{}}function Ba(){let a=At(1024,768),e=a.getContext("2d"),t=e.createLinearGradient(0,0,1024,768);t.addColorStop(0,"#1b0b3a"),t.addColorStop(.5,"#0d3b5c"),t.addColorStop(1,"#3a0b2e"),e.fillStyle=t,e.fillRect(0,0,1024,768);let i=["#ff3da8","#ffd23d","#3dffb5","#3db2ff","#b03dff","#ff7a3d"];for(let o=0;o<26;o++){let n=(Math.sin(o*12.9898)*.5+.5)*1024,r=(Math.sin(o*78.233)*.5+.5)*768,l=40+o*37%150,c=e.createRadialGradient(n,r,0,n,r,l);c.addColorStop(0,i[o%i.length]),c.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=c,e.beginPath(),e.arc(n,r,l,0,Math.PI*2),e.fill()}e.strokeStyle="rgba(255,255,255,.55)",e.lineWidth=6;for(let o=0;o<7;o++)e.beginPath(),e.arc(512,384,50+o*45,0,Math.PI*2),e.stroke();return a}function Ra(a){let e=a.ctx,t=e.createGain();t.gain.value=.55,t.connect(a.input),t.connect(a.out);let i=124,o=60/i/4,n=e.currentTime+.1,r=0,l=!0,c=[0,3,5,7,10,12,15],d=e.createBuffer(1,e.sampleRate,e.sampleRate),h=d.getChannelData(0);for(let b=0;b<h.length;b++)h[b]=Math.random()*2-1;let x=e.createDelay(1);x.delayTime.value=o*3;let y=e.createGain();y.gain.value=.35,x.connect(y),y.connect(x),x.connect(t);let T=b=>{let R=e.createOscillator(),S=e.createGain();R.frequency.setValueAtTime(150,b),R.frequency.exponentialRampToValueAtTime(42,b+.12),S.gain.setValueAtTime(1,b),S.gain.exponentialRampToValueAtTime(.001,b+.45),R.connect(S),S.connect(t),R.start(b),R.stop(b+.5)},M=(b,R)=>{let S=e.createBufferSource();S.buffer=d;let E=e.createBiquadFilter();E.type="highpass",E.frequency.value=8e3;let k=e.createGain();k.gain.setValueAtTime(R,b),k.gain.exponentialRampToValueAtTime(.001,b+.05),S.connect(E),E.connect(k),k.connect(t),S.start(b),S.stop(b+.06)},L=b=>{let R=e.createBufferSource();R.buffer=d;let S=e.createBiquadFilter();S.type="bandpass",S.frequency.value=1500;let E=e.createGain();E.gain.setValueAtTime(.5,b),E.gain.exponentialRampToValueAtTime(.001,b+.18),R.connect(S),S.connect(E),E.connect(t),E.connect(x),R.start(b),R.stop(b+.2)},P=(b,R,S,E)=>{let k=e.createOscillator(),C=e.createOscillator(),F=e.createBiquadFilter(),U=e.createGain();k.type="sawtooth",C.type="square";let Z=55*Math.pow(2,R/12);k.frequency.value=Z,C.frequency.value=Z*1.005,F.type="lowpass",F.Q.value=9,F.frequency.setValueAtTime(E,b),F.frequency.exponentialRampToValueAtTime(120,b+S),U.gain.setValueAtTime(.22,b),U.gain.exponentialRampToValueAtTime(.001,b+S),k.connect(F),C.connect(F),F.connect(U),U.connect(t),U.connect(x),k.start(b),C.start(b),k.stop(b+S),C.stop(b+S)},V=(b,R)=>{[0,7,15,19].forEach(S=>{let E=e.createOscillator(),k=e.createGain();E.type="triangle",E.frequency.value=110*Math.pow(2,(R+S)/12),k.gain.setValueAtTime(0,b),k.gain.linearRampToValueAtTime(.05,b+1),k.gain.linearRampToValueAtTime(0,b+o*64),E.connect(k),k.connect(t),k.connect(x),E.start(b),E.stop(b+o*64)})},K=[0,-4,3,-2],O=()=>{if(l){for(;n<e.currentTime+.15;){let b=r%16,R=Math.floor(r/16),S=Math.floor(R/8)%4,E=K[Math.floor(R/2)%4],k=R%32>=28;!k&&b%4===0&&T(n),b%2===1&&M(n,b%4===3?.25:.1),!k&&(b===4||b===12)&&L(n),Math.random()<(S===2?.8:.55)&&P(n,E+12+c[Math.floor(Math.random()*c.length)]+(Math.random()<.2?12:0),o*1.8,600+3e3*Math.abs(Math.sin(r*.03))),b===0&&R%4===0&&V(n,E),n+=o,r++}setTimeout(O,25)}};return O(),()=>{l=!1,t.gain.setTargetAtTime(0,e.currentTime,.2),setTimeout(()=>t.disconnect(),800)}}var Ca=[3302,3570],mi=[1476,2508,2976],di=(()=>{let a=new Uint32Array(256);for(let e=0;e<256;e++){let t=e;for(let i=0;i<8;i++)t=t&1?3988292384^t>>>1:t>>>1;a[e]=t>>>0}return a})();function Ea(a){let e=4294967295;for(let t of a)e=di[(e^t)&255]^e>>>8;return(e^4294967295)>>>0}var pi=[[1,0,0,0],[1,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,1,1],[0,0,0,1],[1,0,0,1],[0,0,0,0]],nt=class{constructor(){this.supported=!!navigator.hid,this.device=null,this.kind=null,this.bt=!1,this.status=this.supported?"not connected":"unsupported",this.t=[{active:!1,x:.5,y:.5,id:-1},{active:!1,x:.5,y:.5,id:-1}],this.axes=[0,0,0,0],this.buttons=new Array(18).fill(0),this.lastReport=0,this.lastPadReport=0,this.onstatus=()=>{},this.seq=0,this.rumbleTimer=0,this.supported&&(navigator.hid.addEventListener("disconnect",e=>{e.device===this.device&&(this.device=null,this.set("not connected"))}),navigator.hid.addEventListener("connect",()=>this.autoConnect()))}set(e){this.status=e,this.onstatus(e)}get connected(){return!!this.device}get fresh(){return this.device&&performance.now()-this.lastPadReport<400}async autoConnect(){if(!this.supported||this.device)return!1;try{let t=(await navigator.hid.getDevices()).find(i=>i.vendorId===1356&&(Ca.includes(i.productId)||mi.includes(i.productId)));if(t)return await this.open(t),!0}catch(e){console.warn(e)}return!1}async request(){if(!this.supported)return!1;try{window.eyecandy&&window.eyecandy.requestHid?await window.eyecandy.requestHid():await navigator.hid.requestDevice({filters:[{vendorId:1356}]})}catch(e){console.warn(e)}return this.autoConnect()}async open(e){try{e.opened||await e.open()}catch{this.set("could not open (close Steam / DS4Windows?)");return}this.device=e,this.kind=Ca.includes(e.productId)?"ds5":"ds4";try{await e.receiveFeatureReport(this.kind==="ds5"?5:2)}catch{}e.addEventListener("inputreport",t=>this.parse(t)),this.set((this.kind==="ds5"?"DualSense":"DualShock 4")+" connected (touchpad + full controller)")}parse(e){let t=e.data,i=e.reportId,o=P=>t.getUint8(P),n=-1,r=-1;if(this.kind==="ds5"?i===1&&t.byteLength>=40?(n=0,r=32,this.bt=!1):i===49&&t.byteLength>=41?(n=1,r=33,this.bt=!0):i===1&&t.byteLength>=9&&(n=0,this.bt=!0):i===1&&t.byteLength>=42?(n=0,r=34,this.bt=!1):i===17&&t.byteLength>=44?(n=2,r=36,this.bt=!0):i===1&&t.byteLength>=9&&(n=0,this.bt=!0),n<0)return;let l=P=>(o(P)-128)/127.5,c=this.buttons;this.axes=[l(n),l(n+1),l(n+2),l(n+3)];let d,h,x,y,T;this.kind==="ds5"&&r>=0?(y=o(n+4),T=o(n+5),d=o(n+7),h=o(n+8),x=o(n+9)):(d=o(n+4),h=o(n+5),x=o(n+6),y=o(n+7),T=o(n+8));let M=pi[Math.min(8,d&15)];if(c[2]=d>>4&1,c[0]=d>>5&1,c[1]=d>>6&1,c[3]=d>>7&1,c[4]=h&1,c[5]=h>>1&1,c[6]=y/255,c[7]=T/255,c[8]=h>>4&1,c[9]=h>>5&1,c[10]=h>>6&1,c[11]=h>>7&1,c[12]=M[0],c[15]=M[1],c[13]=M[2],c[14]=M[3],c[16]=x&1,c[17]=x>>1&1,this.lastPadReport=performance.now(),r<0)return;let L=this.kind==="ds5"?1079:942;for(let P=0;P<2;P++){let V=r+P*4,K=o(V),O=o(V+1),b=o(V+2),R=o(V+3),S=this.t[P];S.active=!(K&128),S.id=K&127,S.active&&(S.x=Math.min(1,(O|(b&15)<<8)/1919),S.y=Math.min(1,(b>>4|R<<4)/L))}this.lastReport=performance.now()}asGamepad(){return{id:(this.kind==="ds5"?"DualSense":"DualShock 4")+" (HID, Vendor: 054c)",connected:!0,mapping:"standard",axes:this.axes,buttons:this.buttons.map(e=>({pressed:e>.5,value:e})),vibrationActuator:{playEffect:(e,t)=>this.rumble(t)}}}async rumble({duration:e=100,strongMagnitude:t=0,weakMagnitude:i=0}={}){if(!this.device)return;let n=Math.round(Math.min(1,t)*255),r=Math.round(Math.min(1,i)*255);try{await this.sendMotors(n,r),clearTimeout(this.rumbleTimer),this.rumbleTimer=setTimeout(()=>this.sendMotors(0,0).catch(()=>{}),e)}catch{}}async sendMotors(e,t){let i=this.device;if(i)if(this.kind==="ds5"){let o=new Uint8Array(47);if(o[0]=3,o[2]=t,o[3]=e,!this.bt)return i.sendReport(2,o);let n=new Uint8Array(77);n[0]=(this.seq=this.seq+1&15)<<4,n[1]=16,n.set(o,2);let r=Ea(new Uint8Array([162,49,...n.subarray(0,73)]));return n[73]=r&255,n[74]=r>>>8&255,n[75]=r>>>16&255,n[76]=r>>>24&255,i.sendReport(49,n)}else{if(!this.bt){let r=new Uint8Array(31);return r[0]=7,r[3]=t,r[4]=e,i.sendReport(5,r)}let o=new Uint8Array(77);o[0]=192,o[2]=7,o[5]=t,o[6]=e;let n=Ea(new Uint8Array([162,17,...o.subarray(0,73)]));return o[73]=n&255,o[74]=n>>>8&255,o[75]=n>>>16&255,o[76]=n>>>24&255,i.sendReport(17,o)}}};var pe=(matchMedia("(pointer: coarse)").matches||"ontouchstart"in window)&&!matchMedia("(pointer: fine)").matches,hi=[[0,"\u2738","Burst","r",0],[2,"\u2684","Random","r",1],[3,"\u2605","Save","r",2],[4,"\u2756","Kaleido","l",0],[5,"\u25D1","Colors","l",1],[17,"\u266A","Dance","l",2]],st=class{constructor(e){this.axes=[0,0,0,0],this.buttons=new Array(18).fill(0),this.sticks={l:null,r:null},this.lastInput=0,this.active=!1,this.el=document.createElement("div"),this.el.id="touchUI",this.el.innerHTML=`
      <div class="tzone" data-side="l"></div><div class="tzone" data-side="r"></div>
      <div class="tstick" data-side="l"><i></i></div><div class="tstick" data-side="r"><i></i></div>
      <div class="ttrig" data-b="6" data-side="l"><b>WARP</b><small>hold</small></div>
      <div class="ttrig" data-b="7" data-side="r"><b>DRIVE</b><small>hold</small></div>
      ${hi.map(([l,c,d,h,x])=>`<button class="tbtn" data-b="${l}" data-side="${h}" style="--slot:${x}"><span>${c}</span><small>${d}</small></button>`).join("")}
      <div class="ttop">
        <button class="tico" data-act="sheetVisuals" title="Presets & settings">\u2630</button>
        <button class="tico" data-act="prevPreset">\u2039</button>
        <div class="tname" data-act="sheetVisuals"></div>
        <button class="tico" data-act="nextPreset">\u203A</button>
        <button class="tico" data-act="sheetMusic" title="Music">\u266B</button>
        <button class="tico" data-act="fullscreen" title="Fullscreen">\u26F6</button>
      </div>
      <div class="thint">Left thumb steers \xB7 right thumb morphs</div>`,e.appendChild(this.el);let t=56,i=l=>this.el.querySelector(`.tstick[data-side="${l}"]`),o=l=>{let c=l.target.closest(".tzone");if(!c)return;let d=c.dataset.side;if(this.sticks[d])return;l.preventDefault(),c.setPointerCapture(l.pointerId),this.sticks[d]={id:l.pointerId,x:l.clientX,y:l.clientY};let h=i(d);h.style.left=l.clientX+"px",h.style.top=l.clientY+"px",h.classList.add("on"),this.touch()},n=l=>{for(let c of["l","r"]){let d=this.sticks[c];if(!d||d.id!==l.pointerId)continue;let h=(l.clientX-d.x)/t,x=(l.clientY-d.y)/t,y=Math.hypot(h,x);y>1&&(h/=y,x/=y);let T=c==="l"?0:2;this.axes[T]=h,this.axes[T+1]=x,i(c).querySelector("i").style.transform=`translate(${h*t}px,${x*t}px)`,this.touch()}},r=l=>{for(let c of["l","r"]){let d=this.sticks[c];if(!d||d.id!==l.pointerId)continue;this.sticks[c]=null;let h=c==="l"?0:2;this.axes[h]=this.axes[h+1]=0;let x=i(c);x.classList.remove("on"),x.querySelector("i").style.transform=""}};this.el.addEventListener("pointerdown",o),this.el.addEventListener("pointermove",n),this.el.addEventListener("pointerup",r),this.el.addEventListener("pointercancel",r),this.el.querySelectorAll("[data-b]").forEach(l=>{let c=+l.dataset.b,d=0,h=0,x=T=>{T.preventDefault(),T.stopPropagation(),l.setPointerCapture?.(T.pointerId),clearTimeout(h),d=performance.now(),this.buttons[c]=1,l.classList.add("down"),this.touch()},y=()=>{let T=90-(performance.now()-d),M=()=>{this.buttons[c]=0,l.classList.remove("down")};clearTimeout(h),T>0?h=setTimeout(M,T):M()};l.addEventListener("pointerdown",x),l.addEventListener("pointerup",y),l.addEventListener("pointercancel",y),l.addEventListener("lostpointercapture",y)}),this.el.addEventListener("contextmenu",l=>l.preventDefault())}touch(){this.lastInput=performance.now(),this.active=!0,this.el.classList.add("awake"),this.el.querySelector(".thint").classList.add("gone"),clearTimeout(this._t),this._t=setTimeout(()=>this.el.classList.remove("awake"),3500)}setName(e){let t=this.el.querySelector(".tname");t&&(t.textContent=e)}asGamepad(){return{id:"Touch controls",connected:!0,mapping:"standard",axes:this.axes.slice(),buttons:this.buttons.map(e=>({pressed:e>.5,value:e})),vibrationActuator:{playEffect:(e,t)=>(navigator.vibrate&&t&&t.duration>=100&&navigator.vibrate(Math.min(60,t.duration*.4)),Promise.resolve())}}}};var pt=be.filter(a=>a.scene!=="flux"),Na=be.filter(a=>a.scene==="flux"),p=a=>document.querySelector(a),ce=a=>[...document.querySelectorAll(a)],$=(a,e,t)=>Math.max(e,Math.min(t,a)),I=(a,e,t)=>a+(e-a)*t,X=window.eyecandy||null;X||document.addEventListener("DOMContentLoaded",()=>{},{once:!0});var Wt="eyecandy.settings.v1",ut={resolution:"native",renderScale:"auto",aa:"off",autoExposure:!0,fpsCap:"0",uiScale:1,startFullscreen:!0,showFps:!1,autopilot:!0,autoInterval:20,autoSource:"mix",autoOnDrop:!0,idle:5,reactIntensity:1.5,idleDance:!1,beatRipples:!0,beatPulse:1,beatFlash:.3,cameraShake:.5,beatSens:1.5,gainBass:1,gainMid:1,gainHigh:1,outputDevice:"default",rumble:!0,rumbleStrength:.7,deadzone:.14,stickSens:1,invertY:!1,touchMode:"both",transition:1,autoPause:!0,uiAutoHide:!0,volume:.85,seenGuide:!1},m={...ut,...JSON.parse(localStorage.getItem(Wt)||"{}")};if(!m.aaV){m.aa="off",m.aaV=1;try{localStorage.setItem(Wt,JSON.stringify(m))}catch{}}var ue=()=>localStorage.setItem(Wt,JSON.stringify(m)),le=p("#gl"),B;try{B=new Je(le)}catch(a){throw document.body.innerHTML=`<div style="padding:40px;font:16px sans-serif;color:#fff">Eye Candy needs WebGL2.<br><br>${a.message}</div>`,a}B.ssMax=1;var f=new Qe;f.out.gain.value=m.volume;var g=new et;g.deadzone=m.deadzone;var _=new nt;g.hid=_;var fe={active:!1,x:.5,y:.5},Pe=null;pe&&(document.body.classList.add("mobile"),Pe=new st(document.body),g.touch=Pe);var G=wa(),Fe=null,H=null,ie=null,Ie=null,ht=[],rt=null,Se=null,Ha={...ae,trail:0,zoom:1,warp:0,breathe:.15,bloom:.6,chroma:.8,grain:.25};function ve(){return H?Promise.resolve():rt||(Vt(),rt=new Promise((a,e)=>{let t=document.createElement("script");t.src="milk.js",t.onload=()=>{let i=window.EyeMilk;Ie={};for(let o of i.packs)try{Object.assign(Ie,o.getPresets?o.getPresets():o.default?.getPresets())}catch(n){console.warn(n)}ht=Object.keys(Ie).sort((o,n)=>o.localeCompare(n)),ie=document.createElement("canvas"),ie.width=1280,ie.height=720,H=i.butterchurn.createVisualizer(f.ctx,ie,{width:1280,height:720,pixelRatio:1,textureRatio:1}),H.connectAudio(f.input),fetch("milktex/manifest.json").then(o=>o.json()).then(o=>H.loadExtraImages(o)).catch(()=>{}),Vt().then(()=>a())},t.onerror=e,document.head.appendChild(t)}),rt)}function vi(a,e){if(!H)return;let t=Math.min(1,1280/a),i=Math.round(a*t),o=Math.round(e*t);(ie.width!==i||ie.height!==o)&&(ie.width=i,ie.height=o,H.setRendererSize(i,o))}var He=null,De={},Lt={},zt=null;function Vt(){return zt||(zt=fetch("milklib/index.json").then(a=>a.json()).then(a=>{He={};for(let[e,t,i]of a)He[e]={cat:t,chunk:i},(De[t]=De[t]||[]).push(e);return He}).catch(()=>He={}))}async function Ga(a){if(Ie&&Ie[a])return Ie[a];await Vt();let e=He[a];return e?(Lt[e.chunk]||(Lt[e.chunk]=fetch(`milklib/c${e.chunk}.json`).then(i=>i.json())),(await Lt[e.chunk])[a]||null):null}async function Ge(a,e=2){if(!H)return;let t=await Ga(a);if(t)try{H.loadPreset(t,e),Se=a}catch(i){console.warn("MilkDrop preset failed",a,i)}}var me="all";function Me(a){return a==="classic"?ht:a!=="all"?De[a]||[]:[...ht,...Object.values(De).flat()]}var Yt=()=>{let a=Me(me==="classic"||me==="all"?"all":me);return a[Math.floor(Math.random()*a.length)]},Ft=new Map;function Kt(a){return Ft.has(a)||Ft.set(a,{id:"milk:"+a,name:a,engine:"milk",milk:a,fx:tt(a,Ha,{trail:0,zoom:1,kaleido:0,mirror:0}),palette:0,builtin:!0}),Ft.get(a)}var D="eye",u=structuredClone(be[0]),$e=structuredClone(u),oe=0,s={camX:0,camY:0,roll:0,morphX:0,morphY:0,waitCenter:!1,time:0,timeScale:1,hue:0,burstT:9,flash:0,freeze:!1,lt:0,rt:0,transMix:0,lastSwitch:0,lastHuman:-1e9,kAngle:0,pal:null,flowX:0,flowY:0,hyper:0,autoT:0,panels:!0,cinema:!1,amX:0,amY:0,danceT:0,sinceBeat:9,beatInt:.5,jolt:0,beatRipT:9,beatRipAmt:0,lastAutoBurst:0,lastStick:-1e9,lensRot:0,lensZoom:1,swirl:0,bulge:0,swirlT:0,bulgeT:0,burstCX:0,burstCY:0,pinch:null,touch:[{on:!1,x:0,y:0,vx:0,vy:0,s:0},{on:!1,x:0,y:0,vx:0,vy:0,s:0}],flux:{fa:0,fb:0,fm:0,wa:0,wb:0,wm:0,tf:0,tw:0,mapT:0}},Oa=a=>[...a.a,...a.b,...a.c,...a.d];s.pal=Oa(it(u.palette));var It=[-1,-.5,.25,.5,.75,1,1.5,2,3,4];function yt(a){return a==="eye"?pt:a==="flux"?Na:a==="user"?G:a==="milk"?Me(me).map(Kt):a==="photo"?$a(ne):be}var j=[],ne=null,Dt=new Map;function $a(a){let e=j.find(i=>i.id===a);if(!e)return[];let t=a+":"+e.name;return Dt.has(t)||Dt.set(t,Ze.map(i=>Rt(e,i.id))),Dt.get(t)}var Aa=null;async function xi(a){if(B.photoId===a)return!0;let e=a&&!a.startsWith("__")?await Sa(a):null;return e?(B.setPhoto(e,a),e.close&&e.close(),!0):(B.setPhoto(Aa||(Aa=Ba()),a),!1)}function Zt(){let a=q[u.scene];if(!a)return[];let e=u.params.slice(),[t,i]=a.stick||[0,1],o=(s.waitCenter?0:s.morphX)+s.amX,n=(s.waitCenter?0:s.morphY)+s.amY,r=(l,c)=>{let d=a.params[l];d&&(e[l]=$(e[l]+c*(d.max-d.min)*.35*(d.ms??1),d.min,d.max))};return r(t,o),r(i,n),e}function Y(a,e={}){if(a){if(a.photo&&B.photoId!==a.photo){xi(a.photo).then(t=>{!t&&!e.quiet&&w("\u26A0","That photo is no longer on this device"),Y(a,e)});return}if(e.transition!==!1&&B.fin&&(B.snapshot(),s.transMix=1),u=structuredClone(a),u.fx={...ae,...a.engine==="milk"?Ha:{},...a.fx},$e=structuredClone(u),s.waitCenter=Math.abs(s.morphX)+Math.abs(s.morphY)>.1,s.hue=u.fx.hueOffset||0,s.lastSwitch=performance.now(),ki(a),s.camX=0,s.camY=0,s.lensRot=0,s.lensZoom=1,u.scene==="flux"){let t=u.flux||{flows:[2,7],waves:[0,3]};u.flux=t,Object.assign(s.flux,{fa:t.flows[0],fb:t.flows[0],fm:0,wa:t.waves[0],wb:t.waves[0],wm:0,tf:0,tw:0})}u.engine==="milk"?ve().then(()=>Ge(u.milk,e.transition===!1?0:2)):u.fx.fusion>0&&ve().then(()=>{u.milk?Ge(u.milk):Se||Ge(Yt())}),u.engine==="scene"&&B.errors[u.scene]&&w("\u26A0","Scene failed to compile \u2014 skipping"),p("#presetName").textContent=u.name,N(),se(),e.quiet||w("\u25C6",u.name)}}function xe(a){let e=yt(D);if(!e.length){D==="milk"&&ve().then(()=>{N(),xe(a)});return}oe=((oe+a)%e.length+e.length)%e.length,Y(e[oe])}function Jt(){if(u.engine==="milk"){u.fx={...u.fx,...Mt({...u,scene:"none"}).fx},u.name=u.milk+" \u2684",p("#presetName").textContent=u.name,se(),w("\u2684","Randomized FX");return}Y(Mt(u),{quiet:!0}),w("\u2684","Randomized \xB7 "+u.name)}function Qt(){Y(Bt(),{quiet:!0}),w("\u2726","Generated \xB7 "+u.name)}function Xa(){let a=structuredClone(u);return a.engine==="scene"&&(a.params=Zt().map(e=>+e.toFixed(4))),a.fx={...a.fx,hueOffset:(s.hue%1+1)%1,speed:+(a.fx.speed*Math.abs(s.timeScale)).toFixed(3)},a.engine==="scene"&&a.fx.fusion>0&&Se&&(a.milk=Se),a}function Tt(){let a=Xa();a.id="user-"+Date.now().toString(36),a.builtin=!1,($e.builtin||!a.name||G.some(e=>e.name===a.name))&&(a.name=(a.engine==="milk"?"Milk \xB7 ":"")+at()),G.push(a),_e(G),u=structuredClone(a),$e=structuredClone(a),p("#presetName").textContent=u.name,N(),se(),w("\u2605","Saved \u201C"+a.name+"\u201D to My Presets"),g.rumble(.4,.6,120)}function gi(){let a=G.findIndex(t=>t.id===u.id);if(a<0)return Tt();let e=Xa();e.name=p("#pName").value||e.name,G[a]=e,_e(G),$e=structuredClone(e),u=structuredClone(e),s.timeScale=1,N(),w("\u2605","Updated \u201C"+e.name+"\u201D")}function bi(){let a=G.findIndex(e=>e.id===u.id);a<0||(G.splice(a,1),_e(G),N(),w("\u2716","Deleted"),xe(0))}function Xe(a=1,e=0,t=0){s.burstCX=e,s.burstCY=t,s.burstT=0,s.flash=.55*a,g.rumble(.9*a*m.rumbleStrength,.5*a*m.rumbleStrength,160)}function Va(a=1){let e=typeof u.palette=="number"?u.palette:-1;u.palette=((e+a)%W.length+W.length)%W.length,w(g.label("RB"),"Palette \xB7 "+W[u.palette].name),se()}var qt=[0,3,4,5,6,8,12,16];function ja(){let a=qt.indexOf(u.fx.kaleido);u.fx.kaleido=qt[(a+1)%qt.length],w(g.label("LB"),u.fx.kaleido?"Kaleidoscope \xD7"+u.fx.kaleido:"Kaleidoscope off"),se()}function Wa(){u.fx.mirror=u.fx.mirror?0:1,w(g.label("LB"),u.fx.mirror?"Mirror world":"Mirror off"),se()}function vt(a){let e=It.indexOf(s.timeScale);e<0&&(e=5),e=$(e+a,0,It.length-1),s.timeScale=It[e],w(a>0?"\u25B2":"\u25BC",s.timeScale<0?"Time reversed \xD7"+Math.abs(s.timeScale):"Time \xD7"+s.timeScale)}function yi(){s.camX=s.camY=s.roll=0,s.lensRot=0,s.lensZoom=1,s.timeScale=1,s.flowX=s.flowY=0,w(g.label("L3"),"View reset")}function Ti(){u.engine==="scene"&&(u.params=Zt(),s.waitCenter=!0,se(),w(g.label("R3"),"Shape locked in"),g.rumble(.2,.5,60))}function ea(a){m.autopilot=a,ue(),p("#autoBtn").classList.toggle("on",a),w("\u27F3",a?"Autopilot on":"Autopilot off"),Pt()}function Be(){s.lastHuman=performance.now()}var La={},ft=[],wi=6;function Pi(a){let e=[...Array(a).keys()];for(let t=a-1;t>0;t--){let i=Math.floor(Math.random()*(t+1));[e[t],e[i]]=[e[i],e[t]]}return e}function Te(a,e,t=()=>!0){if(!e.length)return null;let i=La[a];(!i||i.n!==e.length||!i.left.length)&&(i=La[a]={n:e.length,left:Pi(e.length)});for(let o=i.left.length-1;o>=Math.max(0,i.left.length-40);o--){let n=e[i.left[o]];if(t(n))return i.left.splice(o,1),n}return e[i.left.pop()]}var lt=a=>!a.scene||!ft.includes(a.scene)&&!B.errors[a.scene];function ki(a){a&&a.engine!=="milk"&&a.scene&&(ft.push(a.scene),ft.length>wi&&ft.shift())}var za=()=>[...new Set(Me("all"))],Si=Ce.map(a=>({scene:a.id})),Mi=[["milk",.36],["eye",.32],["flux",.12],["generate",.14],["user",.06]];function Bi(a){if(a==="all")return Math.random()<.5?"milk":"eye";if(a==="photo")return j.length?"photo":"eye";if(a!=="mix"&&a!=="mixp")return a;let e=[...Mi,...a==="mixp"&&j.length?[["photo",.2]]:[]].filter(([o])=>o!=="user"||G.length),t=e.reduce((o,[,n])=>o+n,0),i=Math.random()*t;for(let[o,n]of e)if((i-=n)<0)return o;return"eye"}function Ya(){let a=m.autoSource,e=Bi(a);if(e==="milk")return s.autoBusy=!0,ve().then(()=>{let n=a==="milk"?Me(me==="classic"?"all":me):za(),r=Te(a==="milk"?"milk:"+me:"milk:all",n.length?n:za());r&&Y(Kt(r),{quiet:!0})}).finally(()=>{s.autoBusy=!1,s.lastSwitch=performance.now()});let t=null;if(e==="generate"){let n=Te("gen",Si,lt);t=Bt(n&&n.scene)}else if(e==="flux")t=Te("flux",Na);else if(e==="user")t=Te("user",G,lt);else if(e==="photo"){let n=j.flatMap(l=>Ze.map(c=>({ph:l,scene:c.id}))),r=Te("photo:"+j.length,n,lt);r&&(t=Rt(r.ph,r.scene))}t||(t=Te("eye",pt,lt));let i=yt(D),o=i.indexOf(t);o>=0&&(oe=o),t.photo&&D==="photo"&&ne!==t.photo&&(ne=t.photo,N()),Y(t,{quiet:!0})}function Ri(a,e){let t=m.autopilot&&(!m.autoPause||e-s.lastHuman>m.idle*1e3);if(s.autoActive=t,!t||s.autoBusy)return;s.autoT+=a;let i=(e-s.lastSwitch)/1e3,o=m.autoOnDrop&&f.drop>1.1&&i>12;(i>m.autoInterval||o)&&(f.drop=0,s.lastSwitch=e,Ya(),o&&Xe(.8))}function Ci(a){if(g.poll(),g.justConnected&&g.style!=="touch"&&(w("\u{1F3AE}",(g.style==="ps"?"PlayStation":"Xbox")+" controller connected"),g.rumble(.5,.8,200),m.seenGuide||(m.seenGuide=!0,ue(),ke(!0)),g.style==="ps"&&_.supported&&!_.connected&&!X&&(p("#tpChip").classList.remove("hidden"),setTimeout(()=>w("\u25C9","PlayStation pad: click \u201CEnable touchpad\u201D up top to use the touchpad"),1500)),la()),!g.connected){s.lt=I(s.lt,0,a*6),s.rt=I(s.rt,0,a*6);return}let[e,t,i,o]=g.axes;if((g.pressed.some(Boolean)||Math.abs(e)+Math.abs(t)+Math.abs(i)+Math.abs(o)+g.lt+g.rt>.05)&&(Be(),p("#splash").classList.contains("gone")||Ei(),m.uiAutoHide&&wt()),!p("#controls").classList.contains("hidden")){(g.tap(z.B)||g.tap(z.A)||g.shortRelease(z.BACK))&&ke(!1);return}let r=m.stickSens,l=m.invertY?-1:1;if(Math.abs(e)+Math.abs(t)+Math.abs(i)+Math.abs(o)>.05&&(s.lastStick=performance.now()),u.engine==="milk")s.lensRot+=e*a*1.8*r,s.lensZoom=$(s.lensZoom*Math.exp(t*l*a*1.3*r),.3,4),s.swirlT=i*1.5*r,s.bulgeT=-o*l*1.1*r;else{let d=q[u.scene]&&q[u.scene].camSens||1;s.camX+=e*a*1.5*r*d,s.camY=$(s.camY-t*l*a*1.1*r*d,-1.3,1.3),s.waitCenter&&Math.hypot(i,o)<.12&&(s.waitCenter=!1),s.morphX=I(s.morphX,$(i*r,-1.5,1.5),a*8),s.morphY=I(s.morphY,$(-o*l*r,-1.5,1.5),a*8),s.swirlT=i*.3*r,s.bulgeT=-o*l*.15*r}s.flowX=I(s.flowX,e,a*5),s.flowY=I(s.flowY,-t*l,a*5),s.lt=I(s.lt,g.lt,a*10),s.rt=I(s.rt,g.rt,a*10),g.lt>.08&&Math.random()<a*3&&jt("LT","Warp",g.lt),g.rt>.08&&Math.random()<a*3&&jt("RT","Drive",g.rt);let c=g.lt>.92&&g.rt>.92;c&&!s.hyperOn&&(w("\u2604","HYPERDRIVE"),Xe(1.2)),s.hyperOn=c,g.tap(z.A)&&Xe(1),g.tap(z.TOUCH)&&(m.idleDance=!m.idleDance,ue(),Pt(),w("\u25C9",m.idleDance?"Music dance ON":"Music dance OFF \u2014 pure beat reactive"),g.rumble(.3,.5,90)),g.style==="ps"&&_.supported&&!_.connected&&!s.tpTried&&(s.tpTried=!0,_.autoConnect().then(d=>{!d&&X&&_.request()})),s.freeze=g.down(z.B),g.tap(z.B)&&w(g.label("B"),"Freeze"),g.shortRelease(z.X)&&Jt(),g.hold(z.X,550)&&(Qt(),g.rumble(.6,.6,150)),g.tap(z.Y)&&Tt(),g.shortRelease(z.LB)&&ja(),g.hold(z.LB,500)&&Wa(),g.shortRelease(z.RB)&&Va(1),g.down(z.RB)&&performance.now()-g.downAt[z.RB]>300&&(s.hue+=a*.5,Math.random()<a*2&&w(g.label("RB"),"Hue spin")),g.tap(z.RIGHT)&&xe(1),g.tap(z.LEFT)&&xe(-1),g.tap(z.UP)&&vt(1),g.tap(z.DOWN)&&vt(-1),g.tap(z.L3)&&yi(),g.tap(z.R3)&&Ti(),g.tap(z.START)&&(s.cinema=!1,ta(!0),Ja()),g.shortRelease(z.BACK)&&ke(!0),g.hold(z.BACK,700)&&ea(!m.autopilot)}function Ei(){!f.playlist.length&&f.mode==="player"&&!Fe&&aa(),Oe()}function Ai(a,e){if(u.scene!=="flux"||!u.flux)return;let t=s.flux,i=u.flux,o=e[4]||14,n=(l,c)=>{let d=l.filter(h=>h!==c);return d.length?d[Math.floor(Math.random()*d.length)]:l[0]};t.tf+=a,t.tw+=a,t.fm>0&&t.fm<1&&(t.fm=Math.min(1,t.fm+a/3.5)),t.fm>=1&&(t.fa=t.fb,t.fm=0),t.fm===0&&t.tf>o&&i.flows.length>1&&(t.fb=n(i.flows,t.fa),t.fm=.001,t.tf=0),t.wm>0&&t.wm<1&&(t.wm=Math.min(1,t.wm+a/2)),t.wm>=1&&(t.wa=t.wb,t.wm=0);let r=f.drop>.9&&t.tw>4;t.wm===0&&(t.tw>o*.7||r)&&i.waves.length>1&&(t.wb=n(i.waves,t.wa),t.wm=.001,t.tw=0),t.mapT+=a*.03*(e[5]??1)*(1+f.vol*.8)}function Li(a){let e=B.W&&B.H?B.W/B.H:1.7777777777777777,t;_.connected&&performance.now()-_.lastReport<600?t=_.t.map(n=>n.active?n:null):t=[fe.active?fe:null,null];for(let n=0;n<2;n++){let r=s.touch[n],l=t[n];if(l&&m.touchMode!=="off"){let c=(l.x-.5)*e,d=.5-l.y;r.on||(r.x=c,r.y=d,r.vx=r.vy=0);let h=(c-r.x)/Math.max(a,.001),x=(d-r.y)/Math.max(a,.001);r.vx=I(r.vx,h,.35),r.vy=I(r.vy,x,.35),r.x=c,r.y=d,r.on=!0,r.s=Math.min(1,r.s+a*3),Be()}else r.on=!1,r.s=Math.max(0,r.s-a*2),r.vx*=.9,r.vy*=.9}let[i,o]=s.touch;if(i.on&&o.on){let n=Math.hypot(i.x-o.x,i.y-o.y),r=Math.atan2(o.y-i.y,o.x-i.x);if(s.pinch){s.lensZoom=$(s.lensZoom*(n/Math.max(.02,s.pinch.d)),.3,4);let l=r-s.pinch.a;l>Math.PI&&(l-=2*Math.PI),l<-Math.PI&&(l+=2*Math.PI),s.lensRot+=l}s.pinch={d:n,a:r}}else s.pinch=null}var Fa=(a,e)=>[a.x,a.y,e?a.s*(s.pinch?.3:1):0,a.s>.01?1:0];function Ka(a){let e=s.pal,t=[];for(let i=0;i<3;i++)t.push($(e[i]+e[3+i]*Math.cos(6.2831853*(e[6+i]*a+e[9+i]+s.hue)),0,1));return t}var Ut=performance.now(),ct=0,_t=0,Ne=16,Ee=0,Nt=0;function Za(a){requestAnimationFrame(Za);let e=+m.fpsCap;if(e>0&&a-Ut<1e3/e-1.5)return;let t=Math.min(.05,(a-Ut)/1e3);Ut=a,Ci(t),Li(t);let i=u.fx,o=s.rt,n=s.lt,r=s.hyperOn?1:0;s.hyper=I(s.hyper,r,t*3),f.update(t,i.react*(1+o*1.6),{sens:m.beatSens,gB:m.gainBass,gM:m.gainMid,gH:m.gainHigh}),Ri(t,a);let l=m.reactIntensity*i.react,c=m.idleDance?1:0;s.danceT+=t*(.5+f.vol*1.2);let d=s.danceT;s.amX=I(s.amX,c*l*i.dance*(Math.sin(d*.53)*.3*(.35+f.mid)+f.bass*.22*Math.sin(d*.19+1)),t*4),s.amY=I(s.amY,c*l*i.dance*(Math.cos(d*.41)*.25*(.35+f.high)+f.beat*.28),t*6);let h=c*Math.min(l,2)*i.dance*Math.sin(d*.07+.5)*(.04+f.vol*.1),x=c*Math.min(l,2)*i.dance*Math.sin(d*.11)*(.02+f.mid*.05);u.engine==="milk"&&c>.5&&(s.lensRot+=t*l*i.swirlA*.05*Math.sin(d*.05),a-s.lastStick>4e3&&(s.lensZoom=I(s.lensZoom,1+Math.sin(d*.09)*.15*i.bulgeA,t*.2))),s.sinceBeat+=t,f.isBeat&&(s.sinceBeat>.2&&s.sinceBeat<2&&(s.beatInt=I(s.beatInt,s.sinceBeat,.3)),s.sinceBeat=0,s.jolt=(Math.random()-.5)*2,s.beatRipT=0,s.beatRipAmt=Math.min(1.6,f.bass*.9)*l*i.ripple,m.beatFlash>0&&f.bass>1.2&&a-s.lastAutoBurst>2200&&(s.flash=Math.max(s.flash,m.beatFlash*.5*Math.min(l,1.5)),s.lastAutoBurst=a)),s.jolt*=Math.exp(-t*7),s.beatRipT+=t;let y=u.engine==="scene"&&q[u.scene]&&q[u.scene].landscape?.12:1;s.swirl=I(s.swirl,s.swirlT*(y<1?.4:1)+y*Math.min(l,2)*c*i.swirlA*Math.sin(d*.17)*(.04+f.mid*.16),t*4),s.bulge=I(s.bulge,s.bulgeT+y*Math.min(l,2)*i.bulgeA*f.bass*.08,t*10),i.kaleido>1&&(s.kAngle+=t*f.mid*.25*l*Math.sin(d*.11));let T=window.devicePixelRatio||1,M=m.resolution==="native"?Math.round(innerHeight*Math.min(T,pe?1.25:2)):+m.resolution,L=Math.round(M*innerWidth/Math.max(1,innerHeight));(le.width!==L||le.height!==M)&&(le.width=L,le.height=M),Ne=I(Ne,t*1e3,.05);let P,V,K=u.engine==="scene"?q[u.scene]:null,O=u.engine==="milk"?"milk":u.scene||"x",b=[1,1,.9,.8,.7,.6,.5,.4],R=K&&K.ss&&!pe&&m.aa==="auto"?0:1,S=u.engine==="milk"?4:b.length-1,E=s.quality||(s.quality={});E[O]||(E[O]={rung:pe?5:R,lockUntil:0,probeAt:-1});let k=E[O];if(k.rung=$(k.rung,R,S),m.renderScale==="auto"){Ee+=t;let J=e>0?1e3/e:16.7,We=performance.now()/1e3;s.qKey!==O&&(s.qKey=O,Ee=-1.5,Ne=J),Ee>1.5&&(Ne>J*1.22&&k.rung<S?(k.probeAt>0&&We-k.probeAt<5&&(k.lockUntil=We+45),k.rung++,k.probeAt=-1,Ee=0):Ne<J*1.08&&k.rung>R&&We>k.lockUntil&&Ee>4&&(k.rung--,k.probeAt=We,Ee=0)),P=b[k.rung],u.engine==="milk"&&(P=Math.max(P,.7))}else P=$(+m.renderScale,.25,2);V=m.aa==="off"?1:m.aa==="2x"?2:m.aa==="4x"?4:pe?1:m.renderScale==="auto"?k.rung===0?2:1:2,s.qs=P,B.ssMax=V;let C=B.fin;B.resize(L,M,P),C!==B.fin&&(B.transTex=null);let F=i.speed*s.timeScale*(1+o*1.2+s.hyper*2);s.freeze||(s.time+=t*F*(1+f.vol*.45*Math.min(l,2.5))),s.hue+=t*(i.hueSpin||0),s.kAngle+=t*(i.kaleidoSpin||0)*.5,s.burstT+=t,s.flash*=Math.exp(-t*6),s.transMix=Math.max(0,s.transMix-t/Math.max(.2,m.transition)),s.roll=I(s.roll,s.flowX*.25,t*2);let U=Oa(it(u.palette));for(let J=0;J<12;J++)s.pal[J]=I(s.pal[J],U[J],1-Math.exp(-t*2.5));if(B.uploadAudio(f.tex),(u.engine==="milk"||i.fusion>0)&&H){vi(Math.max(B.sw,Math.min(L,1280)),Math.max(B.sh,Math.round(Math.min(L,1280)*M/L)));try{H.render(),B.uploadMilk(ie)}catch(J){console.warn(J)}}let ee=u.engine==="scene"?Zt():[0,0,0,0,0,0,0,0];for(;ee.length<8;)ee.push(0);Ai(t,ee);let qe=f.beat*m.beatPulse*i.punch*.05*Math.min(l,2.5),ti=f.beat*m.cameraShake*i.shake*Math.min(l,2)*.5,je=s.pal,ca=m.touchMode==="both"||m.touchMode==="vortex",ai=m.touchMode==="both"||m.touchMode==="paint",ua=s.touch[0],ii=i.trail>.15?f.bass*.05*Math.min(l,2):0;B.frame({adaptRate:1-Math.exp(-t*2.5),engine:u.engine==="milk"&&H?"milk":"scene",scene:u.engine==="milk"?"nebula":u.scene,sceneU:{uTime:s.time,uBass:f.bass,uMid:f.mid,uHigh:f.high,uVol:f.vol,uBeat:f.beat,uDrive:o,uBurst:s.burstT,uHue:s.hue,uBeatCount:f.beatCount,uSinceBeat:s.sinceBeat,uBeatInt:s.beatInt,uFlowA:s.flux.fa,uFlowB:s.flux.fb,uFlowMix:s.flux.fm,uWaveA:s.flux.wa,uWaveB:s.flux.wb,uWaveMix:s.flux.wm,uMapT:s.flux.mapT,uPhoto:B.photoTex,uPhotoAR:B.photoAR,uAudio:B.audioTex,uP0:ee.slice(0,4),uP1:ee.slice(4,8),uPalA:je.slice(0,3),uPalB:je.slice(3,6),uPalC:je.slice(6,9),uPalD:je.slice(9,12),uCam:[s.camX+h,s.camY+x,s.roll+s.jolt*.06*m.cameraShake]},fbU:{uTime:s.time,uTrail:Math.min(.96,Math.max(i.trail+ii,n*.9,s.hyper*.86)),uZoom:i.zoom+n*.035+s.hyper*.04+f.beat*m.beatPulse*.008*l,uSpin:i.spin+n*s.flowX*.03+s.jolt*.004*m.cameraShake,uWarp:i.warp+n*.8+f.mid*.3*Math.min(l,2),uHueDrift:i.hueDrift+n*.012+s.hyper*.05+f.high*.006*l,uKaleido:i.kaleido,uKaleidoSpin:s.kAngle,uMirror:i.mirror,uFusion:u.engine==="milk"?0:H?i.fusion:0,uBreathe:i.breathe+o*.6+f.bass*.35*Math.min(l,2),uMelt:i.melt+n*.5+f.high*.25*Math.min(l,2),uBass:f.bass,uBeat:f.beat,uBurstT:s.burstT,uBurstC:[s.burstCX,s.burstCY],uFlow:[s.flowX*n,s.flowY*n],uLensRot:s.lensRot+s.jolt*.025*m.cameraShake,uLensZoom:s.lensZoom,uLensPan:[0,0],uSwirl:s.swirl,uBulge:s.bulge,uPunch:qe,uShake:ti,uBeatRipT:m.beatRipples?s.beatRipT:9,uBeatRipAmt:s.beatRipAmt,uEdgeBlack:u.engine==="scene"&&q[u.scene]&&q[u.scene].space?1:0,uTouch:Fa(s.touch[0],ca),uTouch2:Fa(s.touch[1],ca),uTouchVel:[$(ua.vx*.02,-.08,.08),$(ua.vy*.02,-.08,.08)],uTouchColor:Ka(s.time*.05),uTouchPaint:ai?1.2:0},finU:{uTime:a/1e3,uChroma:i.chroma+o*2+s.hyper*2+f.beat*1.2*Math.min(l,2),uBloomAmt:i.bloom*(1-s.hyper*.5)+o*.45,uAutoExp:m.autoExposure?1:0,uGrain:i.grain,uVignette:i.vignette,uBurstC:[s.burstCX,s.burstCY],uExposure:i.exposure*(1+o*.12-s.hyper*.15),uSat:i.saturation,uContrast:i.contrast+n*.06,uFlash:s.flash,uTransMix:s.transMix,uBurstT:s.burstT,uBeat:f.beat,uInvert:0}}),m.rumble&&g.connected&&f.isBeat&&performance.now()-s.lastHuman<3e4&&g.rumble(Math.min(1,f.bass*.45)*m.rumbleStrength*(.35+o),.15*m.rumbleStrength,70),s.hyperOn&&m.rumble&&Math.random()<t*10&&g.rumble(.25*m.rumbleStrength,.6*m.rumbleStrength,60),Nt+=t,Nt>1/30&&(Nt=0,zi(),Pe&&Pe._n!==u.name&&(Pe._n=u.name,Pe.setName(u.name))),ct+=t,_t++,ct>.5&&(m.showFps?p("#fps").textContent=`${Math.round(_t/ct)} fps \xB7 out ${L}\xD7${M} \xB7 render ${B.sw}\xD7${B.sh} (${Math.round(P*100)}%)`:p("#fps").textContent="",ct=0,_t=0)}var we=document.documentElement.style,Ae=document.getElementById("spec"),ye=Ae?Ae.getContext("2d"):null;function zi(){let a=e=>Ka(e).map(t=>Math.round(t*255)).join(",");if(we.setProperty("--c1",a(0)),we.setProperty("--c2",a(.33)),we.setProperty("--c3",a(.66)),we.setProperty("--bass",Math.min(1.5,f.bass).toFixed(3)),we.setProperty("--beat",f.beat.toFixed(3)),ye&&Ve.classList.contains("show")){let e=Ae.width=Ae.clientWidth*2,t=Ae.height=Ae.clientHeight*2;ye.clearRect(0,0,e,t);let i=48,o=e/i,n=ye.createLinearGradient(0,0,e,0);n.addColorStop(0,`rgb(${a(0)})`),n.addColorStop(.5,`rgb(${a(.33)})`),n.addColorStop(1,`rgb(${a(.66)})`),ye.fillStyle=n;for(let r=0;r<i;r++){let l=f.tex[Math.floor(r/i*400)]/255,c=Math.max(2,l*l*t);ye.globalAlpha=.35+l*.6,ye.fillRect(r*o+1,t-c,o-2,c)}ye.globalAlpha=1}}var mt=p("#hud");function w(a,e){let t=document.createElement("div");for(t.className="toast",t.innerHTML=`<span class="g">${a}</span><span>${Q(e)}</span>`,mt.appendChild(t);mt.children.length>3;)mt.firstChild.remove();setTimeout(()=>{t.style.opacity=0,setTimeout(()=>t.remove(),450)},1700)}var Ia={};function jt(a,e,t){let i=Ia[a];(!i||!i.isConnected)&&(i=document.createElement("div"),i.className="toast",i.innerHTML=`<span class="g">${g.label(a)}</span><span>${e}</span><span class="bar"><i></i></span>`,mt.appendChild(i),Ia[a]=i),i.querySelector("i").style.width=Math.round(t*100)+"%",i.style.opacity=1,clearTimeout(i._t),i._t=setTimeout(()=>{i.style.opacity=0,setTimeout(()=>i.remove(),450)},900)}var Q=a=>String(a).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),Ve=p("#ui"),xt=0;function ta(a){s.cinema&&!a||(Ve.classList.add("show"),document.body.classList.remove("idle"),clearTimeout(xt),m.uiAutoHide&&(xt=setTimeout(()=>{(!Ve.matches(":hover")||a==="fromPad")&&wt()},3500)))}function wt(){p("#splash").classList.contains("gone")&&!document.activeElement?.matches("input,select")&&(Ve.classList.remove("show"),document.body.classList.add("idle"))}function Ja(){s.panels=!s.panels,document.body.classList.toggle("panels-off",!s.panels)}window.addEventListener("mousemove",()=>ta());Ve.addEventListener("mouseleave",()=>{clearTimeout(xt),m.uiAutoHide&&(xt=setTimeout(wt,1500))});function Oe(){p("#splash").classList.add("gone"),document.body.classList.add("started"),Pe&&!m.seenTouchHint&&(m.seenTouchHint=!0,ue(),setTimeout(()=>w("\u{1F44D}","Put your thumbs down \u2014 left steers, right morphs"),900))}var Fi={addFiles:()=>p("#fileIn").click(),addFolder:()=>p("#folderIn").click(),loopback:async()=>{try{Le(),await f.useLoopback(),Oe(),w("\u{1F50A}","Listening to your PC audio")}catch(a){w("\u26A0",a.message||"Capture cancelled")}},mic:async()=>{try{Le(),await f.useMic(),Oe(),w("\u{1F399}","Listening to microphone")}catch{w("\u26A0","Microphone unavailable")}},demo:()=>{aa(),Oe()},srcPlayer:()=>{Le(),f.useSource("player"),f.playlist.length&&f.toggle()},prevPreset:()=>xe(-1),nextPreset:()=>xe(1),mutate:Jt,generate:Qt,save:Tt,overwrite:gi,revert:()=>{Y($e,{quiet:!0}),w("\u21BA","Reverted")},deletePreset:bi,resetSettings:()=>{let a=document.querySelector("[data-act=resetSettings]");if(a&&!a.dataset.armed){a.dataset.armed="1";let t=a.textContent;a.textContent="Tap again to reset everything",setTimeout(()=>{delete a.dataset.armed,a.textContent=t},3e3);return}let e=["volume","seenGuide","seenTouchHint","outputDevice","aaV"];for(let t of Object.keys(ut))e.includes(t)||m[t]===ut[t]||(m[t]=ut[t],he[t]&&he[t](m[t]));ue(),Pt(),p("#autoBtn").classList.toggle("on",m.autopilot),w("\u21BA","Settings back to defaults")},autopilot:()=>ea(!m.autopilot),controls:()=>ke(!0),fullscreen:ia,playPause:()=>{Le(),f.toggle()},prevTrack:()=>f.prev(),nextTrack:()=>f.next(),shuffle:()=>{f.shuffle=!f.shuffle,gt()},repeat:()=>{f.repeat={all:"one",one:"off",off:"all"}[f.repeat],gt()},clearList:()=>{f.clear(),na()},exportPresets:()=>{let a=new Blob([JSON.stringify(G,null,2)],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(a),e.download="eye-candy-presets.json",e.click()},importPresets:()=>p("#importIn").click(),sheetVisuals:()=>dt("visuals"),sheetMusic:()=>dt("music"),closeSheet:()=>dt(null),touchpad:async()=>{let a=await _.request();w("\u25C9",a?"Touchpad on \u2014 swipe to stir the visuals":"No PlayStation controller found"),p("#tpChip").classList.toggle("hidden",a)}};document.addEventListener("click",a=>{let e=a.target.closest("[data-act]");if(!e)return;f.resume();let t=Fi[e.dataset.act];t&&t()});function aa(){Fe||(f.el.pause(),f.stopStream(),f.mode="demo",Fe=Ra(f),f.resume(),Qa(),w("\u2726","Demo groove"))}function Le(){Fe&&(Fe(),Fe=null,f.mode==="demo"&&(f.mode="player"))}async function dt(a){let e=document.body,t=e.classList.contains("sheet-visuals")?"visuals":e.classList.contains("sheet-music")?"music":null;e.classList.remove("sheet-visuals","sheet-music"),a&&a!==t&&e.classList.add("sheet-"+a),a==="visuals"&&N()}async function ia(){if(X&&X.setFullscreen){X.setFullscreen(!await X.isFullscreen());return}document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{})}function ke(a){la(),p("#controls").classList.toggle("hidden",!a)}var Ii=/\.(mp3|flac|wav|ogg|oga|m4a|aac|opus|webm|wma|aiff?)$/i,Di=a=>({name:a.name.replace(/\.[^.]+$/,""),url:URL.createObjectURL(a),path:X?X.pathFor(a):null});function oa(a){let e=[...a].filter(t=>Ii.test(t.name)||(t.type||"").startsWith("audio/")).sort((t,i)=>(t.webkitRelativePath||t.name).localeCompare(i.webkitRelativePath||i.name,void 0,{numeric:!0}));if(!e.length)return w("\u26A0","No audio files found");Le(),f.addTracks(e.map(Di)),Oe(),na(),w("\u266B",`Added ${e.length} track${e.length>1?"s":""}`)}p("#fileIn").onchange=a=>{oa(a.target.files),a.target.value=""};p("#folderIn").onchange=a=>{oa(a.target.files),a.target.value=""};p("#importIn").onchange=async a=>{try{let e=JSON.parse(await a.target.files[0].text()),t=(Array.isArray(e)?e:[e]).filter(i=>i&&i.engine);t.forEach(i=>{i.id="user-"+Math.random().toString(36).slice(2),i.builtin=!1}),G.push(...t),_e(G),N(),w("\u2605",`Imported ${t.length} presets`)}catch{w("\u26A0","Could not read that file")}a.target.value=""};window.addEventListener("dragover",a=>a.preventDefault());window.addEventListener("drop",async a=>{a.preventDefault(),f.resume();let e=[...a.dataTransfer.items||[]],t=[],i=r=>new Promise(l=>{if(r.isFile)r.file(c=>{t.push(c),l()},l);else if(r.isDirectory){let c=r.createReader(),d=[],h=()=>c.readEntries(async x=>{if(x.length)d.push(...x),h();else{for(let y of d)await i(y);l()}},l);h()}else l()}),o=e.map(r=>r.webkitGetAsEntry&&r.webkitGetAsEntry()).filter(Boolean);if(o.length)for(let r of o)await i(r);else t.push(...a.dataTransfer.files);if(t.some(r=>/^image\//.test(r.type))&&!t.some(r=>/^audio\//.test(r.type)||/\.(mp3|wav|flac|ogg|m4a|aac|opus)$/i.test(r.name))){await ra(t);return}let n=t.find(r=>/\.json$/i.test(r.name));if(n&&t.length===1){p("#importIn").onchange({target:{files:[n],value:""}});return}oa(t)});function qi(a){return"app://eye/media/"+encodeURIComponent(a)}function na(){X&&localStorage.setItem("eyecandy.playlist",JSON.stringify(f.playlist.filter(a=>a.path).map(a=>({name:a.name,path:a.path}))))}function Ui(){if(X)try{let a=JSON.parse(localStorage.getItem("eyecandy.playlist")||"[]");f.playlist.push(...a.map(e=>({...e,url:qi(e.path)})))}catch{}}var Da=a=>isFinite(a)?`${Math.floor(a/60)}:${String(Math.floor(a%60)).padStart(2,"0")}`:"0:00";function gt(){let a=p("#playlist");f.playlist.length?a.innerHTML=f.playlist.map((e,t)=>`<li data-i="${t}" class="${t===f.index&&f.mode==="player"?"cur":""}"><span class="n">${t+1}</span><span class="t">${Q(e.name)}</span><button class="x" data-x="${t}">\u2715</button></li>`).join(""):a.innerHTML='<li class="empty">Drop songs or folders here<br><small>mp3 \xB7 flac \xB7 wav \xB7 ogg \xB7 m4a</small></li>',p("#shuffleBtn").classList.toggle("on",f.shuffle),p("#repeatBtn").textContent={all:"\u21BB Repeat all",one:"\u21BB Repeat one",off:"\u2192 No repeat"}[f.repeat],p("#repeatBtn").classList.toggle("on",f.repeat!=="off"),Qa()}p("#playlist").addEventListener("click",a=>{let e=a.target.closest("[data-x]");if(e){f.remove(+e.dataset.x),na();return}let t=a.target.closest("li[data-i]");t&&(Le(),f.play(+t.dataset.i))});function Qa(){let a=f.current,e=f.mode;p("#npTitle").textContent=e==="loopback"?"PC audio":e==="mic"?"Microphone":e==="demo"?"Demo groove":a?a.name:"Nothing playing",p("#npSub").textContent=e==="player"?a?`Track ${f.index+1} of ${f.playlist.length}`:"Drop music anywhere":"Live input",p("#playBtn").textContent=p("#playBtn2").textContent=e==="player"&&!f.el.paused?"\u275A\u275A":"\u25B6";for(let[t,i]of[["#srcPlayer","player"],["#srcLoop","loopback"],["#srcMic","mic"],["#srcDemo","demo"]])p(t).classList.toggle("on",e===i)}f.onchange=gt;var bt=p("#seek"),sa=!1;bt.addEventListener("input",()=>{sa=!0});bt.addEventListener("change",()=>{isFinite(f.el.duration)&&(f.el.currentTime=bt.value/1e3*f.el.duration),sa=!1});p("#vol").value=Math.round(m.volume*100);p("#vol").addEventListener("input",a=>{m.volume=a.target.value/100,f.out.gain.value=m.volume,ue()});setInterval(()=>{let a=f.el;!sa&&isFinite(a.duration)&&(bt.value=a.currentTime/a.duration*1e3),p("#tCur").textContent=Da(a.currentTime),p("#tDur").textContent=Da(a.duration)},250);var Ht=new Map;function qa(a){if(a.engine==="milk"){let n=0;for(let r of a.name)n=(n*31+r.charCodeAt(0))%360;return`linear-gradient(90deg,hsl(${n},90%,55%),hsl(${(n+80)%360},90%,50%),hsl(${(n+160)%360},90%,55%))`}let e=JSON.stringify(a.palette);if(Ht.has(e))return Ht.get(e);let t=it(a.palette),i=[];for(let n=0;n<=4;n++){let r=n/4,l=[0,1,2].map(c=>Math.round(255*$(t.a[c]+t.b[c]*Math.cos(6.2831853*(t.c[c]*r+t.d[c])),0,1)));i.push(`rgb(${l})`)}let o=`linear-gradient(90deg,${i.join(",")})`;return Ht.set(e,o),o}function N(){let a=p("#search").value.trim().toLowerCase(),e=yt(D),t=p("#presetList");if(p("#milkCat").classList.toggle("hidden",D!=="milk"),p("#photoBox").classList.toggle("hidden",D!=="photo"),p("#search").classList.toggle("hidden",D==="photo"),D==="photo"&&(_i(),!j.length)){t.innerHTML='<li class="msg">Add a photo and pick a style \u2014 your photo becomes a living visualizer.<br><br>Photos stay on this device. Nothing is uploaded.</li>';return}if(D==="milk"&&!H){t.innerHTML='<li class="msg">Loading MilkDrop library\u2026</li>',ve().then(()=>{Hi(),N()});return}if(D==="user"&&!e.length){t.innerHTML=`<li class="msg">No saved presets yet.<br>Press \u2605 Save (or ${g.label("Y")} on the controller) to keep the current look.</li>`;return}let i=[];for(let n=0;n<e.length;n++){let r=e[n];if(a&&!r.name.toLowerCase().includes(a))continue;let l=r.engine==="milk"?"MilkDrop":D==="photo"?"":(r.photo?"\u{1F4F7} ":"")+(q[r.scene]?.name||"");if(D==="photo"){let c=q[r.scene];i.push(`<li data-i="${n}" class="pstyle ${r.id===u.id?"cur":""}"><span class="sw" style="background:${qa(r)}"></span><span class="nm">${Q(c.name)}<span class="pdesc">${Q(c.desc||"")}</span></span></li>`);continue}if(i.push(`<li data-i="${n}" class="${r.id===u.id?"cur":""}"><span class="sw" style="background:${qa(r)}"></span><span class="nm">${Q(r.name)}</span><span class="s">${Q(l)}</span></li>`),i.length>3e3)break}t.innerHTML=i.join("");let o=t.querySelector(".cur");o&&!t.matches(":hover")&&o.scrollIntoView({block:"nearest"})}function _i(){let a=p("#photoStrip");a.innerHTML=j.map(e=>`<div class="pthumb ${e.id===ne?"on":""}" data-ph="${e.id}" title="${Q(e.name)}"><img src="${e.thumb}" alt=""><button class="pdel" data-del="${e.id}" title="Remove photo">\u2715</button></div>`).join(""),p("#photoHint").textContent=j.length?"Tap a photo, then pick a style \u2193":""}p("#photoStrip").addEventListener("click",async a=>{let e=a.target.closest("[data-del]");if(e){if(a.stopPropagation(),!e.dataset.armed){e.dataset.armed="1",e.textContent="Delete?",e.classList.add("armed"),setTimeout(()=>{e.isConnected&&(delete e.dataset.armed,e.textContent="\u2715",e.classList.remove("armed"))},2500);return}let i=e.dataset.del;await Ma(i),j=j.filter(o=>o.id!==i),ne===i&&(ne=j[0]?.id||null),B.photoId===i&&(B.photoId=null),w("\u2715","Photo removed"),N();return}let t=a.target.closest("[data-ph]");t&&(ne=t.dataset.ph,ei())});function ei(){let a=$a(ne);if(!a.length){N();return}let e=Math.max(0,a.findIndex(t=>t.scene===u.scene));oe=e,Y(a[e])}async function ra(a){let e=[...a].filter(o=>/^image\//.test(o.type)||/\.(jpe?g|png|webp|gif|bmp|avif|heic)$/i.test(o.name));if(!e.length)return!1;w("\u{1F4F7}",e.length>1?`Adding ${e.length} photos\u2026`:"Adding photo\u2026");let t=null;for(let o of e)try{t=await Pa(o,pe?1600:2048),j.unshift(t)}catch{w("\u26A0",`Could not read ${o.name}`)}if(!t)return!0;ne=t.id,Ni(),ei(),w("\u{1F4F7}","Photo added \u2014 now pick a style");let i=p("#presetList");return i.classList.remove("pickme"),i.offsetWidth,i.classList.add("pickme"),!0}function Ni(){ce(".tab").forEach(a=>a.classList.toggle("on",a.dataset.tab==="presets")),ce(".tabpage").forEach(a=>a.classList.toggle("on",a.id==="tab-presets")),ce(".cbtn").forEach(a=>a.classList.toggle("on",a.dataset.coll==="photo")),D="photo",N(),document.body.classList.contains("mobile")&&!document.body.classList.contains("sheet-visuals")&&dt("visuals")}p("#photoIn").onchange=async a=>{await ra(a.target.files),a.target.value=""};ka().then(a=>{j=a,ne=a[0]?.id||null,D==="photo"&&N()});p("#presetList").addEventListener("click",a=>{let e=a.target.closest("li[data-i]");e&&(oe=+e.dataset.i,Y(yt(D)[oe]))});p("#search").addEventListener("input",N);function Hi(){let a=p("#milkCat"),e=Object.keys(De).sort(),t=Me("all").length;a.innerHTML=`<option value="all">All MilkDrop (${t})</option><option value="classic">Classic Butterchurn (${ht.length})</option>`+e.map(i=>`<option value="${i}">${i} (${De[i].length})</option>`).join(""),a.value=me}p("#milkCat").addEventListener("change",a=>{me=a.target.value,oe=-1,N()});ce(".cbtn").forEach(a=>a.onclick=()=>{ce(".cbtn").forEach(e=>e.classList.toggle("on",e===a)),D=a.dataset.coll,oe=-1,N()});ce(".tab").forEach(a=>a.onclick=()=>{ce(".tab").forEach(e=>e.classList.toggle("on",e===a)),ce(".tabpage").forEach(e=>e.classList.toggle("on",e.id==="tab-"+a.dataset.tab)),a.dataset.tab==="tweak"&&se()});var Ua=[["trail","Tracers",0,.97],["zoom","Tunnel Zoom",.96,1.06],["spin","Spin",-.03,.03],["warp","Warp",0,2],["breathe","Breathing",0,2],["melt","Melt",0,2],["hueDrift","Color Drift",-.05,.05],["hueSpin","Hue Cycle",-.3,.3],["kaleido","Kaleidoscope",0,16,1],["kaleidoSpin","Kaleido Spin",-1,1],["mirror","Mirror",0,1,1],["fusion","MilkDrop Fusion",0,1],["react","Audio Reactivity",0,2.5],["speed","Speed",0,3],["chroma","Chromatic",0,3],["bloom","Bloom",0,2],["exposure","Exposure",.4,2],["saturation","Saturation",0,2],["contrast","Contrast",.6,1.6],["grain","Film Grain",0,1],["vignette","Vignette",0,1.5],["#","Music motion"],["dance","Shape Dance",0,2.5],["ripple","Beat Ripples",0,2.5],["punch","Bass Punch",0,2.5],["shake","Beat Shake",0,2.5],["swirlA","Audio Swirl",0,2.5],["bulgeA","Bass Bulge",0,2.5]];p("#sceneSel").innerHTML=Ce.map(a=>`<option value="${a.id}">${a.name}</option>`).join("")+'<optgroup label="Photo styles">'+Ze.map(a=>`<option value="${a.id}">\u{1F4F7} ${a.name}</option>`).join("")+'</optgroup><option value="__milk">MilkDrop engine</option>';p("#palSel").innerHTML=W.map((a,e)=>`<option value="${e}">${a.name}</option>`).join("")+'<option value="custom">Custom (generated)</option>';function _a(a,e,t,i,o,n,r){let l=document.createElement("div");l.className="sl "+(n||"");let c=o||(t-e)/400;l.innerHTML=`<span title="${Q(a)}">${Q(a)}</span><input type="range" min="${e}" max="${t}" step="${c}" value="${i}"><span class="v"></span>`;let d=l.querySelector("input"),h=l.querySelector(".v"),x=()=>h.textContent=(+d.value).toFixed(o===1?0:2);return x(),d.addEventListener("input",()=>{x(),r(+d.value),Be()}),l._set=y=>{document.activeElement!==d&&(d.value=y,x())},l}var Gt={},Ot=[];function se(){if(!p("#tab-tweak").classList.contains("on"))return;if(p("#pName").value=u.name,p("#sceneSel").value=u.engine==="milk"?"__milk":u.scene,p("#palSel").value=typeof u.palette=="number"?String(u.palette):"custom",p("#milkRow").classList.toggle("hidden",!(u.engine==="milk"||u.fx.fusion>0)),H){let n=Me("all");p("#milkSel").options.length!==n.length&&(p("#milkSel").innerHTML=n.map(r=>`<option>${Q(r)}</option>`).join(""))}H&&(p("#milkSel").value=u.engine==="milk"?u.milk:Se||"");let a=p("#paramSliders"),e=q[u.scene],t=u.engine+":"+u.scene;a._key!==t?(a._key=t,a.innerHTML="",Ot=[],u.engine==="scene"&&e?(e.params.forEach((n,r)=>{let l=_a(n.n,n.min,n.max,u.params[r],0,(e.stick||[]).includes(r)?"stick":"",c=>{u.params[r]=c});Ot.push(l),a.appendChild(l)}),p("#stickNames").textContent=(e.stick||[0,1]).map(n=>e.params[n].n).join(" & ")):(a.innerHTML='<p class="fine">MilkDrop presets carry their own math \u2014 shape them with the Trip FX below, the triggers, and the kaleidoscope.</p>',p("#stickNames").textContent="\u2014")):Ot.forEach((n,r)=>n._set(u.params[r]));let i=p("#fxSliders");i.children.length?Ua.forEach(([n])=>{Gt[n]&&Gt[n]._set(u.fx[n]??ae[n]??0)}):Ua.forEach(([n,r,l,c,d])=>{if(n==="#"){let x=document.createElement("h3");x.textContent=r,i.appendChild(x);return}let h=_a(r,l,c,u.fx[n]??0,d,"",x=>{u.fx[n]=x,n==="fusion"&&x>0&&ve().then(()=>{Se||Ge(Yt()),p("#milkRow").classList.remove("hidden"),se()})});Gt[n]=h,i.appendChild(h)});let o=G.some(n=>n.id===u.id);p("#overwriteBtn").classList.toggle("hidden",!o),p("#deleteBtn").classList.toggle("hidden",!o)}p("#pName").addEventListener("change",a=>{u.name=a.target.value,p("#presetName").textContent=u.name});p("#sceneSel").addEventListener("change",a=>{let e=a.target.value;if(e==="__milk"){ve().then(()=>Y(Kt(Se||Yt())));return}let t=q[e];Y({...u,id:"edit-"+Date.now(),engine:"scene",scene:e,params:t.params.map(i=>i.def),name:t.name+" (custom)",builtin:!1},{quiet:!0})});p("#palSel").addEventListener("change",a=>{a.target.value!=="custom"&&(u.palette=+a.target.value)});p("#milkSel").addEventListener("change",a=>{let e=a.target.value;u.engine==="milk"?(u.milk=e,u.name=e,p("#presetName").textContent=e):u.milk=e,Ge(e)});var Gi=[["#","Display"],["resolution","Output resolution","select",{native:"Native (match screen)",2160:"4K \xB7 2160p",1440:"1440p",1080:"1080p",900:"900p",720:"720p",540:"540p (potato mode)"}],["renderScale","Render scale","select",{auto:"Auto (adaptive)","0.5":"50%","0.67":"67%","0.75":"75%","0.85":"85%",1:"100%","1.25":"125% \xB7 supersampled","1.5":"150% \xB7 supersampled",2:"200% \xB7 supersampled"}],["aa","Anti-aliasing","select",{off:"Off \xB7 crisp (default)",auto:"Auto (smooth when GPU has room)","2x":"2\xD7 supersampling","4x":"4\xD7 supersampling"}],["fpsCap","Frame rate cap","select",{0:"Unlimited (VSync)",144:"144 fps",120:"120 fps",60:"60 fps",30:"30 fps"}],["autoExposure","Auto exposure","toggle","Keeps every preset from blowing out to white (or sinking to black)"],["startFullscreen","Start in fullscreen","toggle","Open straight into fullscreen next launch"],["uiScale","Interface size","range",[.75,1.5,.05,"\xD7"]],["uiAutoHide","Auto-hide interface","toggle","Panels fade away when you are not using the mouse"],["showFps","Show FPS & resolution","toggle",""],["#","Music reaction"],["reactIntensity","Reaction intensity","range",[0,3,.05,"\xD7"]],["idleDance","Music dance","toggle","Shapes, lens and camera always move with the music \u2014 your controller adds on top"],["beatRipples","Beat ripples","toggle","Every kick sends a shockwave through the image"],["beatPulse","Bass punch","range",[0,2,.05,"\xD7"]],["beatFlash","Drop flashes","range",[0,1,.05,""]],["cameraShake","Beat shake","range",[0,1.5,.05,""]],["beatSens","Beat sensitivity","range",[0,2,.05,""]],["gainBass","Bass gain","range",[0,3,.05,"\xD7"]],["gainMid","Mid gain","range",[0,3,.05,"\xD7"]],["gainHigh","Treble gain","range",[0,3,.05,"\xD7"]],["outputDevice","Audio output","select",{default:"System default"}],["#","Autopilot"],["autopilot","Autopilot","toggle","Keeps changing presets on its own, even while you play"],["autoPause","Pause autopilot while I play","toggle","Hold the current preset while you are using the controller"],["autoInterval","Time per preset","range",[8,120,1,"s"]],["autoSource","Autopilot plays","select",{mix:"Everything mixed",mixp:"Everything + my photos",photo:"My photos only",eye:"Eye Candy presets",flux:"Flux engine",generate:"Fresh generated presets",milk:"MilkDrop library",user:"My presets",all:"Eye Candy + MilkDrop"}],["autoOnDrop","Switch on drops","toggle","Jump to a new preset when the beat drops"],["idle","Resume after I stop playing","range",[3,120,1,"s"]],["transition","Transition length","range",[.2,4,.1,"s"]],["#","Controller"],["stickSens","Stick sensitivity","range",[.3,2.5,.05,"\xD7"]],["invertY","Invert Y axis","toggle",""],["deadzone","Stick deadzone","range",[0,.4,.01,""]],["rumble","Rumble","toggle","Feel the bass in your hands"],["rumbleStrength","Rumble strength","range",[0,1,.05,""]],["touchMode","PS touchpad / right-drag","select",{both:"Vortex + paint light",vortex:"Vortex only",paint:"Paint light only",off:"Off"}],["@touchpad"]],he={deadzone:a=>g.deadzone=a,uiScale:a=>we.setProperty("--ui",a),outputDevice:a=>f.setOutput(a).then(e=>w("\u{1F508}",e?"Audio output changed":"Could not switch output")),renderScale:()=>{s.quality={}},aa:()=>{s.quality={}},autopilot:a=>p("#autoBtn").classList.toggle("on",a)};async function Oi(a){try{(await navigator.mediaDevices.enumerateDevices()).filter(t=>t.kind==="audiooutput"&&t.deviceId!=="default").forEach(t=>{let i=document.createElement("option");i.value=t.deviceId,i.textContent=t.label||"Output "+t.deviceId.slice(0,5),a.appendChild(i)}),a.value=m.outputDevice}catch{}}function Pt(){let a=p("#settingsForm");a.innerHTML="";for(let[e,t,i,o]of Gi){if(e==="#"){let r=document.createElement("h3");r.className="sethead",r.textContent=t,a.appendChild(r);continue}let n=document.createElement("div");if(n.className="set",e==="@touchpad"){n.innerHTML=`<div>PS touchpad<div class="d" id="tpStatus">${Q(_.status)}</div></div><button class="mini" id="tpBtn">${_.connected?"Reconnect":"Connect"}</button>`,n.querySelector("#tpBtn").onclick=async()=>{let r=await _.request();w("\u25C9",r?"Touchpad connected \u2014 swipe to stir the visuals":"No PlayStation controller found")},a.appendChild(n);continue}if(i==="toggle")n.innerHTML=`<div>${t}<div class="d">${o}</div></div><div class="toggle ${m[e]?"on":""}"></div>`,n.querySelector(".toggle").onclick=r=>{m[e]=!m[e],r.target.classList.toggle("on",m[e]),ue(),he[e]&&he[e](m[e])};else if(i==="select"){n.innerHTML=`<div>${t}</div><select>${Object.entries(o).map(([l,c])=>`<option value="${l}" ${String(m[e])===l?"selected":""}>${c}</option>`).join("")}</select>`;let r=n.querySelector("select");e==="outputDevice"&&Oi(r),r.onchange=l=>{m[e]=l.target.value,ue(),he[e]&&he[e](m[e])}}else{let[r,l,c,d]=o;n.innerHTML=`<div>${t} <span class="d">${m[e]}${d}</span></div><input type="range" min="${r}" max="${l}" step="${c}" value="${m[e]}">`,n.querySelector("input").oninput=h=>{m[e]=+h.target.value,n.querySelector(".d").textContent=m[e]+d,ue(),he[e]&&he[e](m[e])}}a.appendChild(n)}}_.onstatus=a=>{let e=document.getElementById("tpStatus");e&&(e.textContent=a),_.connected&&w("\u25C9",a)};function la(){let a=t=>`<span class="k">${g.label(t)}</span>`,e=[["Left stick","Steer","Fly the camera / drag the trails"],["Right stick","Morph","Bend the two \u25C9 shape params live"],[a("LT"),"Warp","Squeeze into infinite feedback tunnels"],[a("RT"),"Drive","Overdrive audio reaction, bloom & speed"],[a("LT")+"+"+a("RT"),"Hyperdrive","Both triggers fully \u2014 hold on"],[a("LB"),"Kaleidoscope","Tap to cycle \xB7 hold for mirror world"],[a("RB"),"Palette","Tap next colors \xB7 hold to spin hues"],["\u25C0 \u25B6","Presets","Previous / next look"],["\u25B2 \u25BC","Time","Speed up, slow down, even reverse"],[a("A"),"Burst","Shockwave + flash. Hit it on the beat"],[a("B"),"Freeze","Hold to stop time while trails melt on"],[a("X"),"Randomize","Tap remix \xB7 hold for a brand-new preset"],[a("Y"),"Save","Keep this exact look in My Presets"],[a("L3"),"Reset view","Click left stick"],[a("R3"),"Lock shape","Click right stick to keep the morph"],[a("START"),"Menu","Show / hide the panels"],[a("BACK"),"This guide","Hold to toggle autopilot"],["Touchpad","Stir (PS)","Swipe to swirl & paint \xB7 pinch/twist \xB7 click = Music dance on/off"]];p("#cgrid").innerHTML=e.map(([t,i,o])=>`<div class="cg"><span class="k">${t.startsWith("<")?t.replace(/<\/?span[^>]*>/g,""):t}</span><div><b>${i}</b><small>${o}</small></div></div>`).join(""),ce("[data-g]").forEach(t=>t.textContent=g.label(t.dataset.g))}p("#controls").addEventListener("click",a=>{a.target.id==="controls"&&ke(!1)});window.addEventListener("keydown",a=>{if(a.target.matches("input,select,textarea"))return;Be(),f.resume();let e=a.key;e==="ArrowRight"?xe(1):e==="ArrowLeft"?xe(-1):e==="ArrowUp"?vt(1):e==="ArrowDown"?vt(-1):e===" "?(a.preventDefault(),Xe(1)):e==="r"||e==="R"?Jt():e==="g"||e==="G"?Qt():e==="s"||e==="S"?Tt():e==="k"||e==="K"?ja():e==="m"||e==="M"?Wa():e==="p"||e==="P"?Va(1):e==="f"||e==="F"||e==="F11"?(a.preventDefault(),ia()):e==="h"||e==="H"?(s.cinema=!s.cinema,s.cinema?wt():ta(),w("H",s.cinema?"Interface hidden (H to show)":"Interface on")):e==="Tab"?(a.preventDefault(),Ja()):e==="a"||e==="A"?ea(!m.autopilot):e==="c"||e==="C"?ke(p("#controls").classList.contains("hidden")):e==="Escape"?ke(!1):e==="MediaPlayPause"?f.toggle():e==="MediaTrackNext"?f.next():e==="MediaTrackPrevious"&&f.prev()});var ze=null;le.addEventListener("contextmenu",a=>a.preventDefault());le.addEventListener("pointerdown",a=>{if(a.button===2){fe.active=!0,fe.x=a.clientX/innerWidth,fe.y=a.clientY/innerHeight;return}if(a.button===1){Xe(1,(a.clientX/innerWidth-.5)*innerWidth/innerHeight,.5-a.clientY/innerHeight);return}ze={x:a.clientX,y:a.clientY},Be()});window.addEventListener("pointerup",a=>{a.button===2&&(fe.active=!1)});window.addEventListener("pointermove",a=>{fe.active&&(fe.x=a.clientX/innerWidth,fe.y=a.clientY/innerHeight)});window.addEventListener("pointerup",()=>ze=null);window.addEventListener("pointermove",a=>{ze&&(s.camX+=(a.clientX-ze.x)*.004,s.camY=$(s.camY+(a.clientY-ze.y)*.003,-1.3,1.3),ze={x:a.clientX,y:a.clientY},Be())});le.addEventListener("wheel",a=>{u.fx.trail=$(u.fx.trail-a.deltaY*8e-4,0,.97),jt("LT","Tracers",u.fx.trail/.97),Be(),se()},{passive:!0});le.addEventListener("dblclick",ia);we.setProperty("--ui",m.uiScale);pe&&(s.panels=!1,m.uiAutoHide=!1);X&&m.startFullscreen&&X.setFullscreen&&X.setFullscreen(!0);m.outputDevice!=="default"&&f.setOutput(m.outputDevice);_.autoConnect();X||document.querySelectorAll("[data-act=loopback]").forEach(a=>{a.innerHTML=a.classList.contains("src")?"Tab/PC":"\u{1F50A} Visualize a tab or PC audio",a.title="Pick a tab (e.g. YouTube/Spotify web) or your whole screen and tick \u201CShare audio\u201D"});Ui();gt();Pt();N();la();p("#autoBtn").classList.toggle("on",m.autopilot);p("#presetName").textContent=u.name;D="eye";{let a=Te("eye",pt);oe=pt.indexOf(a),Y(a,{transition:!1,quiet:!0})}var $t=Ce.map(a=>a.id),Xt=0;(function a(){if(Xt>=$t.length){p("#loadbar").style.opacity=0;return}B.sceneProg($t[Xt++]),p("#loadbar div").style.width=Xt/$t.length*100+"%",setTimeout(a,0)})();requestAnimationFrame(Za);window.__eye={get milkCanvas(){return ie},getMilkPreset:Ga,ensureMilk:ve,get milk(){return H},milkNamesFor:Me,startDemoGroove:aa,R:B,audio:f,L:s,get cur(){return u},loadPreset:Y,autoNext:Ya,BUILTIN:be,SCENES:Re,settings:m,get photos(){return j},addPhotoFiles:ra,get collection(){return D}};})();
