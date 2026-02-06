import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CartProviderWrapper from "@/components/providers/CartProvider";
import { Toaster } from "sonner";

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
          <div className="fixed inset-0 w-full h-full overflow-hidden">
  <div
    className="absolute inset-0 z-[100] pointer-events-none opacity-[0.02] mix-blend-multiply"
    style={{
      backgroundImage: 'url(/stamp-collection.svg)',
      backgroundRepeat: 'repeat',
      backgroundSize: '100px 100px',
      backgroundPosition: 'center',
    }}
  />
</div>
          {children}
          <Toaster position="top-center" richColors />
        </CartProviderWrapper>
      </body>
    </html>
  );
}
