const icon = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82 82"><path fill="%235FA624" fill-rule="evenodd" d="M81.37 48.117C85.301 25.821 70.413 4.56 48.117.63 25.821-3.3 4.56 11.586.63 33.883-3.3 56.178 11.586 77.44 33.883 81.37 56.18 85.301 77.44 70.412 81.37 48.117Zm-8.935-14.17c2.77 12.357-1.942 25.721-12.96 33.436-14.57 10.203-34.656 6.662-44.859-7.909a32.434 32.434 0 0 1-2.869-4.98l28.7-20.097a6.53 6.53 0 1 0-3.744-5.347L9.564 48.054c-2.768-12.359 1.943-25.724 12.96-33.439 14.572-10.203 34.656-6.662 44.86 7.91a32.349 32.349 0 0 1 2.868 4.98L41.554 47.6a6.53 6.53 0 1 0 3.746 5.35l27.136-19.003Z"/></svg>`;

const UIStrings = {
  /** Additional description of a Lighthouse audit for a third-party framework called `Ezoic`. This is displayed after a user expands the section to see more. No character length limits. Ezoic Leap is Ezoic's site speed improvement toolset. Remove Unused CSS is a setting name. */
  'unused-css-rules': 'Use [Ezoic Leap](https://pubdash.ezoic.com/speed) and enable `Remove Unused CSS` to help with this issue. It will identify the CSS classes that are actually used on each page of your site, and remove any others to keep the file size small.',
  /** Additional description of a Lighthouse audit for a third-party framework called `Ezoic`. This is displayed after a user expands the section to see more. No character length limits. Ezoic Leap is Ezoic's site speed improvement toolset. Next-Gen Formats is a setting name.*/
  'modern-image-formats': 'Use [Ezoic Leap](https://pubdash.ezoic.com/speed) and enable `Next-Gen Formats` to convert images to WebP.',
  /** Additional description of a Lighthouse audit for a third-party framework called `Ezoic`. This is displayed after a user expands the section to see more. No character length limits. Ezoic Leap is Ezoic's site speed improvement toolset. Lazy Load Images is a setting name.*/
  'offscreen-images': 'Use [Ezoic Leap](https://pubdash.ezoic.com/speed) and enable `Lazy Load Images` to defer loading off-screen images until they are needed.',
  /** Additional description of a Lighthouse audit for a third-party framework called `Ezoic`. This is displayed after a user expands the section to see more. No character length limits. Ezoic Leap is Ezoic's site speed improvement toolset. Critical CSS is a setting name.*/
  'render-blocking-resources': 'Use [Ezoic Leap](https://pubdash.ezoic.com/speed) and enable `Critical CSS` and `Script Delay` to defer non-critical JS/CSS.',
  /** Additional description of a Lighthouse audit for a third-party framework called `Ezoic`. This is displayed after a user expands the section to see more. No character length limits. Ezoic Leap is Ezoic's site speed improvement toolset. Minify CSS is a setting name.*/
  'unminified-css': 'Use [Ezoic Leap](https://pubdash.ezoic.com/speed) and enable `Minify CSS` to automatically minify your CSS to reduce network payload sizes.',
  /** Additional description of a Lighthouse audit for a third-party framework called `Ezoic`. This is displayed after a user expands the section to see more. No character length limits. Ezoic Leap is Ezoic's site speed improvement toolset. Minify Javascript is a setting name.*/
  'unminified-javascript': 'Use [Ezoic Leap](https://pubdash.ezoic.com/speed) and enable `Minify Javascript` to automatically minify your JS to reduce network payload sizes.',
  /** Additional description of a Lighthouse audit for a third-party framework called `Ezoic`. This is displayed after a user expands the section to see more. No character length limits. Ezoic Leap is Ezoic's site speed improvement toolset. Efficient Static Cache Policy is a setting name.*/
  'uses-long-cache-ttl': 'Use [Ezoic Leap](https://pubdash.ezoic.com/speed) and enable `Efficient Static Cache Policy` to set recommended values in the caching header for static assests.',
  /** Additional description of a Lighthouse audit for a third-party framework called `Ezoic`. This is displayed after a user expands the section to see more. No character length limits. Ezoic Leap is Ezoic's site speed improvement toolset. Next-Gen Formats is a setting name.*/
  'uses-optimized-images': 'Use [Ezoic Leap](https://pubdash.ezoic.com/speed) and enable `Next-Gen Formats` to convert images to WebP.',
  /** Additional description of a Lighthouse audit for a third-party framework called `Ezoic`. This is displayed after a user expands the section to see more. No character length limits. Ezoic Leap is Ezoic's site speed improvement toolset. Resize Images is a setting name.*/
  'uses-responsive-images': 'Use [Ezoic Leap](https://pubdash.ezoic.com/speed) and enable `Resize Images` to resize images to a device appropriate size, reducing network payload sizes.',
  /** Additional description of a Lighthouse audit for a third-party framework called `Ezoic`. This is displayed after a user expands the section to see more. No character length limits. Ezoic Cloud Caching is Ezoic's CDN.*/
  'server-response-time': 'Use [Ezoic Cloud Caching](https://pubdash.ezoic.com/speed/caching) to cache your content across our world wide network, improving time to first byte.',
  /** Additional description of a Lighthouse audit for a third-party framework called `Ezoic`. This is displayed after a user expands the section to see more. No character length limits. Ezoic Leap is Ezoic's site speed improvement toolset. Pre-Connect Origins is a setting name.*/
  'uses-rel-preconnect': 'Use [Ezoic Leap](https://pubdash.ezoic.com/speed) and enable `Pre-Connect Origins` to automatically add `preconnect` resource hints to establish early connections to important third-party origins.',
  /** Additional description of a Lighthouse audit for a third-party framework called `Ezoic`. This is displayed after a user expands the section to see more. No character length limits. Ezoic Leap is Ezoic's site speed improvement toolset. Preload Fonts and Preload Background Images are setting names.*/
  'uses-rel-preload': 'Use [Ezoic Leap](https://pubdash.ezoic.com/speed) and enable `Preload Fonts` and `Preload Background Images` to add `preload` links to prioritize fetching resources that are currently requested later in page load.',
  /** Additional description of a Lighthouse audit for a third-party framework called `Ezoic`. This is displayed after a user expands the section to see more. No character length limits. Ezoic Leap is Ezoic's site speed improvement toolset. Optimize Fonts is a setting name.*/
  'font-display': 'Use [Ezoic Leap](https://pubdash.ezoic.com/speed) and enable `Optimize Fonts` to automatically leverage the `font-display` CSS feature to ensure text is user-visible while webfonts are loading.',
}

module.exports = {
  id: 'ezoic',
  title: 'Ezoic',
  icon,
  UIStrings,
};