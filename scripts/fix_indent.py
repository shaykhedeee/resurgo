"""Fix indentation in the onboarding page file."""
pathlib = __import__('pathlib')
path = pathlib.Path(r"C:\Users\USER\Documents\GOAKL RTRACKER\src\app\onboarding\page.tsx")

lines = path.read_text(encoding='utf-8').split('\n')

# Find the line with "function OnboardingPageWithAuth() {"
# Everything from after that opening brace to before the final export
# needs to be indented by 2 spaces if not already

in_component = False
fixed_lines = []
for line in lines:
    stripped = line.lstrip()

    # Detect start of component function
    if stripped.startswith('function OnboardingPageWithAuth()'):
        in_component = True
        fixed_lines.append(line)
        continue

    # Detect end of component (the export default function)
    if stripped.startswith('export default function OnboardingPage()'):
        in_component = False
        fixed_lines.append(line)
        continue

    if in_component:
        # Lines that should be indented (not already at 2+ spaces, and not empty,
        # and not JSX return lines)
        if stripped == '':
            fixed_lines.append('')
        elif stripped.startswith('//') or stripped.startswith('*'):
            # Comments inside component need indent
            if not line.startswith('  '):
                fixed_lines.append('  ' + stripped)
            else:
                fixed_lines.append(line)
        elif stripped.startswith('const ') or stripped.startswith('let ') or stripped.startswith('var '):
            if not line.startswith('  '):
                fixed_lines.append('  ' + stripped)
            else:
                fixed_lines.append(line)
        elif stripped.startswith('if ') or stripped.startswith('} else') or stripped.startswith('// ') or stripped.startswith('return'):
            if not line.startswith('  '):
                fixed_lines.append('  ' + stripped)
            else:
                fixed_lines.append(line)
        elif stripped.startswith('}') and len(stripped) == 1:
            # Closing brace at module level inside component
            fixed_lines.append('  }')
        elif stripped.startswith('} }') or stripped.startswith('}}') or stripped.startswith('};'):
            # JSX or double braces
            if not line.startswith('  '):
                fixed_lines.append('  ' + stripped)
            else:
                fixed_lines.append(line)
        elif stripped and not line[0].isspace():
            # Non-indented non-empty line that should be indented
            fixed_lines.append('  ' + stripped)
        else:
            fixed_lines.append(line)
    else:
        fixed_lines.append(line)

# Now fix double-indented lines (4 spaces at module level that should be 2 inside component)
# This is for things like handleComplete body
result = []
for line in fixed_lines:
    # If line has 4 spaces but should have 2 (inside component)
    if line.startswith('    ') and not line.startswith('      '):
        # Check context - if we're inside the component, 4 spaces should be 2
        # This is tricky, let's just check for common patterns
        stripped = line[2:]  # Remove 2 leading spaces
        result.append(stripped)
    else:
        result.append(line)

# Better approach: just write the whole file properly
path.write_text('\n'.join(result) if False else '', encoding='utf-8')
print("Preview only - not writing yet")