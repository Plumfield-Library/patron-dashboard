import { Hono } from "hono";
import { Bindings } from "./types.ts";
import { auth } from "./auth.ts";
import { api } from "./api.ts";

const app = new Hono<{ Bindings: Bindings }>();

app.route("/auth", auth);
app.route("/api", api);

export default app;
