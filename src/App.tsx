import React, { useState, useEffect, useRef } from 'react';
import { Tabs } from '@base-ui/react/tabs';
import { Dialog } from '@base-ui/react/dialog';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Layers,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Bell,
  Settings,
  X,
  Loader2
} from 'lucide-react';
import { mockItems, type WorkItem } from './mockData';

// Simulated API fetch delay helper
const fetchWorkItemsAsync = async (): Promise<WorkItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800)); // 800ms API lag simulation
  return mockItems;
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>('task-1');
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Alex assigned you to Cluster Migration" },
    { id: 2, text: "Database downtime scheduled at 02:00 AM" }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // References for handling hotkey focus transitions
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Asynchronous React Query Pipeline
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['workItems'],
    queryFn: fetchWorkItemsAsync,
  });

  // Global Keyboard Binding: CMD+K or CTRL+K focuses the Search Toolbar instantly
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute live search values across the fetched pipeline state
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeItem = items.find(item => item.id === selectedId) || items[0];

  if (isLoading || !activeItem) {
    return <div className="flex h-screen w-screen items-center justify-center text-sm text-slate-500">Loading…</div>;
  }

  return (
    // Main App Container Frame
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans antialiased">

      {/* 1. SIDEBAR: Configured with a dialog component for structural slide-over setting panels */}
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-slate-900 text-slate-300" aria-label="Primary Navigation">
        <div className="flex h-14 items-center px-6 border-b border-slate-800">
          <span className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-400" /> CoreSystem
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <a href="#dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </a>
          <a href="#items" className="flex items-center gap-3 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors">
            <Layers className="h-4 w-4" /> Work Items
          </a>
        </nav>

        {/* Global Action Footer with Base UI Slide-Over Sheet Primitive Container */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-sm">
          <span className="text-xs text-slate-500 font-mono">v2.4.0 Engine</span>

          <Dialog.Root>
            {/* Inject behavior straight into our custom unnested button layer */}
            <Dialog.Trigger render={
              <button type="button" aria-label="Open Settings" className="p-1.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">
                <Settings className="h-4 w-4" />
              </button>
            } />
            <Dialog.Portal>
              {/* Backplane Backdrop Blur overlay */}
              <Dialog.Backdrop className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300" />

              {/* Slide-over sheet element using layout transition parameters */}
              <Dialog.Popup
                className="fixed top-0 right-0 z-50 h-screen w-96 border-l border-slate-200 bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out data-[state=closed]:translate-x-full"
                render={<section aria-label="System Settings Configuration Sheet" />}
              >
                <header className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <Dialog.Title className="text-base font-bold text-slate-900">Workspace Settings</Dialog.Title>
                    <Dialog.Description className="text-xs text-slate-500">Configure global dashboard engine states.</Dialog.Description>
                  </div>
                  <Dialog.Close render={<button aria-label="Close panel" className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>} />
                </header>

                <div className="space-y-4 text-sm text-slate-600">
                  <p>Slide-Over semantic sheet configuration operates seamlessly without unnecessary nested wrap nodes.</p>
                </div>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </aside>

      {/* 2. THE MAIN HUB: Tabs.Root acts natively as the <main> structural layer */}
      <Tabs.Root
        value={selectedId}
        onValueChange={(val) => val && setSelectedId(val)}
        render={<main className="flex flex-1 overflow-hidden" />}
      >

        {/* MASTER LIST SECTION */}
        <section className="flex w-96 flex-col border-r border-slate-200 bg-white" aria-labelledby="list-heading">
          <h2 id="list-heading" className="sr-only">Item Workspace List</h2>

          {/* Top Search & Interactive Notification Toolbar */}
          <header className="flex h-14 items-center justify-between gap-3 border-b border-slate-200 px-4 bg-slate-50">
            <search className="flex-1">
              <form onSubmit={(e) => e.preventDefault()} className="relative">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Filter items... (⌘K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white py-1.5 pr-3 pl-9 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </form>
            </search>

            {/* Notification Bell Trigger Wrapper Layer */}
            <div className="relative">
              <button
                type="button"
                aria-label="View notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-md border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-slate-50">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Dynamic Notification Context Box */}
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 mt-2 z-20 w-72 rounded-lg border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 border-b border-slate-100 uppercase tracking-wider">Notifications</div>
                    <ul className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                      {notifications.map(n => (
                        <li key={n.id} className="p-3 text-xs text-slate-700 hover:bg-slate-50 transition-colors rounded-md mt-1">{n.text}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            <button type="button" aria-label="Filters" className="rounded-md border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 transition-colors">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </header>

          {/* The Live Interactive Scroll List Panel */}
          <Tabs.List render={<div className="flex-1 overflow-y-auto p-3 space-y-1 bg-slate-50/50" aria-label="Select Work Item" />}>
            {isLoading ? (
              <div className="flex h-32 flex-col items-center justify-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                <span>Streaming items...</span>
              </div>
            ) :

              filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <Tabs.Tab
                    key={item.id}
                    value={item.id}
                    nativeButton={false}
                    render={
                      <article className="group relative flex flex-col items-start gap-1 cursor-pointer rounded-lg border border-transparent bg-white p-4 text-left shadow-xs transition-all hover:border-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 data-[selected]:border-blue-500 data-[selected]:bg-blue-50/50 data-[selected]:shadow-none" tabIndex={0}>
                        <div className="flex w-full items-center justify-between gap-2">
                          <h3 className="font-semibold text-sm text-slate-900 group-data-[selected]:text-blue-900">{item.title}</h3>
                          <span className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-xxs font-medium border ${item.status === 'Completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                            item.status === 'Reviewed' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                              'bg-blue-50 border-blue-200 text-blue-700'
                            }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.summary}</p>
                        <time className="mt-1 text-xxs text-slate-400" dateTime={item.date}>{item.date}</time>
                      </article>
                    }
                  />
                ))
              ) : (
                <div className="p-8 text-center text-sm text-slate-500">No items match criteria.</div>
              )}
          </Tabs.List>

          {/* Footer Pagination */}
          <footer className="flex h-12 items-center justify-between border-t border-slate-200 px-4 bg-slate-50">
            <nav aria-label="Pagination Navigation" className="flex w-full items-center justify-between text-xs text-slate-600 font-medium">
              <button type="button" disabled aria-label="Previous Page" className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 opacity-50 cursor-not-allowed">
                <ChevronLeft className="h-3.5 w-3.5" /> Prev
              </button>
              <span className="text-slate-500">Page 1 of 1</span>
              <button type="button" disabled aria-label="Next Page" className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 opacity-50 cursor-not-allowed">
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </nav>
          </footer>
        </section>

        {/* 3. DETAIL VIEW WITH CONTEXT RAIL SPLIT */}
        {/* We use keepMounted={false} to maintain complete HTML flatness on panel changes */}
        <Tabs.Panel value={selectedId} keepMounted={false} render={<div className="flex flex-1 overflow-hidden bg-white" />}>

          {/* Main Detail Core Window */}
          <article className="flex-1 overflow-y-auto p-8">
            <header className="border-b border-slate-200 pb-6 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-mono uppercase tracking-wider">
                <span>Workspace</span> / <span>Item View</span> / <span>{activeItem.id}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">{activeItem.title}</h1>
              <p className="text-sm text-slate-500">
                Assigned Owner: <span className="font-semibold text-slate-700">{activeItem.author}</span> • Published <time dateTime={activeItem.date}>{activeItem.date}</time>
              </p>
            </header>

            <div className="max-w-2xl text-slate-700 leading-relaxed space-y-4 text-sm">
              <p className="font-medium text-slate-900 border-l-2 border-blue-500 pl-3 bg-slate-50/50 py-2 rounded-r-md">
                {activeItem.summary}
              </p>
              <p>{activeItem.body}</p>
            </div>
          </article>

          {/* Context Rail / Utility Workspace Sidebars */}
          <aside className="w-56 border-l border-slate-200 bg-slate-50/70 p-4 space-y-6" aria-label="Contextual Tool Actions">
            <section className="space-y-2">
              <h3 className="text-xxs font-bold uppercase tracking-widest text-slate-400">Context Actions</h3>
              <button type="button" className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                Execute Process
              </button>
              <button type="button" className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50">
                Assign Ticket
              </button>

              {/* DESTRUCTIVE ACTION COMPONENT TREE */}
              <Dialog.Root>
                {/* Trigger button styled as a secondary destructive action */}
                <Dialog.Trigger render={
                  <button type="button" className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-xs transition-colors hover:bg-red-50 cursor-pointer">
                    Delete Item
                  </button>
                } />

                <Dialog.Portal>
                  {/* 1. Backdrop overlay covering the full workspace */}
                  <Dialog.Backdrop className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200" />

                  {/* 2. Traditional centered alert dialog window frame */}
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <Dialog.Popup
                      className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 ease-out"
                      render={<section aria-labelledby="delete-dialog-title" />}
                    >
                      {/* Header / Title block inside the modal */}
                      <header className="mb-4">
                        <Dialog.Title id="delete-dialog-title" className="text-base font-bold text-slate-900">
                          Confirm Deletion
                        </Dialog.Title>
                        <Dialog.Description className="mt-1 text-xs text-slate-500">
                          Are you sure you want to delete <span className="font-semibold text-slate-700">"{activeItem?.title}"</span>? This action is permanent and cannot be undone.
                        </Dialog.Description>
                      </header>

                      {/* Action buttons pinned horizontally at the bottom */}
                      <footer className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                        <Dialog.Close render={
                          <button type="button" className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
                            Cancel
                          </button>
                        } />

                        <button
                          type="button"
                          onClick={() => {
                            alert(`Item ${activeItem?.id} deleted.`);
                            // Trigger your React Query data mutation logic here
                          }}
                          className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-red-700 cursor-pointer"
                        >
                          Delete Permanently
                        </button>
                      </footer>
                    </Dialog.Popup>
                  </div>
                </Dialog.Portal>
              </Dialog.Root>
            </section>

            <section className="space-y-2">
              <h3 className="text-xxs font-bold uppercase tracking-widest text-slate-400">External Links</h3>
              <ul className="space-y-1.5">
                <li>
                  <a href={activeItem.referenceUrl} className="group flex items-center justify-between rounded-md p-1.5 text-xs text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 transition-colors">
                    <span className="flex items-center gap-2 truncate"><FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" /> System Docs</span>
                    <ExternalLink className="h-3 w-3 shrink-0 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              </ul>
            </section>
          </aside>
        </Tabs.Panel>
      </Tabs.Root>
    </div>);
}
