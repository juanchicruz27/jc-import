import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JC Import - Premium Fragrances",
  description: "Perfumes importados de lujo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
