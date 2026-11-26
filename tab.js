/* Browser-tab title effect: the page title is typed out, held, deleted back to its
   first letter, then typed again. Add <script src="tab.js"></script> before </body>.
   Turn it off by removing that line. Skipped for people who prefer reduced motion. */
(()=>{
  const full=document.title;
  if(!full||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const TYPE=110,DELETE=65,HOLD=2400,LOW=700;   /* milliseconds */
  let i=full.length,phase="del";
  const set=()=>{document.title=full.slice(0,i)};
  function tick(){
    if(phase==="del"){
      i--;set();
      if(i<=1){phase="type";setTimeout(tick,LOW);return}
      setTimeout(tick,DELETE);return;
    }
    i++;set();
    if(i>=full.length){phase="del";setTimeout(tick,HOLD);return}
    setTimeout(tick,TYPE);
  }
  setTimeout(tick,HOLD);
})();
