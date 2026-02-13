import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { getDictionary } from "@/lib/dictionary";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
});

// Helper for dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = rawLang as "mn" | "ru";
  return {
    title: "OYUNS FINANCE",
    description: lang === "ru" 
      ? "OYUNS FINANCE - Услуги международных денежных переводов с 2018 года. Надежно, быстро и безопасно."
      : "OYUNS FINANCE - 2018 оноос эхлэн олон улсын мөнгөн гуйвуулга, санхүүгийн үйлчилгээ үзүүлж байна. Найдвартай, хурдан, аюулгүй.",
    keywords: "oyuns, finance, money transfer, валют солих, мөнгөн гуйвуулга, RUB, MNT",
    openGraph: {
      title: "OYUNS FINANCE",
      description: lang === "ru" ? "Надежный финансовый партнер" : "Найдвартай санхүүгийн түнш",
      url: "https://oyuns.mn",
      siteName: "OYUNS FINANCE",
      locale: lang === "ru" ? "ru_RU" : "mn_MN",
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
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang as "mn" | "ru";
  const dict = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body className={`${montserrat.variable} font-sans antialiased`} suppressHydrationWarning={true}>
        <Navbar lang={lang} dict={dict.nav} />
        <main>{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
