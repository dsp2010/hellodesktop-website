(() => {
 'use strict';
 // Fictional business facts for the temporary, rule-based browser voice demo.
 const samples={
  barber:{name:'Oak & Blade Barbers',services:'haircuts, skin fades and beard trims',prices:'a haircut is twenty pounds, a skin fade is twenty five pounds, and a beard trim is twelve pounds',hours:'Tuesday to Saturday, nine in the morning until six in the evening',place:'our fictional High Street shop',booking:'Use the shop’s booking page to choose a service and time. This demonstration cannot book a real appointment.'},
  salon:{name:'Willow Hair & Beauty',services:'cuts and finishes, colour consultations and beauty treatments',prices:'a cut and finish starts at thirty five pounds. Colour prices are discussed at a consultation',hours:'Tuesday to Saturday, nine in the morning until six in the evening',place:'our fictional town centre salon',booking:'A connected salon assistant could guide you to a booking page. No appointment is made in this demonstration.'},
  restaurant:{name:'The Olive Table',services:'seasonal lunches, evening meals and table reservations',prices:'our sample lunch menu starts at eighteen pounds for two courses',hours:'Tuesday to Sunday, midday until ten in the evening',place:'our fictional riverside restaurant',booking:'You would choose a table on the restaurant’s reservation page. I cannot check live availability or reserve a table in this demonstration.'},
  cafe:{name:'Little Oak Café',services:'coffee, breakfast, sandwiches and cakes',prices:'a flat white is three pounds fifty, and our sample breakfast starts at eight pounds',hours:'Monday to Saturday, eight in the morning until four in the afternoon',place:'our fictional neighbourhood café',booking:'Our sample café welcomes walk-ins. This demo cannot place an order or reserve a seat.'},
  shop:{name:'Sunday Goods',services:'home accessories, gifts and everyday essentials',prices:'our sample gifts start at ten pounds. Real product pricing would come from your shop’s catalogue',hours:'Monday to Saturday, ten in the morning until six in the evening',place:'our fictional town centre shop',booking:'For product enquiries, a finished assistant could point you to your shop’s contact page. There is no real store or checkout in this demo.'},
  ecommerce:{name:'Everyday Edit',services:'home accessories and gifts available online',prices:'our sample products start at fifteen pounds. This demo is not connected to a real catalogue',hours:'our sample support team works Monday to Friday, nine in the morning until five in the afternoon',place:'our fictional online shop',booking:'A real assistant could guide you to product pages and customer support. This example cannot place an order or access an account.'},
  cleaning:{name:'Fresh Start Cleaning',services:'regular home cleaning, deep cleans and end-of-tenancy cleaning',prices:'our sample regular cleaning starts at twenty pounds per hour. A real price depends on the job and your business’s rates',hours:'Monday to Friday, eight in the morning until five in the afternoon',place:'our fictional local service area',booking:'A real cleaning assistant could guide you to a quote request form. This demonstration does not submit an enquiry or confirm a visit.'},
  gardening:{name:'Green Corner Gardens',services:'lawn care, hedge trimming and garden maintenance',prices:'our sample garden visits are quoted after discussing the work. I cannot provide a real estimate',hours:'Monday to Friday, eight in the morning until five in the afternoon',place:'our fictional local service area',booking:'A finished assistant could help you find the site-visit request page. No visit or estimate is arranged by this demonstration.'},
  trades:{name:'Oakfield Maintenance',services:'general property maintenance and small repair enquiries',prices:'our example business quotes each job individually. This demonstration cannot price a real repair',hours:'Monday to Friday, eight in the morning until five in the afternoon',place:'our fictional local service area',booking:'A finished assistant could direct you to the business’s enquiry form. This demonstration cannot send a job request or promise attendance.'}
 };
 const sample=id=>samples[id];
 function greeting(id){const s=sample(id);return s?`Hello! You’re speaking to the temporary voice demo for ${s.name}, a fictional business. Ask me about services, prices, opening hours, or how booking could work.`:'Please choose a business type.'}
 function reply(id,utterance){const s=sample(id);if(!s)return 'Please select a business type first.';const q=String(utterance).toLowerCase();
  if(/\b(allerg\w*|gluten|diet\w*|vegan|nut|nuts|medical|pregnan\w*|sensitive skin)\b/.test(q))return 'Please confirm dietary or treatment requirements directly with the business’s qualified team. This is a sample demo and cannot provide safety or suitability advice.';
  if(/\b(emergency|danger|gas leak|electric shock|urgent)\b/.test(q))return 'This demo cannot handle emergencies or give safety instructions. Please contact the appropriate emergency or qualified professional service.';
  if(/\b(human|person|staff|manager|complain|contact|someone)\b/.test(q))return 'A real assistant could direct you to the business’s team. This fictional demo has no contact details and cannot transfer calls.';
  if(/\b(hello|hi|hey|good morning|good afternoon)\b/.test(q))return greeting(id);
  if(/\b(thank|thanks|thankyou)\b/.test(q))return 'You’re welcome! Ask another question about this sample business, or choose End conversation when you’re finished.';
  if(/\b(your name|who are you|real|ai|robot|chatbot)\b/.test(q))return `I’m a temporary browser voice demonstration for ${s.name}. My replies use predefined sample information. I’m not the finished HelloDesk AI chatbot.`;
  if(/\b(open|close|hours|when|time|sunday|monday|saturday)\b/.test(q)&&!/\b(book|appointment|reserve|reservation)\b/.test(q))return `In this fictional example, ${s.name} operates ${s.hours}. These are sample hours, not a real business schedule.`;
  if(/\b(book|booking|appointment|reserve|reservation|table|visit|quote|estimate|consultation)\b/.test(q))return s.booking;
  if(/\b(deliver\w*|ship\w*)\b/.test(q)&&['shop','ecommerce'].includes(id))return 'For this fictional shop, standard delivery takes three to five working days. A real assistant would use your actual delivery policy. No order is placed here.';
  if(/\b(return\w*|refund\w*)\b/.test(q)&&['shop','ecommerce'].includes(id))return 'A finished shop assistant could explain your published returns policy and point to the returns process. This demonstration cannot approve a refund or process a return.';
  if(/\b(stock|inventory|track|order number|my order|availability|available)\b/.test(q))return 'This example has no access to live stock, orders or availability. A real integration would need to be connected and tested for that.';
  if(/\b(where|location|address|area|cover|postcode|find you|parking)\b/.test(q))return `This is ${s.place}. A real assistant would share your confirmed address or coverage. I cannot check a real address or postcode in this demo.`;
  if(/\b(price\w*|cost\w*|how much|charge\w*|expensive|pounds)\b/.test(q))return `For ${s.name}, ${s.prices}. These are illustrative demo prices only.`;
  if(/\b(service\w*|offer\w*|menu|cut\w*|trim\w*|beard\w*|treatment\w*|colour|color|coffee|breakfast|product\w*|sell|clean\w*|garden\w*|work|repair\w*|lawn|hedge)\b/.test(q))return `Our fictional example offers ${s.services}. You can also ask about sample prices, opening hours, or booking.`;
  return 'This temporary demo knows a few sample business topics. Try asking about services, prices, opening hours, location, or booking. Your own finished chatbot will be connected separately.';
 }
 function canSpeak(){return !!(window.speechSynthesis&&window.SpeechSynthesisUtterance)}
 function supported(){return !!(window.isSecureContext&&(window.SpeechRecognition||window.webkitSpeechRecognition)&&canSpeak())}
 function create({businessId,onState=()=>{},onCaption=()=>{},onError=()=>{},onMic=()=>{},voiceURI=''}){
  let recognition=null,utterance=null,epoch=0,dead=false,timer=null;
  const clear=()=>{clearTimeout(timer);timer=null};
  function stop(){dead=true;epoch++;clear();const rec=recognition;recognition=null;if(rec){rec.onresult=rec.onerror=rec.onend=rec.onaudiostart=rec.onaudioend=null;try{rec.abort()}catch{}}if(utterance){utterance.onstart=utterance.onend=utterance.onerror=null;utterance=null;window.speechSynthesis?.cancel()}onMic(false)}
  function fail(code){stop();onError(code)}
  function speak(text){if(dead)return;if(!canSpeak()){fail('unsupported');return}const run=++epoch;clear();onCaption('assistant',text);onState('processing');const u=new window.SpeechSynthesisUtterance(text);utterance=u;u.lang='en-GB';u.rate=1;const voices=window.speechSynthesis.getVoices();u.voice=voices.find(v=>v.voiceURI===voiceURI)||voices.find(v=>v.lang==='en-GB')||voices.find(v=>v.lang.startsWith('en'))||null;u.onstart=()=>{if(!dead&&epoch===run)onState('speaking')};u.onend=()=>{if(dead||epoch!==run)return;clear();utterance=null;onState('paused')};u.onerror=()=>{if(!dead&&epoch===run)fail('audio')};timer=setTimeout(()=>{if(!dead&&epoch===run)fail('audio')},45000);try{window.speechSynthesis.speak(u)}catch{fail('audio')}}
  function listen(){stop();dead=false;const run=epoch;if(!supported()){fail('unsupported');return}const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;let pending='',hadResult=false;
   try{const rec=new Recognition();recognition=rec;rec.lang='en-GB';rec.continuous=false;rec.interimResults=false;rec.maxAlternatives=1;
    rec.onaudiostart=()=>{if(!dead&&epoch===run){onState('listening');onMic(true)}};
    rec.onaudioend=()=>{if(!dead&&epoch===run)onMic(false)};
    rec.onresult=e=>{if(dead||epoch!==run||hadResult)return;const result=e.results[e.resultIndex??0];if(!result?.isFinal)return;hadResult=true;const heard=result[0].transcript.trim();onCaption('user',heard);pending=reply(businessId,heard);onState('processing');try{rec.stop()}catch{fail('provider')}};
    rec.onerror=e=>{if(dead||epoch!==run)return;if(e.error==='no-speech'){clear();onCaption('assistant','I didn’t catch a question. Select Ask another question when you’re ready.');return}const codes={'not-allowed':'permission_denied','service-not-allowed':'permission_denied','audio-capture':'no_microphone','network':'network','language-not-supported':'unsupported'};fail(codes[e.error]||'provider')};
    rec.onend=()=>{if(dead||epoch!==run)return;recognition=null;clear();onMic(false);if(pending)speak(pending);else onState('paused')};
    onState('permission');timer=setTimeout(()=>{if(!dead&&epoch===run)fail('timeout')},35000);rec.start();
   }catch{fail('provider')}
  }
  function hearExample(){stop();dead=false;speak(greeting(businessId))}
  return {listen,hearExample,stop};
 }
 window.HelloDeskBrowserVoice={supported,canSpeak,create,reply,greeting};
})();
