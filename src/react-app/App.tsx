import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ProtectedRoute } from "./routes/ProtectedRoute"
import LoginPage from "@/pages/login.tsx"
import { Home } from "@/pages/home.tsx"

export function App() { // TODO: finish adding routes and login element
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
