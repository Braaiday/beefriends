import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import { ChatApp } from "./pages/ChatApp";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SignUp } from "./pages/SignUp";
import { Settings } from "./pages/Settings";

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Protected app routes */}
        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <ChatApp />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
