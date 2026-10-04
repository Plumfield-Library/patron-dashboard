import { useQuery } from "@tanstack/react-query";
import { Invoice } from "../../types";
import { createContext, type ReactNode, useContext, useMemo } from "react";

interface InvoiceContextValues {
  loading: boolean;
  error: string | null;
  data: Invoice[];
}
const InvoiceContext = createContext<InvoiceContextValues | undefined>(
  undefined,
);

async function fetchInvoices() {
  const resp = await fetch("/api/invoices");
  return (await resp.json()) as Invoice[];
}

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const { isPending, data, error } = useQuery({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
  });

  const value = useMemo(
    () => ({
      loading: isPending,
      error: error?.message ?? null,
      data: data ?? [],
    }),
    [isPending, error, data],
  );

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
}

export function useInvoices(): InvoiceContextValues {
  const ctx = useContext(InvoiceContext);
  if (ctx === undefined) {
    throw new Error("useInvoices must be used within an InvoiceProvider");
  }
  return ctx;
}
