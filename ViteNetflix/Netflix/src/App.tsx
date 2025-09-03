// App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./AuthContext";
import StartPage from "./pages/StartPage";
import MainPage from "./pages/MainPage";
import SearchPage from "./pages/SearchPage";
import ResetPasswordPage from "./pages/ResetPassword";

function AppRoutes() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {isLoggedIn ? (
        <>
          <Route path="/home" element={<MainPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/bookmark" element={<MainPage />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </>
      ) : (
        <>
          <Route path="/" element={<StartPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
