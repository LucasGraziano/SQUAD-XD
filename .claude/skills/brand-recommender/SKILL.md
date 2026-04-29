---
name: brand-recommender
description: >
  Activate when user asks for design inspiration, wants to know which brand style
  to use as reference, asks "which brand is closest to X", or needs to find the
  right DESIGN.md from the library. Triggered by: "inspiração de design",
  "estilo parecido com", "qual brand usar", "referência visual", "design similar",
  "como o Linear", "como o Stripe", "qual brand combina".
---

# brand-recommender Skill

## What This Does

Recommends the best brand(s) from the 70-brand design library based on the
project's visual direction, mood, or target audience.

## Quick Reference Library

Located at: `.aiox-core/knowledge/design-systems/brands/`
Index: `.aiox-core/knowledge/design-systems/brands/_INDEX.md`

## Recommendation Matrix

### By Mood
| Mood | Best Brands |
|------|------------|
| Ultra-minimal, precise | linear.app, vercel, cal, hashicorp |
| Warm, friendly | notion, intercom, airtable, starbucks |
| Premium, luxury | superhuman, apple, ferrari, stripe |
| Dark, powerful | cursor, raycast, elevenlabs, spotify |
| Playful, creative | figma, clay, framer, lovable |
| Technical, dev-first | supabase, expo, resend, posthog |
| Healthcare/trust | intercom, notion, mintlify (closest) |
| SaaS dashboard | linear.app, notion, airtable, posthog |
| Fintech | revolut, stripe, coinbase, mastercard |

### By Component Type
| Component | Best Reference Brand |
|-----------|---------------------|
| Dashboard layout | linear.app, airtable |
| Data tables | airtable, clickhouse, posthog |
| Alert/notification | intercom, slack |
| Onboarding flow | notion, figma |
| Landing page | superhuman, framer, stripe |
| Auth forms | vercel, supabase |

## For psi-saas (Vínculo)

Primary: `squads/psi-saas/app/DESIGN.md` (custom — use this first)
Secondary inspirations: notion (warmth), linear.app (structure), intercom (UX patterns)

## Usage

When recommending:
1. Read `_INDEX.md` for quick overview
2. Read specific brand file for full tokens
3. Map brand tokens to project palette when adapting
