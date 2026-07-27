import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, createRoute, createRouter, redirect } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { RootLayout } from './routes/RootLayout';
import { ItemsIndexRoute } from './routes/ItemsIndexRoute';
import { ItemDetailRoute } from './routes/ItemDetailRoute';
import { CustomersIndexRoute } from './routes/CustomersIndexRoute';
import { CustomerDetailRoute } from './routes/CustomerDetailRoute';
import { workItemsQueryOptions } from './hooks/useWorkItems';
import { customersQueryOptions } from './hooks/useCustomers';

const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
});

const homeRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/items' });
  },
});

const itemsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/items',
  loader: ({ context }) => context.queryClient.ensureQueryData(workItemsQueryOptions),
  component: ItemsIndexRoute,
});

const itemDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/items/$id',
  loader: ({ context }) => context.queryClient.ensureQueryData(workItemsQueryOptions),
  component: ItemDetailRoute,
});

const customersIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers',
  loader: ({ context }) => context.queryClient.ensureQueryData(customersQueryOptions),
  component: CustomersIndexRoute,
});

const customerDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers/$id',
  loader: ({ context }) => context.queryClient.ensureQueryData(customersQueryOptions),
  component: CustomerDetailRoute,
});

const routeTree = rootRoute.addChildren([
  homeRedirectRoute,
  itemsIndexRoute,
  itemDetailRoute,
  customersIndexRoute,
  customerDetailRoute,
]);

export function createAppRouter(queryClient: QueryClient) {
  return createRouter({
    routeTree,
    context: { queryClient },
    defaultPendingComponent: () => (
      <div className="flex flex-1 items-center justify-center text-sm text-slate-500" role="status" aria-live="polite">
        <Loader2 className="h-5 w-5 animate-spin text-blue-500" aria-hidden="true" />
        <span className="sr-only">Loading…</span>
      </div>
    ),
    // Mock fetches take 800ms; show the pending state well before that so a
    // navigation never looks like a dead click on the still-visible old page.
    defaultPendingMs: 200,
    defaultPendingMinMs: 300,
    defaultNotFoundComponent: () => (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-sm text-slate-500">
        <p className="text-base font-semibold text-slate-700">Page not found</p>
        <p>The page you're looking for doesn't exist.</p>
      </div>
    ),
  });
}

export type AppRouter = ReturnType<typeof createAppRouter>;

declare module '@tanstack/react-router' {
  interface Register {
    router: AppRouter;
  }
}
