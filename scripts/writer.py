"""
Script to write the complete enhanced onboarding page with AI brain dump integration.
"""
import pathlib

path = pathlib.Path(r"C:\Users\USER\Documents\GOAKL RTRACKER\src\app\onboarding\page.tsx")

# Build the full page content
PAGE = '''// FULL ENHANCED ONBOARDING PAGE WITH AI BRAIN DUMP
'''

with open(path, 'w', encoding='utf-8') as f:
    f.write(PAGE)

print(f"Wrote {len(PAGE)} chars to {path}")