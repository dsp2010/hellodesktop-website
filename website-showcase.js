(() => {
  'use strict';
  const choices=[...document.querySelectorAll('[data-showcase-choice]')];
  const panels=[...document.querySelectorAll('[data-showcase-concept]')];
  if (!choices.length || !panels.length) return;
  const names={classic:'Classic',contemporary:'Contemporary',studio:'Studio'};
  const known=id=>Object.hasOwn(names,id)&&panels.some(panel=>panel.dataset.showcaseConcept===id);
  function requested(){const hash=location.hash.slice(1);return Object.keys(names).find(id=>hash==='concept-'+id||hash.startsWith(id+'-'))||'classic';}
  function show(id,{focus=false,updateURL=false}={}) {
    if (!known(id)) return;
    for (const panel of panels) panel.hidden=panel.dataset.showcaseConcept!==id;
    for (const choice of choices) {
      if (choice.dataset.showcaseChoice===id) choice.setAttribute('aria-current','true');
      else choice.removeAttribute('aria-current');
    }
    for (const link of document.querySelectorAll('[data-showcase-package]')) {
      const url=new URL(link.href,location.href);
      url.searchParams.set('concept',id);
      link.href=url.pathname+url.search;
      link.dataset.concept=id;
    }
    const status=document.querySelector('#showcase-status');
    if(status)status.textContent=names[id]+' concept shown. This is a demonstration design, not a live booking website.';
    if(updateURL)history.replaceState(null,'','#concept-'+id);
    if(focus)document.querySelector('#showcase-title-'+id)?.focus();
  }
  for(const choice of choices)choice.addEventListener('click',event=>{event.preventDefault();show(choice.dataset.showcaseChoice,{focus:true,updateURL:true});});
  window.addEventListener('hashchange',()=>show(requested()));
  show(requested());
})();
