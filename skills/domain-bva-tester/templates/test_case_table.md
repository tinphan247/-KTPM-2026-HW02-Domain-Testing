# Test case table template (used by domain-bva-tester skill)

| TC_ID | Partition / Boundary | Input Data | Pre-conditions | Steps | Expected Output | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `<FR>-DT-01` | <e.g. Valid partition: correct email+password, failCount=0> | <exact values> | <seeded data, login state> | <1. ... 2. ...> | <per SRS> | (fill at execution) | Not executed |
| `<FR>-BVA-01` | <e.g. failCount boundary 3: 2nd/3rd/4th fail> | <exact values + step unit> | <...> | <...> | <per SRS operator> | | Not executed |

Status values: `Pass` / `Fail` / `Not executed`.
