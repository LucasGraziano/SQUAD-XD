import webpush from 'web-push'

if (
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
  process.env.VAPID_PRIVATE_KEY &&
  process.env.VAPID_SUBJECT
) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  )
}

export interface PushPayload {
  title: string
  body: string
  url?: string
  icon?: string
}

export interface PushSubscriptionKeys {
  p256dh: string
  auth: string
}

export async function sendPushNotification(
  subscription: { endpoint: string; keys: PushSubscriptionKeys },
  payload: PushPayload,
): Promise<boolean> {
  if (!process.env.VAPID_PRIVATE_KEY) return false

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
      JSON.stringify(payload),
    )
    return true
  } catch (err) {
    if ((err as { statusCode?: number }).statusCode === 410) {
      return false // subscription expired — caller should delete
    }
    console.error('[push] sendPushNotification error:', err)
    return false
  }
}
