# CartNova — Full-Stack E-Commerce Project

One project, two halves that already talk to each other:

```
CartNova-Full-Stack/
├── backend/          Spring Boot 3 REST API (Java 21, MySQL, JWT, BCrypt)
├── frontend/          React 18 + Vite SPA (customer + admin UI)
├── run-project.bat     Windows launcher for both servers
└── README.md            you are here
```

No mock APIs anywhere — every screen in `frontend/` calls the real endpoints in `backend/`.
`backend/sql/` has the database notes (see the Database section below).

---

## 1. Requirements

- Java 21 + Maven
- Node.js 18+ and npm
- MySQL Server, already running, with your existing `shopping_db` database

---

## 2. Database Setup

You already have a working `shopping_db` with `USERS`, `PRODUCTS`, `CART`, `CART_ITEMS`,
`ORDERS`, `ORDERS_ITEMS`, `PAYMENTS` tables from your original console app — **nothing about
that schema changes.** No new tables, no renamed columns.

1. Start MySQL and confirm `shopping_db` exists:
   ```sql
   SHOW DATABASES;
   USE shopping_db;
   SHOW TABLES;
   ```
2. That's it for schema. Two small *data* actions happen automatically the first time the
   backend starts (see `backend/sql/00_notes_and_test_account.sql` for exactly what they do and
   why they can't be plain `.sql` you run by hand):
   - Inserts the `test@gmail.com` / `77777` demo account if it isn't already there.
   - BCrypt-hashes any password still stored as plaintext (including that demo account).

   You don't need to run anything manually for this — it happens on backend startup.

3. **Creating an Admin account**: registration always creates a `Customer` role account (by
   design — there's no public "sign up as admin" flow, same as your original console app never
   had one). To make a user an admin, register them normally through the app first, then run:
   ```sql
   UPDATE USERS SET ROLE = 'Admin' WHERE EMAIL = 'youradmin@example.com';
   ```
   Log out and back in afterward so the JWT picks up the new role.

---

## 3. Configure the Backend

Edit `backend/src/main/resources/application.properties` directly (simplest for a local demo),
or set environment variables before running — see `backend/.env.example` for the exact variable
names and both options explained. At minimum, set your real `DB_PASSWORD`.

## 4. Configure the Frontend

```bash
cd frontend
copy .env.example .env
```
Default `VITE_API_BASE_URL=http://localhost:8080` already matches the backend's default port and
its CORS config (`backend/src/main/java/com/shopping/config/CorsConfig.java` already allows
`http://localhost:5173`) — no changes needed unless you're running the backend somewhere else.

---

## 5. Running It — Windows, step by step

**Option A — one command, two windows:**
```
run-project.bat
```
This opens a backend window and a frontend window automatically. First run the frontend
`npm install` yourself once beforehand (see below) — the script doesn't do a first-time install.

**Option B — manual, two terminals (also works on macOS/Linux):**

Terminal 1:
```bash
cd backend
mvn spring-boot:run
```
Wait for `Started CartNovaApplication` in the log.

Terminal 2:
```bash
cd frontend
npm install
npm run dev
```

Then open your browser to:
```
http://localhost:5173
```

---

## 6. What I verified before packaging this

- Every frontend API call (17 total, across customer and admin flows) was cross-checked line-by-
  line against the actual `@GetMapping`/`@PostMapping`/etc. annotations in the backend
  controllers. **No mismatch found — no backend code was changed for this integration.**
- `cd frontend && npm install && npm run build` runs clean in this environment: 119 modules,
  zero errors, production bundle builds successfully.
- Backend Java files were manually cross-checked interface-to-implementation and import-by-
  import (no compiler available in this sandbox to run `mvn compile` — see backend/README.md
  for the full detail on that limitation).

**What I could not do:** actually run either server against your live MySQL instance — no
network path from this sandbox to your machine. Sections 7 and 8 below are what to run once you
have it up, and where to send me the exact error if something doesn't behave as documented.

---

## 7. Customer Flow to Test

Register → Login → Products → Product Details → Add to Cart → View Cart → Update Quantity →
Remove Item → Checkout (CASH/UPI/CARD) → Order confirmation → My Orders → Order Details →
Invoice → Logout.

## 8. Admin Flow to Test

Make a user Admin (Section 2, step 3) → Login with that account → you're redirected straight to
`/admin` (Admin Dashboard) instead of the customer product page → View Products → Search by ID →
Add Product → Edit Product → Delete Product → Logout.

A customer-role account is blocked from `/admin/*` on both sides: the frontend redirects them
away before the page even renders, and the backend independently returns `403 Forbidden` if
`/api/admin/**` is called without an Admin-role JWT — same rule enforced twice, not just a UI
hide.

---

## 9. Project READMEs

- `backend/README.md` — full API documentation, curl examples, Phase 3 verification notes.
- `frontend/README.md` — component structure, design notes, manual QA walkthrough, the honest
  caveats on JWT storage and the one `npm audit` advisory left unresolved (react-router v7 would
  require breaking route API changes I couldn't retest here).

If anything in this combined package behaves differently from what's documented, tell me the
exact command you ran and the exact error — I'll fix it directly.
