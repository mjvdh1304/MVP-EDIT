/*
 * MSW browser setup (dev-only).
 * Only imported when VITE_ENABLE_MSW=true in development.
 * Starts the service worker and initializes mock handlers.
 */
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
