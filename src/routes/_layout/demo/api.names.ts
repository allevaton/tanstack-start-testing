import { createFileRoute } from '@tanstack/react-router';
import { json } from '@tanstack/react-start';
import { getRequest } from '@tanstack/start-server-core';

export const Route = createFileRoute('/_layout/demo/api/names')({
  server: {
    handlers: {
      GET: async () => {
        return json(['Alice', 'Bob', 'Charlie']);
      },
    },
  },
});
