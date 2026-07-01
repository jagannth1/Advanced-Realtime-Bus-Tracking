// sw.js - Service Worker

self.addEventListener('message', event => {
    const { action, text } = event.data;
    
    if (action === 'start' || action === 'update') {
        // Show a persistent notification.
        // This is key to keeping the service alive on mobile.
        const notificationTitle = 'Live Tracking Active';
        const notificationOptions = {
            body: text || 'Sending location updates to the server.',
            // icon: '/path/to/your/icon.png', // Optional: an icon for the notification
            tag: 'tracking-notification', // An ID to update the same notification
            silent: true, // Don't make a sound on updates
            // renotify: true, // Set to true if you want a sound/vibration on updates
        };

        // self.registration.showNotification is the API for showing push notifications
        self.registration.showNotification(notificationTitle, notificationOptions);
    } else if (action === 'stop') {
        // Close the notification when tracking stops
        self.registration.getNotifications({ tag: 'tracking-notification' }).then(notifications => {
            notifications.forEach(notification => notification.close());
        });
    }
});