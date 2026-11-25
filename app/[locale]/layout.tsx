import type { ReactNode } from "react";
import "../globals.css";
import {
  DefaultLocale,
  isLocale,
} from "../../src/i18n/Locale";
import { AppUiEventProvider } from "../../src/ui-events/AppUiEventProvider";

export default async function RootLayout({
  children,
  params,
}: {
  readonly children: ReactNode;
  readonly params: Promise<{ readonly locale?: string }>;
}) {
  const { locale } = await params;
  const lang =
    locale !== undefined && isLocale(locale) ? locale : DefaultLocale;

  return (
    <html lang={lang}>
      <body>
        <AppUiEventProvider>{children}</AppUiEventProvider>
      </body>
    </html>
  );
}
