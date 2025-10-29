"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type HeroShowcaseProps = {
  images: string[];
  intervalMs?: number;
};

export default function HeroShowcase({ images, intervalMs = 3500 }: HeroShowcaseProps) {
  const safeImages = useMemo(() => (images && images.length > 0 ? images : [
    "/next.svg",
    "/vercel.svg",
  ]), [images]);

  const [index, setIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % safeImages.length);
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [safeImages.length, intervalMs]);

  return (
    <motion.div
      className="relative w-full aspect-[16/10]"
      animate={{ y: [0, -6, 0], rotate: [0, 0.3, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Outer rounded frame */}
      <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300 shadow-2xl overflow-hidden" />

      {/* Inner inset frame to mimic device/card */}
      <div className="absolute inset-0 rounded-[28px] bg-white/70 backdrop-blur-md border border-gray-200 overflow-hidden" />

      {/* Image area */}
      <div className="absolute inset-0 rounded-[22px] overflow-hidden bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0.2, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full relative"
          >
            <Image
              src={safeImages[index]}
              alt="aperçu Athlink"
              fill
              sizes="(min-width: 1024px) 560px, 50vw"
              className="object-contain"
              priority
              unoptimized
              onError={(e) => {
                console.error('Erreur chargement image:', safeImages[index]);
                // Fallback vers une image par défaut
                const target = e.target as HTMLImageElement;
                target.src = '/next.svg';
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle gloss/edge */}
      <div className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-black/5" />
    </motion.div>
  );
}


