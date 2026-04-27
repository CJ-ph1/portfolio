#!/usr/bin/env python3
"""Bake the Learning .txt files into js/learning-content.js.

Run this whenever you edit one of the .txt files so the embedded content
(used when the site is opened via file://) stays in sync.

Usage:
    python3 scripts/bake-learning.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILES = [
    "Architecture_Review.txt",
    "Professional_API_Glossary.txt",
    "Python Integration.txt",
    "Full_Flow.txt",
    "Git_SSH_Workflow.txt",
]
OUT = ROOT / "js" / "learning-content.js"


def main() -> int:
    content: dict[str, str] = {}
    missing: list[str] = []

    for name in FILES:
        path = ROOT / "misc" / name
        if not path.exists():
            path = ROOT / name
        if not path.exists():
            missing.append(name)
            continue
        content[name] = path.read_text(encoding="utf-8")

    if missing:
        print(f"warning: missing files: {missing}", file=sys.stderr)

    header = [
        "// ============================================================================",
        "//  learning-content.js  (auto-generated — do not hand-edit)",
        "//",
        "//  Embedded copies of the Learning .txt files so the site works from",
        "//  file:// as well as http://. Regenerate after editing a .txt with:",
        "//      python3 scripts/bake-learning.py",
        "// ============================================================================",
        "",
    ]
    body = "window.LEARNING_CONTENT = " + json.dumps(content, ensure_ascii=False, indent=2) + ";\n"

    OUT.write_text("\n".join(header) + body, encoding="utf-8")

    total = sum(len(v) for v in content.values())
    print(f"wrote {OUT.relative_to(ROOT)} — {total} chars across {len(content)} files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
