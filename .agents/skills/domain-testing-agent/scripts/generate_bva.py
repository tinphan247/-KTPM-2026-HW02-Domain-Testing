#!/usr/bin/env python3
"""
Boundary Value Analysis (BVA) & Equivalence Partitioning Test Point Generator
FIT-HCMUS Software Testing Syllabus Compliance
"""

import sys
import json

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

def generate_bva(var_name, lb, ub, step=1, is_int=True):
    """
    Generate standard 7-point BVA for an ordered range [lb, ub]:
    - LB - step (Invalid / Off-boundary)
    - LB (Valid / Lower boundary)
    - LB + step (Valid / Just above lower boundary)
    - Nominal (Valid / Center)
    - UB - step (Valid / Just below upper boundary)
    - UB (Valid / Upper boundary)
    - UB + step (Invalid / Off-boundary)
    """
    if is_int:
        nom = (lb + ub) // 2
        return [
            {"id": f"BV_{var_name}_01", "point": "LB - 1", "value": lb - step, "class": "Invalid", "desc": f"Duoi bien duoi cua {var_name}"},
            {"id": f"BV_{var_name}_02", "point": "LB", "value": lb, "class": "Valid", "desc": f"Tai bien duoi cua {var_name}"},
            {"id": f"BV_{var_name}_03", "point": "LB + 1", "value": lb + step, "class": "Valid", "desc": f"Ngay tren bien duoi cua {var_name}"},
            {"id": f"BV_{var_name}_04", "point": "Nominal", "value": nom, "class": "Valid", "desc": f"Gia tri danh dinh (giua) cua {var_name}"},
            {"id": f"BV_{var_name}_05", "point": "UB - 1", "value": ub - step, "class": "Valid", "desc": f"Ngay duoi bien tren cua {var_name}"},
            {"id": f"BV_{var_name}_06", "point": "UB", "value": ub, "class": "Valid", "desc": f"Tai bien tren cua {var_name}"},
            {"id": f"BV_{var_name}_07", "point": "UB + 1", "value": ub + step, "class": "Invalid", "desc": f"Vuot qua bien tren cua {var_name}"},
        ]
    else:
        nom = round((lb + ub) / 2, 2)
        return [
            {"id": f"BV_{var_name}_01", "point": "LB - step", "value": round(lb - step, 4), "class": "Invalid", "desc": f"Duoi bien duoi cua {var_name}"},
            {"id": f"BV_{var_name}_02", "point": "LB", "value": round(lb, 4), "class": "Valid", "desc": f"Tai bien duoi cua {var_name}"},
            {"id": f"BV_{var_name}_03", "point": "LB + step", "value": round(lb + step, 4), "class": "Valid", "desc": f"Ngay tren bien duoi cua {var_name}"},
            {"id": f"BV_{var_name}_04", "point": "Nominal", "value": nom, "class": "Valid", "desc": f"Gia tri danh dinh cua {var_name}"},
            {"id": f"BV_{var_name}_05", "point": "UB - step", "value": round(ub - step, 4), "class": "Valid", "desc": f"Ngay duoi bien tren cua {var_name}"},
            {"id": f"BV_{var_name}_06", "point": "UB", "value": round(ub, 4), "class": "Valid", "desc": f"Tai bien tren cua {var_name}"},
            {"id": f"BV_{var_name}_07", "point": "UB + step", "value": round(ub + step, 4), "class": "Invalid", "desc": f"Vuot qua bien tren cua {var_name}"},
        ]

if __name__ == "__main__":
    points = generate_bva("password_length", 8, 50, step=1, is_int=True)
    print(f"| {'#ID':<20} | {'Diem kiem thu':<15} | {'Gia tri':<10} | {'Phan loai':<10} | {'Mo ta':<38} |")
    print(f"|{'-'*22}|{'-'*17}|{'-'*12}|{'-'*12}|{'-'*40}|")
    for p in points:
        print(f"| {p['id']:<20} | {p['point']:<15} | {str(p['value']):<10} | {p['class']:<10} | {p['desc']:<38} |")
