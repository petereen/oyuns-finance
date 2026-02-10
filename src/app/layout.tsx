import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Oyuns Finance - Олон улсын мөнгөн гуйвуулгын үйлчилгээ",
  description: "Oyuns Finance - 2018 оноос эхлэн олон улсын мөнгөн гуйвуулга, санхүүгийн үйлчилгээ үзүүлж байна. Найдвартай, хурдан, аюулгүй.",
  keywords: "oyuns, finance, money transfer, валют солих, мөнгөн гуйвуулга, RUB, MNT",
  openGraph: {
    title: "Oyuns Finance - Олон улсын мөнгөн гуйвуулгын үйлчилгээ",
    description: "Найдвартай санхүүгийн түнш",
    url: "https://oyuns.mn",
    siteName: "Oyuns Finance",
    locale: "mn_MN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
