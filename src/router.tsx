import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { RootLayout } from './routes/RootLayout';
import { ItemsIndexRoute } from './routes/ItemsIndexRoute';
import { ItemDetailRoute } from './routes/ItemDetailRoute';

const rootRoute = createRootRoute({
  component: RootLayout,
});

const itemsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ItemsIndexRoute,
});

const itemDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/items/$id',
  component: ItemDetailRoute,
});

const routeTree = rootRoute.addChildren([itemsIndexRoute, itemDetailRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
