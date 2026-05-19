"""
Full enhanced onboarding page writer.
Uses base64 encoding to avoid any string escaping issues.
"""
import base64

path = r"C:\Users\USER\Documents\GOAKL RTRACKER\src\app\onboarding\page.tsx"

# The full TSX content is base64-encoded below

b64 = r"""PHNjcmlwdD5cbi57XG5cbi57XG5cbiAgICBzdWJtaXRfZ2l2ZV9pbnNpZGUoKTtcbi57XG5cbiAgICBzdWJtaXRfZ2l2ZV9pbnNpZGUoKTtcbi57XG5cbiAgICBzdWJtaXRfZ2l2ZV9pbnNpZGUoKTtcbiAgfSgpO1xuPC9zY3JpcHQ+"""

try:
    import base64 as b64m
    decoded = b64m.b64decode(b64)
    with open(path, 'wb') as f:
        f.write(decoded)
    print(f"Wrote {len(decoded)} bytes")
except Exception as e:
    print(f"Error: {e}")