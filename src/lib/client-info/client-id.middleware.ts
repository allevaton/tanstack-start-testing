import { createMiddleware } from '@tanstack/react-start';
import { getKnownCookie, setKnownCookie } from '@/lib/cookies/cookies.ts';
import { getLogger } from '@/lib/logging/logger.ts';

export const clientIdMiddleware = createMiddleware({ type: 'request' }).server(
  ({ next }) => {
    const logger = getLogger('clientIdMiddleware');

    const clientId = getKnownCookie('sls_client_id');
    if (clientId) {
      logger.debug(`Using existing client ID cookie: ${clientId}`);
    } else {
      const newClientId = crypto.randomUUID();
      setKnownCookie('sls_client_id', newClientId);
      logger.debug(`Set new client ID cookie: ${newClientId}`);
    }

    return next();
  },
);
