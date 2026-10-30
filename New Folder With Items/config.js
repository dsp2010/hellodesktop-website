// Public settings only. Never put API keys or private credentials in this file.
window.HELLODESK_CONFIG = {
  contact: { email: 'agammjots@gmail.com', phone: '07728 833548', internationalPhone: '+44 7728 833548', whatsapp: 'https://wa.me/447728833548' },
  messages: {
    demo: 'Hello HelloDesk, I would like to arrange a demo for my barber shop.',
    website: 'Hello HelloDesk, I would like to discuss a website for my barber shop.',
    booking: 'Hello HelloDesk, could you check whether you can work with our booking system?',
    support: 'Hello HelloDesk, I need help with our existing setup. Shop name: '
  },
  // Link only to a verified scheduler. No locally invented availability.
  booking: { calendarUrl: '' },
  // Draft-only until a secure delivery service is separately implemented and tested.
  enquiry: { mode: 'draft' },
  support: { hours: '', responseTime: '' },
  demo: { kind: 'walkthrough', videoUrl: '', videoVerified: false },
  evidence: { testimonials: [], customerResults: [] },
  pilot: { price: null, duration: '', inclusions: [] },
  verifiedFeatures: []
};

