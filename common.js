/* Shared by index.html and tutorials.html */
const TITLE="Tyke’s Sources";
const $=id=>document.getElementById(id);
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;
const PAL=[275,295,255,315,235,330,265,285], TUT_H=300;
const LOGOS=[];
const hostOf=u=>{try{return new URL(u).hostname.replace(/^www\./,"")}catch(e){return u}};
const pretty=u=>{const p=hostOf(u).split(".");const w=p.length>1?p[p.length-2]:p[0];return w.charAt(0).toUpperCase()+w.slice(1)};
const slug=(s,i)=>"s-"+i+"-"+s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const YT=/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/;
const VID=/\.(mp4|webm|ogv|mov|m4v)(\?.*)?$/i;
/* file hosts that serve a video straight from an address without .mp4 on the end */
const HOSTVID=/^https?:\/\/(pixeldrain\.com\/api\/file\/)/i;
function logo3d(el,text,n,gap){
  el.setAttribute("aria-label",text);el.textContent="";
  const w=mk("span","l3");w.setAttribute("aria-hidden","true");
  for(let i=n;i>=0;i--){
    const l=mk("span","ly"+(i===n?" back":""),text);
    l.style.setProperty("--z",(-i*gap)+"px");
    l.style.setProperty("--c",i===0?"#fff":"hsl(275 40% "+Math.round(62-i*(40/n))+"%)");
    w.appendChild(l);
  }
  el.appendChild(w);
  const st={w,cx:0,cy:0,tx:0,ty:0};LOGOS.push(st);
  w.addEventListener("pointermove",e=>{const P=el.getBoundingClientRect();
    st.tx=(e.clientX-P.left-w.offsetLeft)/w.offsetWidth-.5;st.ty=(e.clientY-P.top-w.offsetTop)/w.offsetHeight-.5});
  w.addEventListener("pointerleave",()=>{st.tx=0;st.ty=0});
}
function mk(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}

function splitLine(line){
  let desc="";const tags=[];let star=false,forceVid=false;
  line=line.replace(/&&([\s\S]*?)(?:&&|$)/,(m,d)=>{desc=d.trim();return " "});
  /* tags: ^xbox ^pc  (or ^xbox,pc). Taken after the description so a ^ inside a description is left alone */
  line=line.replace(/(^|\s)\^(\S+)/g,(m,sp,t)=>{
    t.split(/[,^]/).map(x=>x.trim()).filter(Boolean).forEach(x=>{if(!tags.some(y=>y.toLowerCase()===x.toLowerCase()))tags.push(x)});
    return " "});
  /* $star (or $starred) at the end of a line marks a most-recommended link; searchable as "starred" */
  line=line.replace(/(^|\s)\$star(?:red)?(?=\s|$)/gi,()=>{star=true;return " "});
  /* $video marks a link as a video file when its address has no .mp4 etc. */
  line=line.replace(/(^|\s)\$video(?=\s|$)/gi,()=>{forceVid=true;return " "});
  const [u,...r]=line.split("|");
  return {url:u.trim(),title:r.join("|").trim(),desc,tags,star,forceVid};
}
function tilt(el){
  if(RM)return el;
  el.addEventListener("pointermove",e=>{
    const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    el.style.setProperty("--ry",((x-.5)*16)+"deg");el.style.setProperty("--rx",((.5-y)*16)+"deg");
    el.style.setProperty("--mx",(x*100)+"%");el.style.setProperty("--my",(y*100)+"%");
  });
  el.addEventListener("pointerleave",()=>{el.style.removeProperty("--ry");el.style.removeProperty("--rx")});
  return el;
}
/* known tags get a brand colour and icon; any other tag stays a plain purple bubble */
const KINDS={xbox:"xbox xbox360 xboxone xboxseries",playstation:"playstation ps ps1 ps2 ps3 ps4 ps5 psp psvita vita",nintendo:"nintendo switch wii wiiu 3ds ds gamecube n64",pc:"pc windows",vr:"vr quest oculus psvr",mobile:"mobile android ios iphone phone"},TAGKIND={};
for(const k in KINDS)KINDS[k].split(" ").forEach(t=>TAGKIND[t]=k);
function tagRow(tags,W){const r=mk("span","tags");
  tags.forEach(x=>{const k=TAGKIND[x.toLowerCase()],s=mk("span","tag"+(k?" k-"+k:""));
    if(k){const i=mk("span","ti i-"+k);i.setAttribute("aria-hidden","true");s.appendChild(i)}
    s.appendChild(put(mk("span"),x,W));r.appendChild(s)});
  return r}
function starEl(inline){
  const s=mk("span","star"+(inline?" inl":""));s.title="Most recommended";s.setAttribute("role","img");s.setAttribute("aria-label","Starred, most recommended");
  s.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9z"/></svg>';
  return s;
}
function tile(l,W,crumb,flat){
  const a=mk("a","tile"+(l.star?" starred":""));a.href=l.url;
  const title=l.title||pretty(l.url);
  const ico=mk("span","ico");const img=new Image();img.alt="";img.loading="lazy";img.referrerPolicy="no-referrer";
  img.src="https://icons.duckduckgo.com/ip3/"+hostOf(l.url)+".ico";
  img.onload=()=>ico.classList.add("fav");img.onerror=()=>{img.remove();ico.textContent=title.charAt(0).toUpperCase()};
  ico.appendChild(img);
  const t=mk("span","txt");t.append(put(mk("span","name"),title,W));if(l.desc){t.appendChild(put(mk("span","desc"),l.desc,W));a.dataset.tip=l.desc}t.appendChild(put(mk("span","host"),hostOf(l.url),W));if(l.tags&&l.tags.length)t.appendChild(tagRow(l.tags,W));if(crumb)t.appendChild(mk("span","crumb",crumb));
  a.append(ico,t);if(l.star)a.appendChild(starEl());return flat?a:tilt(a);
}
function video(l,W,crumb){
  if(!l.yt&&!l.file)return tile(l,W,crumb);
  const c=mk("figure","vid"),f=mk("div","frame");
  if(l.yt){
    const b=mk("button","play");b.type="button";b.setAttribute("aria-label","Play "+(l.title||"video"));
    b.style.backgroundImage="url(https://i.ytimg.com/vi/"+l.yt+"/hqdefault.jpg)";b.appendChild(mk("span"));
    b.onclick=()=>{const i=document.createElement("iframe");i.src="https://www.youtube-nocookie.com/embed/"+l.yt+"?autoplay=1&rel=0";
      i.allow="autoplay; encrypted-media; picture-in-picture; fullscreen";i.allowFullscreen=true;i.title=l.title||"Video";f.replaceChildren(i)};
    f.appendChild(b);
  }else{
    const v=document.createElement("video");v.controls=true;v.playsInline=true;v.preload="metadata";v.src=l.url+(l.url.includes("#")?"":"#t=0.1");
    v.onerror=()=>{const m=mk("div","vfail");m.append(mk("p",null,"This video could not load. It may be offline or the file host may be down."));const a=mk("a","btn s","Open the file");a.href=l.url;m.appendChild(a);f.replaceChildren(m)};
    f.appendChild(v);
  }
  const fc=mk("figcaption");fc.appendChild(put(mk("span"),l.title||"Tutorial video",W));if(l.star)fc.appendChild(starEl(true));if(l.desc)fc.appendChild(put(mk("span","vdesc"),l.desc,W));if(l.tags&&l.tags.length)fc.appendChild(tagRow(l.tags,W));if(crumb)fc.appendChild(mk("span","vcrumb",crumb));c.append(f,fc);return c;
}
function put(el,text,W){
  el.textContent="";
  if(!W||!W.length){el.textContent=text;return el}
  const re=new RegExp("("+W.map(w=>w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|")+")","gi");
  text.split(re).forEach((p,i)=>{if(!p)return;if(i%2)el.appendChild(mk("mark",null,p));else el.appendChild(document.createTextNode(p))});
  return el;
}

function stepLogos(){
  LOGOS.forEach(o=>{o.cx+=(o.tx-o.cx)*.1;o.cy+=(o.ty-o.cy)*.1;
    const v="rotateX("+(RM?14:(14-o.cy*10).toFixed(2))+"deg) rotateY("+(RM?0:(o.cx*16).toFixed(2))+"deg)";
    if(v!==o.v){o.v=v;o.w.style.transform=v}});
}

/* ---- tutorials: every group is its own page, reached from an icon button ---- */
const tutSlug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
function parseTut(text){
  const out=[],used={};let cur=null;
  const open=(name,kind)=>{let id=tutSlug(name)||"group";if(used[id])id+="-"+(++used[id]);else used[id]=1;
    cur={name,id,kind:kind&&TAGKIND[kind]||null,links:[]};out.push(cur)};
  for(const raw of text.split(/\r?\n/)){
    const line=raw.trim();
    if(!line||line.startsWith("//"))continue;
    if(line.startsWith("#")){
      let kind=null;const body=line.replace(/\s\^(\S+)\s*$/,(m,k)=>{kind=k.toLowerCase().split(/[,^]/).find(x=>TAGKIND[x])||k.toLowerCase();return ""});
      const m=body.match(/^#+\s*(.+?)[\s#]*$/);if(m)open(m[1],kind);continue}
    let {url,title,desc,tags,star,forceVid}=splitLine(line);
    if(!/^https?:\/\//i.test(url)&&!VID.test(url))continue;
    if(!cur)open("More",null);
    /* url | Title | Description  (the &&description&& form works too) */
    const bar=title.indexOf("|");if(bar>=0){if(!desc)desc=title.slice(bar+1).trim();title=title.slice(0,bar).trim()}
    const y=url.match(YT);
    cur.links.push({url,title,desc,tags,star,yt:y?y[1]:null,file:!y&&(forceVid||VID.test(url)||HOSTVID.test(url))});
  }
  return out.filter(g=>g.links.length);
}
/* icon for a group: the ^kind on its heading, else a kind tag on one of its videos, else a word in its name */
function tutKind(g){
  if(g.kind)return g.kind;
  for(const l of g.links)for(const t of (l.tags||[])){const k=TAGKIND[t.toLowerCase()];if(k)return k}
  for(const w of g.name.toLowerCase().split(/[^a-z0-9]+/)){if(TAGKIND[w])return TAGKIND[w]}
  return null;
}
function tutIcon(g){
  const big=mk("span","big");big.setAttribute("aria-hidden","true");
  const k=tutKind(g);big.appendChild(k?mk("span","ti i-"+k):mk("span","yt"));
  return big;
}
function tutBtn(g,i){
  const a=mk("a","tbtn");a.href="tutorials.html#"+g.id;a.style.setProperty("--h",PAL[i%PAL.length]);
  const n=g.links.length,info=mk("span","tinfo"),go=mk("span","go");go.setAttribute("aria-hidden","true");go.appendChild(mk("span","chev"));
  info.append(mk("span","tname",g.name),mk("span","tcount",n+(n===1?" video":" videos")));
  a.append(tutIcon(g),info,go);
  return tilt(a);
}
/* fade a block in when it scrolls into view */
function reveal(el){
  el.classList.add("grid");
  if(RM||!("IntersectionObserver" in window)){el.classList.add("in");return el}
  const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){el.classList.add("in");io.disconnect()}},{rootMargin:"0px 0px -8% 0px"});
  io.observe(el);return el;
}

const shellName=n=>n.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"dir";
/* top bar on the Tutorials and FAQ pages: logo left, the three page buttons dead centre, social buttons right */
const SOC_HTML='<a class="soc" href="https://discord.gg/JWGgkWvyWD" aria-label="Discord" title="Discord"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg></a><a class="soc" href="https://github.com/txkex" aria-label="GitHub" title="GitHub"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a>';
function pageNav(cur){
  const nav=$("nav");nav.replaceChildren();nav.className="pg";
  [["index.html","Home",285,""],["tutorials.html#","Tutorials",300,"tutorials"],["faq.html","FAQ",330,"faq"]].forEach(t=>{
    const a=mk("a","chip"+(cur===t[3]?" on":""),t[1]);a.href=t[0];a.style.setProperty("--h",t[2]);
    if(cur===t[3])a.setAttribute("aria-current","page");nav.appendChild(a);
  });
  const s=$("hsoc");if(s&&!s.firstChild)s.innerHTML=SOC_HTML;
}

const DISCORD_SVG='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>';

/* hover / focus popup that shows the full text of anything with data-tip (link bios) */
(()=>{let el,cur;
  const get=()=>el||(el=document.body.appendChild(Object.assign(document.createElement("div"),{className:"tip"})));
  const hide=()=>{if(el)el.classList.remove("on");cur=null};
  const show=t=>{const e=get();e.textContent=t.dataset.tip;e.classList.add("on");
    const r=t.getBoundingClientRect(),w=e.offsetWidth,h=e.offsetHeight;
    const x=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2));let y=r.top-h-8;if(y<8)y=r.bottom+8;
    e.style.transform="translate("+Math.round(x)+"px,"+Math.round(y)+"px)";cur=t};
  const find=n=>n&&n.closest?n.closest("[data-tip]"):null;
  document.addEventListener("pointerover",e=>{if(e.pointerType==="touch")return;const t=find(e.target);if(!t)hide();else if(t!==cur)show(t)});
  document.addEventListener("focusin",e=>{const t=find(e.target);if(t)show(t)});
  document.addEventListener("focusout",hide);
  document.addEventListener("scroll",hide,true);
  document.documentElement.addEventListener("mouseleave",hide);
})();
