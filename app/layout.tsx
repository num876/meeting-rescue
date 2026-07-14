import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/Toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Meeting Rescue",
  description:
    "Turn messy meetings into clean summaries, firm decisions, and assigned action items — powered by Groq's free tier.",
  keywords: ["meeting", "summarizer", "transcription", "AI", "Groq", "Whisper"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

import { DynamicBackground } from "@/components/DynamicBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <DynamicBackground />
        <Navbar />
        <Toaster />
        <div className="pt-16 min-h-screen">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
