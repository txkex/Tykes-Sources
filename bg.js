(function(){
const cv=document.getElementById("bg"),g=cv.getContext("2d"),mono="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";
const RMo=matchMedia("(prefers-reduced-motion: reduce)").matches;
let w=0,h=0,dpr=1,sY=0,pY=0,T=0,rain=[],items=[],small=false,queued=false;
const lo=document.createElement("canvas"),lg2=lo.getContext("2d"),vc=document.createElement("canvas"),vg2=vc.getContext("2d");let LW=0,LH=0;
let seed=20;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
const GL="01<>/{}[]$#!?=+*;:0123456789ABCDEF",pick=a=>a[(rnd()*a.length)|0];
const WORDS=[">_","</>","{ }","0x1337","root@ps3:~#","sudo su","[ OK ]","#!/bin/sh","0xDEADBEEF","chmod +x","./exploit","ACCESS GRANTED","uid=0(root)","payload.bin","0101 1010","ping -c 1","git clone","$ ssh root@"];
const ICONS=["lock","skull","chip","term","pad"];
const BLOBS=[[278,.10,.05,.07,.09,.62,.24],[238,.92,.35,.06,.08,.55,.17],[322,.80,.98,.08,.06,.60,.15],[265,.30,.80,.05,.07,.50,.17]];
function setup(){
  w=innerWidth;h=innerHeight;dpr=1;small=w<700;
  cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);
  LW=Math.max(2,w>>2);LH=Math.max(2,h>>2);lo.width=vc.width=LW;lo.height=vc.height=LH;
  const Rv=Math.max(LW,LH),vg=vg2.createRadialGradient(LW/2,LH*.45,Math.min(LW,LH)*.35,LW/2,LH*.45,Rv*.8);
  vg.addColorStop(0,"rgba(6,2,14,0)");vg.addColorStop(1,"rgba(6,2,14,.7)");vg2.clearRect(0,0,LW,LH);vg2.fillStyle=vg;vg2.fillRect(0,0,LW,LH);
  const sp=small?52:44;rain=[];
  for(let i=0;i<Math.ceil(w/sp);i++){const len=8+((rnd()*10)|0);
    rain.push({x:i*sp+sp/2,y:rnd()*h,v:40+rnd()*70,len,ch:Array.from({length:18},()=>pick(GL))})}
  items=[];const n=small?20:38;
  for(let i=0;i<n;i++)items.push({icon:rnd()<.42,kind:pick(ICONS),word:pick(WORDS),x:rnd()*w,y:rnd()*(h+200),d:.15+rnd()*.7,rot:(rnd()-.5)*.5,ph:rnd()*6.28});
}
function icon(k,s){
  g.beginPath();
  if(k==="lock"){g.rect(-s*.5,-s*.05,s,s*.75);g.moveTo(-s*.3,-s*.05);g.lineTo(-s*.3,-s*.3);g.arc(0,-s*.3,s*.3,Math.PI,0);g.lineTo(s*.3,-s*.05);g.moveTo(0,s*.2);g.lineTo(0,s*.4)}
  else if(k==="skull"){g.arc(0,-s*.1,s*.5,Math.PI*.82,Math.PI*2.18);g.lineTo(s*.28,s*.5);g.lineTo(-s*.28,s*.5);g.closePath();
    g.moveTo(-s*.1,-s*.05);g.arc(-s*.2,-s*.05,s*.12,0,6.3);g.moveTo(s*.32,-s*.05);g.arc(s*.2,-s*.05,s*.12,0,6.3);
    g.moveTo(-s*.12,s*.5);g.lineTo(-s*.12,s*.36);g.moveTo(0,s*.5);g.lineTo(0,s*.36);g.moveTo(s*.12,s*.5);g.lineTo(s*.12,s*.36)}
  else if(k==="chip"){g.rect(-s*.35,-s*.35,s*.7,s*.7);g.rect(-s*.17,-s*.17,s*.34,s*.34);
    for(let i=-1;i<=1;i++){const p=i*s*.22;g.moveTo(p,-s*.35);g.lineTo(p,-s*.55);g.moveTo(p,s*.35);g.lineTo(p,s*.55);g.moveTo(-s*.35,p);g.lineTo(-s*.55,p);g.moveTo(s*.35,p);g.lineTo(s*.55,p)}}
  else if(k==="term"){g.rect(-s*.6,-s*.42,s*1.2,s*.84);g.moveTo(-s*.6,-s*.2);g.lineTo(s*.6,-s*.2);
    g.moveTo(-s*.4,0);g.lineTo(-s*.25,s*.12);g.lineTo(-s*.4,s*.24);g.moveTo(-s*.1,s*.26);g.lineTo(s*.15,s*.26)}
  else{g.rect(-s*.6,-s*.3,s*1.2,s*.6);g.moveTo(-s*.35,-s*.12);g.lineTo(-s*.35,s*.12);g.moveTo(-s*.47,0);g.lineTo(-s*.23,0);
    g.moveTo(s*.3,-s*.05);g.arc(s*.25,-s*.05,s*.05,0,6.3);g.moveTo(s*.45,s*.1);g.arc(s*.4,s*.1,s*.05,0,6.3)}
  g.stroke();
}
let lastT=0;
function frame(now){
  if(!RMo&&now-lastT<30){requestAnimationFrame(frame);return}lastT=now;
  const t=now/1000,dt=Math.min(.05,Math.max(0,t-T));T=t;
  sY+=(scrollY-sY)*.14;const vel=Math.abs(sY-pY);pY=sY;
  const prog=Math.min(1,Math.max(0,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));
  g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,w,h);g.globalAlpha=1;
  // drifting purple light, hue slides a little as you scroll
  const R=Math.max(LW,LH),hs=prog*35,k=LW/w;
  lg2.clearRect(0,0,LW,LH);
  BLOBS.forEach((b,i)=>{
    const x=LW*(b[1]+.16*Math.sin(t*b[3]+i*1.7)),y=LH*(b[2]+.14*Math.cos(t*b[4]+i*2.3))-sY*.03*k,r=b[5]*R;
    const gr=lg2.createRadialGradient(x,y,0,x,y,r),c="hsla("+((b[0]+hs)%360)+",90%,58%,";
    gr.addColorStop(0,c+b[6]+")");gr.addColorStop(1,c+"0)");
    lg2.fillStyle=gr;lg2.fillRect(0,0,LW,LH);
  });
  g.imageSmoothingEnabled=true;g.drawImage(lo,0,0,w,h);
  g.textAlign="center";g.textBaseline="middle";
  // code rain, falls faster while you scroll
  g.font="13px "+mono;g.fillStyle="#ebdcff";
  const boost=Math.min(vel/Math.max(dt,.001),1800)*.5;
  rain.forEach(c=>{
    c.y+=(c.v+boost)*dt;
    if(c.y-c.len*17>h){c.y=-rnd()*220;c.len=8+((rnd()*10)|0);c.v=40+rnd()*70}
    if(rnd()<.12)c.ch[(rnd()*18)|0]=pick(GL);
    for(let k=0;k<c.len;k++){const cy=c.y-k*17;if(cy<-20||cy>h+20)continue;
      g.globalAlpha=k?.13*(1-k/c.len):.30;g.fillText(c.ch[k],c.x,cy)}
  });
  // hacker symbols: each layer slides by at a different speed when you scroll
  const H=h+200;g.strokeStyle="#ebdcff";g.fillStyle="#ebdcff";
  items.forEach(it=>{
    const y=(((it.y-sY*it.d-t*8*it.d)%H)+H)%H-100,x=it.x+Math.sin(t*.3+it.ph)*12*it.d,s=12+34*it.d;
    g.save();g.translate(x,y);g.rotate(it.rot+Math.sin(t*.2+it.ph)*.06);g.globalAlpha=.07+.16*it.d;
    if(it.icon){g.lineWidth=1.3;icon(it.kind,s)}else{g.font=Math.round(8+13*it.d)+"px "+mono;g.fillText(it.word,0,0)}
    g.restore();
  });
  // brief glitch slices
  if(!RMo&&(t%7)<.22){g.fillStyle="#f0abfc";for(let i=0;i<3;i++){g.globalAlpha=.05;g.fillRect(((t*97+i*211)%w)-w*.2,(i*.31+((t*53)%1))%1*h,w*.5,4+i*5)}}
  g.globalAlpha=1;g.drawImage(vc,0,0,w,h);
  if(!RMo)requestAnimationFrame(frame);
}
const once=()=>{if(queued)return;queued=true;requestAnimationFrame(t=>{queued=false;frame(t)})};
addEventListener("resize",()=>{setup();if(RMo)once()});
if(RMo)addEventListener("scroll",()=>{sY=scrollY;once()},{passive:true});
setup();requestAnimationFrame(frame);
})();
