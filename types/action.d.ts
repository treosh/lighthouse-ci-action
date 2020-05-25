declare module '@lhci/utils/src/lighthouserc' {
  export function loadRcFile(
    path: string
  ): { ci?: { collect?: { url?: [string]; staticDistDir?: string; numberOfRuns?: number } } }
}
