'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

export function PushNotificationsSection() {
  const [supported, setSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) return
    setSupported(true)
    setPermission(Notification.permission)

    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription()
      setSubscribed(!!sub)
    })
  }, [])

  const handleEnable = useCallback(async () => {
    setLoading(true)
    setError(null)

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!publicKey) {
      setError('Notificações push não estão configuradas nesta instalação.')
      setLoading(false)
      return
    }

    const perm = await Notification.requestPermission()
    setPermission(perm)

    if (perm !== 'granted') {
      if (perm === 'denied') setError('Permissão negada no navegador. Habilite manualmente nas configurações do site.')
      setLoading(false)
      return
    }

    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        applicationServerKey: urlBase64ToUint8Array(publicKey) as any,
      })

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(sub.getKey('p256dh')!),
            auth: arrayBufferToBase64(sub.getKey('auth')!),
          },
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSubscribed(true)
    } catch (err) {
      console.error('[push] subscribe error:', err)
      setError('Não foi possível ativar as notificações. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDisable = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()

      if (sub) {
        await sub.unsubscribe()
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
      }
      setSubscribed(false)
    } catch (err) {
      console.error('[push] unsubscribe error:', err)
      setError('Não foi possível desativar as notificações. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Esconde a seção inteira se VAPID key não estiver configurada (feature não disponível)
  const isConfigured = !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  if (!supported || !isConfigured) return null

  const isEnabled = subscribed && permission === 'granted'
  const isDenied = permission === 'denied'

  return (
    <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[6px] bg-[rgba(11,217,4,0.08)] flex items-center justify-center">
            <Bell size={16} className="text-[#0BD904]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#0D0D0D]">Notificações Push</p>
            <p className="text-[12px] text-[#9CA3AF]">Alertas de vencimento e pendências no celular</p>
          </div>
        </div>
        {isDenied ? (
          <span className="text-[12px] text-[#9CA3AF]">Bloqueado nas configurações do navegador</span>
        ) : (
          <button
            onClick={isEnabled ? handleDisable : handleEnable}
            disabled={loading}
            className={cn(
              'relative overflow-hidden rounded-full transition-colors flex-shrink-0 disabled:opacity-60',
              isEnabled ? 'bg-[#0BD904]' : 'bg-[#D1D1D1]'
            )}
            style={{ height: '22px', width: '40px' }}
          >
            <span className={cn(
              'absolute top-[3px] left-0 w-4 h-4 bg-white rounded-full transition-transform',
              isEnabled ? 'translate-x-[20px]' : 'translate-x-[3px]'
            )} />
          </button>
        )}
      </div>
      {isEnabled && !error && (
        <p className="mt-3 text-[12px] text-[#059669]">
          ✓ Você receberá alertas 24h antes de cada apólice vencer.
        </p>
      )}
      {error && (
        <p className="mt-3 text-[12px] text-[#DC2626] bg-[#FEF2F2] rounded-[6px] px-3 py-2">
          {error}
        </p>
      )}
    </div>
  )
}
