import type { Metadata } from "next";
import "./globals.css";
import TopBar from "./components/TopBar";
import Header from "./components/Header";


export const metadata: Metadata = {
  title: "JC Import - Catálogo de perfumería",
  description: "Catálogo de perfumería",
  openGraph: {
    title: "JC Import - Catálogo de perfumería",
    description: "Catálogo de perfumería",
    url: "https://jc-import.vercel.app",
    siteName: "JC Import",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "JC Import Logo",
      }
    ],
    locale: "es_AR",
    type: "website",
  }
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
