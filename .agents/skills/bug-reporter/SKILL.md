---
name: bug-reporter
description: Formats bug reports consistently for both GitHub Issues and the academic Markdown bug report.
---

# Bug Reporter Skill

## Overview
This skill guides the tester in logging high-quality, professional defect reports adhering to ISTQB and IEEE 829 standards, directly ready to post on the team's GitHub Issues page and `reports/bug_report.md`.

## Standard Bug Template

```markdown
# [BUG][<Feature-ID>] <Concise summary of failure>

## 1. Information
- **Bug ID**: `BUG-<Feature-ID>-XX`
- **Feature**: `<Feature ID>: <Feature Name>`
- **Severity**: Critical | High | Medium | Low
- **Priority**: P1 | P2 | P3 | P4
- **Tested Environment**: Windows 11 / Chrome Version ... / Mobile Android/iOS
- **Tester**: <Student Name / Student ID>
- **Date**: YYYY-MM-DD

## 2. Preconditions
- <State of system prior to test, e.g., Logged in as Customer, Cart has 1 item>

## 3. Steps to Reproduce
1. Navigate to `<URL/Screen>`
2. Enter `<Input Data>` into field `<Field Name>`
3. Click button `<Button Name>`

## 4. Test Data
- Boundary tested: On-point / Off-point / Invalid domain
- Specific values: `<e.g., quantity = -1, coupon = 'TEST999'>`

## 5. Expected Result
- The system should reject the invalid input and display error message: `"<Expected message>"`

## 6. Actual Result
- <Description of what actually happened, e.g., System accepted negative quantity, or crashed with 500 Internal Server Error>

## 7. Evidence & Screenshots
- GitHub Issue Link: `<URL to GitHub Issue>`
- Screenshot:
![Bug Evidence Screenshot](../evidence/<image_filename>.png)
```
