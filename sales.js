(() => {
 'use strict';
 const select=document.querySelector('#call-sample-type');
 if(select){
   const panels=[...document.querySelectorAll('[data-call-sample]')],requested=new URLSearchParams(location.search).get('industry');
   if(panels.some(p=>p.dataset.callSample===requested))select.value=requested;
   function change(){for(const panel of panels){panel.hidden=panel.dataset.callSample!==select.value;for(const audio of panel.querySelectorAll('audio'))if(panel.hidden)audio.pause()}}
   select.addEventListener('change',()=>{change();const nextURL=new URL(location.href);nextURL.searchParams.set('industry',select.value);history.replaceState(null,'',nextURL)});change();
   for(const audio of document.querySelectorAll('.call-sample-panel audio')){audio.addEventListener('error',()=>{audio.parentElement.querySelector('.sample-audio-status').textContent='This recording could not load. Read the transcript below or try again later.'});audio.addEventListener('play',()=>{for(const other of document.querySelectorAll('.call-sample-panel audio'))if(other!==audio)other.pause()});}
   document.addEventListener('visibilitychange',()=>{if(document.hidden)for(const audio of document.querySelectorAll('.call-sample-panel audio'))audio.pause()});
 }
 const comparison=document.querySelector('details#compare');
 if(comparison){const open=()=>{if(location.hash==='#compare')comparison.open=true};open();window.addEventListener('hashchange',open)}
})();
