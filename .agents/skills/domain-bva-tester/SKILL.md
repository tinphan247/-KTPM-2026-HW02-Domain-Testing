---
name: domain-bva-tester
description: Expert Agent Skill to perform structured Domain Testing and Boundary Value Analysis (BVA) on System Under Test (SUT) features according to ISTQB standards.
---

# Domain Testing & Boundary Value Analysis (BVA) Skill

## Overview
This skill guides the AI and the tester through a disciplined, step-by-step procedure to analyze software specifications/source code and design rigorous test suites using:
1. **Domain Testing (Equivalence Partitioning & Relational Constraints)**
2. **Boundary Value Analysis (BVA - 2-value & 3-value boundaries, on-points, off-points, in-bounds, out-of-bounds)**

---

## Step-by-Step Procedure

### Step 1: Feature Specification & Input Identification
Inspect the target feature in the SUT (UI forms, API endpoints, or source code in `eshop-sut/`).
For each input field/variable, extract:
- **Field Name**: Parameter identifier (e.g., `email`, `password`, `quantity`, `discount_code`).
- **Data Type**: String, Integer, Float, Date, Boolean, Enum.
- **Constraints / Rules**: Min/Max length, character restrictions (regex), numerical ranges, mandatory/optional status.
- **System Interdependencies**: Multi-variable relations (e.g., `coupon.min_order_value <= cart.subtotal`).

### Step 2: Equivalence Partitioning (Domain Analysis)
For each input variable and relation:
1. Divide the input domain into **Disjoint Sub-domains (Equivalence Partitions)**:
   - **Valid Partitions ($EP_V$)**: Inputs expected to be accepted by the system.
   - **Invalid Partitions ($EP_I$)**: Inputs expected to be rejected with appropriate error handling.
2. Formulate the Equivalence Partitioning Table:

| Variable | Partition ID | Description | Partition Type | Representative Value | Expected Behavior |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `field_name` | `EP-F1-01` | Valid range $[A, B]$ | Valid | $X \in [A, B]$ | Accepted |
| `field_name` | `EP-F1-02` | Value $< A$ | Invalid | $X < A$ | Error: Too small / below minimum |
| `field_name` | `EP-F1-03` | Value $> B$ | Invalid | $X > B$ | Error: Exceeds maximum |

### Step 3: Boundary Value Analysis (BVA)
Apply boundary value analysis on every ordered domain (integers, floats, string lengths, dates):
1. **Determine Boundary Points**:
   - For closed boundary $[A, B]$:
     - Boundary $A$: On-point = $A$, Off-point = $A - 1$ (or adjacent out-of-bound), In-bound point = $A + 1$.
     - Boundary $B$: On-point = $B$, Off-point = $B + 1$ (or adjacent out-of-bound), In-bound point = $B - 1$.
2. **Apply Testing Approach**:
   - **2-Value BVA**: Test On-point and Off-point.
   - **3-Value BVA (Robustness)**: Test On-point, Off-point, and typical In-bound point ($Min - 1, Min, Min + 1$ and $Max - 1, Max, Max + 1$).
3. Formulate the BVA Analysis Table:

| Variable | Boundary Point | Tested Value | Value Category | Expected Result |
| :--- | :---: | :---: | :---: | :--- |
| `field_name` | Lower Boundary ($A$) | $A - 1$ | Off-point (Out-of-bound) | Rejected with error |
| `field_name` | Lower Boundary ($A$) | $A$ | On-point (In-bound) | Accepted |
| `field_name` | Lower Boundary ($A$) | $A + 1$ | In-bound | Accepted |
| `field_name` | Upper Boundary ($B$) | $B - 1$ | In-bound | Accepted |
| `field_name` | Upper Boundary ($B$) | $B$ | On-point (In-bound) | Accepted |
| `field_name` | Upper Boundary ($B$) | $B + 1$ | Off-point (Out-of-bound) | Rejected with error |

### Step 4: Multi-Variable Domain Testing (Relational Boundaries)
When variables interact (e.g., Discount code vs Order Subtotal vs Expiration Date):
- Model 2D/3D decision boundaries (linear boundaries: $y = ax + b$, or inequality constraints: $x + y \le C$).
- Test boundary points along the boundary line (On-point) and immediately outside the feasible region (Off-point).

### Step 5: Test Case Synthesis (Standard Test Case Matrix)
Synthesize the analysis into actionable, standardized test cases:

| Test Case ID | Feature | Technique | Test Objective | Preconditions | Inputs / Test Data | Expected Output | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `TC-A-01` | `FR-XX` | Domain (Valid) | Verify valid input within partition | System ready | `{"field": "val"}` | Success / Record saved | ... | Pending |
| `TC-A-02` | `FR-XX` | BVA (Min-1) | Verify lower off-point boundary | System ready | `{"field": Min-1}` | Rejection error message | ... | Pending |
| `TC-A-03` | `FR-XX` | BVA (Max+1) | Verify upper off-point boundary | System ready | `{"field": Max+1}` | Rejection error message | ... | Pending |

### Step 6: Human Review & Edge-case Hardening
Review the generated test suite and verify against:
- Vietnamese Unicode text input (accent marks, compound words, UTF-8 byte boundary).
- SQL injection / XSS payload boundary (`' OR 1=1 --`, `<script>`).
- Whitespace handling (leading/trailing spaces, only spaces).
- Special system states (concurrency, session expiration, zero-quantity inventory).
