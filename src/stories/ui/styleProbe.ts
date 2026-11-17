/**
 * Helpers that let stories assert design-system styling through the browser
 * instead of through Tailwind class names.
 */

/** `transparent` as the browser serializes it; a state that must paint is not this. */
export const TRANSPARENT = 'rgba(0, 0, 0, 0)';

type ResolvableProperty = 'background-color' | 'color' | 'font-weight' | 'opacity';

/**
 * Computes what a declared value would actually apply: `color-mix()` collapses to
 * a concrete color, `var(--font-weight-medium)` to its number. Values read back
 * from a stylesheet are declarations, not computed values, so they need this pass
 * before they can be compared with `getComputedStyle` output.
 */
export function resolveDeclaration(property: ResolvableProperty, declared: string): string {
  const probe = document.createElement('span');
  probe.style.setProperty(property, declared);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

/**
 * Resolves a design token through the browser instead of duplicating hex values,
 * so computed-style assertions also cover the `[data-semantic="dark"]` overrides.
 * The probe inherits the theme from `document.documentElement`, which is where the
 * global decorator sets it.
 */
export function tokenValue(
  variable: string,
  property: 'color' | 'background-color' = 'color'
): string {
  return resolveDeclaration(property, `var(${variable})`);
}

/**
 * Whether a `:hover` / `:active` rule applies to `target`.
 *
 * Two forms are needed because the browser cannot answer the question directly:
 * `:hover` never matches under test, and stripping it from a utility selector can
 * leave an unparsable fragment. So the selector's final compound is matched
 * against the target with the pseudo-class removed, and when that is not a valid
 * selector (Tailwind emits `group-hover` as `.x:is(:where(.group):hover *)`) the
 * rule counts as the target's when the compound names a class the target carries.
 */
function stripPseudo(selector: string, pseudo: string): string {
  // Only the *unescaped* pseudo-class is the variant; an escaped `\:hover` is
  // part of a utility's class name and must survive.
  return selector.replaceAll(new RegExp(`(?<!\\\\)${pseudo}`, 'g'), '');
}

function ruleTargets(target: Element, selector: string, pseudo: string): boolean {
  const compounds = selector.trim().split(/\s+/);
  const last = stripPseudo(compounds[compounds.length - 1], pseudo);

  if (last) {
    try {
      if (target.matches(last)) return true;
    } catch {
      // Relative selector fragment after stripping the pseudo-class: fall through.
    }
  }

  return Array.from(target.classList).some((name) => selector.includes(CSS.escape(name)));
}

/**
 * Reads the declarations a `:hover` / `:active` rule would apply to `target`.
 *
 * `storybook/test` re-exports `@testing-library/user-event`, which dispatches
 * *synthetic* pointer events. The browser derives `:hover` and `:active` from real
 * pointer input only, so those pseudo-classes never match under test and
 * `getComputedStyle` cannot show the state. The interaction is still performed in
 * the story; the declarations it would apply are read back from the live
 * stylesheets instead, discovered by matching the DOM (no Tailwind class name is
 * hardcoded). Values come back as a list in cascade order because several sheets
 * can match the same element -- including Storybook's own overlay rules.
 */
const SHORTHANDS = ['border', 'outline', 'background', 'font'] as const;

export function declaredStateStyle(
  target: Element,
  pseudo: ':hover' | ':active' = ':hover'
): Record<string, string[]> {
  const merged: Record<string, string[]> = {};

  const visit = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSStyleRule)) {
        // Utilities live inside @media / @supports / @layer blocks; walk into the
        // ones that actually apply so a fallback never outranks the real value.
        if (rule instanceof CSSMediaRule && !window.matchMedia(rule.conditionText).matches) continue;
        if (rule instanceof CSSSupportsRule && !CSS.supports(rule.conditionText)) continue;
        if ('cssRules' in rule) visit((rule as CSSGroupingRule).cssRules);
        continue;
      }
      if (!rule.selectorText.includes(pseudo)) continue;

      // A selector whose `:not()`/`:is()` holds a comma splits into fragments
      // here; `ruleTargets` simply does not match those.
      for (const selector of rule.selectorText.split(',')) {
        if (!ruleTargets(target, selector, pseudo)) continue;
        const record = (property: string, value: string) => {
          if (value !== '') merged[property] = [...(merged[property] ?? []), value];
        };
        for (const property of Array.from(rule.style)) {
          record(property, rule.style.getPropertyValue(property));
        }
        // A shorthand holding `var()` cannot be expanded to longhands by CSSOM, so
        // its longhands read back empty (`border: 1px solid var(--x)` is the usual
        // shape here). Record the shorthand itself in that case.
        for (const shorthand of SHORTHANDS) {
          record(shorthand, rule.style.getPropertyValue(shorthand));
        }
      }
    }
  };

  for (const sheet of Array.from(document.styleSheets)) {
    try {
      visit(sheet.cssRules);
    } catch {
      // Cross-origin stylesheet: not ours, nothing to read.
    }
  }

  return merged;
}

/** The declared values for one property among the rules that apply `pseudo` to `target`. */
export function declaredStateValues(
  target: Element,
  property: string,
  pseudo: ':hover' | ':active' = ':hover'
): string[] {
  return declaredStateStyle(target, pseudo)[property] ?? [];
}
