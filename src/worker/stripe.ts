import type Stripe from "stripe";
import { z } from "@hono/zod-openapi";

export const InvoiceModel = z.object({
  invoice_id: z.string(),
  url: z.string().nullable(),
  date: z.string().nullable(),
  total: z.number(),
});
export const InvoiceResponseModel = z.array(InvoiceModel);
type Invoice = z.infer<typeof InvoiceModel>;

export async function get_all_invoices(
  client: Stripe,
  stripe_id: string,
): Promise<null | Invoice[]> {
  const invoices = await client.invoices.list({
    customer: stripe_id,
  });
  if (invoices.data.length == 0) {
    return null;
  }
  return invoices.data
    .filter((inv) => (inv.status = "open"))
    .map((inv) => ({
      invoice_id: inv.id,
      url: inv.hosted_invoice_url ?? "",
      date: inv.due_date ? new Date(inv.due_date * 1000).toISOString() : null,
      total: inv.total / 100,
    }));
}
