(() => {
 'use strict';
 const root=document.querySelector('#phone-questions'),input=document.querySelector('#faq-filter');if(!root||!input)return;
 const rows=[...root.querySelectorAll('.faq-list details')],controls=root.querySelector('.faq-search-controls'),count=document.querySelector('#faq-result-count'),empty=document.querySelector('#faq-no-results');
 const normalise=s=>s.toLocaleLowerCase('en-GB').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const corpus=rows.map(row=>normalise(row.textContent));
 function filter(){const terms=normalise(input.value.trim()).split(/\s+/).filter(Boolean);let matches=0;rows.forEach((row,index)=>{const show=terms.every(term=>corpus[index].includes(term));row.hidden=!show;if(terms.length)row.open=show;else row.open=false;if(show)matches++});count.textContent=terms.length?`${matches} matching ${matches===1?'question':'questions'}`:`${rows.length} phone questions`;empty.hidden=matches!==0;document.querySelector('#faq-clear').hidden=!input.value;}
 input.addEventListener('input',filter);document.querySelector('#faq-clear').addEventListener('click',()=>{input.value='';filter();input.focus()});input.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();input.value='';filter()}});
 controls.hidden=false;count.textContent=rows.length+' phone questions';
})();
