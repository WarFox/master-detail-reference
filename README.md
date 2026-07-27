# Master–Detail Reference

A small, readable reference implementation of the **master–detail** UI pattern, built with React 19, Base UI, TanStack Query, and Tailwind CSS 4.

One screen, wired end to end: a sidebar, a searchable master list, a detail view with a context rail, a toolbar with notifications, pagination, and a slide-over settings modal.

## What it shows

- **Sidebar** — primary navigation (`src/App.tsx`)
- **Master list** — searchable, filterable item list driven by `Tabs.Root` (selecting a tab selects the record)
- **Detail view** — record detail with a contextual action rail (`aside`)
- **Toolbar** — search input with `⌘K`/`Ctrl+K` focus hotkey, plus a notifications popover
- **Pagination** — footer paging controls
- **Modal** — Base UI `Dialog` as a slide-over settings sheet
- **Async data** — TanStack Query with a simulated fetch delay and loading state

The record shape lives in `src/mockData.ts` (`WorkItem`); data is mocked, no backend.

## Stack

- [React 19](https://react.dev) + TypeScript
- [Base UI](https://base-ui.com) — unstyled accessible primitives (`Tabs`, `Dialog`)
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
  App.tsx       # the full master–detail screen
  mockData.ts   # WorkItem type + sample records
  main.tsx      # QueryClientProvider + root render
```
