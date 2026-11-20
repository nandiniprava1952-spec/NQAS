/* Quality Assessment Toolkit – service worker. Bump VERSION whenever you replace index.html or any file below. */
const VERSION='v47';const CACHE='qat-'+VERSION;
const CORE=['./','index.html','i18n.js','dashboard.js','data/or-checklist.json','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/apple-touch-icon.png','icons/favicon-32.png','images/cover-1.jpg','images/cover-2.jpg','images/cover-3.jpg','vendor/xlsx.full.min.js','vendor/exceljs.min.js','vendor/jszip.min.js','vendor/jspdf.umd.min.js','vendor/jspdf.plugin.autotable.min.js','data/AAM-SHC-TYPE-B.xlsx','data/AAM-SHC.xlsx','data/AAMSHC-VIRTUAL.xlsx','data/AAMSHC-VIRTUAL12-B.xlsx','data/AAMSHC-VIRTUAL12.xlsx','data/CHC-FRU.xlsx','data/CHC-NONFRU.xlsx','data/DH.xlsx','data/PHC.xlsx','data/PHC4.xlsx','data/SDH-DH-STYLE.xlsx','data/UPHC.xlsx'];
/* Download every core file ourselves so the page can show a real progress percentage. */
async function notify(m){const cl=await self.clients.matchAll({type:'window',includeUncontrolled:true});cl.forEach(c=>c.postMessage(m))}
async function precache(){
 const cache=await caches.open(CACHE);
 const sizes=await Promise.all(CORE.map(u=>fetch(u,{method:'HEAD',cache:'no-store'}).then(r=>r.ok?(+r.headers.get('content-length')||0):0).catch(()=>0)));
 const known=sizes.filter(Boolean),avg=known.length?known.reduce((a,b)=>a+b,0)/known.length:1;
 const w=sizes.map(x=>x||avg),total=w.reduce((a,b)=>a+b,0),got=w.map(()=>0);let last=-1,lastT=0;
 const post=f=>{const p=Math.min(99,Math.floor(got.reduce((a,b)=>a+b,0)/total*100)),t=Date.now();if(f||(p!==last&&t-lastT>80)){last=p;lastT=t;notify({type:'qat-progress',pct:p,version:VERSION})}};
 post(true);
 async function one(k){const res=await fetch(CORE[k],{cache:'reload'});if(!res.ok||!res.body)throw new Error(res.status+' '+CORE[k]);
  const rd=res.body.getReader(),chunks=[];let n=0;
  for(;;){const r=await rd.read();if(r.done)break;chunks.push(r.value);n+=r.value.length;got[k]=Math.min(n,w[k]);post()}
  got[k]=w[k];
  await cache.put(CORE[k],new Response(new Blob(chunks),{status:200,headers:{'content-type':res.headers.get('content-type')||'application/octet-stream'}}));post()}
 let i=0;const lane=async()=>{while(i<CORE.length)await one(i++)};
 await Promise.all([lane(),lane(),lane(),lane()]);
 notify({type:'qat-progress',pct:100,version:VERSION})}
self.addEventListener('install',e=>{e.waitUntil(precache().catch(err=>caches.delete(CACHE).then(()=>{throw err})))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('qat-')&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin)return; /* cloud sync (script.google.com) always goes to the network */
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res}).catch(()=>r.mode==='navigate'?caches.match('index.html'):Response.error())))});
