declare module '@lhci/utils/src/lighthouserc.js' {
  export function loadRcFile(path: string): {
    ci?: { collect?: { url?: [string]; staticDistDir?: string; numberOfRuns?: number } }
  }
}
