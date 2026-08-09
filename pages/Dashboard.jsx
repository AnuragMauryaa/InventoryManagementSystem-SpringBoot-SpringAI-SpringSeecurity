import { useEffect, useMemo, useState } from "react";

import PageHeader from "../components/PageHeader";
import { useStore } from "../store/StoreContext";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api/api";

const inr = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function Dashboard() {
  const {
    products,
    warehouses,
    purchaseOrders,
    salesOrders,
    stockLevels,
    loading,
    error,
    reload,
  } = useStore();

  const { user } = useAuth();

  const [backendSummary, setBackendSummary] =
    useState(null);

  const [summaryLoading, setSummaryLoading] =
    useState(false);

  const [summaryError, setSummaryError] =
    useState("");

  /*
   * Try to obtain a backend dashboard summary.
   *
   * If your backend doesn't expose /api/dashboard,
   * the dashboard still works using the already-loaded
   * real API data from StoreContext.
   */
  useEffect(() => {
    let cancelled = false;

    const loadSummary = async () => {
      setSummaryLoading(true);
      setSummaryError("");

      try {
        const response =
          await api.get("/api/dashboard");

        if (!cancelled) {
          setBackendSummary(
            response?.data ||
              response
          );
        }
      } catch (err) {
        /*
         * Do not make the whole dashboard unusable
         * if the optional summary endpoint isn't present.
         */
        if (!cancelled) {
          setSummaryError(
            err?.message || ""
          );
        }
      } finally {
        if (!cancelled) {
          setSummaryLoading(false);
        }
      }
    };

    loadSummary();

    return () => {
      cancelled = true;
    };
  }, []);

  const lowStockProducts = useMemo(() => {
    return products.filter(
      (product) => {
        const onHand =
          Number(
            product.onHand ?? 0
          );

        const reorderLevel =
          Number(
            product.reorderLevel ?? 0
          );

        return (
          product.active !== false &&
          onHand <= reorderLevel
        );
      }
    );
  }, [products]);

  const totalStockValue = useMemo(() => {
    return products.reduce(
      (total, product) => {
        return (
          total +
          Number(
            product.costPrice ?? 0
          ) *
            Number(
              product.onHand ?? 0
            )
        );
      },
      0
    );
  }, [products]);

  const openPurchaseOrders =
    useMemo(() => {
      return purchaseOrders.filter(
        (order) =>
          ![
            "RECEIVED",
            "CANCELLED",
          ].includes(
            String(
              order.status || ""
            ).toUpperCase()
          )
      ).length;
    }, [purchaseOrders]);

  const openSalesOrders =
    useMemo(() => {
      return salesOrders.filter(
        (order) =>
          ![
            "SHIPPED",
            "CANCELLED",
          ].includes(
            String(
              order.status || ""
            ).toUpperCase()
          )
      ).length;
    }, [salesOrders]);

  const totalUnits = useMemo(() => {
    return stockLevels.reduce(
      (total, stock) =>
        total +
        Number(
          stock.quantity ?? 0
        ),
      0
    );
  }, [stockLevels]);

  const stats = [
    {
      label: "Products",
      value:
        backendSummary?.totalProducts ??
        products.length,
    },
    {
      label: "Warehouses",
      value:
        backendSummary?.totalWarehouses ??
        warehouses.length,
    },
    {
      label: "Low Stock",
      value:
        backendSummary?.lowStockCount ??
        lowStockProducts.length,
    },
    {
      label: "Stock Value",
      value: inr(
        backendSummary?.stockValue ??
          totalStockValue
      ),
    },
    {
      label: "Open Purchase Orders",
      value:
        backendSummary?.openPurchaseOrders ??
        openPurchaseOrders,
    },
    {
      label: "Open Sales Orders",
      value:
        backendSummary?.openSalesOrders ??
        openSalesOrders,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={
          user?.fullName ||
          user?.username
            ? `Welcome, ${
                user.fullName ||
                user.username
              }`
            : "Inventory overview"
        }
      />

      {(error || summaryError) && (
        <div
          className="login-error"
          role="alert"
        >
          {error ||
            "Some dashboard information could not be loaded."}
        </div>
      )}

      <div className="stat-grid">
        {stats.map((stat) => (
          <div
            className="stat-card"
            key={stat.label}
          >
            <div className="stat-label">
              {stat.label}
            </div>

            <div className="stat-value">
              {loading ||
              summaryLoading
                ? "..."
                : stat.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        <div className="card">
          <h3>Inventory Overview</h3>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gap: 12,
            }}
          >
            <div>
              <strong>
                {products.length}
              </strong>{" "}
              products
            </div>

            <div>
              <strong>
                {warehouses.length}
              </strong>{" "}
              warehouses
            </div>

            <div>
              <strong>
                {totalUnits}
              </strong>{" "}
              units currently recorded
            </div>

            <div>
              <strong>
                {lowStockProducts.length}
              </strong>{" "}
              products at or below reorder level
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Order Overview</h3>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gap: 12,
            }}
          >
            <div>
              <strong>
                {purchaseOrders.length}
              </strong>{" "}
              purchase orders
            </div>

            <div>
              <strong>
                {openPurchaseOrders}
              </strong>{" "}
              purchase orders open
            </div>

            <div>
              <strong>
                {salesOrders.length}
              </strong>{" "}
              sales orders
            </div>

            <div>
              <strong>
                {openSalesOrders}
              </strong>{" "}
              sales orders open
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Low Stock</h3>

          {lowStockProducts.length === 0 ? (
            <p className="muted">
              No products currently require
              replenishment.
            </p>
          ) : (
            <div
              style={{
                marginTop: 12,
                display: "grid",
                gap: 10,
              }}
            >
              {lowStockProducts
                .slice(0, 5)
                .map((product) => (
                  <div
                    key={
                      product.id ||
                      product.productId ||
                      product.sku
                    }
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      gap: 12,
                    }}
                  >
                    <span>
                      {product.name}
                    </span>

                    <strong>
                      {Number(
                        product.onHand ?? 0
                      )}
                    </strong>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          className="secondary"
          onClick={reload}
          disabled={loading}
        >
          {loading
            ? "Refreshing..."
            : "Refresh data"}
        </button>
      </div>
    </div>
  );
}
