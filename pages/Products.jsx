import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import FormModal from '../components/FormModal';
import { useStore } from '../store/StoreContext';
import { useAuth } from '../auth/AuthContext';

const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

export default function Products() {

    const {
        products,
        categories,
        units,
        addProduct,
        updateProduct,
        deleteProduct
    } = useStore();

    const { can } = useAuth();

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const rows = products.filter((p) => {

        const keyword = search.toLowerCase();

        return (

            p.name.toLowerCase().includes(keyword) ||

            p.sku.toLowerCase().includes(keyword)

        );

    });

    const columns = [

        {
            key: "sku",
            header: "SKU"
        },

        {
            key: "name",
            header: "Product"
        },

        {
    key: "categoryName",
    header: "Category"
},
{
    key: "unitName",
    header: "Unit"
},

        {
            key: "costPrice",
            header: "Cost Price",
            render: (r) => inr(r.costPrice)
        },

        {
            key: "sellPrice",
            header: "Selling Price",
            render: (r) => inr(r.sellPrice)
        },

        {
            key: "onHand",
            header: "On Hand"
        },

        {
            key: "active",
            header: "Status",
            render: (r) => (
                <Badge color={r.active ? "green" : "gray"}>
                    {r.active ? "Active" : "Inactive"}
                </Badge>
            )
        }

    ];

    const fields = [

        {
            name: "sku",
            label: "SKU",
            required: true
        },

        {
            name: "name",
            label: "Product Name",
            required: true
        },

        {
            name: "category",
            label: "Category",
            type: "select",
            required: true,
            options: categories.map((c) => ({
                value: c.id,
                label: c.name
            }))
        },

        {
            name: "unit",
            label: "Unit",
            type: "select",
            required: true,
            options: units.map((u) => ({
                value: u.id,
                label: u.name
            }))
        },

        {
            name: "costPrice",
            label: "Purchase Price",
            type: "number",
            required: true,
            min: 0
        },

        {
            name: "sellPrice",
            label: "Selling Price",
            type: "number",
            required: true,
            min: 0
        },

        {
            name: "reorderLevel",
            label: "Reorder Level",
            type: "number",
            required: true,
            min: 0
        }

    ];

    const createProduct = async (values) => {

        await addProduct(values);

        setShowForm(false);

    };

    const editProduct = async (values) => {

        await updateProduct(editing.id, values);

        setEditing(null);

    };

    const removeProduct = async (product) => {

        const confirmed = window.confirm(

            `Delete "${product.name}" ?`

        );

        if (!confirmed) return;

        await deleteProduct(product.id);

    };
        return (

        <div>

            <PageHeader
                title="Products"
                subtitle={`${rows.length} of ${products.length} products`}
            >

                <input
                    placeholder="Search product..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 250 }}
                />

                {
                    can("create") && (
                        <button
                            onClick={() => {

                                setEditing(null);

                                setShowForm(true);

                            }}
                        >
                            + New Product
                        </button>
                    )
                }

            </PageHeader>

            <DataTable

                columns={columns}

                rows={rows}

                empty="No Products Found."

                actions={(row) => (

                    <>
                        {
                            can("edit") && (
                                <button
                                    className="secondary"
                                    onClick={() => setEditing(row)}
                                >
                                    Edit
                                </button>
                            )
                        }

                        {
                            can("edit") && (
                                <button
                                    onClick={() => removeProduct(row)}
                                    style={{
                                        background: "#dc2626"
                                    }}
                                >
                                    Delete
                                </button>
                            )
                        }
                    </>

                )}

            />

            {

                showForm && (

                    <FormModal

                        title="Create Product"

                        fields={fields}

                        submitLabel="Save"

                        onSubmit={createProduct}

                        onClose={() => setShowForm(false)}

                    />

                )

            }

            {

                editing && (

                    <FormModal

                        title="Edit Product"

                        fields={fields}

                        initial={{

                            sku: editing.sku,

                            name: editing.name,

                            category: editing.category,

                            unit: editing.unit,

                            costPrice: editing.costPrice,

                            sellPrice: editing.sellPrice,

                            reorderLevel: editing.reorderLevel

                        }}

                        submitLabel="Update Product"

                        onSubmit={editProduct}

                        onClose={() => setEditing(null)}

                    />

                )

            }

        </div>

    );

}
