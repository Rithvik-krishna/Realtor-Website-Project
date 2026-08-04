# API Endpoints Reference Document
## Canadian Realtor Website Backend (BTDD v1.0)

All APIs are versioned under `/api/v1`.

### Standard Response Format
```json
{
  "success": true,
  "message": "Description of outcome",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

---

## 🔑 Authentication (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/signup` | Public | Register a new user (`BUYER`, `SELLER`, `AGENT`). Body: `{ email, password, firstName, lastName, phone, role }` |
| `POST` | `/api/v1/auth/login` | Public | Login user and receive JWT access token + refresh token. Body: `{ email, password }` |

---

## 🏡 Properties (`/api/v1/properties`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/properties` | Public | Filter listings by `city`, `propertyType`, `minPrice`, `maxPrice`, `bedrooms`, `bathrooms`, `isFeatured`, `lifestyleTag`, `page`, `limit`. |
| `GET` | `/api/v1/properties/compare` | Public | Compare properties side-by-side. Query param: `?ids=uuid1,uuid2`. |
| `GET` | `/api/v1/properties/:identifier` | Public | Get property details by UUID or URL slug (includes 360 tour, floor plan, images, WalkScore). |
| `POST` | `/api/v1/properties` | Agent/Admin | Create a new property listing with media and features. |

---

## 🔍 Search & Communities (`/api/v1/search`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/search` | Public | Full-text search across titles, descriptions, addresses, cities, and lifestyle tags. Query param: `?q=query`. |
| `GET` | `/api/v1/search/communities` | Public | Fetch community/neighborhood landing page stats (Brampton, Downtown Toronto, Mississauga). |

---

## 🤖 AI Real Estate Engine (`/api/v1/ai`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/ai/search-parse` | Public | Converts natural language prompt (e.g. *"Show me a modern detached house under $900,000 near a good school"*) into structured DB filters and returns matching listings. |
| `POST` | `/api/v1/ai/assistant` | Public / Auth | AI Real Estate Advisor Q&A (closing costs, affordability rules, mortgage pre-approval). |

---

## 🏷️ Seller Experience ("What's My Home Worth?") (`/api/v1/seller`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/seller/valuation` | Public | Home valuation calculator returning estimated market value range, comparable properties, and market demand score. |
| `GET` | `/api/v1/seller/valuations` | Agent/Admin | Fetch all home valuation lead capture submissions. |

---

## ❤️ Buyer Dashboard (`/api/v1/buyer`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/buyer/saved-properties` | Authenticated | Fetch user's favorited properties. |
| `POST` | `/api/v1/buyer/saved-properties` | Authenticated | Save property to favorites. Body: `{ propertyId }` |
| `DELETE` | `/api/v1/buyer/saved-properties/:propertyId` | Authenticated | Remove property from favorites. |
| `GET` | `/api/v1/buyer/saved-searches` | Authenticated | Get buyer's saved search queries. |
| `POST` | `/api/v1/buyer/saved-searches` | Authenticated | Save search filter criteria. Body: `{ title, filters }` |

---

## 📅 Appointments & Viewing Bookings (`/api/v1/appointments`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/appointments/book` | Authenticated | Schedule property viewing appointment. Body: `{ propertyId, appointmentDate, notes }` |
| `GET` | `/api/v1/appointments/my-appointments` | Authenticated | Get user or agent appointment history. |
| `PATCH` | `/api/v1/appointments/:id/status` | Authenticated | Update appointment status (`CONFIRMED`, `CANCELLED`, `COMPLETED`, `RESCHEDULED`). |

---

## 📈 Live Market Analytics (`/api/v1/analytics`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/analytics/market` | Public | Fetch real-time market statistics (average selling price, days on market, market appreciation rate). Query: `?region=GTA`. |

---

## ⚙️ Admin Dashboard (`/api/v1/admin`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/stats` | Admin/SuperAdmin | System overview (total users, properties, appointments, home valuation leads). |
| `GET` | `/api/v1/admin/users` | Admin/SuperAdmin | User list and assigned RBAC roles. |
| `GET` | `/api/v1/admin/sync-logs` | Admin/SuperAdmin | TRREB / MLS background sync audit logs. |

---

## 🔄 MLS / TRREB Integration (`/api/v1/integrations/trreb`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/integrations/trreb/sync` | Admin/SuperAdmin | Trigger manual synchronization and normalization of TRREB MLS listings into PostgreSQL. |
