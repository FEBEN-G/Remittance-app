import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/providers";
import { BottomNav } from "@/components/bottom-nav";
import "./globals.css";
import "../styles/premium.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "White Label Pay - Send Money to Ethiopia",
    template: "%s | White Label Pay",
  },
  description:
    "Send money to Ethiopia instantly. Best exchange rates, low fees, secure transfers to any Ethiopian bank account.",
  keywords: [
    "remittance",
    "Ethiopia",
    "money transfer",
    "ETB",
    "send money",
    "diaspora",
  ],
  authors: [{ name: "White Label Pay" }],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1c5f5d" },
    { media: "(prefers-color-scheme: dark)", color: "#1c5f5d" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased pb-24 md:pb-0`}>
        <Providers>
          {children}
          <BottomNav />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
