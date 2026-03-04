# ML Application Architecture — DS Service Platform (Mermaid)

> สถาปัตยกรรมของ ML Application ทั้ง 2 โปรเจกต์ เมื่อต่อ Dataiku DSS เรียบร้อยแล้ว
>
> **วิธีดู:** เปิดใน GitHub, Notion, VSCode (Markdown Preview Mermaid Support extension), หรือ [mermaid.live](https://mermaid.live)

---

## 1. System Landscape — ภาพรวมทั้งระบบ

```mermaid
graph TB
    subgraph Platform["🏢 DS Service Platform"]
        direction TB

        subgraph App1["🏭 Factory Safety App"]
            FE1["Next.js Frontend<br/>React 19 + Tailwind"]
            BE1["FastAPI Backend<br/>Python 3.11+"]
        end

        subgraph App2["⛽ Fraud Detection App"]
            FE2["Next.js Frontend<br/>React 19 + Tailwind"]
            BE2["FastAPI Backend<br/>Python 3.11+"]
        end

        subgraph Dataiku["🧠 Dataiku DSS"]
            API_NODE["API Node<br/>(Model Serving)"]
            AUTOML["AutoML<br/>(Training)"]
            FLOW["Flow<br/>(Data Pipeline)"]
            SCENARIO["Scenarios<br/>(Scheduled Jobs)"]
        end

        subgraph DB["🗄️ Database"]
            PG["PostgreSQL<br/>Incidents / Feedback / Audit"]
        end
    end

    FE1 -->|REST API| BE1
    FE2 -->|REST API| BE2
    BE1 -->|Inference Request| API_NODE
    BE2 -->|Inference Request| API_NODE
    BE1 -->|Store Incidents| PG
    BE2 -->|Store Feedback| PG
    PG -->|Labeled Data| AUTOML
    AUTOML -->|Deploy New Model| API_NODE
    FLOW -->|Feature Engineering| AUTOML

    style Platform fill:#f8fafc,stroke:#334155
    style App1 fill:#dbeafe,stroke:#3b82f6
    style App2 fill:#fef3c7,stroke:#f59e0b
    style Dataiku fill:#d1fae5,stroke:#10b981
    style DB fill:#fce7f3,stroke:#ec4899
```

---

## 2. Factory Safety — High-Level Flow

### 2a. End-to-End Flow: ภาพเข้า → ตรวจจับ → แจ้งเตือน

```mermaid
graph LR
    A["📷 ถ่ายภาพ<br/>Operator / CCTV"] -->|Upload Image| B["🖥️ Next.js<br/>Frontend"]
    B -->|POST /detection/analyze<br/>FormData| C["⚙️ FastAPI<br/>Backend"]
    C -->|POST /predict<br/>image_b64| D["🧠 Dataiku<br/>YOLO Model"]
    D -->|detections[]<br/>bounding boxes<br/>confidence scores| C
    C -->|คำนวณ<br/>compliance_rate<br/>violations_count| E["📊 Dashboard<br/>แสดงผล + แจ้งเตือน"]

    style A fill:#dbeafe,stroke:#3b82f6
    style B fill:#e0e7ff,stroke:#6366f1
    style C fill:#fef3c7,stroke:#f59e0b
    style D fill:#d1fae5,stroke:#10b981
    style E fill:#fce7f3,stroke:#ec4899
```

### 2b. Detection Flow — Sequence Diagram

```mermaid
sequenceDiagram
    actor Op as 👷 Operator
    participant FE as 🖥️ Next.js Frontend
    participant BE as ⚙️ FastAPI Backend
    participant DK as 🧠 Dataiku DSS
    participant YOLO as 🔍 YOLO Model

    Op->>FE: 1. Upload ภาพ (Drag & Drop)
    FE->>BE: 2. POST /api/v1/detection/analyze<br/>FormData(file)
    BE->>DK: 3. POST /predict<br/>{ image_b64: "..." }
    DK->>YOLO: 4. Run Inference
    YOLO-->>DK: 5. detections[] + bboxes + confidence

    DK-->>BE: 6. Raw Detection Result

    Note over BE: 7. คำนวณ Metrics:<br/>• compliance_rate<br/>• violations_count<br/>• total_persons

    BE-->>FE: 8. DetectionResult JSON

    Note over FE: 9. Render:<br/>• Bounding Box overlay<br/>• Alert sidebar<br/>• Compliance %

    FE-->>Op: 10. แสดงผลลัพธ์ + แจ้งเตือนหากพบ Violation
```

### 2c. สิ่งที่ Model ตรวจจับได้

```mermaid
graph TD
    MODEL["🔍 YOLO Object Detection Model"] --> SAFE
    MODEL --> UNSAFE

    subgraph SAFE["✅ ปลอดภัย (Compliant)"]
        H["🪖 หมวกนิรภัย<br/>(helmet)"]
        V["🦺 เสื้อสะท้อนแสง<br/>(vest)"]
        M["😷 หน้ากาก<br/>(mask)"]
        G["🥽 แว่นตานิรภัย<br/>(goggles)"]
    end

    subgraph UNSAFE["❌ ละเมิด (Violation)"]
        NH["⚠️ ไม่สวมหมวก<br/>(no_helmet)"]
        NV["⚠️ ไม่สวมเสื้อ<br/>(no_vest)"]
    end

    UNSAFE -->|แจ้งเตือนทันที| ALERT["🚨 Real-time Alert<br/>+ บันทึก Incident Log"]

    style SAFE fill:#d1fae5,stroke:#10b981
    style UNSAFE fill:#fee2e2,stroke:#ef4444
    style ALERT fill:#fef3c7,stroke:#f59e0b
```

### 2d. Detection Result Schema

```mermaid
classDiagram
    class DetectionResult {
        +Detection[] detections
        +int total_persons
        +int violations_count
        +float compliance_rate
        +string processed_at
    }

    class Detection {
        +string label
        +float confidence
        +BoundingBox bbox
        +bool is_violation
    }

    class BoundingBox {
        +float x
        +float y
        +float width
        +float height
    }

    DetectionResult "1" --> "*" Detection
    Detection "1" --> "1" BoundingBox
```

### 2e. Page Flow — User Journey

```mermaid
graph TD
    HOME["🏠 Home<br/>/<br/>Stats + Quick Actions"] --> DETECT["📷 Detection Center<br/>/detection<br/>Upload + Analyze + BBox"]
    HOME --> DASH["📊 Dashboard<br/>/dashboard<br/>KPIs + Trends + Zones"]

    DETECT --> INCIDENT["📋 Incident Log<br/>/incidents<br/>History + Export"]

    DASH --> REPORT["📄 Reports<br/>/reports<br/>Export PDF"]
    DASH --> CONFIG["⚙️ Config<br/>/config<br/>Toggle Classes + Threshold"]

    style HOME fill:#dbeafe,stroke:#3b82f6
    style DETECT fill:#fef3c7,stroke:#f59e0b
    style DASH fill:#d1fae5,stroke:#10b981
    style INCIDENT fill:#e0e7ff,stroke:#6366f1
    style REPORT fill:#fce7f3,stroke:#ec4899
    style CONFIG fill:#f3e8ff,stroke:#a855f7
```

---

## 3. Fraud Detection — High-Level Flow

### 3a. End-to-End Flow: ข้อมูลเข้า → วิเคราะห์ → สอบสวน → เรียนรู้

```mermaid
graph LR
    A["💳 POS / ERP<br/>ข้อมูลธุรกรรม"] -->|Sync ข้อมูล| B["📦 Dataiku<br/>Feature Engineering"]
    B -->|Features| C["🧠 Isolation Forest<br/>Anomaly Scoring"]
    C -->|Scored Data| D["🕵️ Investigator<br/>สอบสวน + ตัดสินใจ"]
    D -->|Feedback<br/>Confirm / Dismiss| E["🔁 Retrain<br/>Model เรียนรู้"]
    E -.->|Model ใหม่<br/>แม่นยำขึ้น| C

    style A fill:#dbeafe,stroke:#3b82f6
    style B fill:#fef3c7,stroke:#f59e0b
    style C fill:#d1fae5,stroke:#10b981
    style D fill:#e0e7ff,stroke:#6366f1
    style E fill:#fce7f3,stroke:#ec4899
```

### 3b. Flow 1 — Data Ingestion & Batch Scoring

```mermaid
sequenceDiagram
    participant POS as 💳 POS / ERP System
    participant DS as 📦 Dataiku Dataset
    participant FE as 🔧 Feature Engineering
    participant IF as 🧠 Isolation Forest
    participant API as 🌐 API Node

    POS->>DS: 1. Daily/Hourly Sync<br/>transactions (txn_id, timestamp,<br/>station, volume, amount, member)

    DS->>FE: 2. Trigger Pipeline

    Note over FE: 3. คำนวณ Features:<br/>• time_gap_min<br/>• volume_deviation<br/>• staff_pattern<br/>• fuel_variety<br/>• hour_of_day

    FE->>IF: 4. Input Features
    IF->>IF: 5. Anomaly Scoring

    Note over IF: Output:<br/>• anomaly_score (0-1)<br/>• risk_level<br/>• feature_contributions

    IF->>API: 6. Deploy scored dataset<br/>→ พร้อมให้ Frontend เรียกใช้
```

### 3c. Flow 2 — Investigation & Decision

```mermaid
sequenceDiagram
    actor INV as 🕵️ Investigator
    participant FE as 🖥️ Next.js Frontend
    participant BE as ⚙️ FastAPI Backend
    participant DK as 🧠 Dataiku API Node

    INV->>FE: 1. เปิด Dashboard
    FE->>BE: 2. GET /transactions/scored
    BE->>DK: 3. Query scored dataset
    DK-->>BE: 4. transactions + anomaly_scores
    BE-->>FE: 5. Scored data
    FE-->>INV: 6. แสดง KPIs, Charts, Alert Feed

    INV->>FE: 7. Click เคสเสี่ยงสูง
    FE->>BE: 8. GET /cases/{member_id}
    BE-->>FE: 9. Transaction timeline + Red flags + AI reasoning

    Note over INV: 10. ตรวจสอบ:<br/>• Transaction Timeline<br/>• Behavioral Red Flags<br/>• AI Confidence & Reasons<br/>• Historical Comparison

    INV->>FE: 11. ตัดสินใจ

    alt ✅ Confirm Fraud
        FE->>BE: POST /feedback {decision: "confirmed", fraud_type: "..."}
    else ❌ Dismiss (False Positive)
        FE->>BE: POST /feedback {decision: "dismissed", notes: "..."}
    else ⬆️ Escalate
        FE->>BE: POST /feedback {decision: "escalated"}
    end

    BE->>DK: 12. Store feedback → Feedback Dataset
```

### 3d. Flow 3 — Model Retrain Loop

```mermaid
graph TD
    FB["📝 Feedback Dataset<br/>Human Labels<br/>(confirm / dismiss)"] -->|Accumulated Labels| RETRAIN

    subgraph RETRAIN["🔄 Retrain Process (Dataiku AutoML)"]
        R1["1. Merge new labels<br/>with training data"]
        R2["2. Retrain Isolation Forest<br/>with updated labels"]
        R3["3. Evaluate Metrics<br/>Precision / Recall / F1"]
        R4{"4. Metrics Pass?<br/>Better than current?"}
        R1 --> R2 --> R3 --> R4
    end

    R4 -->|✅ Yes| DEPLOY["🚀 Deploy New Model<br/>(Champion/Challenger)"]
    R4 -->|❌ No| KEEP["⏸️ Keep Current Model<br/>Investigate why"]

    DEPLOY -->|Model V2 active| API["🌐 API Node<br/>Serving new predictions"]

    TRIGGER["⏰ Trigger Conditions:<br/>• Weekly schedule<br/>• >100 new labels<br/>• Manual trigger"]
    TRIGGER -.-> RETRAIN

    style RETRAIN fill:#f0fdf4,stroke:#10b981
    style DEPLOY fill:#dbeafe,stroke:#3b82f6
    style KEEP fill:#fef3c7,stroke:#f59e0b
```

### 3e. Features ที่ Model ใช้วิเคราะห์

```mermaid
graph LR
    subgraph Features["📊 Anomaly Detection Features"]
        F1["⏱️ Time Gap<br/>35%<br/>เวลาระหว่างธุรกรรม<br/>(< 2 นาที = น่าสงสัย)"]
        F2["📊 Volume Deviation<br/>28%<br/>ปริมาณผิดจาก baseline<br/>(> 1.3x = น่าสงสัย)"]
        F3["👥 Staff Pattern<br/>20%<br/>พนักงาน-สมาชิก collision<br/>(ซ้ำบ่อย = น่าสงสัย)"]
        F4["⛽ Fuel Variety<br/>12%<br/>จำนวนประเภทน้ำมัน<br/>(3+ ประเภท = น่าสงสัย)"]
        F5["🌙 Hour of Day<br/>5%<br/>ช่วงเวลาทำรายการ<br/>(22:00-04:00 = น่าสงสัย)"]
    end

    Features --> MODEL["🧠 Isolation Forest"]

    MODEL --> N["🟢 Normal<br/>score < 0.5"]
    MODEL --> S["🟡 Suspicious<br/>0.5 ≤ score < 0.7"]
    MODEL --> H["🔴 High Risk<br/>score ≥ 0.7"]

    style Features fill:#f8fafc,stroke:#334155
    style N fill:#d1fae5,stroke:#10b981
    style S fill:#fef3c7,stroke:#f59e0b
    style H fill:#fee2e2,stroke:#ef4444
```

### 3f. Page Flow — Investigator Journey

```mermaid
graph TD
    HOME["🏠 Home<br/>/<br/>Hero + Capabilities"] --> ANOMALY["🔍 Anomaly Insights<br/>/anomaly<br/>Pattern Analysis"]
    HOME --> AI["🤖 AI Performance<br/>/ai-performance<br/>Model Metrics"]

    ANOMALY --> CASE["🕵️ Case Management<br/>/case-management<br/>Investigate + Decide"]
    AI --> CASE

    CASE --> FEEDBACK["🔁 Feedback Loop<br/>/feedback<br/>ROI + Retrain Control"]
    AI --> FEEDBACK

    style HOME fill:#dbeafe,stroke:#3b82f6
    style ANOMALY fill:#fef3c7,stroke:#f59e0b
    style AI fill:#d1fae5,stroke:#10b981
    style CASE fill:#e0e7ff,stroke:#6366f1
    style FEEDBACK fill:#fce7f3,stroke:#ec4899
```

---

## 4. เปรียบเทียบ 2 Apps

```mermaid
graph TB
    subgraph FS["🏭 Factory Safety"]
        FS_IN["📷 Input<br/>ภาพ / CCTV"]
        FS_MODEL["🔍 YOLO<br/>Object Detection"]
        FS_OUT["⬜ Output<br/>Bounding Boxes"]
        FS_USER["👷 Operator<br/>ดู Alert"]
        FS_IN --> FS_MODEL --> FS_OUT --> FS_USER
    end

    subgraph FD["⛽ Fraud Detection"]
        FD_IN["💳 Input<br/>ข้อมูลธุรกรรม"]
        FD_MODEL["📊 Isolation Forest<br/>Anomaly Detection"]
        FD_OUT["🔢 Output<br/>Anomaly Scores"]
        FD_USER["🕵️ Investigator<br/>Confirm / Dismiss"]
        FD_LOOP["🔁 Feedback Loop<br/>Retrain Model"]
        FD_IN --> FD_MODEL --> FD_OUT --> FD_USER --> FD_LOOP
        FD_LOOP -.->|ยิ่งใช้ ยิ่งแม่นยำ| FD_MODEL
    end

    FS_MODEL ---|ขับเคลื่อนด้วย| DK["🧠 Dataiku DSS<br/>ML Platform"]
    FD_MODEL ---|ขับเคลื่อนด้วย| DK

    style FS fill:#dbeafe,stroke:#3b82f6
    style FD fill:#fef3c7,stroke:#f59e0b
    style DK fill:#d1fae5,stroke:#10b981
```

| Aspect | Factory Safety | Fraud Detection |
|--------|---------------|-----------------|
| **ML Task** | Object Detection (YOLO) | Anomaly Detection (Isolation Forest) |
| **Input** | ภาพ / CCTV | ข้อมูลธุรกรรม (POS) |
| **Inference** | Real-time per image | Batch scoring + real-time alert |
| **Output** | Bounding boxes + labels | Anomaly scores + risk levels |
| **User** | 👷 Operator | 🕵️ Investigator |
| **Feedback Loop** | ❌ ไม่มี | ✅ Retrain จาก human feedback |

---

## 5. Deployment Architecture

```mermaid
graph TB
    subgraph PROD["🌐 Production Environment"]
        subgraph LB["Load Balancer / Nginx"]
            LB1["HTTPS :443<br/>factory-safety.company.com"]
            LB2["HTTPS :443<br/>fraud-detection.company.com"]
        end

        subgraph FRONTEND["Frontend Servers"]
            N1["Next.js :3000<br/>Factory Safety"]
            N2["Next.js :3001<br/>Fraud Detection"]
        end

        subgraph BACKEND["Backend Servers"]
            F1["FastAPI :8080<br/>+ Uvicorn"]
            F2["FastAPI :8081<br/>+ Uvicorn"]
        end

        subgraph DATAIKU["🧠 Dataiku DSS"]
            API["API Node :11200"]
            M1["WORKPLACE_SAFETY<br/>YOLO Model"]
            M2["FUEL_FRAUD_DETECTION<br/>Isolation Forest"]
            API --> M1
            API --> M2
        end

        subgraph DATABASE["🗄️ PostgreSQL"]
            DB1["Incidents Log"]
            DB2["Feedback Store"]
            DB3["Audit Trail"]
        end
    end

    LB1 --> N1 --> F1 --> API
    LB2 --> N2 --> F2 --> API
    F1 --> DB1
    F2 --> DB2
    F1 & F2 --> DB3

    style PROD fill:#f8fafc,stroke:#334155
    style LB fill:#e0e7ff,stroke:#6366f1
    style FRONTEND fill:#dbeafe,stroke:#3b82f6
    style BACKEND fill:#fef3c7,stroke:#f59e0b
    style DATAIKU fill:#d1fae5,stroke:#10b981
    style DATABASE fill:#fce7f3,stroke:#ec4899
```

---

## 6. Dataiku Integration — API Config

### Factory Safety

```mermaid
graph LR
    BE["FastAPI Backend"] -->|POST| URL["Dataiku API Node<br/>/public/api/v1/WORKPLACE_SAFETY/<br/>safety_object_detection/predict"]

    subgraph Request
        REQ["{ features: { image_b64: '...' } }"]
    end

    subgraph Response
        RES["{ result: { detections: [...] } }"]
    end

    BE --> Request
    URL --> Response

    style BE fill:#fef3c7,stroke:#f59e0b
    style URL fill:#d1fae5,stroke:#10b981
```

### Fraud Detection — Dataiku Flow

```mermaid
graph LR
    subgraph Input["📥 Input Datasets"]
        RAW["Raw Transactions"]
        STAFF["Staff Shifts"]
        MEMBER["Members Master"]
    end

    subgraph Pipeline["🔧 Dataiku Flow"]
        FE["Feature Engineering<br/>Recipe"]
        IF["Isolation Forest<br/>Model"]
        SCORED["Scored Dataset"]
        FE --> IF --> SCORED
    end

    subgraph Serve["🌐 Serving"]
        API["API Node<br/>(REST Endpoint)"]
    end

    subgraph Feedback["🔁 Feedback Loop"]
        FB_DS["Feedback Dataset"]
        RETRAIN["Retrain Scenario"]
        NEW_MODEL["Model V2<br/>(Champion/Challenger)"]
        FB_DS --> RETRAIN --> NEW_MODEL
    end

    RAW --> FE
    STAFF --> FE
    MEMBER --> FE
    SCORED --> API
    NEW_MODEL -.->|Deploy| IF

    style Input fill:#dbeafe,stroke:#3b82f6
    style Pipeline fill:#d1fae5,stroke:#10b981
    style Serve fill:#fef3c7,stroke:#f59e0b
    style Feedback fill:#fce7f3,stroke:#ec4899
```
