/**
 * Service Worker: SOLO notificaciones push. No cachea nada (la app no es
 * offline). Su única función es recibir eventos `push` del navegador y mostrar
 * la notificación, más manejar el clic.
 *
 * Registrado desde el cliente (ver components/pwa/PushNotifications.tsx). En iOS
 * las push solo funcionan con la PWA instalada en pantalla de inicio (iOS 16.4+).
 */

// Toma el control sin esperar a que se cierren las pestañas viejas: así una
// nueva versión del SW empieza a mostrar notificaciones de inmediato.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/**
 * Llega un push del backend (vía web-push). El payload es JSON:
 *   { title, body, icon?, badge?, url?, tag? }
 */
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "VALUE", body: event.data.text() };
  }

  const title = data.title || "VALUE";
  const options = {
    body: data.body || "",
    icon: data.icon || "/android-chrome-192x192.png",
    badge: data.badge || "/favicon-32x32.png",
    // Vibración en Android; iOS la ignora sin romper nada.
    vibrate: [100, 50, 100],
    // `tag` colapsa notificaciones del mismo tema en una sola.
    tag: data.tag,
    // Ruta a abrir al hacer clic; el handler de abajo la usa.
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

/**
 * Clic en la notificación: enfoca una pestaña ya abierta de la app si existe,
 * si no abre una nueva en la ruta indicada.
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          // Misma app ya abierta: la enfoca y navega en vez de abrir otra.
          if ("focus" in client) {
            client.focus();
            if ("navigate" in client) client.navigate(target);
            return;
          }
        }
        return self.clients.openWindow(target);
      })
  );
});
