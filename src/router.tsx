import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { QueryClient } from '@tanstack/react-query';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import * as qs from 'qs';

export function getRouter() {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    context: {
      queryClient,
    },
    parseSearch: (searchStr) => qs.parse(searchStr, {}),
    stringifySearch: (search) =>
      qs.stringify(search, {
        addQueryPrefix: true,
        arrayFormat: 'brackets',
        skipNulls: true,
      }),
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}
