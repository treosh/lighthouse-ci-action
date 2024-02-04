const icon = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="%23639"/><path fill="%23fff" d="M6.2 21.8C4.1 19.7 3 16.9 3 14.2L13.9 25c-2.8-.1-5.6-1.1-7.7-3.2zm10.2 2.9L3.3 11.6C4.4 6.7 8.8 3 14 3c3.7 0 6.9 1.8 8.9 4.5l-1.5 1.3C19.7 6.5 17 5 14 5c-3.9 0-7.2 2.5-8.5 6L17 22.5c2.9-1 5.1-3.5 5.8-6.5H18v-2h7c0 5.2-3.7 9.6-8.6 10.7z"/></svg>`;

const UIStrings = {
  /** Additional description of a Lighthouse audit that tells the user how they can remove unused CSS rules by configuring the Gatsby plugin `gatsby-plugin-purgecss` which sets up PurgeCSS */
  'unused-css-rules': 'Use the `PurgeCSS` `Gatsby` plugin to remove unused rules from stylesheets. [Learn more](https://purgecss.com/plugins/gatsby.html).',
  /** Additional description of a Lighthouse audit that tells the user to use the gatsby-plugin-image component to automatically optimize image format */
  'modern-image-formats': 'Use the `gatsby-plugin-image` component instead of `<img>` to automatically optimize image format. [Learn more](https://www.gatsbyjs.com/docs/how-to/images-and-media/using-gatsby-plugin-image).',
  /** Additional description of a Lighthouse audit that tells the user to defer loading images which are not shown on screen using the gatsby-plugin-image component */
  'offscreen-images': 'Use the `gatsby-plugin-image` component instead of `<img>` to automatically lazy-load images. [Learn more](https://www.gatsbyjs.com/docs/how-to/images-and-media/using-gatsby-plugin-image).',
  /** Additional description of a Lighthouse audit that tells the user to use gatsby-script to defer loading of non-critical third-party libraries */
  'render-blocking-resources': 'Use the `Gatsby Script API` to defer loading of non-critical third-party scripts. [Learn more](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-script/).',
  /** Additional description of a Lighthouse audit that tells the user to use Webpack Bundle Analyzer to discover JavaScript code that is not used */
  'unused-javascript': 'Use `Webpack Bundle Analyzer` to detect unused JavaScript code. [Learn more](https://www.gatsbyjs.com/plugins/gatsby-plugin-webpack-bundle-analyser-v2/)',
  /** Additional description of a Lighthouse audit that tells the user to enable caching for assets (e.g. images) and artifacts that don't change between deployments */
  'uses-long-cache-ttl': 'Configure caching for immutable assets. [Learn more](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/caching/).',
  /** Additional description of a Lighthouse audit that tells the user to use the gatsby-plugin-image component to adjust image quality */
  'uses-optimized-images': 'Use the `gatsby-plugin-image` component instead of `<img>` to adjust image quality. [Learn more](https://www.gatsbyjs.com/docs/how-to/images-and-media/using-gatsby-plugin-image).',
  /** Additional description of a Lighthouse audit that tells the user to serve responsive images using the gatsby-plugin-image component with appropriate `sizes` set */
  'uses-responsive-images': 'Use the `gatsby-plugin-image` component to set appropriate `sizes`. [Learn more](https://www.gatsbyjs.com/docs/how-to/images-and-media/using-gatsby-plugin-image).',
  /** Additional description of a Lighthouse audit that tells the user to use the gatsby-plugin-image component to automatically preload LCP images. "prop" is short for "property" */
  'prioritize-lcp-image': 'Use the `gatsby-plugin-image` component and set the `loading` prop to `eager`. [Learn more](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image#shared-props).',
}

module.exports = {
  id: 'gatsby',
  title: 'Gatsby',
  icon,
  UIStrings,
};
