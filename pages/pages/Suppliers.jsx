import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import FormModal from '../components/FormModal';
import { useStore } from '../store/StoreContext';
import { useAuth } from '../auth/AuthContext';

export default function Suppliers() {
  const { suppliers, addSupplier } = useStore();
  const { can } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'active',
      header: 'Status',
      render: (r) => <Badge color={r.active ? 'green' : 'gray'}>{r.active ? 'Active' : 'Inactive'}</Badge>,
    },
  ];

  const fields = [
    { name: 'code', label: 'Supplier code', required: true, placeholder: 'e.g. SUP-001' },
    { name: 'name', label: 'Name', required: true, placeholder: 'Supplier name' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'sales@example.in' },
    { name: 'phone', label: 'Phone', placeholder: '+91 …' },
  ];

  return (
    <div>
      <PageHeader title="Suppliers" subtitle={`${suppliers.length} suppliers`}>
        {can('create') && <button onClick={() => setShowForm(true)}>+ New Supplier</button>}
      </PageHeader>
      <DataTable columns={columns} rows={suppliers} />

      {showForm && (
        <FormModal
          title="New Supplier"
          fields={fields}
          submitLabel="Create Supplier"
          onSubmit={addSupplier}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
