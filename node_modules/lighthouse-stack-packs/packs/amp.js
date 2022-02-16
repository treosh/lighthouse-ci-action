
const icon = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"%3E%3Cpath d="M171.887 116.28l-53.696 89.36h-9.728l9.617-58.227-30.2.047a4.852 4.852 0 01-4.855-4.855c0-1.152 1.07-3.102 1.07-3.102l53.52-89.254 9.9.043-9.86 58.317 30.413-.043a4.852 4.852 0 014.855 4.855c0 1.088-.427 2.044-1.033 2.854l.004.004zM128 0C57.306 0 0 57.3 0 128s57.306 128 128 128 128-57.306 128-128S198.7 0 128 0z" fill="%230379c4" fill-rule="evenodd"/%3E%3C/svg%3E`;

const UIStrings = {
  /** Additional description of a Lighthouse audit that tells the user how they can improve image loading by using WebP in the context of AMP. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'modern-image-formats': 'Consider displaying all [`amp-img`](https://amp.dev/documentation/components/amp-img/?format=websites) components in WebP formats while specifying an appropriate fallback for other browsers. [Learn more](https://amp.dev/documentation/components/amp-img/#example:-specifying-a-fallback-image).',
  /** Additional description of a Lighthouse audit that tells the user how images are automatically lazy loaded for the AMP framewok. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'offscreen-images': 'Ensure that you are using [`amp-img`](https://amp.dev/documentation/components/amp-img/?format=websites) for images to automatically lazy-load. [Learn more](https://amp.dev/documentation/guides-and-tutorials/develop/media_iframes_3p/?format=websites#images).',
  /** Additional description of a Lighthouse audit that tells the user how they can improve performance by reducing the amount of render blocking resources present on their page in the context of the AMP framework. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'render-blocking-resources': 'Use tools such as [AMP Optimizer](https://github.com/ampproject/amp-toolbox/tree/master/packages/optimizer) to [server-side render AMP layouts](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/server-side-rendering/).',
  /** Additional description of a Lighthouse audit that tells the user how they can improve performance by ensuring all the CSS written is supported by the AMP framework. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'unminified-css': 'Refer to the [AMP documentation](https://amp.dev/documentation/guides-and-tutorials/develop/style_and_layout/style_pages/) to ensure all styles are supported.',
  /** Additional description of a Lighthouse audit that tells the user how they can improve performance by using a runtime-managed animated image in the context of the AMP framework. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'efficient-animated-content': 'For animated content, use [`amp-anim`](https://amp.dev/documentation/components/amp-anim/) to minimize CPU usage when the content is offscreen.',
  /** Additional description of a Lighthouse audit that tells the user how they can improve performance by using responsive images in the context of the AMP framework. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'uses-responsive-images': 'The [`amp-img`](https://amp.dev/documentation/components/amp-img/?format=websites) component supports the [`srcset`](https://web.dev/use-srcset-to-automatically-choose-the-right-image/) attribute to specify which image assets to use based on the screen size. [Learn more](https://amp.dev/documentation/guides-and-tutorials/develop/style_and_layout/art_direction/).',
};

module.exports = {
  id: 'amp',
  title: 'AMP',
  icon,
  UIStrings,
};
