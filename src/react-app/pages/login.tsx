import { BookOpenIcon, Mail, XIcon } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import React, { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner.tsx";
import { toast } from "@/components/ui/toast.tsx";
import { Navigate } from "react-router-dom";

async function handleSubmit(
  e: React.FormEvent<HTMLFormElement>,
  email: string | undefined,
  setLoading: (state: boolean) => void,
  setOk: (state: boolean | undefined) => void,
) {
  e.preventDefault();
  setLoading(true);
  if (!email) {
    toast.add({
      type: "error",
      description: "Missing email in request",
    });
    return;
  }
  try {
    const res = await fetch("/auth/request-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const body: unknown = await res.json().catch(() => null);
      const message =
        typeof body === "object" &&
        body !== null &&
        "message" in body &&
        typeof body.message === "string"
          ? body.message
          : `Login failed (${res.status})`;
      toast.add({
        type: "error",
        description: message,
      });
      setOk(false);
      return;
    }
    setOk(true);
  } catch (e) {
    toast.add({
      type: "error",
      description:
        e instanceof Error ? e.message : "An unknown error has occurred",
    });
    setOk(false);
  } finally {
    setLoading(false);
  }
}
export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<boolean | undefined>();
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    let cancelled = false;

    async function checkLoginState() {
      try {
        const res = await fetch("/api/me");
        if (!cancelled) setLoggedIn(res.ok);
      } catch {
        if (!cancelled) setLoggedIn(false);
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    checkLoginState();

    return () => {
      cancelled = true;
    };
  }, []);

  if (checking) {
    return null; // or a spinner
  }

  if (loggedIn) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BookOpenIcon className="size-4" />
            </div>
            Plumfield Library
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {!loading && ok == undefined && (
              <LoginForm
                handleSubmit={handleSubmit}
                setLoading={setLoading}
                setOk={setOk}
              />
            )}
            {loading && <Spinner />}
            {ok && (
              <div className="flex w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-green-600 p-8">
                <div className="m-4 flex h-15 w-15 items-center justify-center rounded-full bg-green-600">
                  <Mail size="40" />
                </div>
                <p>Check your email, we just sent you a login link!</p>
              </div>
            )}
            {ok == false && (
              <div className="flex w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-red-600 p-8">
                <div className="m-4 flex h-15 w-15 items-center justify-center rounded-full bg-red-600">
                  <XIcon size="60" />
                </div>
                <p>
                  Something went wrong - please reload this page and try again.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/login.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
