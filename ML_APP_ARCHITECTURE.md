# ML Application Architecture — DS Service Platform

> สถาปัตยกรรมของ ML Application ทั้ง 2 โปรเจกต์ เมื่อต่อ Dataiku DSS เรียบร้อยแล้ว

---

## High-Level Flow (Presentation)

### App 1: Factory Safety — "ภาพเข้า → ตรวจจับ → แจ้งเตือน"

```
                        🏭  Factory Safety — PPE Detection
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  📷 กล้อง CCTV           🤖 AI วิเคราะห์ภาพ           📊 Dashboard
  หรือ Upload รูป          (Object Detection)           แสดงผลลัพธ์

  ┌──────────┐          ┌─────────────────┐          ┌──────────────┐
  │          │          │                 │          │              │
  │  📸      │ ──────▶  │   🔍  Dataiku   │ ──────▶  │  ✅ ปลอดภัย  │
  │  Image   │  ส่งรูป  │   YOLO Model    │  ผลลัพธ์  │  ⚠️ ละเมิด   │
  │          │          │                 │          │  📈 สถิติ    │
  └──────────┘          └─────────────────┘          └──────────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │  สิ่งที่ตรวจจับได้:     │
                     │  ✅ หมวกนิรภัย         │
                     │  ✅ เสื้อสะท้อนแสง      │
                     │  ✅ หน้ากาก            │
                     │  ✅ แว่นตานิรภัย        │
                     │  ❌ ไม่สวมหมวก → แจ้งเตือน │
                     │  ❌ ไม่สวมเสื้อ → แจ้งเตือน │
                     └─────────────────────┘


  End-to-End Flow:
  ━━━━━━━━━━━━━━

  ┌────────┐    ┌────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
  │  ถ่าย   │    │  ส่งรูป │    │ AI ตรวจ  │    │ คำนวณ    │    │ แสดงผล   │
  │  ภาพ   │───▶│  เข้า   │───▶│ จับวัตถุ  │───▶│ Compliance│───▶│ + แจ้งเตือน│
  │        │    │ ระบบ    │    │ ในภาพ    │    │ Rate     │    │ ทันที    │
  └────────┘    └────────┘    └──────────┘    └──────────┘    └──────────┘
   Operator      Next.js       Dataiku         FastAPI         Dashboard
                 Frontend      YOLO Model      Backend         + Alerts
```

### App 2: Fraud Detection — "ข้อมูลเข้า → วิเคราะห์ → สอบสวน → เรียนรู้"

```
                      ⛽  Fraud Detection — Fuel Station Anomaly
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  💳 ข้อมูลธุรกรรม         🤖 AI วิเคราะห์              🕵️ สอบสวน
  จากปั๊มน้ำมัน           (Anomaly Detection)          & ตัดสินใจ

  ┌──────────┐          ┌─────────────────┐          ┌──────────────┐
  │          │          │                 │          │              │
  │  💳      │ ──────▶  │  📊  Dataiku    │ ──────▶  │  🟢 ปกติ     │
  │  POS /   │  sync    │  Isolation      │  scores  │  🟡 น่าสงสัย  │
  │  ERP     │  ข้อมูล   │  Forest Model   │          │  🔴 เสี่ยงสูง  │
  └──────────┘          └─────────────────┘          └──────────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │  Features ที่วิเคราะห์:  │
                     │  ⏱️ Time Gap         │
                     │     (เติมถี่ผิดปกติ)     │
                     │  📊 Volume Deviation │
                     │     (ปริมาณผิดปกติ)     │
                     │  👥 Staff Pattern    │
                     │     (พนักงาน-สมาชิก)    │
                     │  ⛽ Fuel Variety     │
                     │     (เปลี่ยนน้ำมันบ่อย)   │
                     │  🌙 Hour of Day     │
                     │     (เวลาผิดปกติ)       │
                     └─────────────────────┘


  End-to-End Flow (มี Feedback Loop):
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ┌────────┐   ┌─────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
  │ ข้อมูล  │   │ Feature │   │ Isolation│   │ เจ้าหน้าที่ │   │ Feedback │
  │ ธุรกรรม │──▶│ Engineer│──▶│ Forest   │──▶│ สอบสวน   │──▶│ Loop     │
  │ (POS)  │   │ (สร้าง   │   │ Scoring  │   │ ตัดสินใจ  │   │ (Retrain)│
  │        │   │ features)│   │          │   │          │   │          │
  └────────┘   └─────────┘   └──────────┘   └──────────┘   └────┬─────┘
                                                                  │
                  ◀ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
                         Model เรียนรู้จาก feedback
                         ยิ่งใช้ ยิ่งแม่นยำ 📈


  การตัดสินใจของเจ้าหน้าที่:
  ┌─────────────────────────────────────────────────────┐
  │                                                      │
  │   ✅ Confirm   →  ยืนยันว่าเป็นทุจริตจริง → Label = Fraud    │
  │   ❌ Dismiss   →  ไม่ใช่ทุจริต (False Positive) → Label = OK │
  │   ⬆️ Escalate  →  ส่งต่อหัวหน้า / ต้องตรวจสอบเพิ่ม          │
  │                                                      │
  │   ทุก decision ถูกส่งกลับไป train model ให้ดีขึ้น        │
  │                                                      │
  └─────────────────────────────────────────────────────┘
```

### เปรียบเทียบ 2 Apps (One Slide)

```
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 │          Factory Safety            │       Fraud Detection         │
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 │                                    │                               │
 │  Input:   📷 ภาพ / CCTV           │  Input:   💳 ข้อมูลธุรกรรม       │
 │  Model:   🔍 YOLO (Object Det.)   │  Model:   📊 Isolation Forest  │
 │  Output:  ⬜ Bounding Boxes       │  Output:  🔢 Anomaly Scores    │
 │  Speed:   ⚡ Real-time            │  Speed:   🔄 Batch + Alert     │
 │  User:    👷 Operator             │  User:    🕵️ Investigator      │
 │  Action:  👀 ดู Alert             │  Action:  ✅❌ Confirm/Dismiss  │
 │  Loop:    ❌ ไม่มี Feedback       │  Loop:    🔁 Retrain จาก       │
 │                                    │           Feedback             │
 │                                    │                               │
 │  📷 → 🤖 → 📊                    │  💳 → 🤖 → 🕵️ → 🔁            │
 │  ภาพ → AI → แจ้งเตือน              │  ข้อมูล → AI → สอบสวน → เรียนรู้   │
 │                                    │                               │
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                     ทั้งคู่ขับเคลื่อนด้วย Dataiku DSS
                  ┌───────────────────────────────────┐
                  │         🧠 Dataiku DSS             │
                  │    ML Platform + Model Serving     │
                  │    + AutoML + Data Pipeline        │
                  └───────────────────────────────────┘
```

---

## Overview — System Landscape

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DS Service Platform                             │
│                                                                         │
│  ┌──────────────────────┐          ┌──────────────────────┐            │
│  │  Factory Safety App  │          │  Fraud Detection App │            │
│  │  (Object Detection)  │          │ (Anomaly Detection)  │            │
│  └──────────┬───────────┘          └──────────┬───────────┘            │
│             │                                  │                        │
│  ┌──────────▼───────────┐          ┌──────────▼───────────┐            │
│  │  FastAPI Backend     │          │  FastAPI Backend      │            │
│  │  (Python)            │          │  (Python)             │            │
│  └──────────┬───────────┘          └──────────┬───────────┘            │
│             │                                  │                        │
│             └──────────────┬───────────────────┘                        │
│                            │                                            │
│                  ┌─────────▼──────────┐                                 │
│                  │   Dataiku DSS      │                                 │
│                  │   API Node         │                                 │
│                  │   (ML Platform)    │                                 │
│                  └────────────────────┘                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## App 1: Factory Safety — Object Detection

### Use Case
ตรวจจับอุปกรณ์ความปลอดภัยในโรงงาน (หมวก, เสื้อสะท้อนแสง, หน้ากาก, แว่นตา)
จากภาพถ่าย/กล้อง CCTV แบบ Real-time

### Complete Application Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   FLOW 1: Image Upload & Detection                                      │
│   ═══════════════════════════════                                        │
│                                                                         │
│   ┌───────────┐    ┌──────────────┐    ┌──────────────┐                │
│   │  Operator  │    │  Next.js     │    │  FastAPI     │                │
│   │  (User)    │    │  Frontend    │    │  Backend     │                │
│   └─────┬─────┘    └──────┬───────┘    └──────┬───────┘                │
│         │                  │                    │                        │
│    1. Upload Image         │                    │                        │
│    (Drag & Drop)           │                    │                        │
│         │──────────────────▶                    │                        │
│         │   POST /api/v1/  │                    │                        │
│         │   detection/     │                    │                        │
│         │   analyze        │                    │                        │
│         │                  │────────────────────▶                        │
│         │                  │   FormData(file)   │                        │
│         │                  │                    │                        │
│         │                  │                    │    ┌──────────────┐    │
│         │                  │                    │───▶│  Dataiku DSS │    │
│         │                  │                    │    │  API Node    │    │
│         │                  │                    │    └──────┬───────┘    │
│         │                  │                    │           │            │
│         │                  │                    │    2. POST /predict    │
│         │                  │                    │       image_b64       │
│         │                  │                    │           │            │
│         │                  │                    │    ┌──────▼───────┐    │
│         │                  │                    │    │  YOLO Model  │    │
│         │                  │                    │    │  (Inference) │    │
│         │                  │                    │    └──────┬───────┘    │
│         │                  │                    │           │            │
│         │                  │                    │◀──────────┘            │
│         │                  │                    │   detections[]        │
│         │                  │                    │   + bounding boxes    │
│         │                  │                    │   + confidence scores │
│         │                  │                    │                        │
│         │                  │                    │──┐ 3. Calculate:      │
│         │                  │                    │  │  - compliance_rate │
│         │                  │                    │  │  - violations_count│
│         │                  │                    │  │  - total_persons   │
│         │                  │                    │◀─┘                    │
│         │                  │                    │                        │
│         │                  │◀───────────────────│                        │
│         │                  │   DetectionResult  │                        │
│         │◀─────────────────│                    │                        │
│         │   4. Render:     │                    │                        │
│         │   - BBox overlay │                    │                        │
│         │   - Alert list   │                    │                        │
│         │   - Compliance % │                    │                        │
│         │                  │                    │                        │
│   └─────┴─────┘    └──────┴───────┘    └──────┴───────┘                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Flow — Detection Result Schema

```
DetectionResult {
  detections: [
    {
      label:        "helmet" | "no_helmet" | "vest" | "no_vest" | ...
      confidence:   0.0 - 1.0          (ความมั่นใจของ model)
      bbox: {
        x:          0.0 - 1.0          (normalized coordinates)
        y:          0.0 - 1.0
        width:      0.0 - 1.0
        height:     0.0 - 1.0
      }
      is_violation: true/false          (ละเมิดกฎหรือไม่)
    }
  ]
  total_persons:    int                 (จำนวนคนในภาพ)
  violations_count: int                 (จำนวนการละเมิด)
  compliance_rate:  0.0 - 1.0          (อัตราการปฏิบัติตามกฎ)
  processed_at:     ISO 8601 datetime
}
```

### Page Flow — User Journey

```
┌──────────┐     ┌───────────────┐     ┌─────────────┐
│   Home   │────▶│  Detection    │────▶│  Incidents   │
│   (/)    │     │  Center       │     │  Log         │
│          │     │  (/detection) │     │  (/incidents)│
│ - Stats  │     │  - Upload     │     │  - History   │
│ - Quick  │     │  - Analyze    │     │  - Export    │
│   Actions│     │  - BBox View  │     │  - Details   │
└──────┬───┘     └───────┬───────┘     └──────────────┘
       │                 │
       │     ┌───────────▼───────┐     ┌──────────────┐
       │     │   Dashboard       │     │  Reports     │
       └────▶│   (/dashboard)    │────▶│  (/reports)  │
             │   - KPIs          │     │  - Export    │
             │   - Trend Charts  │     │  - PDF       │
             │   - Zone Analysis │     └──────────────┘
             └───────────────────┘
                      │
             ┌────────▼──────────┐
             │   Config          │
             │   (/config)       │
             │   - Toggle Classes│
             │   - Threshold     │
             └───────────────────┘
```

### Dataiku Integration — Endpoint Config

```
DATAIKU_HOST          = https://dss.company.com
DATAIKU_API_KEY       = <api-key>
DATAIKU_PROJECT_KEY   = WORKPLACE_SAFETY
DATAIKU_ENDPOINT_ID   = safety_object_detection

API URL: POST {HOST}/public/api/v1/{PROJECT_KEY}/{ENDPOINT_ID}/predict

Request:  { "features": { "image_b64": "<base64-encoded-image>" } }
Response: { "result": { "detections": [...] } }
```

---

## App 2: Fraud Detection — Anomaly Detection

### Use Case
ตรวจจับธุรกรรมผิดปกติในปั๊มน้ำมัน (Fuel Fraud) โดยใช้ Isolation Forest
วิเคราะห์ patterns: เวลา, ปริมาณ, พนักงาน-สมาชิก, ประเภทน้ำมัน

### Complete Application Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   FLOW 1: Data Ingestion & Scoring (Batch)                              │
│   ═════════════════════════════════════════                              │
│                                                                         │
│   ┌──────────┐    ┌──────────────┐    ┌──────────────┐                 │
│   │   POS /  │    │   Dataiku    │    │  Dataiku     │                 │
│   │   ERP    │    │   Dataset    │    │  Flow        │                 │
│   │  System  │    │   (Raw)      │    │  (Pipeline)  │                 │
│   └────┬─────┘    └──────┬───────┘    └──────┬───────┘                 │
│        │                  │                    │                         │
│   1. Daily/Hourly         │                    │                         │
│      Transaction Sync     │                    │                         │
│        │──────────────────▶                    │                         │
│        │   transactions:   │                    │                         │
│        │   txn_id,         │                    │                         │
│        │   timestamp,      │    2. Trigger     │                         │
│        │   station_id,     │───────────────────▶                         │
│        │   pump_no,        │   Feature          │                         │
│        │   fuel_type,      │   Engineering      │                         │
│        │   volume,         │                    │                         │
│        │   amount,         │                    │──┐                     │
│        │   member_id       │                    │  │ 3. Feature Calc:   │
│        │                   │                    │  │  - time_gap_min    │
│        │                   │                    │  │  - volume_deviation│
│        │                   │                    │  │  - staff_pattern   │
│        │                   │                    │  │  - fuel_variety    │
│        │                   │                    │  │  - hour_of_day     │
│        │                   │                    │◀─┘                     │
│        │                   │                    │                         │
│        │                   │                    │──┐                     │
│        │                   │                    │  │ 4. Isolation Forest│
│        │                   │                    │  │    Scoring         │
│        │                   │                    │  │    → anomaly_score │
│        │                   │                    │  │    → risk_level    │
│        │                   │                    │◀─┘                     │
│        │                   │                    │                         │
│        │                   │    scored_dataset  │                         │
│        │                   │◀───────────────────│                         │
│        │                   │                    │                         │
│   └────┴─────┘    └──────┴───────┘    └──────┴───────┘                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   FLOW 2: Real-time Alert & Investigation                               │
│   ═══════════════════════════════════════                                │
│                                                                         │
│   ┌──────────┐    ┌──────────────┐    ┌──────────────┐                 │
│   │Investiga-│    │  Next.js     │    │  FastAPI     │                 │
│   │  tor     │    │  Frontend    │    │  Backend     │                 │
│   └────┬─────┘    └──────┬───────┘    └──────┬───────┘                 │
│        │                  │                    │                         │
│        │  Open Dashboard  │                    │    ┌──────────────┐    │
│        │─────────────────▶│                    │    │  Dataiku DSS │    │
│        │                  │────────────────────▶───▶│  API Node    │    │
│        │                  │  GET /api/v1/      │    └──────┬───────┘    │
│        │                  │  transactions/     │           │            │
│        │                  │  scored             │    Query scored       │
│        │                  │                    │    dataset             │
│        │                  │                    │◀──────────┘            │
│        │                  │◀───────────────────│                        │
│        │                  │   transactions +   │                        │
│        │                  │   anomaly_scores + │                        │
│        │◀─────────────────│   risk_levels      │                        │
│        │                  │                    │                        │
│        │  5. View Dashboard                    │                        │
│        │  (KPIs, Charts, Alerts)               │                        │
│        │                  │                    │                        │
│        │  6. Click High-Risk Case              │                        │
│        │─────────────────▶│                    │                        │
│        │                  │────────────────────▶                        │
│        │                  │  GET /api/v1/      │                        │
│        │                  │  cases/{member_id} │                        │
│        │                  │◀───────────────────│                        │
│        │◀─────────────────│                    │                        │
│        │  7. Investigate: │                    │                        │
│        │  - Timeline      │                    │                        │
│        │  - Red Flags     │                    │                        │
│        │  - AI Reasoning  │                    │                        │
│        │  - Baseline comp.│                    │                        │
│        │                  │                    │                        │
│        │  8. Decision:    │                    │                        │
│        │  ┌─────────────┐ │                    │                        │
│        │  │ ✓ Confirm   │ │                    │                        │
│        │  │ ✗ Dismiss   │ │                    │                        │
│        │  │ ↑ Escalate  │ │                    │                        │
│        │  └──────┬──────┘ │                    │                        │
│        │         │        │                    │                        │
│        │─────────┴───────▶│                    │                        │
│        │                  │────────────────────▶                        │
│        │                  │  POST /api/v1/     │                        │
│        │                  │  feedback           │                        │
│        │                  │  {decision, notes}  │    ┌──────────────┐   │
│        │                  │                    │───▶│  Dataiku     │   │
│        │                  │                    │    │  Feedback DB │   │
│        │                  │                    │    └──────────────┘   │
│        │                  │                    │                        │
│   └────┴─────┘    └──────┴───────┘    └──────┴───────┘                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   FLOW 3: Model Retrain Loop (Feedback → Better Model)                  │
│   ════════════════════════════════════════════════════                    │
│                                                                         │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐             │
│   │  Feedback DB │    │  Dataiku     │    │  Deployed    │             │
│   │  (Labels)    │    │  AutoML      │    │  Model       │             │
│   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘             │
│          │                    │                    │                     │
│   1. Accumulated              │                    │                     │
│      Human Labels             │                    │                     │
│      (confirm/dismiss)        │                    │                     │
│          │────────────────────▶                    │                     │
│          │   labeled_data     │                    │                     │
│          │                    │                    │                     │
│          │                    │──┐                 │                     │
│          │                    │  │ 2. Retrain      │                     │
│          │                    │  │  Isolation Forest│                    │
│          │                    │  │  with new labels │                    │
│          │                    │◀─┘                 │                     │
│          │                    │                    │                     │
│          │                    │──┐                 │                     │
│          │                    │  │ 3. Evaluate     │                     │
│          │                    │  │  - Precision    │                     │
│          │                    │  │  - Recall       │                     │
│          │                    │  │  - F1 Score     │                     │
│          │                    │◀─┘                 │                     │
│          │                    │                    │                     │
│          │                    │  4. Deploy if      │                     │
│          │                    │     metrics pass   │                     │
│          │                    │────────────────────▶                     │
│          │                    │   new model version│                     │
│          │                    │                    │                     │
│   └──────┴───────┘    └──────┴───────┘    └──────┴───────┘             │
│                                                                         │
│   Schedule: Weekly retrain  |  Trigger: >100 new labels                 │
│   Champion/Challenger model comparison via Dataiku AutoML               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Flow — Key Schemas

```
Transaction {
  txn_id:       "T001"
  timestamp:    "2026-02-05 08:12:30"
  station_id:   "ST_001"
  pump_no:      "03"
  fuel_type:    "Gasohol 95"
  volume:       35.5           (ลิตร)
  amount:       1172           (บาท)
  member_id:    "M_7782"
}

AnomalyScore {                           (output จาก Dataiku Isolation Forest)
  txn_id:       "T001"
  score:        0.823                    (0 = ปกติ, 1 = ผิดปกติมาก)
  risk_level:   "high"                   (normal / suspicious / high)
  feature_contributions: {
    time_gap:           0.25             (สัดส่วนที่ time gap มีผลต่อ score)
    volume_deviation:   0.35
    staff_pattern:      0.25
    fuel_variety:       0.10
    hour_of_day:        0.05
  }
}

InvestigatorFeedback {                   (ส่งกลับไป retrain model)
  case_id:      "CASE_001"
  txn_ids:      ["T050", "T051", ...]
  decision:     "confirmed"              (confirmed / dismissed / escalated)
  fraud_type:   "volume_manipulation"
  notes:        "พนักงานร่วมมือกับสมาชิก proxy"
  investigator: "analyst_01"
  decided_at:   "2026-02-06T10:30:00Z"
}
```

### Page Flow — Investigator Journey

```
┌──────────┐     ┌──────────────┐     ┌─────────────────┐
│   Home   │────▶│   Anomaly    │────▶│  Case           │
│   (/)    │     │   Insights   │     │  Management     │
│          │     │  (/anomaly)  │     │  (/case-mgmt)   │
│ - Hero   │     │  - Time Gap  │     │  - Risk Queue   │
│ - How It │     │  - Volume    │     │  - Timeline     │
│   Works  │     │  - Staff     │     │  - Red Flags    │
│ - Caps   │     │  - IF Score  │     │  - AI Reasoning │
└──────┬───┘     └──────┬───────┘     │  - Decision     │
       │                │              └────────┬────────┘
       │     ┌──────────▼────────┐              │
       └────▶│  AI Performance   │              │
             │  (/ai-performance)│     ┌────────▼────────┐
             │  - Precision/     │     │  Feedback Loop  │
             │    Recall         │────▶│  (/feedback)    │
             │  - Feature Imp.   │     │  - Work Summary │
             │  - Score Dist.    │     │  - ROI Impact   │
             │  - Drift Monitor  │     │  - Model Status │
             │  - Alert Feed     │     │  - Retrain Ctrl │
             └───────────────────┘     └─────────────────┘
```

### Dataiku Integration — Fraud Pipeline

```
Dataiku Project: FUEL_FRAUD_DETECTION

┌─────────────────────────────────────────────────────┐
│                  Dataiku Flow                        │
│                                                      │
│  ┌─────────┐   ┌────────────┐   ┌───────────────┐  │
│  │ Raw TXN │──▶│  Feature   │──▶│  Isolation    │  │
│  │ Dataset │   │  Engineer  │   │  Forest Model │  │
│  └─────────┘   │  Recipe    │   └───────┬───────┘  │
│                 └────────────┘           │           │
│  ┌─────────┐                   ┌────────▼────────┐  │
│  │ Staff   │──────────────────▶│  Scored Dataset │  │
│  │ Shifts  │                   │  (with scores)  │  │
│  └─────────┘                   └────────┬────────┘  │
│                                         │           │
│  ┌─────────┐                   ┌────────▼────────┐  │
│  │ Members │──────────────────▶│   API Node      │  │
│  │ Master  │                   │  (REST Endpoint)│  │
│  └─────────┘                   └─────────────────┘  │
│                                                      │
│  Feedback Loop:                                      │
│  ┌──────────┐   ┌────────────┐   ┌──────────────┐  │
│  │ Feedback │──▶│  Retrain   │──▶│  Model V2    │  │
│  │ Dataset  │   │  Scenario  │   │  (Champion/  │  │
│  └──────────┘   └────────────┘   │  Challenger) │  │
│                                   └──────────────┘  │
└─────────────────────────────────────────────────────┘

API Endpoints (via Dataiku API Node):
  GET  /scored-transactions?station={id}&from={date}&to={date}
  GET  /anomaly-scores/{txn_id}
  GET  /model-metrics
  GET  /feature-importance
  POST /feedback  {case_id, decision, fraud_type, notes}
```

---

## Shared Architecture Patterns

### Tech Stack (Both Apps)

```
┌─────────────────────────────────────────────┐
│              Frontend Layer                   │
│  Next.js 15+ │ React 19 │ TypeScript         │
│  Tailwind CSS │ Radix UI │ shadcn/ui         │
│  Recharts (Charts) │ Framer Motion (Anim)    │
├─────────────────────────────────────────────┤
│              API Layer                        │
│  api-client.ts → fetchAPI()                  │
│  React Context (state management)            │
├─────────────────────────────────────────────┤
│              Backend Layer                    │
│  FastAPI (Python 3.11+)                      │
│  Pydantic schemas │ CORS middleware          │
├─────────────────────────────────────────────┤
│              ML Platform                      │
│  Dataiku DSS                                 │
│  - API Node (model serving)                  │
│  - AutoML (training)                         │
│  - Flow (data pipeline)                      │
│  - Scenarios (scheduled retrain)             │
└─────────────────────────────────────────────┘
```

### API Design Convention

```
Base URL:  http://{host}:{port}/api/v1

Health:    GET  /health
Dashboard: GET  /dashboard/summary
           GET  /dashboard/trends
Config:    GET  /config/current
           PUT  /config/update

Factory Safety specific:
  POST /detection/analyze          (multipart/form-data: file)
  GET  /incidents                  (query: page, limit, severity)
  GET  /incidents/{id}

Fraud Detection specific:
  GET  /transactions/scored        (query: station, from, to, risk_level)
  GET  /cases/top-risk             (query: limit)
  GET  /cases/{member_id}          (member transaction history)
  POST /feedback                   (json: case_id, decision, fraud_type, notes)
  GET  /model/metrics
  GET  /model/feature-importance
  POST /model/retrain              (trigger manual retrain)
```

---

## Deployment Architecture (Production)

```
┌────────────────────────────────────────────────────────────────┐
│                     Production Environment                      │
│                                                                 │
│  ┌─────────────────────┐    ┌─────────────────────┐           │
│  │    Nginx / LB       │    │    Nginx / LB       │           │
│  │    :443 (HTTPS)     │    │    :443 (HTTPS)     │           │
│  └─────────┬───────────┘    └─────────┬───────────┘           │
│            │                           │                       │
│  ┌─────────▼───────────┐    ┌─────────▼───────────┐           │
│  │  Factory Safety     │    │  Fraud Detection    │           │
│  │  Next.js (:3000)    │    │  Next.js (:3001)    │           │
│  └─────────┬───────────┘    └─────────┬───────────┘           │
│            │                           │                       │
│  ┌─────────▼───────────┐    ┌─────────▼───────────┐           │
│  │  FastAPI (:8080)    │    │  FastAPI (:8081)     │           │
│  │  + Uvicorn          │    │  + Uvicorn           │           │
│  └─────────┬───────────┘    └─────────┬───────────┘           │
│            │                           │                       │
│            └─────────────┬─────────────┘                       │
│                          │                                     │
│               ┌──────────▼───────────┐                         │
│               │   Dataiku DSS        │                         │
│               │   API Node (:11200)  │                         │
│               │   ┌───────────────┐  │                         │
│               │   │ WORKPLACE_    │  │                         │
│               │   │ SAFETY model  │  │                         │
│               │   ├───────────────┤  │                         │
│               │   │ FUEL_FRAUD_   │  │                         │
│               │   │ DETECTION     │  │                         │
│               │   │ model         │  │                         │
│               │   └───────────────┘  │                         │
│               └──────────────────────┘                         │
│                                                                 │
│               ┌──────────────────────┐                         │
│               │   PostgreSQL / DB    │                         │
│               │   - Incidents log    │                         │
│               │   - Feedback store   │                         │
│               │   - Audit trail      │                         │
│               └──────────────────────┘                         │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Summary — Key Differences

| Aspect                | Factory Safety            | Fraud Detection              |
|-----------------------|---------------------------|------------------------------|
| **ML Task**           | Object Detection (YOLO)   | Anomaly Detection (IF)       |
| **Input**             | Image (CCTV/Upload)       | Transaction records (Batch)  |
| **Inference**         | Real-time per image       | Batch scoring + real-time    |
| **Output**            | Bounding boxes + labels   | Anomaly scores + risk levels |
| **Human-in-the-loop** | Operator views alerts     | Investigator confirms/dismiss|
| **Feedback Loop**     | No (detect only)          | Yes (retrain from feedback)  |
| **Dataiku Project**   | WORKPLACE_SAFETY          | FUEL_FRAUD_DETECTION         |
| **Dataiku Model**     | YOLO (Computer Vision)    | Isolation Forest (Tabular)   |
