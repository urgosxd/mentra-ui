import { useEffect, type ReactNode } from 'react';

/**
 * Dark stories must flip the semantic attribute on the document root, not on a
 * wrapper element: Radix portals popover content to document.body, so a wrapper
 * would re-theme the trigger while leaving the portaled calendar in light mode.
 */
export function SemanticTheme({ dark, children }: { dark: boolean; children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    if (!dark) return;
    root.setAttribute('data-semantic', 'dark');
    return () => root.removeAttribute('data-semantic');
  }, [dark]);

  if (!dark) return <>{children}</>;
  return <div style={{ background: 'var(--color-bg-canvas)', padding: 24 }}>{children}</div>;
}
