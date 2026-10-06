import { verify } from "hono/jwt";
import {
  UserSchema,
  ErrorSchema,
  Bindings,
  User,
  SessionCookie,
  InvoiceResponseModel,
  ClassesResponse,
  ILLResponseModel,
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

const ALLOWED_PURPOSES = new Set(["session"]); // use whatever your imp token's purpose is

api.use("/*", async (c, next) => {
  const token = chooseCookie(c);
  if (!token) return c.json({ error: "unauthorized" }, 401);

  let payload: SessionCookie;
  try {
    payload = (await verify(token, c.env.JWT_TOKEN)) as SessionCookie;
  } catch {
    return c.json({ error: "unauthorized" }, 401);
  }

  if (!ALLOWED_PURPOSES.has(payload.purpose)) {
    return c.json({ error: "unauthorized" }, 401);
  }

  c.set("jwtPayload", payload);
  await next();
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

api.openapi(stripe, async (c) => {
  const client = new Stripe(c.env.STRIPE_KEY);
  const user = c.get("jwtPayload");
  const stripe_id = user.stripe_id;
  const invoices = await get_all_invoices(client, stripe_id!);
  return c.json(invoices ?? []);
});

const nClasses = createRoute({
  method: "get",
  path: "/classes",
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

api.openapi(nClasses, async (c) => {
  const client = new Notion(c);
  const classes = await client.getAllClasses(c.get("jwtPayload"));
  return c.json(classes, 200);
});

const nILL = createRoute({
  method: "get",
  path: "/ill",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ILLResponseModel,
        },
      },
    },
  },
});

api.openapi(nILL, async (c) => {
  const client = new Notion(c);
  const ill = await client.getAllInterLibraryLoan(c.get("jwtPayload"));
  return c.json(ill, 200);
});
export type ApiMe = typeof apiMe;
