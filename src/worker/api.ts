import { verify } from "hono/jwt";
import {
  UserSchema,
  ErrorSchema,
  Bindings,
  User,
  SessionCookie,
  InvoiceResponseModel,
  ClassesResponse,
} from "../types";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { get_all_invoices } from "./stripe.ts";
import { chooseCookie } from "./utils.ts";
import Stripe from "stripe";
import { Notion } from "./notion.ts";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StripeRouteType = api.openapi(stripe, async (c) => {
  const client = new Stripe(c.env.STRIPE_KEY);
  const user = c.get("jwtPayload");
  const stripe_id = user.stripe_id;
  const invoices = await get_all_invoices(client, stripe_id!);
  return c.json(invoices ?? []);
});

const notion = createRoute({
  method: "get",
  path: "/notion",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ClassesResponse,
        },
      },
    },
  },
});

api.openapi(notion, async (c) => {
  const client = new Notion(c);
  const classes = await client.getAllClasses(c.get("jwtPayload"));
  return c.json(classes, 200);
});

export type StripeAPI = typeof StripeRouteType;
export type ApiMe = typeof apiMe;
