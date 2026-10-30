(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const form = $('#barber-setup-form');
  const P = window.HELLODESK_PACKAGES;
  if (!form || !P) return;
  const panels = [...document.querySelectorAll('[data-barber-step]')];
  const stepLinks = [...document.querySelectorAll('[data-barber-step-link]')];
  const tests = [...document.querySelectorAll('[data-barber-test]')];
  const allowed = id => typeof id === 'string' && Object.hasOwn(P.byId, id);
  const requested = new URLSearchParams(location.search).get('plan');
  const initialPackage = allowed(requested) ? requested : '';
  const fieldSpecs = [
    ['barber-shop-name', 'Barber shop', 100],
    ['barber-platform', 'Current booking system', 100],
    ['barber-business-number', 'Public business telephone', 40],
    ['barber-website', 'Public website or booking link', 300],
    ['barber-services', 'Services, prices and appointment lengths', 1800],
    ['barber-availability', 'Staff calendars, hours and booking limits', 1800],
    ['barber-changes', 'Changes, cancellations and deposits', 1800],
    ['barber-fallback', 'Team handover and failure fallback', 1800],
    ['barber-preferences', 'Greeting, messages and website preferences', 1500]
  ];
  const resultLabels = {
    'not-tested': 'NOT YET TESTED',
    passed: 'MANUALLY REPORTED PASS — not independently verified',
    'needs-work': 'NEEDS WORK'
  };
  let step = 1;
  let clearPending = false;
  let resetTimer;
  $('#barber-package').value = initialPackage;

  function value(id, max) { return String($('#' + id)?.value || '').trim().slice(0, max); }
  function selectedPackage() { const id = $('#barber-package').value; return allowed(id) ? id : ''; }
  function testResult(test) { return Object.hasOwn(resultLabels, test.value) ? test.value : 'not-tested'; }
  function updatePackage() {
    const id = selectedPackage();
    $('#barber-package-summary').textContent = id ? P.summary(id).join(' ') : 'Package to discuss. Compare your expected call volume, staff calendars and any website requirements before choosing. No package has been ordered.';
  }
  function addReview(label, text) {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = label;
    description.textContent = text;
    row.append(term, description);
    $('#barber-review').append(row);
  }
  function review() {
    $('#barber-review').replaceChildren();
    const id = selectedPackage();
    for (const [field, label, max] of fieldSpecs) addReview(label, value(field, max) || 'To agree');
    addReview('Package of interest', id ? P.summary(id).join(' ') : 'To discuss — no package selected');
    updateTests();
  }
  function updateTests() {
    const checked = tests.filter(test => testResult(test) !== 'not-tested').length;
    const needsWork = tests.filter(test => testResult(test) === 'needs-work').length;
    $('#barber-test-status').textContent = checked === 0 ? 'No real-service tests have been reported. All ' + tests.length + ' checks still need to be completed against the real connected service.' : `${checked} of ${tests.length} results entered manually; ${needsWork} marked as needing work. These are review notes. This website has not verified or activated the service.`;
  }
  function show(next, focus = true) {
    step = next;
    for (const panel of panels) panel.hidden = Number(panel.dataset.barberStep) !== step;
    for (const link of stepLinks) {
      if (Number(link.dataset.barberStepLink) === step) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    }
    $('#barber-back').hidden = step === 1;
    $('#barber-next').hidden = step === 3;
    $('#barber-next').textContent = step === 1 ? 'Next: booking rules →' : 'Review my shop brief →';
    $('#barber-step-status').textContent = `Step ${step} of 3`;
    $('#barber-setup-error').hidden = true;
    if (step === 3) review();
    if (focus) $('#barber-step-title-' + step).focus();
  }
  function next() { show(Math.min(3, step + 1)); }
  function download() {
    review();
    const id = selectedPackage();
    const lines = [
      'HELLODESK — BARBER SHOP SETUP BRIEF & LIVE TEST CHECKLIST',
      'Working document for discussion. Not an order, service agreement, appointment, verified test record or launch approval.',
      'This document was downloaded locally. Nothing has been submitted to HelloDesk.',
      '', 'SHOP & BOOKING RULES',
      ...fieldSpecs.map(([field, label, max]) => `${label}: ${value(field, max) || 'To agree'}`),
      '', 'PACKAGE OF INTEREST',
      ...(id ? [`${P.byId[id].name} (${id})`, ...P.summary(id)] : ['To discuss — no package selected.']),
      '', 'SUPPORTED CONNECTIONS & GO-LIVE',
      'Confirm supported booking-system access, number routing, approved business rules and caller privacy information. Test the real calendar and telephone connection before go-live.',
      P.terms.receptionistSetup,
      '', 'MANUALLY REPORTED LIVE TEST RESULTS',
      'These checks are entered by the person using the worksheet. This website does not run them or independently verify any result. A browser practice booking is not a real calendar test.',
      ...tests.map((test, index) => `${index + 1}. ${test.dataset.testName}: ${resultLabels[testResult(test)]}`),
      '', 'Test notes and outstanding decisions: ' + (value('barber-test-notes', 1800) || 'None entered — tests and outstanding decisions still need to be reviewed.'),
      '', 'Final scope, service agreement and launch approval must be agreed separately. No service is activated by this document.'
    ];
    const blob = new Blob([lines.join('\r\n')], {type: 'text/plain;charset=utf-8'});
    const objectURL = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectURL;
    anchor.download = 'hellodesk-barber-shop-brief.txt';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(objectURL), 10000);
    $('#barber-save-status').textContent = 'Download started. Keep your copy before leaving this page. Nothing has been sent to HelloDesk, booked or activated.';
  }
  function reset() {
    if (!clearPending) {
      clearPending = true;
      $('#barber-reset').textContent = 'Press again to clear all entries';
      $('#barber-save-status').textContent = 'Clearing removes this page’s entries and manually reported test results. Download a copy first if you need to keep them.';
      resetTimer = setTimeout(() => { clearPending = false; $('#barber-reset').textContent = 'Clear this working sheet'; }, 10000);
      return;
    }
    clearTimeout(resetTimer);
    clearPending = false;
    form.reset();
    for (const [field] of fieldSpecs) $('#' + field).value = '';
    $('#barber-test-notes').value = '';
    $('#barber-package').value = '';
    for (const test of tests) test.value = 'not-tested';
    $('#barber-shop-name').removeAttribute('aria-invalid');
    $('#barber-reset').textContent = 'Clear this working sheet';
    updatePackage();
    review();
    show(1);
    $('#barber-save-status').textContent = 'Working sheet cleared. Nothing has been sent or saved by HelloDesk.';
  }
  form.addEventListener('submit', event => { event.preventDefault(); if (step < 3) next(); });
  form.addEventListener('input', () => { $('#barber-shop-name').removeAttribute('aria-invalid'); $('#barber-setup-error').hidden = true; if (step === 3) review(); });
  $('#barber-package').addEventListener('change', () => { updatePackage(); if (step === 3) review(); });
  for (const test of tests) test.addEventListener('change', updateTests);
  for (const link of stepLinks) {
    link.disabled = false;
    link.addEventListener('click', () => show(Number(link.dataset.barberStepLink)));
  }
  $('#barber-back').addEventListener('click', () => show(Math.max(1, step - 1)));
  $('#barber-next').addEventListener('click', next);
  $('#barber-download').addEventListener('click', download);
  $('#barber-reset').addEventListener('click', reset);
  $('#barber-download').disabled = false;
  $('#barber-reset').disabled = false;
  $('#barber-step-navigation').hidden = false;
  updatePackage();
  updateTests();
  show(1, false);
})();

