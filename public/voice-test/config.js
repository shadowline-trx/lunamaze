// Working name only. The real name gets picked with ASO + trademark checks before launch.
export const CONFIG = Object.freeze({
  brand: 'Voice Depth Test',
  build: '2026-11-12b',
  eventsEndpoint: null, // Gate 2: POST endpoint for funnel events (sendBeacon)
  prices: { weekly: '$4.99', yearly: '$29.99', yearlyPerWeek: '$0.58' },
  // Gate 1 uploads (tester links only). Both values are public by design; set by tools/deploy-voice-test.mjs.
  gate1: { url: 'https://sminymywmtpgeelrynha.supabase.co', publishableKey: 'sb_publishable_qhGuiOA4EcFdEzutxlGIaA_j4N3jPeC' },
});
