import type { Metadata } from "next";
import { Readex_Pro } from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/ScrollProgress";
import BackgroundLayers from "@/components/BackgroundLayers";
import NavigationRecovery from "@/components/NavigationRecovery";

const readexPro = Readex_Pro({
  variable: "--font-readex-pro",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ridebuilders — every car. every bike. all in one place.",
  description:
    "research, compare, and explore cars and two-wheelers — specs, reviews, pricing insights, 360° views, and city-based estimates to help you decide before you ever visit a showroom.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={readexPro.variable}>
      <body className="bg-black text-white antialiased">
        <ScrollProgress />
        <BackgroundLayers />
        <NavigationRecovery>{children}</NavigationRecovery>
      </body>
    </html>
  );
}
