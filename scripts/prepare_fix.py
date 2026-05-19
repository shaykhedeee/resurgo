"""Fix all indentation in the onboarding page."""
import pathlib

path = pathlib.Path(r"C:\Users\USER\Documents\GOAKL RTRACKER\src\app\onboarding\page.tsx")
raw = path.read_text(encoding='utf-8')
lines = raw.split('\n')

# Strategy: strip ALL lines, then re-indent everything that's inside
# the component function (between "function OnboardingPageWithAuth() {"
# and the final "}")
result = []
in_component = False
depth = 0  # tracks brace depth for JSX

for line in lines:
    stripped = line.strip()
    if not stripped:
        result.append('')
        continue

    # Detect component start
    if stripped.startswith('function OnboardingPageWithAuth() {'):
        in_component = True
        result.append(stripped)
        continue

    # Detect export default (end of component)
    if stripped.startswith('export default function OnboardingPage()'):
        in_component = False
        result.append(stripped)
        continue

    if not in_component:
        result.append(stripped)
        continue

    # Inside component - need proper 2-space indentation
    # Count net brace changes to track depth
    open_braces = stripped.count('{')
    close_braces = stripped.count('}')

    # Compute base indent
    if stripped.startswith('}') and not stripped.startswith('</'):
        depth = max(0, depth - 1)
        indent = '  ' * depth
    elif stripped.startswith('//') or stripped.startswith('const ') or stripped.startswith('let ') or \
         stripped.startswith('var ') or stripped.startswith('if ') or stripped.startswith('} else') or \
         stripped.startswith('return') or stripped.startswith('await') or \
         stripped.startswith('for ') or stripped.startswith('try') or stripped.startswith('}') or \
         stripped.startswith('} }') or stripped.startswith('</') or stripped.startswith('? ') or \
         stripped.startswith(': ') or stripped.startswith('&&') or stripped.startswith('||'):
        indent = '  ' * depth
    elif stripped.startswith('{'):
        indent = '  ' * depth
        # depth will increase AFTER this line
    else:
        indent = '  ' * depth

    result.append(indent + stripped)

    # Update depth after processing
    if not (stripped.startswith('}') or stripped.startswith('</')):
        # Net opens
        net = open_braces - close_braces
        if stripped.endswith('=>') or stripped.endswith('} }'):
            pass
        else:
            depth = max(0, depth + net)

# Now we need a smarter approach. Let me just strip everything and manually re-indent.
# Actually, the above is too fragile. Let me use a much simpler approach:
# Just replace all lines that are missing the 2-space indent inside the component.

# Even simpler: the original working code had 2-space indent. The parts scripts
# generated lines WITHOUT leading spaces. So just find all lines between
# the function opening and the export default, and ensure they have at least 2 spaces
# if they're not empty, not JSX tags (starting with <), and not already indented.

path2 = pathlib.Path(r"C:\Users\USER\Documents\GOAKL RTRACKER\scripts\final.py")

# Write a script that does the indentation fix properly
fix_script = '''
import pathlib
path = pathlib.Path(r"C:\\Users\\USER\\Documents\\GOAKL RTRACKER\\src\\app\\onboarding\\page.tsx")
lines = path.read_text(encoding='utf-8').split('\\n')

in_func = False
result = []
for line in lines:
    s = line.lstrip()
    if s.startswith('function OnboardingPageWithAuth()'):
        in_func = True
        result.append(line)
        continue
    if s.startswith('export default function OnboardingPage'):
        in_func = False
        result.append(line)
        continue
    if in_func and s and not s.startswith('<') and not line.startswith('  ') and not line.startswith('\\t'):
        # Not JSX opening, not already indented
        # But skip lines that start with } or </ or . or [ or ( or ?
        if (s.startswith('{') or s.startswith('}') or s.startswith('</') or
            s.startswith('[') or s.startswith('(') or
            s.startswith('?.') or s.startsWith('?.') or
            s.startswith('&&') or s.startswith('||') or
            s.startswith('? ') or s.startswith(': ') or
            s.startswith('=>') or s.startswith('...')):
            result.append(line)
        else:
            result.append('  ' + s)
    else:
        result.append(line)

path.write_text('\\n'.join(result), encoding='utf-8')
print(len('\\n'.join(result)))
'''

# Just write a simpler fixer
fixer = '''
import pathlib
path = pathlib.Path(r"C:\\Users\\USER\\Documents\\GOAKL RTRACKER\\src\\app\\onboarding\\page.tsx")
lines = path.read_text(encoding='utf-8').split('\\n')

# Find indices
for i, line in enumerate(lines):
    s = line.strip()
    if s == "function OnboardingPageWithAuth() {" or s.startswith("function OnboardingPageWithAuth"):
        start = i
    if s.startswith("export default function OnboardingPage"):
        end = i
        break

# Now fix indentation between start and end
fixed = lines[:start+1]
for line in lines[start+1:end]:
    s = line.strip()
    if not s:
        fixed.append("")
    elif s.startswith("}") and not s.startswith("</"):
        # closing brace - de-indent
        fixed.append("  " + s)
    elif s.startswith("<") or s.startswith("</"):
        # JSX - keep as-is (it's already indented relative to parent)
        fixed.append(line)
    elif s.startswith("{") or s == "{{":
        fixed.append("  " + s)
    else:
        fixed.append("  " + s)

fixed.extend(lines[end:])
path.write_text('\\n'.join(fixed), encoding='utf-8')
print(f"Wrote {len('\\n'.join(fixed))} chars")
'''

fixer_path = pathlib.Path(r"C:\Users\USER\Documents\GOAKL RTRACKER\scripts\fixer.py")
fixer_path.write_text(fixer)
print("Fixer written")