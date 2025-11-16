importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Configuración (debe coincidir con la de Auth.js)
firebase.initializeApp({
  apiKey: "AIzaSyAVTmgZ0Dseoo09_VlAJg3PUXSfmT1uug8",
  authDomain: "soryu-dde62.firebaseapp.com",
  projectId: "soryu-dde62",
  storageBucket: "soryu-dde62.firebasestorage.app",
  messagingSenderId: "429755791917",
  appId: "1:429755791917:web:0e0cce1d2a2015baed16a4"
});

const messaging = firebase.messaging();

// Handler para notificaciones en background
messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = (payload.notification && payload.notification.title) || 'Recordatorio';
  const notificationOptions = {
    body: (payload.notification && payload.notification.body) || '',
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
