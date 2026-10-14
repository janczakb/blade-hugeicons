# Blade Hugeicons

6,067 unique **Hugeicons Free · Stroke Rounded** SVG icons for Laravel Blade and Filament. Built directly from the official `@hugeicons/core-free-icons` **4.3.5** release, without copying another Laravel icon package.

## Install

```bash
composer require janczakb/blade-hugeicons
```

This is a new package: publish its repository and release on Packagist before using the command above. Laravel discovers the service provider automatically. SVGs ship with the Composer package; consumers do **not** need Node.js, a frontend build or asset publication.

Remove `afatmustafa/blade-hugeicons` before installing this package. Both register the `hugeicons` prefix, so Composer deliberately prevents installing both together. This package does not claim complete compatibility with historical aliases from other adapters.

## Use

```blade
<x-hugeicons-unfold-more class="h-5 w-5" />
<x-hugeicons-linkedin-02 class="h-6 w-6 stroke-2" />
@svg('hugeicons-search-01', 'h-5 w-5')
```

```php
Action::make('search')->icon('hugeicons-search-01');
```

SVGs retain the official **1.5** stroke appearance. Use a CSS class such as `stroke-2` to override inherited stroke width (`<x-hugeicons-unfold-more class="h-5 w-5 stroke-2" />`). For default classes or other attributes, publish the optional configuration:

```bash
php artisan vendor:publish --tag=blade-hugeicons-config
```

The set supports Blade Icons' `prefix`, `class`, `attributes` and `fallback` configuration. Prefix changes affect all icon names. Keep the default `hugeicons` prefix for FLEX Fields. SVG geometry and fill/stroke intent are unchanged; ordinary upstream stroke width is inherited from the root. Use CSS for stroke changes to avoid duplicate root attributes from Blade Icons. Filled-only shapes do not acquire an extra outline.

## Catalog and performance

`resources/manifest.json` maps official export names (for example `UnfoldMoreIcon`) to Blade names (`hugeicons-unfold-more`). `resources/upstream.json` records the exact upstream version, npm integrity, icon count and reproducible catalog SHA-256. This catalog contains every unique `*Icon.js` shape in the upstream release; export aliases are not presented as additional icons.

Icons render inline on the server. There is no browser icon library, JavaScript or CSS bundle. Only rendered SVG markup is sent to the browser. Blade Icons caches icon contents within its Factory; enable its manifest cache during deployment to avoid repeatedly discovering thousands of Blade components:

```bash
php artisan icons:cache
```

After updating an icon package, regenerate this cache with the current release before serving traffic. To clear it, use `php artisan icons:clear`. See the [Blade Icons documentation](https://github.com/blade-ui-kit/blade-icons#caching).

## Maintain the package

Node.js is needed only to regenerate icons when preparing a release:

```bash
npm ci --ignore-scripts
npm test
npm run build
composer test
```

The generator uses an exact pinned version and validates SVG node types and attributes. To update upstream, choose an explicit version, update `package.json` and the lockfile, regenerate, inspect the changes and run verification. Generated SVGs are committed and included in Composer distributions; `node_modules` is excluded.

## License and attribution

Laravel integration: MIT, Bartek Janczak. Icon artwork: Hugeicons, MIT. The original notice is preserved in [LICENSE-HUGEICONS.md](LICENSE-HUGEICONS.md). Only the official **free** set is included; Hugeicons Pro assets are not redistributed.

Sources: [official Hugeicons repository](https://github.com/hugeicons/hugeicons), [official npm package](https://www.npmjs.com/package/@hugeicons/core-free-icons).
