import { getClientInfo } from '@/lib/client-info/client-info.ts';

interface FetcherOptions {
  headers?: HeadersInit;
}

export function fetcher(url: string, options?: FetcherOptions) {
  const clientInfo = getClientInfo();

  const headers = new Headers(options?.headers || {});
  headers.set('x-session-id', clientInfo.clientId);
  headers.set('user-agent', 'react-server - ' + clientInfo.userAgent);

  const fetchOptions = {
    method: 'GET',
    headers,
  };

  return fetch(url, fetchOptions);
}
