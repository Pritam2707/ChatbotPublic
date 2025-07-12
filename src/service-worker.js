/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim();

// Precache all assets and use them for routing.
precacheAndRoute(self.__WB_MANIFEST);

// Route for handling navigation requests.
registerRoute(
  ({ request }) => request.mode === 'navigate',
  async () => {
    const defaultRoute = await caches.match('/index.html');
    return defaultRoute || fetch('/index.html');
  }
);

// Route for caching images (PNG, JPEG, JPG) with Stale-While-Revalidate strategy.
registerRoute(
  ({ url }) => url.origin === self.location.origin && (url.pathname.endsWith('.png') || url.pathname.endsWith('.jpeg') || url.pathname.endsWith('.jpg')),
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// Handle 'SKIP_WAITING' message to trigger skipWaiting().
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
