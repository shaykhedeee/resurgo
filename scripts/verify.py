"""Write the complete enhanced onboarding page."""
import pathlib

path = pathlib.Path(r"C:\Users\USER\Documents\GOAKL RTRACKER\src\app\onboarding\page.tsx")

# Read original to verify
original = path.read_text(encoding='utf-8')
print(f"Current file size: {len(original)} chars")
print("Writing complete enhanced file now...")