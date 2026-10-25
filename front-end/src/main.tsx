import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import { AppProvider } from "./AppProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <NextUIProvider>
        {/* Dark Mode */}
        <div className="dark text-foreground bg-background min-h-screen relative overflow-x-hidden font-sans antialiased">
          {/* Soft background glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 bg-[radial-gradient(60%_45%_at_50%_-10%,rgba(124,92,255,0.28),transparent),radial-gradient(40%_35%_at_100%_100%,rgba(34,211,238,0.10),transparent)]"
          />
          <main className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
            <App />
          </main>
        </div>
      </NextUIProvider>
    </AppProvider>
  </StrictMode>
);
