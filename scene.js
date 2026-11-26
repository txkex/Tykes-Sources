/* Hero scene for the Tutorials and FAQ pages: a shape drawn on a canvas becomes a rotating 3D point cloud (same look as the controller on the main page) */
const SHAPES={
  play(o,S){ /* a monitor with a play button */
    o.lineWidth=9;o.lineJoin="round";
    o.beginPath();o.roundRect(12,26,136,92,14);o.stroke();
    o.beginPath();o.moveTo(68,50);o.lineTo(68,94);o.lineTo(106,72);o.closePath();o.fill();
    o.fillRect(72,120,16,14);o.fillRect(48,134,64,8);
  },
  question(o,S){ /* a question mark */
    o.lineWidth=19;o.lineCap="round";o.lineJoin="round";
    o.beginPath();o.arc(80,58,33,Math.PI*1.02,Math.PI*2.42);o.quadraticCurveTo(82,96,80,106);o.stroke();
    o.beginPath();o.arc(80,138,10.5,0,Math.PI*2);o.fill();
  }
};
function initScene(name){
  const cv=$("pad");if(!cv)return;
  const S=160,off=document.createElement("canvas");off.width=off.height=S;
  const o=off.getContext("2d",{willReadFrequently:true});o.fillStyle=o.strokeStyle="#fff";SHAPES[name](o,S);
  const d=o.getImageData(0,0,S,S).data,on=(x,y)=>x>=0&&y>=0&&x<S&&y<S&&d[(y*S+x)*4+3]>128;
  const K=1.05,D=9,pts=[],R=Math.random;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){
    if(!on(x,y))continue;
    const edge=!on(x-1,y)||!on(x+1,y)||!on(x,y-1)||!on(x,y+1),X=(x+R()-.5-S/2)*K,Y=-(y+R()-.5-S/2)*K;
    if(edge){for(let k=0;k<4;k++)pts.push(X,Y,(R()*2-1)*D,.65+.35*R(),1)}
    else if(R()<.42){pts.push(X,Y,D,.3+.4*R(),0);pts.push(X,Y,-D,.18+.25*R(),0)}
  }
  const P=new Float32Array(pts),N=P.length/5,PX=new Float32Array(N),PY=new Float32Array(N),PA=new Float32Array(N),PS=new Float32Array(N);
  const RIM=[];for(let i=0;i<N;i++)if(P[i*5+4])RIM.push(i);
  const g=cv.getContext("2d"),AB=6,T0=performance.now()/1000;
  let pw=0,ph=0,dpr=1,mx=0,my=0,vis=true,fr=0;
  const size=()=>{dpr=Math.min(devicePixelRatio||1,1.5);pw=cv.width=Math.round(cv.clientWidth*dpr);ph=cv.height=Math.round(cv.clientHeight*dpr)};
  function draw(t){
    if(!pw)return;g.globalCompositeOperation="source-over";g.clearRect(0,0,pw,ph);g.globalCompositeOperation="lighter";
    const e=RM?0:Math.exp(-(t-T0)*1.1),ay=RM?-.25:-.25+Math.sin(t*.55)*.55+mx*.5+3*e,ax=.12+(RM?0:Math.sin(t*.4)*.07+my*.15+.8*e);
    const cy=Math.cos(ay),sy=Math.sin(ay),cx=Math.cos(ax),sx=Math.sin(ax),sc=pw/200,ox=pw/2,oy=ph/2+(RM?0:Math.sin(t*.9)*4*dpr),sw=RM?1e9:((t*.45)%1)*190-95;
    for(let i=0;i<N;i++){const o=i*5,x=P[o],y=P[o+1],z=P[o+2];
      const x1=x*cy+z*sy,z1=-x*sy+z*cy,y1=y*cx-z1*sx,z2=y*sx+z1*cx,f=520/(520-z2);
      PX[i]=ox+x1*f*sc;PY[i]=oy-y1*f*sc;
      PA[i]=P[o+3]*(.35+.65*Math.min(1,Math.max(0,(z2+30)/60)))*(RM?1:.82+.18*Math.random())*(1+.5*Math.exp(-((y1-sw)*(y1-sw))/70));
      PS[i]=f*dpr*(P[o+4]?1.7:1.3)}
    const PB=Array.from({length:AB},()=>new Path2D());
    for(let i=0;i<N;i++){const a=PA[i];if(a<.04)continue;PB[Math.min(AB-1,(a*AB)|0)].rect(PX[i],PY[i],PS[i],PS[i])}
    g.fillStyle="#f0e6ff";for(let k=0;k<AB;k++){g.globalAlpha=Math.min(1,(k+.5)/AB);g.fill(PB[k])}
    const k=.9*dpr,pr=new Path2D(),pc=new Path2D();
    for(let j=0;j<RIM.length;j++){const i=RIM[j];pr.rect(PX[i]+k,PY[i],PS[i],PS[i]);pc.rect(PX[i]-k,PY[i],PS[i],PS[i])}
    g.globalAlpha=.16;g.fillStyle="#ff5a6e";g.fill(pr);g.fillStyle="#5affea";g.fill(pc);g.globalAlpha=1;
  }
  size();
  if("IntersectionObserver" in window)new IntersectionObserver(es=>{vis=es[0].isIntersecting}).observe($("top"));
  document.addEventListener("pointermove",e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
  addEventListener("resize",()=>{size();if(RM)draw(0)});
  (function loop(){const t=performance.now()/1000;if(RM||(vis&&(fr++&1)===0))draw(t);stepLogos();if(!RM)requestAnimationFrame(loop)})();
}
