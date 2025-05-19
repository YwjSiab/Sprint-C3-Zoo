const CACHE_NAME = "ntc-zoo-cache-v1";
const FILES_TO_CACHE = [
  "/Sprint-C3-Zoo/",
  "/Sprint-C3-Zoo/index.html",
  "/Sprint-C3-Zoo/styles.css",
  "/Sprint-C3-Zoo/zoo.js",
  "/Sprint-C3-Zoo/manifest.json",
  "/Sprint-C3-Zoo/icon-192.png",
  "/Sprint-C3-Zoo/icon-512.png"
];

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((cachedRes) => {
      if (cachedRes) return cachedRes;
      return fetch(evt.request).then((networkRes) => {
        if (evt.request.destination === "image") {
          caches.open("image-cache").then((cache) => {
            cache.put(evt.request, networkRes.clone());
          });
        }
        return networkRes;
      });
    })
  );
});
