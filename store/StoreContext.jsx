import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { api } from "../api/api";

const StoreContext =
  createContext(null);

function asArray(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
}

function normalizeId(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return value;
  }

  return Number(value);
}

function normalizeProduct(item) {
  return {
    ...item,

    id: normalizeId(
      item.id ??
        item.productId
    ),

    productId:
      normalizeId(
        item.productId ??
          item.id
      ),

    sku:
      item.sku || "",

    name:
      item.name || "",

    category:
      item.category?.name ||
      item.category ||
      "",

    unit:
      item.unit?.abbreviation ||
      item.unit?.name ||
      item.unit ||
      "",

    costPrice:
      Number(
        item.costPrice ??
          item.cost_price ??
          0
      ),

    sellPrice:
      Number(
        item.sellPrice ??
          item.sell_price ??
          0
      ),

    onHand:
      Number(
        item.onHand ??
          item.on_hand ??
          item.quantity ??
          0
      ),

    reorderLevel:
      Number(
        item.reorderLevel ??
          item.reorder_level ??
          0
      ),

    active:
      item.active !== false,
  };
}

function normalizeWarehouse(item) {
  return {
    ...item,

    id: normalizeId(
      item.id ??
        item.warehouseId
    ),

    warehouseId:
      normalizeId(
        item.warehouseId ??
          item.id
      ),

    name:
      item.name || "",

    code:
      item.code || "",

    location:
      item.location || "",

    active:
      item.active !== false,
  };
}

function normalizeSupplier(item) {
  return {
    ...item,

    id: normalizeId(
      item.id ??
        item.supplierId
    ),

    supplierId:
      normalizeId(
        item.supplierId ??
          item.id
      ),

    name:
      item.name || "",

    email:
      item.email || "",

    phone:
      item.phone || "",

    active:
      item.active !== false,
  };
}

function normalizeCustomer(item) {
  return {
    ...item,

    id: normalizeId(
      item.id ??
        item.customerId
    ),

    customerId:
      normalizeId(
        item.customerId ??
          item.id
      ),

    name:
      item.name || "",

    email:
      item.email || "",

    phone:
      item.phone || "",
  };
}

function normalizeOrder(item) {
  return {
    ...item,

    id: normalizeId(
      item.id ??
        item.orderId
    ),

    total:
      Number(
        item.total ?? 0
      ),

    status:
      item.status ||
      "DRAFT",
  };
}

function normalizeStock(item) {
  return {
    ...item,

    id: normalizeId(
      item.id ??
        item.inventoryId
    ),

    productId:
      normalizeId(
        item.productId ??
          item.product?.id
      ),

    warehouseId:
      normalizeId(
        item.warehouseId ??
          item.warehouse?.id
      ),

    sku:
      item.sku ||
      item.product?.sku ||
      "",

    name:
      item.name ||
      item.product?.name ||
      "",

    quantity:
      Number(
        item.quantity ??
          item.onHand ??
          0
      ),

    reserved:
      Number(
        item.reserved ?? 0
      ),
  };
}

function normalizeMovement(item) {
  return {
    ...item,

    id: normalizeId(
      item.id ??
        item.movementId
    ),

    productId:
      normalizeId(
        item.productId ??
          item.product?.id
      ),

    warehouseId:
      normalizeId(
        item.warehouseId ??
          item.warehouse?.id
      ),

    sku:
      item.sku ||
      item.product?.sku ||
      "",

    name:
      item.name ||
      item.product?.name ||
      "",

    quantity:
      Number(
        item.quantity ?? 0
      ),

    type:
      item.type || "",

    ref:
      item.ref ||
      item.reference ||
      "",

    by:
      item.by ||
      item.createdBy ||
      "",
  };
}

function unwrapEntity(data) {
  return (
    data?.data ||
    data?.content ||
    data
  );
}

export function StoreProvider({
  children,
}) {
  const [products, setProducts] =
    useState([]);

  const [warehouses, setWarehouses] =
    useState([]);

  const [suppliers, setSuppliers] =
    useState([]);

  const [customers, setCustomers] =
    useState([]);

  const [
    purchaseOrders,
    setPurchaseOrders,
  ] = useState([]);

  const [
    salesOrders,
    setSalesOrders,
  ] = useState([]);

  const [
    stockLevels,
    setStockLevels,
  ] = useState([]);

  const [
    stockMovements,
    setStockMovements,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadAll = async () => {
    setLoading(true);
    setError("");

    try {
      const results =
        await Promise.allSettled([
          api.get("/api/products"),
          api.get("/api/warehouses"),
          api.get("/api/suppliers"),
          api.get("/api/customers"),
          api.get("/api/purchase-orders"),
          api.get("/api/sales-orders"),
          api.get("/api/inventory"),
          api.get(
            "/api/inventory/movements"
          ),
        ]);

      const [
        productResult,
        warehouseResult,
        supplierResult,
        customerResult,
        purchaseResult,
        salesResult,
        inventoryResult,
        movementResult,
      ] = results;

      /*
       * We intentionally handle each collection
       * independently.
       *
       * One unavailable optional endpoint should
       * not erase all other working data.
       */
      if (
        productResult.status ===
        "fulfilled"
      ) {
        setProducts(
          asArray(
            productResult.value
          ).map(
            normalizeProduct
          )
        );
      }

      if (
        warehouseResult.status ===
        "fulfilled"
      ) {
        setWarehouses(
          asArray(
            warehouseResult.value
          ).map(
            normalizeWarehouse
          )
        );
      }

      if (
        supplierResult.status ===
        "fulfilled"
      ) {
        setSuppliers(
          asArray(
            supplierResult.value
          ).map(
            normalizeSupplier
          )
        );
      }

      if (
        customerResult.status ===
        "fulfilled"
      ) {
        setCustomers(
          asArray(
            customerResult.value
          ).map(
            normalizeCustomer
          )
        );
      }

      if (
        purchaseResult.status ===
        "fulfilled"
      ) {
        setPurchaseOrders(
          asArray(
            purchaseResult.value
          ).map(
            normalizeOrder
          )
        );
      }

      if (
        salesResult.status ===
        "fulfilled"
      ) {
        setSalesOrders(
          asArray(
            salesResult.value
          ).map(
            normalizeOrder
          )
        );
      }

      if (
        inventoryResult.status ===
        "fulfilled"
      ) {
        setStockLevels(
          asArray(
            inventoryResult.value
          ).map(
            normalizeStock
          )
        );
      }

      if (
        movementResult.status ===
        "fulfilled"
      ) {
        setStockMovements(
          asArray(
            movementResult.value
          ).map(
            normalizeMovement
          )
        );
      }

      const failures =
        results.filter(
          (result) =>
            result.status ===
            "rejected"
        );

      if (
        failures.length ===
          results.length &&
        results.length > 0
      ) {
        throw (
          failures[0].reason ||
          new Error(
            "Unable to load application data."
          )
        );
      }
    } catch (err) {
      console.error(
        "Failed to load IMS data:",
        err
      );

      setError(
        err?.message ||
          "Unable to load application data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const addProduct =
    async (product) => {
      const response =
        await api.post(
          "/api/products",
          product
        );

      const created =
        normalizeProduct(
          unwrapEntity(response)
        );

      setProducts(
        (previous) => [
          created,
          ...previous,
        ]
      );

      return created;
    };

  const updateProduct =
    async (
      id,
      product
    ) => {
      const response =
        await api.put(
          `/api/products/${id}`,
          product
        );

      const updated =
        normalizeProduct(
          unwrapEntity(response)
        );

      setProducts(
        (previous) =>
          previous.map(
            (item) =>
              item.id ===
              Number(id)
                ? updated
                : item
          )
      );

      return updated;
    };

  const deleteProduct =
    async (id) => {
      await api.delete(
        `/api/products/${id}`
      );

      setProducts(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !==
              Number(id)
          )
      );
    };

  const addWarehouse =
    async (warehouse) => {
      const response =
        await api.post(
          "/api/warehouses",
          warehouse
        );

      const created =
        normalizeWarehouse(
          unwrapEntity(response)
        );

      setWarehouses(
        (previous) => [
          created,
          ...previous,
        ]
      );

      return created;
    };

  const addSupplier =
    async (supplier) => {
      const response =
        await api.post(
          "/api/suppliers",
          supplier
        );

      const created =
        normalizeSupplier(
          unwrapEntity(response)
        );

      setSuppliers(
        (previous) => [
          created,
          ...previous,
        ]
      );

      return created;
    };

  const addCustomer =
    async (customer) => {
      const response =
        await api.post(
          "/api/customers",
          customer
        );

      const created =
        normalizeCustomer(
          unwrapEntity(response)
        );

      setCustomers(
        (previous) => [
          created,
          ...previous,
        ]
      );

      return created;
    };

  const addPurchaseOrder =
    async (order) => {
      const response =
        await api.post(
          "/api/purchase-orders",
          order
        );

      const created =
        normalizeOrder(
          unwrapEntity(response)
        );

      setPurchaseOrders(
        (previous) => [
          created,
          ...previous,
        ]
      );

      return created;
    };

  const addSalesOrder =
    async (order) => {
      const response =
        await api.post(
          "/api/sales-orders",
          order
        );

      const created =
        normalizeOrder(
          unwrapEntity(response)
        );

      setSalesOrders(
        (previous) => [
          created,
          ...previous,
        ]
      );

      return created;
    };

  const adjustStock =
    async (movement) => {
      const response =
        await api.post(
          "/api/inventory/movements",
          movement
        );

      /*
       * Reload inventory-related collections after
       * the backend transaction completes.
       *
       * This is important because stock adjustment
       * changes more than one piece of state.
       */
      const [
        productsResponse,
        inventoryResponse,
        movementsResponse,
      ] = await Promise.all([
        api.get("/api/products"),
        api.get("/api/inventory"),
        api.get(
          "/api/inventory/movements"
        ),
      ]);

      setProducts(
        asArray(
          productsResponse
        ).map(
          normalizeProduct
        )
      );

      setStockLevels(
        asArray(
          inventoryResponse
        ).map(
          normalizeStock
        )
      );

      setStockMovements(
        asArray(
          movementsResponse
        ).map(
          normalizeMovement
        )
      );

      return response;
    };

  const lowStockProducts =
    useMemo(
      () =>
        products.filter(
          (product) =>
            product.active &&
            Number(
              product.onHand
            ) <=
              Number(
                product.reorderLevel
              )
        ),
      [products]
    );

  const dashboardStats =
    useMemo(
      () => ({
        totalProducts:
          products.length,

        totalWarehouses:
          warehouses.filter(
            (warehouse) =>
              warehouse.active
          ).length,

        lowStockCount:
          lowStockProducts.length,

        openPurchaseOrders:
          purchaseOrders.filter(
            (order) =>
              ![
                "RECEIVED",
                "CANCELLED",
              ].includes(
                String(
                  order.status ||
                    ""
                ).toUpperCase()
              )
          ).length,

        openSalesOrders:
          salesOrders.filter(
            (order) =>
              ![
                "SHIPPED",
                "CANCELLED",
              ].includes(
                String(
                  order.status ||
                    ""
                ).toUpperCase()
              )
          ).length,

        stockValue:
          products.reduce(
            (sum, product) =>
              sum +
              Number(
                product.costPrice ||
                  0
              ) *
                Number(
                  product.onHand ||
                    0
                ),
            0
          ),
      }),
      [
        products,
        warehouses,
        lowStockProducts,
        purchaseOrders,
        salesOrders,
      ]
    );

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
    addSupplier,
    addCustomer,

    addPurchaseOrder,
    addSalesOrder,

    adjustStock,
  };

  return (
    <StoreContext.Provider
      value={value}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context =
    useContext(
      StoreContext
    );

  if (!context) {
    throw new Error(
      "useStore must be used within a StoreProvider"
    );
  }

  return context;
}
