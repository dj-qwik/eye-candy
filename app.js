(()=>{var St=`#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime, uBass, uMid, uHigh, uVol, uBeat, uDrive, uBurst, uHue, uBeatCount;
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
`,Ke=[],B=t=>Ke.push(t);B({id:"cathedral",name:"Fractal Cathedral",params:[{n:"Fold",min:.2,max:1.6,def:.85},{n:"Twist",min:0,max:1.5,def:.45},{n:"Scale",min:1.25,max:1.75,def:1.48},{n:"Glow",min:0,max:3,def:1.2},{n:"Flight",min:0,max:3,def:1},{n:"Tunnel",min:.2,max:1.4,def:.6},{n:"Pulse",min:0,max:2,def:1},{n:"Color Spread",min:0,max:2,def:.6}],stick:[0,1],code:`
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
  float ao=1.-st/96.;
  vec3 base=pal(trap*P7+p.z*.03);
  col=base*ao*ao*ao*1.2;
  col+=pal(trap*P7+.35+uTime*.03)*g*P3*(1.+uBeat*1.5);
  col=mix(col, pal(.6+uHue)*.05, smoothstep(5.,28.,t));
  c=vec4(col,1);
}`});B({id:"nebula",name:"Nebula Tunnel",params:[{n:"Speed",min:0,max:4,def:1.2},{n:"Depth",min:.1,max:1.5,def:.55},{n:"Turbulence",min:.5,max:5,def:2.2},{n:"Ring Pulse",min:0,max:3,def:1.2},{n:"Stars",min:0,max:2,def:1},{n:"Spin",min:-1,max:1,def:.15},{n:"Brightness",min:.3,max:3,def:1.3},{n:"Petals",min:0,max:8,def:0}],stick:[2,1],code:`
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
  col+=pal(.8)*.15/(r*6.+.2)*(uBass*1.5);
  c=vec4(col,1);
}`});B({id:"julia",name:"Julia Bloom",params:[{n:"Seed Angle",min:0,max:6.283,def:2.1},{n:"Zoom",min:.4,max:4,def:1},{n:"Color Rate",min:.1,max:3,def:1},{n:"Audio Morph",min:0,max:2,def:.8},{n:"Trap Glow",min:0,max:3,def:1.2},{n:"Seed Radius",min:.6,max:.82,def:.7885},{n:"Swirl",min:-1,max:1,def:.1},{n:"Symmetry",min:1,max:8,def:1}],stick:[0,5],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  float sym=floor(P7);
  if(sym>1.5){ float a=atan(uv.y,uv.x), r=length(uv); float s=TAU/sym; a=mod(a,s); a=abs(a-s*.5); uv=r*vec2(cos(a),sin(a)); }
  uv*=rot(uTime*.05*P6+uCam.x)*(1.6/P1);
  float th=P0+uTime*.04+uCam.y+uBass*.06*P3;
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
  col+=pal(trap*2.+.3)*exp(-trap*18.)*.5*P4*(1.+uBeat);
  col+=pal(.7)*exp(-trap2*30.)*.4*P4*uHigh;
  c=vec4(col,1);
}`});B({id:"gyroid",name:"Gyroid Hyperspace",params:[{n:"Lattice",min:.8,max:5,def:2.2},{n:"Velocity",min:0,max:5,def:1.8},{n:"Thickness",min:.01,max:.3,def:.06},{n:"Glow",min:0,max:3,def:1.2},{n:"Detail",min:0,max:1,def:.4},{n:"Breath",min:0,max:2,def:1},{n:"Fog",min:.02,max:.3,def:.09},{n:"Hue Flow",min:0,max:2,def:.5}],stick:[0,2],code:`
float gyr(vec3 p, float s){ p*=s; return abs(dot(sin(p),cos(p.zxy)))/s; }
float map(vec3 p){
  float th=P2*(1.+uBass*P5);
  float d=gyr(p,P0)-th;
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
    g+=.01/(.012+ad*ad*60.);
    col+=pal(p.z*.05*P7+t*.03+fft(fract(t*.05))*.3)*.0005/(.01+ad*ad*160.)*exp(-t*.08);
    if(t>30.) break;
    t+=max(ad,.02);
  }
  col*=P3*(1.+uBeat*.8);
  col+=pal(.5)*g*.001*P3;
  col*=exp(-t*P6*.35);
  c=vec4(col,1);
}`});B({id:"chrome",name:"Liquid Chrome",params:[{n:"Blobs",min:2,max:8,def:6},{n:"Merge",min:.1,max:1.2,def:.55},{n:"Ripple",min:0,max:1,def:.35},{n:"Lights",min:2,max:20,def:7},{n:"Orbit",min:.3,max:2,def:1},{n:"Bass Swell",min:0,max:2,def:1},{n:"Iridescence",min:0,max:2,def:1},{n:"Env Bright",min:.3,max:2,def:1}],stick:[1,2],code:`
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
  return pal(b*.5+a*.1)*(.15+stripes*2.5)*P7+pal(.7)*fbm(vec2(a,b)*3.)*.2;
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
}`});B({id:"horizon",name:"Neon Horizon",params:[{n:"Grid Speed",min:0,max:4,def:1.2},{n:"Sun Size",min:.1,max:.6,def:.32},{n:"Mountains",min:0,max:2,def:1},{n:"Grid Density",min:2,max:20,def:8},{n:"Terrain Warp",min:0,max:2,def:.6},{n:"Stars",min:0,max:2,def:1},{n:"Sun Stripes",min:0,max:24,def:10},{n:"Glow",min:.3,max:3,def:1.2}],stick:[4,2],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc); float hz=.0+uCam.y*.3; uv.x+=uCam.x*.3;
  vec3 col=vec3(0);
  if(uv.y>hz){
    float y=uv.y-hz;
    col=mix(pal(.75)*.35,pal(.05)*.03,smoothstep(0.,.45,y));
    vec2 sc=uv-vec2(0,hz+.18);
    float sd=length(sc)-P1*(1.+uBass*.12);
    float stripe=step(.5,fract((sc.y+uTime*.05)*P6))*smoothstep(.12,-.1,sc.y);
    vec3 sun=mix(pal(.95)*1.5,pal(.15)*1.6,smoothstep(-P1,P1,sc.y));
    col=mix(col,sun,smoothstep(.005,-.005,sd)*(1.-stripe*step(sc.y,.1)));
    col+=pal(.9)*.012/(max(sd,0.)+.03)*P7;
    float x=abs(uv.x);
    float mh=(.04+fft(x*.45)*.28*P2)*(1.-smoothstep(.2,1.6,x)*.4)+fbm(vec2(x*6.,1.))*.04;
    if(y<mh){ col=pal(.6)*.08; col+=pal(.85)*glowLine(y-mh,.004)*.6*P7; }
    col+=step(.997-.003*P5,h21(floor(uv*200.)))*smoothstep(.1,.5,y)*P5*(.5+uHigh);
  } else {
    float y=hz-uv.y;
    float z=.3/y;
    vec2 g=vec2(uv.x*z, z+uTime*P0*2.);
    g.x+=sin(g.y*.5)*P4*.6;
    float h=fft(fract(abs(g.x)*.05))*P4;
    vec2 gd=abs(fract(g*P3*.1)-.5)/fwidth(g*P3*.1);
    float line=1.-min(min(gd.x,gd.y),1.);
    float fade=exp(-z*.08);
    col=pal(.85+h*.2)*line*fade*1.6*P7*(1.+uBeat);
    col+=pal(.75)*.25*exp(-y*12.)*P7;
    col+=pal(.1)*h*.3*fade;
  }
  c=vec4(col,1);
}`});B({id:"mandala",name:"Spectral Mandala",params:[{n:"Symmetry",min:3,max:24,def:12},{n:"Rings",min:1,max:10,def:6},{n:"Petal Size",min:0,max:1,def:.5},{n:"Line Width",min:.5,max:4,def:1.5},{n:"Spin",min:-1,max:1,def:.12},{n:"Wave Ring",min:0,max:2,def:1},{n:"Lace",min:0,max:2,def:1},{n:"Zoom",min:.5,max:2.5,def:1}],stick:[0,2],code:`
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
}`});B({id:"silk",name:"Silk Warp",params:[{n:"Scale",min:.5,max:6,def:2.2},{n:"Warp",min:0,max:3,def:1.2},{n:"Color Rate",min:.2,max:3,def:1.1},{n:"Flow",min:0,max:2,def:.6},{n:"Sheen",min:0,max:3,def:1.2},{n:"Bass Warp",min:0,max:2,def:1},{n:"Contrast",min:.5,max:3,def:1.4},{n:"Marble",min:0,max:1,def:0}],stick:[1,0],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)+uCam.xy*.4; float t=uTime*P3*.3;
  vec2 p=uv*P0;
  vec2 q=vec2(fbm(p+vec2(0.,t)), fbm(p+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p+4.*q+vec2(1.7,9.2)+t*.7+uBass*.5*P5), fbm(p+4.*q+vec2(8.3,2.8)-t*.4));
  float f=fbm(p+P1*4.*r);
  f=mix(f, abs(sin(f*20.)), P7*.5);
  vec3 col=pal(f*P2+length(q)*.6);
  col=mix(col, pal(r.x*P2+.4), clamp(length(r)*.6,0.,1.));
  float e=.01;
  float fx=fbm(p+P1*4.*r+vec2(e,0))-f;
  col*=.6+P4*.6*clamp(fx*30.+.5,0.,1.5);
  col=pow(col,vec3(P6*1.3))*(1.+uBeat*.5);
  c=vec4(col,1);
}`});B({id:"apollo",name:"Apollonian Dream",params:[{n:"Inversion",min:1,max:1.5,def:1.18},{n:"Orbit Speed",min:0,max:2,def:.6},{n:"Glow",min:0,max:3,def:1},{n:"Color Rate",min:.2,max:4,def:1.5},{n:"Distance",min:.5,max:3,def:1.4},{n:"Bass Breathe",min:0,max:1,def:.4},{n:"Fog",min:0,max:1,def:.3},{n:"Light",min:.3,max:2,def:1}],stick:[0,4],code:`
vec4 trap;
float map(vec3 p){
  float s=P0+uBass*.04*P5; float scale=1.; trap=vec4(1000.);
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
    vec3 b=pal(trap.w*P3+trap.x)*clamp(1.-trap.y*1.5,.2,1.);
    float ao=clamp(pow(trap.w,.5)*1.4,0.,1.);
    col=b*ao*ao*P7*1.1;
    col*=exp(-tt*P6*.4);
  }
  col+=pal(.3+uTime*.02)*g*.0035*P2*(1.+uBeat*2.);
  c=vec4(col,1);
}`});B({id:"voronoi",name:"Stained Voronoi",params:[{n:"Cells",min:2,max:20,def:6},{n:"Motion",min:0,max:2,def:.7},{n:"Lead Width",min:0,max:.2,def:.05},{n:"Edge Glow",min:0,max:3,def:1.2},{n:"Audio Light",min:0,max:3,def:1.5},{n:"Layers",min:0,max:1,def:.5},{n:"Swirl",min:0,max:2,def:.4},{n:"Facets",min:0,max:1,def:.6}],stick:[0,6],code:`
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
}`});B({id:"wavefield",name:"Neon Wavefield",params:[{n:"Scroll",min:0,max:2,def:.35},{n:"Peak Height",min:0,max:2,def:1},{n:"Line Glow",min:.3,max:3,def:1.2},{n:"Spread",min:.2,max:1.5,def:.6},{n:"Wave Mix",min:0,max:1,def:.3},{n:"Fill",min:0,max:1,def:.85},{n:"Hue Depth",min:0,max:2,def:.8},{n:"Horizon",min:-.3,max:.3,def:.05}],stick:[1,3],code:`
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
}`});B({id:"starcore",name:"Star Core",params:[{n:"Plasma Scale",min:.5,max:5,def:2},{n:"Churn",min:0,max:3,def:1},{n:"Density",min:.2,max:3,def:1.2},{n:"Corona",min:0,max:3,def:1.2},{n:"Rays",min:0,max:3,def:1},{n:"Bass Flare",min:0,max:2,def:1},{n:"Core Heat",min:0,max:3,def:1.3},{n:"Size",min:.5,max:1.6,def:1}],stick:[0,3],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  vec3 ro=vec3(0,0,-3.); ro.yz*=rot(uCam.y); ro.xz*=rot(uCam.x+uTime*.05);
  vec3 f=normalize(-ro), r=normalize(cross(vec3(0,1,0),f)), u=cross(f,r);
  vec3 rd=normalize(uv.x*r+uv.y*u+1.6*f);
  float R=P7*(1.+uBass*.15*P5);
  vec3 col=vec3(0);
  float b=dot(ro,rd), cc=dot(ro,ro)-R*R*1.3, h=b*b-cc;
  if(h>0.){
    float t0=-b-sqrt(h), t1=-b+sqrt(h); float dt=(t1-t0)/40.;
    for(int i=0;i<40;i++){
      vec3 p=ro+rd*(t0+dt*(float(i)+h21(fc)));
      float l=length(p);
      float n=fbm3(p*P0+vec3(0,0,uTime*.3*P1)+fbm3(p*P0*.5-uTime*.2)*1.5);
      float den=smoothstep(R,R*.3,l)*pow(n,2.)*P2*(1.+fft(n)*1.5);
      col+=pal(n+l*.4)*den*dt*1.1+pal(.1)*den*dt*P6*smoothstep(R*.6,0.,l)*1.1;
    }
  }
  float rl=length(uv);
  float a=atan(uv.y,uv.x);
  float rays=pow(fbm(vec2(a*6.,uTime*.4)),3.)*P4*(1.+uBeat*2.);
  col+=pal(.25)*(.04*P3/(abs(rl-.43*R)+.04))*smoothstep(.3*R,.5*R,rl)*(.5+uMid);
  col+=pal(.4+a*.05)*rays*smoothstep(.3,.6,rl)*exp(-rl*2.)*2.;
  col+=step(.996,h21(floor(fc*.7)))*.6*smoothstep(.5,.8,rl);
  c=vec4(col,1);
}`});B({id:"flower",name:"Flower of Life",params:[{n:"Lattice Scale",min:1,max:8,def:3},{n:"Rotation",min:-1,max:1,def:.08},{n:"Metatron",min:0,max:2,def:1},{n:"Line Width",min:.5,max:4,def:1.4},{n:"Layer Count",min:1,max:5,def:3},{n:"Bloom Pulse",min:0,max:2,def:1},{n:"Fill",min:0,max:1,def:.35},{n:"Depth Drift",min:0,max:2,def:.6}],stick:[0,7],code:`
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
}`});B({id:"fall",name:"Endless Fall",params:[{n:"Fall Speed",min:-2,max:3,def:.8},{n:"Spiral",min:0,max:2,def:.6},{n:"Arms",min:1,max:12,def:5},{n:"Tile Detail",min:1,max:6,def:3},{n:"Glow",min:0,max:3,def:1.2},{n:"Audio Rings",min:0,max:3,def:1.2},{n:"Fractal Bite",min:0,max:1,def:.5},{n:"Twist Pulse",min:0,max:2,def:.6}],stick:[1,2],code:`
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
}`});B({id:"hyper",name:"Hyperbolic Temple",params:[{n:"P (sides)",min:3,max:8,def:5},{n:"Q (meet)",min:3,max:8,def:4},{n:"Drift",min:0,max:2,def:.5},{n:"Line Glow",min:0,max:3,def:1.2},{n:"Cell Color",min:0,max:2,def:1},{n:"Spin",min:-1,max:1,def:.1},{n:"Disk Zoom",min:.6,max:1.6,def:1},{n:"Audio Fill",min:0,max:3,def:1.2}],stick:[2,6],code:`
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
}`});B({id:"burst",name:"Supernova Burst",params:[{n:"Shards",min:20,max:200,def:90},{n:"Burst Force",min:0,max:3,def:1.3},{n:"Shell Count",min:1,max:6,def:3},{n:"Trail",min:0,max:2,def:1},{n:"Core",min:0,max:3,def:1.2},{n:"Spin",min:-1,max:1,def:.1},{n:"Shimmer",min:0,max:2,def:1},{n:"Warp",min:0,max:2,def:.5}],stick:[1,7],code:`
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc)+uCam.xy*.2;
  float r=length(uv), a=atan(uv.y,uv.x);
  uv*=rot(uTime*P5*.2);
  vec3 col=vec3(0);
  float n=floor(P0);
  for(int s=0;s<6;s++){ if(float(s)>=P2) break;
    float fs=float(s);
    float ph=fract(uTime*.18+fs/P2+uBeatCount*.0);
    float R=ph*(1.2+uBass*.4*P1);
    float sa=a*rot(0.)[0][0];
    float sector=floor((a/TAU+.5)*n+fs*.37);
    float hs=h11(sector+fs*17.);
    float rr=R*(.7+.6*hs)+sin(a*7.+uTime)*.02*P7;
    float d=r-rr;
    float ang=fract((a/TAU+.5)*n+fs*.37)-.5;
    float shard=exp(-ang*ang*60.)*exp(-max(d,0.)*60.)*smoothstep(-.25*P3,0.,d);
    col+=pal(hs*.3+fs*.2+uTime*.03)*shard*(1.-ph)*1.4*(.3+fft(hs))*(1.+P6*uHigh);
    col+=pal(fs*.25+.5)*glowLine(d,.004)*(1.-ph)*.15*P1;
  }
  col+=pal(.05)*P4*.06/(r+.03)*(.5+uBass*2.+uBeat*2.);
  col+=pal(.8+r)*pow(fbm(uv*3.*rot(uTime*.1)+uTime*.2),3.)*P7*.6*smoothstep(1.,.0,r);
  c=vec4(col,1);
}`});B({id:"fold",name:"Origami Fold",params:[{n:"Fold Angle",min:0,max:3.14,def:.3},{n:"Iterations",min:3,max:14,def:10},{n:"Scale",min:1.1,max:1.8,def:1.33},{n:"Offset",min:.3,max:1.2,def:.7},{n:"Glow",min:.3,max:3,def:1},{n:"Fold Pulse",min:0,max:2,def:1},{n:"Color Rate",min:0,max:3,def:1},{n:"Zoom",min:.3,max:4,def:1}],stick:[0,3],code:`
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
}`});B({id:"bulb",name:"Mandelbulb Shrine",params:[{n:"Power",min:2,max:12,def:8},{n:"Orbit",min:0,max:1,def:.25},{n:"Glow",min:0,max:3,def:1},{n:"Color Rate",min:.2,max:4,def:1.2},{n:"Distance",min:1.6,max:4,def:2.6},{n:"Power Pulse",min:0,max:2,def:.8},{n:"Rim",min:0,max:3,def:1.2},{n:"Detail",min:4,max:10,def:7}],stick:[0,4],code:`
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
    col=pal(tr*P3+uTime*.02)*ao*ao*ao*1.2;
    col+=pal(tr*P3+.5)*pow(1.-ao,4.)*P6*1.2;
  }
  col+=pal(.3)*g*.004*P2*(1.+uBeat*2.);
  c=vec4(col,1);
}`});B({id:"hextunnel",name:"Hex Temple",params:[{n:"Speed",min:0,max:4,def:1.4},{n:"Hex Size",min:2,max:14,def:6},{n:"Eyes",min:0,max:2,def:1},{n:"Glow",min:0,max:3,def:1.2},{n:"Warp",min:0,max:2,def:.6},{n:"Twist",min:-2,max:2,def:.4},{n:"Depth Fade",min:0,max:2,def:1},{n:"Glyphs",min:0,max:2,def:1}],stick:[5,4],code:`
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
}`});B({id:"yantra",name:"Sri Yantra",params:[{n:"Triangles",min:3,max:12,def:9},{n:"Breathing",min:0,max:2,def:1},{n:"Lotus Petals",min:4,max:24,def:16},{n:"Line Width",min:.5,max:4,def:1.5},{n:"Spin",min:-1,max:1,def:.05},{n:"Halo",min:0,max:3,def:1.2},{n:"Fill Glow",min:0,max:2,def:.6},{n:"Zoom",min:.5,max:2,def:1}],stick:[1,6],code:`
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
}`});B({id:"menger",name:"Menger Crystal",params:[{n:"Speed",min:0,max:3,def:.8},{n:"Hole Size",min:.8,max:1.2,def:1},{n:"Glow",min:0,max:3,def:1.2},{n:"Color Rate",min:.2,max:3,def:1},{n:"Twist",min:0,max:1,def:.3},{n:"Bass Shake",min:0,max:2,def:.6},{n:"Fog",min:0,max:1,def:.4},{n:"Iterations",min:2,max:5,def:4}],stick:[4,1],code:`
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
    float cc=(min(da,min(db,dc))-P1)/s;
    d=max(d,cc); tr=min(tr,length(a));
  }
  return d;
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  vec3 ro=vec3(0.,0.,uTime*P0)+vec3(sin(uTime*7.),cos(uTime*9.),0.)*uBass*.01*P5;
  vec3 rd=camRay(uv,1.); rd.xy*=rot(uTime*.05+uCam.z);
  float t=0., g=0., st=0.;
  for(int i=0;i<90;i++){ float d=map(ro+rd*t); g+=exp(-d*40.); if(d<.001*t||t>20.)break; t+=d; st++; }
  float ao=1.-st/90.;
  vec3 col=pal(tr*P3+t*.05+uTime*.02)*ao*ao*ao*1.2;
  col+=pal(tr*P3+.5)*g*.005*P2*(1.+uBeat+fft(fract(t*.1)));
  col=mix(col,pal(.6)*.03,smoothstep(2.,20.,t)*P6);
  c=vec4(col,1);
}`});B({id:"aurora",name:"Aurora Ocean",params:[{n:"Curtains",min:1,max:8,def:5},{n:"Flow",min:0,max:3,def:1},{n:"Height",min:.2,max:1.5,def:.7},{n:"Brightness",min:.3,max:3,def:1.3},{n:"Reflection",min:0,max:1,def:.7},{n:"Waves",min:0,max:2,def:1},{n:"Stars",min:0,max:2,def:1},{n:"Audio Fold",min:0,max:3,def:1.2}],stick:[1,7],code:`
vec3 aur(vec2 uv){
  vec3 col=vec3(0);
  for(int i=0;i<8;i++){ if(float(i)>=P0) break;
    float fi=float(i);
    float x=uv.x*(1.+fi*.3)+uTime*.05*P1*(fi+1.)+fi*3.;
    float y=.1+fi*.06+fbm(vec2(x*1.5,uTime*.1*P1+fi))*.35*P2+fft(fract(x*.1))*.15*P7;
    float d=uv.y-y;
    float curtain=exp(-max(d,0.)*(6.-fi*.4))*smoothstep(-.02,.0,d)*(.6+.4*sin(x*30.+uTime*2.));
    col+=pal(fi*.12+x*.05)*curtain*.35*P3;
  }
  return col;
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc); uv.x+=uCam.x*.5; float hz=-.2+uCam.y*.2;
  vec3 col;
  if(uv.y>hz){
    col=aur(uv-vec2(0,hz))+pal(.65)*.04;
    col+=step(.997-.003*P6,h21(floor(uv*300.)))*P6*.7*(.5+uHigh);
  } else {
    vec2 m=vec2(uv.x, hz+(hz-uv.y));
    m.x+=sin(uv.y*60.+uTime*3.)*.01*P5*(1.+uBass);
    col=aur(m-vec2(0,hz))*P4*(.6+.4*sin(uv.y*200.+uTime*4.)*P5*.5);
  }
  col*=1.+uBeat*.4;
  c=vec4(col,1);
}`});var ae=Ke,ie=Object.fromEntries(Ke.map(t=>[t.id,t])),ne=`#version 300 es
in vec2 aPos; void main(){ gl_Position=vec4(aPos,0,1); }`,Mt=`#version 300 es
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
}`,Ct=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes; out vec4 fragColor;
void main(){ vec2 uv=gl_FragCoord.xy/uRes; vec3 c=texture(uTex,uv).rgb; float l=max(c.r,max(c.g,c.b)); fragColor=vec4(c*smoothstep(.6,1.3,l),1); }`,Rt=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes, uDir; out vec4 fragColor;
void main(){ vec2 uv=gl_FragCoord.xy/uRes; vec2 o=uDir/uRes; vec3 c=texture(uTex,uv).rgb*.227;
  c+=(texture(uTex,uv+o*1.38).rgb+texture(uTex,uv-o*1.38).rgb)*.316;
  c+=(texture(uTex,uv+o*3.23).rgb+texture(uTex,uv-o*3.23).rgb)*.07; fragColor=vec4(c,1); }`,At=`#version 300 es
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
  col*=uExposure*mix(1., clamp(.34/avgL, .45, 1.25), uAutoExp);
  col=aces(col*1.15);
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
}`,Bt=`#version 300 es
precision highp float; uniform sampler2D uSmall, uPrev; uniform float uRate; out vec4 fragColor;
void main(){ vec3 c=textureLod(uSmall, vec2(.5), 10.).rgb; float l=dot(c,vec3(.3,.59,.11)); float pl=texture(uPrev, vec2(.5)).r; fragColor=vec4(mix(pl,l,uRate),0,0,1); }`,Et=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes; out vec4 fragColor;
void main(){ fragColor=texture(uTex, gl_FragCoord.xy/uRes); }`;var Le=class{constructor(e){this.canvas=e;let a=this.gl=e.getContext("webgl2",{antialias:!1,alpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"});if(!a)throw new Error("WebGL2 is not available on this system.");this.halfFloat=!!a.getExtension("EXT_color_buffer_float"),a.getExtension("OES_texture_float_linear");let i=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,i),a.bufferData(a.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),a.STATIC_DRAW),this.vao=a.createVertexArray(),a.bindVertexArray(this.vao),a.enableVertexAttribArray(0),a.vertexAttribPointer(0,2,a.FLOAT,!1,0,0),this.progs={},this.errors={},this.post={feedback:this.program(ne,Mt),bright:this.program(ne,Ct),blur:this.program(ne,Rt),final:this.program(ne,At),blit:this.program(ne,Et),adapt:this.program(ne,Bt)},this.audioTex=a.createTexture(),a.bindTexture(a.TEXTURE_2D,this.audioTex),a.pixelStorei(a.UNPACK_ALIGNMENT,1),a.texImage2D(a.TEXTURE_2D,0,a.R8,512,2,0,a.RED,a.UNSIGNED_BYTE,null),this.texParams(a.LINEAR,a.CLAMP_TO_EDGE),this.milkTex=a.createTexture(),a.bindTexture(a.TEXTURE_2D,this.milkTex),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,1,1,0,a.RGBA,a.UNSIGNED_BYTE,new Uint8Array([0,0,0,255])),this.texParams(a.LINEAR,a.CLAMP_TO_EDGE),this.scale=.75,this.fbIdx=0,this.finIdx=0,this.lumSmall=this.makeTarget(64,36),a.bindTexture(a.TEXTURE_2D,this.lumSmall.tex),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR_MIPMAP_LINEAR),a.generateMipmap(a.TEXTURE_2D),this.adapt=[this.makeTarget(1,1),this.makeTarget(1,1)],this.adIdx=0,this.W=0,this.H=0}texParams(e,a){let i=this.gl;i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,e),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,e),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,a),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,a)}shader(e,a){let i=this.gl,r=i.createShader(e);if(i.shaderSource(r,a),i.compileShader(r),!i.getShaderParameter(r,i.COMPILE_STATUS)){let n=i.getShaderInfoLog(r);throw i.deleteShader(r),new Error(n)}return r}program(e,a){let i=this.gl,r=i.createProgram();if(i.attachShader(r,this.shader(i.VERTEX_SHADER,e)),i.attachShader(r,this.shader(i.FRAGMENT_SHADER,a)),i.bindAttribLocation(r,0,"aPos"),i.linkProgram(r),!i.getProgramParameter(r,i.LINK_STATUS))throw new Error(i.getProgramInfoLog(r));let n={},s=i.getProgramParameter(r,i.ACTIVE_UNIFORMS);for(let l=0;l<s;l++){let m=i.getActiveUniform(r,l);n[m.name.replace(/\[0\]$/,"")]=i.getUniformLocation(r,m.name)}return{p:r,u:n}}sceneProg(e){if(this.progs[e])return this.progs[e];let a=ae.find(i=>i.id===e);try{this.progs[e]=this.program(ne,St+a.code)}catch(i){this.errors[e]=String(i),console.error("Scene",e,i),this.progs[e]=null}return this.progs[e]}precompile(e,a){let i=0,r=()=>{if(i>=e.length)return a&&a();this.sceneProg(e[i++]),setTimeout(r,0)};r()}makeTarget(e,a,i=!0){let r=this.gl,n=r.createTexture();r.bindTexture(r.TEXTURE_2D,n),i&&this.halfFloat?r.texImage2D(r.TEXTURE_2D,0,r.RGBA16F,e,a,0,r.RGBA,r.HALF_FLOAT,null):r.texImage2D(r.TEXTURE_2D,0,r.RGBA8,e,a,0,r.RGBA,r.UNSIGNED_BYTE,null),this.texParams(r.LINEAR,r.CLAMP_TO_EDGE);let s=r.createFramebuffer();return r.bindFramebuffer(r.FRAMEBUFFER,s),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,n,0),r.clearColor(0,0,0,1),r.clear(r.COLOR_BUFFER_BIT),{tex:n,fb:s,w:e,h:a}}freeTarget(e){e&&(this.gl.deleteTexture(e.tex),this.gl.deleteFramebuffer(e.fb))}resize(e,a,i){if(e===this.W&&a===this.H&&i===this.scaleUsed)return;let r=this.gl,n=Math.max(64,Math.round(e*i)),s=Math.max(64,Math.round(a*i)),l=[this.sceneT,...this.fb||[],...this.fin||[],this.bA,this.bB],m=this.fb;this.sceneT=this.makeTarget(n,s),this.fb=[this.makeTarget(n,s),this.makeTarget(n,s)],m&&this.drawTo(this.fb[this.fbIdx],this.post.blit,{uTex:m[this.fbIdx].tex}),!this.fin||e!==this.W||a!==this.H?((this.fin||[]).forEach(b=>this.freeTarget(b)),this.fin=[this.makeTarget(e,a,!1),this.makeTarget(e,a,!1)]):l.splice(l.indexOf(this.fin[0]),2);let p=Math.max(32,Math.round(n/4)),x=Math.max(32,Math.round(s/4));this.bA=this.makeTarget(p,x),this.bB=this.makeTarget(p,x),l.forEach(b=>{b&&!this.fin.includes(b)&&this.freeTarget(b)}),this.W=e,this.H=a,this.scaleUsed=i,this.sw=n,this.sh=s}drawTo(e,a,i,r){let n=this.gl;n.bindFramebuffer(n.FRAMEBUFFER,e?e.fb:null);let s=e?e.w:this.W,l=e?e.h:this.H;n.viewport(0,0,s,l),n.useProgram(a.p);let m=0;for(let[p,x]of Object.entries(i)){let b=a.u[p];b!=null&&(x instanceof WebGLTexture?(n.activeTexture(n.TEXTURE0+m),n.bindTexture(n.TEXTURE_2D,x),n.uniform1i(b,m++)):typeof x=="number"?n.uniform1f(b,x):x.length===2?n.uniform2fv(b,x):x.length===3?n.uniform3fv(b,x):x.length===4&&n.uniform4fv(b,x))}a.u.uRes,a.u.uRes&&n.uniform2f(a.u.uRes,s,l),n.drawArrays(n.TRIANGLES,0,3)}uploadAudio(e){let a=this.gl;a.bindTexture(a.TEXTURE_2D,this.audioTex),a.pixelStorei(a.UNPACK_ALIGNMENT,1),a.texSubImage2D(a.TEXTURE_2D,0,0,0,512,2,a.RED,a.UNSIGNED_BYTE,e)}uploadMilk(e){let a=this.gl;a.bindTexture(a.TEXTURE_2D,this.milkTex),a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,!0),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,a.RGBA,a.UNSIGNED_BYTE,e),a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,!1)}snapshot(){this.transTex=this.fin[this.finIdx].tex,this.finIdx^=1}frame(e){let a=this.post;if(e.engine==="scene"){let x=this.sceneProg(e.scene);x&&this.drawTo(this.sceneT,x,e.sceneU)}let i=e.engine==="milk"?this.milkTex:this.sceneT.tex,r=this.fb[this.fbIdx],n=this.fb[this.fbIdx^1];this.drawTo(n,a.feedback,{...e.fbU,uScene:i,uPrev:r.tex,uMilk:this.milkTex}),this.fbIdx^=1,this.drawTo(this.bA,a.bright,{uTex:n.tex});for(let x=0;x<2;x++)this.drawTo(this.bB,a.blur,{uTex:this.bA.tex,uDir:[1+x,0]}),this.drawTo(this.bA,a.blur,{uTex:this.bB.tex,uDir:[0,1+x]});this.drawTo(this.lumSmall,a.blit,{uTex:n.tex});let s=this.gl;s.bindTexture(s.TEXTURE_2D,this.lumSmall.tex),s.generateMipmap(s.TEXTURE_2D);let l=this.adapt[this.adIdx],m=this.adapt[this.adIdx^1];this.drawTo(m,a.adapt,{uSmall:this.lumSmall.tex,uPrev:l.tex,uRate:e.adaptRate??.04}),this.adIdx^=1;let p=this.fin[this.finIdx];this.drawTo(p,a.final,{...e.finU,uTex:n.tex,uBloom:this.bA.tex,uTrans:this.transTex||n.tex,uAdapt:m.tex}),this.drawTo(null,a.blit,{uTex:p.tex})}};var ze=class{constructor(){this.ctx=new(window.AudioContext||window.webkitAudioContext)({latencyHint:"interactive"}),this.el=new Audio,this.el.crossOrigin="anonymous",this.el.preload="auto",this.elSrc=this.ctx.createMediaElementSource(this.el),this.input=this.ctx.createGain(),this.analyser=this.ctx.createAnalyser(),this.analyser.fftSize=2048,this.analyser.smoothingTimeConstant=.55,this.out=this.ctx.createGain(),this.elSrc.connect(this.input),this.input.connect(this.analyser),this.elSrc.connect(this.out),this.out.connect(this.ctx.destination),this.freq=new Uint8Array(1024),this.time=new Uint8Array(2048),this.tex=new Uint8Array(512*2),this.bass=0,this.mid=0,this.high=0,this.vol=0,this.beat=0,this.beatCount=0,this.peak={b:.2,m:.2,h:.2,v:.2},this.bassAvg=0,this.lastBeat=0,this.drop=0,this.playlist=[],this.index=-1,this.shuffle=!1,this.repeat="all",this.mode="player",this.stream=null,this.streamSrc=null,this.onchange=()=>{},this.el.addEventListener("ended",()=>this.next(!0)),this.el.addEventListener("play",()=>this.onchange()),this.el.addEventListener("pause",()=>this.onchange());let e=this.ctx.sampleRate/2;this.binMap=new Float32Array(512);for(let a=0;a<512;a++){let i=30*Math.pow(533.3333333333334,a/511);this.binMap[a]=Math.min(1023,i/e*1024)}}async setOutput(e){try{return this.ctx.setSinkId?await this.ctx.setSinkId(e==="default"?"":e):this.el.setSinkId&&await this.el.setSinkId(e),!0}catch(a){return console.warn(a),!1}}resume(){this.ctx.state!=="running"&&this.ctx.resume()}addTracks(e){let a=this.playlist.length===0;this.playlist.push(...e),a&&e.length&&this.play(0),this.onchange()}remove(e){this.playlist.splice(e,1),e<this.index?this.index--:e===this.index&&(this.index=Math.min(this.index,this.playlist.length-1),this.index>=0?this.play(this.index):this.el.pause()),this.onchange()}clear(){this.playlist=[],this.index=-1,this.el.pause(),this.el.removeAttribute("src"),this.onchange()}async play(e){if(!(e<0||e>=this.playlist.length)){this.useSource("player"),this.index=e,this.el.src=this.playlist[e].url,this.resume();try{await this.el.play()}catch(a){console.warn(a)}this.onchange()}}toggle(){if(this.resume(),this.mode!=="player"&&this.useSource("player"),this.index<0&&this.playlist.length)return this.play(0);this.el.paused?this.el.play():this.el.pause()}next(e){if(!this.playlist.length)return;if(this.repeat==="one"&&e)return this.play(this.index);let a=this.shuffle?Math.floor(Math.random()*this.playlist.length):this.index+1;if(a>=this.playlist.length){if(this.repeat==="off"&&e)return;a=0}this.play(a)}prev(){if(this.el.currentTime>3){this.el.currentTime=0;return}this.play((this.index-1+this.playlist.length)%Math.max(1,this.playlist.length))}get current(){return this.playlist[this.index]}stopStream(){this.stream&&(this.stream.getTracks().forEach(e=>e.stop()),this.stream=null),this.streamSrc&&(this.streamSrc.disconnect(),this.streamSrc=null)}useSource(e){e==="player"&&this.mode!=="player"&&(this.stopStream(),this.mode="player",this.onchange())}async useLoopback(){this.resume();let e=await navigator.mediaDevices.getDisplayMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1},video:!0,systemAudio:"include",selfBrowserSurface:"exclude"});if(e.getVideoTracks().forEach(a=>a.stop()),!e.getAudioTracks().length)throw new Error("No audio was shared \u2014 pick a tab or \u201CEntire screen\u201D and turn on \u201CShare audio\u201D.");this.attachStream(e,"loopback")}async useMic(){this.resume();let e=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});this.attachStream(e,"mic")}attachStream(e,a){this.el.pause(),this.stopStream(),this.stream=e,this.streamSrc=this.ctx.createMediaStreamSource(e),this.streamSrc.connect(this.input),this.mode=a,this.onchange()}update(e,a=1,i={}){let r=i.sens??1,n=i.gB??1,s=i.gM??1,l=i.gH??1,m=this.analyser;m.getByteFrequencyData(this.freq),m.getByteTimeDomainData(this.time);let p=this.ctx.sampleRate/2,x=this.freq,b=(y,T)=>{let w=Math.max(1,Math.floor(y/p*1024)),M=Math.max(w+1,Math.floor(T/p*1024)),O=0;for(let U=w;U<M;U++)O+=x[U];return O/(M-w)/255},A=b(25,160)*n,P=b(160,2200)*s,C=b(2200,12e3)*l,L=0;for(let y=0;y<2048;y+=4){let T=(this.time[y]-128)/128;L+=T*T}L=Math.sqrt(L/512);let S=this.peak,N=Math.pow(.25,e/8);S.b=Math.max(A,S.b*N,.05),S.m=Math.max(P,S.m*N,.05),S.h=Math.max(C,S.h*N,.03),S.v=Math.max(L,S.v*N,.02);let $=(y,T,w,M)=>y+(T-y)*(1-Math.exp(-e*(T>y?w:M))),V=Math.min(2.5,a);this.bass=$(this.bass,Math.pow(A/S.b,1.6)*V,30,8),this.mid=$(this.mid,Math.pow(P/S.m,1.4)*V,20,6),this.high=$(this.high,Math.pow(C/S.h,1.3)*V,25,7),this.vol=$(this.vol,L/S.v*V,15,4),this.bassAvg=this.bassAvg+(A-this.bassAvg)*(1-Math.exp(-e*2));let g=performance.now()/1e3;this.isBeat=!1,A>this.bassAvg*(1.5-r*.22)&&A>.12&&g-this.lastBeat>.2&&(this.lastBeat=g,this.beat=1,this.beatCount++,this.isBeat=!0),this.beat*=Math.exp(-e*7),this.drop=this.drop*Math.exp(-e*.5)+Math.max(0,A-this.bassAvg*1.6)*e*4;for(let y=0;y<512;y++){let T=this.binMap[y],w=Math.floor(T),M=T-w,O=x[w]*(1-M)+x[Math.min(1023,w+1)]*M;this.tex[y]=Math.min(255,O*(1+y/512*.8))}for(let y=0;y<512;y++)this.tex[512+y]=this.time[y*2]}};var R={A:0,B:1,X:2,Y:3,LB:4,RB:5,LT:6,RT:7,BACK:8,START:9,L3:10,R3:11,UP:12,DOWN:13,LEFT:14,RIGHT:15,TOUCH:17},De=class{constructor(){this.prev=[],this.downAt=[],this.held=[],this.axes=[0,0,0,0],this.lt=0,this.rt=0,this.connected=!1,this.id="",this.deadzone=.14,this.style="xbox",this.lastInput=0,this.gp=null}poll(){let e=navigator.getGamepads?navigator.getGamepads():[],a=null;for(let P of e)if(P&&P.connected){a=P;break}this.hid&&this.hid.fresh&&(a=this.hid.asGamepad()),this.gp=a;let i=this.connected;if(this.connected=!!a,this.justConnected=!i&&this.connected,!a){this.pressed=[],this.released=[];return}this.id=a.id,this.style=/054c|playstation|dualsense|dualshock/i.test(a.id)||/wireless controller/i.test(a.id)&&!/xbox|xinput|045e/i.test(a.id)?"ps":"xbox";let r=performance.now();this.pressed=[],this.released=[];let n=Math.min(a.buttons.length,18);for(let P=0;P<n;P++){let C=a.buttons[P],L=typeof C=="object"?C.value:C,S=typeof C=="object"&&C.pressed||L>.5;S&&!this.prev[P]&&(this.pressed[P]=!0,this.downAt[P]=r,this.held[P]=!1,this.lastInput=r),!S&&this.prev[P]&&(this.released[P]=!0),this.prev[P]=S}let s=P=>{let C=Math.abs(P);return C<this.deadzone?0:Math.sign(P)*((C-this.deadzone)/(1-this.deadzone))},l=a.axes,m=(P,C)=>{let L=Math.hypot(P,C);if(L<this.deadzone)return[0,0];let S=(L-this.deadzone)/(1-this.deadzone)/L;return[P*S,C*S]},[p,x]=m(l[0]||0,l[1]||0),[b,A]=m(l[2]||0,l[3]||0);this.axes=[p,x,b,A],this.lt=a.buttons[6]?a.buttons[6].value:0,this.rt=a.buttons[7]?a.buttons[7].value:0,Math.abs(p)+Math.abs(x)+Math.abs(b)+Math.abs(A)+this.lt+this.rt>.05&&(this.lastInput=r)}down(e){return!!this.prev[e]}tap(e){return!!this.pressed[e]}hold(e,a){return this.prev[e]&&!this.held[e]&&performance.now()-this.downAt[e]>a?(this.held[e]=!0,!0):!1}shortRelease(e){return!!this.released[e]&&!this.held[e]}rumble(e,a,i=80){let r=this.gp;if(!(!r||!r.vibrationActuator))try{r.vibrationActuator.playEffect("dual-rumble",{duration:i,strongMagnitude:Math.min(1,e),weakMagnitude:Math.min(1,a)})}catch{}}label(e){return this.style==="ps"?{A:"\u2715",B:"\u25CB",X:"\u25A1",Y:"\u25B3",LB:"L1",RB:"R1",LT:"L2",RT:"R2",BACK:"Create",START:"Options",L3:"L3",R3:"R3"}[e]||e:{A:"A",B:"B",X:"X",Y:"Y",LB:"LB",RB:"RB",LT:"LT",RT:"RT",BACK:"View",START:"Menu",L3:"LS",R3:"RS"}[e]||e}};var X=[{name:"Acid Rainbow",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.33,.67]},{name:"Psilocybin",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[.8,.9,.3]},{name:"Synthwave",a:[.55,.3,.6],b:[.45,.3,.4],c:[1,1,1],d:[0,.15,.25]},{name:"Aurora",a:[.3,.55,.5],b:[.3,.45,.45],c:[1,1,1],d:[.55,.25,.3]},{name:"Molten Gold",a:[.6,.4,.2],b:[.4,.35,.2],c:[1,1,1],d:[0,.1,.2]},{name:"Deep Ocean",a:[.2,.4,.6],b:[.2,.35,.4],c:[1,1,1],d:[.3,.2,.1]},{name:"Toxic",a:[.4,.6,.3],b:[.4,.4,.4],c:[1,1.5,1],d:[.2,0,.5]},{name:"Candy",a:[.65,.5,.65],b:[.35,.45,.35],c:[1,1,1],d:[0,.5,.25]},{name:"Infrared",a:[.5,.2,.25],b:[.5,.3,.3],c:[1,1,1.5],d:[0,.1,.6]},{name:"Ultraviolet",a:[.45,.25,.65],b:[.45,.3,.35],c:[1,2,1],d:[.6,.1,0]},{name:"Ice Fire",a:[.5,.5,.5],b:[.5,.5,.5],c:[.5,.5,.5],d:[0,.15,.5]},{name:"Peacock",a:[.4,.5,.5],b:[.4,.4,.5],c:[2,1,1],d:[.5,.2,.25]},{name:"Sunset Dream",a:[.6,.4,.4],b:[.4,.4,.3],c:[1,1,1],d:[0,.2,.45]},{name:"Emerald Temple",a:[.25,.5,.35],b:[.25,.45,.3],c:[1,1,2],d:[.6,.3,.5]},{name:"Holographic",a:[.6,.6,.7],b:[.4,.4,.3],c:[2,2,2],d:[0,.33,.67]},{name:"Blacklight",a:[.35,.2,.55],b:[.35,.45,.45],c:[1.5,1,1],d:[.35,.7,.1]}],Z={trail:.55,zoom:1.01,spin:0,warp:.3,hueDrift:0,kaleido:0,kaleidoSpin:0,mirror:0,breathe:.4,melt:0,chroma:1,bloom:.8,grain:.3,vignette:.6,exposure:1,saturation:1.1,contrast:1.05,react:1,speed:1,fusion:0,hueSpin:0,dance:1,ripple:1,punch:1,shake:1,swirlA:1,bulgeA:1};function Lt(t){let e=2166136261;for(let a of t)e=Math.imul(e^a.charCodeAt(0),16777619)>>>0;return()=>{e=e+1831565813>>>0;let a=e;return a=Math.imul(a^a>>>15,a|1),a^=a+Math.imul(a^a>>>7,a|61),((a^a>>>14)>>>0)/4294967296}}var ia={trail:[.1,.62],zoom:[.995,1.018],spin:[-.006,.006],warp:[0,1],breathe:[.1,1.2],melt:[0,.6],hueDrift:[-.01,.01],hueSpin:[-.05,.05],kaleidoSpin:[-.3,.3],chroma:[.4,1.7],bloom:[.5,1.05],exposure:[.95,1.08],saturation:[1,1.4],contrast:[1,1.12],grain:[.08,.45],vignette:[.3,.95],react:[.8,1.5],speed:[.7,1.45],dance:[.4,1.9],ripple:[.3,1.7],punch:[.4,1.7],shake:[.15,1.4],swirlA:[.3,1.9],bulgeA:[.3,1.7]};function Ze(t,e=Z,a={}){let i=Lt(t),r={...Z,...e};for(let[n,[s,l]]of Object.entries(ia))r[n]=+(s+i()*(l-s)).toFixed(4);return e.trail===0&&(r.trail=0),e.zoom===1&&(r.zoom=1),{...r,...a}}var h=(t,e,a,i={},r=0)=>{let n=ie[t],s=Lt(e+"#shape"),l=n.params.map((m,p)=>{if(a[p]!==void 0)return a[p];let x=m.def+(s()-.5)*.16*(m.max-m.min);return+Math.max(m.min,Math.min(m.max,x)).toFixed(4)});return{id:"eye-"+e.toLowerCase().replace(/[^a-z0-9]+/g,"-"),name:e,engine:"scene",scene:t,params:l,palette:r,fx:Ze(e,Z,i),builtin:!0}};var J=[h("cathedral","Cathedral of Echoes",[],{trail:.6},0),h("cathedral","Infinite Basilica",[1.1,.2,1.42,1.8,1.4,.5],{trail:.4,kaleido:0},4),h("cathedral","Neon Spine",[.55,1.1,1.6,2.4,2,.35,1.5,1.4],{trail:.75,zoom:1.02,hueDrift:.01},15),h("cathedral","Gothic Mushroom Vault",[.95,.7,1.5,1.4,.7,.8,1,1.8],{breathe:1,melt:.6},1),h("nebula","Warp Nebula",[],{},9),h("nebula","Wormhole Petals",[2,.4,3.2,1.6,1,.3,1.5,6],{kaleido:6,trail:.5},0),h("nebula","Cosmic Drain",[.6,.9,1.5,2.5,.4,-.6,1.2],{spin:.01,trail:.7,zoom:.985},5),h("julia","Julia Bloom",[],{},0),h("julia","Dendrite Garden",[1.2,1.3,.6,1.2,2,.76,.2,6],{trail:.4},13),h("julia","Paisley Mind",[2.6,.8,1.8,1,1.5,.79,-.4,1],{breathe:1.2,melt:.5},1),h("julia","Electric Lace",[4.2,1.6,2.4,1.5,2.8,.7885,.3,4],{kaleido:0,trail:.6,hueDrift:.02},15),h("gyroid","Gyroid Hyperspace",[],{},9),h("gyroid","Coral Lungs",[1.4,.8,.15,1.4,.7,1.8,.06,.3],{breathe:1.5,trail:.5},12),h("gyroid","Light Speed Lattice",[3,4.5,.03,2,.2,.6,.05,1.6],{trail:.75,zoom:1.03,chroma:2},0),h("chrome","Liquid Chrome",[],{},14),h("chrome","Mercury Heartbeat",[4,.9,.15,4,.6,2,.4,1.3],{trail:.3},10),h("chrome","Oil Slick Orbit",[8,.35,.7,12,1.6,1,2,1],{trail:.5,breathe:.8},1),h("horizon","Neon Horizon",[],{},2),h("horizon","Outrun Forever",[2.5,.38,1.5,10,1.2,1.5,14,1.5],{trail:.4,chroma:2},2),h("horizon","Hallucinated Highway",[1.5,.25,1.2,6,2,1,6,1.4],{breathe:1.2,melt:1,trail:.6,hueDrift:.01},0),h("mandala","Spectral Mandala",[],{},0),h("mandala","Lotus Reactor",[8,8,.8,2,.05,1.4,1.4,1.1],{trail:.6,zoom:1.015},7),h("mandala","Chakra Spin",[16,4,.3,1.2,.5,1,.4,.8],{trail:.75,spin:.008},9),h("mandala","Lace Galaxy",[24,10,1,1,-.2,2,2,1.3],{kaleido:0,trail:.5,hueDrift:.015},15),h("silk","Silk Warp",[],{},1),h("silk","Melting Marble",[1.4,2,1.6,.4,1.8,1.2,1.8,1],{breathe:1,melt:.5},4),h("silk","Liquid Thought",[3.5,1.6,.8,1.2,1,1.5,1.2,.2],{kaleido:8,trail:.4},3),h("silk","Tie-Dye Ocean",[2.6,2.6,2.6,.9,.8,1,1.1,.6],{trail:.3,hueDrift:.02},0),h("apollo","Apollonian Dream",[],{},14),h("apollo","Bubble Universe",[1.32,.4,2.2,2.5,1,.8,.2,1.3],{trail:.5},11),h("apollo","Pearl Labyrinth",[1.08,1.2,.8,.8,1.8,.3,.6,1.6],{breathe:.6},4),h("voronoi","Stained Voronoi",[],{},7),h("voronoi","Cathedral Window",[4,.3,.08,1.5,2,.3,0,.9],{kaleido:12,trail:.3},0),h("voronoi","Cell Division",[12,1.5,.02,2.5,2.5,1,1.4,.3],{trail:.6,breathe:1.2,melt:.4},6),h("wavefield","Neon Wavefield",[],{},2),h("wavefield","Pulsar Ridge",[.6,1.6,1.8,.4,.1,1,.4,.1],{trail:.5,chroma:1.5},10),h("wavefield","Spectral Dunes",[.2,1.2,1,1.2,.8,.6,1.8,0],{mirror:1,trail:.6},3),h("starcore","Star Core",[],{},4),h("starcore","Blue Giant",[3,1.6,1.6,2,1.6,1.4,1,1.2],{trail:.6},5),h("starcore","Quasar Eye",[1.5,2.5,2,2.5,2.5,2,2.4,.8],{kaleido:6,trail:.5},8),h("flower","Flower of Life",[],{},4),h("flower","Metatron Gate",[2,.15,2,1.6,4,1.5,.6,1],{trail:.5,zoom:1.012},13),h("flower","Seed of Creation",[5,-.05,.5,1,5,1,.8,1.6],{trail:.7,breathe:1,hueDrift:.01},1),h("fall","Endless Fall",[],{},0),h("fall","Droste Staircase",[1.5,1.2,3,4,1.5,1,.2,1],{trail:.5},4),h("fall","Spiral Abyss",[2.2,1.8,8,5,1.8,2,.8,1.5],{trail:.7,zoom:.99,spin:-.01},9),h("fall","Rising Up",[-1.2,.4,6,3,1.2,1.5,.5,.4],{kaleido:0,trail:.4,hueDrift:.01},3),h("hyper","Hyperbolic Temple",[],{},0),h("hyper","Escher Heaven",[7,3,.8,2,.5,.2,1,.8],{trail:.4},10),h("hyper","Infinite Mosaic",[4,6,1.4,1.5,.8,-.3,1.3,1.2],{trail:.5,breathe:.6},7),h("burst","Supernova Burst",[],{},4),h("burst","Firework Mind",[180,2,6,1.5,.8,.4,2,.4],{trail:.82,zoom:1.025},0),h("burst","Crystal Detonation",[60,2.2,4,.8,1.2,0,1.6,1],{kaleido:8,trail:.7,zoom:1.02},15),h("fold","Origami Fold",[],{},1),h("fold","Folding Cathedral",[.15,12,1.4,.8,1.4,1.5,1.4,.8],{trail:.5},4),h("fold","Dragon Paper",[.6,10,1.3,.62,1.2,1.2,2,1.3],{trail:.65,breathe:1},9),h("fold","Snowflake Engine",[1.05,9,1.36,.75,1.6,1,.8,.7],{kaleido:6,trail:.4},5),h("bulb","Mandelbulb Shrine",[],{},14),h("bulb","Alien Spore",[4,.4,1.6,2,2.2,1.5,2,7],{trail:.5,breathe:1},6),h("bulb","Golden Idol",[10,.15,.6,.8,2.4,.4,1.6,8],{trail:.3},4),h("hextunnel","Hex Temple",[],{},1),h("hextunnel","Machine Elf Hall",[2.2,8,2,2,1.4,1.2,1,2],{trail:.6,breathe:1.4,melt:.4},0),h("yantra","Sri Yantra",[],{},4),h("yantra","Third Eye Opening",[12,2,24,1.2,.2,2.5,1.2,1.2],{trail:.7,zoom:1.018},9),h("menger","Menger Crystal",[],{},5),h("menger","Sponge Cathedral",[1.6,.95,2,2,.6,1.2,.2,4],{trail:.5},4),h("aurora","Aurora Ocean",[],{},3),h("aurora","Borealis Mirror",[8,1.5,1.1,1.8,1,1.6,2,2],{trail:.5,breathe:.6},12)],na=["Velvet","Chrome","Fractal","Liquid","Astral","Neon","Cosmic","Prismatic","Holographic","Molten","Electric","Dreaming","Infinite","Sacred","Psychedelic","Iridescent","Quantum","Lucid","Melting","Hyper","Ancient","Crystal","Sonic","Shimmering","Feral","Halcyon","Opal","Ultraviolet"],oa=["Singularity","Aurora","Cathedral","Lotus","Vortex","Garden","Labyrinth","Mandala","Spiral","Bloom","Engine","Temple","Ocean","Nebula","Serpent","Oracle","Echo","Portal","Reactor","Dream","Prism","Hive","Halo","Abyss","Lattice","Comet","Membrane","Kaleidoscope"],Y=(t,e)=>t+Math.random()*(e-t),ce=t=>t[Math.floor(Math.random()*t.length)];function Fe(){return`${ce(na)} ${ce(oa)}`}function zt(){return{name:"Generated",a:[Y(.3,.65),Y(.3,.65),Y(.3,.65)],b:[Y(.3,.55),Y(.3,.55),Y(.3,.55)],c:[ce([.5,1,1,1,1.5,2]),ce([.5,1,1,1,1.5,2]),ce([.5,1,1,1,1.5,2])],d:[Math.random(),Math.random(),Math.random()]}}function Dt(t=Z,e=1){let a={...t},i=(r,n,s)=>{a[r]=a[r]+(Y(n,s)-a[r])*e};i("trail",0,.85),i("zoom",.985,1.03),i("spin",-.012,.012),i("warp",0,1.2),i("breathe",0,1.6),i("melt",0,.8),i("chroma",.3,2.2),i("bloom",.4,1.4),a.hueDrift=Math.random()<.3?Y(-.02,.02):0,e>=1&&(a.kaleido=Math.random()<.3?ce([3,4,5,6,8,12]):0),a.mirror=Math.random()<.12?1:0;for(let r of["dance","ripple","punch","shake","swirlA","bulgeA"])i(r,.3,1.9);return a}function Je(t,e=.55){let a=ie[t.scene],i=structuredClone(t);return i.builtin=!1,a&&(i.params=a.params.map((r,n)=>{let s=t.params[n]??r.def,l=Y(r.min,r.max);return+(s+(l-s)*e).toFixed(4)})),i.fx=Dt(t.fx,e*.7),Math.random()<.5&&(i.palette=Math.random()<.4?zt():Math.floor(Math.random()*X.length)),i.name=Fe(),i.id="gen-"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),i}function Qe(){let t=ce(ae),e=t.params.map(a=>{let i=Y(a.min,a.max);return+(a.def+(i-a.def)*.7).toFixed(4)});return{id:"gen-"+Date.now().toString(36),name:Fe(),engine:"scene",scene:t.id,params:e,palette:Math.random()<.5?zt():Math.floor(Math.random()*X.length),fx:Dt(Z,1),builtin:!1}}function Ie(t){return typeof t=="number"?X[(t%X.length+X.length)%X.length]:t}var Ft="eyecandy.userPresets.v1";function It(){try{return JSON.parse(localStorage.getItem(Ft)||"[]")}catch{return[]}}function Me(t){try{localStorage.setItem(Ft,JSON.stringify(t))}catch{}}function Ut(t){let e=t.ctx,a=e.createGain();a.gain.value=.55,a.connect(t.input),a.connect(t.out);let i=124,r=60/i/4,n=e.currentTime+.1,s=0,l=!0,m=[0,3,5,7,10,12,15],p=e.createBuffer(1,e.sampleRate,e.sampleRate),x=p.getChannelData(0);for(let g=0;g<x.length;g++)x[g]=Math.random()*2-1;let b=e.createDelay(1);b.delayTime.value=r*3;let A=e.createGain();A.gain.value=.35,b.connect(A),A.connect(b),b.connect(a);let P=g=>{let y=e.createOscillator(),T=e.createGain();y.frequency.setValueAtTime(150,g),y.frequency.exponentialRampToValueAtTime(42,g+.12),T.gain.setValueAtTime(1,g),T.gain.exponentialRampToValueAtTime(.001,g+.45),y.connect(T),T.connect(a),y.start(g),y.stop(g+.5)},C=(g,y)=>{let T=e.createBufferSource();T.buffer=p;let w=e.createBiquadFilter();w.type="highpass",w.frequency.value=8e3;let M=e.createGain();M.gain.setValueAtTime(y,g),M.gain.exponentialRampToValueAtTime(.001,g+.05),T.connect(w),w.connect(M),M.connect(a),T.start(g),T.stop(g+.06)},L=g=>{let y=e.createBufferSource();y.buffer=p;let T=e.createBiquadFilter();T.type="bandpass",T.frequency.value=1500;let w=e.createGain();w.gain.setValueAtTime(.5,g),w.gain.exponentialRampToValueAtTime(.001,g+.18),y.connect(T),T.connect(w),w.connect(a),w.connect(b),y.start(g),y.stop(g+.2)},S=(g,y,T,w)=>{let M=e.createOscillator(),O=e.createOscillator(),U=e.createBiquadFilter(),le=e.createGain();M.type="sawtooth",O.type="square";let _=55*Math.pow(2,y/12);M.frequency.value=_,O.frequency.value=_*1.005,U.type="lowpass",U.Q.value=9,U.frequency.setValueAtTime(w,g),U.frequency.exponentialRampToValueAtTime(120,g+T),le.gain.setValueAtTime(.22,g),le.gain.exponentialRampToValueAtTime(.001,g+T),M.connect(U),O.connect(U),U.connect(le),le.connect(a),le.connect(b),M.start(g),O.start(g),M.stop(g+T),O.stop(g+T)},N=(g,y)=>{[0,7,15,19].forEach(T=>{let w=e.createOscillator(),M=e.createGain();w.type="triangle",w.frequency.value=110*Math.pow(2,(y+T)/12),M.gain.setValueAtTime(0,g),M.gain.linearRampToValueAtTime(.05,g+1),M.gain.linearRampToValueAtTime(0,g+r*64),w.connect(M),M.connect(a),M.connect(b),w.start(g),w.stop(g+r*64)})},$=[0,-4,3,-2],V=()=>{if(l){for(;n<e.currentTime+.15;){let g=s%16,y=Math.floor(s/16),T=Math.floor(y/8)%4,w=$[Math.floor(y/2)%4],M=y%32>=28;!M&&g%4===0&&P(n),g%2===1&&C(n,g%4===3?.25:.1),!M&&(g===4||g===12)&&L(n),Math.random()<(T===2?.8:.55)&&S(n,w+12+m[Math.floor(Math.random()*m.length)]+(Math.random()<.2?12:0),r*1.8,600+3e3*Math.abs(Math.sin(s*.03))),g===0&&y%4===0&&N(n,w),n+=r,s++}setTimeout(V,25)}};return V(),()=>{l=!1,a.gain.setTargetAtTime(0,e.currentTime,.2),setTimeout(()=>a.disconnect(),800)}}var qt=[3302,3570],ra=[1476,2508,2976],sa=(()=>{let t=new Uint32Array(256);for(let e=0;e<256;e++){let a=e;for(let i=0;i<8;i++)a=a&1?3988292384^a>>>1:a>>>1;t[e]=a>>>0}return t})();function Ht(t){let e=4294967295;for(let a of t)e=sa[(e^a)&255]^e>>>8;return(e^4294967295)>>>0}var la=[[1,0,0,0],[1,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,1,1],[0,0,0,1],[1,0,0,1],[0,0,0,0]],Ue=class{constructor(){this.supported=!!navigator.hid,this.device=null,this.kind=null,this.bt=!1,this.status=this.supported?"not connected":"unsupported",this.t=[{active:!1,x:.5,y:.5,id:-1},{active:!1,x:.5,y:.5,id:-1}],this.axes=[0,0,0,0],this.buttons=new Array(18).fill(0),this.lastReport=0,this.lastPadReport=0,this.onstatus=()=>{},this.seq=0,this.rumbleTimer=0,this.supported&&(navigator.hid.addEventListener("disconnect",e=>{e.device===this.device&&(this.device=null,this.set("not connected"))}),navigator.hid.addEventListener("connect",()=>this.autoConnect()))}set(e){this.status=e,this.onstatus(e)}get connected(){return!!this.device}get fresh(){return this.device&&performance.now()-this.lastPadReport<400}async autoConnect(){if(!this.supported||this.device)return!1;try{let a=(await navigator.hid.getDevices()).find(i=>i.vendorId===1356&&(qt.includes(i.productId)||ra.includes(i.productId)));if(a)return await this.open(a),!0}catch(e){console.warn(e)}return!1}async request(){if(!this.supported)return!1;try{window.eyecandy&&window.eyecandy.requestHid?await window.eyecandy.requestHid():await navigator.hid.requestDevice({filters:[{vendorId:1356}]})}catch(e){console.warn(e)}return this.autoConnect()}async open(e){try{e.opened||await e.open()}catch{this.set("could not open (close Steam / DS4Windows?)");return}this.device=e,this.kind=qt.includes(e.productId)?"ds5":"ds4";try{await e.receiveFeatureReport(this.kind==="ds5"?5:2)}catch{}e.addEventListener("inputreport",a=>this.parse(a)),this.set((this.kind==="ds5"?"DualSense":"DualShock 4")+" connected (touchpad + full controller)")}parse(e){let a=e.data,i=e.reportId,r=S=>a.getUint8(S),n=-1,s=-1;if(this.kind==="ds5"?i===1&&a.byteLength>=40?(n=0,s=32,this.bt=!1):i===49&&a.byteLength>=41?(n=1,s=33,this.bt=!0):i===1&&a.byteLength>=9&&(n=0,this.bt=!0):i===1&&a.byteLength>=42?(n=0,s=34,this.bt=!1):i===17&&a.byteLength>=44?(n=2,s=36,this.bt=!0):i===1&&a.byteLength>=9&&(n=0,this.bt=!0),n<0)return;let l=S=>(r(S)-128)/127.5,m=this.buttons;this.axes=[l(n),l(n+1),l(n+2),l(n+3)];let p,x,b,A,P;this.kind==="ds5"&&s>=0?(A=r(n+4),P=r(n+5),p=r(n+7),x=r(n+8),b=r(n+9)):(p=r(n+4),x=r(n+5),b=r(n+6),A=r(n+7),P=r(n+8));let C=la[Math.min(8,p&15)];if(m[2]=p>>4&1,m[0]=p>>5&1,m[1]=p>>6&1,m[3]=p>>7&1,m[4]=x&1,m[5]=x>>1&1,m[6]=A/255,m[7]=P/255,m[8]=x>>4&1,m[9]=x>>5&1,m[10]=x>>6&1,m[11]=x>>7&1,m[12]=C[0],m[15]=C[1],m[13]=C[2],m[14]=C[3],m[16]=b&1,m[17]=b>>1&1,this.lastPadReport=performance.now(),s<0)return;let L=this.kind==="ds5"?1079:942;for(let S=0;S<2;S++){let N=s+S*4,$=r(N),V=r(N+1),g=r(N+2),y=r(N+3),T=this.t[S];T.active=!($&128),T.id=$&127,T.active&&(T.x=Math.min(1,(V|(g&15)<<8)/1919),T.y=Math.min(1,(g>>4|y<<4)/L))}this.lastReport=performance.now()}asGamepad(){return{id:(this.kind==="ds5"?"DualSense":"DualShock 4")+" (HID, Vendor: 054c)",connected:!0,mapping:"standard",axes:this.axes,buttons:this.buttons.map(e=>({pressed:e>.5,value:e})),vibrationActuator:{playEffect:(e,a)=>this.rumble(a)}}}async rumble({duration:e=100,strongMagnitude:a=0,weakMagnitude:i=0}={}){if(!this.device)return;let n=Math.round(Math.min(1,a)*255),s=Math.round(Math.min(1,i)*255);try{await this.sendMotors(n,s),clearTimeout(this.rumbleTimer),this.rumbleTimer=setTimeout(()=>this.sendMotors(0,0).catch(()=>{}),e)}catch{}}async sendMotors(e,a){let i=this.device;if(i)if(this.kind==="ds5"){let r=new Uint8Array(47);if(r[0]=3,r[2]=a,r[3]=e,!this.bt)return i.sendReport(2,r);let n=new Uint8Array(77);n[0]=(this.seq=this.seq+1&15)<<4,n[1]=16,n.set(r,2);let s=Ht(new Uint8Array([162,49,...n.subarray(0,73)]));return n[73]=s&255,n[74]=s>>>8&255,n[75]=s>>>16&255,n[76]=s>>>24&255,i.sendReport(49,n)}else{if(!this.bt){let s=new Uint8Array(31);return s[0]=7,s[3]=a,s[4]=e,i.sendReport(5,s)}let r=new Uint8Array(77);r[0]=192,r[2]=7,r[5]=a,r[6]=e;let n=Ht(new Uint8Array([162,17,...r.subarray(0,73)]));return r[73]=n&255,r[74]=n>>>8&255,r[75]=n>>>16&255,r[76]=n>>>24&255,i.sendReport(17,r)}}};var d=t=>document.querySelector(t),Te=t=>[...document.querySelectorAll(t)],q=(t,e,a)=>Math.max(e,Math.min(a,t)),z=(t,e,a)=>t+(e-t)*a,I=window.eyecandy||null;I||document.addEventListener("DOMContentLoaded",()=>{},{once:!0});var $t="eyecandy.settings.v1",ca={resolution:"native",renderScale:"auto",autoExposure:!0,fpsCap:"0",uiScale:1,startFullscreen:!1,showFps:!1,autopilot:!0,autoInterval:30,autoSource:"mix",autoOnDrop:!0,idle:20,reactIntensity:1.4,idleDance:!0,beatRipples:!0,beatPulse:.8,beatFlash:.3,cameraShake:.5,beatSens:1,gainBass:1,gainMid:1,gainHigh:1,outputDevice:"default",rumble:!0,rumbleStrength:.7,deadzone:.14,stickSens:1,invertY:!1,touchMode:"both",transition:1.4,autoPause:!1,uiAutoHide:!0,volume:.85,seenGuide:!1},f={...ca,...JSON.parse(localStorage.getItem($t)||"{}")},Pe=()=>localStorage.setItem($t,JSON.stringify(f)),Q=d("#gl"),E;try{E=new Le(Q)}catch(t){throw document.body.innerHTML=`<div style="padding:40px;font:16px sans-serif;color:#fff">Eye Candy needs WebGL2.<br><br>${t.message}</div>`,t}var c=new ze;c.out.gain.value=f.volume;var v=new De;v.deadzone=f.deadzone;var D=new Ue;v.hid=D;var te={active:!1,x:.5,y:.5},F=It(),we=null,H=null,ee=null,Ce=null,Se=[],qe=null,pe=null,Vt={...Z,trail:0,zoom:1,warp:0,breathe:.15,bloom:.6,chroma:.8,grain:.25};function he(){return H?Promise.resolve():qe||(qe=new Promise((t,e)=>{let a=document.createElement("script");a.src="milk.js",a.onload=()=>{let i=window.EyeMilk;Ce={};for(let r of i.packs)try{Object.assign(Ce,r.getPresets?r.getPresets():r.default?.getPresets())}catch(n){console.warn(n)}Se=Object.keys(Ce).sort((r,n)=>r.localeCompare(n)),ee=document.createElement("canvas"),ee.width=1280,ee.height=720,H=i.butterchurn.createVisualizer(c.ctx,ee,{width:1280,height:720,pixelRatio:1,textureRatio:1}),H.connectAudio(c.input),t()},a.onerror=e,document.head.appendChild(a)}),qe)}function ua(t,e){if(!H)return;let a=Math.min(1,1280/t),i=Math.round(t*a),r=Math.round(e*a);(ee.width!==i||ee.height!==r)&&(ee.width=i,ee.height=r,H.setRendererSize(i,r))}function Re(t,e=2){!H||!Ce[t]||(H.loadPreset(Ce[t],e),pe=t)}var Ye=()=>Se[Math.floor(Math.random()*Se.length)],et=new Map;function ft(t){return et.has(t)||et.set(t,{id:"milk:"+t,name:t,engine:"milk",milk:t,fx:Ze(t,Vt,{trail:0,zoom:1,kaleido:0,mirror:0}),palette:0,builtin:!0}),et.get(t)}var fe="eye",u=structuredClone(J[0]),Be=structuredClone(u),W=0,o={camX:0,camY:0,roll:0,morphX:0,morphY:0,waitCenter:!1,time:0,timeScale:1,hue:0,burstT:9,flash:0,freeze:!1,lt:0,rt:0,transMix:0,lastSwitch:0,lastHuman:-1e9,kAngle:0,pal:null,flowX:0,flowY:0,hyper:0,autoT:0,panels:!0,cinema:!1,amX:0,amY:0,danceT:0,jolt:0,beatRipT:9,beatRipAmt:0,lastAutoBurst:0,lastStick:-1e9,lensRot:0,lensZoom:1,swirl:0,bulge:0,swirlT:0,bulgeT:0,burstCX:0,burstCY:0,pinch:null,touch:[{on:!1,x:0,y:0,vx:0,vy:0,s:0},{on:!1,x:0,y:0,vx:0,vy:0,s:0}]},Yt=t=>[...t.a,...t.b,...t.c,...t.d];o.pal=Yt(Ie(u.palette));var tt=[-1,-.5,.25,.5,.75,1,1.5,2,3,4];function dt(t){return t==="eye"?J:t==="user"?F:t==="milk"?Se.map(ft):J}function pt(){let t=ie[u.scene];if(!t)return[];let e=u.params.slice(),[a,i]=t.stick||[0,1],r=(o.waitCenter?0:o.morphX)+o.amX,n=(o.waitCenter?0:o.morphY)+o.amY,s=(l,m)=>{let p=t.params[l];p&&(e[l]=q(e[l]+m*(p.max-p.min)*.35,p.min,p.max))};return s(a,r),s(i,n),e}function G(t,e={}){t&&(e.transition!==!1&&E.fin&&(E.snapshot(),o.transMix=1),u=structuredClone(t),u.fx={...Z,...t.engine==="milk"?Vt:{},...t.fx},Be=structuredClone(u),o.waitCenter=Math.abs(o.morphX)+Math.abs(o.morphY)>.1,o.hue=u.fx.hueOffset||0,o.lastSwitch=performance.now(),o.camX=0,o.camY=0,o.lensRot=0,o.lensZoom=1,u.engine==="milk"?he().then(()=>Re(u.milk,e.transition===!1?0:2)):u.fx.fusion>0&&he().then(()=>{u.milk?Re(u.milk):pe||Re(Ye())}),u.engine==="scene"&&E.errors[u.scene]&&k("\u26A0","Scene failed to compile \u2014 skipping"),d("#presetName").textContent=u.name,j(),K(),e.quiet||k("\u25C6",u.name))}function re(t){let e=dt(fe);if(!e.length){fe==="milk"&&he().then(()=>{j(),re(t)});return}W=((W+t)%e.length+e.length)%e.length,G(e[W])}function ht(){if(u.engine==="milk"){u.fx={...u.fx,...Je({...u,scene:"none"}).fx},u.name=u.milk+" \u2684",d("#presetName").textContent=u.name,K(),k("\u2684","Randomized FX");return}G(Je(u),{quiet:!0}),k("\u2684","Randomized \xB7 "+u.name)}function vt(){G(Qe(),{quiet:!0}),k("\u2726","Generated \xB7 "+u.name)}function Wt(){let t=structuredClone(u);return t.engine==="scene"&&(t.params=pt().map(e=>+e.toFixed(4))),t.fx={...t.fx,hueOffset:(o.hue%1+1)%1,speed:+(t.fx.speed*Math.abs(o.timeScale)).toFixed(3)},t.engine==="scene"&&t.fx.fusion>0&&pe&&(t.milk=pe),t}function We(){let t=Wt();t.id="user-"+Date.now().toString(36),t.builtin=!1,(Be.builtin||!t.name||F.some(e=>e.name===t.name))&&(t.name=(t.engine==="milk"?"Milk \xB7 ":"")+Fe()),F.push(t),Me(F),u=structuredClone(t),Be=structuredClone(t),d("#presetName").textContent=u.name,j(),K(),k("\u2605","Saved \u201C"+t.name+"\u201D to My Presets"),v.rumble(.4,.6,120)}function ma(){let t=F.findIndex(a=>a.id===u.id);if(t<0)return We();let e=Wt();e.name=d("#pName").value||e.name,F[t]=e,Me(F),Be=structuredClone(e),u=structuredClone(e),o.timeScale=1,j(),k("\u2605","Updated \u201C"+e.name+"\u201D")}function fa(){let t=F.findIndex(e=>e.id===u.id);t<0||(F.splice(t,1),Me(F),j(),k("\u2716","Deleted"),re(0))}function ke(t=1,e=0,a=0){o.burstCX=e,o.burstCY=a,o.burstT=0,o.flash=.55*t,v.rumble(.9*t*f.rumbleStrength,.5*t*f.rumbleStrength,160)}function jt(t=1){let e=typeof u.palette=="number"?u.palette:-1;u.palette=((e+t)%X.length+X.length)%X.length,k(v.label("RB"),"Palette \xB7 "+X[u.palette].name),K()}var at=[0,3,4,5,6,8,12,16];function Kt(){let t=at.indexOf(u.fx.kaleido);u.fx.kaleido=at[(t+1)%at.length],k(v.label("LB"),u.fx.kaleido?"Kaleidoscope \xD7"+u.fx.kaleido:"Kaleidoscope off"),K()}function Zt(){u.fx.mirror=u.fx.mirror?0:1,k(v.label("LB"),u.fx.mirror?"Mirror world":"Mirror off"),K()}function Oe(t){let e=tt.indexOf(o.timeScale);e<0&&(e=5),e=q(e+t,0,tt.length-1),o.timeScale=tt[e],k(t>0?"\u25B2":"\u25BC",o.timeScale<0?"Time reversed \xD7"+Math.abs(o.timeScale):"Time \xD7"+o.timeScale)}function da(){o.camX=o.camY=o.roll=0,o.lensRot=0,o.lensZoom=1,o.timeScale=1,o.flowX=o.flowY=0,k(v.label("L3"),"View reset")}function pa(){u.engine==="scene"&&(u.params=pt(),o.waitCenter=!0,K(),k(v.label("R3"),"Shape locked in"),v.rumble(.2,.5,60))}function xt(t){f.autopilot=t,Pe(),d("#autoBtn").classList.toggle("on",t),k("\u27F3",t?"Autopilot on":"Autopilot off"),aa()}function ve(){o.lastHuman=performance.now()}function ha(t,e){let a=f.autopilot&&(!f.autoPause||e-o.lastHuman>f.idle*1e3);if(o.autoActive=a,!a)return;o.autoT+=t;let i=(e-o.lastSwitch)/1e3,r=f.autoOnDrop&&c.drop>1.1&&i>12;if(i>f.autoInterval||r){c.drop=0;let n=f.autoSource,s=Math.random();n==="generate"||n==="mix"&&s<.25?G(Qe(),{quiet:!0}):n==="milk"||n==="mix"&&s<.4||n==="all"&&s<.5?he().then(()=>G(ft(Ye()),{quiet:!0})):n==="user"&&F.length?G(F[Math.floor(Math.random()*F.length)],{quiet:!0}):(W=Math.floor(Math.random()*J.length),G(J[W],{quiet:!0})),r&&ke(.8)}}function va(t){if(v.poll(),v.justConnected&&(k("\u{1F3AE}",(v.style==="ps"?"PlayStation":"Xbox")+" controller connected"),v.rumble(.5,.8,200),f.seenGuide||(f.seenGuide=!0,Pe(),de(!0)),v.style==="ps"&&D.supported&&!D.connected&&!I&&(d("#tpChip").classList.remove("hidden"),setTimeout(()=>k("\u25C9","PlayStation pad: click \u201CEnable touchpad\u201D up top to use the touchpad"),1500)),kt()),!v.connected){o.lt=z(o.lt,0,t*6),o.rt=z(o.rt,0,t*6);return}let[e,a,i,r]=v.axes;if((v.pressed.some(Boolean)||Math.abs(e)+Math.abs(a)+Math.abs(i)+Math.abs(r)+v.lt+v.rt>.05)&&(ve(),d("#splash").classList.contains("gone")||xa(),f.uiAutoHide&&je()),!d("#controls").classList.contains("hidden")){(v.tap(R.B)||v.tap(R.A)||v.shortRelease(R.BACK))&&de(!1);return}let s=f.stickSens,l=f.invertY?-1:1;Math.abs(e)+Math.abs(a)+Math.abs(i)+Math.abs(r)>.05&&(o.lastStick=performance.now()),u.engine==="milk"?(o.lensRot+=e*t*1.8*s,o.lensZoom=q(o.lensZoom*Math.exp(a*l*t*1.3*s),.3,4),o.swirlT=i*1.5*s,o.bulgeT=-r*l*1.1*s):(o.camX+=e*t*1.5*s,o.camY=q(o.camY-a*l*t*1.1*s,-1.3,1.3),o.waitCenter&&Math.hypot(i,r)<.12&&(o.waitCenter=!1),o.morphX=z(o.morphX,q(i*s,-1.5,1.5),t*8),o.morphY=z(o.morphY,q(-r*l*s,-1.5,1.5),t*8),o.swirlT=i*.3*s,o.bulgeT=-r*l*.15*s),o.flowX=z(o.flowX,e,t*5),o.flowY=z(o.flowY,-a*l,t*5),o.lt=z(o.lt,v.lt,t*10),o.rt=z(o.rt,v.rt,t*10),v.lt>.08&&Math.random()<t*3&&mt("LT","Warp",v.lt),v.rt>.08&&Math.random()<t*3&&mt("RT","Drive",v.rt);let m=v.lt>.92&&v.rt>.92;if(m&&!o.hyperOn&&(k("\u2604","HYPERDRIVE"),ke(1.2)),o.hyperOn=m,v.tap(R.A)&&ke(1),v.tap(R.TOUCH)){let p=o.touch[0];ke(1.3,p.s>.1?p.x:0,p.s>.1?p.y:0),k("\u25C9","Touch burst")}v.style==="ps"&&D.supported&&!D.connected&&!o.tpTried&&(o.tpTried=!0,D.autoConnect().then(p=>{!p&&I&&D.request()})),o.freeze=v.down(R.B),v.tap(R.B)&&k(v.label("B"),"Freeze"),v.shortRelease(R.X)&&ht(),v.hold(R.X,550)&&(vt(),v.rumble(.6,.6,150)),v.tap(R.Y)&&We(),v.shortRelease(R.LB)&&Kt(),v.hold(R.LB,500)&&Zt(),v.shortRelease(R.RB)&&jt(1),v.down(R.RB)&&performance.now()-v.downAt[R.RB]>300&&(o.hue+=t*.5,Math.random()<t*2&&k(v.label("RB"),"Hue spin")),v.tap(R.RIGHT)&&re(1),v.tap(R.LEFT)&&re(-1),v.tap(R.UP)&&Oe(1),v.tap(R.DOWN)&&Oe(-1),v.tap(R.L3)&&da(),v.tap(R.R3)&&pa(),v.tap(R.START)&&(o.cinema=!1,gt(!0),ea()),v.shortRelease(R.BACK)&&de(!0),v.hold(R.BACK,700)&&xt(!f.autopilot)}function xa(){!c.playlist.length&&c.mode==="player"&&!we&&bt(),Ae()}function ga(t){let e=E.W&&E.H?E.W/E.H:1.7777777777777777,a;D.connected&&performance.now()-D.lastReport<600?a=D.t.map(n=>n.active?n:null):a=[te.active?te:null,null];for(let n=0;n<2;n++){let s=o.touch[n],l=a[n];if(l&&f.touchMode!=="off"){let m=(l.x-.5)*e,p=.5-l.y;s.on||(s.x=m,s.y=p,s.vx=s.vy=0);let x=(m-s.x)/Math.max(t,.001),b=(p-s.y)/Math.max(t,.001);s.vx=z(s.vx,x,.35),s.vy=z(s.vy,b,.35),s.x=m,s.y=p,s.on=!0,s.s=Math.min(1,s.s+t*3),ve()}else s.on=!1,s.s=Math.max(0,s.s-t*2),s.vx*=.9,s.vy*=.9}let[i,r]=o.touch;if(i.on&&r.on){let n=Math.hypot(i.x-r.x,i.y-r.y),s=Math.atan2(r.y-i.y,r.x-i.x);if(o.pinch){o.lensZoom=q(o.lensZoom*(n/Math.max(.02,o.pinch.d)),.3,4);let l=s-o.pinch.a;l>Math.PI&&(l-=2*Math.PI),l<-Math.PI&&(l+=2*Math.PI),o.lensRot+=l}o.pinch={d:n,a:s}}else o.pinch=null}var Nt=(t,e)=>[t.x,t.y,e?t.s*(o.pinch?.3:1):0,t.s>.01?1:0];function Jt(t){let e=o.pal,a=[];for(let i=0;i<3;i++)a.push(q(e[i]+e[3+i]*Math.cos(6.2831853*(e[6+i]*t+e[9+i]+o.hue)),0,1));return a}var it=performance.now(),He=0,nt=0,Ne=16,_e=0,oe=.8,ot=0;function Qt(t){requestAnimationFrame(Qt);let e=+f.fpsCap;if(e>0&&t-it<1e3/e-1.5)return;let a=Math.min(.05,(t-it)/1e3);it=t,va(a),ga(a);let i=u.fx,r=o.rt,n=o.lt,s=o.hyperOn?1:0;o.hyper=z(o.hyper,s,a*3),c.update(a,i.react*(1+r*1.6),{sens:f.beatSens,gB:f.gainBass,gM:f.gainMid,gH:f.gainHigh}),ha(a,t);let l=f.reactIntensity*i.react,m=f.idleDance?1:0;o.danceT+=a*(.5+c.vol*1.2);let p=o.danceT;o.amX=z(o.amX,m*l*i.dance*(Math.sin(p*.53)*.3*(.35+c.mid)+c.bass*.22*Math.sin(p*.19+1)),a*4),o.amY=z(o.amY,m*l*i.dance*(Math.cos(p*.41)*.25*(.35+c.high)+c.beat*.28),a*6);let x=m*Math.min(l,2)*i.dance*(Math.sin(p*.07+.5)*.18+Math.sin(p*.23)*c.mid*.06),b=m*Math.min(l,2)*i.dance*Math.sin(p*.11)*.08;u.engine==="milk"&&m>.5&&(o.lensRot+=a*l*i.swirlA*.05*Math.sin(p*.05),t-o.lastStick>4e3&&(o.lensZoom=z(o.lensZoom,1+Math.sin(p*.09)*.15*i.bulgeA,a*.2))),c.isBeat&&(o.jolt=(Math.random()-.5)*2,o.beatRipT=0,o.beatRipAmt=Math.min(1.6,c.bass*.9)*l*i.ripple,f.beatFlash>0&&c.bass>1.2&&t-o.lastAutoBurst>2200&&(o.flash=Math.max(o.flash,f.beatFlash*.5*Math.min(l,1.5)),o.lastAutoBurst=t)),o.jolt*=Math.exp(-a*7),o.beatRipT+=a,o.swirl=z(o.swirl,o.swirlT+Math.min(l,2)*m*i.swirlA*Math.sin(p*.17)*(.04+c.mid*.16),a*4),o.bulge=z(o.bulge,o.bulgeT+Math.min(l,2)*i.bulgeA*c.bass*.08,a*10),i.kaleido>1&&(o.kAngle+=a*c.mid*.25*l*Math.sin(p*.11));let A=window.devicePixelRatio||1,P=f.resolution==="native"?Math.round(innerHeight*Math.min(A,2)):+f.resolution,C=Math.round(P*innerWidth/Math.max(1,innerHeight));(Q.width!==C||Q.height!==P)&&(Q.width=C,Q.height=P),Ne=z(Ne,a*1e3,.05);let L;if(f.renderScale==="auto"){_e+=a;let _=e>0?1e3/e:16.7;_e>1.5&&(Ne>_*1.25&&oe>.4?(oe=Math.max(.4,oe-.08),_e=0):Ne<_*.88&&oe<1&&(oe=Math.min(1,oe+.05),_e=0)),L=Math.max(u.engine==="milk"?.7:.4,Math.round(oe*20)/20)}else L=q(+f.renderScale,.25,2);let S=E.fin;E.resize(C,P,L),S!==E.fin&&(E.transTex=null);let N=i.speed*o.timeScale*(1+r*1.2+o.hyper*2);o.freeze||(o.time+=a*N*(1+c.vol*.45*Math.min(l,2.5))),o.hue+=a*(i.hueSpin||0),o.kAngle+=a*(i.kaleidoSpin||0)*.5,o.burstT+=a,o.flash*=Math.exp(-a*6),o.transMix=Math.max(0,o.transMix-a/Math.max(.2,f.transition)),o.roll=z(o.roll,o.flowX*.25,a*2);let $=Yt(Ie(u.palette));for(let _=0;_<12;_++)o.pal[_]=z(o.pal[_],$[_],1-Math.exp(-a*2.5));if(E.uploadAudio(c.tex),(u.engine==="milk"||i.fusion>0)&&H){ua(Math.max(E.sw,Math.min(C,1280)),Math.max(E.sh,Math.round(Math.min(C,1280)*P/C)));try{H.render(),E.uploadMilk(ee)}catch(_){console.warn(_)}}let g=u.engine==="scene"?pt():[0,0,0,0,0,0,0,0];for(;g.length<8;)g.push(0);let y=c.beat*f.beatPulse*i.punch*.05*Math.min(l,2.5),T=c.beat*f.cameraShake*i.shake*Math.min(l,2)*.5,w=o.pal,M=f.touchMode==="both"||f.touchMode==="vortex",O=f.touchMode==="both"||f.touchMode==="paint",U=o.touch[0],le=i.trail>.15?c.bass*.05*Math.min(l,2):0;E.frame({adaptRate:1-Math.exp(-a*2.5),engine:u.engine==="milk"&&H?"milk":"scene",scene:u.engine==="milk"?"nebula":u.scene,sceneU:{uTime:o.time,uBass:c.bass,uMid:c.mid,uHigh:c.high,uVol:c.vol,uBeat:c.beat,uDrive:r,uBurst:o.burstT,uHue:o.hue,uBeatCount:c.beatCount,uAudio:E.audioTex,uP0:g.slice(0,4),uP1:g.slice(4,8),uPalA:w.slice(0,3),uPalB:w.slice(3,6),uPalC:w.slice(6,9),uPalD:w.slice(9,12),uCam:[o.camX+x,o.camY+b,o.roll+o.jolt*.06*f.cameraShake]},fbU:{uTime:o.time,uTrail:Math.min(.96,Math.max(i.trail+le,n*.9,o.hyper*.86)),uZoom:i.zoom+n*.035+o.hyper*.04+c.beat*f.beatPulse*.008*l,uSpin:i.spin+n*o.flowX*.03+o.jolt*.004*f.cameraShake,uWarp:i.warp+n*.8+c.mid*.3*Math.min(l,2),uHueDrift:i.hueDrift+n*.012+o.hyper*.05+c.high*.006*l,uKaleido:i.kaleido,uKaleidoSpin:o.kAngle,uMirror:i.mirror,uFusion:u.engine==="milk"?0:H?i.fusion:0,uBreathe:i.breathe+r*.6+c.bass*.35*Math.min(l,2),uMelt:i.melt+n*.5+c.high*.25*Math.min(l,2),uBass:c.bass,uBeat:c.beat,uBurstT:o.burstT,uBurstC:[o.burstCX,o.burstCY],uFlow:[o.flowX*n,o.flowY*n],uLensRot:o.lensRot+o.jolt*.025*f.cameraShake,uLensZoom:o.lensZoom,uLensPan:[0,0],uSwirl:o.swirl,uBulge:o.bulge,uPunch:y,uShake:T,uBeatRipT:f.beatRipples?o.beatRipT:9,uBeatRipAmt:o.beatRipAmt,uTouch:Nt(o.touch[0],M),uTouch2:Nt(o.touch[1],M),uTouchVel:[q(U.vx*.02,-.08,.08),q(U.vy*.02,-.08,.08)],uTouchColor:Jt(o.time*.05),uTouchPaint:O?1.2:0},finU:{uTime:t/1e3,uChroma:i.chroma+r*2+o.hyper*2+c.beat*1.2*Math.min(l,2),uBloomAmt:i.bloom*(1-o.hyper*.5)+r*.45,uAutoExp:f.autoExposure?1:0,uGrain:i.grain,uVignette:i.vignette,uBurstC:[o.burstCX,o.burstCY],uExposure:i.exposure*(1+r*.12-o.hyper*.15),uSat:i.saturation,uContrast:i.contrast+n*.06,uFlash:o.flash,uTransMix:o.transMix,uBurstT:o.burstT,uBeat:c.beat,uInvert:0}}),f.rumble&&v.connected&&c.isBeat&&performance.now()-o.lastHuman<3e4&&v.rumble(Math.min(1,c.bass*.45)*f.rumbleStrength*(.35+r),.15*f.rumbleStrength,70),o.hyperOn&&f.rumble&&Math.random()<a*10&&v.rumble(.25*f.rumbleStrength,.6*f.rumbleStrength,60),ot+=a,ot>1/30&&(ot=0,ba()),He+=a,nt++,He>.5&&(f.showFps?d("#fps").textContent=`${Math.round(nt/He)} fps \xB7 out ${C}\xD7${P} \xB7 render ${E.sw}\xD7${E.sh} (${Math.round(L*100)}%)`:d("#fps").textContent="",He=0,nt=0)}var me=document.documentElement.style,ge=document.getElementById("spec"),ue=ge?ge.getContext("2d"):null;function ba(){let t=e=>Jt(e).map(a=>Math.round(a*255)).join(",");if(me.setProperty("--c1",t(0)),me.setProperty("--c2",t(.33)),me.setProperty("--c3",t(.66)),me.setProperty("--bass",Math.min(1.5,c.bass).toFixed(3)),me.setProperty("--beat",c.beat.toFixed(3)),ue&&Ee.classList.contains("show")){let e=ge.width=ge.clientWidth*2,a=ge.height=ge.clientHeight*2;ue.clearRect(0,0,e,a);let i=48,r=e/i,n=ue.createLinearGradient(0,0,e,0);n.addColorStop(0,`rgb(${t(0)})`),n.addColorStop(.5,`rgb(${t(.33)})`),n.addColorStop(1,`rgb(${t(.66)})`),ue.fillStyle=n;for(let s=0;s<i;s++){let l=c.tex[Math.floor(s/i*400)]/255,m=Math.max(2,l*l*a);ue.globalAlpha=.35+l*.6,ue.fillRect(s*r+1,a-m,r-2,m)}ue.globalAlpha=1}}var Ge=d("#hud");function k(t,e){let a=document.createElement("div");for(a.className="toast",a.innerHTML=`<span class="g">${t}</span><span>${se(e)}</span>`,Ge.appendChild(a);Ge.children.length>3;)Ge.firstChild.remove();setTimeout(()=>{a.style.opacity=0,setTimeout(()=>a.remove(),450)},1700)}var _t={};function mt(t,e,a){let i=_t[t];(!i||!i.isConnected)&&(i=document.createElement("div"),i.className="toast",i.innerHTML=`<span class="g">${v.label(t)}</span><span>${e}</span><span class="bar"><i></i></span>`,Ge.appendChild(i),_t[t]=i),i.querySelector("i").style.width=Math.round(a*100)+"%",i.style.opacity=1,clearTimeout(i._t),i._t=setTimeout(()=>{i.style.opacity=0,setTimeout(()=>i.remove(),450)},900)}var se=t=>String(t).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),Ee=d("#ui"),Xe=0;function gt(t){o.cinema&&!t||(Ee.classList.add("show"),document.body.classList.remove("idle"),clearTimeout(Xe),f.uiAutoHide&&(Xe=setTimeout(()=>{(!Ee.matches(":hover")||t==="fromPad")&&je()},3500)))}function je(){d("#splash").classList.contains("gone")&&!document.activeElement?.matches("input,select")&&(Ee.classList.remove("show"),document.body.classList.add("idle"))}function ea(){o.panels=!o.panels,document.body.classList.toggle("panels-off",!o.panels)}window.addEventListener("mousemove",()=>gt());Ee.addEventListener("mouseleave",()=>{clearTimeout(Xe),f.uiAutoHide&&(Xe=setTimeout(je,1500))});function Ae(){d("#splash").classList.add("gone"),document.body.classList.add("started")}var ya={addFiles:()=>d("#fileIn").click(),addFolder:()=>d("#folderIn").click(),loopback:async()=>{try{be(),await c.useLoopback(),Ae(),k("\u{1F50A}","Listening to your PC audio")}catch(t){k("\u26A0",t.message||"Capture cancelled")}},mic:async()=>{try{be(),await c.useMic(),Ae(),k("\u{1F399}","Listening to microphone")}catch{k("\u26A0","Microphone unavailable")}},demo:()=>{bt(),Ae()},srcPlayer:()=>{be(),c.useSource("player"),c.playlist.length&&c.toggle()},prevPreset:()=>re(-1),nextPreset:()=>re(1),mutate:ht,generate:vt,save:We,overwrite:ma,revert:()=>{G(Be,{quiet:!0}),k("\u21BA","Reverted")},deletePreset:fa,autopilot:()=>xt(!f.autopilot),controls:()=>de(!0),fullscreen:yt,playPause:()=>{be(),c.toggle()},prevTrack:()=>c.prev(),nextTrack:()=>c.next(),shuffle:()=>{c.shuffle=!c.shuffle,$e()},repeat:()=>{c.repeat={all:"one",one:"off",off:"all"}[c.repeat],$e()},clearList:()=>{c.clear(),Pt()},exportPresets:()=>{let t=new Blob([JSON.stringify(F,null,2)],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(t),e.download="eye-candy-presets.json",e.click()},importPresets:()=>d("#importIn").click(),touchpad:async()=>{let t=await D.request();k("\u25C9",t?"Touchpad on \u2014 swipe to stir the visuals":"No PlayStation controller found"),d("#tpChip").classList.toggle("hidden",t)}};document.addEventListener("click",t=>{let e=t.target.closest("[data-act]");if(!e)return;c.resume();let a=ya[e.dataset.act];a&&a()});function bt(){we||(c.el.pause(),c.stopStream(),c.mode="demo",we=Ut(c),c.resume(),ta(),k("\u2726","Demo groove"))}function be(){we&&(we(),we=null,c.mode==="demo"&&(c.mode="player"))}async function yt(){if(I&&I.setFullscreen){I.setFullscreen(!await I.isFullscreen());return}document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{})}function de(t){kt(),d("#controls").classList.toggle("hidden",!t)}var Ta=/\.(mp3|flac|wav|ogg|oga|m4a|aac|opus|webm|wma|aiff?)$/i,Pa=t=>({name:t.name.replace(/\.[^.]+$/,""),url:URL.createObjectURL(t),path:I?I.pathFor(t):null});function Tt(t){let e=[...t].filter(a=>Ta.test(a.name)||(a.type||"").startsWith("audio/")).sort((a,i)=>(a.webkitRelativePath||a.name).localeCompare(i.webkitRelativePath||i.name,void 0,{numeric:!0}));if(!e.length)return k("\u26A0","No audio files found");be(),c.addTracks(e.map(Pa)),Ae(),Pt(),k("\u266B",`Added ${e.length} track${e.length>1?"s":""}`)}d("#fileIn").onchange=t=>{Tt(t.target.files),t.target.value=""};d("#folderIn").onchange=t=>{Tt(t.target.files),t.target.value=""};d("#importIn").onchange=async t=>{try{let e=JSON.parse(await t.target.files[0].text()),a=(Array.isArray(e)?e:[e]).filter(i=>i&&i.engine);a.forEach(i=>{i.id="user-"+Math.random().toString(36).slice(2),i.builtin=!1}),F.push(...a),Me(F),j(),k("\u2605",`Imported ${a.length} presets`)}catch{k("\u26A0","Could not read that file")}t.target.value=""};window.addEventListener("dragover",t=>t.preventDefault());window.addEventListener("drop",async t=>{t.preventDefault(),c.resume();let e=[...t.dataTransfer.items||[]],a=[],i=s=>new Promise(l=>{if(s.isFile)s.file(m=>{a.push(m),l()},l);else if(s.isDirectory){let m=s.createReader(),p=[],x=()=>m.readEntries(async b=>{if(b.length)p.push(...b),x();else{for(let A of p)await i(A);l()}},l);x()}else l()}),r=e.map(s=>s.webkitGetAsEntry&&s.webkitGetAsEntry()).filter(Boolean);if(r.length)for(let s of r)await i(s);else a.push(...t.dataTransfer.files);let n=a.find(s=>/\.json$/i.test(s.name));if(n&&a.length===1){d("#importIn").onchange({target:{files:[n],value:""}});return}Tt(a)});function wa(t){return"app://eye/media/"+encodeURIComponent(t)}function Pt(){I&&localStorage.setItem("eyecandy.playlist",JSON.stringify(c.playlist.filter(t=>t.path).map(t=>({name:t.name,path:t.path}))))}function ka(){if(I)try{let t=JSON.parse(localStorage.getItem("eyecandy.playlist")||"[]");c.playlist.push(...t.map(e=>({...e,url:wa(e.path)})))}catch{}}var Gt=t=>isFinite(t)?`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,"0")}`:"0:00";function $e(){let t=d("#playlist");c.playlist.length?t.innerHTML=c.playlist.map((e,a)=>`<li data-i="${a}" class="${a===c.index&&c.mode==="player"?"cur":""}"><span class="n">${a+1}</span><span class="t">${se(e.name)}</span><button class="x" data-x="${a}">\u2715</button></li>`).join(""):t.innerHTML='<li class="empty">Drop songs or folders here<br><small>mp3 \xB7 flac \xB7 wav \xB7 ogg \xB7 m4a</small></li>',d("#shuffleBtn").classList.toggle("on",c.shuffle),d("#repeatBtn").textContent={all:"\u21BB Repeat all",one:"\u21BB Repeat one",off:"\u2192 No repeat"}[c.repeat],d("#repeatBtn").classList.toggle("on",c.repeat!=="off"),ta()}d("#playlist").addEventListener("click",t=>{let e=t.target.closest("[data-x]");if(e){c.remove(+e.dataset.x),Pt();return}let a=t.target.closest("li[data-i]");a&&(be(),c.play(+a.dataset.i))});function ta(){let t=c.current,e=c.mode;d("#npTitle").textContent=e==="loopback"?"PC audio":e==="mic"?"Microphone":e==="demo"?"Demo groove":t?t.name:"Nothing playing",d("#npSub").textContent=e==="player"?t?`Track ${c.index+1} of ${c.playlist.length}`:"Drop music anywhere":"Live input",d("#playBtn").textContent=e==="player"&&!c.el.paused?"\u275A\u275A":"\u25B6";for(let[a,i]of[["#srcPlayer","player"],["#srcLoop","loopback"],["#srcMic","mic"],["#srcDemo","demo"]])d(a).classList.toggle("on",e===i)}c.onchange=$e;var Ve=d("#seek"),wt=!1;Ve.addEventListener("input",()=>{wt=!0});Ve.addEventListener("change",()=>{isFinite(c.el.duration)&&(c.el.currentTime=Ve.value/1e3*c.el.duration),wt=!1});d("#vol").value=Math.round(f.volume*100);d("#vol").addEventListener("input",t=>{f.volume=t.target.value/100,c.out.gain.value=f.volume,Pe()});setInterval(()=>{let t=c.el;!wt&&isFinite(t.duration)&&(Ve.value=t.currentTime/t.duration*1e3),d("#tCur").textContent=Gt(t.currentTime),d("#tDur").textContent=Gt(t.duration)},250);var rt=new Map;function Sa(t){if(t.engine==="milk"){let n=0;for(let s of t.name)n=(n*31+s.charCodeAt(0))%360;return`linear-gradient(90deg,hsl(${n},90%,55%),hsl(${(n+80)%360},90%,50%),hsl(${(n+160)%360},90%,55%))`}let e=JSON.stringify(t.palette);if(rt.has(e))return rt.get(e);let a=Ie(t.palette),i=[];for(let n=0;n<=4;n++){let s=n/4,l=[0,1,2].map(m=>Math.round(255*q(a.a[m]+a.b[m]*Math.cos(6.2831853*(a.c[m]*s+a.d[m])),0,1)));i.push(`rgb(${l})`)}let r=`linear-gradient(90deg,${i.join(",")})`;return rt.set(e,r),r}function j(){let t=d("#search").value.trim().toLowerCase(),e=dt(fe),a=d("#presetList");if(fe==="milk"&&!H){a.innerHTML='<li class="msg">Loading MilkDrop library\u2026</li>',he().then(j);return}if(fe==="user"&&!e.length){a.innerHTML=`<li class="msg">No saved presets yet.<br>Press \u2605 Save (or ${v.label("Y")} on the controller) to keep the current look.</li>`;return}let i=[];for(let n=0;n<e.length;n++){let s=e[n];if(t&&!s.name.toLowerCase().includes(t))continue;let l=s.engine==="milk"?"MilkDrop":ie[s.scene]?.name||"";if(i.push(`<li data-i="${n}" class="${s.id===u.id?"cur":""}"><span class="sw" style="background:${Sa(s)}"></span><span class="nm">${se(s.name)}</span><span class="s">${se(l)}</span></li>`),i.length>1500)break}a.innerHTML=i.join("");let r=a.querySelector(".cur");r&&!a.matches(":hover")&&r.scrollIntoView({block:"nearest"})}d("#presetList").addEventListener("click",t=>{let e=t.target.closest("li[data-i]");e&&(W=+e.dataset.i,G(dt(fe)[W]))});d("#search").addEventListener("input",j);Te(".cbtn").forEach(t=>t.onclick=()=>{Te(".cbtn").forEach(e=>e.classList.toggle("on",e===t)),fe=t.dataset.coll,W=-1,j()});Te(".tab").forEach(t=>t.onclick=()=>{Te(".tab").forEach(e=>e.classList.toggle("on",e===t)),Te(".tabpage").forEach(e=>e.classList.toggle("on",e.id==="tab-"+t.dataset.tab)),t.dataset.tab==="tweak"&&K()});var Ot=[["trail","Tracers",0,.97],["zoom","Tunnel Zoom",.96,1.06],["spin","Spin",-.03,.03],["warp","Warp",0,2],["breathe","Breathing",0,2],["melt","Melt",0,2],["hueDrift","Color Drift",-.05,.05],["hueSpin","Hue Cycle",-.3,.3],["kaleido","Kaleidoscope",0,16,1],["kaleidoSpin","Kaleido Spin",-1,1],["mirror","Mirror",0,1,1],["fusion","MilkDrop Fusion",0,1],["react","Audio Reactivity",0,2.5],["speed","Speed",0,3],["chroma","Chromatic",0,3],["bloom","Bloom",0,2],["exposure","Exposure",.4,2],["saturation","Saturation",0,2],["contrast","Contrast",.6,1.6],["grain","Film Grain",0,1],["vignette","Vignette",0,1.5],["#","Music motion"],["dance","Shape Dance",0,2.5],["ripple","Beat Ripples",0,2.5],["punch","Bass Punch",0,2.5],["shake","Beat Shake",0,2.5],["swirlA","Audio Swirl",0,2.5],["bulgeA","Bass Bulge",0,2.5]];d("#sceneSel").innerHTML=ae.map(t=>`<option value="${t.id}">${t.name}</option>`).join("")+'<option value="__milk">MilkDrop engine</option>';d("#palSel").innerHTML=X.map((t,e)=>`<option value="${e}">${t.name}</option>`).join("")+'<option value="custom">Custom (generated)</option>';function Xt(t,e,a,i,r,n,s){let l=document.createElement("div");l.className="sl "+(n||"");let m=r||(a-e)/400;l.innerHTML=`<span title="${se(t)}">${se(t)}</span><input type="range" min="${e}" max="${a}" step="${m}" value="${i}"><span class="v"></span>`;let p=l.querySelector("input"),x=l.querySelector(".v"),b=()=>x.textContent=(+p.value).toFixed(r===1?0:2);return b(),p.addEventListener("input",()=>{b(),s(+p.value),ve()}),l._set=A=>{document.activeElement!==p&&(p.value=A,b())},l}var st={},lt=[];function K(){if(!d("#tab-tweak").classList.contains("on"))return;d("#pName").value=u.name,d("#sceneSel").value=u.engine==="milk"?"__milk":u.scene,d("#palSel").value=typeof u.palette=="number"?String(u.palette):"custom",d("#milkRow").classList.toggle("hidden",!(u.engine==="milk"||u.fx.fusion>0)),H&&d("#milkSel").options.length!==Se.length&&(d("#milkSel").innerHTML=Se.map(n=>`<option>${se(n)}</option>`).join("")),H&&(d("#milkSel").value=u.engine==="milk"?u.milk:pe||"");let t=d("#paramSliders"),e=ie[u.scene],a=u.engine+":"+u.scene;t._key!==a?(t._key=a,t.innerHTML="",lt=[],u.engine==="scene"&&e?(e.params.forEach((n,s)=>{let l=Xt(n.n,n.min,n.max,u.params[s],0,(e.stick||[]).includes(s)?"stick":"",m=>{u.params[s]=m});lt.push(l),t.appendChild(l)}),d("#stickNames").textContent=(e.stick||[0,1]).map(n=>e.params[n].n).join(" & ")):(t.innerHTML='<p class="fine">MilkDrop presets carry their own math \u2014 shape them with the Trip FX below, the triggers, and the kaleidoscope.</p>',d("#stickNames").textContent="\u2014")):lt.forEach((n,s)=>n._set(u.params[s]));let i=d("#fxSliders");i.children.length?Ot.forEach(([n])=>{st[n]&&st[n]._set(u.fx[n]??Z[n]??0)}):Ot.forEach(([n,s,l,m,p])=>{if(n==="#"){let b=document.createElement("h3");b.textContent=s,i.appendChild(b);return}let x=Xt(s,l,m,u.fx[n]??0,p,"",b=>{u.fx[n]=b,n==="fusion"&&b>0&&he().then(()=>{pe||Re(Ye()),d("#milkRow").classList.remove("hidden"),K()})});st[n]=x,i.appendChild(x)});let r=F.some(n=>n.id===u.id);d("#overwriteBtn").classList.toggle("hidden",!r),d("#deleteBtn").classList.toggle("hidden",!r)}d("#pName").addEventListener("change",t=>{u.name=t.target.value,d("#presetName").textContent=u.name});d("#sceneSel").addEventListener("change",t=>{let e=t.target.value;if(e==="__milk"){he().then(()=>G(ft(pe||Ye())));return}let a=ie[e];G({...u,id:"edit-"+Date.now(),engine:"scene",scene:e,params:a.params.map(i=>i.def),name:a.name+" (custom)",builtin:!1},{quiet:!0})});d("#palSel").addEventListener("change",t=>{t.target.value!=="custom"&&(u.palette=+t.target.value)});d("#milkSel").addEventListener("change",t=>{let e=t.target.value;u.engine==="milk"?(u.milk=e,u.name=e,d("#presetName").textContent=e):u.milk=e,Re(e)});var Ma=[["#","Display"],["resolution","Output resolution","select",{native:"Native (match screen)",2160:"4K \xB7 2160p",1440:"1440p",1080:"1080p",900:"900p",720:"720p",540:"540p (potato mode)"}],["renderScale","Render scale","select",{auto:"Auto (adaptive)","0.5":"50%","0.67":"67%","0.75":"75%","0.85":"85%",1:"100%","1.25":"125% \xB7 supersampled","1.5":"150% \xB7 supersampled",2:"200% \xB7 supersampled"}],["fpsCap","Frame rate cap","select",{0:"Unlimited (VSync)",144:"144 fps",120:"120 fps",60:"60 fps",30:"30 fps"}],["autoExposure","Auto exposure","toggle","Keeps every preset from blowing out to white (or sinking to black)"],["startFullscreen","Start in fullscreen","toggle","Open straight into fullscreen next launch"],["uiScale","Interface size","range",[.75,1.5,.05,"\xD7"]],["uiAutoHide","Auto-hide interface","toggle","Panels fade away when you are not using the mouse"],["showFps","Show FPS & resolution","toggle",""],["#","Music reaction"],["reactIntensity","Reaction intensity","range",[0,3,.05,"\xD7"]],["idleDance","Music dance","toggle","Shapes, lens and camera always move with the music \u2014 your controller adds on top"],["beatRipples","Beat ripples","toggle","Every kick sends a shockwave through the image"],["beatPulse","Bass punch","range",[0,2,.05,"\xD7"]],["beatFlash","Drop flashes","range",[0,1,.05,""]],["cameraShake","Beat shake","range",[0,1.5,.05,""]],["beatSens","Beat sensitivity","range",[0,2,.05,""]],["gainBass","Bass gain","range",[0,3,.05,"\xD7"]],["gainMid","Mid gain","range",[0,3,.05,"\xD7"]],["gainHigh","Treble gain","range",[0,3,.05,"\xD7"]],["outputDevice","Audio output","select",{default:"System default"}],["#","Autopilot"],["autopilot","Autopilot","toggle","Keeps changing presets on its own, even while you play"],["autoPause","Pause autopilot while I play","toggle","Hold the current preset while you are using the controller"],["autoInterval","Time per preset","range",[8,120,1,"s"]],["autoSource","Autopilot plays","select",{mix:"Everything mixed",eye:"Eye Candy presets",generate:"Fresh generated presets",milk:"MilkDrop library",user:"My presets",all:"Eye Candy + MilkDrop"}],["autoOnDrop","Switch on drops","toggle","Jump to a new preset when the beat drops"],["idle","Resume after I stop playing","range",[3,120,1,"s"]],["transition","Transition length","range",[.2,4,.1,"s"]],["#","Controller"],["stickSens","Stick sensitivity","range",[.3,2.5,.05,"\xD7"]],["invertY","Invert Y axis","toggle",""],["deadzone","Stick deadzone","range",[0,.4,.01,""]],["rumble","Rumble","toggle","Feel the bass in your hands"],["rumbleStrength","Rumble strength","range",[0,1,.05,""]],["touchMode","PS touchpad / right-drag","select",{both:"Vortex + paint light",vortex:"Vortex only",paint:"Paint light only",off:"Off"}],["@touchpad"]],xe={deadzone:t=>v.deadzone=t,uiScale:t=>me.setProperty("--ui",t),outputDevice:t=>c.setOutput(t).then(e=>k("\u{1F508}",e?"Audio output changed":"Could not switch output")),renderScale:()=>{oe=.8},autopilot:t=>d("#autoBtn").classList.toggle("on",t)};async function Ca(t){try{(await navigator.mediaDevices.enumerateDevices()).filter(a=>a.kind==="audiooutput"&&a.deviceId!=="default").forEach(a=>{let i=document.createElement("option");i.value=a.deviceId,i.textContent=a.label||"Output "+a.deviceId.slice(0,5),t.appendChild(i)}),t.value=f.outputDevice}catch{}}function aa(){let t=d("#settingsForm");t.innerHTML="";for(let[e,a,i,r]of Ma){if(e==="#"){let s=document.createElement("h3");s.className="sethead",s.textContent=a,t.appendChild(s);continue}let n=document.createElement("div");if(n.className="set",e==="@touchpad"){n.innerHTML=`<div>PS touchpad<div class="d" id="tpStatus">${se(D.status)}</div></div><button class="mini" id="tpBtn">${D.connected?"Reconnect":"Connect"}</button>`,n.querySelector("#tpBtn").onclick=async()=>{let s=await D.request();k("\u25C9",s?"Touchpad connected \u2014 swipe to stir the visuals":"No PlayStation controller found")},t.appendChild(n);continue}if(i==="toggle")n.innerHTML=`<div>${a}<div class="d">${r}</div></div><div class="toggle ${f[e]?"on":""}"></div>`,n.querySelector(".toggle").onclick=s=>{f[e]=!f[e],s.target.classList.toggle("on",f[e]),Pe(),xe[e]&&xe[e](f[e])};else if(i==="select"){n.innerHTML=`<div>${a}</div><select>${Object.entries(r).map(([l,m])=>`<option value="${l}" ${String(f[e])===l?"selected":""}>${m}</option>`).join("")}</select>`;let s=n.querySelector("select");e==="outputDevice"&&Ca(s),s.onchange=l=>{f[e]=l.target.value,Pe(),xe[e]&&xe[e](f[e])}}else{let[s,l,m,p]=r;n.innerHTML=`<div>${a} <span class="d">${f[e]}${p}</span></div><input type="range" min="${s}" max="${l}" step="${m}" value="${f[e]}">`,n.querySelector("input").oninput=x=>{f[e]=+x.target.value,n.querySelector(".d").textContent=f[e]+p,Pe(),xe[e]&&xe[e](f[e])}}t.appendChild(n)}}D.onstatus=t=>{let e=document.getElementById("tpStatus");e&&(e.textContent=t),D.connected&&k("\u25C9",t)};function kt(){let t=a=>`<span class="k">${v.label(a)}</span>`,e=[["Left stick","Steer","Fly the camera / drag the trails"],["Right stick","Morph","Bend the two \u25C9 shape params live"],[t("LT"),"Warp","Squeeze into infinite feedback tunnels"],[t("RT"),"Drive","Overdrive audio reaction, bloom & speed"],[t("LT")+"+"+t("RT"),"Hyperdrive","Both triggers fully \u2014 hold on"],[t("LB"),"Kaleidoscope","Tap to cycle \xB7 hold for mirror world"],[t("RB"),"Palette","Tap next colors \xB7 hold to spin hues"],["\u25C0 \u25B6","Presets","Previous / next look"],["\u25B2 \u25BC","Time","Speed up, slow down, even reverse"],[t("A"),"Burst","Shockwave + flash. Hit it on the beat"],[t("B"),"Freeze","Hold to stop time while trails melt on"],[t("X"),"Randomize","Tap remix \xB7 hold for a brand-new preset"],[t("Y"),"Save","Keep this exact look in My Presets"],[t("L3"),"Reset view","Click left stick"],[t("R3"),"Lock shape","Click right stick to keep the morph"],[t("START"),"Menu","Show / hide the panels"],[t("BACK"),"This guide","Hold to toggle autopilot"],["Touchpad","Stir (PS)","Swipe to swirl & paint \xB7 pinch/twist with 2 fingers \xB7 click = burst"]];d("#cgrid").innerHTML=e.map(([a,i,r])=>`<div class="cg"><span class="k">${a.startsWith("<")?a.replace(/<\/?span[^>]*>/g,""):a}</span><div><b>${i}</b><small>${r}</small></div></div>`).join(""),Te("[data-g]").forEach(a=>a.textContent=v.label(a.dataset.g))}d("#controls").addEventListener("click",t=>{t.target.id==="controls"&&de(!1)});window.addEventListener("keydown",t=>{if(t.target.matches("input,select,textarea"))return;ve(),c.resume();let e=t.key;e==="ArrowRight"?re(1):e==="ArrowLeft"?re(-1):e==="ArrowUp"?Oe(1):e==="ArrowDown"?Oe(-1):e===" "?(t.preventDefault(),ke(1)):e==="r"||e==="R"?ht():e==="g"||e==="G"?vt():e==="s"||e==="S"?We():e==="k"||e==="K"?Kt():e==="m"||e==="M"?Zt():e==="p"||e==="P"?jt(1):e==="f"||e==="F"||e==="F11"?(t.preventDefault(),yt()):e==="h"||e==="H"?(o.cinema=!o.cinema,o.cinema?je():gt(),k("H",o.cinema?"Interface hidden (H to show)":"Interface on")):e==="Tab"?(t.preventDefault(),ea()):e==="a"||e==="A"?xt(!f.autopilot):e==="c"||e==="C"?de(d("#controls").classList.contains("hidden")):e==="Escape"?de(!1):e==="MediaPlayPause"?c.toggle():e==="MediaTrackNext"?c.next():e==="MediaTrackPrevious"&&c.prev()});var ye=null;Q.addEventListener("contextmenu",t=>t.preventDefault());Q.addEventListener("pointerdown",t=>{if(t.button===2){te.active=!0,te.x=t.clientX/innerWidth,te.y=t.clientY/innerHeight;return}if(t.button===1){ke(1,(t.clientX/innerWidth-.5)*innerWidth/innerHeight,.5-t.clientY/innerHeight);return}ye={x:t.clientX,y:t.clientY},ve()});window.addEventListener("pointerup",t=>{t.button===2&&(te.active=!1)});window.addEventListener("pointermove",t=>{te.active&&(te.x=t.clientX/innerWidth,te.y=t.clientY/innerHeight)});window.addEventListener("pointerup",()=>ye=null);window.addEventListener("pointermove",t=>{ye&&(o.camX+=(t.clientX-ye.x)*.004,o.camY=q(o.camY+(t.clientY-ye.y)*.003,-1.3,1.3),ye={x:t.clientX,y:t.clientY},ve())});Q.addEventListener("wheel",t=>{u.fx.trail=q(u.fx.trail-t.deltaY*8e-4,0,.97),mt("LT","Tracers",u.fx.trail/.97),ve(),K()},{passive:!0});Q.addEventListener("dblclick",yt);me.setProperty("--ui",f.uiScale);I&&f.startFullscreen&&I.setFullscreen&&I.setFullscreen(!0);f.outputDevice!=="default"&&c.setOutput(f.outputDevice);D.autoConnect();I||document.querySelectorAll("[data-act=loopback]").forEach(t=>{t.innerHTML=t.classList.contains("src")?"Tab/PC":"\u{1F50A} Visualize a tab or PC audio",t.title="Pick a tab (e.g. YouTube/Spotify web) or your whole screen and tick \u201CShare audio\u201D"});ka();$e();aa();j();kt();d("#autoBtn").classList.toggle("on",f.autopilot);d("#presetName").textContent=u.name;W=Math.floor(Math.random()*J.length);G(J[W],{transition:!1,quiet:!0});var ct=ae.map(t=>t.id),ut=0;(function t(){if(ut>=ct.length){d("#loadbar").style.opacity=0;return}E.sceneProg(ct[ut++]),d("#loadbar div").style.width=ut/ct.length*100+"%",setTimeout(t,0)})();requestAnimationFrame(Qt);window.__eye={startDemoGroove:bt,R:E,audio:c,L:o,get cur(){return u},loadPreset:G,BUILTIN:J,SCENES:ae,settings:f};})();
