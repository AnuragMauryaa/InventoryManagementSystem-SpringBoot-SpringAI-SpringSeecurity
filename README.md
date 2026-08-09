# IMS Frontend — Inventory Management System

A **frontend** for the Inventory Management System, built with **React + Vite**.
It ships with realistic demo data held in an in-memory store, so every screen is
fully interactive — you can sign in, create records, adjust stock, and watch the
dashboard update — without any backend.

> Responsive: works on laptop and mobile (the sidebar collapses behind a ☰ menu on small screens).

---

## Run it

```bash
cd /Users/petwalay/Projects/IMS-Frontend
npm install
npm run dev      # opens http://localhost:5173
```

Build for production:
```bash
npm run build    # → dist/
npm run preview  # serve the built app
```

> Requires Node.js 18+.

---

## Sign in

The app opens on a **login screen** with three demo roles. The password for every
account is `demo` (click a role button to prefill the form):

| Username  | Role    | Can do                                            |
|-----------|---------|---------------------------------------------------|
| `admin`   | Admin   | View everything + create / edit / adjust stock    |
| `manager` | Manager | View + create / edit / adjust stock               |
| `staff`   | Staff   | View only (create / adjust buttons are hidden)    |

The session is kept in `localStorage`, so a refresh stays signed in. Use **Sign out**
in the sidebar to return to the login screen.

---

## What you can do

- **Dashboard** with summary stat cards and **charts** (purchases-vs-sales line,
  monthly-purchases bar, and a stock-value-by-category donut) plus low-stock and
  recent-movement tables.
- **Create records** through real forms — Products, Warehouses, Suppliers, Customers,
  Purchase Orders, and Sales Orders. New rows appear immediately and persist while the
  app is running.
- **Adjust stock** (IN / OUT / ADJUST) on the Inventory page — the per-warehouse level,
  the product's on-hand quantity, and the movement log all update together.
- **Search** products by SKU / name and **switch warehouse** on the Inventory page.
- See **status badges** (DRAFT / APPROVED / RECEIVED / SHIPPED…) and movement types.
- **Role-based UI** — create / adjust actions are hidden for the view-only Staff role.
- Resize the window / open on a phone to see the **responsive** layout.

---

## Project structure

```
IMS-Frontend/
├── index.html
├── package.json
├── vite.config.js
├── docs/
│   ├── er-diagram.md      # data model (Mermaid ER diagrams) + screen→entity map
│   ├── flow.md            # navigation, rendering, PO/SO/stock & end-to-end flows
│   └── phase-plan.md      # roadmap: what's done and what comes next
└── src/
    ├── main.jsx           # entry — Router + Auth/Store providers + render
    ├── App.jsx            # routes (login + protected app)
    ├── index.css          # design tokens + responsive styles
    ├── auth/
    │   ├── AuthContext.jsx   # demo login, roles & permissions
    │   └── RequireAuth.jsx   # protected-route gate
    ├── store/
    │   └── StoreContext.jsx  # in-memory data store + add/adjust actions
    ├── components/
    │   ├── Layout.jsx     # responsive sidebar (with icons) + topbar shell
    │   ├── Icons.jsx      # inline SVG icon set
    │   ├── Charts.jsx     # dependency-free SVG bar / line / donut charts
    │   ├── Modal.jsx      # dialog shell
    │   ├── FormModal.jsx  # schema-driven add form
    │   ├── DataTable.jsx  # generic scrollable table
    │   ├── Badge.jsx      # colored status pill
    │   └── PageHeader.jsx # title + actions
    ├── data/
    │   └── dummyData.js   # seed data + chart series
    └── pages/
        ├── Login.jsx
        ├── Dashboard.jsx
        ├── Products.jsx
        ├── Inventory.jsx
        ├── Warehouses.jsx
        ├── Suppliers.jsx
        ├── PurchaseOrders.jsx
        ├── Customers.jsx
        ├── SalesOrders.jsx
        └── Reports.jsx
```

---

## Docs

- **[docs/er-diagram.md](./docs/er-diagram.md)** — the data model the UI represents.
- **[docs/flow.md](./docs/flow.md)** — navigation, rendering, and business flows.
- **[docs/phase-plan.md](./docs/phase-plan.md)** — roadmap.

---

## Wiring a real backend

All data flows through the in-memory store in `src/store/StoreContext.jsx`, seeded from
`src/data/dummyData.js`. To go live, replace the store's `useState` seeds and `add*` /
`adjustStock` actions with an API client (e.g. axios) calling a Spring Boot + MySQL
backend, and swap the demo `AuthContext` for real JWT auth — the object shapes already
match the planned API, so it's a drop-in swap. The full backend reference lives in the
sibling `IMS/` project.
