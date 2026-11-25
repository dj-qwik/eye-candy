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
}`});var no=`
uniform sampler2D uPhoto; uniform float uPhotoAR;
// photo space: the photo spans y in [-.5,.5] and x in [-AR/2, AR/2]; beyond that it mirrors forever
vec2 phUV(vec2 p){ return vec2(p.x/uPhotoAR+.5, .5-p.y); }
vec3 photo(vec2 p){ return texture(uPhoto, phUV(p)).rgb; }
vec3 photoL(vec2 p, float lod){ return textureLod(uPhoto, phUV(p), lod).rgb; }
float lum(vec3 c){ return dot(c, vec3(.299,.587,.114)); }
vec3 sat(vec3 c, float s){ float l=lum(c); return max(mix(vec3(l), c, s), 0.); }
// screen -> photo space so the photo just covers the screen
vec2 cover(vec2 uv){ float sAR=uRes.x/uRes.y; return uv/max(sAR/uPhotoAR, 1.); }
`,B=a=>A({...a,photo:!0,code:no+a.code});B({id:"ph_mandala",name:"Photo Mandala",desc:"Slices of your photo mirrored into a turning kaleidoscope",params:[{n:"Segments",min:3,max:16,def:8,ms:.25},{n:"Spin",min:0,max:1,def:.3},{n:"Zoom",min:.3,max:3,def:1.1},{n:"Pan X",min:-1,max:1,def:0},{n:"Pan Y",min:-1,max:1,def:0},{n:"Bass Breath",min:0,max:2,def:1},{n:"Seam Glow",min:0,max:2,def:.8},{n:"Inner Swirl",min:0,max:2,def:.5}],stick:[3,4],code:`
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
}`});B({id:"ph_glass",name:"Photo Stained Glass",desc:"Your photo rebuilt as glowing glass panes with lead lines that pulse on the beat",params:[{n:"Panes",min:5,max:40,def:13,ms:.25},{n:"Drift",min:0,max:2,def:.5},{n:"Lead Width",min:.02,max:.25,def:.12},{n:"Lead Glow",min:0,max:2,def:1},{n:"Breathe",min:0,max:2,def:.6},{n:"Photo Detail",min:0,max:1,def:.3},{n:"Pane Light",min:0,max:2,def:1},{n:"Color Boost",min:.5,max:2.5,def:1.5}],stick:[0,5],code:`
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
}`});B({id:"ph_zoom",name:"Infinite Photo",desc:"Your photo framed inside itself forever, spiraling inward",params:[{n:"Frame Ratio",min:1.4,max:4,def:2.2,ms:.15},{n:"Zoom Speed",min:0,max:2,def:.7},{n:"Twist",min:-1,max:1,def:.25,ms:.3},{n:"Frame Glow",min:0,max:2,def:1},{n:"Size",min:.3,max:.5,def:.43},{n:"Bass Kick",min:0,max:2,def:1},{n:"Color Shift",min:0,max:1,def:.2},{n:"Rock",min:0,max:1,def:.3}],stick:[2,0],code:`
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
}`});B({id:"ph_neon",name:"Neon Trace",desc:"The edges in your photo redrawn as glowing neon lines",params:[{n:"Line Gain",min:.5,max:6,def:2.6},{n:"Threshold",min:0,max:.4,def:.08},{n:"Line Width",min:.5,max:3,def:1.2},{n:"Color Flow",min:0,max:2,def:.6},{n:"Photo Ghost",min:0,max:.6,def:.12},{n:"Scan Beam",min:0,max:2,def:1},{n:"Flicker",min:0,max:2,def:.7},{n:"Ripple",min:0,max:2,def:.6}],stick:[0,4],code:`
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
}`});B({id:"ph_land",name:"Photo Terrain",desc:"Brightness becomes height: fly low over a landscape made of your photo",fly:!0,params:[{n:"Height",min:.2,max:2,def:.9},{n:"Speed",min:0,max:2,def:.6},{n:"Scale",min:.1,max:1,def:.35},{n:"Smooth",min:1,max:4,def:2.4},{n:"Spectrum Lift",min:0,max:2,def:.8},{n:"Sky Glow",min:0,max:2,def:1},{n:"Altitude",min:.3,max:1.6,def:.85},{n:"Banking",min:0,max:1,def:.5}],stick:[0,6],code:`
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
}`});B({id:"ph_liquid",name:"Liquid Photo",desc:"Your photo melts and swirls like paint in water, pulsing with the bass",params:[{n:"Melt",min:0,max:1.2,def:.6},{n:"Flow",min:0,max:2,def:.6},{n:"Scale",min:.5,max:4,def:1.6},{n:"Bass Wobble",min:0,max:2,def:1},{n:"Color Bleed",min:0,max:1,def:.35},{n:"Tide",min:0,max:1,def:.5},{n:"Oil Sheen",min:0,max:1.5,def:.5},{n:"Zoom",min:.6,max:1.6,def:1}],stick:[0,2],code:`
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
}`});B({id:"ph_tunnel",name:"Photo Tunnel",desc:"Your photo wrapped around the walls of a tunnel you fly through",fly:!0,params:[{n:"Depth",min:.1,max:1,def:.35},{n:"Speed",min:0,max:2,def:.7},{n:"Wraps",min:1,max:6,def:2,ms:.25},{n:"Twist",min:-1,max:1,def:.2},{n:"Sway",min:0,max:1,def:.4},{n:"Core Glow",min:0,max:2,def:1},{n:"Rings",min:0,max:2,def:.8},{n:"Fog",min:0,max:1,def:.5}],stick:[3,2],code:`
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
}`});B({id:"ph_dots",name:"Halftone Pulse",desc:"Your photo printed as dots that swell with the bass",crisp:!0,params:[{n:"Dots",min:20,max:160,def:70,ms:.2},{n:"Angle Drift",min:0,max:1,def:.3},{n:"Dot Size",min:.4,max:1.4,def:.95},{n:"Bass Swell",min:0,max:2,def:1},{n:"Tint",min:0,max:1,def:.25},{n:"Wave",min:0,max:2,def:.8},{n:"Color Boost",min:.5,max:2.5,def:1.5},{n:"Glow",min:0,max:1,def:.4}],stick:[0,4],code:`
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
}`});var St=`
vec2 cmul(vec2 a, vec2 b){ return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x); }
vec2 cdiv(vec2 a, vec2 b){ return vec2(a.x*b.x+a.y*b.y, a.y*b.x-a.x*b.y)/dot(b,b); }
`;B({id:"ph_hex",name:"Hex Kaleidoscope",desc:"Honeycomb mirrors: your photo folded into a sacred-geometry hex lattice",params:[{n:"Cells",min:1.5,max:8,def:3.2,ms:.25},{n:"Spin",min:0,max:1,def:.25},{n:"Drift",min:0,max:1,def:.3},{n:"Sample Size",min:.15,max:1.5,def:.55},{n:"Turn",min:0,max:1,def:.3},{n:"Pan X",min:-1,max:1,def:0},{n:"Pan Y",min:-1,max:1,def:0},{n:"Edge Glow",min:0,max:2,def:.9}],stick:[5,6],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)*rot(uTime*.05*P1+uCam.x*.5);
  vec2 p=uv*P0*(1.-uBass*.06)+vec2(0.,uTime*.12*P2);
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
  c=vec4(col,1);
}`});B({id:"ph_flower",name:"Photo Flower of Life",desc:"The Flower of Life drawn in light over your photo, petals glowing where circles overlap",crisp:!0,params:[{n:"Circle Size",min:.06,max:.22,def:.12,ms:.2},{n:"Petal Tint",min:0,max:1,def:.55},{n:"Spin",min:0,max:1,def:.2},{n:"Line Glow",min:0,max:2,def:1.1},{n:"Petal Light",min:0,max:2,def:1},{n:"Outer Ring",min:1.5,max:5,def:3.2},{n:"Breath",min:0,max:2,def:1},{n:"Outside Dim",min:0,max:1,def:.7}],stick:[0,2],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)*rot(uTime*.04*P2+uCam.x*.4);
  float R=P0*(1.+uBass*.05*P6);
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
  c=vec4(col,1);
}`});B({id:"ph_hyper",name:"Hyperbolic Photo",desc:"Your photo tiled across a hyperbolic disk, shrinking infinitely toward the rim",params:[{n:"P (sides)",min:3,max:8,def:4,ms:.2},{n:"Q (meet)",min:3,max:8,def:5,ms:.2},{n:"Drift",min:0,max:2,def:.5},{n:"Line Glow",min:0,max:2,def:.9},{n:"Photo Scale",min:.3,max:3,def:1.2},{n:"Spin",min:-1,max:1,def:.1},{n:"Disk Zoom",min:.6,max:1.5,def:1},{n:"Mirror Tint",min:0,max:1,def:.3}],stick:[2,4],code:St+`
vec2 mobius(vec2 z, vec2 a){ return cdiv(z-a, vec2(1,0)-cmul(vec2(a.x,-a.y),z)); }
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)*1.05/P6;
  float r0=length(uv);
  vec3 bg=photoL(uv*.6,5.)*.18;
  if(r0>=1.){ c=vec4(bg+pal(.5)*glowLine(r0-1.,.004)*.03*P3,1); return; }
  float p=floor(P0+.5), q=floor(P1+.5);
  if((p-2.)*(q-2.)<=4.) q=floor(4./(p-2.))+3.;
  float pa=PI/p, qa=PI/q;
  float rr=1./sqrt(cos(qa)*cos(qa)/(sin(pa)*sin(pa))-1.);
  float cx=sqrt(1.+rr*rr);
  vec2 drift=.3*vec2(sin(uTime*.2*P2),cos(uTime*.17*P2))*P2+uCam.xy*.4;
  drift*=min(1.,.9/max(length(drift),.001));
  vec2 z=mobius(uv,drift*.8)*rot(uTime*P5*.3);
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
  c=vec4(col,1);
}`});B({id:"ph_cube",name:"Photo Cube",desc:"A floating cube wrapped in your photo, tumbling to the beat",params:[{n:"Spin",min:0,max:2,def:.6},{n:"Size",min:.6,max:1.6,def:1},{n:"Edge Neon",min:0,max:2,def:1},{n:"Bounce",min:0,max:2,def:1},{n:"Distance",min:4.5,max:10,def:6.5,ms:.3},{n:"Backdrop",min:0,max:1,def:.35},{n:"Tilt",min:-1,max:1,def:.3},{n:"Shine",min:0,max:2,def:1}],stick:[0,6],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  float t=uTime*.35*P0+uBeatCount*.12*P3;
  vec3 ro=vec3(0,0,-P4), rd=normalize(vec3(uv,1.6));
  mat2 ry=rot(t+uCam.x*1.5), rx=rot(.5+P6*.6+sin(t*.7)*.3+uCam.y);
  ro.xz*=ry; rd.xz*=ry; ro.yz*=rx; rd.yz*=rx;
  float s=P1*(1.+uBass*.08*P3+exp(-uSinceBeat*4.)*.05*P3);
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
  c=vec4(col,1);
}`});B({id:"ph_prism",name:"Prism Split",desc:"Your photo seen through triangular crystal facets that split it into rainbow light",params:[{n:"Facets",min:2,max:14,def:6,ms:.25},{n:"Dispersion",min:0,max:2,def:.9},{n:"Shift",min:0,max:2,def:.7},{n:"Edge Light",min:0,max:2,def:.8},{n:"Spin",min:0,max:1,def:.2},{n:"Bass Shatter",min:0,max:2,def:1},{n:"Facet Tint",min:0,max:1,def:.25},{n:"Zoom",min:.6,max:1.6,def:1}],stick:[0,1],code:`
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
  float amt=(.02+.05*P2*(.6+.4*sin(uTime*.4+h21(tid)*6.)))*(1.+uBass*P5*.8);
  vec2 base=uv+o*amt;
  float d=.006*P1*(1.+uHigh);
  vec3 col=vec3(photo(base+o*d).r, photo(base).g, photo(base-o*d).b);
  col=mix(col, col*pal(h21(tid)+uTime*.02)*1.6, P6*.5);
  col*=.85+.3*h21(tid+3.);
  col+=pal(.1+h21(tid))*glowLine(e,.012)*.06*P3*(.4+uBeat*1.4);
  c=vec4(sat(col,1.15),1);
}`});B({id:"ph_ribbon",name:"Twisted Ribbons",desc:"Your photo printed on ribbons that twist and wave through space",params:[{n:"Ribbons",min:1,max:6,def:4,ms:.2},{n:"Twist",min:0,max:3,def:1.2},{n:"Wave",min:0,max:2,def:.8},{n:"Width",min:.05,max:.3,def:.15},{n:"Speed",min:0,max:2,def:.7},{n:"Back Tint",min:0,max:1,def:.6},{n:"Glow",min:0,max:2,def:1},{n:"Backdrop",min:0,max:1,def:.2}],stick:[1,2],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)*rot(uCam.x*.3);
  vec3 col=photoL(uv*.5,6.)*P7*.6;
  float N=floor(P0+.5);
  for(int i=0;i<6;i++){ if(float(i)>=N) break;
    float fi=float(i), ph=fi*1.7+uTime*.6*P4;
    float yc=(fi-(N-1.)*.5)*.9/N+sin(uv.x*2.2*P2+ph)*.12*P2*(1.+uBass*.4)+uCam.y*.2;
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
  c=vec4(col,1);
}`});B({id:"ph_spiral",name:"Droste Spiral",desc:"Escher-style spiral: your photo nested inside itself, curling forever inward",params:[{n:"Ratio",min:1.5,max:6,def:3,ms:.15},{n:"Flow",min:0,max:2,def:.6},{n:"Arms",min:1,max:3,def:1,ms:.2},{n:"Seam Glow",min:0,max:2,def:1.3},{n:"Photo Scale",min:.4,max:1.5,def:.9},{n:"Spin",min:-1,max:1,def:.15},{n:"Bass Pump",min:0,max:2,def:1},{n:"Color Shift",min:0,max:1,def:.15}],stick:[0,4],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)*rot(uTime*.05*P5+uCam.x*.5);
  float r=max(length(uv),1e-5), a=atan(uv.y,uv.x);
  float lk=log(P0), arms=floor(P2+.5);
  float u=log(r)-a*lk*arms/TAU-uTime*.15*P1-uBass*.05*P6;
  float m=mod(u,lk);
  float rr=exp(m-lk);
  vec2 q=rr*vec2(cos(a),sin(a))*P4;
  float lev=floor(u/lk);
  vec3 col=sat(photo(q*.5/max(uPhotoAR,1.)),1.1);
  col=mix(col,col*pal(lev*.17+uTime*.02)*1.7,P7);
  float seam=min(m,lk-m)*r;
  col+=pal(.3+lev*.1)*glowLine(seam,.003)*.04*P3*(.4+uBeat*1.4);
  c=vec4(col,1);
}`});B({id:"ph_julia",name:"Photo Julia",desc:"Your photo poured through a living Julia-set fractal",params:[{n:"Morph",min:0,max:2,def:.5},{n:"Iterations",min:3,max:12,def:7,ms:.2},{n:"Photo Scale",min:.1,max:1.5,def:.45},{n:"Zoom",min:.6,max:2.5,def:1.3},{n:"Shape",min:-1,max:1,def:0},{n:"Depth Glow",min:0,max:2,def:.8},{n:"Bass Warp",min:0,max:2,def:1},{n:"Spin",min:0,max:1,def:.15}],stick:[4,0],code:St+`
void mainImage(out vec4 c, in vec2 fc){
  vec2 z=UV(fc)*rot(uTime*.05*P7+uCam.x*.5)*2.4/P3;
  float ang=uTime*.07*P0+P4*1.5+uCam.y;
  vec2 cc=vec2(-.75,.0)+.38*vec2(cos(ang),sin(ang))+vec2(uBass*.03*P6,0.);
  float it=0.; float N=floor(P1+.5);
  for(int i=0;i<12;i++){ if(float(i)>=N||dot(z,z)>16.) break; z=cmul(z,z)+cc; it++; }
  vec3 col=sat(photo(z*P2),1.2);
  float esc=it/N;
  col*=.55+.6*esc;
  col+=pal(esc*.8+uTime*.03)*(1.-esc)*.25*P5*(.5+uBass);
  c=vec4(col,1);
}`});B({id:"ph_trap",name:"Orbit Trap",desc:"A Mandelbrot dive where your photo is caught in the fractal's orbits",params:[{n:"Dive",min:0,max:2,def:.6},{n:"Trap Size",min:.2,max:1.5,def:.6},{n:"Iterations",min:16,max:64,def:40,ms:.2},{n:"Glow",min:0,max:2,def:1},{n:"Spot",min:0,max:3,def:0,ms:.2},{n:"Spin",min:0,max:1,def:.2},{n:"Bass Pulse",min:0,max:2,def:1},{n:"Fill",min:0,max:1,def:.35}],stick:[1,0],code:St+`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)*rot(uTime*.04*P5+uCam.x*.4);
  int spot=int(floor(P4+.5));
  vec2 ctr=spot==0?vec2(-.7453,.1127):spot==1?vec2(-.1011,.9563):spot==2?vec2(.2549,.0005):vec2(-1.4012,0.);
  float zoom=exp(-(.6+1.6*(.5+.5*sin(uTime*.05*P0-1.57))))*(1.-uBass*.05*P6);
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
  c=vec4(col,1);
}`});B({id:"ph_sort",name:"Pixel Sort",desc:"Glitch-art streaks: bright parts of your photo drip and smear like sorted pixels",params:[{n:"Threshold",min:0,max:.9,def:.4},{n:"Streak Length",min:0,max:1,def:.65},{n:"Angle",min:-1,max:1,def:0},{n:"Bass Melt",min:0,max:2,def:1},{n:"Smear",min:0,max:1,def:.6},{n:"Color Pop",min:.8,max:2,def:1.3},{n:"Flow",min:0,max:2,def:.5},{n:"Glitch Hits",min:0,max:2,def:1}],stick:[0,1],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=cover(UV(fc));
  mat2 Rm=rot(P2*1.57+uCam.x*.5);
  vec2 dir=Rm*vec2(0.,-1.);
  float thr=P0-uBass*.15*P3-exp(-uSinceBeat*3.)*.15*P7;
  float l=lum(photoL(uv,2.5));
  float len=P1*.35*smoothstep(thr,thr+.25,l)*(.7+.3*sin(uTime*.3*P6+dot(uv,vec2(9.,3.))));
  vec3 avg=vec3(0), best=photo(uv); float bl=lum(best);
  for(int i=1;i<12;i++){ float k=float(i)/11.; vec3 s=photo(uv+dir*len*k); avg+=s; float sl=lum(s); if(sl>bl){ bl=sl; best=s; } }
  avg/=11.;
  vec3 col=mix(best, avg, P4*.5);
  float band=h11(floor(uv.y*60.)+floor(uTime*6.));
  if(band>1.-exp(-uSinceBeat*6.)*.08*P7) col=photo(uv+vec2(.03*(band-.5),0.));
  c=vec4(sat(col,P5),1);
}`});B({id:"ph_vhs",name:"VHS Dream",desc:"Your photo as a warm, wobbly old videotape with tracking glitches on the beat",params:[{n:"Wobble",min:0,max:2,def:.8},{n:"Color Bleed",min:0,max:2,def:1},{n:"Scanlines",min:0,max:1,def:.5},{n:"Tape Noise",min:0,max:1,def:.35},{n:"Tracking Hits",min:0,max:2,def:1},{n:"Warmth",min:0,max:1,def:.5},{n:"Zoom",min:.8,max:1.4,def:1},{n:"Roll",min:0,max:1,def:.2}],stick:[0,1],code:`
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
  c=vec4(col,1);
}`});B({id:"ph_mosaic",name:"Photomosaic",desc:"Your photo built from hundreds of tiny copies of itself",params:[{n:"Tiles",min:8,max:60,def:22,ms:.2},{n:"Tint",min:0,max:1,def:.65},{n:"Dive",min:0,max:1,def:.4},{n:"Grout",min:0,max:.2,def:.06},{n:"Tile Pop",min:0,max:2,def:1},{n:"Drift",min:0,max:1,def:.3},{n:"Real Photo",min:0,max:1,def:.15},{n:"Shimmer",min:0,max:2,def:.8}],stick:[0,1],code:`
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
  col*=1.+P4*.6*exp(-uSinceBeat*3.)*step(.82,fract(hid+uBeatCount*.37));
  col*=1.+P7*.25*fft(hid)*uHigh;
  col=mix(col, photo(uv), P6);
  float gr=min(min(f.x,1.-f.x),min(f.y,1.-f.y));
  col*=smoothstep(0.,P3*.5+.001,gr)*.85+.15;
  c=vec4(col,1);
}`});B({id:"ph_pop",name:"Pop Art",desc:"Warhol-style panels of your photo in bold flat colours that swap on the beat",crisp:!0,params:[{n:"Panels",min:1,max:4,def:2,ms:.2},{n:"Color Levels",min:2,max:5,def:3,ms:.2},{n:"Ink Lines",min:0,max:2,def:1},{n:"Dots",min:0,max:1,def:.35},{n:"Swap Speed",min:0,max:2,def:1},{n:"Panel Gap",min:0,max:.08,def:.02},{n:"Contrast",min:.6,max:2,def:1.2},{n:"Zoom",min:.7,max:1.5,def:1}],stick:[0,1],code:`
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
  c=vec4(col*(.95+uBass*.12),1);
}`});B({id:"ph_ascii",name:"ASCII Art",desc:"Your photo typed out in glowing text characters, like an old terminal",crisp:!0,params:[{n:"Characters",min:24,max:110,def:44,ms:.2},{n:"Terminal Green",min:0,max:1,def:.2},{n:"Brightness",min:.6,max:2,def:1.2},{n:"Rain",min:0,max:2,def:.7},{n:"Glow",min:0,max:2,def:.8},{n:"Contrast",min:.6,max:2,def:1.2},{n:"Beat Flash",min:0,max:2,def:1},{n:"Back Photo",min:0,max:.5,def:.06}],stick:[0,5],code:`
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
  c=vec4(col,1);
}`});B({id:"ph_weave",name:"Woven Threads",desc:"Your photo woven from shimmering threads that ripple with the bass",params:[{n:"Threads",min:30,max:180,def:80,ms:.2},{n:"Shimmer",min:0,max:2,def:1},{n:"Ripple",min:0,max:2,def:.8},{n:"Thread Depth",min:0,max:1,def:.6},{n:"Color Play",min:0,max:1,def:.2},{n:"Gaps",min:0,max:.3,def:.08},{n:"Pattern",min:1,max:3,def:1,ms:.2},{n:"Zoom",min:.7,max:1.5,def:1}],stick:[0,2],code:`
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
  float shine=pow(max(prof,0.),8.)*(.4+.6*sin(along*3.14+uTime*2.+id.x*.3+id.y*.2))*P1*(.5+uHigh);
  vec3 col=pc*tint*mix(1.,.45+.75*prof,P3)+vec3(shine*.35);
  col*=smoothstep(0.,P5+.001,prof)*.8+.2;
  c=vec4(col,1);
}`});B({id:"ph_disco",name:"Disco Ball",desc:"A mirror ball whose facets reflect your photo, throwing sparkles around the room",params:[{n:"Facets",min:8,max:30,def:16,ms:.2},{n:"Spin",min:0,max:2,def:.6},{n:"Size",min:.22,max:.45,def:.33},{n:"Sparkle",min:0,max:2,def:1},{n:"Light Spots",min:0,max:2,def:1},{n:"Reflection",min:.3,max:2,def:1},{n:"Room Photo",min:0,max:1,def:.3},{n:"Wobble",min:0,max:1,def:.3}],stick:[1,0],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  float spin=uTime*.25*P1+uCam.x;
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
    float spark=step(.93,fract(fid+uTime*.7))*P3*(.5+uHigh*1.5);
    col=sat(refl,1.2)*(.55+.6*fn.z*0.+.45)*grout+spark*vec3(1.2);
    col*=.7+.4*smoothstep(-1.,1.,-n.z);
  } else col+=pal(.1)*glowLine(sqrt(d2)-R,.01)*.02*(.5+uBeat);
  c=vec4(col,1);
}`});B({id:"ph_thermal",name:"Thermal Vision",desc:"Your photo seen through a heat camera, glowing hotter with the bass",params:[{n:"Heat",min:.5,max:1.8,def:1},{n:"Shimmer",min:0,max:2,def:.8},{n:"Bass Heat",min:0,max:2,def:1},{n:"Edge Glow",min:0,max:2,def:.8},{n:"Scan",min:0,max:1,def:.4},{n:"Palette",min:0,max:1,def:0},{n:"Pulse Rings",min:0,max:2,def:.8},{n:"Zoom",min:.8,max:1.4,def:1}],stick:[0,2],code:`
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
  c=vec4(col,1);
}`});B({id:"ph_holo",name:"Hologram",desc:"Your photo as a flickering sci-fi hologram with scanlines and glitches",params:[{n:"Flicker",min:0,max:2,def:.8},{n:"Scanlines",min:0,max:2,def:1},{n:"Glitch",min:0,max:2,def:1},{n:"Hue",min:0,max:1,def:.55},{n:"RGB Split",min:0,max:2,def:.8},{n:"Detail",min:.6,max:2,def:1.2},{n:"Projection Fade",min:0,max:1,def:.5},{n:"Size",min:.6,max:1.2,def:.9}],stick:[3,0],code:`
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
  vec3 col=tint*l*1.3+vec3(r-g,0.,b-g)*.6;
  col*=1.-P1*.35*(.5+.5*sin(fc.y*1.6+uTime*14.));
  col*=1.-P0*.2*step(.92,h11(floor(uTime*20.)));
  col+=tint*smoothstep(.02,0.,abs(fract(y*1.5-uTime*.3)-.5))*.25;
  float fade=mix(1.,smoothstep(.95,.25,abs(uv.x)/max(uRes.x/uRes.y*.5,.1))*smoothstep(-.5,-.2,uv.y)*1.1,P6);
  c=vec4(col*fade,1);
}`});B({id:"ph_rays",name:"Cathedral Light",desc:"Light pours through the bright parts of your photo in glowing shafts",params:[{n:"Ray Strength",min:0,max:2.5,def:1.3},{n:"Ray Length",min:.2,max:1,def:.8},{n:"Threshold",min:-.2,max:.5,def:.08},{n:"Light Drift",min:0,max:2,def:.6},{n:"Bass Beams",min:0,max:2,def:1},{n:"Photo Dim",min:.1,max:1,def:.32},{n:"Warm Light",min:0,max:1,def:.4},{n:"Dust",min:0,max:1,def:.4}],stick:[0,1],code:`
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
  c=vec4(col,1);
}`});B({id:"ph_shatter",name:"Shatter",desc:"Your photo cracks into glass shards that burst apart on the beat and settle back",params:[{n:"Shards",min:3,max:20,def:8,ms:.2},{n:"Burst",min:0,max:2,def:1},{n:"Spin",min:0,max:2,def:.8},{n:"Crack Glint",min:0,max:2,def:1},{n:"Drift",min:0,max:1,def:.3},{n:"Shard Tint",min:0,max:1,def:.25},{n:"Depth",min:0,max:1,def:.5},{n:"Settle",min:.5,max:4,def:2}],stick:[0,1],code:`
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
  col*=.85+.3*hid*P6;
  float crack=smoothstep(.04+ex*.05,.0,edge);
  col=mix(col, vec3(.01), crack*.85);
  col+=pal(.1+hid*.3)*glowLine(edge,.006)*.04*P3*(.3+ex*2.+uHigh);
  c=vec4(col,1);
}`});B({id:"ph_water",name:"Water Reflection",desc:"Your photo above a lake, reflected in ripples that rain down on every beat",landscape:!0,params:[{n:"Horizon",min:-.3,max:.2,def:-.08},{n:"Ripples",min:0,max:2,def:1},{n:"Rain Drops",min:0,max:2,def:1},{n:"Water Tint",min:0,max:1,def:.4},{n:"Reflect",min:.3,max:1,def:.75},{n:"Wind",min:0,max:2,def:.7},{n:"Shimmer",min:0,max:2,def:1},{n:"Photo Zoom",min:.6,max:1.5,def:1}],stick:[0,1],code:`
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
  c=vec4(col,1);
}`});B({id:"ph_tiles",name:"Flip Tiles",desc:"Your photo on a wall of tiles that flip over in waves with the beat",crisp:!0,params:[{n:"Tiles",min:4,max:24,def:10,ms:.2},{n:"Wave Speed",min:.5,max:4,def:2},{n:"Back Style",min:0,max:1,def:.7},{n:"Gap",min:0,max:.15,def:.04},{n:"Depth Shade",min:0,max:1,def:.6},{n:"Wave Shape",min:0,max:2,def:1,ms:.2},{n:"Idle Flips",min:0,max:1,def:.3},{n:"Zoom",min:.7,max:1.4,def:1}],stick:[0,1],code:`
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
    col+=vec3(.25)*pow(1.-sx,6.)*P4;
  }
  c=vec4(col,1);
}`});B({id:"ph_bubbles",name:"Fisheye Bubbles",desc:"Soap bubbles drift up through your photo, each one a fisheye lens",params:[{n:"Bubbles",min:1.5,max:6,def:2.6,ms:.2},{n:"Rise",min:0,max:2,def:.6},{n:"Size",min:.3,max:1.2,def:.85},{n:"Magnify",min:1,max:4,def:2.2},{n:"Rainbow Film",min:0,max:2,def:1},{n:"Back Blur",min:0,max:6,def:2.5},{n:"Back Dim",min:.2,max:1,def:.55},{n:"Bass Swell",min:0,max:2,def:1}],stick:[0,3],code:`
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
      float R=(.18+.22*h)*P2*(1.+uBass*.12*P7);
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
  c=vec4(col,1);
}`});B({id:"ph_planet",name:"Photo Planet",desc:"Your photo wrapped around a spinning planet with a glowing atmosphere",space:!0,params:[{n:"Spin",min:0,max:2,def:.5},{n:"Size",min:.25,max:.5,def:.37},{n:"Atmosphere",min:0,max:2,def:1},{n:"Sun Angle",min:-1,max:1,def:.4},{n:"Night Side",min:0,max:1,def:.15},{n:"Tilt",min:-1,max:1,def:.3},{n:"Stars",min:0,max:2,def:1},{n:"Moon",min:0,max:1,def:.6}],stick:[0,3],code:`
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
  float R=P1*(1.+uBass*.03);
  float hit;
  vec3 pc=planetCol(uv,vec2(0),R,uTime*.15*P0,P5,sun,hit);
  float r=length(uv);
  col+=pal(.55)*exp(-max(r-R,0.)*28.)*.35*P2*(.5+uBass*.6)*(1.-hit);
  col=mix(col,pc,hit);
  float ma=uTime*.2;
  vec2 mc=vec2(cos(ma),sin(ma)*.35)*R*1.9;
  float mh;
  vec3 mcol=planetCol(uv,mc,R*.22,uTime*.5,0.,sun,mh);
  if(sin(ma)<0.||hit<.5) col=mix(col,mcol,mh*P7);
  c=vec4(col,1);
}`});B({id:"ph_tiny",name:"Tiny Planet",desc:"Your photo curled into a little round world that turns with the music",params:[{n:"Planet Size",min:.15,max:.8,def:.35},{n:"Spin",min:0,max:2,def:.4},{n:"Bass Bounce",min:0,max:2,def:1},{n:"Flip Inside Out",min:0,max:1,def:0,ms:.1},{n:"Horizon Glow",min:0,max:2,def:.8},{n:"Swirl",min:0,max:2,def:.3},{n:"Photo Width",min:.5,max:2,def:1},{n:"Sky Tint",min:0,max:1,def:.2}],stick:[0,5],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)*rot(uCam.x*.6);
  float r=length(uv), a=atan(uv.y,uv.x)+uTime*.12*P1+r*P5*sin(uTime*.2)*.8;
  float k=P0*(1.-uBass*.08*P2-exp(-uSinceBeat*4.)*.04*P2);
  float yy=-.5+2.*atan(r/k)/PI;
  if(P3>.5) yy=-yy;
  vec2 tc=vec2((abs(a)/PI-.5)*uPhotoAR*P6, yy);
  vec3 col=sat(photo(tc),1.15);
  col=mix(col, col*pal(.6+yy*.4)*1.6, P7*smoothstep(0.,.5,yy));
  col+=pal(.1+uTime*.02)*exp(-abs(r-k)*30.)*.25*P4*(.4+uBeat);
  c=vec4(col,1);
}`});B({id:"ph_gallery",name:"Photo Gallery",desc:"Glide down an endless gallery hall lined with framed copies of your photo",fly:!0,params:[{n:"Speed",min:0,max:2,def:.6},{n:"Frame Spacing",min:2,max:6,def:3.2},{n:"Spot Lights",min:0,max:2,def:1},{n:"Sway",min:0,max:1,def:.4},{n:"Floor Shine",min:0,max:1,def:.5},{n:"Ceiling Pulse",min:0,max:2,def:1},{n:"Frame Glow",min:0,max:2,def:.8},{n:"Hall Width",min:1.2,max:2.5,def:1.6}],stick:[0,3],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  float z0=uTime*1.2*P0;
  vec3 ro=vec3(sin(uTime*.3)*.25*P3, .05, z0);
  vec3 rd=normalize(vec3(uv,1.3));
  rd.xz*=rot(uCam.x*.7+sin(uTime*.2)*.08*P3); rd.yz*=rot(uCam.y*.4);
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
  c=vec4(col,1);
}`});B({id:"ph_cards",name:"Floating Cards",desc:"Hundreds of cards printed with your photo drift past you through space",fly:!0,params:[{n:"Density",min:.1,max:.7,def:.35},{n:"Speed",min:0,max:2,def:.6},{n:"Card Size",min:.2,max:.6,def:.38},{n:"Tumble",min:0,max:2,def:.8},{n:"Glow Edges",min:0,max:2,def:.8},{n:"Crop Variety",min:0,max:1,def:.5},{n:"Stars",min:0,max:2,def:1},{n:"Color Wash",min:0,max:1,def:.15}],stick:[0,3],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)+uCam.xy*vec2(.3,-.3);
  float z0=uTime*1.5*P1;
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
  c=vec4(col,1);
}`});var Re=Ue,ze=Ue.filter(a=>!a.photo),Ze=Ue.filter(a=>a.photo),U=Object.fromEntries(Ue.map(a=>[a.id,a])),le=`#version 300 es
in vec2 aPos; void main(){ gl_Position=vec4(aPos,0,1); }`,ua=`#version 300 es
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
}`,da=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes; out vec4 fragColor;
void main(){ vec2 uv=gl_FragCoord.xy/uRes; vec3 c=texture(uTex,uv).rgb; float l=max(c.r,max(c.g,c.b)); fragColor=vec4(c*smoothstep(.75,1.5,l),1); }`,pa=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes, uDir; out vec4 fragColor;
void main(){ vec2 uv=gl_FragCoord.xy/uRes; vec2 o=uDir/uRes; vec3 c=texture(uTex,uv).rgb*.227;
  c+=(texture(uTex,uv+o*1.38).rgb+texture(uTex,uv-o*1.38).rgb)*.316;
  c+=(texture(uTex,uv+o*3.23).rgb+texture(uTex,uv-o*3.23).rgb)*.07; fragColor=vec4(c,1); }`,ha=`#version 300 es
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
}`,va=`#version 300 es
precision highp float; uniform sampler2D uSmall, uPrev; uniform float uRate; out vec4 fragColor;
void main(){ vec3 c=textureLod(uSmall, vec2(.5), 10.).rgb; float l=mix(dot(c,vec3(.3,.59,.11)), max(c.r,max(c.g,c.b)), .55); float pl=texture(uPrev, vec2(.5)).r; fragColor=vec4(mix(pl,l,uRate),0,0,1); }`,xa=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes; out vec4 fragColor;
void main(){ fragColor=texture(uTex, gl_FragCoord.xy/uRes); }`;var Je=class{constructor(e){this.canvas=e;let t=this.gl=e.getContext("webgl2",{antialias:!1,alpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"});if(!t)throw new Error("WebGL2 is not available on this system.");this.halfFloat=!!t.getExtension("EXT_color_buffer_float"),t.getExtension("OES_texture_float_linear");let o=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,o),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),this.progs={},this.errors={},this.post={feedback:this.program(le,ua),bright:this.program(le,da),blur:this.program(le,pa),final:this.program(le,ha),blit:this.program(le,xa),adapt:this.program(le,va)},this.audioTex=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.audioTex),t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.texImage2D(t.TEXTURE_2D,0,t.R8,512,2,0,t.RED,t.UNSIGNED_BYTE,null),this.texParams(t.LINEAR,t.CLAMP_TO_EDGE),this.milkTex=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.milkTex),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,0,255])),this.texParams(t.LINEAR,t.CLAMP_TO_EDGE),this.photoTex=t.createTexture(),this.photoAR=1,this.photoId=null,t.bindTexture(t.TEXTURE_2D,this.photoTex),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([40,20,60,255])),this.aniso=t.getExtension("EXT_texture_filter_anisotropic"),this.scale=.75,this.fbIdx=0,this.finIdx=0,this.lumSmall=this.makeTarget(64,36),t.bindTexture(t.TEXTURE_2D,this.lumSmall.tex),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR_MIPMAP_LINEAR),t.generateMipmap(t.TEXTURE_2D),this.adapt=[this.makeTarget(1,1),this.makeTarget(1,1)],this.adIdx=0,this.W=0,this.H=0}texParams(e,t){let o=this.gl;o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,e),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,e),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,t),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,t)}shader(e,t){let o=this.gl,i=o.createShader(e);if(o.shaderSource(i,t),o.compileShader(i),!o.getShaderParameter(i,o.COMPILE_STATUS)){let n=o.getShaderInfoLog(i);throw o.deleteShader(i),new Error(n)}return i}program(e,t){let o=this.gl,i=o.createProgram();if(o.attachShader(i,this.shader(o.VERTEX_SHADER,e)),o.attachShader(i,this.shader(o.FRAGMENT_SHADER,t)),o.bindAttribLocation(i,0,"aPos"),o.linkProgram(i),!o.getProgramParameter(i,o.LINK_STATUS))throw new Error(o.getProgramInfoLog(i));let n={},r=o.getProgramParameter(i,o.ACTIVE_UNIFORMS);for(let l=0;l<r;l++){let c=o.getActiveUniform(i,l);n[c.name.replace(/\[0\]$/,"")]=o.getUniformLocation(i,c.name)}return{p:i,u:n}}sceneProg(e){let t=Re.find(r=>r.id===e),o=Math.min(t.ss||1,this.ssMax??4),i=o>1?e+"@"+o:e;if(this.progs[i])return this.progs[i];let n=kt.replace(`#version 300 es
`,`#version 300 es
#define SS `+o+`
`)+t.code;try{this.progs[i]=this.program(le,n)}catch(r){this.errors[e]=String(r),console.error("Scene",e,r),this.progs[i]=null}return this.progs[i]}mapProg(e){let t=e+":map";if(this.progs[t]!==void 0)return this.progs[t];let o=Re.find(i=>i.id===e);try{this.progs[t]=this.program(le,kt+o.map)}catch(i){this.errors[t]=String(i),console.error("Map",e,i),this.progs[t]=null}return this.progs[t]}precompile(e,t){let o=0,i=()=>{if(o>=e.length)return t&&t();this.sceneProg(e[o++]),setTimeout(i,0)};i()}makeTarget(e,t,o=!0){let i=this.gl,n=i.createTexture();i.bindTexture(i.TEXTURE_2D,n),o&&this.halfFloat?i.texImage2D(i.TEXTURE_2D,0,i.RGBA16F,e,t,0,i.RGBA,i.HALF_FLOAT,null):i.texImage2D(i.TEXTURE_2D,0,i.RGBA8,e,t,0,i.RGBA,i.UNSIGNED_BYTE,null),this.texParams(i.LINEAR,i.CLAMP_TO_EDGE);let r=i.createFramebuffer();return i.bindFramebuffer(i.FRAMEBUFFER,r),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,n,0),i.clearColor(0,0,0,1),i.clear(i.COLOR_BUFFER_BIT),{tex:n,fb:r,w:e,h:t}}freeTarget(e){e&&(this.gl.deleteTexture(e.tex),this.gl.deleteFramebuffer(e.fb))}resize(e,t,o){if(e===this.W&&t===this.H&&o===this.scaleUsed)return;let i=this.gl,n=Math.max(64,Math.round(e*o)),r=Math.max(64,Math.round(t*o)),l=[this.sceneT,...this.fb||[],...this.fin||[],this.bA,this.bB],c=this.fb;this.sceneT=this.makeTarget(n,r),this.fb=[this.makeTarget(n,r),this.makeTarget(n,r)],c&&this.drawTo(this.fb[this.fbIdx],this.post.blit,{uTex:c[this.fbIdx].tex}),!this.fin||e!==this.W||t!==this.H?((this.fin||[]).forEach(x=>this.freeTarget(x)),this.fin=[this.makeTarget(e,t,!1),this.makeTarget(e,t,!1)]):l.splice(l.indexOf(this.fin[0]),2);let d=Math.max(32,Math.round(n/4)),h=Math.max(32,Math.round(r/4));this.bA=this.makeTarget(d,h),this.bB=this.makeTarget(d,h),l.forEach(x=>{x&&!this.fin.includes(x)&&this.freeTarget(x)}),this.W=e,this.H=t,this.scaleUsed=o,this.sw=n,this.sh=r}drawTo(e,t,o,i){let n=this.gl;n.bindFramebuffer(n.FRAMEBUFFER,e?e.fb:null);let r=e?e.w:this.W,l=e?e.h:this.H;n.viewport(0,0,r,l),n.useProgram(t.p);let c=0;for(let[d,h]of Object.entries(o)){let x=t.u[d];x!=null&&(h instanceof WebGLTexture?(n.activeTexture(n.TEXTURE0+c),n.bindTexture(n.TEXTURE_2D,h),n.uniform1i(x,c++)):typeof h=="number"?n.uniform1f(x,h):h.length===2?n.uniform2fv(x,h):h.length===3?n.uniform3fv(x,h):h.length===4&&n.uniform4fv(x,h))}t.u.uRes,t.u.uRes&&n.uniform2f(t.u.uRes,r,l),n.drawArrays(n.TRIANGLES,0,3)}setPhoto(e,t){let o=this.gl;o.bindTexture(o.TEXTURE_2D,this.photoTex),o.pixelStorei(o.UNPACK_ALIGNMENT,4),o.texImage2D(o.TEXTURE_2D,0,o.RGBA,o.RGBA,o.UNSIGNED_BYTE,e),o.generateMipmap(o.TEXTURE_2D),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR_MIPMAP_LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.MIRRORED_REPEAT),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.MIRRORED_REPEAT),this.aniso&&o.texParameterf(o.TEXTURE_2D,this.aniso.TEXTURE_MAX_ANISOTROPY_EXT,8),this.photoAR=e.width/e.height,this.photoId=t}uploadAudio(e){let t=this.gl;t.bindTexture(t.TEXTURE_2D,this.audioTex),t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.texSubImage2D(t.TEXTURE_2D,0,0,0,512,2,t.RED,t.UNSIGNED_BYTE,e)}uploadMilk(e){let t=this.gl;t.bindTexture(t.TEXTURE_2D,this.milkTex),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!0),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1)}snapshot(){this.transTex=this.fin[this.finIdx].tex,this.finIdx^=1}frame(e){let t=this.post;if(e.engine==="scene"){let h=Re.find(y=>y.id===e.scene),x=this.sceneProg(e.scene);if(x&&h&&h.selfFeedback){(!this.selfT||this.selfT[0].w!==this.sceneT.w||this.selfT[0].h!==this.sceneT.h)&&((this.selfT||[]).forEach(E=>this.freeTarget(E)),this.selfT=[this.makeTarget(this.sceneT.w,this.sceneT.h),this.makeTarget(this.sceneT.w,this.sceneT.h)],this.selfIdx=0);let y=this.selfT[this.selfIdx],P=this.selfT[this.selfIdx^1];this.drawTo(P,x,{...e.sceneU,uSelf:y.tex}),this.selfIdx^=1;let M=this.mapProg(e.scene);M&&this.drawTo(this.sceneT,M,{...e.sceneU,uSelf:P.tex})}else x&&this.drawTo(this.sceneT,x,e.sceneU)}let o=e.engine==="milk"?this.milkTex:this.sceneT.tex,i=this.fb[this.fbIdx],n=this.fb[this.fbIdx^1];this.drawTo(n,t.feedback,{...e.fbU,uScene:o,uPrev:i.tex,uMilk:this.milkTex}),this.fbIdx^=1,this.drawTo(this.bA,t.bright,{uTex:n.tex});for(let h=0;h<2;h++)this.drawTo(this.bB,t.blur,{uTex:this.bA.tex,uDir:[1+h,0]}),this.drawTo(this.bA,t.blur,{uTex:this.bB.tex,uDir:[0,1+h]});this.drawTo(this.lumSmall,t.blit,{uTex:n.tex});let r=this.gl;r.bindTexture(r.TEXTURE_2D,this.lumSmall.tex),r.generateMipmap(r.TEXTURE_2D);let l=this.adapt[this.adIdx],c=this.adapt[this.adIdx^1];this.drawTo(c,t.adapt,{uSmall:this.lumSmall.tex,uPrev:l.tex,uRate:e.adaptRate??.04}),this.adIdx^=1;let d=this.fin[this.finIdx];this.drawTo(d,t.final,{...e.finU,uTex:n.tex,uBloom:this.bA.tex,uTrans:this.transTex||n.tex,uAdapt:c.tex}),this.drawTo(null,t.blit,{uTex:d.tex})}};var Qe=class{constructor(){this.ctx=new(window.AudioContext||window.webkitAudioContext)({latencyHint:"interactive"}),this.el=new Audio,this.el.crossOrigin="anonymous",this.el.preload="auto",this.elSrc=this.ctx.createMediaElementSource(this.el),this.input=this.ctx.createGain(),this.analyser=this.ctx.createAnalyser(),this.analyser.fftSize=2048,this.analyser.smoothingTimeConstant=.55,this.out=this.ctx.createGain(),this.elSrc.connect(this.input),this.input.connect(this.analyser),this.elSrc.connect(this.out),this.out.connect(this.ctx.destination),this.freq=new Uint8Array(1024),this.time=new Uint8Array(2048),this.tex=new Uint8Array(512*2),this.bass=0,this.mid=0,this.high=0,this.vol=0,this.beat=0,this.beatCount=0,this.peak={b:.2,m:.2,h:.2,v:.2},this.bassAvg=0,this.lastBeat=0,this.drop=0,this.playlist=[],this.index=-1,this.shuffle=!1,this.repeat="all",this.mode="player",this.stream=null,this.streamSrc=null,this.onchange=()=>{},this.el.addEventListener("ended",()=>this.next(!0)),this.el.addEventListener("play",()=>this.onchange()),this.el.addEventListener("pause",()=>this.onchange());let e=this.ctx.sampleRate/2;this.binMap=new Float32Array(512);for(let t=0;t<512;t++){let o=30*Math.pow(533.3333333333334,t/511);this.binMap[t]=Math.min(1023,o/e*1024)}}async setOutput(e){try{return this.ctx.setSinkId?await this.ctx.setSinkId(e==="default"?"":e):this.el.setSinkId&&await this.el.setSinkId(e),!0}catch(t){return console.warn(t),!1}}resume(){this.ctx.state!=="running"&&this.ctx.resume()}addTracks(e){let t=this.playlist.length===0;this.playlist.push(...e),t&&e.length&&this.play(0),this.onchange()}remove(e){this.playlist.splice(e,1),e<this.index?this.index--:e===this.index&&(this.index=Math.min(this.index,this.playlist.length-1),this.index>=0?this.play(this.index):this.el.pause()),this.onchange()}clear(){this.playlist=[],this.index=-1,this.el.pause(),this.el.removeAttribute("src"),this.onchange()}async play(e){if(!(e<0||e>=this.playlist.length)){this.useSource("player"),this.index=e,this.el.src=this.playlist[e].url,this.resume();try{await this.el.play()}catch(t){console.warn(t)}this.onchange()}}toggle(){if(this.resume(),this.mode!=="player"&&this.useSource("player"),this.index<0&&this.playlist.length)return this.play(0);this.el.paused?this.el.play():this.el.pause()}next(e){if(!this.playlist.length)return;if(this.repeat==="one"&&e)return this.play(this.index);let t=this.shuffle?Math.floor(Math.random()*this.playlist.length):this.index+1;if(t>=this.playlist.length){if(this.repeat==="off"&&e)return;t=0}this.play(t)}prev(){if(this.el.currentTime>3){this.el.currentTime=0;return}this.play((this.index-1+this.playlist.length)%Math.max(1,this.playlist.length))}get current(){return this.playlist[this.index]}stopStream(){this.stream&&(this.stream.getTracks().forEach(e=>e.stop()),this.stream=null),this.streamSrc&&(this.streamSrc.disconnect(),this.streamSrc=null)}useSource(e){e==="player"&&this.mode!=="player"&&(this.stopStream(),this.mode="player",this.onchange())}async useLoopback(){this.resume();let e=await navigator.mediaDevices.getDisplayMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1},video:!0,systemAudio:"include",selfBrowserSurface:"exclude"});if(e.getVideoTracks().forEach(t=>t.stop()),!e.getAudioTracks().length)throw new Error("No audio was shared \u2014 pick a tab or \u201CEntire screen\u201D and turn on \u201CShare audio\u201D.");this.attachStream(e,"loopback")}async useMic(){this.resume();let e=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});this.attachStream(e,"mic")}attachStream(e,t){this.el.pause(),this.stopStream(),this.stream=e,this.streamSrc=this.ctx.createMediaStreamSource(e),this.streamSrc.connect(this.input),this.mode=t,this.onchange()}update(e,t=1,o={}){let i=o.sens??1,n=o.gB??1,r=o.gM??1,l=o.gH??1,c=this.analyser;c.getByteFrequencyData(this.freq),c.getByteTimeDomainData(this.time);let d=this.ctx.sampleRate/2,h=this.freq,x=(C,I)=>{let _=Math.max(1,Math.floor(C/d*1024)),J=Math.max(_+1,Math.floor(I/d*1024)),te=0;for(let qe=_;qe<J;qe++)te+=h[qe];return te/(J-_)/255},y=x(25,160)*n,P=x(160,2200)*r,M=x(2200,12e3)*l,E=0;for(let C=0;C<2048;C+=4){let I=(this.time[C]-128)/128;E+=I*I}E=Math.sqrt(E/512);let w=this.peak,W=Math.pow(.25,e/8);w.b=Math.max(y,w.b*W,.05),w.m=Math.max(P,w.m*W,.05),w.h=Math.max(M,w.h*W,.03),w.v=Math.max(E,w.v*W,.02);let Z=(C,I,_,J)=>C+(I-C)*(1-Math.exp(-e*(I>C?_:J))),O=Math.min(2.5,t);this.bass=Z(this.bass,Math.pow(y/w.b,1.6)*O,30,8),this.mid=Z(this.mid,Math.pow(P/w.m,1.4)*O,20,6),this.high=Z(this.high,Math.pow(M/w.h,1.3)*O,25,7),this.vol=Z(this.vol,E/w.v*O,15,4),this.bassAvg=this.bassAvg+(y-this.bassAvg)*(1-Math.exp(-e*2));let b=1-Math.exp(-e*1.4);this.bMean=(this.bMean??y)+(y-(this.bMean??y))*b;let z=(y-this.bMean)*(y-this.bMean);this.bVar=(this.bVar??.001)+(z-(this.bVar??.001))*b;let S=Math.sqrt(this.bVar),L=this.bMean+(1.25-i*.4)*S+.015,k=performance.now()/1e3;this.isBeat=!1,!this.above&&y>L&&y>.1&&k-this.lastBeat>.16?(this.lastBeat=k,this.beat=1,this.beatCount++,this.isBeat=!0,this.above=!0):this.above&&y<this.bMean+.3*S&&(this.above=!1),this.beat*=Math.exp(-e*7),this.drop=this.drop*Math.exp(-e*.5)+Math.max(0,y-this.bassAvg*1.6)*e*4;for(let C=0;C<512;C++){let I=this.binMap[C],_=Math.floor(I),J=I-_,te=h[_]*(1-J)+h[Math.min(1023,_+1)]*J;this.tex[C]=Math.min(255,te*(1+C/512*.8))}for(let C=0;C<512;C++)this.tex[512+C]=this.time[C*2]}};var F={A:0,B:1,X:2,Y:3,LB:4,RB:5,LT:6,RT:7,BACK:8,START:9,L3:10,R3:11,UP:12,DOWN:13,LEFT:14,RIGHT:15,TOUCH:17},et=class{constructor(){this.prev=[],this.downAt=[],this.held=[],this.axes=[0,0,0,0],this.lt=0,this.rt=0,this.connected=!1,this.id="",this.deadzone=.14,this.style="xbox",this.lastInput=0,this.gp=null}poll(){let e=navigator.getGamepads?navigator.getGamepads():[],t=null;for(let P of e)if(P&&P.connected){t=P;break}this.hid&&this.hid.fresh&&(t=this.hid.asGamepad()),!t&&this.touch&&this.touch.active&&(t=this.touch.asGamepad()),this.gp=t;let o=this.connected;if(this.connected=!!t,this.justConnected=!o&&this.connected,!t){this.pressed=[],this.released=[];return}this.id=t.id,this.style=t.id==="Touch controls"?"touch":/054c|playstation|dualsense|dualshock/i.test(t.id)||/wireless controller/i.test(t.id)&&!/xbox|xinput|045e/i.test(t.id)?"ps":"xbox";let i=performance.now();this.pressed=[],this.released=[];let n=Math.min(t.buttons.length,18);for(let P=0;P<n;P++){let M=t.buttons[P],E=typeof M=="object"?M.value:M,w=typeof M=="object"&&M.pressed||E>.5;w&&!this.prev[P]&&(this.pressed[P]=!0,this.downAt[P]=i,this.held[P]=!1,this.lastInput=i),!w&&this.prev[P]&&(this.released[P]=!0),this.prev[P]=w}let r=P=>{let M=Math.abs(P);return M<this.deadzone?0:Math.sign(P)*((M-this.deadzone)/(1-this.deadzone))},l=t.axes,c=(P,M)=>{let E=Math.hypot(P,M);if(E<this.deadzone)return[0,0];let w=(E-this.deadzone)/(1-this.deadzone)/E;return[P*w,M*w]},[d,h]=c(l[0]||0,l[1]||0),[x,y]=c(l[2]||0,l[3]||0);this.axes=[d,h,x,y],this.lt=t.buttons[6]?t.buttons[6].value:0,this.rt=t.buttons[7]?t.buttons[7].value:0,Math.abs(d)+Math.abs(h)+Math.abs(x)+Math.abs(y)+this.lt+this.rt>.05&&(this.lastInput=i)}down(e){return!!this.prev[e]}tap(e){return!!this.pressed[e]}hold(e,t){return this.prev[e]&&!this.held[e]&&performance.now()-this.downAt[e]>t?(this.held[e]=!0,!0):!1}shortRelease(e){return!!this.released[e]&&!this.held[e]}rumble(e,t,o=80){let i=this.gp;if(!(!i||!i.vibrationActuator))try{i.vibrationActuator.playEffect("dual-rumble",{duration:o,strongMagnitude:Math.min(1,e),weakMagnitude:Math.min(1,t)})}catch{}}label(e){return this.style==="touch"?{A:"\u2738",B:"B",X:"\u2684",Y:"\u2605",LB:"\u2756",RB:"\u25D1",LT:"WARP",RT:"DRIVE",BACK:"?",START:"\u2630",L3:"L",R3:"R"}[e]||e:this.style==="ps"?{A:"\u2715",B:"\u25CB",X:"\u25A1",Y:"\u25B3",LB:"L1",RB:"R1",LT:"L2",RT:"R2",BACK:"Create",START:"Options",L3:"L3",R3:"R3"}[e]||e:{A:"A",B:"B",X:"X",Y:"Y",LB:"LB",RB:"RB",LT:"LT",RT:"RT",BACK:"View",START:"Menu",L3:"LS",R3:"RS"}[e]||e}};var Y=[{name:"Acid Rainbow",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.33,.67]},{name:"Psilocybin",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[.8,.9,.3]},{name:"Synthwave",a:[.55,.3,.6],b:[.45,.3,.4],c:[1,1,1],d:[0,.15,.25]},{name:"Aurora",a:[.3,.55,.5],b:[.3,.45,.45],c:[1,1,1],d:[.55,.25,.3]},{name:"Molten Gold",a:[.6,.4,.2],b:[.4,.35,.2],c:[1,1,1],d:[0,.1,.2]},{name:"Deep Ocean",a:[.2,.4,.6],b:[.2,.35,.4],c:[1,1,1],d:[.3,.2,.1]},{name:"Toxic",a:[.4,.6,.3],b:[.4,.4,.4],c:[1,1.5,1],d:[.2,0,.5]},{name:"Candy",a:[.65,.5,.65],b:[.35,.45,.35],c:[1,1,1],d:[0,.5,.25]},{name:"Infrared",a:[.5,.2,.25],b:[.5,.3,.3],c:[1,1,1.5],d:[0,.1,.6]},{name:"Ultraviolet",a:[.45,.25,.65],b:[.45,.3,.35],c:[1,2,1],d:[.6,.1,0]},{name:"Ice Fire",a:[.5,.5,.5],b:[.5,.5,.5],c:[.5,.5,.5],d:[0,.15,.5]},{name:"Peacock",a:[.4,.5,.5],b:[.4,.4,.5],c:[2,1,1],d:[.5,.2,.25]},{name:"Sunset Dream",a:[.6,.4,.4],b:[.4,.4,.3],c:[1,1,1],d:[0,.2,.45]},{name:"Emerald Temple",a:[.25,.5,.35],b:[.25,.45,.3],c:[1,1,2],d:[.6,.3,.5]},{name:"Holographic",a:[.6,.6,.7],b:[.4,.4,.3],c:[2,2,2],d:[0,.33,.67]},{name:"Blacklight",a:[.35,.2,.55],b:[.35,.45,.45],c:[1.5,1,1],d:[.35,.7,.1]}],oe={trail:.55,zoom:1.01,spin:0,warp:.3,hueDrift:0,kaleido:0,kaleidoSpin:0,mirror:0,breathe:.4,melt:0,chroma:1,bloom:.8,grain:.3,vignette:.6,exposure:1,saturation:1.1,contrast:1.05,react:1,speed:1,fusion:0,hueSpin:0,dance:1,ripple:1,punch:1,shake:1,swirlA:1,bulgeA:1};function Bt(a){let e=2166136261;for(let t of a)e=Math.imul(e^t.charCodeAt(0),16777619)>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}var so={trail:[.1,.62],zoom:[.995,1.018],spin:[-.006,.006],warp:[0,1],breathe:[.1,1.2],melt:[0,.6],hueDrift:[-.01,.01],hueSpin:[-.05,.05],kaleidoSpin:[-.3,.3],chroma:[.4,1.6],bloom:[.35,.85],exposure:[.95,1.08],saturation:[1,1.4],contrast:[1,1.12],grain:[.08,.45],vignette:[.3,.95],react:[.8,1.5],speed:[.7,1.45],dance:[.4,1.9],ripple:[.3,1.7],punch:[.4,1.7],shake:[.15,1.4],swirlA:[.3,1.9],bulgeA:[.3,1.7]};function tt(a,e=oe,t={}){let o=Bt(a),i={...oe,...e};for(let[n,[r,l]]of Object.entries(so))i[n]=+(r+o()*(l-r)).toFixed(4);return e.trail===0&&(i.trail=0),e.zoom===1&&(i.zoom=1),{...i,...t}}var v=(a,e,t,o={},i=0)=>{let n=U[a],r=Bt(e+"#shape"),l=n.params.map((d,h)=>{if(t[h]!==void 0)return t[h];let x=d.def+(r()-.5)*.16*(d.max-d.min);return+Math.max(d.min,Math.min(d.max,x)).toFixed(4)}),c=tt(e,oe,o);return n.fly&&(c.trail=Math.min(c.trail,o.trail!==void 0?.3:.08+r()*.17)),n.selfFeedback&&o.trail===void 0&&(c.trail=r()*.15),n.crisp&&(c.trail=Math.min(c.trail,.28),c.melt=Math.min(c.melt,.2)),{id:"eye-"+e.toLowerCase().replace(/[^a-z0-9]+/g,"-"),name:e,engine:"scene",scene:a,params:l,palette:i,fx:c,builtin:!0}};var be=[v("cathedral","Cathedral of Echoes",[],{trail:.45},0),v("cathedral","Infinite Basilica",[1.1,.2,1.42,1.3,1.4,.95],{trail:.35,kaleido:0},4),v("cathedral","Neon Spine",[.55,1.1,1.6,1.3,2,.75,1.5,1.4],{trail:.5,zoom:1.012,hueDrift:.006},15),v("cathedral","Gothic Mushroom Vault",[.95,.7,1.5,1.2,.7,1.05,1,1.8],{breathe:.8,melt:.4,trail:.35},1),v("nebula","Warp Nebula",[],{},9),v("nebula","Wormhole Petals",[2,.4,3.2,1.6,1,.3,1.1,6],{kaleido:6,trail:.4},0),v("nebula","Cosmic Drain",[.6,.9,1.5,2.5,.4,-.6,1.2],{spin:.01,trail:.7,zoom:.985},5),v("julia","Julia Bloom",[],{},0),v("julia","Dendrite Garden",[1.2,1.3,.6,1.2,2,.76,.2,6],{trail:.4},13),v("julia","Paisley Mind",[2.6,.8,1.8,1,1.5,.79,-.4,1],{breathe:1.2,melt:.5},1),v("julia","Electric Lace",[4.2,1.6,2.4,1.5,2.8,.7885,.3,4],{kaleido:0,trail:.6,hueDrift:.02},15),v("gyroid","Gyroid Hyperspace",[],{},9),v("gyroid","Coral Lungs",[1.4,.8,.15,1.4,.7,1.8,.06,.3],{breathe:1.5,trail:.5},12),v("gyroid","Light Speed Lattice",[3,4.5,.03,1.6,.2,.6,.05,1.6],{trail:.5,zoom:1.02,chroma:1.6},0),v("chrome","Liquid Chrome",[],{},14),v("chrome","Mercury Heartbeat",[4,.9,.15,4,.6,2,.4,1.3],{trail:.3},10),v("chrome","Oil Slick Orbit",[8,.35,.7,12,1.6,1,2,1],{trail:.5,breathe:.8},1),v("horizon","Neon Horizon",[],{},2),v("horizon","Outrun Forever",[2.5,.38,1.5,10,1.2,1.5,14,1.5],{trail:.4,chroma:2},2),v("horizon","Hallucinated Highway",[1.5,.25,1.2,6,2,1,6,1.4],{breathe:1.2,melt:1,trail:.6,hueDrift:.01},0),v("mandala","Spectral Mandala",[],{},0),v("mandala","Lotus Reactor",[8,8,.8,2,.05,1.4,1.4,1.1],{trail:.6,zoom:1.015},7),v("mandala","Chakra Spin",[16,4,.3,1.2,.5,1,.4,.8],{trail:.75,spin:.008},9),v("mandala","Lace Galaxy",[24,10,1,1,-.2,2,2,1.3],{kaleido:0,trail:.5,hueDrift:.015},15),v("silk","Silk Warp",[],{},1),v("silk","Melting Marble",[1.4,2,1.6,.4,1.8,1.2,1.8,1],{breathe:1,melt:.5},4),v("silk","Liquid Thought",[3.5,1.6,.8,1.2,1,1.5,1.2,.2],{kaleido:8,trail:.4},3),v("silk","Tie-Dye Ocean",[2.6,2.6,2.6,.9,.8,1,1.1,.6],{trail:.3,hueDrift:.02},0),v("apollo","Apollonian Dream",[],{},14),v("apollo","Bubble Universe",[1.32,.4,2.2,2.5,1,.8,.2,1.3],{trail:.5},11),v("apollo","Pearl Labyrinth",[1.08,1.2,.8,.8,1.8,.3,.6,1.6],{breathe:.6},4),v("voronoi","Stained Voronoi",[],{},7),v("voronoi","Cathedral Window",[4,.3,.08,1.5,2,.3,0,.9],{kaleido:12,trail:.3},0),v("voronoi","Cell Division",[12,1.5,.02,2.5,2.5,1,1.4,.3],{trail:.6,breathe:1.2,melt:.4},6),v("wavefield","Neon Wavefield",[],{},2),v("wavefield","Pulsar Ridge",[.6,1.6,1.8,.4,.1,1,.4,.1],{trail:.5,chroma:1.5},10),v("wavefield","Spectral Dunes",[.2,1.2,1,1.2,.8,.6,1.8,0],{mirror:1,trail:.6},3),v("starcore","Star Core",[],{},4),v("starcore","Blue Giant",[3,1.6,1.6,2,1.6,1.4,1,1.2],{trail:.6},5),v("starcore","Quasar Eye",[2.2,2,1.4,2.2,2,1.4,1.2,.85],{kaleido:6,trail:.35},8),v("flower","Flower of Life",[],{},4),v("flower","Metatron Gate",[2,.15,2,1.6,4,1.5,.6,1],{trail:.5,zoom:1.012},13),v("flower","Seed of Creation",[2.6,-.05,.6,1.2,4,1,.35,1.4],{trail:.45,breathe:1,hueDrift:.006},1),v("fall","Endless Fall",[],{},0),v("fall","Droste Staircase",[1.5,1.2,3,4,1.5,1,.2,1],{trail:.5},4),v("fall","Spiral Abyss",[2.2,1.8,8,5,1.8,2,.8,1.5],{trail:.7,zoom:.99,spin:-.01},9),v("fall","Rising Up",[-1.2,.4,6,3,1.2,1.5,.5,.4],{kaleido:0,trail:.4,hueDrift:.01},3),v("hyper","Hyperbolic Temple",[],{},0),v("hyper","Escher Heaven",[7,3,.8,2,.5,.2,1,.8],{trail:.4},10),v("hyper","Infinite Mosaic",[4,6,1.4,1.5,.8,-.3,1.3,1.2],{trail:.5,breathe:.6},7),v("burst","Supernova Burst",[],{},4),v("burst","Firework Mind",[180,2,6,1.5,.8,.4,2,.4],{trail:.66,zoom:1.02},0),v("burst","Crystal Detonation",[60,2.2,4,.8,1.2,0,1.6,1],{kaleido:8,trail:.7,zoom:1.02},15),v("fold","Origami Fold",[],{},1),v("fold","Folding Cathedral",[.15,12,1.4,.8,1.4,1.5,1.4,.8],{trail:.5},4),v("fold","Dragon Paper",[.6,10,1.3,.62,1.2,1.2,2,1.3],{trail:.65,breathe:1},9),v("fold","Snowflake Engine",[1.05,9,1.36,.75,1.6,1,.8,.7],{kaleido:6,trail:.4},5),v("bulb","Mandelbulb Shrine",[8,.2,1,1.2,3.9,.8,1.2,7],{},14),v("bulb","Alien Spore",[5,.3,1.4,1.6,3.6,1,1.8,7],{breathe:.3},6),v("bulb","Golden Idol",[9,.12,.6,.8,3.4,.5,1.4,8],{trail:.2},4),v("qjulia","Julia Organism",[.5,.22,1,.8,3.5,.8,1.3,.6],{trail:.15},1),v("qjulia","Coral Mind",[.8,.15,1.4,1.1,3.3,1,1.8,1],{trail:.2},13),v("qjulia","Quantum Larva",[.25,.3,.8,.7,3.7,.6,1,.35],{trail:.1},9),v("jbulb","Living Bulb",[6,.2,1,1.1,3.9,.8,1.2,2.5],{trail:.15},0),v("jbulb","Pulsing Seed",[4,.25,1.3,1.5,3.8,1.2,1.6,1.2],{trail:.2},7),v("jbulb","Bone Orchid",[8.5,.15,.7,.9,4,.6,1,1.6],{trail:.1},4),v("kifs","Crystal Reliquary",[.08,.18,1.1,1.8,6,.8,1.5,.78],{trail:.12},5),v("kifs","Octahedral Throne",[.15,.12,1.3,1.6,5.8,1,1.6,.8],{trail:.2},15),v("kifs","Ice Cathedral",[.6,.2,.8,1,6,.6,1.1,.3],{trail:.1},10),v("hextunnel","Hex Temple",[],{},1),v("hextunnel","Machine Elf Hall",[2.2,8,2,2,1.4,1.2,1,2],{trail:.6,breathe:1.4,melt:.4},0),v("yantra","Sri Yantra",[],{},4),v("yantra","Third Eye Opening",[12,2,24,1.2,.2,2.5,1.2,1.2],{trail:.7,zoom:1.018},9),v("menger","Menger Crystal",[],{},5),v("menger","Sponge Cathedral",[1.6,.95,2,2,.6,1.2,.2,4],{trail:.5},4),v("aurora","Aurora Ocean",[3,1,1,1.3,.75,1,1,1.2],{trail:.15,kaleido:0,mirror:0,breathe:.2,melt:0,grain:.06,chroma:.45},3),v("aurora","Borealis Mirror",[4,1.4,1.3,1.6,.9,1.4,1.6,1.8],{trail:.2,kaleido:0,mirror:0,breathe:.15,melt:0,grain:.06,chroma:.45},12)],ro=[["Liquid Oscilloscope",[2,7],[0,3]],["Spectral Whirlpool",[2,3],[2,5]],["Lissajous Lagoon",[8,3],[3,0]],["Golden Spiral Engine",[7,5],[4,6]],["Bass Bloom",[9,0],[5,2]],["Rising Phoenix",[6,8],[1,8]],["Twin Vortex",[3,2],[7,0]],["Ripple Mind",[4,10],[0,6]],["Petal Storm",[10,5],[6,2]],["Helix Current",[8,6],[8,1]],["Starburst Tunnel",[0,7],[9,5]],["Mirror Pulse",[1,4],[10,0]],["Trinity Drift",[5,8],[11,3]],["Orbital Smoke",[8,2],[7,4]],["Infinite Zoom Scope",[0,9],[0,1]],["Collapsing Stars",[1,3],[6,9]],["Plasma Flame",[6,9],[5,8]],["Deep Current",[8,8],[1,3]],["Kaleido Rose",[10,4],[2,11]],["Mandala Machine",[5,10],[6,11]],["Ghost Knots",[2,8],[3,3]],["Comet Tails",[7,0],[7,9]],["Sonic Lotus",[10,2],[2,6]],["Wave Temple",[4,5],[10,1]],["Ember Spiral",[7,6],[4,8]],["Pulse Reactor",[9,4],[5,0]],["Silk Scope",[8,1],[0,10]],["Aurora Knot",[6,3],[3,8]],["Gravity Well",[2,9],[7,2]],["Quantum Foam",[8,10],[9,6]],["Spinning Prism",[5,3],[11,5]],["Echo Chamber",[1,7],[0,4]],["Fireflies",[3,8],[7,9]],["Hypno Rings",[4,7],[6,0]],["Dream Scope",[0,1,2,3,4,5,6,7,8,9,10],[0,1,2,3,4,5,6,7,8,10,11]],["Chaos Garden",[0,1,2,3,4,5,6,7,8,9,10],[0,1,2,3,4,5,6,7,8,9,10,11]]];ro.forEach(([a,e,t],o)=>{let i=v("flux",a,[],{},(o*5+3)%Y.length);i.flux={flows:e,waves:t},a==="Chaos Garden"&&(i.params[4]=6),be.push(i)});function ba(){let a=(e,t)=>[...Array(e).keys()].sort(()=>Math.random()-.5).slice(0,t);return{flows:a(11,2+Math.floor(Math.random()*3)),waves:a(12,2+Math.floor(Math.random()*3))}}var lo=["Velvet","Chrome","Fractal","Liquid","Astral","Neon","Cosmic","Prismatic","Holographic","Molten","Electric","Dreaming","Infinite","Sacred","Psychedelic","Iridescent","Quantum","Lucid","Melting","Hyper","Ancient","Crystal","Sonic","Shimmering","Feral","Halcyon","Opal","Ultraviolet"],co=["Singularity","Aurora","Cathedral","Lotus","Vortex","Garden","Labyrinth","Mandala","Spiral","Bloom","Engine","Temple","Ocean","Nebula","Serpent","Oracle","Echo","Portal","Reactor","Dream","Prism","Hive","Halo","Abyss","Lattice","Comet","Membrane","Kaleidoscope"],ae=(a,e)=>a+Math.random()*(e-a),ge=a=>a[Math.floor(Math.random()*a.length)];function at(){return`${ge(lo)} ${ge(co)}`}function ya(){return{name:"Generated",a:[ae(.3,.65),ae(.3,.65),ae(.3,.65)],b:[ae(.3,.55),ae(.3,.55),ae(.3,.55)],c:[ge([.5,1,1,1,1.5,2]),ge([.5,1,1,1,1.5,2]),ge([.5,1,1,1,1.5,2])],d:[Math.random(),Math.random(),Math.random()]}}function Pa(a=oe,e=1){let t={...a},o=(i,n,r)=>{t[i]=t[i]+(ae(n,r)-t[i])*e};o("trail",0,.85),o("zoom",.985,1.03),o("spin",-.012,.012),o("warp",0,1.2),o("breathe",0,1.6),o("melt",0,.8),o("chroma",.3,2.2),o("bloom",.4,1.4),t.hueDrift=Math.random()<.3?ae(-.02,.02):0,e>=1&&(t.kaleido=Math.random()<.3?ge([3,4,5,6,8,12]):0),t.mirror=Math.random()<.12?1:0;for(let i of["dance","ripple","punch","shake","swirlA","bulgeA"])o(i,.3,1.9);return t}function Mt(a,e=.55){let t=U[a.scene],o=structuredClone(a);return o.builtin=!1,t&&(o.params=t.params.map((i,n)=>{let r=a.params[n]??i.def,l=ae(i.min,i.max);return+(r+(l-r)*e).toFixed(4)})),o.fx=Pa(a.fx,e*.7),t&&t.fly&&(o.fx.trail=Math.min(o.fx.trail,.25)),t&&t.selfFeedback&&(o.fx.trail=Math.min(o.fx.trail,.15),Math.random()<.6&&(o.flux=ba())),Math.random()<.5&&(o.palette=Math.random()<.4?ya():Math.floor(Math.random()*Y.length)),o.name=at(),o.id="gen-"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),o}function Rt(a){let e=a&&U[a]||ge(ze),t=e.params.map(i=>{let n=ae(i.min,i.max);return+(i.def+(n-i.def)*.7).toFixed(4)}),o=Pa(oe,1);return e.fly&&(o.trail=Math.min(o.trail,.25)),e.selfFeedback&&(o.trail=Math.random()*.15),{id:"gen-"+Date.now().toString(36),name:at(),engine:"scene",scene:e.id,params:t,palette:Math.random()<.5?ya():Math.floor(Math.random()*Y.length),fx:o,builtin:!1,...e.selfFeedback?{flux:ba()}:{}}}function ot(a){return typeof a=="number"?Y[(a%Y.length+Y.length)%Y.length]:a}var Ta="eyecandy.userPresets.v1";function wa(){try{return JSON.parse(localStorage.getItem(Ta)||"[]")}catch{return[]}}function _e(a){try{localStorage.setItem(Ta,JSON.stringify(a))}catch{}}var ga=[0,2,3,5,7,9,11,13];function zt(a,e){let t=U[e],o=a.id+"/"+e,i=Bt(o),n=t.params.map(l=>+Math.max(l.min,Math.min(l.max,l.def+(i()-.5)*.12*(l.max-l.min))).toFixed(4)),r=tt(o,oe,{kaleido:0,mirror:0});return r.trail=Math.min(r.trail,t.fly?.15:.32),r.melt=Math.min(r.melt,.12),r.warp=Math.min(r.warp,t.fly?.15:.45),r.chroma=Math.min(r.chroma,.5),(t.crisp||t.space)&&(r.warp=Math.min(r.warp,.08),r.trail=Math.min(r.trail,.2),r.breathe=Math.min(r.breathe,.3),r.swirlA=Math.min(r.swirlA,.25),r.bulgeA=Math.min(r.bulgeA,.25),r.ripple=Math.min(r.ripple,.45),r.dance=Math.min(r.dance,.7)),r.grain=Math.min(r.grain,.15),r.saturation=Math.min(r.saturation,1.2),{id:"photo-"+o,name:t.name.replace(/^Photo /,"")+" \xB7 "+a.name,engine:"scene",scene:e,params:n,palette:ga[Math.floor(i()*ga.length)],fx:r,photo:a.id,builtin:!0}}var mo="eyecandy-photos",Lt="photos",Ct=null;function fo(){return Ct||(Ct=new Promise((a,e)=>{let t=indexedDB.open(mo,1);t.onupgradeneeded=()=>t.result.createObjectStore(Lt,{keyPath:"id"}),t.onsuccess=()=>a(t.result),t.onerror=()=>e(t.error)})),Ct}var it=async(a,e)=>{let t=await fo();return new Promise((o,i)=>{let n=t.transaction(Lt,a),r=n.objectStore(Lt),l=e(r);n.oncomplete=()=>o(l&&"result"in l?l.result:l),n.onerror=()=>i(n.error),n.onabort=()=>i(n.error)})};function At(a,e){let t=document.createElement("canvas");return t.width=a,t.height=e,t}var uo=(a,e,t)=>new Promise(o=>a.toBlob(o,e,t));async function ka(a,e=2048){let t=await createImageBitmap(a,{imageOrientation:"from-image"}),o=Math.min(1,e/Math.max(t.width,t.height)),i=Math.max(1,Math.round(t.width*o)),n=Math.max(1,Math.round(t.height*o)),r=At(i,n);r.getContext("2d").drawImage(t,0,0,i,n);let l=await uo(r,"image/jpeg",.9),c=160/Math.max(i,n),d=At(Math.round(i*c)||1,Math.round(n*c)||1);d.getContext("2d").drawImage(r,0,0,d.width,d.height);let h=d.toDataURL("image/jpeg",.75);t.close&&t.close();let x=(a.name||"Photo").replace(/\.[^.]+$/,"").replace(/[_-]+/g," ").trim().slice(0,28)||"Photo",y={id:"ph"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:x,w:i,h:n,thumb:h,created:Date.now()};return await it("readwrite",P=>P.put({...y,blob:l})),y}async function Sa(){try{return(await it("readonly",e=>e.getAll())).map(({blob:e,...t})=>t).sort((e,t)=>t.created-e.created)}catch{return[]}}async function Ba(a){try{let e=await it("readonly",t=>t.get(a));return e?await createImageBitmap(e.blob):null}catch{return null}}async function Ma(a){try{await it("readwrite",e=>e.delete(a))}catch{}}function Ra(){let a=At(1024,768),e=a.getContext("2d"),t=e.createLinearGradient(0,0,1024,768);t.addColorStop(0,"#1b0b3a"),t.addColorStop(.5,"#0d3b5c"),t.addColorStop(1,"#3a0b2e"),e.fillStyle=t,e.fillRect(0,0,1024,768);let o=["#ff3da8","#ffd23d","#3dffb5","#3db2ff","#b03dff","#ff7a3d"];for(let i=0;i<26;i++){let n=(Math.sin(i*12.9898)*.5+.5)*1024,r=(Math.sin(i*78.233)*.5+.5)*768,l=40+i*37%150,c=e.createRadialGradient(n,r,0,n,r,l);c.addColorStop(0,o[i%o.length]),c.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=c,e.beginPath(),e.arc(n,r,l,0,Math.PI*2),e.fill()}e.strokeStyle="rgba(255,255,255,.55)",e.lineWidth=6;for(let i=0;i<7;i++)e.beginPath(),e.arc(512,384,50+i*45,0,Math.PI*2),e.stroke();return a}function za(a){let e=a.ctx,t=e.createGain();t.gain.value=.55,t.connect(a.input),t.connect(a.out);let o=124,i=60/o/4,n=e.currentTime+.1,r=0,l=!0,c=[0,3,5,7,10,12,15],d=e.createBuffer(1,e.sampleRate,e.sampleRate),h=d.getChannelData(0);for(let b=0;b<h.length;b++)h[b]=Math.random()*2-1;let x=e.createDelay(1);x.delayTime.value=i*3;let y=e.createGain();y.gain.value=.35,x.connect(y),y.connect(x),x.connect(t);let P=b=>{let z=e.createOscillator(),S=e.createGain();z.frequency.setValueAtTime(150,b),z.frequency.exponentialRampToValueAtTime(42,b+.12),S.gain.setValueAtTime(1,b),S.gain.exponentialRampToValueAtTime(.001,b+.45),z.connect(S),S.connect(t),z.start(b),z.stop(b+.5)},M=(b,z)=>{let S=e.createBufferSource();S.buffer=d;let L=e.createBiquadFilter();L.type="highpass",L.frequency.value=8e3;let k=e.createGain();k.gain.setValueAtTime(z,b),k.gain.exponentialRampToValueAtTime(.001,b+.05),S.connect(L),L.connect(k),k.connect(t),S.start(b),S.stop(b+.06)},E=b=>{let z=e.createBufferSource();z.buffer=d;let S=e.createBiquadFilter();S.type="bandpass",S.frequency.value=1500;let L=e.createGain();L.gain.setValueAtTime(.5,b),L.gain.exponentialRampToValueAtTime(.001,b+.18),z.connect(S),S.connect(L),L.connect(t),L.connect(x),z.start(b),z.stop(b+.2)},w=(b,z,S,L)=>{let k=e.createOscillator(),C=e.createOscillator(),I=e.createBiquadFilter(),_=e.createGain();k.type="sawtooth",C.type="square";let J=55*Math.pow(2,z/12);k.frequency.value=J,C.frequency.value=J*1.005,I.type="lowpass",I.Q.value=9,I.frequency.setValueAtTime(L,b),I.frequency.exponentialRampToValueAtTime(120,b+S),_.gain.setValueAtTime(.22,b),_.gain.exponentialRampToValueAtTime(.001,b+S),k.connect(I),C.connect(I),I.connect(_),_.connect(t),_.connect(x),k.start(b),C.start(b),k.stop(b+S),C.stop(b+S)},W=(b,z)=>{[0,7,15,19].forEach(S=>{let L=e.createOscillator(),k=e.createGain();L.type="triangle",L.frequency.value=110*Math.pow(2,(z+S)/12),k.gain.setValueAtTime(0,b),k.gain.linearRampToValueAtTime(.05,b+1),k.gain.linearRampToValueAtTime(0,b+i*64),L.connect(k),k.connect(t),k.connect(x),L.start(b),L.stop(b+i*64)})},Z=[0,-4,3,-2],O=()=>{if(l){for(;n<e.currentTime+.15;){let b=r%16,z=Math.floor(r/16),S=Math.floor(z/8)%4,L=Z[Math.floor(z/2)%4],k=z%32>=28;!k&&b%4===0&&P(n),b%2===1&&M(n,b%4===3?.25:.1),!k&&(b===4||b===12)&&E(n),Math.random()<(S===2?.8:.55)&&w(n,L+12+c[Math.floor(Math.random()*c.length)]+(Math.random()<.2?12:0),i*1.8,600+3e3*Math.abs(Math.sin(r*.03))),b===0&&z%4===0&&W(n,L),n+=i,r++}setTimeout(O,25)}};return O(),()=>{l=!1,t.gain.setTargetAtTime(0,e.currentTime,.2),setTimeout(()=>t.disconnect(),800)}}var Ca=[3302,3570],po=[1476,2508,2976],ho=(()=>{let a=new Uint32Array(256);for(let e=0;e<256;e++){let t=e;for(let o=0;o<8;o++)t=t&1?3988292384^t>>>1:t>>>1;a[e]=t>>>0}return a})();function La(a){let e=4294967295;for(let t of a)e=ho[(e^t)&255]^e>>>8;return(e^4294967295)>>>0}var vo=[[1,0,0,0],[1,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,1,1],[0,0,0,1],[1,0,0,1],[0,0,0,0]],nt=class{constructor(){this.supported=!!navigator.hid,this.device=null,this.kind=null,this.bt=!1,this.status=this.supported?"not connected":"unsupported",this.t=[{active:!1,x:.5,y:.5,id:-1},{active:!1,x:.5,y:.5,id:-1}],this.axes=[0,0,0,0],this.buttons=new Array(18).fill(0),this.lastReport=0,this.lastPadReport=0,this.onstatus=()=>{},this.seq=0,this.rumbleTimer=0,this.supported&&(navigator.hid.addEventListener("disconnect",e=>{e.device===this.device&&(this.device=null,this.set("not connected"))}),navigator.hid.addEventListener("connect",()=>this.autoConnect()))}set(e){this.status=e,this.onstatus(e)}get connected(){return!!this.device}get fresh(){return this.device&&performance.now()-this.lastPadReport<400}async autoConnect(){if(!this.supported||this.device)return!1;try{let t=(await navigator.hid.getDevices()).find(o=>o.vendorId===1356&&(Ca.includes(o.productId)||po.includes(o.productId)));if(t)return await this.open(t),!0}catch(e){console.warn(e)}return!1}async request(){if(!this.supported)return!1;try{window.eyecandy&&window.eyecandy.requestHid?await window.eyecandy.requestHid():await navigator.hid.requestDevice({filters:[{vendorId:1356}]})}catch(e){console.warn(e)}return this.autoConnect()}async open(e){try{e.opened||await e.open()}catch{this.set("could not open (close Steam / DS4Windows?)");return}this.device=e,this.kind=Ca.includes(e.productId)?"ds5":"ds4";try{await e.receiveFeatureReport(this.kind==="ds5"?5:2)}catch{}e.addEventListener("inputreport",t=>this.parse(t)),this.set((this.kind==="ds5"?"DualSense":"DualShock 4")+" connected (touchpad + full controller)")}parse(e){let t=e.data,o=e.reportId,i=w=>t.getUint8(w),n=-1,r=-1;if(this.kind==="ds5"?o===1&&t.byteLength>=40?(n=0,r=32,this.bt=!1):o===49&&t.byteLength>=41?(n=1,r=33,this.bt=!0):o===1&&t.byteLength>=9&&(n=0,this.bt=!0):o===1&&t.byteLength>=42?(n=0,r=34,this.bt=!1):o===17&&t.byteLength>=44?(n=2,r=36,this.bt=!0):o===1&&t.byteLength>=9&&(n=0,this.bt=!0),n<0)return;let l=w=>(i(w)-128)/127.5,c=this.buttons;this.axes=[l(n),l(n+1),l(n+2),l(n+3)];let d,h,x,y,P;this.kind==="ds5"&&r>=0?(y=i(n+4),P=i(n+5),d=i(n+7),h=i(n+8),x=i(n+9)):(d=i(n+4),h=i(n+5),x=i(n+6),y=i(n+7),P=i(n+8));let M=vo[Math.min(8,d&15)];if(c[2]=d>>4&1,c[0]=d>>5&1,c[1]=d>>6&1,c[3]=d>>7&1,c[4]=h&1,c[5]=h>>1&1,c[6]=y/255,c[7]=P/255,c[8]=h>>4&1,c[9]=h>>5&1,c[10]=h>>6&1,c[11]=h>>7&1,c[12]=M[0],c[15]=M[1],c[13]=M[2],c[14]=M[3],c[16]=x&1,c[17]=x>>1&1,this.lastPadReport=performance.now(),r<0)return;let E=this.kind==="ds5"?1079:942;for(let w=0;w<2;w++){let W=r+w*4,Z=i(W),O=i(W+1),b=i(W+2),z=i(W+3),S=this.t[w];S.active=!(Z&128),S.id=Z&127,S.active&&(S.x=Math.min(1,(O|(b&15)<<8)/1919),S.y=Math.min(1,(b>>4|z<<4)/E))}this.lastReport=performance.now()}asGamepad(){return{id:(this.kind==="ds5"?"DualSense":"DualShock 4")+" (HID, Vendor: 054c)",connected:!0,mapping:"standard",axes:this.axes,buttons:this.buttons.map(e=>({pressed:e>.5,value:e})),vibrationActuator:{playEffect:(e,t)=>this.rumble(t)}}}async rumble({duration:e=100,strongMagnitude:t=0,weakMagnitude:o=0}={}){if(!this.device)return;let n=Math.round(Math.min(1,t)*255),r=Math.round(Math.min(1,o)*255);try{await this.sendMotors(n,r),clearTimeout(this.rumbleTimer),this.rumbleTimer=setTimeout(()=>this.sendMotors(0,0).catch(()=>{}),e)}catch{}}async sendMotors(e,t){let o=this.device;if(o)if(this.kind==="ds5"){let i=new Uint8Array(47);if(i[0]=3,i[2]=t,i[3]=e,!this.bt)return o.sendReport(2,i);let n=new Uint8Array(77);n[0]=(this.seq=this.seq+1&15)<<4,n[1]=16,n.set(i,2);let r=La(new Uint8Array([162,49,...n.subarray(0,73)]));return n[73]=r&255,n[74]=r>>>8&255,n[75]=r>>>16&255,n[76]=r>>>24&255,o.sendReport(49,n)}else{if(!this.bt){let r=new Uint8Array(31);return r[0]=7,r[3]=t,r[4]=e,o.sendReport(5,r)}let i=new Uint8Array(77);i[0]=192,i[2]=7,i[5]=t,i[6]=e;let n=La(new Uint8Array([162,17,...i.subarray(0,73)]));return i[73]=n&255,i[74]=n>>>8&255,i[75]=n>>>16&255,i[76]=n>>>24&255,o.sendReport(17,i)}}};var pe=(matchMedia("(pointer: coarse)").matches||"ontouchstart"in window)&&!matchMedia("(pointer: fine)").matches,xo=[[0,"\u2738","Burst","r",0],[2,"\u2684","Random","r",1],[3,"\u2605","Save","r",2],[4,"\u2756","Kaleido","l",0],[5,"\u25D1","Colors","l",1],[17,"\u266A","Dance","l",2]],st=class{constructor(e){this.axes=[0,0,0,0],this.buttons=new Array(18).fill(0),this.sticks={l:null,r:null},this.lastInput=0,this.active=!1,this.el=document.createElement("div"),this.el.id="touchUI",this.el.innerHTML=`
      <div class="tzone" data-side="l"></div><div class="tzone" data-side="r"></div>
      <div class="tstick" data-side="l"><i></i></div><div class="tstick" data-side="r"><i></i></div>
      <div class="ttrig" data-b="6" data-side="l"><b>WARP</b><small>hold</small></div>
      <div class="ttrig" data-b="7" data-side="r"><b>DRIVE</b><small>hold</small></div>
      ${xo.map(([l,c,d,h,x])=>`<button class="tbtn" data-b="${l}" data-side="${h}" style="--slot:${x}"><span>${c}</span><small>${d}</small></button>`).join("")}
      <div class="ttop">
        <button class="tico" data-act="sheetVisuals" title="Presets & settings">\u2630</button>
        <button class="tico" data-act="prevPreset">\u2039</button>
        <div class="tname" data-act="sheetVisuals"></div>
        <button class="tico" data-act="nextPreset">\u203A</button>
        <button class="tico" data-act="sheetMusic" title="Music">\u266B</button>
        <button class="tico" data-act="fullscreen" title="Fullscreen">\u26F6</button>
      </div>
      <div class="thint">Left thumb steers \xB7 right thumb morphs</div>`,e.appendChild(this.el);let t=56,o=l=>this.el.querySelector(`.tstick[data-side="${l}"]`),i=l=>{let c=l.target.closest(".tzone");if(!c)return;let d=c.dataset.side;if(this.sticks[d])return;l.preventDefault(),c.setPointerCapture(l.pointerId),this.sticks[d]={id:l.pointerId,x:l.clientX,y:l.clientY};let h=o(d);h.style.left=l.clientX+"px",h.style.top=l.clientY+"px",h.classList.add("on"),this.touch()},n=l=>{for(let c of["l","r"]){let d=this.sticks[c];if(!d||d.id!==l.pointerId)continue;let h=(l.clientX-d.x)/t,x=(l.clientY-d.y)/t,y=Math.hypot(h,x);y>1&&(h/=y,x/=y);let P=c==="l"?0:2;this.axes[P]=h,this.axes[P+1]=x,o(c).querySelector("i").style.transform=`translate(${h*t}px,${x*t}px)`,this.touch()}},r=l=>{for(let c of["l","r"]){let d=this.sticks[c];if(!d||d.id!==l.pointerId)continue;this.sticks[c]=null;let h=c==="l"?0:2;this.axes[h]=this.axes[h+1]=0;let x=o(c);x.classList.remove("on"),x.querySelector("i").style.transform=""}};this.el.addEventListener("pointerdown",i),this.el.addEventListener("pointermove",n),this.el.addEventListener("pointerup",r),this.el.addEventListener("pointercancel",r),this.el.querySelectorAll("[data-b]").forEach(l=>{let c=+l.dataset.b,d=0,h=0,x=P=>{P.preventDefault(),P.stopPropagation(),l.setPointerCapture?.(P.pointerId),clearTimeout(h),d=performance.now(),this.buttons[c]=1,l.classList.add("down"),this.touch()},y=()=>{let P=90-(performance.now()-d),M=()=>{this.buttons[c]=0,l.classList.remove("down")};clearTimeout(h),P>0?h=setTimeout(M,P):M()};l.addEventListener("pointerdown",x),l.addEventListener("pointerup",y),l.addEventListener("pointercancel",y),l.addEventListener("lostpointercapture",y)}),this.el.addEventListener("contextmenu",l=>l.preventDefault())}touch(){this.lastInput=performance.now(),this.active=!0,this.el.classList.add("awake"),this.el.querySelector(".thint").classList.add("gone"),clearTimeout(this._t),this._t=setTimeout(()=>this.el.classList.remove("awake"),3500)}setName(e){let t=this.el.querySelector(".tname");t&&(t.textContent=e)}asGamepad(){return{id:"Touch controls",connected:!0,mapping:"standard",axes:this.axes.slice(),buttons:this.buttons.map(e=>({pressed:e>.5,value:e})),vibrationActuator:{playEffect:(e,t)=>(navigator.vibrate&&t&&t.duration>=100&&navigator.vibrate(Math.min(60,t.duration*.4)),Promise.resolve())}}}};var pt=be.filter(a=>a.scene!=="flux"),Ha=be.filter(a=>a.scene==="flux"),p=a=>document.querySelector(a),me=a=>[...document.querySelectorAll(a)],$=(a,e,t)=>Math.max(e,Math.min(t,a)),D=(a,e,t)=>a+(e-a)*t,j=window.eyecandy||null;j||document.addEventListener("DOMContentLoaded",()=>{},{once:!0});var Yt="eyecandy.settings.v1",mt={resolution:"native",renderScale:"auto",aa:"off",autoExposure:!0,fpsCap:"0",uiScale:1,startFullscreen:!0,showFps:!1,autopilot:!0,autoInterval:20,autoSource:"mix",autoOnDrop:!0,idle:5,reactIntensity:1.5,idleDance:!1,beatRipples:!0,beatPulse:1,beatFlash:.3,cameraShake:.5,beatSens:1.5,gainBass:1,gainMid:1,gainHigh:1,outputDevice:"default",rumble:!0,rumbleStrength:.7,deadzone:.14,stickSens:1,invertY:!1,touchMode:"both",transition:1,autoPause:!0,uiAutoHide:!0,volume:.85,seenGuide:!1},u={...mt,...JSON.parse(localStorage.getItem(Yt)||"{}")};if(!u.aaV){u.aa="off",u.aaV=1;try{localStorage.setItem(Yt,JSON.stringify(u))}catch{}}var fe=()=>localStorage.setItem(Yt,JSON.stringify(u)),ce=p("#gl"),R;try{R=new Je(ce)}catch(a){throw document.body.innerHTML=`<div style="padding:40px;font:16px sans-serif;color:#fff">Eye Candy needs WebGL2.<br><br>${a.message}</div>`,a}R.ssMax=1;var f=new Qe;f.out.gain.value=u.volume;var g=new et;g.deadzone=u.deadzone;var N=new nt;g.hid=N;var ue={active:!1,x:.5,y:.5},we=null;pe&&(document.body.classList.add("mobile"),we=new st(document.body),g.touch=we);var V=wa(),Fe=null,G=null,ie=null,Ie=null,ht=[],rt=null,Se=null,Ga={...oe,trail:0,zoom:1,warp:0,breathe:.15,bloom:.6,chroma:.8,grain:.25};function ve(){return G?Promise.resolve():rt||(Wt(),rt=new Promise((a,e)=>{let t=document.createElement("script");t.src="milk.js",t.onload=()=>{let o=window.EyeMilk;Ie={};for(let i of o.packs)try{Object.assign(Ie,i.getPresets?i.getPresets():i.default?.getPresets())}catch(n){console.warn(n)}ht=Object.keys(Ie).sort((i,n)=>i.localeCompare(n)),ie=document.createElement("canvas"),ie.width=1280,ie.height=720,G=o.butterchurn.createVisualizer(f.ctx,ie,{width:1280,height:720,pixelRatio:1,textureRatio:1}),G.connectAudio(f.input),fetch("milktex/manifest.json").then(i=>i.json()).then(i=>G.loadExtraImages(i)).catch(()=>{}),Wt().then(()=>a())},t.onerror=e,document.head.appendChild(t)}),rt)}function go(a,e){if(!G)return;let t=Math.min(1,1280/a),o=Math.round(a*t),i=Math.round(e*t);(ie.width!==o||ie.height!==i)&&(ie.width=o,ie.height=i,G.setRendererSize(o,i))}var He=null,De={},Et={},Ft=null;function Wt(){return Ft||(Ft=fetch("milklib/index.json").then(a=>a.json()).then(a=>{He={};for(let[e,t,o]of a)He[e]={cat:t,chunk:o},(De[t]=De[t]||[]).push(e);return He}).catch(()=>He={}))}async function Va(a){if(Ie&&Ie[a])return Ie[a];await Wt();let e=He[a];return e?(Et[e.chunk]||(Et[e.chunk]=fetch(`milklib/c${e.chunk}.json`).then(o=>o.json())),(await Et[e.chunk])[a]||null):null}async function Ge(a,e=2){if(!G)return;let t=await Va(a);if(t)try{G.loadPreset(t,e),Se=a}catch(o){console.warn("MilkDrop preset failed",a,o)}}var de="all";function Be(a){return a==="classic"?ht:a!=="all"?De[a]||[]:[...ht,...Object.values(De).flat()]}var Kt=()=>{let a=Be(de==="classic"||de==="all"?"all":de);return a[Math.floor(Math.random()*a.length)]},It=new Map;function Zt(a){return It.has(a)||It.set(a,{id:"milk:"+a,name:a,engine:"milk",milk:a,fx:tt(a,Ga,{trail:0,zoom:1,kaleido:0,mirror:0}),palette:0,builtin:!0}),It.get(a)}var q="eye",m=structuredClone(be[0]),Oe=structuredClone(m),ne=0,s={camX:0,camY:0,roll:0,morphX:0,morphY:0,waitCenter:!1,time:0,timeScale:1,hue:0,burstT:9,flash:0,freeze:!1,lt:0,rt:0,transMix:0,lastSwitch:0,lastHuman:-1e9,kAngle:0,pal:null,flowX:0,flowY:0,hyper:0,autoT:0,panels:!0,cinema:!1,amX:0,amY:0,danceT:0,sinceBeat:9,beatInt:.5,jolt:0,beatRipT:9,beatRipAmt:0,lastAutoBurst:0,lastStick:-1e9,lensRot:0,lensZoom:1,swirl:0,bulge:0,swirlT:0,bulgeT:0,burstCX:0,burstCY:0,pinch:null,touch:[{on:!1,x:0,y:0,vx:0,vy:0,s:0},{on:!1,x:0,y:0,vx:0,vy:0,s:0}],flux:{fa:0,fb:0,fm:0,wa:0,wb:0,wm:0,tf:0,tw:0,mapT:0}},Oa=a=>[...a.a,...a.b,...a.c,...a.d];s.pal=Oa(ot(m.palette));var Dt=[-1,-.5,.25,.5,.75,1,1.5,2,3,4];function yt(a){return a==="eye"?pt:a==="flux"?Ha:a==="user"?V:a==="milk"?Be(de).map(Zt):a==="photo"?$a(se):be}var X=[],se=null,qt=new Map;function $a(a){let e=X.find(o=>o.id===a);if(!e)return[];let t=a+":"+e.name;return qt.has(t)||qt.set(t,Ze.map(o=>zt(e,o.id))),qt.get(t)}var Aa=null;async function bo(a){if(R.photoId===a)return!0;let e=a&&!a.startsWith("__")?await Ba(a):null;return e?(R.setPhoto(e,a),e.close&&e.close(),!0):(R.setPhoto(Aa||(Aa=Ra()),a),!1)}function Jt(){let a=U[m.scene];if(!a)return[];let e=m.params.slice(),[t,o]=a.stick||[0,1],i=(s.waitCenter?0:s.morphX)+s.amX,n=(s.waitCenter?0:s.morphY)+s.amY,r=(l,c)=>{let d=a.params[l];d&&(e[l]=$(e[l]+c*(d.max-d.min)*.35*(d.ms??1),d.min,d.max))};return r(t,i),r(o,n),e}function K(a,e={}){if(a){if(a.photo&&R.photoId!==a.photo){bo(a.photo).then(t=>{!t&&!e.quiet&&T("\u26A0","That photo is no longer on this device"),K(a,e)});return}if(e.transition!==!1&&R.fin&&(R.snapshot(),s.transMix=1),m=structuredClone(a),m.fx={...oe,...a.engine==="milk"?Ga:{},...a.fx},Oe=structuredClone(m),s.waitCenter=Math.abs(s.morphX)+Math.abs(s.morphY)>.1,s.hue=m.fx.hueOffset||0,s.lastSwitch=performance.now(),Bo(a),s.camX=0,s.camY=0,s.lensRot=0,s.lensZoom=1,m.scene==="flux"){let t=m.flux||{flows:[2,7],waves:[0,3]};m.flux=t,Object.assign(s.flux,{fa:t.flows[0],fb:t.flows[0],fm:0,wa:t.waves[0],wb:t.waves[0],wm:0,tf:0,tw:0})}m.engine==="milk"?ve().then(()=>Ge(m.milk,e.transition===!1?0:2)):m.fx.fusion>0&&ve().then(()=>{m.milk?Ge(m.milk):Se||Ge(Kt())}),m.engine==="scene"&&R.errors[m.scene]&&T("\u26A0","Scene failed to compile \u2014 skipping"),p("#presetName").textContent=m.name,H(),re(),e.quiet||T("\u25C6",m.name)}}function xe(a){let e=yt(q);if(!e.length){q==="milk"&&ve().then(()=>{H(),xe(a)});return}ne=((ne+a)%e.length+e.length)%e.length,K(e[ne])}function Qt(){if(m.engine==="milk"){m.fx={...m.fx,...Mt({...m,scene:"none"}).fx},m.name=m.milk+" \u2684",p("#presetName").textContent=m.name,re(),T("\u2684","Randomized FX");return}K(Mt(m),{quiet:!0}),T("\u2684","Randomized \xB7 "+m.name)}function ea(){K(Rt(),{quiet:!0}),T("\u2726","Generated \xB7 "+m.name)}function ja(){let a=structuredClone(m);return a.engine==="scene"&&(a.params=Jt().map(e=>+e.toFixed(4))),a.fx={...a.fx,hueOffset:(s.hue%1+1)%1,speed:+(a.fx.speed*Math.abs(s.timeScale)).toFixed(3)},a.engine==="scene"&&a.fx.fusion>0&&Se&&(a.milk=Se),a}function Pt(){let a=ja();a.id="user-"+Date.now().toString(36),a.builtin=!1,(Oe.builtin||!a.name||V.some(e=>e.name===a.name))&&(a.name=(a.engine==="milk"?"Milk \xB7 ":"")+at()),V.push(a),_e(V),m=structuredClone(a),Oe=structuredClone(a),p("#presetName").textContent=m.name,H(),re(),T("\u2605","Saved \u201C"+a.name+"\u201D to My Presets"),g.rumble(.4,.6,120)}function yo(){let a=V.findIndex(t=>t.id===m.id);if(a<0)return Pt();let e=ja();e.name=p("#pName").value||e.name,V[a]=e,_e(V),Oe=structuredClone(e),m=structuredClone(e),s.timeScale=1,H(),T("\u2605","Updated \u201C"+e.name+"\u201D")}function Po(){let a=V.findIndex(e=>e.id===m.id);a<0||(V.splice(a,1),_e(V),H(),T("\u2716","Deleted"),xe(0))}function $e(a=1,e=0,t=0){s.burstCX=e,s.burstCY=t,s.burstT=0,s.flash=.55*a,g.rumble(.9*a*u.rumbleStrength,.5*a*u.rumbleStrength,160)}function Wa(a=1){let e=typeof m.palette=="number"?m.palette:-1;m.palette=((e+a)%Y.length+Y.length)%Y.length,T(g.label("RB"),"Palette \xB7 "+Y[m.palette].name),re()}var Ut=[0,3,4,5,6,8,12,16];function Xa(){let a=Ut.indexOf(m.fx.kaleido);m.fx.kaleido=Ut[(a+1)%Ut.length],T(g.label("LB"),m.fx.kaleido?"Kaleidoscope \xD7"+m.fx.kaleido:"Kaleidoscope off"),re()}function Ya(){m.fx.mirror=m.fx.mirror?0:1,T(g.label("LB"),m.fx.mirror?"Mirror world":"Mirror off"),re()}function vt(a){let e=Dt.indexOf(s.timeScale);e<0&&(e=5),e=$(e+a,0,Dt.length-1),s.timeScale=Dt[e],T(a>0?"\u25B2":"\u25BC",s.timeScale<0?"Time reversed \xD7"+Math.abs(s.timeScale):"Time \xD7"+s.timeScale)}function To(){s.camX=s.camY=s.roll=0,s.lensRot=0,s.lensZoom=1,s.timeScale=1,s.flowX=s.flowY=0,T(g.label("L3"),"View reset")}function wo(){m.engine==="scene"&&(m.params=Jt(),s.waitCenter=!0,re(),T(g.label("R3"),"Shape locked in"),g.rumble(.2,.5,60))}function ta(a){u.autopilot=a,fe(),p("#autoBtn").classList.toggle("on",a),T("\u27F3",a?"Autopilot on":"Autopilot off"),wt()}function Me(){s.lastHuman=performance.now()}var Ea={},ft=[],ko=6;function So(a){let e=[...Array(a).keys()];for(let t=a-1;t>0;t--){let o=Math.floor(Math.random()*(t+1));[e[t],e[o]]=[e[o],e[t]]}return e}function Pe(a,e,t=()=>!0){if(!e.length)return null;let o=Ea[a];(!o||o.n!==e.length||!o.left.length)&&(o=Ea[a]={n:e.length,left:So(e.length)});for(let i=o.left.length-1;i>=Math.max(0,o.left.length-40);i--){let n=e[o.left[i]];if(t(n))return o.left.splice(i,1),n}return e[o.left.pop()]}var lt=a=>!a.scene||!ft.includes(a.scene)&&!R.errors[a.scene];function Bo(a){a&&a.engine!=="milk"&&a.scene&&(ft.push(a.scene),ft.length>ko&&ft.shift())}var Fa=()=>[...new Set(Be("all"))],Mo=ze.map(a=>({scene:a.id})),Ro=[["milk",.36],["eye",.32],["flux",.12],["generate",.14],["user",.06]];function zo(a){if(a==="all")return Math.random()<.5?"milk":"eye";if(a==="photo")return X.length?"photo":"eye";if(a!=="mix"&&a!=="mixp")return a;let e=[...Ro,...a==="mixp"&&X.length?[["photo",.2]]:[]].filter(([i])=>i!=="user"||V.length),t=e.reduce((i,[,n])=>i+n,0),o=Math.random()*t;for(let[i,n]of e)if((o-=n)<0)return i;return"eye"}function Ka(){let a=u.autoSource,e=zo(a);if(e==="milk")return s.autoBusy=!0,ve().then(()=>{let n=a==="milk"?Be(de==="classic"?"all":de):Fa(),r=Pe(a==="milk"?"milk:"+de:"milk:all",n.length?n:Fa());r&&K(Zt(r),{quiet:!0})}).finally(()=>{s.autoBusy=!1,s.lastSwitch=performance.now()});let t=null;if(e==="generate"){let n=Pe("gen",Mo,lt);t=Rt(n&&n.scene)}else if(e==="flux")t=Pe("flux",Ha);else if(e==="user")t=Pe("user",V,lt);else if(e==="photo"){let n=X.flatMap(l=>Ze.map(c=>({ph:l,scene:c.id}))),r=Pe("photo:"+X.length,n,lt);r&&(t=zt(r.ph,r.scene))}t||(t=Pe("eye",pt,lt));let o=yt(q),i=o.indexOf(t);i>=0&&(ne=i),t.photo&&q==="photo"&&se!==t.photo&&(se=t.photo,H()),K(t,{quiet:!0})}function Co(a,e){let t=u.autopilot&&(!u.autoPause||e-s.lastHuman>u.idle*1e3);if(s.autoActive=t,!t||s.autoBusy)return;s.autoT+=a;let o=(e-s.lastSwitch)/1e3,i=u.autoOnDrop&&f.drop>1.1&&o>12;(o>u.autoInterval||i)&&(f.drop=0,s.lastSwitch=e,Ka(),i&&$e(.8))}function Lo(a){if(g.poll(),g.justConnected&&g.style!=="touch"&&(T("\u{1F3AE}",(g.style==="ps"?"PlayStation":"Xbox")+" controller connected"),g.rumble(.5,.8,200),u.seenGuide||(u.seenGuide=!0,fe(),ke(!0)),g.style==="ps"&&N.supported&&!N.connected&&!j&&(p("#tpChip").classList.remove("hidden"),setTimeout(()=>T("\u25C9","PlayStation pad: click \u201CEnable touchpad\u201D up top to use the touchpad"),1500)),ca()),!g.connected){s.lt=D(s.lt,0,a*6),s.rt=D(s.rt,0,a*6);return}let[e,t,o,i]=g.axes;if((g.pressed.some(Boolean)||Math.abs(e)+Math.abs(t)+Math.abs(o)+Math.abs(i)+g.lt+g.rt>.05)&&(Me(),p("#splash").classList.contains("gone")||Ao(),u.uiAutoHide&&Tt()),!p("#controls").classList.contains("hidden")){(g.tap(F.B)||g.tap(F.A)||g.shortRelease(F.BACK))&&ke(!1);return}let r=u.stickSens,l=u.invertY?-1:1;if(Math.abs(e)+Math.abs(t)+Math.abs(o)+Math.abs(i)>.05&&(s.lastStick=performance.now()),m.engine==="milk")s.lensRot+=e*a*1.8*r,s.lensZoom=$(s.lensZoom*Math.exp(t*l*a*1.3*r),.3,4),s.swirlT=o*1.5*r,s.bulgeT=-i*l*1.1*r;else{let d=U[m.scene]&&U[m.scene].camSens||1;s.camX+=e*a*1.5*r*d,s.camY=$(s.camY-t*l*a*1.1*r*d,-1.3,1.3),s.waitCenter&&Math.hypot(o,i)<.12&&(s.waitCenter=!1),s.morphX=D(s.morphX,$(o*r,-1.5,1.5),a*8),s.morphY=D(s.morphY,$(-i*l*r,-1.5,1.5),a*8),s.swirlT=o*.3*r,s.bulgeT=-i*l*.15*r}s.flowX=D(s.flowX,e,a*5),s.flowY=D(s.flowY,-t*l,a*5),s.lt=D(s.lt,g.lt,a*10),s.rt=D(s.rt,g.rt,a*10),g.lt>.08&&Math.random()<a*3&&Xt("LT","Warp",g.lt),g.rt>.08&&Math.random()<a*3&&Xt("RT","Drive",g.rt);let c=g.lt>.92&&g.rt>.92;c&&!s.hyperOn&&(T("\u2604","HYPERDRIVE"),$e(1.2)),s.hyperOn=c,g.tap(F.A)&&$e(1),g.tap(F.TOUCH)&&(u.idleDance=!u.idleDance,fe(),wt(),T("\u25C9",u.idleDance?"Music dance ON":"Music dance OFF \u2014 pure beat reactive"),g.rumble(.3,.5,90)),g.style==="ps"&&N.supported&&!N.connected&&!s.tpTried&&(s.tpTried=!0,N.autoConnect().then(d=>{!d&&j&&N.request()})),s.freeze=g.down(F.B),g.tap(F.B)&&T(g.label("B"),"Freeze"),g.shortRelease(F.X)&&Qt(),g.hold(F.X,550)&&(ea(),g.rumble(.6,.6,150)),g.tap(F.Y)&&Pt(),g.shortRelease(F.LB)&&Xa(),g.hold(F.LB,500)&&Ya(),g.shortRelease(F.RB)&&Wa(1),g.down(F.RB)&&performance.now()-g.downAt[F.RB]>300&&(s.hue+=a*.5,Math.random()<a*2&&T(g.label("RB"),"Hue spin")),g.tap(F.RIGHT)&&xe(1),g.tap(F.LEFT)&&xe(-1),g.tap(F.UP)&&vt(1),g.tap(F.DOWN)&&vt(-1),g.tap(F.L3)&&To(),g.tap(F.R3)&&wo(),g.tap(F.START)&&(s.cinema=!1,aa(!0),Qa()),g.shortRelease(F.BACK)&&ke(!0),g.hold(F.BACK,700)&&ta(!u.autopilot)}function Ao(){!f.playlist.length&&f.mode==="player"&&!Fe&&oa(),Ve()}function Eo(a,e){if(m.scene!=="flux"||!m.flux)return;let t=s.flux,o=m.flux,i=e[4]||14,n=(l,c)=>{let d=l.filter(h=>h!==c);return d.length?d[Math.floor(Math.random()*d.length)]:l[0]};t.tf+=a,t.tw+=a,t.fm>0&&t.fm<1&&(t.fm=Math.min(1,t.fm+a/3.5)),t.fm>=1&&(t.fa=t.fb,t.fm=0),t.fm===0&&t.tf>i&&o.flows.length>1&&(t.fb=n(o.flows,t.fa),t.fm=.001,t.tf=0),t.wm>0&&t.wm<1&&(t.wm=Math.min(1,t.wm+a/2)),t.wm>=1&&(t.wa=t.wb,t.wm=0);let r=f.drop>.9&&t.tw>4;t.wm===0&&(t.tw>i*.7||r)&&o.waves.length>1&&(t.wb=n(o.waves,t.wa),t.wm=.001,t.tw=0),t.mapT+=a*.03*(e[5]??1)*(1+f.vol*.8)}function Fo(a){let e=R.W&&R.H?R.W/R.H:1.7777777777777777,t;N.connected&&performance.now()-N.lastReport<600?t=N.t.map(n=>n.active?n:null):t=[ue.active?ue:null,null];for(let n=0;n<2;n++){let r=s.touch[n],l=t[n];if(l&&u.touchMode!=="off"){let c=(l.x-.5)*e,d=.5-l.y;r.on||(r.x=c,r.y=d,r.vx=r.vy=0);let h=(c-r.x)/Math.max(a,.001),x=(d-r.y)/Math.max(a,.001);r.vx=D(r.vx,h,.35),r.vy=D(r.vy,x,.35),r.x=c,r.y=d,r.on=!0,r.s=Math.min(1,r.s+a*3),Me()}else r.on=!1,r.s=Math.max(0,r.s-a*2),r.vx*=.9,r.vy*=.9}let[o,i]=s.touch;if(o.on&&i.on){let n=Math.hypot(o.x-i.x,o.y-i.y),r=Math.atan2(i.y-o.y,i.x-o.x);if(s.pinch){s.lensZoom=$(s.lensZoom*(n/Math.max(.02,s.pinch.d)),.3,4);let l=r-s.pinch.a;l>Math.PI&&(l-=2*Math.PI),l<-Math.PI&&(l+=2*Math.PI),s.lensRot+=l}s.pinch={d:n,a:r}}else s.pinch=null}var Ia=(a,e)=>[a.x,a.y,e?a.s*(s.pinch?.3:1):0,a.s>.01?1:0];function Za(a){let e=s.pal,t=[];for(let o=0;o<3;o++)t.push($(e[o]+e[3+o]*Math.cos(6.2831853*(e[6+o]*a+e[9+o]+s.hue)),0,1));return t}var _t=performance.now(),ct=0,Nt=0,Ne=16,Ce=0,Ht=0;function Ja(a){requestAnimationFrame(Ja);let e=+u.fpsCap;if(e>0&&a-_t<1e3/e-1.5)return;let t=Math.min(.05,(a-_t)/1e3);_t=a,Lo(t),Fo(t);let o=m.fx,i=s.rt,n=s.lt,r=s.hyperOn?1:0;s.hyper=D(s.hyper,r,t*3),f.update(t,o.react*(1+i*1.6),{sens:u.beatSens,gB:u.gainBass,gM:u.gainMid,gH:u.gainHigh}),Co(t,a);let l=u.reactIntensity*o.react,c=u.idleDance?1:0;s.danceT+=t*(.5+f.vol*1.2);let d=s.danceT;s.amX=D(s.amX,c*l*o.dance*(Math.sin(d*.53)*.3*(.35+f.mid)+f.bass*.22*Math.sin(d*.19+1)),t*4),s.amY=D(s.amY,c*l*o.dance*(Math.cos(d*.41)*.25*(.35+f.high)+f.beat*.28),t*6);let h=c*Math.min(l,2)*o.dance*Math.sin(d*.07+.5)*(.04+f.vol*.1),x=c*Math.min(l,2)*o.dance*Math.sin(d*.11)*(.02+f.mid*.05);m.engine==="milk"&&c>.5&&(s.lensRot+=t*l*o.swirlA*.05*Math.sin(d*.05),a-s.lastStick>4e3&&(s.lensZoom=D(s.lensZoom,1+Math.sin(d*.09)*.15*o.bulgeA,t*.2))),s.sinceBeat+=t,f.isBeat&&(s.sinceBeat>.2&&s.sinceBeat<2&&(s.beatInt=D(s.beatInt,s.sinceBeat,.3)),s.sinceBeat=0,s.jolt=(Math.random()-.5)*2,s.beatRipT=0,s.beatRipAmt=Math.min(1.6,f.bass*.9)*l*o.ripple,u.beatFlash>0&&f.bass>1.2&&a-s.lastAutoBurst>2200&&(s.flash=Math.max(s.flash,u.beatFlash*.5*Math.min(l,1.5)),s.lastAutoBurst=a)),s.jolt*=Math.exp(-t*7),s.beatRipT+=t;let y=m.engine==="scene"&&U[m.scene]&&U[m.scene].landscape?.12:1;s.swirl=D(s.swirl,s.swirlT*(y<1?.4:1)+y*Math.min(l,2)*c*o.swirlA*Math.sin(d*.17)*(.04+f.mid*.16),t*4),s.bulge=D(s.bulge,s.bulgeT+y*Math.min(l,2)*o.bulgeA*f.bass*.08,t*10),o.kaleido>1&&(s.kAngle+=t*f.mid*.25*l*Math.sin(d*.11));let P=window.devicePixelRatio||1,M=u.resolution==="native"?Math.round(innerHeight*Math.min(P,pe?1.25:2)):+u.resolution,E=Math.round(M*innerWidth/Math.max(1,innerHeight));(ce.width!==E||ce.height!==M)&&(ce.width=E,ce.height=M),Ne=D(Ne,t*1e3,.05);let w,W,Z=m.engine==="scene"?U[m.scene]:null,O=m.engine==="milk"?"milk":m.scene||"x",b=[1,1,.9,.8,.7,.6,.5,.4],z=Z&&Z.ss&&!pe&&u.aa==="auto"?0:1,S=m.engine==="milk"?4:b.length-1,L=s.quality||(s.quality={});L[O]||(L[O]={rung:pe?5:z,lockUntil:0,probeAt:-1});let k=L[O];if(k.rung=$(k.rung,z,S),u.renderScale==="auto"){Ce+=t;let Q=e>0?1e3/e:16.7,Xe=performance.now()/1e3;s.qKey!==O&&(s.qKey=O,Ce=-1.5,Ne=Q),Ce>1.5&&(Ne>Q*1.22&&k.rung<S?(k.probeAt>0&&Xe-k.probeAt<5&&(k.lockUntil=Xe+45),k.rung++,k.probeAt=-1,Ce=0):Ne<Q*1.08&&k.rung>z&&Xe>k.lockUntil&&Ce>4&&(k.rung--,k.probeAt=Xe,Ce=0)),w=b[k.rung],m.engine==="milk"&&(w=Math.max(w,.7))}else w=$(+u.renderScale,.25,2);W=u.aa==="off"?1:u.aa==="2x"?2:u.aa==="4x"?4:pe?1:u.renderScale==="auto"?k.rung===0?2:1:2,s.qs=w,R.ssMax=W;let C=R.fin;R.resize(E,M,w),C!==R.fin&&(R.transTex=null);let I=o.speed*s.timeScale*(1+i*1.2+s.hyper*2);s.freeze||(s.time+=t*I*(1+f.vol*.45*Math.min(l,2.5))),s.hue+=t*(o.hueSpin||0),s.kAngle+=t*(o.kaleidoSpin||0)*.5,s.burstT+=t,s.flash*=Math.exp(-t*6),s.transMix=Math.max(0,s.transMix-t/Math.max(.2,u.transition)),s.roll=D(s.roll,s.flowX*.25,t*2);let _=Oa(ot(m.palette));for(let Q=0;Q<12;Q++)s.pal[Q]=D(s.pal[Q],_[Q],1-Math.exp(-t*2.5));if(R.uploadAudio(f.tex),(m.engine==="milk"||o.fusion>0)&&G){go(Math.max(R.sw,Math.min(E,1280)),Math.max(R.sh,Math.round(Math.min(E,1280)*M/E)));try{G.render(),R.uploadMilk(ie)}catch(Q){console.warn(Q)}}let te=m.engine==="scene"?Jt():[0,0,0,0,0,0,0,0];for(;te.length<8;)te.push(0);Eo(t,te);let qe=f.beat*u.beatPulse*o.punch*.05*Math.min(l,2.5),ao=f.beat*u.cameraShake*o.shake*Math.min(l,2)*.5,We=s.pal,ma=u.touchMode==="both"||u.touchMode==="vortex",oo=u.touchMode==="both"||u.touchMode==="paint",fa=s.touch[0],io=o.trail>.15?f.bass*.05*Math.min(l,2):0;R.frame({adaptRate:1-Math.exp(-t*2.5),engine:m.engine==="milk"&&G?"milk":"scene",scene:m.engine==="milk"?"nebula":m.scene,sceneU:{uTime:s.time,uBass:f.bass,uMid:f.mid,uHigh:f.high,uVol:f.vol,uBeat:f.beat,uDrive:i,uBurst:s.burstT,uHue:s.hue,uBeatCount:f.beatCount,uSinceBeat:s.sinceBeat,uBeatInt:s.beatInt,uFlowA:s.flux.fa,uFlowB:s.flux.fb,uFlowMix:s.flux.fm,uWaveA:s.flux.wa,uWaveB:s.flux.wb,uWaveMix:s.flux.wm,uMapT:s.flux.mapT,uPhoto:R.photoTex,uPhotoAR:R.photoAR,uAudio:R.audioTex,uP0:te.slice(0,4),uP1:te.slice(4,8),uPalA:We.slice(0,3),uPalB:We.slice(3,6),uPalC:We.slice(6,9),uPalD:We.slice(9,12),uCam:[s.camX+h,s.camY+x,s.roll+s.jolt*.06*u.cameraShake]},fbU:{uTime:s.time,uTrail:Math.min(.96,Math.max(o.trail+io,n*.9,s.hyper*.86)),uZoom:o.zoom+n*.035+s.hyper*.04+f.beat*u.beatPulse*.008*l,uSpin:o.spin+n*s.flowX*.03+s.jolt*.004*u.cameraShake,uWarp:o.warp+n*.8+f.mid*.3*Math.min(l,2),uHueDrift:o.hueDrift+n*.012+s.hyper*.05+f.high*.006*l,uKaleido:o.kaleido,uKaleidoSpin:s.kAngle,uMirror:o.mirror,uFusion:m.engine==="milk"?0:G?o.fusion:0,uBreathe:o.breathe+i*.6+f.bass*.35*Math.min(l,2),uMelt:o.melt+n*.5+f.high*.25*Math.min(l,2),uBass:f.bass,uBeat:f.beat,uBurstT:s.burstT,uBurstC:[s.burstCX,s.burstCY],uFlow:[s.flowX*n,s.flowY*n],uLensRot:s.lensRot+s.jolt*.025*u.cameraShake,uLensZoom:s.lensZoom,uLensPan:[0,0],uSwirl:s.swirl,uBulge:s.bulge,uPunch:qe,uShake:ao,uBeatRipT:u.beatRipples?s.beatRipT:9,uBeatRipAmt:s.beatRipAmt,uEdgeBlack:m.engine==="scene"&&U[m.scene]&&U[m.scene].space?1:0,uTouch:Ia(s.touch[0],ma),uTouch2:Ia(s.touch[1],ma),uTouchVel:[$(fa.vx*.02,-.08,.08),$(fa.vy*.02,-.08,.08)],uTouchColor:Za(s.time*.05),uTouchPaint:oo?1.2:0},finU:{uTime:a/1e3,uChroma:o.chroma+i*2+s.hyper*2+f.beat*1.2*Math.min(l,2),uBloomAmt:o.bloom*(1-s.hyper*.5)+i*.45,uAutoExp:u.autoExposure?1:0,uGrain:o.grain,uVignette:o.vignette,uBurstC:[s.burstCX,s.burstCY],uExposure:o.exposure*(1+i*.12-s.hyper*.15),uSat:o.saturation,uContrast:o.contrast+n*.06,uFlash:s.flash,uTransMix:s.transMix,uBurstT:s.burstT,uBeat:f.beat,uInvert:0}}),u.rumble&&g.connected&&f.isBeat&&performance.now()-s.lastHuman<3e4&&g.rumble(Math.min(1,f.bass*.45)*u.rumbleStrength*(.35+i),.15*u.rumbleStrength,70),s.hyperOn&&u.rumble&&Math.random()<t*10&&g.rumble(.25*u.rumbleStrength,.6*u.rumbleStrength,60),Ht+=t,Ht>1/30&&(Ht=0,Io(),we&&we._n!==m.name&&(we._n=m.name,we.setName(m.name))),ct+=t,Nt++,ct>.5&&(u.showFps?p("#fps").textContent=`${Math.round(Nt/ct)} fps \xB7 out ${E}\xD7${M} \xB7 render ${R.sw}\xD7${R.sh} (${Math.round(w*100)}%)`:p("#fps").textContent="",ct=0,Nt=0)}var Te=document.documentElement.style,Le=document.getElementById("spec"),ye=Le?Le.getContext("2d"):null;function Io(){let a=e=>Za(e).map(t=>Math.round(t*255)).join(",");if(Te.setProperty("--c1",a(0)),Te.setProperty("--c2",a(.33)),Te.setProperty("--c3",a(.66)),Te.setProperty("--bass",Math.min(1.5,f.bass).toFixed(3)),Te.setProperty("--beat",f.beat.toFixed(3)),ye&&je.classList.contains("show")){let e=Le.width=Le.clientWidth*2,t=Le.height=Le.clientHeight*2;ye.clearRect(0,0,e,t);let o=48,i=e/o,n=ye.createLinearGradient(0,0,e,0);n.addColorStop(0,`rgb(${a(0)})`),n.addColorStop(.5,`rgb(${a(.33)})`),n.addColorStop(1,`rgb(${a(.66)})`),ye.fillStyle=n;for(let r=0;r<o;r++){let l=f.tex[Math.floor(r/o*400)]/255,c=Math.max(2,l*l*t);ye.globalAlpha=.35+l*.6,ye.fillRect(r*i+1,t-c,i-2,c)}ye.globalAlpha=1}}var ut=p("#hud");function T(a,e){let t=document.createElement("div");for(t.className="toast",t.innerHTML=`<span class="g">${a}</span><span>${ee(e)}</span>`,ut.appendChild(t);ut.children.length>3;)ut.firstChild.remove();setTimeout(()=>{t.style.opacity=0,setTimeout(()=>t.remove(),450)},1700)}var Da={};function Xt(a,e,t){let o=Da[a];(!o||!o.isConnected)&&(o=document.createElement("div"),o.className="toast",o.innerHTML=`<span class="g">${g.label(a)}</span><span>${e}</span><span class="bar"><i></i></span>`,ut.appendChild(o),Da[a]=o),o.querySelector("i").style.width=Math.round(t*100)+"%",o.style.opacity=1,clearTimeout(o._t),o._t=setTimeout(()=>{o.style.opacity=0,setTimeout(()=>o.remove(),450)},900)}var ee=a=>String(a).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),je=p("#ui"),xt=0;function aa(a){s.cinema&&!a||(je.classList.add("show"),document.body.classList.remove("idle"),clearTimeout(xt),u.uiAutoHide&&(xt=setTimeout(()=>{(!je.matches(":hover")||a==="fromPad")&&Tt()},3500)))}function Tt(){p("#splash").classList.contains("gone")&&!document.activeElement?.matches("input,select")&&(je.classList.remove("show"),document.body.classList.add("idle"))}function Qa(){s.panels=!s.panels,document.body.classList.toggle("panels-off",!s.panels)}window.addEventListener("mousemove",()=>aa());je.addEventListener("mouseleave",()=>{clearTimeout(xt),u.uiAutoHide&&(xt=setTimeout(Tt,1500))});function Ve(){p("#splash").classList.add("gone"),document.body.classList.add("started"),we&&!u.seenTouchHint&&(u.seenTouchHint=!0,fe(),setTimeout(()=>T("\u{1F44D}","Put your thumbs down \u2014 left steers, right morphs"),900))}var Do={addFiles:()=>p("#fileIn").click(),addFolder:()=>p("#folderIn").click(),loopback:async()=>{try{Ae(),await f.useLoopback(),Ve(),T("\u{1F50A}","Listening to your PC audio")}catch(a){T("\u26A0",a.message||"Capture cancelled")}},mic:async()=>{try{Ae(),await f.useMic(),Ve(),T("\u{1F399}","Listening to microphone")}catch{T("\u26A0","Microphone unavailable")}},demo:()=>{oa(),Ve()},srcPlayer:()=>{Ae(),f.useSource("player"),f.playlist.length&&f.toggle()},prevPreset:()=>xe(-1),nextPreset:()=>xe(1),mutate:Qt,generate:ea,save:Pt,overwrite:yo,revert:()=>{K(Oe,{quiet:!0}),T("\u21BA","Reverted")},deletePreset:Po,resetSettings:()=>{let a=document.querySelector("[data-act=resetSettings]");if(a&&!a.dataset.armed){a.dataset.armed="1";let t=a.textContent;a.textContent="Tap again to reset everything",setTimeout(()=>{delete a.dataset.armed,a.textContent=t},3e3);return}let e=["volume","seenGuide","seenTouchHint","outputDevice","aaV"];for(let t of Object.keys(mt))e.includes(t)||u[t]===mt[t]||(u[t]=mt[t],he[t]&&he[t](u[t]));fe(),wt(),p("#autoBtn").classList.toggle("on",u.autopilot),T("\u21BA","Settings back to defaults")},autopilot:()=>ta(!u.autopilot),controls:()=>ke(!0),fullscreen:ia,playPause:()=>{Ae(),f.toggle()},prevTrack:()=>f.prev(),nextTrack:()=>f.next(),shuffle:()=>{f.shuffle=!f.shuffle,gt()},repeat:()=>{f.repeat={all:"one",one:"off",off:"all"}[f.repeat],gt()},clearList:()=>{f.clear(),sa()},exportPresets:()=>{let a=new Blob([JSON.stringify(V,null,2)],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(a),e.download="eye-candy-presets.json",e.click()},importPresets:()=>p("#importIn").click(),sheetVisuals:()=>dt("visuals"),sheetMusic:()=>dt("music"),closeSheet:()=>dt(null),touchpad:async()=>{let a=await N.request();T("\u25C9",a?"Touchpad on \u2014 swipe to stir the visuals":"No PlayStation controller found"),p("#tpChip").classList.toggle("hidden",a)}};document.addEventListener("click",a=>{let e=a.target.closest("[data-act]");if(!e)return;f.resume();let t=Do[e.dataset.act];t&&t()});function oa(){Fe||(f.el.pause(),f.stopStream(),f.mode="demo",Fe=za(f),f.resume(),eo(),T("\u2726","Demo groove"))}function Ae(){Fe&&(Fe(),Fe=null,f.mode==="demo"&&(f.mode="player"))}async function dt(a){let e=document.body,t=e.classList.contains("sheet-visuals")?"visuals":e.classList.contains("sheet-music")?"music":null;e.classList.remove("sheet-visuals","sheet-music"),a&&a!==t&&e.classList.add("sheet-"+a),a==="visuals"&&H()}async function ia(){if(j&&j.setFullscreen){j.setFullscreen(!await j.isFullscreen());return}document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{})}function ke(a){ca(),p("#controls").classList.toggle("hidden",!a)}var qo=/\.(mp3|flac|wav|ogg|oga|m4a|aac|opus|webm|wma|aiff?)$/i,Uo=a=>({name:a.name.replace(/\.[^.]+$/,""),url:URL.createObjectURL(a),path:j?j.pathFor(a):null});function na(a){let e=[...a].filter(t=>qo.test(t.name)||(t.type||"").startsWith("audio/")).sort((t,o)=>(t.webkitRelativePath||t.name).localeCompare(o.webkitRelativePath||o.name,void 0,{numeric:!0}));if(!e.length)return T("\u26A0","No audio files found");Ae(),f.addTracks(e.map(Uo)),Ve(),sa(),T("\u266B",`Added ${e.length} track${e.length>1?"s":""}`)}p("#fileIn").onchange=a=>{na(a.target.files),a.target.value=""};p("#folderIn").onchange=a=>{na(a.target.files),a.target.value=""};p("#importIn").onchange=async a=>{try{let e=JSON.parse(await a.target.files[0].text()),t=(Array.isArray(e)?e:[e]).filter(o=>o&&o.engine);t.forEach(o=>{o.id="user-"+Math.random().toString(36).slice(2),o.builtin=!1}),V.push(...t),_e(V),H(),T("\u2605",`Imported ${t.length} presets`)}catch{T("\u26A0","Could not read that file")}a.target.value=""};window.addEventListener("dragover",a=>a.preventDefault());window.addEventListener("drop",async a=>{a.preventDefault(),f.resume();let e=[...a.dataTransfer.items||[]],t=[],o=r=>new Promise(l=>{if(r.isFile)r.file(c=>{t.push(c),l()},l);else if(r.isDirectory){let c=r.createReader(),d=[],h=()=>c.readEntries(async x=>{if(x.length)d.push(...x),h();else{for(let y of d)await o(y);l()}},l);h()}else l()}),i=e.map(r=>r.webkitGetAsEntry&&r.webkitGetAsEntry()).filter(Boolean);if(i.length)for(let r of i)await o(r);else t.push(...a.dataTransfer.files);if(t.some(r=>/^image\//.test(r.type))&&!t.some(r=>/^audio\//.test(r.type)||/\.(mp3|wav|flac|ogg|m4a|aac|opus)$/i.test(r.name))){await la(t);return}let n=t.find(r=>/\.json$/i.test(r.name));if(n&&t.length===1){p("#importIn").onchange({target:{files:[n],value:""}});return}na(t)});function _o(a){return"app://eye/media/"+encodeURIComponent(a)}function sa(){j&&localStorage.setItem("eyecandy.playlist",JSON.stringify(f.playlist.filter(a=>a.path).map(a=>({name:a.name,path:a.path}))))}function No(){if(j)try{let a=JSON.parse(localStorage.getItem("eyecandy.playlist")||"[]");f.playlist.push(...a.map(e=>({...e,url:_o(e.path)})))}catch{}}var qa=a=>isFinite(a)?`${Math.floor(a/60)}:${String(Math.floor(a%60)).padStart(2,"0")}`:"0:00";function gt(){let a=p("#playlist");f.playlist.length?a.innerHTML=f.playlist.map((e,t)=>`<li data-i="${t}" class="${t===f.index&&f.mode==="player"?"cur":""}"><span class="n">${t+1}</span><span class="t">${ee(e.name)}</span><button class="x" data-x="${t}">\u2715</button></li>`).join(""):a.innerHTML='<li class="empty">Drop songs or folders here<br><small>mp3 \xB7 flac \xB7 wav \xB7 ogg \xB7 m4a</small></li>',p("#shuffleBtn").classList.toggle("on",f.shuffle),p("#repeatBtn").textContent={all:"\u21BB Repeat all",one:"\u21BB Repeat one",off:"\u2192 No repeat"}[f.repeat],p("#repeatBtn").classList.toggle("on",f.repeat!=="off"),eo()}p("#playlist").addEventListener("click",a=>{let e=a.target.closest("[data-x]");if(e){f.remove(+e.dataset.x),sa();return}let t=a.target.closest("li[data-i]");t&&(Ae(),f.play(+t.dataset.i))});function eo(){let a=f.current,e=f.mode;p("#npTitle").textContent=e==="loopback"?"PC audio":e==="mic"?"Microphone":e==="demo"?"Demo groove":a?a.name:"Nothing playing",p("#npSub").textContent=e==="player"?a?`Track ${f.index+1} of ${f.playlist.length}`:"Drop music anywhere":"Live input",p("#playBtn").textContent=p("#playBtn2").textContent=e==="player"&&!f.el.paused?"\u275A\u275A":"\u25B6";for(let[t,o]of[["#srcPlayer","player"],["#srcLoop","loopback"],["#srcMic","mic"],["#srcDemo","demo"]])p(t).classList.toggle("on",e===o)}f.onchange=gt;var bt=p("#seek"),ra=!1;bt.addEventListener("input",()=>{ra=!0});bt.addEventListener("change",()=>{isFinite(f.el.duration)&&(f.el.currentTime=bt.value/1e3*f.el.duration),ra=!1});p("#vol").value=Math.round(u.volume*100);p("#vol").addEventListener("input",a=>{u.volume=a.target.value/100,f.out.gain.value=u.volume,fe()});setInterval(()=>{let a=f.el;!ra&&isFinite(a.duration)&&(bt.value=a.currentTime/a.duration*1e3),p("#tCur").textContent=qa(a.currentTime),p("#tDur").textContent=qa(a.duration)},250);var Gt=new Map;function Ua(a){if(a.engine==="milk"){let n=0;for(let r of a.name)n=(n*31+r.charCodeAt(0))%360;return`linear-gradient(90deg,hsl(${n},90%,55%),hsl(${(n+80)%360},90%,50%),hsl(${(n+160)%360},90%,55%))`}let e=JSON.stringify(a.palette);if(Gt.has(e))return Gt.get(e);let t=ot(a.palette),o=[];for(let n=0;n<=4;n++){let r=n/4,l=[0,1,2].map(c=>Math.round(255*$(t.a[c]+t.b[c]*Math.cos(6.2831853*(t.c[c]*r+t.d[c])),0,1)));o.push(`rgb(${l})`)}let i=`linear-gradient(90deg,${o.join(",")})`;return Gt.set(e,i),i}function H(){let a=p("#search").value.trim().toLowerCase(),e=yt(q),t=p("#presetList");if(p("#milkCat").classList.toggle("hidden",q!=="milk"),p("#photoBox").classList.toggle("hidden",q!=="photo"),p("#search").classList.toggle("hidden",q==="photo"),q==="photo"&&(Ho(),!X.length)){t.innerHTML='<li class="msg">Add a photo and pick a style \u2014 your photo becomes a living visualizer.<br><br>Photos stay on this device. Nothing is uploaded.</li>';return}if(q==="milk"&&!G){t.innerHTML='<li class="msg">Loading MilkDrop library\u2026</li>',ve().then(()=>{Vo(),H()});return}if(q==="user"&&!e.length){t.innerHTML=`<li class="msg">No saved presets yet.<br>Press \u2605 Save (or ${g.label("Y")} on the controller) to keep the current look.</li>`;return}let o=[];for(let n=0;n<e.length;n++){let r=e[n];if(a&&!r.name.toLowerCase().includes(a))continue;let l=r.engine==="milk"?"MilkDrop":q==="photo"?"":(r.photo?"\u{1F4F7} ":"")+(U[r.scene]?.name||"");if(q==="photo"){let c=U[r.scene];o.push(`<li data-i="${n}" class="pstyle ${r.id===m.id?"cur":""}"><span class="sw" style="background:${Ua(r)}"></span><span class="nm">${ee(c.name)}<span class="pdesc">${ee(c.desc||"")}</span></span></li>`);continue}if(o.push(`<li data-i="${n}" class="${r.id===m.id?"cur":""}"><span class="sw" style="background:${Ua(r)}"></span><span class="nm">${ee(r.name)}</span><span class="s">${ee(l)}</span></li>`),o.length>3e3)break}t.innerHTML=o.join("");let i=t.querySelector(".cur");i&&!t.matches(":hover")&&i.scrollIntoView({block:"nearest"})}function Ho(){let a=p("#photoStrip");a.innerHTML=X.map(e=>`<div class="pthumb ${e.id===se?"on":""}" data-ph="${e.id}" title="${ee(e.name)}"><img src="${e.thumb}" alt=""><button class="pdel" data-del="${e.id}" title="Remove photo">\u2715</button></div>`).join(""),p("#photoHint").textContent=X.length?"Tap a photo, then pick a style \u2193":""}p("#photoStrip").addEventListener("click",async a=>{let e=a.target.closest("[data-del]");if(e){if(a.stopPropagation(),!e.dataset.armed){e.dataset.armed="1",e.textContent="Delete?",e.classList.add("armed"),setTimeout(()=>{e.isConnected&&(delete e.dataset.armed,e.textContent="\u2715",e.classList.remove("armed"))},2500);return}let o=e.dataset.del;await Ma(o),X=X.filter(i=>i.id!==o),se===o&&(se=X[0]?.id||null),R.photoId===o&&(R.photoId=null),T("\u2715","Photo removed"),H();return}let t=a.target.closest("[data-ph]");t&&(se=t.dataset.ph,to())});function to(){let a=$a(se);if(!a.length){H();return}let e=Math.max(0,a.findIndex(t=>t.scene===m.scene));ne=e,K(a[e])}async function la(a){let e=[...a].filter(i=>/^image\//.test(i.type)||/\.(jpe?g|png|webp|gif|bmp|avif|heic)$/i.test(i.name));if(!e.length)return!1;T("\u{1F4F7}",e.length>1?`Adding ${e.length} photos\u2026`:"Adding photo\u2026");let t=null;for(let i of e)try{t=await ka(i,pe?1600:2048),X.unshift(t)}catch{T("\u26A0",`Could not read ${i.name}`)}if(!t)return!0;se=t.id,Go(),to(),T("\u{1F4F7}","Photo added \u2014 now pick a style");let o=p("#presetList");return o.classList.remove("pickme"),o.offsetWidth,o.classList.add("pickme"),!0}function Go(){me(".tab").forEach(a=>a.classList.toggle("on",a.dataset.tab==="presets")),me(".tabpage").forEach(a=>a.classList.toggle("on",a.id==="tab-presets")),me(".cbtn").forEach(a=>a.classList.toggle("on",a.dataset.coll==="photo")),q="photo",H(),document.body.classList.contains("mobile")&&!document.body.classList.contains("sheet-visuals")&&dt("visuals")}p("#photoIn").onchange=async a=>{await la(a.target.files),a.target.value=""};Sa().then(a=>{X=a,se=a[0]?.id||null,q==="photo"&&H()});p("#presetList").addEventListener("click",a=>{let e=a.target.closest("li[data-i]");e&&(ne=+e.dataset.i,K(yt(q)[ne]))});p("#search").addEventListener("input",H);function Vo(){let a=p("#milkCat"),e=Object.keys(De).sort(),t=Be("all").length;a.innerHTML=`<option value="all">All MilkDrop (${t})</option><option value="classic">Classic Butterchurn (${ht.length})</option>`+e.map(o=>`<option value="${o}">${o} (${De[o].length})</option>`).join(""),a.value=de}p("#milkCat").addEventListener("change",a=>{de=a.target.value,ne=-1,H()});me(".cbtn").forEach(a=>a.onclick=()=>{me(".cbtn").forEach(e=>e.classList.toggle("on",e===a)),q=a.dataset.coll,ne=-1,H()});me(".tab").forEach(a=>a.onclick=()=>{me(".tab").forEach(e=>e.classList.toggle("on",e===a)),me(".tabpage").forEach(e=>e.classList.toggle("on",e.id==="tab-"+a.dataset.tab)),a.dataset.tab==="tweak"&&re()});var _a=[["trail","Tracers",0,.97],["zoom","Tunnel Zoom",.96,1.06],["spin","Spin",-.03,.03],["warp","Warp",0,2],["breathe","Breathing",0,2],["melt","Melt",0,2],["hueDrift","Color Drift",-.05,.05],["hueSpin","Hue Cycle",-.3,.3],["kaleido","Kaleidoscope",0,16,1],["kaleidoSpin","Kaleido Spin",-1,1],["mirror","Mirror",0,1,1],["fusion","MilkDrop Fusion",0,1],["react","Audio Reactivity",0,2.5],["speed","Speed",0,3],["chroma","Chromatic",0,3],["bloom","Bloom",0,2],["exposure","Exposure",.4,2],["saturation","Saturation",0,2],["contrast","Contrast",.6,1.6],["grain","Film Grain",0,1],["vignette","Vignette",0,1.5],["#","Music motion"],["dance","Shape Dance",0,2.5],["ripple","Beat Ripples",0,2.5],["punch","Bass Punch",0,2.5],["shake","Beat Shake",0,2.5],["swirlA","Audio Swirl",0,2.5],["bulgeA","Bass Bulge",0,2.5]];p("#sceneSel").innerHTML=ze.map(a=>`<option value="${a.id}">${a.name}</option>`).join("")+'<optgroup label="Photo styles">'+Ze.map(a=>`<option value="${a.id}">\u{1F4F7} ${a.name}</option>`).join("")+'</optgroup><option value="__milk">MilkDrop engine</option>';p("#palSel").innerHTML=Y.map((a,e)=>`<option value="${e}">${a.name}</option>`).join("")+'<option value="custom">Custom (generated)</option>';function Na(a,e,t,o,i,n,r){let l=document.createElement("div");l.className="sl "+(n||"");let c=i||(t-e)/400;l.innerHTML=`<span title="${ee(a)}">${ee(a)}</span><input type="range" min="${e}" max="${t}" step="${c}" value="${o}"><span class="v"></span>`;let d=l.querySelector("input"),h=l.querySelector(".v"),x=()=>h.textContent=(+d.value).toFixed(i===1?0:2);return x(),d.addEventListener("input",()=>{x(),r(+d.value),Me()}),l._set=y=>{document.activeElement!==d&&(d.value=y,x())},l}var Vt={},Ot=[];function re(){if(!p("#tab-tweak").classList.contains("on"))return;if(p("#pName").value=m.name,p("#sceneSel").value=m.engine==="milk"?"__milk":m.scene,p("#palSel").value=typeof m.palette=="number"?String(m.palette):"custom",p("#milkRow").classList.toggle("hidden",!(m.engine==="milk"||m.fx.fusion>0)),G){let n=Be("all");p("#milkSel").options.length!==n.length&&(p("#milkSel").innerHTML=n.map(r=>`<option>${ee(r)}</option>`).join(""))}G&&(p("#milkSel").value=m.engine==="milk"?m.milk:Se||"");let a=p("#paramSliders"),e=U[m.scene],t=m.engine+":"+m.scene;a._key!==t?(a._key=t,a.innerHTML="",Ot=[],m.engine==="scene"&&e?(e.params.forEach((n,r)=>{let l=Na(n.n,n.min,n.max,m.params[r],0,(e.stick||[]).includes(r)?"stick":"",c=>{m.params[r]=c});Ot.push(l),a.appendChild(l)}),p("#stickNames").textContent=(e.stick||[0,1]).map(n=>e.params[n].n).join(" & ")):(a.innerHTML='<p class="fine">MilkDrop presets carry their own math \u2014 shape them with the Trip FX below, the triggers, and the kaleidoscope.</p>',p("#stickNames").textContent="\u2014")):Ot.forEach((n,r)=>n._set(m.params[r]));let o=p("#fxSliders");o.children.length?_a.forEach(([n])=>{Vt[n]&&Vt[n]._set(m.fx[n]??oe[n]??0)}):_a.forEach(([n,r,l,c,d])=>{if(n==="#"){let x=document.createElement("h3");x.textContent=r,o.appendChild(x);return}let h=Na(r,l,c,m.fx[n]??0,d,"",x=>{m.fx[n]=x,n==="fusion"&&x>0&&ve().then(()=>{Se||Ge(Kt()),p("#milkRow").classList.remove("hidden"),re()})});Vt[n]=h,o.appendChild(h)});let i=V.some(n=>n.id===m.id);p("#overwriteBtn").classList.toggle("hidden",!i),p("#deleteBtn").classList.toggle("hidden",!i)}p("#pName").addEventListener("change",a=>{m.name=a.target.value,p("#presetName").textContent=m.name});p("#sceneSel").addEventListener("change",a=>{let e=a.target.value;if(e==="__milk"){ve().then(()=>K(Zt(Se||Kt())));return}let t=U[e];K({...m,id:"edit-"+Date.now(),engine:"scene",scene:e,params:t.params.map(o=>o.def),name:t.name+" (custom)",builtin:!1},{quiet:!0})});p("#palSel").addEventListener("change",a=>{a.target.value!=="custom"&&(m.palette=+a.target.value)});p("#milkSel").addEventListener("change",a=>{let e=a.target.value;m.engine==="milk"?(m.milk=e,m.name=e,p("#presetName").textContent=e):m.milk=e,Ge(e)});var Oo=[["#","Display"],["resolution","Output resolution","select",{native:"Native (match screen)",2160:"4K \xB7 2160p",1440:"1440p",1080:"1080p",900:"900p",720:"720p",540:"540p (potato mode)"}],["renderScale","Render scale","select",{auto:"Auto (adaptive)","0.5":"50%","0.67":"67%","0.75":"75%","0.85":"85%",1:"100%","1.25":"125% \xB7 supersampled","1.5":"150% \xB7 supersampled",2:"200% \xB7 supersampled"}],["aa","Anti-aliasing","select",{off:"Off \xB7 crisp (default)",auto:"Auto (smooth when GPU has room)","2x":"2\xD7 supersampling","4x":"4\xD7 supersampling"}],["fpsCap","Frame rate cap","select",{0:"Unlimited (VSync)",144:"144 fps",120:"120 fps",60:"60 fps",30:"30 fps"}],["autoExposure","Auto exposure","toggle","Keeps every preset from blowing out to white (or sinking to black)"],["startFullscreen","Start in fullscreen","toggle","Open straight into fullscreen next launch"],["uiScale","Interface size","range",[.75,1.5,.05,"\xD7"]],["uiAutoHide","Auto-hide interface","toggle","Panels fade away when you are not using the mouse"],["showFps","Show FPS & resolution","toggle",""],["#","Music reaction"],["reactIntensity","Reaction intensity","range",[0,3,.05,"\xD7"]],["idleDance","Music dance","toggle","Shapes, lens and camera always move with the music \u2014 your controller adds on top"],["beatRipples","Beat ripples","toggle","Every kick sends a shockwave through the image"],["beatPulse","Bass punch","range",[0,2,.05,"\xD7"]],["beatFlash","Drop flashes","range",[0,1,.05,""]],["cameraShake","Beat shake","range",[0,1.5,.05,""]],["beatSens","Beat sensitivity","range",[0,2,.05,""]],["gainBass","Bass gain","range",[0,3,.05,"\xD7"]],["gainMid","Mid gain","range",[0,3,.05,"\xD7"]],["gainHigh","Treble gain","range",[0,3,.05,"\xD7"]],["outputDevice","Audio output","select",{default:"System default"}],["#","Autopilot"],["autopilot","Autopilot","toggle","Keeps changing presets on its own, even while you play"],["autoPause","Pause autopilot while I play","toggle","Hold the current preset while you are using the controller"],["autoInterval","Time per preset","range",[8,120,1,"s"]],["autoSource","Autopilot plays","select",{mix:"Everything mixed",mixp:"Everything + my photos",photo:"My photos only",eye:"Eye Candy presets",flux:"Flux engine",generate:"Fresh generated presets",milk:"MilkDrop library",user:"My presets",all:"Eye Candy + MilkDrop"}],["autoOnDrop","Switch on drops","toggle","Jump to a new preset when the beat drops"],["idle","Resume after I stop playing","range",[3,120,1,"s"]],["transition","Transition length","range",[.2,4,.1,"s"]],["#","Controller"],["stickSens","Stick sensitivity","range",[.3,2.5,.05,"\xD7"]],["invertY","Invert Y axis","toggle",""],["deadzone","Stick deadzone","range",[0,.4,.01,""]],["rumble","Rumble","toggle","Feel the bass in your hands"],["rumbleStrength","Rumble strength","range",[0,1,.05,""]],["touchMode","PS touchpad / right-drag","select",{both:"Vortex + paint light",vortex:"Vortex only",paint:"Paint light only",off:"Off"}],["@touchpad"]],he={deadzone:a=>g.deadzone=a,uiScale:a=>Te.setProperty("--ui",a),outputDevice:a=>f.setOutput(a).then(e=>T("\u{1F508}",e?"Audio output changed":"Could not switch output")),renderScale:()=>{s.quality={}},aa:()=>{s.quality={}},autopilot:a=>p("#autoBtn").classList.toggle("on",a)};async function $o(a){try{(await navigator.mediaDevices.enumerateDevices()).filter(t=>t.kind==="audiooutput"&&t.deviceId!=="default").forEach(t=>{let o=document.createElement("option");o.value=t.deviceId,o.textContent=t.label||"Output "+t.deviceId.slice(0,5),a.appendChild(o)}),a.value=u.outputDevice}catch{}}function wt(){let a=p("#settingsForm");a.innerHTML="";for(let[e,t,o,i]of Oo){if(e==="#"){let r=document.createElement("h3");r.className="sethead",r.textContent=t,a.appendChild(r);continue}let n=document.createElement("div");if(n.className="set",e==="@touchpad"){n.innerHTML=`<div>PS touchpad<div class="d" id="tpStatus">${ee(N.status)}</div></div><button class="mini" id="tpBtn">${N.connected?"Reconnect":"Connect"}</button>`,n.querySelector("#tpBtn").onclick=async()=>{let r=await N.request();T("\u25C9",r?"Touchpad connected \u2014 swipe to stir the visuals":"No PlayStation controller found")},a.appendChild(n);continue}if(o==="toggle")n.innerHTML=`<div>${t}<div class="d">${i}</div></div><div class="toggle ${u[e]?"on":""}"></div>`,n.querySelector(".toggle").onclick=r=>{u[e]=!u[e],r.target.classList.toggle("on",u[e]),fe(),he[e]&&he[e](u[e])};else if(o==="select"){n.innerHTML=`<div>${t}</div><select>${Object.entries(i).map(([l,c])=>`<option value="${l}" ${String(u[e])===l?"selected":""}>${c}</option>`).join("")}</select>`;let r=n.querySelector("select");e==="outputDevice"&&$o(r),r.onchange=l=>{u[e]=l.target.value,fe(),he[e]&&he[e](u[e])}}else{let[r,l,c,d]=i;n.innerHTML=`<div>${t} <span class="d">${u[e]}${d}</span></div><input type="range" min="${r}" max="${l}" step="${c}" value="${u[e]}">`,n.querySelector("input").oninput=h=>{u[e]=+h.target.value,n.querySelector(".d").textContent=u[e]+d,fe(),he[e]&&he[e](u[e])}}a.appendChild(n)}}N.onstatus=a=>{let e=document.getElementById("tpStatus");e&&(e.textContent=a),N.connected&&T("\u25C9",a)};function ca(){let a=t=>`<span class="k">${g.label(t)}</span>`,e=[["Left stick","Steer","Fly the camera / drag the trails"],["Right stick","Morph","Bend the two \u25C9 shape params live"],[a("LT"),"Warp","Squeeze into infinite feedback tunnels"],[a("RT"),"Drive","Overdrive audio reaction, bloom & speed"],[a("LT")+"+"+a("RT"),"Hyperdrive","Both triggers fully \u2014 hold on"],[a("LB"),"Kaleidoscope","Tap to cycle \xB7 hold for mirror world"],[a("RB"),"Palette","Tap next colors \xB7 hold to spin hues"],["\u25C0 \u25B6","Presets","Previous / next look"],["\u25B2 \u25BC","Time","Speed up, slow down, even reverse"],[a("A"),"Burst","Shockwave + flash. Hit it on the beat"],[a("B"),"Freeze","Hold to stop time while trails melt on"],[a("X"),"Randomize","Tap remix \xB7 hold for a brand-new preset"],[a("Y"),"Save","Keep this exact look in My Presets"],[a("L3"),"Reset view","Click left stick"],[a("R3"),"Lock shape","Click right stick to keep the morph"],[a("START"),"Menu","Show / hide the panels"],[a("BACK"),"This guide","Hold to toggle autopilot"],["Touchpad","Stir (PS)","Swipe to swirl & paint \xB7 pinch/twist \xB7 click = Music dance on/off"]];p("#cgrid").innerHTML=e.map(([t,o,i])=>`<div class="cg"><span class="k">${t.startsWith("<")?t.replace(/<\/?span[^>]*>/g,""):t}</span><div><b>${o}</b><small>${i}</small></div></div>`).join(""),me("[data-g]").forEach(t=>t.textContent=g.label(t.dataset.g))}p("#controls").addEventListener("click",a=>{a.target.id==="controls"&&ke(!1)});window.addEventListener("keydown",a=>{if(a.target.matches("input,select,textarea"))return;Me(),f.resume();let e=a.key;e==="ArrowRight"?xe(1):e==="ArrowLeft"?xe(-1):e==="ArrowUp"?vt(1):e==="ArrowDown"?vt(-1):e===" "?(a.preventDefault(),$e(1)):e==="r"||e==="R"?Qt():e==="g"||e==="G"?ea():e==="s"||e==="S"?Pt():e==="k"||e==="K"?Xa():e==="m"||e==="M"?Ya():e==="p"||e==="P"?Wa(1):e==="f"||e==="F"||e==="F11"?(a.preventDefault(),ia()):e==="h"||e==="H"?(s.cinema=!s.cinema,s.cinema?Tt():aa(),T("H",s.cinema?"Interface hidden (H to show)":"Interface on")):e==="Tab"?(a.preventDefault(),Qa()):e==="a"||e==="A"?ta(!u.autopilot):e==="c"||e==="C"?ke(p("#controls").classList.contains("hidden")):e==="Escape"?ke(!1):e==="MediaPlayPause"?f.toggle():e==="MediaTrackNext"?f.next():e==="MediaTrackPrevious"&&f.prev()});var Ee=null;ce.addEventListener("contextmenu",a=>a.preventDefault());ce.addEventListener("pointerdown",a=>{if(a.button===2){ue.active=!0,ue.x=a.clientX/innerWidth,ue.y=a.clientY/innerHeight;return}if(a.button===1){$e(1,(a.clientX/innerWidth-.5)*innerWidth/innerHeight,.5-a.clientY/innerHeight);return}Ee={x:a.clientX,y:a.clientY},Me()});window.addEventListener("pointerup",a=>{a.button===2&&(ue.active=!1)});window.addEventListener("pointermove",a=>{ue.active&&(ue.x=a.clientX/innerWidth,ue.y=a.clientY/innerHeight)});window.addEventListener("pointerup",()=>Ee=null);window.addEventListener("pointermove",a=>{Ee&&(s.camX+=(a.clientX-Ee.x)*.004,s.camY=$(s.camY+(a.clientY-Ee.y)*.003,-1.3,1.3),Ee={x:a.clientX,y:a.clientY},Me())});ce.addEventListener("wheel",a=>{m.fx.trail=$(m.fx.trail-a.deltaY*8e-4,0,.97),Xt("LT","Tracers",m.fx.trail/.97),Me(),re()},{passive:!0});ce.addEventListener("dblclick",ia);Te.setProperty("--ui",u.uiScale);pe&&(s.panels=!1,u.uiAutoHide=!1);j&&u.startFullscreen&&j.setFullscreen&&j.setFullscreen(!0);u.outputDevice!=="default"&&f.setOutput(u.outputDevice);N.autoConnect();j||document.querySelectorAll("[data-act=loopback]").forEach(a=>{a.innerHTML=a.classList.contains("src")?"Tab/PC":"\u{1F50A} Visualize a tab or PC audio",a.title="Pick a tab (e.g. YouTube/Spotify web) or your whole screen and tick \u201CShare audio\u201D"});No();gt();wt();H();ca();p("#autoBtn").classList.toggle("on",u.autopilot);p("#presetName").textContent=m.name;q="eye";{let a=Pe("eye",pt);ne=pt.indexOf(a),K(a,{transition:!1,quiet:!0})}var $t=ze.map(a=>a.id),jt=0;(function a(){if(jt>=$t.length){p("#loadbar").style.opacity=0;return}R.sceneProg($t[jt++]),p("#loadbar div").style.width=jt/$t.length*100+"%",setTimeout(a,0)})();requestAnimationFrame(Ja);window.__eye={get milkCanvas(){return ie},getMilkPreset:Va,ensureMilk:ve,get milk(){return G},milkNamesFor:Be,startDemoGroove:oa,R,audio:f,L:s,get cur(){return m},loadPreset:K,autoNext:Ka,BUILTIN:be,SCENES:Re,settings:u,get photos(){return X},addPhotoFiles:la,get collection(){return q}};})();
