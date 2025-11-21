Here is a clean **Markdown TODO list** for the full feature stack, ready for implementation with shadcn + Supabase:

```md
# Feature TODO List
Below is the **exact specification** your AI agent must follow so it **never defaults to market-data features, indicators, timeframes, charting tools, or broker-like things**.

This defines **how mentorship works**, what **Premium actually includes**, and the **global rules of what your app is and is NOT**.

Use this as the **master definition** for all future generation of features, UI, pricing, components, explanations, and documentation.

---

# 1. Global Identity of the App

### What the AI must ALWAYS assume:

**This is a Trader Development Platform**, not a trading platform.

The pillars of the system:

1. **Journaling & performance analytics**
2. **Psychology insights & emotional profiling**
3. **Trading rituals, routines, and discipline systems**
4. **Rule-based trading frameworks & playbooks**
5. **Mentorship & coaching environment**
6. **Accountability systems & progress tracking**
7. **Trade review & trade improvement cycles**

### What the app NEVER includes:

The AI must never assume:

* no charting
* no indicators
* no market data feeds
* no candles
* no order book
* no broker integration
* no strategy execution
* no signals except human/mentor-guided interpretations
* no analysis tools like RSI/MACD/etc unless the user writes them manually in their journal

---

# 2. Premium Mentorship Model

### What you can offer in Premium without violating the app’s identity:

Premium = **high-touch trader development**, not a signals platform.

It includes:

## 2.1 Live Trade Walkthroughs

These are **educational**, not financial advice:

* Mentor breaks down the market structure
* Shows what a high-probability setup looks like
* Explains psychology, reasoning, bias, invalidation
* Demonstrates execution discipline
* Shows risk management, scaling, journaling notes
* Helps user understand *why*, *when*, *how* decisions are made

This is not signals.
This is structured apprenticeship.

## 2.2 Live Trade Signals (Allowed Under This Definition)

You can include signals **ONLY** framed as:

* “Real-time mentor alerts"
* “Educational trade examples"
* “Mirror of mentor’s decision-making process"
* “A walkthrough of the reasoning behind a trade"

NOT a "buy/sell now" app.

Key constraints the AI must always follow:

* Signals = **teaching tools**
* Not guaranteed accuracy
* Not automated
* Not connected to broker execution
* Must sit inside the **mentorship flow**, not the main app identity

---

# 3. How Mentorship Works (The Blueprint)

Tell the AI to always follow this system when generating:

Mentorship includes:

### 3.1 Onboarding Call

* Assess trading level
* Identify psychological weaknesses
* Determine trading style (scalper, intraday, swing)
* Build a 90-day plan

### 3.2 Daily Routine System

* Pre-session checklist
* Bias worksheet
* Emotional calibration
* Trade plan template
* Post-session reflection
* Discipline scoring

### 3.3 Weekly Coaching

* Review past trades
* Identify mistakes
* Give corrective drills
* Update playbook
* Adjust biases and scenarios

### 3.4 Monthly Deep-Dive

* Full performance analysis
* Strength/weakness map
* Psychology audit
* Milestone progression
* Roadmap update

### 3.5 Real-Time Mentor Alerts

* Commentaries during live sessions
* Annotated charts (mentor’s screen)
* Setup alerts with reasoning
* “Why I’m not taking this trade” lessons
* “Where this setup breaks” lessons

### 3.6 Accountability System

* Habit tracking
* Daily discipline grade
* Session rating
* Consistency streaks
* Commitment contracts

### 3.7 Personalized Playbook

* Built collaboratively with mentor
* Includes setups, execution rules, invalidation, bias flows
* Updated as user improves

---

# 4. Premium App Features (Non-Market-Data Interpretation)

Premium users get:

1. **Unlimited journaling + all AI review tools**
2. **Psychology Engine 2.0**

   * Emotional tagging
   * Bias vs result mapping
   * Trigger detection
   * Confidence calibration
3. **Deep analytics**

   * Win-rate by setup
   * Consistency metrics
   * R:R distribution
   * Time-of-day performance
4. **Custom rituals & routines**
5. **Goal ladder**
6. **Mentorship portal**
7. **Live trade walkthroughs**
8. **Educational signals feed**
9. **Private mentor chat**
10. **One personal trading plan built by mentor**
11. **Weekly mentor review of journal**
12. **Monthly improvement roadmap**
13. **Research vault**

---

# 5. Hard Rules to Avoid Market-Data BS

The AI must not propose:

* 5m, 1h, 4h timeframes
* EMA/SMA indicators
* Volume profile
* Real-time feed
* Price action tools
* Candlestick charts
* Broker API
* Copy trading
* Order execution

If the user wants technical analysis tools, they can describe them as part of their *playbook*, but the app itself never supplies them.

---

# 6. How to Give the AI This Context

If you want, I can produce:

* A **System Prompt** (for your agent or your own backend)
* A **developer-only context file** called `AGENT_RULES.md`
* A **Supabase schema** that matches all of this
* A **component architecture** for mentorship and signals
* A **pricing page ready for your shadcn UI**

Reply with **“generate the system prompt”** if you want a fully optimized rule file for the agent.

## 1. Authentication & User Account
- [ ] Email/password auth
- [ ] Magic link login
- [ ] OAuth providers (Google)
- [ ] User profile table
- [ ] Profile update page
- [ ] Avatar upload (Supabase Storage)
- [ ] Onboarding wizard

## 2. Dashboard Core
- [ ] Main dashboard layout (sidebar + topbar)
- [ ] Stats overview cards
- [ ] Activity feed
- [ ] Notifications system (Supabase real-time)
- [ ] Settings page

## 3. Project / Workspace Logic
- [ ] Workspaces table
- [ ] Workspace roles (owner, admin, member)
- [ ] Invitation flow
- [ ] Workspace switcher UI (shadcn command menu)
- [ ] RLS: row-level access by workspace

## 4. Task Management Module
- [ ] Tasks table (title, description, status, priority, assignee)
- [ ] Kanban board UI
- [ ] Task detail drawer
- [ ] Comments on tasks
- [ ] File attachments (Supabase storage)
- [ ] Real-time task updates
- [ ] Task filters + search

## 5. Automation & Intelligence
- [ ] Activity rules engine (triggers)
- [ ] Auto-assign logic
- [ ] Analytics page with charts
- [ ] AI suggestions (task summaries)
- [ ] Background cron jobs (Supabase Functions)

## 6. Collaboration Tools
- [ ] Real-time presence indicators
- [ ] Typing indicators
- [ ] Shared notes per workspace
- [ ] Mention system (@user)
- [ ] Shared calendar (basic events table)

## 7. Billing & Plans
- [ ] Stripe integration
- [ ] Free / Pro plan structure
- [ ] Workspace usage limits
- [ ] Billing portal integration
- [ ] Upgrade/downgrade UI

## 8. Settings & Config
- [ ] Personal settings (name, email, preferences)
- [ ] Workspace settings (logo, name, members)
- [ ] Notification toggles
- [ ] Theme toggle (light/dark)
- [ ] Audit logs page

## 9. Admin / Super Admin
- [ ] Admin dashboard
- [ ] User list
- [ ] Workspace list
- [ ] Manual suspension controls
- [ ] Analytics (usage metrics)
<!--
## 10. Infrastructure & Quality
- [ ] Complete Supabase schema
- [ ] All RLS policies
- [ ] Edge Functions for sensitive logic
- [ ] Error boundaries in UI
- [ ] Loading skeletons (shadcn)
- [ ] Full test coverage (unit + integration) -->

```


