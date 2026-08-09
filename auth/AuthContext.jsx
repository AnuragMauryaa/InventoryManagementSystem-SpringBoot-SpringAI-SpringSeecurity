import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8080';

const TOKEN_KEY = 'ims.auth.token';
const USER_KEY = 'ims.auth.user';

/*
 * Backend role -> frontend permission mapping.
 *
 * The backend remains the real authority because Spring Security
 * protects the API. These permissions are only used to control
 * what buttons/actions are displayed in the UI.
 */
const PERMISSIONS = {
  ADMIN: ['view', 'create', 'edit', 'adjust', 'manageUsers'],
  MANAGER: ['view', 'create', 'edit', 'adjust'],
  STAFF: ['view'],
};

function normalizeRole(role) {
  if (!role) return '';

  const value = String(role)
    .replace('ROLE_', '')
    .replace('role_', '')
    .toUpperCase();

  return value;
}

function normalizeUser(data, fallbackUsername = '') {
  if (!data) return null;

  /*
   * The backend may return the user directly or wrap it.
   * Supporting both formats makes the frontend less fragile.
   */
  const user = data.user || data;

  const username =
    user.username ||
    user.userName ||
    user.name ||
    fallbackUsername;

  const fullName =
    user.fullName ||
    user.full_name ||
    user.name ||
    username;

  const role = normalizeRole(
    user.role ||
      user.roleType ||
      user.authority ||
      user.userRole
  );

  return {
    ...user,
    username,
    name: fullName,
    fullName,
    role,
  };
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = useState(getStoredUser);

  const [loading, setLoading] = useState(true);

  /*
   * Restore the session after refreshing the browser.
   *
   * We do NOT trust the stored user for authorization.
   * The JWT is sent to the backend, and the backend remains
   * responsible for deciding whether the token is valid.
   */
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        /*
         * Your backend protects all normal APIs.
         * /api/auth/me is preferred if your backend exposes it.
         *
         * If it doesn't exist yet, the token is still retained and
         * the actual protected API calls will validate it.
         */
        const response = await fetch(
          `${API_BASE_URL}/api/auth/me`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${storedToken}`,
              Accept: 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const restoredUser = normalizeUser(data);

          setUser(restoredUser);
          localStorage.setItem(
            USER_KEY,
            JSON.stringify(restoredUser)
          );
        } else if (response.status === 401 || response.status === 403) {
          /*
           * Token is no longer valid.
           */
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        /*
         * Do not immediately destroy a valid token just because
         * the backend is temporarily unavailable.
         */
        console.error('Unable to restore authentication session:', error);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  /*
   * LOGIN
   */
  const login = async (username, password) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            username: username.trim(),
            password,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        return {
          ok: false,
          error:
            data.message ||
            data.error ||
            'Invalid username or password.',
        };
      }

      /*
       * Support the common JWT response names:
       * token
       * accessToken
       * jwt
       */
      const receivedToken =
        data.token ||
        data.accessToken ||
        data.jwt ||
        data.access_token;

      if (!receivedToken) {
        console.error(
          'Login succeeded but backend did not return a JWT:',
          data
        );

        return {
          ok: false,
          error: 'Login succeeded but no authentication token was returned.',
        };
      }

      const loggedInUser = normalizeUser(
        data.user || data,
        username.trim()
      );

      localStorage.setItem(TOKEN_KEY, receivedToken);
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(loggedInUser)
      );

      setToken(receivedToken);
      setUser(loggedInUser);

      return {
        ok: true,
        user: loggedInUser,
        token: receivedToken,
      };
    } catch (error) {
      console.error('Login request failed:', error);

      return {
        ok: false,
        error:
          'Unable to connect to the server. Please try again.',
      };
    }
  };

  /*
   * REGISTER
   */
  const register = async (registrationData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(registrationData),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        return {
          ok: false,
          error:
            data.message ||
            data.error ||
            'Registration failed.',
        };
      }

      /*
       * Some backends automatically log the user in after
       * registration and return a JWT.
       *
       * If your backend only returns a success message,
       * we simply report successful registration and let the
       * registration page redirect to login.
       */
      const receivedToken =
        data.token ||
        data.accessToken ||
        data.jwt ||
        data.access_token;

      if (receivedToken) {
        const registeredUser = normalizeUser(
          data.user || data,
          registrationData.username
        );

        localStorage.setItem(TOKEN_KEY, receivedToken);
        localStorage.setItem(
          USER_KEY,
          JSON.stringify(registeredUser)
        );

        setToken(receivedToken);
        setUser(registeredUser);

        return {
          ok: true,
          authenticated: true,
          user: registeredUser,
        };
      }

      return {
        ok: true,
        authenticated: false,
        message:
          data.message ||
          'Registration successful. Please sign in.',
      };
    } catch (error) {
      console.error('Registration request failed:', error);

      return {
        ok: false,
        error:
          'Unable to connect to the server. Please try again.',
      };
    }
  };

  /*
   * LOGOUT
   */
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  };

  /*
   * UI permission helper.
   *
   * Again: this does NOT replace backend authorization.
   * Spring Security must still reject unauthorized requests.
   */
  const can = (action) => {
    if (!user) return false;

    const role = normalizeRole(user.role);

    return PERMISSIONS[role]?.includes(action) ?? false;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    can,
    apiBaseUrl: API_BASE_URL,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}
