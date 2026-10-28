(() => {
 'use strict';
 const coverage={busy:'When the team is busy',closed:'Outside opening hours',all:'All incoming calls',unsure:'To be discussed'};
 const numbers={existing:'Review my existing shop number',new:'Discuss a new shop number',unsure:'Number setup to be discussed'};
 const goals={faq:'Answer approved business questions',booking:'Explain booking options',transfer:'Discuss handoff to the team'};
 const own=(o,k)=>Object.hasOwn(o,k);
 function parse(params){const cov=own(coverage,params.get('coverage'))?params.get('coverage'):'unsure',number=own(numbers,params.get('number'))?params.get('number'):'unsure',needs=[...new Set((params.get('goals')||'').split(','))].filter(k=>own(goals,k)).slice(0,3);return {coverage:coverage[cov],coverageCode:cov,number:numbers[number],numberCode:number,goals:needs.map(k=>goals[k]),goalCodes:needs}}
 function notes(p){return ['Setup guide preferences:',p.goals.length?'Call goals: '+p.goals.join('; '):'',p.number,'Requirements to discuss; phone routing, integrations and any charges need confirmation.'].filter(Boolean).join('\n')}
 window.HelloDeskSetup={coverage,numbers,goals,parse,notes};
})();
