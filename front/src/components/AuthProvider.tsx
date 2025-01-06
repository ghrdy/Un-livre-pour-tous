import { createContext, useEffect, ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/lib/api/config";

const AuthContext = createContext<null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { refreshToken, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const refreshAccessToken = async () => {
      if (!refreshToken) return;

      try {
        const response = await fetch(`${API_URL}/users/token`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Token refresh failed");
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        logout();
        navigate("/login");
      }
    };

    // Refresh token when component mounts
    refreshAccessToken();

    // Set up periodic token refresh (every 14 minutes)
    const intervalId = setInterval(refreshAccessToken, 14 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [refreshToken, logout, navigate]);

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
}
