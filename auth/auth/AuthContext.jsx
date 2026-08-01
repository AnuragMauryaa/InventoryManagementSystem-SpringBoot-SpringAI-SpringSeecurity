import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "ims.auth.user";
const TOKEN_KEY = "token";

const PERMISSIONS = {
    ADMIN: ["view", "create", "edit", "adjust", "manageUsers", "approve"],
    MANAGER: ["view", "create", "edit", "adjust"],
    STAFF: ["view"],
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        else
            localStorage.removeItem(STORAGE_KEY);
    }, [user]);

    const toUser = (profile) => ({
        name: profile.fullName || profile.name || profile.username,
        username: profile.username,
        role: profile.role,
    });

    const getErrorMessage = (error, fallback) =>
        error?.response?.data?.message || error?.response?.data || error?.message || fallback;

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    };

    useEffect(() => {
        const restoreSession = async () => {
            if (!localStorage.getItem(TOKEN_KEY)) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await api.get("/auth/me");
                setUser(toUser(response.data));
            } catch {
                logout();
            } finally {
                setIsLoading(false);
            }
        };
        restoreSession();
    }, []);

    useEffect(() => {
        const handleUnauthorized = () => logout();
        window.addEventListener("ims:unauthorized", handleUnauthorized);
        return () => window.removeEventListener("ims:unauthorized", handleUnauthorized);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post("/auth/login", {
                username,
                password,
            });
            const data = response.data;
            localStorage.setItem(TOKEN_KEY, data.token);
            const me = await api.get("/auth/me");
            setUser(toUser(me.data));
            return {
                ok: true,
            };
        } catch (e) {
            return {
                ok: false,
                error: getErrorMessage(e, "Invalid username or password"),
            };
        }
    };

    const register = async (registration) => {
        try {
            const response = await api.post("/auth/register", registration);
            return { ok: true, data: response.data };
        } catch (error) {
            return { ok: false, error: getErrorMessage(error, "Unable to create the account.") };
        }
    };

    const can = (action) => {
        if (!user)
            return false;
        return PERMISSIONS[user.role]?.includes(action);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                logout,
                can,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}