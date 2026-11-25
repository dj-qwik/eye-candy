(()=>{var vi=Object.create;var xa=Object.defineProperty;var xi=Object.getOwnPropertyDescriptor;var gi=Object.getOwnPropertyNames;var yi=Object.getPrototypeOf,bi=Object.prototype.hasOwnProperty;var Pi=(a,e)=>()=>{try{return e||a((e={exports:{}}).exports,e),e.exports}catch(t){throw e=0,t}};var Ti=(a,e,t,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of gi(e))!bi.call(a,o)&&o!==t&&xa(a,o,{get:()=>e[o],enumerable:!(i=xi(e,o))||i.enumerable});return a};var wi=(a,e,t)=>(t=a!=null?vi(yi(a)):{},Ti(e||!a||!a.__esModule?xa(t,"default",{value:a,enumerable:!0}):t,a));var La=Pi((So,st)=>{(function(a,e){typeof define=="function"&&define.amd?define(e):typeof st<"u"&&st.exports?st.exports=e():window.ysFixWebmDuration=e()})("fix-webm-duration",function(){var a={172351395:{name:"EBML",type:"Container"},646:{name:"EBMLVersion",type:"Uint"},759:{name:"EBMLReadVersion",type:"Uint"},754:{name:"EBMLMaxIDLength",type:"Uint"},755:{name:"EBMLMaxSizeLength",type:"Uint"},642:{name:"DocType",type:"String"},647:{name:"DocTypeVersion",type:"Uint"},645:{name:"DocTypeReadVersion",type:"Uint"},108:{name:"Void",type:"Binary"},63:{name:"CRC-32",type:"Binary"},190023271:{name:"SignatureSlot",type:"Container"},16010:{name:"SignatureAlgo",type:"Uint"},16026:{name:"SignatureHash",type:"Uint"},16037:{name:"SignaturePublicKey",type:"Binary"},16053:{name:"Signature",type:"Binary"},15963:{name:"SignatureElements",type:"Container"},15995:{name:"SignatureElementList",type:"Container"},9522:{name:"SignedElement",type:"Binary"},139690087:{name:"Segment",type:"Container"},21863284:{name:"SeekHead",type:"Container"},3515:{name:"Seek",type:"Container"},5035:{name:"SeekID",type:"Binary"},5036:{name:"SeekPosition",type:"Uint"},88713574:{name:"Info",type:"Container"},13220:{name:"SegmentUID",type:"Binary"},13188:{name:"SegmentFilename",type:"String"},1882403:{name:"PrevUID",type:"Binary"},1868715:{name:"PrevFilename",type:"String"},2013475:{name:"NextUID",type:"Binary"},1999803:{name:"NextFilename",type:"String"},1092:{name:"SegmentFamily",type:"Binary"},10532:{name:"ChapterTranslate",type:"Container"},10748:{name:"ChapterTranslateEditionUID",type:"Uint"},10687:{name:"ChapterTranslateCodec",type:"Uint"},10661:{name:"ChapterTranslateID",type:"Binary"},710577:{name:"TimecodeScale",type:"Uint"},1161:{name:"Duration",type:"Float"},1121:{name:"DateUTC",type:"Date"},15273:{name:"Title",type:"String"},3456:{name:"MuxingApp",type:"String"},5953:{name:"WritingApp",type:"String"},103:{name:"Timecode",type:"Uint"},6228:{name:"SilentTracks",type:"Container"},6359:{name:"SilentTrackNumber",type:"Uint"},39:{name:"Position",type:"Uint"},43:{name:"PrevSize",type:"Uint"},35:{name:"SimpleBlock",type:"Binary"},32:{name:"BlockGroup",type:"Container"},33:{name:"Block",type:"Binary"},34:{name:"BlockVirtual",type:"Binary"},13729:{name:"BlockAdditions",type:"Container"},38:{name:"BlockMore",type:"Container"},110:{name:"BlockAddID",type:"Uint"},37:{name:"BlockAdditional",type:"Binary"},27:{name:"BlockDuration",type:"Uint"},122:{name:"ReferencePriority",type:"Uint"},123:{name:"ReferenceBlock",type:"Int"},125:{name:"ReferenceVirtual",type:"Int"},36:{name:"CodecState",type:"Binary"},13730:{name:"DiscardPadding",type:"Int"},14:{name:"Slices",type:"Container"},104:{name:"TimeSlice",type:"Container"},76:{name:"LaceNumber",type:"Uint"},77:{name:"FrameNumber",type:"Uint"},75:{name:"BlockAdditionID",type:"Uint"},78:{name:"Delay",type:"Uint"},79:{name:"SliceDuration",type:"Uint"},72:{name:"ReferenceFrame",type:"Container"},73:{name:"ReferenceOffset",type:"Uint"},74:{name:"ReferenceTimeCode",type:"Uint"},47:{name:"EncryptedBlock",type:"Binary"},106212971:{name:"Tracks",type:"Container"},46:{name:"TrackEntry",type:"Container"},87:{name:"TrackNumber",type:"Uint"},13253:{name:"TrackUID",type:"Uint"},3:{name:"TrackType",type:"Uint"},57:{name:"FlagEnabled",type:"Uint"},8:{name:"FlagDefault",type:"Uint"},5546:{name:"FlagForced",type:"Uint"},28:{name:"FlagLacing",type:"Uint"},11751:{name:"MinCache",type:"Uint"},11768:{name:"MaxCache",type:"Uint"},254851:{name:"DefaultDuration",type:"Uint"},216698:{name:"DefaultDecodedFieldDuration",type:"Uint"},209231:{name:"TrackTimecodeScale",type:"Float"},4991:{name:"TrackOffset",type:"Int"},5614:{name:"MaxBlockAdditionID",type:"Uint"},4974:{name:"Name",type:"String"},177564:{name:"Language",type:"String"},6:{name:"CodecID",type:"String"},9122:{name:"CodecPrivate",type:"Binary"},362120:{name:"CodecName",type:"String"},13382:{name:"AttachmentLink",type:"Uint"},1742487:{name:"CodecSettings",type:"String"},1785920:{name:"CodecInfoURL",type:"String"},438848:{name:"CodecDownloadURL",type:"String"},42:{name:"CodecDecodeAll",type:"Uint"},12203:{name:"TrackOverlay",type:"Uint"},5802:{name:"CodecDelay",type:"Uint"},5819:{name:"SeekPreRoll",type:"Uint"},9764:{name:"TrackTranslate",type:"Container"},9980:{name:"TrackTranslateEditionUID",type:"Uint"},9919:{name:"TrackTranslateCodec",type:"Uint"},9893:{name:"TrackTranslateTrackID",type:"Binary"},96:{name:"Video",type:"Container"},26:{name:"FlagInterlaced",type:"Uint"},5048:{name:"StereoMode",type:"Uint"},5056:{name:"AlphaMode",type:"Uint"},5049:{name:"OldStereoMode",type:"Uint"},48:{name:"PixelWidth",type:"Uint"},58:{name:"PixelHeight",type:"Uint"},5290:{name:"PixelCropBottom",type:"Uint"},5307:{name:"PixelCropTop",type:"Uint"},5324:{name:"PixelCropLeft",type:"Uint"},5341:{name:"PixelCropRight",type:"Uint"},5296:{name:"DisplayWidth",type:"Uint"},5306:{name:"DisplayHeight",type:"Uint"},5298:{name:"DisplayUnit",type:"Uint"},5299:{name:"AspectRatioType",type:"Uint"},963876:{name:"ColourSpace",type:"Binary"},1029411:{name:"GammaValue",type:"Float"},230371:{name:"FrameRate",type:"Float"},97:{name:"Audio",type:"Container"},53:{name:"SamplingFrequency",type:"Float"},14517:{name:"OutputSamplingFrequency",type:"Float"},31:{name:"Channels",type:"Uint"},15739:{name:"ChannelPositions",type:"Binary"},8804:{name:"BitDepth",type:"Uint"},98:{name:"TrackOperation",type:"Container"},99:{name:"TrackCombinePlanes",type:"Container"},100:{name:"TrackPlane",type:"Container"},101:{name:"TrackPlaneUID",type:"Uint"},102:{name:"TrackPlaneType",type:"Uint"},105:{name:"TrackJoinBlocks",type:"Container"},109:{name:"TrackJoinUID",type:"Uint"},64:{name:"TrickTrackUID",type:"Uint"},65:{name:"TrickTrackSegmentUID",type:"Binary"},70:{name:"TrickTrackFlag",type:"Uint"},71:{name:"TrickMasterTrackUID",type:"Uint"},68:{name:"TrickMasterTrackSegmentUID",type:"Binary"},11648:{name:"ContentEncodings",type:"Container"},8768:{name:"ContentEncoding",type:"Container"},4145:{name:"ContentEncodingOrder",type:"Uint"},4146:{name:"ContentEncodingScope",type:"Uint"},4147:{name:"ContentEncodingType",type:"Uint"},4148:{name:"ContentCompression",type:"Container"},596:{name:"ContentCompAlgo",type:"Uint"},597:{name:"ContentCompSettings",type:"Binary"},4149:{name:"ContentEncryption",type:"Container"},2017:{name:"ContentEncAlgo",type:"Uint"},2018:{name:"ContentEncKeyID",type:"Binary"},2019:{name:"ContentSignature",type:"Binary"},2020:{name:"ContentSigKeyID",type:"Binary"},2021:{name:"ContentSigAlgo",type:"Uint"},2022:{name:"ContentSigHashAlgo",type:"Uint"},206814059:{name:"Cues",type:"Container"},59:{name:"CuePoint",type:"Container"},51:{name:"CueTime",type:"Uint"},55:{name:"CueTrackPositions",type:"Container"},119:{name:"CueTrack",type:"Uint"},113:{name:"CueClusterPosition",type:"Uint"},112:{name:"CueRelativePosition",type:"Uint"},50:{name:"CueDuration",type:"Uint"},4984:{name:"CueBlockNumber",type:"Uint"},106:{name:"CueCodecState",type:"Uint"},91:{name:"CueReference",type:"Container"},22:{name:"CueRefTime",type:"Uint"},23:{name:"CueRefCluster",type:"Uint"},4959:{name:"CueRefNumber",type:"Uint"},107:{name:"CueRefCodecState",type:"Uint"},155296873:{name:"Attachments",type:"Container"},8615:{name:"AttachedFile",type:"Container"},1662:{name:"FileDescription",type:"String"},1646:{name:"FileName",type:"String"},1632:{name:"FileMimeType",type:"String"},1628:{name:"FileData",type:"Binary"},1710:{name:"FileUID",type:"Uint"},1653:{name:"FileReferral",type:"Binary"},1633:{name:"FileUsedStartTime",type:"Uint"},1634:{name:"FileUsedEndTime",type:"Uint"},4433776:{name:"Chapters",type:"Container"},1465:{name:"EditionEntry",type:"Container"},1468:{name:"EditionUID",type:"Uint"},1469:{name:"EditionFlagHidden",type:"Uint"},1499:{name:"EditionFlagDefault",type:"Uint"},1501:{name:"EditionFlagOrdered",type:"Uint"},54:{name:"ChapterAtom",type:"Container"},13252:{name:"ChapterUID",type:"Uint"},5716:{name:"ChapterStringUID",type:"String"},17:{name:"ChapterTimeStart",type:"Uint"},18:{name:"ChapterTimeEnd",type:"Uint"},24:{name:"ChapterFlagHidden",type:"Uint"},1432:{name:"ChapterFlagEnabled",type:"Uint"},11879:{name:"ChapterSegmentUID",type:"Binary"},11964:{name:"ChapterSegmentEditionUID",type:"Uint"},9155:{name:"ChapterPhysicalEquiv",type:"Uint"},15:{name:"ChapterTrack",type:"Container"},9:{name:"ChapterTrackNumber",type:"Uint"},0:{name:"ChapterDisplay",type:"Container"},5:{name:"ChapString",type:"String"},892:{name:"ChapLanguage",type:"String"},894:{name:"ChapCountry",type:"String"},10564:{name:"ChapProcess",type:"Container"},10581:{name:"ChapProcessCodecID",type:"Uint"},1293:{name:"ChapProcessPrivate",type:"Binary"},10513:{name:"ChapProcessCommand",type:"Container"},10530:{name:"ChapProcessTime",type:"Uint"},10547:{name:"ChapProcessData",type:"Binary"},39109479:{name:"Tags",type:"Container"},13171:{name:"Tag",type:"Container"},9152:{name:"Targets",type:"Container"},10442:{name:"TargetTypeValue",type:"Uint"},9162:{name:"TargetType",type:"String"},9157:{name:"TagTrackUID",type:"Uint"},9161:{name:"TagEditionUID",type:"Uint"},9156:{name:"TagChapterUID",type:"Uint"},9158:{name:"TagAttachmentUID",type:"Uint"},10184:{name:"SimpleTag",type:"Container"},1443:{name:"TagName",type:"String"},1146:{name:"TagLanguage",type:"String"},1156:{name:"TagDefault",type:"Uint"},1159:{name:"TagString",type:"String"},1157:{name:"TagBinary",type:"Binary"}};function e(l,f){l.prototype=Object.create(f.prototype),l.prototype.constructor=l}function t(l,f){this.name=l||"Unknown",this.type=f||"Unknown"}t.prototype.updateBySource=function(){},t.prototype.setSource=function(l){this.source=l,this.updateBySource()},t.prototype.updateByData=function(){},t.prototype.setData=function(l){this.data=l,this.updateByData()};function i(l,f){t.call(this,l,f||"Uint")}e(i,t);function o(l){return l.length%2===1?"0"+l:l}i.prototype.updateBySource=function(){this.data="";for(var l=0;l<this.source.length;l++){var f=this.source[l].toString(16);this.data+=o(f)}},i.prototype.updateByData=function(){var l=this.data.length/2;this.source=new Uint8Array(l);for(var f=0;f<l;f++){var u=this.data.substr(f*2,2);this.source[f]=parseInt(u,16)}},i.prototype.getValue=function(){return parseInt(this.data,16)},i.prototype.setValue=function(l){this.setData(o(l.toString(16)))};function n(l,f){t.call(this,l,f||"Float")}e(n,t),n.prototype.getFloatArrayType=function(){return this.source&&this.source.length===4?Float32Array:Float64Array},n.prototype.updateBySource=function(){var l=this.source.reverse(),f=this.getFloatArrayType(),u=new f(l.buffer);this.data=u[0]},n.prototype.updateByData=function(){var l=this.getFloatArrayType(),f=new l([this.data]),u=new Uint8Array(f.buffer);this.source=u.reverse()},n.prototype.getValue=function(){return this.data},n.prototype.setValue=function(l){this.setData(l)};function s(l,f){t.call(this,l,f||"Container")}e(s,t),s.prototype.readByte=function(){return this.source[this.offset++]},s.prototype.readUint=function(){for(var l=this.readByte(),f=8-l.toString(2).length,u=l-(1<<7-f),b=0;b<f;b++)u*=256,u+=this.readByte();return u},s.prototype.updateBySource=function(){for(this.data=[],this.offset=0;this.offset<this.source.length;this.offset=u){var l=this.readUint(),f=this.readUint(),u=Math.min(this.offset+f,this.source.length),b=this.source.slice(this.offset,u),x=a[l]||{name:"Unknown",type:"Unknown"},P=t;switch(x.type){case"Container":P=s;break;case"Uint":P=i;break;case"Float":P=n;break}var w=new P(x.name,x.type);w.setSource(b),this.data.push({id:l,idHex:l.toString(16),data:w})}},s.prototype.writeUint=function(l,f){for(var u=1,b=128;l>=b&&u<8;u++,b*=128);if(!f)for(var x=b+l,P=u-1;P>=0;P--){var w=x%256;this.source[this.offset+P]=w,x=(x-w)/256}this.offset+=u},s.prototype.writeSections=function(l){this.offset=0;for(var f=0;f<this.data.length;f++){var u=this.data[f],b=u.data.source,x=b.length;this.writeUint(u.id,l),this.writeUint(x,l),l||this.source.set(b,this.offset),this.offset+=x}return this.offset},s.prototype.updateByData=function(){var l=this.writeSections("draft");this.source=new Uint8Array(l),this.writeSections()},s.prototype.getSectionById=function(l){for(var f=0;f<this.data.length;f++){var u=this.data[f];if(u.id===l)return u.data}return null};function c(l){s.call(this,"File","File"),this.setSource(l)}e(c,s),c.prototype.fixDuration=function(l,f){var u=f&&f.logger;u===void 0?u=function(S){console.log(S)}:u||(u=function(){});var b=this.getSectionById(139690087);if(!b)return u("[fix-webm-duration] Segment section is missing"),!1;var x=b.getSectionById(88713574);if(!x)return u("[fix-webm-duration] Info section is missing"),!1;var P=x.getSectionById(710577);if(!P)return u("[fix-webm-duration] TimecodeScale section is missing"),!1;var w=x.getSectionById(1161);if(w)if(w.getValue()<=0)u(`[fix-webm-duration] Duration section is present, but the value is ${w.getValue()}`),w.setValue(l);else return u(`[fix-webm-duration] Duration section is present, and the value is ${w.getValue()}`),!1;else u("[fix-webm-duration] Duration section is missing"),w=new n("Duration","Float"),w.setValue(l),x.data.push({id:1161,data:w});return P.setValue(1e6),x.updateByData(),b.updateByData(),this.updateByData(),!0},c.prototype.toBlob=function(l){return new Blob([this.source.buffer],{type:l||"video/webm"})};function m(l,f,u,b){if(typeof u=="object"&&(b=u,u=void 0),!u)return new Promise(function(P){m(l,f,P,b)});try{var x=new FileReader;x.onloadend=function(){try{var P=new c(new Uint8Array(x.result));P.fixDuration(f,b)&&(l=P.toBlob(l.type))}catch{}u(l)},x.readAsArrayBuffer(l)}catch{u(l)}}return m.default=m,m})});var Ct=`#version 300 es
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
`,Ne=[],I=a=>Ne.push(a);I({fly:!0,id:"cathedral",name:"Fractal Cathedral",params:[{n:"Fold",min:.2,max:1.6,def:.85},{n:"Twist",min:0,max:1.5,def:.45},{n:"Scale",min:1.25,max:1.75,def:1.48},{n:"Glow",min:0,max:3,def:1.2},{n:"Flight",min:0,max:3,def:1},{n:"Tunnel",min:.2,max:1.4,def:.6},{n:"Pulse",min:0,max:2,def:1},{n:"Color Spread",min:0,max:2,def:.6}],stick:[0,1],code:`
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
}`});I({id:"nebula",name:"Nebula Tunnel",params:[{n:"Speed",min:0,max:4,def:1.2},{n:"Depth",min:.1,max:1.5,def:.55},{n:"Turbulence",min:.5,max:5,def:2.2},{n:"Ring Pulse",min:0,max:3,def:1.2},{n:"Stars",min:0,max:2,def:1},{n:"Spin",min:-1,max:1,def:.15},{n:"Brightness",min:.3,max:3,def:1.3},{n:"Petals",min:0,max:8,def:0}],stick:[2,1],code:`
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
}`});I({id:"julia",name:"Julia Bloom",params:[{n:"Seed Angle",min:0,max:6.283,def:2.1},{n:"Zoom",min:.4,max:4,def:1},{n:"Color Rate",min:.1,max:3,def:1},{n:"Audio Morph",min:0,max:2,def:.8},{n:"Trap Glow",min:0,max:3,def:1.2},{n:"Seed Radius",min:.6,max:.82,def:.7885,ms:.4},{n:"Swirl",min:-1,max:1,def:.1},{n:"Symmetry",min:1,max:8,def:1}],stick:[0,5],code:`
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
}`});I({fly:!0,id:"gyroid",name:"Gyroid Hyperspace",params:[{n:"Lattice",min:.8,max:5,def:2.2},{n:"Velocity",min:0,max:5,def:1.8},{n:"Thickness",min:.01,max:.3,def:.06},{n:"Glow",min:0,max:3,def:1.2},{n:"Detail",min:0,max:1,def:.4},{n:"Breath",min:0,max:2,def:1},{n:"Fog",min:.02,max:.3,def:.09},{n:"Hue Flow",min:0,max:2,def:.5}],stick:[0,2],code:`
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
}`});I({id:"chrome",name:"Liquid Chrome",params:[{n:"Blobs",min:2,max:8,def:6},{n:"Merge",min:.1,max:1.2,def:.55},{n:"Ripple",min:0,max:1,def:.35},{n:"Lights",min:2,max:20,def:7},{n:"Orbit",min:.3,max:2,def:1},{n:"Bass Swell",min:0,max:2,def:1},{n:"Iridescence",min:0,max:2,def:1},{n:"Env Bright",min:.3,max:2,def:1}],stick:[1,2],code:`
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
}`});I({landscape:!0,id:"horizon",name:"Neon Horizon",params:[{n:"Grid Speed",min:0,max:4,def:1.2},{n:"Sun Size",min:.1,max:.6,def:.32},{n:"Mountains",min:0,max:2,def:1},{n:"Grid Density",min:2,max:20,def:8},{n:"Terrain Warp",min:0,max:2,def:.6},{n:"Stars",min:0,max:2,def:1},{n:"Sun Stripes",min:0,max:24,def:10},{n:"Glow",min:.3,max:3,def:1.2}],stick:[4,2],code:`
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
}`});I({crisp:!0,id:"mandala",name:"Spectral Mandala",params:[{n:"Symmetry",min:3,max:24,def:12},{n:"Rings",min:1,max:10,def:6},{n:"Petal Size",min:0,max:1,def:.5},{n:"Line Width",min:.5,max:4,def:1.5},{n:"Spin",min:-1,max:1,def:.12},{n:"Wave Ring",min:0,max:2,def:1},{n:"Lace",min:0,max:2,def:1},{n:"Zoom",min:.5,max:2.5,def:1}],stick:[0,2],code:`
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
}`});I({id:"silk",name:"Silk Warp",params:[{n:"Scale",min:.5,max:6,def:2.2},{n:"Warp",min:0,max:3,def:1.2},{n:"Color Rate",min:.2,max:3,def:1.1},{n:"Flow",min:0,max:2,def:.6},{n:"Sheen",min:0,max:3,def:1.2},{n:"Bass Warp",min:0,max:2,def:1},{n:"Contrast",min:.5,max:3,def:1.4},{n:"Marble",min:0,max:1,def:0}],stick:[1,0],code:`
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
}`});I({id:"apollo",name:"Apollonian Dream",params:[{n:"Inversion",min:1,max:1.5,def:1.18,ms:.35},{n:"Orbit Speed",min:0,max:2,def:.6},{n:"Glow",min:0,max:3,def:1},{n:"Color Rate",min:.2,max:4,def:1.5},{n:"Distance",min:.5,max:3,def:1.4},{n:"Bass Breathe",min:0,max:1,def:.4},{n:"Fog",min:0,max:1,def:.3},{n:"Light",min:.3,max:2,def:1}],stick:[0,4],code:`
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
}`});I({id:"voronoi",name:"Stained Voronoi",params:[{n:"Cells",min:2,max:20,def:6},{n:"Motion",min:0,max:2,def:.7},{n:"Lead Width",min:0,max:.2,def:.05},{n:"Edge Glow",min:0,max:3,def:1.2},{n:"Audio Light",min:0,max:3,def:1.5},{n:"Layers",min:0,max:1,def:.5},{n:"Swirl",min:0,max:2,def:.4},{n:"Facets",min:0,max:1,def:.6}],stick:[0,6],code:`
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
}`});I({id:"wavefield",name:"Neon Wavefield",params:[{n:"Scroll",min:0,max:2,def:.35},{n:"Peak Height",min:0,max:2,def:1},{n:"Line Glow",min:.3,max:3,def:1.2},{n:"Spread",min:.2,max:1.5,def:.6},{n:"Wave Mix",min:0,max:1,def:.3},{n:"Fill",min:0,max:1,def:.85},{n:"Hue Depth",min:0,max:2,def:.8},{n:"Horizon",min:-.3,max:.3,def:.05}],stick:[1,3],code:`
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
}`});I({id:"starcore",name:"Star Core",params:[{n:"Plasma Scale",min:.5,max:5,def:2},{n:"Churn",min:0,max:3,def:1},{n:"Filaments",min:.2,max:3,def:1.2},{n:"Corona",min:0,max:3,def:1.2},{n:"Rays",min:0,max:3,def:1},{n:"Bass Flare",min:0,max:2,def:1},{n:"Core Heat",min:0,max:3,def:1.3},{n:"Size",min:.5,max:1.6,def:1}],stick:[0,3],code:`
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
}`});I({ss:2,id:"flower",name:"Flower of Life",params:[{n:"Lattice Scale",min:1,max:8,def:3},{n:"Rotation",min:-1,max:1,def:.08},{n:"Metatron",min:0,max:2,def:1},{n:"Line Width",min:.5,max:4,def:1.4},{n:"Layer Count",min:1,max:5,def:3},{n:"Bloom Pulse",min:0,max:2,def:1},{n:"Fill",min:0,max:1,def:.35},{n:"Depth Drift",min:0,max:2,def:.6}],stick:[0,7],code:`
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
}`});I({ss:2,id:"fall",name:"Endless Fall",params:[{n:"Fall Speed",min:-2,max:3,def:.8},{n:"Spiral",min:0,max:2,def:.6},{n:"Arms",min:1,max:12,def:5},{n:"Tile Detail",min:1,max:6,def:3},{n:"Glow",min:0,max:3,def:1.2},{n:"Audio Rings",min:0,max:3,def:1.2},{n:"Fractal Bite",min:0,max:1,def:.5},{n:"Twist Pulse",min:0,max:2,def:.6}],stick:[1,2],code:`
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
}`});I({ss:2,id:"hyper",name:"Hyperbolic Temple",params:[{n:"P (sides)",min:3,max:8,def:5},{n:"Q (meet)",min:3,max:8,def:4},{n:"Drift",min:0,max:2,def:.5},{n:"Line Glow",min:0,max:3,def:1.2},{n:"Cell Color",min:0,max:2,def:1},{n:"Spin",min:-1,max:1,def:.1},{n:"Disk Zoom",min:.6,max:1.6,def:1},{n:"Audio Fill",min:0,max:3,def:1.2}],stick:[2,6],code:`
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
}`});I({ss:2,id:"burst",name:"Supernova Burst",params:[{n:"Shards",min:20,max:200,def:90},{n:"Burst Force",min:0,max:3,def:1.3},{n:"Shell Count",min:1,max:6,def:3},{n:"Trail",min:0,max:2,def:1},{n:"Core",min:0,max:3,def:1.2},{n:"Spin",min:-1,max:1,def:.1},{n:"Shimmer",min:0,max:2,def:1},{n:"Warp",min:0,max:2,def:.5}],stick:[1,7],code:`
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
}`});I({ss:2,id:"fold",name:"Origami Fold",params:[{n:"Fold Angle",min:0,max:3.14,def:.3},{n:"Iterations",min:3,max:14,def:10},{n:"Scale",min:1.1,max:1.8,def:1.33,ms:.5},{n:"Offset",min:.3,max:1.2,def:.7},{n:"Glow",min:.3,max:3,def:1},{n:"Fold Pulse",min:0,max:2,def:1},{n:"Color Rate",min:0,max:3,def:1},{n:"Zoom",min:.3,max:4,def:1}],stick:[0,3],code:`
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
}`});var Ke=(a,e)=>`
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
}`,Ze=(a,e)=>[a,{n:"Orbit",min:0,max:1,def:.25},{n:"Glow",min:0,max:3,def:1},{n:"Color Rate",min:.2,max:4,def:1.2},{n:"Distance",min:1.6,max:7,def:4,ms:.3},{n:"Audio Morph",min:0,max:2,def:.8},{n:"Rim",min:0,max:3,def:1.2},e];I({camSens:.45,space:!0,id:"bulb",name:"Mandelbulb Shrine",params:Ze({n:"Power",min:2,max:12,def:8,ms:.1},{n:"Detail",min:4,max:10,def:7}),stick:[0,4],code:Ke(`
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
}`,"1.25")});I({camSens:.45,space:!0,id:"qjulia",name:"Julia Organism",params:Ze({n:"Mutation",min:0,max:1,def:.5,ms:.15},{n:"Drift",min:0,max:2,def:.6}),stick:[0,4],code:Ke(`
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
}`,"1.65")});I({camSens:.45,space:!0,id:"jbulb",name:"Living Bulb",params:Ze({n:"Base Power",min:3,max:10,def:6,ms:.08},{n:"Morph Range",min:0,max:3,def:2,ms:.2}),stick:[0,7],code:Ke(`
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
}`,"1.3")});I({camSens:.45,space:!0,id:"kifs",name:"Crystal Reliquary",params:Ze({n:"Twist",min:0,max:1,def:.35,ms:.25},{n:"Facet",min:.2,max:1,def:.55,ms:.3}),stick:[0,7],code:Ke(`
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
}`,"3.4")});I({fly:!0,id:"hextunnel",name:"Hex Temple",params:[{n:"Speed",min:0,max:4,def:1.4},{n:"Hex Size",min:2,max:14,def:6},{n:"Eyes",min:0,max:2,def:1},{n:"Glow",min:0,max:3,def:1.2},{n:"Warp",min:0,max:2,def:.6},{n:"Twist",min:-2,max:2,def:.4},{n:"Depth Fade",min:0,max:2,def:1},{n:"Glyphs",min:0,max:2,def:1}],stick:[5,4],code:`
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
}`});I({ss:2,id:"yantra",name:"Sri Yantra",params:[{n:"Triangles",min:3,max:12,def:9},{n:"Breathing",min:0,max:2,def:1},{n:"Lotus Petals",min:4,max:24,def:16},{n:"Line Width",min:.5,max:4,def:1.5},{n:"Spin",min:-1,max:1,def:.05},{n:"Halo",min:0,max:3,def:1.2},{n:"Fill Glow",min:0,max:2,def:.6},{n:"Zoom",min:.5,max:2,def:1}],stick:[1,6],code:`
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
}`});I({fly:!0,id:"menger",name:"Menger Crystal",params:[{n:"Speed",min:0,max:3,def:.8},{n:"Hole Size",min:.8,max:1.2,def:1,ms:.5},{n:"Glow",min:0,max:3,def:1.2},{n:"Color Rate",min:.2,max:3,def:1},{n:"Twist",min:0,max:1,def:.3},{n:"Bass Shake",min:0,max:2,def:.6},{n:"Fog",min:0,max:1,def:.4},{n:"Iterations",min:2,max:5,def:4}],stick:[4,1],code:`
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
}`});I({landscape:!0,id:"aurora",name:"Aurora Ocean",params:[{n:"Curtains",min:1,max:4,def:3},{n:"Flow",min:0,max:3,def:1},{n:"Height",min:.4,max:1.6,def:1},{n:"Brightness",min:.3,max:3,def:1.3},{n:"Reflection",min:0,max:1,def:.75},{n:"Waves",min:0,max:2,def:1},{n:"Stars",min:0,max:2,def:1},{n:"Audio Fold",min:0,max:3,def:1.2}],stick:[1,7],code:`
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
}`});I({id:"flux",name:"Flux",selfFeedback:!0,params:[{n:"Wave Size",min:.3,max:2,def:1},{n:"Wave Glow",min:.3,max:3,def:1},{n:"Flow Strength",min:0,max:3,def:1},{n:"Persistence",min:.8,max:.995,def:.965},{n:"Morph Time",min:4,max:40,def:14},{n:"Colour Flow",min:0,max:3,def:1},{n:"Map Spread",min:.2,max:3,def:1},{n:"Beat Sparks",min:0,max:2,def:1}],stick:[2,0],code:`
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
}`});var ki=`
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
`,L=a=>I({camSens:.5,...a,photo:!0,code:ki+a.code});L({id:"ph_mandala",name:"Photo Mandala",desc:"Slices of your photo mirrored into a turning kaleidoscope",params:[{n:"Segments",min:3,max:16,def:8,ms:.25},{n:"Spin",min:0,max:1,def:.3},{n:"Zoom",min:.3,max:3,def:1.1},{n:"Pan X",min:-1,max:1,def:0},{n:"Pan Y",min:-1,max:1,def:0},{n:"Bass Breath",min:0,max:2,def:1},{n:"Seam Glow",min:0,max:2,def:.8},{n:"Inner Swirl",min:0,max:2,def:.5}],stick:[3,4],code:`
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
}`});L({id:"ph_land",name:"Photo Terrain",desc:"Brightness becomes height: fly low over a landscape made of your photo \u2014 steer with the camera stick, look straight down to see the whole picture",fly:!0,calm:!0,steer:!0,camSens:.9,params:[{n:"Height",min:.2,max:2,def:.9},{n:"Speed",min:0,max:2,def:.6},{n:"Scale",min:.1,max:1,def:.35},{n:"Smooth",min:1,max:4,def:2.4},{n:"Spectrum Lift",min:0,max:2,def:.8},{n:"Sky Glow",min:0,max:2,def:1},{n:"Altitude",min:.3,max:6,def:.85,ms:.7},{n:"Banking",min:0,max:1,def:.5}],stick:[0,6],code:`
// detail level for a footprint of 'fp' world units: never finer than one screen pixel can show (no sub-pixel peaks to flicker)
uniform sampler2D uPhotoH;
uniform vec2 uFly;                                               // where you've flown to (integrated by the app as you steer)                                       // smooth 16-bit height map of the photo
float fpLod(float fp){ return log2(max(fp*P2*float(textureSize(uPhoto,0).y),1e-4)); }
float terrH(vec2 x, float fp){
  // P3 (Smooth) is measured against the full photo; the height map is ~4x smaller, so shift the detail level to match
  float hs=log2(float(textureSize(uPhoto,0).y)/float(textureSize(uPhotoH,0).y));
  float h=textureLod(uPhotoH,phUV(x*P2),max(max(P3,fpLod(fp)+1.)-hs,0.)).r*P0;
  // music lifts the land as a broad, smooth swell (no per-bin ridges rippling across the slopes)
  h+=(uBass*.55+fft(.02+.03*smoothstep(0.,12.,abs(x.x)))*.45)*.35*P4*smoothstep(.5,2.5,abs(x.x));
  return h;
}
void mainImage(out vec4 c, in vec2 fc){
  vec2 uv=UV(fc);
  float tt=uTime*.6*P1;
  // camera stick: X steers (you fly where you look), Y tilts from the horizon all the way to straight overhead
  float tilt=clamp(uCam.y/1.3,-1.,1.), down=max(tilt,0.);
  float pitch=tilt>0.?mix(.18,1.5708,tilt):.18+tilt*.45;
  float yaw=uCam.x*.9+cos(tt*.3)*.1*P7*(1.-down);
  vec2 fwd=vec2(-sin(yaw),cos(yaw)), rgt=vec2(cos(yaw),sin(yaw));
  float alt=P6+P0*.6+down*down*(2.+P0*2.5);                      // rise as you look down so the whole picture comes into view
  vec3 ro=vec3(0.,alt,0.); ro.xz=uFly*1.2*P1+rgt*sin(tt*.3)*1.5*(1.-down);
  vec3 rd=normalize(vec3(uv,1.4));
  rd.xy*=rot(sin(tt*.3)*.12*P7*(1.-down));
  rd.yz*=rot(pitch); rd.xz*=rot(yaw);
  float sy=rd.y;
  vec3 avg=photoL(vec2(0),9.);                                    // the photo's overall colour tints the sky
  vec3 sky=mix(sat(avg,1.4)*1.1+pal(.1)*.15, sat(avg,1.6)*.12, smoothstep(-.05,.55,sy));
  sky+=mix(pal(.1),sat(avg,2.),.5)*exp(-abs(sy-.03)*14.)*.45*P5*(.7+uBass*.5);
  vec3 col=sky;
  float maxH=P0*1.05+.35*P4+.02;
  float pxa=2.4/(uRes.y*1.4);                                      // world size of one pixel per unit of distance
  float t=.05, tmax=32.+alt*4.; bool hit=false;
  if(ro.y>maxH){ if(rd.y>=0.) tmax=0.; else t=(ro.y-maxH)/-rd.y; }
  float tp=t;
  for(int i=0;i<60;i++){ if(t>tmax) break;
    vec3 p=ro+rd*t; float fp=pxa*t; float h=p.y-terrH(p.xz,fp);
    if(h<fp*.5){ hit=true; break; }
    tp=t; t+=max(h*.62,fp);                                       // never jump further than the (pixel-wide) peaks
  }
  if(hit){
    for(int j=0;j<6;j++){ float tm=(tp+t)*.5; vec3 p=ro+rd*tm; if(p.y-terrH(p.xz,pxa*tm)<pxa*tm*.5) t=tm; else tp=tm; }
    vec3 p=ro+rd*t; float fp=pxa*t; vec2 e=vec2(max(.02,fp*1.5),0); float h0=terrH(p.xz,fp);
    vec3 nr=normalize(vec3(terrH(p.xz-e.xy,fp)-terrH(p.xz+e.xy,fp), 2.*e.x, terrH(p.xz-e.yx,fp)-terrH(p.xz+e.yx,fp)));   // centred differences
    // steep walls: colour from a smoothed patch of the photo instead of one texel smeared up the cliff (no flame-like streaks)
    float steep=smoothstep(.25,.85,1.-nr.y);
    vec3 alb=sat(photoL(p.xz*P2,max(mix(.5,4.,steep),fpLod(fp))),1.35);
    float dif=clamp(dot(nr,normalize(vec3(.4,.7,.6))),0.,1.);
    col=alb*(.45+.85*dif)+pal(.1)*pow(1.-max(nr.y,0.),3.)*.25;
    col+=pal(.6)*smoothstep(P0*.55,P0*1.05,h0)*kick()*.35;          // peak tops glow on the kick
    col=mix(col,sky,smoothstep(8.+alt*2.,tmax*.95,t));
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
}`});var Rt=`
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
}`});L({id:"ph_hyper",name:"Hyperbolic Photo",desc:"Your photo tiled across a hyperbolic disk, shrinking infinitely toward the rim",params:[{n:"P (sides)",min:3,max:8,def:4,ms:.2},{n:"Q (meet)",min:3,max:8,def:5,ms:.2},{n:"Drift",min:0,max:2,def:.5},{n:"Line Glow",min:0,max:2,def:.9},{n:"Photo Scale",min:.3,max:3,def:1.2},{n:"Spin",min:-1,max:1,def:.1},{n:"Disk Zoom",min:.6,max:1.5,def:1},{n:"Mirror Tint",min:0,max:1,def:.3}],stick:[4,6],code:Rt+`
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
}`});L({id:"ph_julia",name:"Photo Julia",desc:"Your photo poured through a living Julia-set fractal",params:[{n:"Morph",min:0,max:2,def:.5},{n:"Iterations",min:3,max:12,def:7,ms:.2},{n:"Photo Scale",min:.1,max:1.5,def:.45},{n:"Zoom",min:.6,max:2.5,def:1.3},{n:"Shape",min:-1,max:1,def:0},{n:"Depth Glow",min:0,max:2,def:.8},{n:"Bass Warp",min:0,max:2,def:1},{n:"Spin",min:0,max:1,def:.15}],stick:[4,3],code:Rt+`
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
}`});L({id:"ph_trap",name:"Orbit Trap",desc:"A Mandelbrot dive where your photo is caught in the fractal's orbits",params:[{n:"Dive",min:0,max:2,def:.6},{n:"Trap Size",min:.2,max:1.5,def:.6},{n:"Iterations",min:16,max:64,def:40,ms:.2},{n:"Glow",min:0,max:2,def:1},{n:"Spot",min:0,max:3,def:0,ms:.2},{n:"Spin",min:0,max:1,def:.2},{n:"Bass Pulse",min:0,max:2,def:1},{n:"Fill",min:0,max:1,def:.35}],stick:[1,3],code:Rt+`
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
}`});var Le=Ne,Ae=Ne.filter(a=>!a.photo),Je=Ne.filter(a=>a.photo),_=Object.fromEntries(Ne.map(a=>[a.id,a])),me=`#version 300 es
in vec2 aPos; void main(){ gl_Position=vec4(aPos,0,1); }`,ga=`#version 300 es
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
}`,ya=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes; out vec4 fragColor;
void main(){ vec2 uv=gl_FragCoord.xy/uRes; vec3 c=texture(uTex,uv).rgb; float l=max(c.r,max(c.g,c.b)); fragColor=vec4(c*smoothstep(.75,1.5,l),1); }`,ba=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes, uDir; out vec4 fragColor;
void main(){ vec2 uv=gl_FragCoord.xy/uRes; vec2 o=uDir/uRes; vec3 c=texture(uTex,uv).rgb*.227;
  c+=(texture(uTex,uv+o*1.38).rgb+texture(uTex,uv-o*1.38).rgb)*.316;
  c+=(texture(uTex,uv+o*3.23).rgb+texture(uTex,uv-o*3.23).rgb)*.07; fragColor=vec4(c,1); }`,Pa=`#version 300 es
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
}`,Ta=`#version 300 es
precision highp float; uniform sampler2D uSmall, uPrev; uniform float uRate; out vec4 fragColor;
void main(){ vec3 c=textureLod(uSmall, vec2(.5), 10.).rgb; float l=mix(dot(c,vec3(.3,.59,.11)), max(c.r,max(c.g,c.b)), .55); float pl=texture(uPrev, vec2(.5)).r; fragColor=vec4(mix(pl,l,uRate),0,0,1); }`,wa=`#version 300 es
precision highp float; uniform sampler2D uTex; uniform vec2 uRes; out vec4 fragColor;
void main(){ fragColor=texture(uTex, gl_FragCoord.xy/uRes); }`;var Qe=class{constructor(e){this.canvas=e;let t=this.gl=e.getContext("webgl2",{antialias:!1,alpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"});if(!t)throw new Error("WebGL2 is not available on this system.");this.halfFloat=!!t.getExtension("EXT_color_buffer_float"),t.getExtension("OES_texture_float_linear");let i=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,i),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),this.progs={},this.errors={},this.post={feedback:this.program(me,ga),bright:this.program(me,ya),blur:this.program(me,ba),final:this.program(me,Pa),blit:this.program(me,wa),adapt:this.program(me,Ta)},this.audioTex=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.audioTex),t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.texImage2D(t.TEXTURE_2D,0,t.R8,512,2,0,t.RED,t.UNSIGNED_BYTE,null),this.texParams(t.LINEAR,t.CLAMP_TO_EDGE),this.milkTex=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.milkTex),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,0,255])),this.texParams(t.LINEAR,t.CLAMP_TO_EDGE),this.photoTex=t.createTexture(),this.photoAR=1,this.photoId=null,this.photoHTex=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.photoTex),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([40,20,60,255])),this.aniso=t.getExtension("EXT_texture_filter_anisotropic"),this.scale=.75,this.fbIdx=0,this.finIdx=0,this.lumSmall=this.makeTarget(64,36),t.bindTexture(t.TEXTURE_2D,this.lumSmall.tex),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR_MIPMAP_LINEAR),t.generateMipmap(t.TEXTURE_2D),this.adapt=[this.makeTarget(1,1),this.makeTarget(1,1)],this.adIdx=0,this.W=0,this.H=0}texParams(e,t){let i=this.gl;i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,e),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,e),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,t),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,t)}shader(e,t){let i=this.gl,o=i.createShader(e);if(i.shaderSource(o,t),i.compileShader(o),!i.getShaderParameter(o,i.COMPILE_STATUS)){let n=i.getShaderInfoLog(o);throw i.deleteShader(o),new Error(n)}return o}program(e,t){let i=this.gl,o=i.createProgram();if(i.attachShader(o,this.shader(i.VERTEX_SHADER,e)),i.attachShader(o,this.shader(i.FRAGMENT_SHADER,t)),i.bindAttribLocation(o,0,"aPos"),i.linkProgram(o),!i.getProgramParameter(o,i.LINK_STATUS))throw new Error(i.getProgramInfoLog(o));let n={},s=i.getProgramParameter(o,i.ACTIVE_UNIFORMS);for(let c=0;c<s;c++){let m=i.getActiveUniform(o,c);n[m.name.replace(/\[0\]$/,"")]=i.getUniformLocation(o,m.name)}return{p:o,u:n}}sceneProg(e){let t=Le.find(s=>s.id===e),i=Math.min(t.ss||1,this.ssMax??4),o=i>1?e+"@"+i:e;if(this.progs[o])return this.progs[o];let n=Ct.replace(`#version 300 es
`,`#version 300 es
#define SS `+i+`
`)+t.code;try{this.progs[o]=this.program(me,n)}catch(s){this.errors[e]=String(s),console.error("Scene",e,s),this.progs[o]=null}return this.progs[o]}mapProg(e){let t=e+":map";if(this.progs[t]!==void 0)return this.progs[t];let i=Le.find(o=>o.id===e);try{this.progs[t]=this.program(me,Ct+i.map)}catch(o){this.errors[t]=String(o),console.error("Map",e,o),this.progs[t]=null}return this.progs[t]}precompile(e,t){let i=0,o=()=>{if(i>=e.length)return t&&t();this.sceneProg(e[i++]),setTimeout(o,0)};o()}makeTarget(e,t,i=!0){let o=this.gl,n=o.createTexture();o.bindTexture(o.TEXTURE_2D,n),i&&this.halfFloat?o.texImage2D(o.TEXTURE_2D,0,o.RGBA16F,e,t,0,o.RGBA,o.HALF_FLOAT,null):o.texImage2D(o.TEXTURE_2D,0,o.RGBA8,e,t,0,o.RGBA,o.UNSIGNED_BYTE,null),this.texParams(o.LINEAR,o.CLAMP_TO_EDGE);let s=o.createFramebuffer();return o.bindFramebuffer(o.FRAMEBUFFER,s),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,n,0),o.clearColor(0,0,0,1),o.clear(o.COLOR_BUFFER_BIT),{tex:n,fb:s,w:e,h:t}}freeTarget(e){e&&(this.gl.deleteTexture(e.tex),this.gl.deleteFramebuffer(e.fb))}resize(e,t,i){if(e===this.W&&t===this.H&&i===this.scaleUsed)return;let o=this.gl,n=Math.max(64,Math.round(e*i)),s=Math.max(64,Math.round(t*i)),c=[this.sceneT,...this.fb||[],...this.fin||[],this.bA,this.bB],m=this.fb;this.sceneT=this.makeTarget(n,s),this.fb=[this.makeTarget(n,s),this.makeTarget(n,s)],m&&this.drawTo(this.fb[this.fbIdx],this.post.blit,{uTex:m[this.fbIdx].tex}),!this.fin||e!==this.W||t!==this.H?((this.fin||[]).forEach(u=>this.freeTarget(u)),this.fin=[this.makeTarget(e,t,!1),this.makeTarget(e,t,!1)]):c.splice(c.indexOf(this.fin[0]),2);let l=Math.max(32,Math.round(n/4)),f=Math.max(32,Math.round(s/4));this.bA=this.makeTarget(l,f),this.bB=this.makeTarget(l,f),c.forEach(u=>{u&&!this.fin.includes(u)&&this.freeTarget(u)}),this.W=e,this.H=t,this.scaleUsed=i,this.sw=n,this.sh=s}drawTo(e,t,i,o){let n=this.gl;n.bindFramebuffer(n.FRAMEBUFFER,e?e.fb:null);let s=e?e.w:this.W,c=e?e.h:this.H;n.viewport(0,0,s,c),n.useProgram(t.p);let m=0;for(let[l,f]of Object.entries(i)){let u=t.u[l];u!=null&&(f instanceof WebGLTexture?(n.activeTexture(n.TEXTURE0+m),n.bindTexture(n.TEXTURE_2D,f),n.uniform1i(u,m++)):typeof f=="number"?n.uniform1f(u,f):f.length===2?n.uniform2fv(u,f):f.length===3?n.uniform3fv(u,f):f.length===4&&n.uniform4fv(u,f))}t.u.uRes,t.u.uRes&&n.uniform2f(t.u.uRes,s,c),n.drawArrays(n.TRIANGLES,0,3)}setPhoto(e,t){let i=this.gl;i.bindTexture(i.TEXTURE_2D,this.photoTex),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,e),i.generateMipmap(i.TEXTURE_2D),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR_MIPMAP_LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.MIRRORED_REPEAT),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.MIRRORED_REPEAT),this.aniso&&i.texParameterf(i.TEXTURE_2D,this.aniso.TEXTURE_MAX_ANISOTROPY_EXT,8),this.photoAR=e.width/e.height,this.photoId=t,this.buildHeight(e)}buildHeight(e){let t=this.gl,i=512,o=Math.min(1,i/Math.max(e.width,e.height)),n=Math.max(1,Math.round(e.width*o)),s=Math.max(1,Math.round(e.height*o)),c=document.createElement("canvas");c.width=n,c.height=s;let m=c.getContext("2d",{willReadFrequently:!0});m.drawImage(e,0,0,n,s);let l=m.getImageData(0,0,n,s).data,f=new Float32Array(n*s);for(let P=0;P<n*s;P++)f[P]=(l[P*4]*.299+l[P*4+1]*.587+l[P*4+2]*.114)/255;let u=new Float32Array(n*s);for(let P=0;P<s;P++)for(let w=0;w<n;w++){let S=0,U=0;for(let A=-1;A<=1;A++){let k=Math.min(s-1,Math.max(0,P+A));for(let y=-1;y<=1;y++){let C=Math.min(n-1,Math.max(0,w+y)),B=(y===0?2:1)*(A===0?2:1);S+=f[k*n+C]*B,U+=B}}u[P*n+w]=S/U}f=u;let b=(()=>{let P=new Float32Array(1),w=new Uint32Array(P.buffer);return S=>{P[0]=S;let U=w[0],A=U>>23&255,k=U&8388607,y=U>>16&32768;return A<113?y:A>142?y|31744:y|A-112<<10|k>>13}})();t.bindTexture(t.TEXTURE_2D,this.photoHTex),t.pixelStorei(t.UNPACK_ALIGNMENT,1);let x=0;for(;;){let P=new Uint16Array(n*s);for(let A=0;A<n*s;A++)P[A]=b(f[A]);if(t.texImage2D(t.TEXTURE_2D,x,t.R16F,n,s,0,t.RED,t.HALF_FLOAT,P),n===1&&s===1)break;let w=Math.max(1,n>>1),S=Math.max(1,s>>1),U=new Float32Array(w*S);for(let A=0;A<S;A++)for(let k=0;k<w;k++){let y=Math.min(n-1,k*2),C=Math.min(n-1,k*2+1),B=Math.min(s-1,A*2),E=Math.min(s-1,A*2+1);U[A*w+k]=(f[B*n+y]+f[B*n+C]+f[E*n+y]+f[E*n+C])/4}f=U,n=w,s=S,x++}t.pixelStorei(t.UNPACK_ALIGNMENT,4),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR_MIPMAP_LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.MIRRORED_REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.MIRRORED_REPEAT)}uploadAudio(e){let t=this.gl;t.bindTexture(t.TEXTURE_2D,this.audioTex),t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.texSubImage2D(t.TEXTURE_2D,0,0,0,512,2,t.RED,t.UNSIGNED_BYTE,e)}uploadMilk(e){let t=this.gl;t.bindTexture(t.TEXTURE_2D,this.milkTex),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!0),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1)}snapshot(){this.transTex=this.fin[this.finIdx].tex,this.finIdx^=1}frame(e){let t=this.post;if(e.engine==="scene"){let f=Le.find(b=>b.id===e.scene),u=this.sceneProg(e.scene);if(u&&f&&f.selfFeedback){(!this.selfT||this.selfT[0].w!==this.sceneT.w||this.selfT[0].h!==this.sceneT.h)&&((this.selfT||[]).forEach(w=>this.freeTarget(w)),this.selfT=[this.makeTarget(this.sceneT.w,this.sceneT.h),this.makeTarget(this.sceneT.w,this.sceneT.h)],this.selfIdx=0);let b=this.selfT[this.selfIdx],x=this.selfT[this.selfIdx^1];this.drawTo(x,u,{...e.sceneU,uSelf:b.tex}),this.selfIdx^=1;let P=this.mapProg(e.scene);P&&this.drawTo(this.sceneT,P,{...e.sceneU,uSelf:x.tex})}else u&&this.drawTo(this.sceneT,u,e.sceneU)}let i=e.engine==="milk"?this.milkTex:this.sceneT.tex,o=this.fb[this.fbIdx],n=this.fb[this.fbIdx^1];this.drawTo(n,t.feedback,{...e.fbU,uScene:i,uPrev:o.tex,uMilk:this.milkTex}),this.fbIdx^=1,this.drawTo(this.bA,t.bright,{uTex:n.tex});for(let f=0;f<2;f++)this.drawTo(this.bB,t.blur,{uTex:this.bA.tex,uDir:[1+f,0]}),this.drawTo(this.bA,t.blur,{uTex:this.bB.tex,uDir:[0,1+f]});this.drawTo(this.lumSmall,t.blit,{uTex:n.tex});let s=this.gl;s.bindTexture(s.TEXTURE_2D,this.lumSmall.tex),s.generateMipmap(s.TEXTURE_2D);let c=this.adapt[this.adIdx],m=this.adapt[this.adIdx^1];this.drawTo(m,t.adapt,{uSmall:this.lumSmall.tex,uPrev:c.tex,uRate:e.adaptRate??.04}),this.adIdx^=1;let l=this.fin[this.finIdx];this.drawTo(l,t.final,{...e.finU,uTex:n.tex,uBloom:this.bA.tex,uTrans:this.transTex||n.tex,uAdapt:m.tex}),this.drawTo(null,t.blit,{uTex:l.tex})}};var Si=`
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
`,et=class{constructor(e,t){if(this.ctx=e,this.ready=!1,this.T=0,this.conf=0,this.next=0,this.cand=null,this.hist=[],this.pendingHit=!1,this.locked=!1,this.lastEmit=-9,this.onBeat=()=>{},this.dbg={ticks:0,adv:0,reseed:0,hit:0,onsets:0},this.odf=new Float32Array(1024),this.odfN=0,this.odfHop=512/e.sampleRate,this.lastEst=0,!e.audioWorklet)return;let i=URL.createObjectURL(new Blob([Si],{type:"application/javascript"}));e.audioWorklet.addModule(i).then(()=>{this.node=new AudioWorkletNode(e,"kick-detector",{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[1],channelCount:2,channelCountMode:"explicit"});let o=e.createGain();o.gain.value=0,t.connect(this.node),this.node.connect(o),o.connect(e.destination),this.node.port.onmessage=n=>this.msg(n.data),this.ready=!0,this.timer=setInterval(()=>this.tick(),4)}).catch(o=>console.warn("beat worklet unavailable",o))}setSensitivity(e){this.node&&this.node.port.postMessage({k:Math.max(.3,1.55-e*.5)})}emit(e){if(e-this.lastEmit<Math.max(.2,this.T*.5))return;this.lastEmit=e;let t=Math.min(.15,(this.ctx.outputLatency||0)+(this.ctx.baseLatency||0));t>.005?setTimeout(()=>this.onBeat(),t*1e3):this.onBeat()}msg(e){if(e.odf!==void 0){this.odf[this.odfN++%this.odf.length]=e.odf,this.frame(e.t,e.fl);return}let t=e.on,i=e.s;if(this.dbg.onsets++,this.T>0&&this.next>0){let o=this.T,n=this.next-o,s=Math.abs(t-n)<Math.abs(t-this.next),c=s?t-n:t-this.next;Math.abs(c)<o*.2?(this.dbg.hit++,this.next+=c*(this.locked?.25:.5),this.T+=c*.015,s?this.lastScored||(this.lastHit=!0):this.earlyHit=!0):this.hist.length>=3&&!this.hist.slice(-3).some(Boolean)&&i>1.2&&(this.next=t+o,this.earlyHit=!1,this.lastHit=!0,this.lastScored=!1,this.phHist=null,this.dbg.reseed++)}else this.T>0&&(this.next=t+this.T);!this.locked&&i>1&&this.emit(t)}frame(e,t){if(!(this.T>0)||!(this.next>0)||!(t>0))return;let i=((e-this.next)/this.T%1+1)%1,o=this.phHist||(this.phHist=new Float32Array(16)),n=i*16,s=Math.floor(n)%16,c=n-Math.floor(n);o[s]+=t*(1-c),o[(s+1)%16]+=t*c}tick(){let e=this.ctx.currentTime;if(this.dbg.ticks++,e-this.lastEst>.5&&this.odfN>200&&(this.lastEst=e,this.estimateTempo()),!(this.T>0)||!(this.next>0))return;this.next<e-2&&(this.next=e+this.T,this.hist=[],this.locked=!1);let t=this.T;for(;e>=this.next;){this.dbg.adv++,this.locked&&this.emit(this.next),this.lastHit=!!this.earlyHit,this.earlyHit=!1,this.lastScored=!1,this.next+=t,this.sinceFlip=(this.sinceFlip||0)+1;let o=this.phHist;if(o){for(let l=0;l<16;l++)o[l]*=.92;let n=o[15]*.5+o[0]+o[1]*.5,s=0,c=0;for(let l=2;l<15;l++){let f=o[l-1]*.5+o[l]+o[l+1]*.5;f>c&&(c=f,s=l)}let m=this.locked?1.2:1.06;if(this.sinceFlip>(this.locked?6:3)&&c>n*m&&c>30){let l=(s>8?s-16:s)/16*t;for(this.next+=l;this.next<=e;)this.next+=t;let f=new Float32Array(16);for(let u=0;u<16;u++)f[u]=o[(u+s)%16];this.phHist=f,this.sinceFlip=0,this.dbg.flips=(this.dbg.flips||0)+1}}}let i=this.next-t;if(!this.lastScored&&e>=i+t*.2){this.lastScored=!0,this.hist.push(!!this.lastHit),this.hist.length>8&&this.hist.shift();let o=this.hist,n=e-(this.unlockedAt||-99)<8&&this.conf>.3,s=this.phHist,c=0;if(s)for(let m=0;m<16;m++)c+=s[m];if(!this.locked&&this.conf>.1&&c>40&&(o.length>=5&&o.slice(-5).filter(Boolean).length>=4||n&&o.length>=2&&o[o.length-1]&&o[o.length-2])){let m=0,l=-1;for(let f=0;f<16;f++){let u=s[(f+15)%16]*.5+s[f]+s[(f+1)%16]*.5;u>l&&(l=u,m=f)}if(m!==0){for(this.next+=(m>8?m-16:m)/16*t;this.next<=e;)this.next+=t;let f=new Float32Array(16);for(let u=0;u<16;u++)f[u]=s[(u+m)%16];this.phHist=f,this.hist=[],this.sinceFlip=0}else this.locked=!0}else this.locked&&(o.length>=3&&!o[o.length-1]&&!o[o.length-2]&&!o[o.length-3]||this.conf<.05)&&(this.locked=!1,this.unlockedAt=e)}}estimateTempo(){let e=Math.min(this.odfN,this.odf.length),t=new Float32Array(e),i=0;for(let k=0;k<e;k++)t[k]=this.odf[(this.odfN-e+k)%this.odf.length],i+=t[k];i/=e;let o=0;for(let k=0;k<e;k++)t[k]-=i,o+=t[k]*t[k];if(o<=0)return;let n=this.odfHop,s=Math.floor(60/190/n),c=Math.ceil(60/68/n),m=new Float32Array(c*2+2);for(let k=s;k<=Math.min(c*2+1,e-1);k++){let y=0;for(let C=k;C<e;C++)y+=t[C]*t[C-k];m[k]=y/o}let l=k=>m[k]+.5*(m[2*k]||0),f=-1,u=0;for(let k=s;k<=c;k++){let y=60/(k*n),C=Math.exp(-.5*(Math.log2(y/128)/1.1)**2),B=l(k)*C;B>f&&(f=B,u=k)}let x=(k=>{let y=m[k-1]||0,C=m[k],B=m[k+1]||0,E=y-2*C+B;return k+(E<0?.5*(y-B)/E:0)})(u)*n;if(!(this.T>0)){this.T=x,this.conf=m[u];return}let P=Math.round(this.T/n),w=P>=s&&P<=c?l(P):0;if(this.conf=Math.max(m[u],P<m.length?m[P]:0),Math.abs(x/this.T-1)<.04){this.T=this.T*.8+x*.2,this.cand=null,this.candN=0;return}let S=x/this.T,A=Math.abs(S-2)<.1||Math.abs(S-.5)<.05?1.6:1.25;l(u)>w*A?this.cand&&Math.abs(x/this.cand-1)<.04?++this.candN>=3&&(this.T=x,this.cand=null,this.candN=0,this.locked=!1,this.hist=[]):(this.cand=x,this.candN=1):(this.cand=null,this.candN=0)}get bpm(){return this.T>0?60/this.T:0}};var tt=class{constructor(){this.ctx=new(window.AudioContext||window.webkitAudioContext)({latencyHint:"interactive"}),this.el=new Audio,this.el.crossOrigin="anonymous",this.el.preload="auto",this.elSrc=this.ctx.createMediaElementSource(this.el),this.input=this.ctx.createGain(),this.analyser=this.ctx.createAnalyser(),this.analyser.fftSize=2048,this.analyser.smoothingTimeConstant=.55,this.out=this.ctx.createGain(),this.elSrc.connect(this.input),this.input.connect(this.analyser),this.elSrc.connect(this.out),this.out.connect(this.ctx.destination),this.freq=new Uint8Array(1024),this.time=new Uint8Array(2048),this.tex=new Uint8Array(512*2),this.bass=0,this.mid=0,this.high=0,this.vol=0,this.beat=0,this.beatCount=0,this.peak={b:.2,m:.2,h:.2,v:.2},this.bassAvg=0,this.lastBeat=0,this.drop=0,this.playlist=[],this.index=-1,this.shuffle=!1,this.repeat="all",this.mode="player",this.stream=null,this.streamSrc=null,this.onchange=()=>{},this.tracker=new et(this.ctx,this.input),this.tracker.onBeat=()=>{this.pendingBeat=!0},this.el.addEventListener("ended",()=>this.next(!0)),this.el.addEventListener("play",()=>this.onchange()),this.el.addEventListener("pause",()=>this.onchange());let e=this.ctx.sampleRate/2;this.binMap=new Float32Array(512);for(let t=0;t<512;t++){let i=30*Math.pow(533.3333333333334,t/511);this.binMap[t]=Math.min(1023,i/e*1024)}}async setOutput(e){try{return this.ctx.setSinkId?await this.ctx.setSinkId(e==="default"?"":e):this.el.setSinkId&&await this.el.setSinkId(e),!0}catch(t){return console.warn(t),!1}}resume(){this.ctx.state!=="running"&&this.ctx.resume()}addTracks(e){let t=this.playlist.length===0;this.playlist.push(...e),t&&e.length&&this.play(0),this.onchange()}remove(e){this.playlist.splice(e,1),e<this.index?this.index--:e===this.index&&(this.index=Math.min(this.index,this.playlist.length-1),this.index>=0?this.play(this.index):this.el.pause()),this.onchange()}clear(){this.playlist=[],this.index=-1,this.el.pause(),this.el.removeAttribute("src"),this.onchange()}async play(e){if(!(e<0||e>=this.playlist.length)){this.useSource("player"),this.index=e,this.el.src=this.playlist[e].url,this.resume();try{await this.el.play()}catch(t){console.warn(t)}this.onchange()}}toggle(){if(this.resume(),this.mode!=="player"&&this.useSource("player"),this.index<0&&this.playlist.length)return this.play(0);this.el.paused?this.el.play():this.el.pause()}next(e){if(!this.playlist.length)return;if(this.repeat==="one"&&e)return this.play(this.index);let t=this.shuffle?Math.floor(Math.random()*this.playlist.length):this.index+1;if(t>=this.playlist.length){if(this.repeat==="off"&&e)return;t=0}this.play(t)}prev(){if(this.el.currentTime>3){this.el.currentTime=0;return}this.play((this.index-1+this.playlist.length)%Math.max(1,this.playlist.length))}get current(){return this.playlist[this.index]}stopStream(){this.stream&&(this.stream.getTracks().forEach(e=>e.stop()),this.stream=null),this.streamSrc&&(this.streamSrc.disconnect(),this.streamSrc=null)}useSource(e){e==="player"&&this.mode!=="player"&&(this.stopStream(),this.mode="player",this.onchange())}async useLoopback(){this.resume();let e=await navigator.mediaDevices.getDisplayMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1},video:!0,systemAudio:"include",selfBrowserSurface:"exclude"});if(e.getVideoTracks().forEach(t=>t.stop()),!e.getAudioTracks().length)throw new Error("No audio was shared \u2014 pick a tab or \u201CEntire screen\u201D and turn on \u201CShare audio\u201D.");this.attachStream(e,"loopback")}async useMic(){this.resume();let e=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});this.attachStream(e,"mic")}attachStream(e,t){this.el.pause(),this.stopStream(),this.stream=e,this.streamSrc=this.ctx.createMediaStreamSource(e),this.streamSrc.connect(this.input),this.mode=t,this.onchange()}update(e,t=1,i={}){let o=i.sens??1,n=i.gB??1,s=i.gM??1,c=i.gH??1,m=this.analyser;m.getByteFrequencyData(this.freq),m.getByteTimeDomainData(this.time);let l=this.ctx.sampleRate/2,f=this.freq,u=(R,q)=>{let V=Math.max(1,Math.floor(R/l*1024)),Q=Math.max(V+1,Math.floor(q/l*1024)),_e=0;for(let le=V;le<Q;le++)_e+=f[le];return _e/(Q-V)/255},b=u(25,160)*n,x=u(160,2200)*s,P=u(2200,12e3)*c,w=0;for(let R=0;R<2048;R+=4){let q=(this.time[R]-128)/128;w+=q*q}w=Math.sqrt(w/512);let S=this.peak,U=Math.pow(.25,e/8);S.b=Math.max(b,S.b*U,.05),S.m=Math.max(x,S.m*U,.05),S.h=Math.max(P,S.h*U,.03),S.v=Math.max(w,S.v*U,.02);let A=(R,q,V,Q)=>R+(q-R)*(1-Math.exp(-e*(q>R?V:Q))),k=Math.min(2.5,t);this.bass=A(this.bass,Math.pow(b/S.b,1.6)*k,30,8),this.mid=A(this.mid,Math.pow(x/S.m,1.4)*k,20,6),this.high=A(this.high,Math.pow(P/S.h,1.3)*k,25,7),this.vol=A(this.vol,w/S.v*k,15,4),this.bassAvg=this.bassAvg+(b-this.bassAvg)*(1-Math.exp(-e*2));let y=1-Math.exp(-e*1.4);this.bMean=(this.bMean??b)+(b-(this.bMean??b))*y;let C=(b-this.bMean)*(b-this.bMean);this.bVar=(this.bVar??.001)+(C-(this.bVar??.001))*y;let B=Math.sqrt(this.bVar),E=this.bMean+(1.25-o*.4)*B+.015,F=performance.now()/1e3;this.isBeat=!1,this.tracker.ready?(this.sensSent!==o&&(this.sensSent=o,this.tracker.setSensitivity(o)),this.pendingBeat&&(this.pendingBeat=!1,this.lastBeat=F,this.beat=1,this.beatCount++,this.isBeat=!0)):!this.above&&b>E&&b>.1&&F-this.lastBeat>.16?(this.lastBeat=F,this.beat=1,this.beatCount++,this.isBeat=!0,this.above=!0):this.above&&b<this.bMean+.3*B&&(this.above=!1),this.beat*=Math.exp(-e*7),this.drop=this.drop*Math.exp(-e*.5)+Math.max(0,b-this.bassAvg*1.6)*e*4;for(let R=0;R<512;R++){let q=this.binMap[R],V=Math.floor(q),Q=q-V,_e=f[V]*(1-Q)+f[Math.min(1023,V+1)]*Q;this.tex[R]=Math.min(255,_e*(1+R/512*.8))}for(let R=0;R<512;R++)this.tex[512+R]=this.time[R*2]}};var D={A:0,B:1,X:2,Y:3,LB:4,RB:5,LT:6,RT:7,BACK:8,START:9,L3:10,R3:11,UP:12,DOWN:13,LEFT:14,RIGHT:15,TOUCH:17},at=class{constructor(){this.prev=[],this.downAt=[],this.held=[],this.axes=[0,0,0,0],this.lt=0,this.rt=0,this.connected=!1,this.id="",this.deadzone=.14,this.style="xbox",this.lastInput=0,this.gp=null}poll(){let e=navigator.getGamepads?navigator.getGamepads():[],t=null;for(let x of e)if(x&&x.connected){t=x;break}this.hid&&this.hid.fresh&&(t=this.hid.asGamepad()),!t&&this.touch&&this.touch.active&&(t=this.touch.asGamepad()),this.gp=t;let i=this.connected;if(this.connected=!!t,this.justConnected=!i&&this.connected,!t){this.pressed=[],this.released=[];return}this.id=t.id,this.style=t.id==="Touch controls"?"touch":/054c|playstation|dualsense|dualshock/i.test(t.id)||/wireless controller/i.test(t.id)&&!/xbox|xinput|045e/i.test(t.id)?"ps":"xbox";let o=performance.now();this.pressed=[],this.released=[];let n=Math.min(t.buttons.length,18);for(let x=0;x<n;x++){let P=t.buttons[x],w=typeof P=="object"?P.value:P,S=typeof P=="object"&&P.pressed||w>.5;S&&!this.prev[x]&&(this.pressed[x]=!0,this.downAt[x]=o,this.held[x]=!1,this.lastInput=o),!S&&this.prev[x]&&(this.released[x]=!0),this.prev[x]=S}let s=x=>{let P=Math.abs(x);return P<this.deadzone?0:Math.sign(x)*((P-this.deadzone)/(1-this.deadzone))},c=t.axes,m=(x,P)=>{let w=Math.hypot(x,P);if(w<this.deadzone)return[0,0];let S=(w-this.deadzone)/(1-this.deadzone)/w;return[x*S,P*S]},[l,f]=m(c[0]||0,c[1]||0),[u,b]=m(c[2]||0,c[3]||0);this.axes=[l,f,u,b],this.lt=t.buttons[6]?t.buttons[6].value:0,this.rt=t.buttons[7]?t.buttons[7].value:0,Math.abs(l)+Math.abs(f)+Math.abs(u)+Math.abs(b)+this.lt+this.rt>.05&&(this.lastInput=o)}down(e){return!!this.prev[e]}tap(e){return!!this.pressed[e]}hold(e,t){return this.prev[e]&&!this.held[e]&&performance.now()-this.downAt[e]>t?(this.held[e]=!0,!0):!1}shortRelease(e){return!!this.released[e]&&!this.held[e]}rumble(e,t,i=80){let o=this.gp;if(!(!o||!o.vibrationActuator))try{o.vibrationActuator.playEffect("dual-rumble",{duration:i,strongMagnitude:Math.min(1,e),weakMagnitude:Math.min(1,t)})}catch{}}label(e){return this.style==="touch"?{A:"\u2738",B:"B",X:"\u2684",Y:"\u2605",LB:"\u2756",RB:"\u25D1",LT:"WARP",RT:"DRIVE",BACK:"?",START:"\u2630",L3:"L",R3:"R"}[e]||e:this.style==="ps"?{A:"\u2715",B:"\u25CB",X:"\u25A1",Y:"\u25B3",LB:"L1",RB:"R1",LT:"L2",RT:"R2",BACK:"Create",START:"Options",L3:"L3",R3:"R3"}[e]||e:{A:"A",B:"B",X:"X",Y:"Y",LB:"LB",RB:"RB",LT:"LT",RT:"RT",BACK:"View",START:"Menu",L3:"LS",R3:"RS"}[e]||e}};var Z=[{name:"Acid Rainbow",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.33,.67]},{name:"Psilocybin",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[.8,.9,.3]},{name:"Synthwave",a:[.55,.3,.6],b:[.45,.3,.4],c:[1,1,1],d:[0,.15,.25]},{name:"Aurora",a:[.3,.55,.5],b:[.3,.45,.45],c:[1,1,1],d:[.55,.25,.3]},{name:"Molten Gold",a:[.6,.4,.2],b:[.4,.35,.2],c:[1,1,1],d:[0,.1,.2]},{name:"Deep Ocean",a:[.2,.4,.6],b:[.2,.35,.4],c:[1,1,1],d:[.3,.2,.1]},{name:"Toxic",a:[.4,.6,.3],b:[.4,.4,.4],c:[1,1.5,1],d:[.2,0,.5]},{name:"Candy",a:[.65,.5,.65],b:[.35,.45,.35],c:[1,1,1],d:[0,.5,.25]},{name:"Infrared",a:[.5,.2,.25],b:[.5,.3,.3],c:[1,1,1.5],d:[0,.1,.6]},{name:"Ultraviolet",a:[.45,.25,.65],b:[.45,.3,.35],c:[1,2,1],d:[.6,.1,0]},{name:"Ice Fire",a:[.5,.5,.5],b:[.5,.5,.5],c:[.5,.5,.5],d:[0,.15,.5]},{name:"Peacock",a:[.4,.5,.5],b:[.4,.4,.5],c:[2,1,1],d:[.5,.2,.25]},{name:"Sunset Dream",a:[.6,.4,.4],b:[.4,.4,.3],c:[1,1,1],d:[0,.2,.45]},{name:"Emerald Temple",a:[.25,.5,.35],b:[.25,.45,.3],c:[1,1,2],d:[.6,.3,.5]},{name:"Holographic",a:[.6,.6,.7],b:[.4,.4,.3],c:[2,2,2],d:[0,.33,.67]},{name:"Blacklight",a:[.35,.2,.55],b:[.35,.45,.45],c:[1.5,1,1],d:[.35,.7,.1]}],ae={trail:.55,zoom:1.01,spin:0,warp:.3,hueDrift:0,kaleido:0,kaleidoSpin:0,mirror:0,breathe:.4,melt:0,chroma:1,bloom:.8,grain:.3,vignette:.6,exposure:1,saturation:1.1,contrast:1.05,react:1,speed:1,fusion:0,hueSpin:0,dance:1,ripple:1,punch:1,shake:1,swirlA:1,bulgeA:1};function Lt(a){let e=2166136261;for(let t of a)e=Math.imul(e^t.charCodeAt(0),16777619)>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}var Mi={trail:[.1,.62],zoom:[.995,1.018],spin:[-.006,.006],warp:[0,1],breathe:[.1,1.2],melt:[0,.6],hueDrift:[-.01,.01],hueSpin:[-.05,.05],kaleidoSpin:[-.3,.3],chroma:[.4,1.6],bloom:[.35,.85],exposure:[.95,1.08],saturation:[1,1.4],contrast:[1,1.12],grain:[.08,.45],vignette:[.3,.95],react:[.8,1.5],speed:[.7,1.45],dance:[.4,1.9],ripple:[.3,1.7],punch:[.4,1.7],shake:[.15,1.4],swirlA:[.3,1.9],bulgeA:[.3,1.7]};function it(a,e=ae,t={}){let i=Lt(a),o={...ae,...e};for(let[n,[s,c]]of Object.entries(Mi))o[n]=+(s+i()*(c-s)).toFixed(4);return e.trail===0&&(o.trail=0),e.zoom===1&&(o.zoom=1),{...o,...t}}var g=(a,e,t,i={},o=0)=>{let n=_[a],s=Lt(e+"#shape"),c=n.params.map((l,f)=>{if(t[f]!==void 0)return t[f];let u=l.def+(s()-.5)*.16*(l.max-l.min);return+Math.max(l.min,Math.min(l.max,u)).toFixed(4)}),m=it(e,ae,i);return n.fly&&(m.trail=Math.min(m.trail,i.trail!==void 0?.3:.08+s()*.17)),n.selfFeedback&&i.trail===void 0&&(m.trail=s()*.15),n.crisp&&(m.trail=Math.min(m.trail,.28),m.melt=Math.min(m.melt,.2)),{id:"eye-"+e.toLowerCase().replace(/[^a-z0-9]+/g,"-"),name:e,engine:"scene",scene:a,params:c,palette:o,fx:m,builtin:!0}};var be=[g("cathedral","Cathedral of Echoes",[],{trail:.45},0),g("cathedral","Infinite Basilica",[1.1,.2,1.42,1.3,1.4,.95],{trail:.35,kaleido:0},4),g("cathedral","Neon Spine",[.55,1.1,1.6,1.3,2,.75,1.5,1.4],{trail:.5,zoom:1.012,hueDrift:.006},15),g("cathedral","Gothic Mushroom Vault",[.95,.7,1.5,1.2,.7,1.05,1,1.8],{breathe:.8,melt:.4,trail:.35},1),g("nebula","Warp Nebula",[],{},9),g("nebula","Wormhole Petals",[2,.4,3.2,1.6,1,.3,1.1,6],{kaleido:6,trail:.4},0),g("nebula","Cosmic Drain",[.6,.9,1.5,2.5,.4,-.6,1.2],{spin:.01,trail:.7,zoom:.985},5),g("julia","Julia Bloom",[],{},0),g("julia","Dendrite Garden",[1.2,1.3,.6,1.2,2,.76,.2,6],{trail:.4},13),g("julia","Paisley Mind",[2.6,.8,1.8,1,1.5,.79,-.4,1],{breathe:1.2,melt:.5},1),g("julia","Electric Lace",[4.2,1.6,2.4,1.5,2.8,.7885,.3,4],{kaleido:0,trail:.6,hueDrift:.02},15),g("gyroid","Gyroid Hyperspace",[],{},9),g("gyroid","Coral Lungs",[1.4,.8,.15,1.4,.7,1.8,.06,.3],{breathe:1.5,trail:.5},12),g("gyroid","Light Speed Lattice",[3,4.5,.03,1.6,.2,.6,.05,1.6],{trail:.5,zoom:1.02,chroma:1.6},0),g("chrome","Liquid Chrome",[],{},14),g("chrome","Mercury Heartbeat",[4,.9,.15,4,.6,2,.4,1.3],{trail:.3},10),g("chrome","Oil Slick Orbit",[8,.35,.7,12,1.6,1,2,1],{trail:.5,breathe:.8},1),g("horizon","Neon Horizon",[],{},2),g("horizon","Outrun Forever",[2.5,.38,1.5,10,1.2,1.5,14,1.5],{trail:.4,chroma:2},2),g("horizon","Hallucinated Highway",[1.5,.25,1.2,6,2,1,6,1.4],{breathe:1.2,melt:1,trail:.6,hueDrift:.01},0),g("mandala","Spectral Mandala",[],{},0),g("mandala","Lotus Reactor",[8,8,.8,2,.05,1.4,1.4,1.1],{trail:.6,zoom:1.015},7),g("mandala","Chakra Spin",[16,4,.3,1.2,.5,1,.4,.8],{trail:.75,spin:.008},9),g("mandala","Lace Galaxy",[24,10,1,1,-.2,2,2,1.3],{kaleido:0,trail:.5,hueDrift:.015},15),g("silk","Silk Warp",[],{},1),g("silk","Melting Marble",[1.4,2,1.6,.4,1.8,1.2,1.8,1],{breathe:1,melt:.5},4),g("silk","Liquid Thought",[3.5,1.6,.8,1.2,1,1.5,1.2,.2],{kaleido:8,trail:.4},3),g("silk","Tie-Dye Ocean",[2.6,2.6,2.6,.9,.8,1,1.1,.6],{trail:.3,hueDrift:.02},0),g("apollo","Apollonian Dream",[],{},14),g("apollo","Bubble Universe",[1.32,.4,2.2,2.5,1,.8,.2,1.3],{trail:.5},11),g("apollo","Pearl Labyrinth",[1.08,1.2,.8,.8,1.8,.3,.6,1.6],{breathe:.6},4),g("voronoi","Stained Voronoi",[],{},7),g("voronoi","Cathedral Window",[4,.3,.08,1.5,2,.3,0,.9],{kaleido:12,trail:.3},0),g("voronoi","Cell Division",[12,1.5,.02,2.5,2.5,1,1.4,.3],{trail:.6,breathe:1.2,melt:.4},6),g("wavefield","Neon Wavefield",[],{},2),g("wavefield","Pulsar Ridge",[.6,1.6,1.8,.4,.1,1,.4,.1],{trail:.5,chroma:1.5},10),g("wavefield","Spectral Dunes",[.2,1.2,1,1.2,.8,.6,1.8,0],{mirror:1,trail:.6},3),g("starcore","Star Core",[],{},4),g("starcore","Blue Giant",[3,1.6,1.6,2,1.6,1.4,1,1.2],{trail:.6},5),g("starcore","Quasar Eye",[2.2,2,1.4,2.2,2,1.4,1.2,.85],{kaleido:6,trail:.35},8),g("flower","Flower of Life",[],{},4),g("flower","Metatron Gate",[2,.15,2,1.6,4,1.5,.6,1],{trail:.5,zoom:1.012},13),g("flower","Seed of Creation",[2.6,-.05,.6,1.2,4,1,.35,1.4],{trail:.45,breathe:1,hueDrift:.006},1),g("fall","Endless Fall",[],{},0),g("fall","Droste Staircase",[1.5,1.2,3,4,1.5,1,.2,1],{trail:.5},4),g("fall","Spiral Abyss",[2.2,1.8,8,5,1.8,2,.8,1.5],{trail:.7,zoom:.99,spin:-.01},9),g("fall","Rising Up",[-1.2,.4,6,3,1.2,1.5,.5,.4],{kaleido:0,trail:.4,hueDrift:.01},3),g("hyper","Hyperbolic Temple",[],{},0),g("hyper","Escher Heaven",[7,3,.8,2,.5,.2,1,.8],{trail:.4},10),g("hyper","Infinite Mosaic",[4,6,1.4,1.5,.8,-.3,1.3,1.2],{trail:.5,breathe:.6},7),g("burst","Supernova Burst",[],{},4),g("burst","Firework Mind",[180,2,6,1.5,.8,.4,2,.4],{trail:.66,zoom:1.02},0),g("burst","Crystal Detonation",[60,2.2,4,.8,1.2,0,1.6,1],{kaleido:8,trail:.7,zoom:1.02},15),g("fold","Origami Fold",[],{},1),g("fold","Folding Cathedral",[.15,12,1.4,.8,1.4,1.5,1.4,.8],{trail:.5},4),g("fold","Dragon Paper",[.6,10,1.3,.62,1.2,1.2,2,1.3],{trail:.65,breathe:1},9),g("fold","Snowflake Engine",[1.05,9,1.36,.75,1.6,1,.8,.7],{kaleido:6,trail:.4},5),g("bulb","Mandelbulb Shrine",[8,.2,1,1.2,3.9,.8,1.2,7],{},14),g("bulb","Alien Spore",[5,.3,1.4,1.6,3.6,1,1.8,7],{breathe:.3},6),g("bulb","Golden Idol",[9,.12,.6,.8,3.4,.5,1.4,8],{trail:.2},4),g("qjulia","Julia Organism",[.5,.22,1,.8,3.5,.8,1.3,.6],{trail:.15},1),g("qjulia","Coral Mind",[.8,.15,1.4,1.1,3.3,1,1.8,1],{trail:.2},13),g("qjulia","Quantum Larva",[.25,.3,.8,.7,3.7,.6,1,.35],{trail:.1},9),g("jbulb","Living Bulb",[6,.2,1,1.1,3.9,.8,1.2,2.5],{trail:.15},0),g("jbulb","Pulsing Seed",[4,.25,1.3,1.5,3.8,1.2,1.6,1.2],{trail:.2},7),g("jbulb","Bone Orchid",[8.5,.15,.7,.9,4,.6,1,1.6],{trail:.1},4),g("kifs","Crystal Reliquary",[.08,.18,1.1,1.8,6,.8,1.5,.78],{trail:.12},5),g("kifs","Octahedral Throne",[.15,.12,1.3,1.6,5.8,1,1.6,.8],{trail:.2},15),g("kifs","Ice Cathedral",[.6,.2,.8,1,6,.6,1.1,.3],{trail:.1},10),g("hextunnel","Hex Temple",[],{},1),g("hextunnel","Machine Elf Hall",[2.2,8,2,2,1.4,1.2,1,2],{trail:.6,breathe:1.4,melt:.4},0),g("yantra","Sri Yantra",[],{},4),g("yantra","Third Eye Opening",[12,2,24,1.2,.2,2.5,1.2,1.2],{trail:.7,zoom:1.018},9),g("menger","Menger Crystal",[],{},5),g("menger","Sponge Cathedral",[1.6,.95,2,2,.6,1.2,.2,4],{trail:.5},4),g("aurora","Aurora Ocean",[3,1,1,1.3,.75,1,1,1.2],{trail:.15,kaleido:0,mirror:0,breathe:.2,melt:0,grain:.06,chroma:.45},3),g("aurora","Borealis Mirror",[4,1.4,1.3,1.6,.9,1.4,1.6,1.8],{trail:.2,kaleido:0,mirror:0,breathe:.15,melt:0,grain:.06,chroma:.45},12)],Bi=[["Liquid Oscilloscope",[2,7],[0,3]],["Spectral Whirlpool",[2,3],[2,5]],["Lissajous Lagoon",[8,3],[3,0]],["Golden Spiral Engine",[7,5],[4,6]],["Bass Bloom",[9,0],[5,2]],["Rising Phoenix",[6,8],[1,8]],["Twin Vortex",[3,2],[7,0]],["Ripple Mind",[4,10],[0,6]],["Petal Storm",[10,5],[6,2]],["Helix Current",[8,6],[8,1]],["Starburst Tunnel",[0,7],[9,5]],["Mirror Pulse",[1,4],[10,0]],["Trinity Drift",[5,8],[11,3]],["Orbital Smoke",[8,2],[7,4]],["Infinite Zoom Scope",[0,9],[0,1]],["Collapsing Stars",[1,3],[6,9]],["Plasma Flame",[6,9],[5,8]],["Deep Current",[8,8],[1,3]],["Kaleido Rose",[10,4],[2,11]],["Mandala Machine",[5,10],[6,11]],["Ghost Knots",[2,8],[3,3]],["Comet Tails",[7,0],[7,9]],["Sonic Lotus",[10,2],[2,6]],["Wave Temple",[4,5],[10,1]],["Ember Spiral",[7,6],[4,8]],["Pulse Reactor",[9,4],[5,0]],["Silk Scope",[8,1],[0,10]],["Aurora Knot",[6,3],[3,8]],["Gravity Well",[2,9],[7,2]],["Quantum Foam",[8,10],[9,6]],["Spinning Prism",[5,3],[11,5]],["Echo Chamber",[1,7],[0,4]],["Fireflies",[3,8],[7,9]],["Hypno Rings",[4,7],[6,0]],["Dream Scope",[0,1,2,3,4,5,6,7,8,9,10],[0,1,2,3,4,5,6,7,8,10,11]],["Chaos Garden",[0,1,2,3,4,5,6,7,8,9,10],[0,1,2,3,4,5,6,7,8,9,10,11]]];Bi.forEach(([a,e,t],i)=>{let o=g("flux",a,[],{},(i*5+3)%Z.length);o.flux={flows:e,waves:t},a==="Chaos Garden"&&(o.params[4]=6),be.push(o)});function Sa(){let a=(e,t)=>[...Array(e).keys()].sort(()=>Math.random()-.5).slice(0,t);return{flows:a(11,2+Math.floor(Math.random()*3)),waves:a(12,2+Math.floor(Math.random()*3))}}var Ci=["Velvet","Chrome","Fractal","Liquid","Astral","Neon","Cosmic","Prismatic","Holographic","Molten","Electric","Dreaming","Infinite","Sacred","Psychedelic","Iridescent","Quantum","Lucid","Melting","Hyper","Ancient","Crystal","Sonic","Shimmering","Feral","Halcyon","Opal","Ultraviolet"],Ri=["Singularity","Aurora","Cathedral","Lotus","Vortex","Garden","Labyrinth","Mandala","Spiral","Bloom","Engine","Temple","Ocean","Nebula","Serpent","Oracle","Echo","Portal","Reactor","Dream","Prism","Hive","Halo","Abyss","Lattice","Comet","Membrane","Kaleidoscope"],te=(a,e)=>a+Math.random()*(e-a),ye=a=>a[Math.floor(Math.random()*a.length)];function ot(){return`${ye(Ci)} ${ye(Ri)}`}function Ma(){return{name:"Generated",a:[te(.3,.65),te(.3,.65),te(.3,.65)],b:[te(.3,.55),te(.3,.55),te(.3,.55)],c:[ye([.5,1,1,1,1.5,2]),ye([.5,1,1,1,1.5,2]),ye([.5,1,1,1,1.5,2])],d:[Math.random(),Math.random(),Math.random()]}}function Ba(a=ae,e=1){let t={...a},i=(o,n,s)=>{t[o]=t[o]+(te(n,s)-t[o])*e};i("trail",0,.85),i("zoom",.985,1.03),i("spin",-.012,.012),i("warp",0,1.2),i("breathe",0,1.6),i("melt",0,.8),i("chroma",.3,2.2),i("bloom",.4,1.4),t.hueDrift=Math.random()<.3?te(-.02,.02):0,e>=1&&(t.kaleido=Math.random()<.3?ye([3,4,5,6,8,12]):0),t.mirror=Math.random()<.12?1:0;for(let o of["dance","ripple","punch","shake","swirlA","bulgeA"])i(o,.3,1.9);return t}function At(a,e=.55){let t=_[a.scene],i=structuredClone(a);return i.builtin=!1,t&&(i.params=t.params.map((o,n)=>{let s=a.params[n]??o.def,c=te(o.min,o.max);return+(s+(c-s)*e).toFixed(4)})),i.fx=Ba(a.fx,e*.7),t&&t.fly&&(i.fx.trail=Math.min(i.fx.trail,.25)),t&&t.selfFeedback&&(i.fx.trail=Math.min(i.fx.trail,.15),Math.random()<.6&&(i.flux=Sa())),Math.random()<.5&&(i.palette=Math.random()<.4?Ma():Math.floor(Math.random()*Z.length)),i.name=ot(),i.id="gen-"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),i}function zt(a){let e=a&&_[a]||ye(Ae),t=e.params.map(o=>{let n=te(o.min,o.max);return+(o.def+(n-o.def)*.7).toFixed(4)}),i=Ba(ae,1);return e.fly&&(i.trail=Math.min(i.trail,.25)),e.selfFeedback&&(i.trail=Math.random()*.15),{id:"gen-"+Date.now().toString(36),name:ot(),engine:"scene",scene:e.id,params:t,palette:Math.random()<.5?Ma():Math.floor(Math.random()*Z.length),fx:i,builtin:!1,...e.selfFeedback?{flux:Sa()}:{}}}function nt(a){return typeof a=="number"?Z[(a%Z.length+Z.length)%Z.length]:a}var Ca="eyecandy.userPresets.v1";function Ra(){try{return JSON.parse(localStorage.getItem(Ca)||"[]")}catch{return[]}}function He(a){try{localStorage.setItem(Ca,JSON.stringify(a))}catch{}}var ka=[0,2,3,5,7,9,11,13];function Et(a,e){let t=_[e],i=a.id+"/"+e,o=Lt(i),n=t.params.map(c=>+Math.max(c.min,Math.min(c.max,c.def+(o()-.5)*.12*(c.max-c.min))).toFixed(4)),s=it(i,ae,{kaleido:0,mirror:0});return s.trail=Math.min(s.trail,t.fly?.15:.32),s.melt=Math.min(s.melt,.12),s.warp=Math.min(s.warp,t.fly?.15:.45),s.chroma=Math.min(s.chroma,.5),t.calm&&(s.trail=Math.min(s.trail,.06),s.warp=Math.min(s.warp,.05),s.melt=0,s.breathe=Math.min(s.breathe,.25),s.swirlA=Math.min(s.swirlA,.2),s.bulgeA=Math.min(s.bulgeA,.2),s.ripple=Math.min(s.ripple,.35)),(t.crisp||t.space)&&(s.warp=Math.min(s.warp,.08),s.trail=Math.min(s.trail,.2),s.breathe=Math.min(s.breathe,.3),s.swirlA=Math.min(s.swirlA,.25),s.bulgeA=Math.min(s.bulgeA,.25),s.ripple=Math.min(s.ripple,.45),s.dance=Math.min(s.dance,.7)),s.grain=Math.min(s.grain,.15),s.saturation=Math.min(s.saturation,1.2),{id:"photo-"+i,name:t.name.replace(/^Photo /,"")+" \xB7 "+a.name,engine:"scene",scene:e,params:n,palette:ka[Math.floor(o()*ka.length)],fx:s,photo:a.id,builtin:!0}}var Aa=wi(La()),Li=["video/mp4;codecs=avc1.640028,mp4a.40.2","video/mp4;codecs=avc1.42E01F,mp4a.40.2","video/mp4;codecs=avc1,mp4a","video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm"],Ai=600,rt=class{constructor(e,t){this.canvas=e,this.audio=t,this.rec=null,this.t0=0,this.onstate=()=>{}}get supported(){return!!(window.MediaRecorder&&this.canvas.captureStream)}get recording(){return!!this.rec&&this.rec.state==="recording"}get seconds(){return this.recording?(performance.now()-this.t0)/1e3:0}pickType(){return Li.find(e=>{try{return MediaRecorder.isTypeSupported(e)}catch{return!1}})||""}start(e="clip"){if(this.recording||!this.supported)return!1;let t=this.canvas.captureStream(60),i=this.audio.ctx;this.dest=i.createMediaStreamDestination(),this.audio.input.connect(this.dest);let o=this.dest.stream.getAudioTracks()[0];o&&t.addTrack(o),this.type=this.pickType();let n=this.canvas.width*this.canvas.height,s=Math.round(Math.min(4e7,Math.max(6e6,n*60*.09)));return this.rec=new MediaRecorder(t,{mimeType:this.type||void 0,videoBitsPerSecond:s,audioBitsPerSecond:192e3}),this.chunks=[],this.name=e,this.rec.ondataavailable=c=>{c.data&&c.data.size&&this.chunks.push(c.data)},this.rec.onstop=()=>this.finish(),this.rec.start(1e3),this.t0=performance.now(),this.cap=setTimeout(()=>this.stop(),Ai*1e3),this.onstate(!0),!0}stop(){this.recording&&(clearTimeout(this.cap),this.rec.stop())}finish(){try{this.audio.input.disconnect(this.dest)}catch{}this.rec.stream.getTracks().forEach(o=>o.stop());let e=(this.type||"video/webm").split(";")[0],t=new Blob(this.chunks,{type:e}),i=performance.now()-this.t0;e.includes("webm")&&t.size>=4096?(0,Aa.default)(t,i,{logger:!1}).then(o=>this.deliver(o,e)).catch(()=>this.deliver(t,e)):this.deliver(t,e)}deliver(e,t){this.chunks=[];let i=t.includes("mp4")?"mp4":"webm",o=new Date,n=b=>String(b).padStart(2,"0"),s=`${o.getFullYear()}${n(o.getMonth()+1)}${n(o.getDate())}-${n(o.getHours())}${n(o.getMinutes())}${n(o.getSeconds())}`,m=`EyeCandy-${this.name.replace(/[^\w\- ]+/g,"").trim().replace(/\s+/g,"-").slice(0,40)||"clip"}-${s}.${i}`;if(this.rec=null,e.size<4096){this.onstate(!1,{file:m,size:e.size,ext:i,error:"empty"});return}let l=window.eyecandy;if(l&&l.saveClip){e.arrayBuffer().then(b=>l.saveClip(m,b)).then(b=>this.onstate(!1,{file:m,size:e.size,ext:i,path:b})).catch(()=>this.onstate(!1,{file:m,size:e.size,ext:i,error:!0}));return}let f=URL.createObjectURL(e),u=document.createElement("a");u.href=f,u.download=m,document.body.appendChild(u),u.click(),u.remove(),setTimeout(()=>URL.revokeObjectURL(f),6e4),this.onstate(!1,{file:m,size:e.size,ext:i})}};var zi="eyecandy-photos",Ft="photos",Ut=null;function Ei(){return Ut||(Ut=new Promise((a,e)=>{let t=indexedDB.open(zi,1);t.onupgradeneeded=()=>t.result.createObjectStore(Ft,{keyPath:"id"}),t.onsuccess=()=>a(t.result),t.onerror=()=>e(t.error)})),Ut}var ct=async(a,e)=>{let t=await Ei();return new Promise((i,o)=>{let n=t.transaction(Ft,a),s=n.objectStore(Ft),c=e(s);n.oncomplete=()=>i(c&&"result"in c?c.result:c),n.onerror=()=>o(n.error),n.onabort=()=>o(n.error)})};function It(a,e){let t=document.createElement("canvas");return t.width=a,t.height=e,t}var Ui=(a,e,t)=>new Promise(i=>a.toBlob(i,e,t));async function za(a,e=2048){let t=await createImageBitmap(a,{imageOrientation:"from-image"}),i=Math.min(1,e/Math.max(t.width,t.height)),o=Math.max(1,Math.round(t.width*i)),n=Math.max(1,Math.round(t.height*i)),s=It(o,n);s.getContext("2d").drawImage(t,0,0,o,n);let c=await Ui(s,"image/jpeg",.9),m=160/Math.max(o,n),l=It(Math.round(o*m)||1,Math.round(n*m)||1);l.getContext("2d").drawImage(s,0,0,l.width,l.height);let f=l.toDataURL("image/jpeg",.75);t.close&&t.close();let u=(a.name||"Photo").replace(/\.[^.]+$/,"").replace(/[_-]+/g," ").trim().slice(0,28)||"Photo",b={id:"ph"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:u,w:o,h:n,thumb:f,created:Date.now()};return await ct("readwrite",x=>x.put({...b,blob:c})),b}async function Ea(){try{return(await ct("readonly",e=>e.getAll())).map(({blob:e,...t})=>t).sort((e,t)=>t.created-e.created)}catch{return[]}}async function Ua(a){try{let e=await ct("readonly",t=>t.get(a));return e?await createImageBitmap(e.blob):null}catch{return null}}async function Fa(a){try{await ct("readwrite",e=>e.delete(a))}catch{}}function Ia(){let a=It(1024,768),e=a.getContext("2d"),t=e.createLinearGradient(0,0,1024,768);t.addColorStop(0,"#1b0b3a"),t.addColorStop(.5,"#0d3b5c"),t.addColorStop(1,"#3a0b2e"),e.fillStyle=t,e.fillRect(0,0,1024,768);let i=["#ff3da8","#ffd23d","#3dffb5","#3db2ff","#b03dff","#ff7a3d"];for(let o=0;o<26;o++){let n=(Math.sin(o*12.9898)*.5+.5)*1024,s=(Math.sin(o*78.233)*.5+.5)*768,c=40+o*37%150,m=e.createRadialGradient(n,s,0,n,s,c);m.addColorStop(0,i[o%i.length]),m.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=m,e.beginPath(),e.arc(n,s,c,0,Math.PI*2),e.fill()}e.strokeStyle="rgba(255,255,255,.55)",e.lineWidth=6;for(let o=0;o<7;o++)e.beginPath(),e.arc(512,384,50+o*45,0,Math.PI*2),e.stroke();return a}function Da(a){let e=a.ctx,t=e.createGain();t.gain.value=.55,t.connect(a.input),t.connect(a.out);let i=124,o=60/i/4,n=e.currentTime+.1,s=0,c=!0,m=[0,3,5,7,10,12,15],l=e.createBuffer(1,e.sampleRate,e.sampleRate),f=l.getChannelData(0);for(let y=0;y<f.length;y++)f[y]=Math.random()*2-1;let u=e.createDelay(1);u.delayTime.value=o*3;let b=e.createGain();b.gain.value=.35,u.connect(b),b.connect(u),u.connect(t);let x=y=>{let C=e.createOscillator(),B=e.createGain();C.frequency.setValueAtTime(150,y),C.frequency.exponentialRampToValueAtTime(42,y+.12),B.gain.setValueAtTime(1,y),B.gain.exponentialRampToValueAtTime(.001,y+.45),C.connect(B),B.connect(t),C.start(y),C.stop(y+.5)},P=(y,C)=>{let B=e.createBufferSource();B.buffer=l;let E=e.createBiquadFilter();E.type="highpass",E.frequency.value=8e3;let F=e.createGain();F.gain.setValueAtTime(C,y),F.gain.exponentialRampToValueAtTime(.001,y+.05),B.connect(E),E.connect(F),F.connect(t),B.start(y),B.stop(y+.06)},w=y=>{let C=e.createBufferSource();C.buffer=l;let B=e.createBiquadFilter();B.type="bandpass",B.frequency.value=1500;let E=e.createGain();E.gain.setValueAtTime(.5,y),E.gain.exponentialRampToValueAtTime(.001,y+.18),C.connect(B),B.connect(E),E.connect(t),E.connect(u),C.start(y),C.stop(y+.2)},S=(y,C,B,E)=>{let F=e.createOscillator(),R=e.createOscillator(),q=e.createBiquadFilter(),V=e.createGain();F.type="sawtooth",R.type="square";let Q=55*Math.pow(2,C/12);F.frequency.value=Q,R.frequency.value=Q*1.005,q.type="lowpass",q.Q.value=9,q.frequency.setValueAtTime(E,y),q.frequency.exponentialRampToValueAtTime(120,y+B),V.gain.setValueAtTime(.22,y),V.gain.exponentialRampToValueAtTime(.001,y+B),F.connect(q),R.connect(q),q.connect(V),V.connect(t),V.connect(u),F.start(y),R.start(y),F.stop(y+B),R.stop(y+B)},U=(y,C)=>{[0,7,15,19].forEach(B=>{let E=e.createOscillator(),F=e.createGain();E.type="triangle",E.frequency.value=110*Math.pow(2,(C+B)/12),F.gain.setValueAtTime(0,y),F.gain.linearRampToValueAtTime(.05,y+1),F.gain.linearRampToValueAtTime(0,y+o*64),E.connect(F),F.connect(t),F.connect(u),E.start(y),E.stop(y+o*64)})},A=[0,-4,3,-2],k=()=>{if(c){for(;n<e.currentTime+.15;){let y=s%16,C=Math.floor(s/16),B=Math.floor(C/8)%4,E=A[Math.floor(C/2)%4],F=C%32>=28;!F&&y%4===0&&x(n),y%2===1&&P(n,y%4===3?.25:.1),!F&&(y===4||y===12)&&w(n),Math.random()<(B===2?.8:.55)&&S(n,E+12+m[Math.floor(Math.random()*m.length)]+(Math.random()<.2?12:0),o*1.8,600+3e3*Math.abs(Math.sin(s*.03))),y===0&&C%4===0&&U(n,E),n+=o,s++}setTimeout(k,25)}};return k(),()=>{c=!1,t.gain.setTargetAtTime(0,e.currentTime,.2),setTimeout(()=>t.disconnect(),800)}}var qa=[3302,3570],Fi=[1476,2508,2976],Ii=(()=>{let a=new Uint32Array(256);for(let e=0;e<256;e++){let t=e;for(let i=0;i<8;i++)t=t&1?3988292384^t>>>1:t>>>1;a[e]=t>>>0}return a})();function _a(a){let e=4294967295;for(let t of a)e=Ii[(e^t)&255]^e>>>8;return(e^4294967295)>>>0}var Di=[[1,0,0,0],[1,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,1,1],[0,0,0,1],[1,0,0,1],[0,0,0,0]],lt=class{constructor(){this.supported=!!navigator.hid,this.device=null,this.kind=null,this.bt=!1,this.status=this.supported?"not connected":"unsupported",this.t=[{active:!1,x:.5,y:.5,id:-1},{active:!1,x:.5,y:.5,id:-1}],this.axes=[0,0,0,0],this.buttons=new Array(18).fill(0),this.lastReport=0,this.lastPadReport=0,this.onstatus=()=>{},this.seq=0,this.rumbleTimer=0,this.supported&&(navigator.hid.addEventListener("disconnect",e=>{e.device===this.device&&(this.device=null,this.set("not connected"))}),navigator.hid.addEventListener("connect",()=>this.autoConnect()))}set(e){this.status=e,this.onstatus(e)}get connected(){return!!this.device}get fresh(){return this.device&&performance.now()-this.lastPadReport<400}async autoConnect(){if(!this.supported||this.device)return!1;try{let t=(await navigator.hid.getDevices()).find(i=>i.vendorId===1356&&(qa.includes(i.productId)||Fi.includes(i.productId)));if(t)return await this.open(t),!0}catch(e){console.warn(e)}return!1}async request(){if(!this.supported)return!1;try{window.eyecandy&&window.eyecandy.requestHid?await window.eyecandy.requestHid():await navigator.hid.requestDevice({filters:[{vendorId:1356}]})}catch(e){console.warn(e)}return this.autoConnect()}async open(e){try{e.opened||await e.open()}catch{this.set("could not open (close Steam / DS4Windows?)");return}this.device=e,this.kind=qa.includes(e.productId)?"ds5":"ds4";try{await e.receiveFeatureReport(this.kind==="ds5"?5:2)}catch{}e.addEventListener("inputreport",t=>this.parse(t)),this.set((this.kind==="ds5"?"DualSense":"DualShock 4")+" connected (touchpad + full controller)")}parse(e){let t=e.data,i=e.reportId,o=S=>t.getUint8(S),n=-1,s=-1;if(this.kind==="ds5"?i===1&&t.byteLength>=40?(n=0,s=32,this.bt=!1):i===49&&t.byteLength>=41?(n=1,s=33,this.bt=!0):i===1&&t.byteLength>=9&&(n=0,this.bt=!0):i===1&&t.byteLength>=42?(n=0,s=34,this.bt=!1):i===17&&t.byteLength>=44?(n=2,s=36,this.bt=!0):i===1&&t.byteLength>=9&&(n=0,this.bt=!0),n<0)return;let c=S=>(o(S)-128)/127.5,m=this.buttons;this.axes=[c(n),c(n+1),c(n+2),c(n+3)];let l,f,u,b,x;this.kind==="ds5"&&s>=0?(b=o(n+4),x=o(n+5),l=o(n+7),f=o(n+8),u=o(n+9)):(l=o(n+4),f=o(n+5),u=o(n+6),b=o(n+7),x=o(n+8));let P=Di[Math.min(8,l&15)];if(m[2]=l>>4&1,m[0]=l>>5&1,m[1]=l>>6&1,m[3]=l>>7&1,m[4]=f&1,m[5]=f>>1&1,m[6]=b/255,m[7]=x/255,m[8]=f>>4&1,m[9]=f>>5&1,m[10]=f>>6&1,m[11]=f>>7&1,m[12]=P[0],m[15]=P[1],m[13]=P[2],m[14]=P[3],m[16]=u&1,m[17]=u>>1&1,this.lastPadReport=performance.now(),s<0)return;let w=this.kind==="ds5"?1079:942;for(let S=0;S<2;S++){let U=s+S*4,A=o(U),k=o(U+1),y=o(U+2),C=o(U+3),B=this.t[S];B.active=!(A&128),B.id=A&127,B.active&&(B.x=Math.min(1,(k|(y&15)<<8)/1919),B.y=Math.min(1,(y>>4|C<<4)/w))}this.lastReport=performance.now()}asGamepad(){return{id:(this.kind==="ds5"?"DualSense":"DualShock 4")+" (HID, Vendor: 054c)",connected:!0,mapping:"standard",axes:this.axes,buttons:this.buttons.map(e=>({pressed:e>.5,value:e})),vibrationActuator:{playEffect:(e,t)=>this.rumble(t)}}}async rumble({duration:e=100,strongMagnitude:t=0,weakMagnitude:i=0}={}){if(!this.device)return;let n=Math.round(Math.min(1,t)*255),s=Math.round(Math.min(1,i)*255);try{await this.sendMotors(n,s),clearTimeout(this.rumbleTimer),this.rumbleTimer=setTimeout(()=>this.sendMotors(0,0).catch(()=>{}),e)}catch{}}async sendMotors(e,t){let i=this.device;if(i)if(this.kind==="ds5"){let o=new Uint8Array(47);if(o[0]=3,o[2]=t,o[3]=e,!this.bt)return i.sendReport(2,o);let n=new Uint8Array(77);n[0]=(this.seq=this.seq+1&15)<<4,n[1]=16,n.set(o,2);let s=_a(new Uint8Array([162,49,...n.subarray(0,73)]));return n[73]=s&255,n[74]=s>>>8&255,n[75]=s>>>16&255,n[76]=s>>>24&255,i.sendReport(49,n)}else{if(!this.bt){let s=new Uint8Array(31);return s[0]=7,s[3]=t,s[4]=e,i.sendReport(5,s)}let o=new Uint8Array(77);o[0]=192,o[2]=7,o[5]=t,o[6]=e;let n=_a(new Uint8Array([162,17,...o.subarray(0,73)]));return o[73]=n&255,o[74]=n>>>8&255,o[75]=n>>>16&255,o[76]=n>>>24&255,i.sendReport(17,o)}}};var pe=(matchMedia("(pointer: coarse)").matches||"ontouchstart"in window)&&!matchMedia("(pointer: fine)").matches,qi=[[0,"\u2738","Burst","r",0],[2,"\u2684","Random","r",1],[3,"\u2605","Save","r",2],[4,"\u2756","Kaleido","l",0],[5,"\u25D1","Colors","l",1],[17,"\u266A","Dance","l",2]],mt=class{constructor(e){this.axes=[0,0,0,0],this.buttons=new Array(18).fill(0),this.sticks={l:null,r:null},this.lastInput=0,this.active=!1,this.el=document.createElement("div"),this.el.id="touchUI",this.el.innerHTML=`
      <div class="tzone" data-side="l"></div><div class="tzone" data-side="r"></div>
      <div class="tstick" data-side="l"><i></i></div><div class="tstick" data-side="r"><i></i></div>
      <div class="ttrig" data-b="6" data-side="l"><b>WARP</b><small>hold</small></div>
      <div class="ttrig" data-b="7" data-side="r"><b>DRIVE</b><small>hold</small></div>
      ${qi.map(([c,m,l,f,u])=>`<button class="tbtn" data-b="${c}" data-side="${f}" style="--slot:${u}"><span>${m}</span><small>${l}</small></button>`).join("")}
      <div class="ttop">
        <button class="tico" data-act="sheetVisuals" title="Presets & settings">\u2630</button>
        <button class="tico" data-act="prevPreset">\u2039</button>
        <div class="tname" data-act="sheetVisuals"></div>
        <button class="tico" data-act="nextPreset">\u203A</button>
        <button class="tico" data-act="sheetMusic" title="Music">\u266B</button>
        <button class="tico" data-act="fullscreen" title="Fullscreen">\u26F6</button>
      </div>
      <div class="thint">Left thumb steers \xB7 right thumb morphs</div>`,e.appendChild(this.el);let t=56,i=c=>this.el.querySelector(`.tstick[data-side="${c}"]`),o=c=>{let m=c.target.closest(".tzone");if(!m)return;let l=m.dataset.side;if(this.sticks[l])return;c.preventDefault(),m.setPointerCapture(c.pointerId),this.sticks[l]={id:c.pointerId,x:c.clientX,y:c.clientY};let f=i(l);f.style.left=c.clientX+"px",f.style.top=c.clientY+"px",f.classList.add("on"),this.touch()},n=c=>{for(let m of["l","r"]){let l=this.sticks[m];if(!l||l.id!==c.pointerId)continue;let f=(c.clientX-l.x)/t,u=(c.clientY-l.y)/t,b=Math.hypot(f,u);b>1&&(f/=b,u/=b);let x=m==="l"?0:2;this.axes[x]=f,this.axes[x+1]=u,i(m).querySelector("i").style.transform=`translate(${f*t}px,${u*t}px)`,this.touch()}},s=c=>{for(let m of["l","r"]){let l=this.sticks[m];if(!l||l.id!==c.pointerId)continue;this.sticks[m]=null;let f=m==="l"?0:2;this.axes[f]=this.axes[f+1]=0;let u=i(m);u.classList.remove("on"),u.querySelector("i").style.transform=""}};this.el.addEventListener("pointerdown",o),this.el.addEventListener("pointermove",n),this.el.addEventListener("pointerup",s),this.el.addEventListener("pointercancel",s),this.el.querySelectorAll("[data-b]").forEach(c=>{let m=+c.dataset.b,l=0,f=0,u=x=>{x.preventDefault(),x.stopPropagation(),c.setPointerCapture?.(x.pointerId),clearTimeout(f),l=performance.now(),this.buttons[m]=1,c.classList.add("down"),this.touch()},b=()=>{let x=90-(performance.now()-l),P=()=>{this.buttons[m]=0,c.classList.remove("down")};clearTimeout(f),x>0?f=setTimeout(P,x):P()};c.addEventListener("pointerdown",u),c.addEventListener("pointerup",b),c.addEventListener("pointercancel",b),c.addEventListener("lostpointercapture",b)}),this.el.addEventListener("contextmenu",c=>c.preventDefault())}touch(){this.lastInput=performance.now(),this.active=!0,this.el.classList.add("awake"),this.el.querySelector(".thint").classList.add("gone"),clearTimeout(this._t),this._t=setTimeout(()=>this.el.classList.remove("awake"),3500)}setName(e){let t=this.el.querySelector(".tname");t&&(t.textContent=e)}asGamepad(){return{id:"Touch controls",connected:!0,mapping:"standard",axes:this.axes.slice(),buttons:this.buttons.map(e=>({pressed:e>.5,value:e})),vibrationActuator:{playEffect:(e,t)=>(navigator.vibrate&&t&&t.duration>=100&&navigator.vibrate(Math.min(60,t.duration*.4)),Promise.resolve())}}}};var gt=be.filter(a=>a.scene!=="flux"),Ka=be.filter(a=>a.scene==="flux"),v=a=>document.querySelector(a),ne=a=>[...document.querySelectorAll(a)],W=(a,e,t)=>Math.max(e,Math.min(t,a)),N=(a,e,t)=>a+(e-a)*t,j=window.eyecandy||null;j||document.addEventListener("DOMContentLoaded",()=>{},{once:!0});var Qt="eyecandy.settings.v1",pt={resolution:"native",renderScale:"auto",aa:"off",autoExposure:!0,fpsCap:"0",uiScale:1,startFullscreen:!0,showFps:!1,autopilot:!0,autoInterval:20,autoSource:"mix",autoOnDrop:!0,idle:5,reactIntensity:1.5,idleDance:!1,beatRipples:!0,beatPulse:1,beatFlash:.3,cameraShake:.5,beatSens:1.5,gainBass:1,gainMid:1,gainHigh:1,outputDevice:"default",rumble:!0,rumbleStrength:.7,deadzone:.14,stickSens:1,invertY:!1,touchMode:"both",transition:1,autoPause:!0,uiAutoHide:!0,volume:.85,seenGuide:!1},h={...pt,...JSON.parse(localStorage.getItem(Qt)||"{}")};if(!h.aaV){h.aa="off",h.aaV=1;try{localStorage.setItem(Qt,JSON.stringify(h))}catch{}}var fe=()=>localStorage.setItem(Qt,JSON.stringify(h)),ie=v("#gl"),z;try{z=new Qe(ie)}catch(a){throw document.body.innerHTML=`<div style="padding:40px;font:16px sans-serif;color:#fff">Eye Candy needs WebGL2.<br><br>${a.message}</div>`,a}z.ssMax=1;var p=new tt;p.out.gain.value=h.volume;var T=new at;T.deadzone=h.deadzone;var G=new lt;T.hid=G;var ue={active:!1,x:.5,y:.5},ke=null;pe&&(document.body.classList.add("mobile"),ke=new mt(document.body),T.touch=ke);var X=Ra(),Ie=null,$=null,oe=null,De=null,yt=[],ft=null,Be=null,Za={...ae,trail:0,zoom:1,warp:0,breathe:.15,bloom:.6,chroma:.8,grain:.25};function ve(){return $?Promise.resolve():ft||(Zt(),ft=new Promise((a,e)=>{let t=document.createElement("script");t.src="milk.js",t.onload=()=>{let i=window.EyeMilk;De={};for(let o of i.packs)try{Object.assign(De,o.getPresets?o.getPresets():o.default?.getPresets())}catch(n){console.warn(n)}yt=Object.keys(De).sort((o,n)=>o.localeCompare(n)),oe=document.createElement("canvas"),oe.width=1280,oe.height=720,$=i.butterchurn.createVisualizer(p.ctx,oe,{width:1280,height:720,pixelRatio:1,textureRatio:1}),$.connectAudio(p.input),fetch("milktex/manifest.json").then(o=>o.json()).then(o=>$.loadExtraImages(o)).catch(()=>{}),Zt().then(()=>a())},t.onerror=e,document.head.appendChild(t)}),ft)}function _i(a,e){if(!$)return;let t=Math.min(1,1280/a),i=Math.round(a*t),o=Math.round(e*t);(oe.width!==i||oe.height!==o)&&(oe.width=i,oe.height=o,$.setRendererSize(i,o))}var Ge=null,qe={},Dt={},qt=null;function Zt(){return qt||(qt=fetch("milklib/index.json").then(a=>a.json()).then(a=>{Ge={};for(let[e,t,i]of a)Ge[e]={cat:t,chunk:i},(qe[t]=qe[t]||[]).push(e);return Ge}).catch(()=>Ge={}))}async function Ja(a){if(De&&De[a])return De[a];await Zt();let e=Ge[a];return e?(Dt[e.chunk]||(Dt[e.chunk]=fetch(`milklib/c${e.chunk}.json`).then(i=>i.json())),(await Dt[e.chunk])[a]||null):null}async function Oe(a,e=2){if(!$)return;let t=await Ja(a);if(t)try{$.loadPreset(t,e),Be=a}catch(i){console.warn("MilkDrop preset failed",a,i)}}var de="all";function Ce(a){return a==="classic"?yt:a!=="all"?qe[a]||[]:[...yt,...Object.values(qe).flat()]}var ea=()=>{let a=Ce(de==="classic"||de==="all"?"all":de);return a[Math.floor(Math.random()*a.length)]},_t=new Map;function ta(a){return _t.has(a)||_t.set(a,{id:"milk:"+a,name:a,engine:"milk",milk:a,fx:it(a,Za,{trail:0,zoom:1,kaleido:0,mirror:0}),palette:0,builtin:!0}),_t.get(a)}var H="eye",d=structuredClone(be[0]),$e=structuredClone(d),se=0,r={fly:[0,0],camX:0,camY:0,roll:0,morphX:0,morphY:0,waitCenter:!1,time:0,timeScale:1,hue:0,burstT:9,flash:0,freeze:!1,lt:0,rt:0,transMix:0,lastSwitch:0,lastHuman:-1e9,kAngle:0,pal:null,flowX:0,flowY:0,hyper:0,autoT:0,panels:!0,cinema:!1,amX:0,amY:0,danceT:0,sinceBeat:9,beatInt:.5,jolt:0,beatRipT:9,beatRipAmt:0,lastAutoBurst:0,lastStick:-1e9,lensRot:0,lensZoom:1,swirl:0,bulge:0,swirlT:0,bulgeT:0,burstCX:0,burstCY:0,pinch:null,touch:[{on:!1,x:0,y:0,vx:0,vy:0,s:0},{on:!1,x:0,y:0,vx:0,vy:0,s:0}],flux:{fa:0,fb:0,fm:0,wa:0,wb:0,wm:0,tf:0,tw:0,mapT:0}},Qa=a=>[...a.a,...a.b,...a.c,...a.d];r.pal=Qa(nt(d.palette));var Nt=[-1,-.5,.25,.5,.75,1,1.5,2,3,4];function kt(a){return a==="eye"?gt:a==="flux"?Ka:a==="user"?X:a==="milk"?Ce(de).map(ta):a==="photo"?ei(re):be}var K=[],re=null,Ht=new Map;function ei(a){let e=K.find(i=>i.id===a);if(!e)return[];let t=a+":"+e.name;return Ht.has(t)||Ht.set(t,Je.map(i=>Et(e,i.id))),Ht.get(t)}var Na=null;async function Ni(a){if(z.photoId===a)return!0;let e=a&&!a.startsWith("__")?await Ua(a):null;return e?(z.setPhoto(e,a),e.close&&e.close(),!0):(z.setPhoto(Na||(Na=Ia()),a),!1)}function aa(){let a=_[d.scene];if(!a)return[];let e=d.params.slice(),[t,i]=a.stick||[0,1],o=(r.waitCenter?0:r.morphX)+r.amX,n=(r.waitCenter?0:r.morphY)+r.amY,s=(c,m)=>{let l=a.params[c];l&&(e[c]=W(e[c]+m*(l.max-l.min)*.35*(l.ms??1),l.min,l.max))};return s(t,o),s(i,n),e}function J(a,e={}){if(a){if(a.photo&&z.photoId!==a.photo){Ni(a.photo).then(t=>{!t&&!e.quiet&&M("\u26A0","That photo is no longer on this device"),J(a,e)});return}if(e.transition!==!1&&z.fin&&(z.snapshot(),r.transMix=1),d=structuredClone(a),d.fx={...ae,...a.engine==="milk"?Za:{},...a.fx},$e=structuredClone(d),r.waitCenter=Math.abs(r.morphX)+Math.abs(r.morphY)>.1,r.hue=d.fx.hueOffset||0,r.lastSwitch=performance.now(),Xi(a),r.camX=0,r.camY=0,r.lensRot=0,r.lensZoom=1,r.fly=[0,0],d.scene==="flux"){let t=d.flux||{flows:[2,7],waves:[0,3]};d.flux=t,Object.assign(r.flux,{fa:t.flows[0],fb:t.flows[0],fm:0,wa:t.waves[0],wb:t.waves[0],wm:0,tf:0,tw:0})}d.engine==="milk"?ve().then(()=>Oe(d.milk,e.transition===!1?0:2)):d.fx.fusion>0&&ve().then(()=>{d.milk?Oe(d.milk):Be||Oe(ea())}),d.engine==="scene"&&z.errors[d.scene]&&M("\u26A0","Scene failed to compile \u2014 skipping"),v("#presetName").textContent=d.name,O(),ce(),e.quiet||M("\u25C6",d.name)}}function xe(a){let e=kt(H);if(!e.length){H==="milk"&&ve().then(()=>{O(),xe(a)});return}se=((se+a)%e.length+e.length)%e.length,J(e[se])}function ia(){if(d.engine==="milk"){d.fx={...d.fx,...At({...d,scene:"none"}).fx},d.name=d.milk+" \u2684",v("#presetName").textContent=d.name,ce(),M("\u2684","Randomized FX");return}J(At(d),{quiet:!0}),M("\u2684","Randomized \xB7 "+d.name)}function oa(){J(zt(),{quiet:!0}),M("\u2726","Generated \xB7 "+d.name)}function ti(){let a=structuredClone(d);return a.engine==="scene"&&(a.params=aa().map(e=>+e.toFixed(4))),a.fx={...a.fx,hueOffset:(r.hue%1+1)%1,speed:+(a.fx.speed*Math.abs(r.timeScale)).toFixed(3)},a.engine==="scene"&&a.fx.fusion>0&&Be&&(a.milk=Be),a}function St(){let a=ti();a.id="user-"+Date.now().toString(36),a.builtin=!1,($e.builtin||!a.name||X.some(e=>e.name===a.name))&&(a.name=(a.engine==="milk"?"Milk \xB7 ":"")+ot()),X.push(a),He(X),d=structuredClone(a),$e=structuredClone(a),v("#presetName").textContent=d.name,O(),ce(),M("\u2605","Saved \u201C"+a.name+"\u201D to My Presets"),T.rumble(.4,.6,120)}function Hi(){let a=X.findIndex(t=>t.id===d.id);if(a<0)return St();let e=ti();e.name=v("#pName").value||e.name,X[a]=e,He(X),$e=structuredClone(e),d=structuredClone(e),r.timeScale=1,O(),M("\u2605","Updated \u201C"+e.name+"\u201D")}function Vi(){let a=X.findIndex(e=>e.id===d.id);a<0||(X.splice(a,1),He(X),O(),M("\u2716","Deleted"),xe(0))}function Xe(a=1,e=0,t=0){r.burstCX=e,r.burstCY=t,r.burstT=0,r.flash=.55*a,T.rumble(.9*a*h.rumbleStrength,.5*a*h.rumbleStrength,160)}function ai(a=1){let e=typeof d.palette=="number"?d.palette:-1;d.palette=((e+a)%Z.length+Z.length)%Z.length,M(T.label("RB"),"Palette \xB7 "+Z[d.palette].name),ce()}var Vt=[0,3,4,5,6,8,12,16];function ii(){let a=Vt.indexOf(d.fx.kaleido);d.fx.kaleido=Vt[(a+1)%Vt.length],M(T.label("LB"),d.fx.kaleido?"Kaleidoscope \xD7"+d.fx.kaleido:"Kaleidoscope off"),ce()}function oi(){d.fx.mirror=d.fx.mirror?0:1,M(T.label("LB"),d.fx.mirror?"Mirror world":"Mirror off"),ce()}function bt(a){let e=Nt.indexOf(r.timeScale);e<0&&(e=5),e=W(e+a,0,Nt.length-1),r.timeScale=Nt[e],M(a>0?"\u25B2":"\u25BC",r.timeScale<0?"Time reversed \xD7"+Math.abs(r.timeScale):"Time \xD7"+r.timeScale)}function Gi(){r.camX=r.camY=r.roll=0,r.lensRot=0,r.lensZoom=1,r.timeScale=1,r.flowX=r.flowY=0,M(T.label("L3"),"View reset")}function Oi(){d.engine==="scene"&&(d.params=aa(),r.waitCenter=!0,ce(),M(T.label("R3"),"Shape locked in"),T.rumble(.2,.5,60))}function na(a){h.autopilot=a,fe(),v("#autoBtn").classList.toggle("on",a),M("\u27F3",a?"Autopilot on":"Autopilot off"),Bt()}function Re(){r.lastHuman=performance.now()}var Ha={},ht=[],Wi=6;function $i(a){let e=[...Array(a).keys()];for(let t=a-1;t>0;t--){let i=Math.floor(Math.random()*(t+1));[e[t],e[i]]=[e[i],e[t]]}return e}function Te(a,e,t=()=>!0){if(!e.length)return null;let i=Ha[a];(!i||i.n!==e.length||!i.left.length)&&(i=Ha[a]={n:e.length,left:$i(e.length)});for(let o=i.left.length-1;o>=Math.max(0,i.left.length-40);o--){let n=e[i.left[o]];if(t(n))return i.left.splice(o,1),n}return e[i.left.pop()]}var ut=a=>!a.scene||!ht.includes(a.scene)&&!z.errors[a.scene];function Xi(a){a&&a.engine!=="milk"&&a.scene&&(ht.push(a.scene),ht.length>Wi&&ht.shift())}var Va=()=>[...new Set(Ce("all"))],ji=Ae.map(a=>({scene:a.id})),Yi=[["milk",.36],["eye",.32],["flux",.12],["generate",.14],["user",.06]];function Ki(a){if(a==="all")return Math.random()<.5?"milk":"eye";if(a==="photo")return K.length?"photo":"eye";if(a!=="mix"&&a!=="mixp")return a;let e=[...Yi,...a==="mixp"&&K.length?[["photo",.2]]:[]].filter(([o])=>o!=="user"||X.length),t=e.reduce((o,[,n])=>o+n,0),i=Math.random()*t;for(let[o,n]of e)if((i-=n)<0)return o;return"eye"}function ni(){let a=h.autoSource,e=Ki(a);if(e==="milk")return r.autoBusy=!0,ve().then(()=>{let n=a==="milk"?Ce(de==="classic"?"all":de):Va(),s=Te(a==="milk"?"milk:"+de:"milk:all",n.length?n:Va());s&&J(ta(s),{quiet:!0})}).finally(()=>{r.autoBusy=!1,r.lastSwitch=performance.now()});let t=null;if(e==="generate"){let n=Te("gen",ji,ut);t=zt(n&&n.scene)}else if(e==="flux")t=Te("flux",Ka);else if(e==="user")t=Te("user",X,ut);else if(e==="photo"){let n=K.flatMap(c=>Je.map(m=>({ph:c,scene:m.id}))),s=Te("photo:"+K.length,n,ut);s&&(t=Et(s.ph,s.scene))}t||(t=Te("eye",gt,ut));let i=kt(H),o=i.indexOf(t);o>=0&&(se=o),t.photo&&H==="photo"&&re!==t.photo&&(re=t.photo,O()),J(t,{quiet:!0})}function Zi(a,e){let t=h.autopilot&&(!h.autoPause||e-r.lastHuman>h.idle*1e3);if(r.autoActive=t,!t||r.autoBusy)return;r.autoT+=a;let i=(e-r.lastSwitch)/1e3,o=h.autoOnDrop&&p.drop>1.1&&i>12;(i>h.autoInterval||o)&&(p.drop=0,r.lastSwitch=e,ni(),o&&Xe(.8))}function Ji(a){if(T.poll(),T.justConnected&&T.style!=="touch"&&(M("\u{1F3AE}",(T.style==="ps"?"PlayStation":"Xbox")+" controller connected"),T.rumble(.5,.8,200),h.seenGuide||(h.seenGuide=!0,fe(),Me(!0)),T.style==="ps"&&G.supported&&!G.connected&&!j&&(v("#tpChip").classList.remove("hidden"),setTimeout(()=>M("\u25C9","PlayStation pad: click \u201CEnable touchpad\u201D up top to use the touchpad"),1500)),da()),!T.connected){r.lt=N(r.lt,0,a*6),r.rt=N(r.rt,0,a*6);return}let[e,t,i,o]=T.axes;if((T.pressed.some(Boolean)||Math.abs(e)+Math.abs(t)+Math.abs(i)+Math.abs(o)+T.lt+T.rt>.05)&&(Re(),v("#splash").classList.contains("gone")||Qi(),h.uiAutoHide&&Mt()),!v("#controls").classList.contains("hidden")){(T.tap(D.B)||T.tap(D.A)||T.shortRelease(D.BACK))&&Me(!1);return}let s=h.stickSens,c=h.invertY?-1:1;if(Math.abs(e)+Math.abs(t)+Math.abs(i)+Math.abs(o)>.05&&(r.lastStick=performance.now()),d.engine==="milk")r.lensRot+=e*a*1.8*s,r.lensZoom=W(r.lensZoom*Math.exp(t*c*a*1.3*s),.3,4),r.swirlT=i*1.5*s,r.bulgeT=-o*c*1.1*s;else{let l=_[d.scene]&&_[d.scene].camSens||1;r.camX+=e*a*1.5*s*l,r.camY=W(r.camY-t*c*a*1.1*s*l,-1.3,1.3),r.waitCenter&&Math.hypot(i,o)<.12&&(r.waitCenter=!1),r.morphX=N(r.morphX,W(i*s,-1.5,1.5),a*8),r.morphY=N(r.morphY,W(-o*c*s,-1.5,1.5),a*8),r.swirlT=i*.3*s,r.bulgeT=-o*c*.15*s}r.flowX=N(r.flowX,e,a*5),r.flowY=N(r.flowY,-t*c,a*5),r.lt=N(r.lt,T.lt,a*10),r.rt=N(r.rt,T.rt,a*10),T.lt>.08&&Math.random()<a*3&&Jt("LT","Warp",T.lt),T.rt>.08&&Math.random()<a*3&&Jt("RT","Drive",T.rt);let m=T.lt>.92&&T.rt>.92;m&&!r.hyperOn&&(M("\u2604","HYPERDRIVE"),Xe(1.2)),r.hyperOn=m,T.tap(D.A)&&Xe(1),T.tap(D.TOUCH)&&(h.idleDance=!h.idleDance,fe(),Bt(),M("\u25C9",h.idleDance?"Music dance ON":"Music dance OFF \u2014 pure beat reactive"),T.rumble(.3,.5,90)),T.style==="ps"&&G.supported&&!G.connected&&!r.tpTried&&(r.tpTried=!0,G.autoConnect().then(l=>{!l&&j&&G.request()})),r.freeze=T.down(D.B),T.tap(D.B)&&M(T.label("B"),"Freeze"),T.shortRelease(D.X)&&ia(),T.hold(D.X,550)&&(oa(),T.rumble(.6,.6,150)),T.tap(D.Y)&&St(),T.shortRelease(D.LB)&&ii(),T.hold(D.LB,500)&&oi(),T.shortRelease(D.RB)&&ai(1),T.down(D.RB)&&performance.now()-T.downAt[D.RB]>300&&(r.hue+=a*.5,Math.random()<a*2&&M(T.label("RB"),"Hue spin")),T.tap(D.RIGHT)&&xe(1),T.tap(D.LEFT)&&xe(-1),T.tap(D.UP)&&bt(1),T.tap(D.DOWN)&&bt(-1),T.tap(D.L3)&&Gi(),T.tap(D.R3)&&Oi(),T.tap(D.START)&&(r.cinema=!1,sa(!0),ci()),T.shortRelease(D.BACK)&&Me(!0),T.hold(D.BACK,700)&&na(!h.autopilot)}function Qi(){!p.playlist.length&&p.mode==="player"&&!Ie&&ra(),We()}function eo(a,e){if(d.scene!=="flux"||!d.flux)return;let t=r.flux,i=d.flux,o=e[4]||14,n=(c,m)=>{let l=c.filter(f=>f!==m);return l.length?l[Math.floor(Math.random()*l.length)]:c[0]};t.tf+=a,t.tw+=a,t.fm>0&&t.fm<1&&(t.fm=Math.min(1,t.fm+a/3.5)),t.fm>=1&&(t.fa=t.fb,t.fm=0),t.fm===0&&t.tf>o&&i.flows.length>1&&(t.fb=n(i.flows,t.fa),t.fm=.001,t.tf=0),t.wm>0&&t.wm<1&&(t.wm=Math.min(1,t.wm+a/2)),t.wm>=1&&(t.wa=t.wb,t.wm=0);let s=p.drop>.9&&t.tw>4;t.wm===0&&(t.tw>o*.7||s)&&i.waves.length>1&&(t.wb=n(i.waves,t.wa),t.wm=.001,t.tw=0),t.mapT+=a*.03*(e[5]??1)*(1+p.vol*.8)}function to(a){let e=z.W&&z.H?z.W/z.H:1.7777777777777777,t;G.connected&&performance.now()-G.lastReport<600?t=G.t.map(n=>n.active?n:null):t=[ue.active?ue:null,null];for(let n=0;n<2;n++){let s=r.touch[n],c=t[n];if(c&&h.touchMode!=="off"){let m=(c.x-.5)*e,l=.5-c.y;s.on||(s.x=m,s.y=l,s.vx=s.vy=0);let f=(m-s.x)/Math.max(a,.001),u=(l-s.y)/Math.max(a,.001);s.vx=N(s.vx,f,.35),s.vy=N(s.vy,u,.35),s.x=m,s.y=l,s.on=!0,s.s=Math.min(1,s.s+a*3),Re()}else s.on=!1,s.s=Math.max(0,s.s-a*2),s.vx*=.9,s.vy*=.9}let[i,o]=r.touch;if(i.on&&o.on){let n=Math.hypot(i.x-o.x,i.y-o.y),s=Math.atan2(o.y-i.y,o.x-i.x);if(r.pinch){r.lensZoom=W(r.lensZoom*(n/Math.max(.02,r.pinch.d)),.3,4);let c=s-r.pinch.a;c>Math.PI&&(c-=2*Math.PI),c<-Math.PI&&(c+=2*Math.PI),r.lensRot+=c}r.pinch={d:n,a:s}}else r.pinch=null}var Ga=(a,e)=>[a.x,a.y,e?a.s*(r.pinch?.3:1):0,a.s>.01?1:0];function si(a){let e=r.pal,t=[];for(let i=0;i<3;i++)t.push(W(e[i]+e[3+i]*Math.cos(6.2831853*(e[6+i]*a+e[9+i]+r.hue)),0,1));return t}var Gt=performance.now(),dt=0,Ot=0,Ve=16,ze=0,Wt=0;function ri(a){requestAnimationFrame(ri);let e=+h.fpsCap;if(e>0&&a-Gt<1e3/e-1.5)return;let t=Math.min(.05,(a-Gt)/1e3);Gt=a,Ji(t),to(t);let i=d.fx,o=r.rt,n=r.lt,s=r.hyperOn?1:0;r.hyper=N(r.hyper,s,t*3),p.update(t,i.react*(1+o*1.6),{sens:h.beatSens,gB:h.gainBass,gM:h.gainMid,gH:h.gainHigh}),Zi(t,a);let c=h.reactIntensity*i.react,m=h.idleDance?1:0;r.danceT+=t*(.5+p.vol*1.2);let l=r.danceT;r.amX=N(r.amX,m*c*i.dance*(Math.sin(l*.53)*.3*(.35+p.mid)+p.bass*.22*Math.sin(l*.19+1)),t*4),r.amY=N(r.amY,m*c*i.dance*(Math.cos(l*.41)*.25*(.35+p.high)+p.beat*.28),t*6);let f=m*Math.min(c,2)*i.dance*Math.sin(l*.07+.5)*(.04+p.vol*.1),u=m*Math.min(c,2)*i.dance*Math.sin(l*.11)*(.02+p.mid*.05);if(d.engine==="scene"&&_[d.scene]&&_[d.scene].steer){let Y=(r.camX+f)*.9,ge=W((r.camY+u)/1.3,0,1),va=(.85+p.bass*.5+p.beat*.5)*(1-.75*ge*ge);r.fly[0]+=-Math.sin(Y)*t*va,r.fly[1]+=Math.cos(Y)*t*va}d.engine==="milk"&&m>.5&&(r.lensRot+=t*c*i.swirlA*.05*Math.sin(l*.05),a-r.lastStick>4e3&&(r.lensZoom=N(r.lensZoom,1+Math.sin(l*.09)*.15*i.bulgeA,t*.2))),r.sinceBeat+=t,p.isBeat&&(r.sinceBeat>.2&&r.sinceBeat<2&&(r.beatInt=N(r.beatInt,r.sinceBeat,.3)),r.sinceBeat=0,r.jolt=(Math.random()-.5)*2,r.beatRipT=0,r.beatRipAmt=Math.min(1.6,p.bass*.9)*c*i.ripple,h.beatFlash>0&&p.bass>1.2&&a-r.lastAutoBurst>2200&&(r.flash=Math.max(r.flash,h.beatFlash*.5*Math.min(c,1.5)),r.lastAutoBurst=a)),r.jolt*=Math.exp(-t*7),r.beatRipT+=t;let x=d.engine==="scene"&&_[d.scene]&&_[d.scene].landscape?.12:1;r.swirl=N(r.swirl,r.swirlT*(x<1?.4:1)+x*Math.min(c,2)*m*i.swirlA*Math.sin(l*.17)*(.04+p.mid*.16),t*4),r.bulge=N(r.bulge,r.bulgeT+x*Math.min(c,2)*i.bulgeA*p.bass*.08,t*10),i.kaleido>1&&(r.kAngle+=t*p.mid*.25*c*Math.sin(l*.11));let P=window.devicePixelRatio||1,w=h.resolution==="native"?Math.round(innerHeight*Math.min(P,pe?1.25:2)):+h.resolution,S=Math.round(w*innerWidth/Math.max(1,innerHeight));(ie.width!==S||ie.height!==w)&&(ie.width=S,ie.height=w),Ve=N(Ve,t*1e3,.05);let U,A,k=d.engine==="scene"?_[d.scene]:null,y=d.engine==="milk"?"milk":d.scene||"x",C=[1,1,.9,.8,.7,.6,.5,.4],B=k&&k.ss&&!pe&&h.aa==="auto"?0:1,E=d.engine==="milk"?4:C.length-1,F=r.quality||(r.quality={});F[y]||(F[y]={rung:pe?5:B,lockUntil:0,probeAt:-1});let R=F[y];if(R.rung=W(R.rung,B,E),h.renderScale==="auto"){ze+=t;let Y=e>0?1e3/e:16.7,ge=performance.now()/1e3;r.qKey!==y&&(r.qKey=y,ze=-1.5,Ve=Y),ze>1.5&&(Ve>Y*1.22&&R.rung<E?(R.probeAt>0&&ge-R.probeAt<5&&(R.lockUntil=ge+45),R.rung++,R.probeAt=-1,ze=0):Ve<Y*1.08&&R.rung>B&&ge>R.lockUntil&&ze>4&&(R.rung--,R.probeAt=ge,ze=0)),U=C[R.rung],d.engine==="milk"&&(U=Math.max(U,.7))}else U=W(+h.renderScale,.25,2);A=h.aa==="off"?1:h.aa==="2x"?2:h.aa==="4x"?4:pe?1:h.renderScale==="auto"?R.rung===0?2:1:2,r.qs=U,z.ssMax=A;let q=z.fin;z.resize(S,w,U),q!==z.fin&&(z.transTex=null);let V=i.speed*r.timeScale*(1+o*1.2+r.hyper*2);r.freeze||(r.time+=t*V*(1+p.vol*.45*Math.min(c,2.5))),r.hue+=t*(i.hueSpin||0),r.kAngle+=t*(i.kaleidoSpin||0)*.5,r.burstT+=t,r.flash*=Math.exp(-t*6),r.transMix=Math.max(0,r.transMix-t/Math.max(.2,h.transition)),r.roll=N(r.roll,r.flowX*.25,t*2);let Q=Qa(nt(d.palette));for(let Y=0;Y<12;Y++)r.pal[Y]=N(r.pal[Y],Q[Y],1-Math.exp(-t*2.5));if(z.uploadAudio(p.tex),(d.engine==="milk"||i.fusion>0)&&$){_i(Math.max(z.sw,Math.min(S,1280)),Math.max(z.sh,Math.round(Math.min(S,1280)*w/S)));try{$.render(),z.uploadMilk(oe)}catch(Y){console.warn(Y)}}let le=d.engine==="scene"?aa():[0,0,0,0,0,0,0,0];for(;le.length<8;)le.push(0);eo(t,le);let ui=p.beat*h.beatPulse*i.punch*.05*Math.min(c,2.5),di=p.beat*h.cameraShake*i.shake*Math.min(c,2)*.5,Ye=r.pal,pa=h.touchMode==="both"||h.touchMode==="vortex",pi=h.touchMode==="both"||h.touchMode==="paint",ha=r.touch[0],hi=i.trail>.15?p.bass*.05*Math.min(c,2):0;z.frame({adaptRate:1-Math.exp(-t*2.5),engine:d.engine==="milk"&&$?"milk":"scene",scene:d.engine==="milk"?"nebula":d.scene,sceneU:{uTime:r.time,uBass:p.bass,uMid:p.mid,uHigh:p.high,uVol:p.vol,uBeat:p.beat,uDrive:o,uBurst:r.burstT,uHue:r.hue,uBeatCount:p.beatCount,uSinceBeat:r.sinceBeat,uBeatInt:r.beatInt,uFlowA:r.flux.fa,uFlowB:r.flux.fb,uFlowMix:r.flux.fm,uWaveA:r.flux.wa,uWaveB:r.flux.wb,uWaveMix:r.flux.wm,uMapT:r.flux.mapT,uPhoto:z.photoTex,uPhotoH:z.photoHTex,uPhotoAR:z.photoAR,uFly:r.fly,uAudio:z.audioTex,uP0:le.slice(0,4),uP1:le.slice(4,8),uPalA:Ye.slice(0,3),uPalB:Ye.slice(3,6),uPalC:Ye.slice(6,9),uPalD:Ye.slice(9,12),uCam:[r.camX+f,r.camY+u,r.roll+r.jolt*.06*h.cameraShake]},fbU:{uTime:r.time,uTrail:Math.min(.96,Math.max(i.trail+hi,n*.9,r.hyper*.86)),uZoom:i.zoom+n*.035+r.hyper*.04+p.beat*h.beatPulse*.008*c,uSpin:i.spin+n*r.flowX*.03+r.jolt*.004*h.cameraShake,uWarp:i.warp+n*.8+p.mid*.3*Math.min(c,2),uHueDrift:i.hueDrift+n*.012+r.hyper*.05+p.high*.006*c,uKaleido:i.kaleido,uKaleidoSpin:r.kAngle,uMirror:i.mirror,uFusion:d.engine==="milk"?0:$?i.fusion:0,uBreathe:i.breathe+o*.6+p.bass*.35*Math.min(c,2),uMelt:i.melt+n*.5+p.high*.25*Math.min(c,2),uBass:p.bass,uBeat:p.beat,uBurstT:r.burstT,uBurstC:[r.burstCX,r.burstCY],uFlow:[r.flowX*n,r.flowY*n],uLensRot:r.lensRot+r.jolt*.025*h.cameraShake,uLensZoom:r.lensZoom,uLensPan:[0,0],uSwirl:r.swirl,uBulge:r.bulge,uPunch:ui,uShake:di,uBeatRipT:h.beatRipples?r.beatRipT:9,uBeatRipAmt:r.beatRipAmt,uEdgeBlack:d.engine==="scene"&&_[d.scene]&&_[d.scene].space?1:0,uTouch:Ga(r.touch[0],pa),uTouch2:Ga(r.touch[1],pa),uTouchVel:[W(ha.vx*.02,-.08,.08),W(ha.vy*.02,-.08,.08)],uTouchColor:si(r.time*.05),uTouchPaint:pi?1.2:0},finU:{uTime:a/1e3,uChroma:i.chroma+o*2+r.hyper*2+p.beat*1.2*Math.min(c,2),uBloomAmt:i.bloom*(1-r.hyper*.5)+o*.45,uAutoExp:h.autoExposure?1:0,uGrain:i.grain,uVignette:i.vignette,uBurstC:[r.burstCX,r.burstCY],uExposure:i.exposure*(1+o*.12-r.hyper*.15),uSat:i.saturation,uContrast:i.contrast+n*.06,uFlash:r.flash,uTransMix:r.transMix,uBurstT:r.burstT,uBeat:p.beat,uInvert:0}}),h.rumble&&T.connected&&p.isBeat&&performance.now()-r.lastHuman<3e4&&T.rumble(Math.min(1,p.bass*.45)*h.rumbleStrength*(.35+o),.15*h.rumbleStrength,70),r.hyperOn&&h.rumble&&Math.random()<t*10&&T.rumble(.25*h.rumbleStrength,.6*h.rumbleStrength,60),Wt+=t,Wt>1/30&&(Wt=0,ao(),ke&&ke._n!==d.name&&(ke._n=d.name,ke.setName(d.name))),dt+=t,Ot++,dt>.5&&(h.showFps?v("#fps").textContent=`${Math.round(Ot/dt)} fps \xB7 out ${S}\xD7${w} \xB7 render ${z.sw}\xD7${z.sh} (${Math.round(U*100)}%)`:v("#fps").textContent="",dt=0,Ot=0)}var we=document.documentElement.style,Ee=document.getElementById("spec"),Pe=Ee?Ee.getContext("2d"):null;function ao(){let a=e=>si(e).map(t=>Math.round(t*255)).join(",");if(we.setProperty("--c1",a(0)),we.setProperty("--c2",a(.33)),we.setProperty("--c3",a(.66)),we.setProperty("--bass",Math.min(1.5,p.bass).toFixed(3)),we.setProperty("--beat",p.beat.toFixed(3)),Pe&&je.classList.contains("show")){let e=Ee.width=Ee.clientWidth*2,t=Ee.height=Ee.clientHeight*2;Pe.clearRect(0,0,e,t);let i=48,o=e/i,n=Pe.createLinearGradient(0,0,e,0);n.addColorStop(0,`rgb(${a(0)})`),n.addColorStop(.5,`rgb(${a(.33)})`),n.addColorStop(1,`rgb(${a(.66)})`),Pe.fillStyle=n;for(let s=0;s<i;s++){let c=p.tex[Math.floor(s/i*400)]/255,m=Math.max(2,c*c*t);Pe.globalAlpha=.35+c*.6,Pe.fillRect(s*o+1,t-m,o-2,m)}Pe.globalAlpha=1}}var vt=v("#hud");function M(a,e){let t=document.createElement("div");for(t.className="toast",t.innerHTML=`<span class="g">${a}</span><span>${ee(e)}</span>`,vt.appendChild(t);vt.children.length>3;)vt.firstChild.remove();setTimeout(()=>{t.style.opacity=0,setTimeout(()=>t.remove(),450)},1700)}var Oa={};function Jt(a,e,t){let i=Oa[a];(!i||!i.isConnected)&&(i=document.createElement("div"),i.className="toast",i.innerHTML=`<span class="g">${T.label(a)}</span><span>${e}</span><span class="bar"><i></i></span>`,vt.appendChild(i),Oa[a]=i),i.querySelector("i").style.width=Math.round(t*100)+"%",i.style.opacity=1,clearTimeout(i._t),i._t=setTimeout(()=>{i.style.opacity=0,setTimeout(()=>i.remove(),450)},900)}var ee=a=>String(a).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),je=v("#ui"),Pt=0;function sa(a){r.cinema&&!a||(je.classList.add("show"),document.body.classList.remove("idle"),clearTimeout(Pt),h.uiAutoHide&&(Pt=setTimeout(()=>{(!je.matches(":hover")||a==="fromPad")&&Mt()},3500)))}function Mt(){v("#splash").classList.contains("gone")&&!document.activeElement?.matches("input,select")&&(je.classList.remove("show"),document.body.classList.add("idle"))}function ci(){r.panels=!r.panels,document.body.classList.toggle("panels-off",!r.panels)}window.addEventListener("mousemove",()=>sa());je.addEventListener("mouseleave",()=>{clearTimeout(Pt),h.uiAutoHide&&(Pt=setTimeout(Mt,1500))});function We(){v("#splash").classList.add("gone"),document.body.classList.add("started"),ke&&!h.seenTouchHint&&(h.seenTouchHint=!0,fe(),setTimeout(()=>M("\u{1F44D}","Put your thumbs down \u2014 left steers, right morphs"),900))}var io={addFiles:()=>v("#fileIn").click(),addFolder:()=>v("#folderIn").click(),loopback:async()=>{try{Ue(),await p.useLoopback(),We(),M("\u{1F50A}","Listening to your PC audio")}catch(a){M("\u26A0",a.message||"Capture cancelled")}},mic:async()=>{try{Ue(),await p.useMic(),We(),M("\u{1F399}","Listening to microphone")}catch{M("\u26A0","Microphone unavailable")}},demo:()=>{ra(),We()},srcPlayer:()=>{Ue(),p.useSource("player"),p.playlist.length&&p.toggle()},prevPreset:()=>xe(-1),nextPreset:()=>xe(1),mutate:ia,generate:oa,save:St,overwrite:Hi,revert:()=>{J($e,{quiet:!0}),M("\u21BA","Reverted")},deletePreset:Vi,resetSettings:()=>{let a=document.querySelector("[data-act=resetSettings]");if(a&&!a.dataset.armed){a.dataset.armed="1";let t=a.textContent;a.textContent="Tap again to reset everything",setTimeout(()=>{delete a.dataset.armed,a.textContent=t},3e3);return}let e=["volume","seenGuide","seenTouchHint","outputDevice","aaV"];for(let t of Object.keys(pt))e.includes(t)||h[t]===pt[t]||(h[t]=pt[t],he[t]&&he[t](h[t]));fe(),Bt(),v("#autoBtn").classList.toggle("on",h.autopilot),M("\u21BA","Settings back to defaults")},autopilot:()=>na(!h.autopilot),controls:()=>Me(!0),fullscreen:ca,playPause:()=>{Ue(),p.toggle()},record:()=>fi(),prevTrack:()=>p.prev(),nextTrack:()=>p.next(),shuffle:()=>{p.shuffle=!p.shuffle,Tt()},repeat:()=>{p.repeat={all:"one",one:"off",off:"all"}[p.repeat],Tt()},clearList:()=>{p.clear(),ma()},exportPresets:()=>{let a=new Blob([JSON.stringify(X,null,2)],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(a),e.download="eye-candy-presets.json",e.click()},importPresets:()=>v("#importIn").click(),sheetVisuals:()=>xt("visuals"),sheetMusic:()=>xt("music"),closeSheet:()=>xt(null),touchpad:async()=>{let a=await G.request();M("\u25C9",a?"Touchpad on \u2014 swipe to stir the visuals":"No PlayStation controller found"),v("#tpChip").classList.toggle("hidden",a)}};document.addEventListener("click",a=>{let e=a.target.closest("[data-act]");if(!e)return;p.resume();let t=io[e.dataset.act];t&&t()});function ra(){Ie||(p.el.pause(),p.stopStream(),p.mode="demo",Ie=Da(p),p.resume(),li(),M("\u2726","Demo groove"))}function Ue(){Ie&&(Ie(),Ie=null,p.mode==="demo"&&(p.mode="player"))}async function xt(a){let e=document.body,t=e.classList.contains("sheet-visuals")?"visuals":e.classList.contains("sheet-music")?"music":null;e.classList.remove("sheet-visuals","sheet-music"),a&&a!==t&&e.classList.add("sheet-"+a),a==="visuals"&&O()}async function ca(){if(j&&j.setFullscreen){j.setFullscreen(!await j.isFullscreen());return}document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{})}function Me(a){da(),v("#controls").classList.toggle("hidden",!a)}var oo=/\.(mp3|flac|wav|ogg|oga|m4a|aac|opus|webm|wma|aiff?)$/i,no=a=>({name:a.name.replace(/\.[^.]+$/,""),url:URL.createObjectURL(a),path:j?j.pathFor(a):null});function la(a){let e=[...a].filter(t=>oo.test(t.name)||(t.type||"").startsWith("audio/")).sort((t,i)=>(t.webkitRelativePath||t.name).localeCompare(i.webkitRelativePath||i.name,void 0,{numeric:!0}));if(!e.length)return M("\u26A0","No audio files found");Ue(),p.addTracks(e.map(no)),We(),ma(),M("\u266B",`Added ${e.length} track${e.length>1?"s":""}`)}v("#fileIn").onchange=a=>{la(a.target.files),a.target.value=""};v("#folderIn").onchange=a=>{la(a.target.files),a.target.value=""};v("#importIn").onchange=async a=>{try{let e=JSON.parse(await a.target.files[0].text()),t=(Array.isArray(e)?e:[e]).filter(i=>i&&i.engine);t.forEach(i=>{i.id="user-"+Math.random().toString(36).slice(2),i.builtin=!1}),X.push(...t),He(X),O(),M("\u2605",`Imported ${t.length} presets`)}catch{M("\u26A0","Could not read that file")}a.target.value=""};window.addEventListener("dragover",a=>a.preventDefault());window.addEventListener("drop",async a=>{a.preventDefault(),p.resume();let e=[...a.dataTransfer.items||[]],t=[],i=s=>new Promise(c=>{if(s.isFile)s.file(m=>{t.push(m),c()},c);else if(s.isDirectory){let m=s.createReader(),l=[],f=()=>m.readEntries(async u=>{if(u.length)l.push(...u),f();else{for(let b of l)await i(b);c()}},c);f()}else c()}),o=e.map(s=>s.webkitGetAsEntry&&s.webkitGetAsEntry()).filter(Boolean);if(o.length)for(let s of o)await i(s);else t.push(...a.dataTransfer.files);if(t.some(s=>/^image\//.test(s.type))&&!t.some(s=>/^audio\//.test(s.type)||/\.(mp3|wav|flac|ogg|m4a|aac|opus)$/i.test(s.name))){await ua(t);return}let n=t.find(s=>/\.json$/i.test(s.name));if(n&&t.length===1){v("#importIn").onchange({target:{files:[n],value:""}});return}la(t)});function so(a){return"app://eye/media/"+encodeURIComponent(a)}function ma(){j&&localStorage.setItem("eyecandy.playlist",JSON.stringify(p.playlist.filter(a=>a.path).map(a=>({name:a.name,path:a.path}))))}function ro(){if(j)try{let a=JSON.parse(localStorage.getItem("eyecandy.playlist")||"[]");p.playlist.push(...a.map(e=>({...e,url:so(e.path)})))}catch{}}var Wa=a=>isFinite(a)?`${Math.floor(a/60)}:${String(Math.floor(a%60)).padStart(2,"0")}`:"0:00";function Tt(){let a=v("#playlist");p.playlist.length?a.innerHTML=p.playlist.map((e,t)=>`<li data-i="${t}" class="${t===p.index&&p.mode==="player"?"cur":""}"><span class="n">${t+1}</span><span class="t">${ee(e.name)}</span><button class="x" data-x="${t}">\u2715</button></li>`).join(""):a.innerHTML='<li class="empty">Drop songs or folders here<br><small>mp3 \xB7 flac \xB7 wav \xB7 ogg \xB7 m4a</small></li>',v("#shuffleBtn").classList.toggle("on",p.shuffle),v("#repeatBtn").textContent={all:"\u21BB Repeat all",one:"\u21BB Repeat one",off:"\u2192 No repeat"}[p.repeat],v("#repeatBtn").classList.toggle("on",p.repeat!=="off"),li()}v("#playlist").addEventListener("click",a=>{let e=a.target.closest("[data-x]");if(e){p.remove(+e.dataset.x),ma();return}let t=a.target.closest("li[data-i]");t&&(Ue(),p.play(+t.dataset.i))});function li(){let a=p.current,e=p.mode;v("#npTitle").textContent=e==="loopback"?"PC audio":e==="mic"?"Microphone":e==="demo"?"Demo groove":a?a.name:"Nothing playing",v("#npSub").textContent=e==="player"?a?`Track ${p.index+1} of ${p.playlist.length}`:"Drop music anywhere":"Live input",v("#playBtn").textContent=v("#playBtn2").textContent=e==="player"&&!p.el.paused?"\u275A\u275A":"\u25B6";for(let[t,i]of[["#srcPlayer","player"],["#srcLoop","loopback"],["#srcMic","mic"],["#srcDemo","demo"]])v(t).classList.toggle("on",e===i)}p.onchange=Tt;var wt=v("#seek"),fa=!1;wt.addEventListener("input",()=>{fa=!0});wt.addEventListener("change",()=>{isFinite(p.el.duration)&&(p.el.currentTime=wt.value/1e3*p.el.duration),fa=!1});v("#vol").value=Math.round(h.volume*100);v("#vol").addEventListener("input",a=>{h.volume=a.target.value/100,p.out.gain.value=h.volume,fe()});setInterval(()=>{let a=p.el;!fa&&isFinite(a.duration)&&(wt.value=a.currentTime/a.duration*1e3),v("#tCur").textContent=Wa(a.currentTime),v("#tDur").textContent=Wa(a.duration)},250);var $t=new Map;function $a(a){if(a.engine==="milk"){let n=0;for(let s of a.name)n=(n*31+s.charCodeAt(0))%360;return`linear-gradient(90deg,hsl(${n},90%,55%),hsl(${(n+80)%360},90%,50%),hsl(${(n+160)%360},90%,55%))`}let e=JSON.stringify(a.palette);if($t.has(e))return $t.get(e);let t=nt(a.palette),i=[];for(let n=0;n<=4;n++){let s=n/4,c=[0,1,2].map(m=>Math.round(255*W(t.a[m]+t.b[m]*Math.cos(6.2831853*(t.c[m]*s+t.d[m])),0,1)));i.push(`rgb(${c})`)}let o=`linear-gradient(90deg,${i.join(",")})`;return $t.set(e,o),o}function O(){let a=v("#search").value.trim().toLowerCase(),e=kt(H),t=v("#presetList");if(v("#milkCat").classList.toggle("hidden",H!=="milk"),v("#photoBox").classList.toggle("hidden",H!=="photo"),v("#search").classList.toggle("hidden",H==="photo"),H==="photo"&&(co(),!K.length)){t.innerHTML='<li class="msg">Add a photo and pick a style \u2014 your photo becomes a living visualizer.<br><br>Photos stay on this device. Nothing is uploaded.</li>';return}if(H==="milk"&&!$){t.innerHTML='<li class="msg">Loading MilkDrop library\u2026</li>',ve().then(()=>{mo(),O()});return}if(H==="user"&&!e.length){t.innerHTML=`<li class="msg">No saved presets yet.<br>Press \u2605 Save (or ${T.label("Y")} on the controller) to keep the current look.</li>`;return}let i=[];for(let n=0;n<e.length;n++){let s=e[n];if(a&&!s.name.toLowerCase().includes(a))continue;let c=s.engine==="milk"?"MilkDrop":H==="photo"?"":(s.photo?"\u{1F4F7} ":"")+(_[s.scene]?.name||"");if(H==="photo"){let m=_[s.scene];i.push(`<li data-i="${n}" class="pstyle ${s.id===d.id?"cur":""}"><span class="sw" style="background:${$a(s)}"></span><span class="nm">${ee(m.name)}<span class="pdesc">${ee(m.desc||"")}</span></span></li>`);continue}if(i.push(`<li data-i="${n}" class="${s.id===d.id?"cur":""}"><span class="sw" style="background:${$a(s)}"></span><span class="nm">${ee(s.name)}</span><span class="s">${ee(c)}</span></li>`),i.length>3e3)break}t.innerHTML=i.join("");let o=t.querySelector(".cur");o&&!t.matches(":hover")&&o.scrollIntoView({block:"nearest"})}function co(){let a=v("#photoStrip");a.innerHTML=K.map(e=>`<div class="pthumb ${e.id===re?"on":""}" data-ph="${e.id}" title="${ee(e.name)}"><img src="${e.thumb}" alt=""><button class="pdel" data-del="${e.id}" title="Remove photo">\u2715</button></div>`).join(""),v("#photoHint").textContent=K.length?"Tap a photo, then pick a style \u2193":""}v("#photoStrip").addEventListener("click",async a=>{let e=a.target.closest("[data-del]");if(e){if(a.stopPropagation(),!e.dataset.armed){e.dataset.armed="1",e.textContent="Delete?",e.classList.add("armed"),setTimeout(()=>{e.isConnected&&(delete e.dataset.armed,e.textContent="\u2715",e.classList.remove("armed"))},2500);return}let i=e.dataset.del;await Fa(i),K=K.filter(o=>o.id!==i),re===i&&(re=K[0]?.id||null),z.photoId===i&&(z.photoId=null),M("\u2715","Photo removed"),O();return}let t=a.target.closest("[data-ph]");t&&(re=t.dataset.ph,mi())});function mi(){let a=ei(re);if(!a.length){O();return}let e=Math.max(0,a.findIndex(t=>t.scene===d.scene));se=e,J(a[e])}async function ua(a){let e=[...a].filter(o=>/^image\//.test(o.type)||/\.(jpe?g|png|webp|gif|bmp|avif|heic)$/i.test(o.name));if(!e.length)return!1;M("\u{1F4F7}",e.length>1?`Adding ${e.length} photos\u2026`:"Adding photo\u2026");let t=null;for(let o of e)try{t=await za(o,pe?1600:2048),K.unshift(t)}catch{M("\u26A0",`Could not read ${o.name}`)}if(!t)return!0;re=t.id,lo(),mi(),M("\u{1F4F7}","Photo added \u2014 now pick a style");let i=v("#presetList");return i.classList.remove("pickme"),i.offsetWidth,i.classList.add("pickme"),!0}function lo(){ne(".tab").forEach(a=>a.classList.toggle("on",a.dataset.tab==="presets")),ne(".tabpage").forEach(a=>a.classList.toggle("on",a.id==="tab-presets")),ne(".cbtn").forEach(a=>a.classList.toggle("on",a.dataset.coll==="photo")),H="photo",O(),document.body.classList.contains("mobile")&&!document.body.classList.contains("sheet-visuals")&&xt("visuals")}v("#photoIn").onchange=async a=>{await ua(a.target.files),a.target.value=""};Ea().then(a=>{K=a,re=a[0]?.id||null,H==="photo"&&O()});v("#presetList").addEventListener("click",a=>{let e=a.target.closest("li[data-i]");e&&(se=+e.dataset.i,J(kt(H)[se]))});v("#search").addEventListener("input",O);function mo(){let a=v("#milkCat"),e=Object.keys(qe).sort(),t=Ce("all").length;a.innerHTML=`<option value="all">All MilkDrop (${t})</option><option value="classic">Classic Butterchurn (${yt.length})</option>`+e.map(i=>`<option value="${i}">${i} (${qe[i].length})</option>`).join(""),a.value=de}v("#milkCat").addEventListener("change",a=>{de=a.target.value,se=-1,O()});ne(".cbtn").forEach(a=>a.onclick=()=>{ne(".cbtn").forEach(e=>e.classList.toggle("on",e===a)),H=a.dataset.coll,se=-1,O()});ne(".tab").forEach(a=>a.onclick=()=>{ne(".tab").forEach(e=>e.classList.toggle("on",e===a)),ne(".tabpage").forEach(e=>e.classList.toggle("on",e.id==="tab-"+a.dataset.tab)),a.dataset.tab==="tweak"&&ce()});var Xa=[["trail","Tracers",0,.97],["zoom","Tunnel Zoom",.96,1.06],["spin","Spin",-.03,.03],["warp","Warp",0,2],["breathe","Breathing",0,2],["melt","Melt",0,2],["hueDrift","Color Drift",-.05,.05],["hueSpin","Hue Cycle",-.3,.3],["kaleido","Kaleidoscope",0,16,1],["kaleidoSpin","Kaleido Spin",-1,1],["mirror","Mirror",0,1,1],["fusion","MilkDrop Fusion",0,1],["react","Audio Reactivity",0,2.5],["speed","Speed",0,3],["chroma","Chromatic",0,3],["bloom","Bloom",0,2],["exposure","Exposure",.4,2],["saturation","Saturation",0,2],["contrast","Contrast",.6,1.6],["grain","Film Grain",0,1],["vignette","Vignette",0,1.5],["#","Music motion"],["dance","Shape Dance",0,2.5],["ripple","Beat Ripples",0,2.5],["punch","Bass Punch",0,2.5],["shake","Beat Shake",0,2.5],["swirlA","Audio Swirl",0,2.5],["bulgeA","Bass Bulge",0,2.5]];v("#sceneSel").innerHTML=Ae.map(a=>`<option value="${a.id}">${a.name}</option>`).join("")+'<optgroup label="Photo styles">'+Je.map(a=>`<option value="${a.id}">\u{1F4F7} ${a.name}</option>`).join("")+'</optgroup><option value="__milk">MilkDrop engine</option>';v("#palSel").innerHTML=Z.map((a,e)=>`<option value="${e}">${a.name}</option>`).join("")+'<option value="custom">Custom (generated)</option>';function ja(a,e,t,i,o,n,s){let c=document.createElement("div");c.className="sl "+(n||"");let m=o||(t-e)/400;c.innerHTML=`<span title="${ee(a)}">${ee(a)}</span><input type="range" min="${e}" max="${t}" step="${m}" value="${i}"><span class="v"></span>`;let l=c.querySelector("input"),f=c.querySelector(".v"),u=()=>f.textContent=(+l.value).toFixed(o===1?0:2);return u(),l.addEventListener("input",()=>{u(),s(+l.value),Re()}),c._set=b=>{document.activeElement!==l&&(l.value=b,u())},c}var Xt={},jt=[];function ce(){if(!v("#tab-tweak").classList.contains("on"))return;if(v("#pName").value=d.name,v("#sceneSel").value=d.engine==="milk"?"__milk":d.scene,v("#palSel").value=typeof d.palette=="number"?String(d.palette):"custom",v("#milkRow").classList.toggle("hidden",!(d.engine==="milk"||d.fx.fusion>0)),$){let n=Ce("all");v("#milkSel").options.length!==n.length&&(v("#milkSel").innerHTML=n.map(s=>`<option>${ee(s)}</option>`).join(""))}$&&(v("#milkSel").value=d.engine==="milk"?d.milk:Be||"");let a=v("#paramSliders"),e=_[d.scene],t=d.engine+":"+d.scene;a._key!==t?(a._key=t,a.innerHTML="",jt=[],d.engine==="scene"&&e?(e.params.forEach((n,s)=>{let c=ja(n.n,n.min,n.max,d.params[s],0,(e.stick||[]).includes(s)?"stick":"",m=>{d.params[s]=m});jt.push(c),a.appendChild(c)}),v("#stickNames").textContent=(e.stick||[0,1]).map(n=>e.params[n].n).join(" & ")):(a.innerHTML='<p class="fine">MilkDrop presets carry their own math \u2014 shape them with the Trip FX below, the triggers, and the kaleidoscope.</p>',v("#stickNames").textContent="\u2014")):jt.forEach((n,s)=>n._set(d.params[s]));let i=v("#fxSliders");i.children.length?Xa.forEach(([n])=>{Xt[n]&&Xt[n]._set(d.fx[n]??ae[n]??0)}):Xa.forEach(([n,s,c,m,l])=>{if(n==="#"){let u=document.createElement("h3");u.textContent=s,i.appendChild(u);return}let f=ja(s,c,m,d.fx[n]??0,l,"",u=>{d.fx[n]=u,n==="fusion"&&u>0&&ve().then(()=>{Be||Oe(ea()),v("#milkRow").classList.remove("hidden"),ce()})});Xt[n]=f,i.appendChild(f)});let o=X.some(n=>n.id===d.id);v("#overwriteBtn").classList.toggle("hidden",!o),v("#deleteBtn").classList.toggle("hidden",!o)}v("#pName").addEventListener("change",a=>{d.name=a.target.value,v("#presetName").textContent=d.name});v("#sceneSel").addEventListener("change",a=>{let e=a.target.value;if(e==="__milk"){ve().then(()=>J(ta(Be||ea())));return}let t=_[e];J({...d,id:"edit-"+Date.now(),engine:"scene",scene:e,params:t.params.map(i=>i.def),name:t.name+" (custom)",builtin:!1},{quiet:!0})});v("#palSel").addEventListener("change",a=>{a.target.value!=="custom"&&(d.palette=+a.target.value)});v("#milkSel").addEventListener("change",a=>{let e=a.target.value;d.engine==="milk"?(d.milk=e,d.name=e,v("#presetName").textContent=e):d.milk=e,Oe(e)});var fo=[["#","Display"],["resolution","Output resolution","select",{native:"Native (match screen)",2160:"4K \xB7 2160p",1440:"1440p",1080:"1080p",900:"900p",720:"720p",540:"540p (potato mode)"}],["renderScale","Render scale","select",{auto:"Auto (adaptive)","0.5":"50%","0.67":"67%","0.75":"75%","0.85":"85%",1:"100%","1.25":"125% \xB7 supersampled","1.5":"150% \xB7 supersampled",2:"200% \xB7 supersampled"}],["aa","Anti-aliasing","select",{off:"Off \xB7 crisp (default)",auto:"Auto (smooth when GPU has room)","2x":"2\xD7 supersampling","4x":"4\xD7 supersampling"}],["fpsCap","Frame rate cap","select",{0:"Unlimited (VSync)",144:"144 fps",120:"120 fps",60:"60 fps",30:"30 fps"}],["autoExposure","Auto exposure","toggle","Keeps every preset from blowing out to white (or sinking to black)"],["startFullscreen","Start in fullscreen","toggle","Open straight into fullscreen next launch"],["uiScale","Interface size","range",[.75,1.5,.05,"\xD7"]],["uiAutoHide","Auto-hide interface","toggle","Panels fade away when you are not using the mouse"],["showFps","Show FPS & resolution","toggle",""],["#","Music reaction"],["reactIntensity","Reaction intensity","range",[0,3,.05,"\xD7"]],["idleDance","Music dance","toggle","Shapes, lens and camera always move with the music \u2014 your controller adds on top"],["beatRipples","Beat ripples","toggle","Every kick sends a shockwave through the image"],["beatPulse","Bass punch","range",[0,2,.05,"\xD7"]],["beatFlash","Drop flashes","range",[0,1,.05,""]],["cameraShake","Beat shake","range",[0,1.5,.05,""]],["beatSens","Beat sensitivity","range",[0,2,.05,""]],["gainBass","Bass gain","range",[0,3,.05,"\xD7"]],["gainMid","Mid gain","range",[0,3,.05,"\xD7"]],["gainHigh","Treble gain","range",[0,3,.05,"\xD7"]],["outputDevice","Audio output","select",{default:"System default"}],["#","Autopilot"],["autopilot","Autopilot","toggle","Keeps changing presets on its own, even while you play"],["autoPause","Pause autopilot while I play","toggle","Hold the current preset while you are using the controller"],["autoInterval","Time per preset","range",[8,120,1,"s"]],["autoSource","Autopilot plays","select",{mix:"Everything mixed",mixp:"Everything + my photos",photo:"My photos only",eye:"Eye Candy presets",flux:"Flux engine",generate:"Fresh generated presets",milk:"MilkDrop library",user:"My presets",all:"Eye Candy + MilkDrop"}],["autoOnDrop","Switch on drops","toggle","Jump to a new preset when the beat drops"],["idle","Resume after I stop playing","range",[3,120,1,"s"]],["transition","Transition length","range",[.2,4,.1,"s"]],["#","Controller"],["stickSens","Stick sensitivity","range",[.3,2.5,.05,"\xD7"]],["invertY","Invert Y axis","toggle",""],["deadzone","Stick deadzone","range",[0,.4,.01,""]],["rumble","Rumble","toggle","Feel the bass in your hands"],["rumbleStrength","Rumble strength","range",[0,1,.05,""]],["touchMode","PS touchpad / right-drag","select",{both:"Vortex + paint light",vortex:"Vortex only",paint:"Paint light only",off:"Off"}],["@touchpad"]],he={deadzone:a=>T.deadzone=a,uiScale:a=>we.setProperty("--ui",a),outputDevice:a=>p.setOutput(a).then(e=>M("\u{1F508}",e?"Audio output changed":"Could not switch output")),renderScale:()=>{r.quality={}},aa:()=>{r.quality={}},autopilot:a=>v("#autoBtn").classList.toggle("on",a)};async function uo(a){try{(await navigator.mediaDevices.enumerateDevices()).filter(t=>t.kind==="audiooutput"&&t.deviceId!=="default").forEach(t=>{let i=document.createElement("option");i.value=t.deviceId,i.textContent=t.label||"Output "+t.deviceId.slice(0,5),a.appendChild(i)}),a.value=h.outputDevice}catch{}}function Bt(){let a=v("#settingsForm");a.innerHTML="";for(let[e,t,i,o]of fo){if(e==="#"){let s=document.createElement("h3");s.className="sethead",s.textContent=t,a.appendChild(s);continue}let n=document.createElement("div");if(n.className="set",e==="@touchpad"){n.innerHTML=`<div>PS touchpad<div class="d" id="tpStatus">${ee(G.status)}</div></div><button class="mini" id="tpBtn">${G.connected?"Reconnect":"Connect"}</button>`,n.querySelector("#tpBtn").onclick=async()=>{let s=await G.request();M("\u25C9",s?"Touchpad connected \u2014 swipe to stir the visuals":"No PlayStation controller found")},a.appendChild(n);continue}if(i==="toggle")n.innerHTML=`<div>${t}<div class="d">${o}</div></div><div class="toggle ${h[e]?"on":""}"></div>`,n.querySelector(".toggle").onclick=s=>{h[e]=!h[e],s.target.classList.toggle("on",h[e]),fe(),he[e]&&he[e](h[e])};else if(i==="select"){n.innerHTML=`<div>${t}</div><select>${Object.entries(o).map(([c,m])=>`<option value="${c}" ${String(h[e])===c?"selected":""}>${m}</option>`).join("")}</select>`;let s=n.querySelector("select");e==="outputDevice"&&uo(s),s.onchange=c=>{h[e]=c.target.value,fe(),he[e]&&he[e](h[e])}}else{let[s,c,m,l]=o;n.innerHTML=`<div>${t} <span class="d">${h[e]}${l}</span></div><input type="range" min="${s}" max="${c}" step="${m}" value="${h[e]}">`,n.querySelector("input").oninput=f=>{h[e]=+f.target.value,n.querySelector(".d").textContent=h[e]+l,fe(),he[e]&&he[e](h[e])}}a.appendChild(n)}}G.onstatus=a=>{let e=document.getElementById("tpStatus");e&&(e.textContent=a),G.connected&&M("\u25C9",a)};function da(){let a=t=>`<span class="k">${T.label(t)}</span>`,e=[["Left stick","Steer","Fly the camera / drag the trails"],["Right stick","Morph","Bend the two \u25C9 shape params live"],[a("LT"),"Warp","Squeeze into infinite feedback tunnels"],[a("RT"),"Drive","Overdrive audio reaction, bloom & speed"],[a("LT")+"+"+a("RT"),"Hyperdrive","Both triggers fully \u2014 hold on"],[a("LB"),"Kaleidoscope","Tap to cycle \xB7 hold for mirror world"],[a("RB"),"Palette","Tap next colors \xB7 hold to spin hues"],["\u25C0 \u25B6","Presets","Previous / next look"],["\u25B2 \u25BC","Time","Speed up, slow down, even reverse"],[a("A"),"Burst","Shockwave + flash. Hit it on the beat"],[a("B"),"Freeze","Hold to stop time while trails melt on"],[a("X"),"Randomize","Tap remix \xB7 hold for a brand-new preset"],[a("Y"),"Save","Keep this exact look in My Presets"],[a("L3"),"Reset view","Click left stick"],[a("R3"),"Lock shape","Click right stick to keep the morph"],[a("START"),"Menu","Show / hide the panels"],[a("BACK"),"This guide","Hold to toggle autopilot"],["Touchpad","Stir (PS)","Swipe to swirl & paint \xB7 pinch/twist \xB7 click = Music dance on/off"]];v("#cgrid").innerHTML=e.map(([t,i,o])=>`<div class="cg"><span class="k">${t.startsWith("<")?t.replace(/<\/?span[^>]*>/g,""):t}</span><div><b>${i}</b><small>${o}</small></div></div>`).join(""),ne("[data-g]").forEach(t=>t.textContent=T.label(t.dataset.g))}v("#controls").addEventListener("click",a=>{a.target.id==="controls"&&Me(!1)});window.addEventListener("keydown",a=>{if(a.target.matches("input,select,textarea"))return;Re(),p.resume();let e=a.key;e==="ArrowRight"?xe(1):e==="ArrowLeft"?xe(-1):e==="ArrowUp"?bt(1):e==="ArrowDown"?bt(-1):e===" "?(a.preventDefault(),Xe(1)):e==="r"||e==="R"?ia():e==="g"||e==="G"?oa():e==="s"||e==="S"?St():e==="k"||e==="K"?ii():e==="m"||e==="M"?oi():e==="p"||e==="P"?ai(1):e==="f"||e==="F"||e==="F11"?(a.preventDefault(),ca()):e==="h"||e==="H"?(r.cinema=!r.cinema,r.cinema?Mt():sa(),M("H",r.cinema?"Interface hidden (H to show)":"Interface on")):e==="Tab"?(a.preventDefault(),ci()):e==="a"||e==="A"?na(!h.autopilot):e==="v"||e==="V"?fi():e==="c"||e==="C"?Me(v("#controls").classList.contains("hidden")):e==="Escape"?Me(!1):e==="MediaPlayPause"?p.toggle():e==="MediaTrackNext"?p.next():e==="MediaTrackPrevious"&&p.prev()});var Se=new rt(ie,p),Ya=null;function fi(){if(!Se.supported){M("\u25CF","Recording is not supported in this browser");return}if(Se.recording){Se.stop();return}p.resume(),Se.start(d.name||"clip")}Se.onstate=(a,e)=>{if(document.body.classList.toggle("recording",a),ne("[data-act=record]").forEach(t=>{t.classList.toggle("on",a),t.title=a?"Stop recording (V)":"Record a clip (V)"}),v("#recHud").classList.toggle("hidden",!a),clearInterval(Ya),a){M("\u25CF","Recording \u2014 press \u25CF again (or V) to stop");let t=()=>{let i=Math.floor(Se.seconds);v("#recT").textContent=Math.floor(i/60)+":"+String(i%60).padStart(2,"0")};t(),Ya=setInterval(t,250)}else if(e){let t=(e.size/1048576).toFixed(1);e.error==="empty"?M("\u26A0","Nothing was captured \u2014 video recording may not be supported on this device"):e.error?M("\u26A0","The clip could not be saved"):e.path?(r.lastClip=e.path,M("\u{1F4BE}",`Clip saved to Videos \u203A Eye Candy (${t} MB)`)):M("\u{1F4BE}",`Saved ${e.file} (${t} MB) to your downloads`)}};var Fe=null;ie.addEventListener("contextmenu",a=>a.preventDefault());ie.addEventListener("pointerdown",a=>{if(a.button===2){ue.active=!0,ue.x=a.clientX/innerWidth,ue.y=a.clientY/innerHeight;return}if(a.button===1){Xe(1,(a.clientX/innerWidth-.5)*innerWidth/innerHeight,.5-a.clientY/innerHeight);return}Fe={x:a.clientX,y:a.clientY},Re()});window.addEventListener("pointerup",a=>{a.button===2&&(ue.active=!1)});window.addEventListener("pointermove",a=>{ue.active&&(ue.x=a.clientX/innerWidth,ue.y=a.clientY/innerHeight)});window.addEventListener("pointerup",()=>Fe=null);window.addEventListener("pointermove",a=>{Fe&&(r.camX+=(a.clientX-Fe.x)*.004,r.camY=W(r.camY+(a.clientY-Fe.y)*.003,-1.3,1.3),Fe={x:a.clientX,y:a.clientY},Re())});ie.addEventListener("wheel",a=>{d.fx.trail=W(d.fx.trail-a.deltaY*8e-4,0,.97),Jt("LT","Tracers",d.fx.trail/.97),Re(),ce()},{passive:!0});ie.addEventListener("dblclick",ca);we.setProperty("--ui",h.uiScale);pe&&(r.panels=!1,h.uiAutoHide=!1);j&&h.startFullscreen&&j.setFullscreen&&j.setFullscreen(!0);h.outputDevice!=="default"&&p.setOutput(h.outputDevice);G.autoConnect();j||document.querySelectorAll("[data-act=loopback]").forEach(a=>{a.innerHTML=a.classList.contains("src")?"Tab/PC":"\u{1F50A} Visualize a tab or PC audio",a.title="Pick a tab (e.g. YouTube/Spotify web) or your whole screen and tick \u201CShare audio\u201D"});ro();Tt();Bt();O();da();v("#autoBtn").classList.toggle("on",h.autopilot);v("#presetName").textContent=d.name;H="eye";{let a=Te("eye",gt);se=gt.indexOf(a),J(a,{transition:!1,quiet:!0})}var Yt=Ae.map(a=>a.id),Kt=0;(function a(){if(Kt>=Yt.length){v("#loadbar").style.opacity=0;return}z.sceneProg(Yt[Kt++]),v("#loadbar div").style.width=Kt/Yt.length*100+"%",setTimeout(a,0)})();requestAnimationFrame(ri);window.__eye={get milkCanvas(){return oe},getMilkPreset:Ja,ensureMilk:ve,get milk(){return $},milkNamesFor:Ce,startDemoGroove:ra,R:z,audio:p,L:r,get cur(){return d},loadPreset:J,autoNext:ni,get clip(){return Se},BUILTIN:be,SCENES:Le,settings:h,get photos(){return K},addPhotoFiles:ua,get collection(){return H}};})();
