'use client'

import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'

async function subscribeToPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null

  const reg = await navigator.serviceWorker.ready
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  if (!publicKey) return null

  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    applicationServerKey: urlBase64ToUint8Array(publicKey) as any,
  })

  await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      keys: {
        p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
        auth: arrayBufferToBase64(subscription.getKey('auth')!),
      },
    }),
  })

  return subscription
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

interface Props {
  show: boolean
  onDismiss: () => void
}

export function PushPermissionPrompt({ show, onDismiss }: Props) {
  const [visible, setVisible] = useState(false)
  const [subscribing, setSubscribing] = useState(false)

  useEffect(() => {
    if (!show) return
    if (typeof window === 'undefined') return
    if (!('Notification' in window)) return
    if (Notification.permission !== 'default') return
    setVisible(true)
  }, [show])

  if (!visible) return null

  async function handleAllow() {
    setSubscribing(true)
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      await subscribeToPush()
    }
    setSubscribing(false)
    setVisible(false)
    onDismiss()
  }

  function handleDismiss() {
    setVisible(false)
    onDismiss()
  }

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-[380px] mx-4 px-4">
      <div className="bg-[#0D0D0D] text-white rounded-[10px] shadow-2xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[rgba(11,217,4,0.2)] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bell size={15} className="text-[#0BD904]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-white mb-0.5">Ativar alertas de vencimento</p>
          <p className="text-[12px] text-[rgba(255,255,255,0.6)] mb-3 leading-relaxed">
            Receba uma notificação 24h antes de cada apólice vencer — mesmo com o app fechado.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAllow}
              disabled={subscribing}
              className="h-8 px-4 rounded-[6px] bg-[#0BD904] text-[#0D0D0D] text-[12px] font-bold hover:bg-[#09C003] transition-colors disabled:opacity-60"
            >
              {subscribing ? 'Ativando...' : 'Ativar notificações'}
            </button>
            <button
              onClick={handleDismiss}
              className="text-[12px] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors"
            >
              Agora não
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors flex-shrink-0"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  )
}

interface ServiceWorkerRegistrarProps {
  onReady?: () => void
}

export function ServiceWorkerRegistrar({ onReady }: ServiceWorkerRegistrarProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => onReady?.())
        .catch(console.error)
    }
  }, [onReady])
  return null
}
