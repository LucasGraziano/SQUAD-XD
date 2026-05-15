'use client'

import { useEffect } from 'react'

export function PostHogInit() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key) return
    import('posthog-js').then(({ default: ph }) => {
      ph.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
        capture_pageview: false,
        persistence: 'localStorage',
      })
    })
  }, [])
  return null
}
