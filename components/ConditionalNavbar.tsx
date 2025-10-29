"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Zap } from "lucide-react";
import { NavBrand } from "@/components/NavBrand";

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Afficher uniquement sur la page d'accueil
  const isHomePage = pathname === '/';
  
  if (!isHomePage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand left */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-gray-900" />
          <NavBrand />
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <Link href="#features" className="hover:text-gray-900">Caractéristiques</Link>
          <Link href="#pricing" className="hover:text-gray-900">Tarifs</Link>
        </nav>

        {/* Auth CTA (separated) */}
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:inline-flex text-sm text-gray-700 hover:text-gray-900">
            Se connecter
          </Link>
          <Link href="/signup" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800">
            <Zap className="w-4 h-4" />
            S'inscrire
          </Link>
        </div>
      </div>
    </header>
  );
}
