# Skill: domain-bva-tester

**Purpose:** Reusable, step-by-step Domain Testing + Boundary Value Analysis for EShop (HW02). Produces auditable test cases, never one-shot dumps.
**Scope:** Any FR with countable/string/state/time boundaries (FR-02 lockout, FR-09 coupons, FR-16 CSV, FR-20 mobile state machine, etc.).
**Outcomes:** Tables in `Main_Report.md` + audit entry in `AI_Audit_Report.md` + git commit per step.

---

## Workflow (MUST follow in order, stop for human review after each step)

### Step 1 — Extract Domain Variables & Equivalence Partitioning (black-box first)

1. Read ONLY the SRS section for the target FR (do NOT open source code yet).
2. List every domain variable with: name, type, unit/step-precision, constraints from spec.
   - Include hidden state variables (e.g. `failCount`, `lockoutUntil`, `used_count`, `order.status`, `rowIndex`).
3. For each variable, build partitions:
   | Variable | Valid partitions | Invalid partitions | Representative value |
   - Partitions must be disjoint and cover the input domain.
4. Write Domain TCs using `templates/test_case_table.md` with IDs `<FR>-DT-01...`.
5. Append audit entry (Artifact N) to `AI_Audit_Report.md` using `templates/audit_entry.md`.
6. Commit: `feat(<FR>): complete step-by-step Domain Testing partitions and test cases`.
7. STOP — wait for human review before BVA.

### Step 2 — Boundary Value Analysis (6-point + step-unit justification)

1. From Step-1 partitions, identify every ordered boundary (numbers, lengths, dates, counts, times).
2. For each boundary B with step unit `u` (e.g. money 1000₫, count 1, second 1s, char 1):
   test `B-2u (min-)`, `B-u`, `B` ... actually use standard 6-point set:
   `min-, min, min+, nom, max-, max, max+` — state the `u` explicitly and why.
3. Explain WHY each point was chosen (off-by-one, `>=` vs `>`, `expired_at` day edge, `max_uses` 1st/2nd/3rd use).
4. Add BVA TCs with IDs `<FR>-BVA-01...` (continue numbering, no meaningless duplicates of DT set).
5. Update audit log + commit: `feat(<FR>): add Boundary Value Analysis (BVA) test cases`.
6. STOP — wait for human review before gap analysis.

### Step 3 — Generate standard test-case table

Columns (exact): `TC_ID | Partition/Boundary | Input Data | Pre-conditions | Steps | Expected Output | Actual Result | Status`.
- Expected comes ONLY from SRS v2.0 wording (quote condition, e.g. `total >= min_order_amount`).
- Leave Actual/Status empty until execution.

### Step 4 — Auto-log prompt/output into AI_Audit_Report.md

Every skill invocation appends a 5-section entry:
`(1) Prompt+tool+timestamp HH:MM dd/mm/yyyy` · `(2) full AI output (no paraphrase)` · `(3) Verdict VALID/INVALID/INCOMPLETE` · `(4) Reasoning 2–5 sentences citing ISTQB/slide` · `(5) Student fix`.
At the end of HW, compute VALID/INVALID/INCOMPLETE % + WHEN to use/not use AI.

---

## Gap-analysis mode (run AFTER Steps 1–2, separate commit)

1. NOW open backend/frontend source + run the SUT.
2. Diff spec-only TCs vs code behavior: whitespace trim, case sensitivity, `type="email"` vs server check, generic vs leaking error messages, HTTP status vs UI toast, race/double-submit, XSS/HTML escape, `total_amount` client override (FR-08), rollback atomicity (FR-16), `shipping` user-cancel (FR-10/20).
3. Write `AI Gap Analysis & Human Review` section: missed cases → root cause (spec gap / LLM context limit / state complexity) → added TCs.
4. Commit: `docs(<FR>): add AI gap analysis and human review refinements`.

## Execution mode (separate commit)

1. Prefer API/cURL/Playwright where feasible; else list highest-fail-probability scenarios for manual run + screenshots.
2. Fill Actual/Status; file bugs in `Bug_Reports.md` (GitHub-Issue format) + real GitHub Issues + `screenshots/<FR>-*.png`.
3. Commit: `test(<FR>): record test execution results and bug reports`.

---

## Rules

- Never generate all 4 features in one prompt. One FR + one step at a time.
- Never invent execution results. If not executed, Status = `Not executed`.
- Quote SRS operators exactly (`>=`, `>`, `=1`, `<`). A wrong operator = wrong boundary.
- Each step = one git commit. No empty commits, no multi-minute batch commits.
