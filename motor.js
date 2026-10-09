/* Mensaje Urgente — motor de chat compartido por todas las historias.
   Cada historia solo define colores (variables CSS) y su guion con Motor({...}). */
(function(){
const CSS=`
*{box-sizing:border-box}
html,body{height:100%;margin:0}
[hidden]{display:none!important}
body{background:var(--bg);color:var(--fg);font-family:var(--f-body);font-size:16px;overflow:hidden}
.app{position:relative;z-index:1;height:100%;display:flex;flex-direction:column;max-width:560px;margin:0 auto;background:var(--appbg,var(--bg));border-inline:1px solid var(--line)}
.hdr{display:flex;align-items:center;gap:10px;padding:calc(10px + env(safe-area-inset-top,0px)) 12px 10px;background:var(--panel);border-bottom:1px solid var(--line)}
.back{color:var(--muted);text-decoration:none;font-size:26px;line-height:1;padding:4px 6px}
.av{width:40px;height:40px;border-radius:50%;background:var(--in);display:grid;place-items:center;font-family:var(--f-mono);color:var(--accent);flex:none;border:1px solid var(--line)}
.who{flex:1;min-width:0}
.who b{display:block;font-size:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.who span{font-size:13px;color:var(--muted);font-family:var(--f-mono)}
.who span.live{color:var(--accent)}
.icon-btn{background:none;border:1px solid var(--line);color:var(--muted);border-radius:8px;padding:6px 10px;font:inherit;font-size:13px;cursor:pointer}
button:focus-visible,input:focus-visible,a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
#thread{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:6px;scroll-behavior:smooth}
.day{align-self:center;font-family:var(--f-mono);font-size:12px;color:var(--muted);background:var(--panel);padding:4px 10px;border-radius:6px;margin-bottom:8px}
.sys{align-self:center;font-size:13px;color:var(--muted);text-align:center;max-width:85%;margin:6px 0;font-family:var(--f-mono)}
.msg{max-width:82%;padding:8px 12px 6px;border-radius:var(--radius,14px);line-height:1.4;animation:pop .18s ease-out;overflow-wrap:anywhere}
.msg .t{display:block;text-align:right;font-family:var(--f-mono);font-size:11px;opacity:.6;margin-top:2px}
.in{align-self:flex-start;background:var(--in);color:var(--infg,var(--fg));border-bottom-left-radius:4px}
.out{align-self:flex-end;background:var(--out);color:var(--outfg);border-bottom-right-radius:4px}
.alt{background:var(--alt);color:var(--altfg)}
.alt .from{display:block;font-size:12px;font-weight:700;letter-spacing:.04em;margin-bottom:2px}
.deleted{font-style:italic;color:var(--muted)}
.typing{align-self:flex-start;background:var(--in);border-radius:14px;padding:12px 14px;display:flex;gap:4px}
.typing i{width:6px;height:6px;border-radius:50%;background:var(--muted);animation:blink 1s infinite}
.typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.3s}
.endcard{align-self:stretch;margin-top:16px;border:1px dashed var(--accent);border-radius:12px;padding:16px;text-align:center;display:flex;flex-direction:column;gap:10px}
.endcard h2{font-family:var(--f-display);font-weight:400;color:var(--accent);margin:0;font-size:24px}
.endcard p{margin:0;color:var(--muted);font-size:14px}
.endcard .finales{font-family:var(--f-mono);font-size:12px;color:var(--fg);line-height:1.7}
.endcard .row{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
#chips{display:flex;gap:8px;flex-wrap:wrap;padding:0 16px 8px}
#chips button{background:var(--appbg,var(--bg));border:1px solid var(--accent);color:var(--accent);border-radius:999px;padding:6px 12px;font:inherit;font-size:14px;cursor:pointer}
.ftr{position:relative;display:flex;gap:8px;padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:var(--panel);border-top:1px solid var(--line);align-items:center}
#txt{flex:1;min-width:0;background:var(--bg);border:1px solid var(--line);color:var(--fg);border-radius:999px;padding:11px 16px;font:inherit}
.round{width:46px;height:46px;border-radius:50%;border:none;display:grid;place-items:center;cursor:pointer;flex:none}
#mic{background:var(--in);color:var(--fg);border:1px solid var(--line)}
#mic.rec{background:var(--alt);color:var(--altfg);animation:pulse 1.2s infinite}
#send{background:var(--accent);color:var(--onaccent)}
#send:disabled{opacity:.4;cursor:default}
#note{position:absolute;left:12px;right:12px;bottom:calc(100% + 8px);background:var(--panel);border:1px solid var(--accent);border-radius:10px;padding:10px 12px;font-size:14px;line-height:1.4}
#start{position:fixed;inset:0;z-index:5;background:var(--startbg,var(--bg));display:grid;place-items:center;padding:24px 16px}
#start .box{max-width:400px;width:100%;display:flex;flex-direction:column;gap:16px}
#start h1{font-family:var(--f-display);font-weight:400;font-size:clamp(34px,10vw,50px);line-height:1;margin:0;color:var(--accent);text-wrap:balance}
#start p{margin:0;color:var(--muted);line-height:1.5}
#start .kicker{font-family:var(--f-mono);color:var(--fg);font-size:13px;letter-spacing:.1em;text-transform:uppercase}
#start .menu-link{color:var(--muted);font-size:14px;text-align:center}
.big{background:var(--accent);color:var(--onaccent);border:none;border-radius:10px;padding:14px 18px;font:inherit;font-weight:700;font-size:17px;cursor:pointer;text-decoration:none;text-align:center}
.ghost{background:none;color:var(--accent);border:1px solid var(--accent)}
@keyframes pop{from{transform:translateY(4px);opacity:.3}to{transform:none;opacity:1}}
@keyframes blink{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 var(--accent)}50%{box-shadow:0 0 0 8px transparent}}
@keyframes glitch{0%{transform:translate(0);filter:none}20%{transform:translate(-4px,2px);filter:hue-rotate(90deg) contrast(1.6)}40%{transform:translate(3px,-2px)}60%{transform:translate(-2px,0);filter:invert(1)}80%{transform:translate(2px,1px)}100%{transform:none;filter:none}}
.fx-glitch .app{animation:glitch .35s steps(3) 3}
@media (prefers-reduced-motion:reduce){*{animation:none!important;scroll-behavior:auto!important}}
`;
const MIC='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3" fill="none"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3" fill="none"/></svg>';
const SEND='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M3 20l18-8L3 4v6l12 2-12 2z" fill="currentColor"/></svg>';

window.Motor=function(C){
  const menu=C.menu||'../index.html';
  const st=document.createElement('style');st.textContent=CSS;document.head.prepend(st);
  document.body.insertAdjacentHTML('beforeend',`
  <div id="start"><div class="box">
    <span class="kicker" id="kicker"></span><h1 id="ttl"></h1><p id="intro"></p>
    <button class="big" id="go">Empezar</button>
    <a class="menu-link" href="${menu}">Volver al menú</a>
  </div></div>
  <div class="app">
    <div class="hdr">
      <a class="back" href="${menu}" aria-label="Volver al menú">‹</a>
      <div class="av" aria-hidden="true" id="av"></div>
      <div class="who"><b id="name"></b><span id="status" class="live">en línea</span></div>
      <button class="icon-btn" id="reset">Reiniciar</button>
    </div>
    <div id="thread" aria-live="polite"></div>
    <div id="chips"></div>
    <div class="ftr">
      <div id="note" hidden></div>
      <button class="round" id="mic" aria-label="Hablar">${MIC}</button>
      <input id="txt" placeholder="${C.placeholder||'Escribí o hablá…'}" autocomplete="off">
      <button class="round" id="send" aria-label="Enviar">${SEND}</button>
    </div>
  </div>`);
  const $=id=>document.getElementById(id);
  const thread=$('thread'),txt=$('txt'),sendBtn=$('send'),chipsEl=$('chips'),statusEl=$('status'),note=$('note');
  $('kicker').textContent=C.intro.kicker;$('ttl').textContent=C.title;$('intro').textContent=C.intro.text;
  $('go').textContent=C.intro.button||'Empezar';$('name').textContent=C.contact;$('av').textContent=C.avatar||'?';

  const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  const has=(t,w)=>w.some(x=>t.includes(x));
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const KEY='ld-finales-'+C.id;
  let S,busy=false,clockMin=0,runId=0;

  function clock(){clockMin=(clockMin+(Math.random()<.5?1:0))%1440;return String(Math.floor(clockMin/60)).padStart(2,'0')+':'+String(clockMin%60).padStart(2,'0')}
  function scroll(){thread.scrollTop=thread.scrollHeight}
  function bubble(text,cls,from){const d=document.createElement('div');d.className='msg '+cls;
    if(from){const f=document.createElement('span');f.className='from';f.textContent=from;d.appendChild(f)}
    const p=document.createElement('span');p.textContent=text;d.appendChild(p);
    const t=document.createElement('span');t.className='t';t.textContent=clock()+(cls.includes('out')?' ✓✓':'');d.appendChild(t);
    thread.appendChild(d);scroll();return p}
  function sys(text){const d=document.createElement('div');d.className='sys';d.textContent=text;thread.appendChild(d);scroll()}
  function setStatus(s,live){statusEl.textContent=s;statusEl.className=live?'live':''}
  async function typing(l){setStatus(C.typingText||'escribiendo…',true);
    const d=document.createElement('div');d.className='typing';d.innerHTML='<i></i><i></i><i></i>';thread.appendChild(d);scroll();
    await sleep(Math.min(2600,650+l.length*30));d.remove()}

  async function say(lines){
    busy=true;sendBtn.disabled=true;const my=runId;
    for(const l of lines){
      if(my!==runId)return;
      if(typeof l==='string'){await typing(l);if(my!==runId)return;bubble(l,'in');continue}
      if(l.pause){setStatus(C.onlineText||'en línea',true);await sleep(l.pause);continue}
      if(l.sys){sys(l.sys);await sleep(900);continue}
      if(l.status){setStatus(l.status,true);await sleep(l.ms||900);continue}
      if(l.fx){document.body.classList.add('fx-'+l.fx);await sleep(l.ms||1100);document.body.classList.remove('fx-'+l.fx);continue}
      if(l.deleted){bubble('Este mensaje fue eliminado','in').className='deleted';await sleep(900);continue}
      if(l.alt){await typing(l.alt);if(my!==runId)return;bubble(l.alt,'in alt',l.from||C.altName);continue}
    }
    setStatus(C.onlineText||'en línea',true);
    busy=false;sendBtn.disabled=false;renderChips();
  }
  function renderChips(){chipsEl.innerHTML='';if(busy||!S||S.stage==='fin')return;
    for(const c of (C.chips(S)||[])){const b=document.createElement('button');b.textContent=c;b.onclick=()=>handle(c);chipsEl.appendChild(b)}}

  async function handle(raw){
    const text=raw.trim();if(!text||busy||!S||S.stage==='fin')return;
    txt.value='';hideNote();bubble(text,'out');chipsEl.innerHTML='';
    const res=C.stages[S.stage](norm(text),S,has);
    if(!res){S.misses++;await say(C.miss[S.stage]||['¿Qué?']);return}
    S.misses=0;if(res.next)S.stage=res.next;if(res.end)S.stage='fin';
    const my=runId;
    await say(res.end?C.endings[res.end].lines:res.lines);
    if(res.end&&my===runId)end(res.end);
  }
  function loadFound(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return []}}
  function end(key){setStatus(C.lastSeen||'desconectado',false);
    const found=loadFound();if(!found.includes(key))found.push(key);
    try{localStorage.setItem(KEY,JSON.stringify(found))}catch(e){}
    const keys=Object.keys(C.endings);
    const c=document.createElement('div');c.className='endcard';
    const h=document.createElement('h2');h.textContent='Final: '+C.endings[key].title;
    const p=document.createElement('p');p.textContent='Descubriste '+found.length+' de '+keys.length+' finales';
    const ul=document.createElement('p');ul.className='finales';
    ul.textContent=keys.map(k=>found.includes(k)?C.endings[k].title:'???').join(' · ');
    const row=document.createElement('div');row.className='row';
    const b=document.createElement('button');b.className='big';b.textContent='Jugar de nuevo';b.onclick=start;
    const m=document.createElement('a');m.className='big ghost';m.href=menu;m.textContent='Menú';
    row.append(b,m);c.append(h,p,ul,row);thread.appendChild(c);scroll()}

  function start(){
    runId++;busy=false;S=Object.assign({stage:C.firstStage,misses:0},JSON.parse(JSON.stringify(C.state||{})));
    clockMin=C.clock[0]*60+C.clock[1];
    thread.innerHTML='';const d=document.createElement('div');d.className='day';d.textContent=C.dayLabel||'HOY';thread.appendChild(d);
    chipsEl.innerHTML='';hideNote();say(C.opening);
  }

  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;let rec=null;
  function showNote(m){note.textContent=m;note.hidden=false;clearTimeout(showNote.t);showNote.t=setTimeout(hideNote,7000)}
  function hideNote(){note.hidden=true}
  const BLOCKED='El micrófono no está disponible aquí. Tocá el cuadro de texto y usá el micrófono de tu teclado para dictar.';
  $('mic').onclick=()=>{
    if(rec){rec.stop();return}
    if(!SR){showNote(BLOCKED);txt.focus();return}
    try{
      rec=new SR();rec.lang=C.lang||'es-CR';rec.interimResults=true;rec.continuous=false;
      let finalText='';
      rec.onresult=e=>{let s='';for(const r of e.results){s+=r[0].transcript;if(r.isFinal)finalText=s}txt.value=s};
      rec.onerror=e=>{showNote(e.error==='no-speech'?'No te escuché. Probá de nuevo.':BLOCKED)};
      rec.onend=()=>{$('mic').classList.remove('rec');rec=null;if(finalText)handle(finalText)};
      rec.start();$('mic').classList.add('rec');showNote('Escuchando… hablá ahora.');
    }catch(err){rec=null;showNote(BLOCKED)}
  };
  sendBtn.onclick=()=>handle(txt.value);
  txt.addEventListener('keydown',e=>{if(e.key==='Enter')handle(txt.value)});
  $('reset').onclick=start;
  $('go').onclick=()=>{$('start').hidden=true;start();txt.focus({preventScroll:true})};
};
})();
