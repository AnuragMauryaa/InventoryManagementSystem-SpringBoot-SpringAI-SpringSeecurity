import { useEffect, useMemo, useState } from "react";

import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import FormModal from "../components/FormModal";

import { useStore } from "../store/StoreContext";
import { useAuth } from "../auth/AuthContext";

export default function Inventory() {
  const {
    warehouses,
    stockLevels,
    products,
    adjustStock,
    loading,
    error,
  } = useStore();

  const { user, can } = useAuth();

  const [warehouseId, setWarehouseId] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [actionError, setActionError] =
    useState("");

  /*
   * Select the first available warehouse once
   * the backend data has loaded.
   */
  useEffect(() => {
    if (
      !warehouseId &&
      warehouses.length > 0
    ) {
      setWarehouseId(
        String(warehouses[0].id)
      );
    }
  }, [
    warehouses,
    warehouseId,
  ]);

  /*
   * Only display stock belonging to the
   * currently selected warehouse.
   */
  const rows = useMemo(() => {
    const selectedWarehouseId =
      Number(warehouseId);

    return stockLevels
      .filter((stock) => {
        return (
          Number(
            stock.warehouseId ??
              stock.warehouse?.id
          ) ===
          selectedWarehouseId
        );
      })
      .map((stock) => {
        const quantity =
          Number(
            stock.quantity ?? 0
          );

        const reserved =
          Number(
            stock.reserved ?? 0
          );

        return {
          ...stock,

          available:
            quantity - reserved,

          sku:
            stock.sku ||
            stock.product?.sku ||
            "",

          name:
            stock.name ||
            stock.product?.name ||
            "",
        };
      });
  }, [
    stockLevels,
    warehouseId,
  ]);

  const columns = [
    {
      key: "sku",
      header: "SKU",
    },
    {
      key: "name",
      header: "Product",
    },
    {
      key: "quantity",
      header: "Quantity",
    },
    {
      key: "reserved",
      header: "Reserved",
    },
    {
      key: "available",
      header: "Available",
      render: (row) => (
        <Badge
          color={
            row.available <= 0
              ? "red"
              : "green"
          }
        >
          {row.available}
        </Badge>
      ),
    },
  ];

  const fields = [
    {
      name: "productId",
      label: "Product",
      type: "select",
      required: true,
      options: products.map(
        (product) => ({
          value: String(
            product.id ??
              product.productId
          ),

          label: `${product.sku || ""} — ${
            product.name || ""
          }`,
        })
      ),
    },

    {
      name: "warehouseId",
      label: "Warehouse",
      type: "select",
      required: true,
      options: warehouses.map(
        (warehouse) => ({
          value: String(
            warehouse.id ??
              warehouse.warehouseId
          ),

          label:
            warehouse.name,
        })
      ),
    },

    {
      name: "type",
      label: "Movement type",
      type: "select",
      required: true,
      options: [
        {
          value: "IN",
          label: "IN",
        },
        {
          value: "OUT",
          label: "OUT",
        },
        {
          value: "ADJUST",
          label: "ADJUST",
        },
      ],
    },

    {
      name: "quantity",
      label: "Quantity",
      type: "number",
      required: true,
      min: 1,
      step: 1,
    },

    {
      name: "ref",
      label: "Reference / reason",
      placeholder:
        "e.g. Stock count",
    },
  ];

  const submitAdjust = async (
    values
  ) => {
    setActionError("");

    const productId =
      Number(values.productId);

    const selectedProduct =
      products.find(
        (product) =>
          Number(
            product.id ??
              product.productId
          ) === productId
      );

    if (!selectedProduct) {
      throw new Error(
        "Selected product could not be found."
      );
    }

    const movement = {
      productId,

      warehouseId:
        Number(values.warehouseId),

      sku:
        selectedProduct.sku,

      name:
        selectedProduct.name,

      type:
        values.type,

      quantity:
        Number(values.quantity),

      ref:
        values.ref?.trim() ||
        "Manual adjustment",

      by:
        user?.username ||
        "user",
    };

    try {
      await adjustStock(movement);

      setShowForm(false);
    } catch (err) {
      console.error(
        "Inventory adjustment failed:",
        err
      );

      setActionError(
        err?.message ||
          "Unable to adjust inventory."
      );

      /*
       * Throw again so FormModal knows the
       * operation failed and doesn't close.
       */
      throw err;
    }
  };

  const selectedWarehouse =
    warehouses.find(
      (warehouse) =>
        String(
          warehouse.id ??
            warehouse.warehouseId
        ) ===
        String(warehouseId)
    );

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle={
          selectedWarehouse
            ? `Stock levels — ${selectedWarehouse.name}`
            : "Stock levels per warehouse"
        }
      >
        <select
          value={warehouseId}
          onChange={(event) =>
            setWarehouseId(
              event.target.value
            )
          }
          style={{
            width: 220,
          }}
          disabled={
            loading ||
            warehouses.length === 0
          }
        >
          {warehouses.length === 0 ? (
            <option value="">
              No warehouses
            </option>
          ) : (
            warehouses.map(
              (warehouse) => (
                <option
                  key={
                    warehouse.id ??
                    warehouse.warehouseId
                  }
                  value={
                    warehouse.id ??
                    warehouse.warehouseId
                  }
                >
                  {warehouse.name}
                </option>
              )
            )
          )}
        </select>

        {can("adjust") && (
          <button
            onClick={() => {
              setActionError("");
              setShowForm(true);
            }}
            disabled={
              products.length === 0 ||
              warehouses.length === 0
            }
          >
            + Adjust Stock
          </button>
        )}
      </PageHeader>

      {(error || actionError) && (
        <div
          className="login-error"
          role="alert"
        >
          {actionError || error}
        </div>
      )}

      {loading ? (
        <p className="muted">
          Loading inventory...
        </p>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          empty={
            selectedWarehouse
              ? "No stock recorded for this warehouse."
              : "No warehouse selected."
          }
        />
      )}

      {showForm && (
        <FormModal
          title="Adjust Stock"
          fields={fields}
          initial={{
            warehouseId:
              String(warehouseId || ""),
          }}
          submitLabel="Apply Adjustment"
          onSubmit={submitAdjust}
          onClose={() =>
            setShowForm(false)
          }
        />
      )}
    </div>
  );
}
