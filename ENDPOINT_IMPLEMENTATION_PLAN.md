# Endpoint Implementation & Testing Plan

This document outlines the roadmap to develop, verify, and test all API endpoints for the Dracarys platform.

## 🎯 Goal
To ensure a robust, fully functional API layer that supports all core features: Journaling, Psychology Engine, Goals, and Mentorship.

## 🧪 Testing Strategy
- **Tools**: Jest (for unit/integration tests), Postman/cURL (for manual verification).
- **Standard**: All endpoints must return standard JSON responses with appropriate HTTP status codes.
- **Security**: All private endpoints must verify Supabase session/auth.

---

## 📋 High-Level To-Do List

### Phase 1: Audit & Verify Existing Endpoints
*Check current health and functionality.*
- [ ] **Ads & Affiliates**
    - [ ] `GET /api/ads`: Verify ad fetching logic.
    - [ ] `POST /api/ads`: Verify ad creation (admin/mentor only).
    - [ ] `GET /api/affiliates`: Verify affiliate listing.
- [ ] **Payments**
    - [ ] `POST /api/payments/stripe/create-payment-intent`: Test payment flow initiation.
    - [ ] `POST /api/payments/stripe/webhook`: Verify webhook signature handling.
- [ ] **Dashboard**
    - [ ] `GET /api/dashboard/stats`: Verify data aggregation speed and accuracy.

### Phase 2: Core Trading Journal (New Implementation)
*The backbone of the application.*
- [ ] **Journal Entries**
    - [ ] `GET /api/journal`: Fetch user's trade history (with pagination).
    - [ ] `POST /api/journal`: Create a new trade entry (validation required).
    - [ ] `GET /api/journal/[id]`: Fetch single entry details.
    - [ ] `PATCH /api/journal/[id]`: Update entry (e.g., add post-trade notes).
    - [ ] `DELETE /api/journal/[id]`: Soft delete entry.
- [ ] **Trade Analytics**
    - [ ] `GET /api/journal/stats`: Aggregate win rate, P&L, etc.

### Phase 3: Psychology Engine (New Implementation)
*The unique value proposition.*
- [ ] **Psychology Entries**
    - [ ] `POST /api/psychology/log`: Log an emotional state (independent of a trade).
    - [ ] `GET /api/psychology/history`: Fetch emotional history.
- [ ] **Analysis**
    - [ ] `GET /api/psychology/analysis`: Return bias detection results (mocked AI response initially).

### Phase 4: Goals & Routines (New Implementation)
- [ ] **Routines**
    - [ ] `GET /api/routines`: Fetch user's daily checklist.
    - [ ] `POST /api/routines`: Create/Update checklist items.
    - [ ] `POST /api/routines/check`: Mark an item as complete for the day.
- [ ] **Goals**
    - [ ] `GET /api/goals`: Fetch goal ladder progress.

---

## 📍 Checkpoints & Milestones

### Milestone 1: Foundation Secure
- **Criteria**: All existing endpoints (Ads, Payments) return 200 OK and handle 401 Unauthorized correctly.
- **Deliverable**: Test report for existing API.

### Milestone 2: Journaling Live
- **Criteria**: Can create, read, update, and delete trade journal entries via API.
- **Deliverable**: `api/journal` routes deployed and tested.

### Milestone 3: Psychology Integrated
- **Criteria**: Can log emotional states and retrieve basic analysis.
- **Deliverable**: `api/psychology` routes deployed.

### Milestone 4: Full Feature Parity
- **Criteria**: Goals and Routines APIs are functional.
- **Deliverable**: Complete API suite ready for frontend integration.
