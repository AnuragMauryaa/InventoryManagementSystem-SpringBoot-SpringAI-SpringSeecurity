import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import AiAssistant from './AiAssistant';
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
  CategoryIcon,
  UnitIcon,
  UsersIcon,
} from './Icons';

const NAV = [
  { to: '/', label: 'Dashboard', end: true, Icon: DashboardIcon },
  { to: '/categories', label: 'Categories', Icon: CategoryIcon },
  { to: '/units', label: 'Units', Icon: UnitIcon },
  { to: '/products', label: 'Products', Icon: ProductsIcon },
  { to: '/inventory', label: 'Inventory', Icon: InventoryIcon },
  { to: '/warehouses', label: 'Warehouses', Icon: WarehouseIcon },
  { to: '/suppliers', label: 'Suppliers', Icon: SupplierIcon },
  { to: '/purchase-orders', label: 'Purchase Orders', Icon: PurchaseIcon },
  { to: '/customers', label: 'Customers', Icon: CustomerIcon },
  { to: '/sales-orders', label: 'Sales Orders', Icon: SalesIcon },
  { to: '/reports', label: 'Reports', Icon: ReportsIcon },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">IMS</div>
        <nav className="nav">
          {NAV.map(({ to, label, end, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={close}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <Icon className="nav-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
          
          {user?.role === 'ADMIN' && (
            <NavLink
              to="/users"
              onClick={close}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <UsersIcon className="nav-icon" />
              <span>User Management</span>
            </NavLink>
          )}
        </nav>
        <button className="sidebar-logout secondary" onClick={signOut}>
          <LogoutIcon className="nav-icon" />
          <span>Sign out</span>
        </button>
      </aside>

      <div className={`backdrop ${open ? 'show' : ''}`} onClick={close} />

      <div className="main">
        <header className="topbar">
          <button className="menu-btn secondary" aria-label="Open menu" onClick={() => setOpen(true)}>
            ☰
          </button>
          <strong className="topbar-title">Inventory Management System</strong>
          <div className="spacer" />
          {user && (
            <span className="user-chip">
              <span className="user-name">{user.name}</span>
              <span className="badge blue">{user.role}</span>
            </span>
          )}
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
      <AiAssistant/>
    </div>
  );
}