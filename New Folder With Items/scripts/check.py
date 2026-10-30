"""Check static routes, fragments, labels, pricing source and draft-only boundaries."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import subprocess

ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self):
        super().__init__();self.ids=[];self.links=[];self.labels=[];self.fields=[];self.title=False;self.h1=0;self.redirect=False;self.text=[];self.external_scripts=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='title':self.title=True
        if tag=='h1':self.h1+=1
        if tag=='meta' and a.get('http-equiv')=='refresh':self.redirect=True
        if tag in ['a','link'] and a.get('href'):self.links.append(a['href'])
        if tag in ['script','img'] and a.get('src'):
            self.links.append(a['src'])
            if a['src'].startswith('http'):self.external_scripts.append(a['src'])
        if tag=='label':self.labels.append(a.get('for'))
        if tag in ['input','select','textarea']:self.fields.append((tag,a))
    def handle_data(self,t):self.text.append(t)

pages={}
for p in ROOT.rglob('*.html'):
    if any(x.startswith('.') for x in p.relative_to(ROOT).parts):continue
    node=Page();node.feed(p.read_text());pages[p.resolve()]=node
errors=[]
for path,page in pages.items():
    rel=path.relative_to(ROOT)
    if len(page.ids)!=len(set(page.ids)):errors.append(f'{rel}: duplicate id')
    if not page.title:errors.append(f'{rel}: missing title')
    if not page.redirect and page.h1!=1:errors.append(f'{rel}: expected one h1')
    for label in page.labels:
        if label and label not in page.ids:errors.append(f'{rel}: orphan label {label}')
    for tag,a in page.fields:
        if a.get('id') not in page.labels:errors.append(f'{rel}: unlabelled {tag} {a.get("id")}')
    for link in page.links:
        u=urlsplit(link)
        if u.scheme or u.netloc:continue
        target=(ROOT/u.path.lstrip('/') if u.path.startswith('/') else path.parent/u.path).resolve() if u.path else path
        if not target.exists():errors.append(f'{rel}: missing {link}')
        elif u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:errors.append(f'{rel}: missing fragment {link}')
    if page.external_scripts:errors.append(f'{rel}: unexpected third-party script')
    text=' '.join(page.text).lower()
    for forbidden in ['barbers and salons','online now','stop no-shows','workflow orchestration','guaranteed bookings','instant reply']:
        if forbidden in text:errors.append(f'{rel}: unsupported copy: {forbidden}')
    if not page.redirect:
        if 'agammjots@gmail.com' in text:errors.append(f'{rel}: personal email displayed')
        if '07728 833548' in text:errors.append(f'{rel}: personal phone displayed')
for f in ['site.js','config.js','packages.js','barber-setup.js']:
    subprocess.run(['node','--check',str(ROOT/f)],check=True)
for deleted in ['elevenlabs-voice.js','browser-voice.js','practice-booking.js','barber-scenarios.js','website-showcase.js']:
    if (ROOT/deleted).exists():errors.append(f'obsolete demo still present: {deleted}')
if errors:raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} HTML routes; local assets/fragments, labels, contact details, demo removals and JavaScript syntax.')
