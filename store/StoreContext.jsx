import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import {
  productApi,
  inventoryApi,
  warehouseApi,
  supplierApi,
  customerApi,
  purchaseOrderApi,
  salesOrderApi,
} from "../api/api";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [stockLevels, setStockLevels] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
   * Normalize backend responses.
   *
   * This allows the frontend to work with either:
   *
   * [
   *   {...},
   *   {...}
   * ]
   *
   * or common Spring response wrappers such as:
   *
   * {
   *   content: [...]
   * }
   *
   * {
   *   data: [...]
   * }
   */
  const extractList = useCallback((response) => {
    if (!response) return [];

    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response.content)) {
      return response.content;
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (Array.isArray(response.items)) {
      return response.items;
    }

    return [];
  }, []);

  /*
   * Load all master data.
   *
   * This replaces dummyData.js as the source of truth.
   */
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        productsResponse,
        warehousesResponse,
        suppliersResponse,
        customersResponse,
        purchaseOrdersResponse,
        salesOrdersResponse,
        inventoryResponse,
        movementsResponse,
      ] = await Promise.all([
        productApi.getAll(),
        warehouseApi.getAll(),
        supplierApi.getAll(),
        customerApi.getAll(),
        purchaseOrderApi.getAll(),
        salesOrderApi.getAll(),
        inventoryApi.getAll(),
        inventoryApi.getMovements(),
      ]);

      setProducts(extractList(productsResponse));
      setWarehouses(extractList(warehousesResponse));
      setSuppliers(extractList(suppliersResponse));
      setCustomers(extractList(customersResponse));
      setPurchaseOrders(extractList(purchaseOrdersResponse));
      setSalesOrders(extractList(salesOrdersResponse));
      setStockLevels(extractList(inventoryResponse));
      setStockMovements(extractList(movementsResponse));
    } catch (err) {
      console.error("Failed to load inventory data:", err);

      setError(
        err?.message ||
          "Unable to load inventory data."
      );
    } finally {
      setLoading(false);
    }
  }, [extractList]);

  /*
   * Initial load.
   *
   * AuthProvider runs above StoreProvider, and RequireAuth
   * protects the application routes.
   */
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  /* =========================================================
     PRODUCTS
     ========================================================= */

  const addProduct = useCallback(
    async (product) => {
      const created = await productApi.create(product);

      /*
       * Some APIs return the created object directly,
       * while others return { data: created }.
       */
      const newProduct =
        created?.data || created;

      if (newProduct) {
        setProducts((prev) => [
          ...prev,
          newProduct,
        ]);
      } else {
        await loadAll();
      }

      return newProduct;
    },
    [loadAll]
  );

  const updateProduct = useCallback(
    async (id, product) => {
      const updated = await productApi.update(
        id,
        product
      );

      const updatedProduct =
        updated?.data || updated;

      if (updatedProduct) {
        setProducts((prev) =>
          prev.map((item) =>
            item.id === id
              ? updatedProduct
              : item
          )
        );
      } else {
        await loadAll();
      }

      return updatedProduct;
    },
    [loadAll]
  );

  const deleteProduct = useCallback(
    async (id) => {
      await productApi.delete(id);

      setProducts((prev) =>
        prev.filter((item) => item.id !== id)
      );
    },
    []
  );

  /* =========================================================
     WAREHOUSES
     ========================================================= */

  const addWarehouse = useCallback(
    async (warehouse) => {
      const created =
        await warehouseApi.create(
          warehouse
        );

      const newWarehouse =
        created?.data || created;

      if (newWarehouse) {
        setWarehouses((prev) => [
          ...prev,
          newWarehouse,
        ]);
      } else {
        await loadAll();
      }

      return newWarehouse;
    },
    [loadAll]
  );

  const updateWarehouse = useCallback(
    async (id, warehouse) => {
      const updated =
        await warehouseApi.update(
          id,
          warehouse
        );

      const updatedWarehouse =
        updated?.data || updated;

      if (updatedWarehouse) {
        setWarehouses((prev) =>
          prev.map((item) =>
            item.id === id
              ? updatedWarehouse
              : item
          )
        );
      } else {
        await loadAll();
      }

      return updatedWarehouse;
    },
    [loadAll]
  );

  const deleteWarehouse = useCallback(
    async (id) => {
      await warehouseApi.delete(id);

      setWarehouses((prev) =>
        prev.filter((item) => item.id !== id)
      );
    },
    []
  );

  /* =========================================================
     SUPPLIERS
     ========================================================= */

  const addSupplier = useCallback(
    async (supplier) => {
      const created =
        await supplierApi.create(
          supplier
        );

      const newSupplier =
        created?.data || created;

      if (newSupplier) {
        setSuppliers((prev) => [
          ...prev,
          newSupplier,
        ]);
      } else {
        await loadAll();
      }

      return newSupplier;
    },
    [loadAll]
  );

  const updateSupplier = useCallback(
    async (id, supplier) => {
      const updated =
        await supplierApi.update(
          id,
          supplier
        );

      const updatedSupplier =
        updated?.data || updated;

      if (updatedSupplier) {
        setSuppliers((prev) =>
          prev.map((item) =>
            item.id === id
              ? updatedSupplier
              : item
          )
        );
      } else {
        await loadAll();
      }

      return updatedSupplier;
    },
    [loadAll]
  );

  const deleteSupplier = useCallback(
    async (id) => {
      await supplierApi.delete(id);

      setSuppliers((prev) =>
        prev.filter((item) => item.id !== id)
      );
    },
    []
  );

  /* =========================================================
     CUSTOMERS
     ========================================================= */

  const addCustomer = useCallback(
    async (customer) => {
      const created =
        await customerApi.create(
          customer
        );

      const newCustomer =
        created?.data || created;

      if (newCustomer) {
        setCustomers((prev) => [
          ...prev,
          newCustomer,
        ]);
      } else {
        await loadAll();
      }

      return newCustomer;
    },
    [loadAll]
  );

  const updateCustomer = useCallback(
    async (id, customer) => {
      const updated =
        await customerApi.update(
          id,
          customer
        );

      const updatedCustomer =
        updated?.data || updated;

      if (updatedCustomer) {
        setCustomers((prev) =>
          prev.map((item) =>
            item.id === id
              ? updatedCustomer
              : item
          )
        );
      } else {
        await loadAll();
      }

      return updatedCustomer;
    },
    [loadAll]
  );

  const deleteCustomer = useCallback(
    async (id) => {
      await customerApi.delete(id);

      setCustomers((prev) =>
        prev.filter((item) => item.id !== id)
      );
    },
    []
  );

  /* =========================================================
     PURCHASE ORDERS
     ========================================================= */

  const addPurchaseOrder = useCallback(
    async (purchaseOrder) => {
      const created =
        await purchaseOrderApi.create(
          purchaseOrder
        );

      const newOrder =
        created?.data || created;

      if (newOrder) {
        setPurchaseOrders((prev) => [
          ...prev,
          newOrder,
        ]);
      } else {
        await loadAll();
      }

      return newOrder;
    },
    [loadAll]
  );

  const updatePurchaseOrder = useCallback(
    async (id, purchaseOrder) => {
      const updated =
        await purchaseOrderApi.update(
          id,
          purchaseOrder
        );

      const updatedOrder =
        updated?.data || updated;

      if (updatedOrder) {
        setPurchaseOrders((prev) =>
          prev.map((item) =>
            item.id === id
              ? updatedOrder
              : item
          )
        );
      } else {
        await loadAll();
      }

      return updatedOrder;
    },
    [loadAll]
  );

  const deletePurchaseOrder = useCallback(
    async (id) => {
      await purchaseOrderApi.delete(id);

      setPurchaseOrders((prev) =>
        prev.filter((item) => item.id !== id)
      );
    },
    []
  );

  /* =========================================================
     SALES ORDERS
     ========================================================= */

  const addSalesOrder = useCallback(
    async (salesOrder) => {
      const created =
        await salesOrderApi.create(
          salesOrder
        );

      const newOrder =
        created?.data || created;

      if (newOrder) {
        setSalesOrders((prev) => [
          ...prev,
          newOrder,
        ]);
      } else {
        await loadAll();
      }

      return newOrder;
    },
    [loadAll]
  );

  const updateSalesOrder = useCallback(
    async (id, salesOrder) => {
      const updated =
        await salesOrderApi.update(
          id,
          salesOrder
        );

      const updatedOrder =
        updated?.data || updated;

      if (updatedOrder) {
        setSalesOrders((prev) =>
          prev.map((item) =>
            item.id === id
              ? updatedOrder
              : item
          )
        );
      } else {
        await loadAll();
      }

      return updatedOrder;
    },
    [loadAll]
  );

  const deleteSalesOrder = useCallback(
    async (id) => {
      await salesOrderApi.delete(id);

      setSalesOrders((prev) =>
        prev.filter((item) => item.id !== id)
      );
    },
    []
  );

  /* =========================================================
     INVENTORY
     ========================================================= */

  const adjustStock = useCallback(
    async (movement) => {
      const result =
        await inventoryApi.adjustStock(
          movement
        );

      /*
       * Inventory adjustments affect multiple pieces
       * of displayed data, so reload inventory after
       * the backend successfully processes the movement.
       */
      const [
        inventoryResponse,
        movementsResponse,
        productsResponse,
      ] = await Promise.all([
        inventoryApi.getAll(),
        inventoryApi.getMovements(),
        productApi.getAll(),
      ]);

      setStockLevels(
        extractList(inventoryResponse)
      );

      setStockMovements(
        extractList(movementsResponse)
      );

      setProducts(
        extractList(productsResponse)
      );

      return result;
    },
    [extractList]
  );

  /* =========================================================
     DERIVED DATA
     ========================================================= */

  const lowStockProducts = useMemo(() => {
    return products.filter((product) => {
      const onHand =
        Number(product.onHand ?? 0);

      const reorderLevel =
        Number(product.reorderLevel ?? 0);

      return (
        product.active !== false &&
        onHand <= reorderLevel
      );
    });
  }, [products]);

  const dashboardStats = useMemo(() => {
    const totalProducts =
      products.length;

    const totalWarehouses =
      warehouses.filter(
        (warehouse) =>
          warehouse.active !== false
      ).length;

    const lowStockCount =
      lowStockProducts.length;

    const openPurchaseOrders =
      purchaseOrders.filter(
        (order) =>
          order.status !== "RECEIVED" &&
          order.status !== "CANCELLED"
      ).length;

    const openSalesOrders =
      salesOrders.filter(
        (order) =>
          order.status !== "SHIPPED" &&
          order.status !== "CANCELLED"
      ).length;

    const stockValue =
      products.reduce(
        (sum, product) =>
          sum +
          Number(
            product.costPrice ?? 0
          ) *
            Number(
              product.onHand ?? 0
            ),
        0
      );

    return {
      totalProducts,
      totalWarehouses,
      lowStockCount,
      openPurchaseOrders,
      openSalesOrders,
      stockValue,
    };
  }, [
    products,
    warehouses,
    lowStockProducts,
    purchaseOrders,
    salesOrders,
  ]);

  const value = {
    products,
    warehouses,
    suppliers,
    customers,
    purchaseOrders,
    salesOrders,
    stockLevels,
    stockMovements,

    lowStockProducts,
    dashboardStats,

    loading,
    error,

    reload: loadAll,

    addProduct,
    updateProduct,
    deleteProduct,

    addWarehouse,
    updateWarehouse,
    deleteWarehouse,

    addSupplier,
    updateSupplier,
    deleteSupplier,

    addCustomer,
    updateCustomer,
    deleteCustomer,

    addPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,

    addSalesOrder,
    updateSalesOrder,
    deleteSalesOrder,

    adjustStock,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context =
    useContext(StoreContext);

  if (!context) {
    throw new Error(
      "useStore must be used within a StoreProvider"
    );
  }

  return context;
}
