import { useState } from "react";

import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import FormModal from "../components/FormModal";

import { statusColor } from "../data/dummyData";
import { useStore } from "../store/StoreContext";
import { useAuth } from "../auth/AuthContext";

const inr = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const today = () =>
  new Date()
    .toISOString()
    .slice(0, 10);

export default function PurchaseOrders() {
  const {
    purchaseOrders,
    suppliers,
    warehouses,
    addPurchaseOrder,
    loading,
    error,
  } = useStore();

  const { can } = useAuth();

  const [showForm, setShowForm] =
    useState(false);

  const [actionError, setActionError] =
    useState("");

  const columns = [
    {
      key: "id",
      header: "PO #",
      render: (row) =>
        `PO-${row.id}`,
    },
    {
      key: "supplier",
      header: "Supplier",
      render: (row) =>
        row.supplier?.name ||
        row.supplier ||
        row.supplierName ||
        "—",
    },
    {
      key: "warehouse",
      header: "Warehouse",
      render: (row) =>
        row.warehouse?.name ||
        row.warehouse ||
        row.warehouseName ||
        "—",
    },
    {
      key: "date",
      header: "Date",
    },
    {
      key: "total",
      header: "Total",
      render: (row) =>
        inr(row.total),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge
          color={
            statusColor[
              row.status
            ] || "gray"
          }
        >
          {row.status || "DRAFT"}
        </Badge>
      ),
    },
  ];

  const fields = [
    {
      name: "supplierId",
      label: "Supplier",
      type: "select",
      required: true,
      options: suppliers.map(
        (supplier) => ({
          value: String(
            supplier.id ??
              supplier.supplierId
          ),
          label:
            supplier.name,
        })
      ),
    },

    {
      name: "warehouseId",
      label: "Receiving warehouse",
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
      name: "date",
      label: "Date",
      type: "date",
      required: true,
    },

    {
      name: "total",
      label: "Total (₹)",
      type: "number",
      required: true,
      min: 0,
      step: 0.01,
    },

    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        "DRAFT",
        "APPROVED",
        "RECEIVED",
        "CANCELLED",
      ].map((value) => ({
        value,
        label: value,
      })),
    },
  ];

  const submit = async (values) => {
    setActionError("");

    /*
     * IDs are deliberately converted to numbers here.
     * This prevents "1" from being sent where the backend
     * expects a Long/Integer relationship ID.
     */
    const payload = {
      ...values,

      supplierId:
        Number(values.supplierId),

      warehouseId:
        Number(values.warehouseId),

      total:
        Number(values.total),
    };

    try {
      await addPurchaseOrder(
        payload
      );

      setShowForm(false);
    } catch (err) {
      console.error(
        "Failed to create purchase order:",
        err
      );

      setActionError(
        err?.message ||
          "Failed to create purchase order."
      );

      throw err;
    }
  };

  return (
    <div>
      <PageHeader
        title="Purchase Orders"
        subtitle="Procurement — buy stock from suppliers"
      >
        {can("create") && (
          <button
            onClick={() => {
              setActionError("");
              setShowForm(true);
            }}
          >
            + New PO
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
          Loading purchase orders...
        </p>
      ) : (
        <DataTable
          columns={columns}
          rows={purchaseOrders}
          empty="No purchase orders found."
        />
      )}

      {showForm && (
        <FormModal
          title="New Purchase Order"
          fields={fields}
          initial={{
            date: today(),
            status: "DRAFT",
          }}
          submitLabel="Create PO"
          onSubmit={submit}
          onClose={() =>
            setShowForm(false)
          }
        />
      )}
    </div>
  );
}
