# HW02 — README (submission cover + self-assessment)

**Student:** Phan Trung Tin — **ID:** 23120372
**Exercise:** HW02-AI — Domain Testing on EShop
**SUT:** https://github.com/ttbhanh/eshop-sut
**Selected features:** FR-02 (Pool A) · FR-09 (Pool B) · FR-16 (Pool C) · FR-20 (Pool D Mobile)

---

## 1. Self-assessment table (per HW02 §15)

| No. | Criteria | Max | Self-Assessed |
| :--- | :--- | ---: | ---: |
| 1 | Feature A — FR-02 (Domain + Boundary) | 25 | TBD |
| 2 | Feature B — FR-09 (Domain + Boundary) | 25 | TBD |
| 3 | Feature C — FR-16 (Domain + Boundary) | 25 | TBD |
| 4 | Feature D — FR-20 Mobile (Domain + Boundary) | 15 | TBD |
| 5 | Agent Skills + demo videos | 10 | TBD |
| **Total** | | **100** | **TBD** |

Target grade: 90–100 (fill exact 3-digit number at zip time, e.g. `090`).

---

## 2. Test summary report

| Feature | Designed | Executed | Passed | Failed | Not executed | Bugs |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| FR-02 | 37 | 37 | 13 | 24 | 0 | 10 |
| FR-09 | 48 | 0 | 0 | 0 | 48 | 0 |
| FR-16 | 0 | 0 | 0 | 0 | 0 | 0 |
| FR-20 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Total** | **85** | **37** | **13** | **24** | **48** | **10** |

---

## 3. Contents of this folder (maps to required .zip)

- `Main_Report.md` (+ PDF at export) — Domain + BVA per feature
- `Bug_Reports.md` — bug details; screenshots in `screenshots/`; also on group GitHub Issues
- `AI_Audit_Report.md` — audit log + AI Critique (200–300 words) + disclosure
- `git_commit_log.txt` — generated at the end via `git log --stat --pretty=fuller`
- `skills/domain-bva-tester/` — reusable Agent Skill
- `screenshots/` — bug evidence (placeholder `.gitkeep` for now)
- Demo videos: TODO — YouTube Unlisted links (skill end-to-end on one full feature)

## 4. How to reproduce (SUT)

1. `cd eshop-sut/backend && npm install && node database.js && node server.js` (keep running, port 3000)
2. `cd ../frontend-web && npm install && npm run dev` (port 5173)
3. `cd ../frontend-admin && npm install && npm run dev` (port 5174)
4. Mobile: `cd ../frontend-mobile && npm install && npx expo start` + Expo Go, same Wi-Fi
5. Default accounts: `admin@eshop.com / Admin123!` (README) — setup_guide says `admin123`; verify during FR-12/FR-02 testing. User: `test@eshop.com / Test1234!`

## 5. Commit convention

One commit per testing step per feature, e.g.:
`feat(FR-02): ... Domain ...`, `feat(FR-02): ... BVA ...`, `docs(FR-02): ... gap analysis ...`, `test(FR-02): ... execution+bugs ...` (same for FR-09/16/20).
