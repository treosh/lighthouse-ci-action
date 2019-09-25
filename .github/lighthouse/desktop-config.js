module.exports = {
  extends: 'lighthouse:default',
  settings: {
    emulatedFormFactor: 'desktop',
    throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
    audits: [
      { path: 'metrics/first-contentful-paint', options: { scorePODR: 800, scoreMedian: 1600 } },
      { path: 'metrics/first-meaningful-paint', options: { scorePODR: 800, scoreMedian: 1600 } },
      { path: 'metrics/speed-index', options: { scorePODR: 1100, scoreMedian: 2300 } },
      { path: 'metrics/interactive', options: { scorePODR: 2000, scoreMedian: 4500 } },
      { path: 'metrics/first-cpu-idle', options: { scorePODR: 2000, scoreMedian: 4500 } }
    ]
  }
}
