# Agents

## Dev Commands
- `npm run dev` — Vite dev server on port 3850
- `npm run build` — TypeScript build + Vite production build
- `npm run preview` — Preview production build

## Stack
- React 19 + TypeScript + Vite 7
- Tailwind CSS 3 for styling
- React Router 7 for routing
- React Toastify for notifications
- Axios for HTTP
- Font Awesome for icons

## Project Structure
- `src/pages/` — Route page components
- `src/components/` — Reusable UI components
- `src/services/` — API clients (`api.client.ts` is the base axios instance)
- `src/assets/css/` — CSS files (login.css, App.css)
- `src/types/` — TypeScript type definitions
- `src/hooks/` — Custom React hooks

## Key Conventions
- Design tokens in `design.md`: Sauti Orange `#F48120`, Sauti Navy `#12245B`
- Font: Poppins (loaded from Google Fonts in login.css)
- Dev server port: **3850** (configured in `vite.config.ts`)
- No test suite configured — verify manually

## API
- Base URL configured via environment variable (see `.env`)
- `src/services/auth.service.ts` — login, logout, profile
- `src/services/api.client.ts` — axios instance with interceptors
