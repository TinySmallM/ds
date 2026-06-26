import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/app/App";
import "@/app/styles/styles.css";

const REQUIRED_KEY = import.meta.env.VITE_SECRET_KEY;

if (!REQUIRED_KEY) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 40px; font-family: sans-serif; text-align: center; color: #ff4d4f; background: #fff1f0; border: 1px solid #ffa39e; border-radius: 8px; max-width: 500px; margin: 100px auto;">
        <h1 style="margin-bottom: 16px;">Критическая ошибка запуска</h1>
        <p>Отсутствует обязательный ключ авторизации.</p>
        <code style="background: #fff; padding: 4px 8px; border-radius: 4px; border: 1px solid #d9d9d9;">VITE_SECRET_KEY=your_key_here</code>
      </div>
    `;
  }
  throw new Error("Критическая ошибка: Запуск заблокирован. Отсутствует KEY");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
