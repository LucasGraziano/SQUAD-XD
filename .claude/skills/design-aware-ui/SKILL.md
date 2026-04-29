---
name: design-aware-ui
description: >
  Activate when writing any UI component, HTML, CSS, Tailwind, React component,
  landing page, dashboard, form, or any frontend code for psi-saas or other squads.
  Loads the project DESIGN.md and brand library to prevent AI slop and ensure
  visual consistency. Triggered by: "create component", "build UI", "landing page",
  "dashboard", "form", "button", "card", "style", "design", "frontend", "layout".
---

# design-aware-ui Skill

## Trigger Context

This skill activates automatically when generating any frontend/UI code.
If DESIGN.md exists in the current squad directory, load it first.

## Activation Protocol

1. **Detect squad** — which squad/app is being worked on?
   - psi-saas → `squads/psi-saas/app/DESIGN.md`
   - low-ticket → `.aiox-core/knowledge/design-systems/brands/` (choose closest brand)
   - other → check squad folder for DESIGN.md

2. **Load design tokens** — read the DESIGN.md before writing any code

3. **Check brand library** — if inspiration needed:
   ```
   .aiox-core/knowledge/design-systems/brands/_INDEX.md
   ```

4. **Apply mandatory rules:**
   - Use only colors from the DESIGN.md palette
   - Use only fonts specified (never default system-ui without approval)
   - Never use border-radius > 16px on structural components
   - Never use heavy shadows (max shadow-md from the file)
   - Never use gradient backgrounds on content sections
   - Always apply correct spacing tokens (4px base unit)
   - Always include focus ring for interactive elements

5. **Anti-slop checklist before output:**
   - [ ] No bento grid with glowing borders
   - [ ] No neon accent colors
   - [ ] No glassmorphism effects
   - [ ] No excessive animation
   - [ ] No generic "hero + features grid" layout without custom styling
   - [ ] Typography matches DESIGN.md hierarchy
   - [ ] Colors are only from palette

## psi-saas Specific Rules

Brand voice for copy: competent + empathetic colleague (NOT startup, NOT bank)
Forbidden words in UI: escalar, converter, lead, funil, otimizar, maximizar, engajar

## Brand Library Quick Reference

When user asks for UI inspired by a specific style, check:
```
.aiox-core/knowledge/design-systems/brands/{brand-name}.md
```

Available: 70 brands including linear.app, superhuman, notion, stripe, vercel,
intercom, framer, figma, cursor, raycast, slack, spotify, airbnb, etc.

## Output Format

Always start UI code with a comment header:
```
/* Design tokens: squads/psi-saas/app/DESIGN.md | Color: Teal #1A4A5A | Font: DM Serif + Inter */
```
