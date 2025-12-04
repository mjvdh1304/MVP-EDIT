import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Enable MSW (Mock Service Worker) in development when VITE_ENABLE_MSW=true
if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === "true") {
  const { worker } = await import("./mocks/browser");
  await worker.start();
}

createRoot(document.getElementById("root")!).render(<App />);
