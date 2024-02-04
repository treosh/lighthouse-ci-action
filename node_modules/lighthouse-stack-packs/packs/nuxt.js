const icon = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 512 512"><path fill="%2300DC82" d="M281.44 397.667h156.88c5.006 0 9.798-1.759 14.133-4.244.336-2.481 8.805-5.596 11.307-9.894 2.502-4.297 4.242-9.173 4.24-14.134-.002-4.962-1.734-9.836-4.24-14.131l-106-182.321c-2.502-4.297-5.559-7.413-9.893-9.894-4.335-2.48-10.542-4.24-15.547-4.24-5.005 0-9.799 1.76-14.133 4.24-4.335 2.481-7.392 5.597-9.894 9.894l-26.853 46.64-53.707-90.457c-2.504-4.296-5.557-8.823-9.893-11.303-4.336-2.481-9.127-2.827-14.133-2.827-5.006 0-9.798.346-14.134 2.827-4.335 2.48-8.802 7.007-11.306 11.303L46.827 355.268c-2.506 4.295-2.8259.169-2.827 14.131-.002 4.961.325 9.836 2.827 14.134 2.502 4.297 6.97 7.413 11.306 9.894 4.336 2.481 9.127 4.24 14.134 4.24H171.2c39.201 0 67.734-17.585 87.627-50.88L306.88 263.4l25.44-43.813 77.733 132.853H306.88l-25.44 45.227ZM169.787 352.44h-69.254l103.174-178.08L256 263.4l-34.639 60.384c-13.21 21.603-28.272 28.656-51.574 28.656Z"/></svg>`;

const UIStrings = {
  /** Additional description of a Lighthouse audit that tells the user to use the nuxt/image component to serve modern formats like WebP. */
  'modern-image-formats': 'Use the `nuxt/image` component and set `format="webp"`. [Learn more](https://image.nuxt.com/usage/nuxt-img#format).',
  /** Additional description of a Lighthouse audit that tells the user to use the nuxt/image component to defer loading images which are not shown on screen. */
  'offscreen-images': 'Use the `nuxt/image` component and set `loading="lazy"` for offscreen images. [Learn more](https://image.nuxt.com/usage/nuxt-img#loading).',
  /** Additional description of a Lighthouse audit that tells the user to use the nuxt/image component to automatically compress their images. */
  'uses-optimized-images': 'Use the `nuxt/image` component and set the appropriate `quality`. [Learn more](https://image.nuxt.com/usage/nuxt-img#quality).',
  /** Additional description of a Lighthouse audit that tells the user to use the nuxt/image component to serve appropriately sized images to different devices. */
  'uses-responsive-images': 'Use the `nuxt/image` component and set the appropriate `sizes`. [Learn more](https://image.nuxt.com/usage/nuxt-img#sizes).',
  /** Additional description of a Lighthouse audit that tells the user to use the nuxt/image component to prioritize the loading of the image that is part of the Largest Contentful Paint (LCP). */
  'prioritize-lcp-image': 'Use the `nuxt/image` component and specify `preload` for LCP image. [Learn more](https://image.nuxt.com/usage/nuxt-img#preload).',
  /** Additional description of a Lighthouse audit that tells the user to use the nuxt/image component to provide explicit `width` and `height` for images to prevent layout shift. */
  'unsized-images': 'Use the `nuxt/image` component and specify explicit `width` and `height`. [Learn more](https://image.nuxt.com/usage/nuxt-img#width-height).',
}

module.exports = {
  id: 'nuxt',
  title: 'Nuxt',
  icon,
  UIStrings,
}
