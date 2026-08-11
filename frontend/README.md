# CartNova Frontend — Phase 5

React + Vite SPA wired to your existing CartNova Spring Boot backend. No mock data, no separate
backend — every screen calls the real verified API.

## Install & Run

```bash
cd cartnova-frontend
npm install
cp .env.example .env      # only if VITE_API_BASE_URL needs to differ from localhost:8080
npm run dev
```

Opens at `http://localhost:5173` — matches the origin your backend's `CorsConfig` already
allows, so no backend changes are needed for CORS.

**Your backend must be running first** (`mvn spring-boot:run` in the `cartnova` project, per
Phase 3/4) — this frontend has no fallback data of its own.

```bash
npm run build      # production build → dist/
npm run preview    # preview that production build locally
```

## What I verified before handing this over

- `npm install` and `npm run build` both run clean in this environment — zero syntax/import
  errors (114 modules, production bundle builds successfully).
- Every one of the 12 API calls in `src/api/*.js` was cross-checked line-by-line against the
  actual `@GetMapping`/`@PostMapping`/etc. annotations in your Phase 3 controllers.
  **Result: no mismatch.** That's why no backend files were touched — the "stop and tell you"
  condition in your instructions never triggered.
- What I could *not* do here: actually run the frontend against your live backend + MySQL (no
  network path to your machine from this sandbox). The manual walkthrough below is what I'd
  run if I could — please run it yourself and tell me what breaks, if anything.

## Manual QA walkthrough

1. `npm run dev`, open `http://localhost:5173`.
2. **Register** a brand-new account (not `test@gmail.com`) — should redirect to `/login` with a
   success message.
3. **Login** with that new account — should land on the Products page, navbar should now show
   your name + Logout.
4. **View Products** — list should come from your real `PRODUCTS` table (empty state shows if
   you have none yet).
5. Click a product → **Product Details** → Add to Cart.
6. **View Cart** — item should appear with correct price/quantity.
7. **Update Quantity** with the +/− buttons — should persist (refresh the page to confirm it
   wasn't just local state).
8. **Remove** an item, confirm it disappears.
9. Add something back, go to **Checkout**, pick a payment method (CASH/UPI/CARD), place the
   order.
10. Should land on **Order Details** for the new order with a success banner, cart should now
    be empty.
11. **My Orders** — the new order should be listed.
12. Open the order → **Invoice** — the receipt-styled invoice with GST(18%)/Grand Total.
13. **Logout** — should clear storage and land back on Login; try visiting `/cart` directly
    afterward — should redirect to Login instead of showing stale data.
14. Log back in with `test@gmail.com` / `77777` — confirm it works and has its own separate
    cart/orders, independent of the new account.
15. To see the 401/expired-token handling: log in, then manually clear `cartnova_token` from
    localStorage (dev tools → Application), and click any protected page — should bounce to
    Login with a "session expired" message rather than showing a broken screen.

## Project structure

```
src/
├── api/            one file per backend resource, all built on the single axiosClient
├── components/     shared UI (Navbar, ProductCard, CartItemRow, states)
├── context/        AuthContext — the only place JWT/user storage logic lives
├── pages/          one file per route
├── index.css       design tokens + base styles
├── layout.css       navbar/footer
└── components.css  product cards, cart rows, auth forms, the invoice "receipt" styling
```

## A couple of honest notes, not hidden in the code comments

- **Token storage**: the JWT is kept in `localStorage` (see the comment in `AuthContext.jsx`).
  That's the standard approach for a bearer-token API like yours, but it's technically readable
  by any JS running on the page. An httpOnly cookie would be harder to intercept, but that's a
  backend change (the login endpoint would need to *set* a cookie instead of returning the
  token in the JSON body) — out of scope here since you asked me not to touch the backend
  unless required, and it isn't required for this to work correctly.
- **No product images**: `Product` has no image field in your backend model, so instead of
  faking one with a stock-photo URL, each product gets a deterministic abstract color tile
  generated from its real id/name. If you add a real `imageUrl` column down the line, that's a
  one-line swap in `ProductCard.jsx` and `ProductDetailsPage.jsx`.
- **`npm audit`** flags a moderate advisory in `react-router` that's only fixed by a v7 major
  upgrade (breaking route API changes). I left it on the stable v6 line rather than force an
  upgrade I can't retest here — worth revisiting once you're comfortable re-testing routing.
