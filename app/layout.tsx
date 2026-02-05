import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CartProviderWrapper from "@/components/providers/CartProvider";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "myMat - Premium  Mats",
  description: "Luxury mats with minimal, elegant design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          fontFamily: 'Geist, system-ui, -apple-system, sans-serif',
          margin: 0,
          padding: 0,
        }}
      >
        <CartProviderWrapper>
          {children}
          <Toaster position="top-center" richColors />
        </CartProviderWrapper>
        <SpeedInsights />
      </body>
    </html>
  );
}
