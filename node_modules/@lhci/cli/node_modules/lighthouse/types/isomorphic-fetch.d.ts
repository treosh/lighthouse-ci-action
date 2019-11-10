declare module 'isomorphic-fetch' {
  // Just reuse the types from the built-in window.fetch
  export = window.fetch
}
