
# Backend Development Handoff - Project Katalogo (v2.1)

**Role:** Senior Backend Engineer
**Stack:** Node.js (NestJS recommended), PostgreSQL (Supabase), Stripe, WhatsApp Business API.

## Project Context
Katalogo is a SaaS platform that allows users (Tenants) to create instant WhatsApp-based online stores.
We are moving from a "Frontend-only" prototype to a robust production architecture.

## 1. Database Schema (PostgreSQL)
The database is hosted on Supabase.
**Please refer to `backend/schema.sql` for the authoritative table structure.**
Key tables:
*   `tenants`: Stores configuration, plan, and payment settings.
*   `orders`: JSON-heavy table storing cart snapshots and status timeline.
*   `products`: Standard catalog.
*   `support_tickets`: Internal help desk.

## 2. API Requirements (Node.js)

You need to build a REST API to handle the following business logic layers:

### A. Subscription & Billing (Critical)
*   **Provider:** Stripe.
*   **Flow:**
    1.  Frontend calls `POST /api/billing/checkout-session` with `{ plan: 'pro' }`.
    2.  Backend creates Stripe Session and returns URL.
    3.  Stripe Webhook hits `POST /api/webhooks/stripe`.
    4.  Backend updates `tenants` table:
        *   `plan` = 'pro'
        *   `subscription_status` = 'active'
        *   `next_billing_date` = timestamp

### B. Order Notifications (WhatsApp API)
*   **Provider:** Meta Cloud API (WhatsApp Business).
*   **Trigger:** When a new row is inserted into `orders` (via Supabase Webhook or direct API call).
*   **Action:**
    1.  Send template message to **Tenant**: *"New Order #1234 - R$ 150,00"*.
    2.  Send template message to **Customer**: *"Order Received! Track here: [Link]"*.

### C. Super Admin Aggregation
*   **Endpoint:** `GET /api/admin/stats`
    *   Aggregate MRR (Monthly Recurring Revenue).
    *   Calculate Churn Rate (Tenants who moved from 'active' to 'canceled').
    *   List 'High Risk' tenants (failed payments).

### D. Custom Domain Verification
*   **Endpoint:** `POST /api/domains/verify`
    *   Input: `{ domain: 'loja.com.br' }`
    *   Logic: DNS Lookup for CNAME record pointing to `app.katalogo.com`.
    *   Action: If valid, update `tenants.custom_domain`.

## 3. Security & Multi-tenancy
*   **Strict Rule:** Every API request must carry a Bearer Token (Supabase JWT).
*   **Middleware:** Verify that `req.user.id` matches the `owner_id` of the resource being accessed.
*   **Validation:** Use `Zod` for all request bodies.

## 4. Deliverables
1.  Source code repository (GitHub).
2.  `.env.example` file.
3.  Docker Compose file for local development.
4.  Swagger/OpenAPI documentation.
