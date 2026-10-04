import { useAuth } from "@/context/AuthContext.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Invoices } from "@/components/Invoices.tsx";
import { SkeletonTable } from "@/components/Loading.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { useInvoices } from "@/context/InvoiceContext.tsx";

export function Home() {
  const { user, loading } = useAuth();
  const { loading: invLoading, error, data } = useInvoices();

  if (loading) {
    return <Spinner />; // TODO: later add a good loading state
  }
  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div>
      <h1>Hello {user?.name}!</h1>
      {invLoading ? (
        <SkeletonTable />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Open Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <Invoices data={data} filters={{ open: true, paid: false }} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
