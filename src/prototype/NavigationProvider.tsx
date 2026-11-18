// Provider half of the navigation port. A component-only module, so the layout that
// consumes it keeps its Fast Refresh boundary while `navigation.ts` keeps the hook.
import type { ReactNode } from "react";
import { NavigationContext } from "./navigation";

/** Installs the navigation the screens' own layouts forward to the sidebar. */
export function NavigationProvider({
  onNavigate,
  children,
}: {
  onNavigate: (item: string) => void;
  children?: ReactNode;
}) {
  return <NavigationContext.Provider value={onNavigate}>{children}</NavigationContext.Provider>;
}
