import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { AppShell, type ScreenId } from '../../prototype/AppShell';

const meta = {
  title: 'Pages/00 · Dashboard · App Shell',
  component: AppShell,
  parameters: { layout: 'fullscreen' },
  args: { current: 'indicadores', onNavigate: () => {} },
  render: () => <ShellHarness />
} satisfies Meta<typeof AppShell>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The story owns the shell state, because `AppShell` is controlled: it renders the
 * screen it is given and only asks the caller to switch, exactly as the app would.
 */
function ShellHarness() {
  const [screen, setScreen] = useState<ScreenId>('indicadores');

  return (
    <div className="h-[1180px] w-[1440px] bg-(--color-bg-canvas)">
      <AppShell current={screen} onNavigate={setScreen} />
    </div>
  );
}

function screen(canvasElement: HTMLElement): HTMLElement {
  const root = canvasElement.firstElementChild;
  expect(root).not.toBeNull();
  return root as HTMLElement;
}

/** The shell root inside the 1440x1180 wrapper: the only element carrying `data-app-shell`. */
function shell(canvasElement: HTMLElement): HTMLElement {
  const root = screen(canvasElement).querySelector('[data-app-shell]');
  expect(root).not.toBeNull();
  return root as HTMLElement;
}

/**
 * Chrome of one frame: one layout root, one rail and one topbar. `Personal`,
 * `Horarios` and `Asistencia` also draw a `PageHeader` inside the content slot, so
 * the topbar is identified by its date-range control and not by the `header` tag.
 */
function expectSingleChrome(content: HTMLElement) {
  expect(content.querySelectorAll('[data-dashboard-layout]')).toHaveLength(1);
  expect(content.querySelectorAll('aside')).toHaveLength(1);
  expect(
    [...content.querySelectorAll('header')].filter(
      (header) => header.querySelector('button[aria-label^="Rango de fechas: "]') !== null
    )
  ).toHaveLength(1);
  expect(content.querySelectorAll('button[aria-label="Asistente IA"]')).toHaveLength(1);
}

export const Default: Story = {
  play: async ({ canvasElement, parameters }) => {
    // Layout guard: `sb-main-fullscreen` is unreachable in this runner, so the resolved
    // parameter is asserted from the story context and a typo still fails.
    expect(parameters.layout).toBe('fullscreen');

    const content = screen(canvasElement);

    // The shell opens on the first screen and lets that screen draw its own chrome.
    expect(shell(canvasElement).getAttribute('data-app-shell')).toBe('indicadores');
    expect(content.textContent).toContain('Indicadores · Ventas');
    expect(content.textContent).toContain('S/ 82 450');
    expect(content.textContent).toContain('Evolución de ventas');

    const current = content.querySelectorAll('[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0].textContent).toBe('Indicadores');
    expectSingleChrome(content);
  }
};

export const Navigation: Story = {
  play: async ({ canvasElement, parameters }) => {
    // Layout guard: `sb-main-fullscreen` is unreachable in this runner, so the resolved
    // parameter is asserted from the story context and a typo still fails.
    expect(parameters.layout).toBe('fullscreen');

    const content = screen(canvasElement);
    const user = userEvent.setup();

    await user.click(within(content).getByRole('button', { name: 'Personal' }));
    expect(shell(canvasElement).getAttribute('data-app-shell')).toBe('personal');
    expect(content.textContent).toContain('RRHH / Personal');
    expect(content.textContent).toContain('Lista de colaboradores');
    // The screen that left the stage takes its own content with it.
    expect(content.textContent).not.toContain('Evolución de ventas');
    // The Personal frame names its own module in the topbar.
    expect(content.querySelector('header')?.textContent ?? '').toContain('Personal');
    // The screen brings its own chrome; the shell adds none of it.
    expectSingleChrome(content);
    expect(within(content).getByRole('button', { name: 'Personal' }).getAttribute('aria-current')).toBe('page');

    await user.click(within(content).getByRole('button', { name: 'Horarios' }));
    expect(shell(canvasElement).getAttribute('data-app-shell')).toBe('horarios');
    expect(content.textContent).toContain('RRHH / Horarios');
    expect(content.textContent).toContain('Semana 24 – 30 de marzo 2025 · 10 de 17 colaboradores');
    expect(content.textContent).not.toContain('Lista de colaboradores');
    expect(content.querySelector('header')?.textContent ?? '').toContain('Horarios · Planificación semanal');
    expectSingleChrome(content);
    expect(within(content).getByRole('button', { name: 'Horarios' }).getAttribute('aria-current')).toBe('page');
    expect(within(content).getByRole('button', { name: 'Personal' }).getAttribute('aria-current')).toBeNull();

    // `Dashboard` has no frame in this prototype, so it is a no-op, not a blank shell.
    await user.click(within(content).getByRole('button', { name: 'Dashboard' }));
    expect(shell(canvasElement).getAttribute('data-app-shell')).toBe('horarios');
    expect(content.textContent).toContain('RRHH / Horarios');
    expectSingleChrome(content);

    // Return leg: the rail goes back to the frame the shell opened on.
    await user.click(within(content).getByRole('button', { name: 'Indicadores' }));
    expect(shell(canvasElement).getAttribute('data-app-shell')).toBe('indicadores');
    expect(content.textContent).toContain('Indicadores · Ventas');
    expect(content.textContent).toContain('Evolución de ventas');
    // The frame it left behind is gone, chrome included.
    expect(content.textContent).not.toContain('RRHH / Horarios');
    expect(within(content).getByRole('button', { name: 'Indicadores' }).getAttribute('aria-current')).toBe('page');
    expect(within(content).getByRole('button', { name: 'Horarios' }).getAttribute('aria-current')).toBeNull();
    expectSingleChrome(content);
  }
};
