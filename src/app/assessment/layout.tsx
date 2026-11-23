import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import '../globals.css';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Ажлын байрны даалгавар | OYUNS ALL-IN-ONE',
  description: 'OYUNS ALL-IN-ONE — ажил горилогчийн даалгавар',
  robots: { index: false, follow: false, nocache: true },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#2455D8',
};

// Separate root layout: the careers subdomain has no marketing navbar/footer.
export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body className={`${montserrat.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
