(() => {
 'use strict';
 const C=window.HELLODESK_CONFIG,D=window.HELLODESK_CONTENT,P=window.HELLODESK_PACKAGES,$=s=>document.querySelector(s);
 const params=new URLSearchParams(location.search);
 const packageFor=id=>P&&Object.hasOwn(P.byId,id)?P.byId[id]:null;
 const initialPackage=packageFor(params.get('plan'))?.id||'';
 const packageDetails=id=>packageFor(id)?P.summary(id):[];
 const knownType=id=>D.industries.find(i=>i.id===id);
 let selected=knownType(params.get('industry'))||knownType(document.body.dataset.industry)||D.industries[0];
 const url=value=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u:null}catch{return null}};
 const menu=$('.menu-toggle');menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));$('#navigation').classList.toggle('open',open)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){menu.click();menu.focus()}});
 const routePath=value=>{let pathname=value.replace(/\/+$/,'').replace(/\.html$/,'');return pathname===''||pathname==='/index'?'/':pathname};
 for(const a of document.querySelectorAll('#navigation a'))if(routePath(a.pathname)===routePath(location.pathname))a.setAttribute('aria-current','page');

 // A provider adapter must implement this reviewed postMessage lifecycle.
 // No event is interpreted as listening/speaking unless sent by the exact frame and session.
 if($('#voice-start')){
   let session=null,timer=null,localSession=null;
   const copy={coming:['Voice demo coming soon','Your industry’s talking assistant will appear here once connected.'],ready:['Ready to start','Start when you’re ready. Your browser may ask for microphone access.'],connecting:['Connecting…','Opening your selected assistant. You can end the connection at any time.'],permission:['Microphone permission required','Use your browser’s microphone prompt to allow access, or end the conversation.'],connected:['Connected','Your assistant is connected. Follow its voice controls below.'],listening:['Listening','Your assistant is listening.'],speaking:['Assistant speaking','Your assistant is responding.'],ended:['Conversation ended','The voice session has been closed.'],error:['Unable to continue','The voice session has been closed. You can retry or explore demo booking.']};
   function config(){const v=window.HELLODESK_VOICE[selected.id];return v?.verified&&v.protocol==='hellodesk-v1'&&C.voicePrivacy&&url(v.embedUrl)?v:null}
   copy.processing=['Thinking about your question','Preparing a response using the temporary demo’s sample information.'];
   copy.paused=['Ready for your next question','Select Ask another question to turn the microphone on again, or end the conversation.'];
   copy.unsupported=['Browser voice is unavailable here','You can listen to an example below if your browser supports speech playback. To talk, open this page in a browser with speech recognition and allow microphone access.'];
   function browserMode(){return !!(C.browserDemo?.enabled&&!config()&&window.HelloDeskBrowserVoice)}
   function available(){return !!(config()||(browserMode()&&window.HelloDeskBrowserVoice.supported()))}
   function state(name){const [heading,description]=copy[name];$('#voice-state').textContent=heading;$('#voice-description').textContent=description;$('#voice-face').dataset.state=name;if(!localSession)$('#mic-badge').textContent=name==='listening'?'Listening':name==='speaking'?'Speaking':session?'Session open':'Mic off';if(name==='paused'){$('#voice-start').hidden=false;$('#voice-start').disabled=!available();$('#voice-start').textContent='Ask another question'}}
   function dispose(){clearTimeout(timer);if(localSession){const previous=localSession;localSession=null;previous.stop()}if(session){session.frame.contentWindow?.postMessage({type:'hellodesk:stop',sessionId:session.id},session.origin);session.frame.remove();session=null}$('#voice-mount').replaceChildren();$('#voice-mount').hidden=true;$('#voice-end').hidden=true;$('#voice-start').disabled=!available();$('#voice-start').hidden=false;$('#mic-badge').textContent='Mic off';if($('#voice-captions')){$('#voice-captions').hidden=true;$('#voice-user').textContent='';$('#voice-answer').textContent=''}}
   function fail(code){dispose();state('error');const errors={permission_denied:'Microphone access was denied or speech recognition is blocked by your browser. Check this site’s microphone permission and your browser’s speech support before retrying.',no_microphone:'No microphone was found. Connect a microphone or try another device.',unsupported:'Voice access is unavailable in this browser. Try another browser with speech recognition, or listen to an example.',network:'The speech service could not connect. Check your internet connection. Browser speech services may not be available on every device.',timeout:'No response was received in time. Check microphone permissions and try again when ready.',audio:'Speech playback could not finish. Check your device volume and use Hear an example to try again.',provider:'The voice service could not start. Please try again later.'};$('#voice-error').textContent=errors[code]||errors.provider;$('#voice-error').hidden=false;$('#voice-start').textContent='Retry conversation';}
   function refresh(){dispose();$('#voice-error').hidden=true;const connected=available(),temporary=browserMode();state(connected?'ready':temporary?'unsupported':'coming');$('#voice-start').textContent=connected?'Start conversation':temporary?'Speech recognition unavailable':'Voice demo coming soon';$('#voice-start').disabled=!connected;$('#voice-title').textContent=selected.name+(temporary?' · sample assistant':' assistant');$('#voice-icon').textContent=selected.icon;$('#industry-page-link').href='/industries/'+selected.slug+'.html';$('#industry-page-link').textContent='Explore '+selected.name.toLowerCase()+' →';$('#voice-book').href='/book-demo.html?industry='+selected.id;$('#voice-questions').replaceChildren(...selected.questions.map(q=>{const li=document.createElement('li');li.textContent='“'+q+'”';return li}));$('#voice-mount').dataset.industry=selected.group;$('#voice-mount').dataset.businessType=selected.id;if($('#temporary-disclosure'))$('#temporary-disclosure').hidden=!temporary;if($('#voice-options'))$('#voice-options').hidden=!temporary;if($('#voice-example'))$('#voice-example').disabled=!(temporary&&window.HelloDeskBrowserVoice.canSpeak());}
   function populate(group,id){const types=D.industries.filter(i=>i.group===group);$('#business-type').replaceChildren(...types.map(i=>new Option(i.name,i.id)));selected=types.find(i=>i.id===id)||types[0];$('#business-type').value=selected.id;$('#industry-select').value=group;refresh();}
   $('#industry-select').addEventListener('change',e=>populate(e.target.value));$('#business-type').addEventListener('change',e=>{selected=knownType(e.target.value);refresh()});populate(selected.group,selected.id);
   $('#voice-start').addEventListener('click',()=>{
     if(browserMode()){startBrowser(false);return}
     const v=config();if(!v)return;
     if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia){fail('unsupported');return}
     dispose();$('#voice-error').hidden=true;
     const target=url(v.embedUrl),frame=document.createElement('iframe'),id=crypto.randomUUID();
     frame.title=selected.name+' talking assistant';frame.allow='microphone';frame.referrerPolicy='no-referrer';
     session={id,frame,origin:target.origin};
     frame.addEventListener('load',()=>{if(session?.id===id)frame.contentWindow.postMessage({type:'hellodesk:start',sessionId:id,industry: selected.group,businessType:selected.id},target.origin)});
     frame.addEventListener('error',()=>{if(session?.id===id)fail('network')});
     frame.src=target.href;$('#voice-mount').append(frame);$('#voice-mount').hidden=false;$('#voice-start').hidden=true;$('#voice-end').hidden=false;$('#voice-end').focus();state('connecting');
     timer=setTimeout(()=>{if(session?.id===id)fail('timeout')},25000);
   });
   function startBrowser(example){dispose();$('#voice-error').hidden=true;$('#voice-start').hidden=true;$('#voice-end').hidden=false;localSession=window.HelloDeskBrowserVoice.create({businessId:selected.id,voiceURI:$('#browser-voice')?.value||'',onState:state,onError:fail,onMic:active=>{$('#mic-badge').textContent=active?'Mic on · listening':'Mic off'},onCaption:(role,text)=>{if($('#voice-captions')){$('#voice-captions').hidden=false;$(role==='user'?'#voice-user':'#voice-answer').textContent=(role==='user'?'You said: ':'Sample assistant: ')+text}}});$('#voice-end').focus();if(example)localSession.hearExample();else localSession.listen();}
   $('#voice-example')?.addEventListener('click',()=>{if(browserMode())startBrowser(true)});
   function populateVoices(){if(!$('#browser-voice')||!window.HelloDeskBrowserVoice?.canSpeak())return;const previous=$('#browser-voice').value;const voices=window.speechSynthesis.getVoices().filter(v=>v.lang.toLowerCase().startsWith('en'));$('#browser-voice').replaceChildren(new Option('Default English voice',''),...voices.map(v=>new Option(v.name+' ('+v.lang+')',v.voiceURI)));if(voices.some(v=>v.voiceURI===previous))$('#browser-voice').value=previous;}
   populateVoices();window.speechSynthesis?.addEventListener('voiceschanged',populateVoices);
   window.addEventListener('message',e=>{
     if(!session||e.origin!==session.origin||e.source!==session.frame.contentWindow||e.data?.sessionId!==session.id||e.data?.type!=='hellodesk:state')return;
     const s=e.data.state;if(!['ready','permission','connected','listening','speaking','ended','error'].includes(s))return;
     clearTimeout(timer);
     if(s==='ended'){dispose();state('ended');$('#voice-start').textContent='Start another conversation';$('#voice-start').focus()}
     else if(s==='error')fail(e.data.code);
     else state(s==='ready'?'connected':s);
   });
   $('#voice-end').addEventListener('click',()=>{dispose();state('ended');$('#voice-start').textContent='Start another conversation';$('#voice-start').focus()});
   window.addEventListener('offline',()=>{if(session)fail('network')});
   window.addEventListener('pagehide',dispose);
   document.addEventListener('visibilitychange',()=>{if(document.hidden&&(session||localSession)){dispose();state('ended');$('#voice-start').textContent='Start another conversation'}});
   window.addEventListener('pageshow',e=>{if(e.persisted)refresh()});
 }

 const dialog=$('#plan-dialog');
 let planId=initialPackage||P?.packages[0]?.id||'';
 function checkoutReady(id){return !!(packageFor(id)&&C.salesOpen&&url(C.paymentLinks[id])?.hostname==='buy.stripe.com'&&C.terms.tax&&C.terms.cancellation&&C.terms.activation&&url(C.terms.url)&&url(C.terms.privacyUrl))}
 function demoRoute(){return url(C.booking.calendarUrl)||(url(C.booking.endpoint)&&url(C.terms.privacyUrl)&&C.booking.responseMessage)?'/book-demo.html':'/personalise.html'}
 function updateCheckout(){if(!packageFor(planId)||!$('#checkout-type')||!$('#plan-booking'))return;const type=$('#checkout-type').value;$('#plan-booking').href=demoRoute()+'?plan='+planId+'&industry='+type;if(checkoutReady(planId)){const u=url(C.paymentLinks[planId]);u.searchParams.set('client_reference_id',planId+'_'+type);$('#stripe-link').href=u.href}}
 document.querySelectorAll('[data-plan]').forEach(b=>b.addEventListener('click',()=>{const plan=packageFor(b.dataset.plan);if(!plan||!dialog)return;planId=plan.id;$('#plan-title').textContent=plan.name;$('#plan-summary').textContent=packageDetails(planId).join(' ');$('#checkout-type').value=selected.id;const ready=checkoutReady(planId);$('#stripe-link').hidden=!ready;$('#checkout-notice').textContent=ready?'Review the monthly subscription, setup fee, usage charges and agreement in Stripe before paying. Activation follows the agreed onboarding process.':'Online checkout is not connected yet. Prepare a package brief for discussion; this preview cannot take payment or activate a service.';updateCheckout();dialog.showModal()}));
 document.querySelectorAll('.plan-book').forEach(a=>{const target=new URL(a.href,location.href);target.searchParams.set('industry',selected.id);a.href=demoRoute()+target.search});
 document.querySelectorAll('.package-link, [data-package-link]').forEach(a=>{const target=new URL(a.href,location.href);if(packageFor(target.searchParams.get('plan'))){target.searchParams.set('industry',selected.id);a.href=target.pathname+target.search+target.hash}});
 $('#checkout-type')?.addEventListener('change',updateCheckout);$('.close')?.addEventListener('click',()=>dialog.close());dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});

 if($('#booking-form')){
   const calendar=url(C.booking.calendarUrl),endpoint=url(C.booking.endpoint);
   const ready=!calendar&&endpoint&&url(C.terms.privacyUrl)&&C.booking.responseMessage;
   function bookingTypes(id){const group=$('#booking-group').value,types=D.industries.filter(i=>i.group===group);$('#booking-type').replaceChildren(...types.map(i=>new Option(i.name,i.id)));if(types.some(i=>i.id===id))$('#booking-type').value=id}
   $('#booking-group').value=selected.group;bookingTypes(selected.id);$('#booking-group').addEventListener('change',()=>bookingTypes());
   if($('#booking-package'))$('#booking-package').value=initialPackage;
   function bookingPackage(){return packageFor($('#booking-package')?$('#booking-package').value:initialPackage)}
   function showBookingPackage(){const plan=bookingPackage();if($('#booking-package-summary'))$('#booking-package-summary').textContent=plan?packageDetails(plan.id).join(' '):'Leave the package open for discussion, or choose one to include its price, setup fee and allowances with your enquiry.'}
   $('#booking-package')?.addEventListener('change',showBookingPackage);showBookingPackage();
   if(calendar){$('#calendar-link').href=calendar.href;$('#calendar-link').hidden=false;$('#booking-notice').textContent='Choose a time on our booking calendar. You’ll review availability and receive confirmation there.';$('#booking-form').hidden=true}
   else if(ready){$('#booking-fields').disabled=false;$('#booking-submit').textContent='Request a demo';$('#booking-notice').textContent='Tell us a little about your business. We’ll use these details to respond to your demo enquiry.';const a=document.createElement('a');a.href=url(C.terms.privacyUrl).href;a.textContent='Read our privacy notice';$('#booking-privacy').append(' ',a)}
   let submitting=false;
   $('#booking-form').addEventListener('submit',async e=>{e.preventDefault();if(!ready||submitting)return;if(!e.target.reportValidity())return;submitting=true;$('#booking-submit').disabled=true;$('#booking-submit').textContent='Sending…';$('#booking-result').textContent='';const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);try{const fields=Object.fromEntries(new FormData(e.target)),requested=bookingPackage();delete fields.plan;delete fields.package;delete fields.packageCategory;delete fields.packageSummary;if(requested){fields.plan=requested.id;fields.packageCategory=requested.category;fields.package=typeof P.snapshot==='function'?P.snapshot(requested.id):{id:requested.id,name:requested.name,category:requested.category,monthly:requested.monthly,setup:requested.setup};fields.packageSummary=packageDetails(requested.id);fields.currency='GBP';fields.vatNote=P.vatNote}const response=await fetch(endpoint.href,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(fields),signal:controller.signal});if(!response.ok)throw new Error('request');const result=await response.json();if(result.accepted!==true||typeof result.reference!=='string'||!result.reference.trim())throw new Error('confirmation');$('#booking-result').textContent='Your request was received. Reference: '+result.reference+'. '+C.booking.responseMessage;$('#booking-fields').disabled=true;$('#booking-submit').textContent='Request received'}catch{$('#booking-result').textContent='We could not confirm delivery. Your details are still in the form. Please try again; the receiving service may have received the first request.';$('#booking-submit').disabled=false;$('#booking-submit').textContent='Retry request'}finally{clearTimeout(timeout);submitting=false}});
 }
 const checks=[...document.querySelectorAll('.prep-check')];checks.forEach(c=>c.addEventListener('change',()=>{$('#prep-progress').textContent=checks.filter(i=>i.checked).length+' of '+checks.length+' ready'}));
 if($('#payment-message')){const status=params.get('status');if(status==='cancelled'){$('#payment-heading').textContent='Checkout was cancelled.';$('#payment-message').textContent='No service has been activated by this page. You can return to pricing when you’re ready. If you’re unsure whether a payment went through, check your Stripe receipt.'}else if(status==='failed'){$('#payment-heading').textContent='Payment needs another look.';$('#payment-message').textContent='We cannot verify payment here. Check the message in Stripe before trying again. No service has been activated by this page.'}}
})();
