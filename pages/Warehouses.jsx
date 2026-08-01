import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import FormModal from '../components/FormModal';
import { useStore } from '../store/StoreContext';
import { useAuth } from '../auth/AuthContext';

export default function Warehouses() {
  const { warehouses, addWarehouse } = useStore();
  const { can } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const columns = [
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Name' },
    { key: 'location', header: 'Location' },
    {
      key: 'active',
      header: 'Status',
      render: (r) => <Badge color={r.active ? 'green' : 'gray'}>{r.active ? 'Active' : 'Inactive'}</Badge>,
    },
  ];

  const fields = [
    { name: 'code', label: 'Code', required: true, placeholder: 'e.g. WH-EAST' },
    { name: 'name', label: 'Name', required: true, placeholder: 'Warehouse name' },
    { name: 'location', label: 'Location', required: true, placeholder: 'City / address' },
  ];

  return (
    <div>
      <PageHeader title="Warehouses" subtitle={`${warehouses.length} locations`}>
        {can('create') && <button onClick={() => setShowForm(true)}>+ New Warehouse</button>}
      </PageHeader>
      <DataTable columns={columns} rows={warehouses} />

      {showForm && (
        <FormModal
          title="New Warehouse"
          fields={fields}
          submitLabel="Create Warehouse"
          onSubmit={addWarehouse}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
