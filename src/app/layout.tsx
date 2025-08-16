import type { Metadata } from "next";
import { Montserrat } from "next/font/google"
import "./globals.css";
import { Header } from "@/components/Header";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AI Chat Interface",
  description: "AI Chat with JSON Response Viewer",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
