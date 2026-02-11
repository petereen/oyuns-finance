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
