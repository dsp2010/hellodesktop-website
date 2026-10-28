(() => {
 'use strict';
 const catalog={
  barber:[['Haircut',['haircut','hair cut','cut']],['Beard trim',['beard','trim']],['Grooming consultation',['consultation','consult']]],
 };
 const times=[{id:'10:00',label:'10:00 am',spoken:'ten in the morning',aliases:['10 am','10am','10:00','10','ten am','ten in the morning','ten o clock',"ten o'clock",'ten']},{id:'14:00',label:'2:00 pm',spoken:'two in the afternoon',aliases:['2 pm','2pm','2:00','14:00','two pm','two in the afternoon','two o clock',"two o'clock",'2 o clock']},{id:'16:30',label:'4:30 pm',spoken:'four thirty in the afternoon',aliases:['4:30','16:30','four thirty','half past four']}];
 const normalise=s=>String(s).toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9:' -]/g,' ').replace(/\s+/g,' ').trim();
 function dates(now=new Date()){
   const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).map(x=>[x.type,x.value]));
   const base=new Date(Date.UTC(Number(p.year),Number(p.month)-1,Number(p.day),12));
   return [1,2,3].map((n,i)=>{const d=new Date(base);d.setUTCDate(d.getUTCDate()+n);return {id:d.toISOString().slice(0,10),label:new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',weekday:'long',day:'numeric',month:'short'}).format(d),weekday:new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',weekday:'long'}).format(d).toLowerCase(),relative:['tomorrow','day after tomorrow','three days from now'][i]}});
 }
 function create({industryId='barber',now=new Date()}={}){
  const services=catalog.barber,days=dates(now);let stage='service',chosen={service:null,day:null,time:null},reference='';
  function choices(){if(stage==='service')return services.map(([label],i)=>({id:'service-'+i,label}));if(stage==='day')return days.map(d=>({id:d.id,label:d.label}));if(stage==='time')return times.map(t=>({id:t.id,label:t.label}));if(stage==='confirm')return [{id:'confirm',label:'Confirm practice booking'},{id:'change',label:'Change the time'}];return []}
  function prompt(){if(stage==='service')return 'Let’s make a practice booking. This is a guided barber shop demo. No real appointment is made. Which service would you like? '+services.map(([label],i)=>`Option ${i+1}, ${label}`).join('. ')+'.';if(stage==='day')return 'Which sample day would you prefer? '+days.map((d,i)=>`Option ${i+1}, ${d.label}`).join('. ')+'. You can also say tomorrow or day after tomorrow.';if(stage==='time')return 'Choose a sample time: ten in the morning, two in the afternoon, or four thirty in the afternoon.';if(stage==='confirm')return `Please check your practice booking: ${chosen.service}, ${chosen.day.label}, at ${chosen.time.spoken}. Shall I confirm this practice booking? Say yes to confirm, or change the time.`;return `Your practice booking for ${chosen.service}, ${chosen.day.label}, at ${chosen.time.spoken} is complete. This is a demo only. No real appointment has been made.`}
  function choose(id){if(!choices().some(c=>c.id===id))return false;if(stage==='service'){chosen.service=services[Number(id.slice(8))][0];stage='day'}else if(stage==='day'){chosen.day=days.find(d=>d.id===id);stage='time'}else if(stage==='time'){chosen.time=times.find(t=>t.id===id);stage='confirm'}else if(id==='change'){chosen.time=null;stage='time'}else if(id==='confirm'){stage='done';reference='PRACTICE-'+Math.random().toString(36).slice(2,8).toUpperCase()}return true}
  function option(q){const m=q.match(/^(?:option |number )?(one|two|three|first|second|third|1|2|3)$/);return m?{one:0,first:0,'1':0,two:1,second:1,'2':1,three:2,third:2,'3':2}[m[1]]:null}
  function find(q){const idx=option(q);if(idx!==null&&stage!=='confirm')return choices()[idx]?.id;
   if(stage==='service'){const hits=services.map(([label,aliases],i)=>({id:'service-'+i,hit:aliases.some(a=>(' '+q+' ').includes(' '+a+' '))})).filter(x=>x.hit);return hits.length===1?hits[0].id:null}
   if(stage==='day'){if(q.includes('day after tomorrow'))return days[1].id;if(/\btomorrow\b/.test(q))return days[0].id;if(q.includes('three days from now'))return days[2].id;const matches=days.filter(d=>q.includes(d.id)||new RegExp('\\b'+d.weekday+'\\b').test(q)||q.includes(normalise(d.label)));return matches.length===1?matches[0].id:null}
   if(stage==='time'){const hits=times.filter(t=>t.aliases.some(a=>(' '+q+' ').includes(' '+a+' ')));return hits.length===1?hits[0].id:null}
   if(stage==='confirm'){if(/\b(no|nope|change|don't|do not|cancel)\b/.test(q))return 'change';if(/^(yes|yes please|yes go ahead|yes that's right|please book it|confirm|confirm booking|confirm practice booking|book it|that's right|that is right|correct|please confirm)$/.test(q))return 'confirm'}return null;
  }
  function consume(text){const q=normalise(text);let accepted=false;for(let n=0;n<3;n++){if(n>0&&option(q)!==null)break;const before=stage,id=find(q);if(!id||!choose(id))break;accepted=true;if(before==='confirm'||stage==='confirm'||stage==='done')break}return {accepted,prompt:accepted?prompt():'I didn’t recognise one of the choices. You can say option one, two or three where offered, or use an on-screen choice. '+prompt()}}
  function summary(){return {stage,service:chosen.service,day:chosen.day?.label||'',date:chosen.day?.id||'',time:chosen.time?.label||'',reference,practiceOnly:true}}
  return {choices,prompt,choose,consume,summary};
 }
 window.HelloDeskPracticeBooking={create,dates,catalog};
})();
