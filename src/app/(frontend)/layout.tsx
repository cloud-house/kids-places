import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Keeping Geist as it is modern and nice
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getPayloadClient } from "@/lib/payload-client";
import { headers } from "next/headers";
import { FavoritesProvider } from "@/features/favorites/providers/FavoritesProvider";
import { Toaster } from "@/components/ui/sonner";
import { BRAND_CONFIG } from "@/lib/config";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import CookieBanner from "@/components/privacy/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND_CONFIG.url),
  title: {
    default: `${BRAND_CONFIG.name} - ${BRAND_CONFIG.tagline}`,
    template: `%s | ${BRAND_CONFIG.name}`
  },
  description: BRAND_CONFIG.description,
  keywords: ['dzieci', 'miejsca dla dzieci', 'wydarzenia dla dzieci', 'zajęcia dla dzieci', 'Polska', 'atrakcje dla dzieci'],
  authors: [{ name: BRAND_CONFIG.name }],
  creator: BRAND_CONFIG.name,
  publisher: BRAND_CONFIG.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: BRAND_CONFIG.url,
    siteName: BRAND_CONFIG.name,
    title: BRAND_CONFIG.name,
    description: BRAND_CONFIG.description,
    images: [
      {
        url: '/og-image.png', // Fallback OG image
        width: 1200,
        height: 630,
        alt: BRAND_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: BRAND_CONFIG.name,
    description: BRAND_CONFIG.description,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await headers() });

  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <FavoritesProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar user={user} />
            <main className="flex-grow pt-20 flex flex-col">
              {children}
            </main>
            <Footer />
          </div>
        </FavoritesProvider>
        <Toaster position="bottom-right" />
        <CookieBanner />
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        )}
      </body>
    </html >
  );
}
