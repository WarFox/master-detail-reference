import { useEffect, useRef, useState } from 'react';
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Dialog } from '@base-ui/react/dialog';
import { Toast } from '@base-ui/react/toast';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { IconTooltip } from '../components/IconTooltip';
import { MasterDetailShell } from '../components/MasterDetailShell';
import { useWorkItems } from '../hooks/useWorkItems';

const itemRoute = getRouteApi('/items/$id');

const statusBadgeClass: Record<string, string> = {
  Completed: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  Reviewed: 'bg-amber-50 border-amber-200 text-amber-700',
  'In Progress': 'bg-blue-50 border-blue-200 text-blue-700',
};

export function ItemDetailRoute() {
  const { id } = itemRoute.useParams();
  const navigate = useNavigate();
  const toastManager = Toast.useToastManager();

  const [searchQuery, setSearchQuery] = useState('');
  const listScrollRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const { data: items } = useWorkItems();

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeItem = items.find((item) => item.id === id);

  const virtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => listScrollRef.current,
    estimateSize: () => 92,
    overscan: 8,
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  const handleDeleteConfirm = () => {
    navigate({ to: '/items' });
    toastManager.add({
      title: 'Item deleted',
      description: activeItem ? `"${activeItem.title}" was deleted.` : undefined,
      timeout: 4000,
    });
  };

  if (!activeItem) {
    return <div className="flex flex-1 items-center justify-center text-sm text-slate-500">Item not found.</div>;
  }

  return (
    <MasterDetailShell
      masterListHeading="Item Workspace List"
      detailKey={activeItem.id}
      contextRailHeading="Contextual Tool Actions"
      masterList={
        <>
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

            <IconTooltip label="Filters">
              <button type="button" aria-label="Filters" className="rounded-md border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 transition-colors">
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </IconTooltip>
          </header>

          <nav aria-label="Select Work Item" className="flex-1 overflow-y-auto p-3" ref={listScrollRef}>
            {filteredItems.length > 0 ? (
              <ul className="relative" style={{ height: virtualizer.getTotalSize() }}>
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const item = filteredItems[virtualRow.index];
                  const isActive = item.id === id;
                  return (
                    <li
                      key={item.id}
                      ref={virtualizer.measureElement}
                      data-index={virtualRow.index}
                      className="absolute top-0 left-0 w-full pb-2"
                      style={{ transform: `translateY(${virtualRow.start}px)` }}
                    >
                      <Link
                        to="/items/$id"
                        params={{ id: item.id }}
                        preload="intent"
                        aria-current={isActive ? 'page' : undefined}
                        className="group relative flex flex-col items-start gap-1 rounded-lg border border-transparent bg-white p-4 text-left shadow-xs transition-all hover:border-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 aria-[current=page]:border-blue-500 aria-[current=page]:bg-blue-50/50 aria-[current=page]:shadow-none"
                      >
                        <div className="flex w-full items-center justify-between gap-2">
                          <h3 className="font-semibold text-sm text-slate-900 group-aria-[current=page]:text-blue-900">{item.title}</h3>
                          <span className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-xxs font-medium border ${statusBadgeClass[item.status]}`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.summary}</p>
                        <time className="mt-1 text-xxs text-slate-400" dateTime={item.date}>{item.date}</time>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-8 text-center text-sm text-slate-500">No items match criteria.</div>
            )}
          </nav>

          <footer className="flex h-12 shrink-0 items-center justify-between border-t border-slate-200 px-4 bg-slate-50">
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
        </>
      }
      detail={
        <>
          <header className="border-b border-slate-200 pb-6 mb-6">
            <nav aria-label="Breadcrumb" className="mb-2">
              <ol className="flex items-center gap-2 text-xs text-slate-400 font-mono uppercase tracking-wider">
                <li>
                  <Link to="/items" className="hover:text-slate-600 hover:underline">Work Items</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">{activeItem.id}</li>
              </ol>
            </nav>
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
        </>
      }
      contextRail={
        <>
          <section className="space-y-2">
            <h3 className="text-xxs font-bold uppercase tracking-widest text-slate-400">Context Actions</h3>
            <button type="button" className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              Execute Process
            </button>
            <button type="button" className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50">
              Assign Ticket
            </button>

            <Dialog.Root>
              <Dialog.Trigger render={
                <button type="button" className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-xs transition-colors hover:bg-red-50 cursor-pointer">
                  Delete Item
                </button>
              } />

              <Dialog.Portal>
                <Dialog.Backdrop className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200" />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <Dialog.Popup
                    className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 ease-out"
                    render={<section aria-labelledby="delete-dialog-title" />}
                  >
                    <header className="mb-4">
                      <Dialog.Title id="delete-dialog-title" className="text-base font-bold text-slate-900">
                        Confirm Deletion
                      </Dialog.Title>
                      <Dialog.Description className="mt-1 text-xs text-slate-500">
                        Are you sure you want to delete <span className="font-semibold text-slate-700">"{activeItem.title}"</span>? This action is permanent and cannot be undone.
                      </Dialog.Description>
                    </header>

                    <footer className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                      <Dialog.Close render={
                        <button type="button" className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
                          Cancel
                        </button>
                      } />

                      <Dialog.Close render={
                        <button
                          type="button"
                          onClick={handleDeleteConfirm}
                          className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-red-700 cursor-pointer"
                        >
                          Delete Permanently
                        </button>
                      } />
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
        </>
      }
    />
  );
}
