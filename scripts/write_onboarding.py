import textwrap

# Read existing file first to verify path works
path = r"C:\Users\USER\Documents\GOAKL RTRACKER\src\app\onboarding\page.tsx"

content = r'''// FULL FILE CONTENT PLACEHOLDER'''

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")