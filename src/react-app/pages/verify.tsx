import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Verify() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const ran = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ran.current) return; // StrictMode runs effects twice in dev
    ran.current = true;

    const token = params.get("token");
    if (!token) return setError("Missing token");

    fetch("/auth/verify?token=" + token, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
    })
      .then((r) => {
        if (!r.ok) throw new Error("Link invalid or expired");
        navigate("/", { replace: true });
      })
      .catch((e) => setError(e.message));
  }, []);

  return error ? <p>{error}</p> : <p>Signing you in…</p>;
}
