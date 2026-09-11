# INSPIRE DECOR — Architecture Foundation

Event-business operating system prototype: event décor, draping, catering,
crockery/equipment hire and event setup. A premium customer website plus an
internal admin dashboard running the full pipeline —
**enquiry → lead → quote → booking → inventory reservation → revenue monitoring**.

This is **Task 1 of 4** — the foundation. Customer pages and dashboard modules
are scaffolded as placeholder routes; later tasks build on top of this
structure.

## Folder map

```
src/
  lib/
    types.ts            # ALL domain types (Lead, Quote, Booking, InventoryItem, …)
    demo.ts             # DEMO_DATA_NOTICE + badge (every demo record is isDemo: true)
    util.ts             # cn, uid, delay, date helpers, formatZAR, availableCount
    data/               # mock data ONLY — no business data lives in components
      products.ts       #   12 categories, 31 products (Rand hire prices, derived stock)
      services.ts       #   10 service offerings
      leads.ts          #   demo leads across NEW→…→BOOKED/LOST
      quotes.ts         #   demo quotes (Q-1001 → booking B-1001)
      bookings.ts       #   demo bookings across all 7 statuses
      events.ts         #   demo events (wedding 120, matric farewell 180, …)
      inventory.ts      #   demo stock (Dinner Plates 300, Wine Glasses 240, …)
      enquiries.ts      #   demo enquiries incl. the 120-guest matric farewell (E-1001)
      testimonials.ts   #   demo testimonials
      gallery.ts        #   demo gallery (Unsplash URLs, graceful fallback)
      corporate.ts      #   corporate event types + corporate leads
      notifications.ts  #   demo in-app notifications
    services/           # async API layer — the seam Supabase/Resend replace later
      products.ts       #   getProducts, getProductById, getCategories, getProductsByCategory
      leads.ts          #   createLead, getLeads, getLeadById, updateLeadStatus
      quotes.ts         #   createQuote, getQuotes, convertQuoteToBooking
      bookings.ts       #   createBooking, getBookings, updateBookingStatus
      inventory.ts      #   getInventory, reserveInventory, releaseInventory, updateInventory, getLowStockItems
      events.ts         #   getEvents, getUpcomingEvents
      notifications.ts  #   sendNewLeadNotification, sendQuoteEmail, … (stubs → Resend later)
    store/              # zustand client store + derived selectors
      index.ts          #   store (persisted to localStorage, seeded from mock data)
      selectors.ts      #   revenueThisMonth, pendingQuotes, upcomingEvents, lowStock, …
  components/
    ui/                 # Button, Card, Badge, Input, Select, Textarea, Checkbox,
                        # RadioGroup, StatCard, Table, Modal, EmptyState, LoadingState,
                        # PageHeader, SectionHeading, PriceTag, Tabs, Img
    layout/             # CustomerLayout (nav + footer), DashboardLayout (sidebar shell)
  routes/               # file-based routing (TanStack Router)
    index.tsx           # / home (placeholder)
    services.tsx        # /services
    hire/index.tsx      # /hire
    hire/$category.tsx  # /hire/:category (dynamic)
    gallery.tsx, corporate.tsx, quote.tsx, consultation.tsx, contact.tsx
    dashboard.tsx       # /dashboard layout (sidebar shell)
    dashboard/*.tsx     # overview, leads, quotes, bookings, inventory, events, reports
  styles/app.css        # Tailwind v4 design tokens (ink/gold/champagne, Playfair + Inter)
```

## Rules of the architecture

1. **No business data in components.** Components read via `~/lib/services`
   (async, `Promise`-returning) or the store selectors. Only presentation
   helpers (e.g. `formatZAR`) may be imported directly into components.
2. **All state changes go through a service** — never `setState` the store
   directly from a page. This is what makes Supabase a drop-in later.
3. **Demo data is labelled.** Every seed record has `isDemo: true` and the
   layouts show `DEMO_DATA_NOTICE`. Real records created by the workflow
   (e.g. `createLead`) are `isDemo: false`.
4. **Money is ZAR**, formatted with `Intl.NumberFormat("en-ZA")` via
   `formatZAR` / `PriceTag`. Stock is always derived:
   `available = total - reserved - outOnHire - damaged - missing`.

## How to add a product or category

1. Add an inventory line in `src/lib/data/inventory.ts` (the warehouse truth:
   `total`, `reserved`, `outOnHire`, `damaged`, `missing`, `reorderLevel`).
2. Add the product in `src/lib/data/products.ts` with the **same `name`** —
   `quantityAvailable` is derived from the matching inventory item
   automatically. Add the category in `demoCategories` if it's new.
3. Done — catalogue and stock stay in sync, and the services layer exposes
   them to any page.

## How to swap the data layer for Supabase later

The service functions in `src/lib/services/*` are the contract. To go live:

1. Keep the exported signatures and input types identical.
2. Replace each function body with a Supabase query (or `createServerFn`
   handler that queries Supabase server-side).
3. Pages/components need **zero changes**.
4. The store (`src/lib/store`) keeps persisting UI state (enquiry list,
   notifications); server data stops being duplicated there.

## How to swap notifications to Resend

`src/lib/services/notifications.ts` documents the rule: the four `send*`
functions are stubs that record an in-app notification. When real email
arrives, re-implement them **server-side** (a `createServerFn` handler or an
`/api` route) calling Resend with the recipient address — never call Resend
from the frontend (API key leak). Keep the same signatures.

## Core demo workflow (Task 1 readiness)

- Enquiry **E-1001** — Thandeka Mokoena, **120-guest matric farewell** — is
  seeded `NEW` with **no linked lead**, so the workflow can run live:
  site enquiry → appears as lead → qualify → build quote → convert to booking
  → inventory reserved → dashboard stats update.
- `convertQuoteToBooking()` already does quote→booking, moves the lead to
  `BOOKED`, and reserves matching warehouse stock by product name.

## Commands

- `bun run dev` — dev server on port 3000
- `bun run preview` — preview the production build on port 4173
- `bun run build` — production build
- `bun run publish` / `bun run go-live` — publishing (hosting setup untouched)
- `bunx tsc --noEmit` — full TypeScript check
