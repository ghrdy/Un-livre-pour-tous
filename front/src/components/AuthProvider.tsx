import { createContext, useEffect, ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/lib/api/config";

const AuthContext = createContext<null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { accessToken, refreshToken, logout, setAccessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/users/status`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!data.loggedIn) {
          throw new Error("Not logged in");
        }

        // Si nous n'avons pas de token d'accès, essayons de le rafraîchir
        if (!accessToken) {
          const refreshResponse = await fetch(`${API_URL}/users/token`, {
            method: "POST",
            credentials: "include",
          });

          if (!refreshResponse.ok) {
            throw new Error("Token refresh failed");
          }

          const refreshData = await refreshResponse.json();
          if (refreshData.accessToken) {
            setAccessToken(refreshData.accessToken);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        logout();
        navigate("/login");
      }
    };

    checkAuthStatus();

    const intervalId = setInterval(checkAuthStatus, 14 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [accessToken, refreshToken, logout, navigate, setAccessToken]);

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
}
