import { IllTitle } from "../../types";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";

export function ILLTotals({ data }: { data: IllTitle[] }) {
  const groupedData = Map.groupBy(data, (cl) => cl.status);
  const pending = groupedData.get("In Process");
  const pendingCount = pending ? pending.length : 0;
  const advancedHold = groupedData.get("Advanced Hold");
  const advdCount = advancedHold ? advancedHold.length : 0;
  const reqRec = groupedData.get("Request Received");
  const reqRecCount = reqRec ? reqRec.length : 0;
  const available = groupedData.get("Available");
  const avCount = available ? available.length : 0;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Status</TableCell>
          <TableCell>Count</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <Badge className="bg-green-700">Available</Badge>
          </TableCell>
          <TableCell>{avCount}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Badge className="bg-amber-400">In Process</Badge>
          </TableCell>
          <TableCell>{pendingCount}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Badge className="bg-orange-600">Request Received</Badge>
          </TableCell>
          <TableCell>{reqRecCount}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Badge className="bg-purple-700">Advanced Hold</Badge>
          </TableCell>
          <TableCell>{advdCount}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
function StatusBadge({ status }: { status: string }) {
  if (status == "Available") {
    return <Badge className="bg-green-700">Available</Badge>;
  }
  if (status == "In Process") {
    return <Badge className="bg-amber-400">In Process</Badge>;
  }
  if (status == "Advanced Hold") {
    return <Badge className="bg-purple-700">Advanced Hold</Badge>;
  }
  return <Badge className="bg-orange-600">Request Received</Badge>;
}
function LocationBadge({ loc }: { loc: string }) {
  if (loc == "Shire") {
    return <Badge className="bg-green-800">Shire</Badge>;
  }
  return <Badge className="bg-primary">Main</Badge>;
}
export function ILLTable({ data }: { data: IllTitle[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Location</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((r) => (
          <TableRow>
            <TableCell>{r.title}</TableCell>
            <TableCell>
              <StatusBadge status={r.status} />
            </TableCell>
            <TableCell>
              <LocationBadge loc={r.location} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
