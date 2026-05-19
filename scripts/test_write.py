path = r"C:\Users\USER\Documents\GOAKL RTRACKER\src\app\onboarding\page.tsx"

# Read the existing file to verify we can write
with open(path, 'r', encoding='utf-8') as f:
    existing = f.read()
print(f"Read {len(existing)} chars from existing file")
print("File is writable, proceeding with full content...")