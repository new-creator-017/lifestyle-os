// public/sw.js
self.addEventListener("push", (event) => {
  const data = event.data
    ? event.data.json()
    : { title: "Alert", body: "Bedtime!" };

  const options = {
    body: data.body,
    icon: "/logo192.png",
    badge: "/logo192.png",
    vibrate: [200, 100, 200],
    tag: "bedtime-alert", // Prevents duplicate notifications
    renewed: true,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Logic to handle clicking the notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
