"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Zap } from "lucide-react";
import { NavBrand } from "@/components/NavBrand";
import { LanguageSelector } from "@/components/language-selector";
import { useI18n } from "@/components/providers/i18n-provider";

export function ConditionalNavbar() {
  const pathname = usePathname();
  const { t } = useI18n();
  
  // Afficher uniquement sur la page d'accueil
  const isHomePage = pathname === '/';
  
  if (!isHomePage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand left */}
        <Link href="/" className="flex items-center">
          <NavBrand />
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <Link href="#features" className="hover:text-gray-900" key={t('home.nav.features')}>{t('home.nav.features')}</Link>
          <Link href="#pricing" className="hover:text-gray-900" key={t('home.nav.pricing')}>{t('home.nav.pricing')}</Link>
        </nav>

        {/* Auth CTA (separated) */}
        <div className="flex items-center gap-3">
          <LanguageSelector variant="light" />
          <Link href="/login" className="hidden sm:inline-flex text-sm text-gray-700 hover:text-gray-900" key={t('home.nav.login')}>
            {t('home.nav.login')}
          </Link>
          <Link href="/signup" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800" key={t('home.nav.signup')}>
            <Zap className="w-4 h-4" />
            {t('home.nav.signup')}
          </Link>
        </div>
      </div>
    </header>
  );
}
