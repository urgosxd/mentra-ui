# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## Development

This repo uses pnpm (pinned through the `packageManager` field in `package.json`).

```bash
pnpm install           # install dependencies
pnpm run dev           # start the Vite dev server
pnpm run build         # type-check and build for production
pnpm run lint          # run oxlint
pnpm test              # run the Vitest storybook project
pnpm run storybook     # start Storybook on port 6006
pnpm run build-storybook
```

## Production build

Production is deployed on Vercel, driven by `vercel.json`. There is no `Dockerfile` and no CI workflow in this repo: Vercel reads the `installCommand` and `buildCommand` from that file.

The exact production sequence:

```bash
# 1. pnpm at the pinned version (packageManager in package.json, currently pnpm 10.34.9)
pnpm install --frozen-lockfile   # works with CI=true
# 2. the build Vercel runs
pnpm run build-storybook
```

Dev dependencies are REQUIRED at build time. Storybook and Vite are devDependencies, so the install must not use `--omit=dev` or `--prod`; doing so removes the tools the build needs.

The deployed artifact is `storybook-static/`, and `vercel.json` sets it as the output directory with `/mcp` rewritten to the `api/mcp` function. `pnpm run build` produces the Vite app in `dist/`; that is the app build and is NOT what production serves, so do not point the output directory at it.

`npm ci` no longer applies: `package-lock.json` was removed by the pnpm migration, so running it now aborts with `EUSAGE` instead of installing.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
