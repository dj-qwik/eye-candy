(()=>{var lt=`#version 300 es
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
`,ct=[],A=a=>ct.push(a);A({fly:!0,id:"cathedral",name:"Fractal Cathedral",params:[{n:"Fold",min:.2,max:1.6,def:.85},{n:"Twist",min:0,max:1.5,def:.45},{n:"Scale",min:1.25,max:1.75,def:1.48},{n:"Glow",min:0,max:3,def:1.2},{n:"Flight",min:0,max:3,def:1},{n:"Tunnel",min:.2,max:1.4,def:.6},{n:"Pulse",min:0,max:2,def:1},{n:"Color Spread",min:0,max:2,def:.6}],stick:[0,1],code:`
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
}`});A({ss:2,id:"wavefield",name:"Neon Wavefield",params:[{n:"Scroll",min:0,max:2,def:.35},{n:"Peak Height",min:0,max:2,def:1},{n:"Line Glow",min:.3,max:3,def:1.2},{n:"Spread",min:.2,max:1.5,def:.6},{n:"Wave Mix",min:0,max:1,def:.3},{n:"Fill",min:0,max:1,def:.85},{n:"Hue Depth",min:0,max:2,def:.8},{n:"Horizon",min:-.3,max:.3,def:.05}],stick:[1,3],code:`
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
}`});var Ne=(a,e)=>`
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
}`,Oe=(a,e)=>[a,{n:"Orbit",min:0,max:1,def:.25},{n:"Glow",min:0,max:3,def:1},{n:"Color Rate",min:.2,max:4,def:1.2},{n:"Distance",min:1.6,max:7,def:4,ms:.3},{n:"Audio Morph",min:0,max:2,def:.8},{n:"Rim",min:0,max:3,def:1.2},e];A({camSens:.45,space:!0,id:"bulb",name:"Mandelbulb Shrine",params:Oe({n:"Power",min:2,max:12,def:8,ms:.1},{n:"Detail",min:4,max:10,def:7}),stick:[0,4],code:Ne(`
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
}`,"1.25")});A({camSens:.45,space:!0,id:"qjulia",name:"Julia Organism",params:Oe({n:"Mutation",min:0,max:1,def:.5,ms:.15},{n:"Drift",min:0,max:2,def:.6}),stick:[0,4],code:Ne(`
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
}`,"1.65")});A({camSens:.45,space:!0,id:"jbulb",name:"Living Bulb",params:Oe({n:"Base Power",min:3,max:10,def:6,ms:.08},{n:"Morph Range",min:0,max:3,def:2,ms:.2}),stick:[0,7],code:Ne(`
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
}`,"1.3")});A({camSens:.45,space:!0,id:"kifs",name:"Crystal Reliquary",params:Oe({n:"Twist",min:0,max:1,def:.35,ms:.25},{n:"Facet",min:.2,max:1,def:.55,ms:.3}),stick:[0,7],code:Ne(`
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
}`});var J=ct,N=Object.fromEntries(ct.map(a=>[a.id,a])),ie=`#version 300 es
in vec2 aPos; void main(){ gl_Position=vec4(aPos,0,1); }`,Vt=`#version 300 es
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
}`,jt=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes; out vec4 fragColor;
void main(){ vec2 uv=gl_FragCoord.xy/uRes; vec3 c=texture(uTex,uv).rgb; float l=max(c.r,max(c.g,c.b)); fragColor=vec4(c*smoothstep(.75,1.5,l),1); }`,Wt=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes, uDir; out vec4 fragColor;
void main(){ vec2 uv=gl_FragCoord.xy/uRes; vec2 o=uDir/uRes; vec3 c=texture(uTex,uv).rgb*.227;
  c+=(texture(uTex,uv+o*1.38).rgb+texture(uTex,uv-o*1.38).rgb)*.316;
  c+=(texture(uTex,uv+o*3.23).rgb+texture(uTex,uv-o*3.23).rgb)*.07; fragColor=vec4(c,1); }`,Yt=`#version 300 es
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
}`,Kt=`#version 300 es
precision highp float; uniform sampler2D uSmall, uPrev; uniform float uRate; out vec4 fragColor;
void main(){ vec3 c=textureLod(uSmall, vec2(.5), 10.).rgb; float l=mix(dot(c,vec3(.3,.59,.11)), max(c.r,max(c.g,c.b)), .55); float pl=texture(uPrev, vec2(.5)).r; fragColor=vec4(mix(pl,l,uRate),0,0,1); }`,Zt=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes; out vec4 fragColor;
void main(){ fragColor=texture(uTex, gl_FragCoord.xy/uRes); }`;var Ge=class{constructor(e){this.canvas=e;let t=this.gl=e.getContext("webgl2",{antialias:!1,alpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"});if(!t)throw new Error("WebGL2 is not available on this system.");this.halfFloat=!!t.getExtension("EXT_color_buffer_float"),t.getExtension("OES_texture_float_linear");let i=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,i),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),this.progs={},this.errors={},this.post={feedback:this.program(ie,Vt),bright:this.program(ie,jt),blur:this.program(ie,Wt),final:this.program(ie,Yt),blit:this.program(ie,Zt),adapt:this.program(ie,Kt)},this.audioTex=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.audioTex),t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.texImage2D(t.TEXTURE_2D,0,t.R8,512,2,0,t.RED,t.UNSIGNED_BYTE,null),this.texParams(t.LINEAR,t.CLAMP_TO_EDGE),this.milkTex=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.milkTex),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,0,255])),this.texParams(t.LINEAR,t.CLAMP_TO_EDGE),this.scale=.75,this.fbIdx=0,this.finIdx=0,this.lumSmall=this.makeTarget(64,36),t.bindTexture(t.TEXTURE_2D,this.lumSmall.tex),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR_MIPMAP_LINEAR),t.generateMipmap(t.TEXTURE_2D),this.adapt=[this.makeTarget(1,1),this.makeTarget(1,1)],this.adIdx=0,this.W=0,this.H=0}texParams(e,t){let i=this.gl;i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,e),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,e),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,t),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,t)}shader(e,t){let i=this.gl,s=i.createShader(e);if(i.shaderSource(s,t),i.compileShader(s),!i.getShaderParameter(s,i.COMPILE_STATUS)){let o=i.getShaderInfoLog(s);throw i.deleteShader(s),new Error(o)}return s}program(e,t){let i=this.gl,s=i.createProgram();if(i.attachShader(s,this.shader(i.VERTEX_SHADER,e)),i.attachShader(s,this.shader(i.FRAGMENT_SHADER,t)),i.bindAttribLocation(s,0,"aPos"),i.linkProgram(s),!i.getProgramParameter(s,i.LINK_STATUS))throw new Error(i.getProgramInfoLog(s));let o={},r=i.getProgramParameter(s,i.ACTIVE_UNIFORMS);for(let l=0;l<r;l++){let u=i.getActiveUniform(s,l);o[u.name.replace(/\[0\]$/,"")]=i.getUniformLocation(s,u.name)}return{p:s,u:o}}sceneProg(e){if(this.progs[e])return this.progs[e];let t=J.find(o=>o.id===e),i=Math.min(t.ss||1,this.ssMax??4),s=lt.replace(`#version 300 es
`,`#version 300 es
#define SS `+i+`
`)+t.code;try{this.progs[e]=this.program(ie,s)}catch(o){this.errors[e]=String(o),console.error("Scene",e,o),this.progs[e]=null}return this.progs[e]}mapProg(e){let t=e+":map";if(this.progs[t]!==void 0)return this.progs[t];let i=J.find(s=>s.id===e);try{this.progs[t]=this.program(ie,lt+i.map)}catch(s){this.errors[t]=String(s),console.error("Map",e,s),this.progs[t]=null}return this.progs[t]}precompile(e,t){let i=0,s=()=>{if(i>=e.length)return t&&t();this.sceneProg(e[i++]),setTimeout(s,0)};s()}makeTarget(e,t,i=!0){let s=this.gl,o=s.createTexture();s.bindTexture(s.TEXTURE_2D,o),i&&this.halfFloat?s.texImage2D(s.TEXTURE_2D,0,s.RGBA16F,e,t,0,s.RGBA,s.HALF_FLOAT,null):s.texImage2D(s.TEXTURE_2D,0,s.RGBA8,e,t,0,s.RGBA,s.UNSIGNED_BYTE,null),this.texParams(s.LINEAR,s.CLAMP_TO_EDGE);let r=s.createFramebuffer();return s.bindFramebuffer(s.FRAMEBUFFER,r),s.framebufferTexture2D(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,o,0),s.clearColor(0,0,0,1),s.clear(s.COLOR_BUFFER_BIT),{tex:o,fb:r,w:e,h:t}}freeTarget(e){e&&(this.gl.deleteTexture(e.tex),this.gl.deleteFramebuffer(e.fb))}resize(e,t,i){if(e===this.W&&t===this.H&&i===this.scaleUsed)return;let s=this.gl,o=Math.max(64,Math.round(e*i)),r=Math.max(64,Math.round(t*i)),l=[this.sceneT,...this.fb||[],...this.fin||[],this.bA,this.bB],u=this.fb;this.sceneT=this.makeTarget(o,r),this.fb=[this.makeTarget(o,r),this.makeTarget(o,r)],u&&this.drawTo(this.fb[this.fbIdx],this.post.blit,{uTex:u[this.fbIdx].tex}),!this.fin||e!==this.W||t!==this.H?((this.fin||[]).forEach(x=>this.freeTarget(x)),this.fin=[this.makeTarget(e,t,!1),this.makeTarget(e,t,!1)]):l.splice(l.indexOf(this.fin[0]),2);let m=Math.max(32,Math.round(o/4)),v=Math.max(32,Math.round(r/4));this.bA=this.makeTarget(m,v),this.bB=this.makeTarget(m,v),l.forEach(x=>{x&&!this.fin.includes(x)&&this.freeTarget(x)}),this.W=e,this.H=t,this.scaleUsed=i,this.sw=o,this.sh=r}drawTo(e,t,i,s){let o=this.gl;o.bindFramebuffer(o.FRAMEBUFFER,e?e.fb:null);let r=e?e.w:this.W,l=e?e.h:this.H;o.viewport(0,0,r,l),o.useProgram(t.p);let u=0;for(let[m,v]of Object.entries(i)){let x=t.u[m];x!=null&&(v instanceof WebGLTexture?(o.activeTexture(o.TEXTURE0+u),o.bindTexture(o.TEXTURE_2D,v),o.uniform1i(x,u++)):typeof v=="number"?o.uniform1f(x,v):v.length===2?o.uniform2fv(x,v):v.length===3?o.uniform3fv(x,v):v.length===4&&o.uniform4fv(x,v))}t.u.uRes,t.u.uRes&&o.uniform2f(t.u.uRes,r,l),o.drawArrays(o.TRIANGLES,0,3)}uploadAudio(e){let t=this.gl;t.bindTexture(t.TEXTURE_2D,this.audioTex),t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.texSubImage2D(t.TEXTURE_2D,0,0,0,512,2,t.RED,t.UNSIGNED_BYTE,e)}uploadMilk(e){let t=this.gl;t.bindTexture(t.TEXTURE_2D,this.milkTex),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!0),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1)}snapshot(){this.transTex=this.fin[this.finIdx].tex,this.finIdx^=1}frame(e){let t=this.post;if(e.engine==="scene"){let v=J.find(T=>T.id===e.scene),x=this.sceneProg(e.scene);if(x&&v&&v.selfFeedback){(!this.selfT||this.selfT[0].w!==this.sceneT.w||this.selfT[0].h!==this.sceneT.h)&&((this.selfT||[]).forEach(R=>this.freeTarget(R)),this.selfT=[this.makeTarget(this.sceneT.w,this.sceneT.h),this.makeTarget(this.sceneT.w,this.sceneT.h)],this.selfIdx=0);let T=this.selfT[this.selfIdx],y=this.selfT[this.selfIdx^1];this.drawTo(y,x,{...e.sceneU,uSelf:T.tex}),this.selfIdx^=1;let S=this.mapProg(e.scene);S&&this.drawTo(this.sceneT,S,{...e.sceneU,uSelf:y.tex})}else x&&this.drawTo(this.sceneT,x,e.sceneU)}let i=e.engine==="milk"?this.milkTex:this.sceneT.tex,s=this.fb[this.fbIdx],o=this.fb[this.fbIdx^1];this.drawTo(o,t.feedback,{...e.fbU,uScene:i,uPrev:s.tex,uMilk:this.milkTex}),this.fbIdx^=1,this.drawTo(this.bA,t.bright,{uTex:o.tex});for(let v=0;v<2;v++)this.drawTo(this.bB,t.blur,{uTex:this.bA.tex,uDir:[1+v,0]}),this.drawTo(this.bA,t.blur,{uTex:this.bB.tex,uDir:[0,1+v]});this.drawTo(this.lumSmall,t.blit,{uTex:o.tex});let r=this.gl;r.bindTexture(r.TEXTURE_2D,this.lumSmall.tex),r.generateMipmap(r.TEXTURE_2D);let l=this.adapt[this.adIdx],u=this.adapt[this.adIdx^1];this.drawTo(u,t.adapt,{uSmall:this.lumSmall.tex,uPrev:l.tex,uRate:e.adaptRate??.04}),this.adIdx^=1;let m=this.fin[this.finIdx];this.drawTo(m,t.final,{...e.finU,uTex:o.tex,uBloom:this.bA.tex,uTrans:this.transTex||o.tex,uAdapt:u.tex}),this.drawTo(null,t.blit,{uTex:m.tex})}};var $e=class{constructor(){this.ctx=new(window.AudioContext||window.webkitAudioContext)({latencyHint:"interactive"}),this.el=new Audio,this.el.crossOrigin="anonymous",this.el.preload="auto",this.elSrc=this.ctx.createMediaElementSource(this.el),this.input=this.ctx.createGain(),this.analyser=this.ctx.createAnalyser(),this.analyser.fftSize=2048,this.analyser.smoothingTimeConstant=.55,this.out=this.ctx.createGain(),this.elSrc.connect(this.input),this.input.connect(this.analyser),this.elSrc.connect(this.out),this.out.connect(this.ctx.destination),this.freq=new Uint8Array(1024),this.time=new Uint8Array(2048),this.tex=new Uint8Array(512*2),this.bass=0,this.mid=0,this.high=0,this.vol=0,this.beat=0,this.beatCount=0,this.peak={b:.2,m:.2,h:.2,v:.2},this.bassAvg=0,this.lastBeat=0,this.drop=0,this.playlist=[],this.index=-1,this.shuffle=!1,this.repeat="all",this.mode="player",this.stream=null,this.streamSrc=null,this.onchange=()=>{},this.el.addEventListener("ended",()=>this.next(!0)),this.el.addEventListener("play",()=>this.onchange()),this.el.addEventListener("pause",()=>this.onchange());let e=this.ctx.sampleRate/2;this.binMap=new Float32Array(512);for(let t=0;t<512;t++){let i=30*Math.pow(533.3333333333334,t/511);this.binMap[t]=Math.min(1023,i/e*1024)}}async setOutput(e){try{return this.ctx.setSinkId?await this.ctx.setSinkId(e==="default"?"":e):this.el.setSinkId&&await this.el.setSinkId(e),!0}catch(t){return console.warn(t),!1}}resume(){this.ctx.state!=="running"&&this.ctx.resume()}addTracks(e){let t=this.playlist.length===0;this.playlist.push(...e),t&&e.length&&this.play(0),this.onchange()}remove(e){this.playlist.splice(e,1),e<this.index?this.index--:e===this.index&&(this.index=Math.min(this.index,this.playlist.length-1),this.index>=0?this.play(this.index):this.el.pause()),this.onchange()}clear(){this.playlist=[],this.index=-1,this.el.pause(),this.el.removeAttribute("src"),this.onchange()}async play(e){if(!(e<0||e>=this.playlist.length)){this.useSource("player"),this.index=e,this.el.src=this.playlist[e].url,this.resume();try{await this.el.play()}catch(t){console.warn(t)}this.onchange()}}toggle(){if(this.resume(),this.mode!=="player"&&this.useSource("player"),this.index<0&&this.playlist.length)return this.play(0);this.el.paused?this.el.play():this.el.pause()}next(e){if(!this.playlist.length)return;if(this.repeat==="one"&&e)return this.play(this.index);let t=this.shuffle?Math.floor(Math.random()*this.playlist.length):this.index+1;if(t>=this.playlist.length){if(this.repeat==="off"&&e)return;t=0}this.play(t)}prev(){if(this.el.currentTime>3){this.el.currentTime=0;return}this.play((this.index-1+this.playlist.length)%Math.max(1,this.playlist.length))}get current(){return this.playlist[this.index]}stopStream(){this.stream&&(this.stream.getTracks().forEach(e=>e.stop()),this.stream=null),this.streamSrc&&(this.streamSrc.disconnect(),this.streamSrc=null)}useSource(e){e==="player"&&this.mode!=="player"&&(this.stopStream(),this.mode="player",this.onchange())}async useLoopback(){this.resume();let e=await navigator.mediaDevices.getDisplayMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1},video:!0,systemAudio:"include",selfBrowserSurface:"exclude"});if(e.getVideoTracks().forEach(t=>t.stop()),!e.getAudioTracks().length)throw new Error("No audio was shared \u2014 pick a tab or \u201CEntire screen\u201D and turn on \u201CShare audio\u201D.");this.attachStream(e,"loopback")}async useMic(){this.resume();let e=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});this.attachStream(e,"mic")}attachStream(e,t){this.el.pause(),this.stopStream(),this.stream=e,this.streamSrc=this.ctx.createMediaStreamSource(e),this.streamSrc.connect(this.input),this.mode=t,this.onchange()}update(e,t=1,i={}){let s=i.sens??1,o=i.gB??1,r=i.gM??1,l=i.gH??1,u=this.analyser;u.getByteFrequencyData(this.freq),u.getByteTimeDomainData(this.time);let m=this.ctx.sampleRate/2,v=this.freq,x=(M,F)=>{let q=Math.max(1,Math.floor(M/m*1024)),V=Math.max(q+1,Math.floor(F/m*1024)),ye=0;for(let I=q;I<V;I++)ye+=v[I];return ye/(V-q)/255},T=x(25,160)*o,y=x(160,2200)*r,S=x(2200,12e3)*l,R=0;for(let M=0;M<2048;M+=4){let F=(this.time[M]-128)/128;R+=F*F}R=Math.sqrt(R/512);let P=this.peak,G=Math.pow(.25,e/8);P.b=Math.max(T,P.b*G,.05),P.m=Math.max(y,P.m*G,.05),P.h=Math.max(S,P.h*G,.03),P.v=Math.max(R,P.v*G,.02);let K=(M,F,q,V)=>M+(F-M)*(1-Math.exp(-e*(F>M?q:V))),Z=Math.min(2.5,t);this.bass=K(this.bass,Math.pow(T/P.b,1.6)*Z,30,8),this.mid=K(this.mid,Math.pow(y/P.m,1.4)*Z,20,6),this.high=K(this.high,Math.pow(S/P.h,1.3)*Z,25,7),this.vol=K(this.vol,R/P.v*Z,15,4),this.bassAvg=this.bassAvg+(T-this.bassAvg)*(1-Math.exp(-e*2));let b=1-Math.exp(-e*1.4);this.bMean=(this.bMean??T)+(T-(this.bMean??T))*b;let C=(T-this.bMean)*(T-this.bMean);this.bVar=(this.bVar??.001)+(C-(this.bVar??.001))*b;let w=Math.sqrt(this.bVar),L=this.bMean+(1.25-s*.4)*w+.015,z=performance.now()/1e3;this.isBeat=!1,!this.above&&T>L&&T>.1&&z-this.lastBeat>.16?(this.lastBeat=z,this.beat=1,this.beatCount++,this.isBeat=!0,this.above=!0):this.above&&T<this.bMean+.3*w&&(this.above=!1),this.beat*=Math.exp(-e*7),this.drop=this.drop*Math.exp(-e*.5)+Math.max(0,T-this.bassAvg*1.6)*e*4;for(let M=0;M<512;M++){let F=this.binMap[M],q=Math.floor(F),V=F-q,ye=v[q]*(1-V)+v[Math.min(1023,q+1)]*V;this.tex[M]=Math.min(255,ye*(1+M/512*.8))}for(let M=0;M<512;M++)this.tex[512+M]=this.time[M*2]}};var E={A:0,B:1,X:2,Y:3,LB:4,RB:5,LT:6,RT:7,BACK:8,START:9,L3:10,R3:11,UP:12,DOWN:13,LEFT:14,RIGHT:15,TOUCH:17},Xe=class{constructor(){this.prev=[],this.downAt=[],this.held=[],this.axes=[0,0,0,0],this.lt=0,this.rt=0,this.connected=!1,this.id="",this.deadzone=.14,this.style="xbox",this.lastInput=0,this.gp=null}poll(){let e=navigator.getGamepads?navigator.getGamepads():[],t=null;for(let y of e)if(y&&y.connected){t=y;break}this.hid&&this.hid.fresh&&(t=this.hid.asGamepad()),!t&&this.touch&&this.touch.active&&(t=this.touch.asGamepad()),this.gp=t;let i=this.connected;if(this.connected=!!t,this.justConnected=!i&&this.connected,!t){this.pressed=[],this.released=[];return}this.id=t.id,this.style=t.id==="Touch controls"?"touch":/054c|playstation|dualsense|dualshock/i.test(t.id)||/wireless controller/i.test(t.id)&&!/xbox|xinput|045e/i.test(t.id)?"ps":"xbox";let s=performance.now();this.pressed=[],this.released=[];let o=Math.min(t.buttons.length,18);for(let y=0;y<o;y++){let S=t.buttons[y],R=typeof S=="object"?S.value:S,P=typeof S=="object"&&S.pressed||R>.5;P&&!this.prev[y]&&(this.pressed[y]=!0,this.downAt[y]=s,this.held[y]=!1,this.lastInput=s),!P&&this.prev[y]&&(this.released[y]=!0),this.prev[y]=P}let r=y=>{let S=Math.abs(y);return S<this.deadzone?0:Math.sign(y)*((S-this.deadzone)/(1-this.deadzone))},l=t.axes,u=(y,S)=>{let R=Math.hypot(y,S);if(R<this.deadzone)return[0,0];let P=(R-this.deadzone)/(1-this.deadzone)/R;return[y*P,S*P]},[m,v]=u(l[0]||0,l[1]||0),[x,T]=u(l[2]||0,l[3]||0);this.axes=[m,v,x,T],this.lt=t.buttons[6]?t.buttons[6].value:0,this.rt=t.buttons[7]?t.buttons[7].value:0,Math.abs(m)+Math.abs(v)+Math.abs(x)+Math.abs(T)+this.lt+this.rt>.05&&(this.lastInput=s)}down(e){return!!this.prev[e]}tap(e){return!!this.pressed[e]}hold(e,t){return this.prev[e]&&!this.held[e]&&performance.now()-this.downAt[e]>t?(this.held[e]=!0,!0):!1}shortRelease(e){return!!this.released[e]&&!this.held[e]}rumble(e,t,i=80){let s=this.gp;if(!(!s||!s.vibrationActuator))try{s.vibrationActuator.playEffect("dual-rumble",{duration:i,strongMagnitude:Math.min(1,e),weakMagnitude:Math.min(1,t)})}catch{}}label(e){return this.style==="touch"?{A:"\u2738",B:"B",X:"\u2684",Y:"\u2605",LB:"\u2756",RB:"\u25D1",LT:"WARP",RT:"DRIVE",BACK:"?",START:"\u2630",L3:"L",R3:"R"}[e]||e:this.style==="ps"?{A:"\u2715",B:"\u25CB",X:"\u25A1",Y:"\u25B3",LB:"L1",RB:"R1",LT:"L2",RT:"R2",BACK:"Create",START:"Options",L3:"L3",R3:"R3"}[e]||e:{A:"A",B:"B",X:"X",Y:"Y",LB:"LB",RB:"RB",LT:"LT",RT:"RT",BACK:"View",START:"Menu",L3:"LS",R3:"RS"}[e]||e}};var j=[{name:"Acid Rainbow",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.33,.67]},{name:"Psilocybin",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[.8,.9,.3]},{name:"Synthwave",a:[.55,.3,.6],b:[.45,.3,.4],c:[1,1,1],d:[0,.15,.25]},{name:"Aurora",a:[.3,.55,.5],b:[.3,.45,.45],c:[1,1,1],d:[.55,.25,.3]},{name:"Molten Gold",a:[.6,.4,.2],b:[.4,.35,.2],c:[1,1,1],d:[0,.1,.2]},{name:"Deep Ocean",a:[.2,.4,.6],b:[.2,.35,.4],c:[1,1,1],d:[.3,.2,.1]},{name:"Toxic",a:[.4,.6,.3],b:[.4,.4,.4],c:[1,1.5,1],d:[.2,0,.5]},{name:"Candy",a:[.65,.5,.65],b:[.35,.45,.35],c:[1,1,1],d:[0,.5,.25]},{name:"Infrared",a:[.5,.2,.25],b:[.5,.3,.3],c:[1,1,1.5],d:[0,.1,.6]},{name:"Ultraviolet",a:[.45,.25,.65],b:[.45,.3,.35],c:[1,2,1],d:[.6,.1,0]},{name:"Ice Fire",a:[.5,.5,.5],b:[.5,.5,.5],c:[.5,.5,.5],d:[0,.15,.5]},{name:"Peacock",a:[.4,.5,.5],b:[.4,.4,.5],c:[2,1,1],d:[.5,.2,.25]},{name:"Sunset Dream",a:[.6,.4,.4],b:[.4,.4,.3],c:[1,1,1],d:[0,.2,.45]},{name:"Emerald Temple",a:[.25,.5,.35],b:[.25,.45,.3],c:[1,1,2],d:[.6,.3,.5]},{name:"Holographic",a:[.6,.6,.7],b:[.4,.4,.3],c:[2,2,2],d:[0,.33,.67]},{name:"Blacklight",a:[.35,.2,.55],b:[.35,.45,.45],c:[1.5,1,1],d:[.35,.7,.1]}],ne={trail:.55,zoom:1.01,spin:0,warp:.3,hueDrift:0,kaleido:0,kaleidoSpin:0,mirror:0,breathe:.4,melt:0,chroma:1,bloom:.8,grain:.3,vignette:.6,exposure:1,saturation:1.1,contrast:1.05,react:1,speed:1,fusion:0,hueSpin:0,dance:1,ripple:1,punch:1,shake:1,swirlA:1,bulgeA:1};function Jt(a){let e=2166136261;for(let t of a)e=Math.imul(e^t.charCodeAt(0),16777619)>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}var Pa={trail:[.1,.62],zoom:[.995,1.018],spin:[-.006,.006],warp:[0,1],breathe:[.1,1.2],melt:[0,.6],hueDrift:[-.01,.01],hueSpin:[-.05,.05],kaleidoSpin:[-.3,.3],chroma:[.4,1.6],bloom:[.35,.85],exposure:[.95,1.08],saturation:[1,1.4],contrast:[1,1.12],grain:[.08,.45],vignette:[.3,.95],react:[.8,1.5],speed:[.7,1.45],dance:[.4,1.9],ripple:[.3,1.7],punch:[.4,1.7],shake:[.15,1.4],swirlA:[.3,1.9],bulgeA:[.3,1.7]};function ut(a,e=ne,t={}){let i=Jt(a),s={...ne,...e};for(let[o,[r,l]]of Object.entries(Pa))s[o]=+(r+i()*(l-r)).toFixed(4);return e.trail===0&&(s.trail=0),e.zoom===1&&(s.zoom=1),{...s,...t}}var p=(a,e,t,i={},s=0)=>{let o=N[a],r=Jt(e+"#shape"),l=o.params.map((m,v)=>{if(t[v]!==void 0)return t[v];let x=m.def+(r()-.5)*.16*(m.max-m.min);return+Math.max(m.min,Math.min(m.max,x)).toFixed(4)}),u=ut(e,ne,i);return o.fly&&(u.trail=Math.min(u.trail,i.trail!==void 0?.3:.08+r()*.17)),o.selfFeedback&&i.trail===void 0&&(u.trail=r()*.15),o.crisp&&(u.trail=Math.min(u.trail,.28),u.melt=Math.min(u.melt,.2)),{id:"eye-"+e.toLowerCase().replace(/[^a-z0-9]+/g,"-"),name:e,engine:"scene",scene:a,params:l,palette:s,fx:u,builtin:!0}};var de=[p("cathedral","Cathedral of Echoes",[],{trail:.45},0),p("cathedral","Infinite Basilica",[1.1,.2,1.42,1.3,1.4,.95],{trail:.35,kaleido:0},4),p("cathedral","Neon Spine",[.55,1.1,1.6,1.3,2,.75,1.5,1.4],{trail:.5,zoom:1.012,hueDrift:.006},15),p("cathedral","Gothic Mushroom Vault",[.95,.7,1.5,1.2,.7,1.05,1,1.8],{breathe:.8,melt:.4,trail:.35},1),p("nebula","Warp Nebula",[],{},9),p("nebula","Wormhole Petals",[2,.4,3.2,1.6,1,.3,1.1,6],{kaleido:6,trail:.4},0),p("nebula","Cosmic Drain",[.6,.9,1.5,2.5,.4,-.6,1.2],{spin:.01,trail:.7,zoom:.985},5),p("julia","Julia Bloom",[],{},0),p("julia","Dendrite Garden",[1.2,1.3,.6,1.2,2,.76,.2,6],{trail:.4},13),p("julia","Paisley Mind",[2.6,.8,1.8,1,1.5,.79,-.4,1],{breathe:1.2,melt:.5},1),p("julia","Electric Lace",[4.2,1.6,2.4,1.5,2.8,.7885,.3,4],{kaleido:0,trail:.6,hueDrift:.02},15),p("gyroid","Gyroid Hyperspace",[],{},9),p("gyroid","Coral Lungs",[1.4,.8,.15,1.4,.7,1.8,.06,.3],{breathe:1.5,trail:.5},12),p("gyroid","Light Speed Lattice",[3,4.5,.03,1.6,.2,.6,.05,1.6],{trail:.5,zoom:1.02,chroma:1.6},0),p("chrome","Liquid Chrome",[],{},14),p("chrome","Mercury Heartbeat",[4,.9,.15,4,.6,2,.4,1.3],{trail:.3},10),p("chrome","Oil Slick Orbit",[8,.35,.7,12,1.6,1,2,1],{trail:.5,breathe:.8},1),p("horizon","Neon Horizon",[],{},2),p("horizon","Outrun Forever",[2.5,.38,1.5,10,1.2,1.5,14,1.5],{trail:.4,chroma:2},2),p("horizon","Hallucinated Highway",[1.5,.25,1.2,6,2,1,6,1.4],{breathe:1.2,melt:1,trail:.6,hueDrift:.01},0),p("mandala","Spectral Mandala",[],{},0),p("mandala","Lotus Reactor",[8,8,.8,2,.05,1.4,1.4,1.1],{trail:.6,zoom:1.015},7),p("mandala","Chakra Spin",[16,4,.3,1.2,.5,1,.4,.8],{trail:.75,spin:.008},9),p("mandala","Lace Galaxy",[24,10,1,1,-.2,2,2,1.3],{kaleido:0,trail:.5,hueDrift:.015},15),p("silk","Silk Warp",[],{},1),p("silk","Melting Marble",[1.4,2,1.6,.4,1.8,1.2,1.8,1],{breathe:1,melt:.5},4),p("silk","Liquid Thought",[3.5,1.6,.8,1.2,1,1.5,1.2,.2],{kaleido:8,trail:.4},3),p("silk","Tie-Dye Ocean",[2.6,2.6,2.6,.9,.8,1,1.1,.6],{trail:.3,hueDrift:.02},0),p("apollo","Apollonian Dream",[],{},14),p("apollo","Bubble Universe",[1.32,.4,2.2,2.5,1,.8,.2,1.3],{trail:.5},11),p("apollo","Pearl Labyrinth",[1.08,1.2,.8,.8,1.8,.3,.6,1.6],{breathe:.6},4),p("voronoi","Stained Voronoi",[],{},7),p("voronoi","Cathedral Window",[4,.3,.08,1.5,2,.3,0,.9],{kaleido:12,trail:.3},0),p("voronoi","Cell Division",[12,1.5,.02,2.5,2.5,1,1.4,.3],{trail:.6,breathe:1.2,melt:.4},6),p("wavefield","Neon Wavefield",[],{},2),p("wavefield","Pulsar Ridge",[.6,1.6,1.8,.4,.1,1,.4,.1],{trail:.5,chroma:1.5},10),p("wavefield","Spectral Dunes",[.2,1.2,1,1.2,.8,.6,1.8,0],{mirror:1,trail:.6},3),p("starcore","Star Core",[],{},4),p("starcore","Blue Giant",[3,1.6,1.6,2,1.6,1.4,1,1.2],{trail:.6},5),p("starcore","Quasar Eye",[2.2,2,1.4,2.2,2,1.4,1.2,.85],{kaleido:6,trail:.35},8),p("flower","Flower of Life",[],{},4),p("flower","Metatron Gate",[2,.15,2,1.6,4,1.5,.6,1],{trail:.5,zoom:1.012},13),p("flower","Seed of Creation",[2.6,-.05,.6,1.2,4,1,.35,1.4],{trail:.45,breathe:1,hueDrift:.006},1),p("fall","Endless Fall",[],{},0),p("fall","Droste Staircase",[1.5,1.2,3,4,1.5,1,.2,1],{trail:.5},4),p("fall","Spiral Abyss",[2.2,1.8,8,5,1.8,2,.8,1.5],{trail:.7,zoom:.99,spin:-.01},9),p("fall","Rising Up",[-1.2,.4,6,3,1.2,1.5,.5,.4],{kaleido:0,trail:.4,hueDrift:.01},3),p("hyper","Hyperbolic Temple",[],{},0),p("hyper","Escher Heaven",[7,3,.8,2,.5,.2,1,.8],{trail:.4},10),p("hyper","Infinite Mosaic",[4,6,1.4,1.5,.8,-.3,1.3,1.2],{trail:.5,breathe:.6},7),p("burst","Supernova Burst",[],{},4),p("burst","Firework Mind",[180,2,6,1.5,.8,.4,2,.4],{trail:.66,zoom:1.02},0),p("burst","Crystal Detonation",[60,2.2,4,.8,1.2,0,1.6,1],{kaleido:8,trail:.7,zoom:1.02},15),p("fold","Origami Fold",[],{},1),p("fold","Folding Cathedral",[.15,12,1.4,.8,1.4,1.5,1.4,.8],{trail:.5},4),p("fold","Dragon Paper",[.6,10,1.3,.62,1.2,1.2,2,1.3],{trail:.65,breathe:1},9),p("fold","Snowflake Engine",[1.05,9,1.36,.75,1.6,1,.8,.7],{kaleido:6,trail:.4},5),p("bulb","Mandelbulb Shrine",[8,.2,1,1.2,3.9,.8,1.2,7],{},14),p("bulb","Alien Spore",[5,.3,1.4,1.6,3.6,1,1.8,7],{breathe:.3},6),p("bulb","Golden Idol",[9,.12,.6,.8,3.4,.5,1.4,8],{trail:.2},4),p("qjulia","Julia Organism",[.5,.22,1,.8,3.5,.8,1.3,.6],{trail:.15},1),p("qjulia","Coral Mind",[.8,.15,1.4,1.1,3.3,1,1.8,1],{trail:.2},13),p("qjulia","Quantum Larva",[.25,.3,.8,.7,3.7,.6,1,.35],{trail:.1},9),p("jbulb","Living Bulb",[6,.2,1,1.1,3.9,.8,1.2,2.5],{trail:.15},0),p("jbulb","Pulsing Seed",[4,.25,1.3,1.5,3.8,1.2,1.6,1.2],{trail:.2},7),p("jbulb","Bone Orchid",[8.5,.15,.7,.9,4,.6,1,1.6],{trail:.1},4),p("kifs","Crystal Reliquary",[.08,.18,1.1,1.8,6,.8,1.5,.78],{trail:.12},5),p("kifs","Octahedral Throne",[.15,.12,1.3,1.6,5.8,1,1.6,.8],{trail:.2},15),p("kifs","Ice Cathedral",[.6,.2,.8,1,6,.6,1.1,.3],{trail:.1},10),p("hextunnel","Hex Temple",[],{},1),p("hextunnel","Machine Elf Hall",[2.2,8,2,2,1.4,1.2,1,2],{trail:.6,breathe:1.4,melt:.4},0),p("yantra","Sri Yantra",[],{},4),p("yantra","Third Eye Opening",[12,2,24,1.2,.2,2.5,1.2,1.2],{trail:.7,zoom:1.018},9),p("menger","Menger Crystal",[],{},5),p("menger","Sponge Cathedral",[1.6,.95,2,2,.6,1.2,.2,4],{trail:.5},4),p("aurora","Aurora Ocean",[3,1,1,1.3,.75,1,1,1.2],{trail:.15,kaleido:0,mirror:0,breathe:.2,melt:0,grain:.06,chroma:.45},3),p("aurora","Borealis Mirror",[4,1.4,1.3,1.6,.9,1.4,1.6,1.8],{trail:.2,kaleido:0,mirror:0,breathe:.15,melt:0,grain:.06,chroma:.45},12)],Sa=[["Liquid Oscilloscope",[2,7],[0,3]],["Spectral Whirlpool",[2,3],[2,5]],["Lissajous Lagoon",[8,3],[3,0]],["Golden Spiral Engine",[7,5],[4,6]],["Bass Bloom",[9,0],[5,2]],["Rising Phoenix",[6,8],[1,8]],["Twin Vortex",[3,2],[7,0]],["Ripple Mind",[4,10],[0,6]],["Petal Storm",[10,5],[6,2]],["Helix Current",[8,6],[8,1]],["Starburst Tunnel",[0,7],[9,5]],["Mirror Pulse",[1,4],[10,0]],["Trinity Drift",[5,8],[11,3]],["Orbital Smoke",[8,2],[7,4]],["Infinite Zoom Scope",[0,9],[0,1]],["Collapsing Stars",[1,3],[6,9]],["Plasma Flame",[6,9],[5,8]],["Deep Current",[8,8],[1,3]],["Kaleido Rose",[10,4],[2,11]],["Mandala Machine",[5,10],[6,11]],["Ghost Knots",[2,8],[3,3]],["Comet Tails",[7,0],[7,9]],["Sonic Lotus",[10,2],[2,6]],["Wave Temple",[4,5],[10,1]],["Ember Spiral",[7,6],[4,8]],["Pulse Reactor",[9,4],[5,0]],["Silk Scope",[8,1],[0,10]],["Aurora Knot",[6,3],[3,8]],["Gravity Well",[2,9],[7,2]],["Quantum Foam",[8,10],[9,6]],["Spinning Prism",[5,3],[11,5]],["Echo Chamber",[1,7],[0,4]],["Fireflies",[3,8],[7,9]],["Hypno Rings",[4,7],[6,0]],["Dream Scope",[0,1,2,3,4,5,6,7,8,9,10],[0,1,2,3,4,5,6,7,8,10,11]],["Chaos Garden",[0,1,2,3,4,5,6,7,8,9,10],[0,1,2,3,4,5,6,7,8,9,10,11]]];Sa.forEach(([a,e,t],i)=>{let s=p("flux",a,[],{},(i*5+3)%j.length);s.flux={flows:e,waves:t},a==="Chaos Garden"&&(s.params[4]=6),de.push(s)});function Qt(){let a=(e,t)=>[...Array(e).keys()].sort(()=>Math.random()-.5).slice(0,t);return{flows:a(11,2+Math.floor(Math.random()*3)),waves:a(12,2+Math.floor(Math.random()*3))}}var Ma=["Velvet","Chrome","Fractal","Liquid","Astral","Neon","Cosmic","Prismatic","Holographic","Molten","Electric","Dreaming","Infinite","Sacred","Psychedelic","Iridescent","Quantum","Lucid","Melting","Hyper","Ancient","Crystal","Sonic","Shimmering","Feral","Halcyon","Opal","Ultraviolet"],Ba=["Singularity","Aurora","Cathedral","Lotus","Vortex","Garden","Labyrinth","Mandala","Spiral","Bloom","Engine","Temple","Ocean","Nebula","Serpent","Oracle","Echo","Portal","Reactor","Dream","Prism","Hive","Halo","Abyss","Lattice","Comet","Membrane","Kaleidoscope"],Q=(a,e)=>a+Math.random()*(e-a),me=a=>a[Math.floor(Math.random()*a.length)];function Ve(){return`${me(Ma)} ${me(Ba)}`}function ea(){return{name:"Generated",a:[Q(.3,.65),Q(.3,.65),Q(.3,.65)],b:[Q(.3,.55),Q(.3,.55),Q(.3,.55)],c:[me([.5,1,1,1,1.5,2]),me([.5,1,1,1,1.5,2]),me([.5,1,1,1,1.5,2])],d:[Math.random(),Math.random(),Math.random()]}}function ta(a=ne,e=1){let t={...a},i=(s,o,r)=>{t[s]=t[s]+(Q(o,r)-t[s])*e};i("trail",0,.85),i("zoom",.985,1.03),i("spin",-.012,.012),i("warp",0,1.2),i("breathe",0,1.6),i("melt",0,.8),i("chroma",.3,2.2),i("bloom",.4,1.4),t.hueDrift=Math.random()<.3?Q(-.02,.02):0,e>=1&&(t.kaleido=Math.random()<.3?me([3,4,5,6,8,12]):0),t.mirror=Math.random()<.12?1:0;for(let s of["dance","ripple","punch","shake","swirlA","bulgeA"])i(s,.3,1.9);return t}function ft(a,e=.55){let t=N[a.scene],i=structuredClone(a);return i.builtin=!1,t&&(i.params=t.params.map((s,o)=>{let r=a.params[o]??s.def,l=Q(s.min,s.max);return+(r+(l-r)*e).toFixed(4)})),i.fx=ta(a.fx,e*.7),t&&t.fly&&(i.fx.trail=Math.min(i.fx.trail,.25)),t&&t.selfFeedback&&(i.fx.trail=Math.min(i.fx.trail,.15),Math.random()<.6&&(i.flux=Qt())),Math.random()<.5&&(i.palette=Math.random()<.4?ea():Math.floor(Math.random()*j.length)),i.name=Ve(),i.id="gen-"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),i}function mt(){let a=me(J),e=a.params.map(i=>{let s=Q(i.min,i.max);return+(i.def+(s-i.def)*.7).toFixed(4)}),t=ta(ne,1);return a.fly&&(t.trail=Math.min(t.trail,.25)),a.selfFeedback&&(t.trail=Math.random()*.15),{id:"gen-"+Date.now().toString(36),name:Ve(),engine:"scene",scene:a.id,params:e,palette:Math.random()<.5?ea():Math.floor(Math.random()*j.length),fx:t,builtin:!1,...a.selfFeedback?{flux:Qt()}:{}}}function je(a){return typeof a=="number"?j[(a%j.length+j.length)%j.length]:a}var aa="eyecandy.userPresets.v1";function ia(){try{return JSON.parse(localStorage.getItem(aa)||"[]")}catch{return[]}}function Le(a){try{localStorage.setItem(aa,JSON.stringify(a))}catch{}}function na(a){let e=a.ctx,t=e.createGain();t.gain.value=.55,t.connect(a.input),t.connect(a.out);let i=124,s=60/i/4,o=e.currentTime+.1,r=0,l=!0,u=[0,3,5,7,10,12,15],m=e.createBuffer(1,e.sampleRate,e.sampleRate),v=m.getChannelData(0);for(let b=0;b<v.length;b++)v[b]=Math.random()*2-1;let x=e.createDelay(1);x.delayTime.value=s*3;let T=e.createGain();T.gain.value=.35,x.connect(T),T.connect(x),x.connect(t);let y=b=>{let C=e.createOscillator(),w=e.createGain();C.frequency.setValueAtTime(150,b),C.frequency.exponentialRampToValueAtTime(42,b+.12),w.gain.setValueAtTime(1,b),w.gain.exponentialRampToValueAtTime(.001,b+.45),C.connect(w),w.connect(t),C.start(b),C.stop(b+.5)},S=(b,C)=>{let w=e.createBufferSource();w.buffer=m;let L=e.createBiquadFilter();L.type="highpass",L.frequency.value=8e3;let z=e.createGain();z.gain.setValueAtTime(C,b),z.gain.exponentialRampToValueAtTime(.001,b+.05),w.connect(L),L.connect(z),z.connect(t),w.start(b),w.stop(b+.06)},R=b=>{let C=e.createBufferSource();C.buffer=m;let w=e.createBiquadFilter();w.type="bandpass",w.frequency.value=1500;let L=e.createGain();L.gain.setValueAtTime(.5,b),L.gain.exponentialRampToValueAtTime(.001,b+.18),C.connect(w),w.connect(L),L.connect(t),L.connect(x),C.start(b),C.stop(b+.2)},P=(b,C,w,L)=>{let z=e.createOscillator(),M=e.createOscillator(),F=e.createBiquadFilter(),q=e.createGain();z.type="sawtooth",M.type="square";let V=55*Math.pow(2,C/12);z.frequency.value=V,M.frequency.value=V*1.005,F.type="lowpass",F.Q.value=9,F.frequency.setValueAtTime(L,b),F.frequency.exponentialRampToValueAtTime(120,b+w),q.gain.setValueAtTime(.22,b),q.gain.exponentialRampToValueAtTime(.001,b+w),z.connect(F),M.connect(F),F.connect(q),q.connect(t),q.connect(x),z.start(b),M.start(b),z.stop(b+w),M.stop(b+w)},G=(b,C)=>{[0,7,15,19].forEach(w=>{let L=e.createOscillator(),z=e.createGain();L.type="triangle",L.frequency.value=110*Math.pow(2,(C+w)/12),z.gain.setValueAtTime(0,b),z.gain.linearRampToValueAtTime(.05,b+1),z.gain.linearRampToValueAtTime(0,b+s*64),L.connect(z),z.connect(t),z.connect(x),L.start(b),L.stop(b+s*64)})},K=[0,-4,3,-2],Z=()=>{if(l){for(;o<e.currentTime+.15;){let b=r%16,C=Math.floor(r/16),w=Math.floor(C/8)%4,L=K[Math.floor(C/2)%4],z=C%32>=28;!z&&b%4===0&&y(o),b%2===1&&S(o,b%4===3?.25:.1),!z&&(b===4||b===12)&&R(o),Math.random()<(w===2?.8:.55)&&P(o,L+12+u[Math.floor(Math.random()*u.length)]+(Math.random()<.2?12:0),s*1.8,600+3e3*Math.abs(Math.sin(r*.03))),b===0&&C%4===0&&G(o,L),o+=s,r++}setTimeout(Z,25)}};return Z(),()=>{l=!1,t.gain.setTargetAtTime(0,e.currentTime,.2),setTimeout(()=>t.disconnect(),800)}}var oa=[3302,3570],Ra=[1476,2508,2976],Ca=(()=>{let a=new Uint32Array(256);for(let e=0;e<256;e++){let t=e;for(let i=0;i<8;i++)t=t&1?3988292384^t>>>1:t>>>1;a[e]=t>>>0}return a})();function sa(a){let e=4294967295;for(let t of a)e=Ca[(e^t)&255]^e>>>8;return(e^4294967295)>>>0}var Aa=[[1,0,0,0],[1,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,1,1],[0,0,0,1],[1,0,0,1],[0,0,0,0]],We=class{constructor(){this.supported=!!navigator.hid,this.device=null,this.kind=null,this.bt=!1,this.status=this.supported?"not connected":"unsupported",this.t=[{active:!1,x:.5,y:.5,id:-1},{active:!1,x:.5,y:.5,id:-1}],this.axes=[0,0,0,0],this.buttons=new Array(18).fill(0),this.lastReport=0,this.lastPadReport=0,this.onstatus=()=>{},this.seq=0,this.rumbleTimer=0,this.supported&&(navigator.hid.addEventListener("disconnect",e=>{e.device===this.device&&(this.device=null,this.set("not connected"))}),navigator.hid.addEventListener("connect",()=>this.autoConnect()))}set(e){this.status=e,this.onstatus(e)}get connected(){return!!this.device}get fresh(){return this.device&&performance.now()-this.lastPadReport<400}async autoConnect(){if(!this.supported||this.device)return!1;try{let t=(await navigator.hid.getDevices()).find(i=>i.vendorId===1356&&(oa.includes(i.productId)||Ra.includes(i.productId)));if(t)return await this.open(t),!0}catch(e){console.warn(e)}return!1}async request(){if(!this.supported)return!1;try{window.eyecandy&&window.eyecandy.requestHid?await window.eyecandy.requestHid():await navigator.hid.requestDevice({filters:[{vendorId:1356}]})}catch(e){console.warn(e)}return this.autoConnect()}async open(e){try{e.opened||await e.open()}catch{this.set("could not open (close Steam / DS4Windows?)");return}this.device=e,this.kind=oa.includes(e.productId)?"ds5":"ds4";try{await e.receiveFeatureReport(this.kind==="ds5"?5:2)}catch{}e.addEventListener("inputreport",t=>this.parse(t)),this.set((this.kind==="ds5"?"DualSense":"DualShock 4")+" connected (touchpad + full controller)")}parse(e){let t=e.data,i=e.reportId,s=P=>t.getUint8(P),o=-1,r=-1;if(this.kind==="ds5"?i===1&&t.byteLength>=40?(o=0,r=32,this.bt=!1):i===49&&t.byteLength>=41?(o=1,r=33,this.bt=!0):i===1&&t.byteLength>=9&&(o=0,this.bt=!0):i===1&&t.byteLength>=42?(o=0,r=34,this.bt=!1):i===17&&t.byteLength>=44?(o=2,r=36,this.bt=!0):i===1&&t.byteLength>=9&&(o=0,this.bt=!0),o<0)return;let l=P=>(s(P)-128)/127.5,u=this.buttons;this.axes=[l(o),l(o+1),l(o+2),l(o+3)];let m,v,x,T,y;this.kind==="ds5"&&r>=0?(T=s(o+4),y=s(o+5),m=s(o+7),v=s(o+8),x=s(o+9)):(m=s(o+4),v=s(o+5),x=s(o+6),T=s(o+7),y=s(o+8));let S=Aa[Math.min(8,m&15)];if(u[2]=m>>4&1,u[0]=m>>5&1,u[1]=m>>6&1,u[3]=m>>7&1,u[4]=v&1,u[5]=v>>1&1,u[6]=T/255,u[7]=y/255,u[8]=v>>4&1,u[9]=v>>5&1,u[10]=v>>6&1,u[11]=v>>7&1,u[12]=S[0],u[15]=S[1],u[13]=S[2],u[14]=S[3],u[16]=x&1,u[17]=x>>1&1,this.lastPadReport=performance.now(),r<0)return;let R=this.kind==="ds5"?1079:942;for(let P=0;P<2;P++){let G=r+P*4,K=s(G),Z=s(G+1),b=s(G+2),C=s(G+3),w=this.t[P];w.active=!(K&128),w.id=K&127,w.active&&(w.x=Math.min(1,(Z|(b&15)<<8)/1919),w.y=Math.min(1,(b>>4|C<<4)/R))}this.lastReport=performance.now()}asGamepad(){return{id:(this.kind==="ds5"?"DualSense":"DualShock 4")+" (HID, Vendor: 054c)",connected:!0,mapping:"standard",axes:this.axes,buttons:this.buttons.map(e=>({pressed:e>.5,value:e})),vibrationActuator:{playEffect:(e,t)=>this.rumble(t)}}}async rumble({duration:e=100,strongMagnitude:t=0,weakMagnitude:i=0}={}){if(!this.device)return;let o=Math.round(Math.min(1,t)*255),r=Math.round(Math.min(1,i)*255);try{await this.sendMotors(o,r),clearTimeout(this.rumbleTimer),this.rumbleTimer=setTimeout(()=>this.sendMotors(0,0).catch(()=>{}),e)}catch{}}async sendMotors(e,t){let i=this.device;if(i)if(this.kind==="ds5"){let s=new Uint8Array(47);if(s[0]=3,s[2]=t,s[3]=e,!this.bt)return i.sendReport(2,s);let o=new Uint8Array(77);o[0]=(this.seq=this.seq+1&15)<<4,o[1]=16,o.set(s,2);let r=sa(new Uint8Array([162,49,...o.subarray(0,73)]));return o[73]=r&255,o[74]=r>>>8&255,o[75]=r>>>16&255,o[76]=r>>>24&255,i.sendReport(49,o)}else{if(!this.bt){let r=new Uint8Array(31);return r[0]=7,r[3]=t,r[4]=e,i.sendReport(5,r)}let s=new Uint8Array(77);s[0]=192,s[2]=7,s[5]=t,s[6]=e;let o=sa(new Uint8Array([162,17,...s.subarray(0,73)]));return s[73]=o&255,s[74]=o>>>8&255,s[75]=o>>>16&255,s[76]=o>>>24&255,i.sendReport(17,s)}}};var Te=(matchMedia("(pointer: coarse)").matches||"ontouchstart"in window)&&!matchMedia("(pointer: fine)").matches,La=[[0,"\u2738","Burst","r",0],[2,"\u2684","Random","r",1],[3,"\u2605","Save","r",2],[4,"\u2756","Kaleido","l",0],[5,"\u25D1","Colors","l",1],[17,"\u266A","Dance","l",2]],Ye=class{constructor(e){this.axes=[0,0,0,0],this.buttons=new Array(18).fill(0),this.sticks={l:null,r:null},this.lastInput=0,this.active=!1,this.el=document.createElement("div"),this.el.id="touchUI",this.el.innerHTML=`
      <div class="tzone" data-side="l"></div><div class="tzone" data-side="r"></div>
      <div class="tstick" data-side="l"><i></i></div><div class="tstick" data-side="r"><i></i></div>
      <div class="ttrig" data-b="6" data-side="l"><b>WARP</b><small>hold</small></div>
      <div class="ttrig" data-b="7" data-side="r"><b>DRIVE</b><small>hold</small></div>
      ${La.map(([l,u,m,v,x])=>`<button class="tbtn" data-b="${l}" data-side="${v}" style="--slot:${x}"><span>${u}</span><small>${m}</small></button>`).join("")}
      <div class="ttop">
        <button class="tico" data-act="sheetVisuals" title="Presets & settings">\u2630</button>
        <button class="tico" data-act="prevPreset">\u2039</button>
        <div class="tname" data-act="sheetVisuals"></div>
        <button class="tico" data-act="nextPreset">\u203A</button>
        <button class="tico" data-act="sheetMusic" title="Music">\u266B</button>
        <button class="tico" data-act="fullscreen" title="Fullscreen">\u26F6</button>
      </div>
      <div class="thint">Left thumb steers \xB7 right thumb morphs</div>`,e.appendChild(this.el);let t=56,i=l=>this.el.querySelector(`.tstick[data-side="${l}"]`),s=l=>{let u=l.target.closest(".tzone");if(!u)return;let m=u.dataset.side;if(this.sticks[m])return;l.preventDefault(),u.setPointerCapture(l.pointerId),this.sticks[m]={id:l.pointerId,x:l.clientX,y:l.clientY};let v=i(m);v.style.left=l.clientX+"px",v.style.top=l.clientY+"px",v.classList.add("on"),this.touch()},o=l=>{for(let u of["l","r"]){let m=this.sticks[u];if(!m||m.id!==l.pointerId)continue;let v=(l.clientX-m.x)/t,x=(l.clientY-m.y)/t,T=Math.hypot(v,x);T>1&&(v/=T,x/=T);let y=u==="l"?0:2;this.axes[y]=v,this.axes[y+1]=x,i(u).querySelector("i").style.transform=`translate(${v*t}px,${x*t}px)`,this.touch()}},r=l=>{for(let u of["l","r"]){let m=this.sticks[u];if(!m||m.id!==l.pointerId)continue;this.sticks[u]=null;let v=u==="l"?0:2;this.axes[v]=this.axes[v+1]=0;let x=i(u);x.classList.remove("on"),x.querySelector("i").style.transform=""}};this.el.addEventListener("pointerdown",s),this.el.addEventListener("pointermove",o),this.el.addEventListener("pointerup",r),this.el.addEventListener("pointercancel",r),this.el.querySelectorAll("[data-b]").forEach(l=>{let u=+l.dataset.b,m=0,v=0,x=y=>{y.preventDefault(),y.stopPropagation(),l.setPointerCapture?.(y.pointerId),clearTimeout(v),m=performance.now(),this.buttons[u]=1,l.classList.add("down"),this.touch()},T=()=>{let y=90-(performance.now()-m),S=()=>{this.buttons[u]=0,l.classList.remove("down")};clearTimeout(v),y>0?v=setTimeout(S,y):S()};l.addEventListener("pointerdown",x),l.addEventListener("pointerup",T),l.addEventListener("pointercancel",T),l.addEventListener("lostpointercapture",T)}),this.el.addEventListener("contextmenu",l=>l.preventDefault())}touch(){this.lastInput=performance.now(),this.active=!0,this.el.classList.add("awake"),this.el.querySelector(".thint").classList.add("gone"),clearTimeout(this._t),this._t=setTimeout(()=>this.el.classList.remove("awake"),3500)}setName(e){let t=this.el.querySelector(".tname");t&&(t.textContent=e)}asGamepad(){return{id:"Touch controls",connected:!0,mapping:"standard",axes:this.axes.slice(),buttons:this.buttons.map(e=>({pressed:e>.5,value:e})),vibrationActuator:{playEffect:(e,t)=>(navigator.vibrate&&t&&t.duration>=100&&navigator.vibrate(Math.min(60,t.duration*.4)),Promise.resolve())}}}};var Ie=de.filter(a=>a.scene!=="flux"),Bt=de.filter(a=>a.scene==="flux"),h=a=>document.querySelector(a),Me=a=>[...document.querySelectorAll(a)],X=(a,e,t)=>Math.max(e,Math.min(t,a)),D=(a,e,t)=>a+(e-a)*t,O=window.eyecandy||null;O||document.addEventListener("DOMContentLoaded",()=>{},{once:!0});var ma="eyecandy.settings.v1",za={resolution:"native",renderScale:"auto",aa:"auto",autoExposure:!0,fpsCap:"0",uiScale:1,startFullscreen:!1,showFps:!1,autopilot:!0,autoInterval:30,autoSource:"mix",autoOnDrop:!0,idle:20,reactIntensity:1.4,idleDance:!0,beatRipples:!0,beatPulse:.8,beatFlash:.3,cameraShake:.5,beatSens:1,gainBass:1,gainMid:1,gainHigh:1,outputDevice:"default",rumble:!0,rumbleStrength:.7,deadzone:.14,stickSens:1,invertY:!1,touchMode:"both",transition:1.4,autoPause:!1,uiAutoHide:!0,volume:.85,seenGuide:!1},d={...za,...JSON.parse(localStorage.getItem(ma)||"{}")},le=()=>localStorage.setItem(ma,JSON.stringify(d)),oe=h("#gl"),B;try{B=new Ge(oe)}catch(a){throw document.body.innerHTML=`<div style="padding:40px;font:16px sans-serif;color:#fff">Eye Candy needs WebGL2.<br><br>${a.message}</div>`,a}B.ssMax=1;var f=new $e;f.out.gain.value=d.volume;var g=new Xe;g.deadzone=d.deadzone;var U=new We;g.hid=U;var re={active:!1,x:.5,y:.5},ve=null;Te&&(document.body.classList.add("mobile"),ve=new Ye(document.body),g.touch=ve);var H=ia(),Be=null,_=null,te=null,Re=null,et=[],Ke=null,ge=null,da={...ne,trail:0,zoom:1,warp:0,breathe:.15,bloom:.6,chroma:.8,grain:.25};function ce(){return _?Promise.resolve():Ke||(Rt(),Ke=new Promise((a,e)=>{let t=document.createElement("script");t.src="milk.js",t.onload=()=>{let i=window.EyeMilk;Re={};for(let s of i.packs)try{Object.assign(Re,s.getPresets?s.getPresets():s.default?.getPresets())}catch(o){console.warn(o)}et=Object.keys(Re).sort((s,o)=>s.localeCompare(o)),te=document.createElement("canvas"),te.width=1280,te.height=720,_=i.butterchurn.createVisualizer(f.ctx,te,{width:1280,height:720,pixelRatio:1,textureRatio:1}),_.connectAudio(f.input),fetch("milktex/manifest.json").then(s=>s.json()).then(s=>_.loadExtraImages(s)).catch(()=>{}),Rt().then(()=>a())},t.onerror=e,document.head.appendChild(t)}),Ke)}function Ea(a,e){if(!_)return;let t=Math.min(1,1280/a),i=Math.round(a*t),s=Math.round(e*t);(te.width!==i||te.height!==s)&&(te.width=i,te.height=s,_.setRendererSize(i,s))}var Ee=null,Ae={},dt={},pt=null;function Rt(){return pt||(pt=fetch("milklib/index.json").then(a=>a.json()).then(a=>{Ee={};for(let[e,t,i]of a)Ee[e]={cat:t,chunk:i},(Ae[t]=Ae[t]||[]).push(e);return Ee}).catch(()=>Ee={}))}async function pa(a){if(Re&&Re[a])return Re[a];await Rt();let e=Ee[a];return e?(dt[e.chunk]||(dt[e.chunk]=fetch(`milklib/c${e.chunk}.json`).then(i=>i.json())),(await dt[e.chunk])[a]||null):null}async function Fe(a,e=2){if(!_)return;let t=await pa(a);if(t)try{_.loadPreset(t,e),ge=a}catch(i){console.warn("MilkDrop preset failed",a,i)}}var Ce="all";function _e(a){return a==="classic"?et:a!=="all"?Ae[a]||[]:[...et,...Object.values(Ae).flat()]}var ot=()=>{let a=_e(Ce==="classic"||Ce==="all"?"all":Ce);return a[Math.floor(Math.random()*a.length)]},ht=new Map;function At(a){return ht.has(a)||ht.set(a,{id:"milk:"+a,name:a,engine:"milk",milk:a,fx:ut(a,da,{trail:0,zoom:1,kaleido:0,mirror:0}),palette:0,builtin:!0}),ht.get(a)}var se="eye",c=structuredClone(de[0]),qe=structuredClone(c),W=0,n={camX:0,camY:0,roll:0,morphX:0,morphY:0,waitCenter:!1,time:0,timeScale:1,hue:0,burstT:9,flash:0,freeze:!1,lt:0,rt:0,transMix:0,lastSwitch:0,lastHuman:-1e9,kAngle:0,pal:null,flowX:0,flowY:0,hyper:0,autoT:0,panels:!0,cinema:!1,amX:0,amY:0,danceT:0,sinceBeat:9,beatInt:.5,jolt:0,beatRipT:9,beatRipAmt:0,lastAutoBurst:0,lastStick:-1e9,lensRot:0,lensZoom:1,swirl:0,bulge:0,swirlT:0,bulgeT:0,burstCX:0,burstCY:0,pinch:null,touch:[{on:!1,x:0,y:0,vx:0,vy:0,s:0},{on:!1,x:0,y:0,vx:0,vy:0,s:0}],flux:{fa:0,fb:0,fm:0,wa:0,wb:0,wm:0,tf:0,tw:0,mapT:0}},ha=a=>[...a.a,...a.b,...a.c,...a.d];n.pal=ha(je(c.palette));var vt=[-1,-.5,.25,.5,.75,1,1.5,2,3,4];function Lt(a){return a==="eye"?Ie:a==="flux"?Bt:a==="user"?H:a==="milk"?_e(Ce).map(At):de}function zt(){let a=N[c.scene];if(!a)return[];let e=c.params.slice(),[t,i]=a.stick||[0,1],s=(n.waitCenter?0:n.morphX)+n.amX,o=(n.waitCenter?0:n.morphY)+n.amY,r=(l,u)=>{let m=a.params[l];m&&(e[l]=X(e[l]+u*(m.max-m.min)*.35*(m.ms??1),m.min,m.max))};return r(t,s),r(i,o),e}function $(a,e={}){if(a){if(e.transition!==!1&&B.fin&&(B.snapshot(),n.transMix=1),c=structuredClone(a),c.fx={...ne,...a.engine==="milk"?da:{},...a.fx},qe=structuredClone(c),n.waitCenter=Math.abs(n.morphX)+Math.abs(n.morphY)>.1,n.hue=c.fx.hueOffset||0,n.lastSwitch=performance.now(),n.camX=0,n.camY=0,n.lensRot=0,n.lensZoom=1,c.scene==="flux"){let t=c.flux||{flows:[2,7],waves:[0,3]};c.flux=t,Object.assign(n.flux,{fa:t.flows[0],fb:t.flows[0],fm:0,wa:t.waves[0],wb:t.waves[0],wm:0,tf:0,tw:0})}c.engine==="milk"?ce().then(()=>Fe(c.milk,e.transition===!1?0:2)):c.fx.fusion>0&&ce().then(()=>{c.milk?Fe(c.milk):ge||Fe(ot())}),c.engine==="scene"&&B.errors[c.scene]&&k("\u26A0","Scene failed to compile \u2014 skipping"),h("#presetName").textContent=c.name,Y(),ae(),e.quiet||k("\u25C6",c.name)}}function ue(a){let e=Lt(se);if(!e.length){se==="milk"&&ce().then(()=>{Y(),ue(a)});return}W=((W+a)%e.length+e.length)%e.length,$(e[W])}function Et(){if(c.engine==="milk"){c.fx={...c.fx,...ft({...c,scene:"none"}).fx},c.name=c.milk+" \u2684",h("#presetName").textContent=c.name,ae(),k("\u2684","Randomized FX");return}$(ft(c),{quiet:!0}),k("\u2684","Randomized \xB7 "+c.name)}function Ft(){$(mt(),{quiet:!0}),k("\u2726","Generated \xB7 "+c.name)}function va(){let a=structuredClone(c);return a.engine==="scene"&&(a.params=zt().map(e=>+e.toFixed(4))),a.fx={...a.fx,hueOffset:(n.hue%1+1)%1,speed:+(a.fx.speed*Math.abs(n.timeScale)).toFixed(3)},a.engine==="scene"&&a.fx.fusion>0&&ge&&(a.milk=ge),a}function st(){let a=va();a.id="user-"+Date.now().toString(36),a.builtin=!1,(qe.builtin||!a.name||H.some(e=>e.name===a.name))&&(a.name=(a.engine==="milk"?"Milk \xB7 ":"")+Ve()),H.push(a),Le(H),c=structuredClone(a),qe=structuredClone(a),h("#presetName").textContent=c.name,Y(),ae(),k("\u2605","Saved \u201C"+a.name+"\u201D to My Presets"),g.rumble(.4,.6,120)}function Fa(){let a=H.findIndex(t=>t.id===c.id);if(a<0)return st();let e=va();e.name=h("#pName").value||e.name,H[a]=e,Le(H),qe=structuredClone(e),c=structuredClone(e),n.timeScale=1,Y(),k("\u2605","Updated \u201C"+e.name+"\u201D")}function Da(){let a=H.findIndex(e=>e.id===c.id);a<0||(H.splice(a,1),Le(H),Y(),k("\u2716","Deleted"),ue(0))}function Ue(a=1,e=0,t=0){n.burstCX=e,n.burstCY=t,n.burstT=0,n.flash=.55*a,g.rumble(.9*a*d.rumbleStrength,.5*a*d.rumbleStrength,160)}function xa(a=1){let e=typeof c.palette=="number"?c.palette:-1;c.palette=((e+a)%j.length+j.length)%j.length,k(g.label("RB"),"Palette \xB7 "+j[c.palette].name),ae()}var xt=[0,3,4,5,6,8,12,16];function ga(){let a=xt.indexOf(c.fx.kaleido);c.fx.kaleido=xt[(a+1)%xt.length],k(g.label("LB"),c.fx.kaleido?"Kaleidoscope \xD7"+c.fx.kaleido:"Kaleidoscope off"),ae()}function ba(){c.fx.mirror=c.fx.mirror?0:1,k(g.label("LB"),c.fx.mirror?"Mirror world":"Mirror off"),ae()}function tt(a){let e=vt.indexOf(n.timeScale);e<0&&(e=5),e=X(e+a,0,vt.length-1),n.timeScale=vt[e],k(a>0?"\u25B2":"\u25BC",n.timeScale<0?"Time reversed \xD7"+Math.abs(n.timeScale):"Time \xD7"+n.timeScale)}function Ia(){n.camX=n.camY=n.roll=0,n.lensRot=0,n.lensZoom=1,n.timeScale=1,n.flowX=n.flowY=0,k(g.label("L3"),"View reset")}function qa(){c.engine==="scene"&&(c.params=zt(),n.waitCenter=!0,ae(),k(g.label("R3"),"Shape locked in"),g.rumble(.2,.5,60))}function Dt(a){d.autopilot=a,le(),h("#autoBtn").classList.toggle("on",a),k("\u27F3",a?"Autopilot on":"Autopilot off"),Ot()}function be(){n.lastHuman=performance.now()}function Ua(a,e){let t=d.autopilot&&(!d.autoPause||e-n.lastHuman>d.idle*1e3);if(n.autoActive=t,!t)return;n.autoT+=a;let i=(e-n.lastSwitch)/1e3,s=d.autoOnDrop&&f.drop>1.1&&i>12;if(i>d.autoInterval||s){f.drop=0;let o=d.autoSource,r=Math.random();o==="generate"||o==="mix"&&r<.25?$(mt(),{quiet:!0}):o==="milk"||o==="mix"&&r<.4||o==="all"&&r<.5?ce().then(()=>$(At(ot()),{quiet:!0})):o==="flux"||o==="mix"&&r<.55?(W=Math.floor(Math.random()*Bt.length),$(Bt[W],{quiet:!0})):o==="user"&&H.length?$(H[Math.floor(Math.random()*H.length)],{quiet:!0}):(W=Math.floor(Math.random()*Ie.length),$(Ie[W],{quiet:!0})),s&&Ue(.8)}}function Ha(a){if(g.poll(),g.justConnected&&g.style!=="touch"&&(k("\u{1F3AE}",(g.style==="ps"?"PlayStation":"Xbox")+" controller connected"),g.rumble(.5,.8,200),d.seenGuide||(d.seenGuide=!0,le(),xe(!0)),g.style==="ps"&&U.supported&&!U.connected&&!O&&(h("#tpChip").classList.remove("hidden"),setTimeout(()=>k("\u25C9","PlayStation pad: click \u201CEnable touchpad\u201D up top to use the touchpad"),1500)),Gt()),!g.connected){n.lt=D(n.lt,0,a*6),n.rt=D(n.rt,0,a*6);return}let[e,t,i,s]=g.axes;if((g.pressed.some(Boolean)||Math.abs(e)+Math.abs(t)+Math.abs(i)+Math.abs(s)+g.lt+g.rt>.05)&&(be(),h("#splash").classList.contains("gone")||_a(),d.uiAutoHide&&rt()),!h("#controls").classList.contains("hidden")){(g.tap(E.B)||g.tap(E.A)||g.shortRelease(E.BACK))&&xe(!1);return}let r=d.stickSens,l=d.invertY?-1:1;if(Math.abs(e)+Math.abs(t)+Math.abs(i)+Math.abs(s)>.05&&(n.lastStick=performance.now()),c.engine==="milk")n.lensRot+=e*a*1.8*r,n.lensZoom=X(n.lensZoom*Math.exp(t*l*a*1.3*r),.3,4),n.swirlT=i*1.5*r,n.bulgeT=-s*l*1.1*r;else{let m=N[c.scene]&&N[c.scene].camSens||1;n.camX+=e*a*1.5*r*m,n.camY=X(n.camY-t*l*a*1.1*r*m,-1.3,1.3),n.waitCenter&&Math.hypot(i,s)<.12&&(n.waitCenter=!1),n.morphX=D(n.morphX,X(i*r,-1.5,1.5),a*8),n.morphY=D(n.morphY,X(-s*l*r,-1.5,1.5),a*8),n.swirlT=i*.3*r,n.bulgeT=-s*l*.15*r}n.flowX=D(n.flowX,e,a*5),n.flowY=D(n.flowY,-t*l,a*5),n.lt=D(n.lt,g.lt,a*10),n.rt=D(n.rt,g.rt,a*10),g.lt>.08&&Math.random()<a*3&&Ct("LT","Warp",g.lt),g.rt>.08&&Math.random()<a*3&&Ct("RT","Drive",g.rt);let u=g.lt>.92&&g.rt>.92;u&&!n.hyperOn&&(k("\u2604","HYPERDRIVE"),Ue(1.2)),n.hyperOn=u,g.tap(E.A)&&Ue(1),g.tap(E.TOUCH)&&(d.idleDance=!d.idleDance,le(),Ot(),k("\u25C9",d.idleDance?"Music dance ON":"Music dance OFF \u2014 pure beat reactive"),g.rumble(.3,.5,90)),g.style==="ps"&&U.supported&&!U.connected&&!n.tpTried&&(n.tpTried=!0,U.autoConnect().then(m=>{!m&&O&&U.request()})),n.freeze=g.down(E.B),g.tap(E.B)&&k(g.label("B"),"Freeze"),g.shortRelease(E.X)&&Et(),g.hold(E.X,550)&&(Ft(),g.rumble(.6,.6,150)),g.tap(E.Y)&&st(),g.shortRelease(E.LB)&&ga(),g.hold(E.LB,500)&&ba(),g.shortRelease(E.RB)&&xa(1),g.down(E.RB)&&performance.now()-g.downAt[E.RB]>300&&(n.hue+=a*.5,Math.random()<a*2&&k(g.label("RB"),"Hue spin")),g.tap(E.RIGHT)&&ue(1),g.tap(E.LEFT)&&ue(-1),g.tap(E.UP)&&tt(1),g.tap(E.DOWN)&&tt(-1),g.tap(E.L3)&&Ia(),g.tap(E.R3)&&qa(),g.tap(E.START)&&(n.cinema=!1,It(!0),wa()),g.shortRelease(E.BACK)&&xe(!0),g.hold(E.BACK,700)&&Dt(!d.autopilot)}function _a(){!f.playlist.length&&f.mode==="player"&&!Be&&qt(),De()}function Na(a,e){if(c.scene!=="flux"||!c.flux)return;let t=n.flux,i=c.flux,s=e[4]||14,o=(l,u)=>{let m=l.filter(v=>v!==u);return m.length?m[Math.floor(Math.random()*m.length)]:l[0]};t.tf+=a,t.tw+=a,t.fm>0&&t.fm<1&&(t.fm=Math.min(1,t.fm+a/3.5)),t.fm>=1&&(t.fa=t.fb,t.fm=0),t.fm===0&&t.tf>s&&i.flows.length>1&&(t.fb=o(i.flows,t.fa),t.fm=.001,t.tf=0),t.wm>0&&t.wm<1&&(t.wm=Math.min(1,t.wm+a/2)),t.wm>=1&&(t.wa=t.wb,t.wm=0);let r=f.drop>.9&&t.tw>4;t.wm===0&&(t.tw>s*.7||r)&&i.waves.length>1&&(t.wb=o(i.waves,t.wa),t.wm=.001,t.tw=0),t.mapT+=a*.03*(e[5]??1)*(1+f.vol*.8)}function Oa(a){let e=B.W&&B.H?B.W/B.H:1.7777777777777777,t;U.connected&&performance.now()-U.lastReport<600?t=U.t.map(o=>o.active?o:null):t=[re.active?re:null,null];for(let o=0;o<2;o++){let r=n.touch[o],l=t[o];if(l&&d.touchMode!=="off"){let u=(l.x-.5)*e,m=.5-l.y;r.on||(r.x=u,r.y=m,r.vx=r.vy=0);let v=(u-r.x)/Math.max(a,.001),x=(m-r.y)/Math.max(a,.001);r.vx=D(r.vx,v,.35),r.vy=D(r.vy,x,.35),r.x=u,r.y=m,r.on=!0,r.s=Math.min(1,r.s+a*3),be()}else r.on=!1,r.s=Math.max(0,r.s-a*2),r.vx*=.9,r.vy*=.9}let[i,s]=n.touch;if(i.on&&s.on){let o=Math.hypot(i.x-s.x,i.y-s.y),r=Math.atan2(s.y-i.y,s.x-i.x);if(n.pinch){n.lensZoom=X(n.lensZoom*(o/Math.max(.02,n.pinch.d)),.3,4);let l=r-n.pinch.a;l>Math.PI&&(l-=2*Math.PI),l<-Math.PI&&(l+=2*Math.PI),n.lensRot+=l}n.pinch={d:o,a:r}}else n.pinch=null}var ra=(a,e)=>[a.x,a.y,e?a.s*(n.pinch?.3:1):0,a.s>.01?1:0];function ya(a){let e=n.pal,t=[];for(let i=0;i<3;i++)t.push(X(e[i]+e[3+i]*Math.cos(6.2831853*(e[6+i]*a+e[9+i]+n.hue)),0,1));return t}var gt=performance.now(),Ze=0,bt=0,ze=16,Je=0,ee=Te?.55:.8,yt=0;function Ta(a){requestAnimationFrame(Ta);let e=+d.fpsCap;if(e>0&&a-gt<1e3/e-1.5)return;let t=Math.min(.05,(a-gt)/1e3);gt=a,Ha(t),Oa(t);let i=c.fx,s=n.rt,o=n.lt,r=n.hyperOn?1:0;n.hyper=D(n.hyper,r,t*3),f.update(t,i.react*(1+s*1.6),{sens:d.beatSens,gB:d.gainBass,gM:d.gainMid,gH:d.gainHigh}),Ua(t,a);let l=d.reactIntensity*i.react,u=d.idleDance?1:0;n.danceT+=t*(.5+f.vol*1.2);let m=n.danceT;n.amX=D(n.amX,u*l*i.dance*(Math.sin(m*.53)*.3*(.35+f.mid)+f.bass*.22*Math.sin(m*.19+1)),t*4),n.amY=D(n.amY,u*l*i.dance*(Math.cos(m*.41)*.25*(.35+f.high)+f.beat*.28),t*6);let v=u*Math.min(l,2)*i.dance*Math.sin(m*.07+.5)*(.04+f.vol*.1),x=u*Math.min(l,2)*i.dance*Math.sin(m*.11)*(.02+f.mid*.05);c.engine==="milk"&&u>.5&&(n.lensRot+=t*l*i.swirlA*.05*Math.sin(m*.05),a-n.lastStick>4e3&&(n.lensZoom=D(n.lensZoom,1+Math.sin(m*.09)*.15*i.bulgeA,t*.2))),n.sinceBeat+=t,f.isBeat&&(n.sinceBeat>.2&&n.sinceBeat<2&&(n.beatInt=D(n.beatInt,n.sinceBeat,.3)),n.sinceBeat=0,n.jolt=(Math.random()-.5)*2,n.beatRipT=0,n.beatRipAmt=Math.min(1.6,f.bass*.9)*l*i.ripple,d.beatFlash>0&&f.bass>1.2&&a-n.lastAutoBurst>2200&&(n.flash=Math.max(n.flash,d.beatFlash*.5*Math.min(l,1.5)),n.lastAutoBurst=a)),n.jolt*=Math.exp(-t*7),n.beatRipT+=t;let T=c.engine==="scene"&&N[c.scene]&&N[c.scene].landscape?.12:1;n.swirl=D(n.swirl,n.swirlT*(T<1?.4:1)+T*Math.min(l,2)*u*i.swirlA*Math.sin(m*.17)*(.04+f.mid*.16),t*4),n.bulge=D(n.bulge,n.bulgeT+T*Math.min(l,2)*i.bulgeA*f.bass*.08,t*10),i.kaleido>1&&(n.kAngle+=t*f.mid*.25*l*Math.sin(m*.11));let y=window.devicePixelRatio||1,S=d.resolution==="native"?Math.round(innerHeight*Math.min(y,Te?1.25:2)):+d.resolution,R=Math.round(S*innerWidth/Math.max(1,innerHeight));(oe.width!==R||oe.height!==S)&&(oe.width=R,oe.height=S),ze=D(ze,t*1e3,.05);let P;if(d.renderScale==="auto"){Je+=t;let I=e>0?1e3/e:16.7;Je>1.5&&(ze>I*1.25&&ee>.4?(ee=Math.max(.4,ee-.08),Je=0):ze<I*.88&&ee<1&&(ee=Math.min(1,ee+.05),Je=0)),P=Math.max(c.engine==="milk"?.7:.4,Math.round(ee*20)/20)}else P=X(+d.renderScale,.25,2);let G=d.aa==="off"?1:d.aa==="2x"?2:d.aa==="4x"?4:Te?1:n.aaAuto??2;if((d.aa==="auto"||!d.aa)&&(n.aaT=(n.aaT||0)+t,n.aaT>4&&d.renderScale==="auto"&&((n.aaAuto??2)>1&&ee<.75?(n.aaAuto=1,n.aaT=0):n.aaAuto===1&&ee>=1&&ze<12&&(n.aaAuto=2,n.aaT=-20))),B.ssMax!==G){B.ssMax=G;for(let I of Object.keys(B.progs)){let $t=N[I];if($t&&$t.ss){let Xt=B.progs[I];Xt&&B.gl.deleteProgram(Xt.p),delete B.progs[I]}}}let K=B.fin;B.resize(R,S,P),K!==B.fin&&(B.transTex=null);let Z=i.speed*n.timeScale*(1+s*1.2+n.hyper*2);n.freeze||(n.time+=t*Z*(1+f.vol*.45*Math.min(l,2.5))),n.hue+=t*(i.hueSpin||0),n.kAngle+=t*(i.kaleidoSpin||0)*.5,n.burstT+=t,n.flash*=Math.exp(-t*6),n.transMix=Math.max(0,n.transMix-t/Math.max(.2,d.transition)),n.roll=D(n.roll,n.flowX*.25,t*2);let b=ha(je(c.palette));for(let I=0;I<12;I++)n.pal[I]=D(n.pal[I],b[I],1-Math.exp(-t*2.5));if(B.uploadAudio(f.tex),(c.engine==="milk"||i.fusion>0)&&_){Ea(Math.max(B.sw,Math.min(R,1280)),Math.max(B.sh,Math.round(Math.min(R,1280)*S/R)));try{_.render(),B.uploadMilk(te)}catch(I){console.warn(I)}}let w=c.engine==="scene"?zt():[0,0,0,0,0,0,0,0];for(;w.length<8;)w.push(0);Na(t,w);let L=f.beat*d.beatPulse*i.punch*.05*Math.min(l,2.5),z=f.beat*d.cameraShake*i.shake*Math.min(l,2)*.5,M=n.pal,F=d.touchMode==="both"||d.touchMode==="vortex",q=d.touchMode==="both"||d.touchMode==="paint",V=n.touch[0],ye=i.trail>.15?f.bass*.05*Math.min(l,2):0;B.frame({adaptRate:1-Math.exp(-t*2.5),engine:c.engine==="milk"&&_?"milk":"scene",scene:c.engine==="milk"?"nebula":c.scene,sceneU:{uTime:n.time,uBass:f.bass,uMid:f.mid,uHigh:f.high,uVol:f.vol,uBeat:f.beat,uDrive:s,uBurst:n.burstT,uHue:n.hue,uBeatCount:f.beatCount,uSinceBeat:n.sinceBeat,uBeatInt:n.beatInt,uFlowA:n.flux.fa,uFlowB:n.flux.fb,uFlowMix:n.flux.fm,uWaveA:n.flux.wa,uWaveB:n.flux.wb,uWaveMix:n.flux.wm,uMapT:n.flux.mapT,uAudio:B.audioTex,uP0:w.slice(0,4),uP1:w.slice(4,8),uPalA:M.slice(0,3),uPalB:M.slice(3,6),uPalC:M.slice(6,9),uPalD:M.slice(9,12),uCam:[n.camX+v,n.camY+x,n.roll+n.jolt*.06*d.cameraShake]},fbU:{uTime:n.time,uTrail:Math.min(.96,Math.max(i.trail+ye,o*.9,n.hyper*.86)),uZoom:i.zoom+o*.035+n.hyper*.04+f.beat*d.beatPulse*.008*l,uSpin:i.spin+o*n.flowX*.03+n.jolt*.004*d.cameraShake,uWarp:i.warp+o*.8+f.mid*.3*Math.min(l,2),uHueDrift:i.hueDrift+o*.012+n.hyper*.05+f.high*.006*l,uKaleido:i.kaleido,uKaleidoSpin:n.kAngle,uMirror:i.mirror,uFusion:c.engine==="milk"?0:_?i.fusion:0,uBreathe:i.breathe+s*.6+f.bass*.35*Math.min(l,2),uMelt:i.melt+o*.5+f.high*.25*Math.min(l,2),uBass:f.bass,uBeat:f.beat,uBurstT:n.burstT,uBurstC:[n.burstCX,n.burstCY],uFlow:[n.flowX*o,n.flowY*o],uLensRot:n.lensRot+n.jolt*.025*d.cameraShake,uLensZoom:n.lensZoom,uLensPan:[0,0],uSwirl:n.swirl,uBulge:n.bulge,uPunch:L,uShake:z,uBeatRipT:d.beatRipples?n.beatRipT:9,uBeatRipAmt:n.beatRipAmt,uEdgeBlack:c.engine==="scene"&&N[c.scene]&&N[c.scene].space?1:0,uTouch:ra(n.touch[0],F),uTouch2:ra(n.touch[1],F),uTouchVel:[X(V.vx*.02,-.08,.08),X(V.vy*.02,-.08,.08)],uTouchColor:ya(n.time*.05),uTouchPaint:q?1.2:0},finU:{uTime:a/1e3,uChroma:i.chroma+s*2+n.hyper*2+f.beat*1.2*Math.min(l,2),uBloomAmt:i.bloom*(1-n.hyper*.5)+s*.45,uAutoExp:d.autoExposure?1:0,uGrain:i.grain,uVignette:i.vignette,uBurstC:[n.burstCX,n.burstCY],uExposure:i.exposure*(1+s*.12-n.hyper*.15),uSat:i.saturation,uContrast:i.contrast+o*.06,uFlash:n.flash,uTransMix:n.transMix,uBurstT:n.burstT,uBeat:f.beat,uInvert:0}}),d.rumble&&g.connected&&f.isBeat&&performance.now()-n.lastHuman<3e4&&g.rumble(Math.min(1,f.bass*.45)*d.rumbleStrength*(.35+s),.15*d.rumbleStrength,70),n.hyperOn&&d.rumble&&Math.random()<t*10&&g.rumble(.25*d.rumbleStrength,.6*d.rumbleStrength,60),yt+=t,yt>1/30&&(yt=0,Ga(),ve&&ve._n!==c.name&&(ve._n=c.name,ve.setName(c.name))),Ze+=t,bt++,Ze>.5&&(d.showFps?h("#fps").textContent=`${Math.round(bt/Ze)} fps \xB7 out ${R}\xD7${S} \xB7 render ${B.sw}\xD7${B.sh} (${Math.round(P*100)}%)`:h("#fps").textContent="",Ze=0,bt=0)}var he=document.documentElement.style,ke=document.getElementById("spec"),pe=ke?ke.getContext("2d"):null;function Ga(){let a=e=>ya(e).map(t=>Math.round(t*255)).join(",");if(he.setProperty("--c1",a(0)),he.setProperty("--c2",a(.33)),he.setProperty("--c3",a(.66)),he.setProperty("--bass",Math.min(1.5,f.bass).toFixed(3)),he.setProperty("--beat",f.beat.toFixed(3)),pe&&He.classList.contains("show")){let e=ke.width=ke.clientWidth*2,t=ke.height=ke.clientHeight*2;pe.clearRect(0,0,e,t);let i=48,s=e/i,o=pe.createLinearGradient(0,0,e,0);o.addColorStop(0,`rgb(${a(0)})`),o.addColorStop(.5,`rgb(${a(.33)})`),o.addColorStop(1,`rgb(${a(.66)})`),pe.fillStyle=o;for(let r=0;r<i;r++){let l=f.tex[Math.floor(r/i*400)]/255,u=Math.max(2,l*l*t);pe.globalAlpha=.35+l*.6,pe.fillRect(r*s+1,t-u,s-2,u)}pe.globalAlpha=1}}var Qe=h("#hud");function k(a,e){let t=document.createElement("div");for(t.className="toast",t.innerHTML=`<span class="g">${a}</span><span>${fe(e)}</span>`,Qe.appendChild(t);Qe.children.length>3;)Qe.firstChild.remove();setTimeout(()=>{t.style.opacity=0,setTimeout(()=>t.remove(),450)},1700)}var la={};function Ct(a,e,t){let i=la[a];(!i||!i.isConnected)&&(i=document.createElement("div"),i.className="toast",i.innerHTML=`<span class="g">${g.label(a)}</span><span>${e}</span><span class="bar"><i></i></span>`,Qe.appendChild(i),la[a]=i),i.querySelector("i").style.width=Math.round(t*100)+"%",i.style.opacity=1,clearTimeout(i._t),i._t=setTimeout(()=>{i.style.opacity=0,setTimeout(()=>i.remove(),450)},900)}var fe=a=>String(a).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),He=h("#ui"),at=0;function It(a){n.cinema&&!a||(He.classList.add("show"),document.body.classList.remove("idle"),clearTimeout(at),d.uiAutoHide&&(at=setTimeout(()=>{(!He.matches(":hover")||a==="fromPad")&&rt()},3500)))}function rt(){h("#splash").classList.contains("gone")&&!document.activeElement?.matches("input,select")&&(He.classList.remove("show"),document.body.classList.add("idle"))}function wa(){n.panels=!n.panels,document.body.classList.toggle("panels-off",!n.panels)}window.addEventListener("mousemove",()=>It());He.addEventListener("mouseleave",()=>{clearTimeout(at),d.uiAutoHide&&(at=setTimeout(rt,1500))});function De(){h("#splash").classList.add("gone"),document.body.classList.add("started"),ve&&!d.seenTouchHint&&(d.seenTouchHint=!0,le(),setTimeout(()=>k("\u{1F44D}","Put your thumbs down \u2014 left steers, right morphs"),900))}var $a={addFiles:()=>h("#fileIn").click(),addFolder:()=>h("#folderIn").click(),loopback:async()=>{try{Pe(),await f.useLoopback(),De(),k("\u{1F50A}","Listening to your PC audio")}catch(a){k("\u26A0",a.message||"Capture cancelled")}},mic:async()=>{try{Pe(),await f.useMic(),De(),k("\u{1F399}","Listening to microphone")}catch{k("\u26A0","Microphone unavailable")}},demo:()=>{qt(),De()},srcPlayer:()=>{Pe(),f.useSource("player"),f.playlist.length&&f.toggle()},prevPreset:()=>ue(-1),nextPreset:()=>ue(1),mutate:Et,generate:Ft,save:st,overwrite:Fa,revert:()=>{$(qe,{quiet:!0}),k("\u21BA","Reverted")},deletePreset:Da,autopilot:()=>Dt(!d.autopilot),controls:()=>xe(!0),fullscreen:Ut,playPause:()=>{Pe(),f.toggle()},prevTrack:()=>f.prev(),nextTrack:()=>f.next(),shuffle:()=>{f.shuffle=!f.shuffle,it()},repeat:()=>{f.repeat={all:"one",one:"off",off:"all"}[f.repeat],it()},clearList:()=>{f.clear(),_t()},exportPresets:()=>{let a=new Blob([JSON.stringify(H,null,2)],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(a),e.download="eye-candy-presets.json",e.click()},importPresets:()=>h("#importIn").click(),sheetVisuals:()=>Tt("visuals"),sheetMusic:()=>Tt("music"),closeSheet:()=>Tt(null),touchpad:async()=>{let a=await U.request();k("\u25C9",a?"Touchpad on \u2014 swipe to stir the visuals":"No PlayStation controller found"),h("#tpChip").classList.toggle("hidden",a)}};document.addEventListener("click",a=>{let e=a.target.closest("[data-act]");if(!e)return;f.resume();let t=$a[e.dataset.act];t&&t()});function qt(){Be||(f.el.pause(),f.stopStream(),f.mode="demo",Be=na(f),f.resume(),ka(),k("\u2726","Demo groove"))}function Pe(){Be&&(Be(),Be=null,f.mode==="demo"&&(f.mode="player"))}async function Tt(a){let e=document.body,t=e.classList.contains("sheet-visuals")?"visuals":e.classList.contains("sheet-music")?"music":null;e.classList.remove("sheet-visuals","sheet-music"),a&&a!==t&&e.classList.add("sheet-"+a),a==="visuals"&&Y()}async function Ut(){if(O&&O.setFullscreen){O.setFullscreen(!await O.isFullscreen());return}document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{})}function xe(a){Gt(),h("#controls").classList.toggle("hidden",!a)}var Xa=/\.(mp3|flac|wav|ogg|oga|m4a|aac|opus|webm|wma|aiff?)$/i,Va=a=>({name:a.name.replace(/\.[^.]+$/,""),url:URL.createObjectURL(a),path:O?O.pathFor(a):null});function Ht(a){let e=[...a].filter(t=>Xa.test(t.name)||(t.type||"").startsWith("audio/")).sort((t,i)=>(t.webkitRelativePath||t.name).localeCompare(i.webkitRelativePath||i.name,void 0,{numeric:!0}));if(!e.length)return k("\u26A0","No audio files found");Pe(),f.addTracks(e.map(Va)),De(),_t(),k("\u266B",`Added ${e.length} track${e.length>1?"s":""}`)}h("#fileIn").onchange=a=>{Ht(a.target.files),a.target.value=""};h("#folderIn").onchange=a=>{Ht(a.target.files),a.target.value=""};h("#importIn").onchange=async a=>{try{let e=JSON.parse(await a.target.files[0].text()),t=(Array.isArray(e)?e:[e]).filter(i=>i&&i.engine);t.forEach(i=>{i.id="user-"+Math.random().toString(36).slice(2),i.builtin=!1}),H.push(...t),Le(H),Y(),k("\u2605",`Imported ${t.length} presets`)}catch{k("\u26A0","Could not read that file")}a.target.value=""};window.addEventListener("dragover",a=>a.preventDefault());window.addEventListener("drop",async a=>{a.preventDefault(),f.resume();let e=[...a.dataTransfer.items||[]],t=[],i=r=>new Promise(l=>{if(r.isFile)r.file(u=>{t.push(u),l()},l);else if(r.isDirectory){let u=r.createReader(),m=[],v=()=>u.readEntries(async x=>{if(x.length)m.push(...x),v();else{for(let T of m)await i(T);l()}},l);v()}else l()}),s=e.map(r=>r.webkitGetAsEntry&&r.webkitGetAsEntry()).filter(Boolean);if(s.length)for(let r of s)await i(r);else t.push(...a.dataTransfer.files);let o=t.find(r=>/\.json$/i.test(r.name));if(o&&t.length===1){h("#importIn").onchange({target:{files:[o],value:""}});return}Ht(t)});function ja(a){return"app://eye/media/"+encodeURIComponent(a)}function _t(){O&&localStorage.setItem("eyecandy.playlist",JSON.stringify(f.playlist.filter(a=>a.path).map(a=>({name:a.name,path:a.path}))))}function Wa(){if(O)try{let a=JSON.parse(localStorage.getItem("eyecandy.playlist")||"[]");f.playlist.push(...a.map(e=>({...e,url:ja(e.path)})))}catch{}}var ca=a=>isFinite(a)?`${Math.floor(a/60)}:${String(Math.floor(a%60)).padStart(2,"0")}`:"0:00";function it(){let a=h("#playlist");f.playlist.length?a.innerHTML=f.playlist.map((e,t)=>`<li data-i="${t}" class="${t===f.index&&f.mode==="player"?"cur":""}"><span class="n">${t+1}</span><span class="t">${fe(e.name)}</span><button class="x" data-x="${t}">\u2715</button></li>`).join(""):a.innerHTML='<li class="empty">Drop songs or folders here<br><small>mp3 \xB7 flac \xB7 wav \xB7 ogg \xB7 m4a</small></li>',h("#shuffleBtn").classList.toggle("on",f.shuffle),h("#repeatBtn").textContent={all:"\u21BB Repeat all",one:"\u21BB Repeat one",off:"\u2192 No repeat"}[f.repeat],h("#repeatBtn").classList.toggle("on",f.repeat!=="off"),ka()}h("#playlist").addEventListener("click",a=>{let e=a.target.closest("[data-x]");if(e){f.remove(+e.dataset.x),_t();return}let t=a.target.closest("li[data-i]");t&&(Pe(),f.play(+t.dataset.i))});function ka(){let a=f.current,e=f.mode;h("#npTitle").textContent=e==="loopback"?"PC audio":e==="mic"?"Microphone":e==="demo"?"Demo groove":a?a.name:"Nothing playing",h("#npSub").textContent=e==="player"?a?`Track ${f.index+1} of ${f.playlist.length}`:"Drop music anywhere":"Live input",h("#playBtn").textContent=h("#playBtn2").textContent=e==="player"&&!f.el.paused?"\u275A\u275A":"\u25B6";for(let[t,i]of[["#srcPlayer","player"],["#srcLoop","loopback"],["#srcMic","mic"],["#srcDemo","demo"]])h(t).classList.toggle("on",e===i)}f.onchange=it;var nt=h("#seek"),Nt=!1;nt.addEventListener("input",()=>{Nt=!0});nt.addEventListener("change",()=>{isFinite(f.el.duration)&&(f.el.currentTime=nt.value/1e3*f.el.duration),Nt=!1});h("#vol").value=Math.round(d.volume*100);h("#vol").addEventListener("input",a=>{d.volume=a.target.value/100,f.out.gain.value=d.volume,le()});setInterval(()=>{let a=f.el;!Nt&&isFinite(a.duration)&&(nt.value=a.currentTime/a.duration*1e3),h("#tCur").textContent=ca(a.currentTime),h("#tDur").textContent=ca(a.duration)},250);var wt=new Map;function Ya(a){if(a.engine==="milk"){let o=0;for(let r of a.name)o=(o*31+r.charCodeAt(0))%360;return`linear-gradient(90deg,hsl(${o},90%,55%),hsl(${(o+80)%360},90%,50%),hsl(${(o+160)%360},90%,55%))`}let e=JSON.stringify(a.palette);if(wt.has(e))return wt.get(e);let t=je(a.palette),i=[];for(let o=0;o<=4;o++){let r=o/4,l=[0,1,2].map(u=>Math.round(255*X(t.a[u]+t.b[u]*Math.cos(6.2831853*(t.c[u]*r+t.d[u])),0,1)));i.push(`rgb(${l})`)}let s=`linear-gradient(90deg,${i.join(",")})`;return wt.set(e,s),s}function Y(){let a=h("#search").value.trim().toLowerCase(),e=Lt(se),t=h("#presetList");if(h("#milkCat").classList.toggle("hidden",se!=="milk"),se==="milk"&&!_){t.innerHTML='<li class="msg">Loading MilkDrop library\u2026</li>',ce().then(()=>{Ka(),Y()});return}if(se==="user"&&!e.length){t.innerHTML=`<li class="msg">No saved presets yet.<br>Press \u2605 Save (or ${g.label("Y")} on the controller) to keep the current look.</li>`;return}let i=[];for(let o=0;o<e.length;o++){let r=e[o];if(a&&!r.name.toLowerCase().includes(a))continue;let l=r.engine==="milk"?"MilkDrop":N[r.scene]?.name||"";if(i.push(`<li data-i="${o}" class="${r.id===c.id?"cur":""}"><span class="sw" style="background:${Ya(r)}"></span><span class="nm">${fe(r.name)}</span><span class="s">${fe(l)}</span></li>`),i.length>3e3)break}t.innerHTML=i.join("");let s=t.querySelector(".cur");s&&!t.matches(":hover")&&s.scrollIntoView({block:"nearest"})}h("#presetList").addEventListener("click",a=>{let e=a.target.closest("li[data-i]");e&&(W=+e.dataset.i,$(Lt(se)[W]))});h("#search").addEventListener("input",Y);function Ka(){let a=h("#milkCat"),e=Object.keys(Ae).sort(),t=_e("all").length;a.innerHTML=`<option value="all">All MilkDrop (${t})</option><option value="classic">Classic Butterchurn (${et.length})</option>`+e.map(i=>`<option value="${i}">${i} (${Ae[i].length})</option>`).join(""),a.value=Ce}h("#milkCat").addEventListener("change",a=>{Ce=a.target.value,W=-1,Y()});Me(".cbtn").forEach(a=>a.onclick=()=>{Me(".cbtn").forEach(e=>e.classList.toggle("on",e===a)),se=a.dataset.coll,W=-1,Y()});Me(".tab").forEach(a=>a.onclick=()=>{Me(".tab").forEach(e=>e.classList.toggle("on",e===a)),Me(".tabpage").forEach(e=>e.classList.toggle("on",e.id==="tab-"+a.dataset.tab)),a.dataset.tab==="tweak"&&ae()});var ua=[["trail","Tracers",0,.97],["zoom","Tunnel Zoom",.96,1.06],["spin","Spin",-.03,.03],["warp","Warp",0,2],["breathe","Breathing",0,2],["melt","Melt",0,2],["hueDrift","Color Drift",-.05,.05],["hueSpin","Hue Cycle",-.3,.3],["kaleido","Kaleidoscope",0,16,1],["kaleidoSpin","Kaleido Spin",-1,1],["mirror","Mirror",0,1,1],["fusion","MilkDrop Fusion",0,1],["react","Audio Reactivity",0,2.5],["speed","Speed",0,3],["chroma","Chromatic",0,3],["bloom","Bloom",0,2],["exposure","Exposure",.4,2],["saturation","Saturation",0,2],["contrast","Contrast",.6,1.6],["grain","Film Grain",0,1],["vignette","Vignette",0,1.5],["#","Music motion"],["dance","Shape Dance",0,2.5],["ripple","Beat Ripples",0,2.5],["punch","Bass Punch",0,2.5],["shake","Beat Shake",0,2.5],["swirlA","Audio Swirl",0,2.5],["bulgeA","Bass Bulge",0,2.5]];h("#sceneSel").innerHTML=J.map(a=>`<option value="${a.id}">${a.name}</option>`).join("")+'<option value="__milk">MilkDrop engine</option>';h("#palSel").innerHTML=j.map((a,e)=>`<option value="${e}">${a.name}</option>`).join("")+'<option value="custom">Custom (generated)</option>';function fa(a,e,t,i,s,o,r){let l=document.createElement("div");l.className="sl "+(o||"");let u=s||(t-e)/400;l.innerHTML=`<span title="${fe(a)}">${fe(a)}</span><input type="range" min="${e}" max="${t}" step="${u}" value="${i}"><span class="v"></span>`;let m=l.querySelector("input"),v=l.querySelector(".v"),x=()=>v.textContent=(+m.value).toFixed(s===1?0:2);return x(),m.addEventListener("input",()=>{x(),r(+m.value),be()}),l._set=T=>{document.activeElement!==m&&(m.value=T,x())},l}var kt={},Pt=[];function ae(){if(!h("#tab-tweak").classList.contains("on"))return;if(h("#pName").value=c.name,h("#sceneSel").value=c.engine==="milk"?"__milk":c.scene,h("#palSel").value=typeof c.palette=="number"?String(c.palette):"custom",h("#milkRow").classList.toggle("hidden",!(c.engine==="milk"||c.fx.fusion>0)),_){let o=_e("all");h("#milkSel").options.length!==o.length&&(h("#milkSel").innerHTML=o.map(r=>`<option>${fe(r)}</option>`).join(""))}_&&(h("#milkSel").value=c.engine==="milk"?c.milk:ge||"");let a=h("#paramSliders"),e=N[c.scene],t=c.engine+":"+c.scene;a._key!==t?(a._key=t,a.innerHTML="",Pt=[],c.engine==="scene"&&e?(e.params.forEach((o,r)=>{let l=fa(o.n,o.min,o.max,c.params[r],0,(e.stick||[]).includes(r)?"stick":"",u=>{c.params[r]=u});Pt.push(l),a.appendChild(l)}),h("#stickNames").textContent=(e.stick||[0,1]).map(o=>e.params[o].n).join(" & ")):(a.innerHTML='<p class="fine">MilkDrop presets carry their own math \u2014 shape them with the Trip FX below, the triggers, and the kaleidoscope.</p>',h("#stickNames").textContent="\u2014")):Pt.forEach((o,r)=>o._set(c.params[r]));let i=h("#fxSliders");i.children.length?ua.forEach(([o])=>{kt[o]&&kt[o]._set(c.fx[o]??ne[o]??0)}):ua.forEach(([o,r,l,u,m])=>{if(o==="#"){let x=document.createElement("h3");x.textContent=r,i.appendChild(x);return}let v=fa(r,l,u,c.fx[o]??0,m,"",x=>{c.fx[o]=x,o==="fusion"&&x>0&&ce().then(()=>{ge||Fe(ot()),h("#milkRow").classList.remove("hidden"),ae()})});kt[o]=v,i.appendChild(v)});let s=H.some(o=>o.id===c.id);h("#overwriteBtn").classList.toggle("hidden",!s),h("#deleteBtn").classList.toggle("hidden",!s)}h("#pName").addEventListener("change",a=>{c.name=a.target.value,h("#presetName").textContent=c.name});h("#sceneSel").addEventListener("change",a=>{let e=a.target.value;if(e==="__milk"){ce().then(()=>$(At(ge||ot())));return}let t=N[e];$({...c,id:"edit-"+Date.now(),engine:"scene",scene:e,params:t.params.map(i=>i.def),name:t.name+" (custom)",builtin:!1},{quiet:!0})});h("#palSel").addEventListener("change",a=>{a.target.value!=="custom"&&(c.palette=+a.target.value)});h("#milkSel").addEventListener("change",a=>{let e=a.target.value;c.engine==="milk"?(c.milk=e,c.name=e,h("#presetName").textContent=e):c.milk=e,Fe(e)});var Za=[["#","Display"],["resolution","Output resolution","select",{native:"Native (match screen)",2160:"4K \xB7 2160p",1440:"1440p",1080:"1080p",900:"900p",720:"720p",540:"540p (potato mode)"}],["renderScale","Render scale","select",{auto:"Auto (adaptive)","0.5":"50%","0.67":"67%","0.75":"75%","0.85":"85%",1:"100%","1.25":"125% \xB7 supersampled","1.5":"150% \xB7 supersampled",2:"200% \xB7 supersampled"}],["aa","Anti-aliasing","select",{auto:"Auto (off when GPU is busy)",off:"Off","2x":"2\xD7 supersampling","4x":"4\xD7 supersampling"}],["fpsCap","Frame rate cap","select",{0:"Unlimited (VSync)",144:"144 fps",120:"120 fps",60:"60 fps",30:"30 fps"}],["autoExposure","Auto exposure","toggle","Keeps every preset from blowing out to white (or sinking to black)"],["startFullscreen","Start in fullscreen","toggle","Open straight into fullscreen next launch"],["uiScale","Interface size","range",[.75,1.5,.05,"\xD7"]],["uiAutoHide","Auto-hide interface","toggle","Panels fade away when you are not using the mouse"],["showFps","Show FPS & resolution","toggle",""],["#","Music reaction"],["reactIntensity","Reaction intensity","range",[0,3,.05,"\xD7"]],["idleDance","Music dance","toggle","Shapes, lens and camera always move with the music \u2014 your controller adds on top"],["beatRipples","Beat ripples","toggle","Every kick sends a shockwave through the image"],["beatPulse","Bass punch","range",[0,2,.05,"\xD7"]],["beatFlash","Drop flashes","range",[0,1,.05,""]],["cameraShake","Beat shake","range",[0,1.5,.05,""]],["beatSens","Beat sensitivity","range",[0,2,.05,""]],["gainBass","Bass gain","range",[0,3,.05,"\xD7"]],["gainMid","Mid gain","range",[0,3,.05,"\xD7"]],["gainHigh","Treble gain","range",[0,3,.05,"\xD7"]],["outputDevice","Audio output","select",{default:"System default"}],["#","Autopilot"],["autopilot","Autopilot","toggle","Keeps changing presets on its own, even while you play"],["autoPause","Pause autopilot while I play","toggle","Hold the current preset while you are using the controller"],["autoInterval","Time per preset","range",[8,120,1,"s"]],["autoSource","Autopilot plays","select",{mix:"Everything mixed",eye:"Eye Candy presets",flux:"Flux engine",generate:"Fresh generated presets",milk:"MilkDrop library",user:"My presets",all:"Eye Candy + MilkDrop"}],["autoOnDrop","Switch on drops","toggle","Jump to a new preset when the beat drops"],["idle","Resume after I stop playing","range",[3,120,1,"s"]],["transition","Transition length","range",[.2,4,.1,"s"]],["#","Controller"],["stickSens","Stick sensitivity","range",[.3,2.5,.05,"\xD7"]],["invertY","Invert Y axis","toggle",""],["deadzone","Stick deadzone","range",[0,.4,.01,""]],["rumble","Rumble","toggle","Feel the bass in your hands"],["rumbleStrength","Rumble strength","range",[0,1,.05,""]],["touchMode","PS touchpad / right-drag","select",{both:"Vortex + paint light",vortex:"Vortex only",paint:"Paint light only",off:"Off"}],["@touchpad"]],we={deadzone:a=>g.deadzone=a,uiScale:a=>he.setProperty("--ui",a),outputDevice:a=>f.setOutput(a).then(e=>k("\u{1F508}",e?"Audio output changed":"Could not switch output")),renderScale:()=>{ee=.8},autopilot:a=>h("#autoBtn").classList.toggle("on",a)};async function Ja(a){try{(await navigator.mediaDevices.enumerateDevices()).filter(t=>t.kind==="audiooutput"&&t.deviceId!=="default").forEach(t=>{let i=document.createElement("option");i.value=t.deviceId,i.textContent=t.label||"Output "+t.deviceId.slice(0,5),a.appendChild(i)}),a.value=d.outputDevice}catch{}}function Ot(){let a=h("#settingsForm");a.innerHTML="";for(let[e,t,i,s]of Za){if(e==="#"){let r=document.createElement("h3");r.className="sethead",r.textContent=t,a.appendChild(r);continue}let o=document.createElement("div");if(o.className="set",e==="@touchpad"){o.innerHTML=`<div>PS touchpad<div class="d" id="tpStatus">${fe(U.status)}</div></div><button class="mini" id="tpBtn">${U.connected?"Reconnect":"Connect"}</button>`,o.querySelector("#tpBtn").onclick=async()=>{let r=await U.request();k("\u25C9",r?"Touchpad connected \u2014 swipe to stir the visuals":"No PlayStation controller found")},a.appendChild(o);continue}if(i==="toggle")o.innerHTML=`<div>${t}<div class="d">${s}</div></div><div class="toggle ${d[e]?"on":""}"></div>`,o.querySelector(".toggle").onclick=r=>{d[e]=!d[e],r.target.classList.toggle("on",d[e]),le(),we[e]&&we[e](d[e])};else if(i==="select"){o.innerHTML=`<div>${t}</div><select>${Object.entries(s).map(([l,u])=>`<option value="${l}" ${String(d[e])===l?"selected":""}>${u}</option>`).join("")}</select>`;let r=o.querySelector("select");e==="outputDevice"&&Ja(r),r.onchange=l=>{d[e]=l.target.value,le(),we[e]&&we[e](d[e])}}else{let[r,l,u,m]=s;o.innerHTML=`<div>${t} <span class="d">${d[e]}${m}</span></div><input type="range" min="${r}" max="${l}" step="${u}" value="${d[e]}">`,o.querySelector("input").oninput=v=>{d[e]=+v.target.value,o.querySelector(".d").textContent=d[e]+m,le(),we[e]&&we[e](d[e])}}a.appendChild(o)}}U.onstatus=a=>{let e=document.getElementById("tpStatus");e&&(e.textContent=a),U.connected&&k("\u25C9",a)};function Gt(){let a=t=>`<span class="k">${g.label(t)}</span>`,e=[["Left stick","Steer","Fly the camera / drag the trails"],["Right stick","Morph","Bend the two \u25C9 shape params live"],[a("LT"),"Warp","Squeeze into infinite feedback tunnels"],[a("RT"),"Drive","Overdrive audio reaction, bloom & speed"],[a("LT")+"+"+a("RT"),"Hyperdrive","Both triggers fully \u2014 hold on"],[a("LB"),"Kaleidoscope","Tap to cycle \xB7 hold for mirror world"],[a("RB"),"Palette","Tap next colors \xB7 hold to spin hues"],["\u25C0 \u25B6","Presets","Previous / next look"],["\u25B2 \u25BC","Time","Speed up, slow down, even reverse"],[a("A"),"Burst","Shockwave + flash. Hit it on the beat"],[a("B"),"Freeze","Hold to stop time while trails melt on"],[a("X"),"Randomize","Tap remix \xB7 hold for a brand-new preset"],[a("Y"),"Save","Keep this exact look in My Presets"],[a("L3"),"Reset view","Click left stick"],[a("R3"),"Lock shape","Click right stick to keep the morph"],[a("START"),"Menu","Show / hide the panels"],[a("BACK"),"This guide","Hold to toggle autopilot"],["Touchpad","Stir (PS)","Swipe to swirl & paint \xB7 pinch/twist \xB7 click = Music dance on/off"]];h("#cgrid").innerHTML=e.map(([t,i,s])=>`<div class="cg"><span class="k">${t.startsWith("<")?t.replace(/<\/?span[^>]*>/g,""):t}</span><div><b>${i}</b><small>${s}</small></div></div>`).join(""),Me("[data-g]").forEach(t=>t.textContent=g.label(t.dataset.g))}h("#controls").addEventListener("click",a=>{a.target.id==="controls"&&xe(!1)});window.addEventListener("keydown",a=>{if(a.target.matches("input,select,textarea"))return;be(),f.resume();let e=a.key;e==="ArrowRight"?ue(1):e==="ArrowLeft"?ue(-1):e==="ArrowUp"?tt(1):e==="ArrowDown"?tt(-1):e===" "?(a.preventDefault(),Ue(1)):e==="r"||e==="R"?Et():e==="g"||e==="G"?Ft():e==="s"||e==="S"?st():e==="k"||e==="K"?ga():e==="m"||e==="M"?ba():e==="p"||e==="P"?xa(1):e==="f"||e==="F"||e==="F11"?(a.preventDefault(),Ut()):e==="h"||e==="H"?(n.cinema=!n.cinema,n.cinema?rt():It(),k("H",n.cinema?"Interface hidden (H to show)":"Interface on")):e==="Tab"?(a.preventDefault(),wa()):e==="a"||e==="A"?Dt(!d.autopilot):e==="c"||e==="C"?xe(h("#controls").classList.contains("hidden")):e==="Escape"?xe(!1):e==="MediaPlayPause"?f.toggle():e==="MediaTrackNext"?f.next():e==="MediaTrackPrevious"&&f.prev()});var Se=null;oe.addEventListener("contextmenu",a=>a.preventDefault());oe.addEventListener("pointerdown",a=>{if(a.button===2){re.active=!0,re.x=a.clientX/innerWidth,re.y=a.clientY/innerHeight;return}if(a.button===1){Ue(1,(a.clientX/innerWidth-.5)*innerWidth/innerHeight,.5-a.clientY/innerHeight);return}Se={x:a.clientX,y:a.clientY},be()});window.addEventListener("pointerup",a=>{a.button===2&&(re.active=!1)});window.addEventListener("pointermove",a=>{re.active&&(re.x=a.clientX/innerWidth,re.y=a.clientY/innerHeight)});window.addEventListener("pointerup",()=>Se=null);window.addEventListener("pointermove",a=>{Se&&(n.camX+=(a.clientX-Se.x)*.004,n.camY=X(n.camY+(a.clientY-Se.y)*.003,-1.3,1.3),Se={x:a.clientX,y:a.clientY},be())});oe.addEventListener("wheel",a=>{c.fx.trail=X(c.fx.trail-a.deltaY*8e-4,0,.97),Ct("LT","Tracers",c.fx.trail/.97),be(),ae()},{passive:!0});oe.addEventListener("dblclick",Ut);he.setProperty("--ui",d.uiScale);Te&&(n.panels=!1,d.uiAutoHide=!1);O&&d.startFullscreen&&O.setFullscreen&&O.setFullscreen(!0);d.outputDevice!=="default"&&f.setOutput(d.outputDevice);U.autoConnect();O||document.querySelectorAll("[data-act=loopback]").forEach(a=>{a.innerHTML=a.classList.contains("src")?"Tab/PC":"\u{1F50A} Visualize a tab or PC audio",a.title="Pick a tab (e.g. YouTube/Spotify web) or your whole screen and tick \u201CShare audio\u201D"});Wa();it();Ot();Y();Gt();h("#autoBtn").classList.toggle("on",d.autopilot);h("#presetName").textContent=c.name;se="eye";W=Math.floor(Math.random()*Ie.length);$(Ie[W],{transition:!1,quiet:!0});var St=J.map(a=>a.id),Mt=0;(function a(){if(Mt>=St.length){h("#loadbar").style.opacity=0;return}B.sceneProg(St[Mt++]),h("#loadbar div").style.width=Mt/St.length*100+"%",setTimeout(a,0)})();requestAnimationFrame(Ta);window.__eye={get milkCanvas(){return te},getMilkPreset:pa,ensureMilk:ce,get milk(){return _},milkNamesFor:_e,startDemoGroove:qt,R:B,audio:f,L:n,get cur(){return c},loadPreset:$,BUILTIN:de,SCENES:J,settings:d};})();
