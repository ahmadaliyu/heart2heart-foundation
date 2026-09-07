/**
 * Tiny dot-path translator shared by server components and the client provider.
 *
 * Deliberately not a dependency: the platform needs message lookup, plural-free
 * interpolation and a hard guarantee that a missing key is visible in
 * development. Everything else i18n libraries provide is unused here.
 */

export type Messages = Record<string, unknown>;

function lookup(messages: Messages, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, part) =>
        acc && typeof acc === "object" ? (acc as Record<string, unknown>)[part] : undefined,
      messages,
    );
}

export interface Translator {
  /** Returns the string at `path`. Interpolates {name} style placeholders. */
  (path: string, vars?: Record<string, string | number>): string;
  /** Returns an array value — for the many list-shaped sections in the copy. */
  list: <T = string>(path: string) => T[];
  /** Returns an object value, e.g. a whole enum map. */
  object: <T = Record<string, string>>(path: string) => T;
  /** True when the key exists. Useful for optional copy. */
  has: (path: string) => boolean;
}

export function createTranslator(messages: Messages): Translator {
  const t = ((path: string, vars?: Record<string, string | number>) => {
    const value = lookup(messages, path);

    if (typeof value !== "string") {
      if (process.env.NODE_ENV !== "production") {
        // Loud in development, harmless in production: showing the key beats
        // showing an empty space where a safeguarding notice should be.
        console.warn(`[i18n] missing or non-string message: "${path}"`);
      }
      return path;
    }

    if (!vars) return value;
    return value.replace(/\{(\w+)\}/g, (match, key: string) =>
      key in vars ? String(vars[key]) : match,
    );
  }) as Translator;

  t.list = <T,>(path: string): T[] => {
    const value = lookup(messages, path);
    return Array.isArray(value) ? (value as T[]) : [];
  };

  t.object = <T,>(path: string): T => {
    const value = lookup(messages, path);
    return (value && typeof value === "object" ? value : {}) as T;
  };

  t.has = (path: string) => lookup(messages, path) !== undefined;

  return t;
}
