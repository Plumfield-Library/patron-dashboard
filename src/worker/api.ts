import { Hono } from "hono";
import { Bindings } from "./types.ts";

export const api = new Hono<{ Bindings: Bindings }>();

api.get("/me", (c) =>
  c.json({
    email: "masarikfamilymichael@gmail.com",
    name: "Michael Masarik",
    membership_status: "full",
  }),
);
