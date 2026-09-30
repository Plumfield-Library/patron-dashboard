import { useAuth } from "@/context/AuthContext.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";

export function Home() {
  const { user, loading } = useAuth();
  if (loading) {
    return <Spinner />; // TODO: later add a good loading state
  }
  return (
    <div>
      <h1>Hello {user?.name}!</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {user ? JSON.stringify(user) : "No User Object"}
      </div>
    </div>
  );
}
