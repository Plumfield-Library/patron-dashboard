import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { setCookie, deleteCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import { WorkerMailer } from "worker-mailer";
import {
  Bindings,
  ErrorSchema,
  GoodRequestSchema,
  RequestSchema,
  GoodTokenSchema,
  User,
  VerifyQuerySchema,
} from "../types";
import { Database } from "./db.ts";

export const auth = new OpenAPIHono<{
  Bindings: Bindings;
  Variables: { jwtPayload: User };
}>();

const requestLink = createRoute({
  method: "post",
  path: "/request-link",
  request: {
    body: {
      content: {
        "application/json": {
          schema: RequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: GoodRequestSchema,
        },
      },
      description: "Request Received",
    },
  },
});

auth.openapi(requestLink, async (c) => {
  const { email } = await c.req.json();
  console.log("Login request for the following!");
  console.log(email);
  const database = new Database(c);
  const user = await database.getUser(email as string);
  if (!user) {
    console.error("Invalid email:", email as string);
    return c.json({ ok: true }, 200);
  }
  if (user.membership_status != "active") {
    console.error("User is not active: ", email as string);
    return c.json({ ok: true }, 200);
  }

  const magicToken = await sign(
    {
      email,
      purpose: "magic-link",
      exp: Math.floor(Date.now() / 1000) + 60 * 15, // 15 min expiry
    },
    c.env.JWT_TOKEN,
  );
  const link = `https://dashboard.plumfieldlibrary.com/auth/verify?token=${magicToken}`;
  await WorkerMailer.send(
    {
      // WorkerMailerOptions
      host: c.env.SMTP_HOST,
      credentials: {
        username: c.env.SMTP_USER,
        password: c.env.SMTP_PASS,
      },
      port: 465,
      secure: true,
      authType: "plain",
    },
    {
      from: "plumfieldlivinglibrary@gmail.com",
      to: email,
      subject: "Login to your Patron Dashboard",
      text: `Hello!
        You can log into your patron dashboard using the link below (it expires in 15 minutes)
        
        ${link}`,
    },
  );
  return c.json({ ok: true }, 200);
});

const VerifyToken = createRoute({
  method: "get",
  path: "/verify",
  request: {
    query: VerifyQuerySchema,
  },
  responses: {
    400: {
      description: "Missing token",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    401: {
      description: "Invalid or expired token",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    302: {
      description: "Redirects to the dashboard",
      headers: {
        Location: {
          schema: {
            type: "string",
          },
          description: "The target URL to redirect to",
        },
      },
    },
    200: {
      content: {
        "application/json": {
          schema: GoodTokenSchema,
        },
      },
    },
  },
});

auth.openapi(VerifyToken, async (c) => {
  const token = c.req.query("token");
  const UA = c.req.header("X-Client");
  if (!token) return c.json({ error: "missing token" }, 400);

  let payload;
  try {
    payload = await verify(token, c.env.JWT_TOKEN);
  } catch (e) {
    console.log(e);
    return c.json({ error: "invalid or expired link" }, 401);
  }

  if (payload.purpose !== "magic-link") {
    return c.json({ error: "invalid token" }, 401);
  }

  const database = new Database(c);
  const user = await database.getUser(payload.email as string);
  if (!user || user.membership_status != "active") {
    return c.json({ error: "Unauthorized" }, 401);
  }
  // Issue a longer-lived session token
  const sessionToken = await sign(
    {
      purpose: "session",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
      ...user,
    },
    c.env.JWT_TOKEN,
  );
  if (UA == "react-native") {
    return c.json({ token: sessionToken }, 200);
  }

  setCookie(c, "dashboard_session", sessionToken, {
    httpOnly: true,
    secure: c.env.SECURE == "true", //false for dev
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return c.redirect("/", 302);
});

const Logout = createRoute({
  path: "/logout",
  method: "post",
  responses: {
    200: {
      description: "Redirects to the login page",
      content: {
        "application/json": {
          schema: GoodRequestSchema,
        },
      },
    },
  },
});
auth.openapi(Logout, (c) => {
  deleteCookie(c, "dashboard_session", {
    path: "/",
    secure: c.env.SECURE == "true",
  });
  return c.json({ ok: true }, 200);
});
