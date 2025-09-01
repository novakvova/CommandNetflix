import React, { useState } from "react";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

import "./ResetPassword.css";

export default function ResetPasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Новий пароль і підтвердження не співпадають!");
      return;
    }
    alert("Пароль змінено успішно!");
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h2 className="reset-password-title">Скидання пароля</h2>

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="field">
            <label>Старий пароль</label>
            <Password
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              feedback={false}
              toggleMask
              className="custom-input"
              inputClassName="custom-input-inner"
            />
          </div>

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
