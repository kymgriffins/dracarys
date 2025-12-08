# **Dracarys Mentorship & Trading Platform: Comprehensive Technical Blueprint**

## **Document Purpose**
This document provides a complete technical, operational, and product specification for the Dracarys platform—an integrated mentorship and trading education ecosystem with a gamified engagement layer. It serves as the single source of truth for engineering, design, compliance, and go-to-market teams.

---

## **1. Executive Summary & Strategic Vision**

### **1.1 Core Value Proposition**
Dracarys connects aspiring retail traders (Mentees) with vetted, profitable trading experts (Mentors) through a structured, technology-driven platform. It transforms unstructured trading education by combining:
- **Standardized, Outcome-Focused Curriculum**
- **Simulated Practice Environment**
- **Personalized 1:1 & Group Mentorship**
- **Behavioral Gamification & Social Proof**

### **1.2 Primary Revenue Streams**
1. **Platform Commission:** 20-30% on paid mentorship sessions.
2. **Program/Course Sales:** Revenue share on structured cohort programs.
3. **Premium Features:** Advanced analytics, signal rooms, and certification fees.
4. **Affiliate Marketing:** Commission on referred brokerage accounts.

### **1.3 Target User Archetypes**
- **The Aspiring Trader (Mentee):** 25-40, some market knowledge, seeks structured path to consistency.
- **The Professional Mentor:** Consistently profitable trader seeking to monetize expertise systemically.
- **The Institutional Partner:** Brokerages, trading schools seeking white-label or API access.

---

## **2. Core Platform Architecture**

### **2.1 High-Level System Components**
The platform is built as a modular service-oriented architecture, enabling independent scaling of core domains:

1.  **Identity & Access Service:** Manages authentication, authorization, roles, and profiles.
2.  **Learning Management Service:** Hosts curriculum, tracks progress, and manages assessments.
3.  **Mentorship Orchestration Service:** Handles matching, scheduling, session lifecycle, and payments.
4.  **Trading Simulation Service:** Provides market data, paper trading, and backtesting engines.
5.  **Gamification & Incentives Service:** Manages the points ledger, rewards, badges, and leaderboards.
6.  **Payment & Wallet Service:** Processes deposits, holds escrow, executes payouts, and manages the internal wallet.
7.  **Notification & Communication Service:** Orchestrates all emails, SMS, push, and in-app messaging.
8.  **Social & Community Service:** Powers forums, groups, content sharing, and referral tracking.
9.  **Administration & Compliance Service:** Back-office tools for KYC, moderation, fraud monitoring, and reporting.

### **2.2 Key Technical Decisions**
- **Frontend:** Single-page application (React/Next.js) for core UX, with a separate, secure admin portal.
- **Backend Services:** Language-agnostic microservices communicating via well-defined APIs and an event bus (e.g., Apache Kafka).
- **Primary Data Store:** PostgreSQL for transactional and relational data (Users, Sessions, Orders).
- **Analytics & Reporting Data:** Real-time streaming to a cloud data warehouse (Google BigQuery, Snowflake) for business intelligence.
- **Real-time Features:** WebSocket connections for live chat, notifications, and trading simulation updates.

---

## **3. Detailed Module Specifications**

### **3.1 User Identity & Reputation System**

**Objective:** Establish trusted, role-based identities with transparent reputation metrics.

**Key Features:**
- **Tiered KYC Process:**
    - **Level 0 (Basic):** Email/Phone verification. Required for all signups.
    - **Level 1 (Mentee):** Government ID verification. Required for first withdrawal or session booking over $250.
    - **Level 2 (Mentor):** ID + Proof of Address + optional trading statement verification. Required for all mentors.
- **Dynamic Reputation Score:** A composite metric visible on profiles.
    - **For Mentees:** Based on lesson completion rate, assignment quality, and session attendance.
    - **For Mentors:** Algorithmically calculated from student ratings, session completion rate, student success metrics (e.g., simulated portfolio growth), and responsiveness.
- **Role-Specific Profiles:** Mentors showcase specialties, verifiable track records (opt-in), session statistics, and published content.

### **3.2 Mentorship Curriculum Engine**

**Objective:** Deliver a standardized, yet flexible, learning journey from novice to competent practitioner.

**Structure:**
- **Program:** A full learning track (e.g., "Forex Foundation").
- **Cohort:** A timed instance of a program with a defined group of students.
- **Module:** A thematic unit within a program (e.g., "Risk Management").
- **Lesson:** The atomic learning unit (video, text, interactive chart).
- **Assessment:** Knowledge check (quiz, multiple-choice).
- **Assignment:** Practical task (trade journal entry, strategy backtest submission).

**Workflow:**
1. Mentor or Admin creates a Program with sequenced Modules.
2. Mentee enrolls, progresses linearly or adaptively based on assessment results.
3. System tracks time-on-task, completion status, and assessment scores.
4. Completion triggers certification and unlocks higher-tier mentorship opportunities.

### **3.3 Trading Simulation & Practice Lab**

**Objective:** Provide a risk-free environment for strategy application and validation.

**Core Capabilities:**
- **Paper Trading:** Real-time or delayed price feeds across multiple asset classes (Forex, Equities, Crypto).
- **Strategy Sandbox:** Pre-built templates for common strategies. Users can adjust parameters (e.g., RSI levels, stop-loss %).
- **Backtesting Engine:** Run strategies against historical data with detailed performance reports (Sharpe Ratio, Max Drawdown, Win Rate).
- **Signal Mirroring (Optional):** Mentees can optionally subscribe to simulate a mentor's published trades in their paper account.
- **Performance Dashboard:** Visual equity curve, portfolio composition, and trade history analytics.

### **3.4 Mentor-Mentee Matchmaking & Scheduling**

**Objective:** Efficiently connect the right student with the right teacher at the right time.

**Matching Algorithm Factors (Weighted):**
1.  **Skill Gap Alignment (30%):** Matches mentee's learning goals with mentor's tagged specialties.
2.  **Schedule Compatibility (25%):** Prioritizes mentors with high availability overlap in the mentee's timezone.
3.  **Budget Alignment (20%):** Considers mentee's stated budget vs. mentor's session rate.
4.  **Language & Communication Style (15%):** Matches based on language preference and teaching style (e.g., "structured" vs. "discursive").
5.  **Reputation Score (10%):** Promotes higher-rated mentors.

**Scheduling Flow:**
1. Mentee searches or gets matched with a Mentor.
2. Views integrated calendar with real-time availability (synced via Google Calendar/Outlook API).
3. Selects open slot, chooses session type (1:1, Group, Workshop).
4. Payment is collected upfront and held in escrow.
5. System generates video conference link (Zoom/Whereby) and calendar invites for both parties.

### **3.5 Payments, Wallet & Escrow Management**

**Objective:** Facilitate seamless, secure, and transparent financial transactions with trust safeguards.

**Architecture:**
- **User Wallet:** A ledger balance within the platform. Holds cash deposits and points.
- **Escrow Service:** All session fees are held in escrow until session completion + dispute window expiry.
- **Multi-Rail Payments:** Integrate Stripe (global cards), M-Pesa (Kenya/Tanzania), and bank transfers.
- **Automated Payouts:** Mentors receive batch payments weekly (net of platform commission) to their linked account.

**Key Flows:**
- **Deposit:** User adds funds to wallet via preferred method. Triggers KYC check if over threshold.
- **Booking:** Session charge is moved from mentee wallet to `escrow_status: held`.
- **Completion:** After session ends and no dispute in 24h, funds move to `escrow_status: released_to_mentor`.
- **Payout:** Released funds accumulate in mentor's wallet. Weekly cron job initiates batched bank/MPesa transfers.

### **3.6 Gamification, Points & Rewards System (Detailed)**

**Philosophy:** Points are a non-cash, platform-specific currency designed to incentivize valuable behaviors that drive retention, growth, and quality.

**3.6.1 Points Ledger & Governance**
- **Immutable Ledger:** Every point change is recorded as a ledger entry with a timestamp, reason code, and associated entity ID.
- **Balance View:** Users see current balance, tier, and a transparent transaction history.
- **Anti-Abuse Rules:**
    - **Rate Limiting:** Caps on points earned from social/email actions per day.
    - **Verification Gates:** High-value bonuses (e.g., referrals) require KYC Level 1.
    - **Fraud Detection:** Heuristics flag suspicious patterns (e.g., multiple accounts from same IP, rapid-fire email opens).
    - **Point Expiry:** Points expire after 24 months of account inactivity to maintain economy health.

**3.6.2 Earning Actions & Point Values**
| **Action Category**       | **Example Action**                                   | **Point Value** | **Limits & Verification**                                                                 |
| ------------------------- | ---------------------------------------------------- | --------------- | ----------------------------------------------------------------------------------------- |
| **Platform Onboarding**   | Complete email verification                          | 100             | One-time                                                                                  |
|                           | Fill out trading profile                             | 50              | One-time                                                                                  |
|                           | Complete KYC Level 1                                 | 300             | One-time, verified by compliance team/API                                                 |
| **Learning & Progress**   | Complete a lesson                                    | 10              | Per lesson, verified by system event                                                      |
|                           | Pass a module assessment                             | 200             | Per assessment, score > 80%                                                               |
|                           | Submit an assignment                                 | 30              | Per submission                                                                           |
| **Financial Engagement**  | First deposit (>$50)                                 | 500             | One-time, linked to successful transaction                                                |
|                           | Book a paid session                                  | 5% of fee       | Monthly cap of 1000 points from this source                                               |
| **Social & Growth**       | Follow official Twitter & verify                     | 150 per platform | One-time, verified via OAuth token check                                                  |
|                           | Share a referral link that gets a click              | 10              | Daily cap of 100 points. Tracked via UTM parameter.                                      |
|                           | Refer a user who completes a paid session            | 1000            | Requires referred user KYC Level 1. Multi-account checks apply.                          |
| **Community & Quality**   | Attend a live cohort session                         | 30              | Verified by check-in system                                                               |
|                           | Provide a constructive mentor rating (with comment)  | 20              | Requires completed session ID                                                             |
|                           | Helpful forum post (receives 5+ upvotes)             | 50              | Automated detection, anti-spam checks.                                                   |

**3.6.3 Tiers, Benefits & Redemption**
- **Tiers (Bronze → Silver → Gold → Legend):** Unlocked at cumulative point thresholds (e.g., 1k, 5k, 25k, 100k). Tiers reset annually.
- **Tier Benefits:**
    - **All Tiers:** Display badge on profile.
    - **Silver+:** Access to exclusive webinars, higher visibility in mentor search.
    - **Gold+:** Reduced platform commission on sessions, priority support.
    - **Legend:** Featured on leaderboard, invited to beta features, annual merch.
- **Point Redemption (Cannot be cashed out for fiat):**
    - Discount on session fees (e.g., 100 points = $1 discount).
    - Unlock premium course modules.
    - Purchase platform merchandise.
    - Enter prize draws for trading hardware/software.

### **3.7 Integrated Communication Hub**

**Objective:** Centralize all platform communication to ensure reliability and enable engagement tracking.

**Channels:**
1.  **Transactional Email:** SendGrid/Mailgun for receipts, session reminders, KYC updates.
2.  **Marketing Email:** Drip sequences for onboarding, re-engagement, and course progress.
3.  **In-App Messaging:** Real-time chat between matched mentors/mentees with file sharing.
4.  **Push Notifications:** For time-sensitive alerts (session starting, trade signal).
5.  **SMS:** Critical alerts only (payment failure, account security).

**Email Point-Awarding Logic:**
- Points for `email_open` require a tracked pixel load **and** a subsequent authenticated session within a defined period.
- Points for `email_click` require a click on a primary CTA leading to a platform page.
- Limits prevent gaming: Max 2 points per email, 5 emails per day can earn points.

### **3.8 Administration & Compliance Command Center**

**Objective:** Provide operational staff with the tools to manage, monitor, and protect the platform.

**Key Dashboards:**
- **KYC/AML Queue:** Lists pending verifications with documents for manual review.
- **Fraud & Abuse Monitor:** Real-time alerts for suspicious point accrual, payment chargebacks, or spammy content.
- **Dispute Resolution Panel:** Interface to review session disputes, view evidence (chat logs, recordings), and adjudicate escrow releases.
- **Financial Reconciliation:** View all transactions, escrow balances, and payout batches.
- **Content Moderation:** Queue for reported forum posts, comments, or user-generated materials.

---

## **4. Success Metrics & Key Performance Indicators (KPIs)**

### **4.1 Business Health**
- **Monthly Recurring Revenue (MRR)** from commissions and subscriptions.
- **Take Rate:** Actual platform commission as % of total Gross Merchandise Volume (GMV).
- **Payout Accuracy & Speed:** % of payouts processed error-free within SLA.

### **4.2 User Engagement & Growth**
- **Activation Rate:** % of signups that book their first paid session within 14 days.
- **Course Completion Rate:** % of enrolled users who finish a program.
- **Weekly Active Mentors (WAM) / Mentees (WAE):** Measure of core user engagement.
- **Points Economy Health:** Ratio of points issued to points redeemed (target ~ 3:1 to encourage saving).

### **4.3 Marketplace Quality**
- **Mentor Utilization Rate:** % of a mentor's posted availability that is booked.
- **Average Mentor Rating:** Platform-wide average (target > 4.5/5).
- **Session Dispute Rate:** % of sessions that enter the dispute resolution flow (target < 2%).

### **4.4 Financial Compliance & Security**
- **KYC Approval Time:** Average time from submission to verification.
- **Fraud Detection Rate:** % of fraudulent transactions identified and blocked automatically.

---

## **5. Phase-Based Implementation Roadmap**

### **Phase 1: MVP Launch (Months 1-3)**
**Goal:** Validate core mentorship marketplace with basic payments.
- Core user auth & profiles (Mentor/Mentee).
- Manual mentor onboarding & listing.
- Basic session booking & scheduling (integrate Calendly API).
- Stripe payments with manual escrow/release by admin.
- Simple points system: Award points for signup, profile, and session booking only.
- Basic email notifications.

### **Phase 2: Engagement & Scale (Months 4-6)**
**Goal:** Drive retention and automate operations.
- Full Learning Management System (LMS) module.
- Automated matching algorithm.
- Integrated video conferencing.
- Expanded gamification: Points for lessons, assessments, social follows.
- Wallet system & automated escrow.
- Admin dashboards for KYC and dispute resolution.
- M-Pesa integration.

### **Phase 3: Advanced Features (Months 7-12)**
**Goal:** Increase platform stickiness and defensibility.
- Trading simulation sandbox with paper trading.
- Advanced gamification: Tiers, leaderboards, point redemption store.
- Community forums & cohort groups.
- Referral & affiliate program.
- Brokerage API integrations for optional live trading.
- Advanced analytics & reporting suite.

### **Phase 4: Ecosystem & Expansion (Year 2)**
**Goal:** Expand addressable market and revenue streams.
- White-label platform for institutional partners.
- Advanced AI features: Predictive matching, personalized learning path recommendations.
- Mobile-native applications.
- Expansion to new geographic regions with local payment/legal adaptations.

---

## **6. Critical Risks & Mitigations**

| **Risk Category**       | **Specific Risk**                                      | **Mitigation Strategy**                                                                                                                                 |
| ----------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Regulatory**          | Being classified as an unregistered investment advisor | Clear legal disclaimers; position as "educational mentorship." Consult local financial regulations in each operating jurisdiction (start with Kenya).    |
| **Marketplace**         | Low mentor quality damages platform reputation         | Rigorous vetting process (trading statement review, sample coaching session). Probation period for new mentors. Transparent rating system with consequences. |
| **Financial**           | Payment disputes and chargebacks                       | Clear terms of service. Escrow model. Session recording (with consent). Robust dispute resolution process.                                                |
| **Technical**           | Points economy exploited, causing inflation/devaluation | Implement anti-abuse rules from Day 1. Regular audits of ledger. Conservative initial point values.                                                      |
| **Operational**         | Difficulty managing two-sided marketplace              | Start with manual curation and matching. Use waitlists if one side grows faster. Focus on a specific trading niche (e.g., Forex in East Africa) initially. |

---

## **7. Conclusion & Next Steps**

The Dracarys blueprint presents a modular, scalable platform designed to create a high-trust, high-engagement marketplace for trading education. The integration of structured learning, practical simulation, and a sophisticated gamification layer addresses key gaps in the current market.

**Immediate Next Actions:**
1.  **Legal Review:** Engage counsel to review structure, terms of service, and KYC/AML policies for the primary launch market.
2.  **Architectural Deep Dive:** Conduct technical sprint planning sessions based on the Phase 1 (MVP) specifications.
3.  **Design Sprint:** Create high-fidelity wireframes for the core user journeys: Signup, Mentor Discovery/Booking, and Lesson Completion.
4.  **Mentor Pilot Program:** Recruit 10-15 high-quality mentors for a closed beta, onboarding them manually to test the core service flow.

This document serves as the foundational blueprint. Each module specification can be expanded into individual, detailed Product Requirements Documents (PRDs) for sprint planning.
