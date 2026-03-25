import requests
import sys
from pathlib import Path

# URL ของ backend
url = "http://localhost:8080/api/v1/detection/analyze"

# รูปที่มีอยู่ในโปรเจค
image_path = Path(__file__).parent / "pic" / "images.jpg"

print("=" * 60)
print("🧪 Testing Factory Safety API with Roboflow")
print("=" * 60)

# เช็คว่ามีรูปไหม
if not image_path.exists():
    print(f"\n❌ Image not found: {image_path}")
    sys.exit(1)

print(f"\n📷 Test Image: {image_path}")
print(f"   Size: {image_path.stat().st_size / 1024:.1f} KB")

# อ่านรูป
print("\n📤 Sending to backend...")
try:
    with open(image_path, "rb") as f:
        response = requests.post(
            url,
            files={"file": ("test.jpg", f, "image/jpeg")},
            timeout=30
        )
except requests.exceptions.ConnectionError:
    print("\n❌ Cannot connect to backend!")
    print("   Make sure backend is running:")
    print("   cd backend && py -m backend.main")
    sys.exit(1)
except Exception as e:
    print(f"\n❌ Error: {e}")
    sys.exit(1)

# แสดงผล
print(f"\n📊 Response Status: {response.status_code}")
print("=" * 60)

try:
    data = response.json()
except:
    print("❌ Invalid JSON response:")
    print(response.text[:500])
    sys.exit(1)

if data.get("success"):
    result = data.get("data", {})
    print("✅ API CALL SUCCESSFUL!\n")
    print(f"👥 Total Persons:    {result.get('total_persons', 0)}")
    print(f"⚠️  Violations:       {result.get('violations_count', 0)}")
    print(f"✅ Compliance Rate:  {result.get('compliance_rate', 0) * 100:.1f}%")
    print(f"⏱️  Processed At:     {result.get('processed_at', 'N/A')}")

    detections = result.get('detections', [])
    if detections:
        print(f"\n🔍 Detections ({len(detections)} items):")
        print("-" * 60)
        for i, det in enumerate(detections, 1):
            label = det.get('label', 'unknown')
            conf = det.get('confidence', 0) * 100
            is_violation = det.get('is_violation', False)
            status = "❌ VIOLATION" if is_violation else "✅ PASS"
            print(f"  {i}. {label:15} {conf:5.1f}%  {status}")
    else:
        print("\n⚠️  No objects detected in image")

    print("\n" + "=" * 60)
    print("🎉 Backend is working correctly!")
    print("   You can now test with the web UI.")

else:
    print("❌ API CALL FAILED\n")
    print(f"Error: {data.get('error', 'Unknown error')}")
    print(f"Message: {data.get('message', 'No message')}")
