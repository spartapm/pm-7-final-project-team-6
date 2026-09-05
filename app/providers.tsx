"use client";

import { CloudBanner } from "@/components/CloudBanner";
import { ToastHost } from "@/components/chrome";
import { StoreProvider } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <CloudBanner />
      {children}
      <ToastHost />
    </StoreProvider>
  );
}
