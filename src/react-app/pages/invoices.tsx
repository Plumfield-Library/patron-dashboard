import { refreshInvoices, useInvoices } from "@/context/InvoiceContext.tsx";
import { SkeletonTable } from "@/components/Loading.tsx";

import { Invoices } from "@/components/Invoices.tsx";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { RefreshCw } from "lucide-react";

export function OpenInvoices() {
  const [refreshing, setRefreshing] = useState(false);
  const { isPending, error, data = [] } = useInvoices();

  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <div>
      <div className="flex justify-between items-center">
        <span className="text-xl">Open Invoices</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refreshInvoices(setRefreshing)}
        >
          <RefreshCw />
        </Button>
      </div>
      {isPending || refreshing ? (
        <SkeletonTable />
      ) : (
        <Invoices data={data} filters={{ open: true, paid: false }} />
      )}
    </div>
  );
}

export function AllInvoices() {
  const [refreshing, setRefreshing] = useState(false);
  const { isPending, error, data } = useInvoices();

  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <div>
      <div className="flex justify-between items-center">
        <span className="text-xl">All Invoices</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refreshInvoices(setRefreshing)}
        >
          <RefreshCw />
        </Button>
      </div>
      {isPending || refreshing ? (
        <SkeletonTable />
      ) : (
        <Invoices data={data} filters={{ open: true, paid: true }} />
      )}
    </div>
  );
}
