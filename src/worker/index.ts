import { auth } from "./auth.ts";
import { api } from "./api.ts";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Bindings } from "../types";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

app.route("/auth", auth);
app.route("/api", api);
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Patron Dashboard",
  },
});

export default app;
