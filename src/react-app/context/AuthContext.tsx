import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

interface User {
  email: string
  name: string
  membership_status: string
  stripe_id: string
  classes: boolean
}

interface AuthContextValue {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // if (import.meta.env.DEV) {
    //   setUser({
    //     email: "masarikfamilymichael@gmail.com",
    //     name: "Michael Masarik",
    //     membership_status: "full",
    //   })
    //   setLoading(false)
    //   return
    // }
    fetch("/api/me", { credentials: "include" })
      .then((r) => (r.ok ? (r.json() as Promise<User>) : Promise.reject()))
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
// eslint-disable-next-line react-refresh/only-export-components
export function logout() {
  if (import.meta.env.DEV) {
    window.location.href = "/login"
    return
  }
  window.location.href = "/auth/logout"
}