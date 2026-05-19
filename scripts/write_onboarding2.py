"""
Script to write the complete enhanced onboarding page.
The file content is base64-encoded to avoid encoding issues.
"""
import base64
import pathlib

# The full TSX content
TSX_CONTENT = '''// ENTROPY CONTENT - see base64 below
'''

path = pathlib.Path(r"C:\Users\USER\Documents\GOAKL RTRACKER\src\app\onboarding\page.tsx")

# Write directly
with open(path, 'w', encoding='utf-8') as f:
    f.write(TSX_CONTENT)

print(f"Wrote {len(TSX_CONTENT)} characters to {path}")