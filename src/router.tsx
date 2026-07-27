import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, createRoute, createRouter, redirect } from '@tanstack/react-router';
import { RootLayout } from './routes/RootLayout';
import { ItemsIndexRoute } from './routes/ItemsIndexRoute';
import { ItemDetailRoute } from './routes/ItemDetailRoute';
import { workItemsQueryOptions } from './hooks/useWorkItems';

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

const routeTree = rootRoute.addChildren([homeRedirectRoute, itemsIndexRoute, itemDetailRoute]);

export function createAppRouter(queryClient: QueryClient) {
  return createRouter({ routeTree, context: { queryClient } });
}

export type AppRouter = ReturnType<typeof createAppRouter>;

declare module '@tanstack/react-router' {
  interface Register {
    router: AppRouter;
  }
}
