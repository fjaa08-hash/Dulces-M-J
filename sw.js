const V='dulcesmj-v2';
const SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url), own=u.origin===location.origin;
  const lib=/fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com|www\.gstatic\.com\/firebasejs/.test(u.href);
  if(!own&&!lib) return;
  if(own&&r.mode==='navigate'){
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put('index.html',c));return res;}).catch(()=>caches.match('index.html')));
    return;
  }
  e.respondWith(caches.open(V).then(c=>c.match(r).then(hit=>{
    const net=fetch(r).then(res=>{ if(res&&(res.ok||res.type==='opaque')) c.put(r,res.clone()); return res; }).catch(()=>hit);
    return hit||net;
  })));
});
