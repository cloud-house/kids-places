# 🧒 Kids Places - Discover Local Adventures

**Kids Places** is a modern, community-driven platform designed to help parents find the best places and events for children in their local area. Built with **Next.js 15** and **Payload CMS 3.0**, it offers a seamless experience for both parents and business organizers.

---

## 🚀 Key Features

- **📍 Smart Local Search**: Find playrooms, parks, and events based on city and proximity.
- **📅 Recurrent Events**: Support for one-time and recurring child-centric activities (daily, weekly, monthly).
- **🛡️ Business Dashboard**: Dedicated panel for organizers to manage their places and listings.
- **✨ Premium Listings**: Monetization through Stripe-powered subscriptions with enhanced visibility and rich-media galleries.
- **🗺️ Geolocation**: Automated geocoding for all places to provide accurate map views.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15+](https://nextjs.org/) (App Router) |
| **CMS & Backend** | [Payload CMS 3.0](https://payloadcms.com/) (Headless) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) |
| **Payments** | [Stripe](https://stripe.com/) |
| **Mailing** | [Resend](https://resend.com/) |
| **Tests** | [Playwright](https://playwright.dev/) (E2E) + [Vitest](https://vitest.dev/) (unit) |

---

## 📦 Getting Started

### 1. Requirements
Ensure you have **Node.js 20+** and a **PostgreSQL** instance running.

### 2. Installation
```bash
git clone <repository-url>
cd kids-places
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory (refer to `.env.example` if available, or check doc/architecture.md for required keys):
```env
DATABASE_URI=postgres://u:p@localhost:5432/db
PAYLOAD_SECRET=your_secret
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### 4. Development
```bash
# Generate types for Payload CMS
npm run generate:types

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the frontend and [http://localhost:3000/admin](http://localhost:3000/admin) for the CMS panel.

---

## 📂 Documentation

Detailed documentation is available in the `/documentation` folder:
- [🏗️ System Architecture](documentation/architecture.md)
- [📖 Business Rules](documentation/business_rules.md)

---

## 🧪 Testing

We use Playwright for End-to-End testing.
```bash
npm run test       # Run all tests
npm run test:ui    # Run tests with UI
```

---

## ⚖️ License
All rights reserved. Property of Kids Places Team.
