import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { VisualEditsMessenger } from "orchids-visual-edits";

export const metadata: Metadata = {
  title: "Megames - All Your Favorite Board Games in One Digital Deck",
  description: "Play classic board games online with friends. No cards needed - just fun!",
  icons: {
    icon: "/logo-icon.svg",
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
        {children}
        <Toaster position="top-right" richColors />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}