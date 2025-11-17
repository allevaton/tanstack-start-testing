import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/start-server-core';

export interface ClientInfo {
  clientId: string;
  userAgent: string;
}

export function createServerSideClientInfo(request: Request): ClientInfo {
  const clientInfo: ClientInfo = {
    clientId: request.headers.get('x-client-id') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
  };

  return clientInfo;
}

export const getClientInfo = createIsomorphicFn()
  .server(() => createServerSideClientInfo(getRequest()))
  .client(() => {
    const clientInfo: ClientInfo = {
      clientId: 'unknown',
      userAgent: navigator.userAgent,
    };

    return clientInfo;
  });
