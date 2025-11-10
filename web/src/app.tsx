import './styles.css';

import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './route-tree.gen';
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx';
import * as AuthContext from './auth.tsx';

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
    auth: undefined!,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

export function App() {
  const auth = AuthContext.getContext();

  return <RouterProvider router={router} context={{ auth }} />;
}
