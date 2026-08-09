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

export default function SalesOrders() {
  const {
    salesOrders,
    customers,
    warehouses,
    addSalesOrder,
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
      header: "SO #",
      render: (row) =>
        `SO-${row.id}`,
    },
    {
      key: "customer",
      header: "Customer",
      render: (row) =>
        row.customer?.name ||
        row.customer ||
        row.customerName ||
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
      name: "customerId",
      label: "Customer",
      type: "select",
      required: true,
      options: customers.map(
        (customer) => ({
          value: String(
            customer.id ??
              customer.customerId
          ),
          label:
            customer.name,
        })
      ),
    },

    {
      name: "warehouseId",
      label: "Fulfilling warehouse",
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
        "CONFIRMED",
        "SHIPPED",
        "CANCELLED",
      ].map((value) => ({
        value,
        label: value,
      })),
    },
  ];

  const submit = async (values) => {
    setActionError("");

    const payload = {
      ...values,

      customerId:
        Number(values.customerId),

      warehouseId:
        Number(values.warehouseId),

      total:
        Number(values.total),
    };

    try {
      await addSalesOrder(
        payload
      );

      setShowForm(false);
    } catch (err) {
      console.error(
        "Failed to create sales order:",
        err
      );

      setActionError(
        err?.message ||
          "Failed to create sales order."
      );

      throw err;
    }
  };

  return (
    <div>
      <PageHeader
        title="Sales Orders"
        subtitle="Fulfillment — sell & ship stock to customers"
      >
        {can("create") && (
          <button
            onClick={() => {
              setActionError("");
              setShowForm(true);
            }}
          >
            + New SO
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
          Loading sales orders...
        </p>
      ) : (
        <DataTable
          columns={columns}
          rows={salesOrders}
          empty="No sales orders found."
        />
      )}

      {showForm && (
        <FormModal
          title="New Sales Order"
          fields={fields}
          initial={{
            date: today(),
            status: "DRAFT",
          }}
          submitLabel="Create SO"
          onSubmit={submit}
          onClose={() =>
            setShowForm(false)
          }
        />
      )}
    </div>
  );
}
