---
name: RandomEats
description: High-energy, appetizing culinary decision tool with tactile micro-interactions
colors:
  primary: "#dc2626"
  primary-hover: "#b91c1c"
  accent: "#f59e0b"
  neutral-bg: "#ffffff"
  surface: "#ffffff"
  surface-subtle: "#fafafa"
  border-subtle: "#f0f0f2"
  border-strong: "#e4e4e7"
  ink: "#18181b"
  ink-muted: "#52525b"
  ink-faint: "#a1a1aa"
  status-open: "#10b981"
  status-closed: "#ef4444"
typography:
  display:
    fontFamily: "Inter, 'Noto Sans Thai', -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Inter, 'Noto Sans Thai', -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, 'Noto Sans Thai', -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Inter, 'Noto Sans Thai', -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.01em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
---

## Overview
RandomEats is a high-speed culinary decision platform designed to banish mealtime paralysis. The interface is engineered with a **pure white architectural canvas** accented with high-chroma culinary crimson (`oklch(0.62 0.22 25)`) and golden saffron (`oklch(0.78 0.16 70)`). Forms, chips, and interactive surfaces follow modern product standards (Stripe/Linear caliber tactile feedback).

## Colors
- **Canvas (`neutral-bg`)**: Pure White `oklch(1 0 0)` (`#ffffff`). The freshness lives in photography and brand accents, avoiding the drab AI cream/beige cliché.
- **Surface Layer (`surface`, `surface-subtle`)**: Crisp cards with delicate hairline borders `oklch(0.92 0.005 30)` and subtle hover lift.
- **Primary Ink (`ink`)**: Deep Charcoal `oklch(0.20 0.01 30)` (`#18181b`) maintaining ≥12:1 contrast against pure white.
- **Muted Ink (`ink-muted`)**: Refined Slate `oklch(0.45 0.015 30)` (`#52525b`) with ≥5:1 contrast for clear readability.
- **Culinary Red (`primary`)**: High-energy Crimson `oklch(0.62 0.22 25)` (`#dc2626`) for primary actions, slot highlights, and brand identity.
- **Saffron Amber (`accent`)**: Crisp Golden Warmth `oklch(0.78 0.16 70)` (`#f59e0b`) for ratings, badges, and culinary accents.
- **Semantics**: Emerald Green `oklch(0.68 0.16 150)` for Open status, Coral Red `oklch(0.62 0.20 25)` for Closed status.

## Typography
Single geometric-humanist typographic system with bilingual Thai & Latin harmony:
- **Headings**: Tight tracking (`-0.03em`), bold weights (700-800), clean optical balance with `text-wrap: balance`.
- **UI Labels & Tags**: Crisp medium-to-semibold weights (600) with subtle letter-spacing for immediate glanceability.
- **Body & Captions**: Generous 1.55 line-height for effortless legibility across mobile and desktop.

## Elevation
No heavy mud-shadows. Tonal precision is achieved through:
- **Hairline Border**: `1px solid oklch(0.92 0.005 30)` as the primary structural boundary.
- **Crisp Shadow Sm**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)` for cards and interactive inputs.
- **Floating Spin Shadow**: `0 12px 30px -8px rgba(220, 38, 38, 0.35)` dedicated exclusively to the Spin trigger button.
- **Active Lift**: Subtle `-1px` transform translateY on hover with crisp easing curves (`cubic-bezier(0.16, 1, 0.3, 1)`).

## Components
- **Spin Button**: Hero-grade tactile button with pulsating inner glow, roulette icon micro-rotation, and instant tactile feedback.
- **Filter Chips**: Pill-shaped segmented toggles with crisp active state (filled crimson or subtle tinted borders) and accessible focus rings.
- **Random Result Card**: High-impact restaurant presentation with full-bleed image ratio, verified status pill, price tier indicator, and immediate Google Maps deep-link.
- **Restaurant Card**: Grid item with clean image aspect ratio, multi-tag overflow handling, and owner controls neatly integrated.
- **Form Controls**: Crisp inputs with subtle borders, warm focus rings, and explicit validation message containers.
- **Navbar & Footer**: Streamlined sticky header with blur backdrop (`backdrop-blur-md bg-white/95`) and seamless mobile drawer.

## Do's and Don'ts
### Do's
- Always maintain pure white background on cards and canvas to keep food photography vibrant.
- Use explicit visual feedback on all filter chip clicks.
- Keep spin animation under 1.4 seconds with a satisfying roulette decrescendo.
- Use direct Thai UX copy that feels friendly, decisive, and local.

### Don'ts
- Do not use warm beige/cream/sand backgrounds.
- Do not use gradient-clipped headline text.
- Do not add uppercase tracked kicker eyebrows to every section.
- Do not hide restaurant addresses or Google Maps buttons behind multiple clicks.
