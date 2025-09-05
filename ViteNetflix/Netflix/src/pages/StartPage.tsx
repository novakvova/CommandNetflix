import { useState } from "react";

import LoginForm from "../components/LoginForm/LoginForm";
import RegisterForm from "../components/RegisterForm/RegisterForm";
import "./StartPage.css";

const logo = new URL("../assets/Logo.png", import.meta.url).href;

export default function StartPage() {
  const [activeForm, setActiveForm] = useState<"login" | "register" | null>(
    null
  );
  const [formClosing, setFormClosing] = useState(false);

  const handleLoginClick = () => setActiveForm("login");
  const handleRegisterClick = () => setActiveForm("register");

  const handleLogoClick = () => {
    if (activeForm) {
      setFormClosing(true);

      setTimeout(() => {
        setActiveForm(null);
        setFormClosing(false);
      }, 300);
    }
  };

  return (
    <div className={`start-page ${activeForm ? "form-active" : ""}`}>
      <img
        src={logo}
        alt="Netflix"
        className="logo"
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      />

      <div className="buttons">
        <button onClick={handleRegisterClick}>Зареєструватись</button>
        <button onClick={handleLoginClick}>Увійти</button>
      </div>

      {(activeForm === "login" || activeForm === "register") && (
        <div className={`login-overlay ${formClosing ? "closing" : ""}`}>
          {activeForm === "login" ? (
            <LoginForm onShowRegister={() => setActiveForm("register")} />
          ) : (
            <RegisterForm onShowLogin={() => setActiveForm("login")} />
          )}
        </div>
      )}
    </div>
  );
}
