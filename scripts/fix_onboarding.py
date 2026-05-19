"""Fix the onboarding page: remove duplicate exports, fix indentation."""
import pathlib

path = pathlib.Path(r"C:\Users\USER\Documents\GOAKL RTRACKER\src\app\onboarding\page.tsx")
lines = path.read_text(encoding='utf-8').split('\n')

# Find first export default
first_export = None
second_export = None
for i, line in enumerate(lines):
    s = line.strip()
    if s.startswith('export default function OnboardingPage()') and first_export is None:
        first_export = i
    elif s.startswith('export default function OnboardingPage()') and first_export is not None:
        second_export = i
        break

# Find the OnboardingPageWithAuth function start
func_start = None
for i, line in enumerate(lines):
    s = line.strip()
    if s == 'function OnboardingPageWithAuth() {' or s.startswith('function OnboardingPageWithAuth'):
        func_start = i
        break

print(f"func_start={func_start}, first_export={first_export}, second_export={second_export}")

if func_start is None or first_export is None:
    print("ERROR: Could not find function boundaries")
    exit(1)

# Take everything up to the first export, then fix indentation for the component part
# Lines before function: keep as-is
# From func_start to first_export-1: the component (needs 2-space indent on non-JSX lines)
# After first_export: the export function (keep as-is but only one copy)

result = []

# Part 1: before component
for i in range(func_start + 1):
    result.append(lines[i])

# Part 2: the component body (lines after func_start up to first_export)
# These need 2-space indentation for non-JSX, non-empty, non-brace lines
for i in range(func_start + 1, first_export):
    line = lines[i]
    s = line.strip()
    if not s:
        result.append('')
    elif s.startswith('<') or s.startswith('</') or s.startswith('?'):
        # JSX - keep as-is
        result.append(line)
    elif s.startswith('//') or (s.startswith('{') and not s.startswith('</')) or s == '{{':
        result.append('  ' + s)
    elif (s.startswith('}') and not s.startswith('</')) or s == '}}' or s == '};':
        # Check if it's a closing JSX tag with }
        if '</' in s:
            result.append(line)
        else:
            result.append('  ' + s)
    elif (s.startswith('[') or s.startswith('(') or s.startswith('?.') or
          s.startswith('&&') or s.startswith('||') or s.startswith(': ') or
          s.startswith('? ') or s.startswith('=>') or s.startswith('...')):
        result.append(line)
    else:
        result.append('  ' + s)

# Part 3: the export default function (use first_export only, skip duplicate)
# The export default should NOT be indented
for i in range(first_export, len(lines)):
    result.append(lines[i])

# Check if there's a trailing duplicate } at the very end (from the second export block)
# The second export block creates a trailing } that shouldn't be there
while result and result[-1].strip() == '}:':
    result.pop()
while result and result[-1].strip() == '}':
    # Remove trailing } if it's after the export function closes
    # Check if there's another } before it
    if result[-2].strip() == '}':
        result.pop()
        break
    else:
        break

path.write_text('\n'.join(result), encoding='utf-8')
print(f"Fixed! Wrote {len('\\n'.join(result))} chars, {len(result)} lines")

# Verify
content = '\n'.join(result)
exports = content.count('export default function')
print(f"Number of 'export default function': {exports}")
funced = content.count('function OnboardingPageWithAuth')
print(f"Number of 'function OnboardingPageWithAuth': {funced}")