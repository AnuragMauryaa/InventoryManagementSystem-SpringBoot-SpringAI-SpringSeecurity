import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import FormModal from '../components/FormModal';
import { useStore } from '../store/StoreContext';
import { useAuth } from '../auth/AuthContext';

export default function Users() {
  const { users, updateUserAccess } = useStore();
  const { can } = useAuth();
  const [editing, setEditing] = useState(null);

  if (!can('manageUsers')) return <Navigate to="/" replace />;

  const columns = [
    { key: 'fullName', header: 'Name' },
    { key: 'username', header: 'Username' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (r) => (
        <Badge color={r.role === 'ADMIN' ? 'red' : r.role === 'MANAGER' ? 'blue' : 'gray'}>
          {r.role}
        </Badge>
      ),
    },
    {
      key: 'enabled',
      header: 'Account Status',
      render: (r) => (
        <Badge color={r.enabled ? 'green' : 'gray'}>
          {r.enabled ? 'Active' : 'Disabled'}
        </Badge>
      ),
    },
  ];

  const fields = [
    {
      name: 'role',
      label: 'System Role',
      type: 'select',
      required: true,
      options: [
        { value: 'STAFF', label: 'Staff (View Only)' },
        { value: 'MANAGER', label: 'Manager (Manage Inventory)' },
        { value: 'ADMIN', label: 'Admin (Full Access)' },
      ]
    },
    {
      name: 'enabled',
      label: 'Account Active',
      type: 'checkbox'
    }
  ];

  const handleUpdate = async (values) => {
    await updateUserAccess(editing.userId, values);
    setEditing(null);
  };

  return (
    <div>
      <PageHeader title="User Management" subtitle="Control system access and permissions" />
      
      <DataTable 
        columns={columns} 
        rows={users} 
        actions={(row) => (
          <button className="secondary" onClick={() => setEditing(row)}>
            Manage Access
          </button>
        )}
      />

      {editing && (
        <FormModal
          title={`Edit Access: ${editing.fullName}`}
          fields={fields}
          initial={{ role: editing.role, enabled: editing.enabled }}
          submitLabel="Update Access"
          onSubmit={handleUpdate}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}