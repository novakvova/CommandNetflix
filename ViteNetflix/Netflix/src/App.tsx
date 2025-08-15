import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import StartPage from "./pages/StartPage";

export default function App() {
  const [isLoggedIn] = useState(false);

  return (
    <div>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<h1>Головна для користувача</h1>} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<StartPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </div>
  );
}
