import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import ChildrenPage from "@/pages/ChildrenPage";
import BooksPage from "@/pages/BooksPage";
import SettingsPage from "@/pages/SettingsPage";
import Login from "@/pages/Login";
import CreateAccount from "@/pages/CreateAccount";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import ResetPassword from "@/pages/ResetPassword";
import RequestAcess from "@/pages/RequestAcess";
import RequestAcessConfirmation from "@/pages/RequestAcessConfirmation";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPasswordConfirmation from "./pages/ResetPasswordConfirmation";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/reset-password-confirmation"
              element={<ResetPasswordConfirmation />}
            />
            <Route
              path="/request-access-confirmation"
              element={<RequestAcessConfirmation />}
            />
            <Route path="/request-access" element={<RequestAcess />} />
            <Route path="login" element={<Login />} />
            <Route
              path="children"
              element={
                <AuthProvider>
                  <ProtectedRoute>
                    <ChildrenPage />
                  </ProtectedRoute>
                </AuthProvider>
              }
            />
            <Route
              path="books"
              element={
                <AuthProvider>
                  <ProtectedRoute>
                    <BooksPage />
                  </ProtectedRoute>
                </AuthProvider>
              }
            />
            <Route
              path="settings"
              element={
                <AuthProvider>
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                </AuthProvider>
              }
            />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
