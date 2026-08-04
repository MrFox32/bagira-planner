import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bagira Planner — Планувальник сеансів салону краси",
  description: "Система оперативної реєстрації записів та підбору оптимальних часових вікон для працівників салону краси",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-slate-950 text-slate-100 select-none">
        {children}
      </body>
    </html>
  );
}
