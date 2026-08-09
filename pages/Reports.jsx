import { useMemo } from "react";

import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";

import { useStore } from "../store/StoreContext";

const inr = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function Reports() {
  const {
    products,
    lowStockProducts,
    stockLevels,
    loading,
    error,
  } = useStore();

  /*
   * Stock valuation is calculated from actual
   * product data loaded from the backend.
   */
  const valuation = useMemo(() => {
    return products
      .filter(
        (product) =>
          product.active !== false
      )
      .map((product) => {
        const quantity = Number(
          product.onHand ?? 0
        );

        const costPrice = Number(
          product.costPrice ?? 0
        );

        return {
          ...product,
          onHand: quantity,
          costPrice,
          value:
            quantity * costPrice,
        };
      });
  }, [products]);

  const totalValue = useMemo(() => {
    return valuation.reduce(
      (sum, product) =>
        sum +
        Number(product.value || 0),
      0
    );
  }, [valuation]);

  /*
   * Prefer the backend-provided low-stock
   * collection from StoreContext.
   *
   * Fallback to calculating it locally if
   * the backend/store hasn't supplied one.
   */
  const lowStock = useMemo(() => {
    if (
      Array.isArray(lowStockProducts) &&
      lowStockProducts.length > 0
    ) {
      return lowStockProducts;
    }

    return products.filter(
      (product) => {
        const quantity = Number(
          product.onHand ?? 0
        );

        const reorderLevel =
          Number(
            product.reorderLevel ?? 0
          );

        return (
          product.active !== false &&
          quantity <= reorderLevel
        );
      }
    );
  }, [
    lowStockProducts,
    products,
  ]);

  const totalUnits = useMemo(() => {
    return (
      stockLevels?.reduce(
        (sum, stock) =>
          sum +
          Number(
            stock.quantity ?? 0
          ),
        0
      ) || 0
    );
  }, [stockLevels]);

  const lowCols = [
    {
      key: "sku",
      header: "SKU",
    },

    {
      key: "name",
      header: "Product",
    },

    {
      key: "onHand",
      header: "On hand",
      render: (row) =>
        Number(
          row.onHand ?? 0
        ),
    },

    {
      key: "reorderLevel",
      header: "Reorder level",
      render: (row) =>
        Number(
          row.reorderLevel ?? 0
        ),
    },

    {
      key: "status",
      header: "Status",
      render: (row) => {
        const quantity = Number(
          row.onHand ?? 0
        );

        return (
          <Badge
            color={
              quantity === 0
                ? "red"
                : "amber"
            }
          >
            {quantity === 0
              ? "Out of stock"
              : "Low"}
          </Badge>
        );
      },
    },
  ];

  const valCols = [
    {
      key: "sku",
      header: "SKU",
    },

    {
      key: "name",
      header: "Product",
    },

    {
      key: "onHand",
      header: "Qty",
      render: (row) =>
        Number(
          row.onHand ?? 0
        ),
    },

    {
      key: "costPrice",
      header: "Unit cost",
      render: (row) =>
        inr(row.costPrice),
    },

    {
      key: "value",
      header: "Stock value",
      render: (row) =>
        inr(row.value),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Inventory health, low stock and valuation"
      />

      {error && (
        <div
          className="login-error mb-16"
          role="alert"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="card">
          <p className="muted">
            Loading report data...
          </p>
        </div>
      ) : (
        <>
          <div
            className="stat-grid mb-16"
          >
            <div className="stat">
              <div className="label">
                Active products
              </div>

              <div className="value">
                {
                  valuation.length
                }
              </div>
            </div>

            <div className="stat">
              <div className="label">
                Low stock items
              </div>

              <div className="value">
                {lowStock.length}
              </div>
            </div>

            <div className="stat">
              <div className="label">
                Total units
              </div>

              <div className="value">
                {totalUnits.toLocaleString(
                  "en-IN"
                )}
              </div>
            </div>

            <div className="stat">
              <div className="label">
                Stock valuation
              </div>

              <div className="value">
                {inr(totalValue)}
              </div>
            </div>
          </div>

          <div className="card mb-16">
            <h2>
              Low stock
              <span
                className="muted"
                style={{
                  fontSize: 14,
                  marginLeft: 8,
                }}
              >
                — at / below reorder level
              </span>
            </h2>

            <DataTable
              columns={lowCols}
              rows={lowStock}
              empty="Nothing below reorder level 🎉"
            />
          </div>

          <div className="card">
            <h2>
              Stock valuation
              <span
                className="muted"
                style={{
                  fontSize: 14,
                  marginLeft: 8,
                }}
              >
                — total:{" "}
                {inr(totalValue)}
              </span>
            </h2>

            <DataTable
              columns={valCols}
              rows={valuation}
              empty="No active products available."
            />
          </div>
        </>
      )}
    </div>
  );
}
