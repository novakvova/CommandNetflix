import React, { useState} from "react";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useSearchParams } from "react-router-dom";

import "./ResetPassword.css";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Обробка сабміту
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Новий пароль і підтвердження не співпадають!");
      return;
    }

    if (!token || !email) {
      alert("Токен або email відсутні. Посилання недійсне.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5045/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword,
          confirmNewPassword: confirmPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Помилка: " + (errorData.message || "невідома"));
        return;
      }

      alert("Пароль успішно змінено!");
      window.location.href = "/";
    } catch (error) {
      console.error("Reset password error:", error);
      alert("Помилка з'єднання з сервером");
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h2 className="reset-password-title">Скидання пароля</h2>

        <form onSubmit={handleSubmit} className="reset-password-form">

          <div className="field">
            <label>Новий пароль</label>
            <Password
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              toggleMask
              className="custom-input"
              inputClassName="custom-input-inner"
            />
          </div>

          <div className="field">
            <label>Підтвердження нового пароля</label>
            <Password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              feedback={false}
              toggleMask
              className="custom-input"
              inputClassName="custom-input-inner"
            />
          </div>

          <Button type="submit" label="Змінити пароль" className="submit-btn" />
        </form>
      </div>
    </div>
  );
}
