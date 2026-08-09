import { useState } from "react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import FormModal from "../components/FormModal";
import { useStore } from "../store/StoreContext";
import { useAuth } from "../auth/AuthContext";

export default function Suppliers() {
  const {
    suppliers,
    addSupplier,
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
      key: "name",
      header: "Name",
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "phone",
      header: "Phone",
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
      name: "name",
      label: "Name",
      required: true,
      placeholder: "Supplier name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "sales@example.in",
    },
    {
      name: "phone",
      label: "Phone",
      placeholder: "+91 ...",
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
      await addSupplier(values);
      setShowForm(false);
    } catch (err) {
      console.error(
        "Failed to create supplier:",
        err
      );

      setActionError(
        err?.message ||
          "Failed to create supplier."
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="Suppliers"
        subtitle={`${suppliers.length} suppliers`}
      >
        {can("create") && (
          <button
            onClick={() =>
              setShowForm(true)
            }
          >
            + New Supplier
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
          Loading suppliers...
        </p>
      ) : (
        <DataTable
          columns={columns}
          rows={suppliers}
          empty="No suppliers found."
        />
      )}

      {showForm && (
        <FormModal
          title="New Supplier"
          fields={fields}
          submitLabel="Create Supplier"
          onSubmit={submit}
          onClose={() =>
            setShowForm(false)
          }
        />
      )}
    </div>
  );
}
