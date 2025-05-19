import "~/styles/globals.css";

import { type Metadata } from "next";
import { GeistSans } from "geist/font";

import { TRPCReactProvider } from "~/trpc/react";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "BintaxDigitalProduct - Premium Digital Products",
  description:
    "Elevate your digital presence with BintaxDigitalProduct. Get premium digital products at special prices. AI Reels Bundle, Excel Templates, and Instagram Growth Course.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  keywords: ["BintaxDigitalProduct", "digital products", "AI reels", "excel templates", "instagram growth", "digital marketing"],
  authors: [{ name: "Bintax" }],
  openGraph: {
    title: "BintaxDigitalProduct - Premium Digital Products",
    description: "Elevate your digital presence with BintaxDigitalProduct",
    url: "https://bintaxdigitalproduct.com",
    siteName: "BintaxDigitalProduct",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BintaxDigitalProduct",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

// GeistSans already has variable property, no need to call it as a function

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning={true}>
        <TRPCReactProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="bottom-right" />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
