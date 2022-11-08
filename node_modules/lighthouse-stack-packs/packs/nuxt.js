const icon = `data:image/svg+xml,<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124 124"><path fill-rule="evenodd" clip-rule="evenodd" d="M55.75 27.155c-3.222-5.54-11.278-5.54-14.5 0L6.134 87.535C2.912 93.075 6.94 100 13.384 100h27.413c-2.753-2.407-3.773-6.57-1.69-10.142L65.704 44.27 55.75 27.155Z" fill="%2380EEC0"/><path d="M78 40.4c2.667-4.533 9.333-4.533 12 0L119.06 89.8c2.667 4.533-.666 10.199-5.999 10.199H54.938c-5.333 0-8.666-5.666-6-10.199L78 40.4Z" fill="%2300DC82"/></svg>`;

const UIStrings = {
  /** Additional description of a Lighthouse audit that tells the user to use the nuxt/image component to serve modern formats like WebP. */
  'modern-image-formats': 'Use the `nuxt/image` component and set `format="webp"`. [Learn more](https://image.nuxtjs.org/components/nuxt-img#format).',
  /** Additional description of a Lighthouse audit that tells the user to use the nuxt/image component to defer loading images which are not shown on screen. */
  'offscreen-images': 'Use the `nuxt/image` component and set `loading="lazy"` for offscreen images. [Learn more](https://image.nuxtjs.org/components/nuxt-img#loading).',
  /** Additional description of a Lighthouse audit that tells the user to use the nuxt/image component to automatically compress their images. */
  'uses-optimized-images': 'Use the `nuxt/image` component and set the appropriate `quality`. [Learn more](https://image.nuxtjs.org/components/nuxt-img#quality).',
  /** Additional description of a Lighthouse audit that tells the user to use the nuxt/image component to serve appropriately sized images to different devices. */
  'uses-responsive-images': 'Use the `nuxt/image` component and set the appropriate `sizes`. [Learn more](https://image.nuxtjs.org/components/nuxt-img#sizes).',
  /** Additional description of a Lighthouse audit that tells the user to use the nuxt/image component to prioritize the loading of the image that is part of the Largest Contentful Paint (LCP). */
  'preload-lcp-image': 'Use the `nuxt/image` component and specify `preload` for LCP image. [Learn more](https://image.nuxtjs.org/components/nuxt-img#preload).',
  /** Additional description of a Lighthouse audit that tells the user to use the nuxt/image component to provide explicit `width` and `height` for images to prevent layout shift. */
  'unsized-images': 'Use the `nuxt/image` component and specify explicit `width` and `height`. [Learn more](https://image.nuxtjs.org/components/nuxt-img#width--height).',
}

module.exports = {
  id: 'nuxt',
  title: 'Nuxt',
  icon,
  UIStrings,
}