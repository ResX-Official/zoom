import { ReactNode } from "react";
import type { Metadata } from "next";
// Temporarily disabled Clerk
// import { ClerkProvider } from "@clerk/nextjs";
// import { Inter } from "next/font/google"; // Disabled to prevent network errors

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import UserTrackingProvider from "@/components/UserTrackingProvider";

// const inter = Inter({ subsets: ["latin"] }); // Disabled to prevent network errors

export const metadata: Metadata = {
  title: "Zoom",
  description: "Video calling App",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
        <html lang="en">
          {/* Temporarily removed ClerkProvider */}
          <body className="bg-dark-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <UserTrackingProvider>
          <Toaster />
          {children}
        </UserTrackingProvider>
      </body>
    </html>
  );
}
