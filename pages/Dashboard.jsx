import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import { BarChart, LineChart, DonutChart } from '../components/Charts';
import { useStore } from '../store/StoreContext';

const inr = (value) => '₹ ' + Number(value).toLocaleString('en-IN');

const movementColor = {
  IN: 'green',
  OUT: 'amber',
  ADJUSTMENT: 'gray',
  TRANSFER: 'blue',
};

const byMonth = (orders) => {
  const totals = new Map();
  orders.forEach((order) => {
    if (!order.date) return;
    const date = new Date(`${order.date}T00:00:00`);
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleString('en-IN', { month: 'short' });
    const current = totals.get(key) || { label, value: 0 };
    current.value += Number(order.total || 0);
    totals.set(key, current);
  });
  return [...totals.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([, value]) => value);
};

export default function Dashboard() {
  const { dashboardStats: stats, lowStockProducts, stockMovements, purchaseOrders, salesOrders, products } = useStore();

  const purchasesByMonth = byMonth(purchaseOrders);
  const salesByMonth = byMonth(salesOrders);

  const stockByCategory = [...products.reduce((totals, product) => {
    const name = product.categoryName || 'Uncategorised';
    totals.set(name, (totals.get(name) || 0) + product.costPrice * product.onHand);
    return totals;
  }, new Map()).entries()].map(([label, value]) => ({ label, value }));

  // Safe defaults utilizing || 0 to avoid NaN displays
  const statCards = [
    { label: 'Products', value: stats.totalProducts || 0 },
    { label: 'Active Warehouses', value: stats.totalWarehouses || 0 },
    { label: 'Low Stock Items', value: stats.lowStockCount || 0 },
    { label: 'Open Purchase Orders', value: stats.openPurchaseOrders || 0 },
    { label: 'Open Sales Orders', value: stats.openSalesOrders || 0 },
    { label: 'Stock Value', value: inr(stats.stockValue || 0) },
  ];

  const lowColumns = [
    { key: 'sku', header: 'SKU' },
    { key: 'name', header: 'Product' },
    { key: 'onHand', header: 'On hand' },
    { key: 'reorderLevel', header: 'Reorder level' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge color={row.onHand === 0 ? 'red' : 'amber'}>{row.onHand === 0 ? 'Out of stock' : 'Low'}</Badge>,
    },
  ];

  const movementColumns = [
    { key: 'date', header: 'Date' },
    { key: 'sku', header: 'SKU' },
    { key: 'name', header: 'Product' },
    { key: 'type', header: 'Type', render: (row) => <Badge color={movementColor[row.type]}>{row.type}</Badge> },
    { key: 'quantity', header: 'Qty' },
    { key: 'ref', header: 'Reference' },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Live overview of inventory health" />

      <div className="stat-grid mb-16">
        {statCards.map((card) => (
          <div className="stat" key={card.label}>
            <div className="label">{card.label}</div>
            <div className="value">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="chart-grid mb-16">
        <div className="card">
          <h2>Monthly sales</h2>
          {salesByMonth.length ? <LineChart data={salesByMonth} format={inr} /> : <p className="muted">No sales orders yet.</p>}
        </div>
        <div className="card">
          <h2>Monthly purchases</h2>
          {purchasesByMonth.length ? <BarChart data={purchasesByMonth} format={inr} /> : <p className="muted">No purchase orders yet.</p>}
        </div>
        <div className="card">
          <h2>Stock value by category</h2>
          {stockByCategory.length ? <DonutChart data={stockByCategory} /> : <p className="muted">No stock recorded yet.</p>}
        </div>
      </div>

      <div className="card mb-16">
        <h2>Low stock alerts</h2>
        <DataTable columns={lowColumns} rows={lowStockProducts} empty="Everything is above reorder level." />
      </div>

      <div className="card">
        <h2>Recent stock movements</h2>
        <DataTable columns={movementColumns} rows={stockMovements} empty="No stock movements recorded yet." />
      </div>
    </div>
  );
}