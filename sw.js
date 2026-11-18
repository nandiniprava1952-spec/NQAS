/* Quality Assessment Toolkit – service worker. Bump VERSION whenever you replace index.html or any file below. */
const VERSION='v8';const CACHE='qat-'+VERSION;
const CORE=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/apple-touch-icon.png','icons/favicon-32.png','images/cover-1.jpg','images/cover-2.jpg','images/cover-3.jpg','vendor/xlsx.full.min.js','vendor/exceljs.min.js','vendor/jszip.min.js','vendor/jspdf.umd.min.js','vendor/jspdf.plugin.autotable.min.js','data/AAM-SHC-TYPE-B.xlsx','data/AAM-SHC.xlsx','data/AAMSHC-VIRTUAL.xlsx','data/AAMSHC-VIRTUAL12-B.xlsx','data/AAMSHC-VIRTUAL12.xlsx','data/CHC-FRU.xlsx','data/CHC-NONFRU.xlsx','data/DH.xlsx','data/PHC.xlsx','data/PHC4.xlsx','data/SDH-DH-STYLE.xlsx','data/UPHC.xlsx'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('qat-')&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin)return; /* cloud sync (script.google.com) always goes to the network */
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res}).catch(()=>r.mode==='navigate'?caches.match('index.html'):Response.error())))});
