# Business Rules - Kids Places

This document describes the key operating principles of the "Kids Places" portal, account types, permissions, and business processes.

## 🌟 Main Application Assumptions

The "Kids Places" portal is a platform aggregating places and events for children near home.
The primary goal is to provide an easy way to search for interesting activities right here and now (Local).

---

## 🧭 Navigation Strategy

1.  **Simplified Global Navigation**: All key intents (Places, Events, Blog) are always available directly in the site header.
2.  **Smart Search**:
    *   Quick location and keyword search (e.g., "playrooms", "swimming pool").
3.  **UX Contextuality**: Fixed locations (e.g., Playrooms) dynamically pull linked Events ("What's happening here?" section), creating greater value for the Organizer and the Parent.

## 👥 Account Types and Permissions

The system has four main access levels:

### 1. Guest (Not Logged In)
- **What they see**: Can browse all published Places, Events, and the Blog.
- **What they can do**:
    - Use search and filters.
    - Send an inquiry to an organizer (Inquiry).
    - Subscribe to the Newsletter.
    - View reviews (without the ability to add them).

### 2. Parent (Default User)
- **Status**: Logged-in user with the `parent` role.
- **Permissions**:
    - All Guest actions.
    - Adding and editing own Reviews (`pending` status for admin verification).
    - Submitting an ownership claim for an existing place (Claim Request).

### 3. Organizer (Business User)
- **Status**: Logged-in user with the `organizer` role.
- **Permissions**:
    - Management of own Places and Events via a dedicated panel.
    - Replying to reviews under their places.
    - Selection of Pricing Plan (Free/Premium).
    - Access to statistics (depending on the plan).
    - Every user with the `organizer` role automatically receives a related entity in the `Organizers` collection.

### 4. Admin
- **Status**: Full access to the Payload CMS panel.
- **Permissions**:
    - Management of all collections.
    - Verification of ownership claims (Claim Requests).
    - Content moderation (reviews, places, events).
    - Taxonomy management (categories, attributes, cities).

---

## 🏢 Places and Events (Rules)

### Pricing Plans (Places & Events)

| Feature | FREE Plan | PREMIUM Plan |
| :--- | :--- | :--- |
| Short Description | Yes | Yes |
| Long Description (Rich Text) | No | Yes |
| Logo / Main Image | Yes | Yes |
| Photo Gallery | No | Yes |
| Social Links | No | Yes |
| Affiliate Links | No | Yes |
| Search Priority | Low | High |

### Recurring Events
Events can be one-time or recurring:
- **Recurrence**: Daily, weekly, monthly.
- Ability to define specific weekdays and a cycle end date.

---

## 🔄 Main Application Flow

1.  **For the Organizer**: Registration -> Create Organization -> Add Place (Free/Premium) -> Add Events assigned to the place -> Receive inquiries from parents.
2.  **For the Parent**: Search via main menu -> Check details (attributes, "What's happening here?" events) -> Send inquiry.

---

## 🏗️ Data Management (Technical Rules)

- **Ownership Verification (Claiming)**: If a place exists in the database (e.g., from an import), a parent can send a `ClaimRequest`. The admin verifies the request and assigns the `organizer` role and object ownership to the user.
- **Geolocation**: Every place is automatically geocoded (latitude/longitude) based on the address upon saving (`geocodePlace` hook).
- **Deletion**: Deleting a Place causes a cascading deletion of related media (logo/gallery), reviews, and ownership claims.
