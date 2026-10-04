import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { hc } from "hono/client";
import type { ApiMe } from "../../worker/api.ts";
import type { User } from "../../types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const client = hc<ApiMe>("/api/");

  const fetchUser = useCallback(async () => {
    try {
      const clientResp = await client.me.$get();
      // const res = await fetch("/api/me", { credentials: "include" });
      // setUser(res.ok ? await res.json() : null);
      if (clientResp.status == 200) {
        const body = await clientResp.json();
        setUser(body);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [client.me]);
  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, loading, refetch: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
// eslint-disable-next-line react-refresh/only-export-components
export async function logout() {
  await fetch("/auth/logout", {
    method: "POST",
  });
  window.location.href = "/login";
}
