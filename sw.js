var V = 'dsh-en-v1';
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){ return k !== V; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(function(r){
      var copy = r.clone();
      caches.open(V).then(function(c){ c.put(req, copy).catch(function(){}); });
      return r;
    }).catch(function(){
      return caches.match(req).then(function(m){
        return m || caches.match('./index.html') || caches.match('./daily.html');
      });
    })
  );
});
