import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "sonner";
import { ConditionalNavbar } from "@/components/ConditionalNavbar";
import { SessionProvider } from "@/components/providers/session-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { AffiliateTracker } from "@/components/affiliate-tracker";
import { Analytics } from "@vercel/analytics/next";
import { FirstPromoterDebug } from "@/components/firstpromoter-debug";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Athlink - Le Profil Digital des Athlètes",
  description: "Partage tes performances, trouve des sponsors, développe ta communauté. Le link-in-bio conçu pour les sportifs.",
  keywords: ["athlète", "running", "cyclisme", "triathlon", "link-in-bio", "sponsor", "performance"],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased overflow-x-hidden`}>
        {/* 🎯 FIRSTPROMOTER - Tracking d'affiliation */}
        {/* Script d'initialisation - chargé en premier */}
        <Script
          id="firstpromoter-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w){w.fpr=w.fpr||function(){w.fpr.q=w.fpr.q||[];w.fpr.q[arguments[0]=='set'?'unshift':'push'](arguments);};})(window);fpr("init", {cid:"sb7ej7w0"}); fpr("click");`
          }}
        />
        {/* SDK FirstPromoter - chargé après l'initialisation */}
        <Script
          src="https://cdn.firstpromoter.com/fpr.js"
          strategy="afterInteractive"
          async
        />
        
        <SessionProvider>
          <I18nProvider>
            <AffiliateTracker />
            {process.env.NODE_ENV === 'development' && <FirstPromoterDebug />}
            <ConditionalNavbar />
            {children}
            <Toaster position="top-center" richColors />
          </I18nProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
