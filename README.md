# VELQIRA Storefront

The storefront runs as a React and TypeScript application with Vite and locally built Tailwind CSS. Existing page markup is kept in `src/page-markup/` and mounted through React page components so the current designs, URLs, and page scripts remain intact during the migration.

## Development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

Fonts and product photography still use the external URLs defined in the original page markup. Files in `public/images/` are available for migrating those references to local assets.
