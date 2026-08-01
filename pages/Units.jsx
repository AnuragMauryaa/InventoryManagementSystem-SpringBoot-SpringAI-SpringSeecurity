import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import { useStore } from '../store/StoreContext';
import { useAuth } from '../auth/AuthContext';

export default function Units() {
  const { units, addUnit } = useStore();
  const { can } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const columns = [
    { key: 'name', header: 'Unit Name' },
    { key: 'description', header: 'Description' },
  ];

  const fields = [
    { name: 'name', label: 'Unit Name', required: true, placeholder: 'e.g. Kilogram, Piece' },
    { name: 'description', label: 'Description', placeholder: 'Unit abbreviation or details' },
  ];

  return (
    <div>
      <PageHeader title="Measurement Units" subtitle="Manage product units">
        {can('create') && <button onClick={() => setShowForm(true)}>+ New Unit</button>}
      </PageHeader>
      <DataTable columns={columns} rows={units} empty="No units found." />
      {showForm && (
        <FormModal
          title="New Unit"
          fields={fields}
          submitLabel="Create Unit"
          onSubmit={addUnit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}