import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import { useStore } from '../store/StoreContext';
import { useAuth } from '../auth/AuthContext';

export default function Categories() {
  const { categories, addCategory } = useStore();
  const { can } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const columns = [
    { key: 'name', header: 'Category Name' },
    { key: 'description', header: 'Description' },
  ];

  const fields = [
    { name: 'name', label: 'Category Name', required: true, placeholder: 'e.g. Electronics' },
    { name: 'description', label: 'Description', placeholder: 'Category description' },
  ];

  return (
    <div>
      <PageHeader title="Categories" subtitle="Manage product categories">
        {can('create') && <button onClick={() => setShowForm(true)}>+ New Category</button>}
      </PageHeader>
      <DataTable columns={columns} rows={categories} empty="No categories found." />
      {showForm && (
        <FormModal
          title="New Category"
          fields={fields}
          submitLabel="Create Category"
          onSubmit={addCategory}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}