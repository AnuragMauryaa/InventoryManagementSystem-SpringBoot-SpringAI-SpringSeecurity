import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import { useStore } from '../store/StoreContext';
import { useAuth } from '../auth/AuthContext';

export default function Customers() {
  const { customers, addCustomer } = useStore();
  const { can } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
  ];

  const fields = [
    { name: 'code', label: 'Customer code', required: true, placeholder: 'e.g. CUS-001' },
    { name: 'name', label: 'Name', required: true, placeholder: 'Customer name' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'buy@example.in' },
    { name: 'phone', label: 'Phone', placeholder: '+91 …' },
  ];

  return (
    <div>
      <PageHeader title="Customers" subtitle={`${customers.length} customers`}>
        {can('create') && <button onClick={() => setShowForm(true)}>+ New Customer</button>}
      </PageHeader>
      <DataTable columns={columns} rows={customers} />

      {showForm && (
        <FormModal
          title="New Customer"
          fields={fields}
          submitLabel="Create Customer"
          onSubmit={addCustomer}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
