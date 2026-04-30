import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter, Newsreader, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/providers/Provider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOULPAD - Where Every Story Finds Its Reader",
  description: "Join a community of creators and readers. Write your masterpiece, design your covers, and share your universe with the world.",
  metadataBase: new URL("https://www.globalpulse24.in"),
  openGraph: {
    title: "SOULPAD — Where Authors Come Alive",
    description: "Follow your favourite authors, read their latest stories, and share your own universe. SOULPAD is the home for storytellers.",
    url: "https://www.globalpulse24.in",
    siteName: "SOULPAD",
    images: [
      {
        url: "/og-banner.png",
        width: 1792,
        height: 1024,
        alt: "SOULPAD — Where Authors Come Alive",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SOULPAD — Where Authors Come Alive",
    description: "Follow your favourite authors, read their latest stories, and share your own universe.",
    images: ["/og-banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${newsreader.variable} ${inter.variable}`}
    >
      <body className="font-body antialiased min-h-screen flex flex-col relative overflow-x-hidden">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4450198813209397"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <Providers>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
