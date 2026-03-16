import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "@/frontend/styles/globals.css";
import "@uploadthing/react/styles.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CampusHireX - Smart Placement Platform",
  description: "Efficient campus placement management for students, admins, and companies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${inter.variable} font-sans antialiased`}
      >
        <NextSSRPlugin
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        {children}
      </body>
    </html>
  );
}
