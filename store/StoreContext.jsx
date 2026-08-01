import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../auth/AuthContext';

const StoreContext = createContext(null);

const emptyState = {
  products: [],
  categories: [],
  units: [],
  warehouses: [],
  suppliers: [],
  customers: [],
  purchaseOrders: [],
  salesOrders: [],
  stockLevels: [],
  stockMovements: [],
  dashboardStats: {}, 
  users: [],
};

const number = (value) => Number(value ?? 0);

const errorMessage = (error, fallback = 'Unable to complete the request.') =>
  error?.response?.data?.message || error?.response?.data || error?.message || fallback;

const mapCategory = (category) => ({
  id: category.categoryId,
  name: category.categoryName,
  description: category.description,
});

const mapUnit = (unit) => ({
  id: unit.unitId,
  name: unit.unitName,
  description: unit.description,
});

const mapWarehouse = (warehouse) => ({
  id: warehouse.warehouseId,
  code: warehouse.warehouseCode,
  name: warehouse.warehouseName,
  location: [warehouse.address, warehouse.city].filter(Boolean).join(', '),
  active: warehouse.active,
});

const mapSupplier = (supplier) => ({
  id: supplier.supplierId,
  code: supplier.supplierCode,
  name: supplier.supplierName,
  email: supplier.email,
  phone: supplier.phone,
  active: supplier.active,
});

const mapCustomer = (customer) => ({
  id: customer.customerId,
  code: customer.customerCode,
  name: customer.customerName,
  email: customer.email,
  phone: customer.phone,
  active: customer.active,
});

const mapProduct = (product, onHand) => ({
  id: product.productId,
  sku: product.sku,
  name: product.productName,
  description: product.description,
  costPrice: number(product.purchasePrice),
  sellPrice: number(product.sellingPrice),
  reorderLevel: number(product.reorderLevel),
  category: product.categoryId,
  unit: product.unitId,
  categoryName: product.category,
  unitName: product.unit,
  onHand: number(onHand),
  active: true,
});

const mapInventory = (inventory, productById) => ({
  id: inventory.inventoryId,
  productId: inventory.productId,
  warehouseId: inventory.warehouseId,
  sku: productById.get(inventory.productId)?.sku || '',
  name: inventory.productName,
  quantity: number(inventory.quantity),
  reserved: 0,
});

const mapPurchaseOrder = (order) => ({
  id: order.purchaseOrderId,
  supplierId: order.supplierId,
  supplier: order.supplierName,
  warehouseId: order.warehouseId,
  warehouse: order.warehouseName || '',
  status: order.status,
  total: number(order.totalAmount),
  date: order.orderDate,
});

const mapSalesOrder = (order) => ({
  id: order.salesOrderId,
  customerId: order.customerId,
  customer: order.customerName,
  warehouseId: order.warehouseId,
  warehouse: order.warehouseName || '',
  status: order.status,
  total: number(order.totalAmount),
  date: order.orderDate,
});

const mapMovement = (movement) => ({
  id: movement.movementId,
  date: movement.createdAt ? new Date(movement.createdAt).toLocaleString() : '',
  sku: movement.sku,
  name: movement.productName,
  type: movement.type,
  quantity: number(movement.quantity),
  ref: movement.reference || '',
});

export function StoreProvider({ children }) {
  const { user } = useAuth();
  const [state, setState] = useState(emptyState);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const reset = useCallback(() => {
    setState(emptyState);
    setLoadError('');
  }, []);

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      let usersResponse = { data: [] };
      if (user?.role === 'ADMIN') {
        usersResponse = await api.get('/users');
      }

      const [
        categoriesResponse,
        unitsResponse,
        productsResponse,
        warehousesResponse,
        suppliersResponse,
        customersResponse,
        inventoryResponse,
        purchaseOrdersResponse,
        salesOrdersResponse,
        movementsResponse,
        dashboardResponse, 
      ] = await Promise.all([
        api.get('/categories'),
        api.get('/units'),
        api.get('/products'),
        api.get('/warehouses'),
        api.get('/suppliers'),
        api.get('/customers'),
        api.get('/inventory'),
        api.get('/purchase-orders'),
        api.get('/sales-orders'),
        api.get('/inventory/movements'),
        api.get('/dashboard'), 
      ]);

      const productById = new Map(productsResponse.data.map((product) => [product.productId, product]));
      const inventory = inventoryResponse.data.map((row) => mapInventory(row, productById));

      const stockByProduct = inventory.reduce((totals, row) => {
        totals.set(row.productId, (totals.get(row.productId) || 0) + row.quantity);
        return totals;
      }, new Map());

      setState({
        categories: categoriesResponse.data.map(mapCategory),
        units: unitsResponse.data.map(mapUnit),
        products: productsResponse.data.map((product) => mapProduct(product, stockByProduct.get(product.productId))),
        warehouses: warehousesResponse.data.map(mapWarehouse),
        suppliers: suppliersResponse.data.map(mapSupplier),
        customers: customersResponse.data.map(mapCustomer),
        stockLevels: inventory,
        purchaseOrders: purchaseOrdersResponse.data.map(mapPurchaseOrder),
        salesOrders: salesOrdersResponse.data.map(mapSalesOrder),
        stockMovements: movementsResponse.data.map(mapMovement),
        dashboardStats: dashboardResponse.data, 
        users: usersResponse.data,
      });
    } catch (error) {
      reset();
      setLoadError(errorMessage(error, 'Could not load inventory data. Check that the backend is running.'));
    } finally {
      setIsLoading(false);
    }
  }, [reset, user?.role]);

  useEffect(() => {
    if (user) {
      loadAllData();
    } else {
      reset();
    }
  }, [user, loadAllData, reset]);

  const actions = useMemo(
    () => ({
      refresh: loadAllData,
      addCategory: async (category) => {
        await api.post('/categories', {
          categoryName: category.name,
          description: category.description || '',
        });
        await loadAllData();
      },
      addUnit: async (unit) => {
        await api.post('/units', {
          unitName: unit.name,
          description: unit.description || '',
        });
        await loadAllData();
      },
      addProduct: async (product) => {
        await api.post('/products', {
          sku: product.sku,
          productName: product.name,
          description: product.description || '',
          purchasePrice: number(product.costPrice),
          sellingPrice: number(product.sellPrice),
          reorderLevel: number(product.reorderLevel),
          categoryId: number(product.category),
          unitId: number(product.unit),
        });
        await loadAllData();
      },
      updateProduct: async (id, product) => {
        await api.put(`/products/${id}`, {
          sku: product.sku,
          productName: product.name,
          description: product.description || '',
          purchasePrice: number(product.costPrice),
          sellingPrice: number(product.sellPrice),
          reorderLevel: number(product.reorderLevel),
          categoryId: number(product.category),
          unitId: number(product.unit),
        });
        await loadAllData();
      },
      deleteProduct: async (id) => {
        await api.delete(`/products/${id}`);
        await loadAllData();
      },
      addWarehouse: async (warehouse) => {
        await api.post('/warehouses', {
          warehouseCode: warehouse.code,
          warehouseName: warehouse.name,
          address: warehouse.location,
        });
        await loadAllData();
      },
      addSupplier: async (supplier) => {
        await api.post('/suppliers', {
          supplierCode: supplier.code,
          supplierName: supplier.name,
          email: supplier.email || null,
          phone: supplier.phone || null,
        });
        await loadAllData();
      },
      addCustomer: async (customer) => {
        await api.post('/customers', {
          customerCode: customer.code,
          customerName: customer.name,
          email: customer.email || null,
          phone: customer.phone || null,
        });
        await loadAllData();
      },
      addPurchaseOrder: async (order) => {
        await api.post('/purchase-orders', {
          supplierId: number(order.supplierId),
          warehouseId: number(order.warehouseId),
          orderDate: order.date,
          status: order.status || 'PENDING',
          totalAmount: number(order.total),
        });
        await loadAllData();
      },
      addSalesOrder: async (order) => {
        await api.post('/sales-orders', {
          customerId: number(order.customerId),
          warehouseId: number(order.warehouseId),
          orderDate: order.date,
          status: order.status || 'PENDING',
          totalAmount: number(order.total),
        });
        await loadAllData();
      },
      adjustStock: async (adjustment) => {
        await api.post('/inventory/movements', {
          productId: number(adjustment.productId),
          warehouseId: number(adjustment.warehouseId),
          type: adjustment.type,
          quantity: number(adjustment.quantity),
          reference: adjustment.reference || 'Manual adjustment',
        });
        await loadAllData();
      },
      updateUserAccess: async (id, accessData) => {
        await api.put(`/users/${id}/access`, accessData);
        await loadAllData();
      },
    }),
    [loadAllData]
  );

  const lowStockProducts = useMemo(
    () => state.products.filter((product) => product.active && product.onHand <= product.reorderLevel),
    [state.products]
  );

  const computedDashboardStats = useMemo(() => {
    const openPurchaseOrders = state.purchaseOrders.filter(
      (order) => !['RECEIVED', 'CANCELLED'].includes(order.status)
    ).length;
    
    const openSalesOrders = state.salesOrders.filter(
      (order) => !['SHIPPED', 'COMPLETED', 'CANCELLED'].includes(order.status)
    ).length;
    
    const stockValue = state.products.reduce(
      (total, product) => total + product.costPrice * product.onHand,
      0
    );

    return {
      ...state.dashboardStats, 
      lowStockCount: lowStockProducts.length,
      openPurchaseOrders,
      openSalesOrders,
      stockValue,
    };
  }, [state.dashboardStats, state.products, state.purchaseOrders, state.salesOrders, lowStockProducts]);

  const value = {
    ...state,
    isLoading,
    loadError,
    lowStockProducts,
    dashboardStats: computedDashboardStats,
    ...actions,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside a StoreProvider');
  return context;
}