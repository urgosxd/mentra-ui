import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    // Hand-written stories only. src/stories/generated is the OpenPencil export and
    // its pdf/* stories are a design baseline, not product stories, so they are not
    // loaded (extglob, since Storybook stories globs have no '!' negation).
    "../src/!(stories)/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/stories/!(generated)/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp"
  ],
  "framework": "@storybook/react-vite"
};
export default config;