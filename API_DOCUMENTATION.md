# Propex Properties API Documentation

All API endpoints reside under `/api` and return standard JSON responses. Endpoints are rate-limited via Edge Middleware.

## Authentication Routes

### `POST /api/auth/register`
Creates a new user and provisions an `httpOnly` JWT session cookie.
- **Body**: `{ "name": "John", "email": "j@example.com", "password": "password123" }`
- **Response**: `201 Created`

### `POST /api/auth/login`
Authenticates a user and provisions an `httpOnly` JWT session cookie.
- **Body**: `{ "email": "j@example.com", "password": "password123" }`
- **Response**: `200 OK`

### `POST /api/auth/logout`
Destroys the active JWT session cookie.
- **Response**: `200 OK`

### `GET /api/auth/me`
Retrieves the active user context along with their associated site visits, callbacks, and saved properties.
- **Headers**: Automatically relies on the `auth-token` cookie.
- **Response**: `200 OK` | `401 Unauthorized`

---

## User Modules

### `POST /api/user/saved-properties`
Adds a property to the user's wishlist.
- **Body**: `{ "propertyId": 1 }`
- **Response**: `201 Created`

### `DELETE /api/user/saved-properties`
Removes a property from the user's wishlist.
- **Query Params**: `?propertyId=1`
- **Response**: `200 OK`

---

## Inquiry Routes

### `POST /api/bookings/site-visit`
Submits a site visit request. If the user is authenticated, it attaches their `userId` in the database.
- **Body**: Matches `siteVisitSchema` validation format.
- **Response**: `201 Created`

### `POST /api/bookings/callback`
Submits a callback request. If the user is authenticated, it attaches their `userId` in the database.
- **Body**: Matches `callbackSchema` validation format.
- **Response**: `201 Created`

---

## Admin Routes (Protected)

All admin routes require a valid JWT with the `isAdmin` boolean set to `true` in the database.

### `POST /api/admin/properties`
Creates a new property listing.
- **Headers**: Relies on `auth-token` cookie for admin verification.
- **Body**: Requires standard property payload (title, description, price, Cloudinary image URLs, etc.)
- **Response**: `201 Created` | `401 Unauthorized`
