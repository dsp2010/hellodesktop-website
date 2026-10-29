// Public configuration only. Package data is maintained once in packages.js.
(() => {
const P = window.HELLODESK_PACKAGES;
window.HELLODESK_CONFIG = {
  product: { channel: 'telephone' },
  prices: Object.fromEntries(P.packages.map(p => [p.id, p.monthly])),
  paymentLinks: Object.fromEntries(P.packages.map(p => [p.id, ''])),
  salesOpen: false,
  // User-approved temporary voice demonstration; real assistants take precedence.
  browserDemo: { enabled: true },
  // Public demo IDs only. Voice IDs and secret API keys do not belong here.
  voiceAgents: { barber: { provider: 'elevenlabs', agentId: 'agent_8201m5n282qfe5abth4gdcctr0zc', enabled: true } },
  plans: P.byId,
  // Online checkout stays unavailable until payment links and agreements exist.
  terms: { tax: P.vatNote, cancellation: null, activation: 'The setup fee is paid before building. The subscription starts at the agreed go-live date.', url: '', privacyUrl: '' },
  // Calendar URL OR a verified JSON enquiry endpoint. Both empty = unavailable.
  booking: { calendarUrl: '', endpoint: '', responseMessage: '' },
  trust: { team: [], email: '', videoUrl: '', testimonials: [] },
  // Only reviewed, permission-approved evidence is rendered by the proof page.
  barberProof: { bookingDemo: { url: '', transcript: '', verified: false, consentConfirmed: false }, pilots: [] },
  // Recording, transcription and retention explanation must be supplied before voice activation.
  // Publish real recordings only after reviewing the audio, transcript and permission to share.
  callSamples: Object.fromEntries(['barber'].map(id => [id,{url:'',transcript:'',verified:false,consentConfirmed:false}])),
  voicePrivacy: ''
};
window.HELLODESK_VOICE = Object.fromEntries(
  ['barber']
    .map(id => [id, { embedUrl: '', verified: false, protocol: '' }])
);
})();
