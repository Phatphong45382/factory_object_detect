# Roboflow Detection Service

Service สำหรับ Object Detection ผ่าน **Roboflow Hosted Inference API**
ไม่ต้องมี GPU ไม่ต้อง host model เอง ส่งรูปขึ้นไปประมวลผลบน cloud แล้วรับผลกลับมา

## ข้อดี

- ✅ **ไม่ต้องมี GPU** - Roboflow ประมวลผลให้
- ✅ **ไม่ต้องโหลด Model ใหญ่ๆ** - ประหยัดพื้นที่ server
- ✅ **เร็ว** - Inference บน optimized cloud infrastructure
- ✅ **ฟรี tier มีให้ใช้** - 5,000 inference/month (public models)

## Setup

### 1. สมัคร Roboflow + เอา API Key

1. ไปที่ https://roboflow.com → Sign up (ฟรี)
2. Settings → API Keys → Copy **Private API Key**

### 2. เลือก Pre-trained Model

แนะนำจาก [Roboflow Universe](https://universe.roboflow.com):

| Model ID | รายละเอียด | Classes |
|----------|-----------|---------|
| `construction-safety-gsnvb/1` | Construction Safety | helmet, vest, person |
| `ppe-detection-4d8oe/1` | PPE Detection | helmet, vest, gloves, boots |
| `safety-helmet-detection-7n1ng/1` | Safety Helmet | helmet, no_helmet |

ค้นหาเพิ่ม: https://universe.roboflow.com/search?q=ppe%20detection

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ `backend/.env`:

```env
# ============================================
# Detection Provider
# ============================================
DETECTION_PROVIDER=roboflow

# ============================================
# Roboflow Configuration
# ============================================
ROBOFLOW_API_KEY=your_actual_api_key_here
ROBOFLOW_MODEL_ID=construction-safety-gsnvb/1
```

### 4. Install Dependencies

```bash
cd backend
pip install inference supervision
```

หรือถ้าติดตั้งทั้งหมด:
```bash
pip install -r requirements.txt
```

## Usage

### Basic Usage

```python
from backend.services.roboflow import RoboflowService

service = RoboflowService()

# From image bytes (e.g., from upload)
with open("test_image.jpg", "rb") as f:
    image_bytes = f.read()

result = service.analyze_image(image_bytes)

print(f"Total Persons: {result.total_persons}")
print(f"Violations: {result.violations_count}")
print(f"Compliance: {result.compliance_rate}%")

for det in result.detections:
    print(f"- {det.label}: {det.confidence} (violation: {det.is_violation})")
```

### Using Factory (Recommended)

```python
from backend.services import get_detection_service

# Auto-select based on DETECTION_PROVIDER env
service = get_detection_service()
result = service.analyze_image(image_bytes)
```

## Architecture

```
┌─────────────────┐
│   User Upload   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  FastAPI        │
│  Backend        │
│                 │
│  RoboflowService│
│       │         │
│  RoboflowClient │
└───────┬─────────┘
        │ HTTP POST
        ▼
┌─────────────────┐
│ Roboflow Cloud  │
│ Inference API   │
└───────┬─────────┘
        │ JSON Response
        ▼
┌─────────────────┐
│  DetectionResult│
│  (parsed)       │
└─────────────────┘
```

## File Structure

```
services/roboflow/
├── __init__.py      # Exports RoboflowService, RoboflowClient
├── client.py        # HTTP Client wrapper
├── service.py       # Business logic + response parsing
└── README.md        # This file
```

## Switching Between Providers

แค่เปลี่ยน `DETECTION_PROVIDER` ใน `.env`:

```env
# ใช้ Roboflow (แนะนำสำหรับ Demo)
DETECTION_PROVIDER=roboflow

# ใช้ Dataiku (ถ้ามี DSS จริง)
DETECTION_PROVIDER=dataiku
DATAIKU_HOST=https://your-dss.com
DATAIKU_API_KEY=xxx

# ใช้ Mock (สำหรับ dev/test)
DETECTION_PROVIDER=mock
```

## Troubleshooting

### Error: "inference-sdk is not installed"
```bash
pip install inference-sdk
```

### Error: "Invalid API Key"
- ตรวจสอบว่าใช้ **Private API Key** (ไม่ใช่ Publishable Key)
- ไปที่ Roboflow → Settings → API Keys

### Error: "Model not found"
- ตรวจสอบ `ROBOFLOW_MODEL_ID` ว่าเป็น format `project-name/version`
- ตัวอย่างที่ถูกต้อง: `construction-safety-gsnvb/1`
- ตัวอย่างที่ผิด: `construction-safety-gsnvb` (ไม่มี version)

### Slow Response
- Roboflow Serverless API cold start อาจช้าครั้งแรก
- ถ้าต้องการ consistent latency พิจารณา upgrade เป็น dedicated inference

## References

- [Roboflow Inference SDK Docs](https://inference.roboflow.com)
- [Roboflow Universe](https://universe.roboflow.com)
- [API Reference](https://docs.roboflow.com/api-reference)
