import type { ReactNode } from "react";
import "./globals.css";
import { AppShell } from "../src/components/AppShell/AppShell";
import { loadAppShell } from "../src/controllers/AppShell.controller";
import { shellRuntime } from "../src/server/Runtime";

export default async function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  const model = await shellRuntime.runPromise(loadAppShell);

  return (
    <html lang="en" data-theme="night">
      <body className="min-h-screen bg-base-200 text-base-content">
        <AppShell {...model}>{children}</AppShell>
      </body>
    </html>
  );
}
