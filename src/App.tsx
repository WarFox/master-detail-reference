import React, { useState } from 'react';
import { Tabs } from '@base-ui/react/tabs';
import {
  LayoutDashboard,
  Layers,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText
} from 'lucide-react';
import { mockItems, type WorkItem } from './mockData';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>(mockItems[0].id);

  // Filter items based on the toolbar search input
  const filteredItems = mockItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Find currently active item object for contextual rendering
  const activeItem = mockItems.find(item => item.id === selectedId) || mockItems[0];

  return (
    // Main App Container Frame
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans antialiased">

      {/* 1. SIDEBAR: Navigation Panel */}
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
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          v2.4.0 Engine
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

          {/* Top Toolbar */}
          <header className="flex h-14 items-center justify-between gap-3 border-b border-slate-200 px-4 bg-slate-50">
            <search className="flex-1">
              <form onSubmit={(e) => e.preventDefault()} className="relative">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  placeholder="Filter items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white py-1.5 pr-3 pl-9 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </form>
            </search>
            <button type="button" aria-label="Filters" className="rounded-md border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 transition-colors">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </header>

          {/* The Live Interactive Scroll List Panel */}
          <Tabs.List render={<div className="flex-1 overflow-y-auto p-3 space-y-1 bg-slate-50/50" aria-label="Select Work Item" />}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <Tabs.Tab
                  key={item.id}
                  value={item.id}
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
