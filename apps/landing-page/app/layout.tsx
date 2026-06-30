import type { Metadata } from "next";
import "./globals.css";
import TopBar from "./components/TopBar";
import Header from "./components/Header";


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
      <body className="antialiased min-h-screen flex flex-col">
        <TopBar />
        <Header />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
