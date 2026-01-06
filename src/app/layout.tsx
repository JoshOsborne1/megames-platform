import type { Metadata, Viewport } from "next";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { Providers } from "@/components/Providers";

export const viewport: Viewport = {
  themeColor: "#0a0015",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Megames - All Your Favorite Board Games in One Digital Deck",
  description: "Play classic board games online with friends. No cards needed - just fun!",
  icons: {
    icon: "/logo-icon.svg",
    apple: "/logo-icon.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Megames",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
