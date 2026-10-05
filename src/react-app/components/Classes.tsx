import { Classes } from "../../types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { MapPin, Tag } from "lucide-react";

export function ClassCards({ data }: { data: Classes[] }) {
  const cardData = Map.groupBy(data, (cl) => cl.title);

  const cards = [...cardData.values()]
    .sort((a, b) => a[0].date.localeCompare(b[0].date))
    .map((items) => ClassCard(items));
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">{cards}</div>
  );
}

export function ClassCard(data: Classes[]) {
  // const title = Object.entries(data).map(([title]) => title)[0];
  const classData = data[0];
  const date = new Date(classData.date);
  const fmt = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
  });
  const fmtDate = fmt.format(date);

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Card className="cursor-pointer hover:bg-muted">
            <CardHeader>
              <CardTitle>{classData.title}</CardTitle>
              <CardDescription>{fmtDate}</CardDescription>
              <CardAction>
                <Badge>{classData.location}</Badge>
              </CardAction>
            </CardHeader>
          </Card>
        }
      />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{classData.title}</SheetTitle>
          <SheetDescription>
            <span>{fmtDate}</span>
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <div className="flex flex-row gap-1">
            <Badge>
              <MapPin data-icon="inline-start" />
              {classData.location}
            </Badge>
            <Badge>
              <Tag />
              {classData.type}
            </Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((std) => (
                <TableRow>
                  <TableCell>{std.student}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  );
}
