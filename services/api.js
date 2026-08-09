const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080";

const TOKEN_KEY = "ims.auth.token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    ...rest
  } = options;

  const token = getToken();

  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined && body !== null) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        method,
        headers: requestHeaders,
        body:
          body !== undefined && body !== null
            ? JSON.stringify(body)
            : undefined,
        ...rest,
      }
    );
  } catch (error) {
    throw new Error(
      "Unable to connect to the backend server."
    );
  }

  /*
   * 401 means the JWT is missing/expired/invalid.
   *
   * Do not automatically redirect from here because this
   * utility is also used by authentication requests.
   */
  if (response.status === 401) {
    const error = new Error(
      "Your session has expired. Please sign in again."
    );

    error.status = 401;

    throw error;
  }

  if (response.status === 403) {
    const error = new Error(
      "You do not have permission to perform this action."
    );

    error.status = 403;

    throw error;
  }

  /*
   * DELETE endpoints often return 204 No Content.
   */
  if (response.status === 204) {
    return null;
  }

  const contentType =
    response.headers.get("content-type") || "";

  let data = null;

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text = await response.text();
      data = text || null;
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    let message = "Request failed.";

    if (data) {
      if (typeof data === "string") {
        message = data;
      } else {
        message =
          data.message ||
          data.error ||
          data.detail ||
          data.title ||
          message;
      }
    }

    const error = new Error(message);
    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

/* =========================================================
   Generic HTTP helpers
   ========================================================= */

export const api = {
  get(path, options = {}) {
    return request(path, {
      ...options,
      method: "GET",
    });
  },

  post(path, body, options = {}) {
    return request(path, {
      ...options,
      method: "POST",
      body,
    });
  },

  put(path, body, options = {}) {
    return request(path, {
      ...options,
      method: "PUT",
      body,
    });
  },

  patch(path, body, options = {}) {
    return request(path, {
      ...options,
      method: "PATCH",
      body,
    });
  },

  delete(path, options = {}) {
    return request(path, {
      ...options,
      method: "DELETE",
    });
  },
};

/* =========================================================
   Authentication
   ========================================================= */

export const authApi = {
  login(credentials) {
    return api.post(
      "/api/auth/login",
      credentials
    );
  },

  register(data) {
    return api.post(
      "/api/auth/register",
      data
    );
  },
};

/* =========================================================
   Products
   ========================================================= */

export const productApi = {
  getAll() {
    return api.get("/api/products");
  },

  getById(id) {
    return api.get(`/api/products/${id}`);
  },

  create(product) {
    return api.post(
      "/api/products",
      product
    );
  },

  update(id, product) {
    return api.put(
      `/api/products/${id}`,
      product
    );
  },

  delete(id) {
    return api.delete(
      `/api/products/${id}`
    );
  },
};

/* =========================================================
   Inventory
   ========================================================= */

export const inventoryApi = {
  getAll() {
    return api.get("/api/inventory");
  },

  getByWarehouse(warehouseId) {
    return api.get(
      `/api/inventory/warehouse/${warehouseId}`
    );
  },

  adjustStock(movement) {
    return api.post(
      "/api/inventory/movements",
      movement
    );
  },

  getMovements() {
    return api.get(
      "/api/inventory/movements"
    );
  },
};

/* =========================================================
   Warehouses
   ========================================================= */

export const warehouseApi = {
  getAll() {
    return api.get("/api/warehouses");
  },

  getById(id) {
    return api.get(
      `/api/warehouses/${id}`
    );
  },

  create(warehouse) {
    return api.post(
      "/api/warehouses",
      warehouse
    );
  },

  update(id, warehouse) {
    return api.put(
      `/api/warehouses/${id}`,
      warehouse
    );
  },

  delete(id) {
    return api.delete(
      `/api/warehouses/${id}`
    );
  },
};

/* =========================================================
   Suppliers
   ========================================================= */

export const supplierApi = {
  getAll() {
    return api.get("/api/suppliers");
  },

  getById(id) {
    return api.get(
      `/api/suppliers/${id}`
    );
  },

  create(supplier) {
    return api.post(
      "/api/suppliers",
      supplier
    );
  },

  update(id, supplier) {
    return api.put(
      `/api/suppliers/${id}`,
      supplier
    );
  },

  delete(id) {
    return api.delete(
      `/api/suppliers/${id}`
    );
  },
};

/* =========================================================
   Customers
   ========================================================= */

export const customerApi = {
  getAll() {
    return api.get("/api/customers");
  },

  getById(id) {
    return api.get(
      `/api/customers/${id}`
    );
  },

  create(customer) {
    return api.post(
      "/api/customers",
      customer
    );
  },

  update(id, customer) {
    return api.put(
      `/api/customers/${id}`,
      customer
    );
  },

  delete(id) {
    return api.delete(
      `/api/customers/${id}`
    );
  },
};

/* =========================================================
   Purchase Orders
   ========================================================= */

export const purchaseOrderApi = {
  getAll() {
    return api.get(
      "/api/purchase-orders"
    );
  },

  getById(id) {
    return api.get(
      `/api/purchase-orders/${id}`
    );
  },

  create(order) {
    return api.post(
      "/api/purchase-orders",
      order
    );
  },

  update(id, order) {
    return api.put(
      `/api/purchase-orders/${id}`,
      order
    );
  },

  delete(id) {
    return api.delete(
      `/api/purchase-orders/${id}`
    );
  },
};

/* =========================================================
   Sales Orders
   ========================================================= */

export const salesOrderApi = {
  getAll() {
    return api.get(
      "/api/sales-orders"
    );
  },

  getById(id) {
    return api.get(
      `/api/sales-orders/${id}`
    );
  },

  create(order) {
    return api.post(
      "/api/sales-orders",
      order
    );
  },

  update(id, order) {
    return api.put(
      `/api/sales-orders/${id}`,
      order
    );
  },

  delete(id) {
    return api.delete(
      `/api/sales-orders/${id}`
    );
  },
};

/* =========================================================
   Dashboard
   ========================================================= */

export const dashboardApi = {
  getSummary() {
    return api.get(
      "/api/dashboard"
    );
  },
};

/* =========================================================
   Reports
   ========================================================= */

export const reportApi = {
  getReports() {
    return api.get(
      "/api/reports"
    );
  },

  getLowStock() {
    return api.get(
      "/api/reports/low-stock"
    );
  },

  getStockValuation() {
    return api.get(
      "/api/reports/stock-valuation"
    );
  },
};

/* =========================================================
   AI Assistant
   ========================================================= */

export const aiApi = {
  chat(message) {
    return api.post(
      "/api/ai/chat",
      { message }
    );
  },
};

export { API_BASE_URL };
