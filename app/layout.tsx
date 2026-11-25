import type { ReactNode } from "react";
import "./globals.css";
import { AppUiEventProvider } from "../src/ui-events/AppUiEventProvider";

export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppUiEventProvider>{children}</AppUiEventProvider>
      </body>
    </html>
  );
}
