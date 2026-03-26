import type { Metadata } from "next";
import { Chakra_Petch, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-inter",
  subsets: ["latin"],
});

const chakraPetch = Chakra_Petch({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "F1 Pulse — F1 Analytics & Betting Intelligence",
  description:
    "The most comprehensive analytics platform for Formula 1 prediction markets on Polymarket. Bilingual EN/ZH.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${chakraPetch.variable} ${jetbrainsMono.variable} antialiased dark`}
      >
        {children}
      </body>
    </html>
  );
}
