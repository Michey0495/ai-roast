import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import Script from "next/script";

const geist = Geist({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://roast.ezoai.jp";

export const metadata: Metadata = {
  title: {
    default: "AIロースト🔥 - AIがあなたを愛のある毒舌でツッコむ",
    template: "%s | AIロースト🔥",
  },
  description:
    "プロフィールを入力するだけ！AIが愛のある毒舌ツッコミでロースト。結果をスクショしてSNSで拡散しよう🔥",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "AIロースト🔥",
    url: siteUrl,
    title: "AIロースト🔥 - AIがあなたを愛のある毒舌でツッコむ",
    description:
      "プロフィールを入力するだけ！AIが愛のある毒舌ツッコミでロースト。結果をスクショしてSNSで拡散しよう🔥",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIロースト🔥 - AIがあなたを愛のある毒舌でツッコむ",
    description:
      "プロフィールを入力するだけ！AIが愛のある毒舌ツッコミでロースト。",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="ja">
      <body className={geist.className}>
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
        {children}
        <FeedbackWidget repoName="02dev" />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
