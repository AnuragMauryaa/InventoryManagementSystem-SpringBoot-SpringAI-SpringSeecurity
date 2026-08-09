import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/Layout";
import RequireAuth from "./auth/RequireAuth";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Warehouses from "./pages/Warehouses";
import Suppliers from "./pages/Suppliers";
import PurchaseOrders from "./pages/PurchaseOrders";
import Customers from "./pages/Customers";
import SalesOrders from "./pages/SalesOrders";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <Routes>
      {/* Public authentication routes */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* Protected application */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route
          index
          element={<Dashboard />}
        />

        <Route
          path="products"
          element={<Products />}
        />

        <Route
          path="inventory"
          element={<Inventory />}
        />

        <Route
          path="warehouses"
          element={<Warehouses />}
        />

        <Route
          path="suppliers"
          element={<Suppliers />}
        />

        <Route
          path="purchase-orders"
          element={<PurchaseOrders />}
        />

        <Route
          path="customers"
          element={<Customers />}
        />

        <Route
          path="sales-orders"
          element={<SalesOrders />}
        />

        <Route
          path="reports"
          element={<Reports />}
        />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}
