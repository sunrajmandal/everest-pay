import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SubNepal — Premium Subscription Services in Nepal",
  description: "Get Netflix, Spotify, Xbox Game Pass, Disney+ and more at the best prices in Nepal. Pay with eSewa or Khalti. Instant activation.",
  keywords: "Nepal subscriptions, Netflix Nepal, Spotify Nepal, eSewa payment, Khalti payment, subscription reseller",
};

import WhatsAppButton from "@/components/WhatsAppButton";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
