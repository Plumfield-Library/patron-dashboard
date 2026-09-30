import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { Bindings, User } from "../types";

export function chooseCookie(
  c: Context<{
    Bindings: Bindings;
    Variables: { jwtPayload: User };
  }>,
) {
  const impToken = getCookie(c, "imp_session");

  const session = getCookie(c, "dashboard_session");

  if (impToken != undefined) {
    return impToken;
  } else {
    return session;
  }
}
