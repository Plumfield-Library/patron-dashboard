import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invoice } from "../../types";
import { Badge } from "@/components/ui/badge.tsx";

export function Invoices({
  data,
  filters,
}: {
  data: Invoice[];
  filters: { open: boolean; paid: boolean };
}) {
  const openInv = data.filter((inv) => inv.status == "open");
  const paidInv = data.filter((inv) => inv.status == "paid");
  const renderedInv: Invoice[] = [];
  if (filters.open) {
    renderedInv.push(...openInv);
  }
  if (filters.paid) {
    renderedInv.push(...paidInv);
  }
  renderedInv.sort((a, b) => b.date?.localeCompare(a.date));
  if (renderedInv.length == 0) {
    return (
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No invoices found!
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
  const Rows = renderedInv.map((inv) => (
    <TableRow>
      <TableCell>
        <a href={inv.url ?? "#"}>{inv.invoice_id}</a>
      </TableCell>
      <TableCell>
        {inv.status == "open" ? (
          <Badge>Open</Badge>
        ) : (
          <Badge variant={"outline"}>Paid</Badge>
        )}
      </TableCell>
      <TableCell>{inv.date.split("T")[0]}</TableCell>
      <TableCell className={"text-right"}>${inv.total}</TableCell>
    </TableRow>
  ));
  let due = 0;
  renderedInv.forEach((inv) => {
    if (inv.status == "open") {
      due += inv.total;
    }
  });
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-25">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Due</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{Rows}</TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Due</TableCell>
          <TableCell className="text-right">${due}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
