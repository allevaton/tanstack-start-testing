import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/start-server-core';
import { getKnownCookie } from '@/lib/cookies/cookies.ts';

export interface ClientInfo {
  clientId: string;
  requestId?: string;
  userAgent: string;
}

function createServerSideClientInfo(request: Request): ClientInfo {
  const clientInfo: ClientInfo = {
    clientId: getKnownCookie('sls_client_id') || 'unknown',
    requestId: request.headers.get('x-request-id') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
  };

  return clientInfo;
}

export const getClientInfo = createIsomorphicFn()
  .server((request?: Request) =>
    createServerSideClientInfo(request || getRequest()),
  )
  .client(() => {
    const clientInfo: ClientInfo = {
      clientId: getKnownCookie('sls_client_id') || 'unknown',
      userAgent: navigator.userAgent,
    };

    return clientInfo;
  });
