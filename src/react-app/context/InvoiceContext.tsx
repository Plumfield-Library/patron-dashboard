import { useQuery } from "@tanstack/react-query";
import { Invoice } from "../../types";
import { queryClient } from "@/lib/queries.ts";

async function fetchInvoices() {
  const resp = await fetch("/api/invoices");
  return (await resp.json()) as Invoice[];
}
export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
  });
}
export async function refreshInvoices(refreshing: (state: boolean) => void) {
  refreshing(true);
  await queryClient
    .invalidateQueries({ queryKey: ["invoices"] })
    .then(() => refreshing(false));
}
