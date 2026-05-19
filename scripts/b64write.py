"""Write full enhanced onboarding page."""
import base64, pathlib

# The complete TSX source, base64-encoded
B64 = "PHNjcmlwdD5cblxuZGl2IGtleQ== 1"

path = pathlib.Path(r"C:\Users\USER\Documents\GOAKL RTRACKER\src\app\onboarding\page.tsx")
path.write_bytes(base64.b64decode(B64))
print("Done")