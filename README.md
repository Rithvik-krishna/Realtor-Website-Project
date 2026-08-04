# Canadian Realtor Website Backend

Production-ready, modular, and scalable Node.js + Express + TypeScript backend built according to the **Backend Technical Design Document (BTDD Version 1.0)**.

## Architecture

This application follows a strict layered separation of concerns:
```
Routes -> Validation -> Controllers -> Services -> Repositories -> Prisma ORM -> Database
```

- **Controllers**: Handle HTTP requests, responses, status codes. No business logic, no direct DB calls.
- **Services**: Execute business logic, validation rules, notifications, calculations.
- **Repositories**: Encapsulate all database operations via Prisma ORM.
- **Routes**: Standardized Express versioned endpoints (`/api/v1/*`).

## Key Feature Modules

1. **Authentication & User Management**: RBAC roles (`GUEST`, `BUYER`, `SELLER`, `AGENT`, `ADMIN`, `SUPER_ADMIN`), JWT access & refresh tokens.
2. **Properties & Media**: MLS listings, 360 virtual tours, WalkScore, TransitScore, property features, side-by-side comparison.
3. **Search Engine**: Multi-criteria filter search, lifestyle-based search (Family Friendly, Downtown Living, Waterfront, Near Transit, etc.), full-text search, geolocation.
4. **AI Real Estate Engine**:
   - **Natural Language Search Parser**: Converts queries like *"Show me a modern detached house under $900,000 near a good school"* into structured filters.
   - **AI Real Estate Assistant**: Real estate advice, closing costs calculation, affordability checks, neighborhood recommendations.
5. **Seller Experience ("What's My Home Worth?")**: Home valuation engine, automated comparable listings, lead capture.
6. **Buyer Dashboard**: Saved properties, saved searches, price drop notifications, new listing alerts.
7. **Appointments & Bookings**: Tour/viewing scheduling, agent assignment, status updates.
8. **Admin Dashboard**: Listing management, user moderation, MLS sync log monitoring, analytics.
9. **MLS / TRREB Integration**: Dedicated sync and normalization layer.

## Setup & Running

### Prerequisites
- Node.js (v18+)
- PostgreSQL database

### Installation
```bash
npm install
cp .env.example .env
# Update .env with your PostgreSQL credentials
npx prisma db push
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```
