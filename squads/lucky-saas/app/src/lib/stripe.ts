import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

export const PRICE_IDS = {
  solo: process.env.PRICE_ID_SOLO!,
  profissional: process.env.PRICE_ID_PROFISSIONAL!,
  equipe: process.env.PRICE_ID_EQUIPE!,
} as const

export type Plan = keyof typeof PRICE_IDS
