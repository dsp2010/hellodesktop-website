/* Fictional scripts and evaluation prompts, not live booking or queue data. */
(() => {
  'use strict';
  const scenarios = [
    {id:'skin-fade', title:'Book a skin fade', label:'Skin fade', prompt:'I’d like to practise booking a skin fade on Friday afternoon.', caller:'Could I book a skin fade on Friday afternoon?', answer:'I can help with that. Do you have a preferred barber, and what part of the afternoon would suit you?', check:'Checks that the shop offers the service, its appointment length and the right staff calendar before offering an available time.'},
    {id:'cut-and-beard', title:'Haircut and beard trim', label:'Haircut + beard trim', prompt:'Can I book a haircut and a beard trim in the same visit?', caller:'Can I book a haircut and a beard trim together?', answer:'Would you like both with the same barber? I’ll need enough time for the combined services before offering an appointment.', check:'Uses the shop’s approved combined service, price and duration. It must not squeeze two services into a slot that is too short.'},
    {id:'preferred-barber', title:'The customer’s preferred barber', label:'Preferred barber', prompt:'I’d like my usual barber. What happens if they’re not working that day?', caller:'I’d like my usual barber. What if they’re not working that day?', answer:'Which barber would you like to see? If they’re unavailable, would you prefer another day with them or to ask about someone else?', check:'Keeps the customer’s preference, checks that person’s working hours and asks before switching to another barber.'},
    {id:'unavailable-time', title:'When a time is unavailable', label:'No suitable slot', prompt:'If Friday afternoon is fully booked, can you help me find another time?', caller:'What if the time I want is fully booked?', answer:'We can look for another time that works for you. Would you prefer another day, or a different barber if your shop offers that option?', check:'Uses the connected diary’s real availability. If the calendar cannot respond, it explains the problem and uses the agreed fallback instead of inventing a slot.'},
    {id:'appointment-change', title:'Change or cancel an appointment', label:'Change or cancellation', prompt:'How would you move an existing appointment, or cancel it if I cannot make it?', caller:'I need to move an existing appointment. Can you help?', answer:'First we need to identify the correct booking. Then we can check your shop’s change policy and look for an alternative before confirming the update.', check:'Identifies the correct booking, follows the shop’s notice rules and confirms only after the supported calendar accepts the change or cancellation.'},
    {id:'walk-ins', title:'Walk-ins and waiting times', label:'Walk-ins', prompt:'Do I need an appointment, and can you tell me how long the walk-in wait is?', caller:'Can I just walk in, and how long is the wait?', answer:'I can explain the shop’s approved walk-in policy. A current waiting time needs live information from the shop; I won’t guess the queue.', check:'Distinguishes the published walk-in policy from a live queue. Without a connected source, the next step is to ask the team rather than quote an invented wait.'},
    {id:'waiting-list', title:'A space opens after cancellation', label:'Waiting list', prompt:'If there are no appointments, could I ask to hear about a cancellation?', caller:'If you’re fully booked, can I ask about a cancellation?', answer:'If your shop offers a supported waiting list, we can explain that process. Otherwise, the agreed next step is to contact the team or check the booking link again.', check:'Only adds or notifies someone through a configured, supported waiting-list workflow with their agreement. The public demo does not enrol anyone or send a message.'}
  ];
  window.HELLODESK_BARBER_SCENARIOS = scenarios;
  if (typeof document === 'undefined') return;
  for (const group of ['call','voice']) {
    const select = document.querySelector('#' + group + '-scenario-select');
    if (!select) continue;
    const panels = [...document.querySelectorAll('[data-scenario-group="' + group + '"]')];
    const controls = document.querySelector('#' + group + '-scenario-controls');
    const status = document.querySelector('#' + group + '-scenario-status');
    const requested = new URLSearchParams(location.search).get('scenario');
    select.value = scenarios.some(s => s.id === requested) ? requested : scenarios[0].id;
    function show() {
      const chosen = scenarios.find(s => s.id === select.value) || scenarios[0];
      select.value = chosen.id;
      for (const panel of panels) panel.hidden = panel.dataset.scenarioId !== chosen.id;
      if (status) status.textContent = chosen.title + ' — fictional example, not a live booking.';
    }
    select.addEventListener('change', show);
    if (controls) controls.hidden = false;
    show();
  }
  for (const audio of document.querySelectorAll('.barber-recording audio')) {
    audio.addEventListener('error', () => {
      const status = document.querySelector('#barber-recording-status');
      if (status) status.textContent = 'The recording could not load. Read the reviewed transcript below.';
    });
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) for (const audio of document.querySelectorAll('.barber-recording audio')) audio.pause();
  });
})();
