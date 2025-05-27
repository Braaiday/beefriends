import { Outlet, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import { ChatApp } from "./pages/ChatApp";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SignUp } from "./pages/SignUp";
import { Settings } from "./pages/Settings";
import { ChatAppProvider } from "./context/ChatAppProvider";

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Chat App Routes*/}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <ChatAppProvider>
                <Outlet />
              </ChatAppProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<ChatApp />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
