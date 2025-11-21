import fs from 'node:fs';
import crypto from 'node:crypto';
import { useState } from 'react';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { XIcon } from 'lucide-react';
import { z } from 'zod';
import { parseValidationError } from '@/utils/parseValidationError.ts';
import { ApiResponse, fetcher } from '@/lib/fetcher/fetcher.ts';
import { getClientInfo } from '@/lib/client-info/client-info.ts';
import { getLogger } from '@/lib/logging/logger.ts';

/*
const loggingMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    console.log("Request:", request.url);
    return next();
  }
);
const loggedServerFunction = createServerFn({ method: "GET" }).middleware([
  loggingMiddleware,
]);
*/

const TODOS_FILE = 'todos.json';

async function readTodos() {
  return JSON.parse(
    await fs.promises.readFile(TODOS_FILE, 'utf-8').catch(() =>
      JSON.stringify(
        [
          { id: crypto.randomUUID(), name: 'Get groceries' },
          { id: crypto.randomUUID(), name: 'Buy a new phone' },
        ],
        null,
        2,
      ),
    ),
  ) as { id: string; name: string }[];
}

const getTodos = createServerFn({
  method: 'GET',
}).handler(async () => {
  const clientInfo = getClientInfo();
  const logger = getLogger('getTodos');
  logger.info('Fetching todos from server');
  logger.info('Client info', clientInfo);
  return await readTodos();
});

const addTodo = createServerFn({ method: 'POST' })
  .inputValidator(z.string().min(3, 'Todo must be at least 3 characters long.'))
  .handler(async ({ data }) => {
    const todos = await readTodos();
    todos.push({ id: crypto.randomUUID(), name: data });
    await fs.promises.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2));
    return todos;
  });

const removeTodo = createServerFn({ method: 'POST' })
  .inputValidator(z.string())
  .handler(async ({ data }) => {
    const todos = await readTodos();
    const index = todos.findIndex((t) => t.id === data);
    todos.splice(index, 1);
    await fs.promises.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2));
    return todos;
  });

export const Route = createFileRoute('/_layout/demo/start/server-funcs')({
  component: Home,
  validateSearch: z.object({ test: z.string().optional() }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, location, deps: { test } }) => {
    const logger = getLogger('server-funcs.loader');
    logger.info(`Full context object: ${JSON.stringify(context, null, 2)}`);

    if (test == '1') {
      logger.info('Test search param is 1');
      throw redirect({
        search: {},
      });
    }

    const [todos, facetResponse] = await Promise.all([
      getTodos(),
      fetcher<ApiResponse<{ id: number; name: string }[]>>(
        'https://api.staging.sidelineswap.com/v1/facet_items',
      ),
    ]);

    return {
      todos,
      items: facetResponse.data || [],
    };
  },
  staleTime: 10_000,
});

function Home() {
  const router = useRouter();
  let { todos } = Route.useLoaderData();

  const search = Route.useSearch();

  const [todo, setTodo] = useState('');
  const [error, setError] = useState('');

  async function createTodo() {
    try {
      todos = await addTodo({ data: todo });
      setTodo('');
      router.invalidate();
    } catch (e) {
      const err = parseValidationError(e);
      if (err) {
        setError(err[0].message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  }

  async function removeTodoAtIndex(id: string) {
    try {
      todos = await removeTodo({ data: id });
      setTodo('');
      router.invalidate();
    } catch (e) {
      const err = parseValidationError(e);
      if (err) {
        setError(err[0].message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-800 to-black p-4 text-white"
      style={{
        backgroundImage:
          'radial-gradient(50% 50% at 20% 60%, #23272a 0%, #18181b 50%, #000000 100%)',
      }}
    >
      <Route.Link search={{ test: '1' }}>Test</Route.Link>

      <div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
        <h1 className="text-2xl mb-4">Start Server Functions - Todo Example</h1>
        <ul className="mb-4 space-y-2">
          {todos?.map((t) => (
            <li
              key={t.id}
              className="bg-white/10 border border-white/20 rounded-lg p-3 backdrop-blur-sm shadow-md flex justify-between items-center"
            >
              <span className="text-lg text-white">{t.name}</span>
              <button
                onClick={() => removeTodoAtIndex(t.id)}
                className="text-red-500 py-2 px-4"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={todo}
            onChange={(e) => {
              setTodo(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                createTodo();
              }
            }}
            placeholder="Enter a new todo..."
            className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <button
            disabled={todo.trim().length === 0}
            onClick={createTodo}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Add todo
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
