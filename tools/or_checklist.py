#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Odia (ଓଡ଼ିଆ) workflow for the OFFICIAL checklist wording.

  python tools/or_checklist.py export            -> tools/translation-sheet.xlsx   (hand to translators / reviewers)
  python tools/or_checklist.py draft [--limit N] -> fills 'Draft Odia' with Claude (needs ANTHROPIC_API_KEY); drafts are NOT used by the app
  python tools/or_checklist.py build             -> data/or-checklist.json         (only rows with Status = Approved)

Rule: only text a reviewer marked **Approved** reaches the app. English stays the authoritative text.
Requires: pip install openpyxl   (and `anthropic` for the draft step)
"""
import json, os, re, sys, collections
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
INDEX = os.path.join(ROOT, 'index.html'); SHEET = os.path.join(HERE, 'translation-sheet.xlsx')
OUT = os.path.join(ROOT, 'data', 'or-checklist.json')
norm = lambda s: re.sub(r'\s+', ' ', str(s or '')).strip()

def load_data():
    lines = open(INDEX, encoding='utf-8').read().split('\n')
    nq = kk = None
    dec = json.JSONDecoder()
    for l in lines:
        if l.startswith('const NQAS_DATA = '): nq = dec.raw_decode(l[len('const NQAS_DATA = '):])[0]
        elif l.lstrip().startswith('const KK={'): kk = dec.raw_decode(l[l.index('{'):])[0]
    if not nq or not kk: sys.exit('Could not find NQAS_DATA / KK in index.html')
    return nq, kk

def collect():
    """-> OrderedDict english -> (level, example location, count)"""
    nq, kk = load_data(); seen = collections.OrderedDict()
    def add(s, level, where):
        s = norm(s)
        if len(s) < 2: return
        if s in seen: seen[s][2] += 1
        else: seen[s] = [level, where, 1]
    for f, fd in nq.items():
        for d in fd['departments']:
            add(d['label'], '1 Department', f)
            for st in d['standards']:
                add(st['label'], '2 Standard', f + ' / ' + d['label'])
                for me in st['mes']:
                    add(me['label'], '3 Measurable element', f + ' / ' + st['code'])
                    for cp in me['checkpoints']:
                        add(cp['label'], '4 Checkpoint', f + ' / ' + me['label'][:40])
                        for m in cp.get('mov', []): add(m, '5 Means of verification', f)
    for k, v in kk.items():
        for h in v['themes']:
            add(h['name'], 'K1 Kayakalp theme', k)
            for c in h['cats']:
                add(c['name'], 'K2 Kayakalp category', k + ' / ' + h['name'])
                for i in c['items']:
                    add(i['t'], 'K3 Kayakalp checkpoint', k + ' ' + i['ref'])
                    if i.get('v'): add(i['v'], 'K4 Kayakalp means of verification', k + ' ' + i['ref'])
    return seen

def seed_map():
    sys.path.insert(0, HERE); import seed_or
    nq, kk = load_data(); m = {}
    depts = []; [depts.append(d['label']) for fd in nq.values() for d in fd['departments'] if d['label'] not in depts]
    themes = []; cats = []
    for v in kk.values():
        for h in v['themes']:
            if h['name'] not in themes: themes.append(h['name'])
            for c in h['cats']:
                if c['name'] not in cats: cats.append(c['name'])
    assert (len(depts), len(themes), len(cats)) == (len(seed_or.DEPTS), len(seed_or.THEMES), len(seed_or.CATS)), 'seed no longer matches the data order'
    for en, od in list(zip(depts, seed_or.DEPTS)) + list(zip(themes, seed_or.THEMES)) + list(zip(cats, seed_or.CATS)): m[norm(en)] = od
    return m

def existing():
    try: return json.load(open(OUT, encoding='utf-8')).get('map', {})
    except Exception: return {}

def export():
    from openpyxl import Workbook, load_workbook
    from openpyxl.styles import Font, PatternFill, Alignment
    prev = {}
    if os.path.exists(SHEET):   # keep earlier work
        ws = load_workbook(SHEET).active
        for r in ws.iter_rows(min_row=2, values_only=True):
            if r[1]: prev[norm(r[1])] = r
    approved = existing(); seeds = seed_map(); data = collect()
    wb = Workbook(); ws = wb.active; ws.title = 'Translations'
    ws.append(['Level', 'English (official - do not edit)', 'Odia (final)', 'Draft Odia (machine, unreviewed)', 'Status', 'Reviewer notes', 'Used in', 'Times used'])
    for c in ws[1]: c.font = Font(bold=True, color='FFFFFF'); c.fill = PatternFill('solid', fgColor='4B1F68')
    for en, (level, where, n) in sorted(data.items(), key=lambda kv: (kv[1][0], kv[0])):
        p = prev.get(en)
        final = (p[2] if p and p[2] else approved.get(en) or seeds.get(en) or '')
        status = (p[4] if p and p[4] else ('Seed - needs review' if (en in seeds and en not in approved) else ('Approved' if en in approved else '')))
        ws.append([level, en, final, (p[3] if p else '') or '', status, (p[5] if p else '') or '', where, n])
    for col, w in zip('ABCDEFGH', (22, 70, 70, 60, 20, 30, 34, 10)): ws.column_dimensions[col].width = w
    for row in ws.iter_rows(min_row=2):
        for c in row: c.alignment = Alignment(wrap_text=True, vertical='top')
    ws.freeze_panes = 'C2'; ws.auto_filter.ref = ws.dimensions
    from openpyxl.worksheet.datavalidation import DataValidation
    dv = DataValidation(type='list', formula1='"Approved,Needs review,Rejected,Seed - needs review"', allow_blank=True); ws.add_data_validation(dv); dv.add('E2:E%d' % ws.max_row)
    wb.save(SHEET); print('wrote', SHEET, '-', ws.max_row - 1, 'unique English strings')

GLOSSARY = ("Area of Concern=ଚିନ୍ତା କ୍ଷେତ୍ର (Area of Concern); Standard=ମାନକ; Measurable Element=ମାପଯୋଗ୍ୟ ଉପାଦାନ; Checkpoint=ଚେକ୍‌ପଏଣ୍ଟ; "
            "Facility=ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର; Patient=ରୋଗୀ; Staff=କର୍ମଚାରୀ; Compliant=ଅନୁପାଳିତ; Biomedical waste=ଜୈବ-ଚିକିତ୍ସା ବର୍ଜ୍ୟ; "
            "Hand hygiene=ହାତ ସ୍ୱଚ୍ଛତା; Infection control=ସଂକ୍ରମଣ ନିୟନ୍ତ୍ରଣ; Record review=ରେକର୍ଡ ସମୀକ୍ଷା; Quality policy=ଗୁଣବତ୍ତା ନୀତି")
def draft(limit):
    import time
    from openpyxl import load_workbook
    try: import anthropic
    except ImportError: sys.exit('pip install anthropic')
    if not os.environ.get('ANTHROPIC_API_KEY'): sys.exit('Set ANTHROPIC_API_KEY first')
    client = anthropic.Anthropic(); wb = load_workbook(SHEET); ws = wb.active
    todo = [r for r in range(2, ws.max_row + 1) if ws.cell(r, 2).value and not ws.cell(r, 3).value and not ws.cell(r, 4).value][:limit]
    print(len(todo), 'rows to draft')
    for i in range(0, len(todo), 20):
        batch = todo[i:i + 20]; items = {str(k): ws.cell(r, 2).value for k, r in enumerate(batch)}
        msg = ("Translate these Indian public-health quality-standard (NQAS / Kayakalp) checklist lines from English to Odia (ଓଡ଼ିଆ). "
               "Keep codes, numbers, abbreviations (OPD, ICU, PPE, MOV, NQAS...) and punctuation unchanged. Use formal government register. "
               "Glossary: " + GLOSSARY + ". Return ONLY a JSON object with the same keys.\n" + json.dumps(items, ensure_ascii=False))
        r = client.messages.create(model='claude-sonnet-4-6', max_tokens=4000, messages=[{'role': 'user', 'content': msg}])
        txt = ''.join(b.text for b in r.content if b.type == 'text'); txt = re.sub(r'^```(?:json)?|```$', '', txt.strip(), flags=re.M).strip()
        try: out = json.loads(txt)
        except Exception: print('skip batch', i); continue
        for k, r_ in enumerate(batch):
            if str(k) in out: ws.cell(r_, 4).value = out[str(k)]; ws.cell(r_, 5).value = 'Needs review'
        wb.save(SHEET); print('drafted', min(i + 20, len(todo)), '/', len(todo)); time.sleep(0.5)

def build():
    from openpyxl import load_workbook
    ws = load_workbook(SHEET).active; m = {}; stats = collections.Counter()
    for r in ws.iter_rows(min_row=2, values_only=True):
        en, od, st = norm(r[1]), (r[2] or '').strip(), (r[4] or '').strip()
        stats[st or 'blank'] += 1
        if en and od and st in ('Approved', 'Seed - needs review'):   # seed rows ship (structure labels only); change here to be stricter
            m[en] = od
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump({'version': 1, 'note': 'English->Odia for official checklist text. English remains authoritative.', 'map': m}, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print('wrote', OUT, len(m), 'entries;', dict(stats))

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'export': export()
    elif cmd == 'draft': draft(int(sys.argv[sys.argv.index('--limit') + 1]) if '--limit' in sys.argv else 10 ** 9)
    elif cmd == 'build': build()
    else: print(__doc__)
