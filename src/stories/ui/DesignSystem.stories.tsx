import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import designSystemCss from '../../styles/design-system.css?raw';
import { Button } from '../generated/Button';

const meta = {
  title: 'UI/DesignSystem',
  render: () => <Button style="Primary" />
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function cssVar(name: string, el: HTMLElement = document.documentElement): string {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

// The variant stories assert visible labels only, so they stay green even if the
// token layer breaks. This story is the guard for the pipeline itself: Tailwind
// compiled, tokens loaded, the dark block overriding, and the import order that
// keeps unlayered tokens winning over Tailwind's @layer theme.
export const TokenPipeline: Story = {
  play: async ({ canvasElement }) => {
    // 1. tokens.css must define the semantic token (import order guard).
    expect(cssVar('--color-bg-brand')).not.toBe('');
    // 2. the arbitrary-value utility must resolve it (not `transparent`).
    const root = canvasElement.querySelector('[data-style]') as HTMLElement;
    expect(getComputedStyle(root).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    // 3. [data-semantic="dark"] must override the token.
    const light = cssVar('--color-bg-brand');
    const probe = document.createElement('div');
    probe.setAttribute('data-semantic', 'dark');
    document.body.appendChild(probe);
    const dark = cssVar('--color-bg-brand', probe);
    probe.remove();
    expect(dark).not.toBe('');
    expect(dark).not.toBe(light);
    // 4. tailwindcss must come first so unlayered tokens win the cascade.
    const imports = designSystemCss
      .split('\n')
      .filter((line) => line.trim().startsWith('@import'))
      .map((line) => line.trim());
    expect(imports[0]).toBe('@import "tailwindcss";');
    expect(imports[1]).toContain('tokens.css');
  }
};
