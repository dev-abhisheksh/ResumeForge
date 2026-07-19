"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * Global Toaster component for Sonner.
 * 
 * Production Best Practices Configured:
 * - position: "top-right"
 * - richColors: enabled for distinct status colors
 * - closeButton: enabled for manual dismissal
 * - duration: 3000ms default auto-close duration
 * - theme: "system" to automatically adapt to light/dark system themes
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      duration={3000}
      theme="system"
      toastOptions={{
        style: {
          borderRadius: "12px",
          fontSize: "14px",
          fontFamily: "var(--font-geist-sans), sans-serif",
          boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.15)",
        },
      }}
    />
  );
}
