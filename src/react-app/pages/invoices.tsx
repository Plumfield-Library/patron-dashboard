import { useInvoices } from "@/context/InvoiceContext.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { SkeletonTable } from "@/components/Loading.tsx";

import { Invoices } from "@/components/Invoices.tsx";

export function OpenInvoices() {
  const { loading, error, data } = useInvoices();

  if (loading) {
    return <Spinner />; // TODO: later add a good loading state
  }
  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div>
      <h1>Open Invoices</h1>
      {loading ? (
        <SkeletonTable />
      ) : (
        <Invoices data={data} filters={{ open: true, paid: false }} />
      )}
    </div>
  );
}

export function AllInvoices() {
  const { loading, error, data } = useInvoices();

  if (loading) {
    return <Spinner />; // TODO: later add a good loading state
  }
  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div>
      <h1>Open Invoices</h1>
      {loading ? (
        <SkeletonTable />
      ) : (
        <Invoices data={data} filters={{ open: true, paid: true }} />
      )}
    </div>
  );
}
