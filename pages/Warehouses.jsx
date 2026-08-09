import { useState } from "react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import FormModal from "../components/FormModal";
import { useStore } from "../store/StoreContext";
import { useAuth } from "../auth/AuthContext";

export default function Warehouses() {
  const {
    warehouses,
    addWarehouse,
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
      key: "code",
      header: "Code",
    },
    {
      key: "name",
      header: "Name",
    },
    {
      key: "location",
      header: "Location",
    },
    {
      key: "active",
      header: "Status",
      render: (row) => (
        <Badge
          color={
            row.active
              ? "green"
              : "gray"
          }
        >
          {row.active
            ? "Active"
            : "Inactive"}
        </Badge>
      ),
    },
  ];

  const fields = [
    {
      name: "code",
      label: "Code",
      required: true,
      placeholder: "e.g. WH-EAST",
    },
    {
      name: "name",
      label: "Name",
      required: true,
      placeholder: "Warehouse name",
    },
    {
      name: "location",
      label: "Location",
      required: true,
      placeholder: "City / address",
    },
    {
      name: "active",
      label: "Active",
      type: "checkbox",
    },
  ];

  const submit = async (values) => {
    setActionError("");

    try {
      await addWarehouse(values);
      setShowForm(false);
    } catch (err) {
      console.error(
        "Failed to create warehouse:",
        err
      );

      setActionError(
        err?.message ||
          "Failed to create warehouse."
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="Warehouses"
        subtitle={`${warehouses.length} locations`}
      >
        {can("create") && (
          <button
            onClick={() =>
              setShowForm(true)
            }
          >
            + New Warehouse
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

      { loading ? (
        <p className="muted">
          Loading warehouses...
        </p>
      ) : (
        <DataTable
          columns={columns}
          rows={warehouses}
          empty="No warehouses found."
        />
      )}

      {showForm && (
        <FormModal
          title="New Warehouse"
          fields={fields}
          submitLabel="Create Warehouse"
          onSubmit={submit}
          onClose={() =>
            setShowForm(false)
          }
        />
      )}
    </div>
  );
}
