import pathlib

path = pathlib.Path(r"C:\Users\USER\Documents\GOAKL RTRACKER\src\app\onboarding\page.tsx")
lines = path.read_text(encoding='utf-8').split('\n')

# Track whether we're inside the component function
in_component = False
fixed = []

for i, line in enumerate(lines):
    stripped = line.lstrip()
    spaces = len(line) - len(stripped)

    # Detect start of component
    if stripped.startswith('function OnboardingPageWithAuth()'):
        in_component = True
        fixed.append(line)
        continue

    # Detect end of component (export default)
    if stripped.startswith('export default function OnboardingPage'):
        in_component = False
        fixed.append(line)
        continue

    if in_component:
        # Empty lines stay empty
        if stripped == '':
            fixed.append('')
        # Lines already properly indented (2+ spaces) or JSX (> at start after spaces)
        elif spaces >= 2:
            fixed.append(line)
        # Lines with no indent that need indenting (not JSX closing, not already indented)
        elif stripped and not stripped.startswith('<'):
            # Special cases: closing braces of callbacks that should be at 2 spaces
            if stripped == '});' or stripped == '}, [saving, completeOnboarding, autoGenerateFromOnboarding, createGoal, createHabit, primaryGoal, primaryGoalReason, primaryGoalDeadline, lifeVision, selectedFocus, selectedHabits, preferredTime, router, brainDump, analysisResult]);':
                fixed.append('  ' + stripped)
            elif stripped.startswith('}') and len(stripped) <= 2:
                fixed.append('  ' + stripped)
            elif stripped.startswith('//') or stripped.startswith('const ') or stripped.startswith('let ') or stripped.startswith('var '):
                fixed.append('  ' + stripped)
            elif stripped.startswith('if ') or stripped.startswith('} else') or stripped.startswith('return') or stripped == '}':
                fixed.append('  ' + stripped)
            else:
                fixed.append('  ' + stripped)
        else:
            fixed.append(line)
    else:
        fixed.append(line)

path.write_text('\n'.join(fixed), encoding='utf-8')
print(f"Fixed indentation, wrote {len('\n'.join(fixed))} chars")