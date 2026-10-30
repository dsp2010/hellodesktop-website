(() => {
  'use strict';
  const C = window.HELLODESK_CONFIG;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);
  const wa = text => C.contact.whatsapp + '?text=' + encodeURIComponent(text);
  $$('[data-whatsapp]').forEach(a => { a.href = wa(C.messages[a.dataset.whatsapp] || C.messages.demo); });
  const menu = $('.menu-toggle');
  function closeMenu() { menu?.setAttribute('aria-expanded', 'false'); $('#navigation')?.classList.remove('is-open'); }
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); $('#navigation').classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
  $$('#navigation a').forEach(a => a.addEventListener('click', closeMenu));
  for(const [key,id] of [['hours','support-hours'],['responseTime','support-response']]) {
    const el=$('#'+id); if(el && C.support[key]) {el.hidden=false;el.textContent=C.support[key];}
  }
  const scheduler = $('#scheduler');
  if (scheduler && C.booking.calendarUrl) {
    try { const url=new URL(C.booking.calendarUrl); if(url.protocol==='https:') { scheduler.href=url.href; scheduler.hidden=false; } } catch { /* Contact remains available. */ }
  }

  const enquiry = $('#enquiry');
  if (enquiry) {
    const interest=$('#interest'), reply=$('#reply'), address=$('#reply-address');
    const validInterests=[...interest.options].map(o=>o.value);
    if(validInterests.includes(params.get('interest'))) interest.value=params.get('interest');
    const P=window.HELLODESK_PACKAGES, requested=params.get('plan');
    const selectedPlan=Object.hasOwn(P.byId,requested || '') ? P.byId[requested] : null;
    if(selectedPlan) { $('#chosen-plan').hidden=false; $('#chosen-plan').textContent='To discuss: '+P.describe(selectedPlan.id).join(' '); }
    function sync() {
      const phone=reply.value==='whatsapp';
      address.type=phone?'tel':'email'; address.autocomplete=phone?'tel':'email'; address.maxLength=phone?30:254;
      $('#reply-label').textContent=phone?'Your WhatsApp number':'Your email address';
      $('#reply-help').textContent=phone?'Include your country code if outside the UK.':'We’ll use this address to reply to your enquiry.';
      const booking=['booking','pilot'].includes(interest.value);
      $('#booking-fields').hidden=!booking; $('#booking-fields').disabled=!booking;
      $('#demo-fields').hidden=interest.value!=='demo'; $('#demo-fields').disabled=interest.value!=='demo';
      $('#pilot-note').hidden=interest.value!=='pilot'; address.setCustomValidity('');
    }
    reply.addEventListener('change',sync); interest.addEventListener('change',sync);
    address.addEventListener('input',()=>address.setCustomValidity(''));
    sync(); enquiry.hidden=false;
    const dialog=$('#message-review');
    $('#close-review').addEventListener('click',()=>dialog.close());
    enquiry.addEventListener('submit',event=>{
      event.preventDefault();
      const phone=address.value.trim();
      if(reply.value==='whatsapp' && (!/^\+?[\d\s().-]{7,30}$/.test(phone)||phone.replace(/\D/g,'').length<7))
        address.setCustomValidity('Enter a phone number with at least 7 digits.');
      else address.setCustomValidity('');
      if(!enquiry.reportValidity()) return;
      for(const id of ['shop','contact-name']) {
        if(!$('#'+id).value.trim()) { $('#'+id).setCustomValidity('Please enter a name.'); $('#'+id).reportValidity(); return; }
      }
      const lines=['Hello HelloDesk,','',interest.selectedOptions[0].textContent,
        'Shop: '+$('#shop').value.trim(),'Contact: '+$('#contact-name').value.trim(),
        'Please reply by '+(reply.value==='whatsapp'?'WhatsApp':'email')+': '+address.value.trim()];
      if(selectedPlan) lines.push('Package of interest: '+P.describe(selectedPlan.id).join(' '));
      if(!$('#booking-fields').disabled) lines.push('Booking method: '+$('#booking-method').value,'Help wanted: '+$('#booking-help').value);
      if(!$('#demo-fields').disabled && $('#preferred-time').value.trim()) lines.push('Preferred demo time (request only): '+$('#preferred-time').value.trim());
      if($('#question').value.trim()) lines.push('Question: '+$('#question').value.trim());
      if(interest.value==='pilot') lines.push('Pilot terms and suitability to be agreed. This is an application only.');
      const message=lines.join('\n');
      $('#message-text').textContent=message;
      $('#draft-email').href='mailto:'+C.contact.email+'?subject='+encodeURIComponent('HelloDesk — '+interest.selectedOptions[0].textContent)+'&body='+encodeURIComponent(message);
      $('#draft-whatsapp').href=wa(message);
      $('#draft-status').textContent='Review your details below. Opening a draft does not send it.';
      dialog.showModal();
    });
    ['shop','contact-name'].forEach(id=>$('#'+id).addEventListener('input',()=>$('#'+id).setCustomValidity('')));
    ['draft-email','draft-whatsapp'].forEach(id=>$('#'+id).addEventListener('click',()=>{ $('#draft-status').textContent='Finish and send the message in your email app or WhatsApp. This website cannot confirm delivery.'; }));
  }

  const check=$('#booking-check-form');
  if(check) {
    check.hidden=false;
    check.addEventListener('submit',e=>{
      e.preventDefault(); $('#booking-result').hidden=false;
      $('#booking-check-link').href=wa('Hello HelloDesk, our booking method is '+$('#shop-booking').value+'. We would like help with '+$('#shop-help').value+'. Could you check our setup?');
      $('#booking-result-title').focus();
    });
  }

  const calculator=$('#calculator');
  if(calculator) {
    const fields=['missed','days','conversion','value'].map(id=>$('#'+id));
    function calculate() {
      const values=fields.map(el=>el.value===''?0:Number(el.value));
      const invalid=fields.some((el,i)=>!el.validity.valid||!Number.isFinite(values[i]));
      $('#calc-error').textContent=invalid?'Use values within the limits shown.':'';
      const total=values[0]*values[1], appointments=total*values[2]/100, revenue=appointments*values[3];
      const n=new Intl.NumberFormat('en-GB',{maximumFractionDigits:2});
      $('#monthly-enquiries').textContent=invalid?'—':n.format(total);
      $('#additional-appointments').textContent=invalid?'—':n.format(appointments);
      $('#gross-revenue').textContent=invalid?'—':new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:2}).format(revenue);
    }
    fields.forEach(el=>el.addEventListener('input',calculate));calculate();
  }

  const example=$('#receptionist-example');
  if(example) {
    const panels=$$('[data-example-step]');let step=0;
    function show(){
      panels.forEach((p,i)=>p.hidden=i!==step);
      $('#example-progress').textContent='Step '+(step+1)+' of '+panels.length;
      $('#example-back').disabled=step===0; $('#example-next').hidden=step===panels.length-1;
      $('#example-reset').hidden=step!==panels.length-1;
    }
    $('#example-next').addEventListener('click',()=>{step=Math.min(step+1,panels.length-1);show();panels[step].focus();});
    $('#example-back').addEventListener('click',()=>{step=Math.max(step-1,0);show();panels[step].focus();});
    $('#example-reset').addEventListener('click',()=>{step=0;show();panels[step].focus();});
    $('#example-controls').hidden=false;show();
  }
  const concept=$('#concept-booking');
  if(concept) { const dialog=$('#concept-notice');concept.hidden=false;concept.addEventListener('click',()=>dialog.showModal());$('#concept-close').addEventListener('click',()=>dialog.close()); }
})();

