import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./LoginForm.css";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Ⓧ Некоректний email")
    .required("Ⓧ Email обов'язковий"),
  password: yup.string().required("Ⓧ Пароль обов'язковий"),
});

type LoginFormFields = {
  email: string;
  password: string;
};
type LoginFormProps = {
  onShowRegister: () => void;
};

export default function LoginForm({ onShowRegister }: LoginFormProps) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginFormFields>({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginFormFields) => {
    try {
      const response = await fetch("http://localhost:5045/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Помилка входу: " + (errorData.message || "невідома"));
        return;
      }

      const result = await response.json();
      const token = result.token;
      console.log("Login success:", result);

      // login(token);

    const meResponse = await fetch("http://localhost:5045/api/Auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (meResponse.ok) {
      const user = await meResponse.json(); // user має мати id та email
      console.log("User info:", user);

      // Передаємо токен і користувача в контекст
      login(token, user);

      navigate("/home");
    } else {
      alert("Токен недійсний або прострочений");
    }
    } catch (error) {
      console.error("Login error:", error);
      alert("Помилка з'єднання з сервером");
    }
  };

  const allErrors = Object.entries(errors)
    .map(([name, err]) => {
      const fieldValue = getValues(name as keyof LoginFormFields);
      if (fieldValue && fieldValue.trim() !== "")
        return (err as { message?: string }).message;
      return null;
    })
    .filter(Boolean);

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Увійти</h2>

      <span className="p-float-label">
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => <InputText {...field} id="email" />}
        />
        <label htmlFor="email">Email</label>
      </span>

      <span className="p-float-label" style={{ marginTop: "1rem" }}>
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Password {...field} id="password" feedback={false} />
          )}
        />
        <label htmlFor="password">Пароль</label>
      </span>

      {allErrors.length > 0 && (
        <div className="form-errors">
          {allErrors.map((err, i) => (
            <div key={i}>{err}</div>
          ))}
        </div>
      )}
<div className="forgot-password">
  <a
    href="#"
    onClick={async (e) => {
      e.preventDefault();
      const email = getValues("email");
      if (!email) {
        alert("Введіть email перед відновленням пароля");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5045/api/Auth/request-password-reset",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );

        if (response.ok) {
          alert("Посилання для відновлення пароля надіслано на пошту");
        } else {
          const err = await response.json();
          alert("Помилка: " + (err.message || "невідома"));
        }
      } catch (err) {
        console.error(err);
        alert("Помилка з'єднання з сервером");
      }
    }}
  >
    Забули пароль?
  </a>
</div>

      <Button
        type="submit"
        label="Увійти"
        className="p-button-primary"
        style={{ marginTop: "2rem" }}
      />
      <div className="register-link">
        <a type="button" onClick={onShowRegister}>
          Зареєструватися
        </a>
      </div>
    </form>
  );
}
