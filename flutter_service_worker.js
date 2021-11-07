'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "8edd82e3a5d4273407374f8fcfc02303",
"assets/assets/19362653.png": "85f710ed277dda139171a4882c3967bf",
"assets/assets/adobe-xd.png": "e1481938226814f38846872addad6c07",
"assets/assets/api.png": "3b952709d706e8799cba473831560169",
"assets/assets/back.png": "14100f76a5e4968429bbfc154468552d",
"assets/assets/css3.png": "dd63c22d4082acf71b4cfc2324ec1961",
"assets/assets/dart.png": "7a0cddaf66ee751a2b6e3fac9357020b",
"assets/assets/dash.png": "e71c237537197e35d91a979803735123",
"assets/assets/firebase.png": "cb39a483073142b88fa92f7539df8bed",
"assets/assets/flutter.png": "e95ed7dd9c2c4dda38e075564ec309e3",
"assets/assets/fonts/bauhaus/Bauhaus-Regular.ttf": "3066b11123e63381b8e2aa554b18bf32",
"assets/assets/fonts/poppins/Poppins-Regular.ttf": "8b6af8e5e8324edfd77af8b3b35d7f9c",
"assets/assets/github.png": "7638cf64b649ae24023e89acfadd3365",
"assets/assets/home.json": "f82c99f7c949346e8652a723df7d94e5",
"assets/assets/html5.png": "3768ce284d6bfa71a327027da8095365",
"assets/assets/javascript.png": "51ccf23737c36fe563a7c90cb8c3b2e0",
"assets/assets/linkedin-logo.png": "b6910bfaf1e9c017536402f0acd01c3e",
"assets/assets/loading.json": "902676e1680d5dace4b1ebfc3e910a67",
"assets/assets/lottie.zip": "eaaa91db69d56aa96027e980ee537958",
"assets/assets/male.json": "821a585f696b8e48d1544721b7b8902e",
"assets/assets/placeholder.png": "8e6aa1a74759fcb80402d9858e845fb8",
"assets/assets/postman.png": "96211e594c46e1ca71795dbdd1851cf5",
"assets/assets/programming-code-signs.png": "e5ab42205e981061051c4576400ef8de",
"assets/assets/react.png": "7b589ae0e4f42057e131ce1a3d5cb9e8",
"assets/assets/result.svg": "ec404a8dde534b461498f43e29d7b1d2",
"assets/assets/sass.png": "c2399ab7175a5bcd82f08e3d8180c14d",
"assets/assets/sqlite.png": "64c70858fc1f4b91e1b78e3b985fc262",
"assets/assets/svgg.png": "3325801d39e3818bef359b26363815f4",
"assets/assets/vector.png": "fd24b5956c29480268efbff90d1c4e4b",
"assets/assets/web-development.png": "6bcdd15bb46a0339d72a544b983cf5aa",
"assets/assets/whatsapp.png": "43ce2ebe73a5308ce345ce1de2695aef",
"assets/FontManifest.json": "4747bfda9466c830a363712e954ef12e",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "6b8d493e06bc66a1efba93eaa2e6e079",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/material_design_icons_flutter/lib/fonts/materialdesignicons-webfont.ttf": "174c02fc4609e8fc4389f5d21f16a296",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "d20a0ca719bb89b1fa885b39ac979c37",
"/": "d20a0ca719bb89b1fa885b39ac979c37",
"main.dart.js": "5fe28efbda07aeb053a8d82db5f6e6fc",
"manifest.json": "e74af8957b5899dc6da961caee768ec9",
"version.json": "426313f2f3133c2f20415344c4a22df3"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
