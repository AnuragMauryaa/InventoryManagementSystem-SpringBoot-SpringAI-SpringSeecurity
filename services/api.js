const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080";

const TOKEN_KEY = "ims.auth.token";

function getToken() {
  return localStorage.getItem(
    TOKEN_KEY
  );
}

function buildUrl(path) {
  const base =
    API_BASE_URL.replace(/\/+$/, "");

  const endpoint =
    path.startsWith("/")
      ? path
      : `/${path}`;

  return `${base}${endpoint}`;
}

async function request(
  path,
  options = {}
) {
  const token = getToken();

  const headers = {
    Accept: "application/json",
    ...(options.body
      ? {
          "Content-Type":
            "application/json",
        }
      : {}),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(
      buildUrl(path),
      {
        ...options,
        headers,
      }
    );
  } catch (error) {
    throw new Error(
      "Unable to connect to the backend. Please check that the server is running."
    );
  }

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  let data = null;

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text =
        await response.text();

      data = text || null;
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      data?.detail ||
      (
        typeof data === "string"
          ? data
          : null
      ) ||
      `Request failed with status ${response.status}.`;

    const error =
      new Error(message);

    error.status =
      response.status;

    error.data = data;

    /*
     * A 401 means the JWT is no longer
     * accepted by the backend.
     *
     * Do not automatically redirect here.
     * AuthContext/RequireAuth owns navigation.
     */
    if (response.status === 401) {
      localStorage.removeItem(
        TOKEN_KEY
      );
    }

    throw error;
  }

  return data;
}

export const api = {
  get(path) {
    return request(path, {
      method: "GET",
    });
  },

  post(path, body) {
    return request(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put(path, body) {
    return request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  patch(path, body) {
    return request(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  delete(path) {
    return request(path, {
      method: "DELETE",
    });
  },
};

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
