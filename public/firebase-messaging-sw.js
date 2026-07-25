// public/firebase-messaging-sw.js
//
// ⚠️ PENDIENTE: reemplazar con los valores reales de Yandri (deben coincidir
// exactamente con src/infrastructure/config/firebase.config.ts).

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'PENDIENTE_API_KEY',
  authDomain: 'PENDIENTE_AUTH_DOMAIN',
  projectId: 'PENDIENTE_PROJECT_ID',
  storageBucket: 'PENDIENTE_STORAGE_BUCKET',
  messagingSenderId: 'PENDIENTE_SENDER_ID',
  appId: 'PENDIENTE_APP_ID',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'QuitoMove'
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/icons.svg',
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})
