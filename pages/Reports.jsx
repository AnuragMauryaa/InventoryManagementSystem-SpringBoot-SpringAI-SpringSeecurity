import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import { useStore } from '../store/StoreContext';

const inr = (n) => '₹' + n.toLocaleString('en-IN');

export default function Reports() {
  const { products, lowStockProducts } = useStore();

  // Valuation rows derived from active products.
  const valuation = products
    .filter((p) => p.active)
    .map((p) => ({ ...p, value: p.costPrice * p.onHand }));
  const totalValue = valuation.reduce((sum, r) => sum + r.value, 0);

  const lowCols = [
    { key: 'sku', header: 'SKU' },
    { key: 'name', header: 'Product' },
    { key: 'onHand', header: 'On hand' },
    { key: 'reorderLevel', header: 'Reorder level' },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <Badge color={r.onHand === 0 ? 'red' : 'amber'}>{r.onHand === 0 ? 'Out of stock' : 'Low'}</Badge>
      ),
    },
  ];

  const valCols = [
    { key: 'sku', header: 'SKU' },
    { key: 'name', header: 'Product' },
    { key: 'onHand', header: 'Qty' },
    { key: 'costPrice', header: 'Unit cost', render: (r) => inr(r.costPrice) },
    { key: 'value', header: 'Stock value', render: (r) => inr(r.value) },
  ];

  return (
    <div>
      <PageHeader title="Reports" subtitle="Low-stock & stock valuation" />

      <div className="card mb-16">
        <h2>Low stock (at / below reorder level)</h2>
        <DataTable columns={lowCols} rows={lowStockProducts} empty="Nothing below reorder level 🎉" />
      </div>

      <div className="card">
        <h2>
          Stock valuation <span className="muted" style={{ fontSize: 14 }}>— total: {inr(totalValue)}</span>
        </h2>
        <DataTable columns={valCols} rows={valuation} />
      </div>
    </div>
  );
}
