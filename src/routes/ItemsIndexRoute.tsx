import { useEffect, useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useWorkItems } from '../hooks/useWorkItems';

const statusBadgeClass: Record<string, string> = {
  Completed: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  Reviewed: 'bg-amber-50 border-amber-200 text-amber-700',
  'In Progress': 'bg-blue-50 border-blue-200 text-blue-700',
};

export function ItemsIndexRoute() {
  const { data: items } = useWorkItems();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the page heading on route entry so screen reader users
  // get an announcement after a client-side navigation (e.g. post-delete redirect).
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      <header className="border-b border-slate-200 px-8 py-6">
        <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold tracking-tight text-slate-900 outline-none">
          Work Items
        </h1>
        <p className="text-sm text-slate-500 mt-1">Browse all items. Select one to open its detail view.</p>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <table className="w-full text-left text-sm border-collapse">
          <caption className="sr-only">Work items</caption>
          <thead>
            <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th scope="col" className="py-2 pr-4 font-semibold">Title</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Status</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Author</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <th scope="row" className="py-3 pr-4 font-semibold text-slate-900">
                  <Link
                    to="/items/$id"
                    params={{ id: item.id }}
                    preload="intent"
                    className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 rounded-sm"
                  >
                    {item.title}
                  </Link>
                </th>
                <td className="py-3 pr-4">
                  <span className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-xxs font-medium border ${statusBadgeClass[item.status]}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-slate-600">{item.author}</td>
                <td className="py-3 pr-4 text-slate-500">
                  <time dateTime={item.date}>{item.date}</time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex h-12 shrink-0 items-center justify-between border-t border-slate-200 px-8 bg-slate-50">
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
    </div>
  );
}
