# Sauti-Cloud Design System Documentation

## Brand Philosophy

Sauti-Cloud's design philosophy centers on **"Intelligence, Not Interruption"**—creating seamless AI-driven sales and customer support experiences that feel human, not robotic. The visual identity communicates innovation, trust, and effortless automation without losing the personal touch.

Our AI-powered platform enables businesses to close sales and provide support 24/7 through intelligent bots and web interfaces—no human required in the loop.

---

## Brand Colors

### Primary Palette

| Color | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| **Sauti Orange** | `#F48120` | `text-[#F48120]` / `bg-[#F48120]` | Primary brand color, active bot states, CTAs, energy accents |
| **Sauti Navy Blue** | `#12245B` | `text-[#12245B]` / `bg-[#12245B]` | Backgrounds, primary buttons, headings. |
| **Sauti Navy Dark** | `#020617` | `text-[#020617]` / `bg-[#020617]` | Hover states, emphasis, deep contrast |
| **Black** | `#000000` | `text-black` / `bg-black` | Typography, strong contrast |
| **White** | `#FFFFFF` | `text-white` / `bg-white` | Backgrounds, cards, clean spaces |

### Secondary Palette

| Color | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| **Sauti Blue Accent** | `#3B82F6` | `text-[#3B82F6]` / `bg-[#3B82F6]` | Links, interactive elements, secondary actions |
| **Sauti Blue Dark** | `#020617` | `text-[#020617]` / `bg-[#020617]` | Hover states for blue elements |
| **Gray (Inactive)** | `#9CA3AF` | `text-gray-400` / `bg-gray-400` | Disabled states, inactive bots, placeholders |

### Extended Scale (Modular Color System)

| Step | Color | Tailwind Usage |
|------|-------|----------------|
| 0 | `#FFFFFF` | `bg-white` |
| 1 | `#F9FAFB` | `bg-gray-50` |
| 2 | `#F3F4F6` | `bg-gray-100` |
| 3 | `#E5E7EB` | `bg-gray-200` |
| 4 | `#D1D5DB` | `bg-gray-300` |
| 5 | `#9CA3AF` | `bg-gray-400` |
| 6 | `#6B7280` | `bg-gray-500` |
| 7 | `#4B5563` | `bg-gray-600` |
| 8 | `#374151` | `bg-gray-700` |
| 9 | `#1F2937` | `bg-gray-800` |
| 10 | `#111827` | `bg-gray-900` |

---

## Color Psychology & Brand Meaning

### Navy Blue (#0F172A) - Primary
- **Represents**: AI intelligence, trust, professionalism, stability
- **Psychological effect**: Authority, reliability, technological sophistication
- **Brand metaphor**: The deep blue represents the depth of our AI capabilities and the trust businesses place in automated sales
- **Functional use**: Primary actions, headers, AI bot indicators, trust signals

### Orange (#F48120) - Secondary Accent
- **Represents**: Energy, action, conversion, warmth
- **Psychological effect**: Urgency, enthusiasm, human touch
- **Brand metaphor**: The spark of automated sales happening in real-time
- **Functional use**: CTAs, active sale states, notifications, accent highlights

### Blue Accent (#3B82F6)
- **Represents**: Communication, clarity, support
- **Psychological effect**: Approachable, helpful, responsive
- **Usage**: Links, chat interfaces, support elements

### Gray Scale
- **Represents**: Neutrality, balance, system states
- **Psychological effect**: Non-intrusive, background support
- **Usage**: Backgrounds, borders, inactive bot states, secondary information

---

## Typography

### Font Stack

```css
font-family: 'Poppins', sans-serif;
```

---

## Primary Gradient Background

**All full-page backgrounds default to this gradient unless explicitly stated otherwise.**

| Gradient | Tailwind Class |
|----------|----------------|
| Sauti Primary Gradient | `bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950` |

This gradient is used for landing pages, auth pages, and any full-viewport surfaces. It transitions from deep slate (`slate-950`) through mid-slate (`slate-900`) to deep blue (`blue-950`), creating a sense of depth and technological sophistication.

### Implementation

```tsx
// Full-page background
<div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950">
  {/* ... */}
</div>
```

---

## Default Background Rule

**All component backgrounds default to white (`bg-white`) unless explicitly specified otherwise.** This includes but is not limited to:

- Data tables and table rows
- Filters, search bars, and input fields
- Selected/active states (e.g., sidebar items, tabs, buttons)
- Cards, modals, dropdowns, tooltips, popovers
- Form containers and settings panels

Do NOT use `dark:bg-*` utilities or colored backgrounds unless there is a deliberate, documented reason. White is the baseline for readability and visual consistency.

---

## Destructive Actions & Error States

Destructive actions (delete, cancel, remove) and error states must use **danger red** to clearly signal caution or failure.

| Context | Usage | Tailwind Class |
|---------|-------|----------------|
| Buttons | Delete/Remove actions | `bg-red-600 hover:bg-red-700 text-white` |
| Text/Icons | Error messages, warnings | `text-red-600` |
| Borders | Invalid inputs, error outlines | `border-red-500` |
| Backgrounds | Error alerts, banners | `bg-red-50 border-red-200` |

**Note**: Always pair red destructive buttons with a confirmation step (e.g., modal dialog) to prevent accidental data loss. Use neutral or secondary colors for non-destructive actions like "Cancel" when placed near a true delete action.

---

## Component Surfaces

All floating components (tables, modals, cards, dropdowns, tooltips, popovers) must use a **white background** regardless of dark mode setting.

| Component | Background | Border | Notes |
|-----------|------------|--------|-------|
| Tables | `bg-white` | `border-gray-200` | Header row uses white bg with `border-gray-100` |
| Modals | `bg-white` | `border-gray-200` | Rounded-xl container |
| Cards | `bg-white` | `border-gray-200` | Rounded-xl, used for metric displays |
| Dropdowns | `bg-white` | `border-gray-200` | Shadowed, rounded-lg |
| Tooltips | `bg-white` | `border-gray-200` | Small padding, shadowed |
| Popovers | `bg-white` | `border-gray-200` | Shadowed, rounded-lg |

### Implementation

```tsx
// Table container
<div className="bg-white border border-gray-200 rounded-xl">
  {/* ... */}
</div>

// Modal
<div className="bg-white border border-gray-200 rounded-xl p-6">
  {/* ... */}
</div>
```

**Note**: The white background is a design constant. Do NOT use `dark:bg-*` utilities on these components—they should always remain white to maintain visual consistency and readability.
