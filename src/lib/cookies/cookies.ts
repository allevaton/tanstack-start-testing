import { createIsomorphicFn } from '@tanstack/react-start';
import {
  deleteCookie,
  getCookie,
  getCookies,
  getRequest,
  getRequestHeader,
  setCookie,
} from '@tanstack/start-server-core';
import * as cookie from 'cookie';

interface KnownCookies {
  sls_client_id?: string;
}

const _getCookies = createIsomorphicFn()
  .server(() => getCookies())
  .client(() => cookie.parse(document.cookie));

const _getCookie = createIsomorphicFn()
  .server((name: string) => getCookie(name))
  .client((name: string) => _getCookies()[name]);

const _setCookie = createIsomorphicFn()
  .server((name: string, value: any, options?: cookie.SerializeOptions) => {
    setCookie(name, value, options);

    // Mutate request headers so subsequent reads will see the updated cookie
    getRequest().headers.set(
      'cookie',
      getRequestHeader('cookie') || '' + `; ${name}=${value}`,
    );
  })
  .client((name: string, value: any, options?: cookie.SerializeOptions) => {
    document.cookie = cookie.serialize(name, value, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      ...options,
    });
  });

const _deleteCookie = createIsomorphicFn()
  .server((name: string) => {
    deleteCookie(name);

    // Mutate request headers so subsequent reads will see the updated cookie
    getRequest().headers.set(
      'cookie',
      getRequestHeader('cookie') || '' + `; ${name}=;`,
    );
  })
  .client((name: string) => {
    document.cookie = cookie.serialize(name, '', {
      path: '/',
      maxAge: 0,
    });
  });

export function getKnownCookies(): KnownCookies {
  return _getCookies();
}

export function getKnownCookie<T extends keyof KnownCookies>(
  name: T,
): KnownCookies[T] {
  return _getCookie(name);
}

export function setKnownCookie<T extends keyof KnownCookies>(
  name: T,
  value: string,
  options?: cookie.SerializeOptions,
) {
  _setCookie(name, value, options);
}

export function deleteKnownCookie<T extends keyof KnownCookies>(name: T) {
  _deleteCookie(name);
}
