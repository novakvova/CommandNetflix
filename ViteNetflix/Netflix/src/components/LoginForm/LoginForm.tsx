import React from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./LoginForm.css";

// Схема валідації
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

export default function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginFormFields>({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = (data: LoginFormFields) => {
    console.log("Login data:", data);
  };

  // Помилки тільки для непустих полів
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

      {/* Вивід всіх помилок під формою */}
      {allErrors.length > 0 && (
        <div className="form-errors">
          {allErrors.map((err, i) => (
            <div key={i}>{err}</div>
          ))}
        </div>
      )}

      <Button
        type="submit"
        label="Увійти"
        className="p-button-primary"
        style={{ marginTop: "2rem" }}
      />
    </form>
  );
}
