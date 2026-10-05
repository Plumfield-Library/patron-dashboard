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
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "@/components/ui/toast.tsx";
import { FilloutSliderEmbed } from "@fillout/react";

export function Home() {
  const { user, loading } = useAuth();
  const { isPending: invLoading, error, data } = useInvoices();
  const [refreshing, setRefreshing] = useState(false);
  const [filloutOpen, setFilloutOpen] = useState(false);
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
      <div className="grid grid-cols-1 lg:grid-cols-2 pt-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Libib Credentials</CardTitle>
            <CardAction>
              <Button
                render={
                  <a
                    href="https://libib.com/u/plumfieldlibrary"
                    className="text-primary"
                  />
                }
              >
                <ArrowUpRight data-icon={"inline-start"} />
                Libib
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent>
            <a
              href="https://libib.com/u/plumfieldlibrary"
              className="text-primary"
            >
              https://libib.com/u/plumfieldlibrary
            </a>
            <p>
              <span className="font-bold">Reminder</span>: If you’ve forgotten
              your Libib password, use this link to reset it
            </p>
            <Button
              className="mt-4"
              render={
                <a
                  href={
                    "https://www.libib.com/u/plumfieldlibrary/forgot-password"
                  }
                />
              }
            >
              Reset Libib Password
            </Button>
            <p>
              Log in using:{" "}
              <span
                onClick={copyText}
                className="text-primary cursor-pointer hover:underline hover:decoration-dashed hover:decoration-primary hover:underline-offset-2 hover:decoration-2"
              >
                {user?.email}
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Interlibrary Loan</CardTitle>
            <CardAction>
              <Button onClick={() => setFilloutOpen(true)}>
                Interlibrary Loan
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p>
              To interlibrary loan books, fill out the once per book you would
              like to interlibrary loan. For more information,{" "}
              <a
                className="text-primary"
                href="https://plumfieldlibrary.com/library-policies/interlibrary-loan"
              >
                read this article.
              </a>
            </p>

            <FilloutSliderEmbed
              isOpen={filloutOpen}
              onClose={() => setFilloutOpen(false)}
              filloutId={"ugpB1EGK5Bus"}
              parameters={{ email: user?.email, name: user?.name }}
            />
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Library Locations</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="flex flex-col">
            <span className="text-primary font-bold">Main Library</span>
            <a href="https://maps.app.goo.gl/Yz1Q1QpiEsQ4GdyXA">
              5735 Aspen Ct, Denmark, WI 54208
            </a>
          </div>
          <div className="flex flex-col">
            <span className="text-primary font-bold">Shire Branch</span>
            <a href="https://maps.app.goo.gl/ZXhpdzzYo4b7Qheh7">
              8924 S Chase Rd, Pulaski, WI 54162
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
