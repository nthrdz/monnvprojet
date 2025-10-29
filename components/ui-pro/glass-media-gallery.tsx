"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { X, Play, Maximize2 } from "lucide-react"

interface Media {
  id: string
  type: string
  url: string
  title: string | null
  thumbnail: string | null
}

interface GlassMediaGalleryProps {
  media: Media[]
}

export function GlassMediaGallery({ media }: GlassMediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {media.map((item, index) => (
          <MediaCard
            key={item.id}
            media={item}
            index={index}
            onClick={() => setSelectedMedia(item)}
          />
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedMedia && (
          <MediaLightbox
            media={selectedMedia}
            onClose={() => setSelectedMedia(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function MediaCard({ media, index, onClick }: { media: Media; index: number; onClick: () => void }) {
  const isVideo = media.type === 'VIDEO' || media.type === 'YOUTUBE'
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative w-full h-full">
        <Image
          src={media.type === 'YOUTUBE' ? media.thumbnail! : media.url}
          alt={media.title || 'Media'}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </div>

      {/* Glass overlay */}
      <div className="absolute inset-0 backdrop-blur-0 group-hover:backdrop-blur-sm bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-all duration-300" />

      {/* Video indicator */}
      {isVideo && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0.8 }}
        >
          <motion.div
            className="backdrop-blur-xl bg-white/90 border border-white/60 w-12 h-12 rounded-xl flex items-center justify-center shadow-2xl"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Play className="w-6 h-6 text-yellow-600 ml-0.5" fill="currentColor" />
          </motion.div>
        </motion.div>
      )}

      {/* Expand icon for images */}
      {!isVideo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          className="absolute top-3 right-3"
        >
          <div className="backdrop-blur-xl bg-white/90 border border-white/60 p-2 rounded-xl shadow-lg">
            <Maximize2 className="w-4 h-4 text-gray-700" />
          </div>
        </motion.div>
      )}

      {/* Title overlay */}
      {media.title && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
          className="absolute bottom-0 left-0 right-0 p-4"
        >
          <p className="text-white font-semibold text-sm line-clamp-2 drop-shadow-lg">
            {media.title}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

function MediaLightbox({ media, onClose }: { media: Media; onClose: () => void }) {
  const isVideo = media.type === 'VIDEO' || media.type === 'YOUTUBE'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-2xl bg-black/80 p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        onClick={onClose}
        className="absolute top-4 right-4 z-10 backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/40 p-3 rounded-2xl transition-colors"
      >
        <X className="w-5 h-5 text-white" />
      </motion.button>

      {/* Media content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative max-w-6xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl border border-white/20">
            {media.type === 'YOUTUBE' ? (
              <iframe
                src={media.url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={media.url} controls className="w-full h-full" />
            )}
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={media.url}
              alt={media.title || 'Media'}
              width={1920}
              height={1080}
              className="max-h-[90vh] w-auto h-auto object-contain rounded-3xl shadow-2xl"
            />
          </div>
        )}

        {/* Title */}
        {media.title && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-center backdrop-blur-xl bg-white/20 border border-white/40 rounded-2xl px-6 py-4"
          >
            <p className="text-white text-lg font-semibold">{media.title}</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

