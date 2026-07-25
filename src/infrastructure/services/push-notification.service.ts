// src/infrastructure/services/push-notification.service.ts
import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported, type Messaging } from 'firebase/messaging'
import { toast } from 'sonner'
import { firebaseConfig, FIREBASE_VAPID_KEY } from '../config/firebase.config'
import { registerPushTokenUseCase } from '../factories/push-token.factory'

class PushNotificationService {
  private app: FirebaseApp | null = null
  private messaging: Messaging | null = null
  private token: string | null = null
  private initialized = false

  async initialize(): Promise<void> {
    if (this.initialized) return
    this.initialized = true

    const supported = await isSupported().catch(() => false)
    if (!supported) {
      console.warn('[FCM] Push notifications no soportadas en este navegador')
      return
    }

    if (firebaseConfig.apiKey.startsWith('PENDIENTE')) {
      console.warn('[FCM] Configuración de Firebase pendiente, push deshabilitado')
      return
    }

    try {
      this.app = initializeApp(firebaseConfig)
      this.messaging = getMessaging(this.app)

      onMessage(this.messaging, (payload) => {
        toast.info(payload.notification?.title || 'Nueva notificación', {
          description: payload.notification?.body,
        })
      })
    } catch (error) {
      console.error('[FCM] Error al inicializar Firebase', error)
    }
  }

  async registerTokenForUser(): Promise<void> {
    if (!this.messaging) return

    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        console.warn('[FCM] Permiso de notificaciones denegado')
        return
      }

      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')

      this.token = await getToken(this.messaging, {
        vapidKey: FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      })

      if (this.token) {
        await registerPushTokenUseCase.execute(this.token, 'web')
        console.info('[FCM] Token registrado correctamente')
      }
    } catch (error) {
      console.error('[FCM] Error al registrar token', error)
    }
  }
}

export const pushNotificationService = new PushNotificationService()
