(() => {
 'use strict';
 const $=s=>document.querySelector(s),D=window.HELLODESK_CONTENT,C=window.HELLODESK_CONFIG,P=window.HELLODESK_PACKAGES;
 const params=new URLSearchParams(location.search);
 const packageFor=id=>P&&Object.hasOwn(P.byId,id)?P.byId[id]:null;
 const initialPackage=packageFor(params.get('plan'))?.id||'';
 const packageSummary=id=>packageFor(id)?P.summary(id):[];
 const typeFor=()=>D.industries[0];
 const sampleNames={barber:'Your barber shop'};
 const defaultGreeting='Thanks for calling {business}. I’m the AI telephone assistant. How can I help you today?';
 const fallback='Add your approved answer in the form. Your connected assistant would use the barber shop information you supply.';
 function usage(c,l,d){if(!Number.isFinite(c)||!Number.isFinite(l)||!Number.isFinite(d)||c<0||c>10000||!Number.isInteger(c)||l<.1||l>120||d<1||d>31||!Number.isInteger(d))return null;return {calls:c,length:l,days:d,minutes:Math.round(c*l*d*10)/10}}
 function format(n){return n.toLocaleString('en-GB',{maximumFractionDigits:1})}
 const requestedUsage=usage(Number(params.get('calls')),Number(params.get('length')),Number(params.get('days')));
 if($('#usage-form')){
   if(requestedUsage){$('#calls-day').value=requestedUsage.calls;$('#call-length').value=requestedUsage.length;$('#call-days').value=requestedUsage.days}
   function update(){const u=usage(Number($('#calls-day').value),Number($('#call-length').value),Number($('#call-days').value)),valid=$('#usage-form').checkValidity()&&u;$('#usage-minutes').textContent=valid?format(u.minutes):'—';$('#usage-formula').textContent=valid?`${u.calls} calls × ${u.length} minutes × ${u.days} days`:'Enter valid values in all three fields.';$('#usage-brief').hidden=!valid;if(valid){const q=new URLSearchParams({calls:u.calls,length:u.length,days:u.days});if(D.industries.some(i=>i.id===params.get('industry')))q.set('industry',params.get('industry'));if(initialPackage)q.set('plan',initialPackage);$('#usage-brief').href='/personalise.html?'+q}}
   $('#usage-form').addEventListener('input',update);$('#usage-form').addEventListener('submit',e=>e.preventDefault());update();
 }
 if($('#personalise-form')){
   let selected=typeFor(params.get('industry'));
   const setup=window.HelloDeskSetup,preferences=setup?.parse(params);
   function applyGuide(){if(!preferences)return;if(Object.hasOwn(setup.coverage,params.get('coverage')))$('#preview-cover').value=preferences.coverage;if(preferences.goals.length||preferences.numberCode!=='unsure')$('#preview-notes').value=setup.notes(preferences)}
   $('#preview-type').value=selected.id;
   if($('#brief-package'))$('#brief-package').value=initialPackage;
   const selectedPackage=()=>packageFor($('#brief-package')?$('#brief-package').value:initialPackage);
   const defaultIntroduction=$('#brief-introduction')?.textContent||'Choose a package, outline your receptionist or website requirements and save a brief for discussion. The greeting preview is optional and makes no live call.';
   function updateMode(plan){
     const websiteOnly=plan?.category==='websites';
     for(const id of ['#brief-phone-fields','#brief-call-preview','#brief-preview-jump','#preview-guide','#preview-call-examples'])if($(id))$(id).hidden=websiteOnly;
     if($('#brief-layout'))$('#brief-layout').dataset.packageMode=websiteOnly?'website':plan?'receptionist':'mixed';
     if($('#preview-usage'))$('#preview-usage').hidden=websiteOnly||!requestedUsage;
     if($('#brief-introduction'))$('#brief-introduction').textContent=websiteOnly?'Outline the pages, content and design you need, then save a website setup brief for discussion. Nothing is submitted or ordered from this page.':defaultIntroduction;
   }
   $('#preview-greeting').value=defaultGreeting;$('#preview-question').value=selected.questions[0];applyGuide();
   function value(id,max){return $(id).value.trim().slice(0,max)}
   function getPreview(){const name=value('#preview-name',80)||sampleNames[selected.id],template=value('#preview-greeting',320)||defaultGreeting;return {industry:selected.name,industryId:selected.id,business:name,greeting:template.replaceAll('{business}',name),coverage:$('#preview-cover').value,question:value('#preview-question',180)||selected.questions[0],answer:value('#preview-answer',600),notes:value('#preview-notes',1000)}}
   function update(){const p=getPreview();$('#preview-business-label').textContent=p.business;$('#preview-industry-label').textContent=p.industry;$('#preview-greeting-label').textContent=p.greeting;$('#preview-question-label').textContent=p.question;$('#preview-answer-label').textContent=p.answer||fallback;$('#preview-answer-heading').textContent=p.answer?'Assistant · your draft answer':'Answer planning';
     const plan=selectedPackage(),q=new URLSearchParams({industry:selected.id});if(plan)q.set('plan',plan.id);if(requestedUsage&&plan?.category!=='websites')for(const k of ['calls','length','days'])q.set(k,requestedUsage[k]);$('#preview-pricing').href='/pricing.html?'+q;if($('#brief-package-pricing'))$('#brief-package-pricing').href='/pricing.html?'+q;if($('#preview-guide')){const guide=new URLSearchParams({industry:selected.id});if(plan)guide.set('plan',plan.id);$('#preview-guide').href='/guide.html?'+guide}if($('#brief-package-summary'))$('#brief-package-summary').textContent=plan?packageSummary(plan.id).join(' '):'Choose a package to include its monthly price, setup fee and allowances in your brief, or leave it open for discussion.';updateMode(plan);
   }
   $('#personalise-form').addEventListener('input',update);$('#personalise-form').addEventListener('submit',e=>e.preventDefault());
   $('#brief-package')?.addEventListener('change',update);
   $('#preview-reset').addEventListener('click',()=>{$('#personalise-form').reset();selected=typeFor(params.get('industry'));$('#preview-type').value=selected.id;if($('#brief-package'))$('#brief-package').value=initialPackage;$('#preview-greeting').value=defaultGreeting;$('#preview-question').value=selected.questions[0];applyGuide();update();$('#brief-status').textContent='Preview reset. Nothing has been sent or saved by HelloDesk.'});
   $('#brief-download').addEventListener('click',()=>{const p=getPreview(),plan=selectedPackage(),websiteOnly=plan?.category==='websites';const phoneDetails=websiteOnly?[]:[`Preferred coverage: ${p.coverage} (subject to confirmation)`,'',`Opening greeting: ${p.greeting}`,`Example caller question: ${p.question}`,`Draft approved answer: ${p.answer||'To be supplied'}`,requestedUsage?`Estimated call volume: ${requestedUsage.calls} calls/day × ${requestedUsage.length} minutes × ${requestedUsage.days} days = ${format(requestedUsage.minutes)} minutes/month.`:'Call volume: To be discussed.'];const lines=['HELLODESK — BARBER SHOP SETUP BRIEF','Draft for discussion. Not an order, booking or live configuration.','',`Barber shop: ${p.business}`,...phoneDetails,'',`Setup notes: ${p.notes||'None added'}`,'',...(plan?[`Package of interest: ${plan.name} (${plan.id})`,...packageSummary(plan.id)]:['Package of interest: To be discussed.']),'','Before work begins: agree scope, supported integrations, the service agreement, setup payment and go-live timing.','Saved locally by you. This brief has not been sent to HelloDesk.'];
     const blob=new Blob([lines.join('\r\n')],{type:'text/plain;charset=utf-8'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='hellodesk-barber-shop-setup-brief.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),10000);$('#brief-status').textContent='Your brief download has started. Check your downloads. Nothing has been sent to HelloDesk; no appointment is booked.';
   });
   if(requestedUsage){$('#preview-usage').hidden=false;$('#preview-usage').textContent=`Your estimate: ${format(requestedUsage.minutes)} call minutes per month. Included in your downloaded brief.`}
   update();
 }
 if($('#booking-preview-link')){const q=new URLSearchParams();if(D.industries.some(i=>i.id===params.get('industry')))q.set('industry',params.get('industry'));if(Object.hasOwn(D.planLabels,params.get('plan')))q.set('plan',params.get('plan'));$('#booking-preview-link').href='/personalise.html'+(q.size?'?'+q:'');const https=value=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password}catch{return false}};const configured=https(C.booking.calendarUrl)||(https(C.booking.endpoint)&&https(C.terms.privacyUrl)&&C.booking.responseMessage);if(!configured){$('#booking-form').hidden=true;$('#booking-notice').textContent='Guided demo booking opens soon. In the meantime, prepare a brief you can keep for your setup discussion.'}else $('.brief-alternative').hidden=true;}
})();
