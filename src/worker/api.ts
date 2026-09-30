import { verify } from "hono/jwt";
import {
  UserSchema,
  ErrorSchema,
  Bindings,
  User,
  SessionCookie,
} from "../types";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { get_all_invoices, InvoiceResponseModel } from "./stripe.ts";
import { chooseCookie } from "./utils.ts";
import Stripe from "stripe";

export const api = new OpenAPIHono<{
  Bindings: Bindings;
  Variables: { jwtPayload: User };
}>();

api.use("/*", async (c, next) => {
  const token = chooseCookie(c); // returns the correct session
  if (!token) return c.json({ error: "unauthorized" }, 401);
  try {
    const payload = await verify(token, c.env.JWT_TOKEN);
    c.set("jwtPayload", payload as SessionCookie);
    await next();
  } catch (e) {
    console.error(e);
    return c.json({ error: "unauthorized" }, 401);
  }
});

const me = createRoute({
  method: "get",
  path: "/me",
  responses: {
    200: {
      content: { "application/json": { schema: UserSchema } },
      description: "User found",
    },
    401: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "Not Authorized",
    },
  },
});

const apiMe = api.openapi(me, (c) => {
  return c.json(
    {
      ...c.get("jwtPayload"),
    },
    200,
  );
});

const stripe = createRoute({
  method: "get",
  path: "/invoices",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: InvoiceResponseModel,
        },
      },
    },
  },
});

api.openapi(stripe, async (c) => {
  const client = new Stripe(c.env.STRIPE_KEY);
  const user = c.get("jwtPayload");
  const stripe_id = user.stripe_id;
  const invoices = await get_all_invoices(client, stripe_id!);
  return c.json(invoices ?? []);
});
export type ApiMe = typeof apiMe;
