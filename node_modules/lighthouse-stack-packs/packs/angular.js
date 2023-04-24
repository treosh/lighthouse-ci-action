const icon = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250"><path fill="%23dd0031" d="M125 30 31.9 63.2l14.2 123.1L125 230l78.9-43.7 14.2-123.1z"/><path fill="%23c3002f" d="M125 30v22.2-.1V230l78.9-43.7 14.2-123.1L125 30z"/><path fill="%23fff" d="M125 52.1 66.8 182.6h21.7l11.7-29.2h49.4l11.7 29.2H183L125 52.1zm17 83.3h-34l17-40.9 17 40.9z"/></svg>`;

const UIStrings = {
  /** Additional description of a Lighthouse audit that tells the user how they can improve site loading performance by reducing the total bytes delivered by their page in the context of the Angular framework. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'total-byte-weight': 'Apply [route-level code splitting](https://web.dev/route-level-code-splitting-in-angular/) to minimize the size of your JavaScript bundles. Also, consider precaching assets with the [Angular service worker](https://web.dev/precaching-with-the-angular-service-worker/).',
  /** Additional description of a Lighthouse audit that tells the user how they can improve performance by minifying their CSS and JS files in the context of the Angular framework. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'unminified-warning': 'If you are using Angular CLI, ensure that builds are generated in production mode. [Learn more](https://angular.io/guide/deployment#enable-runtime-production-mode).',
  /** Additional description of a Lighthouse audit that tells the user how they can improve performance by removing unused Javascript files in the context of the Angular framework. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'unused-javascript': 'If you are using Angular CLI, include source maps in your production build to inspect your bundles. [Learn more](https://angular.io/guide/deployment#inspect-the-bundles).',
  /** Additional description of a Lighthouse audit that tells the user how they can use responsive images in the context of the Angular framework. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'uses-responsive-images': 'Consider using the `BreakpointObserver` utility in the Component Dev Kit (CDK) to manage image breakpoints. [Learn more](https://material.angular.io/cdk/layout/overview).',
  /** Additional description of a Lighthouse audit that tells the user how they can use preload to improve performance in the context of the Angular framework. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'uses-rel-preload': 'Preload routes ahead of time to speed up navigation. [Learn more](https://web.dev/route-preloading-in-angular/).',
  /** Additional description of a Lighthouse audit that tells the user and *how* they should reduce the size of the web page's DOM in the context of the Angular framework. 'Learn More' becomes link text to additional documentation. */
  'dom-size': 'Consider virtual scrolling with the Component Dev Kit (CDK) if very large lists are being rendered. [Learn more](https://web.dev/virtualize-lists-with-angular-cdk/).',
};

module.exports = {
  id: 'angular',
  title: 'Angular',
  icon,
  UIStrings,
}
