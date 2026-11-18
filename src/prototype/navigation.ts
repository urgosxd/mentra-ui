// Navigation port of the prototype: the sidebar handler a shell hands down to the
// screens' own layouts. It lives apart from `NavigationProvider` and from
// `DashboardLayout` so every module exports a single kind of value.
import { createContext, useContext } from "react";

/**
 * Sidebar navigation inherited from an outer shell. With no provider in the tree
 * the value is `null`, so a standalone screen keeps using its own `onNavSelect`.
 */
export const NavigationContext = createContext<((item: string) => void) | null>(null);

/** Effective sidebar handler: an explicit `onNavSelect` always wins over the shell. */
export function useShellNavigate(): ((item: string) => void) | undefined {
  return useContext(NavigationContext) ?? undefined;
}
