import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { Bindings, User } from "../types";

function bearer(
  c: Context<{
    Bindings: Bindings;
    Variables: { jwtPayload: User };
  }>,
) {
  const h = c.req.header("Authorization");
  return h?.startsWith("Bearer ") ? h.slice(7) : undefined;
}

export function chooseCookie(
  c: Context<{
    Bindings: Bindings;
    Variables: { jwtPayload: User };
  }>,
) {
  const impToken = getCookie(c, "imp_session");

  const session = getCookie(c, "dashboard_session");
  const bearerToken = bearer(c);

  if (bearerToken != undefined) {
    return bearerToken;
  } else if (impToken != undefined) {
    return impToken;
  } else {
    return session;
  }
}
