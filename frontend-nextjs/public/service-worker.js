self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SEND_NOTIFICATIONS") {
    const notifications = event.data.notifications;
    notifications.forEach((notification) => {
      // Thực hiện gửi thông báo qua socket
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: "SEND_NOTIFICATION",
            notification: notification,
          });
        });
      });
    });
  }
});
