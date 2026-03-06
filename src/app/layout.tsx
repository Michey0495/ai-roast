import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import { Nav } from "@/components/Nav";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import CrossPromo from "@/components/CrossPromo";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-roast.ezoai.jp";

export const metadata: Metadata = {
  title: {
    default: "AIロースト - AIがあなたを愛のある毒舌でツッコむ",
    template: "%s | AIロースト",
  },
  description:
    "プロフィールを入力するだけ。AIが愛のある毒舌ツッコミでロースト。結果をシェアしよう。",
  keywords: [
    "AIロースト",
    "AI",
    "毒舌",
    "ツッコミ",
    "ロースト",
    "プロフィール診断",
    "AI roast",
    "エンタメ",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "AIロースト",
    url: siteUrl,
    title: "AIロースト - AIがあなたを愛のある毒舌でツッコむ",
    description:
      "プロフィールを入力するだけ。AIが愛のある毒舌ツッコミでロースト。",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIロースト - AIがあなたを愛のある毒舌でツッコむ",
    description:
      "プロフィールを入力するだけ。AIが愛のある毒舌ツッコミでロースト。",
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
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AIロースト",
  url: siteUrl,
  description:
    "プロフィールを入力するとAIが愛のある毒舌ツッコミ（ロースト）を生成するWebアプリ。",
  applicationCategory: "EntertainmentApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
  inLanguage: "ja",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="ja" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${geist.className} antialiased min-h-screen bg-black text-white`}
      >
        <a
          href="https://ezoai.jp"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10 border-b border-white/5 py-1.5 text-center text-xs text-white/50 hover:text-white/70 transition-colors"
        >
          ezoai.jp -- 7つのAIサービスを無料で体験
        </a>
        <Nav />
        <main>{children}</main>
        <CrossPromo current="AIロースト" />
        <footer className="border-t border-white/5 py-8 text-center text-sm text-white/30">
          <p>© 2026 AIロースト</p>
        </footer>
        <FeedbackWidget repoName="ai-roast" />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
