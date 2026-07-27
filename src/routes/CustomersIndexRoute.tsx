import { useEffect, useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCustomers } from '../hooks/useCustomers';

const statusBadgeClass: Record<string, string> = {
  Active: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  Prospect: 'bg-blue-50 border-blue-200 text-blue-700',
  Inactive: 'bg-slate-100 border-slate-200 text-slate-500',
};

export function CustomersIndexRoute() {
  const { data: customers } = useCustomers();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      <header className="border-b border-slate-200 px-8 py-6">
        <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold tracking-tight text-slate-900 outline-none">
          Customers
        </h1>
        <p className="text-sm text-slate-500 mt-1">Browse all customers. Select one to open its detail view.</p>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <table className="w-full text-left text-sm border-collapse">
          <caption className="sr-only">Customers</caption>
          <thead>
            <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th scope="col" className="py-2 pr-4 font-semibold">Name</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Company</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Status</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Customer Since</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                <th scope="row" className="py-3 pr-4 font-semibold text-slate-900">
                  <Link
                    to="/customers/$id"
                    params={{ id: customer.id }}
                    preload="intent"
                    className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 rounded-sm"
                  >
                    {customer.name}
                  </Link>
                </th>
                <td className="py-3 pr-4 text-slate-600">{customer.company}</td>
                <td className="py-3 pr-4">
                  <span className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-xxs font-medium border ${statusBadgeClass[customer.status]}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-slate-500">
                  <time dateTime={customer.joinedDate}>{customer.joinedDate}</time>
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
