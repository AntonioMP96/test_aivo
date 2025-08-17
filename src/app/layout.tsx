import type { Metadata } from "next";
import { Montserrat } from "next/font/google"
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Tony AI Chat",
  description: "Tony's tech challenge for AIVO.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${montserrat.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
