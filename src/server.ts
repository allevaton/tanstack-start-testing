import handler, { type ServerEntry } from '@tanstack/react-start/server-entry';

type RequestContext = {
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
    request.headers.set('x-request-id', requestId);

    return handler.fetch(request, {
      context: {
        requestId,
      },
    });
  },
} satisfies ServerEntry;
