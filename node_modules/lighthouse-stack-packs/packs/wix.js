const icon = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 71 28"><path fill-rule="evenodd" d="M0 .032s2.796-.356 4.66 1.31C5.81 2.37 6.145 4.008 6.145 4.008L9.952 18.96l3.165-12.239c.309-1.301.864-2.909 1.743-3.997 1.121-1.385 3.398-1.472 3.641-1.472.242 0 2.519.087 3.639 1.472.88 1.088 1.435 2.696 1.744 3.997l3.165 12.239 3.806-14.953s.336-1.638 1.486-2.666C34.205-.324 37 .032 37 .032l-7.289 27.945s-2.404.176-3.607-.446c-1.58-.816-2.332-1.447-3.289-5.249l-.099-.395c-.349-1.399-.883-3.59-1.424-5.813l-.162-.667-.162-.664c-.779-3.198-1.497-6.143-1.612-6.517-.108-.351-.236-1.187-.855-1.187-.607 0-.746.837-.857 1.187-.13.412-.99 3.955-1.856 7.514l-.162.667c-.512 2.107-1.01 4.151-1.341 5.48l-.1.395c-.956 3.802-1.708 4.433-3.288 5.249-1.204.622-3.608.446-3.608.446zM43.998 5v.995L44 5.994v16.628c-.014 3.413-.373 4.17-1.933 4.956-1.213.61-3.067.379-3.067.379V9.332c0-.935.315-1.548 1.477-2.098.693-.329 1.34-.58 2.012-.953C43.54 5.703 43.998 5 43.998 5zM46 .125s3.877-.673 5.797 1.107c1.228 1.14 2.602 3.19 2.602 3.19l3.38 4.965c.164.258.378.54.72.54.343 0 .558-.282.722-.54l3.38-4.965s1.374-2.05 2.602-3.19C67.123-.548 71 .125 71 .125l-9.186 13.923 9.161 13.881-.032.004c-.38.045-4.036.423-5.855-1.266-1.229-1.138-2.487-2.992-2.487-2.992l-3.38-4.964c-.164-.26-.379-.54-.721-.54-.343 0-.557.28-.721.54l-3.38 4.964s-1.19 1.854-2.418 2.992c-1.92 1.783-5.957 1.262-5.957 1.262l9.161-13.88zM43.96 0H44c0 1.91-.186 3.042-1.387 3.923-.384.28-1.048.71-1.826.992C39.719 5.304 39 6 39 6c0-3.476.53-4.734 1.95-5.48.865-.452 2.272-.514 2.82-.52z"></path></svg>`;

const UIStrings = {
  /** Additional description of a Lighthouse audit that tells the user to optimize image formats, in the context of the Wix CMS platform. */
  "modern-image-formats": "Upload images using `Wix Media Manager` to ensure they are automatically served as WebP. Find [more ways to optimize](https://support.wix.com/en/article/site-performance-optimizing-your-media) your site's media.",
  /** Additional description of a Lighthouse audit that tells the user to defer loading of non-critical third-party libraries, in the context of the Wix CMS platform. */
  "render-blocking-resources": "When [adding third-party code](https://support.wix.com/en/article/site-performance-using-third-party-code-on-your-site) in the `Custom Code` tab of your site's dashboard, make sure it's deferred or loaded at the end of the code body. Where possible, use Wix’s [integrations](https://support.wix.com/en/article/about-marketing-integrations) to embed marketing tools on your site. ",
  /** Additional description of a Lighthouse audit that tells the user how they can improve performance by avoiding animated images and using videos where possible, in the context of the Wix CMS platform. */
  "efficient-animated-content": "Place videos inside `VideoBoxes`, customize them using `Video Masks` or add `Transparent Videos`. [Learn more](https://support.wix.com/en/article/wix-video-about-wix-video).",
  /** Additional description of a Lighthouse audit that tells the user to be aware of JavaScript code that is not used, particularly from third-parties, in the context of the Wix CMS platform. */
  "unused-javascript": "Review any third-party code you've added to your site in the `Custom Code` tab of your site's dashboard and only keep the services that are necessary to your site. [Find out more](https://support.wix.com/en/article/site-performance-removing-unused-javascript).",
  /** Additional description of a Lighthouse audit that tells the user how they can improve the server response time, in the context of the Wix CMS platform. */
  "server-response-time": "Wix utilizes CDNs and caching to serve responses as fast as possible for most visitors. Consider [manually enabling caching](https://support.wix.com/en/article/site-performance-caching-pages-to-optimize-loading-speed) for your site, especially if using `Velo`.",
}

module.exports = {
  id: 'wix',
  title: 'Wix',
  icon,
  UIStrings,
};
