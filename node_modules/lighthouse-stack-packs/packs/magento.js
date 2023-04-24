const icon = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%23f26322" viewBox="0 0 1000 1000"><path d="M916.9 267.4v465.3l-111.3 67.4V331.4l-1.5-.9-303.9-189-304.6 189.2-1.2.8V799L83.1 732.6V267.4l.7-.4L500.3 10l416 257 .6.4zM560.7 468.5v383.3L500.3 890l-61-38.2V306.7l-136 84.3v476.6l197 122.5 196.4-122.5V391l-136-84.3v161.8z"/></svg>`;

const UIStrings = {
  /** Additional description of a Lighthouse audit that tells the user how they can improve image loading by using webp in the context of the Magento platform. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'modern-image-formats': "Consider searching the [Magento Marketplace](https://marketplace.magento.com/catalogsearch/result/?q=webp) for a variety of third-party extensions to leverage newer image formats.",
  /** Additional description of a Lighthouse audit that tells the user how they can improve performance by lazy loading images that are initially offscreen in the context of the Magento platform. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'offscreen-images': "Consider modifying your product and catalog templates to make use of the web platform's [lazy loading](https://web.dev/native-lazy-loading) feature.",
  /** Additional description of a Lighthouse audit that tells the user how they can improve site loading performance by disabling JS bundling in the context of the Magento platform. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'disable-bundling': "Disable Magento's built-in [JavaScript bundling and minification](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/themes/js-bundling.html), and consider using [baler](https://github.com/magento/baler/) instead.",
  /** Additional description of a Lighthouse audit that tells the user how they can improve performance by minifying their CSS files in the context of the Magento platform. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'unminified-css': "Enable the \"Minify CSS Files\" option in your store's Developer settings. [Learn more](https://devdocs.magento.com/guides/v2.3/performance-best-practices/configuration.html?itm_source=devdocs&itm_medium=search_page&itm_campaign=federated_search&itm_term=minify%20css%20files).",
  /** Additional description of a Lighthouse audit that tells the user how they can improve performance by minifying their Javascript files in the context of the Magento platform. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'unminified-javascript': "Use [Terser](https://www.npmjs.com/package/terser) to minify all JavaScript assets from static content deployment, and disable the built-in minification feature.",
  /** Additional description of a Lighthouse audit that tells the user how they can improve performance by removing unused Javascript files in the context of the Magento platform. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'unused-javascript': "Disable Magento's built-in [JavaScript bundling](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/themes/js-bundling.html).",
  /** Additional description of a Lighthouse audit that tells the user how they can improve site performance by optimizing images, in the context of the Magento platform. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'uses-optimized-images': "Consider searching the [Magento Marketplace](https://marketplace.magento.com/catalogsearch/result/?q=optimize%20image) for a variety of third party extensions to optimize images.",
  /** Additional description of a Lighthouse audit that tells the user how they can improve the time to first byte speed metric, in the context of the Magento platform. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'server-response-time': "Use Magento's [Varnish integration](https://devdocs.magento.com/guides/v2.3/config-guide/varnish/config-varnish.html).",
  /** Additional description of a Lighthouse audit that tells the user how they can add preconnect or dns-prefetch resource hints, in the context of the Magento platform. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'uses-rel-preconnect': "Preconnect or dns-prefetch resource hints can be added by [modifying a themes's layout](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/layouts/xml-manage.html).",
  /** Additional description of a Lighthouse audit that tells the user how they can add preload tags, in the context of the Magento platform. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'uses-rel-preload': "`<link rel=preload>` tags can be added by [modifying a themes's layout](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/layouts/xml-manage.html).",
  /** Additional description of a Lighthouse audit that tells the user how they can minimize critical request chains, in the context of the Magento platform. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'critical-request-chains': "If you are not bundling your JavaScript assets, consider using [baler](https://github.com/magento/baler).",
  /** Additional description of a Lighthouse audit that tells the user how they can specify font-display, in the context of the Magento platform. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'font-display': "Specify `@font-display` when [defining custom fonts](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/css-topics/using-fonts.html)."
};

module.exports = {
  id: 'magento',
  title: 'Magento',
  icon,
  UIStrings,
};
