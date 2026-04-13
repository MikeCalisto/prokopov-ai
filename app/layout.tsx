import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Avatar - Kurs Online",
  description: "Stwórz realistycznego AI-avatara w 2 godziny",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
