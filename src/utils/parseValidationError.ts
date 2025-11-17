import { $ZodIssue } from 'zod/v4/core';

export function parseValidationError(e: unknown): $ZodIssue[] | null {
  try {
    const json = JSON.parse((e as any).message);
    if (Array.isArray(json) && 'origin' in json?.[0] && json?.[0]?.message) {
      return json;
    }
  } catch (e) {}

  return null;
}
