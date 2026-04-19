import type { Metadata } from "next";
import { Inter, Newsreader, Space_Grotesk } from "next/font/google";
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
  title: "STORYVERSE - Where Every Story Finds Its Reader",
  description: "Join a community of creators and readers. Write your masterpiece, design your covers, and share your universe with the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${newsreader.variable} ${inter.variable} dark`}
    >
      <body className="font-body antialiased min-h-screen flex flex-col relative overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
