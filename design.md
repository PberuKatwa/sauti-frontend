# Cloudflare Design System Documentation

## Brand Philosophy

Cloudflare's design philosophy centers on **"Help, Not Bureaucracy"**—reducing friction during moments of user frustration while maintaining technical credibility. The visual identity communicates security, speed, and accessibility without intimidating complexity.

---

## Brand Colors

### Primary Palette

| Color | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| **Cloudflare Orange** | `#F48120` | `text-[#F48120]` / `bg-[#F48120]` | Primary brand color, active protection states, CTAs |
| **Cloudflare Orange Dark** | `#D2630D` | `text-[#D2630D]` / `bg-[#D2630D]` | Hover states, emphasis |
| **Black** | `#000000` | `text-black` / `bg-black` | Typography, strong contrast |
| **White** | `#FFFFFF` | `text-white` / `bg-white` | Backgrounds, dark mode text |

### Secondary Palette

| Color | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| **Cloudflare Blue** | `#0055FF` | `text-[#0055FF]` / `bg-[#0055FF]` | Links, interactive elements, dark mode CTAs |
| **Cloudflare Blue Dark** | `#003EC2` | `text-[#003EC2]` / `bg-[#003EC2]` | Hover states for blue elements |
| **Gray Cloud (Inactive)** | `#9CA3AF` | `text-gray-400` / `bg-gray-400` | Disabled states, inactive protection |

### Extended Scale (Modular Color System)

| Step | Light Mode | Dark Mode | Tailwind Usage |
|------|------------|-----------|----------------|
| 0 | `#FFFFFF` | `#0A0A0A` | `bg-white` / `dark:bg-[#0A0A0A]` |
| 1 | `#F9FAFB` | `#1A1A1A` | `bg-gray-50` / `dark:bg-[#1A1A1A]` |
| 2 | `#F3F4F6` | `#2A2A2A` | `bg-gray-100` / `dark:bg-[#2A2A2A]` |
| 3 | `#E5E7EB` | `#3A3A3A` | `bg-gray-200` / `dark:bg-[#3A3A3A]` |
| 4 | `#D1D5DB` | `#4A4A4A` | `bg-gray-300` / `dark:bg-[#4A4A4A]` |
| 5 | `#9CA3AF` | `#6A6A6A` | `bg-gray-400` / `dark:bg-[#6A6A6A]` |
| 6 | `#6B7280` | `#8A8A8A` | `bg-gray-500` / `dark:bg-[#8A8A8A]` |
| 7 | `#4B5563` | `#AAAAAA` | `bg-gray-600` / `dark:bg-[#AAAAAA]` |
| 8 | `#374151` | `#CACACA` | `bg-gray-700` / `dark:bg-[#CACACA]` |
| 9 | `#1F2937` | `#EAEAEA` | `bg-gray-800` / `dark:bg-[#EAEAEA]` |
| 10 | `#111827` | `#FFFFFF` | `bg-gray-900` / `dark:bg-white` |

---

## Color Psychology & Brand Meaning

### Orange (#F48120)
- **Represents**: Progress, security, creativity, dynamism
- **Psychological effect**: Energy, warmth, action-oriented
- **Brand metaphor**: The orange cloud symbolizes protection—as inaccessible as clouds in the sky
- **Functional use**: Active protection indicator (orange cloud = secured, gray cloud = unprotected)

### Blue (#0055FF)
- **Represents**: Trust, reliability, technology
- **Psychological effect**: Calm, professional, trustworthy
- **Usage**: Primary action color in dark mode (preserves brand consistency)

### Gray Scale
- **Represents**: Neutrality, balance, hierarchy
- **Psychological effect**: Non-intrusive, supportive
- **Usage**: Backgrounds, borders, inactive states

---

## Typography

### Font Stack

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
