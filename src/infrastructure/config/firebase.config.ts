// src/infrastructure/config/firebase.config.ts
//
// ⚠️ PENDIENTE: reemplazar estos valores con los reales de Yandri.
// Consola de Firebase → ⚙️ Configuración del proyecto → "Tus apps" → App Web.

export const firebaseConfig = {
  apiKey: 'PENDIENTE_API_KEY',
  authDomain: 'PENDIENTE_AUTH_DOMAIN',
  projectId: 'PENDIENTE_PROJECT_ID',
  storageBucket: 'PENDIENTE_STORAGE_BUCKET',
  messagingSenderId: 'PENDIENTE_SENDER_ID',
  appId: 'PENDIENTE_APP_ID',
}

// ⚠️ PENDIENTE: VAPID key desde Consola de Firebase → ⚙️ Configuración del
// proyecto → pestaña "Cloud Messaging" → "Certificados push web".
export const FIREBASE_VAPID_KEY = 'PENDIENTE_VAPID_KEY'
