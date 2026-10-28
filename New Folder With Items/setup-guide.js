(() => {
 'use strict';
 const $=s=>document.querySelector(s),form=$('#setup-guide-form');if(!form||!window.HelloDeskSetup)return;
 const core=window.HelloDeskSetup,D=window.HELLODESK_CONTENT,panels=[...document.querySelectorAll('[data-guide-step]')],indicators=[...document.querySelectorAll('[data-guide-progress]')];
 let step=1;
 const incoming=new URLSearchParams(location.search),industry=D.industries.find(i=>i.id===incoming.get('industry'));if(industry)$('#guide-type').value=industry.id;
 function show(next){step=next;panels.forEach(p=>p.hidden=Number(p.dataset.guideStep)!==step);indicators.forEach(i=>{if(Number(i.dataset.guideProgress)===step)i.setAttribute('aria-current','step');else i.removeAttribute('aria-current')});$('#guide-back').hidden=step===1;$('#guide-next').hidden=step===3;$('#guide-next').textContent=step===1?'Next: your calls ↗':'See my outline ↗';$('#guide-step-label').textContent='Step '+step+' of 3';$('#guide-error').hidden=true;$('#guide-heading-'+step).focus();}
 function goals(){return [...form.querySelectorAll('input[name="goal"]:checked')].map(e=>e.value)}
 function error(text,field){$('#guide-error').textContent=text;$('#guide-error').hidden=false;field?.focus()}
 $('#guide-estimate-enabled').addEventListener('change',()=>{const enabled=$('#guide-estimate-enabled').checked;$('#guide-volume').disabled=!enabled;$('#guide-volume').hidden=!enabled});
 function review(){const type=D.industries.find(i=>i.id===$('#guide-type').value),q=new URLSearchParams({industry:type.id,coverage:$('#guide-coverage').value,number:$('#guide-number').value,goals:goals().join(',')}),preferences=core.parse(q);let minutes='To be discussed';if($('#guide-estimate-enabled').checked){const calls=Number($('#guide-calls').value),length=Number($('#guide-length').value),days=Number($('#guide-days').value);q.set('calls',calls);q.set('length',length);q.set('days',days);minutes=(Math.round(calls*length*days*10)/10).toLocaleString('en-GB',{maximumFractionDigits:1})+' minutes / month (your estimate)'}
   const packageId=incoming.get('plan');if(window.HELLODESK_PACKAGES&&Object.hasOwn(window.HELLODESK_PACKAGES.byId,packageId))q.set('plan',packageId);
   $('#guide-summary-type').textContent=type.name;$('#guide-summary-coverage').textContent=preferences.coverage;$('#guide-summary-goals').textContent=preferences.goals.join(' · ');$('#guide-summary-number').textContent=preferences.number;$('#guide-summary-minutes').textContent=minutes;$('#guide-to-brief').href='/personalise.html?'+q;$('#guide-examples').href='/calls.html?industry='+type.id;
 }
 form.addEventListener('submit',e=>{e.preventDefault();if(step===1){if(!$('#guide-type').value){error('Choose your barber shop type to continue.',$('#guide-type'));return}if(!goals().length){error('Choose at least one call requirement.',form.querySelector('input[name="goal"]'));return}show(2)}else if(step===2){if($('#guide-estimate-enabled').checked){for(const id of ['#guide-calls','#guide-length','#guide-days'])if(!$(id).checkValidity()){error('Check your call estimates before continuing.',$(id));$(id).reportValidity();return}}review();show(3)}});
 $('#guide-back').addEventListener('click',()=>show(Math.max(1,step-1)));$('#guide-next').disabled=false;
})();
