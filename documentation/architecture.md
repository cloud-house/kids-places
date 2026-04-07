# System Architecture - Kids Places

This document outlines the architecture of the "Kids Places" service, built on a modern JavaScript/TypeScript technology stack.

## 🚀 Tech Stack

*   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
*   **CMS & Backend**: [Payload CMS 3.0](https://payloadcms.com/) (Headless CMS integrated with Next.js)
*   **Database**: [PostgreSQL](https://www.postgresql.org/) (managed via `@payloadcms/db-postgres`)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS (v4) + Framer Motion (animations)
*   **Authentication**: Built-in Payload CMS authentication system
*   **External Integrations**:
    *   **Stripe**: Payment processing
    *   **Resend**: Email delivery
    *   **S3 (AWS/Supabase)**: Multimedia file storage (Media)

## 📂 Project Structure (`src/`)

The project is divided into logical modules, combining Next.js functionality with Payload CMS configuration:

*   **`actions/`**: Next.js Server Actions for server-side logic handling.
*   **`app/`**: Main Next.js directory (App Router), containing routes, layouts, and views.
*   **`collections/`**: Payload CMS collection definitions, organized by theme:
    *   `Content/`: Places, Events, Pages.
    *   `Membership/`: Users, PricingPlans.
    *   `Taxonomy/`: Categories, Cities, Attributes.
    *   `Interactions/`: Inquiries, Reviews, Newsletter Subscriptions.
*   **`components/`**: Shared UI components (often inspired by shadcn/ui).
*   **`features/`**: Business logic divided by domains (e.g., `places`, `auth`, `checkout`). Each folder contains dedicated components and hooks.
*   **`lib/`**: Configuration, helper utilities (utils), and type definitions.
*   **`scripts/`**: Helper scripts (e.g., database seeding).

## 🧭 Navigation and UX

The application follows a simplified search and navigation strategy:

1.  **Simplified Navigation**: Clean, flat link structure in the header (`Places`, `Events`, `Blog`).
2.  **Smart Search**: Quick contextual search based on city and keywords.
3.  **Geotagging**: All listing cards feature clear geographic tags (e.g., `[Warsaw]`), facilitating easy visual content scanning.
4.  **Contextual Widgets**: Cross-integration of content - e.g., "What's happening here?" section on Place pages (fetching related events).

## 🏗️ Data Architecture

The system is based on a relational data structure managed by Payload CMS. Below is a detailed description of collection groups and their relationships.

### Collection Groups

#### 1. Content
Main entities presenting the service's offerings:
*   **Places**: Key collection containing location data (name, descriptions, address, coordinates, logos, gallery). Supports versioning (drafts) and geolocation.
*   **Events**: Information about specific time-bound activities. Supports ticketing and **recurrence** (daily, weekly, or monthly repetition). Can be linked to a specific Place or Organizer.
*   **Organizers**: Entities/Brands managing a group of places or events.
*   **Pages**: Static site pages built using blocks.

#### 2. Taxonomy
Categorization and filtering structures:
*   **Categories**: Main content division. Categories support scopes (`place`, `event`), allowing for dynamic filtering.
*   **Cities**: List of supported cities.
*   **Attributes and Attribute Groups**: Detailed place features (e.g., "changing table", "parking", "kids menu"), used for advanced filtering.
*   **PostCategories**: Classification of blog content.

#### 3. Membership
Access management and monetization:
*   **Users**: Account data, roles (admin, user), and assigned places (ownership).
*   **PricingPlans**: Definitions of limits and features available under subscriptions (e.g., number of places, gallery access).

#### 4. Interactions
User-generated data:
*   **Reviews**: Opinions and ratings of places.
*   **Inquiries**: Messages sent to place owners.
*   **ClaimRequests**: Process for verifying place ownership.
*   **Newsletter (NewsletterSubscriptions)**: Email subscription management.

## 🔄 Data Flow

1.  **Frontend (Next.js)** fetches data directly from the **Database** using Payload Local API (the fastest method within Next.js).
2.  **Payload CMS Admin Panel** is used for manual content management.
3.  **Payments (Stripe)**: User selects a plan -> Checkout -> Stripe Webhook updates status in Payload.
4.  **Media**: Files uploaded via CMS go directly to S3 storage.

## 🛠️ Development and Testing

*   **E2E Tests**: Playwright (located in `tests/` directory).
*   **Type Generation**: `npm run generate:types` (automatic synchronization of TS types with Payload collections).
