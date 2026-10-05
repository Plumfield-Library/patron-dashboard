import { useAuth } from "@/context/AuthContext.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Invoices } from "@/components/Invoices.tsx";
import { SkeletonTable } from "@/components/Loading.tsx";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { refreshInvoices, useInvoices } from "@/context/InvoiceContext.tsx";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "@/components/ui/toast.tsx";

export function Home() {
  const { user, loading } = useAuth();
  const { isPending: invLoading, error, data } = useInvoices();
  const [refreshing, setRefreshing] = useState(false);

  if (loading) {
    return <Spinner />; // TODO: later add a good loading state
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  async function copyText() {
    try {
      await navigator.clipboard.writeText(user?.email ?? "");
      toast.add({
        type: "success",
        description: "Copied email to clipboard!",
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }
  return (
    <div>
      <h1>Hello {user?.name}!</h1>
      {invLoading || refreshing ? (
        <SkeletonTable />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Open Invoices</CardTitle>
            <CardAction>
              <Button
                variant="outline"
                size="icon"
                onClick={() => refreshInvoices(setRefreshing)}
              >
                <RefreshCw />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Invoices data={data} filters={{ open: true, paid: false }} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
