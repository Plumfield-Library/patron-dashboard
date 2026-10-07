import { hc } from "hono/client";
import type { ApiMe } from "../../worker/api.ts";

import { useQuery } from "@tanstack/react-query";

const client = hc<ApiMe>("/api/");

async function fetchUser() {
  console.log("fetching user details");
  const resp = await client.me.$get();
  if (resp.status === 200) return await resp.json();

  const body = await resp.json(); // Hono narrows this to { error: string }
  throw new Error(body.error);
}
export function useAuth() {
  return useQuery({
    queryKey: ["session"],
    queryFn: fetchUser,
    staleTime: Infinity,
    retry: false,
  });
}

export async function logout() {
  await fetch("/auth/logout", {
    method: "POST",
  });
  window.location.href = "/login";
}
