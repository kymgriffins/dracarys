# Dracarys — Complete Mentorship + Trading Model: Modules, point system, flows, data models, and operational detail

Below is a comprehensive blueprint for Dracarys: modules, features, UX flows, APIs/data-model sketches, gamification/points (social follow, payments, email), security/compliance, monetization and KPI suggestions. Use this as a product + implementation spec for engineering, design and ops.

---

# 1 — High-level product domains

1. **User & Identity** — registration, roles (mentor, mentee, trader, observer), KYC, reputation.
2. **Mentorship Curriculum** — structured courses, lessons, tasks, live sessions, office hours, assignments, assessments.
3. **Trading Engine & Simulations** — strategy templates, backtesting sandbox, paper trading and live signals integration.
4. **Matchmaking & Scheduling** — mentor/mentee pairing, session booking, calendars, availability.
5. **Payments & Wallet** — deposits, payouts, escrow, fee handling, local payment rails (e.g., M-Pesa), fiat & optional crypto wallet.
6. **Points, Gamification & Rewards** — points ledger, tiers, badges, leaderboards, point redemption.
7. **Social & Growth** — incentivized social actions (follow, share), referral program, affiliate links.
8. **Messaging, Notifications & Email** — transactional emails, drip sequences, in-app chat, SMS.
9. **Community & Content** — forums, group cohorts, knowledge base, content library.
10. **Admin & Compliance** — dashboards, fraud monitoring, KYC/AML workflows, content moderation.
11. **Analytics & Reporting** — product metrics, P&L, mentor performance, cohort health.
12. **Integrations & Platform APIs** — OAuth, social APIs, broker APIs, calendar, video conferencing.
13. **Security & Infrastructure** — auth, encryption, audit trails, rate-limiting, incident response.

---

# 2 — Core modules with depth

## 2.1 User & Identity

**Purpose:** secure, role-aware accounts and reputations.
**Features**

* Signup: email + password, OAuth (Google/Apple), phone number.
* Roles: mentee, mentor, admin, reviewer, observer (read-only).
* KYC: tiered KYC (email/phone → ID upload → proof of address). Triggered for payout & large deposits.
* Reputation: rating system, endorsements, verified mentor badge.
* Profiles: bio, specialties (e.g., scalping, options), track record (optional), social links.
  **Data model (high level)**
* `users` {id, role, name, email, phone, KYC_status, reputation_score, created_at}
* `user_profiles` {user_id, headline, bio, skills[], public_metrics}
  **APIs**
* `POST /signup`, `POST /login`, `GET /users/{id}`, `PATCH /users/{id}/kyc-upload`
  **Admin**
* KYC review queue, ban/unban, manual verification override.

## 2.2 Mentorship Curriculum

**Purpose:** host modular learning paths mapped to trading competencies.
**Key concepts**

* Program -> Cohort -> Module -> Lesson -> Assessment -> Assignment.
  **Features**
* Course builder (rich text, upload charts, code snippets).
* Live sessions scheduling (Zoom/Jitsi integration), recorded sessions.
* Assignments with submission, mentor feedback, rubric.
* Certifications (auto-grant when user passes assessments).
  **Data model**
* `programs`, `cohorts`, `modules`, `lessons`, `assessments`, `submissions`
  **UX**
* Progress bar, next suggested lesson, estimated time per lesson.
  **APIs**
* `GET /programs`, `POST /cohorts/{id}/join`, `POST /lessons/{id}/complete`

## 2.3 Trading Engine & Simulations

**Purpose:** let mentees practice strategies in safe environment and mirror mentor signals.
**Features**

* Paper trading sandbox with historical backtest data.
* Strategy templates (indicators, risk rules).
* Signal subscription (mentors may broadcast signals; mentees optionally subscribe).
* Performance dashboards: equity curve, drawdown, Sharpe ratio.
* Optional brokerage integrations for live trading (broker APIs, FIX, or off-the-shelf connectors).
  **Data model**
* `portfolios`, `trades`, `signals`, `backtests`
  **Risk & Compliance**
* Risk disclaimers, suitability checks, limits on leveraged actions for novice tiers.

## 2.4 Matchmaking & Scheduling

**Purpose:** efficient pairing and management of mentorship sessions.
**Features**

* Mentor discovery: filters (style, availability, success metrics).
* Auto-matching algorithm: skill-gap, timezone, price, past ratings.
* Session booking with timezone normalization and calendar sync.
* Session types: 1:1, group, workshop.
  **APIs**
* `POST /sessions/book`, `GET /mentors?skill=options&timezone=EAT`
  **Data model**
* `matches`, `sessions`, `availability`, `cancellations`

## 2.5 Payments & Wallet

**Purpose:** handle course fees, mentor payouts, point redemption, refunds.
**Features**

* Wallet per user with balance ledger.
* Accept payments: M-Pesa (Kenya), Stripe (card), PayPal, bank transfer.
* Payouts to mentors (scheduled, weekly), commission rules (platform %).
* Escrow model for mentorship packages: funds released after session completion/timeout.
* Invoices/receipts, tax reporting (VAT/GST).
  **Data model**
* `wallets`, `transactions` {type: deposit/withdrawal/payout/escrow_release}, `payout_schedules`
  **APIs**
* `POST /payments/charge`, `POST /wallets/{id}/withdraw`
  **Security**
* PCI compliance (if storing cards), two-factor for high-value withdrawals.

## 2.6 Points, Gamification & Rewards (Detailed)

**Purpose:** drive acquisition, retention and behavior (social follows, payments, open email).
**Design principles**

* Points stored as ledger entries (immutable).
* Actions earn points; some actions may cost points.
* Tier system derived from cumulative points over period (Bronze/Silver/Gold/Legend).
* Soft caps and anti-abuse rules.
* Point decay for stale accounts optionally (monthly/quarterly).
  **Earning actions (example table)**

| Action                                                        |                               Points | Limits / Notes                             |
| ------------------------------------------------------------- | -----------------------------------: | ------------------------------------------ |
| Sign up (email verified)                                      |                                  100 | one-time                                   |
| Complete onboarding profile                                   |                                   50 | one-time                                   |
| Complete a lesson                                             |                                   10 | per lesson                                 |
| Pass assessment                                               |                                  200 | per assessment                             |
| Book paid mentorship session                                  | 5% of paid amount (converted to pts) | cap per month                              |
| Attend live session                                           |                                   30 | validated by session attendance event      |
| Follow official social handle (OAuth/webhook verify)          |                                  150 | one-time per platform                      |
| Share public post (tracked via UTM)                           |                                   50 | limited daily                              |
| Refer a new paid user (referral completes first paid session) |                                 1000 | referral network checks                    |
| Make first deposit                                            |                                  500 | one-time                                   |
| Verified KYC completion                                       |                                  300 | one-time                                   |
| Open & click marketing email                                  |                                    2 | per email; cap to avoid spam gaming        |
| Leave mentor rating                                           |                                   20 | per rating; require transaction/session ID |

**Redemption / Utility**

* Redeem points for: discounted session fees, platform cut for mentors, partial refunds, merch, exclusive course unlocks, 1:1 mentor credits.
* Cash-out disabled; points are platform currency. (If allowing cash redemption → require KYC + AML.)
  **Ledger model**
* `points_ledger` {id, user_id, change, reason_code, related_entity_id, timestamp, balance_after, source_ip}
* `points_balance` {user_id, balance, last_updated}
  **Gamification features**
* Badges (earned for milestones), seasonal leaderboards, streaks (daily learning streak), visible tier on profile, limited-time events.
  **Anti-abuse**
* Tie social follow verification to OAuth or social API to assert that follow occurred. Prevent multi-accounting by device/IP heuristics and email/phone uniqueness + KYC gating for point-valuable actions.
* Rate-limit email open points; detect automated opens via suspicious UA patterns.
  **Point decay & reconciliation**
* Define retention window (e.g., points expire after 12 months of inactivity).
* Daily cron reconciles ledger and detects anomalies (>X points in Y minutes).

## 2.7 Social & Growth (incentivized)

**Social verification**

* For each social platform: OAuth or API check (Twitter/X, Instagram, YouTube, TikTok). If OAuth unavailable, ask user to provide proof (screenshot + link) and require manual review (low-sensitivity).
  **Referral & affiliate**
* Unique referral codes, affiliate tracking via UTM + cookie + login mapping.
* Revenue share for affiliates; automated commission payouts.
  **Content promotion**
* Templates for social posts, built-in share flow that includes UTM + claimable points on verifying engagement.

## 2.8 Messaging, Notifications & Email

**Email**

* Transactional: signup, payment receipt, session reminder, KYC status.
* Drip sequences: onboarding, course completion nudges, re-engagement.
* Point-specific emails: reward unlocks, leaderboard notifications.
  **In-app messaging**
* Mentor <> mentee chat with attachments and pinned lesson links.
* System messages: "Points awarded", "Payment processed".
  **Notifications**
* Push (mobile/web), SMS for critical events (payment failures, KYC).
  **Email point gating**
* Award points on email opens & clicks only when:

  * Email contains unique tracking token per-user per-email.
  * Click must go to platform landing page and cause an authenticated session event.
  * Limit points/day/per-email.
    **Templates**
* Provide templated content for key events (session booked, points earned, payout processed).

## 2.9 Community & Content

**Features**

* Topic-based channels (e.g., Options, Futures, Risk Management).
* Mentor-hosted groups (cohorts).
* Q&A, upvoting, moderation tools, content flagging.
  **Monetization**
* Paid cohorts, premium forums.
  **Moderation**
* Auto-moderation (bad words, spam), manual moderation queue.

## 2.10 Admin & Compliance

**Admin features**

* Role-based admin console: KYC queue, payouts, disputes, content moderation, fraud dashboard.
* Audit logs for all financial & points operations.
  **Compliance**
* KYC/AML rules per country; monthly reports and exportable CSVs; tax documents (invoices).
  **Dispute resolution**
* Escrow holds, session disputes, automatic partial refunds after evidence review.

## 2.11 Analytics & Reporting

**Dashboards**

* Acquisition funnel, retention, cohort analysis, LTV, mentor utilization, lesson completion rates, points economy health.
  **Alerts**
* Unusual points issuance, payment chargebacks, suspicious login patterns.
  **Exports & BI**
* Data warehouse feed (e.g., Snowflake, BigQuery), scheduled exports.

---

# 3 — Architecture & tech stack suggestions

**Frontend**

* React + TypeScript, Next.js, Tailwind, component library.
  **Backend**
* Node.js/TypeScript or Python (FastAPI). Microservices for Payments, Points, Trading Engine, Notifications.
  **Datastore**
* Primary relational DB (Postgres) for core models; Redis for caching and sessionstore; event store for ledgers; data warehouse for analytics (BigQuery / Snowflake).
  **Realtime**
* WebSockets or Socket.IO for live session events, leaderboards.
  **Payments**
* Use gateway (Stripe) + local rails adapters (M-Pesa adapter service).
  **Queueing**
* RabbitMQ / Kafka for event-driven actions (point awarding, email sends).
  **Infrastructure**
* Kubernetes, CI/CD pipelines, observability (Prometheus, Grafana), Sentry.
  **Security**
* OAuth2.0, JWT for auth, RBAC, encryption at rest (DB column-level for PII), secrets manager.

---

# 4 — Data models (concise schema excerpts)

`users`

* id, email, phone, name, role, kyc_level, created_at

`mentors`

* user_id, specialties[], hourly_rate, verified, rating_avg, total_sessions

`programs`

* id, title, description, difficulty, price, currency

`sessions`

* id, mentor_id, mentee_id, start_time, duration, status, price, escrow_id

`wallets`

* id, user_id, balance_base (fiat), pending_balance

`transactions`

* id, wallet_id, amount, currency, type, status, created_at, metadata

`points_ledger`

* id, user_id, delta, reason_code, related_id, balance_after, timestamp, source

`leaderboards`

* period, metric (points/earnings), ranking_json

`kyc_documents`

* id, user_id, doc_type, status, uploaded_at

---

# 5 — Points system: operational rules & anti-abuse (concrete)

1. **Ledger first**: All point changes are ledger entries with unique ID and immutability.
2. **Verification gating**: High-value actions (referral bonus, cash-equivalent rewards) are gated behind KYC level 2.
3. **Rate limits**: Maximum N points from social/email actions per day. E.g., max 500 points/day from email opens/shares.
4. **Social verification**: Use OAuth token introspection or platform APIs to confirm follow/subscribe. If impossible, require manual verification for big rewards.
5. **Fraud detection**:

   * Heuristics: same IP across multiple accounts, device fingerprinting.
   * Machine learning signals: sudden surge of points, repeated low-value accounts referring each other.
   * Automated freeze on suspicious accounts pending manual review.
6. **Redemption controls**:

   * Points cannot be converted to fiat without KYC + 30-day hold.
   * Redemption to discounts can be immediate.
7. **Transparency**:

   * Provide user-facing points history, reason codes, and appeal process.
8. **Decay & reconciliation**:

   * Points older than 12 months expire unless user has logged in within last 90 days.
   * Monthly reconciliation job that flags negative balances or inconsistencies.

---

# 6 — Examples: point flows and sample calculations

**Example 1 — New user**

* Signup (email verified): +100 pts
* Complete profile: +50 pts
* Follow Twitter + Instagram: +300 pts (150 each verified)
* Complete first lesson: +10 pts
  **Total:** 460 pts → Bronze tier (thresholds configurable).

**Example 2 — Paid session reward**

* Mentee books 1-hour mentor session for KES 5,000:

  * Platform gives 5% of payment as points to mentee → 250 pts (value mapping: 1 point = 1 KES in redemption? configurable)
  * Mentor receives payout after platform commission, and also receives 2x points per session attended to incentivize mentoring.

**Value mapping**

* Set 1 point = base unit (e.g., 1 point = 1 cent equivalent). Avoid direct fiat conversion unless KYC. Better to use points as discount tokens where conversion is controlled.

---

# 7 — Mentor compensation, commissions, reputation mechanics

* **Commission split**: configurable default: Mentor 70% / Platform 30% (adjustable per mentor contract).
* **Bonuses**: mentors who maintain >4.7 average + 80% session attendance get monthly bonus (fixed KES).
* **Holdbacks**: platform may hold 10% for 30 days to cover disputes/chargebacks.
* **Reputation decay**: negative reviews reduce visibility; mentor must appeal.

---

# 8 — UX flows (concise)

**Onboarding (mentee)**

1. Signup → email verification → quick preference quiz (trading style, experience).
2. Suggest programs & local mentors → option to join onboarding cohort (points reward).
3. Complete KYC for payouts/unlocks.

**Booking session**

1. Browse mentor → view ratings & verified track record → choose session type → pay → session scheduled.
2. After session: both parties rate; points awarded.

**Points redemption**

1. In wallet, option to apply points to checkout or redeem for platform credit.
2. Redemption reduces points ledger and adds wallet credit or discount code.

---

# 9 — Security & compliance specifics

* **KYC/AML**: third-party provider integration (Jumio, Onfido) or local KYC vendor for Kenya; thresholds for AML triggers.
* **Data protection**: encrypt PII, store KYC documents in secure object storage with limited access.
* **Financial controls**: PCI scope minimization (use hosted payment pages), 2FA on high-risk actions.
* **Logging & audit**: immutable logs for payments, withdrawals, points issuance.

---

# 10 — KPIs & success metrics

* Activation rate (signed → first paid session)
* Course completion rate
* Retention (D7, D30)
* LTV / CAC
* Mentor response time, session fill rate
* Points economy metrics: total points issued vs redeemed, fraud rate, average points per user
* Payout accuracy & payout latency
* NPS, satisfaction by cohort

---

# 11 — Implementation roadmap (epic-level)

1. MVP (3 months): User auth, basic course builder, mentor profiles, booking + Stripe payments, points ledger (basic actions), email notifications.
2. Growth phase (3–6 months): Social integrations, referral program, leaderboards, wallets, local payment rails (M-Pesa).
3. Trust & scale (6–12 months): KYC flows, dispute resolution, analytics, trading sandbox, brokerage integrations.
4. Mature platform: Advanced gamification, automated mentor marketplace algorithm, cross-border payouts, regulatory compliance expansions.

---

# 12 — Operational considerations & pitfalls

* **Points inflation**: monitor issuance vs redemption; control via caps, tiered burns.
* **Social verification pain**: social APIs change; fallback to manual verification for some platforms.
* **Regulatory risks**: avoid promising investment returns; clearly label mentorship vs investment advice. Consult legal on financial advisory rules in target jurisdictions.
* **Mentor quality control**: require sample vetting and probation period before platform-wide visibility.
* **Support ops**: invest in dispute resolution and human moderation for first 6–12 months.

---

# 13 — Minimal APIs for points & verification (examples)

`POST /points/award`
body: `{ user_id, change, reason_code, related_entity_id }` → returns new ledger entry.

`GET /points/balance?user_id=...` → `{balance, tier}`

`POST /social/verify`
body: `{ user_id, platform, oauth_token }` → verifies follow/subscribe and triggers points award.

`POST /wallet/convert-points`
body: `{user_id, points, target: "discount"|"credit"|"merch"}` → create transaction if allowed.

---

# 14 — Example email triggers (point awarding)

* Event: `lesson_completed` → award 10 pts and send email: "Nice — 10 points for completing {lesson_title}. Your balance: {balance}."
* Event: `social_verified` → award platform-specific points, email with shareable badge.

---

# 15 — Final recommendations (operational)

* Start with conservative point values and strict anti-abuse rules; loosen as product stabilizes.
* Make ledger and transaction histories visible to users to build trust.
* Use escrow for payments to reduce disputes friction.
* Localize payments (M-Pesa) and legal docs for target countries (Kenya first).
* Prioritize KYC paths only for payout/redemption to keep onboarding friction low.

---

If you want, I can:

* produce a JSON schema for the points ledger and API contract,
* draft example email templates for the key point-triggered events,
* or create a prioritized 12-week implementation backlog. Specify which and I will produce it immediately.
