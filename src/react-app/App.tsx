import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import LoginPage from "@/pages/login.tsx";
import { Home } from "@/pages/home.tsx";
import { OpenInvoices, AllInvoices } from "@/pages/invoices.tsx";
import { Appointments } from "@/pages/appointments.tsx";
import { Register } from "@/pages/register.tsx";
// import Verify from "@/pages/verify";

export function App() {
  // TODO: finish adding routes and login element
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/*<Route path="/auth/verify" element={<Verify />} />*/}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/open-invoices" element={<OpenInvoices />} />
          <Route path="/all-invoices" element={<AllInvoices />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
