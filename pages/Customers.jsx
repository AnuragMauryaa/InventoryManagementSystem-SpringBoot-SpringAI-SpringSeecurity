import { useState } from "react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import { useStore } from "../store/StoreContext";
import { useAuth } from "../auth/AuthContext";

export default function Customers() {
  const {
    customers,
    addCustomer,
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
  ];

  const fields = [
    {
      name: "name",
      label: "Name",
      required: true,
      placeholder: "Customer name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "buy@example.in",
    },
    {
      name: "phone",
      label: "Phone",
      placeholder: "+91 ...",
    },
  ];

  const submit = async (values) => {
    setActionError("");

    try {
      await addCustomer(values);
      setShowForm(false);
    } catch (err) {
      console.error(
        "Failed to create customer:",
        err
      );

      setActionError(
        err?.message ||
          "Failed to create customer."
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} customers`}
      >
        {can("create") && (
          <button
            onClick={() =>
              setShowForm(true)
            }
          >
            + New Customer
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
          Loading customers...
        </p>
      ) : (
        <DataTable
          columns={columns}
          rows={customers}
          empty="No customers found."
        />
      )}

      {showForm && (
        <FormModal
          title="New Customer"
          fields={fields}
          submitLabel="Create Customer"
          onSubmit={submit}
          onClose={() =>
            setShowForm(false)
          }
        />
      )}
    </div>
  );
}
