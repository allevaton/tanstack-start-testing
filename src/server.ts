import handler, { type ServerEntry } from '@tanstack/react-start/server-entry';
import { createLogger, Logger } from '@/lib/logging/logger.ts';
import {
  ClientInfo,
  createServerSideClientInfo,
} from '@/lib/client-info/client-info.ts';

type RequestContext = {
  clientInfo: ClientInfo;
  logger: Logger;
  requestId: string;
};

declare module '@tanstack/react-start' {
  interface Register {
    server: {
      requestContext: RequestContext;
    };
  }
}

export default {
  async fetch(request) {
    const requestId = crypto.randomUUID();
    const logger = createLogger(request, requestId);
    const clientInfo = createServerSideClientInfo(request);

    request.headers.set('x-request-id', requestId);

    logger.http('Request received', { url: request.url });

    return handler.fetch(request, {
      context: {
        clientInfo,
        requestId,
        logger,
      },
    });
  },
} satisfies ServerEntry;
