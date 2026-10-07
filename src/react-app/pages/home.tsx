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
  CardDescription,
} from "@/components/ui/card.tsx";
import { refreshInvoices, useInvoices } from "@/context/InvoiceContext.tsx";
import { useState } from "react";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "@/components/ui/toast.tsx";
import { useILL } from "@/context/ILLContext.ts";
import { ILLTotals } from "@/components/interlibraryloan.tsx";
import { useNavigate } from "react-router-dom";

export function Home() {
  const { data: user, isPending: loading } = useAuth();
  const { isPending: invLoading, error, data } = useInvoices();
  const { isPending: illLoading, error: IllError, data: IllData } = useILL();
  const [refreshing, setRefreshing] = useState(false);
  const router = useNavigate();

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
            <CardTitle>Book Catalog</CardTitle>
            <CardDescription className="mt-2">
              This is the place where you can place holds, view your checkouts,
              and search the library card catalog. <strong>Reminder: </strong>
              there are no renewals, you renewal was built into your 45 day
              checkout
            </CardDescription>
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
              <Button onClick={() => router("/interlibrary-loan")}>
                Interlibrary Loan
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p>
              To interlibrary loan books, fill out the form once per book you
              would like to interlibrary loan. For more information,{" "}
              <a
                className="text-primary"
                href="https://plumfieldlibrary.com/library-policies/interlibrary-loan"
              >
                read this article.
              </a>
            </p>
            {illLoading || IllError ? (
              <SkeletonTable />
            ) : (
              <ILLTotals data={IllData} />
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
          <CardDescription className={"flex flex-col"}>
            <strong>Regarding Main:</strong>
            <span>
              The Main library is open Thursdays from 12:00 - 5:30 and the first
              and third Tuesdays from 1:00 to 2:30. On Tuesdays, drop-ins are
              welcome. To pickup holds, 48 hours notice is required
            </span>
            <br />
            <strong>Regarding Shire:</strong>
            <span>Text or Call Morgan to schedule an appointment!</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-primary font-bold">Main Library</span>
              <a href="https://maps.app.goo.gl/Yz1Q1QpiEsQ4GdyXA">
                5735 Aspen Ct, Denmark, WI 54208
              </a>
              <span className="text-primary">
                plumfieldlivinglibrary@gmail.com
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-primary font-bold">Shire Branch</span>
              <a href="https://maps.app.goo.gl/ZXhpdzzYo4b7Qheh7">
                8924 S Chase Rd, Pulaski, WI 54162
              </a>
              <span className="text-primary">(920) 664-0805</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
