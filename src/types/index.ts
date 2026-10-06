import { z } from "@hono/zod-openapi";
import Stripe from "stripe";

const MembershipStatus = z.enum(["active", "inactive", "on_hold"]);
const Roles = z.enum(["user", "admin"]);
/**
 * Zod Model for the User Object.
 */
export const UserSchema = z.object({
  email: z.email(),
  name: z.string(),
  membership_status: MembershipStatus,
  stripe_id: z.string().nullable(),
  classes: z.boolean(), // can the user register for classes
  visit: z.boolean(), // can the user come in for a visit
  admin: z.boolean(), // is the user an admin acting as the user
  role: Roles,
});
// DB row -> User: reuse UserSchema, swap in coerced booleans, and inject admin
export const PatronRow = UserSchema.omit({ admin: true })
  .extend({
    classes: z.coerce.boolean(),
    visit: z.coerce.boolean(),
    name: z.string(),
    stripe_id: z.string().nullable(), // same
  })
  .transform((row) => ({ ...row, admin: false }));
export type User = z.infer<typeof UserSchema>;
export type SessionCookie = User & { exp: number; purpose: string };
export const ErrorSchema = z.object({
  error: z.string(),
});
export const RequestSchema = z.object({
  email: z.email().openapi({ example: "test@example.com" }),
});
export const GoodRequestSchema = z.object({
  ok: z.boolean(),
});
export const VerifyQuerySchema = z.object({
  token: z.string(),
});
export type Bindings = {
  JWT_TOKEN: string;
  SMTP_HOST: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  STRIPE_KEY: string;
  TURSO_URL: string;
  TURSO_KEY: string;
  SECURE: string;
  NOTION_KEY: string;
};
export const InvoiceModel = z.object({
  invoice_id: z.string(),
  url: z.string().nullable(),
  date: z.string(),
  total: z.number(),
  status: z.custom<Stripe.Invoice.Status>(),
});
export const InvoiceResponseModel = z.array(InvoiceModel);
export type Invoice = z.infer<typeof InvoiceModel>;

export const ClassesModel = z.object({
  title: z.string(),
  student: z.string(),
  date: z.string(),
  location: z.string(),
  type: z.string(),
  id: z.string(),
});

export const ClassesResponse = z.array(ClassesModel);

export type Classes = z.infer<typeof ClassesModel>;
export const GoodTokenSchema = z.object({
  token: z.string(),
});
