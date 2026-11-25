import type { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <html lang="en" data-theme="night">
      <body className="min-h-screen bg-base-200 text-base-content">
        <header className="navbar bg-base-300 px-4 shadow-sm">
          <div className="flex-1">
            <a href="/" className="btn btn-ghost text-xl">
              Character Dossier
            </a>
          </div>
          <div className="flex-none flex gap-2">
            <a href="/star-wars" className="btn btn-ghost">
              Star Wars
            </a>
            <a href="/ghibli" className="btn btn-ghost">
              Ghibli
            </a>
            <a href="/funnel" className="btn btn-ghost">
              Build a dossier
            </a>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl p-4">{children}</main>
      </body>
    </html>
  );
}
