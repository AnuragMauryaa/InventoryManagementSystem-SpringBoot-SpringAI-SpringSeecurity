import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../auth/AuthContext";

import {
  DashboardIcon,
  ProductsIcon,
  InventoryIcon,
  WarehouseIcon,
  SupplierIcon,
  PurchaseIcon,
  CustomerIcon,
  SalesIcon,
  ReportsIcon,
  LogoutIcon,
} from "./Icons";

const NAV = [
  {
    to: "/",
    label: "Dashboard",
    end: true,
    Icon: DashboardIcon,
    permission: "view",
  },
  {
    to: "/products",
    label: "Products",
    Icon: ProductsIcon,
    permission: "view",
  },
  {
    to: "/inventory",
    label: "Inventory",
    Icon: InventoryIcon,
    permission: "view",
  },
  {
    to: "/warehouses",
    label: "Warehouses",
    Icon: WarehouseIcon,
    permission: "view",
  },
  {
    to: "/suppliers",
    label: "Suppliers",
    Icon: SupplierIcon,
    permission: "view",
  },
  {
    to: "/purchase-orders",
    label: "Purchase Orders",
    Icon: PurchaseIcon,
    permission: "view",
  },
  {
    to: "/customers",
    label: "Customers",
    Icon: CustomerIcon,
    permission: "view",
  },
  {
    to: "/sales-orders",
    label: "Sales Orders",
    Icon: SalesIcon,
    permission: "view",
  },
  {
    to: "/reports",
    label: "Reports",
    Icon: ReportsIcon,
    permission: "view",
  },
];

function getDisplayName(user) {
  return (
    user?.fullName ||
    user?.name ||
    user?.username ||
    "User"
  );
}

function getDisplayRole(user) {
  const role =
    user?.role ||
    user?.roleType ||
    user?.roleName;

  if (!role) {
    return "";
  }

  return String(role)
    .replace(/^ROLE_/i, "")
    .toUpperCase();
}

export default function Layout() {
  const [open, setOpen] =
    useState(false);

  const {
    user,
    logout,
    can,
  } = useAuth();

  const navigate =
    useNavigate();

  const close = () => {
    setOpen(false);
  };

  const signOut = () => {
    logout();

    close();

    navigate("/login", {
      replace: true,
    });
  };

  const visibleNav = NAV.filter(
    (item) =>
      !item.permission ||
      can(item.permission)
  );

  const displayName =
    getDisplayName(user);

  const displayRole =
    getDisplayRole(user);

  return (
    <div className="shell">
      <aside
        className={`sidebar ${
          open ? "open" : ""
        }`}
      >
        <div className="brand">
          📦 IMS
        </div>

        <nav
          className="nav"
          aria-label="Main navigation"
        >
          {visibleNav.map(
            ({
              to,
              label,
              end,
              Icon,
            }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={close}
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "active"
                    : ""
                }
              >
                <Icon className="nav-icon" />

                <span>
                  {label}
                </span>
              </NavLink>
            )
          )}
        </nav>

        <button
          type="button"
          className="sidebar-logout secondary"
          onClick={signOut}
        >
          <LogoutIcon className="nav-icon" />

          <span>
            Sign out
          </span>
        </button>
      </aside>

      {open && (
        <div
          className="backdrop show"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <div className="main">
        <header className="topbar">
          <button
            type="button"
            className="menu-btn secondary"
            aria-label="Open menu"
            onClick={() =>
              setOpen(true)
            }
          >
            ☰
          </button>

          <strong className="topbar-title">
            Inventory Management System
          </strong>

          <div className="spacer" />

          {user && (
            <div className="user-chip">
              <span className="user-name">
                {displayName}
              </span>

              {displayRole && (
                <span className="badge blue">
                  {displayRole}
                </span>
              )}
            </div>
          )}
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
