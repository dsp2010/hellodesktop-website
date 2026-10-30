/* Public catalogue. Prices and allowances are shared by pages and setup briefs. */
(function () {
  'use strict';
  const money = amount => new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP', minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2}).format(amount);
  const number = amount => new Intl.NumberFormat('en-GB').format(amount);
  const categories = [
    {id: 'ai-receptionist', name: 'AI Receptionist', description: 'A helpful first hello, built around your business.', planIds: ['ai-essential', 'ai-growth', 'ai-pro', 'ai-plus']},
    {id: 'websites', name: 'Websites', description: 'A website that looks like your business and works around your customers.', planIds: ['web-launch', 'web-business', 'web-growth']},
    {id: 'bundles', name: 'Receptionist + Website Bundles', description: 'Your online presence and your first conversation, brought together.', planIds: ['bundle-essential', 'bundle-growth', 'bundle-pro']}
  ];
  const terms = {
    websiteInitialTermMonths: 12,
    renewalNoticeDays: 30,
    domainAnnualAllowance: 25,
    receptionistSetup: 'The setup fee is paid before building. The subscription starts at the agreed go-live date.',
    availability: 'AI answering can operate around the clock, subject to service availability. Human support operates during agreed business hours.',
    calendar: 'A staff calendar is a separately managed appointment diary for a team member or resource.',
    sms: 'SMS allowances count segments, not messages. Longer messages and some characters can use more than one segment.',
    updates: 'Small information updates include changing opening hours, service prices or FAQs. New workflows and major changes require a separate quote.',
    agreement: 'Detailed ownership, early cancellation and source-code handover provisions are set out in the service agreement.',
    paymentLinks: 'A payment-link workflow sends a secure hosted payment link and confirms payment status. Card details are not collected verbally.',
    outright: 'Hosting, maintenance and any ongoing services are agreed separately in your quote.'
  };
  const packages = [
    {id: 'ai-essential', category: 'ai-receptionist', name: 'Essential Receptionist', shortName: 'Essential', monthly: 199, setup: 299, minutes: 250, sms: 100, calendars: 1, extraMinute: 0.49, infoUpdates: 1, description: 'For smaller businesses with light call volumes.', recommended: false},
    {id: 'ai-growth', category: 'ai-receptionist', name: 'Growth Receptionist', shortName: 'Growth', monthly: 349, setup: 499, minutes: 750, sms: 300, calendars: 3, extraMinute: 0.45, infoUpdates: 2, description: 'For barber shops managing regular appointment enquiries.', recommended: true},
    {id: 'ai-pro', category: 'ai-receptionist', name: 'Pro Receptionist', shortName: 'Pro', monthly: 599, setup: 699, minutes: 1500, sms: 600, calendars: 6, extraMinute: 0.39, infoUpdates: 3, description: 'For busier teams with several staff calendars.', recommended: false},
    {id: 'ai-plus', category: 'ai-receptionist', name: 'Plus Receptionist', shortName: 'Plus', monthly: 999, setup: 999, minutes: 3000, sms: 1200, calendars: 10, extraMinute: 0.35, infoUpdates: 4, description: 'For high-volume businesses needing a larger monthly allowance.', recommended: false},
    {id: 'web-launch', category: 'websites', name: 'Launch Website', shortName: 'Launch', monthly: 89, setup: 249, pages: 1, editMinutes: 30, revisions: 2, initialTermMonths: terms.websiteInitialTermMonths, description: 'A focused one-page home for your business.', recommended: false},
    {id: 'web-business', category: 'websites', name: 'Business Website', shortName: 'Business', monthly: 129, setup: 449, pages: 5, editMinutes: 60, revisions: 2, initialTermMonths: terms.websiteInitialTermMonths, description: 'Room for your services, your story and your next enquiry.', recommended: false},
    {id: 'web-growth', category: 'websites', name: 'Growth Website', shortName: 'Growth', monthly: 219, setup: 899, pages: 10, editMinutes: 120, revisions: 3, initialTermMonths: terms.websiteInitialTermMonths, description: 'More pages and more time for an evolving business.', recommended: false},
    {id: 'bundle-essential', category: 'bundles', name: 'Essential Bundle', shortName: 'Essential Bundle', monthly: 269, setup: 449, receptionistId: 'ai-essential', websiteId: 'web-launch', initialTermMonths: terms.websiteInitialTermMonths, description: 'A clear online introduction and a helpful first call.', recommended: false},
    {id: 'bundle-growth', category: 'bundles', name: 'Growth Bundle', shortName: 'Growth Bundle', monthly: 459, setup: 749, receptionistId: 'ai-growth', websiteId: 'web-business', initialTermMonths: terms.websiteInitialTermMonths, description: 'A connected starting point for busy barber shops.', recommended: true},
    {id: 'bundle-pro', category: 'bundles', name: 'Pro Bundle', shortName: 'Pro Bundle', monthly: 769, setup: 1199, receptionistId: 'ai-pro', websiteId: 'web-growth', initialTermMonths: terms.websiteInitialTermMonths, description: 'A broader website and call coverage for a busier team.', recommended: false}
  ];
  const byId = Object.fromEntries(packages.map(plan => [plan.id, plan]));
  for (const plan of packages.filter(plan => plan.category === 'bundles')) plan.savingMonthly = byId[plan.receptionistId].monthly + byId[plan.websiteId].monthly - plan.monthly;
  const receptionistFeatures = [
    'Business-specific greeting and voice configuration.',
    'Answers based on your supplied opening hours, services, prices and FAQs.',
    'Customer name, contact details and appointment requirements captured during the call.',
    'Live availability checks and appointment booking through a supported integration.',
    'Rescheduling and cancellation through supported integrations, with checks to identify the correct booking.',
    'Booking confirmations and reminders within the included SMS allowance.',
    'One human transfer destination and message capture when staff are unavailable.',
    'One UK local telephone number, or forwarding from an existing business number where supported.',
    'Regular test bookings, failure monitoring and a monthly usage summary.'
  ];
  const receptionistSetupFeatures = ['Business onboarding and information collection.', 'Agent configuration.', 'Agreed calendar connection.', 'Telephone setup.', 'Test calls and booking checks.', 'Handover before go-live.'];
  const websiteFeatures = [
    'Custom website design using your business’s branding.',
    'Responsive layouts for mobile, tablet and desktop.',
    'Service information, prices and contact details.',
    'Booking links and enquiry buttons.',
    'Contact form where included in the agreed scope.',
    'Map and gallery where appropriate.',
    'Hosting management and HTTPS.',
    'Source-code backups.',
    'Basic search setup, including page titles and descriptions.',
    `One standard domain, including annual registration or renewal up to ${money(terms.domainAnnualAllowance)}.`,
    'Ongoing small content edits within your package allowance.'
  ];
  const websiteScope = [
    'Domain availability must be checked before purchase. The domain is registered in your business name.',
    `Premium domains and domains costing over ${money(terms.domainAnnualAllowance)}/year require an additional payment.`,
    'Business email subscriptions are separate.',
    'Ecommerce, customer accounts, bespoke booking engines, databases and major redesigns require a separate quote.',
    'Client photographs and other assets must be supplied or appropriately licensed.',
    'Search rankings and business results are not guaranteed.'
  ];
  const addOns = [
    {id: 'extra-sms', name: 'Extra UK SMS', price: 15, quantity: 100, unit: 'segments', detail: 'Transactional confirmations and reminders.'},
    {id: 'staff-calendar', name: 'Additional staff calendar', setup: 99, monthly: 15, detail: 'Supported integration required.'},
    {id: 'payment-workflow', name: 'Deposit/payment-link workflow', setup: 199, monthly: 29, detail: 'Merchant processing fees extra.'},
    {id: 'location', name: 'Additional location management', setup: 199, monthly: 99, from: true, detail: 'A separate usage package is additional.'},
    {id: 'website-page', name: 'Extra website page', price: 99, detail: 'Client supplies the content.'},
    {id: 'support', name: 'Additional support or edits', price: 60, unit: 'hour', minimumMinutes: 30, detail: 'Minimum billing increment applies.'},
    {id: 'email', name: 'Business email setup', price: 49, detail: 'Mailbox subscription extra.'},
    {id: 'booking-integration', name: 'Booking-platform integration', setup: 299, from: true, detail: 'Subject to supported access and complexity.'},
    {id: 'voice-widget', name: 'Website voice widget', setup: 99, detail: 'Uses the receptionist minute allowance.'},
    {id: 'human-transfer', name: 'Connected human transfer', price: 0.12, unit: 'minute', detail: 'Standard UK routes; other routes quoted separately.'}
  ];
  const outright = [{pages: 1, label: 'One-page website', from: 799}, {pages: 5, label: 'Up to five pages', from: 1499}, {pages: 10, label: 'Up to ten pages', from: 2499}];
  const vatNote = 'VAT added where applicable.';
  const receptionistFor = id => { const plan = byId[id]; return plan?.category === 'ai-receptionist' ? plan : byId[plan?.receptionistId] || null; };
  const websiteFor = id => { const plan = byId[id]; return plan?.category === 'websites' ? plan : byId[plan?.websiteId] || null; };
  const calendarText = count => count === 1 ? '1 staff calendar' : `Up to ${number(count)} staff calendars`;
  const websiteTerm = `${terms.websiteInitialTermMonths}-month initial term, then monthly renewal with ${terms.renewalNoticeDays} days’ notice.`;
  function describe(id) {
    const plan = Object.hasOwn(byId, id) ? byId[id] : null;
    if (!plan) return [];
    const receptionist = receptionistFor(id), website = websiteFor(id);
    const lines = [`${plan.name}: ${money(plan.monthly)}/month + ${money(plan.setup)} one-time setup.`, vatNote];
    if (receptionist) lines.push(`${number(receptionist.minutes)} AI minutes and ${number(receptionist.sms)} UK SMS segments/month.`, `${calendarText(receptionist.calendars)}; ${receptionist.infoUpdates} small information update request${receptionist.infoUpdates === 1 ? '' : 's'}/month.`, `Extra AI minutes: ${money(receptionist.extraMinute)} each.`, `Extra UK SMS: ${addOnPrice(addOns.find(service => service.id === 'extra-sms'))}. Connected human transfer: ${addOnPrice(addOns.find(service => service.id === 'human-transfer'))} on standard UK routes.`, terms.receptionistSetup);
    if (website) lines.push(`${website.pages === 1 ? '1 website page' : `Up to ${number(website.pages)} website pages`}; ${number(website.editMinutes)} minutes of small content edits/month; ${website.revisions} initial revision rounds.`, `One standard domain: annual registration or renewal up to ${money(terms.domainAnnualAllowance)}.`, websiteTerm);
    if (plan.category === 'bundles') lines.push(`Includes ${receptionist.name} + ${website.name}.`, `Save ${money(plan.savingMonthly)}/month compared with buying those packages separately.`);
    return lines;
  }
  function snapshot(id) {
    const plan = Object.hasOwn(byId, id) ? byId[id] : null;
    if (!plan) return null;
    const copy = {...plan};
    if (plan.category === 'bundles') {copy.receptionist = {...byId[plan.receptionistId]}; copy.website = {...byId[plan.websiteId]};}
    return copy;
  }
  function addOnPrice(service) {
    const prefix = service.from ? 'From ' : '';
    if (service.setup !== undefined) return prefix + money(service.setup) + ' setup' + (service.monthly !== undefined ? ` + ${money(service.monthly)}/month` : '');
    if (service.quantity) return `${money(service.price)} per ${number(service.quantity)} ${service.unit}`;
    return money(service.price) + (service.unit ? '/' + service.unit : '');
  }
  window.HELLODESK_PACKAGES = {currency: 'GBP', categories, packages, byId, money, number, vatNote, terms, websiteTerm, calendarText, receptionistFeatures, receptionistSetupFeatures, websiteFeatures, websiteScope, addOns, outright, receptionistFor, websiteFor, describe, summary: describe, snapshot, addOnPrice};
}());

