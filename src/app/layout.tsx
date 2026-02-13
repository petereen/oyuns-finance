import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "OYUNS FINANCE",
  description: "OYUNS FINANCE - 2018 оноос эхлэн олон улсын мөнгөн гуйвуулга, санхүүгийн үйлчилгээ үзүүлж байна. Найдвартай, хурдан, аюулгүй.",
  keywords: "oyuns, finance, money transfer, валют солих, мөнгөн гуйвуулга, RUB, MNT",
  openGraph: {
    title: "OYUNS FINANCE",
    description: "Найдвартай санхүүгийн түнш",
    url: "https://oyuns.mn",
    siteName: "OYUNS FINANCE",
    locale: "mn_MN",
    type: "website",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body className={`${montserrat.variable} font-sans antialiased`} suppressHydrationWarning={true}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
