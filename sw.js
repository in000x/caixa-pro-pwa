const VERSION='v2';
const CACHE='caixapro-pwa-'+VERSION;
const PRECACHE=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);await Promise.all(PRECACHE.map(async u=>{const r=await fetch(new Request(u,{cache:'reload'}));if(!r.ok)throw new Error(u);await c.put(u,r);}));await self.skipWaiting();})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})()));
self.addEventListener('message',e=>{if(e.data==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.origin!==location.origin)return;e.respondWith((async()=>{const c=await caches.open(CACHE);try{const fresh=await fetch(req);if(fresh.ok)c.put(req,fresh.clone());return fresh;}catch{return (await c.match(req))||(await c.match('./index.html'))||new Response('Offline',{status:503});}})());});
