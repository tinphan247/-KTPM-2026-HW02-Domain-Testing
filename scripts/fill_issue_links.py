# Fill filed GitHub issue URLs into the HW02 reports (one-off release step).
# Run: python3 scripts/fill_issue_links.py   (needs scripts/created_issues.json)
import json, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
MAPPING = json.loads((ROOT / 'scripts' / 'created_issues.json').read_text(encoding='utf-8'))
REPO = 'https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing'

def num(bug):
    return int(MAPPING[bug].rstrip('/').rsplit('/', 1)[-1])

def bug_range(prefix):
    ns = sorted(num(b) for b in MAPPING if b.startswith(prefix))
    return ns[0], ns[-1]

RANGES = {p: bug_range(p) for p in ('FR02', 'FR09', 'FR16', 'FR20')}
SEC_LINE = {
    'FR02': 'FR02 issues #1-10 (filed 16/10/2026, PNGs attached)',
    'FR09': 'FR09 issues #11-20 (filed 16/10/2026, PNGs attached)',
    'FR16': 'FR16 issues #21-30 (filed 16/10/2026, PNGs attached)',
    'FR20': 'FR20 issues #31-38 (filed 16/10/2026, PNGs attached)',
}

# 1. Bug_Reports.md — per-bug link + per-section filed line
p = ROOT / 'Bug_Reports.md'
lines = p.read_text(encoding='utf-8').split('\n')
out, cur, inserted = [], None, set()
i, n = 0, len(lines)
while i < n:
    ln = lines[i]
    m = re.match(r'### (FR\d\d-BUG-\d\d)\b', ln)
    if m:
        cur = m.group(1)
    out.append(ln)
    if cur and cur not in inserted and '**Related TCs:**' in ln:
        nxt = lines[i + 1] if i + 1 < n else ''
        if not nxt.strip().startswith('**GitHub Issue:**'):
            out.append(f'**GitHub Issue:** {MAPPING[cur]}')
        inserted.add(cur)
    i += 1
text = '\n'.join(out)
for prefix, label in (('FR02', SEC_LINE['FR02']), ('FR09', SEC_LINE['FR09']),
                      ('FR16', SEC_LINE['FR16']), ('FR20', SEC_LINE['FR20'])):
    text = text.replace('GitHub Issue links: TODO — file on group repo with PNGs attached.',
                        f'GitHub Issues (filed): {label} — {REPO}/issues.', 1)
    text = text.replace('GitHub Issue links: TODO — file on group repo with PNG attached.',
                        f'GitHub Issues (filed): {label} — {REPO}/issues.', 1)
missing = [b for b in MAPPING if b not in inserted]
print('per-bug links inserted:', len(inserted), 'missing:', missing)
p.write_text(text, encoding='utf-8')

# 2. Main_Report.md — 4 section footers + summary + disclosure
p = ROOT / 'Main_Report.md'
text = p.read_text(encoding='utf-8')
pairs = [('FR-02', 'FR02'), ('FR-09', 'FR09'), ('FR-16', 'FR16'), ('FR-20', 'FR20')]
for sec, prefix in pairs:
    a, b = RANGES[prefix]
    text = text.replace(
        'GitHub Issues: to be filed on the group repo with the PNGs attached (links added here after filing).',
        f'GitHub Issues (filed 16/10/2026): {sec} issues #{a}–#{b} with PNGs attached — {REPO}/issues.', 1)
    text = text.replace(
        'GitHub Issues: to be filed on the group repo with the PNG attached (links added here after filing).',
        f'GitHub Issues (filed 16/10/2026): {sec} issues #{a}–#{b} with PNGs attached — {REPO}/issues.', 1)
text = text.replace(
    'GitHub Issues (38 total): [TODO: Insert 38 GitHub Issue Links — https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing].',
    f'GitHub Issues (38 total, filed 16/10/2026): FR-02 #1–10 · FR-09 #11–20 · FR-16 #21–30 · FR-20 #31–38 — {REPO}/issues.')
text = text.replace(
    'Group Issues: [TODO: Insert 38 GitHub Issue Links].',
    f'Group Issues: filed 16/10/2026 (#1–38) — {REPO}/issues.')
p.write_text(text, encoding='utf-8')

# 3. README.md + AI_Audit_Report.md disclosure lines
for name in ('README.md', 'AI_Audit_Report.md'):
    p = ROOT / name
    text = p.read_text(encoding='utf-8')
    text = text.replace(
        'Group GitHub Issues (38 total): [TODO: Insert 38 GitHub Issue Links — https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing].',
        f'Group GitHub Issues (38 total, filed 16/10/2026): FR-02 #1–10 · FR-09 #11–20 · FR-16 #21–30 · FR-20 #31–38 — {REPO}/issues.')
    text = text.replace(
        'Group GitHub Issue links: [TODO: Insert 38 GitHub Issue Links — https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing].',
        f'Group GitHub Issue links (filed 16/10/2026): FR-02 #1–10 · FR-09 #11–20 · FR-16 #21–30 · FR-20 #31–38 — {REPO}/issues.')
    p.write_text(text, encoding='utf-8')
print('done.')
