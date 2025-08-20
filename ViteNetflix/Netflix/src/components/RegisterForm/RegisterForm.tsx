import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom"; // ✅ для редіректу

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./RegisterForm.css";

// Типи полів форми
type RegisterFormFields = {
  email: string;
  password: string;
  confirmPassword: string;
};

// Схема валідації
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Ⓧ Некоректний email")
    .required("Ⓧ Email обов'язковий"),
  password: yup
    .string()
    .min(6, "Ⓧ Пароль має бути мінімум 6 символів")
    .required("Ⓧ Пароль обов'язковий"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Ⓧ Паролі не співпадають")
    .required("Ⓧ Підтвердити пароль обов'язкове"),
});

export default function RegisterForm() {
  const navigate = useNavigate(); // ✅ ініціалізація редіректу

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormFields>({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

const onSubmit = async (data: RegisterFormFields) => {
  try {
    const response = await fetch("http://localhost:5045/api/Auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
    });

    if (!response.ok) {
      // Пробуємо дістати помилку з JSON/ProblemDetails або як текст
      const raw = await response.text();
      let parsed: any;
      try { parsed = JSON.parse(raw); } catch { parsed = null; }

      const serverMsg =
        typeof parsed === "string"
          ? parsed
          : parsed?.message ||
            parsed?.title ||
            parsed?.detail ||
            (parsed?.errors
              ? Object.values(parsed.errors).flat()[0]
              : null) ||
            raw ||
            "невідома";

      console.error("Registration failed:", parsed ?? raw);
      alert("Помилка реєстрації: " + serverMsg);
      return;
    }

    // Успіх: якщо є JSON — прочитаємо, якщо ні — просто продовжимо
    const ct = response.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      try {
        const result = await response.json();
        console.log("Registration success:", result);
      } catch {
        // тіло відсутнє або не JSON — це ок
      }
    }

    alert("Реєстрація успішна!");
    navigate("/login");
  } catch (err) {
    console.error("Network error:", err);
    alert("Помилка з'єднання з сервером");
  }
};


  const allErrors = Object.values(errors).map(
    (err) => (err as { message?: string }).message
  );

  return (
    <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Зареєструватись</h2>

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
            <Password {...field} id="password" feedback={true} />
          )}
        />
        <label htmlFor="password">Пароль</label>
      </span>

      <span className="p-float-label" style={{ marginTop: "1rem" }}>
        <Controller
          name="confirmPassword"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Password {...field} id="confirmPassword" feedback={false} />
          )}
        />
        <label htmlFor="confirmPassword">Підтвердити пароль</label>
      </span>

      {/* Вивід всіх помилок під формою */}
      {allErrors.length > 0 && (
        <div
          className="form-errors"
          style={{ color: "red", marginTop: "1rem" }}
        >
          {allErrors.map((err, i) => (
            <div key={i}>{err}</div>
          ))}
        </div>
      )}

      <Button
        type="submit"
        label="Зареєструватись"
        className="p-button-primary"
        style={{ marginTop: "2rem" }}
      />
    </form>
  );
}
