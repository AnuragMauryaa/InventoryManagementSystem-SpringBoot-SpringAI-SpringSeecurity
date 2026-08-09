import { useMemo, useState } from "react";

import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import FormModal from "../components/FormModal";

import { categories, units } from "../data/dummyData";
import { useStore } from "../store/StoreContext";
import { useAuth } from "../auth/AuthContext";

const inr = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function Products() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    loading,
    error,
  } = useStore();

  const { can } = useAuth();

  const [search, setSearch] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [actionError, setActionError] =
    useState("");

  const rows = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const sku =
        String(product.sku || "")
          .toLowerCase();

      const name =
        String(product.name || "")
          .toLowerCase();

      return (
        sku.includes(query) ||
        name.includes(query)
      );
    });
  }, [products, search]);

  const columns = [
    {
      key: "sku",
      header: "SKU",
    },
    {
      key: "name",
      header: "Name",
    },
    {
      key: "category",
      header: "Category",
    },
    {
      key: "unit",
      header: "Unit",
    },
    {
      key: "costPrice",
      header: "Cost",
      render: (row) =>
        inr(row.costPrice),
    },
    {
      key: "sellPrice",
      header: "Sell",
      render: (row) =>
        inr(row.sellPrice),
    },
    {
      key: "onHand",
      header: "On hand",
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
      name: "sku",
      label: "SKU",
      required: true,
      placeholder: "e.g. ELEC-003",
    },
    {
      name: "name",
      label: "Name",
      required: true,
      placeholder: "Product name",
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: categories.map(
        (category) => ({
          value: category.name,
          label: category.name,
        })
      ),
    },
    {
      name: "unit",
      label: "Unit",
      type: "select",
      options: units.map(
        (unit) => ({
          value:
            unit.abbreviation,
          label: `${unit.name} (${unit.abbreviation})`,
        })
      ),
    },
    {
      name: "costPrice",
      label: "Cost price (₹)",
      type: "number",
      required: true,
      min: 0,
      step: 0.01,
    },
    {
      name: "sellPrice",
      label: "Sell price (₹)",
      type: "number",
      required: true,
      min: 0,
      step: 0.01,
    },
    {
      name: "reorderLevel",
      label: "Reorder level",
      type: "number",
      min: 0,
    },
    {
      name: "onHand",
      label: "Opening stock",
      type: "number",
      min: 0,
    },
    {
      name: "active",
      label: "Active",
      type: "checkbox",
    },
  ];

  const openCreate = () => {
    setActionError("");
    setEditingProduct(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setActionError("");
  };

  const handleSubmit = async (
    values
  ) => {
    setActionError("");

    try {
      if (editingProduct) {
        await updateProduct(
          editingProduct.id,
          values
        );
      } else {
        await addProduct(values);
      }

      closeForm();
    } catch (err) {
      console.error(
        "Product save failed:",
        err
      );

      setActionError(
        err?.message ||
          "Unable to save product."
      );

      throw err;
    }
  };

  const handleDelete = async (
    product
  ) => {
    if (!can("edit")) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete product "${product.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionError("");

      await deleteProduct(
        product.id
      );
    } catch (err) {
      console.error(
        "Product deletion failed:",
        err
      );

      setActionError(
        err?.message ||
          "Unable to delete product."
      );
    }
  };

  /*
   * DataTable supports row rendering through
   * its configured columns. Keep the table simple
   * until the backend contract for update/delete
   * is fully matched.
   */
  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${rows.length} of ${products.length} shown`}
      >
        <input
          placeholder="Search SKU / name…"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          style={{
            width: 220,
          }}
        />

        {can("create") && (
          <button
            onClick={openCreate}
          >
            + New Product
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
          Loading products...
        </p>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          empty="No products match your search."
        />
      )}

      {showForm && (
        <FormModal
          title={
            editingProduct
              ? "Edit Product"
              : "New Product"
          }
          fields={fields}
          initial={
            editingProduct || {}
          }
          submitLabel={
            editingProduct
              ? "Update Product"
              : "Create Product"
          }
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
