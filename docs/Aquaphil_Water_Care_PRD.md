# Aquaphil Water Care — Product Requirements Document

Sep 26, 2026 · @CLATians

## Executive Summary

Aquaphil Water Care sells, installs and services RO water purifiers, spare parts and AMC plans. This PRD defines a unified digital platform — a customer website, Android app, iOS app, a vendor/technician CRM, and an admin panel — covering purchase, service booking, live order/service tracking, in-app chat and technician assignment, run from one connected system.

This scope mirrors the OSMO RO platform PRD, since both are RO purifier sales-and-service businesses with the same core needs. No mockups or a signed quotation were supplied for Aquaphil Water Care specifically — screens, sections and figures below are proposed on that basis and flagged for confirmation. Stack: Node.js backend + Next.js web frontend, as requested; React Native recommended for Android and iOS to share one codebase (see [Technical Architecture](#technical-architecture--tech-stack)).

## Goals & Success Metrics

Business goals:

- Move service and order bookings off phone/WhatsApp onto a self-serve digital flow.
- Give the Aquaphil Water Care team one dashboard for orders, service jobs, technicians and AMC renewals.
- Increase AMC renewal rate through automated reminders.
- Launch in phases — web + CRM + admin first, then Android, then iOS — so the business can start taking digital orders before mobile apps are ready.

Draft targets for 6 months post-launch (confirm actual numbers with Aquaphil Water Care):

| Metric | Target |
| --- | --- |
| New service requests booked via app/web (not phone) | ≥ 60% |
| Time from booking to technician assignment | < 2 hours |
| AMC renewal rate | ≥ 70% of expiring AMCs |
| App store rating (Android + iOS) | ≥ 4.3 |
| Technician job-completion SLA adherence | ≥ 90% |

## Target Users & Personas

1. **Customer** — buys purifiers/spares, books installation, repair or AMC visits, tracks orders and service status, chats with support. Uses web, Android or iOS interchangeably.
2. **Technician / vendor** — receives assigned jobs, updates job status (assigned → in progress → completed), logs notes, sees own rating. Whether technicians get their own login is an open question — see Risks & Open Questions.
3. **Admin / ops staff** — manages catalogue, orders, payments, service requests, technician assignment, AMC records, chat inbox and reports from the admin panel.
4. **Support agent** — responds to in-app chat; may be the same seat as admin or a separate role.

## Product Scope & Platforms

Three platforms, one shared backend:

- **Customer web app** — Next.js, public e-commerce + account area, responsive across mobile browser and desktop.
- **Customer Android app** — same customer feature set as web.
- **Customer iOS app** — same customer feature set as web.
- **Admin panel** — Next.js, internal, role-gated (Admin / Ops / Support).
- **CRM / vendor & technician management** — part of the admin panel, not a separate app unless technicians need field-mobile access.

Top-level modules, mapped to where each is used:

| Module | Customer app | Admin panel |
| --- | --- | --- |
| Catalogue & purchase | Yes | Manage |
| Service booking (install/repair/AMC) | Yes | View/assign |
| Order & service tracking | Yes | Yes |
| In-app chat | Yes | Inbox |
| Customer account (orders, AMC, service history) | Yes | Customer record |
| Technician/vendor management | — | Yes |
| AMC & reminders | View own | Manage all |
| Reports (sales, service, technician performance) | — | Yes |

## Functional Requirements — Customer Website & Apps

Feature set is identical across web, Android and iOS unless noted.

### Onboarding

- Splash screen with branding; auto-advances to onboarding or home if already onboarded.
- Onboarding carousel (value proposition), skippable, shown once per install.

### Home

- Search bar for products and services.
- Quick actions: Buy Purifier, Book Service, AMC Renewal, Support.
- Popular products carousel with "View All".
- Bottom navigation: Home, Orders, Service, Chat, Profile.

### Catalogue & Product Listing

- Category filter: Domestic / Commercial / All.
- Product card: image, name, key spec line, price, Add to Cart.
- Search, plus sort/filter by price, stage count and brand.

### Product Details

- Image gallery, name, spec line, price, rating and review count.
- Feature chips — stage count, UV protection, warranty.
- Description, quantity stepper, Add to Cart, wishlist/share icons.

### Cart & Checkout

- Cart review, quantity edit, remove item.
- Address selection or entry.
- Payment — online via gateway, plus cash-on-delivery if Aquaphil Water Care allows it.
- Order confirmation screen with order number.

### Service Booking

- Service type tabs: Installation / Repair / AMC.
- Product picker, from purchase history or manual entry.
- Preferred date and time-slot picker.
- Problem description (free text).
- Submit creates a service request with status "Requested".

### Orders & Service Tracking

- **My Orders** — tabs All / Products / Services; list with status badge (Delivered, Completed, In Progress, Shipped) and View Details.
- **Track Service** — step tracker: Requested → Technician Assigned → In Progress → Completed → Feedback, each with a timestamp; assigned technician's name, photo, rating, and call/chat buttons.

### In-App Chat

- Direct chat with support; message bubbles, timestamps, online indicator.
- Customer can share an order or service number in-chat.
- Photo attachment for fault diagnosis — recommended, confirm if in scope.

### Profile / Account

- Name, email, avatar.
- Menu: My Orders, Service History, AMC Plans, Addresses, Payment Methods, Help & Support, About Us, Log Out.
- Push notification preferences.

## Functional Requirements — CRM & Vendor/Technician Management

### Customer CRM

- Central customer record: profile, purchases, service history, AMC status (active/expired/renewal due), contact details, chat history.
- Search and filter by name, phone, order/AMC status, area.

### Technician / Vendor Management

- Technician profile: name, photo, service area(s)/pin codes, availability, skills/brands serviced, rating.
- Onboarding form for new technicians, admin-added (not self-signup, unless a technician app is added later).
- Job assignment: manual (admin picks) and auto-assign (nearest available or lowest current load) — confirm which is needed for MVP.
- Job status pipeline: Requested → Assigned → In Progress → Completed, with technician notes and a time-stamped history.
- Performance tracking: jobs completed, average response/completion time, average customer rating.

### AMC & Reminders

- AMC record per purchase: start date, renewal due date, free-year flag, renewal price.
- Automated reminders for AMC renewal due dates and filter-change intervals — channel (push, SMS, WhatsApp) to be confirmed.

## Functional Requirements — Admin Panel

Role-gated dashboard (Admin / Ops / Support — confirm exact roles needed).

- **Catalogue management** — products, spare parts, pricing, stock, images, categories.
- **Order management** — view/search all orders, payment status, refunds and cancellations.
- **Service request management** — live queue, filter by city/area/status, assign or reassign technician.
- **Technician management** — profiles, availability, performance (see previous section).
- **AMC management** — records, renewals, free-year tracking (see previous section).
- **Chat/support inbox** — view and reply to all customer conversations, assign to a support agent.
- **Reports** — sales by period/product, service volume, technician performance, AMC renewals due/expired; exportable as CSV (confirm if PDF export is also needed).
- **User/role management** — add or remove admin and support staff, set permission levels.

## Functional Requirements — In-App Chat System

- Real-time one-to-one chat between customer and support/technician.
- Message delivery/read state, typing indicator (recommended), online/offline status.
- Every conversation logged against the customer's CRM record.
- Push notification on new message when the app is backgrounded.
- Admin-side unified inbox across all active conversations, assignable to a support agent.
- Photo attachment in chat for fault diagnosis — recommended, confirm scope.

## Technical Architecture & Tech Stack

Requested stack: **Node.js** (backend) + **Next.js** (web). This section proposes how mobile fits that stack.

### Backend

- Node.js — NestJS recommended over plain Express for a CRM/admin-heavy system: built-in modular structure, dependency injection, and guards for role-based access.
- REST API — a better fit than GraphQL for this scope's CRUD + workflow patterns.
- PostgreSQL as the primary database — orders, service jobs, technicians and AMC records suit a relational schema. Redis for caching, sessions and job queues.
- Real-time layer — Socket.IO (or a managed service) for chat and live order/service-status updates.
- Background jobs — a queue such as BullMQ on Redis, for AMC/reminder scheduling and notification dispatch.

### Web (Customer Site + Admin Panel)

- Next.js (App Router); React Server Components for the public catalogue (SEO-friendly), client-rendered admin panel behind auth.
- Shared design system/component library between customer site and admin panel where practical.

### Mobile (Android + iOS)

Two viable approaches — needs an Aquaphil Water Care decision:

| Approach | Pros | Cons |
| --- | --- | --- |
| **React Native** | One JS/TS codebase for both platforms; reuses logic/types from the Node.js backend; faster to build and maintain; keeps the whole stack in one language | Slightly heavier than fully native for very complex animations — not a concern for this app's screens |
| **Native (Kotlin + Swift)** | Best possible platform performance/feel | Two separate codebases — roughly double the mobile build and maintenance effort, no code reuse with the backend |

Given the Node.js/Next.js stack, **React Native is recommended**: it keeps web, admin and mobile in one language and lets the mobile team share types/validation with the backend.

### Infrastructure

- Cloud hosting — AWS is common in India at this scale (EC2/ECS, or a PaaS like Render/Railway for faster initial deployment); confirm Aquaphil Water Care's preference.
- Object storage — S3-compatible, for product images and chat attachments.
- CI/CD — GitHub Actions building web, admin panel and both mobile app builds.
- Environments — dev, staging, production.

## Core Data Model

Primary entities (fields indicative, not exhaustive):

| Entity | Key fields |
| --- | --- |
| User | id, name, phone, email, role (customer/technician/admin/support), addresses\[\] |
| Product | id, name, category (purifier/spare/accessory), specs, price, stock, images\[\] |
| Order | id, userId, items\[\], total, paymentStatus, paymentMethod, deliveryAddress, status |
| ServiceRequest | id, userId, type (installation/repair/AMC), productId, preferredDate/time, description, status, technicianId, timeline\[\] (status + timestamp + note) |
| Technician | id, name, phone, serviceAreas\[\], skills/brands\[\], availability, rating, jobsCompletedCount |
| AMC | id, userId, productId, startDate, renewalDueDate, isFreeYear, price, status |
| ChatConversation | id, customerId, assignedAgentId, status (open/closed) |
| ChatMessage | id, conversationId, senderId, body, attachmentUrl, sentAt, readAt |
| Payment | id, orderId or amcId, gateway, amount, status, transactionId |

Relationships: one customer has many Orders, ServiceRequests and AMCs; one ServiceRequest is assigned to one Technician; one Technician handles many ServiceRequests; one Order or AMC has one or more Payments (for partial payments or retries).

## Third-Party Integrations

| Need | Suggested integration | Notes |
| --- | --- | --- |
| Payments | Razorpay or Cashfree | UPI, cards, netbanking support; gateway fees typically borne by the merchant |
| Push notifications | Firebase Cloud Messaging | Order/service status updates, chat, AMC reminders — works across Android, iOS and web |
| SMS / WhatsApp | MSG91, Gupshup or the Meta WhatsApp Cloud API | Booking confirmations, technician-assigned alerts, AMC reminders — confirm if WhatsApp is required, since RO-service businesses lean on it heavily |
| Maps / area matching | Google Maps Platform (Geocoding + Distance Matrix) | For technician auto-assignment by area/distance, if that's in scope |
| Image storage/CDN | AWS S3 + CloudFront, or Cloudinary | Product images, chat attachments |
| Analytics | Google Analytics/Firebase Analytics + Mixpanel or PostHog | Funnel tracking against the goals above |
| Crash reporting | Sentry or Firebase Crashlytics | Mobile + web error monitoring |
| App store deployment | Google Play Console, Apple Developer Program | Store fees typically billed separately at actual cost |

## Non-Functional Requirements

- **Performance** — catalogue pages under 2s time-to-interactive on 4G; API p95 response under 400ms for reads.
- **Availability** — 99.5% uptime target for backend/API.
- **Scalability** — architecture handles at least 10,000 registered customers and 500 concurrent sessions without redesign; adjust once Aquaphil Water Care shares real projected volume.
- **Security** — HTTPS everywhere; passwords hashed (bcrypt/argon2) or phone-OTP login; role-based access control on the admin panel; payment details never touch Aquaphil Water Care's own servers, handled entirely by the gateway.
- **Data privacy** — customer PII (phone, address) access restricted by role; comply with India's DPDP Act 2023 requirements for consent and data handling.
- **Accessibility** — mobile apps and web meet basic WCAG 2.1 AA color-contrast and tap-target guidelines.
- **Localization** — English + Hindi UI text recommended, given the Hinglish customer base typical of this business; confirm if needed for MVP.
- **Backups** — daily automated database backups, 30-day retention minimum.

## Key Screens Needed

No mockups were supplied for Aquaphil Water Care, so this list is proposed for design based on the modules above — the same core set used for the OSMO RO platform:

| # | Screen | Primary module |
| --- | --- | --- |
| 1 | Splash Screen | Onboarding |
| 2 | Onboarding Screen | Onboarding |
| 3 | Home Screen | Home / Catalogue |
| 4 | Product Listing Screen | Catalogue |
| 5 | Product Details Screen | Catalogue |
| 6 | Cart & Checkout Screen | Catalogue |
| 7 | Service Booking Screen | Service booking |
| 8 | My Orders Screen | Orders & tracking |
| 9 | Track Service Screen | Orders & tracking |
| 10 | Chat Screen | Chat |
| 11 | Profile Screen | Account |
| 12 | Login/Signup/OTP Screen | Account |

Useful next step: get branded UI mockups made for these screens before development starts, the way OSMO RO's platform had them, to lock the design early.

## Release Phases & Roadmap

| Phase | Deliverable | Depends on |
| --- | --- | --- |
| Phase 1 | Backend API + Next.js customer website + Admin Panel + CRM/technician management | — |
| Phase 2 | Android app (React Native, shares Phase 1 backend) | Phase 1 API stable |
| Phase 3 | iOS app (same React Native codebase as Android) | Phase 2 codebase |
| Phase 4 (post-launch) | AMC/filter-change reminder automation, reporting dashboard refinements, analytics integration | Phases 1–3 live |

This lets Aquaphil Water Care launch and start taking orders on web + CRM before the mobile apps are ready, and reuse the same React Native codebase for both mobile platforms.

## Assumptions, Constraints & Out of Scope

**Assumptions:**

- Aquaphil Water Care's business model matches OSMO RO's — RO purifier sales, installation, repair and AMC — since no separate brief was supplied; confirm if anything differs (product range, service area, existing systems in use).
- Mobile apps are built with React Native, layered onto the requested Node.js/Next.js stack. Confirm if fully native apps are actually required.
- Payment gateway, SMS/WhatsApp and maps integrations are third-party services Aquaphil Water Care signs up for directly (accounts, KYC, fees) — this platform integrates with them, it doesn't replace them.
- Technicians are managed as CRM records by the admin team and do not get their own login/app in the MVP — open question below.

**Constraints:**

- Store publishing fees (Google Play, Apple Developer) are typically billed separately at actual cost.
- Timeline depends on Aquaphil Water Care providing product data, branding assets and feedback within agreed windows.

**Out of scope:**

- Multi-vendor marketplace — this is a single-business platform, not a marketplace of competing sellers.
- A technician-facing native app, unless added later.
- International payments or shipping.

## Risks & Open Questions

**Open questions for Aquaphil Water Care to confirm:**

1. Is the business model (RO purifier sales, install, repair, AMC) accurate, or does it differ from the OSMO RO scope this PRD is based on?
2. Do technicians need their own mobile login to update job status from the field, or does admin staff update status on their behalf?
3. Is cash-on-delivery/at-service needed alongside online payment?
4. Which notification channels are required — push only, or also SMS/WhatsApp?
5. Should technician assignment auto-assign by area/availability, or stay fully manual for MVP?
6. Are there existing UI mockups or brand guidelines to design against, or should these be created from scratch?

**Risks:**

| Risk | Mitigation |
| --- | --- |
| Scope drawn from an assumed business model rather than a confirmed brief | Confirm actual feature list and any existing systems before development starts |
| App store review delays, especially Apple's | Submit early builds for review well before the target launch date |
| Technician adoption of a digital job-status workflow, if they're used to phone-based coordination | Keep technician-facing status updates simple — a single-tap status change — or admin-mediated at MVP |
| Payment gateway settlement/dispute handling | Choose a gateway with strong India merchant support (Razorpay/Cashfree) and clear settlement SLAs |
