import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/context/user-context";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Propex Properties | Luxury Real Estate & Homes",
    template: "%s | Propex Properties"
  },
  description: "Discover your dream home with Propex Properties. We offer a curated selection of premium real estate, luxury villas, and modern apartments across top locations.",
  keywords: ["Real Estate", "Luxury Homes", "Buy Property", "Rent Apartments", "Propex Properties"],
  authors: [{ name: "Propex Properties" }],
  creator: "Propex Properties",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://propexproperties.com",
    title: "Propex Properties | Premium Real Estate",
    description: "Discover your dream home with our curated selection of luxury properties.",
    siteName: "Propex Properties",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Propex Properties Premium Real Estate",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Propex Properties | Luxury Real Estate",
    description: "Discover your dream home with our curated selection of luxury properties.",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=630&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
