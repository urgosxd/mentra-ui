import { addCollection, type IconifyJSON } from '@iconify/react';
import lucideIcons from '@iconify-json/lucide/icons.json';

// @iconify/react fetches icon data from api.iconify.design at render time unless
// the collection is registered first: without this line the first paint shows an
// empty <span> placeholder per icon, offline renders lose them entirely, and the
// timing leaks into story tests.
//
// This registers the whole lucide set (2100 icons). Import this module wherever
// the generated components render. Storybook does it in .storybook/preview.tsx;
// the app entry (src/main.tsx) does not yet, because it would add ~650 kB of icon
// data to the production bundle — if the app needs the icons offline, prefer a
// curated subset with addIcon() over the full collection.
addCollection(lucideIcons as IconifyJSON);
