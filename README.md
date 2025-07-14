# React URL Shortener — Design Document

## Architecture & Key Decisions
- **React** (functional components, hooks, context)
- **Material UI** for all UI/UX
- **React Router v6** for routing and redirection
- **LocalStorage** for client-side persistence (URLs, analytics, click data)
- **Custom Logging Middleware** (all logs routed through LoggerProvider, no console.log)
- **No backend, no authentication**

## Data Modeling
- **Shortened URL Object:**
  - `url`: Original long URL
  - `shortcode`: Unique alphanumeric code (4-12 chars)
  - `createdAt`: ISO string
  - `expiresAt`: ISO string
  - `shortUrl`: Full short URL
  - `clicks`: Array of click objects
- **Click Object:**
  - `timestamp`: ISO string
  - `source`: Referrer or 'direct'
  - `geo`: City, country (from ipapi.co)
- **Persistence:**
  - All shortened URLs and analytics are stored in `localStorage` under `short_urls`.
  - Logs are stored in `localStorage` under `app_logs`.

## Technology Selections & Justifications
- **Material UI:** Modern, accessible, responsive UI components.
- **React Router:** Enables client-side routing and redirection.
- **LocalStorage:** Satisfies persistence without backend; simple and effective for demo/assessment.
- **ipapi.co:** Free, public API for coarse geo-location.
- **No console.log:** All logging via LoggerProvider, as required.

## Routing Strategy
- `/` — URL Shortener Page (main form, up to 5 URLs at once)
- `/stats` — Statistics Page (list all shortened URLs, analytics)
- `/:shortcode` — Redirection Route (redirects to original URL, logs click)

## Assumptions
- No backend: all data is client-side (LocalStorage)
- All logging is via custom middleware (no console.log)
- App runs at `http://localhost:3000`
- No authentication or user management
- All code and UI are production-ready within the time limit

## User Experience
- Responsive, accessible, clean UI
- Robust error handling (user-friendly, MUI alerts)
- All forms validated client-side (URL, validity, shortcode)
- Shortcode uniqueness enforced
- Default validity: 30 minutes if not specified

