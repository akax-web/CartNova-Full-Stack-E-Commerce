# CartNova Backend — Phase 3 Deliverable

Spring Boot 3.x REST API converted from your console JDBC application. Business logic (cart math,
checkout transaction, invoice/GST calculation) is preserved from your original DAOs — only the
plumbing changed (JdbcTemplate instead of raw `Connection`, REST controllers instead of `Scanner`
menus, JWT instead of an in-memory logged-in session).

## What I could and couldn't verify in this sandbox

I don't have network access to Maven Central or a live MySQL instance from this environment, so
I could not run `mvn compile` / `mvn spring-boot:run` here, and Phase 4 ("test every endpoint")
has to happen on your machine. What I *did* do:

- Read every one of your original 20 source files in full.
- Manually cross-checked every DAO interface against its implementation (method signatures match
  exactly — verified via grep, not just by eye).
- Verified every internal `import com.shopping.*` statement resolves to a file that actually
  exists in this project (30 imports checked, zero missing).
- Traced the JWT principal type through the filter → SecurityContext →
  `@AuthenticationPrincipal` chain to confirm it's consistent.

What I couldn't verify: whether it actually compiles against the real Spring Boot dependency
jars, and whether it behaves correctly against your real database. Please run it and paste me
any error — I'll fix it immediately rather than guessing.

## Setup

1. **Java 21** and **Maven** installed locally.
2. Your existing `shopping_db` MySQL database, still running, unchanged.
3. Set environment variables (or just let the defaults in `application.properties` pick up your
   original `root` / `Akash` credentials for local dev — but override `DB_PASSWORD` rather than
   relying on that default beyond your own machine):

   ```bash
   export DB_URL="jdbc:mysql://localhost:3306/shopping_db"
   export DB_USERNAME="root"
   export DB_PASSWORD="Akash"
   export JWT_SECRET="pick-a-long-random-string-here"
   ```

4. Run it:

   ```bash
   cd cartnova
   mvn spring-boot:run
   ```

5. On startup, `PasswordMigrationRunner` will automatically:
   - Insert the `test@gmail.com` / `77777` demo account if it doesn't already exist.
   - BCrypt-hash any plaintext password still sitting in `USERS.PASSWORD` (including that demo
     account). This runs every startup but only touches rows that aren't already hashed, so it's
     safe to leave permanently.

## API Documentation

Base URL: `http://localhost:8080`

All responses share this envelope:
```json
{ "success": true, "message": "...", "data": { ... }, "timestamp": "2026-08-10T10:00:00Z" }
```

---

### POST /api/auth/register
Public.

Request:
```json
{ "name": "Akash", "email": "new.user@gmail.com", "password": "mypassword" }
```
Success (201):
```json
{ "success": true, "message": "Registration successful. Please log in.", "data": null, "timestamp": "..." }
```
Errors: `400` (validation), `409` (email already registered — the fixed duplicate-email check).

---

### POST /api/auth/login
Public.

Request:
```json
{ "email": "test@gmail.com", "password": "77777" }
```
Success (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": 1, "name": "Akash", "email": "test@gmail.com",
    "role": "Customer", "token": "eyJhbGciOi..."
  },
  "timestamp": "..."
}
```
Errors: `401` invalid credentials.

Save the `token` — every endpoint below requires header `Authorization: Bearer <token>`.

---

### GET /api/products
Public. Returns all products. No auth required.

### GET /api/products/{id}
Public. `404` if not found.

---

### POST /api/admin/products — ADMIN only
Request:
```json
{ "productName": "Wireless Mouse", "price": 599.00, "quantity": 50, "category": 1 }
```
`403` if the token's role isn't Admin. `400` if price isn't positive or quantity is negative.

### GET /api/admin/products, GET /api/admin/products/{id}, PUT /api/admin/products/{id}, DELETE /api/admin/products/{id}
Same auth rule, same request shape as POST for the PUT body.

---

### GET /api/cart — CUSTOMER (any authenticated user)
Returns the caller's own cart — userId comes from the token, never from the URL.

### POST /api/cart
```json
{ "productId": 3, "quantity": 2 }
```
`404` if the product doesn't exist.

### PUT /api/cart/{cartItemId}
```json
{ "quantity": 5 }
```
`403` if that cart item doesn't belong to you.

### DELETE /api/cart/{cartItemId}
`403` if that cart item doesn't belong to you.

---

### POST /api/orders/checkout
```json
{ "paymentMethod": "UPI" }
```
Success (201): `{ "data": { "orderId": 42 } }`. `409` if the cart is empty or stock is
insufficient (same all-or-nothing transaction your original checkout had).

### GET /api/orders
The caller's own order history.

### GET /api/orders/{orderId}/items
`403` if that order isn't yours (not just "not found" — genuinely blocked).

### GET /api/orders/{orderId}/invoice
Same ownership rule. Returns line items; GST/grand total math is identical to your original
console output (18% GST) — compute it client-side from the returned `price * quantity` per line,
same as the console version did.

---

## curl smoke test (run in order)

```bash
# 1. Register a brand-new user
curl -s -X POST localhost:8080/api/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Test Two","email":"user2@example.com","password":"pass1234"}'

# 2. Log in as the new user
curl -s -X POST localhost:8080/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"user2@example.com","password":"pass1234"}'
# -> copy the "token" value from the response into $TOKEN below

TOKEN="paste-token-here"

# 3. Browse products (public)
curl -s localhost:8080/api/products

# 4. Add product id 1 to cart, qty 2
curl -s -X POST localhost:8080/api/cart -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"productId":1,"quantity":2}'

# 5. View cart
curl -s localhost:8080/api/cart -H "Authorization: Bearer $TOKEN"

# 6. Checkout
curl -s -X POST localhost:8080/api/orders/checkout -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"paymentMethod":"CASH"}'

# 7. View my orders
curl -s localhost:8080/api/orders -H "Authorization: Bearer $TOKEN"

# 8. Log in as the demo account and confirm it's independent
curl -s -X POST localhost:8080/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"77777"}'
```

Please run this against your real database and send me whatever breaks (paste the exact error) —
I'll fix it directly rather than guessing at what your live schema looks like.

## Frontend

Per your instructions, the React frontend is **not** built yet. Once you confirm the backend is
working end-to-end against your real database, tell me and I'll start the Vite/React app wired to
these exact endpoints — no mock data, matching the pages you listed (Home, Login, Register,
Products, Product Details, Cart, Checkout, Orders, Order Details, Invoice, plus the Admin pages).
