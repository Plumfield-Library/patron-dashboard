import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ThemeProvider } from "@/components/theme-provider.tsx";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import "./index.css";
import { Toaster } from "@/components/ui/toast.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queries.ts";
import { InvoiceProvider } from "@/context/InvoiceContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <InvoiceProvider>
            <App />
            <Toaster />
          </InvoiceProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
