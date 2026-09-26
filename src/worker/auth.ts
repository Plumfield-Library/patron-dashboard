import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { Bindings } from "./types.ts";
import { WorkerMailer } from "worker-mailer";
import { setCookie } from "hono/cookie";

export const auth = new Hono<{ Bindings: Bindings }>();

auth.post("/request-link", async (c) => {
  const { email } = await c.req.json();
  console.log("Login request for the following!");
  console.log(email);
  // TODO: check email against your allowed patrons/users list here
  // const isKnownUser = await checkUserExists(email, c.env)
  // if (!isKnownUser) {
  //     // Return 200 anyway — don't leak which emails are registered
  //     return c.json({ ok: true })

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
      port: 587,
      credentials: {
        username: c.env.SMTP_USER,
        password: c.env.SMTP_PASS,
      },
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
  return c.json({ ok: true });
});

auth.get("/verify", async (c) => {
  const token = c.req.query("token");
  if (!token) return c.json({ error: "missing token" }, 400);

  let payload;
  try {
    payload = await verify(token, c.env.JWT_TOKEN);
  } catch {
    return c.json({ error: "invalid or expired link" }, 401);
  }

  if (payload.purpose !== "magic-link") {
    return c.json({ error: "invalid token" }, 401);
  }

  // Issue a longer-lived session token
  const sessionToken = await sign(
    {
      email: payload.email,
      purpose: "session",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    },
    c.env.JWT_TOKEN,
  );

  setCookie(c, "session", sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return c.redirect("/");
});
