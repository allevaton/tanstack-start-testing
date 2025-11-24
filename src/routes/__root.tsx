import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import appCss from '../styles.css?url';
import * as React from 'react';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { getLogger } from '@/lib/logging/logger.ts';
import { clientIdMiddleware } from '@/lib/client-info/client-id.middleware.ts';

type RootContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RootContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  beforeLoad: async () => {
    const logger = getLogger('__root.beforeLoad');
    logger.info('Setting a test context value');

    return {
      test: 'test',
    };
  },
  server: {
    middleware: [clientIdMiddleware],
  },

  shellComponent: RootDocument,
  notFoundComponent: () => <div className="m-16">Not Found</div>,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}

        <TanStackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: 'React Query',
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: 'SidelineSwap',
              render: <div>SidelineSwap Dev tool</div>,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
