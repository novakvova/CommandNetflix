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
import "./RegisterForm.css";

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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = (data: unknown) => {
    console.log("Registration data:", data);
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
