/// <reference types="vite/client" />

declare module "*.css";

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // додавай тут інші змінні середовища, якщо потрібно
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}