(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const saveText = (filename, text) => {
    const blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
    const objectURL = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectURL;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectURL), 10000);
  };
  const form = $('#booking-review-form');
  const P = window.HELLODESK_PACKAGES;
  if (form && P) {
    const actionLabels = {availability: 'Check available appointments', booking: 'Create an appointment', changes: 'Change or cancel a booking', waitlist: 'Handle a waiting-list request'};
    const accessLabels = {unsure: 'Not sure—supported access needs checking', 'provider-review': 'A provider integration route has been suggested; permissions and supported actions still need review', 'no-access': 'No supported integration route known; do not promise live actions'};
    const actionInputs = [...document.querySelectorAll('[data-review-action]')];
    const validPlan = id => typeof id === 'string' && Object.hasOwn(P.byId, id) && ['ai-receptionist', 'bundles'].includes(P.byId[id].category);
    const initialPlan = new URLSearchParams(location.search).get('plan');
    $('#review-package').value = validPlan(initialPlan) ? initialPlan : '';
    let prepared = null;
    const textValue = (id, max) => String($('#' + id).value || '').trim().slice(0, max);
    const plan = () => validPlan($('#review-package').value) ? $('#review-package').value : '';
    const actions = () => [...new Set(actionInputs.filter(input => input.checked && Object.hasOwn(actionLabels, input.dataset.reviewAction)).map(input => input.dataset.reviewAction))];
    function updatePackage() {
      const id = plan();
      $('#review-package-summary').textContent = id ? P.summary(id).join(' ') : 'Package to discuss. No service has been ordered and no integration has been confirmed.';
      $('#review-shop-brief').href = '/barber-setup.html' + (id ? '?plan=' + encodeURIComponent(id) : '');
    }
    function invalidate() {
      prepared = null;
      $('#booking-review-download').disabled = true;
      $('#booking-review-result').hidden = true;
      $('#booking-review-status').textContent = 'Manual review is still required. Prepare your updated brief to keep a copy; no system has been contacted or marked compatible.';
      $('#booking-review-error').hidden = true;
      $('#review-platform').removeAttribute('aria-invalid');
      updatePackage();
    }
    function addSummary(label, value) {
      const row = document.createElement('div'), term = document.createElement('dt'), description = document.createElement('dd');
      term.textContent = label;
      description.textContent = value;
      row.append(term, description);
      $('#booking-review-summary').append(row);
    }
    function prepare(event) {
      event.preventDefault();
      const platform = textValue('review-platform', 100), selectedActions = actions();
      if (!platform || !selectedActions.length) {
        $('#booking-review-error').textContent = !platform ? 'Enter your booking system, paper diary or “not chosen yet” so the review has a starting point.' : 'Choose at least one action you would like reviewed.';
        $('#booking-review-error').hidden = false;
        if (!platform) { $('#review-platform').setAttribute('aria-invalid', 'true'); $('#review-platform').focus(); }
        else $('#booking-review-error').focus();
        return;
      }
      const accessCode = Object.hasOwn(accessLabels, $('#review-access').value) ? $('#review-access').value : 'unsure';
      prepared = {platform, selectedActions, access: accessLabels[accessCode], policy: textValue('review-policy', 1200), planId: plan()};
      $('#booking-review-summary').replaceChildren();
      addSummary('Booking system', prepared.platform);
      addSummary('Actions for review', prepared.selectedActions.map(id => actionLabels[id]).join('; '));
      addSummary('Access information', prepared.access);
      addSummary('Shop rules', prepared.policy || 'To agree during review');
      addSummary('Package', prepared.planId ? P.summary(prepared.planId).join(' ') : 'To discuss');
      $('#booking-review-result').hidden = false;
      $('#booking-review-download').disabled = false;
      $('#booking-review-error').hidden = true;
      $('#review-platform').removeAttribute('aria-invalid');
      $('#booking-review-status').textContent = 'Your review brief is prepared on this page. Compatibility is not confirmed: provider access, agreed actions and real booking tests still need manual review. Nothing has been submitted.';
      $('#review-heading').focus();
    }
    form.addEventListener('submit', prepare);
    form.addEventListener('input', invalidate);
    form.addEventListener('change', invalidate);
    $('#booking-review-download').addEventListener('click', () => {
      if (!prepared) return;
      const lines = ['HELLODESK — BARBER BOOKING-SYSTEM REVIEW BRIEF', 'MANUAL REVIEW REQUIRED — compatibility has NOT been confirmed.', 'Prepared locally. Nothing has been sent to HelloDesk or the booking provider.', '',
        'Booking system: ' + prepared.platform, 'Requested actions: ' + prepared.selectedActions.map(id => actionLabels[id]).join('; '), 'Access information: ' + prepared.access, 'Shop rules / walk-in or waiting-list policy: ' + (prepared.policy || 'To agree'), '', 'PACKAGE OF INTEREST',
        ...(prepared.planId ? P.summary(prepared.planId) : ['To discuss']), '', 'REVIEW BEFORE COMMITTING', '1. Confirm the booking provider’s permitted access, permissions and supported actions.', '2. Agree which services, staff diaries, rules and fallback paths apply.', '3. Test real calendar reads and accepted writes, changes/cancellation identity checks, duplicate requests and failures.', '4. Review actual telephone routing and caller privacy information before go-live.', '', 'The public browser voice demo is practice only. This brief is not a compatibility approval, order, appointment, service agreement or activation.'];
      saveText('hellodesk-booking-system-review.txt', lines.join('\r\n'));
      $('#booking-review-status').textContent = 'Your local download has started. Share your copy through the contact channel you already use with the team. No enquiry, compatibility approval or live booking has been created.';
    });
    $('#booking-review-prepare').disabled = false;
    updatePackage();
  }
  const walkthrough = $('#proof-script-download');
  if (walkthrough) {
    walkthrough.disabled = false;
    walkthrough.addEventListener('click', () => {
      const steps = [...document.querySelectorAll('[data-proof-test]')].map((element, index) => `${index + 1}. ${element.querySelector('h3').textContent}\r\n${element.querySelector('p').textContent}`);
      saveText('hellodesk-barber-booking-test-walkthrough.txt', ['HELLODESK — CONTROLLED BARBER BOOKING TEST WALKTHROUGH', 'TEST GUIDE ONLY — no tests are run, verified or passed by downloading this file.', 'Use an agreed test calendar and fictional customer information. Do not record or publish real customer data.', '', ...steps, '', 'CHECK THE COMPLETE JOURNEY', 'Verify accepted calendar records, correct staff/service/duration, no overlapping bookings, safe retries, correct rescheduling and cancellation, a useful failure fallback, the actual telephone call and any agreed messages.', '', 'Record what was checked, when, by whom and any failure. Obtain permission before publishing any recording or feedback. The owner and team review go-live separately.'].join('\r\n'));
      $('#proof-download-status').textContent = 'Test walkthrough download started. This is a guide to run with the team, not proof that a connection has passed.';
    });
  }
})();
