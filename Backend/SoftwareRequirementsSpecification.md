1. Project Overview
Vexaro is a web-based SaaS platform focused on personal productivity, time management, habit tracking, calendar organization, and financial monitoring. The system is designed for an initial user base of 5–10 users while maintaining a scalable modular architecture capable of supporting future expansion.

The platform centralizes scheduling, task management, financial tracking, reporting, habit monitoring, and goal progression into a unified environment with offline synchronization, real-time updates, and cloud persistence.

2. Main Objectives
•	Provide centralized time and financial management from a single interface.
•	Allow users to manage meetings, tasks, goals, habits, and expenses.
•	Maintain synchronization between offline and online usage via IndexedDB.
•	Generate automated reports and KPIs for productivity and finances.
•	Support recurring productivity workflows through Pomodoro and time-blocking.
•	Provide automated WhatsApp notifications for reminders and delay alerts.
•	Support long-term financial and productivity goals with dynamic recalculations.

3. System Scope
The system includes: productivity tracking, financial monitoring, calendar management, habit analysis, task planning, reporting, offline synchronization, push notifications, and cloud persistence. The application will operate as a Progressive Web Application (PWA) optimized for desktop-first usage.

3.1 Out of Scope (v1.0)
•	Artificial Intelligence integrations or recommendations engine.
•	PDF export systems.
•	Public social or collaboration features.
•	Advanced audit logging systems.
•	Enterprise multi-tenant scaling.

⚠ NOTA: These features are excluded from v1.0 but the architecture must remain compatible with their future implementation (see Section 12).

4. Functional Requirements
4.1 Authentication & User Management
•	User registration with email and password (Supabase Auth).
•	Role management: Admin and User roles with row-level permission enforcement.
•	Basic authentication — email verification is optional at v1.0.
•	User profile configuration (display name, avatar, preferences).
•	Language switching: English / Spanish (i18n via next-intl or similar).
•	Theme switching: Light / Dark mode (persisted per user).
⚠ NOTA: Admin role must be able to view aggregated usage stats but never access another user's private data directly.

4.2 Calendar Management
•	Unified calendar view displaying meetings, tasks, and goal deadlines.
•	Google Calendar import via OAuth2 — meetings only (read-only sync).
•	Manual meeting creation with title, schedule, recurrence, and meeting link.
•	Deadline visualization for financial and productivity goals.
•	Daily, weekly, and monthly calendar views.

4.3 Task Management
•	Kanban board with columns: Backlog, In Progress, Review, Done.
•	Task prioritization: Critical, High, Medium, Low.
•	Deadline assignment with visual overdue indicators.
•	Integrated Pomodoro timer (25/5 work-break cycle, configurable).
•	Time-block scheduling linked to calendar slots.
•	Real-time task status updates via Supabase Realtime.
⚠ NOTA: Pomodoro sessions must be persisted to the pomodoro_sessions table for KPI reporting.

4.4 Habit Management
•	Independent habit tracking module, decoupled from tasks.
•	Daily checklist-style habit completion (boolean per day).
•	Consistency analytics: streak count, weekly completion rate, monthly average.
•	Progress visualization through line/bar charts (Recharts).
•	Weekly and monthly tracking views.

4.5 Financial Management
•	Manual income and expense registration with date, amount, category, note.
•	Custom financial categories per user.
•	Default categories: savings, food, rent, health, university.
•	Budget allocation and real-time spend tracking per category.
•	Financial goal definition with target amount and deadline.
•	Cash flow monitoring (income vs. expense balance over time).
•	Historical financial comparisons (month-over-month, year-over-year).

4.6 Goal Management
•	Two goal types: Financial Goals and Productivity Goals.
•	Automatic progress recalculation when sub-tasks or transactions are updated.
•	Dynamic adjustment of daily required workload based on remaining time.
•	Automatic delay detection with visual alert when goal is behind schedule.
•	Estimated completion date tracking with confidence indicator.

4.7 Reports & KPIs
•	Report periods: Daily, Weekly, Monthly, Annual.
•	Expected vs. actual performance comparison for tasks and habits.
•	Financial KPI dashboard: savings rate, budget adherence, cash flow trend.
•	Habit consistency analysis: completion heatmap, best/worst day.
•	Task completion metrics: throughput, average cycle time, overdue rate.
•	Goal progression indicators with timeline visualization.

4.8 Notifications
•	Primary channel: WhatsApp API (business-tier or Twilio/WhatsApp sandbox).
•	Trigger: 30 minutes before any scheduled event or meeting.
•	Automatic delay alerts when a task or goal misses its deadline.
•	Internal notification center (bell icon, unread badge, mark-as-read).
•	Brief daily summary delivered via WhatsApp at a user-configured time.
⚠ NOTA: WhatsApp API requires a verified Meta Business account or a sandbox provider such as Twilio. Ensure credentials are stored as Supabase Vault secrets, never in environment variables committed to source control.

4.9 Offline Synchronization
•	Full offline support — all CRUD operations available without network.
•	Local persistence via IndexedDB (Dexie.js recommended wrapper).
•	Automatic sync queue — operations buffered offline and replayed on reconnect.
•	Conflict resolution strategy: latest-write-wins (timestamp-based).
•	Visual sync indicator showing pending operations count.

5. Non-Functional Requirements

Attribute	Requirement
Performance	Dashboard initial render < 2s on standard broadband; LCP < 2.5s (Core Web Vitals).
Availability	99% uptime target using Supabase Cloud free tier; graceful degradation offline.
Scalability	Architecture must support 5–10 concurrent users without code changes; ready for 100+.
Security	Row-Level Security (RLS) on all Supabase tables; HTTPS everywhere; session token rotation.
Data Retention	Automated backup every 48 h; 30-day retention minimum.
Responsiveness	Desktop-first; minimum usable on 1280×720 viewports; PWA installable.
Accessibility	WCAG 2.1 AA target for primary flows (color contrast, keyboard navigation, ARIA labels).
Deployment Cost	Free-tier infrastructure (Vercel Hobby + Supabase Free) for v1.0.

6. Technical Architecture
6.1 Frontend Stack

Technology	Purpose	Version Target
Next.js	React framework — App Router, SSR/SSG, API Routes	14+
TypeScript	Static typing across the entire codebase	5+
TailwindCSS	Utility-first styling	3+
shadcn/ui	Accessible component library built on Radix UI	latest
Zustand	Lightweight global state management	4+
TanStack Query	Server-state caching, background refetch, optimistic updates	5+
Recharts	Chart library for KPI dashboards	2+
FullCalendar	Calendar views (Day/Week/Month)	6+
Dexie.js	IndexedDB wrapper for offline persistence	3+

6.2 Backend & Infrastructure

Technology	Purpose
Supabase	Backend-as-a-Service: DB, Auth, Realtime, Storage, Edge Functions
PostgreSQL	Primary relational database hosted on Supabase
Supabase Auth	JWT-based authentication with RLS integration
Supabase Realtime	WebSocket subscriptions for live task/notification updates
Supabase Edge Functions	Scheduled jobs: notification dispatch, 48h backup trigger
Supabase Vault	Secure storage for API secrets (WhatsApp, Google OAuth)

6.3 Deployment
•	Frontend → Vercel (Hobby plan); automatic deployments from main branch via GitHub.
•	Backend → Supabase Cloud (Free tier); database, auth, storage, edge functions.
•	CI/CD → GitHub Actions: lint, type-check, and build validation on every PR.
⚠ NOTA: Use pnpm as the package manager (see best-practices guide). Configure Vercel to use pnpm via the ENABLE_EXPERIMENTAL_COREPACK=1 environment variable or a .npmrc / packageManager field in package.json.

7. Modular Structure
Each module maps to a self-contained feature directory under src/modules/<module-name>. Inter-module communication happens exclusively through defined service interfaces, never direct imports between module internals.

Module	Scope	Priority
auth	Login, register, session, profile, roles	P0 — Must Have
dashboard	Overview KPIs, quick-add widgets, daily summary	P0 — Must Have
calendar	Unified view, Google Calendar sync, event CRUD	P0 — Must Have
tasks	Kanban board, Pomodoro, time-blocking	P0 — Must Have
habits	Habit CRUD, daily check-ins, streak analytics	P1 — Should Have
finance	Transactions, budgets, categories, cash flow	P0 — Must Have
goals	Financial & productivity goals, progress engine	P1 — Should Have
reports	KPI aggregation, chart rendering, period filters	P1 — Should Have
notifications	WhatsApp dispatch, internal center, preferences	P2 — Nice to Have
settings	Language, theme, account, integration tokens	P0 — Must Have
sync	IndexedDB queue, conflict resolution, sync status	P1 — Should Have

8. Database Schema
8.1 Core Entities

Table	Key Columns	Notes
users	id, email, role, display_name, language, theme	Managed by Supabase Auth; extended via profiles table.
tasks	id, user_id, title, status, priority, due_date, board_column	RLS: user_id = auth.uid()
calendar_events	id, user_id, title, start_at, end_at, type, meeting_link, source	type: meeting | task_deadline | goal_deadline
habits	id, user_id, name, frequency, target_days	frequency: daily | weekly
habit_logs	id, habit_id, user_id, completed_at, notes	One row per completion instance.
transactions	id, user_id, amount, type, category_id, date, notes	type: income | expense
categories	id, user_id, name, is_default, color	Seed with 5 default categories on signup.
budgets	id, user_id, category_id, amount, period_start, period_end	—
goals	id, user_id, type, title, target_value, current_value, due_date	type: financial | productivity
pomodoro_sessions	id, user_id, task_id, started_at, ended_at, completed	Used in KPI reports.
notifications	id, user_id, type, message, is_read, created_at	type: reminder | delay | summary

8.2 Security & RLS Policy
•	Every table must have RLS enabled (ALTER TABLE ... ENABLE ROW LEVEL SECURITY).
•	Default deny policy: no row is accessible unless an explicit policy grants access.
•	Standard user policy: USING (user_id = auth.uid()) for SELECT, INSERT, UPDATE, DELETE.
•	Admin policy: granted through a custom claims JWT claim (app_role = admin) — never hardcoded user IDs.
•	Foreign keys reference auth.users(id) with ON DELETE CASCADE to auto-clean orphaned data.

9. Integration Requirements

Integration	Direction	Mechanism	Credentials Storage
Google Calendar	Inbound (import only)	OAuth2 + Google Calendar API v3	Supabase Vault
WhatsApp Notifications	Outbound	Twilio WhatsApp API or Meta Cloud API	Supabase Vault
Supabase Realtime	Bidirectional	WebSocket channel subscriptions (postgres_changes)	N/A (internal)
Offline Sync (IndexedDB)	Local ↔ Remote	Dexie.js + TanStack Query mutation queue	N/A (local)

10. Security Requirements
•	Role-based access control enforced at database level via RLS — not just UI guards.
•	All authenticated routes protected via Next.js middleware + Supabase session validation.
•	JWT session tokens stored in secure HTTP-only cookies (not localStorage).
•	User data strictly isolated — no cross-user data leakage possible by RLS design.
•	All API communication over HTTPS; Supabase keys never exposed on the client (use anon key only; service key server-side only).
•	Third-party API credentials stored exclusively in Supabase Vault.
•	Automated 48-hour backups with 30-day retention via Supabase scheduled Edge Functions.
•	Input sanitization on all user-supplied text fields to prevent XSS/injection.
⚠ NOTA: Never commit .env files with real secrets to version control. Use .env.example with placeholder values. See AGENT_BEST_PRACTICES.md for full guidance.

11. Architecture Recommendations
•	Use monolithic modular architecture (not microservices) for v1.0 to reduce operational complexity.
•	Maintain strict separation between UI components (src/components) and business logic (src/modules).
•	Implement database indexing on reporting-heavy tables: transactions.date, tasks.due_date, habit_logs.completed_at, goals.due_date.
•	Use optimistic UI updates (TanStack Query) for offline-sync user actions.
•	Build reusable UI components in src/components/ui — never duplicate primitives.
•	Limit Supabase Realtime subscriptions to active views only; unsubscribe on component unmount to stay within free-tier limits.
•	Use Supabase Edge Functions with cron triggers for notifications and backup — avoid client-side polling.
•	Keep all feature logic self-contained per module to simplify future extraction or scaling.

12. Future Expansion Readiness
The architecture must remain compatible with future implementation of the following capabilities without requiring structural rewrites:

Feature	Required Compatibility
PDF / CSV export	Report data layer must be query-separable from presentation.
AI recommendations	Data schema must support embeddings or vector columns (pgvector).
Mobile application	API-first design; no server-rendered-only flows for core features.
Advanced analytics	Raw event data must be retained; no irreversible aggregation.
Team collaboration	user_id ownership model must evolve to team_id without breaking existing data.
Extended notifications	Notification module must support pluggable channel providers.
Financial automation	Transaction schema must support automated/recurring sources.

13. Frontend Design References
The graphical interface specifications, layouts, dashboard distributions, visual hierarchy, and color palette are defined externally through the frontend design references provided by the project owner. The backend and system architecture described in this document must remain fully compatible with those interface references.

Reference packages identified: stitch_zenith_personal_suite (files 1–5). These Figma/Stitch assets are the source of truth for all visual decisions. The development agent must not deviate from them without explicit approval.

14. Suggested Development Phases

Phase	Scope	Deliverable
Phase 0 — Foundation	Project scaffold, Supabase setup, RLS policies, auth module, CI/CD	Deployable skeleton with login/logout
Phase 1 — Core Loop	Dashboard, Tasks (Kanban), Calendar, Settings, offline sync	Usable productivity app
Phase 2 — Finance	Transactions, Categories, Budgets, Financial Goals, Cash Flow	Financial tracking live
Phase 3 — Habits & Goals	Habit module, Productivity Goals, progress engine	Full goal tracking
Phase 4 — Reports	KPI aggregation, chart rendering, period filters, exports	Full reporting suite
Phase 5 — Notifications	WhatsApp integration, internal center, scheduled Edge Functions	Notification system live

15. Final Technical Conclusion
Vexaro is architecturally defined as a modular hybrid SaaS platform optimized for personal productivity and financial management. The proposed structure prioritizes maintainability, offline synchronization, low operational cost, and cloud-based persistence while remaining fully compatible with modern scalable web technologies.

All development decisions must align with the guidelines in AGENT_BEST_PRACTICES.md, particularly regarding package manager usage, secret management, and code organization. The specification in this document is the authoritative reference for scope, requirements, and architecture during v1.0 development.

