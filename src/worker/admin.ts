import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { Bindings, ErrorSchema, GoodRequestSchema, User } from "../types";
import { deleteCookie, setCookie } from "hono/cookie";
import { chooseCookie } from "./utils.ts";
import { sign } from "hono/jwt";
import { Database } from "./db.ts";

export const admin = new OpenAPIHono<{
  Bindings: Bindings;
  Variables: { jwtPayload: User };
}>();

const imp = createRoute({
  method: "post",
  path: "/impersonate",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({ email: z.email() }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: GoodRequestSchema,
        },
      },
    },
    401: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

admin.openapi(imp, async (c) => {
  const token = chooseCookie(c);
  const email = c.req.valid("json").email;

  if (!token || c.get("jwtPayload").role != "admin") {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const db = new Database(c);
  const payload = await db.getUser(email);

  const sessionToken = await sign(
    {
      ...payload,
      admin: true,
      purpose: "session",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day
    },
    c.env.JWT_TOKEN,
  );
  setCookie(c, "imp_session", sessionToken, {
    httpOnly: true,
    secure: c.env.SECURE == "true",
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return c.json({ ok: true }, 200);
});

admin.post("/exit", (c) => {
  deleteCookie(c, "imp_session", {
    path: "/",
    secure: false,
  });
  return c.json({ ok: true }, 200);
});
