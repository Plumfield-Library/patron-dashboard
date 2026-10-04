import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Logout() {

  const navigate = useNavigate();
  const ran = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ran.current) return; // StrictMode runs effects twice in dev
    ran.current = true;

    fetch("/auth/logout",{
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
    })
      .then((r) => {
        navigate("/login", { replace: true });
      })
      .catch((e) => setError(e.message));
  }, []);

  return error ? <p>{error}</p> : <p>Signing you in…</p>;
}