"""Rebuild the checked-in static pages. Requires Python 3 and Node; no packages."""
import json
import subprocess
from pathlib import Path
from html import escape
from urllib.parse import urlencode

ROOT = Path(__file__).resolve().parents[1]
data = json.loads(subprocess.check_output(['node', '-e', "global.window={};require('./packages.js');require('./config.js');console.log(JSON.stringify({p:window.HELLODESK_PACKAGES,c:window.HELLODESK_CONFIG}));"], cwd=ROOT, text=True))
P, C = data['p'], data['c']
E = lambda x: escape(str(x), quote=True)
money = lambda n: '£' + (f'{n:,.0f}' if float(n).is_integer() else f'{n:,.2f}')
number = lambda n: f'{n:,}'
def wa(kind):
    return C['contact']['whatsapp'] + '?' + urlencode({'text': C['messages'][kind]})
def button(text, href, secondary=False, extra=''):
    return f'<a class="button{" secondary" if secondary else ""}" href="{E(href)}" {extra}>{text}<span aria-hidden="true">↗</span></a>'
def email():
    return '<a href="contact.html">Make an enquiry</a>'
def contact_buttons(kind='demo'):
    return button('Open WhatsApp', wa(kind), extra=f'data-whatsapp="{kind}"')+button('Open an email draft','mailto:'+C['contact']['email'], True)
def intro(label,title,copy):
    return f'<section class="wrap page-intro"><p class="eyebrow">{label}</p><h1>{title}</h1><p class="lead">{copy}</p></section>'
def cta(title='Let’s talk about your shop.',copy='Tell us what gets in the way. We’ll discuss what could help.',kind='demo'):
    return f'<section class="wrap section"><div class="cta"><div><h2>{title}</h2><p>{copy}</p></div>{button("Arrange a demo","contact.html?interest="+kind)}</div></section>'
def ul(items):
    return '<ul class="checklist">'+''.join('<li>'+E(s)+'</li>' for s in items)+'</ul>'
def details(title,body):
    return '<details><summary>'+title+'</summary><div class="detail-body">'+body+'</div></details>'
def write(path,content):
    dest=ROOT/path;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(content.strip()+'\n')
NAV=[('index.html','Home','home'),('barbers.html','For Barbers','barbers'),('websites.html','Websites','websites'),('pricing.html','Pricing','pricing'),('contact.html','Contact','contact')]
def shell(title,description,body,active='',extra_scripts='',robots=''):
    nav=''.join(f'<a href="{p}"'+(' aria-current="page"' if active==key else '')+f'>{name}</a>' for p,name,key in NAV)
    return f'''<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{E(title)} | HelloDesk</title><meta name="description" content="{E(description)}">
<meta name="theme-color" content="#173c35"><meta property="og:type" content="website">
<meta property="og:site_name" content="HelloDesk"><meta property="og:title" content="{E(title)} | HelloDesk">
<meta property="og:description" content="{E(description)}"><meta name="twitter:card" content="summary">
{robots}<link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="site.css">
<script src="packages.js" defer></script><script src="config.js" defer></script><script src="site.js" defer></script>{extra_scripts}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="header wrap"><a class="brand" href="index.html" aria-label="HelloDesk home"><span class="mark" aria-hidden="true">h<span>•</span></span>HelloDesk<span class="brand-dot">.</span></a>
<button class="menu-toggle" aria-expanded="false" aria-controls="navigation">Menu <span aria-hidden="true">☰</span></button>
<nav id="navigation" aria-label="Main navigation">{nav}</nav>{button('Arrange a demo','contact.html?interest=demo')}</header>
<main id="main">{body}</main>
<footer class="wrap footer"><div><a class="brand" href="index.html">HelloDesk.</a><p>Telephone help and websites.<br>Made for UK barber shops.</p></div>
<div><p class="footer-label">Get in touch</p>{email()}</div>
<nav aria-label="More information"><a href="about.html">About HelloDesk</a><a href="support.html">Customer support</a><a href="pilot.html">Apply for a pilot</a><a href="barber-setup.html">Your setup brief</a><a href="privacy.html">Privacy</a></nav>
<p class="footer-bottom">© 2026 HelloDesk · Built around your shop.</p></footer>
<noscript><p class="wrap notice">Interactive tools need JavaScript. You can still read the pages and contact us by email or WhatsApp.</p><style>.menu-toggle{{display:none!important}}#navigation{{display:flex!important;position:static!important;flex-wrap:wrap}}.header{{flex-wrap:wrap}}</style></noscript>
</body></html>'''
def page(path,title,description,body,active='',extra_scripts='',robots=''):
    write(path,shell(title,description,body,active,extra_scripts,robots))

page('index.html','AI receptionists and websites for barbers','Simple telephone help and custom websites for UK barber shops. Explore an example and talk to HelloDesk.',
f'''<section class="wrap hero"><div class="hero-copy"><p class="eyebrow"><span class="status-dot"></span> FOR UK BARBER SHOPS</p>
<h1>Less phone juggling.<br><em>More time at the chair.</em></h1>
<p class="lead">Telephone help and a clear website, built around your barber shop.</p>
<p>An AI receptionist is an automated assistant that speaks to callers and helps with questions or supported booking tasks.</p>
<div class="actions">{button('Arrange a demo','contact.html?interest=demo')}<a class="text-link" href="receptionist-example.html">See a simple example <span aria-hidden="true">→</span></a></div>
<p class="small">We agree and test the features for your shop before use.</p></div>
<div class="hero-art" aria-hidden="true"><div class="art-label">HELLODESK / FOR BARBERS</div><div class="art-symbol">h<span>•</span></div><div class="art-note"><span>YOUR SHOP.<br>YOUR WAY.</span><span class="art-star">✳</span></div><div class="art-bottom">A helpful first hello.<br>On the phone. Online.</div></div></section>
<section class="wrap benefits-strip"><article><span class="eyebrow">01 / PHONE HELP</span><h2>Fewer interruptions.</h2><p>Discuss help with calls while you focus on the customer in your chair.</p></article><article><span class="eyebrow">02 / BOOKING QUESTIONS</span><h2>A clear next step.</h2><p>Explain your booking options, prices and opening hours.</p></article><article><span class="eyebrow">03 / YOUR WEBSITE</span><h2>Easy to find. Easy to use.</h2><p>Put your services, prices and booking link in one place.</p></article></section>
<section class="wrap section next-section"><div><p class="eyebrow">START WITH A CONVERSATION</p><h2>Your shop comes first.</h2><a class="text-link" href="barbers.html">See how it could help your shop →</a></div><ol class="steps"><li><b>Tell us about your shop.</b><span>How you take bookings and what callers ask.</span></li><li><b>Agree what could help.</b><span>We check your booking system and explain the costs.</span></li><li><b>Set up and test.</b><span>Agreed features are checked before use.</span></li></ol></section>''','home')

booking_options=''.join(f'<option>{x}</option>' for x in ['Google Calendar','Booksy','Fresha','Another platform','Manual diary','Walk-ins','Not sure'])
help_options=''.join(f'<option>{x}</option>' for x in ['Answering questions','Taking messages','Appointment requests','Checking availability and booking','Changes and cancellations'])
barber_cards=[
('Fewer interruptions',['Help answer callers while you concentrate on a cut.','Agree which questions need your attention.']),
('Help with bookings',['Gather appointment requests and the preferred barber.','Check times and book only where a connection is supported and tested.']),
('Everyday answers',['Use your services, prices and opening hours.','Explain your walk-in policy clearly.']),
('Less chasing',['Discuss taking messages and gathering requests.','Agree how those requests should reach your team.']),
('Help customers remember',['Discuss appointment reminders if available.','Reminders need to be agreed and tested; they cannot prevent every no-show.']),
('A clearer website',['Show services, prices and booking options.','Make the next step easy on a phone.'])]
cards=''.join(f'<article class="benefit"><span class="step-number">0{i+1}</span><h2>{title}</h2>{ul(lines)}</article>' for i,(title,lines) in enumerate(barber_cards))
page('barbers.html','Made for your barber shop','Practical help with callers, questions, appointment requests and your website, built around your barber shop.',
intro('MADE FOR BARBERS','Keep your attention<br><em>on the customer.</em>','A ringing phone can interrupt a cut. Let’s look at the questions and requests you could get help with.')+
f'''<section class="wrap section top-none"><div class="benefit-grid">{cards}</div><p class="notice">Our receptionist features have not yet been confirmed as working from the first call to the final result. We’ll agree what your shop needs and test it before use.</p></section>
<section class="soft"><div class="wrap section"><div class="section-heading"><p class="eyebrow">YOUR SHOP, YOUR RULES</p><h2>Appointments or walk-ins?</h2></div><div class="two-col"><article><h3>Appointment-based shops</h3><p>Start with your services, appointment lengths and preferred barbers. We’ll check what your existing booking system allows before agreeing any booking features.</p></article><article><h3>Walk-in shops</h3><p>Answering questions and taking messages may be more useful than calendar bookings. Explain when you’re open and how your walk-in service works.</p></article></div></div></section>
<section class="wrap section" id="how"><p class="eyebrow">HOW IT WOULD WORK IN YOUR SHOP</p><h2>Three clear steps.</h2><ol class="steps horizontal"><li><b>Tell us about your shop.</b><span>Your services and how you handle bookings.</span></li><li><b>Agree what it should do.</b><span>We check what your booking system allows.</span></li><li><b>Set up and test.</b><span>We test the agreed features before use.</span></li></ol></section>
<section class="wrap section top-none" id="booking-check"><div class="panel two-col"><div><p class="eyebrow">A QUICK BOOKING CHECK</p><h2>Will it work<br>with your diary?</h2><p>Tell us what you use and what help you need. These choices don’t mean a connection is already available.</p></div><div><form id="booking-check-form" hidden><label for="shop-booking">How do you manage bookings?</label><select id="shop-booking">{booking_options}</select><label for="shop-help">What would you like help with?</label><select id="shop-help">{help_options}</select><button class="button" type="submit">Check my next step <span aria-hidden="true">→</span></button></form><div id="booking-result" class="notice" hidden><h3 id="booking-result-title" tabindex="-1">We’ll need to check your booking setup.</h3><p>A booking system’s name alone does not confirm what we can connect.</p>{button('Discuss this on WhatsApp',wa('booking'),extra='id="booking-check-link"')}</div><noscript>{button('Ask about your booking system','contact.html?interest=booking')}</noscript></div></div></section>
<section class="wrap section top-none"><details class="calculator"><summary>Could missed enquiries be worth a closer look?</summary><div class="detail-body" id="calculator"><p>Optional estimate. The starting figures are illustrative assumptions, not results from customers.</p><div class="form-grid"><div><label for="missed">Relevant missed enquiries per working day</label><input id="missed" type="number" min="0" max="1000" step="1" value="2"><small>0–1,000 enquiries</small></div><div><label for="days">Working days per month</label><input id="days" type="number" min="0" max="31" step="1" value="22"><small>0–31 days</small></div><div><label for="conversion">Becoming additional completed appointments (%)</label><input id="conversion" type="number" min="0" max="100" step="0.1" value="25"><small>Your assumption, from 0–100%</small></div><div><label for="value">Average appointment value (£)</label><input id="value" type="number" min="0" max="10000" step="0.01" value="25"><small>0–£10,000</small></div></div><p id="calc-error" class="error" role="status"></p><div class="calc-results" aria-live="polite"><div><output id="monthly-enquiries">44</output><span>Monthly missed enquiries</span></div><div><output id="additional-appointments">11</output><span>Estimated additional appointments</span></div><div><output id="gross-revenue">£275.00</output><span>Estimated additional gross revenue</span></div></div><p class="small">An estimate, not guaranteed revenue or profit. Some callers would book anyway. Additional appointments need spare capacity. Costs are not deducted. Empty inputs count as zero. Figures stay in this page.</p></div></details></section>
<section class="wrap section top-none"><div class="cta"><div><h2>What gets in the way at your shop?</h2><p>Tell us how you handle calls and bookings.</p></div>{button('Discuss your shop on WhatsApp',wa('demo'),extra='data-whatsapp="demo"')}</div></section>''','barbers')

page('receptionist-example.html','A simple receptionist example','A short, fictional booking walkthrough. No real call or appointment is made.',
intro('RECEPTIONIST EXAMPLE · ABOUT 45 SECONDS','One call.<br><em>A clear next step.</em>','See how an appointment request could be handled, including what happens when it cannot be completed.')+
f'''<section class="wrap section top-none"><p class="notice"><strong>Example only — no real appointment is made.</strong> This is a written illustration, not a working telephone service. Real bookings need a supported connection that has been tested.</p>
<div class="walkthrough" id="receptionist-example"><div class="example-top"><span>FICTIONAL SHOP / CEDAR &amp; COMB</span><span id="example-progress" aria-live="polite">4 short steps</span></div>
<section data-example-step tabindex="-1"><p class="eyebrow">01 / THE REQUEST</p><h2>A customer needs a haircut.</h2><div class="bubble caller"><b>Customer</b><p>“Could I book a haircut tomorrow afternoon?”</p></div><div class="bubble"><b>Assistant</b><p>“Of course. Would you like a particular barber?”</p></div></section>
<section data-example-step tabindex="-1"><p class="eyebrow">02 / THE DETAILS</p><h2>Understand what they need.</h2><div class="bubble caller"><b>Customer</b><p>“A standard haircut with Sam, please. My name is Alex.”</p></div><div class="bubble"><b>Assistant</b><p>“I’ll check a 30-minute haircut with Sam. What’s the best contact number?”</p></div><p class="small">All names and details are fictional. This example asks you for no personal information.</p></section>
<section data-example-step tabindex="-1"><p class="eyebrow">03 / THE CHECK</p><h2>Check before promising.</h2><div class="system-check"><span aria-hidden="true">↔</span><div><b>Illustrative booking-system check</b><p>Check Sam’s diary, the service length and the requested time. Recheck the slot when saving the booking.</p></div></div><div class="bubble"><b>Assistant</b><p>“There’s a 3pm slot. Shall I try to book that for you?”</p></div><p class="small">An available time is not yet a confirmed booking.</p></section>
<section data-example-step tabindex="-1"><p class="eyebrow">04 / THE RESULT</p><h2>Confirm only after acceptance.</h2><div class="two-col result-branches"><article><span class="tag">IF ACCEPTED</span><h3>The booking is saved.</h3><p>“The booking system has confirmed your haircut with Sam tomorrow at 3pm.”</p></article><article><span class="tag">IF IT CANNOT BE COMPLETED</span><h3>Offer another next step.</h3><p>“I couldn’t confirm that time. We can try another slot or ask the shop to follow up.”</p></article></div><p class="small">A lost connection or unanswered request must not be described as a confirmed appointment.</p></section>
<div class="example-controls" id="example-controls" hidden><button class="button secondary" id="example-back" type="button">← Back</button><button class="button" id="example-next" type="button">Next step →</button><button class="button" id="example-reset" type="button" hidden>Start again ↺</button></div></div></section>'''+cta(copy='We can discuss which parts would suit your shop.'),'barbers')

page('websites.html','Websites for barber shops','A clear, mobile-friendly barber website with your services, prices, opening hours and booking options.',
intro('WEBSITES FOR BARBERS','A clear shopfront.<br><em>Before the first visit.</em>','Help customers find your services, prices and booking options in a few taps.')+
f'''<section class="wrap section top-none two-col website-overview"><div class="concept-teaser"><p class="eyebrow">ONE FICTIONAL DESIGN CONCEPT</p><span class="concept-wordmark">Cedar &amp; Comb</span><p class="concept-tagline">Good cuts.<br>Good company.</p>{button('Explore the concept','barber-concept.html',True)}<p class="small">Concept website — fictional barber shop</p></div><div><h2>Your shop, clearly presented.</h2>{ul(['Your services and prices.','Your opening hours and walk-in policy.','A clear booking or enquiry link.','A layout that works on phones, tablets and computers.'])}<p>We build around your branding and agreed content. Booking links use your chosen service where available.</p>{button('Ask about a website',wa('website'),extra='data-whatsapp="website"')}<p class="small"><a href="pricing.html#websites">See website prices, allowances and terms →</a></p></div></section>''','websites')

page('barber-concept.html','Cedar & Comb — fictional website concept','A fictional barber website concept by HelloDesk. Example services, prices and hours; no real appointments.',
f'''<section class="concept-banner wrap"><p><strong>Concept website — fictional barber shop</strong></p><a href="websites.html">← Return to HelloDesk websites</a></section>
<div class="concept-site"><section class="concept-header wrap"><span class="concept-wordmark">Cedar &amp; Comb</span><nav aria-label="Concept navigation"><a href="#services">Services</a><a href="#hours">Opening hours</a></nav></section>
<section class="concept-hero wrap"><p class="eyebrow">THE EVERYDAY, DONE WELL.</p><h1>Good cuts.<br><em>Good company.</em></h1><p>Fresh fades, familiar faces.<br>Make a little time for your next good cut.</p><button class="button" id="concept-booking" hidden type="button">Book a haircut <span aria-hidden="true">↗</span></button><p class="small">Example button · no real booking</p><span class="concept-ornament" aria-hidden="true">✳</span></section>
<section class="wrap section two-col"><div id="services"><p class="eyebrow">THE CUT LIST</p><h2>Keep it sharp.</h2><p>Example services and prices.</p><dl class="service-list"><div><dt>Classic haircut <small>30 minutes</small></dt><dd>£25</dd></div><div><dt>Skin fade <small>45 minutes</small></dt><dd>£30</dd></div><div><dt>Beard trim <small>20 minutes</small></dt><dd>£15</dd></div><div><dt>Cut &amp; beard <small>50 minutes</small></dt><dd>£38</dd></div></dl></div>
<div id="hours"><p class="eyebrow">YOUR TIME IN THE CHAIR</p><h2>Make time.</h2><p>Example opening hours.</p><dl class="service-list"><div><dt>Monday–Friday</dt><dd>9am–7pm</dd></div><div><dt>Saturday</dt><dd>9am–5pm</dd></div><div><dt>Sunday</dt><dd>Closed</dd></div></dl><p class="small">Fictional shop. There is no real location or appointment service.</p></div></section></div>
<section class="wrap section"><div class="cta"><div><h2>Picture your shop here.</h2><p>Your own name, services, hours and booking link.</p></div>{button('Request a website like this',wa('website'),extra='data-whatsapp="website"')}</div></section>
<dialog id="concept-notice" aria-labelledby="concept-notice-title"><button id="concept-close" class="close" aria-label="Close example notice" autofocus>×</button><p class="eyebrow">FICTIONAL EXAMPLE</p><h2 id="concept-notice-title">This is a design concept.</h2><p>A real shop’s button would open its agreed booking service. No appointment is made here and no customer details are collected.</p>{button('Request a website like this',wa('website'),extra='data-whatsapp="website"')}</dialog>''','websites',robots='<meta name="robots" content="noindex,follow">')

def plan_card(plan):
    ai=plan if plan['category']=='ai-receptionist' else P['byId'].get(plan.get('receptionistId'))
    web=plan if plan['category']=='websites' else P['byId'].get(plan.get('websiteId'))
    items=[]
    if ai:
        items += [f'{number(ai["minutes"])} call minutes / month',f'{number(ai["sms"])} UK SMS segments / month',f'Up to {ai["calendars"]} staff calendar'+('s' if ai['calendars']!=1 else ''),f'{ai["infoUpdates"]} small information update'+('s' if ai['infoUpdates']!=1 else '')+' / month']
    if web:
        items += [f'Up to {web["pages"]} website page'+('s' if web['pages']!=1 else ''),f'{web["editMinutes"]} minutes of content edits / month',f'{web["revisions"]} initial revision rounds']
    term=f'<p class="small"><b>Extra call minutes: {money(ai["extraMinute"])} each.</b></p>' if ai else ''
    if web: term+='<p class="small"><b>'+E(P['websiteTerm'])+'</b></p>'
    bundle=f'<p class="small">Includes {E(ai["name"])} + {E(web["name"])}. Save {money(plan["savingMonthly"])}/month compared with buying separately.</p>' if ai and web else ''
    return f'''<article class="price-card" id="package-{plan['id']}"><h3>{E(plan['name'])}</h3><p class="price">{money(plan['monthly'])}<span>/month</span></p><p>+ {money(plan['setup'])} one-time setup</p>{bundle}{ul(items)}{term}{button('Discuss this package','contact.html?plan='+plan['id'])}</article>'''
pricing=intro('PACKAGES & PRICING','Choose the help<br><em>your shop needs.</em>','Receptionists, websites or both. Discuss the right fit before agreeing a service.')+'''<section class="wrap top-none"><p class="notice">All prices in GBP. VAT added where applicable. Receptionist actions are subject to supported access, agreed scope and successful testing before use. The example is not proof that live features work.</p><nav class="pill-links" aria-label="Pricing sections"><a href="#ai-receptionist">Receptionists</a><a href="#websites">Websites</a><a href="#bundles">Bundles</a><a href="#extras">Extra charges & terms</a></nav></section>'''
for category in P['categories']:
    plans=[P['byId'][key] for key in category['planIds']]
    heading={'ai-receptionist':'Telephone receptionists','websites':'Barber websites','bundles':'Receptionist + website'}[category['id']]
    pricing+=f'<section class="wrap section" id="{category["id"]}"><h2>{heading}</h2><div class="price-grid">{"".join(plan_card(p) for p in plans)}</div>'
    if category['id']=='ai-receptionist':
        pricing+='<p class="small">'+E(P['terms']['receptionistSetup'])+'</p>'
        # Preserve catalogue scope, qualify unverified delivery rather than silently changing package terms.
        plain_features=[
          'A greeting and voice chosen for your shop.',
          'Answers using your opening hours, services, prices and common questions.',
          'Collection of caller details and appointment requirements.',
          'Availability checks and bookings through a supported booking connection.',
          'Changes and cancellations through supported connections, with checks to find the right booking.',
          'Booking confirmations and reminders within the included SMS allowance.',
          'One transfer number for your team, plus message-taking if staff are unavailable.',
          'One UK local phone number, or forwarding from your existing number where supported.',
          'Regular test bookings, checks for failures and a monthly usage summary.'
        ]
        pricing+=details('Receptionist scope to agree and test','<p>These are the existing package specifications, not verified live features. Each action, including reminders, must be available, agreed and tested for your shop before use.</p>'+ul(plain_features)+'<p>Setup covers your shop information, assistant, agreed calendar connection, telephone setup, test calls, booking checks and handover.</p><p>'+E(P['terms']['availability'])+'</p>')
    elif category['id']=='websites':
        pricing+=details('Website inclusions and scope',ul(P['websiteFeatures'])+ul(P['websiteScope']))
    else:
        pricing+='<p class="small">Bundles keep the allowances and extra-minute rates of their component packages. '+E(P['terms']['receptionistSetup'])+'</p>'
    pricing+='</section>'
extra_rows=''
for x in P['addOns']:
    price=('From ' if x.get('from') else '')
    if 'setup' in x: price+=money(x['setup'])+' setup'+(' + '+money(x['monthly'])+'/month' if 'monthly' in x else '')
    elif x.get('quantity'): price+=money(x['price'])+' per '+str(x['quantity'])+' '+x['unit']
    else: price+=money(x['price'])+('/'+x['unit'] if x.get('unit') else '')
    names={'payment-workflow':'Deposit / payment links','booking-integration':'Booking-system connection','voice-widget':'Website voice assistant'}
    detail=x['detail'].replace('integration','connection')
    if x.get('minimumMinutes'):detail=f'Minimum {x["minimumMinutes"]} minutes.'
    extra_rows+=f'<tr><th scope="row">{E(names.get(x["id"],x["name"]))}</th><td>{E(price)}</td><td>{E(detail)}</td></tr>'
pricing+=f'''<section class="wrap section top-none" id="extras"><h2>Extra charges &amp; important terms.</h2>
<p>{E(P['terms']['sms'])} Extra UK SMS costs £15 per 100 segments. Connected human transfer costs £0.12/minute on standard UK routes; other routes are quoted separately.</p>
{details('Optional services and usage charges','<p>Only add services that are supported, agreed and tested. VAT added where applicable.</p><div class="table-scroll" tabindex="0" role="region" aria-label="Optional services and charges"><table><caption>Additional services</caption><thead><tr><th scope="col">Service</th><th scope="col">Price</th><th scope="col">Details</th></tr></thead><tbody>'+extra_rows+'</tbody></table></div>')}
{details('Terms, allowances and cancellation','<p>'+E(P['websiteTerm'])+' This applies to websites and bundles.</p><p>'+E(P['terms']['agreement'])+'</p><p>'+E(P['terms']['calendar'])+'</p><p>'+E(P['terms']['updates'])+'</p><p>'+E(P['terms']['paymentLinks'])+'</p>')}
{details('Prefer to buy a website outright?',ul([x['label']+': from '+money(x['from']) for x in P['outright']])+'<p>'+E(P['terms']['outright'])+' VAT added where applicable. Ownership and handover are agreed in the service agreement.</p>')}
</section>'''+cta('Need help choosing?','Tell us your expected call volume and website needs.')
page('pricing.html','Clear packages and prices','Compare HelloDesk receptionist, website and bundle prices, allowances, setup fees and terms.',pricing,'pricing')

page('contact.html','Contact HelloDesk','Arrange a demo or ask about a barber website, booking system or pilot by WhatsApp or email.',
intro('LET’S TALK','Tell us about<br><em>your shop.</em>','Ask a question, arrange a demo or discuss a website. Start wherever is easiest.')+
f'''<section class="wrap section top-none contact-layout"><aside class="contact-aside"><h2>A simple hello.</h2><p>Tell us about your shop using the enquiry form. Choose email or WhatsApp to send your message.</p><div class="actions">{button('Open WhatsApp',wa('demo'),extra='data-whatsapp="demo"')}</div><a id="scheduler" class="text-link" hidden target="_blank" rel="noopener noreferrer">View demo availability ↗</a><p class="small">Demo dates and times are requests until we confirm them with you.</p><p><a href="support.html">Need help with an existing setup? →</a></p></aside>
<div class="panel"><h2>A short enquiry.</h2><p>We’ll prepare a message for you to review and send in your email app or WhatsApp.</p>
<form id="enquiry" hidden>
<div class="form-grid"><div><label for="shop">Shop name</label><input id="shop" name="shop" required maxlength="100" autocomplete="organization"></div><div><label for="contact-name">Contact name</label><input id="contact-name" name="contact-name" required maxlength="80" autocomplete="name"></div></div>
<label for="reply">How would you like us to reply?</label><select id="reply" name="reply"><option value="email">Email</option><option value="whatsapp">WhatsApp</option></select>
<label id="reply-label" for="reply-address">Your email address</label><input id="reply-address" name="reply-address" type="email" autocomplete="email" required maxlength="254" aria-describedby="reply-help"><small id="reply-help">We’ll use this address to reply to your enquiry.</small>
<label for="interest">What are you interested in?</label><select id="interest" name="interest"><option value="enquiry">A general enquiry</option><option value="demo">Arrange a demo</option><option value="website">A barber website</option><option value="booking">Check my booking system</option><option value="pilot">Apply for a pilot</option><option value="support">Help with an existing setup</option><option value="change">Request a change</option><option value="setup">A setup question</option></select>
<p id="chosen-plan" class="notice" hidden></p>
<fieldset id="booking-fields" hidden disabled><legend>Your booking setup</legend><label for="booking-method">Current booking method</label><select id="booking-method">{booking_options}</select><label for="booking-help">What help would you like?</label><select id="booking-help">{help_options}</select></fieldset>
<fieldset id="demo-fields" hidden disabled><legend>Your demo request</legend><label for="preferred-time">Preferred day or time <span>(optional)</span></label><input id="preferred-time" maxlength="100" aria-describedby="time-help"><small id="time-help">Include your time zone. This is a request, not a confirmed appointment.</small></fieldset>
<p id="pilot-note" class="notice" hidden>Pilot suitability, scope, price, duration and inclusions must be agreed before starting. Applying does not start a subscription or create a payment obligation.</p>
<label for="question">Question or short message <span>(optional)</span></label><textarea id="question" rows="4" maxlength="600" aria-describedby="question-help"></textarea><small id="question-help">Please leave out passwords, payment-card details and customer records.</small>
<p class="small">Your details let us reply about your shop. They stay in this page until you choose to open a draft. <a href="privacy.html">How we use your information</a>.</p>
<button class="button" type="submit">Review my message <span aria-hidden="true">→</span></button>
</form><noscript><p>{email()} · <a href="{E(C['contact']['whatsapp'])}">Contact us on WhatsApp</a></p></noscript></div></section>
<dialog id="message-review" aria-labelledby="review-title"><button id="close-review" class="close" aria-label="Close message review" autofocus>×</button><p class="eyebrow">CHECK BEFORE SENDING</p><h2 id="review-title">Your message.</h2><pre id="message-text"></pre><p id="draft-status" class="notice" role="status"></p><div class="actions"><a id="draft-email" class="button">Open an email draft ↗</a><a id="draft-whatsapp" class="button secondary" target="_blank" rel="noopener noreferrer">Open WhatsApp draft ↗</a></div><p class="small">If your email app does not open, try the WhatsApp option. You can close this window to edit your details.</p></dialog>''','contact')

page('about.html','About HelloDesk','HelloDesk focuses on practical telephone help and websites for UK barber shops.',
intro('ABOUT HELLODESK','Built around<br><em>the way barbers work.</em>','The HelloDesk team focuses on telephone help and custom websites for UK barber shops.')+
'<section class="wrap section top-none narrow"><h2>Understand the shop first.</h2><p>We start with your services, opening hours and booking method. Then we agree what the assistant should answer, what it should do and when your team should step in.</p><p>Our approach is simple: use your approved information, explain the costs and test the agreed features before use.</p><p>The receptionist is still being prepared and tested. The examples on this website are fictional illustrations.</p></section>'+cta())

page('support.html','Customer support','Contact HelloDesk for setup questions, change requests or help with an existing setup.',
intro('CUSTOMER SUPPORT','How can we help<br><em>your shop?</em>','Tell us your shop name and briefly explain what you need.')+
f'''<section class="wrap section top-none two-col"><div class="panel"><h2>Contact our team.</h2><p>Use our enquiry form to contact the team about your existing setup.</p>{button("Make a support enquiry","contact.html?interest=support")}<div class="actions">{button('Get help on WhatsApp',wa('support'),extra='data-whatsapp="support"')}</div><p id="support-hours" hidden></p><p id="support-response" hidden></p><p class="small">Do not send passwords, private keys, card details or customer records.</p></div><div><h2>Point us in the right direction.</h2><ul class="support-links"><li><a href="contact.html?interest=support"><b>Something isn’t working</b><span>Describe what happened and when.</span></a></li><li><a href="contact.html?interest=setup"><b>A setup question</b><span>Tell us what you’re trying to arrange.</span></a></li><li><a href="contact.html?interest=change"><b>A change request</b><span>Explain the information or feature you want changed.</span></a></li><li><a href="contact.html"><b>A new enquiry</b><span>Discuss your shop and what could help.</span></a></li></ul></div></section>''')

page('pilot.html','Apply for a pilot','Discuss a HelloDesk pilot for your barber shop. Scope, suitability, pricing and duration are agreed before starting.',
intro('EXPLORE A PILOT','Find out what works<br><em>for your shop.</em>','A pilot would help us check the agreed features with your shop and review the results.')+
f'''<section class="wrap section top-none narrow"><p class="notice">Suitability, scope, price, duration and inclusions must be agreed before starting. Applying does not mean acceptance, start a subscription or create a payment obligation.</p><h2>A clear plan before starting.</h2><ol class="steps"><li><b>Apply.</b><span>Tell us about your shop.</span></li><li><b>Discuss your needs.</b><span>Check your current booking method.</span></li><li><b>Agree the terms.</b><span>Set the scope, price, duration and inclusions.</span></li><li><b>Set up and test.</b><span>Check the agreed features before use.</span></li><li><b>Review the results.</b><span>Look at booking accuracy, unresolved requests and interruptions.</span></li></ol>{button('Apply for a pilot','contact.html?interest=pilot')}</section>''')

page('privacy.html','Privacy and your information','How information is handled by this HelloDesk website, its examples and its contact drafts.',
intro('PRIVACY','Your details.<br><em>Clearly explained.</em>','This notice describes the current website and contact options.')+
f'''<section class="wrap section top-none narrow prose"><h2>Who to contact</h2><p>For questions about your information or to ask for a correction or deletion, contact HelloDesk at {email()}.</p>
<h2>Enquiry drafts</h2><p>The enquiry form uses your shop name, contact name, reply details and message to prepare a draft. The form itself does not send a request to HelloDesk. Your entries stay in the page and are not saved by the website.</p><p>You can review the draft before choosing email or WhatsApp. Opening either option passes the draft to that service. You choose whether to send it. Your email provider or WhatsApp then handles the message under its own privacy terms.</p><p>If you send a message, HelloDesk uses the details to respond to your enquiry, discuss your shop or help with your setup. Do not include passwords, payment-card details or customer records. No marketing subscription is created.</p>
<h2>Examples and tools</h2><p>The receptionist walkthrough and barber concept use fictional details. They make no calls, request no microphone access, take no payment and create no appointment.</p><p>The calculator runs in your browser. The setup brief stays in the page until you download a copy to your device. Neither tool sends your entries to HelloDesk. Refreshing or leaving the page can clear them.</p>
<h2>Website access</h2><p>The hosting service handles the connection information needed to serve the website. A private preview may require a ChatGPT sign-in. HelloDesk has not added advertising trackers or analytics scripts to these pages.</p>
<h2>Before a telephone service starts</h2><p>Caller notices, any recording or transcripts, who can access them and how long they are kept must be agreed before the telephone service is activated.</p></section>''')

# Preserve the detailed local brief and all eight manually reported acceptance checks.
setup_fields=[
('barber-shop-name','Barber shop name','input',100),
('barber-platform','Current booking system','input',100),
('barber-business-number','Public business telephone','input',40),
('barber-website','Public website or booking link','input',300),
('barber-services','Services, prices and appointment lengths','textarea',1800),
('barber-availability','Staff diaries, hours and booking limits','textarea',1800),
('barber-changes','Changes, cancellations and deposits','textarea',1800),
('barber-fallback','When to ask your team and how to pass on messages','textarea',1800),
('barber-preferences','Greeting, messages and website preferences','textarea',1500)]
def setup_input(f):
    key,label,kind,size=f
    field=f'<textarea id="{key}" rows="3" maxlength="{size}"></textarea>' if kind=='textarea' else f'<input id="{key}" maxlength="{size}">'
    return f'<label for="{key}">{label} <span>(optional)</span></label>{field}'
tests=[
('Correct service, staff and time','Check the actual diary, appointment length, hours, breaks and requested barber.'),
('No double booking','Try the same slot twice, including at the same time. Recheck availability when saving.'),
('Confirmation follows calendar acceptance','Confirm only after the calendar accepts the booking. A timeout is not a confirmation.'),
('Change the correct appointment','Identify the booking and verify the new time without creating duplicates.'),
('Cancel the correct appointment','Check identity and cancellation rules. A retry must not cancel another appointment.'),
('A clear route to the team','Test answered and unanswered transfers and where messages go.'),
('No availability or connection failure','Try a full diary and a failed connection. Check the agreed next step.'),
('The real telephone journey','Call the business number during an agreed test. Check routing, sound, interruptions, ending the call and any agreed texts.')]
test_html=''.join(f'<div class="test-row"><h3>{i+1}. {title}</h3><p>{copy}</p><label for="test-{i}">Result</label><select id="test-{i}" data-barber-test data-test-name="{E(title)}"><option value="not-tested">Not yet tested</option><option value="passed">Manually checked — passed</option><option value="needs-work">Needs work</option></select></div>' for i,(title,copy) in enumerate(tests))
plan_options=''.join(f'<option value="{p["id"]}">{E(p["name"])}</option>' for p in P['packages'])
page('barber-setup.html','Your shop setup brief','Prepare and download a local brief with your shop details, package choice and manually reported test notes.',
intro('AFTER YOUR FIRST CONVERSATION','Your shop.<br><em>Your setup brief.</em>','Keep your services, booking rules and agreed test notes in one working document.')+
f'''<section class="wrap section top-none narrow"><p class="notice">This stays in the page. Download your copy before leaving; nothing is sent to HelloDesk. Use public shop information, not passwords or customer records.</p>
<form id="barber-setup-form"><nav class="pill-links" aria-label="Setup steps"><button type="button" data-barber-step-link="1" disabled>1. Your shop</button><button type="button" data-barber-step-link="2" disabled>2. Booking rules</button><button type="button" data-barber-step-link="3" disabled>3. Review &amp; tests</button></nav><p id="barber-setup-error" class="error" hidden></p>
<section data-barber-step="1"><h2 id="barber-step-title-1" tabindex="-1">Start with your shop.</h2>{''.join(setup_input(f) for f in setup_fields[:4])}<label for="barber-package">Package of interest</label><select id="barber-package"><option value="">Not sure yet</option>{plan_options}</select><p id="barber-package-summary" class="notice">Choose a package to see its price and allowances. No package is ordered.</p></section>
<section data-barber-step="2"><h2 id="barber-step-title-2" tabindex="-1">How should it help?</h2><p>Leave anything undecided blank. It will be marked “To agree”.</p>{''.join(setup_input(f) for f in setup_fields[4:])}</section>
<section data-barber-step="3"><h2 id="barber-step-title-3" tabindex="-1">Review before use.</h2><dl id="barber-review" class="brief-review"></dl><h3>Tests to carry out with the team</h3><p>These tests do not run here. Record a result only after an agreed test of the real service. A manually entered pass is not independent verification.</p>{test_html}<label for="barber-test-notes">Test notes and outstanding decisions</label><textarea id="barber-test-notes" rows="4" maxlength="1800"></textarea><p id="barber-test-status" class="notice" aria-live="polite"></p><button id="barber-download" class="button" type="button" disabled>Download shop brief &amp; checklist ↓</button><p class="small">A working document, not an order, agreement or permission to start the service. {E(P['terms']['receptionistSetup'])} {E(P['vatNote'])}</p></section>
<div id="barber-step-navigation" class="example-controls" hidden><button id="barber-back" class="button secondary" type="button">← Back</button><button id="barber-next" class="button" type="button">Next →</button><span id="barber-step-status" aria-live="polite"></span></div>
<button id="barber-reset" class="text-button" type="button" disabled>Clear this working sheet</button><p id="barber-save-status" class="small" role="status">Nothing has been sent or saved by HelloDesk.</p></form></section>''',extra_scripts='<script src="barber-setup.js" defer></script>')

page('payment-return.html','Check your payment status','This page cannot verify a payment or activate a HelloDesk service.',
intro('PAYMENT STATUS','Check your receipt.','This page cannot verify a payment or activate a service. Check your payment provider’s receipt before trying again.')+
'<section class="wrap section top-none"><p>If you are unsure, contact us with your shop name and payment reference. Do not send card details.</p>'+button('Contact customer support','support.html')+'</section>',robots='<meta name="robots" content="noindex,follow">')
page('404.html','Page not found','Find your way back to HelloDesk.',
intro('PAGE NOT FOUND','Let’s get you<br><em>back to the shop.</em>','This page may have moved.')+'<section class="wrap section top-none">'+button('Go to the homepage','index.html')+'</section>',robots='<meta name="robots" content="noindex,follow">')

redirects={
'industries.html':'barbers.html','industries/barbers.html':'../barbers.html',
'calls.html':'receptionist-example.html','demo.html':'receptionist-example.html','practice-booking.html':'receptionist-example.html',
'compatibility.html':'barbers.html#booking-check','onboarding.html':'barbers.html#how',
'book-demo.html':'contact.html?interest=demo','proof.html':'pilot.html','guide.html':'barber-setup.html',
'personalise.html':'barber-setup.html','voice-privacy.html':'privacy.html'}
for src,target in redirects.items():
    write(src,f'''<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page moved | HelloDesk</title><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url={E(target)}"></head><body><p>This page has moved. <a href="{E(target)}">Continue to HelloDesk</a>.</p></body></html>''')
print('Built 14 pages and '+str(len(redirects))+' redirects from shared settings and package data.')
