/* The global Google Fonts stylesheet is intentionally loaded in the root layout.
   Using next/font/google made CI builds depend on external font downloads. */
/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata, Viewport } from "next";
import "./globals.css";

function getPublicSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configuredUrl) return undefined;

  try {
    const url = new URL(configuredUrl);
    return url.protocol === "https:" ? url : undefined;
  } catch {
    return undefined;
  }
}

const publicSiteUrl = getPublicSiteUrl();
const approvedForIndexing = process.env.PUBLIC_CONTENT_APPROVED === "true" && Boolean(publicSiteUrl);

export const metadata: Metadata = {
  title: {
    default: "Masjid Amanah | مسجد الأمانة",
    template: "%s | Masjid Amanah",
  },
  description:
    "The official digital home of Masjid Amanah. Find mosque updates, prayer information, community programs, and ways to get in touch.",
  applicationName: "Masjid Amanah",
  metadataBase: publicSiteUrl,
  openGraph: {
    title: "Masjid Amanah | مسجد الأمانة",
    description: "A place of worship, knowledge, unity, and community.",
    type: "website",
    siteName: "Masjid Amanah",
    url: publicSiteUrl?.origin,
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&amp;family=DM+Sans:wght@400;500;600;700&amp;family=Noto+Naskh+Arabic:wght@400;500;600;700&amp;display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
