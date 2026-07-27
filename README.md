# Master–Detail Reference

A small, readable reference implementation of the **master–detail** UI pattern, built with React 19, Base UI, TanStack Query, TanStack Router, and Tailwind CSS 4.

Two routes, wired end to end: an **items index page** for browsing/triage, and an **`/items/:id` master-detail view** — a sidebar, a virtualized searchable master list, a detail view with a context rail, a toolbar with notifications, and a slide-over settings modal. Every interactive surface uses standard semantic HTML and ARIA (link lists, real `<table>`s, native dialog/popover/toast primitives) rather than repurposed widgets — that fidelity is the point of this reference.

## What it shows

- **Sidebar** — persistent primary navigation (`src/routes/RootLayout.tsx`)
- **Items index** (`/items`, with `/` redirecting to it) — a real `<table>` of all records; click a row to open its detail view (`src/routes/ItemsIndexRoute.tsx`)
- **Master list** (`/items/:id`) — a virtualized, searchable `<nav>`/`<ul>` of links (`aria-current="page"` marks the open item), not a repurposed tab widget (`src/routes/ItemDetailRoute.tsx`)
- **Detail view** — record detail with a contextual action rail (`aside`); detail scroll resets on navigation, master-list scroll position is preserved
- **Toolbar** — search input with `⌘K`/`Ctrl+K` focus hotkey, plus a Base UI `Popover` for notifications
- **Delete flow** — Base UI `Dialog` confirmation, then a Base UI `Toast` (no blocking `alert()`), redirecting back to the index
- **Async data** — TanStack Query, prefetched via route `loader`s (`queryClient.ensureQueryData`) so both routes render with data already in cache, and `preload="intent"` on row links does real hover-prefetching

The record shape lives in `src/mockData.ts` (`WorkItem`); data is mocked, no backend.

## Stack

- [React 19](https://react.dev) + TypeScript
- [TanStack Router](https://tanstack.com/router) — `/items` index and `/items/:id` detail routes, with data-loading `loader`s
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

## Porting this to another stack

If you're using this as a reference for a rewrite in a different framework (e.g. a ClojureScript/UIx app), the parts worth copying and the parts that are just implementation detail are different things:

**Copy this — it's the actual reference:**
- The four-column composition: `aside` (primary nav) → `main` > `section` (master list) + `article` (detail) + `aside` (context rail)
- Landmark structure: every `nav`/`aside`/`search` is labeled (`aria-label` or `aria-labelledby`), so a screen reader's landmark list is meaningful
- Real semantic elements over ARIA-widget stand-ins: an actual `<table>` for tabular data, an actual `<ul>`/`<li>` list of links for the master list — not a repurposed tab/listbox widget wearing the wrong role
- Heading hierarchy: one `h1` per page, sectioning content (`aside`, each `section`) gets its own heading before any subheadings, even if visually hidden (`sr-only`)
- The breadcrumb pattern (`nav[aria-label="Breadcrumb"] > ol`, `aria-current="page"` on the non-linked current crumb) and the `aria-current` distinction between a section-level nav link (`"true"`) and the one row that's the actual current record (`"page"`)
- Dialog/popover/toast accessible naming: the element's accessible name must match what's visually shown as the title — don't set a manual `aria-label` on a dialog that also has a visible heading, let the heading be the name
- Detail-pane vs. master-list scroll behavior on navigation (detail resets to top, list position is preserved) and where focus goes after a client-side navigation (e.g. back to the page heading after the delete-confirm redirect)

**Don't chase a literal equivalent of — these are just how this happens to be wired in React:**
- TanStack Router's specific route/loader API — the *pattern* worth keeping (prefetch data before the route renders, so a route never flashes empty/not-found state) matters more than the API shape. Since the uix app already uses tanstack-query, this pattern transfers directly, just via whatever routing library it uses.
- Base UI's `render`-prop composition (nesting `Tooltip.Trigger` around `Dialog.Trigger` etc.) — a UIx equivalent will have its own way of composing behaviors onto one element; what matters is that the composed result still has correct ARIA roles/attributes, not that the composition mechanism looks the same.
- `@tanstack/react-virtual`'s hook API — the underlying idea (only mount DOM nodes for visible rows, measure real row heights rather than guessing) is worth reproducing if the master list can grow large; the specific React hook isn't.

## Layout

```
src/
  router.tsx                    # route tree + router instance
  routes/
    RootLayout.tsx               # sidebar + top bar + toast viewport + <Outlet />
    ItemsIndexRoute.tsx          # "/items" — table of items
    ItemDetailRoute.tsx          # "/items/:id" — master list + detail + context rail
  components/
    NotificationsPopover.tsx     # Base UI Popover-backed notification bell
  hooks/
    useWorkItems.ts              # shared query options + hook for the mock item list, used by both components and route loaders
  mockData.ts                    # WorkItem type + sample records
  main.tsx                       # QueryClientProvider + Toast.Provider + RouterProvider
```
