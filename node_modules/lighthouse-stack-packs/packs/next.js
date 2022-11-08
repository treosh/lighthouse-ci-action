const icon = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 207 124"><path d="M48.942 32.632h38.96v3.082h-35.39v23.193H85.79v3.082H52.513v25.464h35.794v3.081H48.942V32.632Zm42.45 0h4.139l18.343 25.464 18.749-25.464L158.124.287l-41.896 60.485 21.59 29.762h-4.302l-19.642-27.086L94.15 90.534h-4.22l21.751-29.762-20.29-28.14Zm47.967 3.082v-3.082h44.397v3.082h-20.453v54.82h-3.571v-54.82h-20.373ZM.203 32.632h4.464l61.557 91.671-25.439-33.769L3.936 37.011l-.162 53.523H.203zm183.194 53.891c.738 0 1.276-.563 1.276-1.29 0-.727-.538-1.29-1.276-1.29-.73 0-1.277.563-1.277 1.29 0 .727.547 1.29 1.277 1.29Zm3.509-3.393c0 2.146 1.555 3.549 3.822 3.549 2.414 0 3.874-1.446 3.874-3.956v-8.837h-1.946v8.828c0 1.394-.704 2.138-1.946 2.138-1.112 0-1.867-.692-1.893-1.722h-1.911Zm10.24-.113c.14 2.233 2.007 3.662 4.787 3.662 2.97 0 4.83-1.498 4.83-3.887 0-1.878-1.06-2.917-3.632-3.514l-1.38-.338c-1.634-.38-2.294-.891-2.294-1.783 0-1.125 1.025-1.86 2.563-1.86 1.459 0 2.466.718 2.649 1.869h1.893c-.113-2.103-1.971-3.583-4.516-3.583-2.737 0-4.56 1.48-4.56 3.704 0 1.835 1.033 2.926 3.3 3.454l1.616.39c1.659.389 2.388.96 2.388 1.912 0 1.108-1.146 1.913-2.71 1.913-1.676 0-2.84-.753-3.005-1.939h-1.928Z" fill="%23000"/></svg>`;

const UIStrings = {
  /** Additional description of a Lighthouse audit that tells the user how they can remove unusused CSS rules by configuring a plugin named PurgeCSS. */
  'unused-css-rules': 'Consider setting up `PurgeCSS` in `Next.js` configuration to remove unused rules from stylesheets. [Learn more](https://purgecss.com/guides/next.html).',
  /** Additional description of a Lighthouse audit that tells the user to use the next/image component to automatically optimize image format. */
  'modern-image-formats': 'Use the `next/image` component instead of `<img>` to automatically optimize image format. [Learn more](https://nextjs.org/docs/basic-features/image-optimization).',
  /** Additional description of a Lighthouse audit that tells the user to defer loading images which are not shown on screen using the next/image component. */
  'offscreen-images': 'Use the `next/image` component instead of `<img>` to automatically lazy-load images. [Learn more](https://nextjs.org/docs/basic-features/image-optimization).',
  /** Additional description of a Lighthouse audit that tells the user to use next/script to defer loading of non-critical third-party libraries. */
  'render-blocking-resources': 'Use the `next/script` component to defer loading of non-critical third-party scripts. [Learn more](https://nextjs.org/docs/basic-features/script).',
  /** Additional description of a Lighthouse audit that tells the user to use Webpack Bundle Analyzer to discover JavaScript code that is not used. */
  'unused-javascript': 'Use `Webpack Bundle Analyzer` to detect unused JavaScript code. [Learn more](https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer)',
  /** Additional description of a Lighthouse audit that tells the user to enable caching for assets (e.g. images) and server-side rendered (SSR) pages that don't change between deployments. */
  'uses-long-cache-ttl': 'Configure caching for immutable assets and `Server-side Rendered` (SSR) pages. [Learn more](https://nextjs.org/docs/going-to-production#caching).',
  /** Additional description of a Lighthouse audit that tells the user to use the next/image component to adjust image quality. */
  'uses-optimized-images': 'Use the `next/image` component instead of `<img>` to adjust image quality. [Learn more](https://nextjs.org/docs/basic-features/image-optimization).',
  /** Additional description of a Lighthouse audit that tells the user to enable compression (gzip, brotli) on their servers. */
  'uses-text-compression': 'Enable compression on your Next.js server. [Learn more](https://nextjs.org/docs/api-reference/next.config.js/compression).',
  /** Additional description of a Lighthouse audit that tells the user to serve responsive images using the next/image component with appropriate `sizes` set. */
  'uses-responsive-images': 'Use the `next/image` component to set the appropriate `sizes`. [Learn more](https://nextjs.org/docs/api-reference/next/image#sizes).',
  /** Additional description of a Lighthouse audit that tells the user to analyze the performance of their applications using Next.js Analytics. */
  'user-timings': 'Consider using `Next.js Analytics` to measure your app\'s real-world performance. [Learn more](https://nextjs.org/docs/advanced-features/measuring-performance).',
  /** Additional description of a Lighthouse audit that tells the user to use the next/image component to automatically preload LCP images. */
  'preload-lcp-image': 'Use the `next/image` component and set "priority" to true to preload LCP image. [Learn more](https://nextjs.org/docs/api-reference/next/image#priority).',
  /** Additional description of a Lighthouse audit that tells the user to use the next/image component to make sure `width` and `height` of image elements are always specified. */
  'unsized-images': 'Use the `next/image` component to make sure images are always sized appropriately. [Learn more](https://nextjs.org/docs/api-reference/next/image#width).',
}

module.exports = {
  id: 'next.js',
  title: 'Next.js',
  icon,
  UIStrings,
}
