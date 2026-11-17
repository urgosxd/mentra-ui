import type { Decorator } from '@storybook/react-vite';
import { SemanticTheme } from './SemanticTheme';

/** Applies the dark semantic theme to stories that opt in with `parameters: { semantic: 'dark' }`. */
export const withSemanticTheme: Decorator = (Story, context) => (
  <SemanticTheme dark={context.parameters.semantic === 'dark'}>
    <Story />
  </SemanticTheme>
);
