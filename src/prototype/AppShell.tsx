// Clickable shell of the UI-only prototype: it renders exactly one screen at a time
// and asks the caller to switch when the sidebar is used. No Storybook import, no
// router, no state and no persistence: `current` is a prop, `onNavigate` only
// requests a change, and each screen keeps rendering from its own fixtures.
import { useCallback, type ComponentType } from "react";
import { NavigationProvider } from "./NavigationProvider";
import { Asistencia } from "./screens/Asistencia";
import { Horarios } from "./screens/Horarios";
import { IndicadoresVentas } from "./screens/IndicadoresVentas";
import { Personal } from "./screens/Personal";

/** Screens the shell can show, one per accepted prototype frame. */
export type ScreenId = "indicadores" | "personal" | "horarios" | "asistencia";

/** Sidebar label of each screen, spelled as `MENTRA_SECTIONS` spells it. */
const SCREEN_LABEL: Record<ScreenId, string> = {
  indicadores: "Indicadores",
  personal: "Personal",
  horarios: "Horarios",
  asistencia: "Asistencia",
};

/** Every screen is a plain component that brings its own fixtures and its own chrome. */
const SCREEN_COMPONENT: Record<ScreenId, ComponentType> = {
  indicadores: IndicadoresVentas,
  personal: Personal,
  horarios: Horarios,
  asistencia: Asistencia,
};

/** Reverse map of the rail labels. Items missing here (`Dashboard`, reports, ...) have no frame. */
const SCREEN_OF_LABEL: Record<string, ScreenId> = Object.fromEntries(
  (Object.entries(SCREEN_LABEL) as [ScreenId, string][]).map(([id, label]) => [label, id]),
);

export type AppShellProps = {
  /** Screen to render. The shell owns no state, so this prop alone decides it. */
  current: ScreenId;
  /** Requests a screen change; items without a screen are ignored. */
  onNavigate: (screen: ScreenId) => void;
};

export function AppShell({ current, onNavigate }: AppShellProps) {
  const Screen = SCREEN_COMPONENT[current];

  // The screen's own `DashboardLayout` draws the single chrome of the frame; the
  // shell only hands it the navigation it should forward to the sidebar.
  const navigate = useCallback(
    (item: string) => {
      const target = SCREEN_OF_LABEL[item];
      if (target) onNavigate(target);
    },
    [onNavigate],
  );

  return (
    <div data-app-shell={current} className="h-full w-full">
      <NavigationProvider onNavigate={navigate}>
        <Screen />
      </NavigationProvider>
    </div>
  );
}
