
---

# 📄 DealGraph — Finalized MVP PRD

## 1. Product Vision & Scope

**Mission:**
DealGraph is a dual-sided B2B commerce agent that automates both procurement (buying) and proposals (selling) workflows. It handles the complete cycle from purchase requests to vendor quotes, and from RFP responses to deal closures — with AI assistance, auditability, multi-tenant isolation, and minimal manual overhead.

**MVP Scope:**
Core procurement and sales loops. All non-essential features (advanced analytics, ERP integrations, marketplace vendor discovery) postponed to post-MVP phases.

**Target Users:**
Procurement managers, sales teams, and operations heads at SMEs; business owners needing streamlined buying and selling processes without building internal tooling.

**Primary Value Proposition:**

* Faster procurement and sales cycles
* Lower friction and manual overhead
* Transparent quote comparison and proposal generation
* AI-assisted RFP processing and proposal drafting
* Multi-organization support with isolation
* Unified platform for buy-side and sell-side commerce

---

## 2. Core Use-Cases / User Journeys

### Procurement (Buying) Side
| Use Case                       | Flow / Outcome                                                                                                                      |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Create Procurement Request** | User logs in → selects/creates Org → fills a form or uploads sheet specifying items required → request created.                     |
| **Send RFQ to Vendors**        | User selects vendors from their vendor list → clicks “Send RFQ” → system sends standardized request emails to all selected vendors. |
| **Collect & Normalize Quotes** | Vendors reply via email → system parses replies → adds structured quote entries under the request.                                  |
| **Compare Quotes & Approve**   | User views a comparison dashboard, comparing price, delivery, terms, total landed cost → picks one vendor → approves.               |
| **Execute Payment**            | On approval, system triggers payment via integrated payment gateway (e.g. Stripe test mode) → marks request paid.                   |
| **Close & Log Request**        | Request status updated (paid/closed), inventory or procurement logs updated (optional), full record saved for audit.                |
| **Multi-Tenant Isolation**     | Each Org’s data (vendors, requests, quotes, users) fully isolated; users only see data of their org.                                |

### Sales (Selling) Side
| Use Case                       | Flow / Outcome                                                                                                                      |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Receive & Process RFP**      | Client sends RFP via email or form → system extracts requirements → creates proposal draft with AI assistance.                     |
| **Create Client Profile**      | User adds client information → links to proposal → maintains client relationship data.                                             |
| **Draft Proposal**             | AI analyzes RFP content → generates proposal text → user reviews and edits → attaches pricing and terms.                            |
| **Generate Proposal PDF**      | System creates professional PDF → includes company branding → ready for client delivery.                                           |
| **Send & Track Proposal**      | Email proposal to client → track open rates and responses → update proposal status.                                                |
| **Win/Lose Deal Tracking**     | Mark proposals as won/lost → update deal status → maintain sales pipeline analytics.                                               |

### Shared Features
| Use Case                       | Flow / Outcome                                                                                                                      |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Multi-Tenant Isolation**     | Each Org's data (vendors, clients, requests, proposals, users) fully isolated; users only see data of their org.                    |
| **Unified Dashboard**          | Single platform with role-based access to buying and selling features.                                                             |

---

## 3. Technical Stack & Architecture (MVP Setup)

* **Frontend / BFF**: Next.js + React + shadcn/ui + Tailwind (dual-sided UI with separate layouts for procurement and sales)
* **Backend API / AI Service**: FastAPI + LangGraph (handles both procurement workflows and proposal generation)
* **Database**: PostgreSQL + Prisma ORM (shared schema) + RLS for tenant isolation
* **Background Queue / Cache**: Valkey (Redis-compatible) for async tasks (email sending, AI processing, rate-limit, retries)
* **Email Integration**: Gmail/SMTP client for RFQ sending, RFP processing, and vendor/client email parsing
* **Payment**: Stripe (test mode) — for demonstration / early users; other gateways can be added later
* **PDF Generation**: For professional proposal documents
* **Deployment (MVP)**: Docker Compose for dev; containerized services for prod

### Data Access Setup

* Shared `/packages/db/schema.prisma` defines canonical data models
* Application logic in both Web and AI-service load same Prisma schema — eliminating duplication and schema drift
* Migrations handled centrally

---

## 4. Data Models (Simplified)

```prisma
model Organization {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  users     User[]
  vendors   Vendor[]
  clients   Client[]
  deals     Deal[]
  requests  ProcurementRequest[]
  proposals Proposal[]
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String?  // if not using OAuth
  orgId        String
  organization Organization @relation(fields:[orgId], references:[id])
  role         String    // "admin" / "member"
}

model Vendor {
  id        String   @id @default(cuid())
  orgId     String
  name      String
  email     String
  metadata  Json?
  quotes    Quote[]
}

model Client {
  id        String   @id @default(cuid())
  orgId     String
  name      String
  email     String
  proposals Proposal[]
}

model Deal {
  id          String   @id @default(cuid())
  orgId       String
  name        String
  type        DealType // BUY or SELL
  status      DealStatus @default(ACTIVE)
  requests    ProcurementRequest[]
  proposals   Proposal[]
}

model Proposal {
  id          String   @id @default(cuid())
  orgId       String
  clientId    String
  client      Client @relation(fields:[clientId], references:[id])
  dealId      String?
  title       String
  content     String @db.Text
  status      ProposalStatus @default(DRAFT)
  totalValue  Decimal?
  pdfUrl      String?
  createdAt   DateTime @default(now())
}

enum DealType {
  BUY
  SELL
}

enum DealStatus {
  ACTIVE
  CLOSED
  CANCELLED
}

enum ProposalStatus {
  DRAFT
  SENT
  WON
  LOST
  CANCELLED
}

model ProcurementRequest {
  id              String   @id @default(cuid())
  orgId           String
  createdBy       String
  status          String   // ENUM: CREATED, RFQ_SENT, QUOTES_RECEIVED, APPROVAL_PENDING, APPROVED, PAID, CLOSED
  items           Json     // list of items, quantities, metadata
  quoteList       Quote[]
  selectedVendorId String?  
  paymentInfo     Json?    // Stripe or payment metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Quote {
  id           String   @id @default(cuid())
  requestId    String
  vendorId     String
  unitPrice    Float
  totalPrice   Float
  deliveryETA  Int?     // days
  terms        Json?
  createdAt    DateTime @default(now())
  request      ProcurementRequest @relation(fields:[requestId], references:[id])
  vendor       Vendor             @relation(fields:[vendorId], references:[id])
}
```

**Notes:**

* All models include `orgId` — mandatory for multi-tenant isolation.
* RLS policies enforce that users see only their org’s data.
* `items` and `terms` are stored as JSON to allow flexible structures.
* `status` tracks lifecycle of request.

---

## 5. Workflow & State Machine (Backend / LangGraph)

```
CREATED
   └── send_rfq() → RFQ_SENT
          └── wait_for_quotes() → QUOTES_RECEIVED
                 └── user_approval → APPROVAL_PENDING
                       └── on_approve → APPROVED
                            └── execute_payment() → PAID
                                  └── finalize() → CLOSED
```

### Key transitions:

* **send_rfq**: enqueue email jobs for each vendor
* **wait_for_quotes**: background poller or webhook consuming vendor replies & parsing quotes
* **user_approval**: API endpoint + UI to show quote comparison
* **execute_payment**: trigger Stripe payment, wait for confirmation
* **finalize**: record payment, update request, close

Each state and transition persisted in DB, enabling auditability, retry, and recovery.

---

## 6. API Surface (Simplified)

```
POST /auth/signup       → create org & user
POST /auth/login        → login (returns session / JWT)
GET  /vendors           → list vendors
POST /vendors           → add vendor
GET  /requests          → list procurement requests (tenant-scoped)
POST /requests          → create new request
POST /requests/:id/send-rfqs    → send RFQ to selected vendors
GET  /requests/:id      → fetch request + quotes
POST /requests/:id/approve     → approve quote + trigger payment
GET  /requests/:id/status      → fetch status & history
```

---

## 7. Non-functional Requirements (MVP)

* **Security & Multi-Tenant Isolation** via RLS and session-based org context
* **Auditability & Logging** — every action logged (RFQ sent, quotes received, approval, payment) with timestamps
* **Robustness** — support retries for failed emails / payment failures / vendor non-response
* **Scalability (basic)** — queue backed by Valkey / Redis, can scale email tasks independent of main API
* **Simplicity & Maintainability** — shared schema, clear layering, minimal duplication

---

## 8. Milestones & Success Criteria (MVP Launch)

| Milestone                           | Done When …                                                                            |
| ----------------------------------- | -------------------------------------------------------------------------------------- |
| ✅ Core “Create Request → Send RFQs” | Request creation, vendor selection, emails enqueued & sent                             |
| ✅ Quote ingestion & normalization   | Quotes appear in DB, retrievable by frontend                                           |
| ✅ Quote comparison UI               | User can view quote list in UI with price/delivery/terms                               |
| ✅ Approval & Payment flow (test)    | Approving triggers Stripe test payment; request updated to PAID                        |
| ✅ Multi-tenant auth & isolation     | Multiple orgs/users work independently; no data leaks                                  |
| ✅ Audit & history logging           | All transitions (RFQ request, quote receipt, approval, payment) logged and retrievable |
| ✅ Docker-based dev setup            | Single `docker-compose up` boots entire stack (web + ai + db + queue)                  |

---

## 9. Out-of-Scope (Post-MVP / Version 2+)

* ERP integrations, inventory sync with external systems
* Bulk CSV uploads / supplier catalogs
* Vendor-facing portal (vendors logging in)
* Marketplace vendor discovery
* Advanced AI-based quote negotiation or dynamic vendor suggestions
* Analytics dashboards / spending reports
* Real-time collaboration / multiple users editing same request

---

## ✅ Final Note (as CTO)

This is your **launchable product spec**.
If you implement exactly the features above — no extras — you will have a **fully functional P2P procurement SaaS for SMEs**.
From there, you can gauge real user interest, get feedback, and decide if you scale up.

If you like — I can now generate a **Notion-style project spec** (with clickable checkboxes, feature gating, status) — ready for team or solo tracking.
