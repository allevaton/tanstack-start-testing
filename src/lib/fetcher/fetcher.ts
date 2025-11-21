import { getClientInfo } from '@/lib/client-info/client-info.ts';
import { getLogger } from '@/lib/logging/logger.ts';
import ky, { isHTTPError } from 'ky';

interface FetcherOptions {
  json?: Record<string, any>;
  body?: BodyInit;
  method?: 'get' | 'post' | 'put' | 'delete';
  headers?: HeadersInit;
  params?: Record<string, any>;
}

export interface ApiResponse<T, M extends unknown = unknown> {
  data: T;
  meta?: M;
}

interface StandardizedErrorDetail {
  code?: string;
  field?: string;
  message: string;
}

interface ApiErrorResponse<M = unknown> {
  errors: {
    code?: string;
    detail?: string;
    field?: string;
    message?: string;
  }[];
  meta?: M;
}

interface FetcherErrorResult<M> {
  ok: false;
  data?: undefined;
  errors: StandardizedErrorDetail[];
  meta?: M;
  status: number;
}

interface FetcherSuccessResult<T, M> {
  ok: true;
  errors?: undefined;
  data: T extends ApiResponse<any> ? T['data'] : T;
  meta?: M;
  status: number;
}

type FetcherResult<T, M = unknown, E = ApiErrorResponse> =
  | FetcherErrorResult<E>
  | FetcherSuccessResult<T, M>;

const defaultOptions: FetcherOptions = {
  method: 'get',
};

export async function fetcher<
  T extends ApiResponse<any, any>,
  E extends ApiErrorResponse = ApiErrorResponse,
>(url: string, options?: FetcherOptions): Promise<FetcherResult<T, E>> {
  const clientInfo = getClientInfo();
  const logger = getLogger('Fetcher');

  const headers = new Headers(options?.headers || {});
  headers.set('x-session-id', clientInfo.clientId);
  headers.set('user-agent', clientInfo.userAgent);

  // On server, apply relevant request headers
  if (typeof window === 'undefined') {
    headers.set('user-agent', 'react-server - ' + clientInfo.userAgent);
  }

  try {
    const response = await ky<T>(url, {
      headers,
      method: options?.method || defaultOptions.method,
      prefixUrl: process.env.API_URL,
      searchParams: options?.params,
      json: options?.body,
    });

    const jsonResponse = await response.json<T>();
    return {
      data: jsonResponse?.data?.data || jsonResponse?.data || ({} as T['data']),
      meta: jsonResponse?.meta,
      ok: true,
      status: response.status,
    };
  } catch (e) {
    if (isHTTPError(e)) {
      logger.error(
        `HTTP Error: ${e.response.status} ${e.response.statusText} - ${url}`,
      );
      const errorBody = await e.response.json<E>();

      let errors: StandardizedErrorDetail[] = [];
      if (
        errorBody &&
        'errors' in errorBody &&
        Array.isArray(errorBody.errors)
      ) {
        errors = errorBody.errors.map((error) => ({
          code: error.code,
          field: error.field,
          message: error.message || error.detail || 'Something went wrong...',
        }));
      } else {
        errors = [{ message: 'Something went wrong...' }];
      }

      return {
        errors,
        ok: false,
        status: e.response.status,
      };
    } else {
      logger.error(`Error fetching data from ${url}: ${e}`);
      return {
        errors: [{ message: 'Something went wrong...' }],
        ok: false,
        status: 500,
      };
    }
  }
}
