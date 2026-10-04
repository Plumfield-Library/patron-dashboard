import type Stripe from "stripe";
import { Invoice } from "../types";

export async function get_all_invoices(
  client: Stripe,
  stripe_id: string,
): Promise<null | Invoice[]> {
  const invoices = await client.invoices.list({
    customer: stripe_id,
  });
  console.log("request for: ", stripe_id);
  if (invoices.data.length == 0) {
    return null;
  }
  return invoices.data
    .filter((inv) => ["open", "paid"].includes(inv.status ?? ""))
    .map((inv) => ({
      invoice_id: inv.number ?? "",
      url: inv.hosted_invoice_url ?? "",
      date: inv.due_date ? new Date(inv.due_date * 1000).toISOString() : "",
      total: inv.total / 100,
      status: inv.status || "open",
    }));
}
