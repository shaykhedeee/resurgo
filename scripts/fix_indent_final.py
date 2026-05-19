"""Fix all indentation in the onboarding page file completely."""
import pathlib

path = pathlib.Path(r"C:\Users\USER\Documents\GOAKL RTRACKER\src\app\onboarding\page.tsx")
lines = path.read_text(encoding='utf-8').split('\n')

# Find function boundaries
func_start = None
first_export = None
for i, line in enumerate(lines):
    s = line.strip()
    if s == 'function OnboardingPageWithAuth() {' or s.startswith('function OnboardingPageWithAuth'):
        func_start = i
    if s.startswith('export default function OnboardingPage()') and first_export is None:
        first_export = i

print(f"Function starts at line {func_start}, export at line {first_export}")

if func_start is None or first_export is None:
    print("ERROR: Could not find boundaries")
    exit(1)

def fix_indent_within_component(body_lines):
    """Given lines that are the body of the component (NOT including the opening/closing braces of the function),
    fix indentation to be correct 2-space indent."""
    result = []
    indent_level = 0

    for line in body_lines:
        s = line.strip()
        if not s:
            result.append('')
            continue

        # Lines that decrease indent first
        if s.startswith('}') and not s.startswith('</') and not s.startswith('}}') and not s == '};':
            indent_level = max(0, indent_level - 1)

        # Compute base indent
        base = '  ' * indent_level

        # Special cases where indent doesn't change for the current line
        if s == '});' or s == '},':
            pass  # already at the right level
        elif s == '};':
            pass

        # Lines that increase indent after this line
        # Detect if this line opens a new scope
        result.append(base + s)

        # Adjust indent for next line
        # Count net opens (but be smart about JSX)
        opens = s.count('{')
        closes = s.count('}')

        # JSX closing tags don't affect indent
        if '</' in s:
            closes = 0

        # Self-closing JSX
        if s.endswith('/>'):
            # doesn't change indent
            pass
        else:
            net = opens - closes
            if net > 0:
                indent_level += net
            elif net < 0:
                indent_level = max(0, indent_level + net)

            # Special: lines ending with => or .map( or .filter( don't increase indent
            if s.endswith('=>') or s.rstrip().endswith('=>{'):
                pass

    return result


# Extract the component body
component_lines = lines[func_start:first_export]

# Fix them
fixed_component = []
indent = 0
i = 0
while i < len(component_lines):
    line = component_lines[i]
    s = line.strip()

    if not s:
        fixed_component.append('')
        i += 1
        continue

    # Closing braces decrease indent first
    if s == '}' or s == '};' or (s.startswith('}') and not s.startswith('</') and not s.startswith('{{') and not s == '} }'):
        indent = max(0, indent - 1)
        fixed_component.append('  ' * indent + s)
        i += 1
        continue

    # Opening lines or regular lines
    # Determine indent
    fixed_line = '  ' * indent + s

    # Calculate indent change for NEXT line
    opens = s.count('{')
    closes = s.count('}')

    # Adjust for strings that contain braces
    in_string = False
    j = 0
    while j < len(s):
        if s[j] == '"' and (j == 0 or s[j-1] != '\\'):
            in_string = not in_string
        elif s[j] == '{' and not in_string:
            pass  # already counted
        elif s[j] == '}' and not in_string:
            pass
        j += 1

    # JSX closing tags don't count
    for tag in ['</', '/>']:
        if tag in s:
            # count how many closing tags
            idx = s.find(tag)
            while idx != -1:
                closes -= 1
                idx = s.find(tag, idx + 1)
            closes = max(0, closes)

    net = opens - closes

    # Special cases
    if s.endswith('=>') or s.endswith('=>{'):
        # arrow function: increase indent on next line
        pass
    elif s.endswith('(') or s.endswith('{') or s.endswith('||') or s.endswith('&&'):
        # continuation on next line
        pass
    elif net > 0:
        indent += net
    elif net < 0:
        indent = max(0, indent + net)

    fixed_component.append(fixed_line)
    i += 1

# Reassemble
result = lines[:func_start] + fixed_component + lines[first_export:]

path.write_text('\n'.join(result), encoding='utf-8')
print(f"Wrote {len(result)} lines")

# Check
content = '\n'.join(result)
print(f"Export count: {content.count('export default')}")
print(f"Function count: {content.count('function OnboardingPageWithAuth')}")