import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { Button } from '../generated/Button';
import {
  TRANSPARENT,
  declaredStateStyle,
  resolveDeclaration,
  tokenValue
} from './styleProbe';

const meta = {
  title: 'UI/Button',
  component: Button,
  args: { style: 'Primary', label: 'Guardar cambios', disabled: false },
  argTypes: {
    style: {
      control: 'select',
      options: ['Primary', 'Secondary', 'Tertiary', 'Destructive']
    },
    label: { control: 'text' },
    disabled: { control: 'boolean' }
  }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

const STYLES = ['Primary', 'Secondary', 'Tertiary', 'Destructive'] as const;
type ButtonStyle = (typeof STYLES)[number];

// Design copy per variant comes from the export's page; the component no longer
// hardcodes it, so each story passes its own label.
const LABELS: Record<ButtonStyle, string> = {
  Primary: 'Guardar cambios',
  Secondary: 'Cancelar',
  Tertiary: 'Ver detalle →',
  Destructive: 'Eliminar insumo'
};

// The colour token each style paints its label with at rest, straight from the
// export: Primary inverts, Secondary/Tertiary use the action colour, Destructive
// the danger text colour.
const LABEL_TOKEN: Record<ButtonStyle, string> = {
  Primary: '--color-component-button-text',
  Secondary: '--color-action-primary',
  Tertiary: '--color-action-primary',
  Destructive: '--color-text-danger'
};

// The token each style introduces for hover and for pressed. Primary, Secondary
// and Tertiary repaint the surface; Destructive keeps its red wash and reveals
// the danger border, so its signal is a border token in both states.
const HOVER_TOKEN: Record<ButtonStyle, string> = {
  Primary: '--color-component-button-bg-hover',
  Secondary: '--color-action-primary-subtle',
  Tertiary: '--color-action-primary-subtle',
  Destructive: '--color-border-danger'
};

const PRESSED_TOKEN: Record<ButtonStyle, string> = {
  Primary: '--color-action-primary-pressed',
  Secondary: '--color-bg-sunken',
  Tertiary: '--color-bg-sunken',
  Destructive: '--color-border-danger'
};

// Disabled: the export flattens Primary and Destructive to bg/sunken, while
// Secondary and Tertiary drop the fill entirely (`bg-[unset]`).
const DISABLED_FILL: Record<ButtonStyle, string | null> = {
  Primary: '--color-bg-sunken',
  Secondary: null,
  Tertiary: null,
  Destructive: '--color-bg-sunken'
};

// Destructive keeps its danger-hover label colour when disabled in the export,
// unlike the other three styles.
const DISABLED_LABEL: Record<ButtonStyle, string> = {
  Primary: '--color-text-secondary',
  Secondary: '--color-text-secondary',
  Tertiary: '--color-text-secondary',
  Destructive: '--color-action-danger-hover'
};

// The focus ring is a 2px border; only the colour differs by style.
const FOCUS_TOKEN: Record<ButtonStyle, string> = {
  Primary: '--color-text-inverse',
  Secondary: '--color-border-focus',
  Tertiary: '--color-border-focus',
  Destructive: '--color-border-focus'
};

// Whether the state repaints the surface (so the computed fill must move) or only
// adds a border, which is Destructive's signal in both states.
const REPAINTS_SURFACE: Record<ButtonStyle, boolean> = {
  Primary: true,
  Secondary: true,
  Tertiary: true,
  Destructive: false
};

function getButton(canvasElement: HTMLElement): HTMLButtonElement {
  const buttons = canvasElement.querySelectorAll('button');
  expect(buttons).toHaveLength(1);
  return buttons[0] as HTMLButtonElement;
}

function getLabelSpan(button: HTMLButtonElement): HTMLElement {
  // Exactly one textual span: Iconify inserts empty placeholder spans, so filter
  // on text instead of counting every span.
  const labels = Array.from(button.querySelectorAll('span')).filter(
    (span) => (span.textContent ?? '').trim() !== ''
  );
  expect(labels).toHaveLength(1);
  return labels[0] as HTMLElement;
}

// The re-exported Button is a real <button> with a single label <span>; the old
// "one hidden span per variant, show the active one with CSS" hack is gone, so
// the invariant here is element semantics + props reflected as DOM facts.
async function expectButton(
  canvasElement: HTMLElement,
  expected: { label: string; style: ButtonStyle; disabled?: boolean }
) {
  const button = getButton(canvasElement);
  const label = getLabelSpan(button);

  expect(button.getAttribute('type')).toBe('button');
  expect(button.getAttribute('data-style')).toBe(expected.style);
  expect(label.textContent).toBe(expected.label);
  expect(button.textContent).toBe(expected.label);

  // Typography must come from `text-(length:--type-body-size)`: the ambiguous
  // `text-(--type-body-size)` form compiles to `color:` and silently swallows
  // the label colour (it was black-on-green before this guard).
  expect(getComputedStyle(label).fontSize).toBe('14px');
  expect(getComputedStyle(label).color).toBe(
    tokenValue(expected.disabled ? DISABLED_LABEL[expected.style] : LABEL_TOKEN[expected.style])
  );

  if (expected.disabled) {
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('data-disabled')).toBe('true');
  } else {
    expect(button.disabled).toBe(false);
    expect(button.hasAttribute('data-disabled')).toBe(false);
  }
}

/** Every value the `:hover` / `:active` rules would apply to `button` or its label. */
function stateDeclarations(
  button: HTMLButtonElement,
  pseudo: ':hover' | ':active'
): string[] {
  const own = Object.values(declaredStateStyle(button, pseudo)).flat();
  const label = Object.values(declaredStateStyle(getLabelSpan(button), pseudo)).flat();
  return [...own, ...label];
}

export const Primary: Story = {
  play: async ({ canvasElement }) => {
    await expectButton(canvasElement, { label: 'Guardar cambios', style: 'Primary' });
  }
};

export const Secondary: Story = {
  args: { style: 'Secondary', label: 'Cancelar' },
  play: async ({ canvasElement }) => {
    await expectButton(canvasElement, { label: 'Cancelar', style: 'Secondary' });
  }
};

export const Tertiary: Story = {
  args: { style: 'Tertiary', label: 'Ver detalle →' },
  play: async ({ canvasElement }) => {
    await expectButton(canvasElement, { label: 'Ver detalle →', style: 'Tertiary' });
  }
};

export const Destructive: Story = {
  args: { style: 'Destructive', label: 'Eliminar insumo' },
  play: async ({ canvasElement }) => {
    await expectButton(canvasElement, { label: 'Eliminar insumo', style: 'Destructive' });
  }
};

/**
 * One story per `Style` × `State` cell of the design's matrix, on top of the four
 * Default-state stories above.
 *
 * Hover and pressed are driven by `:hover` / `:active`, which the browser derives
 * from real pointer input; `storybook/test`'s `userEvent` dispatches synthetic
 * events, so the interaction is performed but the styling is read back from the
 * declarations those rules carry (see `declaredStateStyle`). Focus is real:
 * `userEvent.tab()` moves focus and `:focus-visible` resolves normally.
 */
function stateStory(style: ButtonStyle, state: 'Hover' | 'Pressed' | 'Focus' | 'Disabled'): Story {
  const onClick = fn();

  return {
    args: { style, label: LABELS[style], disabled: state === 'Disabled', onClick },
    play: async ({ canvasElement, userEvent }) => {
      await expectButton(canvasElement, {
        label: LABELS[style],
        style,
        disabled: state === 'Disabled'
      });
      const button = getButton(canvasElement);

      if (state === 'Hover') {
        const rest = getComputedStyle(button).backgroundColor;
        await userEvent.hover(button);

        const declared = stateDeclarations(button, ':hover');
        expect(
          declared.some((value) => value.includes(HOVER_TOKEN[style])),
          `hover applies ${HOVER_TOKEN[style]}`
        ).toBe(true);

        const background = declaredStateStyle(button, ':hover')['background-color']?.at(-1);
        if (background !== undefined) {
          const resolved = resolveDeclaration('background-color', background);
          expect(resolved).not.toBe(TRANSPARENT);
          // Where the design repaints the surface, the fill must move.
          if (REPAINTS_SURFACE[style]) expect(resolved).not.toBe(rest);
        }
        return;
      }

      if (state === 'Pressed') {
        await userEvent.pointer([{ target: button, keys: '[MouseLeft>]' }]);
        const declared = stateDeclarations(button, ':active');
        expect(
          declared.some((value) => value.includes(PRESSED_TOKEN[style])),
          `pressed applies ${PRESSED_TOKEN[style]}`
        ).toBe(true);
        await userEvent.pointer([{ keys: '[/MouseLeft]' }]);
        return;
      }

      if (state === 'Focus') {
        const widthBefore = getComputedStyle(button).borderTopWidth;
        await userEvent.tab();
        expect(document.activeElement).toBe(button);

        const focused = getComputedStyle(button);
        expect(focused.borderTopWidth).not.toBe(widthBefore);
        expect(focused.borderTopWidth).toBe('2px');
        expect(focused.borderTopColor).toBe(tokenValue(FOCUS_TOKEN[style]));
        return;
      }

      // Disabled: the surface and the label stop following the enabled palette,
      // and the button stops answering pointer input.
      const fill = DISABLED_FILL[style];
      expect(getComputedStyle(button).backgroundColor).toBe(
        fill === null ? TRANSPARENT : tokenValue(fill, 'background-color')
      );
      expect(getComputedStyle(getLabelSpan(button)).color).toBe(
        tokenValue(DISABLED_LABEL[style])
      );
      await userEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    }
  };
}

export const PrimaryHover: Story = stateStory('Primary', 'Hover');
export const PrimaryPressed: Story = stateStory('Primary', 'Pressed');
export const PrimaryFocus: Story = stateStory('Primary', 'Focus');
export const PrimaryDisabled: Story = stateStory('Primary', 'Disabled');

export const SecondaryHover: Story = stateStory('Secondary', 'Hover');
export const SecondaryPressed: Story = stateStory('Secondary', 'Pressed');
export const SecondaryFocus: Story = stateStory('Secondary', 'Focus');
export const SecondaryDisabled: Story = stateStory('Secondary', 'Disabled');

export const TertiaryHover: Story = stateStory('Tertiary', 'Hover');
export const TertiaryPressed: Story = stateStory('Tertiary', 'Pressed');
export const TertiaryFocus: Story = stateStory('Tertiary', 'Focus');
export const TertiaryDisabled: Story = stateStory('Tertiary', 'Disabled');

export const DestructiveHover: Story = stateStory('Destructive', 'Hover');
export const DestructivePressed: Story = stateStory('Destructive', 'Pressed');
export const DestructiveFocus: Story = stateStory('Destructive', 'Focus');
export const DestructiveDisabled: Story = stateStory('Destructive', 'Disabled');

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', gap: 16 }}>
      <Button style="Primary" />
      <Button style="Secondary" label="Cancelar" />
      <Button style="Tertiary" label="Ver detalle →" />
      <Button style="Destructive" label="Eliminar insumo" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const styles = Array.from(canvasElement.querySelectorAll('button')).map((button) =>
      button.getAttribute('data-style')
    );
    expect(styles).toEqual(['Primary', 'Secondary', 'Tertiary', 'Destructive']);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  render: () => <Button style="Primary" />,
  play: async ({ canvasElement }) => {
    await expectButton(canvasElement, { label: 'Guardar cambios', style: 'Primary' });
    // The dark block repaints the surface, so the resolved fill must be the dark
    // action colour and not the light one.
    expect(getComputedStyle(getButton(canvasElement)).backgroundColor).toBe(
      tokenValue('--color-component-button-bg', 'background-color')
    );
    expect(tokenValue('--color-component-button-bg', 'background-color')).toBe(
      tokenValue('--color-brand-300', 'background-color')
    );
  }
};
