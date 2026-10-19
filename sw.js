const CACHE='pole-studio-shared-v4';
const FILES=['./','./index.html','./allievi.html','./style.css','./allievi.css','./app.js','./allievi.js','./catalogo.json','./manifest.webmanifest','./allievi.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('pole-studio-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const req=e.request,url=new URL(req.url);if(req.method!=='GET'||url.origin!==self.location.origin)return;
 if(url.pathname.endsWith('/catalogo.json')){
   const canonical=new URL('./catalogo.json',self.registration.scope).href;
   e.respondWith(fetch(req).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(canonical,copy)).catch(()=>{})}return r}).catch(()=>caches.match(canonical).then(x=>x||Response.error())));
   return;
 }
 e.respondWith(fetch(req).then(r=>{if(r.ok&&url.search===''){const c=r.clone();caches.open(CACHE).then(cache=>cache.put(req,c)).catch(()=>{})}return r}).catch(()=>caches.match(req).then(x=>x||caches.match('./index.html'))));
});
