# Master–Detail Reference

A small, readable reference implementation of the **master–detail** UI pattern, built with React 19, Base UI, TanStack Query, TanStack Router, and Tailwind CSS 4.

Two routes, wired end to end: an **items index page** for browsing/triage, and an **`/items/:id` master-detail view** — a sidebar, a virtualized searchable master list, a detail view with a context rail, a toolbar with notifications, and a slide-over settings modal. Every interactive surface uses standard semantic HTML and ARIA (link lists, real `<table>`s, native dialog/popover/toast primitives) rather than repurposed widgets — that fidelity is the point of this reference.

## What it shows

- **Sidebar** — persistent primary navigation (`src/routes/RootLayout.tsx`)
- **Items index** (`/`) — a real `<table>` of all records; click a row to open its detail view (`src/routes/ItemsIndexRoute.tsx`)
- **Master list** (`/items/:id`) — a virtualized, searchable `<nav>`/`<ul>` of links (`aria-current="page"` marks the open item), not a repurposed tab widget (`src/routes/ItemDetailRoute.tsx`)
- **Detail view** — record detail with a contextual action rail (`aside`); detail scroll resets on navigation, master-list scroll position is preserved
- **Toolbar** — search input with `⌘K`/`Ctrl+K` focus hotkey, plus a Base UI `Popover` for notifications
- **Delete flow** — Base UI `Dialog` confirmation, then a Base UI `Toast` (no blocking `alert()`), redirecting back to the index
- **Async data** — TanStack Query with a simulated fetch delay and loading state

The record shape lives in `src/mockData.ts` (`WorkItem`); data is mocked, no backend.

## Stack

- [React 19](https://react.dev) + TypeScript
- [TanStack Router](https://tanstack.com/router) — `/` index and `/items/:id` detail routes
- [TanStack Virtual](https://tanstack.com/virtual) — master-list row virtualization
- [Base UI](https://base-ui.com) — unstyled accessible primitives (`Dialog`, `Popover`, `Toast`)
- [TanStack Query](https://tanstack.com/query) — async data fetching
- [Tailwind CSS 4](https://tailwindcss.com) — styling
- [lucide-react](https://lucide.dev) — icons
- [Vite](https://vite.dev) + [Oxlint](https://oxc.rs)

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL.

## Scripts

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `npm run dev`     | Start the dev server (HMR)    |
| `npm run build`   | Type-check and build for prod |
| `npm run preview` | Preview the production build  |
| `npm run lint`    | Lint with Oxlint              |

## Layout

```
src/
  router.tsx                    # route tree + router instance
  routes/
    RootLayout.tsx               # sidebar + top bar + toast viewport + <Outlet />
    ItemsIndexRoute.tsx          # "/" — table of items
    ItemDetailRoute.tsx          # "/items/:id" — master list + detail + context rail
  components/
    NotificationsPopover.tsx     # Base UI Popover-backed notification bell
  hooks/
    useWorkItems.ts              # shared TanStack Query hook for the mock item list
  mockData.ts                    # WorkItem type + sample records
  main.tsx                       # QueryClientProvider + Toast.Provider + RouterProvider
```
