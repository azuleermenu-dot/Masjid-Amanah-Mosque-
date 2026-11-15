import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const approvedForIndexing = process.env.PUBLIC_CONTENT_APPROVED === "true" && Boolean(publicSiteUrl);

export const metadata: Metadata = {
  title: {
    default: "Masjid Amanah | مسجد الأمانة",
    template: "%s | Masjid Amanah",
  },
  description:
    "The official digital home of Masjid Amanah. Find mosque updates, prayer information, community programs, and ways to get in touch.",
  applicationName: "Masjid Amanah",
  metadataBase: publicSiteUrl ? new URL(publicSiteUrl) : undefined,
  openGraph: {
    title: "Masjid Amanah | مسجد الأمانة",
    description: "A place of worship, knowledge, unity, and community.",
    type: "website",
    siteName: "Masjid Amanah",
  },
  robots: { index: approvedForIndexing, follow: approvedForIndexing },
};

export const viewport: Viewport = {
  themeColor: "#123d32",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${cormorant.variable} ${arabic.variable}`}>
        {children}
      </body>
    </html>
  );
}
