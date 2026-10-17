---
name: ai-audit-logger
description: Automatically formats and appends AI interaction details to reports/ai_audit_report.md to satisfy the mandatory AI Audit Report appendix.
---

# AI Audit Logger Skill

## Overview
This skill ensures compliance with Section 9 of HW02 ("AI Audit Report - Mandatory Appendix"). Every significant interaction with the AI assistant must be logged in a structured, transparent format.

## Log Entry Format
Whenever an AI prompt-response session completes, log an entry with:

```markdown
### Interaction #<Index>: <Task Summary>
- **AI Tool**: <e.g., Antigravity / Gemini 3.8 Flash / Claude 3.5 Sonnet>
- **Date & Time**: YYYY-MM-DD HH:mm (Local Time)
- **Target Feature**: <Feature ID & Name>
- **Prompt**:
> <Exact user prompt or summarized prompt intent>

- **AI Output Summary**:
<Concise summary of the output produced by the AI (e.g., generated 12 test cases for BVA, identified 3 boundary points).>

- **Human Review & Modifications**:
<Details on what the student verified, corrected, or added (e.g., added Vietnamese unicode test cases, fixed off-point calculation).>
```

## Storage Location
All entries must be maintained in:
`reports/ai_audit_report.md`
