import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CartProviderWrapper from "@/components/providers/CartProvider";
import StoreLayout from "@/components/StoreLayout";
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
  title: "myMat - Premium Mats",
  description: "Luxury mats with minimal, elegant design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ overflowX: 'hidden' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          fontFamily: 'Geist, system-ui, -apple-system, sans-serif',
          margin: 0,
          padding: 0,
          overflowX: 'hidden',
          width: '100%',
          maxWidth: '100vw',
        }}
      >
        <CartProviderWrapper>
          <StoreLayout>
            {/* Background Pattern - Constrained to prevent overflow */}
            <div 
              className="fixed top-0 left-0 right-0 z-[100] pointer-events-none"
              style={{
                height: '200px',
                width: '100%',
                maxWidth: '100vw',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.02,
                  mixBlendMode: 'multiply',
                  backgroundImage: 'url(/stamp-collection.svg)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: '100px 100px',
                  backgroundPosition: 'center top',
                }}
              />
            </div>
            
            <div style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
              {children}
            </div>
          </StoreLayout>
          
          <Toaster position="top-center" richColors />
        </CartProviderWrapper>
      </body>
    </html>
  );
}